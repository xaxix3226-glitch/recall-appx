import * as SQLite from 'expo-sqlite';

let db = null;

export function getDb() {
  if (!db) {
    db = SQLite.openDatabaseSync('recall.db');
  }
  return db;
}

export function initDatabase() {
  const database = getDb();

  database.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#4A90D9',
      icon TEXT,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );

    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#4A90D9',
      is_favorite INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deck_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      hint TEXT,
      notes TEXT,
      tags TEXT,
      color TEXT,
      difficulty TEXT DEFAULT 'Medium',
      is_priority INTEGER DEFAULT 0,
      needs_revision INTEGER DEFAULT 0,
      mastery INTEGER DEFAULT 0,
      image_uri TEXT,
      last_studied INTEGER,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at INTEGER,
      ended_at INTEGER,
      mode TEXT DEFAULT 'Normal',
      cards_studied INTEGER DEFAULT 0,
      correct_count INTEGER DEFAULT 0,
      incorrect_count INTEGER DEFAULT 0,
      xp_earned INTEGER DEFAULT 0,
      coins_earned INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      xp INTEGER DEFAULT 0,
      coins INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      streak INTEGER DEFAULT 0
    );

    INSERT OR IGNORE INTO user_profile (id, xp, coins, level, streak)
    VALUES (1, 0, 0, 1, 0);
  `);

  console.log('Database initialized');
}
