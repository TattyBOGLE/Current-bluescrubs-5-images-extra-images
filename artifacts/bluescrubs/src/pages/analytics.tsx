import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, Target, Flame, Clock, Award,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";

type Specialty = {
  total: number;
  correct: number;
  accuracy: number;
  improvementTrend: number;
};

type Analytics = {
  totalQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  averageTimePerQuestion: number;
  studyStreak: number;
  specialtyBreakdown: Record<string, Specialty>;
  weeklyProgress: {
    questionsThisWeek: number;
    accuracyThisWeek: number;
    timeStudiedThisWeek: number;
  };
  achievements: Array<{
    id: number;
    name: string;
    description: string;
    category: string;
    points: number;
  }>;
};

const FALLBACK: Analytics = {
  totalQuestions: 847,
  correctAnswers: 651,
  accuracyRate: 77,
  averageTimePerQuestion: 84,
  studyStreak: 12,
  specialtyBreakdown: {
    Cardiology:       { total: 156, correct: 124, accuracy: 79, improvementTrend:  8 },
    Respiratory:      { total: 142, correct:  98, accuracy: 69, improvementTrend: -5 },
    Neurology:        { total: 134, correct:  89, accuracy: 66, improvementTrend: 12 },
    Gastroenterology: { total: 128, correct: 102, accuracy: 80, improvementTrend:  3 },
    Endocrinology:    { total:  98, correct:  72, accuracy: 73, improvementTrend:  6 },
    Renal:            { total:  84, correct:  60, accuracy: 71, improvementTrend:  2 },
  },
  weeklyProgress: {
    questionsThisWeek: 147,
    accuracyThisWeek: 78,
    timeStudiedThisWeek: 1260,
  },
  achievements: [
    { id: 1, name: "Three-Level Mastery",   description: "Completed Basic, Intermediate, and Advanced levels", category: "Progression",      points: 300 },
    { id: 2, name: "Guidelines Expert",     description: "Perfect score on NICE/BTS guideline questions",       category: "Medical Knowledge", points: 250 },
    { id: 3, name: "Consistency Champion",  description: "Studied every day for 12 days running",               category: "Habit",             points: 220 },
    { id: 4, name: "Cardiology Specialist", description: "Reached 80% accuracy in Cardiology",                  category: "Specialty",         points: 180 },
  ],
};

const PERFORMANCE_HISTORY = [
  { date: "Mon", accuracy: 72, questions: 25 },
  { date: "Tue", accuracy: 74, questions: 30 },
  { date: "Wed", accuracy: 78, questions: 28 },
  { date: "Thu", accuracy: 75, questions: 32 },
  { date: "Fri", accuracy: 80, questions: 35 },
  { date: "Sat", accuracy: 77, questions: 29 },
  { date: "Sun", accuracy: 82, questions: 38 },
];

function formatMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function StatCard({
  icon: Icon, label, value, sublabel, accent = "teal",
}: {
  icon: typeof Target;
  label: string;
  value: string;
  sublabel?: string;
  accent?: "teal" | "amber" | "rose" | "indigo";
}) {
  const tints: Record<string, string> = {
    teal:   "bg-teal-50 text-teal-700",
    amber:  "bg-amber-50 text-amber-700",
    rose:   "bg-rose-50 text-rose-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tints[accent]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
      {sublabel ? <div className="text-xs text-slate-500 mt-1">{sublabel}</div> : null}
    </div>
  );
}

