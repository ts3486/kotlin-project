import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { TestScreenProps } from '../types/navigation';

const TestScreen: React.FC<TestScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Test Screen</Text>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go Back
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default TestScreen; 