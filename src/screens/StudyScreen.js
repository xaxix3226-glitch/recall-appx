import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { getDb } from '../database/db';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StudyScreen({ route, navigation }) {
  const { deckIds, shuffle, limit } = route.params;
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  useEffect(() => {
    const db = getDb();
    const placeholders = deckIds.map(() => '?').join(',');
    let rows = db.getAllSync(
      `SELECT * FROM flashcards WHERE deck_id IN (${placeholders})`,
      deckIds
    );
    if (shuffle) rows = shuffleArray(rows);
    setCards(rows.slice(0, limit));
  }, []);

  const currentCard = cards[index];

  function handleReveal() {
    setRevealed(true);
  }

  function handleRate(isCorrect) {
    const db = getDb();
    const newMastery = Math.max(
      0,
      Math.min(100, currentCard.mastery + (isCorrect ? 10 : -10))
    );
    db.runSync(
      'UPDATE flashcards SET mastery = ?, last_studied = ? WHERE id = ?',
      [newMastery, Math.floor(Date.now() / 1000), currentCard.id]
    );

    if (isCorrect) setCorrect((c) => c + 1);
    else setIncorrect((c) => c + 1);

    goNext();
  }

  function goNext() {
    if (index + 1 >= cards.length) {
      navigation.replace('SessionComplete', {
        correct: correct + (revealed ? 0 : 0),
        incorrect,
        total: cards.length,
      });
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
  }

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No cards to study.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.exitText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>{index + 1} / {cards.length}</Text>
      </View>

      <TouchableOpacity
        style={[styles.card, { borderColor: currentCard.color || '#4A90D9' }]}
        onPress={!revealed ? handleReveal : undefined}
        activeOpacity={0.9}
      >
        <Text style={styles.cardLabel}>{revealed ? 'Answer' : 'Question'}</Text>
        <Text style={styles.cardText}>
          {revealed ? currentCard.answer : currentCard.question}
        </Text>
        {!revealed && currentCard.hint ? (
          <Text style={styles.hintText}>Hint: {currentCard.hint}</Text>
        ) : null}
        {!revealed && <Text style={styles.tapHint}>Tap to reveal</Text>}
      </TouchableOpacity>

      {revealed && (
        <View style={styles.ratingRow}>
          <TouchableOpacity
            style={[styles.ratingButton, styles.hardButton]}
            onPress={() => handleRate(false)}
          >
            <Text style={styles.ratingText}>Incorrect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ratingButton, styles.easyButton]}
            onPress={() => handleRate(true)}
          >
            <Text style={styles.ratingText}>Correct</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  exitText: { color: '#fff', fontSize: 20 },
  progressText: { color: '#888', fontSize: 14 },
  card: {
    flex: 1, backgroundColor: '#1e1e1e', borderRadius: 20,
    borderWidth: 2, padding: 24, justifyContent: 'center', alignItems: 'center',
  },
  cardLabel: { color: '#888', fontSize: 13, marginBottom: 12 },
  cardText: { color: '#fff', fontSize: 22, textAlign: 'center', fontWeight: '600' },
  hintText: { color: '#F5C518', fontSize: 14, marginTop: 16, textAlign: 'center' },
  tapHint: { color: '#555', fontSize: 12, marginTop: 24 },
  ratingRow: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 8 },
  ratingButton: {
    flex: 1, borderRadius: 16, padding: 18, alignItems: 'center',
  },
  hardButton: { backgroundColor: '#E53935' },
  easyButton: { backgroundColor: '#4CAF50' },
  ratingText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 60 },
});
