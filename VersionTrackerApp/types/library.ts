export interface Library {
  id?: string; // Firebase document ID
  name: string;
  currentVersion: string;
  lastChecked: string;
  createdAt?: string;
  updatedAt?: string;
} 