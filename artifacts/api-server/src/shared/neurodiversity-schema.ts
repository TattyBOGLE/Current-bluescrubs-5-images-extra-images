export type NeuroAtypicalType = 
  | 'adhd'
  | 'dyslexia' 
  | 'autism'
  | 'dyspraxia'
  | 'processing-differences'
  | 'memory-support'
  | 'sensory-sensitivity'
  | 'executive-function'
  | 'none';

export interface NeuroAccommodation {
  id: NeuroAtypicalType;
  name: string;
  description: string;
  icon: string;
  accommodations: {
    timing: {
      extendedTime: boolean;
      timeMultiplier: number; // 1.5x, 2x etc
      flexibleBreaks: boolean;
      pauseAllowed: boolean;
    };
    display: {
      fontSize: 'normal' | 'large' | 'extra-large';
      contrast: 'normal' | 'high' | 'extra-high';
      lineSpacing: 'normal' | 'wide' | 'extra-wide';
      fontFamily: 'default' | 'dyslexia-friendly' | 'sans-serif';
      colorScheme: 'default' | 'warm' | 'cool' | 'monochrome';
    };
    content: {
      simplifiedLanguage: boolean;
      bulletPoints: boolean;
      visualCues: boolean;
      audioSupport: boolean;
      summaryCards: boolean;
      keywordHighlighting: boolean;
    };
    interaction: {
      largerButtons: boolean;
      reducedClutter: boolean;
      clearNavigation: boolean;
      confirmationDialogs: boolean;
      progressIndicators: boolean;
    };
    cognitive: {
      spacedRepetition: boolean;
      memoryAids: boolean;
      breakdownComplex: boolean;
      multipleFormats: boolean;
      contextualHelp: boolean;
    };
  };
}

