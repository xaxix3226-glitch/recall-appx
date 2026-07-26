import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const options = [
  { label: 'Manual Flashcard', screen: 'ManualCard' },
  { label: 'Import Text', screen: 'ImportText' },
  { label: 'Import PDF', screen: 'ImportPdf' },
  { label: 'Create Subject', screen: 'NewSubject' },
  { label: 'Create Topic', screen: 'NewTopic' },
  { label: 'Create Deck', screen: 'NewDeck' },
];

export default function CreateScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.screen}
          style={styles.button}
          onPress={() => navigation.navigate(opt.screen)}
        >
          <Text style={styles.buttonText}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  button: {
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 20,
    marginBottom: 12, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
