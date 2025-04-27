import axios from 'axios';
import { LibraryUpdate } from '../types';
import * as fs from 'fs';
import * as path from 'path';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';
const GITHUB_API_URL = 'https://api.github.com';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const readPackageJson = (): PackageJson => {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    return JSON.parse(packageJsonContent);
  } catch (error) {
    console.error('Error reading package.json:', error);
    return {};
  }
};

export const fetchLibraryUpdates = async (libraries: string[]): Promise<LibraryUpdate[]> => {
  try {
    const updates: LibraryUpdate[] = [];

    for (const packageName of libraries) {
      try {
        const response = await axios.get(`${NPM_REGISTRY_URL}/${packageName}`);
        const packageData = response.data;
        
        const latestVersion = packageData['dist-tags'].latest;
        
        // For now, we'll assume current version is the latest
        // In a real app, you'd want to store the current version somewhere
        const currentVersion = latestVersion;

        const update: LibraryUpdate = {
          id: packageName,
          libraryName: packageName,
          currentVersion: currentVersion,
          newVersion: latestVersion,
          repositoryUrl: packageData.repository?.url || `https://www.npmjs.com/package/${packageName}`,
          releaseDate: new Date(packageData.time[latestVersion]).toISOString().split('T')[0],
          description: packageData.description || 'No description available',
          isBreakingChange: await checkForBreakingChanges(packageName, currentVersion, latestVersion),
        };

        updates.push(update);
      } catch (error) {
        console.error(`Error fetching update for ${packageName}:`, error);
        // Continue with other packages even if one fails
        continue;
      }
    }

    // Sort updates by breaking changes first, then by release date
    return updates.sort((a, b) => {
      if (a.isBreakingChange !== b.isBreakingChange) {
        return a.isBreakingChange ? -1 : 1;
      }
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });
  } catch (error) {
    console.error('Error fetching library updates:', error);
    throw error;
  }
};

const checkForBreakingChanges = async (
  packageName: string,
  currentVersion: string,
  newVersion: string
): Promise<boolean> => {
  try {
    // Check semantic versioning
    const [currentMajor] = currentVersion.split('.');
    const [newMajor] = newVersion.split('.');
    
    if (parseInt(newMajor) > parseInt(currentMajor)) {
      return true;
    }

    // Try to check GitHub releases
    try {
      const response = await axios.get(`${GITHUB_API_URL}/repos/${packageName}/${packageName}/releases`);
      const releases = response.data;
      
      const latestRelease = releases[0];
      if (latestRelease) {
        // Check for breaking change indicators in the release
        const hasBreakingChange = 
          latestRelease.body?.toLowerCase().includes('breaking change') ||
          latestRelease.body?.toLowerCase().includes('breaking changes') ||
          latestRelease.prerelease;
        
        return hasBreakingChange;
      }
    } catch (error) {
      // If GitHub API fails, fall back to semantic versioning
      console.warn(`Could not check GitHub releases for ${packageName}:`, error);
    }

    return false;
  } catch (error) {
    console.error(`Error checking breaking changes for ${packageName}:`, error);
    return false;
  }
}; 