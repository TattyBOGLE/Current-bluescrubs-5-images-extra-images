import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { buildDynamicLink, getNICEReferencesForQuestion, toCKSSlug } from "@/lib/clinical-links";

interface ReferenceMaterialPanelProps {
  question: any;
}

type RefCard = {
  url: string;
  title: string;
  badge: string;
  badgeStyle: string;
  relevance: string;
  primary: boolean;
};

const BADGE_STYLES: Record<string, string> = {
  'NICE Guideline': 'bg-blue-50 text-blue-700 border-blue-200',
  'NICE CKS':       'bg-sky-50 text-sky-700 border-sky-200',
  'BNF':            'bg-indigo-50 text-indigo-700 border-indigo-200',
  'ESC':            'bg-emerald-50 text-emerald-700 border-emerald-200',
  'BTS':            'bg-emerald-50 text-emerald-700 border-emerald-200',
  'BSG':            'bg-emerald-50 text-emerald-700 border-emerald-200',
  'RCOG':           'bg-emerald-50 text-emerald-700 border-emerald-200',
  'RCGP':           'bg-emerald-50 text-emerald-700 border-emerald-200',
  'SIGN':           'bg-emerald-50 text-emerald-700 border-emerald-200',
  'GMC':            'bg-purple-50 text-purple-700 border-purple-200',
};

function canonicalBadge(raw: string): string {
  const t = raw.trim();
  if (/\bCKS\b/i.test(t)) return 'NICE CKS';
  if (/\bNICE\b/i.test(t) && !/CKS/i.test(t)) return 'NICE Guideline';
  if (/\bBNF\b/i.test(t)) return 'BNF';
  if (/\bESC\b/i.test(t)) return 'ESC';
  if (/\bBTS\b/i.test(t)) return 'BTS';
  if (/\bBSG\b/i.test(t)) return 'BSG';
  if (/\bRCOG\b/i.test(t)) return 'RCOG';
  if (/\bRCGP\b/i.test(t)) return 'RCGP';
  if (/\bSIGN\b/i.test(t)) return 'SIGN';
  if (/\bGMC\b/i.test(t)) return 'GMC';
  return t;
}

export function ReferenceMaterialPanel({ question }: ReferenceMaterialPanelProps) {
  const [open, setOpen] = useState(false);

  const niceRefs = getNICEReferencesForQuestion(question);
  const qTopic = question.topic || question.category || '';
  const cat = (question.category || '').toLowerCase();
  const isEthics = /ethics|consent|professionalism|communication|legal|capacity|safeguarding/i.test(cat + ' ' + qTopic.toLowerCase());

  // Build a unified candidate list from all sources
  const candidates: RefCard[] = [];

  // 1. NICE refs (primary source)
  for (const ref of niceRefs) {
    const badge = canonicalBadge(ref.type);
    candidates.push({
      url: ref.url,
      title: ref.title,
      badge,
      badgeStyle: BADGE_STYLES[badge] ?? 'bg-slate-50 text-slate-700 border-slate-200',
      relevance: ref.relevance,
      primary: !!ref.primary,
    });
  }

  // 2. CKS hardcoded card — use the canonical topic URL (same as getNICEReferencesForQuestion)
  //    so URL-based dedup fires correctly. Fall back to search only when no slug exists.
  const cksTopicSlug = qTopic ? toCKSSlug(qTopic) : null;
  const cksUrl = cksTopicSlug
    ? `https://cks.nice.org.uk/topics/${cksTopicSlug}/`
    : (qTopic
        ? `https://cks.nice.org.uk/search/?q=${encodeURIComponent(qTopic)}`
        : 'https://cks.nice.org.uk/');
  candidates.push({
    url: cksUrl,
    title: qTopic ? `NICE CKS — ${qTopic}` : 'NICE Clinical Knowledge Summaries',
    badge: 'NICE CKS',
    badgeStyle: BADGE_STYLES['NICE CKS'],
    relevance: 'Primary care clinical guidance and management summaries',
    primary: false,
  });

  // 3. BNF hardcoded card
  const bnfUrl = qTopic ? `https://bnf.nice.org.uk/search/?q=${encodeURIComponent(qTopic)}` : 'https://bnf.nice.org.uk/';
  candidates.push({
    url: bnfUrl,
    title: qTopic ? `BNF — ${qTopic}` : 'BNF',
    badge: 'BNF',
    badgeStyle: BADGE_STYLES['BNF'],
    relevance: 'Drug dosing, interactions and prescribing information',
    primary: false,
  });

  // 4. Specialty guidelines (ESC, BTS, BSG, RCOG, GMC)
  const specialtySources: [boolean, string][] = [
    [cat.includes('cardio'), 'ESC Guidelines'],
    [cat.includes('respiratory'), 'BTS Guidelines'],
    [cat.includes('gastro'), 'BSG Guidelines'],
    [cat.includes('obstetric') || cat.includes('gynaecol'), 'RCOG Guidelines'],
    [isEthics, 'GMC Good Medical Practice'],
  ];
  for (const [condition, source] of specialtySources) {
    if (!condition) continue;
    const l = buildDynamicLink(source, qTopic);
    if (!l) continue;
    const badge = canonicalBadge(l.label || source);
    candidates.push({
      url: l.url,
      title: l.label,
      badge,
      badgeStyle: BADGE_STYLES[badge] ?? 'bg-emerald-50 text-emerald-700 border-emerald-200',
      relevance: '',
      primary: false,
    });
  }

  // 5. officialRefs from question.references (only when no niceRefs)
  const officialRefs = niceRefs.length === 0 && question.references
    ? (question.references as any[])
    : [];
  for (const reference of officialRefs) {
    const refTitle = typeof reference === 'string' ? reference : reference.title || reference.text || '';
    const builtLink = buildDynamicLink(refTitle, qTopic);
    const refUrl = (typeof reference === 'object' && reference.url) || builtLink?.url || null;
    if (!refUrl) continue;
    const badge = canonicalBadge(builtLink?.label || refTitle);
    candidates.push({
      url: refUrl,
      title: refTitle,
      badge,
      badgeStyle: BADGE_STYLES[badge] ?? 'bg-slate-50 text-slate-700 border-slate-200',
      relevance: '',
      primary: false,
    });
  }

  if (candidates.length === 0) return null;

  // Sort: primary first
  candidates.sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));

  // Deduplicate by URL first (normalised), then also by label+URL together
  // as a belt-and-braces guard against same-label/different-URL duplicates.
  const seenUrls = new Set<string>();
  const seenLabelUrl = new Set<string>();
  const deduped = candidates.filter(ref => {
    const urlKey = ref.url.replace(/\/+$/, '').toLowerCase();
    const labelUrlKey = `${ref.title.trim().toLowerCase()}||${urlKey}`;
    if (seenUrls.has(urlKey) || seenLabelUrl.has(labelUrlKey)) return false;
    seenUrls.add(urlKey);
    seenLabelUrl.add(labelUrlKey);
    return true;
  });

  // Cap at 4 cards
  const displayed = deduped.slice(0, 4);

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
          {displayed.map((ref, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg border p-3 ${
                ref.primary ? 'border-green-400 ring-1 ring-green-100' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                {ref.primary && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-600 text-white uppercase tracking-wide">
                    Primary
                  </span>
                )}
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${ref.badgeStyle}`}>
                  {ref.badge}
                </span>
              </div>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-sm font-medium text-blue-700 hover:text-blue-900 underline underline-offset-2"
              >
                {ref.title}
              </a>
              {ref.relevance && (
                <p className="text-xs text-slate-500 mt-0.5 italic">{ref.relevance}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
