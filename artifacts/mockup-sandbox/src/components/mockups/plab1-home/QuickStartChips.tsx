import React, { useState } from 'react';
import { 
  Languages, 
  Volume2, 
  Activity,
  Brain,
  Droplets,
  Stethoscope,
  Baby,
  HeartPulse,
  ActivitySquare,
  Home,
  BarChart2,
  Bookmark,
  User,
  Play
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// Dummy data
const WEAK_AREAS = [
  { id: 'cardio', name: 'Cardiology', score: 62, due: 12, icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'renal', name: 'Renal', score: 48, due: 8, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'neuro', name: 'Neurology', score: 55, due: 15, icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const TOPICS = [
  'All Topics',
  'Cardiology', 
  'Respiratory', 
  'Neurology', 
  'Endocrinology', 
  'Gastroenterology', 
  'Renal', 
  'Paediatrics', 
  'Psychiatry'
];

const DIFFICULTIES = ['Mixed', 'Easy', 'Medium', 'Hard'];
const MODES = ['Practice', 'Timed', 'Unlimited'];
const QUESTIONS = [5, 10, 20, 50];

export function QuickStartChips() {
  const [topic, setTopic] = useState('All Topics');
  const [difficulty, setDifficulty] = useState('Mixed');
  const [mode, setMode] = useState('Practice');
  const [questions, setQuestions] = useState(10);
  
  const [isTranslationOn, setIsTranslationOn] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(false);

  const handleWeakAreaClick = (areaName: string) => {
    setTopic(areaName);
    setDifficulty('Mixed');
    setMode('Practice');
    setQuestions(10);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[402px] mx-auto bg-slate-50 overflow-hidden font-sans relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Hi, Dr. Sam <span className="text-2xl">👋</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Ready for today's practice?</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsTranslationOn(!isTranslationOn)}
            className={`p-2.5 rounded-full transition-colors ${isTranslationOn ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'}`}
          >
            <Languages className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsVoiceOn(!isVoiceOn)}
            className={`p-2.5 rounded-full transition-colors ${isVoiceOn ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'}`}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-40 no-scrollbar">
        {/* Weak Areas */}
        <section className="mt-4">
          <div className="px-6 mb-3">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Recommended Focus</h2>
          </div>
          <div className="flex overflow-x-auto px-6 pb-4 gap-3 no-scrollbar snap-x">
            {WEAK_AREAS.map((area) => {
              const Icon = area.icon;
              return (
                <button
                  key={area.id}
                  onClick={() => handleWeakAreaClick(area.name)}
                  className="snap-start shrink-0 w-[140px] bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-left transition-transform active:scale-95"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-xl ${area.bg}`}>
                      <Icon className={`w-5 h-5 ${area.color}`} />
                    </div>
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-10 h-10 transform -rotate-90">
                        <circle cx="20" cy="20" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                        <circle 
                          cx="20" cy="20" r="16" fill="transparent" 
                          stroke="currentColor" strokeWidth="4" 
                          strokeDasharray="100" strokeDashoffset={100 - area.score}
                          className={area.color}
                        />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-slate-700">{area.score}%</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm">{area.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{area.due} questions due</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* Configuration Chips */}
        <section className="px-6 space-y-6 mt-2">
          {/* Topic */}
          <div>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Topic</h2>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(t => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    topic === t 
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Difficulty</h2>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    difficulty === d 
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Mode</h2>
            <div className="flex flex-wrap gap-2">
              {MODES.map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    mode === m 
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          {mode !== 'Unlimited' && (
            <div>
              <h2 className="text-sm font-semibold text-slate-800 mb-3">Questions</h2>
              <div className="flex flex-wrap gap-2">
                {QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => setQuestions(q)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      questions === q 
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Floating CTA */}
      <div className="absolute bottom-[80px] left-0 right-0 px-6 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md pb-4 pt-6 -mx-6 px-6 mask-image-b pointer-events-auto">
          <Button 
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-xl shadow-teal-200/50 flex flex-col items-center justify-center gap-0.5 border-none"
          >
            <div className="flex items-center gap-2 text-lg font-bold">
              Start Session <Play className="w-5 h-5 fill-current" />
            </div>
            <span className="text-teal-50 text-xs font-medium">
              {mode === 'Unlimited' ? 'Unlimited' : questions} {difficulty.toLowerCase()} {topic === 'All Topics' ? 'questions' : topic.toLowerCase() + ' questions'}, {mode}
            </span>
          </Button>
        </div>
      </div>

      {/* Bottom Tab Nav */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex items-center justify-around px-2 pb-safe">
        <button className="flex flex-col items-center gap-1 p-2 text-teal-600">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600">
          <BarChart2 className="w-6 h-6" />
          <span className="text-[10px] font-medium">Progress</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600">
          <Bookmark className="w-6 h-6" />
          <span className="text-[10px] font-medium">Saved</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mask-image-b {
          mask-image: linear-gradient(to bottom, transparent, black 20%);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%);
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 16px);
        }
      `}} />
    </div>
  );
}
