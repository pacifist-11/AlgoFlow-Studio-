import sql from '../_db.js';
import { cors } from '../_cors.js';

function checkRestrictedWords(text) {
  if (!text) return null;
  
  // Normalize string to lowercase
  let raw = text.toLowerCase();
  
  // Map lookalike symbols and numbers to letters (leet-speak)
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
  
  let leetMapped = raw;
  replacements.forEach(r => {
    leetMapped = leetMapped.replace(r.from, r.to);
  });
  
  // Helper to collapse consecutive repeating characters (e.g. "erri-ppuukkaa" -> "eripuka")
  const collapse = (s) => s.replace(/(.)\1+/g, '$1');
  
  // Helper for homoglyphs / sound-alikes (e.g. c -> k, q -> k, v -> w)
  const homoglyph = (s) => s.replace(/[cq]/g, 'k').replace(/v/g, 'w');

  // Create variants of input text to match against:
  const alphaOnly = leetMapped.replace(/[^a-z0-9]/g, '');
  const rawAlphaOnly = raw.replace(/[^a-z0-9]/g, '');
  const collapsedAlpha = collapse(alphaOnly);
  const collapsedRawAlpha = collapse(rawAlphaOnly);
  const homoglyphAlpha = homoglyph(alphaOnly);
  const homoglyphCollapsed = collapse(homoglyphAlpha);

  const inputVariants = Array.from(new Set([
    raw,
    leetMapped,
    alphaOnly,
    rawAlphaOnly,
    collapsedAlpha,
    collapsedRawAlpha,
    homoglyphAlpha,
    homoglyphCollapsed
  ]));

  // Base forbidden root substrings & variants (Telugu & English profanity, pornstars, adult sites, genres)
  const badWords = [
    'aathu', 'aathoo', 'aathuu', 'athu', 'aatu', 'athuu',
    'gudu', 'gudha', 'guda', 'gudda', 'guddha', 'goodu', 'gudhu', 'gudh',
    'vattakayalu', 'vattakaayalu', 'vattalu', 'vattakaya', 'vatta', 'vattakay', 'vattakayal', 'vatakayalu', 'vatakaya',
    'puka', 'puku', 'pooku', 'pukaa', 'pooka', 'pukka', 'pulka', 'pukla', 'pukya', 'puk', 'pook', 'pucka',
    'erripuka', 'erri puka', 'erripooka', 'erri pooka', 'erripukka', 'erri pukka', 'erripulka', 'erri pulka', 'erripukla', 'erri pukla',
    'moddagudu', 'modda gudu', 'modagudu', 'moda gudu', 'modagudda',
    'lanja', 'lanjaa', 'lanza', 'lanjodaka', 'lanjodka', 'lanjakodaka', 'lanje', 'lanjakoda', 'lanjakora',
    'modda', 'madda', 'moddae', 'maddodda', 'moda', 'mada',
    'mogga', 'moga', 'moggah', 'mogaa',
    'bokka', 'boka', 'bokkah', 'bokaa',
    'sulli', 'suli',
    'dengai', 'dengey', 'denga', 'dengu', 'dengutha', 'denge', 'dengodka',
    'naaku',
    'fuck', 'fuk', 'fck', 'bitch', 'bich', 'ass', 'bastard', 'dick', 'dik', 'cunt', 'whore', 'whor', 'shit', 'sht',
    'penis', 'peneis', 'penus', 'pnis', 'peniss', 'peniz',
    'ovary', 'ovaries', 'ovaryy',
    'vagina', 'vaginaa', 'vagna', 'vgina',
    'boobs', 'boob', 'bobs', 'boobies',
    
    // Comprehensive Pornstars list
    'mia khalifa', 'miakhalifa', 'sunny leone', 'sunnyleone', 'lana rhoades', 'lanarhoades',
    'riley reid', 'rileyreid', 'angela white', 'angelawhite', 'abella danger', 'abelladanger',
    'dani daniels', 'danidaniels', 'brandi love', 'brandilove', 'eva elfie', 'evaelfie',
    'lisa ann', 'lisaann', 'mia melano', 'miamelano', 'johnny sins', 'johnnysins',
    'jordi el nino', 'jordielnino', 'sasha grey', 'sashagrey', 'lexi lore', 'lexilore',
    'sweetie fox', 'sweetiefox', 'kenzie reeves', 'kenziereeves', 'tori black', 'toriblack',
    'piper perri', 'piperperri', 'esperanza gomez', 'esperanzagomez', 'hentai', 'pornstar', 'porn',
    'august ames', 'asa akira', 'tasha reign', 'phoenix marie', 'charity crawford', 'alexis texas', 
    'briana banks', 'jenna jameson', 'jesse jane', 'belladonna', 'stormy daniels', 'katrina jade', 
    'gina valentina', 'lana lutz', 'emily willis', 'adriana chechik', 'kira noir', 'lena paul', 
    'nicole aniston', 'sophie dee', 'christy mack', 'janice griffith', 'megan rain', 'anjelica ebbi',
    
    // Comprehensive Porn sites and channels list
    'pornhub', 'xvideos', 'xnxx', 'xhamster', 'spankbang', 'redtube', 'youporn', 'onlyfans', 'chaturbate', 
    'fansly', 'brazzers', 'naughtyamerica', 'realitykings', 'bangbros', 'evilangel', 'digitalplayground', 
    'twistys', 'rkprime', 'faphouse', 'tube8', 'txxx', 'hentaihaven', 'porntrex', 'thumbzilla', 'eporner', 
    'hqporner', 'tubegalore', 'drrtube', 'heavy-r', 'motherless', 'xhamsterlive', 'commatozzee', 'cummatozzee', 'commatozze', 'cummatozze',
    
    // Comprehensive Adult styles, genres, and category keywords
    'milf', 'anal', 'blowjob', 'creampie', 'cumshot', 'deepthroat', 'gangbang', 'hardcore', 'softcore', 
    'threesome', 'orgy', 'bondage', 'bdsm', 'cuckold', 'squirt', 'facials', 'voyeur', 'lesbian', 'gay', 
    'ebony', 'interracial', 'babe', 'shemale', 'masturbation', 'masturbate', 'groupsex', 'transsexual',
    'bukkake', 'anilingus', 'cunnilingus', 'fellatio', 'fisting', 'ladyboy'
  ];

  // Collapsed forbidden root substrings
  const collapsedBadWords = [
    'athu', 'gudu', 'guda', 'gudh', 'vatakayalu', 'vatalu', 'vatakaya', 'vata',
    'puka', 'puku', 'poku', 'erripuka', 'moddagudu', 'cumatoze', 'comatoze',
    'lanja', 'lanza', 'lanjodaka', 'lanjodka', 'lanjakodaka', 'lanje',
    'moda', 'mada', 'moga', 'boka',
    'suli',
    'dengai', 'dengey', 'denga', 'dengu', 'dengutha',
    'fuk', 'bich', 'cunt', 'whor', 'shit',
    'penis', 'pnis', 'ovary', 'ovari', 'vagina', 'vagna', 'bob', 'boob',
    'pornhub', 'xvideo', 'xnxx', 'xhamster', 'spankbang', 'redtube', 'youporn', 'onlyfan', 'chaturbate', 'fansly', 'brazzer', 'naughtyamerica', 'realityking', 'bangbro', 'evilangel', 'digitalplayground', 'twisty', 'rkprime', 'faphouse', 'tube8', 'txxx', 'hentaihaven', 'porntrex', 'thumbzilla', 'eporner', 'hqporner', 'tubegalore', 'drrtube', 'heavy-r', 'motherless', 'xhamsterlive',
    'milf', 'anal', 'blowjob', 'creampie', 'cumshot', 'deepthroat', 'gangbang', 'hardcore', 'softcore', 'threesome', 'orgy', 'bondage', 'bdsm', 'cuckold', 'squirt', 'facial', 'voyeur', 'lesbian', 'gay', 'eboni', 'interracial', 'babe', 'shemale', 'masturbation', 'masturbate', 'groupsex', 'transsexual', 'bukkake', 'anilingus', 'cunnilingus', 'fellatio', 'fisting', 'ladyboy'
  ];

  // 0. Standalone check for "mg" (shortcut for moddagudu)
  for (const v of inputVariants) {
    if (/\bmg\b/i.test(v) || v === 'mg') {
      return 'mg';
    }
  }

  // 1. Direct match check for badWords across all input variants
  for (const w of badWords) {
    const wAlpha = w.replace(/[^a-z0-9]/g, '');
    const wCollapsed = collapse(wAlpha);
    const wHomoglyphCollapsed = collapse(homoglyph(wAlpha));

    for (const v of inputVariants) {
      if (w.length <= 3) {
        const boundaryRegex = new RegExp(`\\b${w}\\b`, 'i');
        if (boundaryRegex.test(v)) return w;
      } else {
        if (
          v.includes(w) ||
          v.includes(wAlpha) ||
          v.includes(wCollapsed) ||
          v.includes(wHomoglyphCollapsed)
        ) {
          return w;
        }
      }
    }
  }

  // 2. Additional check for collapsedBadWords
  for (const w of collapsedBadWords) {
    const wCollapsed = collapse(w);
    for (const v of inputVariants) {
      if (w.length <= 3) {
        const boundaryRegex = new RegExp(`\\b${w}\\b`, 'i');
        if (boundaryRegex.test(v)) return w;
      } else {
        if (v.includes(w) || v.includes(wCollapsed)) return w;
      }
    }
  }

  return null;
}

