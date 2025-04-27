import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';

interface AddLibraryScreenProps {
  onAddLibrary: (url: string) => void;
}

export const AddLibraryScreen: React.FC<AddLibraryScreenProps> = ({ onAddLibrary }) => {
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    // Basic URL validation
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Try to extract package name from various URL formats
    let packageName = '';
    if (url.includes('github.com')) {
      // GitHub URL format: https://github.com/owner/repo
      const parts = url.split('/');
      if (parts.length >= 5) {
        packageName = parts[4];
      }
    } else if (url.includes('npmjs.com')) {
      // npm URL format: https://www.npmjs.com/package/package-name
      const parts = url.split('/');
      if (parts.length >= 5) {
        packageName = parts[4];
      }
    } else {
      // Assume it's a package name
      packageName = url.trim();
    }

    if (!packageName) {
      setError('Could not determine package name from URL');
      return;
    }

    onAddLibrary(packageName);
    setUrl('');
    setError('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        Add Library to Track
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
        Enter a GitHub repository URL, npm package URL, or package name
      </Text>
      
      <TextInput
        label="Repository URL or Package Name"
        value={url}
        onChangeText={setUrl}
        style={styles.input}
        mode="outlined"
        error={!!error}
      />
      
      {error ? (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}

      <Button
        mode="contained"
        onPress={handleAdd}
        style={styles.button}
      >
        Add Library
      </Button>

      <Text style={[styles.example, { color: theme.colors.onSurfaceVariant }]}>
        Examples:{'\n'}
        • github.com/facebook/react-native{'\n'}
        • npmjs.com/package/react-native{'\n'}
        • react-native
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  error: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 24,
  },
  example: {
    fontSize: 14,
    opacity: 0.7,
  },
}); 