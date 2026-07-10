import sql from './_db.js';
import { cors } from './_cors.js';

/**
 * ONE-TIME SETUP ENDPOINT
 * Creates only the tables needed:
 *   - feedbacks  → stores user feedback (the main DB purpose)
 *   - otps       → temporary OTP codes for email verification (serverless-safe)
 *
 * Call once after first deploy:
 *   curl -X POST https://your-vercel-url/api/setup-db \
 *     -H "Authorization: YOUR_ADMIN_PIN"
 */
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  const configPin = process.env.ADMIN_PIN || 'Irctc@11';

  if (!authHeader || authHeader !== configPin) {
    return res.status(403).json({ error: 'Unauthorized. Provide ADMIN_PIN in Authorization header.' });
  }

  try {
    // 1. Feedbacks — the primary purpose of Neon in this project
    await sql`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        category VARCHAR(100) NOT NULL DEFAULT 'UI/UX Design',
        feedback_text TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // 2. OTPs — temporary storage for email verification codes (serverless-safe)
    await sql`
      CREATE TABLE IF NOT EXISTS otps (
        email VARCHAR(255) PRIMARY KEY,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL
      )
    `;

    console.log('✅ Neon tables initialized: feedbacks, otps');
    return res.json({
      success: true,
      message: 'Neon database ready!',
      tables: {
        feedbacks: 'Stores user feedback — main purpose',
        otps: 'Temporary OTP codes for email login (auto-cleared after use)',
      },
    });
  } catch (err) {
    console.error('❌ DB init error:', err.message);
    return res.status(500).json({ error: 'Failed to initialize database.', details: err.message });
  }
}
