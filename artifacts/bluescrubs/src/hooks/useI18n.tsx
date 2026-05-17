import { useState, useEffect } from 'react';

export type Language = 
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ar' | 'hi' 
  | 'ur' | 'zh' | 'ja' | 'ko' | 'ru' | 'tr' | 'pl' | 'nl' | 'sv';

export type SupportedLanguage = Language;

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' }
];

export function useI18n() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [nativeLanguage] = useState<Language>('en');
  const [isTranslationMode, setIsTranslationMode] = useState<boolean>(false);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('nhsprep_language') as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const translateText = (text: string, targetLanguage?: Language): string => {
    const lang = targetLanguage || currentLanguage;
    if (lang === 'en') return text;
    
    // Comprehensive medical translations for all supported languages
    const medicalTranslations: Record<string, Record<string, string>> = {
      ar: {
        "heart": "قلب", "patient": "مريض", "diagnosis": "تشخيص", "treatment": "علاج",
        "chest pain": "ألم في الصدر", "ECG": "تخطيط القلب", "STEMI": "احتشاء عضلة القلب",
        "Primary PCI": "التدخل التاجي الأولي", "thrombolysis": "إذابة الجلطة",
        "blood pressure": "ضغط الدم", "diabetes": "داء السكري", "asthma": "الربو",
        "pneumonia": "الالتهاب الرئوي", "stroke": "السكتة الدماغية", "surgery": "جراحة"
      },
      es: {
        "heart": "corazón", "patient": "paciente", "diagnosis": "diagnóstico", "treatment": "tratamiento",
        "chest pain": "dolor en el pecho", "ECG": "ECG", "STEMI": "STEMI",
        "Primary PCI": "ICP primario", "thrombolysis": "trombólisis",
        "blood pressure": "presión arterial", "diabetes": "diabetes", "asthma": "asma",
        "pneumonia": "neumonía", "stroke": "accidente cerebrovascular", "surgery": "cirugía"
      },
      fr: {
        "heart": "cœur", "patient": "patient", "diagnosis": "diagnostic", "treatment": "traitement",
        "chest pain": "douleur thoracique", "ECG": "ECG", "STEMI": "STEMI",
        "Primary PCI": "ICP primaire", "thrombolysis": "thrombolyse",
        "blood pressure": "tension artérielle", "diabetes": "diabète", "asthma": "asthme",
        "pneumonia": "pneumonie", "stroke": "accident vasculaire cérébral", "surgery": "chirurgie"
      },
      de: {
        "heart": "Herz", "patient": "Patient", "diagnosis": "Diagnose", "treatment": "Behandlung",
        "chest pain": "Brustschmerzen", "ECG": "EKG", "STEMI": "STEMI",
        "Primary PCI": "Primäre PCI", "thrombolysis": "Thrombolyse",
        "blood pressure": "Blutdruck", "diabetes": "Diabetes", "asthma": "Asthma",
        "pneumonia": "Lungenentzündung", "stroke": "Schlaganfall", "surgery": "Chirurgie"
      },
      it: {
        "heart": "cuore", "patient": "paziente", "diagnosis": "diagnosi", "treatment": "trattamento",
        "chest pain": "dolore toracico", "ECG": "ECG", "STEMI": "STEMI",
        "Primary PCI": "PCI primaria", "thrombolysis": "trombolisi",
        "blood pressure": "pressione sanguigna", "diabetes": "diabete", "asthma": "asma",
        "pneumonia": "polmonite", "stroke": "ictus", "surgery": "chirurgia"
      },
      pt: {
        "heart": "coração", "patient": "paciente", "diagnosis": "diagnóstico", "treatment": "tratamento",
        "chest pain": "dor no peito", "ECG": "ECG", "STEMI": "STEMI",
        "Primary PCI": "ICP primária", "thrombolysis": "trombólise",
        "blood pressure": "pressão arterial", "diabetes": "diabetes", "asthma": "asma",
        "pneumonia": "pneumonia", "stroke": "acidente vascular cerebral", "surgery": "cirurgia"
      },
      hi: {
        "heart": "हृदय", "patient": "रोगी", "diagnosis": "निदान", "treatment": "उपचार",
        "chest pain": "सीने में दर्द", "ECG": "ईसीजी", "STEMI": "एसटीईएमआई",
        "Primary PCI": "प्राथमिक पीसीआई", "thrombolysis": "थ्रोम्बोलाइसिस",
        "blood pressure": "रक्तचाप", "diabetes": "मधुमेह", "asthma": "दमा",
        "pneumonia": "निमोनिया", "stroke": "स्ट्रोक", "surgery": "शल्य चिकित्सा"
      },
      ur: {
        "heart": "دل", "patient": "مریض", "diagnosis": "تشخیص", "treatment": "علاج",
        "chest pain": "سینے میں درد", "ECG": "ای سی جی", "STEMI": "ایس ٹی ای ایم آئی",
        "Primary PCI": "بنیادی پی سی آئی", "thrombolysis": "تھرومبولائسس",
        "blood pressure": "بلڈ پریشر", "diabetes": "ذیابیطس", "asthma": "دمہ",
        "pneumonia": "نمونیا", "stroke": "فالج", "surgery": "سرجری"
      },
      zh: {
        "heart": "心脏", "patient": "患者", "diagnosis": "诊断", "treatment": "治疗",
        "chest pain": "胸痛", "ECG": "心电图", "STEMI": "ST段抬高型心梗",
        "Primary PCI": "急诊PCI", "thrombolysis": "溶栓",
        "blood pressure": "血压", "diabetes": "糖尿病", "asthma": "哮喘",
        "pneumonia": "肺炎", "stroke": "中风", "surgery": "手术"
      },
      ja: {
        "heart": "心臓", "patient": "患者", "diagnosis": "診断", "treatment": "治療",
        "chest pain": "胸痛", "ECG": "心電図", "STEMI": "STEMI",
        "Primary PCI": "一次PCI", "thrombolysis": "血栓溶解",
        "blood pressure": "血圧", "diabetes": "糖尿病", "asthma": "喘息",
        "pneumonia": "肺炎", "stroke": "脳卒中", "surgery": "手術"
      },
      ko: {
        "heart": "심장", "patient": "환자", "diagnosis": "진단", "treatment": "치료",
        "chest pain": "흉통", "ECG": "심전도", "STEMI": "STEMI",
        "Primary PCI": "일차 PCI", "thrombolysis": "혈전용해",
        "blood pressure": "혈압", "diabetes": "당뇨병", "asthma": "천식",
        "pneumonia": "폐렴", "stroke": "뇌졸중", "surgery": "수술"
      },
      ru: {
        "heart": "сердце", "patient": "пациент", "diagnosis": "диагноз", "treatment": "лечение",
        "chest pain": "боль в груди", "ECG": "ЭКГ", "STEMI": "STEMI",
        "Primary PCI": "первичное ЧКВ", "thrombolysis": "тромболизис",
        "blood pressure": "артериальное давление", "diabetes": "диабет", "asthma": "астма",
        "pneumonia": "пневмония", "stroke": "инсульт", "surgery": "хирургия"
      },
      tr: {
        "heart": "kalp", "patient": "hasta", "diagnosis": "tanı", "treatment": "tedavi",
        "chest pain": "göğüs ağrısı", "ECG": "EKG", "STEMI": "STEMI",
        "Primary PCI": "primer PCI", "thrombolysis": "tromboliz",
        "blood pressure": "kan basıncı", "diabetes": "diyabet", "asthma": "astım",
        "pneumonia": "zatürre", "stroke": "felç", "surgery": "cerrahi"
      },
      pl: {
        "heart": "serce", "patient": "pacjent", "diagnosis": "diagnoza", "treatment": "leczenie",
        "chest pain": "ból w klatce piersiowej", "ECG": "EKG", "STEMI": "STEMI",
        "Primary PCI": "pierwotne PCI", "thrombolysis": "tromboliza",
        "blood pressure": "ciśnienie krwi", "diabetes": "cukrzyca", "asthma": "astma",
        "pneumonia": "zapalenie płuc", "stroke": "udar", "surgery": "chirurgia"
      },
      nl: {
        "heart": "hart", "patient": "patiënt", "diagnosis": "diagnose", "treatment": "behandeling",
        "chest pain": "pijn op de borst", "ECG": "ECG", "STEMI": "STEMI",
        "Primary PCI": "primaire PCI", "thrombolysis": "trombolyse",
        "blood pressure": "bloeddruk", "diabetes": "diabetes", "asthma": "astma",
        "pneumonia": "longontsteking", "stroke": "beroerte", "surgery": "chirurgie"
      },
      sv: {
        "heart": "hjärta", "patient": "patient", "diagnosis": "diagnos", "treatment": "behandling",
        "chest pain": "bröstsmärta", "ECG": "EKG", "STEMI": "STEMI",
        "Primary PCI": "primär PCI", "thrombolysis": "trombolys",
        "blood pressure": "blodtryck", "diabetes": "diabetes", "asthma": "astma",
        "pneumonia": "lunginflammation", "stroke": "stroke", "surgery": "kirurgi"
      }
    };
    
    const translations = medicalTranslations[lang] || {};
    let translated = text;
    
    Object.entries(translations).forEach(([english, native]) => {
      translated = translated.replace(new RegExp(`\\b${english}\\b`, 'gi'), native);
    });
    
    return translated;
  };

  const translateMedicalTerm = (term: string, targetLanguage?: Language): string => {
    return translateText(term, targetLanguage);
  };

  const getMedicalDefinition = (term: string, targetLanguage?: Language): string => {
    return `Definition of ${term}`;
  };

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('nhsprep_language', language);
  };

  const toggleTranslationMode = () => {
    setIsTranslationMode(!isTranslationMode);
    if (isTranslationMode) {
      setLanguage('en');
    } else {
      setLanguage(nativeLanguage);
    }
  };

  const t = (key: string, category?: string): string => {
    const keyMap: Record<string, string> = {
      'language': 'Choose Language',
      'toggleTranslation': 'Translation Mode'
    };
    
    return keyMap[key] || key;
  };

  return {
    currentLanguage,
    nativeLanguage,
    isTranslationMode,
    setLanguage,
    toggleTranslationMode,
    translateText,
    translateMedicalTerm,
    getMedicalDefinition,
    t,
    isRTL: false,
    formatNumber: (num: number) => num.toString(),
    formatDate: (date: Date) => date.toLocaleDateString(),
    getAllLanguages: () => SUPPORTED_LANGUAGES,
  };
}