export const NEURO_ACCOMMODATIONS: NeuroAccommodation[] = [
  {
    id: 'none',
    name: 'No Accommodations',
    description: 'Standard format without modifications',
    icon: '🎯',
    accommodations: {
      timing: { extendedTime: false, timeMultiplier: 1, flexibleBreaks: false, pauseAllowed: false },
      display: { fontSize: 'normal', contrast: 'normal', lineSpacing: 'normal', fontFamily: 'default', colorScheme: 'default' },
      content: { simplifiedLanguage: false, bulletPoints: false, visualCues: false, audioSupport: false, summaryCards: false, keywordHighlighting: false },
      interaction: { largerButtons: false, reducedClutter: false, clearNavigation: false, confirmationDialogs: false, progressIndicators: false },
      cognitive: { spacedRepetition: false, memoryAids: false, breakdownComplex: false, multipleFormats: false, contextualHelp: false }
    }
  },
  {
    id: 'adhd',
    name: 'ADHD Support',
    description: 'Enhanced focus with visual cues, flexible timing, and reduced distractions',
    icon: '⚡',
    accommodations: {
      timing: { extendedTime: true, timeMultiplier: 1.5, flexibleBreaks: true, pauseAllowed: true },
      display: { fontSize: 'large', contrast: 'high', lineSpacing: 'wide', fontFamily: 'sans-serif', colorScheme: 'cool' },
      content: { simplifiedLanguage: true, bulletPoints: true, visualCues: true, audioSupport: false, summaryCards: true, keywordHighlighting: true },
      interaction: { largerButtons: true, reducedClutter: true, clearNavigation: true, confirmationDialogs: true, progressIndicators: true },
      cognitive: { spacedRepetition: true, memoryAids: true, breakdownComplex: true, multipleFormats: false, contextualHelp: true }
    }
  },
  {
    id: 'dyslexia',
    name: 'Dyslexia Support',
    description: 'Improved readability with dyslexia-friendly fonts, high contrast, and audio support',
    icon: '📖',
    accommodations: {
      timing: { extendedTime: true, timeMultiplier: 2, flexibleBreaks: true, pauseAllowed: true },
      display: { fontSize: 'extra-large', contrast: 'extra-high', lineSpacing: 'extra-wide', fontFamily: 'dyslexia-friendly', colorScheme: 'warm' },
      content: { simplifiedLanguage: true, bulletPoints: true, visualCues: true, audioSupport: true, summaryCards: true, keywordHighlighting: true },
      interaction: { largerButtons: true, reducedClutter: true, clearNavigation: true, confirmationDialogs: false, progressIndicators: true },
      cognitive: { spacedRepetition: true, memoryAids: true, breakdownComplex: true, multipleFormats: true, contextualHelp: true }
    }
  },
  {
    id: 'autism',
    name: 'Autism Support',
    description: 'Structured format with reduced sensory overload and predictable navigation',
    icon: '🧩',
    accommodations: {
      timing: { extendedTime: true, timeMultiplier: 1.5, flexibleBreaks: true, pauseAllowed: true },
      display: { fontSize: 'large', contrast: 'high', lineSpacing: 'wide', fontFamily: 'default', colorScheme: 'monochrome' },
      content: { simplifiedLanguage: true, bulletPoints: true, visualCues: false, audioSupport: false, summaryCards: true, keywordHighlighting: false },
      interaction: { largerButtons: true, reducedClutter: true, clearNavigation: true, confirmationDialogs: true, progressIndicators: true },
      cognitive: { spacedRepetition: true, memoryAids: true, breakdownComplex: true, multipleFormats: false, contextualHelp: true }
    }
  },
  {
    id: 'dyspraxia',
    name: 'Dyspraxia Support',
    description: 'Simplified navigation with larger interactive elements and clear visual structure',
    icon: '🎯',
    accommodations: {
      timing: { extendedTime: true, timeMultiplier: 1.5, flexibleBreaks: true, pauseAllowed: true },
      display: { fontSize: 'extra-large', contrast: 'high', lineSpacing: 'wide', fontFamily: 'sans-serif', colorScheme: 'default' },
      content: { simplifiedLanguage: true, bulletPoints: true, visualCues: true, audioSupport: false, summaryCards: true, keywordHighlighting: true },
      interaction: { largerButtons: true, reducedClutter: true, clearNavigation: true, confirmationDialogs: true, progressIndicators: true },
      cognitive: { spacedRepetition: false, memoryAids: true, breakdownComplex: true, multipleFormats: false, contextualHelp: true }
    }
  },
  {
    id: 'processing-differences',
    name: 'Processing Support',
    description: 'Extended time with simplified language and multiple presentation formats',
    icon: '🧠',
    accommodations: {
      timing: { extendedTime: true, timeMultiplier: 2, flexibleBreaks: true, pauseAllowed: true },
      display: { fontSize: 'large', contrast: 'high', lineSpacing: 'wide', fontFamily: 'default', colorScheme: 'warm' },
      content: { simplifiedLanguage: true, bulletPoints: true, visualCues: true, audioSupport: true, summaryCards: true, keywordHighlighting: true },
      interaction: { largerButtons: false, reducedClutter: true, clearNavigation: true, confirmationDialogs: false, progressIndicators: true },
      cognitive: { spacedRepetition: true, memoryAids: true, breakdownComplex: true, multipleFormats: true, contextualHelp: true }
    }
  },
  {
    id: 'memory-support',
    name: 'Memory Support',
    description: 'Enhanced memory aids with spaced repetition and contextual reminders',
    icon: '🧩',
    accommodations: {
      timing: { extendedTime: true, timeMultiplier: 1.5, flexibleBreaks: true, pauseAllowed: true },
      display: { fontSize: 'large', contrast: 'normal', lineSpacing: 'wide', fontFamily: 'default', colorScheme: 'default' },
      content: { simplifiedLanguage: false, bulletPoints: true, visualCues: true, audioSupport: false, summaryCards: true, keywordHighlighting: true },
      interaction: { largerButtons: false, reducedClutter: false, clearNavigation: true, confirmationDialogs: false, progressIndicators: true },
      cognitive: { spacedRepetition: true, memoryAids: true, breakdownComplex: true, multipleFormats: true, contextualHelp: true }
    }
  },
  {
    id: 'sensory-sensitivity',
    name: 'Sensory Sensitivity',
    description: 'Reduced visual stimulation with calming color schemes and minimal animations',
    icon: '🌙',
    accommodations: {
      timing: { extendedTime: false, timeMultiplier: 1, flexibleBreaks: true, pauseAllowed: true },
      display: { fontSize: 'normal', contrast: 'normal', lineSpacing: 'normal', fontFamily: 'default', colorScheme: 'monochrome' },
      content: { simplifiedLanguage: false, bulletPoints: false, visualCues: false, audioSupport: false, summaryCards: false, keywordHighlighting: false },
      interaction: { largerButtons: false, reducedClutter: true, clearNavigation: true, confirmationDialogs: false, progressIndicators: false },
      cognitive: { spacedRepetition: false, memoryAids: false, breakdownComplex: false, multipleFormats: false, contextualHelp: false }
    }
  },
  {
    id: 'executive-function',
    name: 'Executive Function Support',
    description: 'Enhanced organization with clear progress tracking and structured workflows',
    icon: '📋',
    accommodations: {
      timing: { extendedTime: true, timeMultiplier: 1.5, flexibleBreaks: true, pauseAllowed: true },
      display: { fontSize: 'normal', contrast: 'normal', lineSpacing: 'normal', fontFamily: 'default', colorScheme: 'default' },
      content: { simplifiedLanguage: true, bulletPoints: true, visualCues: true, audioSupport: false, summaryCards: true, keywordHighlighting: false },
      interaction: { largerButtons: false, reducedClutter: true, clearNavigation: true, confirmationDialogs: true, progressIndicators: true },
      cognitive: { spacedRepetition: true, memoryAids: true, breakdownComplex: true, multipleFormats: false, contextualHelp: true }
    }
  }
];

export interface UserNeuroProfile {
  userId: string;
  selectedAccommodations: NeuroAtypicalType[];
  customSettings?: Partial<NeuroAccommodation['accommodations']>;
  createdAt: Date;
  updatedAt: Date;
}