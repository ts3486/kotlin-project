import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { HomeScreenProps } from '../types/navigation';
import { testFirebaseConnection } from '../services/libraryService';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleTestConnection = async () => {
    const isConnected = await testFirebaseConnection();
    alert(isConnected ? 'Firebase connection successful!' : 'Firebase connection failed. Check console for details.');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Version Tracker</Text>
      <Text variant="bodyLarge" style={styles.testMessage}>
        Test Message - Edit this to see hot reloading in action!
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddLibrary')}
        style={styles.button}
      >
        Add Library
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Test')}
        style={styles.button}
      >
        Test
      </Button>
      <Button
        mode="contained"
        onPress={handleTestConnection}
        style={styles.button}
      >
        Test Firebase Connection
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testMessage: {
    marginVertical: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    width: '100%',
  },
});

export default HomeScreen; 