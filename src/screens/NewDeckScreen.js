import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { getDb } from '../database/db';

const colors = ['#4A90D9', '#4CAF50', '#F5C518', '#FF9800', '#E53935', '#9C27B0', '#757575'];

export default function NewDeckScreen({ navigation }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const db = getDb();
    const rows = db.getAllSync(`
      SELECT topics.id, topics.name, subjects.name as subject_name
      FROM topics JOIN subjects ON topics.subject_id = subjects.id
      ORDER BY subjects.name ASC, topics.name ASC
    `);
    setTopics(rows);
    if (rows.length > 0) setSelectedTopic(rows[0].id);
  }, []);

  function handleSave() {
    if (!name.trim() || !selectedTopic) return;
    const db = getDb();
    db.runSync(
      'INSERT INTO decks (topic_id, name, color) VALUES (?, ?, ?)',
      [selectedTopic, name.trim(), color]
    );
    navigation.goBack();
  }

  if (topics.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          Create a Topic first before adding a Deck.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Topic</Text>
      <View style={styles.chipRow}>
        {topics.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.chip, selectedTopic === t.id && styles.chipSelected]}
            onPress={() => setSelectedTopic(t.id)}
          >
            <Text style={styles.chipText}>{t.subject_name} · {t.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Deck Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Definitions"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

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
        <Text style={styles.saveButtonText}>Save Deck</Text>
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
    alignItems: 'center', marginTop: 32,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 40 },
});
