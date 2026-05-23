import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Stethoscope, Clock, Users, CheckCircle, Award, BookOpen,
  ClipboardList, Heart, Brain, AlertTriangle, ArrowLeft,
  Globe, MessageCircle, Sparkles, Send, ChevronRight,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPANDED_PLAB2_STATIONS, EnhancedOSCEStation } from "@shared/expanded-plab2-stations";
import { useQuery } from "@tanstack/react-query";
import { NeuroSettings, useNeuroAccommodations } from "@/components/neurodiversity-settings";
import { type NeuroAtypicalType, NEURO_ACCOMMODATIONS } from "@shared/neurodiversity-schema";
import { AudioSupport } from "@/components/audio-support";

interface OSCEStation {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration: number;
  description?: string;
  scenario: string;
  instructions: {
    candidate: string;
    examiner: string;
    standardizedPatient?: string;
  };
  markingCriteria: Array<{
    category: string;
    maxMarks: number;
    criteria: string[];
  }>;
  keyActions: string[];
  redFlags: string[];
  medications?: any[];
  bnfGuidance?: string;
  clinicalReasoning?: string[];
  examFrequency?: string;
}

const STATION_TYPES = [
  { value: "all",              label: "All" },
  { value: "history",          label: "History" },
  { value: "examination",      label: "Exam" },
  { value: "explanation",      label: "Explain" },
  { value: "ethics",           label: "Ethics" },
  { value: "acute-care",       label: "Acute" },
  { value: "practical-skills", label: "Skills" },
];

const LANGUAGES = [
  { v: "en", label: "English" },
  { v: "ar", label: "Arabic" },
  { v: "hi", label: "Hindi" },
  { v: "ur", label: "Urdu" },
  { v: "bn", label: "Bengali" },
  { v: "es", label: "Spanish" },
  { v: "fr", label: "French" },
  { v: "de", label: "German" },
  { v: "zh", label: "Chinese" },
];

function difficultyTone(d: string) {
  if (d === "foundation")   return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
  if (d === "intermediate") return "bg-amber-100 text-amber-800 hover:bg-amber-100";
  if (d === "advanced")     return "bg-rose-100 text-rose-800 hover:bg-rose-100";
  return "bg-slate-100 text-slate-700 hover:bg-slate-100";
}

function categoryIcon(type: string) {
  switch (type) {
    case "history":          return ClipboardList;
    case "examination":      return Stethoscope;
    case "explanation":      return BookOpen;
    case "ethics":           return Users;
    case "acute-care":       return AlertTriangle;
    case "practical-skills": return Heart;
    default:                 return Sparkles;
  }
}

