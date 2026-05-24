import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock, ArrowRight, ArrowLeft, Award, CheckCircle, ExternalLink,
  BookOpen, Target, Brain, Lightbulb, X, MessageCircle, Flame, AlertTriangle
} from "lucide-react";
import plab1BgImage from '@assets/458CC7DF-D6D7-4BAD-85F5-99EEBD33ECD9_1750366142331.jpg';
import { apiRequest } from "@/lib/queryClient";
import { Tutor } from "@/components/ai-tutor";
import { useToast } from "@/hooks/use-toast";
import { formatTime, calculatePoints, type AIExplanation, type AIStudyTips } from "@/lib/quiz-utils";
import {
  shuffleArray,
  applyOptionShuffle,
  selectAdaptiveQuestions,
  selectAdaptiveQuestionsWithStats,
  filterIncorrectOnlyQuestions,
  recordQuestionAttempt,
  addToRecentHistory,
  type QuestionStatsMap,
} from "@/lib/question-randomisation";
import { GamificationBar } from "@/components/plab1/GamificationBar";
import { QuizQuestion } from "@/components/plab1/QuizQuestion";
import { ExplanationPanel } from "@/components/plab1/ExplanationPanel";
import { FlashcardsFromQuestion } from "@/components/plab1/FlashcardsFromQuestion";
import { StudyTipsPanel } from "@/components/plab1/StudyTipsPanel";
import { SessionNavBar } from "@/components/plab1/SessionNavBar";
import { SessionSetup } from "@/components/plab1/SessionSetup";
import { SessionComplete } from "@/components/plab1/SessionComplete";
import { QuizErrorBoundary } from "@/components/plab1/QuizErrorBoundary";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useQuestionStopwatch } from "@/hooks/use-quiz";
import { useProgress } from "@/hooks/use-progress";
import { useLocalAnalytics } from "@/hooks/useLocalAnalytics";
import { useAuth } from "@/hooks/use-auth";

