CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department  TEXT NOT NULL,
    batch TEXT,
    password TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS students (
	id	INTEGER,
	name	TEXT NOT NULL,
	email	TEXT NOT NULL UNIQUE,
	department	TEXT NOT NULL,
	password	TEXT NOT NULL,
	batch	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    department  TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL
);
--create a table for batches
CREATE TABLE IF NOT EXISTS batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department  TEXT NOT NULL,
    year TEXT NOT NULL
);
-- to execute the migration sqlite3 ./db/database.db < migrations/create_batches.sql