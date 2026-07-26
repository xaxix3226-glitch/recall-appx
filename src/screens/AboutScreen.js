import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recall</Text>
      <Text style={styles.version}>Version 1.0.0</Text>
      <Text style={styles.text}>
        A 100% offline flashcard app. No accounts, no ads, no tracking.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  version: { color: '#888', fontSize: 14, marginBottom: 16 },
  text: { color: '#888', fontSize: 14, textAlign: 'center' },
});
