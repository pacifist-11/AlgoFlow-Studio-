import sql from '../_db.js';
import { cors } from '../_cors.js';
import nodemailer from 'nodemailer';

// Fast in-memory cache for instant OTP lookups and rate-limiting
const memoryOtpStore = new Map();

let isTableInitialized = false;

async function ensureOtpTable() {
  if (isTableInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        target VARCHAR(255) PRIMARY KEY,
        pin VARCHAR(10) NOT NULL,
        attempts INT DEFAULT 0,
        expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
      )
    `;
    isTableInitialized = true;
  } catch (err) {
    // If table creation fails, memory store provides fallback
    console.warn('Neon DB OTP table check:', err.message);
  }
}

// In-database user lookup for real names
async function findUserByTarget(target = '') {
  const clean = target.trim().toLowerCase();
  try {
    const rows = await sql`
      SELECT id, email, name, picture, role 
      FROM users 
      WHERE LOWER(email) = ${clean}
      LIMIT 1
    `;
    if (rows && rows.length > 0) {
      return rows[0];
    }
  } catch (e) {
    console.warn('Lookup user by target warning:', e.message);
  }
  return null;
}

function formatNameFromEmail(email = '') {
  if (!email || !email.includes('@')) return '';
  const prefix = email.split('@')[0].trim();
  if (!prefix) return '';

  // 1. If it is purely numbered (e.g. 2500032027@kluniversity.in), keep the number directly as name
  if (/^\d+$/.test(prefix)) {
    return prefix;
  }

  // 2. If it is a college roll code (e.g. 21b91a05h2), keep the student roll code
  if (/\d+[a-zA-Z]+\d+/.test(prefix)) {
    return prefix.toUpperCase();
  }

  // 3. Strip trailing numbers and noise suffixes (e.g. "piggu3275" -> "piggu", "88ff", "123", "99x")
  let clean = prefix.replace(/[._\-+]?\d+[a-zA-Z0-9]*$/, '');
  if (!clean) clean = prefix.replace(/\d+/g, '');
  if (!clean) return prefix;

  // 4. Split on common delimiters
  let parts = clean
    .replace(/[._\-+]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  // 3. If there is only one part, check for common compound name suffixes
  if (parts.length === 1 && parts[0].length >= 7) {
    const word = parts[0].toLowerCase();
    const commonSuffixes = [
      'harsha', 'kumar', 'reddy', 'sharma', 'singh', 'patel', 'verma', 'gupta',
      'raju', 'rao', 'prasad', 'teja', 'krishna', 'chandra', 'varma', 'babu',
      'murthy', 'swamy', 'shekhar', 'deep', 'jeet', 'preet', 'nath', 'das'
    ];
    for (const suffix of commonSuffixes) {
      if (word.endsWith(suffix) && word.length > suffix.length + 2) {
        const first = word.slice(0, word.length - suffix.length);
        parts = [first, suffix];
        break;
      }
    }
  }

  // 4. Also check for common compound name prefixes
  if (parts.length === 1 && parts[0].length >= 7) {
    const word = parts[0].toLowerCase();
    const commonPrefixes = ['sai', 'siva', 'ram', 'devi', 'vijay', 'venkat', 'satya'];
    for (const pfx of commonPrefixes) {
      if (word.startsWith(pfx) && word.length > pfx.length + 2) {
        const rest = word.slice(pfx.length);
        parts = [pfx, rest];
        break;
      }
    }
  }

  if (parts.length === 0) {
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }

  return parts
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Dispatch real email using available provider (Gmail/SMTP, Resend, Brevo)
 */
async function dispatchRealEmail({ to, pin, name }) {
  const recipientName = name || formatNameFromEmail(to) || to.split('@')[0];
  const subject = `Your AlgoFlow Studio sign-in code: ${pin}`;
  
  // Plain-text alternative (essential for passing Gmail/Outlook spam filters)
  const textContent = `Hello ${recipientName},

Your AlgoFlow Studio one-time verification code is: ${pin}

Enter this 4-digit code in the app to complete your sign-in. This code will expire in 5 minutes.

Security Notice: Never share this PIN or forward this message to anyone. AlgoFlow Studio staff will never ask for your verification code. If you did not initiate this request, you can safely ignore this email.

— AlgoFlow Studio Security Team
https://algoflow-studio.vercel.app
`;

  // Clean, high-deliverability transactional HTML template
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AlgoFlow Verification Code</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <tr>
      <td style="background: #0f172a; padding: 24px 28px; text-align: left;">
        <span style="font-size: 22px; font-weight: 800; color: #38bdf8; letter-spacing: -0.5px;">⚡ AlgoFlow Studio</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 28px 20px 28px; color: #1e293b;">
        <h1 style="margin: 0 0 16px 0; font-size: 19px; font-weight: 700; color: #0f172a;">Sign-in Verification Code</h1>
        <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 1.5; color: #334155;">Hello <strong>${recipientName}</strong>,</p>
        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; color: #475569;">Please use the following single-use verification code to sign in to your AlgoFlow Studio account:</p>
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
          <tr>
            <td align="center" style="background: #f8fafc; border: 2px dashed #0284c7; border-radius: 10px; padding: 20px;">
              <span style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #0284c7; font-family: 'Courier New', Courier, monospace; display: inline-block; padding-left: 10px;">${pin}</span>
            </td>
          </tr>
        </table>
        
        <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
          ⏱️ <strong>Valid for 5 minutes.</strong> If you did not request this code, no further action is required; someone may have mistyped their email address.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background: #f8fafc; padding: 18px 28px; border-top: 1px solid #e2e8f0; font-size: 11.5px; color: #94a3b8; line-height: 1.5;">
        <p style="margin: 0 0 4px 0;">🛡️ <strong>Security Tip:</strong> Never share your verification code with anyone. AlgoFlow will never ask for your code via phone or chat.</p>
        <p style="margin: 0;">AlgoFlow Studio • Interactive Algorithms & B.Tech Learning Platform</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // 1. Check SMTP / Gmail via nodemailer
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER;
  const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS || process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  if (smtpUser && smtpPass) {
    const isGmail = (process.env.SMTP_HOST || '').includes('gmail') || smtpUser.includes('@gmail.com');
    const transporter = nodemailer.createTransport({
      ...(isGmail
        ? {
            service: 'gmail',
            auth: { user: smtpUser, pass: smtpPass }
          }
        : {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: smtpUser, pass: smtpPass }
          }),
      tls: {
        rejectUnauthorized: false
      }
    });

    const msgId = `<${Date.now()}.${Math.random().toString(36).substring(2, 9)}@algoflow.studio>`;

    await transporter.sendMail({
      from: `"AlgoFlow Studio" <${smtpUser}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
      headers: {
        'Message-ID': msgId,
        'X-Priority': '1 (Highest)',
        'X-MSMail-Priority': 'High',
        'Importance': 'High',
        'X-Auto-Response-Suppress': 'All',
        'Auto-Submitted': 'auto-generated',
        'Precedence': 'bulk',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      }
    });
    return { success: true, provider: 'smtp' };
  }

  // 2. Check Resend REST API
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && resendKey.startsWith('re_')) {
    const fromAddr = process.env.RESEND_FROM || 'AlgoFlow Studio <onboarding@resend.dev>';
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddr,
        to: [to],
        subject,
        text: textContent,
        html: htmlContent
      })
    });
    if (!emailRes.ok) {
      const errData = await emailRes.json().catch(() => ({}));
      throw new Error(errData.message || `Resend API failed with status ${emailRes.status}`);
    }
    return { success: true, provider: 'resend' };
  }

  // 3. Check Brevo REST API
  const brevoKey = process.env.BREVO_API_KEY;
  if (brevoKey) {
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'AlgoFlow Studio', email: process.env.BREVO_FROM || 'auth@algoflow.dev' },
        to: [{ email: to }],
        subject,
        textContent,
        htmlContent
      })
    });
    if (!emailRes.ok) {
      const errData = await emailRes.json().catch(() => ({}));
      throw new Error(errData.message || `Brevo API failed with status ${emailRes.status}`);
    }
    return { success: true, provider: 'brevo' };
  }

  throw new Error('Email delivery service is not configured in .env. Please configure SMTP_USER & SMTP_PASS (Gmail App Password) or RESEND_API_KEY to send real emails.');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Parse body
  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const action = body.action || req.query?.action || 'lookup';
  const target = (body.target || req.query?.target || '').trim();

  if (!target || !target.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  await ensureOtpTable();

  // ── 1. ACCOUNT LOOKUP (Instant Real Name Detection) ─────────────────────────
  if (action === 'lookup') {
    const existing = await findUserByTarget(target);
    if (existing) {
      return res.status(200).json({
        exists: true,
        name: existing.name,
        picture: existing.picture,
        email: existing.email,
        message: `Welcome back, ${existing.name}!`
      });
    }

    // Format human-readable suggested name from email prefix
    const suggestedName = formatNameFromEmail(target);

    return res.status(200).json({
      exists: false,
      suggestedName,
      message: 'New account. 4-digit PIN will verify your account.'
    });
  }

  // ── 2. SEND 4-DIGIT PIN ────────────────────────────────────────────────────
  if (action === 'send') {
    const isEmail = target.includes('@');
    const existing = await findUserByTarget(target);

    // Rate-limit check (cannot send faster than once every 20 seconds)
    const existingEntry = memoryOtpStore.get(target.toLowerCase());
    if (existingEntry && (Date.now() - existingEntry.createdAt) < 20000) {
      const waitSec = Math.ceil((20000 - (Date.now() - existingEntry.createdAt)) / 1000);
      return res.status(429).json({
        error: `Please wait ${waitSec} seconds before requesting a new PIN.`
      });
    }

    // Generate secure 4-digit numeric PIN (1000 - 9999)
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store in memory
    memoryOtpStore.set(target.toLowerCase(), {
      pin,
      attempts: 0,
      expiresAt: expiresAt.getTime(),
      createdAt: Date.now()
    });

    // Store in Neon DB
    try {
      await sql`
        INSERT INTO otp_verifications (target, pin, attempts, expires_at)
        VALUES (${target.toLowerCase()}, ${pin}, 0, ${expiresAt.toISOString()})
        ON CONFLICT (target)
        DO UPDATE SET
          pin = EXCLUDED.pin,
          attempts = 0,
          expires_at = EXCLUDED.expires_at,
          created_at = (NOW() AT TIME ZONE 'Asia/Kolkata')
      `;
    } catch (e) {
      console.warn('DB OTP save notice:', e.message);
    }

    // Dispatch REAL Email to user-entered address
    if (isEmail) {
      try {
        await dispatchRealEmail({
          to: target,
          pin,
          name: existing?.name || null
        });
      } catch (err) {
        console.error(`❌ Email dispatch failed for ${target}:`, err.message);
        return res.status(500).json({
          error: `Failed to send email to ${target}: ${err.message}`
        });
      }
    }

    // Terminal log for local server diagnosis ONLY (never sent to client/display)
    console.log(`\n=========================================`);
    console.log(`📬 [AlgoFlow OTP] Real Email dispatched for ${target}`);
    console.log(`=========================================\n`);

    const derivedName = isEmail ? formatNameFromEmail(target) : null;
    const recipientName = existing?.name || derivedName;

    return res.status(200).json({
      success: true,
      target,
      isEmail,
      recipientName,
      expiresIn: 300,
      message: recipientName 
        ? `Verification code sent to ${target} for ${recipientName}!`
        : `Verification code sent to ${target}!`
    });
  }

  // ── 3. VERIFY 4-DIGIT PIN ──────────────────────────────────────────────────
  if (action === 'verify') {
    const inputPin = (body.pin || '').trim();
    const displayName = (body.name || '').trim();

    if (!inputPin || inputPin.length !== 4) {
      return res.status(400).json({ error: 'Please enter a valid 4-digit PIN.' });
    }

    // Retrieve active OTP record (check memory first, then DB)
    let storedPin = null;
    let attempts = 0;
    let isExpired = false;

    const mem = memoryOtpStore.get(target.toLowerCase());
    if (mem) {
      storedPin = mem.pin;
      attempts = mem.attempts;
      isExpired = Date.now() > mem.expiresAt;
    } else {
      try {
        const rows = await sql`
          SELECT pin, attempts, expires_at 
          FROM otp_verifications 
          WHERE target = ${target.toLowerCase()}
          LIMIT 1
        `;
        if (rows && rows.length > 0) {
          storedPin = rows[0].pin;
          attempts = rows[0].attempts || 0;
          isExpired = new Date(rows[0].expires_at).getTime() < Date.now();
        }
      } catch (e) {
        console.warn('DB OTP lookup error:', e.message);
      }
    }

    if (!storedPin) {
      return res.status(400).json({ error: 'No active PIN found for this address. Please request a new one.' });
    }

    if (isExpired) {
      memoryOtpStore.delete(target.toLowerCase());
      return res.status(400).json({ error: 'This 4-digit PIN has expired. Please request a new PIN.' });
    }

    if (attempts >= 3) {
      memoryOtpStore.delete(target.toLowerCase());
      return res.status(429).json({ error: 'Too many incorrect attempts (maximum 3). Please request a new PIN.' });
    }

    // Match verification
    if (storedPin !== inputPin) {
      const newAttempts = attempts + 1;
      if (mem) mem.attempts = newAttempts;
      try {
        await sql`
          UPDATE otp_verifications 
          SET attempts = ${newAttempts} 
          WHERE target = ${target.toLowerCase()}
        `;
      } catch {}

      const remaining = 3 - newAttempts;
      return res.status(400).json({
        error: `Incorrect 4-digit PIN. ${remaining > 0 ? `${remaining} attempt(s) left.` : 'Lockout: please request a new PIN.'}`
      });
    }

    // Successful Verification! Clean up OTP record
    memoryOtpStore.delete(target.toLowerCase());
    try {
      await sql`DELETE FROM otp_verifications WHERE target = ${target.toLowerCase()}`;
    } catch {}

    // Find or Upsert user in Neon DB
    let user = await findUserByTarget(target);
    let isNewUser = !user;
    let wasRestored = false;

    // Check if user had a pending deactivation
    if (user && (user.status === 'pending_deletion' || user.deactivation_scheduled_at)) {
      const isExpired = user.deactivation_scheduled_at && new Date(user.deactivation_scheduled_at).getTime() < Date.now();
      if (isExpired) {
        // 7 days have passed: permanent deletion fulfilled, start completely fresh
        try {
          await sql`DELETE FROM users WHERE LOWER(email) = ${target.toLowerCase()}`;
        } catch {}
        user = null;
        isNewUser = true;
      } else {
        // Logged back in within 7 days: cancel deactivation and restore account!
        try {
          await sql`
            UPDATE users 
            SET status = 'active', deactivation_scheduled_at = NULL 
            WHERE LOWER(email) = ${target.toLowerCase()}
          `;
          await sql`
            UPDATE account_deactivations 
            SET status = 'cancelled', notes = 'Deactivation cancelled by user logging in within 7-day grace period'
            WHERE LOWER(email) = ${target.toLowerCase()} AND status = 'pending_deletion'
          `;
        } catch {}
        wasRestored = true;
      }
    }

    const finalName = displayName || user?.name || (target.includes('@') ? formatNameFromEmail(target) : target);

    try {
      const isEmail = target.includes('@');
      const emailField = isEmail ? target.toLowerCase() : `${target.replace(/\D/g, '')}@phone.algoflow.internal`;

      const rows = await sql`
        INSERT INTO users (email, name, role, last_login, status)
        VALUES (${emailField}, ${finalName}, 'user', (NOW() AT TIME ZONE 'Asia/Kolkata'), 'active')
        ON CONFLICT (email)
        DO UPDATE SET
          name = COALESCE(NULLIF(${finalName}, ''), users.name),
          last_login = (NOW() AT TIME ZONE 'Asia/Kolkata'),
          status = 'active',
          deactivation_scheduled_at = NULL
        RETURNING id, email, name, picture, role, created_at, last_login, status
      `;
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } catch (dbErr) {
      console.warn('User upsert fallback:', dbErr.message);
      user = {
        id: Date.now(),
        email: target,
        name: finalName,
        picture: null,
        role: 'user',
        status: 'active'
      };
    }

    const welcomeMsg = wasRestored 
      ? `Welcome back, ${user.name || finalName}! Your 7-day deactivation was cancelled and your account is restored.`
      : `Successfully verified as ${user.name || finalName}!`;

    return res.status(200).json({
      success: true,
      isNewUser,
      wasRestored,
      user: {
        id: user.id || 1,
        email: user.email || target,
        name: user.name || finalName,
        picture: user.picture || null,
        role: user.role || 'user',
        authProvider: 'otp_pin',
        connectedAt: new Date().toISOString()
      },
      message: welcomeMsg
    });
  }

  // ── 4. DEACTIVATE / DELETE ACCOUNT (7-Day Grace Period) ──────────────────────
  if (action === 'deactivate') {
    const reason = (body.reason || 'User requested account deactivation / name reset').trim();
    const displayName = (body.name || '').trim();

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
          notes TEXT
        )
      `;

      try {
        await sql`ALTER TABLE account_deactivations ADD COLUMN IF NOT EXISTS scheduled_deletion_at TIMESTAMP WITHOUT TIME ZONE DEFAULT ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days')`;
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'`;
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivation_scheduled_at TIMESTAMP WITHOUT TIME ZONE`;
      } catch {}

      let existingName = displayName;
      const user = await findUserByTarget(target);
      if (user && user.name) {
        existingName = user.name;
      }

      await sql`
        INSERT INTO account_deactivations (email, name, reason, status, notes, scheduled_deletion_at)
        VALUES (
          ${target.toLowerCase()},
          ${existingName || null},
          ${reason},
          'pending_deletion',
          'Account scheduled for deactivation with 7-day grace period',
          ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days')
        )
      `;

      await sql`
        UPDATE users 
        SET status = 'pending_deletion', 
            deactivation_scheduled_at = ((NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '7 days')
        WHERE LOWER(email) = ${target.toLowerCase()}
      `;

      memoryOtpStore.delete(target.toLowerCase());
      try {
        await sql`DELETE FROM otp_verifications WHERE LOWER(target) = ${target.toLowerCase()}`;
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
      return res.status(500).json({ error: `Failed to deactivate account: ${err.message}` });
    }
  }

  return res.status(400).json({ error: 'Unsupported action.' });
}
