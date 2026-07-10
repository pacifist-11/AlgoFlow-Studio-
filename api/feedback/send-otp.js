import sql from '../_db.js';
import { cors } from '../_cors.js';
import { getTransporter, otpEmailHtml } from '../_mailer.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    await sql`
      INSERT INTO otps (email, otp, expires_at)
      VALUES (${cleanEmail}, ${otp}, ${expiresAt})
      ON CONFLICT (email) DO UPDATE SET otp = ${otp}, expires_at = ${expiresAt}
    `;
  } catch (dbErr) {
    console.error('❌ Failed to store feedback OTP:', dbErr.message);
    return res.status(500).json({ error: 'Failed to generate verification code.' });
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Algorithm Studio Support" <${process.env.SMTP_USER}>`,
      to: cleanEmail,
      subject: '🔑 Your Verification Code - Algorithm Visualizer Studio',
      html: otpEmailHtml(otp, 'Secure Review & Feedback Verification'),
    });
    console.log(`📧 Feedback OTP sent to ${cleanEmail}`);
    return res.json({ message: 'A verification code has been sent to your email.' });
  } catch (err) {
    console.error('❌ SMTP failure:', err.message);
    return res.status(500).json({ error: 'Failed to deliver OTP email.', details: err.message });
  }
}
