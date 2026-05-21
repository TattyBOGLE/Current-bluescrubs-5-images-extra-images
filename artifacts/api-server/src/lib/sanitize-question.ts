/**
 * Strips guideline-citation phrases from question stems so they read as
 * natural, exam-authentic clinical scenarios rather than textbook references.
 *
 * Guideline accuracy is preserved in explanations — this only affects the
 * question stem wording that candidates see.
 */

// Shared body for "according to / based on / as per" references.
// Matches things like:
//   "NICE"  |  "NICE CG90"  |  "NICE NG245 2024"  |  "BTS/SIGN guidelines"
//   "current UK guidelines"  |  "the latest NICE guidelines"  |  "guidelines"
const GUIDELINE_BODY =
  '(?:' +
    // "NICE CG90", "BTS/SIGN guidelines", "the latest NICE NG245 guidance"
    '(?:(?:the\\s+)?(?:current\\s+|latest\\s+|evidence-?based\\s+|uk\\s+|current\\s+uk\\s+)*)?' +
    '(?:nice|bts(?:\\/sign)?|sign|gmc|rcgp|rcp|who|phe|hse|nhs(?:\\s+england)?|mca)' +
    '(?:\\s+[A-Z]{1,4}\\d{1,4}(?:\\s+\\d{4})?)?' +
    '(?:\\s+(?:guidelines?|guidance|recommendations?|criteria|standards?|protocols?))?' +
  '|' +
    // standalone codes: "NG245", "CG90", "TA123", "DG\d+"
    '(?:ng|cg|ta|dg|ipg|mtg|es|maeg)\\d{1,4}(?:\\s+(?:guidelines?|guidance|recommendations?))?' +
  '|' +
    // "the latest guidelines", "current UK guidelines"
    '(?:the\\s+)?(?:current\\s+|latest\\s+|evidence-?based\\s+|uk\\s+|current\\s+uk\\s+)+' +
    '(?:guidelines?|guidance|recommendations?|criteria|standards?|protocols?)?' +
  '|' +
    // bare word: "guidelines", "guidance"
    '(?:guidelines?|guidance|recommendations?|criteria|standards?|protocols?)' +
  ')';

const LEADING_PATTERNS: RegExp[] = [
  new RegExp(`^according to ${GUIDELINE_BODY},\\s*`, 'i'),
  new RegExp(`^based on ${GUIDELINE_BODY},\\s*`, 'i'),
  new RegExp(`^as per ${GUIDELINE_BODY},\\s*`, 'i'),
  new RegExp(`^in line with ${GUIDELINE_BODY},\\s*`, 'i'),
  new RegExp(`^following ${GUIDELINE_BODY},\\s*`, 'i'),
];

const TRAILING_PATTERNS: RegExp[] = [
  new RegExp(`\\s+according to ${GUIDELINE_BODY}\\??$`, 'i'),
  new RegExp(`\\s+as per ${GUIDELINE_BODY}\\??$`, 'i'),
  new RegExp(`\\s+based on ${GUIDELINE_BODY}\\??$`, 'i'),
  new RegExp(`\\s+in line with ${GUIDELINE_BODY}\\??$`, 'i'),
];

/**
 * Sanitises a question stem by removing guideline-citation preambles and
 * trailing references, then capitalises the first letter.
 */
export function sanitizeQuestionStem(text: string): string {
  if (!text) return text;

  let result = text.trim();

  // Strip leading patterns (e.g. "According to NICE CG90, what is...")
  for (const pattern of LEADING_PATTERNS) {
    const match = result.match(pattern);
    if (match) {
      result = result.slice(match[0].length);
      // Capitalise the new first character
      result = result.charAt(0).toUpperCase() + result.slice(1);
      break;
    }
  }

  // Strip trailing patterns (e.g. "... according to current UK guidelines?")
  for (const pattern of TRAILING_PATTERNS) {
    const hadQuestion = result.endsWith('?');
    const replaced = result.replace(pattern, (m) =>
      m.trimEnd().endsWith('?') ? '?' : ''
    );
    if (replaced !== result) {
      result = replaced;
      if (hadQuestion && !result.endsWith('?')) {
        result = result.trimEnd() + '?';
      }
      break; // only one trailing pattern applies
    }
  }

  return result.trim();
}

/**
 * Applies sanitizeQuestionStem to every question-like field in an object.
 * Supports {question}, {stem}, {question_stem} shaped objects.
 */
export function sanitizeQuestion<T extends Record<string, any>>(q: T): T {
  const clone = { ...q };
  if (typeof clone.question === 'string') {
    clone.question = sanitizeQuestionStem(clone.question);
  }
  if (typeof clone.stem === 'string') {
    clone.stem = sanitizeQuestionStem(clone.stem);
  }
  if (typeof clone.question_stem === 'string') {
    clone.question_stem = sanitizeQuestionStem(clone.question_stem);
  }
  return clone;
}
