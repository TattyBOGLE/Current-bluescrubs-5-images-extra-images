export type SupportedLanguage = 
  | 'en' // English (UK)
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'it' // Italian
  | 'pt' // Portuguese
  | 'ar' // Arabic
  | 'hi' // Hindi
  | 'ur' // Urdu
  | 'bn' // Bengali
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'tr' // Turkish
  | 'pl' // Polish
  | 'ru' // Russian
  | 'zh' // Chinese (Simplified)
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'th' // Thai
  | 'vi' // Vietnamese
  | 'id' // Indonesian
  | 'ms' // Malay
  | 'tl' // Filipino/Tagalog
  | 'sw' // Swahili
  | 'am' // Amharic
  | 'ha' // Hausa
  | 'yo' // Yoruba
  | 'ig' // Igbo;

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export interface TranslationEntry {
  en: string;
  [key: string]: string | undefined;
}

export interface MedicalTermTranslation {
  term: string;
  translations: Partial<Record<SupportedLanguage, string>>;
  category: 'anatomy' | 'condition' | 'procedure' | 'medication' | 'specialty' | 'general';
  definition?: Partial<Record<SupportedLanguage, string>>;
}

export interface QuestionTranslation {
  questionId: string;
  originalText: string;
  translations: Record<SupportedLanguage, string>;
  medicalTerms: string[]; // Terms that can be toggled for translation
  explanations: Record<SupportedLanguage, string>;
}

export interface UITranslations {
  navigation: Record<string, TranslationEntry>;
  buttons: Record<string, TranslationEntry>;
  labels: Record<string, TranslationEntry>;
  messages: Record<string, TranslationEntry>;
  exam: Record<string, TranslationEntry>;
  medical: Record<string, TranslationEntry>;
}