import axios from 'axios';
import { LibraryUpdate } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { getTrackedLibraries, updateLibraryVersion } from './storageService';
import { Platform } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';
const GITHUB_API_URL = 'https://api.github.com';
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export const initializeBackgroundCheck = async () => {
  if (Platform.OS === 'ios') {
    await BackgroundFetch.configure({
      minimumFetchInterval: 15, // minutes
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
    }, async (taskId: string) => {
      await checkForUpdates();
      BackgroundFetch.finish(taskId);
    });
  } else {
    // For Android, we'll use a different background task mechanism
    setInterval(checkForUpdates, CHECK_INTERVAL);
  }
};

export const checkForUpdates = async () => {
  const libraries = await getTrackedLibraries();
  for (const library of libraries) {
    try {
      const response = await axios.get(`${NPM_REGISTRY_URL}/${library.name}`);
      const packageData = response.data;
      const latestVersion = packageData['dist-tags'].latest;
      
      if (latestVersion !== library.currentVersion) {
        // New version available
        await updateLibraryVersion(library.name, latestVersion);
        
        // Send notification
        PushNotification.localNotification({
          title: 'New Version Available',
          message: `${library.name} has a new version: ${latestVersion}`,
          channelId: 'updates',
        });
      }
    } catch (error) {
      console.error(`Error checking updates for ${library.name}:`, error);
    }
  }
};

export const fetchLibraryUpdates = async (libraries: string[]): Promise<LibraryUpdate[]> => {
  try {
    const updates: LibraryUpdate[] = [];
    const trackedLibraries = await getTrackedLibraries();

    for (const packageName of libraries) {
      try {
        const response = await axios.get(`${NPM_REGISTRY_URL}/${packageName}`);
        const packageData = response.data;
        
        const latestVersion = packageData['dist-tags'].latest;
        const trackedLibrary = trackedLibraries.find(lib => lib.name === packageName);
        const currentVersion = trackedLibrary?.currentVersion || latestVersion;

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
        continue;
      }
    }

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