import type { LanguageOption, UITranslations, MedicalTermTranslation } from './i18n-types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English (UK)', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󐁧󐁢󐁷󐁬󐁳󐁿' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera', flag: '🇪🇸' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', rtl: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', flag: '🇰🇿' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргыз', flag: '🇰🇬' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', flag: '🇺🇿' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen', flag: '🇹🇲' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', flag: '🇲🇳' }
];

export const UI_TRANSLATIONS: UITranslations = {
  navigation: {
    home: { en: 'Home', es: 'Inicio', fr: 'Accueil', de: 'Startseite', ar: 'الرئيسية', hi: 'होम', zh: '首页' },
    practice: { en: 'Practice', es: 'Práctica', fr: 'Pratique', de: 'Übung', ar: 'التمرين', hi: 'अभ्यास', zh: '练习' },
    exams: { en: 'Exams', es: 'Exámenes', fr: 'Examens', de: 'Prüfungen', ar: 'الامتحانات', hi: 'परीक्षाएं', zh: '考试' },
    progress: { en: 'Progress', es: 'Progreso', fr: 'Progrès', de: 'Fortschritt', ar: 'التقدم', hi: 'प्रगति', zh: '进度' },
    settings: { en: 'Settings', es: 'Configuración', fr: 'Paramètres', de: 'Einstellungen', ar: 'الإعدادات', hi: 'सेटिंग्स', zh: '设置' }
  },
  buttons: {
    next: { en: 'Next', es: 'Siguiente', fr: 'Suivant', de: 'Weiter', ar: 'التالي', hi: 'अगला', zh: '下一个' },
    previous: { en: 'Previous', es: 'Anterior', fr: 'Précédent', de: 'Zurück', ar: 'السابق', hi: 'पिछला', zh: '上一个' },
    submit: { en: 'Submit', es: 'Enviar', fr: 'Soumettre', de: 'Senden', ar: 'إرسال', hi: 'जमा करें', zh: '提交' },
    start: { en: 'Start', es: 'Comenzar', fr: 'Commencer', de: 'Starten', ar: 'ابدأ', hi: 'शुरू करें', zh: '开始' },
    continue: { en: 'Continue', es: 'Continuar', fr: 'Continuer', de: 'Fortfahren', ar: 'متابعة', hi: 'जारी रखें', zh: '继续' },
    finish: { en: 'Finish', es: 'Terminar', fr: 'Terminer', de: 'Beenden', ar: 'إنهاء', hi: 'समाप्त करें', zh: '完成' }
  },
  labels: {
    language: { en: 'Language', es: 'Idioma', fr: 'Langue', de: 'Sprache', ar: 'اللغة', hi: 'भाषा', zh: '语言' },
    question: { en: 'Question', es: 'Pregunta', fr: 'Question', de: 'Frage', ar: 'سؤال', hi: 'प्रश्न', zh: '问题' },
    answer: { en: 'Answer', es: 'Respuesta', fr: 'Réponse', de: 'Antwort', ar: 'جواب', hi: 'उत्तर', zh: '答案' },
    score: { en: 'Score', es: 'Puntuación', fr: 'Score', de: 'Punktzahl', ar: 'النتيجة', hi: 'स्कोर', zh: '分数' },
    time: { en: 'Time', es: 'Tiempo', fr: 'Temps', de: 'Zeit', ar: 'الوقت', hi: 'समय', zh: '时间' }
  },
  messages: {
    correct: { en: 'Correct!', es: '¡Correcto!', fr: 'Correct!', de: 'Richtig!', ar: 'صحيح!', hi: 'सही!', zh: '正确!' },
    incorrect: { en: 'Incorrect', es: 'Incorrecto', fr: 'Incorrect', de: 'Falsch', ar: 'خطأ', hi: 'गलत', zh: '错误' },
    loading: { en: 'Loading...', es: 'Cargando...', fr: 'Chargement...', de: 'Laden...', ar: 'جاري التحميل...', hi: 'लोड हो रहा है...', zh: '加载中...' },
    welcome: { en: 'Welcome to NHSprep', es: 'Bienvenido a NHSprep', fr: 'Bienvenue à NHSprep', de: 'Willkommen bei NHSprep', ar: 'مرحباً بك في NHSprep', hi: 'NHSprep में आपका स्वागत है', zh: '欢迎来到 NHSprep' }
  },
  exam: {
    instructions: { en: 'Read each question carefully and select the best answer.', es: 'Lee cada pregunta cuidadosamente y selecciona la mejor respuesta.', fr: 'Lisez chaque question attentivement et sélectionnez la meilleure réponse.', de: 'Lesen Sie jede Frage sorgfältig und wählen Sie die beste Antwort.', ar: 'اقرأ كل سؤال بعناية واختر أفضل إجابة.', hi: 'प्रत्येक प्रश्न को ध्यान से पढ़ें और सबसे अच्छा उत्तर चुनें।', zh: '仔细阅读每个问题并选择最佳答案。' },
    timeRemaining: { en: 'Time remaining', es: 'Tiempo restante', fr: 'Temps restant', de: 'Verbleibende Zeit', ar: 'الوقت المتبقي', hi: 'शेष समय', zh: '剩余时间' },
    questionsCompleted: { en: 'Questions completed', es: 'Preguntas completadas', fr: 'Questions terminées', de: 'Fragen beantwortet', ar: 'الأسئلة المكتملة', hi: 'पूर्ण प्रश्न', zh: '已完成问题' }
  },
  medical: {
    toggleTranslation: { en: 'Toggle translation', es: 'Alternar traducción', fr: 'Basculer la traduction', de: 'Übersetzung umschalten', ar: 'تبديل الترجمة', hi: 'अनुवाद टॉगल करें', zh: '切换翻译' },
    showDefinition: { en: 'Show definition', es: 'Mostrar definición', fr: 'Afficher la définition', de: 'Definition anzeigen', ar: 'إظهار التعريف', hi: 'परिभाषा दिखाएं', zh: '显示定义' },
    medicalTerm: { en: 'Medical term', es: 'Término médico', fr: 'Terme médical', de: 'Medizinischer Begriff', ar: 'مصطلح طبي', hi: 'चिकित्सा शब्द', zh: '医学术语' }
  }
};

