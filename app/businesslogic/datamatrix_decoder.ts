// gs1.ts
// Robust parser for GS1 DataMatrix element strings (subset: 01,10,11,15,16,17,21)
// Extracts batch (AI 10) and expiry (AI 17). Handles FNC1/GS (ASCII 29), "]d2" prefix, and minor scanner quirks.

export type Gs1Parse = {
  gtin?: string;
  batch?: string;        // AI (10)
  expiryRaw?: string;    // YYMMDD
  expiryISO?: string;    // YYYY-MM-DD
  serial?: string;       // AI (21)
  productionDate?: string; // AI (11) ISO
  bestBefore?: string;     // AI (15) ISO
  sellBy?: string;         // AI (16) ISO
};

const GS = String.fromCharCode(29);

function normaliseInput(input: string): string {
  let s = input.trim();

  // Remove leading symbology identifier if present (e.g., "]d2")
  if (s.startsWith(']d2')) s = s.slice(3);

  // Replace common textual GS placeholders with ASCII 29
  s = s
    .replace(/\u001D/g, GS)     // already GS control char
    .replace(/<GS>/gi, GS)
    .replace(/\x1D/g, GS);

  // Some scanners insert literal non-printable shown as '' — keep as GS:
  s = s.replace(//g, GS);

  // Remove accidental HRI parentheses like "(01)" if a scanner outputs HRI instead of raw
  s = s.replace(/\((\d{2,4})\)/g, '$1');

  // IMPORTANT: Some scanners insert literal "290" (3 chars) or "29" (2 chars) instead of ASCII 29
  // We need to replace these with GS when followed by valid AI codes
  // Known GS1 Application Identifiers commonly used in pharma/vaccine context
  // Extend this list as needed for other product types
  const knownAIs = [
    '01', '02',           // GTIN identifiers
    '10',                 // Batch/Lot
    '11', '15', '16', '17', // Production/expiry dates
    '21',                 // Serial number
    '30',                 // Variable count (if needed)
    '240', '241',         // Additional product IDs (if needed)
  ];

  // Vaccine QR codes always start with AI 01 (GTIN), which is 2 + 14 = 16 chars
  // Protect the first 16 chars from replacement to avoid matching "29" inside the GTIN
  // Example: GTIN "04150089264292" contains "4292" which shouldn't be treated as "4<GS>21"
  const gtinLength = s.startsWith('01') ? 16 : 0;
  const prefix = s.slice(0, gtinLength);
  let rest = s.slice(gtinLength);

  // First pass: Replace "290" + AI with GS + AI (3-character scanner quirk)
  // This handles: ...AE29021... -> ...AE<GS>21..., ...0290172609... -> ...0<GS>172609...
  knownAIs.forEach(ai => {
    const pattern = new RegExp(`([A-Z0-9])290(${ai})`, 'g');
    rest = rest.replace(pattern, `$1${GS}$2`);
  });

  // Second pass: Replace remaining "29" + AI with GS + AI (2-character scanner quirk)
  // This handles cases where scanner only inserts "29" not "290"
  knownAIs.forEach(ai => {
    const pattern = new RegExp(`([A-Z0-9])29(${ai})`, 'g');
    rest = rest.replace(pattern, `$1${GS}$2`);
  });

  s = prefix + rest;

  return s;
}

function yymmddToISO(yymmdd: string): string | undefined {
  if (!/^\d{6}$/.test(yymmdd)) return undefined;
  const yy = parseInt(yymmdd.slice(0, 2), 10);
  const mm = parseInt(yymmdd.slice(2, 4), 10);
  const dd = parseInt(yymmdd.slice(4, 6), 10);

  // Interpret years as 2000–2099 (typisch im Healthcare-Kontext)
  const year = 2000 + yy;

  // GS1 erlaubt „00" für Tag/Monat als „Ende des (Monats/Jahres)".
  // Wir behandeln 00 robust:
  const month = mm === 0 ? 12 : mm;

  // Letzter Tag des Monats, falls dd==0
  const lastDay = new Date(year, month, 0).getDate();
  const day = dd === 0 ? lastDay : dd;

  // Falls Monat 00 war, interpretieren wir 31.12.
  const finalYear = year;
  const finalMonth = mm === 0 ? 12 : month;
  const finalDay = mm === 0 ? 31 : day;

  // Validate ranges
  if (finalMonth < 1 || finalMonth > 12) return undefined;
  if (finalDay < 1 || finalDay > 31) return undefined;

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${finalYear}-${pad(finalMonth)}-${pad(finalDay)}`;
}

/**
 * Format expiry date from ISO (YYYY-MM-DD) or raw (YYMM/YYMMDD) to readable MM/YY format
 * @param expiryISO - ISO formatted date string (YYYY-MM-DD)
 * @param expiryRaw - Raw date string (YYMM or YYMMDD)
 * @returns Formatted date string (MM/YY) or empty string
 */
export function formatExpiry(expiryISO?: string, expiryRaw?: string): string {
  if (expiryISO) {
    // ISO format: YYYY-MM-DD -> MM/YY
    const [year, month] = expiryISO.split('-');
    return `${month}/${year.slice(2)}`;
  }
  if (expiryRaw && expiryRaw.length >= 4) {
    // YYMM or YYMMDD -> MM/YY
    const yy = expiryRaw.slice(0, 2);
    const mm = expiryRaw.slice(2, 4);
    return `${mm}/${yy}`;
  }
  return '';
}

export function parseGs1(qrRaw: string): Gs1Parse {
  const s = normaliseInput(qrRaw);

  // Debug logging
  console.log('=== GS1 Parser Debug ===');
  console.log('Original:', qrRaw);
  console.log('Normalized:', s);
  console.log('Normalized hex:', Array.from(s).map(c =>
    `${c.charCodeAt(0) < 32 ? '<0x' + c.charCodeAt(0).toString(16) + '>' : c}`
  ).join(''));
  console.log('=======================');

  const out: Gs1Parse = {};
  let i = 0;

  // Helper to read fixed-length numeric data after a given AI
  const readFixed = (len: number) => {
    const val = s.slice(i, i + len);
    i += len;
    return val;
  };

  // Helper to read variable-length (max 20) until GS or end
  // Improved version: also looks ahead for next valid AI when GS is missing
  const readVar = (maxLen = 20) => {
    const knownAIs = ['01', '02', '10', '11', '15', '16', '17', '21', '30'];
    const knownAIs3 = ['240', '241']; // 3-digit AIs
    let j = i;

    while (j < s.length && s[j] !== GS && j - i < maxLen) {
      // Look ahead for next AI (after at least 1 char of data)
      if (j - i >= 1 && j + 1 < s.length) {
        // Check 3-digit AIs first
        const nextThreeChars = s.slice(j, j + 3);
        if (/^\d{3}$/.test(nextThreeChars) && knownAIs3.includes(nextThreeChars)) {
          // Found a 3-digit AI, stop reading here
          break;
        }

        // Check 2-digit AIs
        const nextTwoChars = s.slice(j, j + 2);
        if (/^\d{2}$/.test(nextTwoChars) && knownAIs.includes(nextTwoChars)) {
          // Validate the AI by checking if the following data structure makes sense
          let isValidAI = false;

          switch (nextTwoChars) {
            case '01': // GTIN
            case '02': // GTIN of contained trade items
              // GTIN must be followed by exactly 14 digits
              isValidAI = /^\d{14}/.test(s.slice(j + 2, j + 16));
              break;
            case '17': // Expiry date
            case '11': // Production date
            case '15': // Best before
            case '16': // Sell by
              // Date AIs must be followed by exactly 6 digits
              isValidAI = /^\d{6}/.test(s.slice(j + 2, j + 8));
              break;
            case '10': // Batch/Lot
            case '21': // Serial
            case '30': // Variable count
              // Variable-length AIs - check if followed by at least 1 alphanumeric char
              isValidAI = j + 2 < s.length && /^[\w]/.test(s.charAt(j + 2));
              break;
          }

          if (isValidAI) {
            // Found a valid next AI, stop reading here
            break;
          }
        }
      }
      j++;
    }

    const val = s.slice(i, j);
    i = j; // leave i at GS or next AI or end; loop will handle next AI
    return val;
  };

  while (i < s.length) {
    // Skip any stray GS characters
    if (s[i] === GS) { i++; continue; }

    // Try 2–4 digit AI window; we implement common pharma/vaccine AIs
    // Check 3-digit AIs first, then 2-digit
    const ai3 = s.slice(i, i + 3);
    const ai2 = s.slice(i, i + 2);
    let ai: string | undefined;

    if (['240', '241'].includes(ai3)) {
      ai = ai3;
      i += 3;
    } else if (['01', '02', '10', '11', '15', '16', '17', '21', '30'].includes(ai2)) {
      ai = ai2;
      i += 2;
    } else {
      // Unknown AI; try to advance safely (avoid infinite loop)
      // Heuristic: if next is digit, skip one and continue
      i++;
      continue;
    }

    switch (ai) {
      case '01': { // GTIN (fixed 14)
        const v = readFixed(14);
        if (/^\d{14}$/.test(v)) out.gtin = v;
        break;
      }
      case '17': { // Expiration date (YYMMDD)
        const v = readFixed(6);
        out.expiryRaw = v;
        out.expiryISO = yymmddToISO(v);
        break;
      }
      case '10': { // Batch/Lot (variable, up to 20, GS-terminated if followed by more AIs)
        const v = readVar(20);
        out.batch = v;
        break;
      }
      case '21': { // Serial (variable, up to 20)
        const v = readVar(20);
        out.serial = v;
        break;
      }
      case '11': { // Production date (YYMMDD)
        const v = readFixed(6);
        out.productionDate = yymmddToISO(v);
        break;
      }
      case '15': { // Best before (YYMMDD)
        const v = readFixed(6);
        out.bestBefore = yymmddToISO(v);
        break;
      }
      case '16': { // Sell by (YYMMDD)
        const v = readFixed(6);
        out.sellBy = yymmddToISO(v);
        break;
      }
      case '02': { // GTIN of contained trade items (fixed 14)
        const v = readFixed(14);
        // Store in gtin if not already set, or ignore
        if (!out.gtin && /^\d{14}$/.test(v)) out.gtin = v;
        break;
      }
      case '30': { // Variable count (variable length, up to 8)
        const v = readVar(8);
        // Not stored in current type, but parsed to avoid errors
        break;
      }
      case '240': // Additional product identification (variable, up to 30)
      case '241': { // Customer part number (variable, up to 30)
        const v = readVar(30);
        // Not stored in current type, but parsed to avoid errors
        break;
      }
    }
  }
  return out;
}