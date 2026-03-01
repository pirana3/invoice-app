import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync("app.db");

export const initDatabase = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXIST products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
            details TEXT,
            price REAL 
            `);
}