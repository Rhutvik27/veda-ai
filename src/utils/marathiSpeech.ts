const MARATHI_UNITS = [
  'शून्य', 'एक', 'दोन', 'तीन', 'चार', 'पाच', 'सहा', 'सात', 'आठ', 'नऊ',
  'दहा', 'अकरा', 'बारा', 'तेरा', 'चौदा', 'पंधरा', 'सोळा', 'सतरा', 'अठरा', 'एकोणीस',
  'वीस', 'एकवीस', 'बावीस', 'तेवीस', 'चोवीस', 'पंचवीस', 'सव्वीस', 'सत्तावीस', 'अठ्ठावीस', 'एकोणतीस',
  'तीस', 'एकतीस', 'बत्तीस', 'तेहतीस', 'चौतीस', 'पस्तीस', 'छत्तीस', 'सदतीस', 'अडतीस', 'एकोणचाळीस',
  'चाळीस', 'एकेचाळीस', 'बेचाळीस', 'त्रेचाळीस', 'चव्वेचाळीस', 'पंचेचाळीस', 'सेहेचाळीस', 'सत्तेचाळीस', 'अठ्ठेचाळीस', 'एकोणपन्नास',
  'पन्नास', 'एक्कावन्न', 'बावन्न', 'त्रेपन्न', 'चोपन्न', 'पंचावन्न', 'छप्पन्न', 'सत्तावन्न', 'अठ्ठावन्न', 'एकोणसाठ',
  'साठ', 'एकसष्ट', 'बासष्ट', 'त्रेसष्ट', 'चौसष्ट', 'पासष्ट', 'सहासष्ट', 'सदुसष्ट', 'अडुसष्ट', 'एकोणसत्तर',
  'सत्तर', 'एकाहत्तर', 'बाहत्तर', 'त्र्याहत्तर', 'चौऱ्याहत्तर', 'पंच्याहत्तर', 'शहात्तर', 'सत्याहत्तर', 'अठ्ठ्याहत्तर', 'एकोणऐंशी',
  'ऐंशी', 'एक्याऐंशी', 'ब्याऐंशी', 'त्र्याऐंशी', 'चौऱ्याऐंशी', 'पंच्याऐंशी', 'शहाऐंशी', 'सत्याऐंशी', 'अठ्ठ्याऐंशी', 'एकोणनव्वद',
  'नव्वद', 'एक्याण्णव', 'ब्याण्णव', 'त्र्याण्णव', 'चौऱ्याण्णव', 'पंच्याण्णव', 'शहाण्णव', 'सत्याण्णव', 'अठ्ठ्याण्णव', 'नव्व्याण्णव',
];

const MARATHI_LETTERS: Record<string, string> = {
  A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
  I: 'आय', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
  Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'व्ही', W: 'डब्ल्यू',
  X: 'एक्स', Y: 'वाय', Z: 'झेड',
};

export function marathiNumberWord(n: number): string {
  if (!Number.isFinite(n) || n < 0) return String(n);
  if (n < 100) return MARATHI_UNITS[n];
  if (n === 100) return 'शंभर';
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    const hPrefix = h === 1 ? 'एकशे' : `${MARATHI_UNITS[h]}शे`;
    return rem === 0 ? `${MARATHI_UNITS[h]}शे` : `${hPrefix} ${MARATHI_UNITS[rem]}`;
  }
  return String(n);
}

function devanagariDigitsToAscii(s: string): string {
  return s.replace(/[०-९]/g, (d) => String(d.charCodeAt(0) - 0x0966));
}

