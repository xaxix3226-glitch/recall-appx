import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDb } from '../database/db';

export default function DecksScreen({ route, navigation }) {
  const { topicId, topicName } = route.params;
  const [decks, setDecks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadDecks();
    }, [])
  );

  function loadDecks() {
    const db = getDb();
    const rows = db.getAllSync(
      `
      SELECT decks.id, decks.name, decks.color, decks.is_favorite,
        (SELECT COUNT(*) FROM flashcards WHERE flashcards.deck_id = decks.id) as card_count
      FROM decks
      WHERE decks.topic_id = ?
      ORDER BY decks.name ASC
      `,
      [topicId]
    );
    setDecks(rows);
  }

  return (
    <View style={styles.container}>
      {decks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Decks Yet</Text>
          <Text style={styles.emptyText}>
            Add a deck inside {topicName} to start adding flashcards.
          </Text>
        </View>
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.deckCard, { borderLeftColor: item.color || '#4A90D9' }]}
              onPress={() =>
                navigation.navigate('Cards', {
                  deckId: item.id,
                  deckName: item.name,
                })
              }
            >
              <View style={styles.deckRow}>
                <Text style={styles.deckName}>{item.name}</Text>
                {item.is_favorite === 1 && <Text style={styles.star}>★</Text>}
              </View>
              <Text style={styles.deckMeta}>{item.card_count} Cards</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  deckCard: {
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 16,
    marginBottom: 12, borderLeftWidth: 4,
  },
  deckRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deckName: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  star: { color: '#F5C518', fontSize: 16 },
  deckMeta: { color: '#888', fontSize: 13, marginTop: 6 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptyText: {
    color: '#888', fontSize: 14, textAlign: 'center', paddingHorizontal: 20,
  },
});
