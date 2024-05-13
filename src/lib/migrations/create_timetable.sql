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
    semester TEXT NOT NULL,
    year TEXT NOT NULL,
    facultyIncharge TEXT NOT NULL,
    subjects TEXT 
);
--create a table for the subject basket for a semester with subjects as an array,department,semester with department and semester as unique
CREATE TABLE IF NOT EXISTS Basket (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department TEXT NOT NULL,
    semester TEXT NOT NULL,
    subjects TEXT NOT NULL,
    UNIQUE(department,semester)
);

CREATE TABLE IF NOT EXISTS facultyoperation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    faculty_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    batch_id TEXT NOT NULL,
    semester TEXT NOT NULL,
    department TEXT NOT NULL,
    UNIQUE(faculty_id,subject_id,batch_id)
);

CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department TEXT NOT NULL,
    semester TEXT NOT NULL,
    batch_id TEXT NOT NULL,
    timetable TEXT NOT NULL,
    tbl_fileName TEXT NOT NULL,
    UNIQUE(department,semester,batch_id)
);

-- to execute the migration sqlite3 ./db/database.db < migrations/create_timetable.sql