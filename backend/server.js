import express from 'express';
import cors from 'cors';
import pg from 'pg';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize PostgreSQL Client Pool
const { Pool } = pg;
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'AlgoFlow-Studio',
      password: process.env.PGPASSWORD || 'Irctc@11',
      port: parseInt(process.env.PGPORT || '5432'),
    });

// Cache map for pending OTPs (key: email, value: { otp, expires })
const otpStore = new Map();

// Verify PostgreSQL connection and initialize table automatically
pool.connect((err, client, release) => {
  if (err) {
    console.error('\n❌ PostgreSQL Connection Error!');
    console.error('Please ensure:\n1. Your PostgreSQL server is running.');
    console.error('2. You created the database matching PGDATABASE in your .env (default: AlgoFlow-Studio).');
    console.error('3. Your .env database connection username/password is correct.\n');
    console.error('Database connection parameters attempted:', {
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'AlgoFlow-Studio',
      port: process.env.PGPORT || '5432',
    });
  } else {
    console.log('🔌 Successfully connected to PostgreSQL database!');
    release();

    // Auto-create database tables if not exist
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        category VARCHAR(100) NOT NULL,
        feedback_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_states (
        email VARCHAR(255) PRIMARY KEY,
        state_data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    pool.query(createTablesQuery)
      .then(() => {
        console.log('📂 PostgreSQL database tables are active.');
        // Seed default admin account
        const seedAdminQuery = `
          INSERT INTO users (email, password, role)
          VALUES ('pothalayeswanth11@gmail.com', 'Irctc@11', 'admin')
          ON CONFLICT (email) DO NOTHING;
        `;
        return pool.query(seedAdminQuery);
      })
      .then(() => console.log('👤 Admin account seeded or verified in database.'))
      .catch(e => console.error('❌ Failed to auto-create database tables or seed admin:', e.message));
  }
});

// Configure Nodemailer transporter based on .env
const getTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || '465');
  const isSecure = process.env.SMTP_SECURE !== undefined 
    ? (process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === true)
    : port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ── Auth API 1: Check Email ──
app.post('/api/auth/check-email', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // If the email is the admin email
    if (cleanEmail === 'pothalayeswanth11@gmail.com') {
      // Admin logging in -> request password
      return res.json({ action: 'password', email: cleanEmail });
    }

    // Others logging in -> generate and send OTP
    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    // Store in memory cache
    otpStore.set(cleanEmail, { otp, expires: expiry });

    console.log(`Generated Login OTP for ${cleanEmail}: ${otp}`);

    try {
      const transporter = getTransporter();
      const mailOptions = {
        from: `"Algorithm Studio Support" <${process.env.SMTP_USER}>`,
        to: cleanEmail,
        subject: '🔑 Your Login Verification Code - Algorithm Visualizer Studio',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 2rem; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <h1 style="color: #60a5fa; font-size: 1.8rem; margin: 0; font-weight: 800; background: linear-gradient(to right, #60a5fa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Algorithm Studio</h1>
              <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 5px;">Secure Login Verification</p>
            </div>
            
            <div style="background-color: rgba(30, 41, 59, 0.6); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="color: #cbd5e1; font-size: 1rem; margin-top: 0;">Use the following One-Time Password (OTP) to log into your account:</p>
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
      console.log(`📧 Login OTP email delivered successfully to ${cleanEmail}`);
      res.json({ action: 'otp', email: cleanEmail, message: 'A verification code has been sent to your email.' });
    } catch (error) {
      console.error('❌ Nodemailer/SMTP Delivery Failure:', error.message);
      // Fallback response so they can test using the console log
      res.json({ 
        action: 'otp', 
        email: cleanEmail, 
        message: 'A verification code has been generated. (SMTP configuration issue, check console if in local testing mode).',
        warning: 'SMTP delivery failed.',
        otp: otp
      });
    }
  } catch (dbError) {
    console.error('❌ Database error during email check:', dbError.message);
    res.status(500).json({ error: 'Internal server/database error.' });
  }
});

// ── Auth API 2: Verify OTP ──
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
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

  // OTP verified! Remove from cache
  otpStore.delete(cleanEmail);

  try {
    // Create user if not exists
    await pool.query(
      'INSERT INTO users (email, role) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
      [cleanEmail, 'user']
    );

    res.json({ success: true, email: cleanEmail, role: 'user' });
  } catch (dbError) {
    console.error('❌ Database error during OTP login:', dbError.message);
    res.status(500).json({ error: 'Internal server/database error.' });
  }
});

// ── Auth API 3: Login Admin ──
app.post('/api/auth/login-admin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  if (cleanEmail !== 'pothalayeswanth11@gmail.com') {
    return res.status(403).json({ error: 'Unauthorized access.' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Admin account not seeded.' });
    }

    const adminUser = userResult.rows[0];
    if (adminUser.password === password) {
      res.json({ success: true, email: cleanEmail, role: 'admin' });
    } else {
      res.status(401).json({ error: 'Incorrect admin password.' });
    }
  } catch (dbError) {
    console.error('❌ Database error during admin password check:', dbError.message);
    res.status(500).json({ error: 'Internal database error.' });
  }
});