/**
 * Direct feedback submission — no auth, no OTP, no login required.
 * Saves normal feedbacks or restricted attempts straight to Neon feedbacks table.
 */
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, rating, category, text, restricted_word, restricted_field } = req.body;

  const ratingInt = parseInt(rating);
  if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    return res.status(400).json({ error: 'Please select a star rating (1-5).' });
  }

  const cleanName = (name || '').trim();
  if (!cleanName) {
    return res.status(400).json({ error: 'Please enter your name.' });
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

  const feedbackCategory = category || 'General';

  // Ensure DB columns exist
  try {
    await sql`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS restricted_word VARCHAR(255)`;
    await sql`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS restricted_field VARCHAR(100)`;
  } catch (e) {
    console.warn("Alter table check failed (might already have columns):", e.message);
  }

  // Server-side check for restricted words
  const serverRestrictedName = checkRestrictedWords(cleanName);
  const serverRestrictedEmail = checkRestrictedWords(cleanEmail);
  const serverRestrictedText = checkRestrictedWords(feedbackText);

  let finalRestrictedWord = restricted_word || null;
  let finalRestrictedField = restricted_field || null;

  if (serverRestrictedName) {
    finalRestrictedWord = serverRestrictedName;
    finalRestrictedField = 'name';
  } else if (serverRestrictedEmail) {
    finalRestrictedWord = serverRestrictedEmail;
    finalRestrictedField = 'email';
  } else if (serverRestrictedText) {
    finalRestrictedWord = serverRestrictedText;
    finalRestrictedField = 'message';
  }

  // If a restricted word is detected, we save it to the database with the tags, 
  // but return a 400 error status to the user.
  if (finalRestrictedWord) {
    try {
      const rows = await sql`
        INSERT INTO feedbacks (name, email, rating, category, feedback_text, restricted_word, restricted_field)
        VALUES (${cleanName}, ${cleanEmail}, ${ratingInt}, ${feedbackCategory}, ${feedbackText}, ${finalRestrictedWord}, ${finalRestrictedField})
        RETURNING *
      `;
      console.log('💾 Restricted feedback attempt logged:', rows[0].id);
      return res.status(400).json({ 
        error: `Inappropriate language detected in your ${finalRestrictedField}. Please modify your input and submit again.`
      });
    } catch (err) {
      console.error('❌ Neon insert for restricted feedback failed:', err.message);
      return res.status(500).json({ error: 'Failed to save feedback.', details: err.message });
    }
  }

  // Normal clean flow
  try {
    const rows = await sql`
      INSERT INTO feedbacks (name, email, rating, category, feedback_text)
      VALUES (${cleanName}, ${cleanEmail}, ${ratingInt}, ${feedbackCategory}, ${feedbackText})
      RETURNING *
    `;

    console.log('💾 Feedback saved to Neon:', rows[0].id);
    return res.json({ success: true, feedback: rows[0] });
  } catch (err) {
    console.error('❌ Neon insert failed:', err.message);
    return res.status(500).json({ error: 'Failed to save feedback.', details: err.message });
  }
}
