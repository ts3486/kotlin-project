import React from 'react';

interface AuthContextType {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  signIn: async () => {},
  signOut: () => {},
}); 