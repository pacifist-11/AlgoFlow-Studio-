import sql from './_db.js';
import { cors } from './_cors.js';

/**
 * ONE-TIME SETUP ENDPOINT
 * Call once after deploying to create all Neon database tables.
 * 
 * Usage:
 *   curl -X POST https://your-vercel-url/api/setup-db \
 *     -H "Authorization: YOUR_ADMIN_PIN"
 * 
 * Secured by ADMIN_PIN env var.
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
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // OTPs table (serverless-safe — stored in DB instead of memory)
    await sql`
      CREATE TABLE IF NOT EXISTS otps (
        email VARCHAR(255) PRIMARY KEY,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL
      )
    `;

    // User progress/state table
    await sql`
      CREATE TABLE IF NOT EXISTS user_states (
        email VARCHAR(255) PRIMARY KEY,
        state_data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Feedback table
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

    console.log('✅ All Neon tables initialized successfully.');
    return res.json({
      success: true,
      message: 'All Neon database tables initialized successfully!',
      tables: ['users', 'otps', 'user_states', 'feedbacks'],
    });
  } catch (err) {
    console.error('❌ DB init error:', err.message);
    return res.status(500).json({ error: 'Failed to initialize database.', details: err.message });
  }
}
