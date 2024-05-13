CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department  TEXT NOT NULL,
    password TEXT NOT NULL
);
-- to execute the migration sqlite3 my_database.db < migrations/v1_create_users_table.sql