export const MEDICAL_TERMS: MedicalTermTranslation[] = [
  {
    term: 'hypertension',
    translations: {
      en: 'hypertension',
      es: 'hipertensión',
      fr: 'hypertension',
      de: 'Bluthochdruck',
      ar: 'ارتفاع ضغط الدم',
      hi: 'उच्च रक्तचाप',
      zh: '高血压'
    },
    category: 'condition',
    definition: {
      en: 'High blood pressure',
      es: 'Presión arterial alta',
      fr: 'Pression artérielle élevée',
      de: 'Hoher Blutdruck',
      ar: 'ضغط الدم المرتفع',
      hi: 'उच्च रक्तचाप',
      zh: '高血压'
    }
  },
  {
    term: 'myocardial infarction',
    translations: {
      en: 'myocardial infarction',
      es: 'infarto de miocardio',
      fr: 'infarctus du myocarde',
      de: 'Herzinfarkt',
      ar: 'احتشاء عضلة القلب',
      hi: 'हृदयाघात',
      zh: '心肌梗死'
    },
    category: 'condition',
    definition: {
      en: 'Heart attack',
      es: 'Ataque al corazón',
      fr: 'Crise cardiaque',
      de: 'Herzinfarkt',
      ar: 'نوبة قلبية',
      hi: 'दिल का दौरा',
      zh: '心脏病发作'
    }
  },
  {
    term: 'pneumonia',
    translations: {
      en: 'pneumonia',
      es: 'neumonía',
      fr: 'pneumonie',
      de: 'Lungenentzündung',
      ar: 'التهاب الرئة',
      hi: 'निमोनिया',
      zh: '肺炎'
    },
    category: 'condition',
    definition: {
      en: 'Infection of the lungs',
      es: 'Infección de los pulmones',
      fr: 'Infection des poumons',
      de: 'Infektion der Lunge',
      ar: 'عدوى الرئتين',
      hi: 'फेफड़ों का संक्रमण',
      zh: '肺部感染'
    }
  }
];

export function detectUserLanguage(): string {
  if (typeof window !== 'undefined') {
    // Get browser language
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Check if we support this language
    const supported = SUPPORTED_LANGUAGES.find(lang => lang.code === langCode);
    return supported ? langCode : 'en';
  }
  return 'en';
}

export function getLanguageName(code: string): string {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  return language ? language.nativeName : 'English';
}

export function isRTL(code: string): boolean {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  return language?.rtl || false;
}