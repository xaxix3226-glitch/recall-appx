import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDb } from '../database/db';

export default function BrowseScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadSubjects();
    }, [])
  );

  function loadSubjects() {
    const db = getDb();
    const rows = db.getAllSync(`
      SELECT subjects.id, subjects.name, subjects.color,
        (SELECT COUNT(*) FROM topics WHERE topics.subject_id = subjects.id) as topic_count,
        (SELECT COUNT(*) FROM decks
          JOIN topics ON decks.topic_id = topics.id
          WHERE topics.subject_id = subjects.id) as deck_count,
        (SELECT COUNT(*) FROM flashcards
          JOIN decks ON flashcards.deck_id = decks.id
          JOIN topics ON decks.topic_id = topics.id
          WHERE topics.subject_id = subjects.id) as card_count
      FROM subjects
      ORDER BY subjects.name ASC
    `);
    setSubjects(rows);
  }

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search everything..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {filteredSubjects.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Subjects Yet</Text>
          <Text style={styles.emptyText}>
            Create your first subject to start organizing flashcards.
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('Create')}
          >
            <Text style={styles.createButtonText}>Create Subject</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredSubjects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.subjectCard, { borderLeftColor: item.color }]}
              onPress={() =>
                navigation.navigate('Topics', {
                  subjectId: item.id,
                  subjectName: item.name,
                })
              }
            >
              <Text style={styles.subjectName}>{item.name}</Text>
              <Text style={styles.subjectMeta}>
                {item.topic_count} Topics · {item.deck_count} Decks · {item.card_count} Cards
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
  searchBar: {
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 14,
    color: '#fff', fontSize: 15, marginBottom: 16,
  },
  subjectCard: {
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 16,
    marginBottom: 12, borderLeftWidth: 4,
  },
  subjectName: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  subjectMeta: { color: '#888', fontSize: 13, marginTop: 6 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptyText: {
    color: '#888', fontSize: 14, textAlign: 'center',
    marginBottom: 20, paddingHorizontal: 20,
  },
  createButton: {
    backgroundColor: '#4A90D9', borderRadius: 16,
    paddingVertical: 12, paddingHorizontal: 24,
  },
  createButtonText: { color: '#fff', fontWeight: 'bold' },
});
