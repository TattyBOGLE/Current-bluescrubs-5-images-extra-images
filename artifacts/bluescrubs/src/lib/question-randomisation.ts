/**
 * Question randomisation utilities for BlueScrubsPrep.
 *
 * All functions are pure (except the localStorage helpers) and are safe to
 * call for a 2000+ question bank without perceptible delay.
 *
 * Answer-option shuffling keeps correct-answer tracking intact by updating
 * every answer-index field on the returned question objects.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QuizMode = 'random' | 'adaptive' | 'exam' | 'incorrect-only';

export interface QuestionPerformance {
  attempts: number;
  correct: number;
  lastAttempt: number;
}

export interface WeightedQuestion<T> {
  question: T;
  weight: number;
}

export interface QuestionServerStats {
  timesAnswered: number;
  accuracyRate: number | null;
  averageTimeSpent: number | null;
  discriminationIndex: number;
  incorrectOptionCounts: Record<string, number>;
}

export type QuestionStatsMap = Record<string, QuestionServerStats>;

// ---------------------------------------------------------------------------
// Core shuffle
// ---------------------------------------------------------------------------

/**
 * In-place Fisher-Yates (Knuth) shuffle. Returns a new array; original is
 * not mutated.
 */
export function shuffleArray<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ---------------------------------------------------------------------------
// Option-order shuffling
// ---------------------------------------------------------------------------

/**
 * Shuffle the answer options for a single question, tracking where the
 * correct option ends up so that answer-checking still works.
 *
 * Returns the new options array and the new index of the correct answer.
 */
export function shuffleOptionsWithMapping(
  options: string[],
  correctIndex: number
): { shuffledOptions: string[]; shuffledCorrectIndex: number } {
  const indexed = options.map((opt, i) => ({ opt, originalIdx: i }));
  const shuffled = shuffleArray(indexed);
  return {
    shuffledOptions: shuffled.map((x) => x.opt),
    shuffledCorrectIndex: shuffled.findIndex((x) => x.originalIdx === correctIndex),
  };
}

/**
 * Applies per-question option shuffling to an array of question objects.
 *
 * All three answer-index fields (`answer`, `correctAnswer`, `correct_answer`)
 * are updated so every downstream consumer (QuizQuestion, handleSubmitAnswer,
 * ExplanationPanel, buildLocalFallback) sees consistent data without any
 * other code changes.
 */
export function applyOptionShuffle<T extends Record<string, unknown>>(
  questions: T[]
): T[] {
  return questions.map((q) => {
    const options = q.options;
    if (!Array.isArray(options)) return q;

    let correctIdx: number =
      (q.correctAnswer as number | undefined) ??
      (q.correct_answer as number | undefined) ??
      (q.answer as number | undefined) ??
      0;

    if (typeof correctIdx === 'string') {
      correctIdx = (correctIdx as string).charCodeAt(0) - 65;
    }

    if (typeof correctIdx !== 'number' || correctIdx < 0 || correctIdx >= options.length) {
      return q;
    }

    const { shuffledOptions, shuffledCorrectIndex } = shuffleOptionsWithMapping(
      options as string[],
      correctIdx
    );

    return {
      ...q,
      options: shuffledOptions,
      answer: shuffledCorrectIndex,
      correctAnswer: shuffledCorrectIndex,
      correct_answer: shuffledCorrectIndex,
    };
  });
}

// ---------------------------------------------------------------------------
// Weighted / adaptive selection
// ---------------------------------------------------------------------------

/**
 * Weighted random selection without replacement.
 *
 * Higher-weight items are more likely to be selected early. O(count × n)
 * which is fast enough for banks of several thousand.
 */
export function weightedQuestionSelection<T>(
  pool: WeightedQuestion<T>[],
  count: number
): T[] {
  const remaining = [...pool];
  const selected: T[] = [];
  const target = Math.min(count, remaining.length);

  for (let i = 0; i < target; i++) {
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;
    let chosen = remaining.length - 1;

    for (let j = 0; j < remaining.length; j++) {
      rand -= remaining[j].weight;
      if (rand <= 0) {
        chosen = j;
        break;
      }
    }

    selected.push(remaining[chosen].question);
    remaining.splice(chosen, 1);
  }

  return selected;
}

/**
 * Build a weight for a question based on stored performance data.
 *
 *  - Never attempted  → weight 1.5  (moderate priority — learn it)
 *  - Accuracy < 50 %  → weight 4.0  (weak — high priority)
 *  - Accuracy 50–79 % → weight 2.0  (partial — medium priority)
 *  - Accuracy ≥ 80 %  → weight 0.3  (mastered — deprioritise)
 *  - In recent history → weight × 0.1  (prevent immediate repeat)
 *  - High discriminationIndex (>0.7) at mid-accuracy → weight × 1.4
 *    (most diagnostic questions for revealing skill gaps)
 *  - Low discriminationIndex (<0.3) → weight × 0.8 (poor differentiator)
 */
