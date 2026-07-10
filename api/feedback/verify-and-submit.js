import sql from '../_db.js';
import { cors } from '../_cors.js';
import { getTransporter } from '../_mailer.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'pothalayeswanth11@gmail.com';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp, rating, category, text } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Missing email or OTP verification code.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // 1. Verify OTP from Neon
    const otpRows = await sql`SELECT otp, expires_at FROM otps WHERE email = ${cleanEmail}`;
    if (otpRows.length === 0) {
      return res.status(400).json({ error: 'Verification session expired. Please request a new OTP code.' });
    }

    const { otp: storedOtp, expires_at } = otpRows[0];
    if (new Date() > new Date(expires_at)) {
      await sql`DELETE FROM otps WHERE email = ${cleanEmail}`;
      return res.status(400).json({ error: 'The code entered has expired. Please request a new OTP.' });
    }

    if (storedOtp !== otp.trim()) {
      return res.status(400).json({ error: 'Incorrect verification code. Please check your email and try again.' });
    }

    // 2. Delete used OTP
    await sql`DELETE FROM otps WHERE email = ${cleanEmail}`;

    // 3. Validate rating
    const ratingInt = parseInt(rating);
    if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
      return res.status(400).json({ error: 'Selecting a star rating is compulsory.' });
    }

    const feedbackCategory = category || 'UI/UX Design';
    const feedbackText = text || '';

    // 4. Insert feedback into Neon
    const feedbackRows = await sql`
      INSERT INTO feedbacks (email, rating, category, feedback_text)
      VALUES (${cleanEmail}, ${ratingInt}, ${feedbackCategory}, ${feedbackText})
      RETURNING *
    `;
    const feedback = feedbackRows[0];
    console.log('💾 OTP-verified feedback saved to Neon:', feedback.id);

    // 5. Notify admin
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"Algorithm Studio Support" <${process.env.SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: `📝 New Feedback Received — Rating: ${rating}⭐`,
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #e2e8f0;border-radius:12px;max-width:600px;background:#f8fafc;color:#1f2937;">
            <h2 style="color:#3b82f6;">New User Feedback!</h2>
            <p><strong>Email:</strong> ${cleanEmail}</p>
            <p><strong>Category:</strong> ${feedbackCategory}</p>
            <p><strong>Rating:</strong> ${rating} / 5 ⭐</p>
            <div style="margin-top:16px;padding:14px;background:#fff;border-left:4px solid #3b82f6;border-radius:4px;">
              <p style="white-space:pre-wrap;margin:0;line-height:1.5;">${feedbackText || '<em>(No comment provided)</em>'}</p>
            </div>
          </div>
        `,
      });
      console.log('📧 Admin feedback notification sent.');
    } catch (mailErr) {
      console.error('❌ Admin email failed:', mailErr.message);
    }

    return res.json({ success: true, feedback });
  } catch (err) {
    console.error('❌ verify-and-submit error:', err.message);
    return res.status(500).json({ error: 'Internal Database insertion failure.', details: err.message });
  }
}
