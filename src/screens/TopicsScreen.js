import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDb } from '../database/db';

export default function TopicsScreen({ route, navigation }) {
  const { subjectId, subjectName } = route.params;
  const [topics, setTopics] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadTopics();
    }, [])
  );

  function loadTopics() {
    const db = getDb();
    const rows = db.getAllSync(
      `
      SELECT topics.id, topics.name,
        (SELECT COUNT(*) FROM decks WHERE decks.topic_id = topics.id) as deck_count,
        (SELECT COUNT(*) FROM flashcards
          JOIN decks ON flashcards.deck_id = decks.id
          WHERE decks.topic_id = topics.id) as card_count
      FROM topics
      WHERE topics.subject_id = ?
      ORDER BY topics.name ASC
      `,
      [subjectId]
    );
    setTopics(rows);
  }

  return (
    <View style={styles.container}>
      {topics.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Topics Yet</Text>
          <Text style={styles.emptyText}>
            Add a topic inside {subjectName} to start organizing decks.
          </Text>
        </View>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.topicCard}
              onPress={() =>
                navigation.navigate('Decks', {
                  topicId: item.id,
                  topicName: item.name,
                })
              }
            >
              <Text style={styles.topicName}>{item.name}</Text>
              <Text style={styles.topicMeta}>
                {item.deck_count} Decks · {item.card_count} Cards
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  topicCard: {
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 16, marginBottom: 12,
  },
  topicName: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  topicMeta: { color: '#888', fontSize: 13, marginTop: 6 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptyText: {
    color: '#888', fontSize: 14, textAlign: 'center', paddingHorizontal: 20,
  },
});
