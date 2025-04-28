import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { AddLibraryScreenProps } from '../types/navigation';

const AddLibraryScreen: React.FC<AddLibraryScreenProps> = ({ navigation }) => {
  const [libraryName, setLibraryName] = useState('');
  const [currentVersion, setCurrentVersion] = useState('');

  const handleAddLibrary = () => {
    // TODO: Implement library addition logic
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Add Library</Text>
      <TextInput
        label="Library Name"
        value={libraryName}
        onChangeText={setLibraryName}
        style={styles.input}
      />
      <TextInput
        label="Current Version"
        value={currentVersion}
        onChangeText={setCurrentVersion}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleAddLibrary}
        style={styles.button}
      >
        Add Library
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginTop: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default AddLibraryScreen; 