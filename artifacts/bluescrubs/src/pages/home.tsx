import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Search, Bell, BookOpen, Stethoscope, Sparkles, Timer,
  ChevronRight, Flame, Award, Heart, Brain, Activity, Pill,
  CheckCircle, TrendingUp,
} from "lucide-react";
import type { UserStats, CommunityPost } from "@/lib/types";

/* ── Premium topic illustrations (soft fills, brand palette) ───────── */
type IllProps = { className?: string };

const HeartIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="heartG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
    </defs>
    <path
      d="M32 53s-18-10.4-18-23.2C14 22.3 19.6 17 26.2 17c3.6 0 6.6 1.7 8.8 4.6C37.2 18.7 40.2 17 43.8 17 50.4 17 56 22.3 56 29.8 56 42.6 38 53 38 53"
      fill="url(#heartG)"
    />
    <path d="M22 30c1.5-3.4 4.2-5.6 7.8-6.2" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".7" />
    <path d="M26 38l4-4 3 5 4-7 5 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BrainIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="brainG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c4b5fd" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <path
      d="M22 14c-4 0-7 3-7 7 0 1.4.4 2.7 1 3.8C13.2 26.2 12 28.7 12 31.5c0 3 1.4 5.6 3.6 7.2-.4 1-.6 2.1-.6 3.3 0 4.4 3.6 8 8 8 1.4 0 2.7-.4 3.9-1 1.2.6 2.5 1 3.9 1h2.4c1.4 0 2.7-.4 3.9-1 1.2.6 2.5 1 3.9 1 4.4 0 8-3.6 8-8 0-1.2-.2-2.3-.6-3.3 2.2-1.6 3.6-4.2 3.6-7.2 0-2.8-1.2-5.3-3-7C50.6 23.7 51 22.4 51 21c0-4-3-7-7-7-2.4 0-4.5 1.1-5.8 2.9C36.7 15.7 34.4 14 32 14c-2.4 0-4.7 1.7-6.2 2.9C24.5 15.1 22.4 14 22 14z"
      fill="url(#brainG)"
    />
    <path
      d="M32 16v34M22 24c2 1 3 3 3 5M42 24c-2 1-3 3-3 5M20 34c2 0 4 1 5 3M44 34c-2 0-4 1-5 3M26 44c1.5-1 3-1.5 6-1.5s4.5.5 6 1.5"
      stroke="#fff"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity=".85"
    />
  </svg>
);

const LungsIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="lungG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5eead4" />
        <stop offset="100%" stopColor="#0d9488" />
      </linearGradient>
    </defs>
    <path d="M32 14v22" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="14" r="2.2" fill="#0f766e" />
    <path
      d="M30 22c0 4-1 6-3 9-3 4.5-9 7-9 14 0 4 2 7 6 7 3 0 6-2 6-6V22zM34 22c0 4 1 6 3 9 3 4.5 9 7 9 14 0 4-2 7-6 7-3 0-6-2-6-6V22z"
      fill="url(#lungG)"
    />
    <path d="M22 36c1.5 1 2.5 2.5 3 4M42 36c-1.5 1-2.5 2.5-3 4M21 44c2 .5 3.5 1.5 4.5 3M43 44c-2 .5-3.5 1.5-4.5 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".75" />
  </svg>
);

const BabyIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="babyG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <path d="M20 22c0-8 5.4-12 12-12s12 4 12 12v4c0 6.6-5.4 12-12 12s-12-5.4-12-12v-4z" fill="url(#babyG)" />
    <path d="M20 24c-2 0-3.5 1.5-3.5 3.5S18 31 20 31M44 24c2 0 3.5 1.5 3.5 3.5S46 31 44 31" fill="url(#babyG)" />
    <circle cx="27" cy="26" r="1.6" fill="#7c2d12" />
    <circle cx="37" cy="26" r="1.6" fill="#7c2d12" />
    <path d="M28 32c1.2 1.4 2.5 2 4 2s2.8-.6 4-2" stroke="#7c2d12" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M22 18c2-3 5-5 10-5s8 2 10 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".7" fill="none" />
    <path d="M32 42v8M24 50h16" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const DEMO_USER = {
  id: 1,
  username: "Dr. Sarah Ahmed",
  studyStreak: 12,
  totalPoints: 2847,
};

const CATEGORIES = [
  { slug: "cardiology",  label: "Cardiology",  Illus: HeartIllustration, tint: "bg-rose-50/70" },
  { slug: "neurology",   label: "Neurology",   Illus: BrainIllustration, tint: "bg-violet-50/70" },
  { slug: "respiratory", label: "Respiratory", Illus: LungsIllustration, tint: "bg-teal-50/70" },
  { slug: "paediatrics", label: "Paediatrics", Illus: BabyIllustration,  tint: "bg-amber-50/70" },
];

const SHORTCUTS = [
  { to: "/plab1-new",         label: "PLAB 1",  desc: "MCQ practice",        Icon: BookOpen,    accent: "from-teal-500 to-teal-600" },
  { to: "/plab2-osce",        label: "PLAB 2",  desc: "OSCE stations",       Icon: Stethoscope, accent: "from-teal-600 to-emerald-600" },
  { to: "/adaptive-learning", label: "Smart",   desc: "Adaptive sessions",   Icon: Sparkles,    accent: "from-teal-500 to-cyan-600" },
  { to: "/plab1-new",         label: "Mocks",   desc: "Timed full mock",     Icon: Timer,       accent: "from-teal-600 to-teal-700" },
];

const RECOMMENDED = [
  { slug: "cardiology",  title: "Cardiology Essentials",  meta: "32 questions",  Icon: Heart,      tint: "bg-rose-50 text-rose-600" },
  { slug: "neurology",   title: "Neurology High-Yield",   meta: "24 questions",  Icon: Brain,      tint: "bg-violet-50 text-violet-600" },
  { slug: "respiratory", title: "Respiratory Review",     meta: "20 questions",  Icon: Activity,   tint: "bg-sky-50 text-sky-600" },
  { slug: "pharmacology",title: "Pharmacology Quick-Fire", meta: "15 questions", Icon: Pill,       tint: "bg-emerald-50 text-emerald-600" },
];

export default function Home() {
  const { data: userStats } = useQuery<UserStats>({
    queryKey: [`/api/users/${DEMO_USER.id}/stats`],
  });
  const { data: communityPosts } = useQuery<(CommunityPost & { author: { username: string } })[]>({
    queryKey: [`/api/community/posts?limit=2`],
  });

  const firstName = DEMO_USER.username.split(" ").slice(-1)[0];
  const initials = DEMO_USER.username.split(" ").slice(-2).map(p => p[0]).join("");

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      <div className="max-w-[680px] md:max-w-5xl mx-auto px-4 pt-6 space-y-5">

        {/* Top bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm shadow-teal-200">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Welcome back</p>
              <p className="text-sm font-bold text-slate-900 truncate">{firstName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-teal-700 hover:border-teal-200"
              aria-label="Search"
              data-testid="button-search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-teal-700 hover:border-teal-200 relative"
              aria-label="Notifications"
              data-testid="button-notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>

        {/* Hero CTA */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-5 text-white shadow-sm shadow-teal-200">
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-4 bottom-0 w-28 h-28 rounded-full bg-white/5" />
          <div className="relative max-w-[78%]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-50">
                Ready to study?
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight">Continue your PLAB journey</h1>
            <p className="text-sm text-teal-50 mt-1">Pick up where you left off.</p>
            <Link
              href="/plab1-new"
              className="hero-cta inline-flex items-center gap-1 mt-4 h-10 px-5 rounded-full text-sm font-semibold shadow-sm"
              style={{ backgroundColor: '#ffffff', color: '#0f766e' }}
              data-testid="button-start-practising"
            >
              Start practising
              <ChevronRight className="w-4 h-4" style={{ color: '#0f766e' }} />
            </Link>
          </div>
          <Stethoscope className="absolute right-4 bottom-4 w-20 h-20 text-white/15" strokeWidth={1.5} />
        </section>

        {/* Streak / points stat strip */}
        <section className="grid grid-cols-2 gap-2">
          <StatPill Icon={Flame}  label="Day streak"  value={`${DEMO_USER.studyStreak}`} />
          <StatPill Icon={Award}  label="Points"      value={DEMO_USER.totalPoints.toLocaleString()} />
        </section>

        {/* Shortcuts row */}
        <section>
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-base font-bold text-slate-900">Quick start</h2>
            <Link href="/more" className="text-xs font-medium text-teal-700 hover:text-teal-800">See all</Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SHORTCUTS.map((s) => (
              <Link
                key={s.label}
                href={s.to}
                className="flex flex-col items-center gap-2 group"
                data-testid={`shortcut-${s.label.toLowerCase()}`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.accent} flex items-center justify-center shadow-sm shadow-teal-200 group-hover:scale-[1.03] transition-transform`}>
                  <s.Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">{s.label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{s.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Pick a topic — circular category tiles */}
        <section>
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-base font-bold text-slate-900">Pick a topic</h2>
            <Link href="/plab1-new" className="text-xs font-medium text-teal-700 hover:text-teal-800">See all</Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/plab1-new?category=${c.slug}`}
                className="flex flex-col items-center gap-2 group"
                data-testid={`topic-${c.slug}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${c.tint} ring-1 ring-slate-100 group-hover:ring-teal-200 group-hover:scale-[1.03] transition shadow-sm`}>
                  <c.Illus className="w-11 h-11" />
                </div>
                <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
                  {c.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Continue practising — list */}
        <section>
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-base font-bold text-slate-900">Recommended</h2>
            <Link href="/plab1-new" className="text-xs font-medium text-teal-700 hover:text-teal-800">See all</Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 overflow-hidden">
            {RECOMMENDED.map((r) => (
              <Link
                key={r.slug}
                href={`/plab1-new?category=${r.slug}`}
                className="flex items-center gap-3 p-4 hover:bg-slate-50 transition"
                data-testid={`recommended-${r.slug}`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${r.tint} shrink-0`}>
                  <r.Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{r.title}</p>
                  <p className="text-xs text-slate-500">{r.meta}</p>
                </div>
                <span className="h-8 px-3 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white text-xs font-semibold flex items-center gap-1 shrink-0">
                  Start
                  <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Today */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900">Today</h2>
            <Link href="/analytics" className="text-xs font-medium text-teal-700 hover:text-teal-800">Details</Link>
          </div>
          <ul className="space-y-3">
            <ActivityRow Icon={CheckCircle} tint="bg-emerald-50 text-emerald-600" title="Completed cardiology quiz" meta="8/10 · 2h ago" />
            <ActivityRow Icon={TrendingUp}  tint="bg-teal-50 text-teal-700"      title="Respiratory accuracy +5%" meta={userStats?.totalAnswered ? `${userStats.totalAnswered} questions answered` : "1d ago"} />
            <ActivityRow Icon={Award}       tint="bg-amber-50 text-amber-600"    title="10-day study streak"      meta="Keep going" />
          </ul>
        </section>

        {/* Community */}
        {communityPosts && communityPosts.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900">Community</h2>
              <Link href="/community" className="text-xs font-medium text-teal-700 hover:text-teal-800">View all</Link>
            </div>
            <div className="space-y-3">
              {communityPosts.slice(0, 2).map((p) => (
                <div key={p.id} className="border-l-2 border-teal-400 pl-3">
                  <p className="text-xs font-semibold text-slate-900">{p.author?.username || "Member"}</p>
                  <p className="text-sm text-slate-700 line-clamp-2">{p.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatPill({
  Icon, label, value,
}: { Icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-teal-700" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-bold text-slate-900 leading-none tabular-nums">{value}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ActivityRow({
  Icon, tint, title, meta,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  tint: string; title: string; meta: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tint} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{title}</p>
        <p className="text-[11px] text-slate-500">{meta}</p>
      </div>
    </li>
  );
}
