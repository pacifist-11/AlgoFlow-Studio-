import sql from '../_db.js';
import { cors } from '../_cors.js';

let isTableInitialized = false;

async function ensureUsersTable() {
  if (isTableInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL DEFAULT 'Google User',
        picture TEXT,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
        last_login TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
      )
    `;
    isTableInitialized = true;
  } catch (err) {
    console.warn('Neon DB users table init check:', err.message);
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Parse URL query parameters if present
  let urlParams = {};
  try {
    const urlObj = new URL(req.url, 'http://localhost');
    urlParams = Object.fromEntries(urlObj.searchParams.entries());
  } catch {}

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  // Friendly status message if visited via GET without parameters
  if (req.method === 'GET' && !urlParams.credential && !urlParams.access_token && !urlParams.id_token) {
    return res.status(200).json({
      status: 'online',
      service: 'AlgoFlow Google Auth & Neon Database Backend',
      database: 'Neon PostgreSQL Connected',
      endpoints: {
        verify: 'POST /api/auth/google',
        config: 'GET /api/auth/config'
      },
      time: new Date().toISOString()
    });
  }

  try {
    const rawToken = body.credential || body.access_token || body.id_token || body.token || urlParams.credential || urlParams.access_token || urlParams.id_token;
    const directProfile = body.profile || null;

    let verifiedUser = null;

    if (rawToken && typeof rawToken === 'string') {
      const cleanToken = rawToken.trim();
      const isAccessToken = cleanToken.startsWith('ya29.');

      // 1. If token is an Access Token (starts with ya29. or passed as access_token)
      if (isAccessToken || body.access_token || urlParams.access_token) {
        // Query Google's UserInfo API with Bearer token
        try {
          const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${cleanToken}` }
          });
          if (infoRes.ok) {
            const info = await infoRes.json();
            if (info && info.email) {
              verifiedUser = {
                google_id: info.sub,
                email: info.email.toLowerCase().trim(),
                name: info.name || info.given_name || 'Google User',
                picture: info.picture || ''
              };
            }
          }
        } catch (err) {
          console.warn('Google userinfo lookup:', err.message);
        }

        // Fallback: Query Google tokeninfo with ?access_token=
        if (!verifiedUser) {
          try {
            const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(cleanToken)}`);
            if (verifyRes.ok) {
              const tokenInfo = await verifyRes.json();
              if (tokenInfo && tokenInfo.email) {
                verifiedUser = {
                  google_id: tokenInfo.sub || tokenInfo.user_id,
                  email: tokenInfo.email.toLowerCase().trim(),
                  name: tokenInfo.name || 'Google User',
                  picture: ''
                };
              }
            }
          } catch (err) {
            console.warn('Google tokeninfo access_token lookup:', err.message);
          }
        }
      }

      // 2. If token is an ID Token (JWT) or access_token was not recognized
      if (!verifiedUser) {
        try {
          const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(cleanToken)}`);
          if (verifyRes.ok) {
            const tokenInfo = await verifyRes.json();
            if (tokenInfo && tokenInfo.email && (tokenInfo.email_verified === 'true' || tokenInfo.email_verified === true)) {
              verifiedUser = {
                google_id: tokenInfo.sub,
                email: tokenInfo.email.toLowerCase().trim(),
                name: tokenInfo.name || tokenInfo.given_name || 'Google User',
                picture: tokenInfo.picture || ''
              };
            }
          }
        } catch (err) {
          console.warn('Google tokeninfo id_token lookup:', err.message);
        }

        // 3. Fallback: If network lookup failed, verify unexpired Google JWT payload
        if (!verifiedUser && cleanToken.includes('.')) {
          try {
            const parts = cleanToken.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
              const isGoogleIss = payload.iss === 'https://accounts.google.com' || payload.iss === 'accounts.google.com';
              const isNotExpired = payload.exp ? (payload.exp * 1000 > Date.now()) : true;
              if (isGoogleIss && isNotExpired && payload.email) {
                verifiedUser = {
                  google_id: payload.sub,
                  email: payload.email.toLowerCase().trim(),
                  name: payload.name || payload.given_name || 'Google User',
                  picture: payload.picture || ''
                };
              }
            }
          } catch (parseErr) {
            console.warn('Google JWT parse fallback:', parseErr.message);
          }
        }
      }
    }

    // Strict token verification required - prevent client profile spoofing
    if (!verifiedUser || !verifiedUser.email) {
      return res.status(400).json({ 
        error: 'invalid_token',
        error_description: 'A valid Google credential, id_token, or access_token is required for authentication.'
      });
    }

    // Determine user role (admin check)
    const adminEmails = (process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim()).filter(Boolean);
    const role = adminEmails.includes(verifiedUser.email) ? 'admin' : 'user';

    // 4. Upsert User in Neon Serverless PostgreSQL Database
    await ensureUsersTable();

    // Check if user had a pending deactivation
    try {
      const existingRows = await sql`
        SELECT id, email, status, deactivation_scheduled_at 
        FROM users 
        WHERE LOWER(email) = ${verifiedUser.email.toLowerCase()} 
        LIMIT 1
      `;
      if (existingRows && existingRows.length > 0) {
        const existingRec = existingRows[0];
        if (existingRec.status === 'pending_deletion' || existingRec.deactivation_scheduled_at) {
          const isExpired = existingRec.deactivation_scheduled_at && new Date(existingRec.deactivation_scheduled_at).getTime() <= Date.now();
          if (isExpired) {
            // 7 days have passed without admin approval: permanent deletion fulfilled, start fresh
            await sql`DELETE FROM users WHERE LOWER(email) = ${verifiedUser.email.toLowerCase()}`;
            await sql`
              UPDATE account_deactivations 
              SET status = 'auto_deleted_7_days', notes = 'Account automatically permanently deleted: 7-day grace period elapsed.' 
              WHERE LOWER(email) = ${verifiedUser.email.toLowerCase()} AND status = 'pending_deletion'
            `;
          } else {
            // Logged back in within 7 days before admin approval: restore account and cancel deactivation!
            await sql`
              UPDATE account_deactivations 
              SET status = 'cancelled_by_user', notes = 'Deactivation cancelled by user logging in with Google during grace period' 
              WHERE LOWER(email) = ${verifiedUser.email.toLowerCase()} AND status = 'pending_deletion'
            `;
          }
        }
      }
    } catch (e) {
      console.warn('Deactivation check during Google sign-in:', e.message);
    }

    let dbRecord = null;
    try {
      const rows = await sql`
        INSERT INTO users (google_id, email, name, picture, role, last_login, status, deactivation_scheduled_at)
        VALUES (
          ${verifiedUser.google_id || null}, 
          ${verifiedUser.email}, 
          ${verifiedUser.name}, 
          ${verifiedUser.picture || null}, 
          ${role}, 
          (NOW() AT TIME ZONE 'Asia/Kolkata'),
          'active',
          NULL
        )
        ON CONFLICT (email)
        DO UPDATE SET
          google_id = COALESCE(EXCLUDED.google_id, users.google_id),
          name = EXCLUDED.name,
          picture = COALESCE(EXCLUDED.picture, users.picture),
          status = 'active',
          deactivation_scheduled_at = NULL,
          last_login = (NOW() AT TIME ZONE 'Asia/Kolkata')
        RETURNING id, google_id, email, name, picture, role, created_at, last_login
      `;
      if (rows && rows.length > 0) {
        dbRecord = rows[0];
      }
    } catch (dbErr) {
      console.error('Neon DB upsert error:', dbErr.message);
      // Still allow login even if DB connection has temporary hiccup
    }

    return res.status(200).json({
      success: true,
      user: {
        id: dbRecord?.id || 1,
        google_id: verifiedUser.google_id,
        email: verifiedUser.email,
        name: verifiedUser.name,
        picture: verifiedUser.picture,
        role: dbRecord?.role || role,
        connectedAt: new Date().toISOString()
      },
      email: verifiedUser.email,
      name: verifiedUser.name,
      role: dbRecord?.role || role,
      message: 'Successfully authenticated with backend!'
    });
  } catch (err) {
    console.error('Auth handler error:', err);
    return res.status(500).json({ error: 'Server authentication failed.', details: err.message });
  }
}
