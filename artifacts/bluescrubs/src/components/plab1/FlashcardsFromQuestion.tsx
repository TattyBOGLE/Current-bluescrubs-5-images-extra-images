import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Target,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Clock,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedFlashcard {
  type: "basic" | "cloze" | "clinical_reasoning";
  front: string;
  back: string;
  memory_tip: string;
  tags: string[];
}

interface FlashcardSet {
  source_question_id: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  user_answer_correct: boolean;
  personalisation_focus: string;
  flashcards: GeneratedFlashcard[];
  spaced_repetition: { priority: string; review_interval_days: number };
  learning_objectives: string[];
  high_yield_summary: string;
  common_exam_traps: string[];
}

interface FlashcardsFromQuestionProps {
  question: {
    id?: string | number;
    content?: string;
    stem?: string;
    scenario?: string;
    question?: string;
    options?: string[] | Record<string, string>;
    correctAnswer?: number | string;
    correct_answer?: number | string;
    answer?: number | string;
    explanation?: string | Record<string, string>;
    category?: string;
    difficulty?: string;
    cks_guidance?: Record<string, unknown>;
    esc_guidance?: Record<string, unknown>;
    ada_guidance?: Record<string, unknown>;
    sign_guidance?: Record<string, unknown>;
    bts_guidance?: Record<string, unknown>;
  };
  selectedAnswerIndex: string;
  isCorrect: boolean;
  floating?: boolean;
}

function getTypeStyle(type: string) {
  switch (type) {
    case "basic":
      return {
        bg: "bg-teal-600",
        border: "border-teal-200",
        light: "bg-teal-50",
        label: "Basic Recall",
        accent: "text-teal-700",
      };
    case "cloze":
      return {
        bg: "bg-purple-600",
        border: "border-purple-200",
        light: "bg-purple-50",
        label: "Fill-in-the-Blank",
        accent: "text-purple-700",
      };
    case "clinical_reasoning":
      return {
        bg: "bg-emerald-600",
        border: "border-emerald-200",
        light: "bg-emerald-50",
        label: "Clinical Reasoning",
        accent: "text-emerald-700",
      };
    default:
      return {
        bg: "bg-gray-600",
        border: "border-gray-200",
        light: "bg-gray-50",
        label: type,
        accent: "text-gray-700",
      };
  }
}

function renderClozeText(text: string, revealed: boolean) {
  if (!text.includes("{{")) return text;
  return text.replace(/\{\{([^}]+)\}\}/g, (_, word: string) =>
    revealed
      ? `<strong class="text-purple-700 underline decoration-dotted">${word}</strong>`
      : `<span class="inline-block bg-purple-200 text-purple-200 rounded px-1 select-none">${word}</span>`
  );
}

