import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, IconButton } from 'react-native-paper';
import { UpdateCardProps } from '../types';

export const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={[styles.libraryName, { color: theme.colors.onSurface }]}>
              {update.libraryName}
            </Text>
            {update.isBreakingChange && (
              <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                <Text style={styles.badgeText}>Breaking Change</Text>
              </View>
            )}
          </View>
          <Text variant="bodySmall" style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
            {update.releaseDate}
          </Text>
        </View>

        <View style={styles.versionContainer}>
          <Text variant="bodyMedium" style={[styles.versionText, { color: theme.colors.primary }]}>
            {update.currentVersion} → {update.newVersion}
          </Text>
        </View>

        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurface }]}>
          {update.description}
        </Text>

        <View style={styles.footer}>
          <IconButton
            icon="github"
            size={20}
            iconColor={theme.colors.primary}
            onPress={() => {}}
          />
          <Text variant="bodySmall" style={[styles.repoUrl, { color: theme.colors.onSurfaceVariant }]}>
            {update.repositoryUrl}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  libraryName: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
  },
  date: {
    opacity: 0.7,
  },
  versionContainer: {
    marginBottom: 8,
  },
  versionText: {
    fontWeight: '500',
  },
  description: {
    marginBottom: 8,
    opacity: 0.9,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repoUrl: {
    opacity: 0.7,
    marginLeft: 8,
  },
}); 