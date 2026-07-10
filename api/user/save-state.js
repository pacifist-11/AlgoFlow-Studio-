import { cors } from '../_cors.js';

/**
 * User state is persisted client-side via localStorage.
 * This endpoint is a no-op kept for API compatibility.
 */
export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  // State is stored in localStorage on the client — no DB needed
  return res.json({ success: true });
}
