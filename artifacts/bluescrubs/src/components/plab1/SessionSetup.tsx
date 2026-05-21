import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Clock, ArrowRight, Globe, Volume2
} from "lucide-react";
import plab1BgImage from '@assets/458CC7DF-D6D7-4BAD-85F5-99EEBD33ECD9_1750366142331.png';
import { availableCategories } from "@/lib/quiz-utils";

type SessionMode = 'practice' | 'timed' | 'unlimited' | 'plab' | 'adaptive' | 'incorrect-only' | 'spot-diagnosis';

const MODE_TABS: { id: SessionMode; label: string; description: string }[] = [
  {
    id: 'practice',
    label: 'Practice',
    description: 'Complete a set number of questions at your own pace',
  },
  {
    id: 'timed',
    label: 'Timed',
    description: 'Answer as many questions as possible within a time limit',
  },
  {
    id: 'unlimited',
    label: 'Unlimited',
    description: 'Study without time pressure — continue as long as you want',
  },
  {
    id: 'plab',
    label: 'PLAB Exam',
    description: 'Real exam conditions — exactly 1 minute per question',
  },
  {
    id: 'adaptive',
    label: 'Adaptive',
    description: 'Smart mode: prioritises your weak areas and recently missed questions',
  },
  {
    id: 'incorrect-only',
    label: 'Incorrect Only',
    description: 'Revisit only the questions you have previously answered incorrectly',
  },
  {
    id: 'spot-diagnosis',
    label: 'Spot Diagnosis',
    description: 'Identify conditions from clinical images — ECGs, X-rays, dermatology, and more',
  },
];

type SessionOption = { value: number; label: string; note?: string };

const PRACTICE_COUNTS: SessionOption[] = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 180, label: '180', note: 'PLAB Mock' },
];

const TIMED_OPTIONS: SessionOption[] = [
  { value: 10, label: '10m' },
  { value: 30, label: '30m' },
  { value: 60, label: '60m' },
  { value: 120, label: '2h' },
  { value: 180, label: '3h' },
];

const PLAB_COUNTS: SessionOption[] = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 60, label: '60' },
  { value: 180, label: '180', note: 'Full PLAB' },
];

