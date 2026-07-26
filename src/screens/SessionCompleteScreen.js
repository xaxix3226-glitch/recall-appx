import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { getDb } from '../database/db';

export default function SessionCompleteScreen({ route, navigation }) {
  const { correct = 0, incorrect = 0, total = 0 } = route.params || {};
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const xpEarned = correct * 5;
  const coinsEarned = correct * 2;

  React.useEffect(() => {
    const db = getDb();
    db.runSync(
      'UPDATE user_profile SET xp = xp + ?, coins = coins + ? WHERE id = 1',
      [xpEarned, coinsEarned]
    );
    db.runSync(
      `INSERT INTO study_sessions
        (started_at, ended_at, cards_studied, correct_count, incorrect_count, xp_earned, coins_earned)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000),
        total,
        correct,
        incorrect,
        xpEarned,
        coinsEarned,
      ]
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.trophy}>🏆</Text>
      <Text style={styles.title}>Session Complete</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>Cards Studied</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{correct}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{incorrect}</Text>
          <Text style={styles.statLabel}>Incorrect</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>+{xpEarned}</Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>+{coinsEarned}</Text>
          <Text style={styles.statLabel}>Coins Earned</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
      >
        <Text style={styles.homeButtonText}>Return Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#121212', padding: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  trophy: { fontSize: 60, marginBottom: 12 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%',
  },
  statBox: {
    width: '48%', backgroundColor: '#1e1e1e', borderRadius: 16,
    padding: 16, marginBottom: 12, alignItems: 'center',
  },
  statValue: { color: '#4A90D9', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  homeButton: {
    backgroundColor: '#4A90D9', borderRadius: 16, padding: 18,
    alignItems: 'center', width: '100%', marginTop: 12,
  },
  homeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
