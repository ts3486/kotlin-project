import axios from 'axios';
import { Library, LibraryUpdate } from '../types/index';
import { Platform } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { db } from './firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';
const GITHUB_API_URL = 'https://api.github.com';
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const BACKGROUND_FETCH_TASK = 'background-fetch-task';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

// Define the background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    await checkForUpdates();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const initializeBackgroundCheck = async () => {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 15, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background task registered');
    }
  } catch (error) {
    console.error('Error registering background task:', error);
  }
};

export const testFirebaseConnection = async () => {
  try {
    // Write a test document
    const testDocRef = doc(db, 'test', 'connection-test');
    await setDoc(testDocRef, {
      timestamp: new Date().toISOString(),
      message: 'Testing Firebase connection'
    });

    // Read the test document
    const docSnap = await getDoc(testDocRef);
    
    if (docSnap.exists()) {
      console.log('Firebase connection successful!', docSnap.data());
      return true;
    } else {
      console.log('Firebase connection failed - document not found');
      return false;
    }
  } catch (error) {
    console.error('Firebase connection error:', error);
    return false;
  }
};

export const getTrackedLibraries = async (): Promise<Library[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'libraries'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.id,
      currentVersion: doc.data().currentVersion,
      lastUpdated: doc.data().lastUpdated
    }));
  } catch (error) {
    console.error('Error getting tracked libraries:', error);
    return [];
  }
};

export const updateLibraryVersion = async (libraryName: string, newVersion: string) => {
  try {
    const libraryRef = doc(db, 'libraries', libraryName);
    await updateDoc(libraryRef, {
      currentVersion: newVersion,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating library ${libraryName}:`, error);
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