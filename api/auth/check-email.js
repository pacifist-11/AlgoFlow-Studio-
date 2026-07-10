import sql from '../_db.js';
import { cors } from '../_cors.js';
import { getTransporter, otpEmailHtml } from '../_mailer.js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'pothalayeswanth11@gmail.com').toLowerCase();

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Admin → request password directly
  if (cleanEmail === ADMIN_EMAIL) {
    return res.json({ action: 'password', email: cleanEmail });
  }

  // Everyone else → generate OTP, store in Neon, send email
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  try {
    await sql`
      INSERT INTO otps (email, otp, expires_at)
      VALUES (${cleanEmail}, ${otp}, ${expiresAt})
      ON CONFLICT (email) DO UPDATE SET otp = ${otp}, expires_at = ${expiresAt}
    `;
  } catch (dbErr) {
    console.error('❌ Failed to store OTP in Neon:', dbErr.message);
    return res.status(500).json({ error: 'Failed to generate verification code.' });
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Algorithm Studio Support" <${process.env.SMTP_USER}>`,
      to: cleanEmail,
      subject: '🔑 Your Login Verification Code - Algorithm Visualizer Studio',
      html: otpEmailHtml(otp, 'Secure Login Verification'),
    });
    console.log(`📧 Login OTP sent to ${cleanEmail}`);
    return res.json({ action: 'otp', email: cleanEmail, message: 'A verification code has been sent to your email.' });
  } catch (mailErr) {
    console.error('❌ SMTP failure:', mailErr.message);
    return res.json({
      action: 'otp',
      email: cleanEmail,
      message: 'Verification code generated. (SMTP issue — check server logs.)',
      warning: 'SMTP delivery failed.',
      otp, // dev fallback only
    });
  }
}
