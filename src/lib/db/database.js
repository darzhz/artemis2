import sqlite3 from 'sqlite3';
const dbPromise =  new sqlite3.Database('src/lib/db/database.db', {
    // Optional options (e.g., version, onUpgrade)
  });
  
  export async function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      dbPromise.all(query, params, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        });
    });
  }

  export async function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      dbPromise.run(query, params, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
    });
  }
  export async function runTransaction(queries) {
    return new Promise((resolve, reject) => {
      dbPromise.serialize(() => {
        dbPromise.run('BEGIN TRANSACTION');
        for (const query of queries) {
          dbPromise.run(query.query, query.params, (err) => {
            if (err) {
              dbPromise.run('ROLLBACK');
              reject(err);
              return;
            }
          });
        }
        dbPromise.run('COMMIT', (err) => {
          if (err) {
            dbPromise.run('ROLLBACK');
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  }