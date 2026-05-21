import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Clock, BookOpen, Target, Brain, ArrowRight, Award, Globe, Volume2, FileText
} from "lucide-react";
import plab1BgImage from '@assets/458CC7DF-D6D7-4BAD-85F5-99EEBD33ECD9_1750366142331.png';
import { availableCategories } from "@/lib/quiz-utils";

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
  setShowNiceGuide: (v: boolean) => void;
  translateText: (text: string) => string;
  onStartPractice: (count: number) => void;
  onStartTimedPractice: (minutes: number) => void;
  onStartUnlimitedPractice: () => void;
  onStartAuthenticTimedPractice: (count: number) => void;
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
  setShowNiceGuide,
  translateText,
  onStartPractice,
  onStartTimedPractice,
  onStartUnlimitedPractice,
  onStartAuthenticTimedPractice,
}: SessionSetupProps) {
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

        {/* NICE NG136 + PLAB MCQ Format Guide */}
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

        {/* Customise Your Practice */}
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
                {[10, 20, 50, 100].map((count) => (
                  <Button
                    key={count}
                    onClick={() => onStartPractice(count)}
                    disabled={isGeneratingQuestions}
                    className="bg-blue-600 hover:bg-blue-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">{count}</span>
                    <span className="text-xs opacity-90">Questions</span>
                  </Button>
                ))}
                <Button
                  onClick={() => onStartPractice(180)}
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
                {[
                  { minutes: 10, label: '10m', sublabel: 'Sprint' },
                  { minutes: 30, label: '30m', sublabel: 'Focus' },
                  { minutes: 60, label: '60m', sublabel: 'Endurance' },
                  { minutes: 120, label: '2h', sublabel: 'Marathon' },
                  { minutes: 180, label: '3h', sublabel: 'Ultra' },
                ].map(({ minutes, label, sublabel }) => (
                  <Button
                    key={minutes}
                    onClick={() => onStartTimedPractice(minutes)}
                    disabled={isGeneratingQuestions}
                    className="bg-orange-600 hover:bg-orange-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">{label}</span>
                    <span className="text-xs opacity-90">{sublabel}</span>
                  </Button>
                ))}
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
                onClick={onStartUnlimitedPractice}
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
                {[
                  { count: 10, sublabel: '10 mins' },
                  { count: 20, sublabel: '20 mins' },
                  { count: 50, sublabel: '50 mins' },
                  { count: 100, sublabel: '100 mins' },
                  { count: 180, sublabel: 'Full PLAB' },
                ].map(({ count, sublabel }) => (
                  <Button
                    key={count}
                    onClick={() => onStartAuthenticTimedPractice(count)}
                    disabled={isGeneratingQuestions}
                    className="bg-purple-600 hover:bg-purple-700 h-16 flex flex-col items-center justify-center gap-1 force-white-text"
                  >
                    <span className="font-bold text-lg">{count}</span>
                    <span className="text-xs opacity-90">{sublabel}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
