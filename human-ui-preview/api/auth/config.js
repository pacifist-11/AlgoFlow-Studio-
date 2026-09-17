import { cors } from '../_cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID || '896580003359-2sgpbjbjukcidci5u1pbv7744fimamda.apps.googleusercontent.com';

  return res.status(200).json({
    googleClientId
  });
}
