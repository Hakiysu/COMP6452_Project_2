const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('backend.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet_address TEXT UNIQUE,
    role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS meat_batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id TEXT UNIQUE,
    creator_wallet_address TEXT,
    animal_type TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS meat_batch_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id TEXT,
    stage TEXT,
    content TEXT,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    wallet TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS regulator_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    wallet_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT
  )`);

});

db.close();
