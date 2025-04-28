import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { HomeScreenProps } from '../types/navigation';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Version Tracker</Text>
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
  button: {
    marginTop: 16,
    width: '100%',
  },
});

export default HomeScreen; 