import sql from '../_db.js';
import { cors } from '../_cors.js';

/**
 * Direct feedback submission — no auth, no OTP, no login required.
 * Just saves whatever the user typed straight to Neon feedbacks table.
 */
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, rating, category, text } = req.body;

  const ratingInt = parseInt(rating);
  if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    return res.status(400).json({ error: 'Please select a star rating (1-5).' });
  }

  const cleanEmail = (email || 'anonymous').toLowerCase().trim();
  const feedbackCategory = category || 'General';
  const feedbackText = text || '';

  try {
    const rows = await sql`
      INSERT INTO feedbacks (email, rating, category, feedback_text)
      VALUES (${cleanEmail}, ${ratingInt}, ${feedbackCategory}, ${feedbackText})
      RETURNING *
    `;

    console.log('💾 Feedback saved to Neon:', rows[0].id);
    return res.json({ success: true, feedback: rows[0] });
  } catch (err) {
    console.error('❌ Neon insert failed:', err.message);
    return res.status(500).json({ error: 'Failed to save feedback.', details: err.message });
  }
}
