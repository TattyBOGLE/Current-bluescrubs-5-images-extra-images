// Internationalization system for NHSprep platform
export type Language = 
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ar' | 'hi' 
  | 'ur' | 'zh' | 'ja' | 'ko' | 'ru' | 'tr' | 'pl' | 'nl' | 'sv';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧' },
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

interface TranslationKeys {
  // Navigation
  'nav.dashboard': string;
  'nav.plab1': string;
  'nav.plab2': string;
  'nav.community': string;
  'nav.more': string;
  
  // Common
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.save': string;
  'common.cancel': string;
  'common.next': string;
  'common.previous': string;
  'common.finish': string;
  'common.start': string;
  
  // Dashboard
  'dashboard.title': string;
  'dashboard.welcomeBack': string;
  'dashboard.studyStreak': string;
  'dashboard.questionsAnswered': string;
  'dashboard.accuracyRate': string;
  'dashboard.studyTime': string;
  
  // PLAB
  'plab.preparation': string;
  'plab.practiceTest': string;
  'plab.results': string;
  'plab.feedback': string;
  'plab.nextQuestion': string;
  'plab.submitAnswer': string;
  
  // Study
  'study.schedule': string;
  'study.progress': string;
  'study.topics': string;
  'study.difficulty': string;
  'study.timeSpent': string;
  
  // Profile
  'profile.settings': string;
  'profile.language': string;
  'profile.notifications': string;
  'profile.privacy': string;
  
  // Medical Terms
  'medical.cardiology': string;
  'medical.respiratory': string;
  'medical.gastroenterology': string;
  'medical.neurology': string;
  'medical.psychiatry': string;
  'medical.pediatrics': string;
  'medical.obstetrics': string;
  'medical.surgery': string;
  
  // Career
  'career.jobSearch': string;
  'career.applications': string;
  'career.interviews': string;
  'career.placement': string;
  'career.salary': string;
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.plab1': 'PLAB 1',
    'nav.plab2': 'PLAB 2',
    'nav.community': 'Community',
    'nav.more': 'More',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    'common.start': 'Start',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcomeBack': 'Welcome back',
    'dashboard.studyStreak': 'Study Streak',
    'dashboard.questionsAnswered': 'Questions Answered',
    'dashboard.accuracyRate': 'Accuracy Rate',
    'dashboard.studyTime': 'Study Time',
    
    // PLAB
    'plab.preparation': 'PLAB Preparation',
    'plab.practiceTest': 'Practice Test',
    'plab.results': 'Results',
    'plab.feedback': 'Feedback',
    'plab.nextQuestion': 'Next Question',
    'plab.submitAnswer': 'Submit Answer',
    
    // Study
    'study.schedule': 'Study Schedule',
    'study.progress': 'Progress',
    'study.topics': 'Topics',
    'study.difficulty': 'Difficulty',
    'study.timeSpent': 'Time Spent',
    
    // Profile
    'profile.settings': 'Settings',
    'profile.language': 'Language',
    'profile.notifications': 'Notifications',
    'profile.privacy': 'Privacy',
    
    // Medical Terms
    'medical.cardiology': 'Cardiology',
    'medical.respiratory': 'Respiratory',
    'medical.gastroenterology': 'Gastroenterology',
    'medical.neurology': 'Neurology',
    'medical.psychiatry': 'Psychiatry',
    'medical.pediatrics': 'Pediatrics',
    'medical.obstetrics': 'Obstetrics & Gynecology',
    'medical.surgery': 'Surgery',
    
