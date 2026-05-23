import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, Clock, Calendar, CheckCircle, Sparkles, ChevronRight, TrendingUp, Star } from "lucide-react";

type DueCard = {
  id: string;
  specialty: string;
  concept: string;
  interval: number;
  confidence: number;
};

type ScheduleDay = { date: string; dueCount: number; newCount: number };

type SessionData = {
  dueToday: number;
  newCards: number;
  completedToday: number;
  retention: number;
  mastery: number;
  cards: DueCard[];
  schedule: ScheduleDay[];
};

const FALLBACK: SessionData = {
  dueToday: 12,
  newCards: 4,
  completedToday: 0,
  retention: 85,
  mastery: 72,
  cards: [
    { id: "1", specialty: "Cardiology",  concept: "Heart Failure Management",       interval: 1, confidence: 3 },
    { id: "2", specialty: "Neurology",   concept: "Stroke Acute Management",        interval: 2, confidence: 2 },
    { id: "3", specialty: "Respiratory", concept: "Asthma Severity Assessment",     interval: 3, confidence: 4 },
    { id: "4", specialty: "Endocrine",   concept: "DKA Resuscitation Pathway",      interval: 1, confidence: 2 },
    { id: "5", specialty: "Pharmacology",concept: "Anticoagulation in AF",          interval: 5, confidence: 3 },
  ],
  schedule: [
    { date: "Tomorrow", dueCount: 8,  newCount: 3 },
    { date: "In 2 days", dueCount: 5,  newCount: 2 },
    { date: "In 3 days", dueCount: 11, newCount: 4 },
  ],
};

function intervalLabel(days: number) {
  if (days === 1) return "Tomorrow";
  if (days < 7)  return `${days} days`;
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  return `${Math.floor(days / 30)} months`;
}

export default function SpacedRepetition() {
  const { data } = useQuery<SessionData>({
    queryKey: ["/api/spaced-repetition/session"],
    queryFn: async () => FALLBACK,
    staleTime: 60_000,
  });
  const session = data ?? FALLBACK;
  const [tab, setTab] = useState<"due" | "schedule" | "progress">("due");

  const progress = useMemo(() => {
    const total = session.dueToday + session.newCards;
    if (!total) return 0;
    return Math.round((session.completedToday / total) * 100);
  }, [session]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      <div className="max-w-[680px] mx-auto px-4 pt-6 space-y-5">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-5 text-white shadow-sm shadow-teal-200">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-2 bottom-0 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-50">
                Spaced Learning
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight">Review what matters today</h1>
            <p className="text-sm text-teal-50 mt-1 max-w-[34ch]">
              Concepts come back at the right time so they actually stick.
            </p>
          </div>
        </section>

        {/* Today summary card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Today's review</h2>
              <p className="text-xs text-slate-500">
                {session.dueToday} due · {session.newCards} new
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Brain className="w-5 h-5 text-teal-700" />
            </div>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            type="button"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold text-sm shadow-sm shadow-teal-200 flex items-center justify-center gap-2"
            data-testid="button-start-spaced-session"
          >
            Start review session
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>

        {/* Stats strip */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard label="Retention" value={`${session.retention}%`} Icon={TrendingUp} tint="text-teal-700 bg-teal-50" />
          <StatCard label="Mastery"   value={`${session.mastery}%`}   Icon={Star}         tint="text-amber-700 bg-amber-50" />
        </section>

        {/* Tabs */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
          <div className="grid grid-cols-3 gap-1 mb-2">
            {(["due", "schedule", "progress"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={`text-xs font-semibold py-2 rounded-lg transition-colors ${
                  tab === k
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                data-testid={`tab-${k}`}
              >
                {k === "due" ? "Due now" : k === "schedule" ? "Schedule" : "Progress"}
              </button>
            ))}
          </div>

          <div className="p-3">
            {tab === "due" && (
              <ul className="divide-y divide-slate-100">
                {session.cards.map((c) => (
                  <li key={c.id} className="py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{c.concept}</div>
                      <div className="text-[11px] text-slate-500">
                        {c.specialty} · next in {intervalLabel(c.interval)}
                      </div>
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-1 rounded-md">
                      Review
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {tab === "schedule" && (
              <ul className="divide-y divide-slate-100">
                {session.schedule.map((d) => (
                  <li key={d.date} className="py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">{d.date}</div>
                      <div className="text-[11px] text-slate-500">
                        {d.dueCount} due · {d.newCount} new
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {tab === "progress" && (
              <div className="space-y-3 py-1">
                <ProgressRow label="Retention rate" value={session.retention} />
                <ProgressRow label="Concept mastery" value={session.mastery} />
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  Reviews stay short and adapt to your recall.
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label, value, Icon, tint,
}: { label: string; value: string; Icon: React.ComponentType<{ className?: string }>; tint: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tint}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-lg font-bold text-slate-900 tabular-nums">{value}</div>
        <div className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-700">{label}</span>
        <span className="text-xs font-semibold text-slate-900 tabular-nums">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-teal-600"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
