import express from 'express';
import cors from 'cors';
import pg from 'pg';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize PostgreSQL Client Pool
const { Pool } = pg;
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'tvfixed_db',
  password: process.env.PGPASSWORD || 'postgres',
  port: parseInt(process.env.PGPORT || '5432'),
});

// Cache map for pending OTPs (key: email, value: { otp, expires })
const otpStore = new Map();

// Verify PostgreSQL connection and initialize table automatically
pool.connect((err, client, release) => {
  if (err) {
    console.error('\n❌ PostgreSQL Connection Error!');
    console.error('Please ensure:\n1. Your PostgreSQL server is running.');
    console.error('2. You created the database matching PGDATABASE in your .env (default: tvfixed_db).');
    console.error('3. Your .env database connection username/password is correct.\n');
    console.error('Database connection parameters attempted:', {
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'tvfixed_db',
      port: process.env.PGPORT || '5432',
    });
  } else {
    console.log('🔌 Successfully connected to PostgreSQL database!');
    release();

    // Auto-create feedbacks table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        category VARCHAR(100) NOT NULL,
        feedback_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    pool.query(createTableQuery)
      .then(() => console.log('📂 PostgreSQL "feedbacks" database table is active.'))
      .catch(e => console.error('❌ Failed to auto-create database tables:', e.message));
  }
});

// Configure Nodemailer transporter based on .env
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ── API 1: Generate & Send Email OTP ──
app.post('/api/feedback/send-otp', async (req, res) => {
  const { email } = req.req ? req.req.body : req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Generate 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

  // Store in memory cache
  otpStore.set(email.toLowerCase().trim(), { otp, expires: expiry });

  console.log(`Generated OTP for ${email}: ${otp}`);

  try {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: `"Algorithm Studio Support" <${process.env.SMTP_USER}>`,
      to: email.trim(),
      subject: '🔑 Your Verification Code - Algorithm Visualizer Studio',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 2rem; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <h1 style="color: #60a5fa; font-size: 1.8rem; margin: 0; font-weight: 800; background: linear-gradient(to right, #60a5fa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Algorithm Studio</h1>
            <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 5px;">Secure Review & Feedback Verification</p>
          </div>
          
          <div style="background-color: rgba(30, 41, 59, 0.6); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
            <p style="color: #cbd5e1; font-size: 1rem; margin-top: 0;">Use the following One-Time Password (OTP) to verify your email address and submit your feedback:</p>
            <h2 style="font-size: 2.5rem; letter-spacing: 6px; color: #fbbf24; margin: 1.2rem 0; font-family: monospace; font-weight: bold; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; border: 1px dashed rgba(251,191,36,0.3);">${otp}</h2>
            <p style="color: #94a3b8; font-size: 0.8rem; margin-bottom: 0;">⚠️ This code is active for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
          </div>
          
          <div style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.2rem; text-align: center; color: #64748b; font-size: 0.75rem;">
            <p>If you did not request this code, you can safely ignore this email.</p>
            <p>© ${new Date().getFullYear()} Algorithm Visualizer Studio. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 OTP email delivered successfully to ${email}`);
    res.json({ message: 'A verification code has been sent to your email.' });
  } catch (error) {
    console.error('❌ Nodemailer/SMTP Delivery Failure:', error.message);
    res.status(500).json({ 
      error: 'Failed to deliver OTP email. Please ensure your SMTP configuration in .env is correct.', 
      details: error.message 
    });
  }
});

// ── API 2: Verify OTP and Save Feedback directly to PostgreSQL ──
app.post('/api/feedback/verify-and-submit', async (req, res) => {
  const { email, otp, rating, category, text } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Missing email or OTP verification code.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cached = otpStore.get(cleanEmail);

  if (!cached) {
    return res.status(400).json({ error: 'Verification session expired. Please request a new OTP code.' });
  }

  if (Date.now() > cached.expires) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({ error: 'The code entered has expired. Please request a new OTP.' });
  }

  if (cached.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Incorrect verification code. Please check your email and try again.' });
  }

  // OTP verified! Remove it from cache
  otpStore.delete(cleanEmail);

  // Insert feedback into PostgreSQL
  const insertQuery = `
    INSERT INTO feedbacks (email, rating, category, feedback_text)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [cleanEmail, parseInt(rating) || 5, category || 'UI/UX Design', text || ''];

  try {
    const dbResult = await pool.query(insertQuery, values);
    console.log('💾 Successfully saved user feedback to PostgreSQL database!', dbResult.rows[0]);
    res.json({ success: true, feedback: dbResult.rows[0] });
  } catch (dbError) {
    console.error('❌ PostgreSQL Insertion Failure:', dbError.message);
    res.status(500).json({ error: 'Internal Database insertion failure.', details: dbError.message });
  }
});

// ── API 3: Verify Developer PIN ──
app.post('/api/admin/verify-pin', (req, res) => {
  const { pin } = req.body;
  const configPin = process.env.ADMIN_PIN || '1234';

  if (!pin) {
    return res.status(400).json({ error: 'Please enter a PIN.' });
  }

  if (pin.trim() === configPin.trim()) {
    res.json({ success: true, message: 'Access granted!' });
  } else {
    res.status(401).json({ error: 'Incorrect developer PIN. Access denied.' });
  }
});

// ── API 4: Get All Feedbacks from PostgreSQL (Secured by PIN check) ──
app.get('/api/admin/feedbacks', async (req, res) => {
  const authHeader = req.headers.authorization;
  const configPin = process.env.ADMIN_PIN || '1234';

  if (!authHeader || authHeader !== configPin) {
    return res.status(403).json({ error: 'Unauthorized security check. Invalid Developer credentials.' });
  }

  const query = 'SELECT * FROM feedbacks ORDER BY created_at DESC;';

  try {
    const dbResult = await pool.query(query);
    res.json(dbResult.rows);
  } catch (dbError) {
    console.error('❌ Failed to retrieve feedbacks from database:', dbError.message);
    res.status(500).json({ error: 'Failed to retrieve logs from PostgreSQL.', details: dbError.message });
  }
});

// ── API 5: Clear All Feedbacks (Secured by PIN check) ──
app.delete('/api/admin/clear', async (req, res) => {
  const authHeader = req.headers.authorization;
  const configPin = process.env.ADMIN_PIN || '1234';

  if (!authHeader || authHeader !== configPin) {
    return res.status(403).json({ error: 'Unauthorized security check. Access denied.' });
  }

  const query = 'TRUNCATE TABLE feedbacks RESTART IDENTITY;';

  try {
    await pool.query(query);
    console.log('🗑️ PostgreSQL "feedbacks" table truncated successfully.');
    res.json({ message: 'All feedback logs cleared successfully!' });
  } catch (dbError) {
    console.error('❌ Failed to truncate database table:', dbError.message);
    res.status(500).json({ error: 'Failed to delete records from database.', details: dbError.message });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`\n🚀 Backend Server actively listening at http://localhost:${PORT}`);
  console.log('💡 Press Ctrl+C to stop the server.\n');
});
