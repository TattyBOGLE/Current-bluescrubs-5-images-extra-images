import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, CheckCircle, XCircle, 
  Brain, Clock, Award, TrendingUp, Settings, Shuffle, BookOpen,
  VideoIcon, Image as ImageIcon, Mic, Speaker, Languages, Globe
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { HIGH_YIELD_MEDICAL_FLASHCARDS, getRandomFlashcards, type Flashcard } from "@shared/high-yield-flashcards";

export default function InteractiveFlashcards() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState([1]);
  
  // Statistics
  const [stats, setStats] = useState({
    studied: 0,
    correct: 0,
    incorrect: 0,
    streak: 0
  });
  
  // High-yield learning features
  const [cardPerformance, setCardPerformance] = useState<Record<string, { 
    attempts: number, 
    correct: number, 
    lastIncorrect: Date | null 
  }>>({});
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [helpContent, setHelpContent] = useState<{
    title: string;
    content: string[];
    mnemonics: string[];
  } | null>(null);
  
  // Language translation features
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default to Spanish
  const [translatedContent, setTranslatedContent] = useState<Record<string, {
    frontText: string;
    backText: string;
    explanation: string;
    keyPoints: string[];
    mnemonics: string[];
  }>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  // Available categories - PLAB 1 Official Structure
  const categories = [
    { value: 'all', label: 'All PLAB Specialties' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Surgery', label: 'Surgery' },
    { value: 'Obstetrics & Gynaecology', label: 'Obstetrics & Gynaecology' },
    { value: 'Paediatrics', label: 'Paediatrics' },
    { value: 'Psychiatry', label: 'Psychiatry' },
    { value: 'ENT, Ophthalmology, and Orthopaedics', label: 'ENT, Ophthalmology & Orthopaedics' },
    { value: 'Medical ethics, law, and professionalism', label: 'Medical Ethics, Law & Professionalism' },
    { value: 'Emergency care', label: 'Emergency Care' },
    { value: 'Prescribing and drug interactions', label: 'Prescribing & Drug Interactions' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  // Generate flashcards dynamically
  const filteredCards = getRandomFlashcards(20).filter((card: Flashcard) => {
    const categoryMatch = selectedCategory === 'all' || card.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || card.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const currentCard = filteredCards[currentCardIndex];

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  // Text-to-speech function
  const speakText = (text: string) => {
    if (!speechEnabled || !speechSynthRef.current) return;
    
    // Cancel any ongoing speech
    speechSynthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed[0];
    utterance.volume = volume[0] / 100;
    utterance.pitch = 1;
    
    // Use a medical/educational voice if available
    const voices = speechSynthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('English') && (voice.name.includes('UK') || voice.name.includes('British'))
    ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthRef.current.speak(utterance);
  };

  // Auto-read content when card changes or flips
  useEffect(() => {
    if (autoPlay && currentCard) {
      const textToRead = showBack 
        ? `${currentCard.back.text}. ${currentCard.back.explanation}`
        : currentCard.front.text;
      
      setTimeout(() => speakText(textToRead), 500);
    }
  }, [currentCardIndex, showBack, autoPlay, currentCard]);

  // Handle media playback
  const playAudio = () => {
    const audioUrl = showBack ? currentCard?.back.audio : currentCard?.front.audio;
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.volume = volume[0] / 100;
      audioRef.current.playbackRate = playbackSpeed[0];
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playVideo = () => {
    const videoUrl = showBack ? currentCard?.back.video : currentCard?.front.video;
    if (videoUrl && videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current.volume = volume[0] / 100;
      videoRef.current.playbackRate = playbackSpeed[0];
      videoRef.current.play();
    }
  };

  // Navigation
  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
    setShowBack(false);
  };

  const previousCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    setShowBack(false);
  };

  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setCurrentCardIndex(0);
    setShowBack(false);
  };

  // Enhanced answer handling with high-yield learning features
  const handleAnswer = (correct: boolean) => {
    const cardId = currentCard.id;
    
    // Update statistics
    setStats(prev => ({
      studied: prev.studied + 1,
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (!correct ? 1 : 0),
      streak: correct ? prev.streak + 1 : 0
    }));
    
    // Track card performance
    setCardPerformance(prev => {
      const current = prev[cardId] || { attempts: 0, correct: 0, lastIncorrect: null };
      const updated = {
        attempts: current.attempts + 1,
        correct: current.correct + (correct ? 1 : 0),
        lastIncorrect: correct ? current.lastIncorrect : new Date()
      };
      
      // Show help popup for high-yield cards that are answered incorrectly multiple times
      if (!correct && current.attempts >= 1 && currentCard.highYield) {
        showHighYieldHelp();
      }
      
      return { ...prev, [cardId]: updated };
    });
    
    setTimeout(nextCard, 1000);
  };
  
  // Show high-yield help popup for difficult cards
  const showHighYieldHelp = () => {
    setHelpContent({
      title: `High-Yield Learning Aid: ${currentCard.category}`,
      content: [
        `🎯 This is a HIGH-YIELD topic frequently tested in PLAB 1`,
        `📚 Focus Area: ${currentCard.subcategory}`,
        `⚡ Clinical Relevance: ${currentCard.clinicalRelevance}`,
        ...currentCard.back.keyPoints.map(point => `• ${point}`)
      ],
      mnemonics: currentCard.back.mnemonics || []
    });
    setShowHelpPopup(true);
  };

  // Translation functionality using browser's built-in translation API or Google Translate
  const translateCurrentCard = async () => {
    if (!translationEnabled || isTranslating) return;
    
    setIsTranslating(true);
    
    try {
      const textsToTranslate = [
        currentCard.front.text,
        currentCard.back.text,
        currentCard.back.explanation,
        ...currentCard.back.keyPoints,
        ...(currentCard.back.mnemonics || [])
      ];
      
      const translations = await Promise.all(
        textsToTranslate.map(text => translateText(text, targetLanguage))
      );
      
      const cardKey = `${currentCard.id}_${targetLanguage}`;
      setTranslatedContent(prev => ({
        ...prev,
        [cardKey]: {
          frontText: translations[0],
          backText: translations[1],
          explanation: translations[2],
          keyPoints: translations.slice(3, 3 + currentCard.back.keyPoints.length),
          mnemonics: translations.slice(3 + currentCard.back.keyPoints.length)
        }
      }));
      
    } catch (error) {
      console.error('Translation failed:', error);
      // Fallback to basic character replacement for demonstration
      const cardKey = `${currentCard.id}_${targetLanguage}`;
      setTranslatedContent(prev => ({
        ...prev,
        [cardKey]: {
          frontText: `[${getLanguageName(targetLanguage)}] ${currentCard.front.text}`,
          backText: `[${getLanguageName(targetLanguage)}] ${currentCard.back.text}`,
          explanation: `[${getLanguageName(targetLanguage)}] ${currentCard.back.explanation}`,
          keyPoints: currentCard.back.keyPoints.map(point => `[${getLanguageName(targetLanguage)}] ${point}`),
          mnemonics: (currentCard.back.mnemonics || []).map(mnemonic => `[${getLanguageName(targetLanguage)}] ${mnemonic}`)
        }
      }));
    }
    
    setIsTranslating(false);
  };

  // Simple translation function (in production, this would use Google Translate API)
  const translateText = async (text: string, targetLang: string): Promise<string> => {
    // This is a placeholder - in production you would use Google Translate API
    // For demonstration, we'll return the text with language indicator
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`[${getLanguageName(targetLang)}] ${text}`);
      }, 500);
    });
  };

  // Get language name for display
  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      'ar': 'Arabic',
      'zh': 'Chinese',
      'fr': 'French',
      'de': 'German',
      'hi': 'Hindi',
      'it': 'Italian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'es': 'Spanish',
      'ur': 'Urdu'
    };
    return languages[code] || code;
  };

  // Get translated content for current card
  const getDisplayContent = () => {
    const cardKey = `${currentCard.id}_${targetLanguage}`;
    const translated = translatedContent[cardKey];
    
    if (translationEnabled && translated) {
      return {
        frontText: translated.frontText,
        backText: translated.backText,
        explanation: translated.explanation,
        keyPoints: translated.keyPoints,
        mnemonics: translated.mnemonics
      };
    }
    
    return {
      frontText: currentCard.front.text,
      backText: currentCard.back.text,
      explanation: currentCard.back.explanation,
      keyPoints: currentCard.back.keyPoints,
      mnemonics: currentCard.back.mnemonics || []
    };
  };

  const flipCard = () => {
    setShowBack(!showBack);
  };

  if (!currentCard) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">No flashcards found</h1>
        <p>Please adjust your filters to see available flashcards.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">High-Yield Medical Flashcards</h1>
        </div>
        <p className="text-gray-600">Interactive multimedia flashcards with audio/visual learning</p>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Difficulty</label>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(diff => (
                <SelectItem key={diff.value} value={diff.value}>{diff.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Volume</label>
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={5}
              className="flex-1"
            />
            <Volume2 className="w-4 h-4" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Speed</label>
          <Slider
            value={playbackSpeed}
            onValueChange={setPlaybackSpeed}
            min={0.5}
            max={2}
            step={0.1}
            className="flex-1"
          />
          <div className="text-xs text-center mt-1">{playbackSpeed[0]}x</div>
        </div>
      </div>

      {/* Audio/Video Settings */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant={autoPlay ? "default" : "outline"}
          size="sm"
          onClick={() => setAutoPlay(!autoPlay)}
        >
          <Speaker className="w-4 h-4 mr-2" />
          Auto-Read {autoPlay ? "On" : "Off"}
        </Button>
        
        <Button
          variant={speechEnabled ? "default" : "outline"}
          size="sm"
          onClick={() => setSpeechEnabled(!speechEnabled)}
        >
          <Mic className="w-4 h-4 mr-2" />
          Text-to-Speech {speechEnabled ? "On" : "Off"}
        </Button>

        <Button variant="outline" size="sm" onClick={shuffleCards}>
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle
        </Button>
      </div>

      {/* Language Translation Settings */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Language Translation</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={translationEnabled}
              onCheckedChange={(checked) => {
                setTranslationEnabled(checked);
                if (!checked) {
                  setTranslatedContent({});
                }
              }}
              className="data-[state=checked]:bg-blue-600"
            />
            <label className="text-sm font-medium text-blue-900">
              Enable Translation
            </label>
          </div>
          
          {translationEnabled && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block text-blue-900">Target Language</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">Arabic (العربية)</SelectItem>
                    <SelectItem value="zh">Chinese (中文)</SelectItem>
                    <SelectItem value="fr">French (Français)</SelectItem>
                    <SelectItem value="de">German (Deutsch)</SelectItem>
                    <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="it">Italian (Italiano)</SelectItem>
                    <SelectItem value="ja">Japanese (日本語)</SelectItem>
                    <SelectItem value="ko">Korean (한국어)</SelectItem>
                    <SelectItem value="pt">Portuguese (Português)</SelectItem>
                    <SelectItem value="ru">Russian (Русский)</SelectItem>
                    <SelectItem value="es">Spanish (Español)</SelectItem>
                    <SelectItem value="ur">Urdu (اردو)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={translateCurrentCard}
                  disabled={isTranslating}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Languages className="w-4 h-4 mr-2" />
                  {isTranslating ? "Translating..." : "Translate Card"}
                </Button>
              </div>
            </>
          )}
        </div>
        
        {translationEnabled && (
          <div className="mt-3 text-xs text-blue-600">
            <strong>Note:</strong> Translation helps with understanding but practice answering in English for PLAB exams
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Card {currentCardIndex + 1} of {filteredCards.length}</span>
          <span>Accuracy: {stats.studied > 0 ? Math.round((stats.correct / stats.studied) * 100) : 0}%</span>
        </div>
        <Progress value={(currentCardIndex + 1) / filteredCards.length * 100} />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.studied}</div>
          <div className="text-sm text-gray-600">Studied</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
          <div className="text-sm text-gray-600">Incorrect</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
          <div className="text-sm text-gray-600">Streak</div>
        </div>
      </div>

      {/* Flashcard */}
      <Card className="mb-6 min-h-[500px] cursor-pointer bg-gray-800 text-white" onClick={flipCard}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-white bg-blue-600">{currentCard.category}</Badge>
              <Badge variant="outline" className="text-white border-white">{currentCard.difficulty}</Badge>
              {currentCard.highYield && (
                <Badge variant="destructive" className="text-white">High Yield</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {(currentCard.front.audio || currentCard.back.audio) && (
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); playAudio(); }}>
                  <Volume2 className="w-4 h-4" />
                </Button>
              )}
              
              {(currentCard.front.video || currentCard.back.video) && (
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); playVideo(); }}>
                  <VideoIcon className="w-4 h-4" />
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={(e) => { 
                e.stopPropagation(); 
                speakText(showBack ? `${currentCard.back.text}. ${currentCard.back.explanation}` : currentCard.front.text);
              }}>
                <Speaker className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-center text-lg text-white">
            {showBack ? "Answer" : "Question"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {!showBack ? (
            // Front of card
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-white">{getDisplayContent().frontText}</p>
              
              {translationEnabled && (
                <div className="text-xs text-yellow-300">
                  Translated to {getLanguageName(targetLanguage)}
                </div>
              )}
              
              {currentCard.front.image && (
                <div className="flex justify-center">
                  <img 
                    src={currentCard.front.image} 
                    alt="Question image"
                    className="max-w-md rounded-lg shadow-md"
                  />
                </div>
              )}
              
              {currentCard.front.video && (
                <div className="flex justify-center">
                  <video
                    ref={videoRef}
                    controls
                    className="max-w-md rounded-lg shadow-md"
                    poster="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop"
                  >
                    <source src={currentCard.front.video} type="video/mp4" />
                  </video>
                </div>
              )}
              
              <p className="text-blue-300 text-sm">Click to reveal answer</p>
            </div>
          ) : (
            // Back of card
            <div className="space-y-4">
              <div className="text-xl font-semibold text-green-300">
                {currentCard.back.text}
              </div>
              
              <div className="text-left bg-blue-900 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-white">Explanation:</h4>
                <p className="leading-relaxed text-white">{currentCard.back.explanation}</p>
              </div>

              {currentCard.back.keyPoints.length > 0 && (
                <div className="text-left bg-yellow-900 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-white">Key Points:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {currentCard.back.keyPoints.map((point: string, index: number) => (
                      <li key={index} className="text-sm text-white">{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {currentCard.back.image && (
                <div className="flex justify-center">
                  <img 
                    src={currentCard.back.image} 
                    alt="Answer image"
                    className="max-w-md rounded-lg shadow-md"
                  />
                </div>
              )}

              {currentCard.back.video && (
                <div className="flex justify-center">
                  <video
                    ref={videoRef}
                    controls
                    className="max-w-md rounded-lg shadow-md"
                  >
                    <source src={currentCard.back.video} type="video/mp4" />
                  </video>
                </div>
              )}

              <div className="text-sm text-white bg-gray-700 p-3 rounded">
                <strong>Clinical Relevance:</strong> {currentCard.clinicalRelevance}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answer Buttons */}
      {showBack && (
        <div className="flex gap-4 justify-center mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleAnswer(false)}
            className="gap-2"
          >
            <XCircle className="w-5 h-5 text-red-600" />
            Incorrect
          </Button>
          
          <Button
            size="lg"
            onClick={() => handleAnswer(true)}
            className="gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Correct
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={previousCard}>
          ← Previous
        </Button>
        
        <Button variant="outline" onClick={flipCard}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Flip Card
        </Button>
        
        <Button variant="outline" onClick={nextCard}>
          Next →
        </Button>
      </div>

      {/* Answer buttons for high-yield learning */}
      {showBack && (
        <div className="flex gap-4 justify-center mb-6">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => handleAnswer(false)}
            className="bg-red-600 text-white hover:bg-red-700 border-red-600"
          >
            ❌ Incorrect
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => handleAnswer(true)}
            className="bg-green-600 text-white hover:bg-green-700 border-green-600"
          >
            ✅ Correct
          </Button>
        </div>
      )}

      {/* High-Yield Help Popup */}
      {showHelpPopup && helpContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 text-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-yellow-300">{helpContent.title}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowHelpPopup(false)}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              {helpContent.content.map((line, index) => (
                <p key={index} className="text-white leading-relaxed">{line}</p>
              ))}
              
              {helpContent.mnemonics.length > 0 && (
                <div className="bg-yellow-900 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-300 mb-2">💡 Memory Aids:</h4>
                  {helpContent.mnemonics.map((mnemonic, index) => (
                    <p key={index} className="text-yellow-100 mb-1">• {mnemonic}</p>
                  ))}
                </div>
              )}
              
              <div className="border-t border-white border-opacity-20 pt-4">
                <p className="text-sm text-gray-300">
                  💡 <strong>Pro Tip:</strong> Review this high-yield content multiple times. 
                  These topics appear frequently in PLAB 1 examinations.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={() => setShowHelpPopup(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Got It!
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowHelpPopup(false);
                  if (speechEnabled && 'speechSynthesis' in window) {
                    const text = helpContent.content.join('. ') + '. ' + helpContent.mnemonics.join('. ');
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.rate = playbackSpeed[0];
                    utterance.volume = volume[0] / 100;
                    speechSynthesis.speak(utterance);
                  }
                }}
                className="text-white border-white hover:bg-white hover:bg-opacity-20"
              >
                🔊 Read Aloud
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Performance indicator for current card */}
      {cardPerformance[currentCard.id] && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Card Performance:</span>
            <span>
              {cardPerformance[currentCard.id].correct}/{cardPerformance[currentCard.id].attempts} correct
              ({Math.round((cardPerformance[currentCard.id].correct / cardPerformance[currentCard.id].attempts) * 100)}%)
            </span>
          </div>
          {cardPerformance[currentCard.id].attempts > 1 && cardPerformance[currentCard.id].correct / cardPerformance[currentCard.id].attempts < 0.5 && (
            <div className="text-xs text-yellow-300 mt-1">
              💡 This card needs more practice - review the key points above
            </div>
          )}
        </div>
      )}

      {/* Hidden audio element for media playback */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}