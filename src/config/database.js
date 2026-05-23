const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('NODE_ENV:', process.env.NODE_ENV);

let db;

if (process.env.NODE_ENV === 'production') {
  // Producción → Supabase
  db = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
  module.exports = db;
} else {
  // Local → SQLite
  const Database = require('better-sqlite3');
  const sqlite = new Database('./local.db');

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS animes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      categoria_id INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS personajes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      edad INTEGER,
      poder TEXT,
      anime_id INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS imagenes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personaje_id INTEGER,
      url TEXT,
      orden INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT UNIQUE NOT NULL,
      descripcion TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const supabaseWrapper = {
    from: (tabla) => ({
      select: (campos) => ({
        order: (col, opts) => ({
          then: (resolve) => {
            try {
              const rows = sqlite.prepare(`SELECT * FROM ${tabla} ORDER BY ${col} ${opts?.ascending === false ? 'DESC' : 'ASC'}`).all();
              resolve({ data: rows, error: null });
            } catch(e) { resolve({ data: null, error: e }); }
          }
        }),
        eq: (col, val) => ({
          single: () => ({
            then: (resolve) => {
              try {
                const row = sqlite.prepare(`SELECT * FROM ${tabla} WHERE ${col} = ?`).get(val);
                resolve({ data: row || null, error: row ? null : { message: 'Not found' } });
              } catch(e) { resolve({ data: null, error: e }); }
            }
          }),
          order: (orderCol, opts) => ({
            then: (resolve) => {
              try {
                const rows = sqlite.prepare(`SELECT * FROM ${tabla} WHERE ${col} = ? ORDER BY ${orderCol} ${opts?.ascending === false ? 'DESC' : 'ASC'}`).all(val);
                resolve({ data: rows, error: null });
              } catch(e) { resolve({ data: null, error: e }); }
            }
          })
        }),
        ilike: (col, val) => ({
          single: () => ({
            then: (resolve) => {
              try {
                const row = sqlite.prepare(`SELECT * FROM ${tabla} WHERE ${col} LIKE ?`).get(val);
                resolve({ data: row || null, error: row ? null : { message: 'Not found' } });
              } catch(e) { resolve({ data: null, error: e }); }
            }
          }),
          eq: (col2, val2) => ({
            then: (resolve) => {
              try {
                const rows = sqlite.prepare(`SELECT * FROM ${tabla} WHERE ${col} LIKE ? AND ${col2} = ?`).all(val, val2);
                resolve({ data: rows, error: null });
              } catch(e) { resolve({ data: null, error: e }); }
            }
          }),
          then: (resolve) => {
            try {
              const rows = sqlite.prepare(`SELECT * FROM ${tabla} WHERE ${col} LIKE ?`).all(val);
              resolve({ data: rows, error: null });
            } catch(e) { resolve({ data: null, error: e }); }
          }
        }),
        single: () => ({
          then: (resolve) => {
            try {
              const row = sqlite.prepare(`SELECT * FROM ${tabla}`).get();
              resolve({ data: row || null, error: null });
            } catch(e) { resolve({ data: null, error: e }); }
          }
        }),
        then: (resolve) => {
          try {
            const rows = sqlite.prepare(`SELECT * FROM ${tabla}`).all();
            resolve({ data: rows, error: null });
          } catch(e) { resolve({ data: null, error: e }); }
        }
      }),
      insert: (datos) => ({
        select: () => ({
          single: () => ({
            then: (resolve) => {
              try {
                const arr = Array.isArray(datos) ? datos : [datos];
                const cols = Object.keys(arr[0]);
                const placeholders = cols.map(() => '?').join(', ');
                const stmt = sqlite.prepare(`INSERT INTO ${tabla} (${cols.join(', ')}) VALUES (${placeholders})`);
                let lastRow;
                for (const item of arr) {
                  const info = stmt.run(...cols.map(c => item[c]));
                  lastRow = sqlite.prepare(`SELECT * FROM ${tabla} WHERE id = ?`).get(info.lastInsertRowid);
                }
                resolve({ data: lastRow, error: null });
              } catch(e) { resolve({ data: null, error: e }); }
            }
          })
        })
      }),
      update: (datos) => ({
        eq: (col, val) => ({
          select: () => ({
            single: () => ({
              then: (resolve) => {
                try {
                  const cols = Object.keys(datos);
                  const sets = cols.map(c => `${c} = ?`).join(', ');
                  sqlite.prepare(`UPDATE ${tabla} SET ${sets} WHERE ${col} = ?`).run(...cols.map(c => datos[c]), val);
                  const row = sqlite.prepare(`SELECT * FROM ${tabla} WHERE ${col} = ?`).get(val);
                  resolve({ data: row, error: null });
                } catch(e) { resolve({ data: null, error: e }); }
              }
            })
          })
        })
      }),
      delete: () => ({
        eq: (col, val) => ({
          then: (resolve) => {
            try {
              sqlite.prepare(`DELETE FROM ${tabla} WHERE ${col} = ?`).run(val);
              resolve({ data: null, error: null });
            } catch(e) { resolve({ data: null, error: e }); }
          }
        })
      })
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: {}, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };

  module.exports = supabaseWrapper;
}