import React, { useState, useEffect, useContext, createContext } from 'react';
import type { SupportedLanguage } from '@shared/i18n-types';
import { UI_TRANSLATIONS, MEDICAL_TERMS, detectUserLanguage, isRTL } from '@shared/i18n-data';

interface I18nContextType {
  currentLanguage: SupportedLanguage;
  nativeLanguage: SupportedLanguage;
  isTranslationMode: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleTranslationMode: () => void;
  t: (key: string, section?: keyof typeof UI_TRANSLATIONS) => string;
  translateText: (text: string, targetLanguage?: SupportedLanguage) => string;
  translateMedicalTerm: (term: string) => string;
  getMedicalDefinition: (term: string) => string;
  isRightToLeft: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [nativeLanguage, setNativeLanguage] = useState<SupportedLanguage>('en');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isTranslationMode, setIsTranslationMode] = useState(false);

  useEffect(() => {
    // Detect user's native language on first load
    const detected = detectUserLanguage() as SupportedLanguage;
    const stored = localStorage.getItem('nhsprep-native-language') as SupportedLanguage;
    const userLang = stored || detected;
    
    setNativeLanguage(userLang);
    setCurrentLanguage(userLang);
    
    // Store for future sessions
    localStorage.setItem('nhsprep-native-language', userLang);
    
    // Apply RTL if needed
    document.documentElement.dir = isRTL(userLang) ? 'rtl' : 'ltr';
    document.documentElement.lang = userLang;
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('nhsprep-current-language', lang);
  };

  const toggleTranslationMode = () => {
    if (isTranslationMode) {
      // Switch back to English for exam mode
      setLanguage('en');
    } else {
      // Switch to native language for understanding
      setLanguage(nativeLanguage);
    }
    setIsTranslationMode(!isTranslationMode);
  };

  const t = (key: string, section: keyof typeof UI_TRANSLATIONS = 'labels'): string => {
    const translations = UI_TRANSLATIONS[section]?.[key];
    if (!translations) return key;
    
    return translations[currentLanguage] || translations.en || key;
  };

  const translateMedicalTerm = (term: string): string => {
    const medicalTerm = MEDICAL_TERMS.find(
      mt => mt.term.toLowerCase() === term.toLowerCase()
    );
    
    if (!medicalTerm) return term;
    
    return medicalTerm.translations[currentLanguage] || 
           medicalTerm.translations.en || 
           term;
  };

  const translateText = (text: string, targetLanguage?: SupportedLanguage): string => {
    const lang = targetLanguage || currentLanguage;
    if (lang === 'en') return text;
    
    // Basic medical translations
    const medicalTranslations: Record<string, Record<string, string>> = {
      ar: {
        "heart": "قلب", "patient": "مريض", "diagnosis": "تشخيص", "treatment": "علاج",
        "chest pain": "ألم في الصدر", "ECG": "تخطيط القلب", "STEMI": "احتشاء عضلة القلب",
        "Primary PCI": "التدخل التاجي الأولي", "thrombolysis": "إذابة الجلطة",
        "crushing central": "سحق مركزي", "radiating": "مشع", "left arm": "الذراع الأيسر",
        "jaw": "الفك", "ST elevation": "ارتفاع ST", "leads": "المؤشرات",
        "immediate management": "الإدارة الفورية", "Inferior": "سفلي", "within": "خلال",
        "minutes": "دقائق", "Usually": "عادة", "occlusion": "انسداد", "preferred": "مفضل"
      },
      es: {
        "heart": "corazón", "patient": "paciente", "diagnosis": "diagnóstico", "treatment": "tratamiento",
        "chest pain": "dolor en el pecho", "ECG": "ECG", "STEMI": "STEMI",
        "Primary PCI": "ICP primario", "thrombolysis": "trombólisis",
        "crushing central": "dolor central aplastante", "radiating": "irradiando", "left arm": "brazo izquierdo",
        "jaw": "mandíbula", "ST elevation": "elevación del ST", "leads": "derivaciones",
        "immediate management": "manejo inmediato", "Inferior": "Inferior", "within": "dentro de",
        "minutes": "minutos", "Usually": "Usualmente", "occlusion": "oclusión", "preferred": "preferido"
      },
      fr: {
        "heart": "cœur", "patient": "patient", "diagnosis": "diagnostic", "treatment": "traitement",
        "chest pain": "douleur thoracique", "ECG": "ECG", "STEMI": "STEMI",
        "Primary PCI": "ICP primaire", "thrombolysis": "thrombolyse",
        "crushing central": "douleur centrale écrasante", "radiating": "irradiant", "left arm": "bras gauche",
        "jaw": "mâchoire", "ST elevation": "élévation du ST", "leads": "dérivations",
        "immediate management": "prise en charge immédiate", "Inferior": "Inférieur", "within": "dans les",
        "minutes": "minutes", "Usually": "Généralement", "occlusion": "occlusion", "preferred": "préféré"
      }
    };
    
    const translations = medicalTranslations[lang] || {};
    let translated = text;
    
    Object.entries(translations).forEach(([english, native]) => {
      translated = translated.replace(new RegExp(english, 'gi'), native);
    });
    
    return translated;
  };

  const getMedicalDefinition = (term: string): string => {
    const medicalTerm = MEDICAL_TERMS.find(
      mt => mt.term.toLowerCase() === term.toLowerCase()
    );
    
    if (!medicalTerm?.definition) return '';
    
    return medicalTerm.definition[currentLanguage] || 
           medicalTerm.definition.en || 
           '';
  };

  const value: I18nContextType = {
    currentLanguage,
    nativeLanguage,
    isTranslationMode,
    setLanguage,
    toggleTranslationMode,
    t,
    translateText,
    translateMedicalTerm,
    getMedicalDefinition,
    isRightToLeft: isRTL(currentLanguage)
  };

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}