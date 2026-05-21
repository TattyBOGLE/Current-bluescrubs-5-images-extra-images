import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock, ArrowRight, ArrowLeft, Award, CheckCircle, ExternalLink,
  BookOpen, Target, Brain, Lightbulb, X, MessageCircle, Flame
} from "lucide-react";
import plab1BgImage from '@assets/458CC7DF-D6D7-4BAD-85F5-99EEBD33ECD9_1750366142331.png';
import { apiRequest } from "@/lib/queryClient";
import { AITutor } from "@/components/ai-tutor";
import { useToast } from "@/hooks/use-toast";
import { formatTime, calculatePoints, type AIExplanation, type AIStudyTips } from "@/lib/quiz-utils";
import { GamificationBar } from "@/components/plab1/GamificationBar";
import { QuizQuestion } from "@/components/plab1/QuizQuestion";
import { ExplanationPanel } from "@/components/plab1/ExplanationPanel";
import { FlashcardsFromQuestion } from "@/components/plab1/FlashcardsFromQuestion";
import { StudyTipsPanel } from "@/components/plab1/StudyTipsPanel";
import { SessionNavBar } from "@/components/plab1/SessionNavBar";
import { SessionSetup } from "@/components/plab1/SessionSetup";
import { SessionComplete } from "@/components/plab1/SessionComplete";

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
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);
  const [aiExplanationLoading, setAiExplanationLoading] = useState(false);
  const aiExplanationCache = useRef<Map<string, AIExplanation>>(new Map());

  // AI-generated study tips / mnemonics specific to each question
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

  // Stopwatch and timing state
  const [questionTimer, setQuestionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);

  // AI Tutor state
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

  // Scoring submission function for block-based leaderboards
  const submitToBlockLeaderboard = async (sessionData: {
    correctAnswers: number;
    totalQuestions: number;
    totalTime: number;
    category: string;
    difficulty: string;
  }) => {
    try {
      if (blockType === 'block1') {
        // Block 1 leaderboard submission
      } else if (blockType === 'block2' && isTimedSession) {
        // Block 2 leaderboard submission
      } else if (blockType === 'block3') {
        // Block 3 leaderboard submission
      }
    } catch (error) {
      // leaderboard submission is best-effort
    }
  };

  // Initialize available voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const qualityVoices = voices.filter(voice =>
          !voice.name.toLowerCase().includes('robot') &&
          !voice.name.toLowerCase().includes('synthetic') &&
          !voice.name.toLowerCase().includes('compact')
        );

        const englishVoices = qualityVoices.filter(voice => voice.lang.startsWith('en'));
        const otherLanguageVoices = qualityVoices.filter(voice =>
          !voice.lang.startsWith('en') &&
          ['ar', 'hi', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'zh', 'ja', 'ko'].some(lang =>
            voice.lang.startsWith(lang)
          )
        );

        const allVoices = [...englishVoices, ...otherLanguageVoices].slice(0, 15);
        setAvailableVoices(allVoices);

        if (allVoices.length > 0 && !selectedVoice) {
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
        'with AI': 'مع الذكاء الاصطناعي',
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
        'with AI': 'AI के साथ',
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
        'with AI': 'AI کے ساتھ',
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
        toast({ title: "Could not load questions", description: (err as any).message || "Please try again.", variant: "destructive" });
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
        toast({ title: "Could not load questions", description: (err as any).message || "Please try again.", variant: "destructive" });
        return;
      }

      const data = await response.json();
      const questions = Array.isArray(data.questions) ? data.questions : [];
      if (questions.length === 0) {
        toast({ title: "No questions found", description: "No questions matched your selection. Try a different category.", variant: "destructive" });
        return;
      }

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
        toast({ title: "Could not load questions", description: (err as any).message || "Please try again.", variant: "destructive" });
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
      setIsTimerRunning(false);

    } catch (_error) {
      toast({ title: "Connection error", description: "Could not reach the server. Please refresh and try again.", variant: "destructive" });
    } finally {
      setIsGeneratingQuestions(false);
    }
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
      if (!resp.ok) {
        const fallback = buildLocalFallback(storedExplanation);
        aiExplanationCache.current.set(qid, fallback);
        setAiExplanation(fallback);
        return;
      }
      const data: AIExplanation = await resp.json();
      aiExplanationCache.current.set(qid, data);
      setAiExplanation(data);
    } catch (_err) {
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
      if (!resp.ok) return;
      const data: AIStudyTips = await resp.json();
      studyTipsCache.current.set(qid, data);
      setAiStudyTips(data);
    } catch (_err) {
      // study tips are best-effort
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
        setQuestionTimer(0);
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
      />
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
    return (
      <SessionComplete
        totalQuestions={generatedQuestions.length}
        timeSpent={timeSpent}
        selectedCategory={selectedCategory}
        onRestart={() => window.location.reload()}
        onHome={() => setSessionStarted(false)}
      />
    );
  }

  // No question fallback
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

        {showExplanation && (
          <>
            <ExplanationPanel
              currentQuestion={currentQuestion}
              aiExplanation={aiExplanation}
              aiExplanationLoading={aiExplanationLoading}
              selectedAnswer={selectedAnswer}
              isCorrect={(() => {
                const correctIdx = currentQuestion?.correctAnswer ?? currentQuestion?.correct_answer ?? currentQuestion?.answer;
                return parseInt(selectedAnswer) === (typeof correctIdx === 'string' ? correctIdx.charCodeAt(0) - 65 : correctIdx);
              })()}
            />

            <StudyTipsPanel
              currentQuestion={currentQuestion}
              aiStudyTips={aiStudyTips}
              aiStudyTipsLoading={aiStudyTipsLoading}
              tipsOpen={tipsOpen}
              setTipsOpen={setTipsOpen}
            />
          </>
        )}
      </div>

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

      {/* AI Tutor Floating Button */}
      {sessionStarted && (
        <Button
          onClick={() => setShowAITutor(true)}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50 flex items-center justify-center"
          title="Ask AI Tutor"
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
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Great Progress!</h2>
              <p className="text-green-100">
                You've got {sessionResults.filter(r => r.correct).length} questions correct!
              </p>
            </div>

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

      {/* NICE NG136 overlay removed — replaced by AI Flashcard Generator */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">NICE NG136 + PLAB MCQ Format</h2>
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
