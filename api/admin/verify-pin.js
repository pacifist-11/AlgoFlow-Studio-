import sql from '../_db.js';
import { cors } from '../_cors.js';

const ADMIN_EMAIL = 'pothalayeswanth11@gmail.com';

let tableChecked = false;
async function ensureCrackAttemptsTable() {
  if (tableChecked) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS developer_crack_attempts (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        guessed_pin TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'failed_crack_attempt',
        ip_address VARCHAR(100),
        user_agent TEXT,
        attempted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
      )
    `;
    tableChecked = true;
  } catch (err) {
    console.warn('Developer crack attempts table init notice:', err.message);
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const configPin = process.env.ADMIN_PIN || 'Irctc@11';
  await ensureCrackAttemptsTable();

  // ── 1. GET: Fetch list of all crack/intrusion attempts (Admin Console) ───
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== configPin) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    try {
      const attempts = await sql`
        SELECT id, email, name, guessed_pin, status, ip_address, user_agent, attempted_at
        FROM developer_crack_attempts
        ORDER BY attempted_at DESC
        LIMIT 200
      `;
      return res.status(200).json({ success: true, attempts });
    } catch (err) {
      console.error('Failed to fetch crack attempts from Neon:', err.message);
      return res.status(500).json({ error: 'Failed to fetch crack attempts from database.', details: err.message });
    }
  }

  // ── 2. DELETE: Remove single crack log or clear all crack logs ───
  if (req.method === 'DELETE') {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== configPin) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    try {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      const id = req.query.id || body.id;
      if (id) {
        await sql`DELETE FROM developer_crack_attempts WHERE id = ${id}`;
        return res.status(200).json({ success: true, message: 'Crack attempt log deleted.' });
      } else {
        await sql`DELETE FROM developer_crack_attempts`;
        return res.status(200).json({ success: true, message: 'All crack attempt logs cleared.' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete crack attempts.', details: err.message });
    }
  }

  // ── 3. POST: Verify PIN & Log unauthorized crack attempts ───
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { pin, email, name } = body;
  const inputPin = (pin || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const displayName = (name || '').trim() || (cleanEmail ? cleanEmail.split('@')[0] : 'Visitor');
  const isAdmin = cleanEmail === ADMIN_EMAIL;

  if (!inputPin) {
    return res.status(400).json({ error: 'Please enter a PIN.' });
  }

  const isPinCorrect = inputPin === configPin.trim();

  // A. Genuine Admin (pothalayeswanth11@gmail.com)
  if (isAdmin) {
    if (isPinCorrect) {
      return res.status(200).json({ success: true, message: 'Access granted!' });
    } else {
      return res.status(401).json({ error: 'Incorrect developer PIN. Access denied.' });
    }
  }

  // B. ANY OTHER USER trying to open / crack the developer console:
  // Capture telemetry & save guessed password and user email to database
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const targetEmail = cleanEmail || 'unauthenticated_visitor';
  const attemptStatus = isPinCorrect ? 'correct_pin_unauthorized_user' : 'failed_crack_attempt';

  try {
    await sql`
      INSERT INTO developer_crack_attempts (
        email, name, guessed_pin, status, ip_address, user_agent, attempted_at
      )
      VALUES (
        ${targetEmail},
        ${displayName},
        ${inputPin},
        ${attemptStatus},
        ${String(ip).slice(0, 100)},
        ${String(userAgent).slice(0, 500)},
        (NOW() AT TIME ZONE 'Asia/Kolkata')
      )
    `;
    console.warn(`🚨 [Crack Attempt Logged] User "${targetEmail}" (${displayName}) attempted Developer Console PIN: "${inputPin}". Status: ${attemptStatus}`);
  } catch (dbErr) {
    console.error('Failed to log crack attempt to Neon database:', dbErr.message);
  }

  // If a non-admin user somehow guessed the exact PIN, strictly reject them
  if (isPinCorrect) {
    return res.status(403).json({
      error: 'Access denied: Developer console is strictly restricted to administrator (pothalayeswanth11@gmail.com). Attempt has been recorded.'
    });
  }

  // Default rejected response for wrong guessed password
  return res.status(401).json({
    error: 'Incorrect developer PIN. Access denied.'
  });
}
