import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vouches (
      id SERIAL PRIMARY KEY,
      vouch_number INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      service TEXT NOT NULL,
      rating INTEGER NOT NULL,
      text TEXT NOT NULL,
      timestamp BIGINT NOT NULL
    )
  `);
}

export async function getNextVouchNumber() {
  const result = await pool.query('SELECT COUNT(*) FROM vouches');
  return parseInt(result.rows[0].count) + 1;
}

export async function addVouch({ userId, service, rating, text, vouchNumber, timestamp }) {
  await pool.query(
    'INSERT INTO vouches (vouch_number, user_id, service, rating, text, timestamp) VALUES ($1, $2, $3, $4, $5, $6)',
    [vouchNumber, userId, service, rating, text, timestamp]
  );
}

export async function getVouches({ service } = {}) {
  if (service) {
    const result = await pool.query(
      'SELECT * FROM vouches WHERE LOWER(service) = LOWER($1) ORDER BY vouch_number ASC',
      [service]
    );
    return result.rows;
  }
  const result = await pool.query('SELECT * FROM vouches ORDER BY vouch_number ASC');
  return result.rows;
}

export async function deleteVouch(vouchNumber) {
  const result = await pool.query(
    'DELETE FROM vouches WHERE vouch_number = $1 RETURNING *',
    [vouchNumber]
  );
  return result.rows[0] || null;
}

export default pool;
