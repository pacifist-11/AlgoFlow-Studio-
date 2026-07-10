import sql from '../_db.js';
import { cors } from '../_cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Missing email or OTP verification code.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const rows = await sql`SELECT otp, expires_at FROM otps WHERE email = ${cleanEmail}`;

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Verification session expired. Please request a new OTP code.' });
    }

    const { otp: storedOtp, expires_at } = rows[0];

    if (new Date() > new Date(expires_at)) {
      await sql`DELETE FROM otps WHERE email = ${cleanEmail}`;
      return res.status(400).json({ error: 'The code entered has expired. Please request a new OTP.' });
    }

    if (storedOtp !== otp.trim()) {
      return res.status(400).json({ error: 'Incorrect verification code. Please check your email and try again.' });
    }

    // OTP verified — delete it and upsert user
    await sql`DELETE FROM otps WHERE email = ${cleanEmail}`;
    await sql`
      INSERT INTO users (email, role) VALUES (${cleanEmail}, 'user')
      ON CONFLICT (email) DO NOTHING
    `;

    console.log(`✅ OTP verified and user upserted: ${cleanEmail}`);
    return res.json({ success: true, email: cleanEmail, role: 'user' });
  } catch (err) {
    console.error('❌ DB error during OTP verify:', err.message);
    return res.status(500).json({ error: 'Internal server/database error.' });
  }
}
