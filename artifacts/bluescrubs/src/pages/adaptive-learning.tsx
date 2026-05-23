import { useState } from "react";
import { AdaptiveLearningDashboard } from "@/components/adaptive-learning-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Target,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BarChart3,
} from "lucide-react";

const FEATURE_CARDS = [
  {
    Icon: Target,
    title: "Adaptive Questions",
    desc: "Difficulty adjusts to your performance in real time.",
    tint: "bg-teal-50",
    color: "text-teal-700",
  },
  {
    Icon: AlertTriangle,
    title: "Weakness Detection",
    desc: "Spots specific knowledge gaps from your answer patterns.",
    tint: "bg-slate-100",
    color: "text-slate-700",
  },
  {
    Icon: TrendingUp,
    title: "Success Prediction",
    desc: "Estimates your exam readiness with confidence intervals.",
    tint: "bg-teal-50",
    color: "text-teal-700",
  },
  {
    Icon: Lightbulb,
    title: "Smart Generation",
    desc: "Creates targeted practice using your authentic question bank.",
    tint: "bg-slate-100",
    color: "text-slate-700",
  },
];

const DIFFERENTIATORS = [
  { tag: "Authentic", title: "Real Medical Content", desc: "Built on genuine PLAB scenarios, not synthetic data." },
  { tag: "Offline", title: "Works Without Internet", desc: "Full functionality without any external API calls." },
  { tag: "UK-aligned", title: "NICE / BNF / CKS / GMC", desc: "Aligned with current UK clinical guidelines." },
  { tag: "Predictive", title: "Exam Readiness Score", desc: "Statistical models predict your success probability." },
  { tag: "Real-time", title: "Instant Feedback", desc: "Knowledge gaps surfaced as you practise." },
  { tag: "Dynamic", title: "Personal Difficulty", desc: "Pace and challenge tuned to your progress." },
];

export default function AdaptiveLearning() {
  const [currentUserId] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      <div className="max-w-[680px] md:max-w-5xl mx-auto px-4 pt-6 space-y-6">

        {/* Hero sheet */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm shadow-teal-200">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                Adaptive Learning
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Practice that learns from how you study.
              </p>
            </div>
          </div>
          <p className="text-[15px] text-slate-700 leading-relaxed mt-4">
            A system that understands your learning patterns, spots weaknesses in real
            time, and tunes question difficulty to keep you progressing.
          </p>
        </section>

        {/* Feature grid */}
        <section className="grid grid-cols-2 gap-3">
          {FEATURE_CARDS.map(({ Icon, title, desc, tint, color }) => (
            <div
              key={title}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4"
            >
              <div className={`w-10 h-10 rounded-xl ${tint} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{desc}</p>
            </div>
          ))}
        </section>

        {/* Dual feature cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <CardTitle className="text-base text-slate-900">Analytics Engine</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Runs entirely on-device
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {[
                  "Pattern recognition",
                  "Performance modelling",
                  "Real-time weakness scoring",
                  "Predictive readiness",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <CardTitle className="text-base text-slate-900">Question System</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Built on your authentic bank
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {[
                  "5,000+ medical questions",
                  "Difficulty adaptation",
                  "Targeted weakness drills",
                  "UK guideline coverage",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Differentiators */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Why this works</h2>
          <p className="text-xs text-slate-500 mb-4">
            What sets BlueScrubsPrep adaptive learning apart.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DIFFERENTIATORS.map(({ tag, title, desc }) => (
              <div
                key={title}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <Badge className="mb-2 bg-teal-100 text-teal-800 hover:bg-teal-100 border-none">
                  {tag}
                </Badge>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-xs text-slate-600 leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live dashboard */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 overflow-hidden">
          <AdaptiveLearningDashboard userId={currentUserId} />
        </section>
      </div>
    </div>
  );
}