export default function PLAB1New() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();

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

  // Text-to-Speech (voices, toggle, and voice selection managed by hook)
  const {
    speechEnabled, setSpeechEnabled,
    selectedVoice, setSelectedVoice,
    availableVoices,
  } = useTextToSpeech();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Session state
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);

  // smart-generated structured explanation for the current answer
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);
  const [aiExplanationLoading, setAiExplanationLoading] = useState(false);
  const aiExplanationCache = useRef<Map<string, AIExplanation>>(new Map());

  // smart-generated study tips / mnemonics specific to each question
  const [aiStudyTips, setAiStudyTips] = useState<AIStudyTips | null>(null);
  const [aiStudyTipsLoading, setAiStudyTipsLoading] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(true);
  const studyTipsCache = useRef<Map<string, AIStudyTips>>(new Map());

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

  // Per-question stopwatch (managed by hook)
  const {
    questionTimer,
    isTimerRunning, setIsTimerRunning,
    questionTimes, setQuestionTimes,
    resetQuestionTimer,
  } = useQuestionStopwatch();

  // Progress saving
  const { saveProgress } = useProgress();

  // Local analytics
  const { recommendations: weakAreaRecommendations, getWeakAreas } = useLocalAnalytics();

  // Tutor state
  const [showAITutor, setShowAITutor] = useState(false);


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
  const CORRECT_ANSWER_MILESTONE = 5;

  // Block configuration for leaderboard submission
  const [blockType, setBlockType] = useState<'block1' | 'block2' | 'block3'>('block1');
  const [isTimedSession, setIsTimedSession] = useState(false);
  const [sessionTimeLimit] = useState(0);
  const [sessionStartTime] = useState<number>(0);

  // AI Question Generation state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('intermediate');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // Translation cache
  const [translatedQuestions, setTranslatedQuestions] = useState<Record<string, any>>({});
  const [translationLoading, setTranslationLoading] = useState<Record<string, boolean>>({});
  const [questionStatsMap, setQuestionStatsMap] = useState<QuestionStatsMap>({});

  // Scoring submission function for block-based leaderboards
  const submitToBlockLeaderboard = async (sessionData: {
    correctAnswers: number;
    totalQuestions: number;
    totalTime: number;
    category: string;
    difficulty: string;
  }) => {
    try {
      const percentage = sessionData.totalQuestions > 0
        ? Math.round((sessionData.correctAnswers / sessionData.totalQuestions) * 100)
        : 0;
      await fetch('/api/leaderboard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user?.firstName ?? 'Guest',
          score: sessionData.correctAnswers,
          totalQuestions: sessionData.totalQuestions,
          percentage,
          category: sessionData.category,
          blockType,
          timeSpent: sessionData.totalTime,
          isTimedSession,
        }),
      });
    } catch (_error) {
      // leaderboard submission is best-effort
    }
  };

  // Fetch server-side question stats when a session's questions are loaded
  useEffect(() => {
    if (generatedQuestions.length === 0) return;
    const ids = generatedQuestions
      .map(q => String(q.id))
      .filter(Boolean)
      .slice(0, 200)
      .join(',');
    if (!ids) return;
    fetch(`/api/questions/stats?ids=${encodeURIComponent(ids)}`)
      .then(r => r.json())
      .then((data: { stats?: QuestionStatsMap }) => {
        if (data.stats) setQuestionStatsMap(data.stats);
      })
      .catch(() => {});
  }, [generatedQuestions]);

  // Start timer when new question is shown (only in timed practice modes)
  useEffect(() => {
    if (sessionStarted && !showExplanation && isTimedSession) {
      resetQuestionTimer();
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

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const languageVoiceMap: Record<string, string> = {
      'en': 'en-US', 'ar': 'ar-SA', 'hi': 'hi-IN', 'ur': 'ur-PK', 'bn': 'bn-IN',
      'ta': 'ta-IN', 'te': 'te-IN', 'gu': 'gu-IN', 'kn': 'kn-IN', 'ml': 'ml-IN',
      'pa': 'pa-IN', 'mr': 'mr-IN', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE',
      'it': 'it-IT', 'pt': 'pt-BR', 'ru': 'ru-RU', 'zh': 'zh-CN', 'ja': 'ja-JP', 'ko': 'ko-KR'
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

    utterance.rate = selectedLanguage === 'ar' || selectedLanguage === 'ur' ? 0.8 : 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;

    const processedText = text
      .replace(/\./g, '. ')
      .replace(/,/g, ', ')
      .replace(/:/g, ': ')
      .replace(/;/g, '; ')
      .replace(/\s+/g, ' ')
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
      const cacheKey = `${currentQuestion.id}_${selectedLanguage}`;
      const translatedQ = translatedQuestions[cacheKey];

      let scenarioText = currentQuestion.scenario || '';
      let questionText = currentQuestion.stem || currentQuestion.question || '';
      let options = Array.isArray(currentQuestion.options)
        ? currentQuestion.options
        : Object.values(currentQuestion.options || {});

      if (translateQuestions && selectedLanguage !== 'en' && translatedQ) {
        scenarioText = translatedQ.scenario || scenarioText;
        questionText = translatedQ.question || translatedQ.stem || questionText;
        if (translatedQ.options) {
          options = Array.isArray(translatedQ.options) ? translatedQ.options : Object.values(translatedQ.options);
        }
      }

      let fullText = '';

      if (scenarioText) {
        fullText += `Clinical Scenario: ${scenarioText}. `;
      }

      if (questionText) {
        fullText += `Question: ${questionText}. `;
      }

      if (options && options.length > 0) {
        const optionsText = (options as string[]).map((option: string, index: number) =>
          `Option ${String.fromCharCode(65 + index)}: ${option}`
        ).join('. ');
        fullText += `The answer options are: ${optionsText}.`;
      }

      speakText(fullText);
    }
  };

  // Simple translation function
  const translateText = (text: string) => {
    if (!isTranslationMode || selectedLanguage === 'en') return text;

    const translations: Record<string, Record<string, string>> = {
      'ar': {
        'Master PLAB 1': 'إتقان PLAB 1',
        'with Tutor': 'الموجه',
        'Authentic UK Comprehensive exam preparation': 'تحضير شامل وأصيل للامتحان البريطاني',
        'Start Practice Now': 'ابدأ الممارسة الآن',
        'Settings & Languages': 'الإعدادات واللغات',
        'Choose Your Practice Mode': 'اختر وضع الممارسة',
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
        'Master PLAB 1': 'PLAB 1 में महारत',
        'with Tutor': 'ट्यूटर के साथ',
        'Authentic UK Comprehensive exam preparation': 'प्रामाणिक UK व्यापक परीक्षा तैयारी',
        'Start Practice Now': 'अभी अभ्यास शुरू करें',
        'Settings & Languages': 'सेटिंग्स और भाषाएँ',
        'Choose Your Practice Mode': 'अपना अभ्यास मोड चुनें',
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
        'Master PLAB 1': 'PLAB 1 میں مہارت',
        'with Tutor': 'ٹیوٹر کے ساتھ',
        'Authentic UK Comprehensive exam preparation': 'مستند UK جامع امتحان کی تیاری',
        'Start Practice Now': 'ابھی پریکٹس شروع کریں',
        'Settings & Languages': 'ترتیبات اور زبانیں',
        'Choose Your Practice Mode': 'اپنا پریکٹس موڈ منتخب کریں',
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

  // Function to translate entire question object using fast instant translation
  const translateFullQuestion = async (question: any) => {
    if (!translateQuestions || selectedLanguage === 'en') return question;

    const cacheKey = `${question.id}_${selectedLanguage}`;

    if (translatedQuestions[cacheKey]) {
      return translatedQuestions[cacheKey];
    }

    if (translationLoading[cacheKey]) {
      return question;
    }

    setTranslationLoading(prev => ({ ...prev, [cacheKey]: true }));

    try {
      const response = await fetch('/api/translate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch (_error) {
      return question;
    } finally {
      setTranslationLoading(prev => ({ ...prev, [cacheKey]: false }));
    }
  };

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
    setBlockType('block1');

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          count: questionCount,
          difficulty: selectedDifficulty
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawQuestions = data.questions || [];
        const sessionQuestions = applyOptionShuffle(shuffleArray(rawQuestions));
        setGeneratedQuestions(sessionQuestions);
        if (sessionQuestions.length > 0) {
          setSessionStarted(true);
          setQuestionStartTime(Date.now());
          setIsTimedSession(false);
          setIsTimerRunning(false);
        } else {
          toast({ title: "No questions found", description: "No questions matched your selection. Try a different category.", variant: "destructive" });
        }
      } else {
        const err = await response.json().catch(() => ({}));
        toast({ title: "Could not load questions", description: (err as any).message || "Please try again.", variant: "destructive" });
      }
    } catch (_error) {
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Start timed practice session
  const startTimedPractice = async (timeInMinutes: number) => {
    clearSessionTimeout();
    setIsGeneratingQuestions(true);
    setBlockType('block2');
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          count: 100
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast({
            title: 'Generation limit reached',
            description: (err as any).message ?? 'You have generated too many question sets this hour. Please wait before starting a new session.',
            variant: 'destructive',
          });
        } else {
          toast({ title: "Could not load questions", description: (err as any).message || "Please try again.", variant: "destructive" });
        }
        setIsGeneratingQuestions(false);
        return;
      }

      const data = await response.json();
      const rawQuestions = Array.isArray(data.questions) ? data.questions : [];
      if (rawQuestions.length === 0) {
        toast({ title: "No questions found", description: "No questions matched your selection. Try a different category.", variant: "destructive" });
        return;
      }

      const questions = applyOptionShuffle(shuffleArray(rawQuestions));
      setGeneratedQuestions(questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
      setSessionStarted(true);
      setIsTimedSession(true);
      resetQuestionTimer();
      setIsTimerRunning(true);

      sessionTimeoutRef.current = setTimeout(() => {
        sessionTimeoutRef.current = null;
        setIsTimerRunning(false);
        setSessionComplete(true);
      }, timeInMinutes * 60 * 1000);

    } catch (_error) {
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Start authentic PLAB 1 timed practice session (1 minute per question)
  const startAuthenticTimedPractice = async (questionCount: number) => {
    clearSessionTimeout();
    setIsGeneratingQuestions(true);
    setBlockType('block2');
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          count: questionCount
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast({
            title: 'Generation limit reached',
            description: (err as any).message ?? 'You have generated too many question sets this hour. Please wait before starting a new session.',
            variant: 'destructive',
          });
        } else {
          toast({ title: "Could not load questions", description: (err as any).message || "Please try again.", variant: "destructive" });
        }
        setIsGeneratingQuestions(false);
        return;
      }

      const data = await response.json();
      const rawQuestions = Array.isArray(data.questions) ? data.questions : [];
      if (rawQuestions.length === 0) {
        toast({ title: "No questions found", description: "No questions matched your selection. Try a different category.", variant: "destructive" });
        return;
      }

      const exactQuestions = applyOptionShuffle(shuffleArray(rawQuestions)).slice(0, questionCount);
      setGeneratedQuestions(exactQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
      setSessionStarted(true);
      setIsTimedSession(true);
      resetQuestionTimer();
      setIsTimerRunning(true);

      const totalTimeMs = exactQuestions.length * 60 * 1000;
      sessionTimeoutRef.current = setTimeout(() => {
        sessionTimeoutRef.current = null;
        setIsTimerRunning(false);
        setSessionComplete(true);
      }, totalTimeMs);

    } catch (_error) {
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Start unlimited practice session
  const startUnlimitedPractice = async () => {
    clearSessionTimeout();
    setIsGeneratingQuestions(true);
    setBlockType('block3');
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          count: 20
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast({
            title: 'Generation limit reached',
            description: (err as any).message ?? 'You have generated too many question sets this hour. Please wait before starting a new session.',
            variant: 'destructive',
          });
        } else {
          toast({ title: "Could not load questions", description: (err as any).message || "Please try again.", variant: "destructive" });
        }
        setIsGeneratingQuestions(false);
        return;
      }

      const data = await response.json();
      const rawQuestions = Array.isArray(data.questions) ? data.questions : [];
      if (rawQuestions.length === 0) {
        toast({ title: "No questions found", description: "No questions matched your selection. Try a different category.", variant: "destructive" });
        return;
      }

      setGeneratedQuestions(applyOptionShuffle(shuffleArray(rawQuestions)));
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
      setSessionStarted(true);
      setIsTimedSession(false);
      setIsTimerRunning(false);

    } catch (_error) {
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Start adaptive practice — fetches a larger pool then uses weighted selection
  const startAdaptivePractice = async (questionCount: number, categoryOverride?: string) => {
    const effectiveCategory = categoryOverride ?? selectedCategory;
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
    setBlockType('block1');

    try {
      const fetchCount = Math.min(Math.max(questionCount * 4, 100), 300);
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: effectiveCategory,
          count: fetchCount,
          difficulty: selectedDifficulty,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast({
            title: 'Generation limit reached',
            description: (err as any).message ?? 'You have generated too many question sets this hour. Please wait before starting a new session.',
            variant: 'destructive',
          });
        } else {
          toast({ title: "Could not load questions", description: (err as any).message || "Please try again.", variant: "destructive" });
        }
        setIsGeneratingQuestions(false);
        return;
      }

      const data = await response.json();
      const pool = data.questions || [];
      if (pool.length === 0) {
        toast({ title: "No questions found", description: "No questions matched your selection. Try a different category.", variant: "destructive" });
        return;
      }

      const selected = selectAdaptiveQuestionsWithStats(pool, questionCount, questionStatsMap);
      const sessionQuestions = applyOptionShuffle(selected);
      setGeneratedQuestions(sessionQuestions);
      if (sessionQuestions.length > 0) {
        setSessionStarted(true);
        setQuestionStartTime(Date.now());
        setIsTimedSession(false);
        setIsTimerRunning(false);
      }
    } catch (_error) {
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Auto-start adaptive session when arriving with ?mode=adaptive&count=N (from Smart tab)
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (autoStartedRef.current) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const countRaw = params.get("count");
    const category = params.get("category");
    // Always preselect the topic when ?category= is present, even without auto-start.
    if (category) setSelectedCategory(category);
    if (mode !== "adaptive") {
      // Clean the URL so refreshes don't re-trigger; keep the selected state.
      if (category) window.history.replaceState({}, "", window.location.pathname);
      return;
    }
    autoStartedRef.current = true;
    const count = Math.max(1, Math.min(50, parseInt(countRaw || "10", 10) || 10));
    const t = setTimeout(() => {
      startAdaptivePractice(count, category ?? undefined);
      window.history.replaceState({}, "", window.location.pathname);
    }, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start incorrect-only mode — filters to questions previously answered wrong
  const startIncorrectOnlyPractice = async (questionCount: number) => {
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
    setBlockType('block1');

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          count: 300,
          difficulty: selectedDifficulty,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast({
            title: 'Generation limit reached',
            description: (err as any).message ?? 'You have generated too many question sets this hour. Please wait before starting a new session.',
            variant: 'destructive',
          });
        } else {
          toast({ title: "Could not load questions", description: (err as any).message || "Please try again.", variant: "destructive" });
        }
        setIsGeneratingQuestions(false);
        return;
      }

      const data = await response.json();
      const pool = data.questions || [];
      const incorrectQuestions = filterIncorrectOnlyQuestions(pool);

      if (incorrectQuestions.length === 0) {
        toast({
          title: "No incorrect questions yet",
          description: "You haven't answered any questions incorrectly in this category. Try Practice mode first.",
          variant: "destructive",
        });
        return;
      }

      const selected = shuffleArray(incorrectQuestions).slice(0, questionCount);
      const sessionQuestions = applyOptionShuffle(selected);
      setGeneratedQuestions(sessionQuestions);
      if (sessionQuestions.length > 0) {
        setSessionStarted(true);
        setQuestionStartTime(Date.now());
        setIsTimedSession(false);
        setIsTimerRunning(false);
      }
    } catch (_error) {
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Navigate to the Spot Diagnosis gallery page
  const startSpotDiagnosis = () => {
    navigate('/spot-diagnosis');
  };

  // Get current question
  const currentQuestion = generatedQuestions[currentQuestionIndex];

  // Effect to translate current question when language changes
  useEffect(() => {
    if (currentQuestion && translateQuestions && selectedLanguage !== 'en') {
      translateFullQuestion(currentQuestion);
    }
  }, [currentQuestion, translateQuestions, selectedLanguage]);

  // Proactively fetch question-specific study tips as soon as a new question loads
  useEffect(() => {
    if (currentQuestion && sessionStarted) {
      void fetchStudyTips(currentQuestion);
    }
  }, [currentQuestionIndex, sessionStarted]);

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (!showExplanation) {
      setSelectedAnswer(answer);
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (selectedAnswer && !showExplanation) {
      const timeForQuestion = Date.now() - questionStartTime;
      const q = generatedQuestions[currentQuestionIndex];
      const correctIdx = q?.correctAnswer ?? q?.correct_answer ?? q?.answer;
      const isCorrect = parseInt(selectedAnswer) === (typeof correctIdx === 'string' ? correctIdx.charCodeAt(0) - 65 : correctIdx);

      setQuestionTimes(prev => [...prev, timeForQuestion]);
      setUserAnswers(prev => [...prev, selectedAnswer]);
      setTimeSpent(prev => prev + timeForQuestion);

      setSessionResults(prev => [...prev, {
        correct: isCorrect,
        timeSpent: timeForQuestion,
        questionId: q?.id || `q_${currentQuestionIndex}`
      }]);

      if (q?.id) {
        recordQuestionAttempt(String(q.id), isCorrect);
        addToRecentHistory(String(q.id));
        void fetch('/api/questions/attempt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: String(q.id),
            correct: isCorrect,
            selectedOptionIndex: parseInt(selectedAnswer),
            timeSpent: timeForQuestion,
          }),
        }).catch(() => {});
      }

      const newStreak = isCorrect ? currentStreak + 1 : 0;
      setCurrentStreak(newStreak);

      if (isCorrect) {
        const pointsEarned = calculatePoints(true, timeForQuestion, newStreak, selectedDifficulty);
        setSessionPoints(prev => prev + pointsEarned);
        setLastPointsEarned(pointsEarned);
        setShowPointsAnimation(true);
        setTimeout(() => setShowPointsAnimation(false), 1500);

        if (newStreak === 3) {
          toast({ title: "🔥 Streak Started!", description: "3 correct in a row! +5 bonus points" });
        } else if (newStreak === 5) {
          toast({ title: "💥 On Fire!", description: "5 correct in a row! +10 bonus points" });
        } else if (newStreak === 10) {
          toast({ title: "🚀 Unstoppable!", description: "10 correct in a row! +25 bonus points" });
        } else if (newStreak === 20) {
          toast({ title: "👑 Legendary Streak!", description: "20 correct in a row! +50 bonus points" });
        }

        if (timeForQuestion <= 30000) {
          toast({ title: "⚡ Speed Bonus!", description: "+5 points for quick answer" });
        }
      }

      setShowExplanation(true);
      setIsTimerRunning(false);

      void fetchAIExplanation(q, parseInt(selectedAnswer));
    }
  };

  // Generate a structured per-answer explanation using the backend AI endpoint
  const fetchAIExplanation = async (question: any, selectedIdx: number) => {
    if (!question) return;

    const qid = String(question.id ?? `idx_${currentQuestionIndex}`);
    const cached = aiExplanationCache.current.get(qid);
    if (cached) {
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

    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const buildLocalFallback = (stored?: string): AIExplanation => {
      const correctText = optionsArr[correctIdx] ?? '';
      return {
        correctRationale: stored && stored.length > 30
          ? stored
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
        keyLearningPoint: question.mnemonic || 'Anchor your reasoning in the patient demographics, symptoms, signs and investigations, then match to the most appropriate UK guideline step.',
        source: 'fallback',
      };
    };

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
      if (resp.status === 429) {
        const data = await resp.json().catch(() => ({}));
        toast({
          title: 'Slow down a little',
          description: (data as any).message ?? 'Too many requests. Please wait.',
          variant: 'destructive',
        });
        setAiExplanationLoading(false);
        return;
      }
      if (!resp.ok) {
        const fallback = buildLocalFallback(storedExplanation);
        aiExplanationCache.current.set(qid, fallback);
        setAiExplanation(fallback);
        return;
      }
      const data: AIExplanation = await resp.json();
      aiExplanationCache.current.set(qid, data);
      setAiExplanation(data);
    } catch (err) {
      console.error('Failed to fetch explanation:', err);
      const stored = typeof question.explanation === 'string' ? question.explanation : undefined;
      const fallback = buildLocalFallback(stored);
      aiExplanationCache.current.set(qid, fallback);
      setAiExplanation(fallback);
    } finally {
      setAiExplanationLoading(false);
    }
  };

  // Fetch question-specific mnemonics from the AI study-tips endpoint (cached per question id)
  const fetchStudyTips = async (question: any) => {
    if (!question) return;

    const qid = String(question.id ?? `idx_${currentQuestionIndex}`);
    const cached = studyTipsCache.current.get(qid);
    if (cached) { setAiStudyTips(cached); return; }

    const correctIdxRaw = question.correctAnswer ?? question.correct_answer ?? question.answer;
    const correctIdx = typeof correctIdxRaw === 'string'
      ? (/^[A-E]$/.test(correctIdxRaw) ? correctIdxRaw.charCodeAt(0) - 65 : parseInt(correctIdxRaw) || 0)
      : (typeof correctIdxRaw === 'number' ? correctIdxRaw : 0);

    const optionsArr: string[] = Array.isArray(question.options)
      ? question.options.map((o: any) => typeof o === 'string' ? o : (o?.text ?? ''))
      : Object.values(question.options || {}).map((o: any) => typeof o === 'string' ? o : (o?.text ?? ''));

    const correctOption = optionsArr[correctIdx] ?? '';
    if (!correctOption) return;

    setAiStudyTipsLoading(true);
    setAiStudyTips(null);
    try {
      const resp = await fetch('/api/study-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question || question.question_scenario || '',
          category: question.category || question.topic,
          correctOption,
          options: optionsArr,
          questionId: qid,
        }),
      });
      if (resp.status === 429) {
        const data = await resp.json().catch(() => ({}));
        toast({
          title: 'Slow down a little',
          description: (data as any).message ?? 'Too many requests. Please wait.',
          variant: 'destructive',
        });
        setAiStudyTipsLoading(false);
        return;
      }
      if (!resp.ok) { setAiStudyTipsLoading(false); return; }
      const data: AIStudyTips = await resp.json();
      studyTipsCache.current.set(qid, data);
      setAiStudyTips(data);
    } catch (err) {
      console.error('Failed to fetch study tips:', err);
      setAiStudyTips({ mnemonics: [], tips: [], source: 'error' });
    } finally {
      setAiStudyTipsLoading(false);
    }
  };

  // Handle next question navigation
  const handleNextQuestion = () => {
    const correctCount = sessionResults.filter(r => r.correct).length;
    const nextMilestone = Math.floor(correctCount / CORRECT_ANSWER_MILESTONE) * CORRECT_ANSWER_MILESTONE;

    if (correctCount > 0 && correctCount >= CORRECT_ANSWER_MILESTONE && nextMilestone > lastMilestone) {
      setLastMilestone(nextMilestone);
      setShowPauseModal(true);
      return;
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
      setAiStudyTips(null);
      setAiStudyTipsLoading(false);
      setQuestionStartTime(Date.now());
      if (isTimedSession) {
        resetQuestionTimer();
        setIsTimerRunning(true);
      }
    } else {
      clearSessionTimeout();
      const totalTime = questionTimes.reduce((sum, time) => sum + time, 0);
      const correctAnswers = userAnswers.filter((answer, index) =>
        parseInt(answer) === generatedQuestions[index]?.correctAnswer
      ).length;

      submitToBlockLeaderboard({
        correctAnswers,
        totalQuestions: generatedQuestions.length,
        totalTime,
        category: selectedCategory,
        difficulty: selectedDifficulty
      });

      const accuracy = generatedQuestions.length > 0
        ? (correctAnswers / generatedQuestions.length) * 100
        : 0;

      try {
        await apiRequest('POST', '/api/gamification/award-points', {
          userId: user?.id ?? 'guest',
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
      } catch (_error) {
        // points saving is best-effort
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

    const correctAnswers = sessionResults.filter(r => r.correct).length;
    const accuracy = sessionResults.length > 0
      ? (correctAnswers / sessionResults.length) * 100
      : 0;

    try {
      await apiRequest('POST', '/api/gamification/award-points', {
        userId: user?.id ?? 'guest',
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
    } catch (_error) {
      // points saving is best-effort
    }

    setSessionComplete(true);
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer("");
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    }
  };

  // If no session started, show the landing page
  if (!sessionStarted && !isGeneratingQuestions) {
    return (
      <QuizErrorBoundary context="session setup" onHome={() => setSessionStarted(false)}>
        <SessionSetup
          heroImageLoaded={heroImageLoaded}
          setHeroImageLoaded={setHeroImageLoaded}
          isTranslationMode={isTranslationMode}
          setIsTranslationMode={setIsTranslationMode}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          speechEnabled={speechEnabled}
          setSpeechEnabled={setSpeechEnabled}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          availableVoices={availableVoices}
          isSpeaking={isSpeaking}
          stopSpeaking={stopSpeaking}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          isGeneratingQuestions={isGeneratingQuestions}
          translateText={translateText}
          onStartPractice={startPractice}
          onStartTimedPractice={startTimedPractice}
          onStartUnlimitedPractice={startUnlimitedPractice}
          onStartAuthenticTimedPractice={startAuthenticTimedPractice}
          onStartAdaptivePractice={startAdaptivePractice}
          onStartIncorrectOnlyPractice={startIncorrectOnlyPractice}
          onStartSpotDiagnosis={startSpotDiagnosis}
          userName={user?.firstName ?? undefined}
          weakAreas={weakAreaRecommendations}
        />
      </QuizErrorBoundary>
    );
  }

  // Loading state
  if (isGeneratingQuestions) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pb-24">
        <Card className="w-full max-w-md mb-16">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Medical Questions</h3>
            <p className="text-gray-600">Creating personalized questions for {selectedCategory} practice...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Session complete
  if (sessionComplete) {
    const correctCount = sessionResults.filter(r => r.correct).length;
    const totalAnswered = sessionResults.length;
    const percentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const avgTimePerQuestion = totalAnswered > 0
      ? Math.round(sessionResults.reduce((sum, r) => sum + r.timeSpent, 0) / totalAnswered / 1000)
      : 0;
    const topicMap = new Map<string, { correct: number; total: number }>();
    sessionResults.forEach((r, i) => {
      const q = generatedQuestions[i];
      const topic = q?.topic || q?.category || 'General';
      const entry = topicMap.get(topic) || { correct: 0, total: 0 };
      entry.total++;
      if (r.correct) entry.correct++;
      topicMap.set(topic, entry);
    });
    const topicBreakdown = Array.from(topicMap.entries()).map(([topic, stats]) => ({ topic, ...stats }));

    return (
      <QuizErrorBoundary context="results" onReset={() => setSessionStarted(false)}>
        <SessionComplete
          totalQuestions={totalAnswered}
          correctAnswers={correctCount}
          percentage={percentage}
          avgTimePerQuestion={avgTimePerQuestion}
          timeSpent={timeSpent}
          selectedCategory={selectedCategory}
          topicBreakdown={topicBreakdown}
          onRestart={() => window.location.reload()}
          onHome={() => setSessionStarted(false)}
        />
      </QuizErrorBoundary>
    );
  }

  // No question fallback
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            Question data is missing. This can happen if generation was interrupted.
          </p>
          <Button onClick={() => setSessionStarted(false)}>Return to setup</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto mb-16">

        <QuizErrorBoundary context="gamification">
          <GamificationBar
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={generatedQuestions.length}
            sessionPoints={sessionPoints}
            showPointsAnimation={showPointsAnimation}
            lastPointsEarned={lastPointsEarned}
            currentStreak={currentStreak}
            timeSpent={timeSpent}
            isTimedSession={isTimedSession}
            questionTimer={questionTimer}
            isTimerRunning={isTimerRunning}
            formatTime={formatTime}
          />
        </QuizErrorBoundary>

        <QuizErrorBoundary
          context="question"
          onReset={() => {
            setSelectedAnswer("");
            setShowExplanation(false);
          }}
          onHome={() => setSessionStarted(false)}
        >
          <QuizQuestion
            currentQuestion={currentQuestion}
            selectedAnswer={selectedAnswer}
            showExplanation={showExplanation}
            translateQuestions={translateQuestions}
            setTranslateQuestions={setTranslateQuestions}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            translatedQuestions={translatedQuestions}
            speechEnabled={speechEnabled}
            setSpeechEnabled={setSpeechEnabled}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            availableVoices={availableVoices}
            isSpeaking={isSpeaking}
            speakText={speakText}
            stopSpeaking={stopSpeaking}
            speakCurrentQuestion={speakCurrentQuestion}
            onAnswerSelect={handleAnswerSelect}
          />
        </QuizErrorBoundary>

        {showExplanation && (
          <>
            <QuizErrorBoundary
              context="explanation"
              onReset={() => setAiExplanation(null)}
            >
              <ExplanationPanel
                currentQuestion={currentQuestion}
                aiExplanation={aiExplanation}
                aiExplanationLoading={aiExplanationLoading}
                selectedAnswer={selectedAnswer}
                isCorrect={(() => {
                  const correctIdx = currentQuestion?.correctAnswer ?? currentQuestion?.correct_answer ?? currentQuestion?.answer;
                  return parseInt(selectedAnswer) === (typeof correctIdx === 'string' ? correctIdx.charCodeAt(0) - 65 : correctIdx);
                })()}
                questionStats={questionStatsMap[String(currentQuestion?.id)]}
              />
            </QuizErrorBoundary>

            <QuizErrorBoundary
              context="study tips"
              onReset={() => setAiStudyTips(null)}
            >
              <StudyTipsPanel
                currentQuestion={currentQuestion}
                aiStudyTips={aiStudyTips}
                aiStudyTipsLoading={aiStudyTipsLoading}
                tipsOpen={tipsOpen}
                setTipsOpen={setTipsOpen}
              />
            </QuizErrorBoundary>
          </>
        )}
      </div>

      {sessionStarted && (
        <SessionNavBar
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={generatedQuestions.length}
          showExplanation={showExplanation}
          selectedAnswer={selectedAnswer}
          isTimedSession={isTimedSession}
          questionTimer={questionTimer}
          formatTime={formatTime}
          onPrevious={handlePreviousQuestion}
          onSubmit={handleSubmitAnswer}
          onNext={handleNextQuestion}
        />
      )}

      {/* Tutor Floating Button */}
      {sessionStarted && (
        <Button
          onClick={() => setShowAITutor(true)}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-200/60 z-50 flex items-center justify-center border-none"
          title="Ask Tutor"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* AI Flashcard Generator Floating Button */}
      {showExplanation && selectedAnswer && currentQuestion && (
        <div className="fixed bottom-40 right-4 z-50">
          <FlashcardsFromQuestion
            question={currentQuestion}
            selectedAnswerIndex={selectedAnswer}
            isCorrect={(() => {
              const correctIdx = currentQuestion?.correctAnswer ?? currentQuestion?.correct_answer ?? currentQuestion?.answer;
              return parseInt(selectedAnswer) === (typeof correctIdx === 'string' ? correctIdx.charCodeAt(0) - 65 : correctIdx);
            })()}
            floating
          />
        </div>
      )}

      {/* Tutor Modal */}
      <Tutor
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
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Great Progress!</h2>
              <p className="text-teal-50">
                You've got {sessionResults.filter(r => r.correct).length} questions correct!
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-teal-50/70 border border-teal-100 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-semibold text-teal-700">
                    {sessionResults.filter(r => r.correct).length}
                  </div>
                  <div className="text-xs text-teal-600 font-medium mt-0.5">Correct</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-semibold text-slate-800">
                    {sessionResults.length}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Answered</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Questions Remaining</span>
                  <span className="font-semibold text-slate-800">
                    {generatedQuestions.length - currentQuestionIndex - 1}
                  </span>
                </div>
              </div>

              <p className="text-center text-slate-600 text-sm">
                Would you like to take a break or continue practicing?
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleContinuePractice}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-2xl h-11 font-semibold shadow-md shadow-teal-200/50 border-none"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue Practicing
                </Button>
                <Button
                  onClick={handlePauseSession}
                  variant="outline"
                  className="w-full rounded-2xl h-11 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Take a Break & See Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NICE NG136 overlay removed — replaced by AI Flashcard Generator */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-gray-900">NICE NG136 + PLAB MCQ Format</h2>
              </div>
              <Button
                onClick={() => {}}
                variant="outline"
                size="sm"
                className="hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-8">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Clinical Scenario Framework
                </h3>
                <div className="space-y-4">
                  <div className="bg-white border border-teal-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">1. Patient Presentation</h4>
                    <p className="text-sm text-blue-700">Age, gender, chief complaint, duration of symptoms, relevant medical history</p>
                  </div>
                  <div className="bg-white border border-teal-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">2. Clinical Findings</h4>
                    <p className="text-sm text-blue-700">Physical examination findings, vital signs, initial observations</p>
                  </div>
                  <div className="bg-white border border-teal-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">3. Investigation Results</h4>
                    <p className="text-sm text-blue-700">Laboratory values, imaging findings, diagnostic test results</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
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

              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center gap-2">
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
                      {['A', 'B', 'C', 'D', 'E'].map(letter => (
                        <div key={letter} className="w-6 h-6 rounded-full border-2 border-black bg-white text-black flex items-center justify-center font-semibold text-xs">
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">Clinical Reasoning</h4>
                    <p className="text-sm text-purple-700">Evidence-based explanations, guideline references, memory aids</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center gap-2">
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
