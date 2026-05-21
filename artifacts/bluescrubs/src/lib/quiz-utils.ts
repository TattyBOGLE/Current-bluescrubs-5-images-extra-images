// Pure utility functions and shared types for the PLAB1 quiz extracted from plab1-new.tsx

export interface AIExplanation {
  correctRationale: string;
  options: Array<{ label: string; text: string; isCorrect: boolean; isSelected: boolean; why: string }>;
  keyLearningPoint: string;
  source: 'ai' | 'fallback';
}

export interface AIStudyTip {
  type: 'pearl' | 'exam' | 'pitfall';
  text: string;
}

export interface AIStudyTips {
  mnemonics: Array<{ title: string; expansion: string }>;
  tips: Array<AIStudyTip>;
  source: 'ai' | 'unavailable' | 'error';
}

export function buildLocalFallback(
  optionsArr: string[],
  correctIdx: number,
  selectedIdx: number,
  mnemonic?: string,
  storedExplanation?: string
): AIExplanation {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const correctText = optionsArr[correctIdx] ?? '';
  return {
    correctRationale: storedExplanation && storedExplanation.length > 30
      ? storedExplanation
      : `The correct answer is ${labels[correctIdx] ?? '?'}: ${correctText}. Review the question stem and relevant NICE/CKS guidance for the full rationale.`,
    options: optionsArr.map((text, i) => ({
      label: labels[i] ?? String(i + 1),
      text,
      isCorrect: i === correctIdx,
      isSelected: selectedIdx === i,
      why: i === correctIdx
        ? `${text} is the correct choice here. It directly matches the clinical scenario described and aligns with current UK guidelines. See the explanation above for the full rationale.`
        : `${text} is not the best answer for this scenario. While it may be appropriate in other contexts, the specific features of this case (patient history, symptom pattern, relevant guidelines) point away from this option — compare it against the correct answer above.`,
    })),
    keyLearningPoint: mnemonic || 'Anchor your reasoning in the patient demographics, symptoms, signs and investigations, then match to the most appropriate UK guideline step.',
    source: 'fallback',
  };
}

export function getTargetedExplanation(question: any, userAnswer: string, isCorrect: boolean): string {
  if (!question.explanation) return 'Clinical explanation provided for educational purposes.';

  const raw = question.explanation;
  const explanation: string = typeof raw === 'object' && raw !== null
    ? Object.entries(raw).map(([k, v]) => `Option ${k}: ${v}`).join('\n')
    : String(raw);
  const userAnswerIndex = parseInt(userAnswer);
  let correctAnswerIndex = question.correctAnswer ?? question.correct_answer ?? question.answer;
  if (typeof correctAnswerIndex === 'string') {
    correctAnswerIndex = correctAnswerIndex.charCodeAt(0) - 65;
  }

  if (isCorrect) {
    const lines = explanation.split('\n');
    const correctLine = lines.find((line: string) =>
      line.includes(`Option ${String.fromCharCode(65 + correctAnswerIndex)}`) &&
      line.includes('CORRECT')
    );
    if (correctLine) {
      const cleanExplanation = correctLine.replace(/Option [A-E] \([^)]+\) is CORRECT because/, '').trim();
      return `✓ Your answer is correct. ${cleanExplanation}`;
    }
    return '✓ Correct! ' + explanation.split('\n')[0];
  } else {
    const lines = explanation.split('\n');
    let feedback = '';
    const wrongLine = lines.find((line: string) =>
      line.includes(`Option ${String.fromCharCode(65 + userAnswerIndex)}`) &&
      line.includes('INCORRECT')
    );
    if (wrongLine) {
      const cleanWrongExplanation = wrongLine.replace(/Option [A-E] \([^)]+\) is INCORRECT because/, '').trim();
      feedback += `✗ Your choice (${String.fromCharCode(65 + userAnswerIndex)}) is incorrect because ${cleanWrongExplanation}\n\n`;
    }
    const correctLine = lines.find((line: string) =>
      line.includes(`Option ${String.fromCharCode(65 + correctAnswerIndex)}`) &&
      line.includes('CORRECT')
    );
    if (correctLine) {
      const cleanCorrectExplanation = correctLine.replace(/Option [A-E] \([^)]+\) is CORRECT because/, '').trim();
      feedback += `✓ The correct answer (${String.fromCharCode(65 + correctAnswerIndex)}) is right because ${cleanCorrectExplanation}`;
    }
    return feedback || explanation;
  }
}

export function getQuestionCount(category: string): number {
  const questionCounts: Record<string, number> = {
    'all': 5000,
    'cardiovascular': 450,
    'respiratory': 400,
    'gastroenterology': 350,
    'neurology': 300,
    'endocrinology': 280,
    'psychiatry': 260,
    'obstetrics-gynaecology': 300,
    'paediatrics': 320,
    'surgery': 380,
    'nephrology': 220,
    'haematology': 200,
    'infectious-diseases': 240,
    'rheumatology': 180,
    'dermatology': 160,
    'emergency-medicine': 350,
    'ethics-law': 150,
    'public-health': 140,
    'clinical-pharmacology': 160
  };
  return questionCounts[category] || 100;
}

export const availableCategories = [
  { value: 'all' as const, label: 'All Categories' },
  { value: 'cardiovascular' as const, label: 'Cardiovascular' },
  { value: 'respiratory' as const, label: 'Respiratory' },
  { value: 'gastroenterology' as const, label: 'Gastroenterology' },
  { value: 'neurology' as const, label: 'Neurology' },
  { value: 'endocrinology' as const, label: 'Endocrinology' },
  { value: 'psychiatry' as const, label: 'Psychiatry' },
  { value: 'obstetrics-gynaecology' as const, label: 'Obstetrics & Gynaecology' },
  { value: 'paediatrics' as const, label: 'Paediatrics' },
  { value: 'surgery' as const, label: 'Surgery' },
  { value: 'nephrology' as const, label: 'Nephrology' },
  { value: 'haematology' as const, label: 'Haematology' },
  { value: 'infectious-diseases' as const, label: 'Infectious Diseases' },
  { value: 'rheumatology' as const, label: 'Rheumatology' },
  { value: 'dermatology' as const, label: 'Dermatology' },
  { value: 'emergency-medicine' as const, label: 'Emergency Medicine' },
  { value: 'ethics-law' as const, label: 'Ethics & Law' },
  { value: 'public-health' as const, label: 'Public Health' },
  { value: 'clinical-pharmacology' as const, label: 'Clinical Pharmacology' }
];

export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);
  return `${seconds}.${ms.toString().padStart(2, '0')}s`;
}

export function calculatePoints(isCorrect: boolean, timeSpentMs: number, streak: number, difficulty: string): number {
  if (!isCorrect) return 0;

  const BASE_POINTS = 10;
  const difficultyMultipliers: Record<string, number> = {
    foundation: 1,
    intermediate: 1.5,
    advanced: 2,
  };
  const difficultyMultiplier = difficultyMultipliers[difficulty] || 1;
  const difficultyBonus = Math.floor(BASE_POINTS * (difficultyMultiplier - 1));

  let speedBonus = 0;
  if (timeSpentMs <= 30000) speedBonus = 5;

  let streakBonus = 0;
  if (streak >= 50) streakBonus = 100;
  else if (streak >= 20) streakBonus = 50;
  else if (streak >= 10) streakBonus = 25;
  else if (streak >= 5) streakBonus = 10;
  else if (streak >= 3) streakBonus = 5;

  return BASE_POINTS + difficultyBonus + speedBonus + streakBonus;
}
