import React from "react";
import { Lightbulb, ChevronDown, Brain, Star, Target, AlertTriangle } from "lucide-react";
import { RevisionPanel } from "./RevisionPanel";
import { ReferenceMaterialPanel } from "./ReferenceMaterialPanel";
import { getNICEReferencesForQuestion } from "@/lib/clinical-links";
import type { AIStudyTips } from "@/lib/quiz-utils";

type TipCfg = {
  label: string;
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  borderL: string;
  headerBg: string;
  textColor: string;
};

const TIP_CONFIG: Record<string, TipCfg> = {
  pearl: {
    label: 'Clinical Pearl',
    Icon: Star,
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    borderL: 'border-l-amber-500',
    headerBg: 'text-amber-700',
    textColor: 'text-slate-800',
  },
  exam: {
    label: 'Exam Technique',
    Icon: Target,
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    borderL: 'border-l-emerald-500',
    headerBg: 'text-emerald-700',
    textColor: 'text-slate-800',
  },
  pitfall: {
    label: 'Common Pitfall',
    Icon: AlertTriangle,
    iconBg: 'bg-rose-500',
    iconColor: 'text-white',
    borderL: 'border-l-rose-500',
    headerBg: 'text-rose-700',
    textColor: 'text-slate-800',
  },
};

interface StudyTipsPanelProps {
  currentQuestion: any;
  aiStudyTips: AIStudyTips | null;
  aiStudyTipsLoading: boolean;
  tipsOpen: boolean;
  setTipsOpen: (fn: (prev: boolean) => boolean) => void;
}

export function StudyTipsPanel({
  currentQuestion,
  aiStudyTips,
  aiStudyTipsLoading,
  tipsOpen,
  setTipsOpen,
}: StudyTipsPanelProps) {
  const niceRefs = getNICEReferencesForQuestion(currentQuestion);

  return (
    <>
      {/* Study Tips Section */}
      <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setTipsOpen(prev => !prev)}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-colors px-4 py-2.5 flex items-center justify-between"
          aria-expanded={tipsOpen}
        >
          <span className="text-white font-semibold text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-white flex-shrink-0" />
            High-Yield Tips &amp; Mnemonics
          </span>
          <ChevronDown className={`w-4 h-4 text-teal-100 transition-transform duration-200 ${tipsOpen ? 'rotate-180' : ''}`} />
        </button>

        {tipsOpen && (
          <div className="bg-slate-50 p-3 space-y-2.5">
            {aiStudyTipsLoading && !aiStudyTips && (
              <div className="space-y-2.5 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white border border-slate-100 rounded-2xl p-3 flex gap-3 shadow-sm">
                    <div className="w-7 h-7 bg-slate-200 rounded-xl flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-2.5 bg-slate-200 rounded w-1/3 mb-2" />
                      <div className="h-2 bg-slate-100 rounded w-full mb-1" />
                      <div className="h-2 bg-slate-100 rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {aiStudyTips && (() => {
              return (
                <>
                  {aiStudyTips.tips && aiStudyTips.tips.length > 0 && aiStudyTips.tips.map((tip, i) => {
                    const cfg = TIP_CONFIG[tip.type] ?? TIP_CONFIG['pearl'];
                    const { Icon } = cfg;
                    return (
                      <div key={i} className={`bg-white rounded-xl border border-slate-100 border-l-4 ${cfg.borderL} shadow-md flex gap-3 p-3.5`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${cfg.iconBg} flex items-center justify-center mt-0.5 shadow-sm`}>
                          <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${cfg.headerBg}`}>{cfg.label}</p>
                          <p className={`text-sm leading-relaxed ${cfg.textColor}`}>{tip.text}</p>
                        </div>
                      </div>
                    );
                  })}

                  {aiStudyTips.mnemonics.length > 0 && (
                    <>
                      {aiStudyTips.tips && aiStudyTips.tips.length > 0 && (
                        <div className="border-t border-slate-200 my-1.5" />
                      )}
                      {aiStudyTips.mnemonics.map((m, i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-100 border-l-4 border-l-violet-500 shadow-md flex gap-3 p-3.5">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center mt-0.5 shadow-sm">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-violet-700 mb-1.5">Mnemonic</p>
                            <p className="text-sm font-bold text-slate-900 mb-1">
                              {m.title.replace(/^(Topic|Mnemonic|Tip):\s*/i, '').replace(/^"|"$/g, '')}
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">{m.expansion}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              );
            })()}

            {!aiStudyTipsLoading && (!aiStudyTips || (aiStudyTips.mnemonics.length === 0 && (!aiStudyTips.tips || aiStudyTips.tips.length === 0))) && (
              <p className="text-xs text-slate-400 italic text-center py-3">
                Study tips will appear here once generated.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Revision Panel — keyed by question so open/closed
          state resets each time the user moves to a new question. */}
      {aiStudyTips && aiStudyTips.tips && aiStudyTips.tips.length > 0 && (
        <RevisionPanel
          key={`rev-${currentQuestion?.id ?? currentQuestion?.stem ?? ''}`}
          question={currentQuestion}
          tips={aiStudyTips.tips}
          niceRefs={niceRefs}
        />
      )}

      {/* Reference Material — also keyed per question so it always opens closed. */}
      <ReferenceMaterialPanel
        key={`ref-${currentQuestion?.id ?? currentQuestion?.stem ?? ''}`}
        question={currentQuestion}
      />
    </>
  );
}
