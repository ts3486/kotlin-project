import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3DarkTheme, adaptNavigationTheme, ActivityIndicator, Snackbar, FAB } from 'react-native-paper';
import { ScrollView, StyleSheet, useColorScheme, View, Text } from 'react-native';
import { UpdateCard } from './components/UpdateCard';
import { AddLibraryScreen } from './screens/AddLibraryScreen';
import { LibraryUpdate } from './types';
import { fetchLibraryUpdates } from './services/libraryService';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  const [updates, setUpdates] = useState<LibraryUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [trackedLibraries, setTrackedLibraries] = useState<string[]>([]);

  useEffect(() => {
    if (trackedLibraries.length > 0) {
      loadUpdates();
    } else {
      setLoading(false);
    }
  }, [trackedLibraries]);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const data = await fetchLibraryUpdates(trackedLibraries);
      setUpdates(data);
    } catch (err) {
      setError('Failed to load updates. Please try again later.');
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLibrary = (libraryName: string) => {
    setTrackedLibraries(prev => [...prev, libraryName]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {trackedLibraries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No libraries tracked yet. Add a library to get started!
          </Text>
        </View>
      ) : (
        <ScrollView>
          {updates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </ScrollView>
      )}
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddLibrary')}
      />
      
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: 'Dismiss',
          onPress: () => setVisible(false),
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const { DarkTheme: NavigationDarkTheme } = adaptNavigationTheme({
    reactNavigationDark: DarkTheme,
  });

  const theme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: '#BB86FC',
      secondary: '#03DAC6',
      error: '#CF6679',
      background: '#121212',
      surface: '#1E1E1E',
      card: '#1E1E1E',
      onSurface: '#FFFFFF',
      onSurfaceVariant: '#B3B3B3',
      border: '#2C2C2C',
    },
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={NavigationDarkTheme}>
          <Stack.Navigator>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                title: 'Library Updates',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.onSurface,
              }}
            />
            <Stack.Screen 
              name="AddLibrary" 
              component={AddLibraryScreen}
              options={{
                title: 'Add Library',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.onSurface,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    color: '#B3B3B3',
    textAlign: 'center',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
