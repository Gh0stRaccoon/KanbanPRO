const { Pool } = require('pg');

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(dbConfig);

async function verificarConexion() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL exitosa');

    // Liberar cliente
    client.release();

  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
  }
}

module.exports = { pool, verificarConexion };