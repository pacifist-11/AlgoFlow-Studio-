// Comprehensive Restricted & Profanity Word Filter Module
// Detects English & Telugu profanities, slang, adult sites, and pornstars

export function checkRestrictedWords(text) {
  if (!text) return null;
  
  // Normalize string to lowercase
  let raw = text.toLowerCase();

  // Allow casual colloquial student inquiry idioms (e.g. "what is this shit", "what this shit", "explain this shit", "fix this shit")
  const isColloquialInquiry = /^(what('?s|\s+is)?\s+(is\s+)?(this|the)\s+shit|what\s+this\s+shit|explain\s+(this|the)\s+shit|fix\s+(this|my)\s+shit|why\s+(is\s+)?this\s+shit)[\s?!.]*$/i.test(raw);
  if (isColloquialInquiry) {
    return null;
  }
  
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
    'munda', 'mundaa', 'mundha', 'mundhaa', 'mundamopi', 'munde', 'mundey', 'mundakodaka', 'mundhakodaka',
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
    'munda', 'mundha', 'mundamopi', 'munde', 'mundakodaka',
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
  // 1. Direct match check for badWords across all input variants
  for (const w of badWords) {
    const wAlpha = w.replace(/[^a-z0-9]/g, '');
    const wCollapsed = collapse(wAlpha);
    const wHomoglyphCollapsed = collapse(homoglyph(wAlpha));
    const isWordBounded = w.length <= 3 || w === 'dick' || w === 'dik';

    for (const v of inputVariants) {
      if (isWordBounded) {
        // Only check spaced variants with word boundaries to avoid false positives in Latin roots (e.g. contradiction, predicate)
        if (v === raw || v === leetMapped) {
          const boundaryRegex = new RegExp(`\\b${w}\\b`, 'i');
          if (boundaryRegex.test(v)) return w;
        }
      } else {
        if (
          v.includes(w) ||
          v.includes(wAlpha) ||
          (wCollapsed.length > 3 && v.includes(wCollapsed)) ||
          (wHomoglyphCollapsed.length > 3 && v.includes(wHomoglyphCollapsed))
        ) {
          return w;
        }
      }
    }
  }

  // 2. Additional check for collapsedBadWords
  for (const w of collapsedBadWords) {
    const wCollapsed = collapse(w);
    const isWordBounded = w.length <= 3 || w === 'dick' || w === 'dik';
    for (const v of inputVariants) {
      if (isWordBounded) {
        if (v === raw || v === leetMapped) {
          const boundaryRegex = new RegExp(`\\b${w}\\b`, 'i');
          if (boundaryRegex.test(v)) return w;
        }
      } else {
        if (v.includes(w) || (wCollapsed.length > 3 && v.includes(wCollapsed))) return w;
      }
    }
  }

  return null;
}
