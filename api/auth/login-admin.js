import { cors } from '../_cors.js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'pothalayeswanth11@gmail.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Irctc@11';

export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  if (cleanEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized access.' });
  }

  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, email: cleanEmail, role: 'admin' });
  } else {
    return res.status(401).json({ error: 'Incorrect admin password.' });
  }
}
