import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AccessibilityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accessibility</Text>
      <Text style={styles.text}>
        Large text, high contrast, and reduced animation options will appear here. Coming soon.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  text: { color: '#888', fontSize: 14, textAlign: 'center' },
});
