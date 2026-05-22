import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Languages, Volume2, Play, HeartPulse, Droplets, Brain,
} from "lucide-react";
import { availableCategories } from "@/lib/quiz-utils";
import type { WeakAreaRecommendation } from "@/hooks/useLocalAnalytics";

const SUPPORTED_LANGUAGES: { code: string; nativeName: string; flag: string }[] = [
  { code: 'en', nativeName: 'English (UK)', flag: '🇬🇧' },
  { code: 'es', nativeName: 'Español',      flag: '🇪🇸' },
  { code: 'fr', nativeName: 'Français',     flag: '🇫🇷' },
  { code: 'de', nativeName: 'Deutsch',      flag: '🇩🇪' },
  { code: 'it', nativeName: 'Italiano',     flag: '🇮🇹' },
  { code: 'pt', nativeName: 'Português',    flag: '🇵🇹' },
  { code: 'ar', nativeName: 'العربية',      flag: '🇸🇦' },
  { code: 'hi', nativeName: 'हिन्दी',         flag: '🇮🇳' },
  { code: 'ur', nativeName: 'اردو',          flag: '🇵🇰' },
  { code: 'zh', nativeName: '中文',          flag: '🇨🇳' },
  { code: 'ja', nativeName: '日本語',        flag: '🇯🇵' },
  { code: 'ko', nativeName: '한국어',         flag: '🇰🇷' },
  { code: 'ru', nativeName: 'Русский',      flag: '🇷🇺' },
  { code: 'tr', nativeName: 'Türkçe',       flag: '🇹🇷' },
  { code: 'pl', nativeName: 'Polski',       flag: '🇵🇱' },
  { code: 'nl', nativeName: 'Nederlands',   flag: '🇳🇱' },
  { code: 'sv', nativeName: 'Svenska',      flag: '🇸🇪' },
];

type SessionMode =
  | 'practice' | 'timed' | 'unlimited' | 'plab'
  | 'adaptive' | 'incorrect-only' | 'spot-diagnosis';

