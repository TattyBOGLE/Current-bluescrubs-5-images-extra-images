import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Clock, CheckCircle, XCircle, BookOpen, Target, Brain, 
  ArrowRight, ArrowLeft, RotateCcw, Award, TrendingUp, Home, Globe, Languages, ExternalLink, Volume2, Lightbulb, Plus, MessageCircle, FileText, X, Star, Flame, Trophy
} from "lucide-react";
import plab1BgImage from '@assets/458CC7DF-D6D7-4BAD-85F5-99EEBD33ECD9_1750366142331.png';
import { apiRequest } from "@/lib/queryClient";
import { AITutor } from "@/components/ai-tutor";
import { useToast } from "@/hooks/use-toast";

// Map a reference label/title to its canonical official URL.
// All URLs below are openly accessible — no login, paywall, or subscription required.
// Order matters: SPECIFIC topic-aware patterns first, then generic fallbacks.
const REFERENCE_URL_MAP: { match: RegExp; url: string }[] = [
  // === NICE — deep-link to specialty topic indices ===
  { match: /NICE.*(cardiovascular|cardiac|cardio)/i, url: 'https://www.nice.org.uk/guidance/conditions-and-diseases/cardiovascular-conditions' },
  { match: /NICE.*(asthma|copd|respiratory)/i, url: 'https://www.nice.org.uk/guidance/conditions-and-diseases/respiratory-conditions' },
  { match: /NICE.*(diabetes|type 1|type 2)/i, url: 'https://www.nice.org.uk/search?q=diabetes&ngt=Guidance' },
  { match: /NICE.*(endocrin|nutrition|metabolic)/i, url: 'https://www.nice.org.uk/search?q=endocrine&ngt=Guidance' },
  { match: /NICE.*(gastrointestinal|gastro|digestive|gi conditions|gi medications)/i, url: 'https://www.nice.org.uk/guidance/conditions-and-diseases/digestive-tract-conditions' },
  { match: /NICE.*(antenatal|intrapartum|postnatal|pregnancy|maternity|maternal)/i, url: 'https://www.nice.org.uk/search?q=antenatal+care&ngt=Guidance' },
  { match: /NICE.*(obstetric|gynaecol|gynecol|women)/i, url: 'https://www.nice.org.uk/search?q=obstetrics+gynaecology&ngt=Guidance' },

  // === BNF — deep-link to system-level treatment summaries ===
  { match: /BNF.*(cardiac|cardiovascular)/i, url: 'https://bnf.nice.org.uk/treatment-summaries/cardiovascular-system-overview/' },
  { match: /BNF.*(respiratory|asthma|copd)/i, url: 'https://bnf.nice.org.uk/treatment-summaries/respiratory-system-overview/' },
  { match: /BNF.*(diabetes|endocrin)/i, url: 'https://bnf.nice.org.uk/treatment-summaries/diabetes/' },
  { match: /BNF.*(gi|gastrointestinal|gastro|digestive)/i, url: 'https://bnf.nice.org.uk/treatment-summaries/gastro-intestinal-system-overview/' },
  { match: /BNF.*(women|obstetric|gynaecol|pregnancy|contracept)/i, url: 'https://bnf.nice.org.uk/treatment-summaries/contraception-overview/' },

  // === Other source organisations (all free / open access) ===
  { match: /\bESC\b|European Society of Cardiology/i, url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines' },
  { match: /\bBTS\b|British Thoracic Society/i, url: 'https://www.brit-thoracic.org.uk/quality-improvement/guidelines/' },
  { match: /\bBSG\b|British Society of Gastroenterology/i, url: 'https://www.bsg.org.uk/clinical-resource/guidelines/' },
  { match: /\bRCOG\b|Royal College of Obstetricians/i, url: 'https://www.rcog.org.uk/guidance/browse-all-guidance/' },
  { match: /\bRCGP\b|Royal College of General Practitioners/i, url: 'https://www.rcgp.org.uk/clinical-and-research' },
  { match: /\bADA\b|American Diabetes Association/i, url: 'https://professional.diabetes.org/standards-of-care' },
  { match: /\bSIGN\b|Scottish Intercollegiate/i, url: 'https://www.sign.ac.uk/our-guidelines/' },
  { match: /\bGMC\b.*Good Medical Practice|Good Medical Practice/i, url: 'https://www.gmc-uk.org/professional-standards/professional-standards-for-doctors/good-medical-practice' },
  { match: /\bMLA\b|Medical Licensing Assessment|Content Map/i, url: 'https://www.gmc-uk.org/education/standards-guidance-and-curricula/curricula/medical-licensing-assessment' },
  { match: /Foundation Programme/i, url: 'https://foundationprogramme.nhs.uk/curriculum/' },
  { match: /\bCKS\b|Clinical Knowledge Summaries/i, url: 'https://cks.nice.org.uk/' },
  { match: /\bBNF\b|British National Formulary/i, url: 'https://bnf.nice.org.uk/' },
  { match: /\bNICE\b/i, url: 'https://www.nice.org.uk/guidance' },
];

const getReferenceUrl = (text: string): string | null => {
  if (!text) return null;
  for (const entry of REFERENCE_URL_MAP) {
    if (entry.match.test(text)) return entry.url;
  }
  return null;
};

const ReferenceLink = ({ text }: { text: string }) => {
  const url = getReferenceUrl(text);
  if (!url) {
    return <p className="text-blue-700">• {text}</p>;
  }
  return (
    <p className="text-blue-700">
      <span aria-hidden="true">• </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:text-blue-900 underline decoration-blue-400 hover:decoration-blue-700 underline-offset-2 inline-flex items-baseline gap-1"
      >
        {text}
        <ExternalLink className="w-3 h-3 self-center" aria-hidden="true" />
      </a>
    </p>
  );
};

export default function PLAB1New() {
  const { toast } = useToast();
  
  // Hero image loading state
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  
  // Gamification state
  const [sessionPoints, setSessionPoints] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  
  // Preload hero image for faster loading
  useEffect(() => {
    const img = new Image();
    img.onload = () => setHeroImageLoaded(true);
    img.src = plab1BgImage;
  }, []);

  // Translation state
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTranslationMode, setIsTranslationMode] = useState(false);
  const [translateQuestions, setTranslateQuestions] = useState(false);
  
  // Text-to-Speech state
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Session state
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);

  // AI-generated structured explanation for the current answer
  type AIExplanation = {
    correctRationale: string;
    options: Array<{ label: string; text: string; isCorrect: boolean; isSelected: boolean; why: string }>;
    keyLearningPoint: string;
    source: 'ai' | 'fallback';
  };
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);
  const [aiExplanationLoading, setAiExplanationLoading] = useState(false);
  // Cache of explanations by question id, so navigating back to a question doesn't re-fetch.
  const aiExplanationCache = useRef<Map<string, AIExplanation>>(new Map());
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearSessionTimeout = () => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
  };
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionComplete, setSessionComplete] = useState(false);
  
  // Stopwatch and timing state
  const [questionTimer, setQuestionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  
  // AI Tutor state
  const [showAITutor, setShowAITutor] = useState(false);
  
  // NICE NG136 Guide state
  const [showNiceGuide, setShowNiceGuide] = useState(false);
  
  // Session results tracking
  const [sessionResults, setSessionResults] = useState<Array<{
    correct: boolean;
    timeSpent: number;
    questionId: string;
  }>>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  
  // Pause/Continue milestone tracking
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const CORRECT_ANSWER_MILESTONE = 5; // Show pause option every 5 correct answers
  
  // Block configuration for leaderboard submission
  const [blockType, setBlockType] = useState<'block1' | 'block2' | 'block3'>('block1');
  const [isTimedSession, setIsTimedSession] = useState(false);
  const [sessionTimeLimit, setSessionTimeLimit] = useState(0); // in minutes
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Scoring submission function for block-based leaderboards
  const submitToBlockLeaderboard = async (sessionData: {
    correctAnswers: number;
    totalQuestions: number;
    totalTime: number;
    category: string;
    difficulty: string;
  }) => {
    try {
      const userId = 1; // Demo user
      const username = "DemoUser";
      
      if (blockType === 'block1') {
        console.log('Submitting to Block 1 leaderboard:', sessionData);
      } else if (blockType === 'block2' && isTimedSession) {
        console.log('Submitting to Block 2 leaderboard:', sessionData);
      } else if (blockType === 'block3') {
        console.log('Submitting to Block 3 leaderboard:', sessionData);
      }
    } catch (error) {
      console.error('Failed to submit to leaderboard:', error);
    }
  };


  // Initialize available voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Filter and categorize voices for better selection
        const qualityVoices = voices.filter(voice => 
          !voice.name.toLowerCase().includes('robot') &&
          !voice.name.toLowerCase().includes('synthetic') &&
          !voice.name.toLowerCase().includes('compact')
        );
        
        // Prioritize English voices but include multilingual options
        const englishVoices = qualityVoices.filter(voice => voice.lang.startsWith('en'));
        const otherLanguageVoices = qualityVoices.filter(voice => 
          !voice.lang.startsWith('en') && 
          ['ar', 'hi', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'zh', 'ja', 'ko'].some(lang => 
            voice.lang.startsWith(lang)
          )
        );
        
        // Combine voices with English first, then other languages
        const allVoices = [...englishVoices, ...otherLanguageVoices].slice(0, 15);
        setAvailableVoices(allVoices);
        
        if (allVoices.length > 0 && !selectedVoice) {
          // Prefer natural-sounding voices
          const preferredVoice = allVoices.find(voice => 
            voice.name.toLowerCase().includes('enhanced') ||
            voice.name.toLowerCase().includes('premium') ||
            voice.name.toLowerCase().includes('neural') ||
            voice.name.toLowerCase().includes('natural') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('alex') ||
            voice.name.toLowerCase().includes('susan') ||
            voice.name.toLowerCase().includes('daniel') ||
            voice.name.toLowerCase().includes('karen') ||
            voice.name.toLowerCase().includes('moira')
          ) || allVoices[0];
          setSelectedVoice(preferredVoice.name);
        }
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [selectedVoice]);

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setQuestionTimer(prev => prev + 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Start timer when new question is shown (only in timed practice modes)
  useEffect(() => {
    if (sessionStarted && !showExplanation && isTimedSession) {
      setQuestionTimer(0);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  }, [currentQuestionIndex, sessionStarted, showExplanation, isTimedSession]);

  // Cancel any pending session-end timeout when component unmounts
  useEffect(() => {
    return () => clearSessionTimeout();
  }, []);



  // Text-to-Speech functions with natural speech settings
  const speakText = (text: string) => {
    if (!speechEnabled || !text.trim()) return;
    
    // Stop any current speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find best voice for selected language
    const languageVoiceMap: Record<string, string> = {
      'en': 'en-US',
      'ar': 'ar-SA',
      'hi': 'hi-IN',
      'ur': 'ur-PK',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'mr': 'mr-IN',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ru': 'ru-RU',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR'
    };

    const targetLang = languageVoiceMap[selectedLanguage] || 'en-US';
    const voice = availableVoices.find(v => 
      v.lang.startsWith(targetLang.split('-')[0]) || 
      v.name === selectedVoice
    );
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = targetLang;
    }
    
    // Enhanced natural speech settings
    utterance.rate = selectedLanguage === 'ar' || selectedLanguage === 'ur' ? 0.8 : 0.85; // Slower for RTL languages
    utterance.pitch = 1.1; // Slightly higher pitch for medical content clarity
    utterance.volume = 0.9; // Higher volume for clarity
    
    // Add natural pauses for medical terms
    const processedText = text
      .replace(/\./g, '. ') // Add pause after periods
      .replace(/,/g, ', ') // Add pause after commas
      .replace(/:/g, ': ') // Add pause after colons
      .replace(/;/g, '; ') // Add pause after semicolons
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
    
    utterance.text = processedText;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakCurrentQuestion = () => {
    if (currentQuestion) {
      // Get translated question and options if available
      const cacheKey = `${currentQuestion.id}_${selectedLanguage}`;
      const translatedQ = translatedQuestions[cacheKey];
      
      let scenarioText = currentQuestion.scenario || '';
      let questionText = currentQuestion.stem || currentQuestion.question || '';
      let options = Array.isArray(currentQuestion.options) 
        ? currentQuestion.options 
        : Object.values(currentQuestion.options || {});
      
      // Use translated content if available
      if (translateQuestions && selectedLanguage !== 'en' && translatedQ) {
        scenarioText = translatedQ.scenario || scenarioText;
        questionText = translatedQ.question || translatedQ.stem || questionText;
        if (translatedQ.options) {
          options = Array.isArray(translatedQ.options) ? translatedQ.options : Object.values(translatedQ.options);
        }
      }
      
      // Build comprehensive text for reading
      let fullText = '';
      
      if (scenarioText) {
        fullText += `Clinical Scenario: ${scenarioText}. `;
      }
      
      if (questionText) {
        fullText += `Question: ${questionText}. `;
      }
      
      if (options && options.length > 0) {
        const optionsText = options.map((option: string, index: number) => 
          `Option ${String.fromCharCode(65 + index)}: ${option}`
        ).join('. ');
        fullText += `The answer options are: ${optionsText}.`;
      }
      
      speakText(fullText);
    }
  };
  
  // AI Question Generation
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('intermediate');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{
    completed: number;
    total: number;
    currentCategory: string;
  } | null>(null);

  // Function to provide targeted explanations based on user's answer
  const getTargetedExplanation = (question: any, userAnswer: string, isCorrect: boolean): string => {
    if (!question.explanation) return 'Clinical explanation provided for educational purposes.';
    
    const raw = question.explanation;
    const explanation: string = typeof raw === 'object' && raw !== null
      ? Object.entries(raw).map(([k, v]) => `Option ${k}: ${v}`).join('\n')
      : String(raw);
    const userAnswerIndex = parseInt(userAnswer);
    const correctAnswerIndex = question.correctAnswer;
    
    if (isCorrect) {
      // User got it right - show why their answer is correct
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
      // User got it wrong - explain why their choice is wrong AND why correct answer is right
      const lines = explanation.split('\n');
      let feedback = '';
      
      // Find why user's answer is wrong
      const wrongLine = lines.find((line: string) => 
        line.includes(`Option ${String.fromCharCode(65 + userAnswerIndex)}`) && 
        line.includes('INCORRECT')
      );
      
      if (wrongLine) {
        const cleanWrongExplanation = wrongLine.replace(/Option [A-E] \([^)]+\) is INCORRECT because/, '').trim();
        feedback += `✗ Your choice (${String.fromCharCode(65 + userAnswerIndex)}) is incorrect because ${cleanWrongExplanation}\n\n`;
      }
      
      // Find why correct answer is right
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
  };

  // Simple translation function
  const translateText = (text: string) => {
    if (!isTranslationMode || selectedLanguage === 'en') return text;
    
    const translations: Record<string, Record<string, string>> = {
      'ar': {
        'PLAB 1 Practice': 'ممارسة PLAB 1',
        'Quick Practice': 'ممارسة سريعة',
        'Standard Quiz': 'اختبار قياسي',
        'PLAB 1 Mock': 'محاكاة PLAB 1',
        'Comprehensive': 'شامل',
        'questions': 'أسئلة',
        'Submit Answer': 'إرسال الإجابة',
        'Next Question': 'السؤال التالي',
        'Complete Session': 'إكمال الجلسة',
        'Correct!': 'صحيح!',
        'Incorrect.': 'غير صحيح.',
        'Reference:': 'مرجع:',
        'Study Tip': 'نصيحة دراسية'
      },
      'hi': {
        'PLAB 1 Practice': 'PLAB 1 अभ्यास',
        'Quick Practice': 'त्वरित अभ्यास',
        'Standard Quiz': 'मानक प्रश्नोत्तरी',
        'PLAB 1 Mock': 'PLAB 1 मॉक',
        'Comprehensive': 'व्यापक',
        'questions': 'प्रश्न',
        'Submit Answer': 'उत्तर जमा करें',
        'Next Question': 'अगला प्रश्न',
        'Complete Session': 'सत्र पूरा करें',
        'Correct!': 'सही!',
        'Incorrect.': 'गलत।',
        'Reference:': 'संदर्भ:',
        'Study Tip': 'अध्ययन युक्ति'
      },
      'ur': {
        'PLAB 1 Practice': 'PLAB 1 پریکٹس',
        'Quick Practice': 'فوری پریکٹس',
        'Standard Quiz': 'معیاری کوئز',
        'PLAB 1 Mock': 'PLAB 1 موک',
        'Comprehensive': 'جامع',
        'questions': 'سوالات',
        'Submit Answer': 'جواب جمع کریں',
        'Next Question': 'اگلا سوال',
        'Complete Session': 'سیشن مکمل کریں',
        'Correct!': 'درست!',
        'Incorrect.': 'غلط۔',
        'Reference:': 'حوالہ:',
        'Study Tip': 'مطالعہ کی تجویز'
      }
    };
    
    return translations[selectedLanguage]?.[text] || text;
  };

  // Function to translate medical question content using API
  const [translatedQuestions, setTranslatedQuestions] = useState<Record<string, any>>({});
  const [translationLoading, setTranslationLoading] = useState<Record<string, boolean>>({});

  const translateMedicalContent = async (text: string, questionId?: string) => {
    if (!translateQuestions || selectedLanguage === 'en') return text;
    
    // Return cached translation if available
    if (questionId && translatedQuestions[`${questionId}_${selectedLanguage}`]) {
      return translatedQuestions[`${questionId}_${selectedLanguage}`];
    }
    
    // Basic fallback translations for quick UI updates
    const quickTranslations: Record<string, Record<string, string>> = {
      'ar': {
        'patient': 'مريض', 'presents with': 'يعاني من', 'chest pain': 'ألم في الصدر',
        'diagnosis': 'التشخيص', 'treatment': 'العلاج', 'What is the most appropriate': 'ما هو الأنسب'
      },
      'hi': {
        'patient': 'मरीज़', 'presents with': 'के साथ आता है', 'chest pain': 'सीने में दर्द',
        'diagnosis': 'निदान', 'treatment': 'उपचार', 'What is the most appropriate': 'सबसे उपयुक्त क्या है'
      },
      'ur': {
        'patient': 'مریض', 'presents with': 'کے ساتھ آتا ہے', 'chest pain': 'سینے میں درد',
        'diagnosis': 'تشخیص', 'treatment': 'علاج', 'What is the most appropriate': 'سب سے مناسب کیا ہے'
      }
    };
    
    const fallbackTranslations = quickTranslations[selectedLanguage] || {};
    let translated = text;
    
    Object.entries(fallbackTranslations).forEach(([english, native]) => {
      translated = translated.replace(new RegExp(`\\b${english}\\b`, 'gi'), native);
    });
    
    return translated;
  };

  // Function to translate entire question object using fast instant translation
  const translateFullQuestion = async (question: any) => {
    if (!translateQuestions || selectedLanguage === 'en') return question;
    
    const cacheKey = `${question.id}_${selectedLanguage}`;
    
    // Return if already translated
    if (translatedQuestions[cacheKey]) {
      return translatedQuestions[cacheKey];
    }
    
    // Return if currently translating
    if (translationLoading[cacheKey]) {
      return question;
    }
    
    setTranslationLoading(prev => ({ ...prev, [cacheKey]: true }));
    
    try {
      const response = await fetch('/api/translate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: {
            scenario: question.scenario || question.stem,
            question: question.question,
            options: question.options,
            explanation: question.explanation
          },
          targetLanguage: selectedLanguage
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const translated = await response.json();
      
      // Store translated question with proper structure
      const translatedQuestion = {
        ...question,
        scenario: translated.scenario || question.scenario,
        stem: translated.scenario || translated.stem || question.stem,
        question: translated.question || question.question,
        options: translated.options || question.options,
        explanation: translated.explanation || question.explanation
      };
      
      setTranslatedQuestions(prev => ({
        ...prev,
        [cacheKey]: translatedQuestion
      }));
      
      return translatedQuestion;
    } catch (error) {
      console.error('Translation error:', error);
      return question; // Return original on error
    } finally {
      setTranslationLoading(prev => ({ ...prev, [cacheKey]: false }));
    }
  };

  // Calculate question counts for comprehensive question bank
  const getQuestionCount = (category: string) => {
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
  };

  // Available categories without question counts
  const availableCategories = [
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

  // Generate AI questions
  const startPractice = async (questionCount: number) => {
    clearSessionTimeout();
    setIsGeneratingQuestions(true);
    setGeneratedQuestions([]);
    setSessionStarted(false);
    setShowExplanation(false);
    setCurrentQuestionIndex(0);
    setSessionResults([]);
    setUserAnswers([]);
    setLastMilestone(0);
    setShowPauseModal(false);
    setSessionComplete(false);
    
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          count: questionCount,
          difficulty: selectedDifficulty
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedQuestions(data.questions || []);
        if (data.questions && data.questions.length > 0) {
          setSessionStarted(true);
          setQuestionStartTime(Date.now());
          setIsTimedSession(false);
          setIsTimerRunning(false);
        } else {
          toast({ title: "No questions found", description: "No questions matched your selection. Try a different category.", variant: "destructive" });
        }
      } else {
        const err = await response.json().catch(() => ({}));
        toast({ title: "Could not load questions", description: err.message || "Please try again.", variant: "destructive" });
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Bulk question generation function
  const generateBulkQuestions = async () => {
    setIsBulkGenerating(true);
    setBulkProgress({ completed: 0, total: 18, currentCategory: 'Starting...' });

    const categories = [
      'cardiovascular', 'respiratory', 'gastroenterology', 'neurology', 
      'endocrinology', 'psychiatry', 'obstetrics-gynaecology', 'paediatrics',
      'surgery', 'nephrology', 'haematology', 'infectious-diseases',
      'rheumatology', 'dermatology', 'emergency-medicine', 'ethics-law',
      'public-health', 'clinical-pharmacology'
    ];

    try {
      const response = await fetch('/api/generate-bulk-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categories,
          questionsPerCategory: Math.ceil(5000 / categories.length)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Successfully generated ${data.totalGenerated} questions across ${data.categories} categories`);
        setBulkProgress({ completed: categories.length, total: categories.length, currentCategory: 'Complete!' });
      }
    } catch (error) {
      console.error('Bulk generation failed:', error);
    } finally {
      setIsBulkGenerating(false);
      setTimeout(() => setBulkProgress(null), 3000);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    console.log('Answer selected:', answer, 'showExplanation:', showExplanation);
    if (!showExplanation) {
      setSelectedAnswer(answer);
      console.log('Selected answer set to:', answer);
    }
  };

  // Calculate points for an answer
  const calculatePoints = (isCorrect: boolean, timeSpentMs: number, streak: number): number => {
    if (!isCorrect) return 0;
    
    const BASE_POINTS = 10;
    const difficultyMultipliers: Record<string, number> = {
      foundation: 1,
      intermediate: 1.5,
      advanced: 2,
    };
    const difficultyMultiplier = difficultyMultipliers[selectedDifficulty] || 1;
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
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (selectedAnswer && !showExplanation) {
      const timeForQuestion = Date.now() - questionStartTime;
      const currentQuestion = generatedQuestions[currentQuestionIndex];
      const correctIdx = currentQuestion?.correctAnswer ?? currentQuestion?.correct_answer ?? currentQuestion?.answer;
      const isCorrect = parseInt(selectedAnswer) === (typeof correctIdx === 'string' ? correctIdx.charCodeAt(0) - 65 : correctIdx);
      
      // Update question times and user answers
      setQuestionTimes(prev => [...prev, timeForQuestion]);
      setUserAnswers(prev => [...prev, selectedAnswer]);
      setTimeSpent(prev => prev + timeForQuestion);
      
      // Update session results for AI tutor
      setSessionResults(prev => [...prev, {
        correct: isCorrect,
        timeSpent: timeForQuestion,
        questionId: currentQuestion?.id || `q_${currentQuestionIndex}`
      }]);
      
      // Gamification: Calculate and award points
      const newStreak = isCorrect ? currentStreak + 1 : 0;
      setCurrentStreak(newStreak);
      
      if (isCorrect) {
        const pointsEarned = calculatePoints(true, timeForQuestion, newStreak);
        setSessionPoints(prev => prev + pointsEarned);
        setLastPointsEarned(pointsEarned);
        setShowPointsAnimation(true);
        setTimeout(() => setShowPointsAnimation(false), 1500);
        
        // Show toast for streaks
        if (newStreak === 3) {
          toast({
            title: "🔥 Streak Started!",
            description: "3 correct in a row! +5 bonus points",
          });
        } else if (newStreak === 5) {
          toast({
            title: "💥 On Fire!",
            description: "5 correct in a row! +10 bonus points",
          });
        } else if (newStreak === 10) {
          toast({
            title: "🚀 Unstoppable!",
            description: "10 correct in a row! +25 bonus points",
          });
        } else if (newStreak === 20) {
          toast({
            title: "👑 Legendary Streak!",
            description: "20 correct in a row! +50 bonus points",
          });
        }
        
        // Speed bonus toast
        if (timeForQuestion <= 30000) {
          toast({
            title: "⚡ Speed Bonus!",
            description: "+5 points for quick answer",
          });
        }
      }
      
      setShowExplanation(true);
      setIsTimerRunning(false);

      // Fetch a structured AI explanation for this answer (cached per question id)
      void fetchAIExplanation(currentQuestion, parseInt(selectedAnswer));
    }
  };

  // Generate a structured per-answer explanation using the backend AI endpoint.
  const fetchAIExplanation = async (question: any, selectedIdx: number) => {
    if (!question) return;

    const qid = String(question.id ?? `idx_${currentQuestionIndex}`);
    const cached = aiExplanationCache.current.get(qid);
    if (cached) {
      // Re-mark which option the user selected this time
      setAiExplanation({
        ...cached,
        options: cached.options.map((o, i) => ({ ...o, isSelected: selectedIdx === i })),
      });
      return;
    }

    const correctIdxRaw = question.correctAnswer ?? question.correct_answer ?? question.answer;
    const correctIdx = typeof correctIdxRaw === 'string'
      ? (/^[A-E]$/.test(correctIdxRaw) ? correctIdxRaw.charCodeAt(0) - 65 : parseInt(correctIdxRaw) || 0)
      : (typeof correctIdxRaw === 'number' ? correctIdxRaw : 0);

    let optionsArr: string[] = [];
    if (Array.isArray(question.options)) {
      optionsArr = question.options.map((o: any) => typeof o === 'string' ? o : (o?.text ?? ''));
    } else if (question.options && typeof question.options === 'object') {
      optionsArr = Object.values(question.options).map((o: any) => typeof o === 'string' ? o : (o?.text ?? ''));
    }
    if (optionsArr.length < 2) return;

    setAiExplanationLoading(true);
    setAiExplanation(null);
    try {
      const storedExplanation = typeof question.explanation === 'string'
        ? question.explanation
        : (typeof question.explanation?.text === 'string' ? question.explanation.text : undefined);
      const resp = await fetch('/api/explain-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question || question.question_scenario || '',
          options: optionsArr,
          correctIndex: correctIdx,
          selectedIndex: selectedIdx,
          category: question.category || question.topic,
          questionId: qid,
          storedExplanation,
        }),
      });
      if (!resp.ok) return;
      const data: AIExplanation = await resp.json();
      aiExplanationCache.current.set(qid, data);
      setAiExplanation(data);
    } catch (err) {
      console.error('Failed to fetch AI explanation:', err);
    } finally {
      setAiExplanationLoading(false);
    }
  };

  // Handle next question navigation
  const handleNextQuestion = () => {
    // Check for correct answer milestone
    const correctCount = sessionResults.filter(r => r.correct).length;
    const nextMilestone = Math.floor(correctCount / CORRECT_ANSWER_MILESTONE) * CORRECT_ANSWER_MILESTONE;
    
    // Show pause modal if we've hit a new milestone (at least 5 correct)
    if (correctCount > 0 && correctCount >= CORRECT_ANSWER_MILESTONE && nextMilestone > lastMilestone) {
      setLastMilestone(nextMilestone);
      setShowPauseModal(true);
      return; // Don't proceed until user decides
    }
    
    proceedToNextQuestion();
  };
  
  // Actually move to next question (called after pause modal or directly)
  const proceedToNextQuestion = async () => {
    if (currentQuestionIndex < generatedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
      setShowExplanation(false);
      setAiExplanation(null);
      setAiExplanationLoading(false);
      setQuestionStartTime(Date.now());
      if (isTimedSession) {
        setQuestionTimer(0);
        setIsTimerRunning(true);
      }
    } else {
      // Session complete - calculate final score and submit to leaderboard
      clearSessionTimeout();
      const totalTime = questionTimes.reduce((sum, time) => sum + time, 0);
      const correctAnswers = userAnswers.filter((answer, index) => 
        parseInt(answer) === generatedQuestions[index]?.correctAnswer
      ).length;
      
      // Submit to appropriate leaderboard based on session type
      submitToBlockLeaderboard({
        correctAnswers,
        totalQuestions: generatedQuestions.length,
        totalTime,
        category: selectedCategory,
        difficulty: selectedDifficulty
      });
      
      // Persist points to the server
      const accuracy = generatedQuestions.length > 0 
        ? (correctAnswers / generatedQuestions.length) * 100 
        : 0;
      
      try {
        await apiRequest('POST', '/api/gamification/award-points', {
          userId: 1,
          points: sessionPoints,
          reason: 'session_complete',
          sessionData: {
            questionsAnswered: generatedQuestions.length,
            correctAnswers,
            streak: currentStreak,
            category: selectedCategory,
            accuracy
          }
        });
        
        toast({
          title: "🎉 Session Complete!",
          description: `You earned ${sessionPoints} points this session!`,
        });
      } catch (error) {
        console.error('Failed to save points:', error);
      }
      
      setSessionComplete(true);
    }
  };
  
  // Handle continue after pause modal
  const handleContinuePractice = () => {
    setShowPauseModal(false);
    proceedToNextQuestion();
  };
  
  // Handle pause/end session from pause modal
  const handlePauseSession = async () => {
    setShowPauseModal(false);
    
    // Persist points when pausing
    const correctAnswers = sessionResults.filter(r => r.correct).length;
    const accuracy = sessionResults.length > 0 
      ? (correctAnswers / sessionResults.length) * 100 
      : 0;
    
    try {
      await apiRequest('POST', '/api/gamification/award-points', {
        userId: 1,
        points: sessionPoints,
        reason: 'session_paused',
        sessionData: {
          questionsAnswered: sessionResults.length,
          correctAnswers,
          streak: currentStreak,
          category: selectedCategory,
          accuracy
        }
      });
      
      toast({
        title: "📊 Progress Saved",
        description: `${sessionPoints} points saved to your profile!`,
      });
    } catch (error) {
      console.error('Failed to save points:', error);
    }
    
    setSessionComplete(true);
  };



  // Format timer display
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${seconds}.${ms.toString().padStart(2, '0')}s`;
  };



  // Start timed practice session
  const startTimedPractice = async (timeInMinutes: number) => {
    clearSessionTimeout();
    setIsGeneratingQuestions(true);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          count: 100 // Generate enough questions for timed session
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast({ title: "Could not load questions", description: err.message || "Please try again.", variant: "destructive" });
        return;
      }

      const data = await response.json();
      const questions = Array.isArray(data.questions) ? data.questions : [];
      if (questions.length === 0) {
        toast({ title: "No questions found", description: "No questions matched your selection. Try a different category.", variant: "destructive" });
        return;
      }

      setGeneratedQuestions(questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
      setSessionStarted(true);
      setIsTimedSession(true);
      setQuestionTimer(0);
      setIsTimerRunning(true);

      // Set timer for timed practice
      sessionTimeoutRef.current = setTimeout(() => {
        sessionTimeoutRef.current = null;
        setIsTimerRunning(false);
        setSessionComplete(true);
      }, timeInMinutes * 60 * 1000);

    } catch (error) {
      console.error('Error generating questions:', error);
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Start authentic PLAB 1 timed practice session (1 minute per question)
  const startAuthenticTimedPractice = async (questionCount: number) => {
    clearSessionTimeout();
    setIsGeneratingQuestions(true);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          count: questionCount // Generate exact number of questions
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast({ title: "Could not load questions", description: err.message || "Please try again.", variant: "destructive" });
        return;
      }

      const data = await response.json();
      const questions = Array.isArray(data.questions) ? data.questions : [];
      if (questions.length === 0) {
        toast({ title: "No questions found", description: "No questions matched your selection. Try a different category.", variant: "destructive" });
        return;
      }

      // Slice to exact count in case more were generated
      const exactQuestions = questions.slice(0, questionCount);
      setGeneratedQuestions(exactQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
      setSessionStarted(true);
      setIsTimedSession(true);
      setQuestionTimer(0);
      setIsTimerRunning(true);

      // Set timer for authentic PLAB 1 timing (exactly 1 minute per question)
      const totalTimeMs = exactQuestions.length * 60 * 1000; // 1 minute per question
      sessionTimeoutRef.current = setTimeout(() => {
        sessionTimeoutRef.current = null;
        setIsTimerRunning(false);
        setSessionComplete(true);
      }, totalTimeMs);

    } catch (error) {
      console.error('Error generating questions:', error);
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Start unlimited practice session
  const startUnlimitedPractice = async () => {
    clearSessionTimeout();
    setIsGeneratingQuestions(true);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          count: 20 // Start with 20, will generate more as needed
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast({ title: "Could not load questions", description: err.message || "Please try again.", variant: "destructive" });
        return;
      }

      const data = await response.json();
      const questions = Array.isArray(data.questions) ? data.questions : [];
      if (questions.length === 0) {
        toast({ title: "No questions found", description: "No questions matched your selection. Try a different category.", variant: "destructive" });
        return;
      }

      setGeneratedQuestions(questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
      setSessionStarted(true);
      setIsTimedSession(false);
      setIsTimerRunning(false); // No timer for unlimited study mode

    } catch (error) {
      console.error('Error generating questions:', error);
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Get current question
  const currentQuestion = generatedQuestions[currentQuestionIndex];
  const isCorrect = showExplanation && selectedAnswer !== "" && (() => {
    if (!currentQuestion) return false;
    let correctAnswerIndex = currentQuestion.correctAnswer;
    if (typeof correctAnswerIndex === 'string') {
      // Convert letter-based answers (A, B, C, D, E) to index
      correctAnswerIndex = correctAnswerIndex.charCodeAt(0) - 65;
    }
    return parseInt(selectedAnswer) === correctAnswerIndex;
  })();

  // Effect to translate current question when language changes
  useEffect(() => {
    if (currentQuestion && translateQuestions && selectedLanguage !== 'en') {
      translateFullQuestion(currentQuestion);
    }
  }, [currentQuestion, translateQuestions, selectedLanguage]);

  // If no session started, show the landing page
  if (!sessionStarted && !isGeneratingQuestions) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-24">
        <div className="max-w-6xl mx-auto mb-16">
          {/* Hero Banner */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 w-full h-64 md:h-80 lg:h-96 mb-8 overflow-hidden">
            {!heroImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={plab1BgImage}
              alt="PLAB 1 Practice"
              className={`absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-300 ${heroImageLoaded ? 'opacity-60' : 'opacity-0'}`}
              loading="eager"
              decoding="async"
              onLoad={() => setHeroImageLoaded(true)}
            />

            <div className="relative z-50 flex flex-col items-center justify-center text-center px-8 py-16 hero-text">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-2xl leading-tight" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.6)'}}>
                {translateText('Master PLAB 1')}<br />
                {translateText('with AI')}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-2xl leading-relaxed" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.6)'}}>
                {translateText('Authentic UK Comprehensive exam preparation')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                  onClick={() => document.getElementById('practice-options')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  {translateText('Start Practice Now')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => document.getElementById('settings')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Globe className="w-5 h-5 mr-2" />
                  {translateText('Settings & Languages')}
                </Button>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{translateText('Choose Your Practice Mode')}</h2>
            <p className="text-lg text-gray-600">Tailored learning experience with multilingual support</p>
            
            {/* Language Toggle */}
            <div id="settings" className="flex items-center gap-4 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Globe className="w-4 h-4 text-blue-600" />
              <div className="flex items-center gap-3">
                <Switch
                  checked={isTranslationMode}
                  onCheckedChange={setIsTranslationMode}
                  className="data-[state=checked]:bg-blue-600"
                />
                <span className="text-sm font-medium text-blue-900">Translation Mode</span>
              </div>
              {isTranslationMode && (
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48 border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 overflow-y-auto">
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="ar">🇸🇦 العربية Arabic</SelectItem>
                    <SelectItem value="hi">🇮🇳 हिन्दी Hindi</SelectItem>
                    <SelectItem value="ur">🇵🇰 اردو Urdu</SelectItem>
                    <SelectItem value="bn">🇧🇩 বাংলা Bengali</SelectItem>
                    <SelectItem value="ta">🇮🇳 தமிழ் Tamil</SelectItem>
                    <SelectItem value="te">🇮🇳 తెలుగు Telugu</SelectItem>
                    <SelectItem value="gu">🇮🇳 ગુજરાતી Gujarati</SelectItem>
                    <SelectItem value="mr">🇮🇳 मराठी Marathi</SelectItem>
                    <SelectItem value="pa">🇮🇳 ਪੰਜਾਬੀ Punjabi</SelectItem>
                    <SelectItem value="kn">🇮🇳 ಕನ್ನಡ Kannada</SelectItem>
                    <SelectItem value="ml">🇮🇳 മലയാളം Malayalam</SelectItem>
                    <SelectItem value="es">🇪🇸 Español Spanish</SelectItem>
                    <SelectItem value="fr">🇫🇷 Français French</SelectItem>
                    <SelectItem value="de">🇩🇪 Deutsch German</SelectItem>
                    <SelectItem value="pt">🇵🇹 Português Portuguese</SelectItem>
                    <SelectItem value="it">🇮🇹 Italiano Italian</SelectItem>
                    <SelectItem value="ru">🇷🇺 Русский Russian</SelectItem>
                    <SelectItem value="zh">🇨🇳 简体中文 Chinese</SelectItem>
                    <SelectItem value="ja">🇯🇵 日本語 Japanese</SelectItem>
                    <SelectItem value="ko">🇰🇷 한국어 Korean</SelectItem>
                    <SelectItem value="th">🇹🇭 ไทย Thai</SelectItem>
                    <SelectItem value="vi">🇻🇳 Tiếng Việt Vietnamese</SelectItem>
                    <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                    <SelectItem value="ms">🇲🇾 Bahasa Melayu</SelectItem>
                    <SelectItem value="tr">🇹🇷 Türkçe Turkish</SelectItem>
                    <SelectItem value="fa">🇮🇷 فارسی Persian</SelectItem>
                    <SelectItem value="he">🇮🇱 עברית Hebrew</SelectItem>
                    <SelectItem value="pl">🇵🇱 Polski Polish</SelectItem>
                    <SelectItem value="ro">🇷🇴 Română Romanian</SelectItem>
                    <SelectItem value="hu">🇭🇺 Magyar Hungarian</SelectItem>
                    <SelectItem value="cs">🇨🇿 Čeština Czech</SelectItem>
                    <SelectItem value="sk">🇸🇰 Slovenčina Slovak</SelectItem>
                    <SelectItem value="bg">🇧🇬 Български Bulgarian</SelectItem>
                    <SelectItem value="hr">🇭🇷 Hrvatski Croatian</SelectItem>
                    <SelectItem value="sr">🇷🇸 Српски Serbian</SelectItem>
                    <SelectItem value="uk">🇺🇦 Українська Ukrainian</SelectItem>
                    <SelectItem value="sw">🇰🇪 Kiswahili Swahili</SelectItem>
                    <SelectItem value="tl">🇵🇭 Filipino (Tagalog)</SelectItem>
                    <SelectItem value="am">🇪🇹 አማርኛ Amharic</SelectItem>
                    <SelectItem value="ti">🇪🇷 ትግርኛ Tigrinya</SelectItem>
                    <SelectItem value="lt">🇱🇹 Lietuvių Lithuanian</SelectItem>
                    <SelectItem value="lv">🇱🇻 Latviešu Latvian</SelectItem>
                    <SelectItem value="et">🇪🇪 Eesti Estonian</SelectItem>
                    <SelectItem value="nl">🇳🇱 Nederlands Dutch</SelectItem>
                    <SelectItem value="sv">🇸🇪 Svenska Swedish</SelectItem>
                    <SelectItem value="da">🇩🇰 Dansk Danish</SelectItem>
                    <SelectItem value="no">🇳🇴 Norsk Norwegian</SelectItem>
                    <SelectItem value="fi">🇫🇮 Suomi Finnish</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {/* Voice Control Panel */}
            <div className="flex items-center gap-4 mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <Volume2 className="w-4 h-4 text-green-600" />
              <div className="flex items-center gap-3">
                <Switch
                  checked={speechEnabled}
                  onCheckedChange={setSpeechEnabled}
                  className="data-[state=checked]:bg-green-600"
                />
                <span className="text-sm font-medium text-green-900">Voice Reading</span>
              </div>
              {speechEnabled && (
                <div className="flex items-center gap-2">
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="w-40 border-green-200">
                      <SelectValue placeholder="Select Voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isSpeaking && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={stopSpeaking}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      Stop
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Question Categories</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">75</p>
                <p className="text-xs text-gray-500 mt-1">25 specialties × 3 levels</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Difficulty Levels</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
                <p className="text-xs text-gray-500 mt-1">Basic, Intermediate, Advanced</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Medical Guidelines</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">30+</p>
                <p className="text-xs text-gray-500 mt-1">NICE, CKS, BTS, ESC, ADA</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-600">Languages</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">70+</p>
                <p className="text-xs text-gray-500 mt-1">Multi-language support</p>
              </CardContent>
            </Card>
          </div>

          {/* NICE NG136 + PLAB MCQ Format Guide - Prominent Display */}
          <div className="mb-8 p-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg shadow-lg">
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0" onClick={() => setShowNiceGuide(true)}>
              <CardHeader className="bg-white hover:bg-green-50 transition-colors p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-green-800 text-xl font-bold">NICE NG136 + PLAB MCQ Format</CardTitle>
                      <CardDescription className="text-green-700 mt-2 text-base">
                        📋 Clinical scenario framework, risk assessment tools, and structured learning approach
                      </CardDescription>
                    </div>
                  </div>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white border-0 px-6 py-3">
                    <BookOpen className="w-5 h-5 mr-2" />
                    View Guide
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Customise Your Practice - Combined Settings and Practice Modes */}
          <Card id="practice-options" className="mb-8">
            <CardHeader>
              <CardTitle>Customise Your Practice</CardTitle>
              <CardDescription>Select your category, difficulty, and practice mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Category and Difficulty Selection */}
              <div className="grid md:grid-cols-2 gap-6 pb-6 border-b">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                    Medical Specialty
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="difficulty" className="text-sm font-medium mb-2 block">
                    Difficulty Level
                  </Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foundation">Foundation</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Block 1: Fixed Question Count */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Block 1: Fixed Question Sets
                </h3>
                <p className="text-sm text-blue-700 mb-4">Complete a specific number of questions at your own pace</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <Button 
                    onClick={() => startPractice(10)}
                    disabled={isGeneratingQuestions}
                    className="bg-blue-600 hover:bg-blue-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">10</span>
                    <span className="text-xs opacity-90">Questions</span>
                  </Button>
                  <Button 
                    onClick={() => startPractice(20)}
                    disabled={isGeneratingQuestions}
                    className="bg-blue-600 hover:bg-blue-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">20</span>
                    <span className="text-xs opacity-90">Questions</span>
                  </Button>
                  <Button 
                    onClick={() => startPractice(50)}
                    disabled={isGeneratingQuestions}
                    className="bg-blue-600 hover:bg-blue-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">50</span>
                    <span className="text-xs opacity-90">Questions</span>
                  </Button>
                  <Button 
                    onClick={() => startPractice(100)}
                    disabled={isGeneratingQuestions}
                    className="bg-blue-600 hover:bg-blue-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">100</span>
                    <span className="text-xs opacity-90">Questions</span>
                  </Button>
                  <Button 
                    onClick={() => startPractice(180)}
                    disabled={isGeneratingQuestions}
                    className="bg-blue-600 hover:bg-blue-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">180</span>
                    <span className="text-xs opacity-90">PLAB Mock</span>
                  </Button>
                </div>
              </div>

              {/* Block 2: Timed Challenges */}
              <div className="border rounded-lg p-4 bg-orange-50">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Block 2: Timed Challenges
                </h3>
                <p className="text-sm text-orange-700 mb-4">Answer as many questions as possible within the time limit</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <Button 
                    onClick={() => startTimedPractice(10)}
                    disabled={isGeneratingQuestions}
                    className="bg-orange-600 hover:bg-orange-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">10m</span>
                    <span className="text-xs opacity-90">Sprint</span>
                  </Button>
                  <Button 
                    onClick={() => startTimedPractice(30)}
                    disabled={isGeneratingQuestions}
                    className="bg-orange-600 hover:bg-orange-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">30m</span>
                    <span className="text-xs opacity-90">Focus</span>
                  </Button>
                  <Button 
                    onClick={() => startTimedPractice(60)}
                    disabled={isGeneratingQuestions}
                    className="bg-orange-600 hover:bg-orange-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">60m</span>
                    <span className="text-xs opacity-90">Endurance</span>
                  </Button>
                  <Button 
                    onClick={() => startTimedPractice(120)}
                    disabled={isGeneratingQuestions}
                    className="bg-orange-600 hover:bg-orange-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">2h</span>
                    <span className="text-xs opacity-90">Marathon</span>
                  </Button>
                  <Button 
                    onClick={() => startTimedPractice(180)}
                    disabled={isGeneratingQuestions}
                    className="bg-orange-600 hover:bg-orange-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">3h</span>
                    <span className="text-xs opacity-90">Ultra</span>
                  </Button>
                </div>
              </div>

              {/* Block 3: Unlimited Practice */}
              <div className="border rounded-lg p-4 bg-green-50">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Block 3: Unlimited Study
                </h3>
                <p className="text-sm text-green-700 mb-4">Study without time pressure - continue as long as you want</p>
                <Button 
                  onClick={() => startUnlimitedPractice()}
                  disabled={isGeneratingQuestions}
                  className="bg-green-600 hover:bg-green-700 h-16 px-8 flex items-center justify-center gap-3"
                >
                  <ArrowRight className="w-6 h-6 text-white" />
                  <div className="text-left">
                    <div className="font-bold text-white">Start Unlimited Practice</div>
                    <div className="text-xs text-white opacity-90">No time limit - study at your pace</div>
                  </div>
                </Button>
              </div>

              {/* Block 4: Authentic PLAB 1 Simulation */}
              <div className="border rounded-lg p-4 bg-purple-50">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Block 4: Authentic PLAB 1 Simulation
                </h3>
                <p className="text-sm text-purple-700 mb-4">Real exam conditions - exactly 1 minute per question</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <Button 
                    onClick={() => startAuthenticTimedPractice(10)}
                    disabled={isGeneratingQuestions}
                    className="bg-purple-600 hover:bg-purple-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">10</span>
                    <span className="text-xs opacity-90">10 mins</span>
                  </Button>
                  <Button 
                    onClick={() => startAuthenticTimedPractice(20)}
                    disabled={isGeneratingQuestions}
                    className="bg-purple-600 hover:bg-purple-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">20</span>
                    <span className="text-xs opacity-90">20 mins</span>
                  </Button>
                  <Button 
                    onClick={() => startAuthenticTimedPractice(50)}
                    disabled={isGeneratingQuestions}
                    className="bg-purple-600 hover:bg-purple-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">50</span>
                    <span className="text-xs opacity-90">50 mins</span>
                  </Button>
                  <Button 
                    onClick={() => startAuthenticTimedPractice(60)}
                    disabled={isGeneratingQuestions}
                    className="bg-purple-600 hover:bg-purple-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">60</span>
                    <span className="text-xs opacity-90">1 hour</span>
                  </Button>
                  <Button 
                    onClick={() => startAuthenticTimedPractice(180)}
                    disabled={isGeneratingQuestions}
                    className="bg-purple-600 hover:bg-purple-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">180</span>
                    <span className="text-xs opacity-90">Full PLAB</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  if (isGeneratingQuestions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-24">
        <Card className="w-full max-w-md mb-16">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating AI Medical Questions</h3>
            <p className="text-gray-600">Creating personalized questions for {selectedCategory} practice...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Session complete
  if (sessionComplete) {
    const correctAnswers = generatedQuestions.filter((_, index) => {
      // This would need to track user answers properly
      return true; // Placeholder
    }).length;
    
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-24">
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardContent className="p-8 text-center">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Complete!</h2>
              <p className="text-gray-600 mb-6">You've completed your practice session</p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-600 font-medium">Questions Answered</p>
                  <p className="text-2xl font-bold text-blue-900">{generatedQuestions.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-600 font-medium">Time Spent</p>
                  <p className="text-2xl font-bold text-green-900">{Math.round(timeSpent / 1000 / 60)}m</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-purple-600 font-medium">Category</p>
                  <p className="text-2xl font-bold text-purple-900 capitalize">{selectedCategory}</p>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start New Session
                </Button>
                <Button variant="outline" onClick={() => setSessionStarted(false)}>
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main question interface - Template Style Layout
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No questions available</p>
            <Button onClick={() => setSessionStarted(false)} className="mt-4">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto mb-16">
        {/* Progress Header with Stopwatch and Points */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-sm">
              Question {currentQuestionIndex + 1} of {generatedQuestions.length}
            </Badge>
            <div className="flex items-center gap-4">
              {/* Points Display */}
              <div className="relative flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-3 py-1 rounded-full border border-yellow-300">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="font-bold text-yellow-700">{sessionPoints}</span>
                <span className="text-xs text-yellow-600">pts</span>
                {showPointsAnimation && (
                  <span className="absolute -top-4 right-0 text-green-600 font-bold text-sm animate-bounce">
                    +{lastPointsEarned}
                  </span>
                )}
              </div>
              {/* Streak Display */}
              {currentStreak > 0 && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-orange-100 to-red-100 px-2 py-1 rounded-full border border-orange-300">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-orange-600 text-sm">{currentStreak}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{Math.round(timeSpent / 1000 / 60)}m total</span>
              </div>
              {isTimedSession && (
                <div className={`flex items-center gap-2 text-sm font-mono ${isTimerRunning ? 'text-green-600' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span>{formatTime(questionTimer)}</span>
                </div>
              )}
            </div>
          </div>
          <Progress 
            value={((currentQuestionIndex + 1) / generatedQuestions.length) * 100} 
            className="h-2"
          />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Controls - Translation and Voice */}
            <div className="flex justify-between items-start mb-4 gap-4">
              {/* Translation Controls */}
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <Languages className="w-4 h-4 text-blue-600" />
                  <Switch
                    checked={translateQuestions}
                    onCheckedChange={setTranslateQuestions}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-sm text-gray-700">Translate</span>
                  {translateQuestions && (
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-y-auto">
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="ar">🇸🇦 Arabic</SelectItem>
                        <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
                        <SelectItem value="ur">🇵🇰 Urdu</SelectItem>
                        <SelectItem value="bn">🇧🇩 Bengali</SelectItem>
                        <SelectItem value="ta">🇮🇳 Tamil</SelectItem>
                        <SelectItem value="te">🇮🇳 Telugu</SelectItem>
                        <SelectItem value="gu">🇮🇳 Gujarati</SelectItem>
                        <SelectItem value="mr">🇮🇳 Marathi</SelectItem>
                        <SelectItem value="pa">🇮🇳 Punjabi</SelectItem>
                        <SelectItem value="kn">🇮🇳 Kannada</SelectItem>
                        <SelectItem value="ml">🇮🇳 Malayalam</SelectItem>
                        <SelectItem value="ne">🇳🇵 Nepali</SelectItem>
                        <SelectItem value="si">🇱🇰 Sinhala</SelectItem>
                        <SelectItem value="my">🇲🇲 Myanmar</SelectItem>
                        <SelectItem value="th">🇹🇭 Thai</SelectItem>
                        <SelectItem value="vi">🇻🇳 Vietnamese</SelectItem>
                        <SelectItem value="id">🇮🇩 Indonesian</SelectItem>
                        <SelectItem value="ms">🇲🇾 Malay</SelectItem>
                        <SelectItem value="tl">🇵🇭 Filipino</SelectItem>
                        <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                        <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                        <SelectItem value="ko">🇰🇷 Korean</SelectItem>
                        <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                        <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
                        <SelectItem value="fr">🇫🇷 French</SelectItem>
                        <SelectItem value="de">🇩🇪 German</SelectItem>
                        <SelectItem value="it">🇮🇹 Italian</SelectItem>
                        <SelectItem value="ru">🇷🇺 Russian</SelectItem>
                        <SelectItem value="tr">🇹🇷 Turkish</SelectItem>
                        <SelectItem value="fa">🇮🇷 Persian</SelectItem>
                        <SelectItem value="ps">🇦🇫 Pashto</SelectItem>
                        <SelectItem value="sw">🇰🇪 Swahili</SelectItem>
                        <SelectItem value="am">🇪🇹 Amharic</SelectItem>
                        <SelectItem value="ha">🇳🇬 Hausa</SelectItem>
                        <SelectItem value="yo">🇳🇬 Yoruba</SelectItem>
                        <SelectItem value="ig">🇳🇬 Igbo</SelectItem>
                        <SelectItem value="zu">🇿🇦 Zulu</SelectItem>
                        <SelectItem value="af">🇿🇦 Afrikaans</SelectItem>
                        <SelectItem value="nl">🇳🇱 Dutch</SelectItem>
                        <SelectItem value="pl">🇵🇱 Polish</SelectItem>
                        <SelectItem value="cs">🇨🇿 Czech</SelectItem>
                        <SelectItem value="hu">🇭🇺 Hungarian</SelectItem>
                        <SelectItem value="ro">🇷🇴 Romanian</SelectItem>
                        <SelectItem value="bg">🇧🇬 Bulgarian</SelectItem>
                        <SelectItem value="hr">🇭🇷 Croatian</SelectItem>
                        <SelectItem value="sr">🇷🇸 Serbian</SelectItem>
                        <SelectItem value="sl">🇸🇮 Slovenian</SelectItem>
                        <SelectItem value="el">🇬🇷 Greek</SelectItem>
                        <SelectItem value="he">🇮🇱 Hebrew</SelectItem>
                        <SelectItem value="uk">🇺🇦 Ukrainian</SelectItem>
                        <SelectItem value="ka">🇬🇪 Georgian</SelectItem>
                        <SelectItem value="hy">🇦🇲 Armenian</SelectItem>
                        <SelectItem value="az">🇦🇿 Azerbaijani</SelectItem>
                        <SelectItem value="kk">🇰🇿 Kazakh</SelectItem>
                        <SelectItem value="uz">🇺🇿 Uzbek</SelectItem>
                        <SelectItem value="mn">🇲🇳 Mongolian</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Voice Controls */}
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-green-600" />
                  <Switch
                    checked={speechEnabled}
                    onCheckedChange={(checked) => {
                      setSpeechEnabled(checked);
                      if (!checked) stopSpeaking();
                    }}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <span className="text-sm text-gray-700">Voice</span>
                  {speechEnabled && (
                    <>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="w-48 h-8 text-xs">
                          <SelectValue placeholder="Select Voice" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64 overflow-y-auto">
                          {availableVoices.map((voice) => {
                            const isEnglish = voice.lang.startsWith('en');
                            const countryCode = voice.lang.split('-')[1] || '';
                            const flagEmoji = {
                              'US': '🇺🇸', 'GB': '🇬🇧', 'AU': '🇦🇺', 'CA': '🇨🇦',
                              'AR': '🇸🇦', 'ES': '🇪🇸', 'FR': '🇫🇷', 'DE': '🇩🇪',
                              'IT': '🇮🇹', 'PT': '🇵🇹', 'RU': '🇷🇺', 'CN': '🇨🇳',
                              'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳'
                            }[countryCode] || '🌐';
                            
                            const voiceName = voice.name.length > 20 
                              ? voice.name.substring(0, 17) + '...'
                              : voice.name;
                            
                            return (
                              <SelectItem key={voice.name} value={voice.name}>
                                <div className="flex items-center gap-2">
                                  <span>{flagEmoji}</span>
                                  <span className="text-xs">{voiceName}</span>
                                  {isEnglish && <span className="text-xs text-blue-600">★</span>}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant={isSpeaking ? "destructive" : "default"}
                        onClick={isSpeaking ? stopSpeaking : speakCurrentQuestion}
                        className="h-8 px-2"
                      >
                        {isSpeaking ? "Stop" : "Play"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Clinical Scenario */}
            {currentQuestion.scenario && (
              <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">📋</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Clinical Scenario</h3>
                    {(() => {
                      const cacheKey = `${currentQuestion.id}_${selectedLanguage}`;
                      const translatedQ = translatedQuestions[cacheKey];
                      
                      if (translateQuestions && selectedLanguage !== 'en' && translatedQ?.scenario) {
                        return (
                          <div className="space-y-3">
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">English:</p>
                              <p className="text-gray-700 leading-relaxed">{currentQuestion.scenario}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded border border-blue-300">
                              <p className="text-xs text-blue-600 mb-1">Translation:</p>
                              <p className="text-gray-700 leading-relaxed">{translatedQ.scenario}</p>
                            </div>
                          </div>
                        );
                      }
                      return <p className="text-gray-700 leading-relaxed">{currentQuestion.scenario}</p>;
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Question */}
            <div className="mb-6">
              {(() => {
                const cacheKey = `${currentQuestion.id}_${selectedLanguage}`;
                const translatedQ = translatedQuestions[cacheKey];
                
                if (translateQuestions && selectedLanguage !== 'en' && translatedQ?.question) {
                  return (
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">English:</p>
                        <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
                          {currentQuestion.question || currentQuestion.stem}
                        </h2>
                      </div>
                      <div className="bg-blue-100 p-3 rounded border border-blue-300">
                        <p className="text-xs text-blue-600 mb-1">Translation:</p>
                        <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
                          {translatedQ.question}
                        </h2>
                      </div>
                    </div>
                  );
                }
                return (
                  <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
                    {currentQuestion.question || currentQuestion.stem}
                  </h2>
                );
              })()}
            </div>

            {/* Submit Answer Button - Appears after selecting an option */}
            {selectedAnswer !== "" && !showExplanation && (
              <div className="mb-6 text-center">
                <Button 
                  onClick={handleSubmitAnswer}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Submit Answer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Click to view explanation and continue
                </p>
              </div>
            )}

            {/* Answer Options - PassMedicine Style */}
            <div className="space-y-2 mb-8">
              {(() => {
                const cacheKey = `${currentQuestion.id}_${selectedLanguage}`;
                const translatedQ = translatedQuestions[cacheKey];
                
                // Handle different option structures
                let options = [];
                if (translateQuestions && selectedLanguage !== 'en' && translatedQ?.options) {
                  options = Array.isArray(translatedQ.options) ? translatedQ.options : Object.values(translatedQ.options);
                } else if (currentQuestion.options) {
                  if (Array.isArray(currentQuestion.options)) {
                    options = currentQuestion.options;
                  } else if (typeof currentQuestion.options === 'object') {
                    // Handle object structure like {A: "option1", B: "option2", ...}
                    options = Object.values(currentQuestion.options);
                  }
                }
                
                return options;
              })().map((option: string, index: number) => {
                // Handle different correct answer formats
                let correctAnswerIndex = currentQuestion.correctAnswer || currentQuestion.correct_answer;
                if (typeof correctAnswerIndex === 'string') {
                  // Convert letter-based answers (A, B, C, D, E) to index
                  correctAnswerIndex = correctAnswerIndex.charCodeAt(0) - 65; // A=0, B=1, etc.
                }
                const isCorrectAnswer = index === correctAnswerIndex;
                const isSelectedAnswer = selectedAnswer === index.toString();
                const isIncorrectlySelected = showExplanation && isSelectedAnswer && !isCorrectAnswer;
                
                return (
                  <label 
                    key={index} 
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      showExplanation 
                        ? isCorrectAnswer
                          ? 'border-green-500 bg-green-100 shadow-lg shadow-green-200'
                          : isIncorrectlySelected
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                        : isSelectedAnswer
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index.toString()}
                      checked={selectedAnswer === index.toString()}
                      onChange={() => !showExplanation && handleAnswerSelect(index.toString())}
                      disabled={showExplanation}
                      className="w-4 h-4 mr-3 text-blue-600"
                    />
                    
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center mr-3 font-bold text-sm">
                      {String.fromCharCode(65 + index)}
                    </div>
                    
                    <div className="flex-1">
                      {(() => {
                        const cacheKey = `${currentQuestion.id}_${selectedLanguage}`;
                        const translatedQ = translatedQuestions[cacheKey];
                        const originalOptions = Array.isArray(currentQuestion.options) 
                          ? currentQuestion.options 
                          : Object.values(currentQuestion.options || {});
                        const originalOption = originalOptions[index];
                        
                        if (translateQuestions && selectedLanguage !== 'en' && translatedQ?.options) {
                          return (
                            <div className="space-y-2">
                              {showExplanation && isCorrectAnswer && (
                                <span className="inline-flex items-center gap-1 mb-2">
                                  <span className="text-green-700 font-bold text-lg">✓ CORRECT:</span>
                                </span>
                              )}
                              {showExplanation && isIncorrectlySelected && (
                                <span className="inline-flex items-center gap-1 mb-2">
                                  <span className="text-red-600 font-bold">✗ YOUR CHOICE:</span>
                                </span>
                              )}
                              <div className="bg-white/70 p-2 rounded border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">English:</p>
                                <span className={`text-base leading-relaxed ${
                                  showExplanation && isCorrectAnswer 
                                    ? 'text-green-900 font-bold' 
                                    : showExplanation && isIncorrectlySelected
                                    ? 'text-red-800'
                                    : 'text-gray-800'
                                }`}>
                                  {originalOption}
                                </span>
                              </div>
                              <div className="bg-blue-50 p-2 rounded border border-blue-200">
                                <p className="text-xs text-blue-600 mb-1">Translation:</p>
                                <span className={`text-base leading-relaxed ${
                                  showExplanation && isCorrectAnswer 
                                    ? 'text-green-900 font-bold' 
                                    : showExplanation && isIncorrectlySelected
                                    ? 'text-red-800'
                                    : 'text-gray-800'
                                }`}>
                                  {option}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <span className={`text-base leading-relaxed ${
                            showExplanation && isCorrectAnswer 
                              ? 'text-green-900 font-bold' 
                              : showExplanation && isIncorrectlySelected
                              ? 'text-red-800'
                              : 'text-gray-800'
                          }`}>
                            {showExplanation && isCorrectAnswer && (
                              <span className="inline-flex items-center gap-1 mr-2">
                                <span className="text-green-700 font-bold text-lg">✓ CORRECT:</span>
                              </span>
                            )}
                            {showExplanation && isIncorrectlySelected && (
                              <span className="inline-flex items-center gap-1 mr-2">
                                <span className="text-red-600 font-bold">✗ YOUR CHOICE:</span>
                              </span>
                            )}
                            <span className={showExplanation && isCorrectAnswer ? 'text-green-900 font-bold' : ''}>
                              {option}
                            </span>
                          </span>
                        );
                      })()}
                    </div>
                    
                    {speechEnabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(option);
                        }}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 ml-2"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                    
                    {showExplanation && isCorrectAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                    )}
                    {showExplanation && isIncorrectlySelected && (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
                    )}
                  </label>
                );
              })}
            </div>

            {/* Navigation removed - buttons now at bottom */}

          </CardContent>
        </Card>

        {/* Desktop Navigation - Between Content Sections */}
        {showExplanation && (
          <div className="hidden md:block mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <Button
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(prev => prev - 1);
                    setSelectedAnswer("");
                    setShowExplanation(false);
                    setQuestionStartTime(Date.now());
                  }
                }}
                disabled={currentQuestionIndex === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700">
                  Question {currentQuestionIndex + 1} of {generatedQuestions.length}
                </div>
                {isTimedSession && (
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(questionTimer)}
                  </div>
                )}
              </div>
              
              <Button
                onClick={handleNextQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                {currentQuestionIndex === generatedQuestions.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Answer Explanation - PassMedicine Style */}
        {showExplanation && (
          <>
          <div className="space-y-6 mb-8">

            {/* Structured AI explanation (or fallback to legacy bullet list) */}
            <div className="text-gray-800 leading-relaxed space-y-4">
              {aiExplanationLoading && !aiExplanation ? (
                <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Brain className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-medium">Generating clinical reasoning…</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="h-3 bg-blue-100 rounded animate-pulse" />
                    <div className="h-3 bg-blue-100 rounded animate-pulse w-5/6" />
                    <div className="h-3 bg-blue-100 rounded animate-pulse w-4/6" />
                  </div>
                </div>
              ) : aiExplanation && aiExplanation.source !== 'fallback' ? (
                <div className="space-y-5">
                  {/* Why correct */}
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <h4 className="font-semibold text-green-900">
                        Why the correct answer fits
                      </h4>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                      {aiExplanation.correctRationale}
                    </p>
                  </div>

                  {/* Per-option breakdown */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Option-by-option analysis:</h4>
                    <div className="space-y-3">
                      {aiExplanation.options.map((opt) => (
                        <div
                          key={opt.label}
                          className={`border-l-4 p-3 rounded-r-lg ${
                            opt.isCorrect
                              ? 'border-green-500 bg-green-50'
                              : opt.isSelected
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <span
                              className={`font-bold text-sm px-2 py-0.5 rounded ${
                                opt.isCorrect
                                  ? 'bg-green-600 text-white'
                                  : opt.isSelected
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-300 text-gray-800'
                              }`}
                            >
                              {opt.label}
                            </span>
                            <span className="font-medium text-sm text-gray-900">
                              {opt.text}
                            </span>
                            {opt.isCorrect && (
                              <Badge className="ml-auto bg-green-600 hover:bg-green-700 text-xs">Correct</Badge>
                            )}
                            {opt.isSelected && !opt.isCorrect && (
                              <Badge variant="destructive" className="ml-auto text-xs">Your answer</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed pl-9">
                            {opt.why}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key learning point */}
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <div className="flex items-start gap-2 mb-1">
                      <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <h4 className="font-semibold text-amber-900">Key learning point</h4>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {aiExplanation.keyLearningPoint}
                    </p>
                  </div>

                  {aiExplanation.source === 'fallback' && (
                    <p className="text-xs text-gray-500 italic">
                      AI-generated explanation unavailable — showing the stored explanation. Try again later for a richer breakdown.
                    </p>
                  )}
                </div>
              ) : (
                (() => {
                  const rawExplanation = currentQuestion.explanation;
                  const explanation = typeof rawExplanation === 'object' && rawExplanation !== null
                    ? Object.entries(rawExplanation).map(([k, v]) => `${k}: ${v}`).join('. ')
                    : (rawExplanation || '');
                  const sentences = explanation.split('.').filter((s: string) => s.trim().length > 10);
                  return (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Explanation:</h4>
                      <ul className="space-y-2 ml-4">
                        {sentences.map((sentence: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span className="text-base leading-relaxed">{sentence.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Topic heading like PassMedicine */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xl font-normal text-blue-600 mb-2">
                {currentQuestion.category ? currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1) : 'Medical Topic'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">★</span>
                <span className="text-sm text-gray-600">Reference material</span>
              </div>
            </div>

            {/* CKS Clinical Knowledge Summaries */}
            {currentQuestion.cks_guidance && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-4">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-green-900">CKS Clinical Knowledge Summary</p>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-green-700 italic">
                          Note: CKS access may be restricted outside the UK
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-green-200 rounded-lg p-4 mb-3">
                      <p className="text-green-800 text-sm leading-relaxed mb-3">
                        {(() => {
                          let summary = currentQuestion.cks_guidance.summary || '';
                          // Remove redundant header text patterns
                          summary = summary.replace(/^NICE Clinical Guideline:\s*CKS:\s*\[.*?\]\s*/i, '');
                          summary = summary.replace(/^CKS:\s*\[.*?\]\s*/i, '');
                          summary = summary.replace(/^NICE:\s*\[.*?\]\s*/i, '');
                          return summary.trim();
                        })()}
                      </p>
                      
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-green-900 mb-2">Key Clinical Points:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {Array.isArray(currentQuestion.cks_guidance.key_points) && 
                           currentQuestion.cks_guidance.key_points.map((point: string, index: number) => (
                            <li key={index} className="text-xs text-green-800">{point}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-green-900 mb-1">Management Approach:</p>
                        <p className="text-xs text-green-800">{currentQuestion.cks_guidance.management_approach}</p>
                      </div>
                      
                      {/* Specific CKS References - Enhanced Detail */}
                      {currentQuestion.cks_guidance.specific_references && currentQuestion.cks_guidance.specific_references.length > 0 && (
                        <div className="mb-3 bg-green-25 border border-green-300 rounded-lg p-3">
                          <p className="text-xs font-semibold text-green-900 mb-2">Specific CKS Guidance References:</p>
                          <div className="space-y-2">
                            {currentQuestion.cks_guidance.specific_references.map((ref: any, index: number) => (
                              <div key={index} className="bg-white border border-green-200 rounded p-2">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="flex-1">
                                    <p className="text-xs font-medium text-green-900">{ref.section}</p>
                                    {ref.subsection && (
                                      <p className="text-xs text-green-700 italic">{ref.subsection}</p>
                                    )}
                                  </div>
                                  <a
                                    href={ref.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-green-300 text-green-700 hover:bg-green-50 h-6 px-2"
                                  >
                                    <ExternalLink className="w-2 h-2 mr-1" />
                                    View
                                  </a>
                                </div>
                                <p className="text-xs text-green-800 leading-relaxed mb-1">
                                  {ref.text}
                                </p>
                                {ref.tableOrFigure && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                                      📊 {ref.tableOrFigure}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {currentQuestion.cks_guidance.red_flags && Array.isArray(currentQuestion.cks_guidance.red_flags) && currentQuestion.cks_guidance.red_flags.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <p className="text-xs font-semibold text-red-900 mb-1">Red Flags:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {currentQuestion.cks_guidance.red_flags.map((flag: string, index: number) => (
                              <li key={index} className="text-xs text-red-800">{flag}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* ESC Guidelines */}
            {currentQuestion.esc_guidance && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-red-900">ESC Guidelines</p>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-red-700 italic">
                          European Society of Cardiology
                        </p>
                        {currentQuestion.esc_guidance.evidence_level && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            {currentQuestion.esc_guidance.evidence_level}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white border border-red-200 rounded-lg p-4 mb-3">
                      <p className="text-red-800 text-sm leading-relaxed mb-3">
                        {currentQuestion.esc_guidance.summary}
                      </p>
                      
                      <div className="mb-3">
                        <p className="font-medium text-red-900 text-xs mb-2">Key Points:</p>
                        <ul className="text-xs text-red-800 space-y-1">
                          {currentQuestion.esc_guidance.key_points.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-3">
                        <p className="font-medium text-red-900 text-xs mb-2">Clinical Approach:</p>
                        <p className="text-xs text-red-800 leading-relaxed">
                          {currentQuestion.esc_guidance.clinical_approach}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-red-200">
                        <p className="text-xs text-red-700">ESC Clinical Practice Guidelines</p>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(currentQuestion.esc_guidance.esc_url || 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines', '_blank');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View ESC Guidelines
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADA Guidelines */}
            {currentQuestion.ada_guidance && (
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg mb-4">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-purple-900">ADA Standards</p>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-purple-700 italic">
                          American Diabetes Association
                        </p>
                        {currentQuestion.ada_guidance.evidence_level && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {currentQuestion.ada_guidance.evidence_level}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white border border-purple-200 rounded-lg p-4 mb-3">
                      <p className="text-purple-800 text-sm leading-relaxed mb-3">
                        {currentQuestion.ada_guidance.summary}
                      </p>
                      
                      <div className="mb-3">
                        <p className="font-medium text-purple-900 text-xs mb-2">Key Points:</p>
                        <ul className="text-xs text-purple-800 space-y-1">
                          {currentQuestion.ada_guidance.key_points.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-purple-600 rounded-full mt-1.5 flex-shrink-0"></span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-3">
                        <p className="font-medium text-purple-900 text-xs mb-2">Clinical Approach:</p>
                        <p className="text-xs text-purple-800 leading-relaxed">
                          {currentQuestion.ada_guidance.clinical_approach}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-purple-200">
                        <p className="text-xs text-purple-700">ADA Standards of Care</p>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(currentQuestion.ada_guidance.ada_url || 'https://professional.diabetes.org/standards-of-care', '_blank');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View ADA Standards
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SIGN Guidelines */}
            {currentQuestion.sign_guidance && (
              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg mb-4">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-1" />
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-indigo-900">SIGN Guidelines</p>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-indigo-700 italic">
                          Scottish Intercollegiate Guidelines Network
                        </p>
                        {currentQuestion.sign_guidance.evidence_level && (
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                            {currentQuestion.sign_guidance.evidence_level}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white border border-indigo-200 rounded-lg p-4 mb-3">
                      <p className="text-indigo-800 text-sm leading-relaxed mb-3">
                        {currentQuestion.sign_guidance.summary}
                      </p>
                      
                      <div className="mb-3">
                        <p className="font-medium text-indigo-900 text-xs mb-2">Key Points:</p>
                        <ul className="text-xs text-indigo-800 space-y-1">
                          {currentQuestion.sign_guidance.key_points.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-3">
                        <p className="font-medium text-indigo-900 text-xs mb-2">Clinical Approach:</p>
                        <p className="text-xs text-indigo-800 leading-relaxed">
                          {currentQuestion.sign_guidance.clinical_approach}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-indigo-200">
                        <p className="text-xs text-indigo-700">SIGN Clinical Guidelines</p>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(currentQuestion.sign_guidance.sign_url || 'https://www.sign.ac.uk/our-guidelines/', '_blank');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View SIGN Guidelines
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BTS Guidelines */}
            {currentQuestion.bts_guidance && (
              <div className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg mb-4">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-teal-600 flex-shrink-0 mt-1" />
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-teal-900">BTS Guidelines</p>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-teal-700 italic">
                          British Thoracic Society
                        </p>
                        {currentQuestion.bts_guidance.evidence_level && (
                          <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                            {currentQuestion.bts_guidance.evidence_level}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white border border-teal-200 rounded-lg p-4 mb-3">
                      <p className="text-teal-800 text-sm leading-relaxed mb-3">
                        {currentQuestion.bts_guidance.summary}
                      </p>
                      
                      <div className="mb-3">
                        <p className="font-medium text-teal-900 text-xs mb-2">Key Points:</p>
                        <ul className="text-xs text-teal-800 space-y-1">
                          {currentQuestion.bts_guidance.key_points.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-teal-600 rounded-full mt-1.5 flex-shrink-0"></span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-3">
                        <p className="font-medium text-teal-900 text-xs mb-2">Clinical Approach:</p>
                        <p className="text-xs text-teal-800 leading-relaxed">
                          {currentQuestion.bts_guidance.clinical_approach}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-teal-200">
                        <p className="text-xs text-teal-700">BTS Clinical Guidelines</p>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(currentQuestion.bts_guidance.bts_url || 'https://www.brit-thoracic.org.uk/quality-improvement/guidelines/', '_blank');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View BTS Guidelines
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specific Reference Section */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                <div className="w-full">
                  <p className="text-sm font-medium text-blue-900 mb-2">{translateText('Official References:')}</p>
                  <div className="text-sm text-blue-800 space-y-2">
                    {currentQuestion.references && currentQuestion.references.length > 0 ? (
                      currentQuestion.references
                        .filter((reference: any, index: number) => {
                          const title = typeof reference === 'string' ? reference : reference.title || reference.text || '';
                          // Filter out CKS references that duplicate what's already in the CKS button
                          return !title.toLowerCase().includes('cks:') && !title.toLowerCase().includes('clinical guideline: cks');
                        })
                        .map((reference: any, index: number) => {
                          const refTitle = typeof reference === 'string' ? reference : reference.title || reference.text || '';
                          const refUrl = (typeof reference === 'object' && reference.url) || getReferenceUrl(refTitle);
                          return (
                            <div key={index} className="bg-white border border-blue-200 rounded-lg p-3 mb-3">
                              <p className="text-blue-700 leading-relaxed mb-3 text-sm">{refTitle}</p>
                              {refUrl && (
                                <a
                                  href={refUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Full Guidelines
                                </a>
                              )}
                            </div>
                          );
                        })
                    ) : (
                      <div className="space-y-2">
                        {/* Specialty-specific references with comprehensive guidelines */}
                        {currentQuestion.category?.toLowerCase().includes('cardio') && (
                          <>
                            <ReferenceLink text="ESC Guidelines - European Society of Cardiology evidence-based recommendations" />
                            <ReferenceLink text="NICE Guidelines - Cardiovascular disease prevention and management" />
                            <ReferenceLink text="SIGN Guidelines - Scottish cardiovascular evidence and recommendations" />
                            <ReferenceLink text="BNF - British National Formulary for cardiac medications" />
                            <ReferenceLink text="MLA Content Map - Applied Medical Sciences: Cardiovascular pathophysiology" />
                            <ReferenceLink text="Foundation Programme - Acute care and emergency medicine competencies" />
                          </>
                        )}
                        {currentQuestion.category?.toLowerCase().includes('respiratory') && (
                          <>
                            <ReferenceLink text="BTS Guidelines - British Thoracic Society respiratory standards" />
                            <ReferenceLink text="NICE Guidelines - Asthma, COPD and respiratory disease management" />
                            <ReferenceLink text="SIGN Guidelines - Scottish respiratory evidence and recommendations" />
                            <ReferenceLink text="BNF - British National Formulary for respiratory medications" />
                            <ReferenceLink text="MLA Content Map - Clinical Skills: Respiratory examination and procedures" />
                            <ReferenceLink text="Foundation Programme - Safe prescribing and therapeutics" />
                          </>
                        )}
                        {(currentQuestion.category?.toLowerCase().includes('diabetes') || 
                          currentQuestion.category?.toLowerCase().includes('endocrin')) && (
                          <>
                            <ReferenceLink text="ADA Guidelines - American Diabetes Association standards of care" />
                            <ReferenceLink text="NICE Guidelines - Type 1 and Type 2 diabetes management" />
                            <ReferenceLink text="SIGN Guidelines - Scottish diabetes evidence and recommendations" />
                            <ReferenceLink text="BNF - British National Formulary for diabetes medications" />
                            <ReferenceLink text="MLA Content Map - Applied Medical Sciences: Endocrine pathophysiology" />
                            <ReferenceLink text="Foundation Programme - Quality improvement and patient safety" />
                          </>
                        )}
                        {currentQuestion.category?.toLowerCase().includes('gastro') && (
                          <>
                            <ReferenceLink text="BSG Guidelines - British Society of Gastroenterology clinical standards" />
                            <ReferenceLink text="NICE Guidelines - Gastrointestinal conditions and procedures" />
                            <ReferenceLink text="SIGN Guidelines - Scottish GI evidence and recommendations" />
                            <ReferenceLink text="BNF - British National Formulary for GI medications" />
                            <ReferenceLink text="MLA Content Map - Clinical Skills: Abdominal examination techniques" />
                            <ReferenceLink text="Foundation Programme - Infection prevention and antimicrobial stewardship" />
                          </>
                        )}
                        {(currentQuestion.category?.toLowerCase().includes('obstetric') || 
                          currentQuestion.category?.toLowerCase().includes('gynaecol')) && (
                          <>
                            <ReferenceLink text="RCOG Guidelines - Royal College of Obstetricians and Gynaecologists standards" />
                            <ReferenceLink text="NICE Guidelines - Antenatal, intrapartum and postnatal care" />
                            <ReferenceLink text="SIGN Guidelines - Scottish women's health evidence" />
                            <ReferenceLink text="BNF - British National Formulary for women's health medications" />
                            <ReferenceLink text="MLA Content Map - Professional Behaviour: Women's health communication" />
                            <ReferenceLink text="Foundation Programme - Health inequalities and social determinants" />
                          </>
                        )}
                        {/* Always show core UK medical references with MLA content map integration */}
                        <>
                          <ReferenceLink text="NICE Guidelines - Clinical evidence and recommendations" />
                          <ReferenceLink text="CKS Clinical Knowledge Summaries - Practical primary care guidance" />
                          <ReferenceLink text="BNF - British National Formulary for medications and prescribing" />
                          <ReferenceLink text="GMC Good Medical Practice - Professional standards and ethics" />
                          <ReferenceLink text="MLA Content Map - Applied Medical Sciences, Clinical Skills, Professional Behaviour" />
                          <ReferenceLink text="Foundation Programme Curriculum - Acute care, safe prescribing, quality improvement" />
                          <ReferenceLink text="RCGP Guidelines - Royal College of General Practitioners clinical standards" />
                          <ReferenceLink text="SIGN Guidelines - Scottish Intercollegiate Guidelines Network evidence" />
                        </>
                      </div>
                    )}
                    
                    {/* CKS Guidelines Button */}
                    {currentQuestion.cks_guidance && (
                      <div className="mt-4 pt-3 border-t border-blue-200">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(currentQuestion.cks_guidance.cks_url || 'https://cks.nice.org.uk/', '_blank');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View NICE CKS Guidelines
                        </Button>
                        <p className="text-xs text-blue-600 mt-2 italic">
                          Note: You will need to accept CKS terms and conditions for full access
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Study Tips Section with Medical Mnemonics */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                <div className="w-full">
                  <p className="text-sm font-medium text-blue-900 mb-3">{translateText('Study Tips & Medical Mnemonics')}</p>
                  
                  {/* Display question-specific study tips */}
                  {currentQuestion.study_tips ? (
                    <div className="space-y-3">
                      {/* Question-specific mnemonic */}
                      {currentQuestion.study_tips.mnemonic && (
                        <div className="bg-white border border-blue-200 rounded-lg p-3 border-l-4 border-l-yellow-400">
                          <div className="flex items-start gap-2">
                            <span className="text-lg">💡</span>
                            <div>
                              <p className="text-sm font-semibold text-blue-900 mb-1">Memory Aid:</p>
                              <p className="text-sm text-blue-800 leading-relaxed font-medium">{currentQuestion.study_tips.mnemonic}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Key learning points */}
                      {currentQuestion.study_tips.key_learning_points && currentQuestion.study_tips.key_learning_points.length > 0 && (
                        <div className="bg-white border border-blue-200 rounded-lg p-3">
                          <p className="text-sm font-semibold text-blue-900 mb-2">Key Learning Points:</p>
                          <ul className="space-y-1">
                            {currentQuestion.study_tips.key_learning_points.map((point: string, index: number) => (
                              <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Category-specific mnemonics based on question topic
                    <div className="space-y-3">
                      {/* Cardiology Mnemonics */}
                      {currentQuestion.category?.toLowerCase().includes('cardio') && (
                        <>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">ECG Reading: "RATE-RHYTHM-AXIS"</p>
                            <p className="text-sm text-blue-800">Rate → Rhythm → Axis → Intervals (PR, QRS, QT) → ST-T changes</p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Heart Murmurs: "All Physicians Take Money"</p>
                            <p className="text-sm text-blue-800">Aortic (2nd R ICS) → Pulmonary (2nd L ICS) → Tricuspid (4th L ICS) → Mitral (5th L MCL)</p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Heart Failure: "FACES"</p>
                            <p className="text-sm text-blue-800">Fatigue, Activity limitation, Congestion/Edema, Shortness of breath</p>
                          </div>
                        </>
                      )}

                      {/* Respiratory Mnemonics */}
                      {currentQuestion.category?.toLowerCase().includes('respiratory') && (
                        <>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Asthma Management: "SABA-MART"</p>
                            <p className="text-sm text-blue-800">SABA reliever → Maintenance and Reliever Therapy → Add-on treatments</p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">COPD Exacerbation: "STAMP"</p>
                            <p className="text-sm text-blue-800">Steroids, Theophylline, Antibiotics, Mucolytics, Physiotherapy</p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Pneumonia Severity: "CURB-65"</p>
                            <p className="text-sm text-blue-800">Confusion, Urea above 7, Respiratory rate 30+, BP below 90/60, age 65+</p>
                          </div>
                        </>
                      )}

                      {/* Endocrinology/Diabetes Mnemonics */}
                      {(currentQuestion.category?.toLowerCase().includes('diabetes') || 
                        currentQuestion.category?.toLowerCase().includes('endocrin')) && (
                        <>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Diabetes Complications: "REINS"</p>
                            <p className="text-sm text-blue-800">Retinopathy, Erectile dysfunction, Infection, Neuropathy, Stroke/CVD</p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">DKA Management: "INSULIN"</p>
                            <p className="text-sm text-blue-800">IV fluids, Normal saline, Serum glucose, Urea/electrolytes, Labs, IV insulin, Nursing care</p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Thyroid Function: "T3-T4-TSH"</p>
                            <p className="text-sm text-blue-800">High TSH + Low T4 = Hypothyroid; Low TSH + High T4 = Hyperthyroid</p>
                          </div>
                        </>
                      )}

                      {/* Gastroenterology Mnemonics */}
                      {currentQuestion.category?.toLowerCase().includes('gastro') && (
                        <>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">IBD vs IBS: "CROWS vs DOVES"</p>
                            <p className="text-sm text-blue-800">IBD: Chronic, Rectal bleeding, Obstruction, Weight loss, Systemic symptoms</p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Liver Function: "ALT-AST-ALP"</p>
                            <p className="text-sm text-blue-800">ALT/AST raised = hepatocellular; ALP raised = cholestatic pattern</p>
                          </div>
                        </>
                      )}

                      {/* Neurology Mnemonics */}
                      {currentQuestion.category?.toLowerCase().includes('neuro') && (
                        <>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Stroke Assessment: "FAST-BEFAST"</p>
                            <p className="text-sm text-blue-800">Balance, Eyes, Face, Arms, Speech, Time + Blood pressure, Emergency response</p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Seizure Types: "TONIC-CLONIC"</p>
                            <p className="text-sm text-blue-800">Tonic (stiffening) → Clonic (jerking) → Post-ictal confusion</p>
                          </div>
                        </>
                      )}

                      {/* General Medicine Mnemonics */}
                      {(!currentQuestion.category || 
                        (!currentQuestion.category.toLowerCase().includes('cardio') && 
                         !currentQuestion.category.toLowerCase().includes('respiratory') && 
                         !currentQuestion.category.toLowerCase().includes('diabetes') && 
                         !currentQuestion.category.toLowerCase().includes('endocrin') && 
                         !currentQuestion.category.toLowerCase().includes('gastro') && 
                         !currentQuestion.category.toLowerCase().includes('neuro'))) && (
                        <>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Clinical Assessment: "SOCRATES"</p>
                            <p className="text-sm text-blue-800">Site, Onset, Character, Radiation, Associated symptoms, Timing, Exacerbating factors, Severity</p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Drug History: "WIPE"</p>
                            <p className="text-sm text-blue-800">What drugs, Including OTC/herbal, Past reactions, Effectiveness of current treatment</p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Examination Approach: "IPPA"</p>
                            <p className="text-sm text-blue-800">Inspection → Palpation → Percussion → Auscultation</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Prominent Next Question Button - Bottom of Explanation */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Button 
              onClick={handleNextQuestion}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-4 rounded-lg font-semibold text-xl flex items-center gap-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              disabled={currentQuestionIndex >= generatedQuestions.length - 1}
            >
              {currentQuestionIndex >= generatedQuestions.length - 1 ? (
                <>Complete Session <CheckCircle className="w-6 h-6" /></>
              ) : (
                <>Next Question <ArrowRight className="w-6 h-6" /></>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              Question {currentQuestionIndex + 1} of {generatedQuestions.length}
            </p>
          </div>
          </>
        )}
      </div>

      {/* Mobile Navigation - Above Bottom Menu Tab */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <Button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(prev => prev - 1);
                  setSelectedAnswer("");
                  setShowExplanation(false);
                  setQuestionStartTime(Date.now());
                }
              }}
              disabled={currentQuestionIndex === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Center Content - Question Progress */}
            <div className="text-center flex-1">
              <div className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {generatedQuestions.length}
              </div>
              {isTimedSession && (
                <div className="text-xs text-gray-500 mt-1">
                  {formatTime(questionTimer)}
                </div>
              )}
            </div>

            {/* Submit/Next Button */}
            {!showExplanation ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                {currentQuestionIndex === generatedQuestions.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation - Bottom Fixed for Easy Access */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-4xl mx-auto p-3">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <Button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(prev => prev - 1);
                  setSelectedAnswer("");
                  setShowExplanation(false);
                  setQuestionStartTime(Date.now());
                }
              }}
              disabled={currentQuestionIndex === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-3 h-3" />
              Previous
            </Button>

            {/* Center Content - Question Progress */}
            <div className="text-center flex-1">
              <div className="text-xs font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {generatedQuestions.length}
              </div>
            </div>

            {/* Submit/Next Button */}
            {!showExplanation ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500 text-sm"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm"
              >
                {currentQuestionIndex === generatedQuestions.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* AI Tutor Floating Button */}
      {sessionStarted && (
        <Button
          onClick={() => setShowAITutor(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50 flex items-center justify-center"
          title="Ask AI Tutor"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* NICE NG136 Guide Floating Button - Always visible */}
      <Button
        onClick={() => setShowNiceGuide(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50 flex items-center justify-center"
        title="NICE NG136 + PLAB MCQ"
      >
        <FileText className="w-6 h-6 text-white" />
      </Button>

      {/* AI Tutor Modal */}
      <AITutor
        currentQuestion={generatedQuestions[currentQuestionIndex]}
        userPerformance={{
          correctAnswers: sessionResults.filter(r => r.correct).length,
          totalAnswered: sessionResults.length,
          averageTime: sessionResults.length > 0 
            ? sessionResults.reduce((sum, r) => sum + r.timeSpent, 0) / sessionResults.length 
            : 0
        }}
        onClose={() => setShowAITutor(false)}
        isVisible={showAITutor}
      />

      {/* Pause/Continue Milestone Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header with celebration */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Great Progress!</h2>
              <p className="text-green-100">
                You've got {sessionResults.filter(r => r.correct).length} questions correct!
              </p>
            </div>
            
            {/* Stats */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {sessionResults.filter(r => r.correct).length}
                  </div>
                  <div className="text-sm text-green-700">Correct</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {sessionResults.length}
                  </div>
                  <div className="text-sm text-blue-700">Answered</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Questions Remaining</span>
                  <span className="font-semibold text-gray-800">
                    {generatedQuestions.length - currentQuestionIndex - 1}
                  </span>
                </div>
              </div>
              
              <p className="text-center text-gray-600 text-sm">
                Would you like to take a break or continue practicing?
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleContinuePractice}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue Practicing
                </Button>
                <Button
                  onClick={handlePauseSession}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 py-3"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Take a Break & See Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NICE NG136 + PLAB MCQ Guide Overlay */}
      {showNiceGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">NICE NG136 + PLAB MCQ Format</h2>
              </div>
              <Button
                onClick={() => setShowNiceGuide(false)}
                variant="outline"
                size="sm"
                className="hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Clinical Scenario Section */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Clinical Scenario Framework
                </h3>
                <div className="space-y-4">
                  <div className="bg-white border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">1. Patient Presentation</h4>
                    <p className="text-sm text-blue-700">Age, gender, chief complaint, duration of symptoms, relevant medical history</p>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">2. Clinical Findings</h4>
                    <p className="text-sm text-blue-700">Physical examination findings, vital signs, initial observations</p>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">3. Investigation Results</h4>
                    <p className="text-sm text-blue-700">Laboratory values, imaging findings, diagnostic test results</p>
                  </div>
                </div>
              </div>

              {/* NICE NG136 Integration */}
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  NICE NG136 Guidance Integration
                </h3>
                <div className="space-y-4">
                  <div className="bg-white border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Risk Assessment Tools</h4>
                    <p className="text-sm text-green-700">QRISK3, CHA₂DS₂-VASc, HAS-BLED scoring systems</p>
                  </div>
                  <div className="bg-white border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Treatment Thresholds</h4>
                    <p className="text-sm text-green-700">10-year CVD risk ≥10%, blood pressure targets, lipid management</p>
                  </div>
                  <div className="bg-white border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Lifestyle Interventions</h4>
                    <p className="text-sm text-green-700">Diet, exercise, smoking cessation, alcohol reduction</p>
                  </div>
                </div>
              </div>

              {/* PLAB MCQ Structure */}
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  PLAB MCQ Structure
                </h3>
                <div className="space-y-4">
                  <div className="bg-white border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">Question Format</h4>
                    <p className="text-sm text-purple-700">Single best answer from 5 options (A-E), clinical vignette based</p>
                  </div>
                  <div className="bg-white border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">Answer Options</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full border-2 border-black bg-white text-black flex items-center justify-center font-semibold text-xs">A</div>
                      <div className="w-6 h-6 rounded-full border-2 border-black bg-white text-black flex items-center justify-center font-semibold text-xs">B</div>
                      <div className="w-6 h-6 rounded-full border-2 border-black bg-white text-black flex items-center justify-center font-semibold text-xs">C</div>
                      <div className="w-6 h-6 rounded-full border-2 border-black bg-white text-black flex items-center justify-center font-semibold text-xs">D</div>
                      <div className="w-6 h-6 rounded-full border-2 border-black bg-white text-black flex items-center justify-center font-semibold text-xs">E</div>
                    </div>
                  </div>
                  <div className="bg-white border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">Clinical Reasoning</h4>
                    <p className="text-sm text-purple-700">Evidence-based explanations, guideline references, memory aids</p>
                  </div>
                </div>
              </div>

              {/* Memory Aids Integration */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Memory Aids & Mnemonics
                </h3>
                <div className="space-y-3">
                  <div className="bg-white border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">QRISK3 Factors</h4>
                    <p className="text-sm text-yellow-700"><strong>DEMOGRAPHICS:</strong> Age, Gender, Ethnicity, Deprivation</p>
                  </div>
                  <div className="bg-white border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">CVD Prevention</h4>
                    <p className="text-sm text-yellow-700"><strong>ASPIRE:</strong> Antiplatelet, Statin, Pressure control, Intervention (lifestyle), Risk assessment, Education</p>
                  </div>
                  <div className="bg-white border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Hypertension Management</h4>
                    <p className="text-sm text-yellow-700"><strong>ABCD:</strong> ACE inhibitor, Beta-blocker, Calcium channel blocker, Diuretic</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  This format integrates NICE NG136 cardiovascular disease prevention guidelines with PLAB examination standards
                </p>
                <Button
                  onClick={() => window.open('https://www.nice.org.uk/guidance/ng136', '_blank')}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View NICE NG136 Full Guidelines
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}