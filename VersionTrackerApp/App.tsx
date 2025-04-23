import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LibrariesScreen from './src/screens/LibrariesScreen';
import ReleasesScreen from './src/screens/ReleasesScreen';
import LoginScreen from './src/screens/LoginScreen';
import { AuthContext } from './src/context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const authContext = React.useMemo(
    () => ({
      signIn: async (username: string, password: string) => {
        try {
          // TODO: Implement actual login
          setIsAuthenticated(true);
        } catch (error) {
          console.error(error);
        }
      },
      signOut: () => {
        setIsAuthenticated(false);
      },
    }),
    []
  );

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            {!isAuthenticated ? (
              <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
              </Stack.Navigator>
            ) : (
              <Tab.Navigator>
                <Tab.Screen name="Libraries" component={LibrariesScreen} />
                <Tab.Screen name="Releases" component={ReleasesScreen} />
              </Tab.Navigator>
            )}
          </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 