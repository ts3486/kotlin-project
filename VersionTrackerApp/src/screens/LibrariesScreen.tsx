import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';

interface Library {
  id: string;
  name: string;
  currentVersion: string;
  documentationUrl: string;
}

export default function LibrariesScreen() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      const response = await axios.get('http://localhost:8080/libraries');
      setLibraries(response.data);
    } catch (error) {
      console.error('Error fetching libraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLibrary = ({ item }: { item: Library }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Current Version: {item.currentVersion}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => {}}>View Releases</Button>
        <Button onPress={() => {}}>View Documentation</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={libraries}
        renderItem={renderLibrary}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
}); 