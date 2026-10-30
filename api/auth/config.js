import { cors } from '../_cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID || '896580003359-5dlc9jesa3728bvv3mgi8q6mn364pqiq.apps.googleusercontent.com';

  return res.status(200).json({
    googleClientId
  });
}
