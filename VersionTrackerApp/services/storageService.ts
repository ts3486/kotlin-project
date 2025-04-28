import AsyncStorage from '@react-native-async-storage/async-storage';

interface TrackedLibrary {
  name: string;
  currentVersion: string;
  lastChecked: string;
}

const STORAGE_KEY = '@VersionTracker:trackedLibraries';

export const saveTrackedLibraries = async (libraries: TrackedLibrary[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(libraries));
  } catch (error) {
    console.error('Error saving tracked libraries:', error);
  }
};

export const getTrackedLibraries = async (): Promise<TrackedLibrary[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting tracked libraries:', error);
    return [];
  }
};

export const addTrackedLibrary = async (library: TrackedLibrary): Promise<void> => {
  try {
    const libraries = await getTrackedLibraries();
    libraries.push(library);
    await saveTrackedLibraries(libraries);
  } catch (error) {
    console.error('Error adding tracked library:', error);
  }
};

export const updateLibraryVersion = async (libraryName: string, newVersion: string): Promise<void> => {
  try {
    const libraries = await getTrackedLibraries();
    const library = libraries.find(lib => lib.name === libraryName);
    if (library) {
      library.currentVersion = newVersion;
      library.lastChecked = new Date().toISOString();
      await saveTrackedLibraries(libraries);
    }
  } catch (error) {
    console.error('Error updating library version:', error);
  }
}; 