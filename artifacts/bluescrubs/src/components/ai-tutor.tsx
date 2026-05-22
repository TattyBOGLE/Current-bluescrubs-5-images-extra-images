import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageCircle, BookOpen, Target, Lightbulb, X, Upload, Mic, MicOff,
  FileText, Headphones, Zap, Sparkles, Loader2, ArrowRight,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AITutorProps {
  currentQuestion?: any;
  userPerformance?: any;
  onClose: () => void;
  isVisible: boolean;
}

type TabId = 'help' | 'study' | 'concepts' | 'upload' | 'voice';

const TABS: { id: TabId; label: string; Icon: typeof MessageCircle }[] = [
  { id: 'help',     label: 'Help',       Icon: MessageCircle },
  { id: 'study',    label: 'Study Plan', Icon: BookOpen },
  { id: 'concepts', label: 'Concepts',   Icon: Target },
  { id: 'upload',   label: 'Content',    Icon: Upload },
  { id: 'voice',    label: 'Voice',      Icon: Mic },
];

export function AITutor({ currentQuestion, userPerformance, onClose, isVisible }: AITutorProps) {
  const [userQuery, setUserQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('help');
  const [uploadedContent, setUploadedContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const queryClient = useQueryClient();

  const tutorMutation = useMutation({
    mutationFn: async (data: { query: string; context?: any }) => {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to get tutor response');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tutor-history'] });
    },
  });

  const handleAskTutor = () => {
    if (!userQuery.trim()) return;
    tutorMutation.mutate({
      query: userQuery,
      context: { question: currentQuestion, performance: userPerformance },
    });
  };

  const getQuestionHelp = () => {
    if (!currentQuestion) return;
    tutorMutation.mutate({
      query: `Please explain this medical question and provide study guidance: ${currentQuestion.scenario}`,
      context: { question: currentQuestion },
    });
  };

  const getStudyPlan = () => {
    tutorMutation.mutate({
      query: 'Create a personalized study plan based on my performance',
      context: { performance: userPerformance },
    });
  };

  const generateFlashcards = () => {
    const content = uploadedContent || currentQuestion?.explanation || 'Current medical topic';
    tutorMutation.mutate({
      query: `Generate spaced-repetition flashcards from this content: ${content}`,
      context: { type: 'flashcard_generation', specialty: currentQuestion?.category || 'general' },
    });
  };

  const generatePodcast = () => {
    const content = uploadedContent || currentQuestion?.explanation || 'Current medical topic';
    tutorMutation.mutate({
      query: `Create an AI-narrated podcast script from this content: ${content}`,
      context: { type: 'podcast_generation', audioFormat: true },
    });
  };

  const startVoiceInteraction = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      alert('Voice recognition not supported in this browser');
      return;
    }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserQuery(transcript);
      handleAskTutor();
    };
    recognition.start();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — teal gradient */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-bold text-white leading-tight">AI Medical Tutor</h2>
            <p className="text-[11px] sm:text-xs text-teal-50">PLAB 1 Assistant</p>
          </div>
          <Badge className="bg-white/20 text-white border-transparent hover:bg-white/25 text-[10px] font-semibold hidden sm:inline-flex">
            Beta
          </Badge>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs — horizontal scroll pills */}
        <div className="border-b border-slate-100 bg-white">
          <div className="flex gap-1.5 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    active
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white border-transparent shadow-sm shadow-teal-200/50'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50">
          {/* Help */}
          {activeTab === 'help' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ActionCard
                  Icon={Lightbulb}
                  label="Explain Current Question"
                  primary
                  onClick={getQuestionHelp}
                  disabled={!currentQuestion || tutorMutation.isPending}
                />
                <ActionCard
                  Icon={BookOpen}
                  label="Key Learning Points"
                  onClick={() => tutorMutation.mutate({
                    query: 'What are the key learning points for this topic?',
                    context: { question: currentQuestion },
                  })}
                  disabled={!currentQuestion || tutorMutation.isPending}
                />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Ask the AI Tutor
                </label>
                <Textarea
                  placeholder="Ask anything about medical concepts, exam strategies, or study tips…"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="min-h-24 rounded-2xl border-slate-200 bg-slate-50 resize-none"
                />
                <Button
                  onClick={handleAskTutor}
                  disabled={!userQuery.trim() || tutorMutation.isPending}
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold shadow-md shadow-teal-200/50 border-none disabled:opacity-50"
                >
                  {tutorMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Thinking…</>
                  ) : (
                    <>Ask Tutor<ArrowRight className="w-4 h-4 ml-1.5" /></>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Study Plan */}
          {activeTab === 'study' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ActionCard
                Icon={Target}
                label="Personalised Study Plan"
                primary
                onClick={getStudyPlan}
                disabled={tutorMutation.isPending}
              />
              <ActionCard
                Icon={BookOpen}
                label="Weak Areas Analysis"
                onClick={() => tutorMutation.mutate({
                  query: 'What are my weak areas and how can I improve?',
                  context: { performance: userPerformance },
                })}
                disabled={tutorMutation.isPending}
              />
            </div>
          )}

          {/* Concepts */}
          {activeTab === 'concepts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ActionCard
                Icon={BookOpen}
                label="Clinical Pathophysiology"
                primary
                onClick={() => tutorMutation.mutate({
                  query: 'Explain the pathophysiology and clinical approach for this condition',
                  context: { question: currentQuestion },
                })}
                disabled={!currentQuestion || tutorMutation.isPending}
              />
              <ActionCard
                Icon={Lightbulb}
                label="Memory Aids"
                onClick={() => tutorMutation.mutate({
                  query: 'Provide memory aids and mnemonics for this topic',
                  context: { question: currentQuestion },
                })}
                disabled={!currentQuestion || tutorMutation.isPending}
              />
            </div>
          )}

          {/* Upload */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-5 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Upload Medical Content</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Paste lectures, articles, or case studies to generate study materials.
                </p>
              </div>
              <Textarea
                placeholder="Paste content here…"
                value={uploadedContent}
                onChange={(e) => setUploadedContent(e.target.value)}
                className="min-h-28 rounded-2xl border-slate-200 bg-slate-50 resize-none text-left"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <UploadAction Icon={Zap}        label="Flashcards" onClick={generateFlashcards} disabled={!uploadedContent || tutorMutation.isPending} />
                <UploadAction Icon={Headphones} label="Podcast"    onClick={generatePodcast}    disabled={!uploadedContent || tutorMutation.isPending} />
                <UploadAction Icon={FileText}   label="Summary"
                  onClick={() => tutorMutation.mutate({ query: `Summarize this content: ${uploadedContent}`, context: { type: 'content_summary' } })}
                  disabled={!uploadedContent || tutorMutation.isPending}
                />
              </div>
            </div>
          )}

          {/* Voice */}
          {activeTab === 'voice' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mx-auto">
                  <Mic className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Voice OSCE Simulator</h3>
                  <p className="text-sm text-slate-500 mt-1">Practice clinical scenarios with voice.</p>
                </div>
                <Button
                  onClick={startVoiceInteraction}
                  disabled={isListening}
                  className={`w-full h-11 rounded-2xl text-white font-semibold border-none shadow-md ${
                    isListening
                      ? 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-rose-200/50'
                      : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-teal-200/50'
                  }`}
                >
                  {isListening ? (
                    <><MicOff className="w-4 h-4 mr-2" />Listening… click to stop</>
                  ) : (
                    <><Mic className="w-4 h-4 mr-2" />Start Voice Interaction</>
                  )}
                </Button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Transcript
                </label>
                <Textarea
                  placeholder="Your voice will be transcribed here…"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="min-h-20 rounded-2xl border-slate-200 bg-slate-50 resize-none"
                />
              </div>
            </div>
          )}

          {/* Tutor Response */}
          {tutorMutation.data && (
            <div className="bg-white rounded-2xl border border-teal-100 overflow-hidden">
              <div className="bg-teal-50/70 px-4 py-3 flex items-center gap-2 border-b border-teal-100">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <p className="text-sm font-semibold text-teal-900">AI Tutor Response</p>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {tutorMutation.data.response}
                </p>

                {tutorMutation.data.studyTips?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Study Tips</h4>
                    <ul className="space-y-1.5">
                      {tutorMutation.data.studyTips.map((tip: string, i: number) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tutorMutation.data.mnemonics?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Memory Aids</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {tutorMutation.data.mnemonics.map((m: string, i: number) => (
                        <Badge key={i} className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tutorMutation.data.relatedConcepts?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Related Concepts</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {tutorMutation.data.relatedConcepts.map((c: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-slate-200 text-slate-600">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tutorMutation.error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700">
              Sorry, I'm having trouble responding right now. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  Icon, label, onClick, disabled, primary,
}: {
  Icon: typeof MessageCircle;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group h-24 rounded-2xl border flex flex-col items-center justify-center gap-2 px-3 text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        primary
          ? 'bg-gradient-to-br from-teal-500 to-teal-600 border-transparent text-white shadow-md shadow-teal-200/50 hover:shadow-lg hover:shadow-teal-200/60'
          : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50/40'
      }`}
    >
      <Icon className={`w-5 h-5 ${primary ? 'text-white' : 'text-teal-600'}`} />
      <span className="text-sm font-semibold leading-tight">{label}</span>
    </button>
  );
}

function UploadAction({
  Icon, label, onClick, disabled,
}: {
  Icon: typeof Zap;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="h-10 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
