import sql from '../_db.js';
import { cors } from '../_cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  const configPin = process.env.ADMIN_PIN || 'Irctc@11';

  if (!authHeader || authHeader !== configPin) {
    return res.status(403).json({ error: 'Unauthorized. Access denied.' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  if (body.confirm !== 'PERMANENTLY_DELETE_FEEDBACKS') {
    return res.status(400).json({ error: 'Confirmation required. Pass { confirm: "PERMANENTLY_DELETE_FEEDBACKS" } in request body.' });
  }

  try {
    await sql`TRUNCATE TABLE feedbacks RESTART IDENTITY`;
    console.log('🗑️ Neon feedbacks table truncated.');
    return res.json({ message: 'All feedback logs cleared successfully!' });
  } catch (err) {
    console.error('❌ Truncate failed:', err.message);
    return res.status(500).json({ error: 'Failed to delete records from database.', details: err.message });
  }
}