export function formatMarathiSpeechText(raw: string): string {
  let s = raw.trim();
  // Normalize ZWJ + chandra-e combinations cleanly to standard Unicode ॲ
  s = s.replace(/अ\u200Dॅ/g, 'ॲ').replace(/अॅ/g, 'ॲ');
  // Normalize Devanagari digits to ASCII temporarily for unified Marathi number-word conversion
  s = devanagariDigitsToAscii(s);
  // Convert numbered list badges (#1, #2...) to natural Marathi ordinal phrasing
  s = s.replace(/#(\d+)/g, 'क्रमांक $1,');
  // Remove markdown/decoration symbols & replace arrows/bullets/dashes with smooth spoken pauses
  s = s
    .replace(/[*_`#~]/g, '')
    .replace(/\s*(?:->|→)\s*/g, ', म्हणजेच ')
    .replace(/\s*[·|•]\s*/g, ', ')
    .replace(/\s*—\s*/g, ', ');
  // Emergency helpline numbers
  s = s.replace(/\b108\s*[/,]\s*112\b/g, 'एकशे आठ किंवा एकशे बारा');
  // Spinal disc pairs like L5-S1
  s = s.replace(/\b([A-Za-z])(\d+)-([A-Za-z])(\d+)\b/g, (_m, a, n1, b, n2) => {
    const la = MARATHI_LETTERS[a.toUpperCase()] || a;
    const lb = MARATHI_LETTERS[b.toUpperCase()] || b;
    return `${la} ${marathiNumberWord(Number(n1))} आणि ${lb} ${marathiNumberWord(Number(n2))}`;
  });
  // Acupoint / vertebral IDs like ST36, SP10, UB11, LIV8, GB30, BL54, L5, C7, T1
  // Hyphenate multi-letter prefixes (e.g. एल-आय चार, एस-टी छत्तीस) so TTS articulates every letter cleanly
  s = s.replace(
    /\b(LIV|LI|LU|ST|SP|BL|UB|GB|GV|CV|KI|PC|HT|SI|TW|LV|K)\s*[- ]?\s*(\d{1,3})\b/gi,
    (_m, code, num) => {
      const upper = code.toUpperCase() === 'LIV' ? 'LV' : code.toUpperCase();
      const letters = upper
        .split('')
        .map((ch: string) => MARATHI_LETTERS[ch] || ch)
        .join('-');
      return `${letters} ${marathiNumberWord(Number(num))}`;
    }
  );
  // Hyphenated numeric ranges like 1-2 or 1–2
  s = s.replace(/\b(\d{1,3})\s*[–—-]\s*(\d{1,3})\b/g, (_m, a, b) => {
    return `${marathiNumberWord(Number(a))} ते ${marathiNumberWord(Number(b))}`;
  });
  // Common English medical acronyms & rotation directions -> pure idiomatic Marathi
  s = s.replace(/\b(ACL|PCL|BP|CW|ACW)\b/g, (_m, tok) => {
    if (tok === 'CW') return 'घड्याळाच्या दिशेने';
    if (tok === 'ACW') return 'घड्याळाच्या उलट दिशेने';
    return tok
      .split('')
      .map((ch: string) => MARATHI_LETTERS[ch] || ch)
      .join('-');
  });
  // Slashes between alternatives
  s = s.replace(/\s*\/\s*/g, ' किंवा ');
  // Remaining standalone numbers 0..999
  s = s.replace(/\b(\d{1,3})\b/g, (_m, num) => marathiNumberWord(Number(num)));
  // Convert English rotation loanwords & awkward spellings into pure, natural spoken Marathi
  s = s
    .replace(/अँटी\s*क्लॉक\s*वा[इई]ज|अॅन्टी\s*क्लॉक\s*वा[इई]ज|एंटी\s*क्लॉक\s*वा[इई]ज/g, 'घड्याळाच्या उलट दिशेने')
    .replace(/क्लॉक\s*वा[इई]ज/g, 'घड्याळाच्या दिशेने')
    .replace(/बिंदु/g, 'बिंदू')
    .replace(/हळूवार/g, 'हळुवार')
    .replace(/मिनिट\b/g, 'मिनिटे')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?।])/g, '$1')
    .trim();
  return s;
}

export function needsMarathiTranslation(text: string): boolean {
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (!hasDevanagari) return true;
  const hindiCue =
    /(?:^|\s)(है|हैं|करें|दबाएं|जाएं|बताएं|रुकें|रखें|कीजिए|होता|नहीं|अपने|दर्द|घुटने|उंगली|हड्डी|कलाई|टखने|गर्दन|पीठ|रीढ़|बिंदु|के\s+लिए|की\s+तरफ|दो\s+मिनट)(?:\s|[।.,!?]|$)/;
  if (hindiCue.test(text)) return true;
  const latinWords = text.match(/\b[A-Za-z]{4,}\b/g) || [];
  if (latinWords.length > 4) return true;
  return false;
}
