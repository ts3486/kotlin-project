export interface LibraryUpdate {
  id: string;
  libraryName: string;
  currentVersion: string;
  newVersion: string;
  repositoryUrl: string;
  releaseDate: string;
  description: string;
  isBreakingChange: boolean;
}

export interface UpdateCardProps {
  update: LibraryUpdate;
} 