// ── User State API 1: Save State ──
app.post('/api/user/save-state', async (req, res) => {
  const { email, state_data } = req.body;
  if (!email || !state_data) {
    return res.status(400).json({ error: 'Missing email or state data.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const query = `
      INSERT INTO user_states (email, state_data, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (email)
      DO UPDATE SET state_data = $2, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const dbResult = await pool.query(query, [cleanEmail, state_data]);
    res.json({ success: true, updated: dbResult.rows[0] });
  } catch (dbError) {
    console.error('❌ Failed to save user state:', dbError.message);
    res.status(500).json({ error: 'Failed to save progress to database.', details: dbError.message });
  }
});

// ── User State API 2: Load State ──
app.get('/api/user/load-state', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Missing email parameter.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const dbResult = await pool.query('SELECT * FROM user_states WHERE email = $1', [cleanEmail]);
    if (dbResult.rows.length > 0) {
      res.json({ success: true, state_data: dbResult.rows[0].state_data });
    } else {
      res.json({ success: true, state_data: null });
    }
  } catch (dbError) {
    console.error('❌ Failed to load user state:', dbError.message);
    res.status(500).json({ error: 'Failed to retrieve progress from database.', details: dbError.message });
  }
});

// ── Feedback API: Direct Submit (Bypass OTP for logged-in users) ──
app.post('/api/feedback/submit-direct', async (req, res) => {
  const { email, rating, category, text } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Missing email address.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  const insertQuery = `
    INSERT INTO feedbacks (email, rating, category, feedback_text)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [cleanEmail, parseInt(rating) || 5, category || 'UI/UX Design', text || ''];

  try {
    const dbResult = await pool.query(insertQuery, values);
    console.log('💾 Successfully saved direct user feedback to database!', dbResult.rows[0]);

    // Send copy to admin (in background, do not await to avoid delaying the user response)
    try {
      const transporter = getTransporter();
      const mailOptions = {
        from: `"Algorithm Studio Support" <${process.env.SMTP_USER}>`,
        to: 'pothalayeswanth11@gmail.com',
        subject: `📝 New Feedback (Direct) Received - Rating: ${rating} Stars`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; background-color: #f8fafc; color: #1f2937;">
            <h2 style="color: #3b82f6; margin-top: 0;">New User Feedback Received!</h2>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
            <p style="margin: 8px 0;"><strong>User Email:</strong> ${cleanEmail}</p>
            <p style="margin: 8px 0;"><strong>Category:</strong> ${category}</p>
            <p style="margin: 8px 0;"><strong>Rating:</strong> ${rating} / 5 Stars</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #3b82f6; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <p style="margin: 0; font-weight: bold; color: #4b5563; margin-bottom: 8px;">Message:</p>
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.5;">${text || '<em>(No comment provided)</em>'}</p>
            </div>
          </div>
        `
      };
      transporter.sendMail(mailOptions).catch(mailErr => {
        console.error('❌ Failed to send feedback copy to admin:', mailErr.message);
      });
    } catch (transporterErr) {
      console.error('❌ Failed to initialize transporter:', transporterErr.message);
    }

    res.json({ success: true, feedback: dbResult.rows[0] });
  } catch (dbError) {
    console.error('❌ Database direct feedback insertion failure:', dbError.message);
    res.status(500).json({ error: 'Internal Database insertion failure.' });
  }
});

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

    // Send email copy to developer pothalayeswanth11@gmail.com
    try {
      const transporter = getTransporter();
      const mailOptions = {
        from: `"Algorithm Studio Support" <${process.env.SMTP_USER}>`,
        to: 'pothalayeswanth11@gmail.com',
        subject: `📝 New Feedback Received - Rating: ${rating} Stars`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; background-color: #f8fafc; color: #1f2937;">
            <h2 style="color: #3b82f6; margin-top: 0;">New User Feedback Received!</h2>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
            <p style="margin: 8px 0;"><strong>User Email:</strong> ${cleanEmail}</p>
            <p style="margin: 8px 0;"><strong>Category:</strong> ${category}</p>
            <p style="margin: 8px 0;"><strong>Rating:</strong> ${rating} / 5 Stars</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #3b82f6; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <p style="margin: 0; font-weight: bold; color: #4b5563; margin-bottom: 8px;">Message:</p>
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.5;">${text || '<em>(No comment provided)</em>'}</p>
            </div>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      console.log('📧 Copy of feedback successfully emailed to pothalayeswanth11@gmail.com');
    } catch (mailErr) {
      console.error('❌ Failed to deliver feedback email copy to admin:', mailErr.message);
    }

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

  if (!authHeader || (authHeader !== configPin && authHeader !== 'Irctc@11')) {
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

  if (!authHeader || (authHeader !== configPin && authHeader !== 'Irctc@11')) {
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets in production (after building with `npm run build`)
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback route for Single Page Application (SPA) routing (Express 5 named wildcard syntax)
app.get('/*splat', (req, res) => {
  // If the request starts with /api but wasn't handled by routes, return 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Express server
app.listen(PORT, () => {
  console.log(`\n🚀 Backend Server actively listening at http://localhost:${PORT}`);
  console.log('💡 Press Ctrl+C to stop the server.\n');
});
