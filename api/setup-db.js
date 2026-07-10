import sql from './_db.js';
import { cors } from './_cors.js';

/**
 * ONE-TIME SETUP — Creates the Neon feedbacks table.
 *
 * Run once after first deploy:
 *   curl -X POST https://your-vercel-url/api/setup-db \
 *     -H "Authorization: Irctc@11"
 */
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  const configPin = process.env.ADMIN_PIN || 'Irctc@11';

  if (!authHeader || authHeader !== configPin) {
    return res.status(403).json({ error: 'Unauthorized. Send ADMIN_PIN in Authorization header.' });
  }

  try {
    // feedbacks — the ONLY table in Neon
    await sql`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL DEFAULT 'anonymous',
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        category VARCHAR(100) NOT NULL DEFAULT 'General',
        feedback_text TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    console.log('✅ Neon feedbacks table ready.');
    return res.json({
      success: true,
      message: 'Neon database ready! feedbacks table created.',
    });
  } catch (err) {
    console.error('❌ DB setup error:', err.message);
    return res.status(500).json({ error: 'Failed to initialize database.', details: err.message });
  }
}
