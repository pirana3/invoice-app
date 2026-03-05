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

    CREATE TABLE IF NOT EXISTS businessesinfo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bname TEXT NOT NULL,
      email TEXT NOT NULL,
      phone REAL NOT NULL,
      address TEXT NOT NULL,
      industry TEXT NOT NULL,
      logo TEXT
    );

    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `);
};
