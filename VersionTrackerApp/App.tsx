import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { configurePushNotifications } from './services/notificationService';
import { initializeBackgroundCheck } from './services/libraryService';

import type { RootStackParamList } from './types/navigation';
import { lightTheme, darkTheme } from './theme';
import HomeScreen from './screens/HomeScreen';
import AddLibraryScreen from './screens/AddLibraryScreen';
import TestScreen from './screens/TestScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Initialize notifications
    configurePushNotifications();
    
    // Initialize background checks
    initializeBackgroundCheck();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: {
                color: theme.colors.onPrimary,
              },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Library Version Tracker' }}
            />
            <Stack.Screen
              name="AddLibrary"
              component={AddLibraryScreen}
              options={{ title: 'Add Library' }}
            />
            <Stack.Screen
              name="Test"
              component={TestScreen}
              options={{ title: 'Test Background Updates' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
