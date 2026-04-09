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

    CREATE TABLE IF NOT EXISTS signatures (
      id INTEGER PRIMARY KEY,
      kind TEXT NOT NULL,
      data TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS document_annotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      documentId INTEGER NOT NULL,
      type TEXT NOT NULL,
      x REAL NOT NULL,
      y REAL NOT NULL,
      data TEXT,
      kind TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS createinvoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientname TEXT NOT NULL,
      invoicenumber REAL NOT NULL, 
      invoicedate REAL NOT NULL,
      products TEXT NOT NULL,
      totalamount REAL NOT NULL,
      percentage REAL NOT NULL,
      tax REAL NOT NULL,
      notes TEXT NOT NULL,
      termsandconditions TEXT NOT NULL DEFAULT '',
      details TEXT NOT NULL DEFAULT '',
      completed INTEGER NOT NULL DEFAULT 0
      ); 

    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoiceId INTEGER NOT NULL,
      productId INTEGER,
      name TEXT NOT NULL,
      quantity REAL NOT NULL,
      unitPrice REAL NOT NULL,
      manualAmount REAL,
      useManual INTEGER NOT NULL DEFAULT 0
    );

      CREATE TABLE IF NOT EXISTS createestimates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientname TEXT NOT NULL,
        estimatenumber REAL NOT NULL,
        estimatedate REAL NOT NULL,
        estimateproducts TEXT NOT NULL,
        estimatetotalamount REAL NOT NULL,
        estimatepercentage REAL NOT NULL,
        estimatetax REAL NOT NULL,
        estimatenotes TEXT NOT NULL,
        estimatetermsandconditions TEXT NOT NULL DEFAULT '',
        estimatedetails TEXT NOT NULL DEFAULT '',
        estimatecompleted INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS estimate_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estimateId INTEGER NOT NULL,
        productId INTEGER,
        estimatename TEXT NOT NULL,
        estimatequantity REAL NOT NULL,
        estimateunitPrice REAL NOT NULL,
        estimatemanualAmount REAL,
        estimateuseManual INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cname TEXT NOT NULL,
        cemail TEXT NOT NULL,
        cphone REAL NOT NULL,
        caddress TEXT NOT NULL,
        ccity TEXT NOT NULL,
        cstate TEXT NOT NULL,
        ccompany TEXT NOT NULL,
        cdetails TEXT NOT NULL DEFAULT '',
        cphoto TEXT
        );

  `);

};
