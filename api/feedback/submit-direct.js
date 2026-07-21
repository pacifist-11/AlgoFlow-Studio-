import sql from '../_db.js';
import { cors } from '../_cors.js';

function checkRestrictedWords(text) {
  if (!text) return false;
  
  let clean = text.toLowerCase();
  
  const replacements = [
    { from: /@/g, to: 'a' },
    { from: /€/g, to: 'e' },
    { from: /3/g, to: 'e' },
    { from: /1/g, to: 'i' },
    { from: /!/g, to: 'i' },
    { from: /\|/g, to: 'i' },
    { from: /0/g, to: 'o' },
    { from: /°/g, to: 'o' },
    { from: /\$/g, to: 's' },
    { from: /5/g, to: 's' },
    { from: /7/g, to: 't' },
    { from: /\+/g, to: 't' },
    { from: /8/g, to: 'b' }
  ];
  
  let variant1 = clean;
  replacements.forEach(r => {
    variant1 = variant1.replace(r.from, r.to);
  });
  
  const badWords = [
    'aathu', 'aathoo', 'aathuu', 'athu', 'aatu', 'athuu',
    'gudu', 'gudha', 'guda', 'gudda', 'guddha', 'goodu', 'gudhu', 'gudh',
    'vattakayalu', 'vattakaayalu', 'vattalu', 'vattakaya', 'vatta', 'vattakay', 'vattakayal',
    'puka', 'puku', 'pooku', 'pukaa', 'pooka',
    'lanja', 'lanjaa', 'lanza', 'lanjodaka', 'lanjodka', 'lanjakodaka', 'lanje',
    'modda', 'madda', 'moddae', 'maddodda',
    'sulli', 'suli',
    'dengai', 'dengey', 'denga', 'dengu', 'dengutha',
    'naaku',
    'fuck', 'bitch', 'ass', 'bastard', 'dick', 'cunt', 'whore', 'shit'
  ];
  
  const collapsedBadWords = [
    'athu', 'gudu', 'guda', 'gudh', 'vatakayalu', 'vatalu', 'vatakaya', 'vata',
    'puka', 'puku', 'poku',
    'lanja', 'lanza', 'lanjodaka', 'lanjodka', 'lanjakodaka', 'lanje',
    'moda', 'mada',
    'suli',
    'dengai', 'dengey', 'denga', 'dengu', 'dengutha',
    'fuk', 'bich', 'cunt', 'whor', 'shit'
  ];

  const checkString = (str) => {
    for (const w of badWords) {
      if (str.includes(w)) return true;
    }
    
    const alphaOnly = str.replace(/[^a-z0-9]/g, '');
    for (const w of badWords) {
      if (alphaOnly.includes(w)) return true;
    }
    
    const collapsed = alphaOnly.replace(/(.)\1+/g, '$1');
    for (const w of collapsedBadWords) {
      if (collapsed.includes(w)) return true;
    }
    
    return false;
  };

  return checkString(clean) || checkString(variant1);
}

/**
 * Direct feedback submission — no auth, no OTP, no login required.
 * Just saves whatever the user typed straight to Neon feedbacks table.
 */
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, rating, category, text } = req.body;

  const ratingInt = parseInt(rating);
  if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    return res.status(400).json({ error: 'Please select a star rating (1-5).' });
  }

  const cleanEmail = (email || '').toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const feedbackText = (text || '').trim();
  if (!feedbackText) {
    return res.status(400).json({ error: 'Please enter some feedback message.' });
  }

  if (checkRestrictedWords(feedbackText)) {
    return res.status(400).json({ error: 'Feedback message contains restricted words. Please rectify them.' });
  }

  const feedbackCategory = category || 'General';

  try {
    const rows = await sql`
      INSERT INTO feedbacks (email, rating, category, feedback_text)
      VALUES (${cleanEmail}, ${ratingInt}, ${feedbackCategory}, ${feedbackText})
      RETURNING *
    `;

    console.log('💾 Feedback saved to Neon:', rows[0].id);
    return res.json({ success: true, feedback: rows[0] });
  } catch (err) {
    console.error('❌ Neon insert failed:', err.message);
    return res.status(500).json({ error: 'Failed to save feedback.', details: err.message });
  }
}
