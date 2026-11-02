import sql from './_db.js';

let tablesChecked = false;

/**
 * Ensures account_deactivations table and relevant user columns exist in Neon PostgreSQL.
 */
export async function ensureDeactivationTables() {
  if (tablesChecked) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS account_deactivations (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        reason TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'pending_deletion',
        requested_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
        scheduled_deletion_at TIMESTAMP WITHOUT TIME ZONE DEFAULT ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days'),
        approved_at TIMESTAMP WITHOUT TIME ZONE,
        approved_by VARCHAR(255),
        admin_notes TEXT,
        notes TEXT
      )
    `;

    // Ensure columns exist on older tables
    try {
      await sql`ALTER TABLE account_deactivations ADD COLUMN IF NOT EXISTS scheduled_deletion_at TIMESTAMP WITHOUT TIME ZONE DEFAULT ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days')`;
      await sql`ALTER TABLE account_deactivations ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITHOUT TIME ZONE`;
      await sql`ALTER TABLE account_deactivations ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255)`;
      await sql`ALTER TABLE account_deactivations ADD COLUMN IF NOT EXISTS admin_notes TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivation_scheduled_at TIMESTAMP WITHOUT TIME ZONE`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivation_requested_at TIMESTAMP WITHOUT TIME ZONE`;
    } catch {}

    tablesChecked = true;
  } catch (err) {
    console.warn('Deactivation tables init check:', err.message);
  }
}

/**
 * Sweeps any pending deactivation requests where scheduled_deletion_at has passed (7 days elapsed).
 * Automatically purges the user from the users table and marks request as 'auto_deleted_7_days'.
 */
export async function autoSweepExpiredDeactivations() {
  await ensureDeactivationTables();
  try {
    // 1. Find all pending deactivations whose 7-day scheduled deletion date has passed
    const expiredRows = await sql`
      SELECT id, email, name 
      FROM account_deactivations 
      WHERE status = 'pending_deletion' 
        AND scheduled_deletion_at <= (NOW() AT TIME ZONE 'Asia/Kolkata')
    `;

    if (expiredRows && expiredRows.length > 0) {
      for (const row of expiredRows) {
        const cleanEmail = (row.email || '').toLowerCase().trim();
        // Delete user record from users table
        try {
          await sql`DELETE FROM users WHERE LOWER(email) = ${cleanEmail}`;
        } catch (e) {
          console.warn('Auto-sweep delete user warning:', e.message);
        }
        // Delete any pending OTPs
        try {
          await sql`DELETE FROM otp_verifications WHERE LOWER(target) = ${cleanEmail}`;
        } catch {}

        // Update deactivation record status
        try {
          await sql`
            UPDATE account_deactivations 
            SET status = 'auto_deleted_7_days',
                notes = 'Account automatically permanently deleted after 7-day grace period elapsed without admin intervention.'
            WHERE id = ${row.id}
          `;
        } catch {}
      }
    }

    // Also sweep users table directly if deactivation_scheduled_at has passed
    try {
      await sql`
        DELETE FROM users 
        WHERE status = 'pending_deletion' 
          AND deactivation_scheduled_at IS NOT NULL 
          AND deactivation_scheduled_at <= (NOW() AT TIME ZONE 'Asia/Kolkata')
      `;
    } catch {}

    return expiredRows ? expiredRows.length : 0;
  } catch (err) {
    console.warn('autoSweepExpiredDeactivations error:', err.message);
    return 0;
  }
}
