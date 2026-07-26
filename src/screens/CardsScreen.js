import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDb } from '../database/db';

export default function CardsScreen({ route }) {
  const { deckId, deckName } = route.params;
  const [cards, setCards] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [])
  );

  function loadCards() {
    const db = getDb();
    const rows = db.getAllSync(
      `SELECT id, question, color, difficulty, is_priority, mastery
       FROM flashcards WHERE deck_id = ? ORDER BY created_at DESC`,
      [deckId]
    );
    setCards(rows);
  }

  return (
    <View style={styles.container}>
      {cards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Flashcards Yet</Text>
          <Text style={styles.emptyText}>
            Add cards to {deckName} from the Create tab.
          </Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { borderLeftColor: item.color || '#4A90D9' }]}
            >
              <Text style={styles.question} numberOfLines={2}>
                {item.question}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{item.difficulty}</Text>
                <Text style={styles.meta}>Mastery {item.mastery}%</Text>
                {item.is_priority === 1 && <Text style={styles.priority}>★ Priority</Text>}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  card: {
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 16,
    marginBottom: 12, borderLeftWidth: 4,
  },
  question: { color: '#fff', fontSize: 15, fontWeight: '600' },
  metaRow: { flexDirection: 'row', marginTop: 8, gap: 12 },
  meta: { color: '#888', fontSize: 12 },
  priority: { color: '#F5C518', fontSize: 12 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptyText: {
    color: '#888', fontSize: 14, textAlign: 'center', paddingHorizontal: 20,
  },
});
