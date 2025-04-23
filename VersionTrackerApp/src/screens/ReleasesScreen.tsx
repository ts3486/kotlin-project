import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';

interface Release {
  id: string;
  version: string;
  releaseDate: string;
  documentationChanges: string[];
  url: string;
}

export default function ReleasesScreen() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const response = await axios.get('http://localhost:8080/libraries/releases');
      setReleases(response.data);
    } catch (error) {
      console.error('Error fetching releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRelease = ({ item }: { item: Release }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Version {item.version}</Title>
        <Paragraph>Released: {new Date(item.releaseDate).toLocaleDateString()}</Paragraph>
        {item.documentationChanges.length > 0 && (
          <View style={styles.changesContainer}>
            <Paragraph style={styles.changesTitle}>Documentation Changes:</Paragraph>
            {item.documentationChanges.map((change, index) => (
              <Paragraph key={index} style={styles.changeItem}>
                • {change}
              </Paragraph>
            ))}
          </View>
        )}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => {}}>View Release Notes</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={releases}
        renderItem={renderRelease}
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
  changesContainer: {
    marginTop: 10,
  },
  changesTitle: {
    fontWeight: 'bold',
  },
  changeItem: {
    marginLeft: 10,
  },
}); 