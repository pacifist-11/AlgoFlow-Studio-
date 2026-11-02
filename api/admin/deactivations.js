import sql from '../_db.js';
import { cors } from '../_cors.js';
import { ensureDeactivationTables, autoSweepExpiredDeactivations } from '../_deactivationHelper.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  const configPin = process.env.ADMIN_PIN || 'Irctc@11';

  if (!authHeader || authHeader !== configPin) {
    return res.status(403).json({ error: 'Unauthorized. Invalid Developer PIN.' });
  }

  await ensureDeactivationTables();

  // Sweep expired 7-day requests before processing
  await autoSweepExpiredDeactivations();

  // ── GET: Return all deactivation records & statistics ───────────────────────
  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT 
          id, 
          email, 
          name, 
          reason, 
          status, 
          requested_at, 
          scheduled_deletion_at, 
          approved_at, 
          approved_by, 
          admin_notes, 
          notes
        FROM account_deactivations 
        ORDER BY requested_at DESC
      `;

      // Calculate statistics
      const stats = {
        total: rows.length,
        pending: rows.filter(r => r.status === 'pending_deletion').length,
        approved: rows.filter(r => r.status === 'approved_by_admin').length,
        autoDeleted: rows.filter(r => r.status === 'auto_deleted_7_days').length,
        cancelled: rows.filter(r => r.status === 'cancelled' || r.status === 'cancelled_by_user').length,
        rejected: rows.filter(r => r.status === 'rejected_by_admin').length
      };

      return res.status(200).json({
        success: true,
        stats,
        deactivations: rows
      });
    } catch (err) {
      console.error('Failed to fetch deactivations from database:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve deactivations from database.', details: err.message });
    }
  }

  // ── POST: Admin action (Approve immediate deletion / Reject & Restore) ──────
  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { action, id, email, notes } = body;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail && !id) {
      return res.status(400).json({ error: 'Please provide either an email or a record id.' });
    }

    // 1. APPROVE DEACTIVATION (Instant Permanent Deletion by Admin)
    if (action === 'approve') {
      try {
        // Delete user immediately from users table
        if (cleanEmail) {
          await sql`DELETE FROM users WHERE LOWER(email) = ${cleanEmail}`;
          await sql`DELETE FROM otp_verifications WHERE LOWER(target) = ${cleanEmail}`;
        }

        // Update account_deactivations record
        if (id) {
          await sql`
            UPDATE account_deactivations 
            SET status = 'approved_by_admin',
                approved_at = (NOW() AT TIME ZONE 'Asia/Kolkata'),
                approved_by = 'Administrator',
                admin_notes = ${notes || 'Deactivation approved immediately by Administrator; user account and credentials purged from database.'}
            WHERE id = ${id}
          `;
        } else if (cleanEmail) {
          await sql`
            UPDATE account_deactivations 
            SET status = 'approved_by_admin',
                approved_at = (NOW() AT TIME ZONE 'Asia/Kolkata'),
                approved_by = 'Administrator',
                admin_notes = ${notes || 'Deactivation approved immediately by Administrator; user account and credentials purged from database.'}
            WHERE LOWER(email) = ${cleanEmail} AND status = 'pending_deletion'
          `;
        }

        console.log(`⚡ [Admin Approved] Immediate account deactivation completed for ${cleanEmail}`);

        return res.status(200).json({
          success: true,
          email: cleanEmail,
          message: `Deactivation approved! Account for ${cleanEmail} was permanently deleted from the database immediately.`
        });
      } catch (err) {
        console.error('Admin approve deactivation error:', err.message);
        return res.status(500).json({ error: 'Failed to approve deactivation.', details: err.message });
      }
    }

    // 2. REJECT DEACTIVATION (Restore User Account to Active)
    if (action === 'reject') {
      try {
        if (cleanEmail) {
          await sql`
            UPDATE users 
            SET status = 'active', 
                deactivation_scheduled_at = NULL, 
                deactivation_requested_at = NULL 
            WHERE LOWER(email) = ${cleanEmail}
          `;
        }

        if (id) {
          await sql`
            UPDATE account_deactivations 
            SET status = 'rejected_by_admin',
                approved_at = (NOW() AT TIME ZONE 'Asia/Kolkata'),
                approved_by = 'Administrator',
                admin_notes = ${notes || 'Deactivation rejected by Administrator; user account restored to active.'}
            WHERE id = ${id}
          `;
        } else if (cleanEmail) {
          await sql`
            UPDATE account_deactivations 
            SET status = 'rejected_by_admin',
                approved_at = (NOW() AT TIME ZONE 'Asia/Kolkata'),
                approved_by = 'Administrator',
                admin_notes = ${notes || 'Deactivation rejected by Administrator; user account restored to active.'}
            WHERE LOWER(email) = ${cleanEmail} AND status = 'pending_deletion'
          `;
        }

        return res.status(200).json({
          success: true,
          email: cleanEmail,
          message: `Deactivation rejected. User account (${cleanEmail}) restored to active.`
        });
      } catch (err) {
        console.error('Admin reject deactivation error:', err.message);
        return res.status(500).json({ error: 'Failed to reject deactivation.', details: err.message });
      }
    }

    return res.status(400).json({ error: `Unknown action: "${action}". Supported: "approve", "reject".` });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
