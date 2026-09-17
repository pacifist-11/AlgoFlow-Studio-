import sql from '../_db.js';
import { cors } from '../_cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const target = (body.target || body.email || '').trim().toLowerCase();
  const displayName = (body.name || '').trim();
  const reason = (body.reason || 'User requested account deactivation / name reset').trim();

  if (!target || !target.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  try {
    // 1. Ensure account_deactivations tracking table exists in Neon PostgreSQL
    await sql`
      CREATE TABLE IF NOT EXISTS account_deactivations (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        reason TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'pending_deletion',
        requested_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
        scheduled_deletion_at TIMESTAMP WITHOUT TIME ZONE DEFAULT ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days'),
        notes TEXT
      )
    `;

    // Ensure columns exist if table or users existed previously
    try {
      await sql`ALTER TABLE account_deactivations ADD COLUMN IF NOT EXISTS scheduled_deletion_at TIMESTAMP WITHOUT TIME ZONE DEFAULT ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days')`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivation_scheduled_at TIMESTAMP WITHOUT TIME ZONE`;
    } catch {}

    // 2. Fetch existing user details if present
    let existingName = displayName;
    try {
      const rows = await sql`
        SELECT id, email, name FROM users WHERE LOWER(email) = ${target} LIMIT 1
      `;
      if (rows && rows.length > 0) {
        existingName = rows[0].name || displayName;
      }
    } catch (e) {
      console.warn('Lookup before deactivation warning:', e.message);
    }

    // 3. Log into account_deactivations table with 7-day scheduled permanent deletion date
    await sql`
      INSERT INTO account_deactivations (email, name, reason, status, notes, scheduled_deletion_at)
      VALUES (
        ${target},
        ${existingName || null},
        ${reason},
        'pending_deletion',
        'Account scheduled for deactivation with 7-day grace period',
        ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days')
      )
    `;

    // 4. Mark user account status as pending_deletion in users table
    await sql`
      UPDATE users 
      SET status = 'pending_deletion', 
          deactivation_scheduled_at = ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days')
      WHERE LOWER(email) = ${target}
    `;

    // 5. Clean up any active OTP entries
    try {
      await sql`DELETE FROM otp_verifications WHERE LOWER(target) = ${target}`;
    } catch {}

    const scheduledDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return res.status(200).json({
      success: true,
      email: target,
      scheduledDeletionDate: scheduledDate,
      message: `Account scheduled for permanent deletion in 7 days (on ${scheduledDate}). You can sign in anytime within 7 days to cancel deactivation and restore your account.`
    });
  } catch (err) {
    console.error('❌ Deactivation error:', err.message);
    return res.status(500).json({
      error: `Failed to deactivate account: ${err.message}`
    });
  }
}
