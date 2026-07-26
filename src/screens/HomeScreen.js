import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDb } from '../database/db';

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState({ xp: 0, coins: 0, level: 1, streak: 0 });
  const [recentDecks, setRecentDecks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [])
  );

  function loadHomeData() {
    const db = getDb();

    const profileRow = db.getFirstSync(
      'SELECT * FROM user_profile WHERE id = 1'
    );
    if (profileRow) setProfile(profileRow);

    const decks = db.getAllSync(`
      SELECT decks.id, decks.name, decks.color, topics.name as topic_name
      FROM decks
      JOIN topics ON decks.topic_id = topics.id
      ORDER BY decks.id DESC
      LIMIT 5
    `);
    setRecentDecks(decks);
  }

  const xpForNextLevel = profile.level * 100;
  const xpProgress = Math.min(profile.xp / xpForNextLevel, 1);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Good to see you</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>Lv {profile.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.streak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      <View style={styles.xpBarBackground}>
        <View style={[styles.xpBarFill, { width: `${xpProgress * 100}%` }]} />
      </View>
      <Text style={styles.xpText}>{profile.xp} / {xpForNextLevel} XP</Text>

      <TouchableOpacity
        style={styles.quickStudyButton}
        onPress={() => navigation.navigate('Browse')}
      >
        <Text style={styles.quickStudyText}>Quick Study</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Decks</Text>
      {recentDecks.length === 0 ? (
        <Text style={styles.emptyText}>No decks yet. Create one to begin.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentDecks.map((deck) => (
            <View
              key={deck.id}
              style={[styles.deckCard, { borderColor: deck.color || '#4A90D9' }]}
            >
              <Text style={styles.deckName}>{deck.name}</Text>
              <Text style={styles.deckTopic}>{deck.topic_name}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  greeting: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statBox: {
    flex: 1, backgroundColor: '#1e1e1e', borderRadius: 16,
    padding: 12, marginHorizontal: 4, alignItems: 'center',
  },
  statValue: { color: '#4A90D9', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  xpBarBackground: {
    height: 10, backgroundColor: '#2a2a2a', borderRadius: 5, overflow: 'hidden',
  },
  xpBarFill: { height: '100%', backgroundColor: '#4A90D9' },
  xpText: { color: '#888', fontSize: 12, marginTop: 4, marginBottom: 20 },
  quickStudyButton: {
    backgroundColor: '#4A90D9', borderRadius: 16, padding: 18,
    alignItems: 'center', marginBottom: 24,
  },
  quickStudyText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  emptyText: { color: '#888', fontSize: 14 },
  deckCard: {
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 16,
    marginRight: 12, minWidth: 140, borderLeftWidth: 4,
  },
  deckName: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  deckTopic: { color: '#888', fontSize: 12, marginTop: 4 },
});
