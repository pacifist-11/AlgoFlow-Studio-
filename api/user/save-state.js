import sql from '../_db.js';
import { cors } from '../_cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, state_data } = req.body;
  if (!email || !state_data) {
    return res.status(400).json({ error: 'Missing email or state data.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const rows = await sql`
      INSERT INTO user_states (email, state_data, updated_at)
      VALUES (${cleanEmail}, ${state_data}, NOW())
      ON CONFLICT (email)
      DO UPDATE SET state_data = ${state_data}, updated_at = NOW()
      RETURNING *
    `;
    return res.json({ success: true, updated: rows[0] });
  } catch (err) {
    console.error('❌ Failed to save user state:', err.message);
    return res.status(500).json({ error: 'Failed to save progress to database.', details: err.message });
  }
}
