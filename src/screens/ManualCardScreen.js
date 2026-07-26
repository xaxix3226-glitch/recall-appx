import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { getDb } from '../database/db';

const colors = ['#4A90D9', '#4CAF50', '#F5C518', '#FF9800', '#E53935', '#9C27B0', '#757575'];
const difficulties = ['Easy', 'Medium', 'Hard'];

export default function ManualCardScreen({ navigation }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [hint, setHint] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [difficulty, setDifficulty] = useState('Medium');
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  useEffect(() => {
    const db = getDb();
    const rows = db.getAllSync(`
      SELECT decks.id, decks.name, topics.name as topic_name
      FROM decks JOIN topics ON decks.topic_id = topics.id
      ORDER BY decks.name ASC
    `);
    setDecks(rows);
    if (rows.length > 0) setSelectedDeck(rows[0].id);
  }, []);

  function handleSave() {
    if (!question.trim() || !answer.trim() || !selectedDeck) return;
    const db = getDb();
    db.runSync(
      `INSERT INTO flashcards (deck_id, question, answer, hint, color, difficulty)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [selectedDeck, question.trim(), answer.trim(), hint.trim(), color, difficulty]
    );
    navigation.goBack();
  }

  if (decks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Create a Deck first before adding a card.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Deck</Text>
      <View style={styles.chipRow}>
        {decks.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.chip, selectedDeck === d.id && styles.chipSelected]}
            onPress={() => setSelectedDeck(d.id)}
          >
            <Text style={styles.chipText}>{d.topic_name} · {d.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Question</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="What is the powerhouse of the cell?"
        placeholderTextColor="#888"
        value={question}
        onChangeText={setQuestion}
        multiline
      />

      <Text style={styles.label}>Answer</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Mitochondrion"
        placeholderTextColor="#888"
        value={answer}
        onChangeText={setAnswer}
        multiline
      />

      <Text style={styles.label}>Hint (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="It produces ATP"
        placeholderTextColor="#888"
        value={hint}
        onChangeText={setHint}
      />

      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.chipRow}>
        {difficulties.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, difficulty === d && styles.chipSelected]}
            onPress={() => setDifficulty(d)}
          >
            <Text style={styles.chipText}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Color</Text>
      <View style={styles.colorRow}>
        {colors.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorCircle,
              { backgroundColor: c },
              color === c && styles.colorSelected,
            ]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Flashcard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  label: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 14,
    color: '#fff', fontSize: 15,
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#1e1e1e', borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  chipSelected: { backgroundColor: '#4A90D9' },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },
  colorSelected: { borderWidth: 3, borderColor: '#fff' },
  saveButton: {
    backgroundColor: '#4A90D9', borderRadius: 16, padding: 18,
    alignItems: 'center', marginTop: 32, marginBottom: 40,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 40 },
});
