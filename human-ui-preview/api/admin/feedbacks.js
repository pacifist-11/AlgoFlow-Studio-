import sql from '../_db.js';
import { cors } from '../_cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  const configPin = process.env.ADMIN_PIN || 'Irctc@11';

  if (!authHeader || authHeader !== configPin) {
    return res.status(403).json({ error: 'Unauthorized. Invalid Developer credentials.' });
  }

  try {
    const rows = await sql`SELECT * FROM feedbacks ORDER BY created_at DESC`;
    return res.json(rows);
  } catch (err) {
    console.error('❌ Failed to fetch feedbacks from Neon:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve logs from database.', details: err.message });
  }
}
