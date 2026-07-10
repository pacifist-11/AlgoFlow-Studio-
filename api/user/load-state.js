import sql from '../_db.js';
import { cors } from '../_cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Missing email parameter.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const rows = await sql`SELECT state_data FROM user_states WHERE email = ${cleanEmail}`;
    if (rows.length > 0) {
      return res.json({ success: true, state_data: rows[0].state_data });
    } else {
      return res.json({ success: true, state_data: null });
    }
  } catch (err) {
    console.error('❌ Failed to load user state:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve progress from database.', details: err.message });
  }
}
