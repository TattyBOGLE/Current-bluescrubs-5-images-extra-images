import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, Brain, BookOpen, Target, TrendingUp, Users, Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";
import type { AIExplanation } from "@/lib/quiz-utils";
import type { QuestionServerStats } from "@/lib/question-randomisation";
import { ExternalLink } from "@/components/ui/external-link";
import { useToast } from "@/hooks/use-toast";
import { FlashcardsFromQuestion } from "./FlashcardsFromQuestion";

interface ExplanationPanelProps {
  currentQuestion: any;
  aiExplanation: AIExplanation | null;
  aiExplanationLoading: boolean;
  selectedAnswer?: string;
  isCorrect?: boolean;
  questionStats?: QuestionServerStats;
}

export function ExplanationPanel({
  currentQuestion,
  aiExplanation,
  aiExplanationLoading,
  selectedAnswer,
  isCorrect,
  questionStats,
}: ExplanationPanelProps) {
  const { toast } = useToast();

  function openLink(url: string) {
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      navigator.clipboard.writeText(url).catch(() => {});
      toast({
        title: "Link copied",
        description: "Paste the URL into a new browser tab to open it.",
        duration: 4000,
      });
    }
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Structured AI explanation (or fallback to legacy bullet list) */}
      <div className="text-gray-800 leading-relaxed space-y-4">
        {aiExplanationLoading && !aiExplanation ? (
          <div className="space-y-2 p-4 bg-teal-50/70 border border-teal-100 rounded-2xl">
            <div className="flex items-center gap-2 text-teal-800">
              <Brain className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Generating clinical reasoning…</span>
            </div>
            <div className="space-y-2 mt-2">
              <div className="h-3 bg-teal-100 rounded animate-pulse" />
              <div className="h-3 bg-teal-100 rounded animate-pulse w-5/6" />
              <div className="h-3 bg-teal-100 rounded animate-pulse w-4/6" />
            </div>
          </div>
        ) : aiExplanation ? (
          <div className="space-y-5">
            {aiExplanation.source === 'fallback' ? (
              <>
                <div className="bg-teal-50/70 border-l-4 border-teal-500 p-4 rounded-r-2xl">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <h4 className="font-semibold text-teal-900">Explanation</h4>
                  </div>
                  <div className="space-y-2">
                    {aiExplanation.correctRationale.split(/\n\n+/).filter(s => s.trim()).map((para, i) => (
                      <p key={i} className="text-sm text-gray-800 leading-relaxed">{para.trim()}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Option-by-option analysis:</h4>
                  <div className="space-y-3">
                    {aiExplanation.options.map((opt) => (
                      <div
                        key={opt.label}
                        className={`border-l-4 p-3 rounded-r-2xl ${
                          opt.isCorrect
                            ? 'border-teal-500 bg-teal-50/70'
                            : opt.isSelected
                            ? 'border-rose-400 bg-rose-50'
                            : 'border-slate-300 bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <span className={`font-bold text-sm px-2 py-0.5 rounded flex-shrink-0 ${
                            opt.isCorrect
                              ? 'bg-teal-600 text-white'
                              : opt.isSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {opt.label}
                          </span>
                          <span className="font-medium text-sm text-gray-900">{opt.text}</span>
                          {opt.isCorrect && (
                            <Badge className="ml-auto bg-teal-600 hover:bg-teal-700 text-xs">Correct</Badge>
                          )}
                          {opt.isSelected && !opt.isCorrect && (
                            <Badge variant="destructive" className="ml-auto text-xs">Your answer</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pl-9">{opt.why}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-2 mb-1">
                    <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <h4 className="font-semibold text-amber-900">Key learning point</h4>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {aiExplanation.keyLearningPoint}
                  </p>
                </div>

                {/* Common distractors from aggregated attempt data */}
                {questionStats && questionStats.timesAnswered >= 5 && (() => {
                  const counts = questionStats.incorrectOptionCounts;
                  const topDistractors = Object.entries(counts)
                    .filter(([, c]) => (c as number) > 0)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 3);
                  if (topDistractors.length === 0) return null;
                  return (
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r-lg">
                      <p className="text-xs font-semibold text-orange-900 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />Most commonly confused options
                      </p>
                      <div className="space-y-1.5">
                        {topDistractors.map(([optIdx, count]) => {
                          const labels = ['A','B','C','D','E'];
                          const label = labels[parseInt(optIdx)] ?? optIdx;
                          const optData = aiExplanation.options?.[parseInt(optIdx)];
                          const pct = Math.round(((count as number) / questionStats.timesAnswered) * 100);
                          return (
                            <div key={optIdx} className="text-xs text-orange-800 flex items-start gap-1.5">
                              <span className="font-bold bg-orange-200 text-orange-900 px-1.5 py-0.5 rounded flex-shrink-0">{label}</span>
                              <span>
                                {optData?.text
                                  ? `${optData.text.slice(0, 70)}${optData.text.length > 70 ? '…' : ''}`
                                  : `Option ${label}`}
                                <span className="text-orange-600 ml-1">— chosen by {pct}% of users</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              <>
                <div className="bg-teal-50/70 border-l-4 border-teal-500 p-4 rounded-r-2xl">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <h4 className="font-semibold text-teal-900">Why the correct answer fits</h4>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    {aiExplanation.correctRationale}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Option-by-option analysis:</h4>
                  <div className="space-y-3">
                    {aiExplanation.options.map((opt) => (
                      <div
                        key={opt.label}
                        className={`border-l-4 p-3 rounded-r-lg ${
                          opt.isCorrect
                            ? 'border-green-500 bg-green-50'
                            : opt.isSelected
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <span className={`font-bold text-sm px-2 py-0.5 rounded ${
                            opt.isCorrect
                              ? 'bg-green-600 text-white'
                              : opt.isSelected
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-300 text-gray-800'
                          }`}>
                            {opt.label}
                          </span>
                          <span className="font-medium text-sm text-gray-900">{opt.text}</span>
                          {opt.isCorrect && (
                            <Badge className="ml-auto bg-green-600 hover:bg-green-700 text-xs">Correct</Badge>
                          )}
                          {opt.isSelected && !opt.isCorrect && (
                            <Badge variant="destructive" className="ml-auto text-xs">Your answer</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pl-9">{opt.why}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-2 mb-1">
                    <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <h4 className="font-semibold text-amber-900">Key learning point</h4>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {aiExplanation.keyLearningPoint}
                  </p>
                </div>

                {/* Common distractors from aggregated attempt data */}
                {questionStats && questionStats.timesAnswered >= 5 && (() => {
                  const counts = questionStats.incorrectOptionCounts;
                  const topDistractors = Object.entries(counts)
                    .filter(([, c]) => (c as number) > 0)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 3);
                  if (topDistractors.length === 0) return null;
                  return (
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r-lg">
                      <p className="text-xs font-semibold text-orange-900 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />Most commonly confused options
                      </p>
                      <div className="space-y-1.5">
                        {topDistractors.map(([optIdx, count]) => {
                          const labels = ['A','B','C','D','E'];
                          const label = labels[parseInt(optIdx)] ?? optIdx;
                          const optData = aiExplanation.options?.[parseInt(optIdx)];
                          const pct = Math.round(((count as number) / questionStats.timesAnswered) * 100);
                          return (
                            <div key={optIdx} className="text-xs text-orange-800 flex items-start gap-1.5">
                              <span className="font-bold bg-orange-200 text-orange-900 px-1.5 py-0.5 rounded flex-shrink-0">{label}</span>
                              <span>
                                {optData?.text
                                  ? `${optData.text.slice(0, 70)}${optData.text.length > 70 ? '…' : ''}`
                                  : `Option ${label}`}
                                <span className="text-orange-600 ml-1">— chosen by {pct}% of users</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        ) : (
          (() => {
            const rawExplanation = currentQuestion.explanation;
            const explanation = typeof rawExplanation === 'object' && rawExplanation !== null
              ? Object.entries(rawExplanation).map(([k, v]) => `${k}: ${v}`).join('. ')
              : (rawExplanation || '');
            const paragraphs = explanation.split(/\n\n+/).filter((s: string) => s.trim().length > 0);
            return (
              <div className="space-y-3">
                {paragraphs.map((para: string, index: number) => (
                  <p key={index} className="text-base leading-relaxed text-gray-800">{para.trim()}</p>
                ))}
              </div>
            );
          })()
        )}
      </div>

      {/* Question metadata strip */}
      <div className="pt-4 border-t border-gray-200">
        {/* Specialty / topic / quality badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 text-xs font-medium border-0">
            {currentQuestion.specialty
              || (currentQuestion.category
                ? currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)
                : 'Medicine')}
          </Badge>
          {currentQuestion.topic && (
            <Badge variant="outline" className="text-xs text-gray-700">
              {currentQuestion.topic}
            </Badge>
          )}
          {currentQuestion.subtopic && (
            <Badge variant="outline" className="text-xs text-gray-500">
              {currentQuestion.subtopic}
            </Badge>
          )}
          {currentQuestion.difficulty && (
            <Badge className={`text-xs border-0 ${
              currentQuestion.difficulty === 'easy' || currentQuestion.difficulty === 'foundation'
                ? 'bg-green-100 text-green-800'
                : currentQuestion.difficulty === 'hard' || currentQuestion.difficulty === 'advanced'
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </Badge>
          )}
          {currentQuestion.clinicallyReviewed ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs border-0 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />Clinically Reviewed
            </Badge>
          ) : (
            <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 text-xs border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />AI Generated
            </Badge>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(currentQuestion.tags) && currentQuestion.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {(currentQuestion.tags as string[]).map((tag: string) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Learning objectives */}
        {Array.isArray(currentQuestion.learningObjectives) && currentQuestion.learningObjectives.length > 0 && (
          <div className="mb-3 bg-teal-50/70 rounded-2xl p-3 border border-teal-100">
            <p className="text-xs font-semibold text-teal-900 mb-1.5 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Learning objectives
            </p>
            <ul className="space-y-1">
              {(currentQuestion.learningObjectives as string[]).map((obj: string, i: number) => (
                <li key={i} className="text-xs text-teal-800 flex items-start gap-1.5">
                  <span className="text-teal-400 mt-0.5 flex-shrink-0">•</span>{obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Community stats */}
        {questionStats && questionStats.timesAnswered > 0 && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3 bg-gray-50 rounded-lg px-3 py-2">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {questionStats.timesAnswered.toLocaleString()} attempt{questionStats.timesAnswered !== 1 ? 's' : ''}
            </span>
            {questionStats.accuracyRate !== null && (
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {questionStats.accuracyRate}% correct
              </span>
            )}
            {questionStats.averageTimeSpent !== null && (
              <span>~{questionStats.averageTimeSpent}s avg time</span>
            )}
          </div>
        )}
      </div>

      {/* CKS Clinical Knowledge Summaries */}
      {currentQuestion.cks_guidance && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-4">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-green-900">CKS Clinical Knowledge Summary</p>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-green-700 italic">
                    Note: CKS access may be restricted outside the UK
                  </p>
                </div>
              </div>

              <div className="bg-white border border-green-200 rounded-lg p-4 mb-3">
                <p className="text-green-800 text-sm leading-relaxed mb-3">
                  {(() => {
                    let summary = currentQuestion.cks_guidance.summary || '';
                    summary = summary.replace(/^NICE Clinical Guideline:\s*CKS:\s*\[.*?\]\s*/i, '');
                    summary = summary.replace(/^CKS:\s*\[.*?\]\s*/i, '');
                    summary = summary.replace(/^NICE:\s*\[.*?\]\s*/i, '');
                    return summary.trim();
                  })()}
                </p>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-green-900 mb-2">Key Clinical Points:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Array.isArray(currentQuestion.cks_guidance.key_points) &&
                      currentQuestion.cks_guidance.key_points.map((point: string, index: number) => (
                        <li key={index} className="text-xs text-green-800">{point}</li>
                      ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-green-900 mb-1">Management Approach:</p>
                  <p className="text-xs text-green-800">{currentQuestion.cks_guidance.management_approach}</p>
                </div>

                {currentQuestion.cks_guidance.specific_references && currentQuestion.cks_guidance.specific_references.length > 0 && (
                  <div className="mb-3 bg-green-25 border border-green-300 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-900 mb-2">Specific CKS Guidance References:</p>
                    <div className="space-y-2">
                      {currentQuestion.cks_guidance.specific_references.map((ref: any, index: number) => (
                        <div key={index} className="bg-white border border-green-200 rounded p-2">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1">
                              <p className="text-xs font-medium text-green-900">{ref.section}</p>
                              {ref.subsection && (
                                <p className="text-xs text-green-700 italic">{ref.subsection}</p>
                              )}
                            </div>
                            <ExternalLink
                              href={ref.url}
                              className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-green-300 text-green-700 hover:bg-green-50 h-6 px-2"
                            >
                              View
                            </ExternalLink>
                          </div>
                          <p className="text-xs text-green-800 leading-relaxed mb-1">
                            {ref.text}
                          </p>
                          {ref.tableOrFigure && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                                📊 {ref.tableOrFigure}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentQuestion.cks_guidance.red_flags && Array.isArray(currentQuestion.cks_guidance.red_flags) && currentQuestion.cks_guidance.red_flags.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-xs font-semibold text-red-900 mb-1">Red Flags:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {currentQuestion.cks_guidance.red_flags.map((flag: string, index: number) => (
                        <li key={index} className="text-xs text-red-800">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ESC Guidelines */}
      {currentQuestion.esc_guidance && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-red-900">ESC Guidelines</p>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-red-700 italic">European Society of Cardiology</p>
                  {currentQuestion.esc_guidance.evidence_level && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      {currentQuestion.esc_guidance.evidence_level}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-white border border-red-200 rounded-lg p-4 mb-3">
                <p className="text-red-800 text-sm leading-relaxed mb-3">
                  {currentQuestion.esc_guidance.summary}
                </p>
                <div className="mb-3">
                  <p className="font-medium text-red-900 text-xs mb-2">Key Points:</p>
                  <ul className="text-xs text-red-800 space-y-1">
                    {currentQuestion.esc_guidance.key_points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <p className="font-medium text-red-900 text-xs mb-2">Clinical Approach:</p>
                  <p className="text-xs text-red-800 leading-relaxed">
                    {currentQuestion.esc_guidance.clinical_approach}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-red-200">
                  <p className="text-xs text-red-700">ESC Clinical Practice Guidelines</p>
                  <Button
                    size="sm"
                    onClick={() => openLink(currentQuestion.esc_guidance.esc_url || 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                  >
                    View ESC Guidelines
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADA Guidelines */}
      {currentQuestion.ada_guidance && (
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg mb-4">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-purple-900">ADA Standards</p>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-purple-700 italic">American Diabetes Association</p>
                  {currentQuestion.ada_guidance.evidence_level && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {currentQuestion.ada_guidance.evidence_level}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-white border border-purple-200 rounded-lg p-4 mb-3">
                <p className="text-purple-800 text-sm leading-relaxed mb-3">
                  {currentQuestion.ada_guidance.summary}
                </p>
                <div className="mb-3">
                  <p className="font-medium text-purple-900 text-xs mb-2">Key Points:</p>
                  <ul className="text-xs text-purple-800 space-y-1">
                    {currentQuestion.ada_guidance.key_points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-purple-600 rounded-full mt-1.5 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <p className="font-medium text-purple-900 text-xs mb-2">Clinical Approach:</p>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    {currentQuestion.ada_guidance.clinical_approach}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-purple-200">
                  <p className="text-xs text-purple-700">ADA Standards of Care</p>
                  <Button
                    size="sm"
                    onClick={() => openLink(currentQuestion.ada_guidance.ada_url || 'https://www.nice.org.uk/guidance/ng28')}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                  >
                    View ADA Standards
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIGN Guidelines */}
      {currentQuestion.sign_guidance && (
        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg mb-4">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-1" />
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-indigo-900">SIGN Guidelines</p>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-indigo-700 italic">Scottish Intercollegiate Guidelines Network</p>
                  {currentQuestion.sign_guidance.evidence_level && (
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      {currentQuestion.sign_guidance.evidence_level}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-white border border-indigo-200 rounded-lg p-4 mb-3">
                <p className="text-indigo-800 text-sm leading-relaxed mb-3">
                  {currentQuestion.sign_guidance.summary}
                </p>
                <div className="mb-3">
                  <p className="font-medium text-indigo-900 text-xs mb-2">Key Points:</p>
                  <ul className="text-xs text-indigo-800 space-y-1">
                    {currentQuestion.sign_guidance.key_points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <p className="font-medium text-indigo-900 text-xs mb-2">Clinical Approach:</p>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    {currentQuestion.sign_guidance.clinical_approach}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-indigo-200">
                  <p className="text-xs text-indigo-700">SIGN Clinical Guidelines</p>
                  <Button
                    size="sm"
                    onClick={() => openLink(currentQuestion.sign_guidance.sign_url || 'https://www.sign.ac.uk/our-guidelines/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                  >
                    View SIGN Guidelines
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BTS Guidelines */}
      {currentQuestion.bts_guidance && (
        <div className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg mb-4">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-teal-600 flex-shrink-0 mt-1" />
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-teal-900">BTS Guidelines</p>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-teal-700 italic">British Thoracic Society</p>
                  {currentQuestion.bts_guidance.evidence_level && (
                    <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                      {currentQuestion.bts_guidance.evidence_level}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-white border border-teal-200 rounded-lg p-4 mb-3">
                <p className="text-teal-800 text-sm leading-relaxed mb-3">
                  {currentQuestion.bts_guidance.summary}
                </p>
                <div className="mb-3">
                  <p className="font-medium text-teal-900 text-xs mb-2">Key Points:</p>
                  <ul className="text-xs text-teal-800 space-y-1">
                    {currentQuestion.bts_guidance.key_points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-teal-600 rounded-full mt-1.5 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <p className="font-medium text-teal-900 text-xs mb-2">Clinical Approach:</p>
                  <p className="text-xs text-teal-800 leading-relaxed">
                    {currentQuestion.bts_guidance.clinical_approach}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-teal-200">
                  <p className="text-xs text-teal-700">BTS Clinical Guidelines</p>
                  <Button
                    size="sm"
                    onClick={() => openLink(currentQuestion.bts_guidance.bts_url || 'https://www.brit-thoracic.org.uk/clinical-resources/guidelines/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                  >
                    View BTS Guidelines
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
