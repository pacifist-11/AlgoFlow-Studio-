import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

if (!process.env.DATABASE_URL) {
  try {
    dotenv.config();
    dotenv.config({ path: '.env.local' });
  } catch {}
}

let client = null;

function getClient() {
  if (!client) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not defined.');
    }
    client = neon(dbUrl);
  }
  return client;
}

const sql = (strings, ...values) => {
  return getClient()(strings, ...values);
};

export default sql;
