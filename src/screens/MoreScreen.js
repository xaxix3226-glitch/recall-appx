import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const options = [
  { label: 'Settings', screen: 'Settings' },
  { label: 'Backup & Export', screen: 'Backup' },
  { label: 'Accessibility', screen: 'Accessibility' },
  { label: 'About', screen: 'About' },
];

export default function MoreScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.screen}
          style={styles.row}
          onPress={() => navigation.navigate(opt.screen)}
        >
          <Text style={styles.rowText}>{opt.label}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  row: {
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 18,
    marginBottom: 12, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  rowText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  chevron: { color: '#888', fontSize: 20 },
});