    // Career
    'career.jobSearch': 'Job Search',
    'career.applications': 'Applications',
    'career.interviews': 'Interviews',
    'career.placement': 'Job Placement',
    'career.salary': 'Salary Information'
  },
  
  es: {
    // Navigation
    'nav.dashboard': 'Panel Principal',
    'nav.plab1': 'PLAB 1',
    'nav.plab2': 'PLAB 2',
    'nav.community': 'Comunidad',
    'nav.more': 'Más',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.finish': 'Finalizar',
    'common.start': 'Comenzar',
    
    // Dashboard
    'dashboard.title': 'Panel Principal',
    'dashboard.welcomeBack': 'Bienvenido de vuelta',
    'dashboard.studyStreak': 'Racha de Estudio',
    'dashboard.questionsAnswered': 'Preguntas Respondidas',
    'dashboard.accuracyRate': 'Tasa de Precisión',
    'dashboard.studyTime': 'Tiempo de Estudio',
    
    // PLAB
    'plab.preparation': 'Preparación PLAB',
    'plab.practiceTest': 'Examen de Práctica',
    'plab.results': 'Resultados',
    'plab.feedback': 'Retroalimentación',
    'plab.nextQuestion': 'Siguiente Pregunta',
    'plab.submitAnswer': 'Enviar Respuesta',
    
    // Study
    'study.schedule': 'Horario de Estudio',
    'study.progress': 'Progreso',
    'study.topics': 'Temas',
    'study.difficulty': 'Dificultad',
    'study.timeSpent': 'Tiempo Dedicado',
    
    // Profile
    'profile.settings': 'Configuración',
    'profile.language': 'Idioma',
    'profile.notifications': 'Notificaciones',
    'profile.privacy': 'Privacidad',
    
    // Medical Terms
    'medical.cardiology': 'Cardiología',
    'medical.respiratory': 'Respiratorio',
    'medical.gastroenterology': 'Gastroenterología',
    'medical.neurology': 'Neurología',
    'medical.psychiatry': 'Psiquiatría',
    'medical.pediatrics': 'Pediatría',
    'medical.obstetrics': 'Obstetricia y Ginecología',
    'medical.surgery': 'Cirugía',
    
    // Career
    'career.jobSearch': 'Búsqueda de Empleo',
    'career.applications': 'Aplicaciones',
    'career.interviews': 'Entrevistas',
    'career.placement': 'Colocación Laboral',
    'career.salary': 'Información Salarial'
  },
  
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.plab1': 'PLAB 1',
    'nav.plab2': 'PLAB 2',
    'nav.community': 'المجتمع',
    'nav.more': 'المزيد',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.finish': 'إنهاء',
    'common.start': 'ابدأ',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcomeBack': 'مرحباً بعودتك',
    'dashboard.studyStreak': 'سلسلة الدراسة',
    'dashboard.questionsAnswered': 'الأسئلة المجابة',
    'dashboard.accuracyRate': 'معدل الدقة',
    'dashboard.studyTime': 'وقت الدراسة',
    
    // PLAB
    'plab.preparation': 'تحضير PLAB',
    'plab.practiceTest': 'اختبار تدريبي',
    'plab.results': 'النتائج',
    'plab.feedback': 'التغذية الراجعة',
    'plab.nextQuestion': 'السؤال التالي',
    'plab.submitAnswer': 'إرسال الإجابة',
    
    // Study
    'study.schedule': 'جدول الدراسة',
    'study.progress': 'التقدم',
    'study.topics': 'المواضيع',
    'study.difficulty': 'الصعوبة',
    'study.timeSpent': 'الوقت المستغرق',
    
    // Profile
    'profile.settings': 'الإعدادات',
    'profile.language': 'اللغة',
    'profile.notifications': 'الإشعارات',
    'profile.privacy': 'الخصوصية',
    
    // Medical Terms
    'medical.cardiology': 'أمراض القلب',
    'medical.respiratory': 'الجهاز التنفسي',
    'medical.gastroenterology': 'أمراض الجهاز الهضمي',
    'medical.neurology': 'طب الأعصاب',
    'medical.psychiatry': 'الطب النفسي',
    'medical.pediatrics': 'طب الأطفال',
    'medical.obstetrics': 'أمراض النساء والولادة',
    'medical.surgery': 'الجراحة',
    
    // Career
    'career.jobSearch': 'البحث عن وظيفة',
    'career.applications': 'الطلبات',
    'career.interviews': 'المقابلات',
    'career.placement': 'التوظيف',
    'career.salary': 'معلومات الراتب'
  },
  
  // Placeholder for additional languages - in production these would be properly translated
  fr: {
    'nav.dashboard': 'Tableau de bord',
    'nav.plab1': 'PLAB 1',
    'nav.plab2': 'PLAB 2',
    'nav.community': 'Communauté',
    'nav.more': 'Plus',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.finish': 'Terminer',
    'common.start': 'Commencer',
    'dashboard.title': 'Tableau de bord',
    'dashboard.welcomeBack': 'Bon retour',
    'dashboard.studyStreak': 'Série d\'études',
    'dashboard.questionsAnswered': 'Questions répondues',
    'dashboard.accuracyRate': 'Taux de précision',
    'dashboard.studyTime': 'Temps d\'étude',
    'plab.preparation': 'Préparation PLAB',
    'plab.practiceTest': 'Test de pratique',
    'plab.results': 'Résultats',
    'plab.feedback': 'Commentaires',
    'plab.nextQuestion': 'Question suivante',
    'plab.submitAnswer': 'Soumettre la réponse',
    'study.schedule': 'Horaire d\'étude',
    'study.progress': 'Progrès',
    'study.topics': 'Sujets',
    'study.difficulty': 'Difficulté',
    'study.timeSpent': 'Temps passé',
    'profile.settings': 'Paramètres',
    'profile.language': 'Langue',
    'profile.notifications': 'Notifications',
    'profile.privacy': 'Confidentialité',
    'medical.cardiology': 'Cardiologie',
    'medical.respiratory': 'Respiratoire',
    'medical.gastroenterology': 'Gastro-entérologie',
    'medical.neurology': 'Neurologie',
    'medical.psychiatry': 'Psychiatrie',
    'medical.pediatrics': 'Pédiatrie',
    'medical.obstetrics': 'Obstétrique et gynécologie',
    'medical.surgery': 'Chirurgie',
    'career.jobSearch': 'Recherche d\'emploi',
    'career.applications': 'Candidatures',
    'career.interviews': 'Entretiens',
    'career.placement': 'Placement professionnel',
    'career.salary': 'Informations salariales'
  },
  de: {
    'nav.dashboard': 'Dashboard',
    'nav.plab1': 'PLAB 1',
    'nav.plab2': 'PLAB 2',
    'nav.community': 'Gemeinschaft',
    'nav.more': 'Mehr',
    'common.loading': 'Wird geladen...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.finish': 'Beenden',
    'common.start': 'Start',
    'dashboard.title': 'Dashboard',
    'dashboard.welcomeBack': 'Willkommen zurück',
    'dashboard.studyStreak': 'Lernserie',
    'dashboard.questionsAnswered': 'Beantwortete Fragen',
    'dashboard.accuracyRate': 'Genauigkeitsrate',
    'dashboard.studyTime': 'Lernzeit',
    'plab.preparation': 'PLAB Vorbereitung',
    'plab.practiceTest': 'Übungstest',
    'plab.results': 'Ergebnisse',
    'plab.feedback': 'Feedback',
    'plab.nextQuestion': 'Nächste Frage',
    'plab.submitAnswer': 'Antwort einreichen',
    'study.schedule': 'Lernplan',
    'study.progress': 'Fortschritt',
    'study.topics': 'Themen',
    'study.difficulty': 'Schwierigkeit',
    'study.timeSpent': 'Aufgewendete Zeit',
    'profile.settings': 'Einstellungen',
    'profile.language': 'Sprache',
    'profile.notifications': 'Benachrichtigungen',
    'profile.privacy': 'Datenschutz',
    'medical.cardiology': 'Kardiologie',
    'medical.respiratory': 'Atemwege',
    'medical.gastroenterology': 'Gastroenterologie',
    'medical.neurology': 'Neurologie',
    'medical.psychiatry': 'Psychiatrie',
    'medical.pediatrics': 'Pädiatrie',
    'medical.obstetrics': 'Geburtshilfe und Gynäkologie',
    'medical.surgery': 'Chirurgie',
    'career.jobSearch': 'Jobsuche',
    'career.applications': 'Bewerbungen',
    'career.interviews': 'Vorstellungsgespräche',
    'career.placement': 'Stellenvermittlung',
    'career.salary': 'Gehaltsinformationen'
  },
  it: { ...translations.en },
  pt: { ...translations.en },
  hi: { ...translations.en },
  ur: { ...translations.en },
  zh: { ...translations.en },
  ja: { ...translations.en },
  ko: { ...translations.en },
  ru: { ...translations.en },
  tr: { ...translations.en },
  pl: { ...translations.en },
  nl: { ...translations.en },
  sv: { ...translations.en }
};

