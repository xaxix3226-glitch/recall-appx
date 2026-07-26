import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch,
} from 'react-native';
import { getDb } from '../database/db';

const limits = [10, 25, 50, 100];

export default function StudyBuilderScreen({ navigation }) {
  const [decks, setDecks] = useState([]);
  const [selectedDecks, setSelectedDecks] = useState([]);
  const [shuffle, setShuffle] = useState(true);
  const [limit, setLimit] = useState(25);

  useEffect(() => {
    const db = getDb();
    const rows = db.getAllSync(`
      SELECT decks.id, decks.name, topics.name as topic_name,
        (SELECT COUNT(*) FROM flashcards WHERE flashcards.deck_id = decks.id) as card_count
      FROM decks JOIN topics ON decks.topic_id = topics.id
      ORDER BY decks.name ASC
    `);
    setDecks(rows.filter((d) => d.card_count > 0));
  }, []);

  function toggleDeck(id) {
    setSelectedDecks((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  function handleStart() {
    if (selectedDecks.length === 0) return;
    navigation.navigate('Study', {
      deckIds: selectedDecks,
      shuffle,
      limit,
    });
  }

  if (decks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          Add some flashcards first before starting a study session.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Decks</Text>
        {decks.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[
              styles.deckRow,
              selectedDecks.includes(d.id) && styles.deckRowSelected,
            ]}
            onPress={() => toggleDeck(d.id)}
          >
            <Text style={styles.deckText}>{d.topic_name} · {d.name}</Text>
            <Text style={styles.deckCount}>{d.card_count} cards</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Card Limit</Text>
        <View style={styles.chipRow}>
          {limits.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.chip, limit === l && styles.chipSelected]}
              onPress={() => setLimit(l)}
            >
              <Text style={styles.chipText}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.shuffleRow}>
          <Text style={styles.label}>Shuffle</Text>
          <Switch value={shuffle} onValueChange={setShuffle} />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Start Studying</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  label: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  deckRow: {
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 14,
    marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between',
  },
  deckRowSelected: { backgroundColor: '#2a4a6b' },
  deckText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  deckCount: { color: '#888', fontSize: 12 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: {
    backgroundColor: '#1e1e1e', borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  chipSelected: { backgroundColor: '#4A90D9' },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  shuffleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 8,
  },
  startButton: {
    backgroundColor: '#4A90D9', borderRadius: 16, padding: 18,
    alignItems: 'center', marginTop: 12, marginBottom: 8,
  },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 40 },
});
