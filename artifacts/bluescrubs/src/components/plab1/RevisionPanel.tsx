import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { NICERef } from "@/lib/clinical-links";

interface RevisionPanelProps {
  question: any;
  tips: { type: string; text: string }[];
  niceRefs: NICERef[];
}

export function RevisionPanel({ question, tips, niceRefs }: RevisionPanelProps) {
  const [open, setOpen] = useState(false);

  const pearl = tips.find(t => t.type === 'pearl');
  const pitfall = tips.find(t => t.type === 'pitfall');
  const exam = tips.find(t => t.type === 'exam');
  const primaryRef = niceRefs.find(r => r.primary) ?? niceRefs[0];

  const keyClueMatch = exam?.text.match(/['"](.*?)['"]/);
  const keyClue = keyClueMatch ? keyClueMatch[1] : null;

  return (
    <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 transition-colors px-4 py-3 flex items-center justify-between"
        aria-expanded={open}
      >
        <span className="text-white font-semibold text-sm flex items-center gap-2">
          📚 Revision Panel
        </span>
        <svg
          className={`w-4 h-4 text-white transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="bg-white divide-y divide-slate-100">
          <div className="p-4 border-l-4 border-l-amber-400">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">📖 What to Read</p>
            {primaryRef ? (
              <div className="space-y-1.5">
                <a
                  href={primaryRef.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900 underline underline-offset-2"
                >
                  {primaryRef.title}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
                {pearl && (
                  <>
                    <p className="text-xs text-slate-600">
                      <span className="font-medium">Navigate to:</span> the section covering {
                        pearl.text.match(/NICE (NG|CG|QS)\d+/i)?.[0]
                          ? `the guidance referenced in ${pearl.text.match(/NICE (NG|CG|QS)\d+/i)![0]}`
                          : 'the relevant management section'
                      }
                    </p>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      {pearl.text.split('.')[0]}.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No specific guideline reference available for this question.</p>
            )}
          </div>

          <div className="p-4 border-l-4 border-l-rose-400">
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-2">⚠️ Common Mistake</p>
            {pitfall ? (
              <div className="space-y-1.5">
                <p className="text-sm text-slate-700 leading-relaxed">{pitfall.text}</p>
                {keyClue && (
                  <p className="text-xs text-slate-600 mt-1">
                    The clue is <strong className="text-slate-900">"{keyClue}"</strong> — this phrase in the stem points directly to the correct answer.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Study tip unavailable — check the explanation above for common errors.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