export default function Plab2Osce() {
  const [activeStation, setActiveStation] = useState<EnhancedOSCEStation | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [completedStations, setCompletedStations] = useState<string[]>([]);
  const [stationScores, setStationScores] = useState<Record<string, number>>({});

  // Translation state
  const [isTranslationMode, setIsTranslationMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedStations, setTranslatedStations] = useState<Record<string, any>>({});
  const [isTranslatingStation, setIsTranslatingStation] = useState(false);

  // Self-assessment state for active station
  const [selfScore, setSelfScore] = useState<number>(0);
  const [stationNotes, setStationNotes] = useState<string>("");

  // Neurodiversity settings
  const [neuroAccommodations, setNeuroAccommodations] = useState<NeuroAtypicalType[]>(["none"]);
  const { accommodations } = useNeuroAccommodations(neuroAccommodations);

  // Tutor state
  const [showTutor, setShowTutor] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [tutorInput, setTutorInput] = useState("");
  const [isLoadingTutor, setIsLoadingTutor] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("neuro-accommodations");
    if (saved) {
      try { setNeuroAccommodations(JSON.parse(saved)); }
      catch (e) { console.error("Failed to parse saved accommodations"); }
    }
  }, []);

  const handleAccommodationsChange = (a: NeuroAtypicalType[]) => {
    setNeuroAccommodations(a);
    localStorage.setItem("neuro-accommodations", JSON.stringify(a));
  };

  // Reset self-assessment when station changes
  useEffect(() => {
    setSelfScore(0);
    setStationNotes("");
  }, [activeStation?.id]);

  // Translate full station content when in translation mode
  useEffect(() => {
    if (!activeStation) return;
    if (!isTranslationMode || selectedLanguage === "en") return;
    const cacheKey = `${activeStation.id}_${selectedLanguage}`;
    if (translatedStations[cacheKey]) return;
    let cancelled = false;
    (async () => {
      setIsTranslatingStation(true);
      try {
        const r = await fetch("/api/translate-osce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ station: activeStation, targetLanguage: selectedLanguage }),
        });
        if (!r.ok) return;
        const data = await r.json();
        if (!cancelled) setTranslatedStations((p) => ({ ...p, [cacheKey]: data }));
      } catch (e) {
        console.error("Station translation failed:", e);
      } finally {
        if (!cancelled) setIsTranslatingStation(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeStation, isTranslationMode, selectedLanguage, translatedStations]);

  const handleStationComplete = (stationId: string, score: number) => {
    setCompletedStations((prev) => (prev.includes(stationId) ? prev : [...prev, stationId]));
    setStationScores((prev) => ({ ...prev, [stationId]: score }));
    setActiveStation(null);
  };

  const translateText = (text: string): string => {
    if (!isTranslationMode || selectedLanguage === "en") return text;
    const quick: Record<string, Record<string, string>> = {
      ar: { "PLAB 2 OSCE": "بلاب 2 أوسي", "Start Station": "بدء المحطة" },
      hi: { "PLAB 2 OSCE": "प्लैब 2 ओएससीई", "Start Station": "स्टेशन शुरू करें" },
      ur: { "PLAB 2 OSCE": "پلیب 2 او ایس سی ای", "Start Station": "سٹیشن شروع کریں" },
    };
    const map = quick[selectedLanguage] || {};
    let out = text;
    Object.entries(map).forEach(([en, native]) => {
      out = out.replace(new RegExp(en, "gi"), native);
    });
    return out;
  };

  const { data: osceStations = [], isLoading, error } = useQuery<any[]>({
    queryKey: ["/api/osce/stations", selectedType],
    queryFn: async () => {
      const params = new URLSearchParams({ type: selectedType, count: "20" });
      const r = await fetch(`/api/osce/stations?${params}`);
      if (!r.ok) throw new Error("Failed to fetch OSCE stations");
      return r.json();
    },
  });

  const filteredStations = useMemo(
    () =>
      osceStations.filter((s: OSCEStation) =>
        selectedType === "all" || s.category.toLowerCase().includes(selectedType.toLowerCase()),
      ),
    [osceStations, selectedType],
  );

  const progressPct = Math.round(
    (completedStations.length / Math.max(EXPANDED_PLAB2_STATIONS.length, 1)) * 100,
  );
  const avgScore = useMemo(() => {
    const scores = Object.values(stationScores);
    return scores.length ? Math.round(scores.reduce((s, x) => s + x, 0) / scores.length) : 0;
  }, [stationScores]);

  const handleAskTutor = async (question: string) => {
    if (!question.trim()) return;
    const userMsg = { role: "user" as const, content: question };
    setTutorMessages((prev) => [...prev, userMsg]);
    setTutorInput("");
    setIsLoadingTutor(true);
    try {
      const context = activeStation
        ? {
            stationType: "PLAB 2 OSCE",
            stationTitle: activeStation.title,
            scenario: activeStation.scenario,
            instructions: activeStation.instructions,
            keyActions: (activeStation as any).keyActions || [],
            redFlags: activeStation.redFlags,
          }
        : { stationType: "PLAB 2 OSCE General" };

      const r = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question, context, specialty: "clinical-skills", examType: "plab2-osce",
        }),
      });
      if (!r.ok) throw new Error("Failed to get tutor response");
      const data = await r.json();
      setTutorMessages((p) => [...p, { role: "assistant", content: data.response }]);
    } catch (e) {
      console.error("Tutor error:", e);
      setTutorMessages((p) => [
        ...p,
        { role: "assistant", content: "Sorry — I hit an error. Please try again." },
      ]);
    } finally {
      setIsLoadingTutor(false);
    }
  };

  // -------- Active station view --------
  if (activeStation) {
    const cacheKey = `${activeStation.id}_${selectedLanguage}`;
    const ds: any =
      isTranslationMode && selectedLanguage !== "en" && translatedStations[cacheKey]
        ? translatedStations[cacheKey]
        : activeStation;
    return (
      <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
        <div className="max-w-[680px] md:max-w-4xl mx-auto px-4 pt-6 space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveStation(null)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              data-testid="button-back-stations"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to stations
            </button>
            {isTranslatingStation && (
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                Translating…
              </span>
            )}
          </div>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shrink-0 shadow-sm shadow-teal-200">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-slate-900 leading-tight">{ds.title}</h1>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-50 border-none text-xs capitalize">
                    {activeStation.category}
                  </Badge>
                  <Badge className={`${difficultyTone(activeStation.difficulty)} border-none text-xs capitalize`}>
                    {activeStation.difficulty}
                  </Badge>
                  <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {accommodations.extendedTime
                      ? Math.round(activeStation.duration * accommodations.timeMultiplier)
                      : activeStation.duration}{" "}
                    min
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">Station scenario</h2>
              {accommodations.audioSupport && (
                <AudioSupport text={ds.scenario} size="default" />
              )}
            </div>
            <p className="text-[15px] text-slate-700 leading-relaxed">{ds.scenario}</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Instructions</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <p><span className="font-medium text-slate-900">Candidate:</span> {ds.instructions.candidate}</p>
                <p><span className="font-medium text-slate-900">Examiner:</span> {ds.instructions.examiner}</p>
                {ds.instructions.standardizedPatient && (
                  <p>
                    <span className="font-medium text-slate-900">Patient:</span>{" "}
                    {ds.instructions.standardizedPatient}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Marking criteria</h3>
              <div className="space-y-3">
                {ds.markingCriteria.map((c: any, i: number) => (
                  <div key={i} className="border-l-2 border-teal-200 pl-3">
                    <div className="text-sm font-medium text-slate-900">{c.category}</div>
                    <div className="text-[11px] text-slate-500 mb-1">Max {c.maxMarks} marks</div>
                    <ul className="text-xs text-slate-600 space-y-0.5 list-disc pl-4">
                      {c.criteria.map((cr: string, idx: number) => <li key={idx}>{cr}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {ds.medications && ds.medications.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-semibold text-slate-900">BNF medication guidance</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {ds.medications.map((med: any, i: number) => (
                  <Badge key={i} className="bg-teal-50 text-teal-700 hover:bg-teal-50 border-none text-xs">
                    {typeof med === "string" ? med : med.name}
                  </Badge>
                ))}
              </div>
              {ds.bnfGuidance && (
                <p className="text-sm text-slate-700 leading-relaxed">{ds.bnfGuidance}</p>
              )}
            </section>
          )}

          {ds.clinicalReasoning && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-semibold text-slate-900">Clinical reasoning</h3>
              </div>
              <ul className="space-y-1.5">
                {ds.clinicalReasoning.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {ds.redFlags && ds.redFlags.length > 0 && (
            <section className="bg-rose-50 rounded-2xl border border-rose-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-semibold text-rose-900">Red flags</h3>
              </div>
              <ul className="space-y-1.5">
                {ds.redFlags.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-rose-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tutor */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-teal-700" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Clinical skills tutor</h3>
              </div>
              <button
                onClick={() => setShowTutor((v) => !v)}
                className="text-xs font-medium text-teal-700 hover:text-teal-800"
              >
                {showTutor ? "Hide" : "Show"}
              </button>
            </div>

            {showTutor && (
              <div className="p-4">
                <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
                  {tutorMessages.length === 0 && (
                    <div className="text-center py-6">
                      <div className="w-10 h-10 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-2">
                        <MessageCircle className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600">
                        Ask about this station, examination steps, or communication.
                      </p>
                    </div>
                  )}
                  {tutorMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          m.role === "user"
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoadingTutor && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 p-3 rounded-2xl text-sm text-slate-600">
                        Thinking…
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    value={tutorInput}
                    onChange={(e) => setTutorInput(e.target.value)}
                    placeholder="Ask about clinical skills or this OSCE station…"
                    className="flex-1 rounded-xl border-slate-200 focus-visible:ring-teal-600"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAskTutor(tutorInput);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAskTutor(tutorInput)}
                    disabled={!tutorInput.trim() || isLoadingTutor}
                    className="self-end h-10 w-10 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white flex items-center justify-center disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="bg-teal-50 rounded-2xl border border-teal-100 p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-700" />
              <span className="text-sm font-medium text-teal-900">
                Time limit:{" "}
                {accommodations.extendedTime
                  ? Math.round(activeStation.duration * accommodations.timeMultiplier)
                  : activeStation.duration}{" "}
                min
              </span>
            </div>
            <p className="text-xs text-teal-800 mt-1">
              Practise under exam conditions.
            </p>
          </section>

          {/* Self-assessment + complete */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Your notes</h3>
              <Textarea
                value={stationNotes}
                onChange={(e) => setStationNotes(e.target.value)}
                placeholder="Record your approach, observations and key points…"
                rows={4}
                className="rounded-xl border-slate-200 focus-visible:ring-teal-600"
                data-testid="textarea-station-notes"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">
                Self-score (out of 20)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={selfScore}
                  onChange={(e) => setSelfScore(parseInt(e.target.value, 10) || 0)}
                  className="flex-1 accent-teal-600"
                  data-testid="input-self-score"
                />
                <span className="w-12 text-right text-lg font-bold text-teal-700 tabular-nums">
                  {selfScore}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleStationComplete(activeStation.id, selfScore)}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white text-sm font-semibold shadow-sm shadow-teal-200 hover:opacity-95"
              data-testid="button-complete-station"
            >
              Complete station
            </button>
          </section>

          <section className="bg-amber-50 rounded-2xl border border-amber-100 p-3">
            <p className="text-[11px] text-amber-800">
              Educational use only — not a substitute for professional medical advice.
            </p>
          </section>
        </div>
      </div>
    );
  }

  // -------- Stations list view --------
  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      <div className="max-w-[680px] md:max-w-5xl mx-auto px-4 pt-6 space-y-5">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-5 text-white shadow-sm shadow-teal-200">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-2 bottom-0 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-50">
                {translateText("PLAB 2 OSCE")}
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight">OSCE Practice</h1>
            <p className="text-sm text-teal-50 mt-1 max-w-[36ch]">
              16–20 clinical stations covering history, examination, communication, ethics and acute care.
            </p>
          </div>
        </section>

        {/* Exam format strip */}
        <section className="grid grid-cols-3 gap-2">
          <Info Icon={Clock} label="Per station" value="8–10 min" />
          <Info Icon={Users} label="Stations" value="16–20" />
          <Info Icon={Award} label="Pass mark" value="50%" />
        </section>

        {/* Progress + average */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Your progress</h2>
              <p className="text-xs text-slate-500">
                {completedStations.length} of {EXPANDED_PLAB2_STATIONS.length} stations complete
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-700 tabular-nums leading-none">{progressPct}%</div>
              {avgScore > 0 && (
                <div className="text-[11px] text-slate-500">avg {avgScore}/20</div>
              )}
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </section>

        {/* Language toggle */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="w-4 h-4 text-teal-700 shrink-0" />
              <span className="text-sm font-medium text-slate-900 truncate">
                {translateText("Translation Mode")}
              </span>
            </div>
            <Switch
              checked={isTranslationMode}
              onCheckedChange={setIsTranslationMode}
              className="data-[state=checked]:bg-teal-600"
            />
          </div>
          {isTranslationMode && (
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="mt-3 rounded-xl border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.v} value={l.v}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </section>

        {/* Accessibility */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-teal-700" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">Accessibility</h3>
                <p className="text-xs text-slate-500 truncate">ADHD, dyslexia, autism support</p>
              </div>
            </div>
            <NeuroSettings
              selectedAccommodations={neuroAccommodations}
              onAccommodationsChange={handleAccommodationsChange}
            />
          </div>

          {neuroAccommodations.length > 0 && !neuroAccommodations.includes("none") && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap gap-1.5">
                {neuroAccommodations
                  .filter((a) => a !== "none")
                  .map((a) => {
                    const acc = NEURO_ACCOMMODATIONS.find((na) => na.id === a);
                    return acc ? (
                      <Badge key={a} className="bg-teal-50 text-teal-700 hover:bg-teal-50 border-none text-xs">
                        {acc.name}
                      </Badge>
                    ) : null;
                  })}
              </div>
            </div>
          )}
        </section>

        {/* Station type chip row */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900 px-1 mb-2">Station type</h2>
          <div className="flex overflow-x-auto gap-2 pb-2 plab1-no-scrollbar snap-x">
            {STATION_TYPES.map((t) => {
              const active = selectedType === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSelectedType(t.value)}
                  className={`snap-start shrink-0 h-9 px-4 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? "bg-teal-600 text-white shadow-sm shadow-teal-200"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                  }`}
                  data-testid={`type-${t.value}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Stations */}
        <section>
          {isLoading && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-slate-600">Loading stations…</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
              <p className="text-sm text-rose-700">Error loading stations: {(error as Error).message}</p>
            </div>
          )}

          {!isLoading && !error && filteredStations.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
              <p className="text-sm text-slate-500">No stations for this type.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredStations.map((station: any, index: number) => {
              const Icon = categoryIcon(station.category);
              const isCompleted = completedStations.includes(station.id);
              const score = stationScores[station.id];
              return (
                <button
                  key={station.id}
                  onClick={() => setActiveStation(station)}
                  className={`text-left bg-white rounded-2xl shadow-sm border p-4 transition-all hover:shadow-md ${
                    isCompleted ? "border-emerald-200 bg-emerald-50/40" : "border-slate-100 hover:border-teal-200"
                  }`}
                  data-testid={`station-${station.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isCompleted ? "bg-emerald-100" : "bg-teal-50"
                      }`}>
                        <Icon className={`w-4 h-4 ${isCompleted ? "text-emerald-700" : "text-teal-700"}`} />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Station {index + 1}
                      </span>
                    </div>
                    {isCompleted ? (
                      <div className="flex items-center gap-1 text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold tabular-nums">{score}/20</span>
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2 mb-2">
                    {station.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {station.description || station.scenario}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    <Badge className={`${difficultyTone(station.difficulty)} border-none text-[10px] capitalize`}>
                      {station.difficulty}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {station.duration}m
                    </Badge>
                    {station.medications && station.medications.length > 0 && (
                      <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-50 border-none text-[10px] flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {station.medications.length} meds
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({
  Icon, label, value,
}: { Icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 text-center">
      <Icon className="w-4 h-4 text-teal-700 mx-auto mb-1" />
      <div className="text-sm font-bold text-slate-900 leading-tight">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
