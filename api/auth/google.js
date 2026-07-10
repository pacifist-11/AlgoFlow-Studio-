import sql from '../_db.js';
import { cors } from '../_cors.js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'pothalayeswanth11@gmail.com').toLowerCase();

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Missing Google credential token.' });
  }

  try {
    const parts = credential.split('.');
    if (parts.length !== 3) {
      return res.status(400).json({ error: 'Invalid Google credential token format.' });
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    if (!payload.email || !payload.email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email in Google credential payload.' });
    }

    const cleanEmail = payload.email.toLowerCase().trim();
    const role = cleanEmail === ADMIN_EMAIL ? 'admin' : 'user';

    await sql`
      INSERT INTO users (email, role) VALUES (${cleanEmail}, ${role})
      ON CONFLICT (email) DO NOTHING
    `;

    console.log(`✅ Google login: ${cleanEmail} (${role})`);
    return res.json({ success: true, email: cleanEmail, role });
  } catch (err) {
    console.error('❌ Google auth error:', err.message);
    return res.status(500).json({ error: 'Failed to process Google authentication.' });
  }
}