export function FlashcardsFromQuestion({
  question,
  selectedAnswerIndex,
  isCorrect,
  floating = false,
}: FlashcardsFromQuestionProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const optionsArr: string[] = Array.isArray(question.options)
    ? question.options
    : Object.values(question.options ?? {});

  const correctIdx = question.correctAnswer ?? question.correct_answer ?? question.answer;
  const correctAnswerIdx =
    typeof correctIdx === "string"
      ? correctIdx.charCodeAt(0) - 65
      : (correctIdx ?? 0);
  const userAnswerIdx = parseInt(selectedAnswerIndex, 10);

  const userAnswerText = optionsArr[userAnswerIdx] ?? selectedAnswerIndex;
  const correctAnswerText = optionsArr[correctAnswerIdx] ?? String(correctIdx);

  const rawExplanation = question.explanation ?? "";
  const explanationText =
    typeof rawExplanation === "object" && rawExplanation !== null
      ? Object.entries(rawExplanation)
          .map(([k, v]) => `Option ${k}: ${v}`)
          .join("\n")
      : String(rawExplanation);

  const questionStem =
    question.stem ?? question.scenario ?? question.content ?? question.question ?? "";

  async function handleGenerate() {
    setLoading(true);
    setOpen(true);
    setFlashcardSet(null);
    setCurrentIndex(0);
    setFlipped(false);

    const references: Record<string, unknown> = {};
    if (question.cks_guidance) references.cks = question.cks_guidance;
    if (question.esc_guidance) references.esc = question.esc_guidance;
    if (question.ada_guidance) references.ada = question.ada_guidance;
    if (question.sign_guidance) references.sign = question.sign_guidance;
    if (question.bts_guidance) references.bts = question.bts_guidance;

    try {
      const resp = await fetch("/api/study-tools/flashcards/from-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: String(question.id ?? ""),
          questionStem,
          options: optionsArr,
          userAnswerText,
          correctAnswerText,
          isCorrect,
          explanation: explanationText,
          category: question.category,
          difficulty: question.difficulty,
          references: Object.keys(references).length ? references : undefined,
        }),
      });

      if (!resp.ok) {
        throw new Error(`Server error ${resp.status}`);
      }

      const data: FlashcardSet = await resp.json();
      setFlashcardSet(data);
    } catch (err) {
      setOpen(false);
      toast({
        title: "Flashcard generation failed",
        description: "Could not generate flashcards right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const cards = flashcardSet?.flashcards ?? [];
  const current = cards[currentIndex];
  const style = current ? getTypeStyle(current.type) : null;

  function goNext() {
    setFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.min(i + 1, cards.length - 1)), 150);
  }

  function goPrev() {
    setFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.max(i - 1, 0)), 150);
  }

  function reset() {
    setFlipped(false);
    setCurrentIndex(0);
  }

  return (
    <>
      {floating ? (
        <button
          onClick={handleGenerate}
          disabled={loading}
          title="Generate Flashcards"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-60 shadow-lg shadow-teal-200/60 flex items-center justify-center transition-all"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Sparkles className="w-6 h-6 text-white" />
          )}
        </button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerate}
          disabled={loading}
          className="gap-2 rounded-2xl border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Generate Flashcards
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm shadow-teal-200/50">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  AI Flashcards
                </DialogTitle>
                {flashcardSet && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {flashcardSet.topic}
                    {flashcardSet.subtopic ? ` · ${flashcardSet.subtopic}` : ""}
                  </p>
                )}
              </div>
              {flashcardSet && (
                <div className="ml-auto flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      isCorrect
                        ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                        : "border-rose-200 text-rose-700 bg-rose-50"
                    }
                  >
                    {isCorrect ? "Answered correctly" : "Missed this one"}
                  </Badge>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-800">Generating personalised flashcards…</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Tailoring to your answer and clinical context
                  </p>
                </div>
              </div>
            )}

            {!loading && flashcardSet && (
              <>
                {/* Personalisation focus banner */}
                {flashcardSet.personalisation_focus && (
                  <div className="bg-teal-50/70 border border-teal-100 rounded-2xl px-4 py-3 text-sm text-teal-800">
                    <span className="font-medium">Focus: </span>
                    {flashcardSet.personalisation_focus}
                  </div>
                )}

                {/* Flip cards */}
                {cards.length > 0 && style && current && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Card {currentIndex + 1} of {cards.length}</span>
                      <div className="flex gap-1">
                        {cards.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => { setFlipped(false); setCurrentIndex(i); }}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              i === currentIndex ? "bg-teal-600" : "bg-slate-200 hover:bg-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <Badge className={`${style.bg} text-white text-xs`}>
                        {style.label}
                      </Badge>
                    </div>

                    {/* Card */}
                    <div
                      className={`relative min-h-[200px] rounded-xl border-2 ${style.border} cursor-pointer select-none transition-all duration-200`}
                      style={{ perspective: "1000px" }}
                      onClick={() => setFlipped((f) => !f)}
                    >
                      <div
                        className={`w-full min-h-[200px] transition-all duration-300 ${flipped ? "opacity-0 scale-95" : "opacity-100 scale-100"} ${style.light} rounded-xl p-6`}
                      >
                        {!flipped && (
                          <div className="h-full flex flex-col">
                            <div className="flex-1 flex items-center justify-center">
                              {current.type === "cloze" ? (
                                <p
                                  className="text-center text-gray-800 text-base leading-relaxed font-medium"
                                  dangerouslySetInnerHTML={{
                                    __html: renderClozeText(current.front, false),
                                  }}
                                />
                              ) : (
                                <p className="text-center text-gray-800 text-base leading-relaxed font-medium">
                                  {current.front}
                                </p>
                              )}
                            </div>
                            <p className={`text-center text-xs mt-4 ${style.accent} opacity-70`}>
                              Tap to reveal answer
                            </p>
                          </div>
                        )}
                      </div>

                      {flipped && (
                        <div className="absolute inset-0 rounded-xl p-6 bg-white border-2 border-gray-200 flex flex-col">
                          <div className="flex-1">
                            {current.type === "cloze" ? (
                              <div className="space-y-3">
                                <p
                                  className="text-gray-800 text-base leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: renderClozeText(current.front, true),
                                  }}
                                />
                                <div className="border-t border-gray-100 pt-3">
                                  <p className="text-sm text-gray-700">{current.back}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-800 text-base leading-relaxed">{current.back}</p>
                            )}
                          </div>

                          {current.memory_tip && (
                            <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-amber-800">{current.memory_tip}</p>
                            </div>
                          )}

                          {current.tags && current.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {current.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goPrev}
                        disabled={currentIndex === 0}
                        className="gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={reset}
                        className="gap-1 text-gray-500"
                      >
                        <RotateCcw className="w-3 h-3" /> Restart
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goNext}
                        disabled={currentIndex === cards.length - 1}
                        className="gap-1"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* High-yield summary */}
                {flashcardSet.high_yield_summary && (
                  <div className="bg-teal-50/70 border border-teal-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-teal-600" />
                      <p className="text-sm font-semibold text-teal-900">High-Yield Summary</p>
                    </div>
                    <p className="text-sm text-teal-800 leading-relaxed">
                      {flashcardSet.high_yield_summary}
                    </p>
                  </div>
                )}

                {/* Exam traps */}
                {flashcardSet.common_exam_traps && flashcardSet.common_exam_traps.length > 0 && (
                  <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <p className="text-sm font-semibold text-rose-900">Common Exam Traps</p>
                    </div>
                    <ul className="space-y-1">
                      {flashcardSet.common_exam_traps.map((trap, i) => (
                        <li key={i} className="text-sm text-rose-800 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                          {trap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Learning objectives */}
                  {flashcardSet.learning_objectives && flashcardSet.learning_objectives.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-slate-600" />
                        <p className="text-xs font-semibold text-slate-700">Learning Objectives</p>
                      </div>
                      <ul className="space-y-1">
                        {flashcardSet.learning_objectives.map((obj, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="font-bold text-slate-400 flex-shrink-0">{i + 1}.</span>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Spaced repetition */}
                  {flashcardSet.spaced_repetition && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <p className="text-xs font-semibold text-slate-700">Spaced Repetition</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-slate-500">Priority: </span>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${
                              flashcardSet.spaced_repetition.priority === "high"
                                ? "border-rose-200 text-rose-700"
                                : flashcardSet.spaced_repetition.priority === "medium"
                                ? "border-amber-300 text-amber-700"
                                : "border-emerald-200 text-emerald-700"
                            }`}
                          >
                            {flashcardSet.spaced_repetition.priority}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Review in: </span>
                          <span className="text-xs font-medium text-slate-800">
                            {flashcardSet.spaced_repetition.review_interval_days} day
                            {flashcardSet.spaced_repetition.review_interval_days !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
