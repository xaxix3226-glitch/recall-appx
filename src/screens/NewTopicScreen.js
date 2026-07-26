import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { getDb } from '../database/db';

export default function NewTopicScreen({ navigation }) {
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const db = getDb();
    const rows = db.getAllSync('SELECT id, name, color FROM subjects ORDER BY name ASC');
    setSubjects(rows);
    if (rows.length > 0) setSelectedSubject(rows[0].id);
  }, []);

  function handleSave() {
    if (!name.trim() || !selectedSubject) return;
    const db = getDb();
    db.runSync(
      'INSERT INTO topics (subject_id, name) VALUES (?, ?)',
      [selectedSubject, name.trim()]
    );
    navigation.goBack();
  }

  if (subjects.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          Create a Subject first before adding a Topic.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Subject</Text>
      <View style={styles.chipRow}>
        {subjects.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.chip,
              selectedSubject === s.id && { backgroundColor: s.color },
            ]}
            onPress={() => setSelectedSubject(s.id)}
          >
            <Text style={styles.chipText}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Topic Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Electrostatics"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Topic</Text>
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
  chipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  saveButton: {
    backgroundColor: '#4A90D9', borderRadius: 16, padding: 18,
    alignItems: 'center', marginTop: 32,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 40 },
});
