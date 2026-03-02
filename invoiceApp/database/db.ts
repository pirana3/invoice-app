import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('app.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL
    );
  `);
};
