import sql from '../_db.js';
import { cors } from '../_cors.js';
import { ensureDeactivationTables, autoSweepExpiredDeactivations } from '../_deactivationHelper.js';

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
    // 1. Ensure table schema & columns exist and run auto-sweep
    await ensureDeactivationTables();
    await autoSweepExpiredDeactivations();

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

    // 3. Mark any previous pending requests for this email as superseded
    try {
      await sql`
        UPDATE account_deactivations 
        SET status = 'superseded' 
        WHERE LOWER(email) = ${target} AND status = 'pending_deletion'
      `;
    } catch {}

    // 4. Log into account_deactivations table
    await sql`
      INSERT INTO account_deactivations (
        email, 
        name, 
        reason, 
        status, 
        notes, 
        requested_at, 
        scheduled_deletion_at
      )
      VALUES (
        ${target},
        ${existingName || null},
        ${reason},
        'pending_deletion',
        'Pending Admin Approval (immediate deletion if approved) or 7-day automatic deletion grace period',
        (NOW() AT TIME ZONE 'Asia/Kolkata'),
        ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days')
      )
    `;

    // 5. Mark user account status as pending_deletion in users table
    await sql`
      UPDATE users 
      SET status = 'pending_deletion', 
          deactivation_scheduled_at = ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days'),
          deactivation_requested_at = (NOW() AT TIME ZONE 'Asia/Kolkata')
      WHERE LOWER(email) = ${target}
    `;

    // 6. Clean up any active OTP entries
    try {
      await sql`DELETE FROM otp_verifications WHERE LOWER(target) = ${target}`;
    } catch {}

    const scheduledDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    console.log(`🗑️ [Deactivation Request] ${target} (${existingName}) requested deactivation. Scheduled 7-day deletion on ${scheduledDate}`);

    return res.status(200).json({
      success: true,
      email: target,
      scheduledDeletionDate: scheduledDate,
      message: `Account deactivation request submitted. If approved by an Admin, your account will be deleted immediately. Otherwise, it will automatically delete after 7 days (on ${scheduledDate}). You have been safely logged out.`
    });
  } catch (err) {
    console.error('❌ Deactivation error:', err.message);
    return res.status(500).json({
      error: `Failed to deactivate account: ${err.message}`
    });
  }
}
