import sql from '../_db.js';
import { cors } from '../_cors.js';
import { getTransporter } from '../_mailer.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'pothalayeswanth11@gmail.com';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, rating, category, text } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email address.' });

  const ratingInt = parseInt(rating);
  if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    return res.status(400).json({ error: 'Selecting a star rating is compulsory.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const feedbackCategory = category || 'UI/UX Design';
  const feedbackText = text || '';

  try {
    const rows = await sql`
      INSERT INTO feedbacks (email, rating, category, feedback_text)
      VALUES (${cleanEmail}, ${ratingInt}, ${feedbackCategory}, ${feedbackText})
      RETURNING *
    `;
    const feedback = rows[0];
    console.log('💾 Direct feedback saved to Neon:', feedback.id);

    // Notify admin — fire and forget
    try {
      const transporter = getTransporter();
      transporter.sendMail({
        from: `"Algorithm Studio Support" <${process.env.SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: `📝 New Feedback (Direct) — Rating: ${rating}⭐`,
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #e2e8f0;border-radius:12px;max-width:600px;background:#f8fafc;color:#1f2937;">
            <h2 style="color:#3b82f6;margin-top:0;">New User Feedback Received!</h2>
            <hr style="border:0;border-top:1px solid #e2e8f0;margin-bottom:20px;"/>
            <p><strong>User:</strong> ${cleanEmail}</p>
            <p><strong>Category:</strong> ${feedbackCategory}</p>
            <p><strong>Rating:</strong> ${rating} / 5 ⭐</p>
            <div style="margin-top:16px;padding:14px;background:#fff;border-left:4px solid #3b82f6;border-radius:4px;">
              <p style="margin:0;font-weight:bold;color:#4b5563;margin-bottom:8px;">Message:</p>
              <p style="margin:0;white-space:pre-wrap;line-height:1.5;">${feedbackText || '<em>(No comment provided)</em>'}</p>
            </div>
          </div>
        `,
      }).catch(e => console.error('❌ Admin notification email failed:', e.message));
    } catch (mailErr) {
      console.error('❌ Transporter init failed:', mailErr.message);
    }

    return res.json({ success: true, feedback });
  } catch (err) {
    console.error('❌ Neon feedback insert failed:', err.message);
    return res.status(500).json({ error: 'Internal Database insertion failure.' });
  }
}