export default function Analytics() {
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("7d");

  const { data: analytics = FALLBACK } = useQuery<Analytics>({
    queryKey: ["/api/analytics", period],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey as [string, string];
      const r = await fetch(`/api/analytics?period=${p}`, { credentials: "include" });
      if (!r.ok) throw new Error(`Analytics request failed (${r.status})`);
      return (await r.json()) as Analytics;
    },
    placeholderData: FALLBACK,
    staleTime: 60_000,
    retry: false,
  });

  const specialties = useMemo(
    () =>
      Object.entries(analytics.specialtyBreakdown)
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => a.accuracy - b.accuracy),
    [analytics],
  );

  const weakest = specialties.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700" style={{ color: '#ffffff' }}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.8)' }}>Analytics</div>
          <h1 className="text-3xl md:text-4xl font-semibold mt-1" style={{ color: '#ffffff' }}>Performance Analytics</h1>
          <p className="mt-2 max-w-2xl" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Detailed insight into your PLAB 1 preparation. Track accuracy, time, streak, and where to focus next.
          </p>

          <div className="mt-6 inline-flex rounded-full bg-white/15 backdrop-blur p-1 text-sm" role="group" aria-label="Time period">
            {(["7d", "30d", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                aria-pressed={period === p}
                className={`px-4 py-1.5 rounded-full font-medium transition ${
                  period === p
                    ? "bg-white !text-teal-700 shadow"
                    : "!text-white hover:bg-white/10"
                }`}
                data-testid={`period-${p}`}
              >
                {p === "7d" ? "Last 7 days" : p === "30d" ? "Last 30 days" : "All time"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Target} label="Accuracy" value={`${analytics.accuracyRate}%`}
            sublabel={`${analytics.correctAnswers} of ${analytics.totalQuestions} correct`} accent="teal" />
          <StatCard icon={TrendingUp} label="Questions" value={`${analytics.totalQuestions}`}
            sublabel={`${analytics.weeklyProgress.questionsThisWeek} this week`} accent="indigo" />
          <StatCard icon={Flame} label="Streak" value={`${analytics.studyStreak} days`}
            sublabel="Keep it going" accent="amber" />
          <StatCard icon={Clock} label="Avg time / question" value={`${analytics.averageTimePerQuestion}s`}
            sublabel={`${formatMinutes(analytics.weeklyProgress.timeStudiedThisWeek)} this week`} accent="rose" />
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-6xl mx-auto px-6 mt-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white border border-slate-200 rounded-xl p-1 grid grid-cols-4 w-full md:w-auto md:inline-flex">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="specialties" data-testid="tab-specialties">Specialties</TabsTrigger>
            <TabsTrigger value="progress" data-testid="tab-progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements" data-testid="tab-achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-5 space-y-5">
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-semibold text-slate-900">Accuracy this week</h2>
                  <span className="text-xs text-slate-500">Daily %</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PERFORMANCE_HISTORY} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={[60, 100]} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                        formatter={(v: number) => [`${v}%`, "Accuracy"]}
                      />
                      <Line type="monotone" dataKey="accuracy" stroke="#0d9488" strokeWidth={3}
                        dot={{ r: 4, fill: "#0d9488" }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-semibold text-slate-900">Focus next</h2>
                <p className="text-xs text-slate-500 mt-0.5">Your three weakest specialties</p>
                <div className="mt-4 space-y-3">
                  {weakest.map((s) => (
                    <div key={s.name} className="rounded-xl border border-slate-100 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-900">{s.name}</div>
                        <div className="text-sm text-slate-700">{s.accuracy}%</div>
                      </div>
                      <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-label={`${s.name} accuracy`}
                        aria-valuenow={s.accuracy} aria-valuemin={0} aria-valuemax={100}>
                        <div className="h-full bg-gradient-to-r from-teal-500 to-teal-600"
                          style={{ width: `${s.accuracy}%` }} />
                      </div>
                      <div className={`mt-2 text-xs inline-flex items-center gap-1 ${
                        s.improvementTrend >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {s.improvementTrend >= 0
                          ? <ArrowUpRight className="w-3 h-3" />
                          : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(s.improvementTrend)}% vs last week
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-xl"
                  style={{ color: '#ffffff' }}
                  onClick={() => setLocation(`/plab1?focus=${encodeURIComponent(weakest.map(w => w.name).join(","))}`)}
                  data-testid="button-practice-weakest">
                  Practice these specialties
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Specialties */}
          <TabsContent value="specialties" className="mt-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">Accuracy by specialty</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={specialties} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                      formatter={(v: number) => [`${v}%`, "Accuracy"]} />
                    <Bar dataKey="accuracy" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 grid md:grid-cols-2 gap-3">
                {specialties.map((s) => (
                  <div key={s.name} className="rounded-xl border border-slate-100 p-3"
                    data-testid={`specialty-${s.name.toLowerCase()}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-900">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.correct}/{s.total}</div>
                    </div>
                    <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-label={`${s.name} accuracy`}
                      aria-valuenow={s.accuracy} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full bg-gradient-to-r from-teal-500 to-teal-600"
                        style={{ width: `${s.accuracy}%` }} />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{s.accuracy}% accuracy</span>
                      <span className={s.improvementTrend >= 0 ? "text-emerald-600" : "text-rose-600"}>
                        {s.improvementTrend >= 0 ? "+" : ""}{s.improvementTrend}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Progress */}
          <TabsContent value="progress" className="mt-5">
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-semibold text-slate-900 mb-3">Questions answered this week</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PERFORMANCE_HISTORY} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="qGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                      <Area type="monotone" dataKey="questions" stroke="#0d9488" strokeWidth={2}
                        fill="url(#qGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                <h2 className="text-2xl font-semibold text-slate-900">This week</h2>
                <div>
                  <div className="text-xs text-slate-500">Questions</div>
                  <div className="text-2xl font-semibold text-slate-900">
                    {analytics.weeklyProgress.questionsThisWeek}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Accuracy</div>
                  <div className="text-2xl font-semibold text-slate-900">
                    {analytics.weeklyProgress.accuracyThisWeek}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Time studied</div>
                  <div className="text-2xl font-semibold text-slate-900">
                    {formatMinutes(analytics.weeklyProgress.timeStudiedThisWeek)}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="mt-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analytics.achievements.map((a) => (
                <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                  data-testid={`achievement-${a.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">
                      +{a.points} pts
                    </div>
                  </div>
                  <div className="mt-3 text-slate-900 font-semibold">{a.name}</div>
                  <div className="text-sm text-slate-500 mt-1">{a.description}</div>
                  <div className="mt-3 text-xs text-slate-400">{a.category}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