function computeWeight(
  questionId: string,
  performance: Record<string, QuestionPerformance>,
  recentIdSet: Set<string>,
  discriminationIndex?: number
): number {
  const p = performance[questionId];
  let weight: number;

  if (!p || p.attempts === 0) {
    weight = 1.5;
  } else {
    const accuracy = p.correct / p.attempts;
    if (accuracy < 0.5) weight = 4.0;
    else if (accuracy < 0.8) weight = 2.0;
    else weight = 0.3;

    // Boost high-discrimination questions in the mid-accuracy band — they
    // are the most diagnostic for identifying genuine skill gaps.
    if (discriminationIndex !== undefined && accuracy >= 0.3 && accuracy < 0.8) {
      if (discriminationIndex > 0.7) weight *= 1.4;
      else if (discriminationIndex < 0.3) weight *= 0.8;
    }
  }

  if (recentIdSet.has(questionId)) weight *= 0.1;

  return weight;
}

/**
 * Select `count` questions adaptively from a pool, using localStorage
 * performance history to prioritise weak/unseen questions.
 */
export function selectAdaptiveQuestions<T extends { id: string | number }>(
  pool: T[],
  count: number
): T[] {
  const performance = getStoredPerformance();
  const recentIdSet = new Set(getRecentQuestionIds(50));

  const weighted: WeightedQuestion<T>[] = pool.map((q) => ({
    question: q,
    weight: computeWeight(String(q.id), performance, recentIdSet),
  }));

  return weightedQuestionSelection(weighted, count);
}

/**
 * Like selectAdaptiveQuestions but also factors in server-side
 * discrimination indices from the question_stats DB table.
 */
export function selectAdaptiveQuestionsWithStats<T extends { id: string | number }>(
  pool: T[],
  count: number,
  serverStats: QuestionStatsMap = {}
): T[] {
  const performance = getStoredPerformance();
  const recentIdSet = new Set(getRecentQuestionIds(50));

  const weighted: WeightedQuestion<T>[] = pool.map((q) => {
    const qid = String(q.id);
    return {
      question: q,
      weight: computeWeight(qid, performance, recentIdSet, serverStats[qid]?.discriminationIndex),
    };
  });

  return weightedQuestionSelection(weighted, count);
}

/**
 * Filter a pool to only questions the user has answered incorrectly at least
 * once. Returns the full pool if no performance data exists yet.
 */
export function filterIncorrectOnlyQuestions<T extends { id: string | number }>(
  pool: T[]
): T[] {
  const performance = getStoredPerformance();
  const hasAnyData = Object.keys(performance).length > 0;
  if (!hasAnyData) return [];

  return pool.filter((q) => {
    const p = performance[String(q.id)];
    return p && p.attempts > 0 && p.correct < p.attempts;
  });
}

/**
 * Prevent immediate repeats by excluding any questions seen in the last N
 * sessions. Falls back to the full pool if filtering would leave fewer than
 * the requested count.
 */
export function preventRecentRepeats<T extends { id: string | number }>(
  pool: T[],
  count: number,
  historySize = 100
): T[] {
  const recentIdSet = new Set(getRecentQuestionIds(historySize));
  const filtered = pool.filter((q) => !recentIdSet.has(String(q.id)));
  return filtered.length >= count ? filtered : pool;
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

const PERF_KEY = 'plab_question_performance';
const HISTORY_KEY = 'plab_recent_questions';

export function getStoredPerformance(): Record<string, QuestionPerformance> {
  try {
    return JSON.parse(localStorage.getItem(PERF_KEY) ?? '{}') as Record<
      string,
      QuestionPerformance
    >;
  } catch {
    return {};
  }
}

export function recordQuestionAttempt(questionId: string, correct: boolean): void {
  try {
    const perf = getStoredPerformance();
    const prev = perf[questionId] ?? { attempts: 0, correct: 0, lastAttempt: 0 };
    perf[questionId] = {
      attempts: prev.attempts + 1,
      correct: prev.correct + (correct ? 1 : 0),
      lastAttempt: Date.now(),
    };
    localStorage.setItem(PERF_KEY, JSON.stringify(perf));
  } catch {
    // localStorage may be unavailable in private browsing
  }
}

export function getRecentQuestionIds(limit = 100): string[] {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as string[];
    return stored.slice(-limit);
  } catch {
    return [];
  }
}

export function addToRecentHistory(questionId: string): void {
  try {
    const recent = getRecentQuestionIds(200);
    recent.push(questionId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(recent.slice(-200)));
  } catch {
    // localStorage may be unavailable
  }
}

export function getPerformanceSummary(): {
  totalAttempted: number;
  totalCorrect: number;
  weakTopics: string[];
  masteredCount: number;
} {
  const perf = getStoredPerformance();
  const entries = Object.values(perf);
  const totalAttempted = entries.filter((p) => p.attempts > 0).length;
  const totalCorrect = entries.reduce((sum, p) => sum + p.correct, 0);
  const masteredCount = entries.filter(
    (p) => p.attempts > 0 && p.correct / p.attempts >= 0.8
  ).length;
  const weakTopics: string[] = [];

  return { totalAttempted, totalCorrect, weakTopics, masteredCount };
}