const MODE_CHIPS: { id: SessionMode; label: string; description: string }[] = [
  { id: 'practice',        label: 'Practice',        description: 'Self-paced practice with a set number of questions' },
  { id: 'timed',           label: 'Timed',           description: 'Answer as many as you can within a time limit' },
  { id: 'unlimited',       label: 'Unlimited',       description: 'No timer, no question cap — keep going as long as you like' },
  { id: 'plab',            label: 'PLAB Exam',       description: 'Real exam conditions — 1 minute per question' },
  { id: 'adaptive',        label: 'Adaptive',        description: 'Smart mode focused on your weak areas' },
  { id: 'incorrect-only',  label: 'Incorrect Only',  description: 'Revisit questions you got wrong' },
  { id: 'spot-diagnosis',  label: 'Spot Diagnosis',  description: 'Identify conditions from clinical images' },
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

const DIFFICULTIES: { value: string; label: string }[] = [
  { value: 'foundation',   label: 'Foundation' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced',     label: 'Advanced' },
];

const WEAK_AREA_ICON = [
  { Icon: HeartPulse, color: 'text-rose-500',   bg: 'bg-rose-50',   ring: 'stroke-rose-400' },
  { Icon: Droplets,   color: 'text-blue-500',   bg: 'bg-blue-50',   ring: 'stroke-blue-400' },
  { Icon: Brain,      color: 'text-purple-500', bg: 'bg-purple-50', ring: 'stroke-purple-400' },
];

const STARTER_RECOMMENDATIONS: WeakAreaRecommendation[] = [
  { category: 'cardiovascular',  priority: 'high',   reason: 'High-yield PLAB topic', suggestedAction: 'Start with 10 questions',  estimatedStudyTime: 60 },
  { category: 'respiratory',     priority: 'medium', reason: 'Common exam area',      suggestedAction: 'Quick warm-up set',         estimatedStudyTime: 45 },
  { category: 'endocrinology',   priority: 'medium', reason: 'Frequently tested',     suggestedAction: 'Build core knowledge',      estimatedStudyTime: 70 },
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
  userName?: string;
  weakAreas?: WeakAreaRecommendation[];
}

export function SessionSetup({
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
  userName,
  weakAreas,
}: SessionSetupProps) {
  const [selectedMode, setSelectedMode] = useState<SessionMode>('practice');
  const [selectedCount, setSelectedCount] = useState<number>(10);

  const handleModeChange = (mode: SessionMode) => {
    setSelectedMode(mode);
    if (mode === 'practice' || mode === 'timed' || mode === 'plab') setSelectedCount(10);
  };

  const handleStart = () => {
    if (selectedMode === 'practice')        return onStartPractice(selectedCount);
    if (selectedMode === 'timed')           return onStartTimedPractice(selectedCount);
    if (selectedMode === 'unlimited')       return onStartUnlimitedPractice();
    if (selectedMode === 'plab')            return onStartAuthenticTimedPractice(selectedCount);
    if (selectedMode === 'adaptive')        return onStartAdaptivePractice(selectedCount);
    if (selectedMode === 'incorrect-only')  return onStartIncorrectOnlyPractice(selectedCount);
    if (selectedMode === 'spot-diagnosis')  return onStartSpotDiagnosis();
  };

  const handleWeakAreaClick = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setSelectedMode('adaptive');
    setSelectedCount(10);
  };

  const showCount = selectedMode !== 'unlimited' && selectedMode !== 'spot-diagnosis';
  const countOptions =
    selectedMode === 'timed' ? TIMED_OPTIONS :
    selectedMode === 'plab'  ? PLAB_COUNTS   :
    PRACTICE_COUNTS;

  const categoryLabel =
    availableCategories.find(c => c.value === selectedCategory)?.label ?? 'All Categories';
  const difficultyLabel =
    DIFFICULTIES.find(d => d.value === selectedDifficulty)?.label ?? 'Intermediate';
  const modeLabel = MODE_CHIPS.find(m => m.id === selectedMode)?.label ?? 'Practice';

  const summary = showCount
    ? `${selectedCount} ${difficultyLabel.toLowerCase()} ${categoryLabel.toLowerCase()} ${selectedMode === 'timed' ? 'min' : 'Qs'} · ${modeLabel}`
    : `${categoryLabel} · ${modeLabel}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-[680px] mx-auto pb-44">
        {/* Header */}
        <header className="flex items-center justify-between px-6 pt-8 pb-4 bg-white">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {translateText('Hi')}, {userName || translateText('Doctor')} <span>👋</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">{translateText("Ready for today's practice?")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle translation"
              aria-pressed={isTranslationMode}
              onClick={() => setIsTranslationMode(!isTranslationMode)}
              className={`p-2.5 rounded-full transition-colors ${
                isTranslationMode ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'
              }`}
              data-testid="button-toggle-translation"
            >
              <Languages className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Toggle voice reading"
              aria-pressed={speechEnabled}
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`p-2.5 rounded-full transition-colors ${
                speechEnabled ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'
              }`}
              data-testid="button-toggle-voice"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Translation / Voice expanded controls */}
        {(isTranslationMode || speechEnabled) && (
          <div className="px-6 pb-3 bg-white border-b border-slate-100 flex flex-wrap gap-3">
            {isTranslationMode && (
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="h-9 w-44 text-sm border-teal-200 bg-teal-50/60">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="max-h-72 overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map(l => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.flag} {l.nativeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {speechEnabled && availableVoices.length > 0 && (
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="h-9 w-44 text-sm border-teal-200 bg-teal-50/60">
                  <SelectValue placeholder="Voice" />
                </SelectTrigger>
                <SelectContent className="max-h-72 overflow-y-auto">
                  {availableVoices.map(v => (
                    <SelectItem key={v.name} value={v.name}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {speechEnabled && isSpeaking && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
                className="h-9 border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                Stop voice
              </Button>
            )}
          </div>
        )}

        {/* Recommended Focus — real weak areas if available, otherwise starter suggestions */}
        {(() => {
          const items = (weakAreas && weakAreas.length > 0) ? weakAreas : STARTER_RECOMMENDATIONS;
          const isStarter = !weakAreas || weakAreas.length === 0;
          return (
          <section className="mt-4">
            <div className="px-6 mb-3 flex items-baseline justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                {translateText(isStarter ? 'Suggested Topics' : 'Recommended Focus')}
              </h2>
              {isStarter && (
                <span className="text-[11px] text-slate-400">
                  {translateText('Personalised as you practise')}
                </span>
              )}
            </div>
            <div className="flex overflow-x-auto px-6 pb-4 gap-3 plab1-no-scrollbar snap-x">
              {items.slice(0, 6).map((area, i) => {
                const visual = WEAK_AREA_ICON[i % WEAK_AREA_ICON.length];
                const Icon = visual.Icon;
                const label =
                  availableCategories.find(c => c.value === area.category)?.label ?? area.category;
                const pct = Math.max(
                  0,
                  Math.min(100, Math.round((area.estimatedStudyTime ?? 0) % 100) || 50),
                );
                return (
                  <button
                    key={`${area.category}-${i}`}
                    type="button"
                    onClick={() => handleWeakAreaClick(area.category)}
                    aria-label={`Focus on ${label} (${area.priority} priority)`}
                    className="snap-start shrink-0 w-[160px] bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-left transition-transform active:scale-95"
                    data-testid={`weak-area-${area.category}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-xl ${visual.bg}`}>
                        <Icon className={`w-5 h-5 ${visual.color}`} />
                      </div>
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                          <circle cx="20" cy="20" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                          <circle
                            cx="20" cy="20" r="16" fill="transparent"
                            strokeWidth="4" strokeLinecap="round"
                            strokeDasharray={`${(pct / 100) * 100.5} 100.5`}
                            className={visual.ring}
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-slate-700">
                          {area.priority === 'high' ? '!' : pct + '%'}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm leading-tight">{label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {area.suggestedAction || area.reason}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
          );
        })()}

        {/* Chip rows — single-line horizontal scrollers */}
        <section className="space-y-6 mt-4">
          <ChipRow
            label="Topic"
            items={availableCategories.map(c => ({ value: c.value, label: c.label }))}
            value={selectedCategory}
            onChange={setSelectedCategory}
            testIdPrefix="topic"
          />
          <ChipRow
            label="Difficulty"
            items={DIFFICULTIES}
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            testIdPrefix="difficulty"
          />
          <ChipRow
            label="Mode"
            items={MODE_CHIPS.map(m => ({ value: m.id, label: m.label }))}
            value={selectedMode}
            onChange={(v) => handleModeChange(v as SessionMode)}
            testIdPrefix="mode"
          />
          {showCount && (
            <ChipRow
              label={selectedMode === 'timed' ? 'Duration' : 'Questions'}
              items={countOptions.map(o => ({
                value: String(o.value),
                label: o.label,
                note: o.note,
              }))}
              value={String(selectedCount)}
              onChange={(v) => setSelectedCount(Number(v))}
              testIdPrefix="count"
            />
          )}
          <p className="px-6 text-xs text-slate-500 leading-relaxed">
            {MODE_CHIPS.find(m => m.id === selectedMode)?.description}
          </p>
        </section>
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-6 pointer-events-none z-40
                      bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent">
        <div className="max-w-[680px] mx-auto pointer-events-auto">
          <Button
            onClick={handleStart}
            disabled={isGeneratingQuestions}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-xl shadow-teal-200/50 flex flex-col items-center justify-center gap-0.5 border-none disabled:opacity-70"
            data-testid="button-start-session"
          >
            {isGeneratingQuestions ? (
              <div className="flex items-center gap-2 text-base font-semibold">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating…
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-lg font-bold">
                  {translateText(
                    selectedMode === 'unlimited'      ? 'Start Unlimited' :
                    selectedMode === 'spot-diagnosis' ? 'Open Spot Diagnosis' :
                                                       'Start Session'
                  )}
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <span className="text-teal-50 text-xs font-medium truncate max-w-full px-3">
                  {summary}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .plab1-no-scrollbar::-webkit-scrollbar { display: none; }
        .plab1-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

interface ChipRowProps {
  label: string;
  items: { value: string; label: string; note?: string }[];
  value: string;
  onChange: (v: string) => void;
  testIdPrefix: string;
}

function ChipRow({ label, items, value, onChange, testIdPrefix }: ChipRowProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-900 mb-2.5 px-6">{label}</h2>
      <div className="flex overflow-x-auto px-6 gap-2 plab1-no-scrollbar snap-x">
        {items.map(item => {
          const active = value === item.value;
          return (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${label}: ${item.label}${item.note ? ` (${item.note})` : ''}`}
              onClick={() => onChange(item.value)}
              className={`snap-start shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                active
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50'
              }`}
              data-testid={`chip-${testIdPrefix}-${item.value}`}
            >
              {item.label}
              {item.note && (
                <span className={`ml-1.5 text-[10px] ${active ? 'text-teal-50' : 'text-slate-400'}`}>
                  · {item.note}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
