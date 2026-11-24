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

  // ── GET: Return all deactivation records, registered users & statistics ────
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

      // Also fetch registered users from database
      let usersList = [];
      try {
        usersList = await sql`
          SELECT id, email, name, role, status, deactivation_scheduled_at, deactivation_requested_at, created_at, last_login 
          FROM users 
          ORDER BY id DESC
        `;
      } catch (e) {
        try {
          usersList = await sql`
            SELECT id, email, name, role, status, deactivation_scheduled_at, created_at, last_login 
            FROM users 
            ORDER BY id DESC
          `;
        } catch (e2) {
          console.warn('Fetch users notice:', e2.message);
        }
      }

      // Map deactivation history by email to attach option timestamps
      const deactMap = {};
      for (const r of rows) {
        const em = (r.email || '').toLowerCase().trim();
        if (em && (!deactMap[em] || new Date(r.requested_at) > new Date(deactMap[em].requested_at))) {
          deactMap[em] = r;
        }
      }

      // Enrich users with deactivation timestamps & option selection history
      const enrichedUsers = usersList.map(u => {
        const em = (u.email || '').toLowerCase().trim();
        const deact = deactMap[em];
        return {
          ...u,
          deactivation_record: deact || null,
          deactivation_requested_at: u.deactivation_requested_at || deact?.requested_at || null,
          deactivation_scheduled_at: u.deactivation_scheduled_at || deact?.scheduled_deletion_at || null
        };
      });

      // Calculate statistics (including legacy 'deactivated' as approved)
      const stats = {
        total: rows.length,
        pending: rows.filter(r => r.status === 'pending_deletion').length,
        approved: rows.filter(r => r.status === 'approved_by_admin' || r.status === 'deactivated').length,
        autoDeleted: rows.filter(r => r.status === 'auto_deleted_7_days').length,
        cancelled: rows.filter(r => r.status === 'cancelled' || r.status === 'cancelled_by_user').length,
        rejected: rows.filter(r => r.status === 'rejected_by_admin').length
      };

      return res.status(200).json({
        success: true,
        stats,
        deactivations: rows,
        users: enrichedUsers
      });
    } catch (err) {
      console.error('Failed to fetch deactivations from database:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve deactivations from database.', details: err.message });
    }
  }

  // ── POST: Admin action (Approve, Reject, Delete Log, Mark Pending, Force) ───
  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { action, id, email, notes, name } = body;
    const cleanEmail = (email || '').toLowerCase().trim();

    // 1. DELETE LOG (Permanently delete this log record from history)
    if (action === 'delete_log') {
      try {
        if (id) {
          await sql`DELETE FROM account_deactivations WHERE id = ${id}`;
        } else if (cleanEmail) {
          await sql`DELETE FROM account_deactivations WHERE LOWER(email) = ${cleanEmail}`;
        }
        return res.status(200).json({
          success: true,
          message: 'Deactivation record deleted from history log.'
        });
      } catch (err) {
        return res.status(500).json({ error: `Failed to delete record: ${err.message}` });
      }
    }

    // 2. APPROVE DEACTIVATION (Instant Permanent Deletion by Admin)
    if (action === 'approve') {
      try {
        // Delete user immediately from users table & OTPs
        if (cleanEmail) {
          await sql`DELETE FROM users WHERE LOWER(email) = ${cleanEmail}`;
          await sql`DELETE FROM otp_verifications WHERE LOWER(target) = ${cleanEmail}`;
        }

        // Update or record in account_deactivations table
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
          const existing = await sql`
            SELECT id FROM account_deactivations 
            WHERE LOWER(email) = ${cleanEmail} 
            ORDER BY id DESC LIMIT 1
          `;
          if (existing && existing.length > 0) {
            await sql`
              UPDATE account_deactivations 
              SET status = 'approved_by_admin',
                  approved_at = (NOW() AT TIME ZONE 'Asia/Kolkata'),
                  approved_by = 'Administrator',
                  admin_notes = ${notes || 'Deactivation approved immediately by Administrator; user account and credentials purged from database.'}
              WHERE id = ${existing[0].id}
            `;
          } else {
            await sql`
              INSERT INTO account_deactivations (
                email, name, reason, status, approved_at, approved_by, admin_notes, requested_at, scheduled_deletion_at
              )
              VALUES (
                ${cleanEmail},
                ${name || 'User'},
                'Immediate Admin Wipe',
                'approved_by_admin',
                (NOW() AT TIME ZONE 'Asia/Kolkata'),
                'Administrator',
                'Account permanently deleted directly from Database by Administrator.',
                (NOW() AT TIME ZONE 'Asia/Kolkata'),
                (NOW() AT TIME ZONE 'Asia/Kolkata')
              )
            `;
          }
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

    // 3. REJECT DEACTIVATION (Restore User Account to Active)
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
            WHERE LOWER(email) = ${cleanEmail}
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

    // 4. RESET TO PENDING (Allow re-testing / changing status)
    if (action === 'mark_pending') {
      try {
        if (cleanEmail) {
          await sql`
            UPDATE users 
            SET status = 'pending_deletion', 
                deactivation_scheduled_at = ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days')
            WHERE LOWER(email) = ${cleanEmail}
          `;
        }

        if (id) {
          await sql`
            UPDATE account_deactivations 
            SET status = 'pending_deletion',
                scheduled_deletion_at = ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days'),
                notes = 'Reset to pending approval by Administrator'
            WHERE id = ${id}
          `;
        }

        return res.status(200).json({
          success: true,
          email: cleanEmail,
          message: `Request for ${cleanEmail} has been reset to pending approval with a 7-day window.`
        });
      } catch (err) {
        return res.status(500).json({ error: `Failed to reset to pending: ${err.message}` });
      }
    }

    // 5. FORCE / SCHEDULE DEACTIVATION FOR A USER DIRECTLY BY ADMIN (AUTOMATIC 7-DAY GRACE)
    if (action === 'force_deactivate') {
      if (!cleanEmail) {
        return res.status(400).json({ error: 'Please provide a valid email.' });
      }

      try {
        // Upsert deactivation record so details are accurately logged without duplicate mess
        const existing = await sql`
          SELECT id FROM account_deactivations 
          WHERE LOWER(email) = ${cleanEmail} 
          ORDER BY id DESC LIMIT 1
        `;

        if (existing && existing.length > 0) {
          await sql`
            UPDATE account_deactivations 
            SET name = COALESCE(${name || null}, name),
                status = 'pending_deletion',
                reason = 'Account deactivation scheduled (7-day grace period)',
                notes = 'Pending Admin Approval or 7-day automatic deletion',
                requested_at = (NOW() AT TIME ZONE 'Asia/Kolkata'),
                scheduled_deletion_at = ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days'),
                approved_at = NULL,
                approved_by = NULL,
                admin_notes = NULL
            WHERE id = ${existing[0].id}
          `;
        } else {
          await sql`
            INSERT INTO account_deactivations (
              email, name, reason, status, notes, requested_at, scheduled_deletion_at
            )
            VALUES (
              ${cleanEmail},
              ${name || null},
              'Account deactivation scheduled (7-day grace period)',
              'pending_deletion',
              'Pending Admin Approval or 7-day automatic deletion',
              (NOW() AT TIME ZONE 'Asia/Kolkata'),
              ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days')
            )
          `;
        }

        await sql`
          UPDATE users 
          SET status = 'pending_deletion', 
              deactivation_scheduled_at = ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days'),
              deactivation_requested_at = (NOW() AT TIME ZONE 'Asia/Kolkata')
          WHERE LOWER(email) = ${cleanEmail}
        `;

        return res.status(200).json({
          success: true,
          email: cleanEmail,
          message: `Deactivation scheduled automatically for ${cleanEmail}. Details recorded with 7-day auto-deletion timer.`
        });
      } catch (err) {
        return res.status(500).json({ error: `Failed to schedule deactivation: ${err.message}` });
      }
    }

    return res.status(400).json({ error: `Unknown action: "${action}". Supported: "approve", "reject", "delete_log", "mark_pending", "force_deactivate".` });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
