import pg from 'pg';
const { Pool } = pg;

let pool;

if (process.env.NODE_ENV === 'test') {
  pool = null;
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

export default pool;