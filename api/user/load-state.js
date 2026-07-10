import { cors } from '../_cors.js';

/**
 * User state is persisted client-side via localStorage.
 * Returns null so the client uses its own localStorage copy.
 */
export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  // Client falls back to localStorage when state_data is null
  return res.json({ success: true, state_data: null });
}
