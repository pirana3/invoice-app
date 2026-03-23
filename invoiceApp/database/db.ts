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

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ename TEXT NOT NULL,
      eemail TEXT NOT NULL,
      ephone REAL NOT NULL,
      eage INTEGER NOT NULL,
      eposition TEXT NOT NULL,
      erole TEXT NOT NULL,
      edetails TEXT NOT NULL DEFAULT '',
      epay REAL NOT NULL,
      eperformance REAL NOT NULL,
      elanguage TEXT NOT NULL,
      eyears INTEGER NOT NULL,
      ephoto TEXT
    );

    CREATE TABLE IF NOT EXISTS bdocuments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      buri TEXT NOT NULL,
      bdate TEXT NOT NULL
    );
  `);
};
