import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { getDb } from '../database/db';

const colors = ['#4A90D9', '#4CAF50', '#F5C518', '#FF9800', '#E53935', '#9C27B0', '#757575'];

export default function NewSubjectScreen({ navigation }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(colors[0]);

  function handleSave() {
    if (!name.trim()) return;
    const db = getDb();
    db.runSync('INSERT INTO subjects (name, color) VALUES (?, ?)', [name.trim(), color]);
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Subject Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Mathematics"
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
        <Text style={styles.saveButtonText}>Save Subject</Text>
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
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },
  colorSelected: { borderWidth: 3, borderColor: '#fff' },
  saveButton: {
    backgroundColor: '#4A90D9', borderRadius: 16, padding: 18,
    alignItems: 'center', marginTop: 32,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
