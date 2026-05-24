import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import imageStatusRaw from "@/data/image-status.json";
import extraImages from "@/data/spot-diagnosis-extra.json";

type ImageStatus = "validated" | "pending" | "flagged";
const imageStatus = imageStatusRaw as Record<string, ImageStatus>;

type GalleryItem = {
  dir: string;
  file: string;
  label: string;
  specialty: string;
  type: string;
  vignette?: string;
  stem?: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswerText?: string;
  explanation?: string;
};

const IMAGES: GalleryItem[] = extraImages as GalleryItem[];

const STATUS_CONFIG: Record<ImageStatus, { dot: string; label: string; title: string }> = {
  validated: { dot: "bg-emerald-500", label: "✓", title: "Clinically validated" },
  pending:   { dot: "bg-amber-400",   label: "⚠", title: "Pending validation" },
  flagged:   { dot: "bg-rose-500",    label: "✗", title: "Flagged for manual review" },
};

const SPECIALTY_BADGE = "bg-slate-100 text-slate-600";

const ALL_SPECIALTIES = [...new Set(IMAGES.map((i) => i.specialty))].sort();

export default function SpotDiagnosis() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [revealed, setRevealed] = useState(false);

  const filtered = IMAGES.filter((img) => {
    const matchesSearch =
      !search ||
      img.label.toLowerCase().includes(search.toLowerCase()) ||
      img.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || img.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const validatedCount = IMAGES.filter(i => imageStatus[i.file] === "validated").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm shadow-teal-200/50 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Spot Diagnosis Gallery</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{IMAGES.length} clinical images · {ALL_SPECIALTIES.length} specialties</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5">
        {/* Search */}
        <Input
          placeholder="Search by diagnosis or specialty…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 rounded-2xl border-slate-200 bg-white mb-4"
        />

        {/* Specialty chips — single horizontal scroll row */}
        <div className="-mx-4 mb-5">
          <div className="flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setSelectedSpecialty(null)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                !selectedSpecialty
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-transparent shadow-sm shadow-teal-200/50"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              All · {IMAGES.length}
            </button>
            {ALL_SPECIALTIES.map((sp) => {
              const count = IMAGES.filter((i) => i.specialty === sp).length;
              const active = selectedSpecialty === sp;
              return (
                <button
                  key={sp}
                  onClick={() => setSelectedSpecialty(active ? null : sp)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    active
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-transparent shadow-sm shadow-teal-200/50"
                      : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700"
                  }`}
                >
                  {sp} · {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quality legend */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 px-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Validated ({validatedCount})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Pending
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            Flagged
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((img) => {
            const status = imageStatus[img.file] ?? "pending";
            const statusCfg = STATUS_CONFIG[status];
            return (
              <button
                key={img.file}
                onClick={() => { setLightbox(img); setRevealed(false); }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-teal-300 hover:shadow-md hover:shadow-teal-100/60 transition-all text-left"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  <img
                    src={`/${img.dir}/${img.file}`}
                    alt={img.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Quality dot */}
                  <span
                    title={statusCfg.title}
                    className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border border-white/90 shadow-sm ${statusCfg.dot}`}
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-slate-900 leading-snug mb-1.5 line-clamp-2">{img.label}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${SPECIALTY_BADGE}`}>
                      {img.specialty}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{img.type}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm">No images match your search.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-slate-900">
              <img
                src={`/${lightbox.dir}/${lightbox.file}`}
                alt={lightbox.label}
                className="w-full object-contain max-h-[60vh] mx-auto"
              />
              {(() => {
                const status = imageStatus[lightbox.file] ?? "pending";
                const cfg = STATUS_CONFIG[status];
                return (
                  <span
                    title={cfg.title}
                    className={`absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white shadow ${cfg.dot}`}
                  />
                );
              })()}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{lightbox.label}</h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SPECIALTY_BADGE}`}>
                    {lightbox.specialty}
                  </span>
                  <span className="text-xs text-slate-400">{lightbox.type}</span>
                </div>
              </div>

              {lightbox.vignette && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Clinical Vignette</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{lightbox.vignette}</p>
                </div>
              )}

              {lightbox.stem && (
                <div>
                  <p className="text-sm font-medium text-slate-900 leading-relaxed">{lightbox.stem}</p>
                </div>
              )}

              {lightbox.options && lightbox.options.length > 0 && (
                <div className="space-y-1.5">
                  {lightbox.options.map((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const isCorrect = revealed && letter === lightbox.correctAnswer;
                    return (
                      <div
                        key={i}
                        className={`text-sm px-3 py-2 rounded-xl border ${
                          isCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="font-semibold mr-2">{letter}.</span>
                        {opt}
                      </div>
                    );
                  })}
                </div>
              )}

              {lightbox.explanation && !revealed && (
                <button
                  onClick={() => setRevealed(true)}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-sm font-semibold shadow-sm shadow-teal-200/50 hover:shadow-md transition-shadow"
                  style={{ color: '#ffffff' }}
                >
                  Reveal Answer & Explanation
                </button>
              )}

              {revealed && lightbox.explanation && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 mb-1">Explanation</p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{lightbox.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
