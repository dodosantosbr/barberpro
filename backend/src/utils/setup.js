const pool = require("../config/db");
async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        phone TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        price DECIMAL NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        client_id INTEGER REFERENCES clients(id),
        service_id INTEGER REFERENCES services(id),
        date DATE NOT NULL,
        time TIME NOT NULL,
        status TEXT DEFAULT 'Confirmado',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Tabelas criadas com sucesso 🚀");
  } catch (err) {
    console.error("Erro ao criar tabelas:", err);
  } finally {
    process.exit();
  }
}

createTables();
