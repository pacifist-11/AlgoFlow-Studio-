import { cors } from '../_cors.js';

export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { pin } = req.body;
  const configPin = process.env.ADMIN_PIN || 'Irctc@11';

  if (!pin) return res.status(400).json({ error: 'Please enter a PIN.' });

  if (pin.trim() === configPin.trim()) {
    return res.json({ success: true, message: 'Access granted!' });
  } else {
    return res.status(401).json({ error: 'Incorrect developer PIN. Access denied.' });
  }
}
