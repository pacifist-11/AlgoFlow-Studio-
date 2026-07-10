import { cors } from '../_cors.js';

export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  return res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID || '' });
}
