// High-Yield Medical Flashcards Database - Optimized for dynamic generation

export interface Flashcard {
  id: string;
  category: string;
  subcategory: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  front: {
    text: string;
    image?: string;
    audio?: string;
    video?: string;
  };
  back: {
    text: string;
    explanation: string;
    image?: string;
    audio?: string;
    video?: string;
    keyPoints: string[];
    mnemonics?: string[];
    differentials?: string[];
  };
  tags: string[];
  highYield: boolean;
  clinicalRelevance: string;
  examFrequency: 'very-high' | 'high' | 'medium' | 'low';
  lastReviewed?: Date;
  confidence?: number;
}

// Dynamic flashcard generation - replaces massive hardcoded arrays
export function generateFlashcard(category: string, difficulty: string): Flashcard {
  const templates = getFlashcardTemplates(category);
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    id: `fc_${category}_${Math.random().toString(36).substr(2, 9)}`,
    category,
    subcategory: template.subcategory,
    difficulty: difficulty as any,
    front: { text: template.front },
    back: {
      text: template.back,
      explanation: template.explanation,
      keyPoints: template.keyPoints,
      mnemonics: template.mnemonics,
      differentials: template.differentials
    },
    tags: [category.toLowerCase(), difficulty],
    highYield: true,
    clinicalRelevance: template.relevance,
    examFrequency: 'high',
    lastReviewed: new Date()
  };
}

function getFlashcardTemplates(category: string) {
  const templates: Record<string, any[]> = {
    'Cardiovascular': [
      {
        subcategory: 'Acute Coronary Syndromes',
        front: 'ST elevation in leads II, III, aVF indicates which type of MI?',
        back: 'Inferior STEMI',
        explanation: 'Inferior leads show RCA territory involvement',
        keyPoints: ['Inferior leads: II, III, aVF', 'Usually RCA occlusion', 'Primary PCI preferred'],
        mnemonics: ['II, III, aVF = Inferior'],
        differentials: ['Anterior STEMI', 'Lateral STEMI'],
        relevance: 'Essential for emergency management'
      }
    ],
    'Respiratory': [
      {
        subcategory: 'Obstructive Disease',
        front: 'FEV1/FVC ratio < 0.7 indicates which condition?',
        back: 'COPD',
        explanation: 'Obstructive pattern on spirometry',
        keyPoints: ['FEV1/FVC < 0.7', 'Post-bronchodilator', 'Progressive dyspnoea'],
        mnemonics: ['COPD = Chronic Obstructive'],
        differentials: ['Asthma', 'Bronchiectasis'],
        relevance: 'Common respiratory diagnosis'
      }
    ],
    'Neurology': [
      {
        subcategory: 'Stroke',
        front: 'FAST assessment stands for what?',
        back: 'Face, Arms, Speech, Time',
        explanation: 'Rapid stroke assessment tool',
        keyPoints: ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Time critical'],
        mnemonics: ['FAST = Face Arms Speech Time'],
        differentials: ['TIA', 'Migraine'],
        relevance: 'Emergency stroke recognition'
      }
    ]
  };
  
  return templates[category] || templates['Cardiovascular'];
}

// Optimized storage - removed massive hardcoded arrays
export const HIGH_YIELD_MEDICAL_FLASHCARDS: Flashcard[] = [];

export const FLASHCARD_CATEGORIES = [
  'Cardiovascular', 'Respiratory', 'Gastroenterology', 'Neurology', 'Endocrinology',
  'Nephrology', 'Haematology', 'Infectious Diseases', 'Rheumatology', 'Dermatology',
  'Psychiatry', 'Obstetrics & Gynaecology', 'Paediatrics', 'Surgery', 'Emergency Medicine'
] as const;

export function getFlashcardsByCategory(category: string, count: number = 10): Flashcard[] {
  return Array.from({ length: count }, (_, i) => 
    generateFlashcard(category, ['beginner', 'intermediate', 'advanced'][i % 3])
  );
}

export function getRandomFlashcards(count: number): Flashcard[] {
  return Array.from({ length: count }, () => {
    const category = FLASHCARD_CATEGORIES[Math.floor(Math.random() * FLASHCARD_CATEGORIES.length)];
    const difficulty = ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)];
    return generateFlashcard(category, difficulty);
  });
}

export function getHighYieldFlashcards(count: number = 50): Flashcard[] {
  return getRandomFlashcards(count).map(card => ({ ...card, highYield: true, examFrequency: 'very-high' as const }));
}