class I18nManager {
  private currentLanguage: Language = 'en';
  private listeners: ((language: Language) => void)[] = [];

  constructor() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('nhsprep_language') as Language;
    if (savedLanguage && SUPPORTED_LANGUAGES.find(l => l.code === savedLanguage)) {
      this.currentLanguage = savedLanguage;
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (SUPPORTED_LANGUAGES.find(l => l.code === browserLang)) {
        this.currentLanguage = browserLang;
      }
    }
    
    this.updateDocumentDirection();
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language): void {
    if (SUPPORTED_LANGUAGES.find(l => l.code === language)) {
      this.currentLanguage = language;
      localStorage.setItem('nhsprep_language', language);
      this.updateDocumentDirection();
      this.notifyListeners();
    }
  }

  translate(key: keyof TranslationKeys): string {
    return translations[this.currentLanguage][key] || translations.en[key] || key;
  }

  t = this.translate.bind(this);

  getLanguageInfo(code: Language): LanguageOption | undefined {
    return SUPPORTED_LANGUAGES.find(l => l.code === code);
  }

  getAllLanguages(): LanguageOption[] {
    return SUPPORTED_LANGUAGES;
  }

  isRTL(): boolean {
    const langInfo = this.getLanguageInfo(this.currentLanguage);
    return langInfo?.rtl || false;
  }

  private updateDocumentDirection(): void {
    document.documentElement.dir = this.isRTL() ? 'rtl' : 'ltr';
    document.documentElement.lang = this.currentLanguage === 'en' ? 'en-GB' : this.currentLanguage;
  }

  onLanguageChange(listener: (language: Language) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  // Format numbers according to locale
  formatNumber(number: number): string {
    const locale = this.currentLanguage === 'en' ? 'en-GB' : this.currentLanguage;
    return new Intl.NumberFormat(locale).format(number);
  }

  // Format dates according to locale
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const locale = this.currentLanguage === 'en' ? 'en-GB' : this.currentLanguage;
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  // Format currency according to locale
  formatCurrency(amount: number, currency: string = 'GBP'): string {
    return new Intl.NumberFormat(this.currentLanguage, {
      style: 'currency',
      currency
    }).format(amount);
  }
}

export const i18n = new I18nManager();
export default i18n;