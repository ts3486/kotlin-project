export type Library = {
  id: string;
  name: string;
  currentVersion: string;
  lastUpdated: string;
};

export type LibraryUpdate = {
  id: string;
  libraryName: string;
  currentVersion: string;
  newVersion: string;
  repositoryUrl: string;
  releaseDate: string;
  description: string;
  isBreakingChange: boolean;
}; 