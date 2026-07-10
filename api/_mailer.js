import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter configured from env vars.
 * SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
 */
export function getTransporter() {
  const port = parseInt(process.env.SMTP_PORT || '465');
  const isSecure = process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/** Reusable branded OTP email HTML */
export function otpEmailHtml(otp, subtitle = 'Secure Verification') {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;background-color:#0f172a;color:#f8fafc;padding:2rem;border-radius:16px;max-width:500px;margin:0 auto;border:1px solid rgba(255,255,255,0.08);box-shadow:0 10px 30px rgba(0,0,0,0.5);">
      <div style="text-align:center;margin-bottom:1.5rem;">
        <h1 style="font-size:1.8rem;margin:0;font-weight:800;background:linear-gradient(to right,#60a5fa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Algorithm Studio</h1>
        <p style="color:#94a3b8;font-size:0.9rem;margin-top:5px;">${subtitle}</p>
      </div>
      <div style="background-color:rgba(30,41,59,0.6);padding:1.5rem;border-radius:12px;border:1px solid rgba(255,255,255,0.05);text-align:center;">
        <p style="color:#cbd5e1;font-size:1rem;margin-top:0;">Your One-Time Password:</p>
        <h2 style="font-size:2.5rem;letter-spacing:6px;color:#fbbf24;margin:1.2rem 0;font-family:monospace;font-weight:bold;background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;border:1px dashed rgba(251,191,36,0.3);">${otp}</h2>
        <p style="color:#94a3b8;font-size:0.8rem;margin-bottom:0;">⚠️ Valid for <strong>5 minutes</strong>. Do not share this code.</p>
      </div>
      <div style="margin-top:2rem;border-top:1px solid rgba(255,255,255,0.08);padding-top:1.2rem;text-align:center;color:#64748b;font-size:0.75rem;">
        <p>If you did not request this, safely ignore this email.</p>
        <p>© ${new Date().getFullYear()} Algorithm Visualizer Studio. All rights reserved.</p>
      </div>
    </div>
  `;
}
