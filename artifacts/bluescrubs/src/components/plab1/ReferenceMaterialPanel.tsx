import { useState } from "react";
import { BookOpen, ExternalLink, ChevronDown } from "lucide-react";
import { buildDynamicLink, getNICEReferencesForQuestion } from "@/lib/clinical-links";

interface ReferenceMaterialPanelProps {
  question: any;
}

export function ReferenceMaterialPanel({ question }: ReferenceMaterialPanelProps) {
  const [open, setOpen] = useState(false);

  const niceRefs = getNICEReferencesForQuestion(question);
  const qTopic = question.topic || question.category || '';
  const cat = (question.category || '').toLowerCase();
  const isEthics = /ethics|consent|professionalism|communication|legal|capacity|safeguarding/i.test(cat + ' ' + qTopic.toLowerCase());

  const specialtyChips: { label: string; url: string }[] = [];
  if (cat.includes('cardio')) { const l = buildDynamicLink('ESC Guidelines', qTopic); if (l) specialtyChips.push({ label: l.label, url: l.url }); }
  if (cat.includes('respiratory')) { const l = buildDynamicLink('BTS Guidelines', qTopic); if (l) specialtyChips.push({ label: l.label, url: l.url }); }
  if (cat.includes('gastro')) { const l = buildDynamicLink('BSG Guidelines', qTopic); if (l) specialtyChips.push({ label: l.label, url: l.url }); }
  if (cat.includes('obstetric') || cat.includes('gynaecol')) { const l = buildDynamicLink('RCOG Guidelines', qTopic); if (l) specialtyChips.push({ label: l.label, url: l.url }); }
  if (isEthics) { const l = buildDynamicLink('GMC Good Medical Practice', qTopic); if (l) specialtyChips.push({ label: l.label, url: l.url }); }

  const bnfCardUrl = qTopic ? `https://bnf.nice.org.uk/search/?q=${encodeURIComponent(qTopic)}` : 'https://bnf.nice.org.uk/';
  const bnfCardTitle = qTopic ? `BNF — ${qTopic}` : 'BNF';

  const officialRefs = niceRefs.length === 0 && question.references
    ? (question.references as any[])
    : [];

  if (niceRefs.length === 0 && officialRefs.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-600 hover:to-cyan-600 transition-colors px-4 py-2.5 flex items-center justify-between"
        aria-expanded={open}
      >
        <span className="text-white font-semibold text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-200" />
          Reference Material
        </span>
        <ChevronDown className={`w-4 h-4 text-teal-200 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="bg-slate-50 p-3 space-y-2">
          {niceRefs.map((ref, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg border p-3 flex items-start justify-between gap-3 ${
                ref.primary ? 'border-green-400 ring-1 ring-green-100' : 'border-slate-200'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  {ref.primary && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-600 text-white uppercase tracking-wide">
                      Primary
                    </span>
                  )}
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                    ref.type === 'NICE Guideline' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {ref.type}
                  </span>
                </div>
                <a href={ref.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-700 hover:text-blue-900 underline underline-offset-2 inline-flex items-center gap-1">
                  {ref.title}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                </a>
                <p className="text-xs text-slate-500 mt-0.5 italic">{ref.relevance}</p>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-lg border border-slate-200 p-3 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium border bg-indigo-50 text-indigo-700 border-indigo-200">
                  BNF
                </span>
              </div>
              <a href={bnfCardUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-blue-700 hover:text-blue-900 underline underline-offset-2 inline-flex items-center gap-1">
                {bnfCardTitle}
                <ExternalLink className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              </a>
              <p className="text-xs text-slate-500 mt-0.5 italic">Drug dosing, interactions and prescribing information</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium border bg-sky-50 text-sky-700 border-sky-200">
                  CKS
                </span>
              </div>
              <a
                href={qTopic ? `https://cks.nice.org.uk/search/?q=${encodeURIComponent(qTopic)}` : 'https://cks.nice.org.uk/'}
                target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-blue-700 hover:text-blue-900 underline underline-offset-2 inline-flex items-center gap-1">
                {qTopic ? `CKS — ${qTopic}` : 'NICE Clinical Knowledge Summaries'}
                <ExternalLink className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              </a>
              <p className="text-xs text-slate-500 mt-0.5 italic">Primary care clinical guidance and management summaries</p>
            </div>
          </div>

          {officialRefs.map((reference: any, index: number) => {
            const refTitle = typeof reference === 'string' ? reference : reference.title || reference.text || '';
            const builtLink = buildDynamicLink(refTitle, qTopic);
            const refUrl = (typeof reference === 'object' && reference.url) || builtLink?.url || null;
            if (!refUrl) return null;
            return (
              <div key={index} className="bg-white rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500 mb-1">{refTitle}</p>
                <a href={refUrl} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-700 hover:text-blue-900 underline underline-offset-2 inline-flex items-center gap-1">
                  View Guidelines
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            );
          })}

          {specialtyChips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {specialtyChips.map((chip, i) => (
                <a key={i} href={chip.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors">
                  {chip.label}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
