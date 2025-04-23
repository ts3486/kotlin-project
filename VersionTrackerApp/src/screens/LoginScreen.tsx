import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await signIn(username, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Version Tracker</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
}); 