interface SessionSetupProps {
  heroImageLoaded: boolean;
  setHeroImageLoaded: (v: boolean) => void;
  isTranslationMode: boolean;
  setIsTranslationMode: (v: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (v: string) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (v: boolean) => void;
  selectedVoice: string;
  setSelectedVoice: (v: string) => void;
  availableVoices: SpeechSynthesisVoice[];
  isSpeaking: boolean;
  stopSpeaking: () => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (v: string) => void;
  isGeneratingQuestions: boolean;
  translateText: (text: string) => string;
  onStartPractice: (count: number) => void;
  onStartTimedPractice: (minutes: number) => void;
  onStartUnlimitedPractice: () => void;
  onStartAuthenticTimedPractice: (count: number) => void;
  onStartAdaptivePractice: (count: number) => void;
  onStartIncorrectOnlyPractice: (count: number) => void;
  onStartSpotDiagnosis: () => void;
}

export function SessionSetup({
  heroImageLoaded,
  setHeroImageLoaded,
  isTranslationMode,
  setIsTranslationMode,
  selectedLanguage,
  setSelectedLanguage,
  speechEnabled,
  setSpeechEnabled,
  selectedVoice,
  setSelectedVoice,
  availableVoices,
  isSpeaking,
  stopSpeaking,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  isGeneratingQuestions,
  translateText,
  onStartPractice,
  onStartTimedPractice,
  onStartUnlimitedPractice,
  onStartAuthenticTimedPractice,
  onStartAdaptivePractice,
  onStartIncorrectOnlyPractice,
  onStartSpotDiagnosis,
}: SessionSetupProps) {
  const [selectedMode, setSelectedMode] = useState<SessionMode>('practice');
  const [selectedCount, setSelectedCount] = useState<number>(10);

  const handleModeChange = (mode: SessionMode) => {
    setSelectedMode(mode);
    // Reset to first option for the new mode
    if (mode === 'practice') setSelectedCount(10);
    else if (mode === 'timed') setSelectedCount(10);
    else if (mode === 'plab') setSelectedCount(10);
  };

  const handleStart = () => {
    if (selectedMode === 'practice') {
      onStartPractice(selectedCount);
    } else if (selectedMode === 'timed') {
      onStartTimedPractice(selectedCount);
    } else if (selectedMode === 'unlimited') {
      onStartUnlimitedPractice();
    } else if (selectedMode === 'plab') {
      onStartAuthenticTimedPractice(selectedCount);
    } else if (selectedMode === 'adaptive') {
      onStartAdaptivePractice(selectedCount);
    } else if (selectedMode === 'incorrect-only') {
      onStartIncorrectOnlyPractice(selectedCount);
    } else if (selectedMode === 'spot-diagnosis') {
      onStartSpotDiagnosis();
    }
  };

  const canStart = selectedMode === 'unlimited' || selectedMode === 'spot-diagnosis' || selectedCount > 0;

  const currentMode = MODE_TABS.find(m => m.id === selectedMode)!;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto mb-16">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 w-full h-48 md:h-64 mb-6 overflow-hidden rounded-xl">
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
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 h-full">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              {translateText('Master PLAB 1')} {translateText('with AI')}
            </h1>
            <p className="text-base md:text-lg text-white/90 drop-shadow" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
              {translateText('Authentic UK Comprehensive exam preparation')}
            </p>
          </div>
        </div>

        {/* Settings row: language + voice */}
        <div id="settings" className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-3 flex-1 min-w-[240px] p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div className="flex items-center gap-2">
              <Switch
                checked={isTranslationMode}
                onCheckedChange={setIsTranslationMode}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className="text-sm font-medium text-blue-900 whitespace-nowrap">Translation</span>
            </div>
            {isTranslationMode && (
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-44 border-blue-200 h-8 text-sm">
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
                  <SelectItem value="nl">🇳🇱 Nederlands Dutch</SelectItem>
                  <SelectItem value="sv">🇸🇪 Svenska Swedish</SelectItem>
                  <SelectItem value="da">🇩🇰 Dansk Danish</SelectItem>
                  <SelectItem value="no">🇳🇴 Norsk Norwegian</SelectItem>
                  <SelectItem value="fi">🇫🇮 Suomi Finnish</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-[240px] p-3 bg-green-50 rounded-lg border border-green-200">
            <Volume2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <div className="flex items-center gap-2">
              <Switch
                checked={speechEnabled}
                onCheckedChange={setSpeechEnabled}
                className="data-[state=checked]:bg-green-600"
              />
              <span className="text-sm font-medium text-green-900 whitespace-nowrap">Voice Reading</span>
            </div>
            {speechEnabled && (
              <div className="flex items-center gap-2">
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger className="w-36 border-green-200 h-8 text-sm">
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
                    className="border-green-200 text-green-700 hover:bg-green-50 h-8"
                  >
                    Stop
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main setup panel */}
        <Card id="practice-options" className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Customise Your Practice</CardTitle>
            <CardDescription>Select your category, difficulty, and practice mode</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Category + Difficulty */}
            <div className="grid md:grid-cols-2 gap-4 pb-5 border-b">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Medical Specialty</Label>
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
                <Label className="text-sm font-medium mb-1.5 block">Difficulty Level</Label>
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

            {/* Step 1 — Mode tabs */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Step 1 — Select Mode</p>
              <div className="flex gap-2 flex-wrap">
                {MODE_TABS.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                      selectedMode === mode.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-700'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">{currentMode.description}</p>
            </div>

            {/* Step 2 — Count / Duration pills */}
            {selectedMode !== 'unlimited' && selectedMode !== 'spot-diagnosis' && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Step 2 — {selectedMode === 'timed' ? 'Select Duration' : 'Select Question Count'}
                  {selectedMode === 'plab' && (
                    <span className="ml-2 normal-case font-normal text-gray-400">· 1 minute per question</span>
                  )}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {(selectedMode === 'timed' ? TIMED_OPTIONS : selectedMode === 'plab' ? PLAB_COUNTS : PRACTICE_COUNTS).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedCount(opt.value)}
                      className={`flex flex-col items-center justify-center px-5 py-2 rounded-full text-sm font-medium border transition-all min-w-[72px] ${
                        selectedCount === opt.value
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-700'
                      }`}
                    >
                      <span className="font-semibold">{opt.label}</span>
                      {'note' in opt && opt.note && (
                        <span className={`text-[10px] leading-none mt-0.5 ${selectedCount === opt.value ? 'text-blue-100' : 'text-gray-400'}`}>
                          {opt.note}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start button */}
            <div className="pt-1">
              <Button
                onClick={handleStart}
                disabled={isGeneratingQuestions || !canStart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 font-semibold"
              >
                {isGeneratingQuestions ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating…
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {selectedMode === 'unlimited' ? 'Start Unlimited Practice' : selectedMode === 'spot-diagnosis' ? 'Open Spot Diagnosis' : 'Start Session'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
