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

const BASE_IMAGES: GalleryItem[] = [
  { dir: "spotdx-images", file: "inferior-stemi-ecg.jpg", label: "Inferior STEMI", specialty: "Cardiology", type: "ECG" },
  { dir: "spotdx-images", file: "atrial-fibrillation-ecg.jpg", label: "Atrial Fibrillation", specialty: "Cardiology", type: "ECG" },
  { dir: "spotdx-images", file: "hyperkalaemia-ecg.jpg", label: "Hyperkalaemia ECG", specialty: "Cardiology", type: "ECG" },
  { dir: "spotdx-images", file: "pericarditis-ecg.jpg", label: "Pericarditis ECG", specialty: "Cardiology", type: "ECG" },
  { dir: "spotdx-images", file: "ventricular-tachycardia-ecg.jpg", label: "Ventricular Tachycardia", specialty: "Cardiology", type: "ECG" },
  { dir: "spotdx-images", file: "pneumothorax-cxr.jpg", label: "Pneumothorax", specialty: "Respiratory", type: "CXR" },
  { dir: "spotdx-images", file: "pleural-effusion-cxr.jpg", label: "Pleural Effusion", specialty: "Respiratory", type: "CXR" },
  { dir: "spotdx-images", file: "pulmonary-embolism-ctpa.jpg", label: "Pulmonary Embolism", specialty: "Respiratory", type: "CTPA" },
  { dir: "spotdx-images", file: "pancoast-horner-syndrome.jpg", label: "Pancoast + Horner Syndrome", specialty: "Respiratory", type: "Clinical" },
  { dir: "spotdx-images", file: "bells-palsy.jpg", label: "Bell's Palsy", specialty: "Neurology", type: "Clinical" },
  { dir: "spotdx-images", file: "acute-angle-closure-glaucoma.jpg", label: "Acute Angle-Closure Glaucoma", specialty: "Ophthalmology", type: "Clinical" },
  { dir: "spotdx-images", file: "chlamydial-conjunctivitis.jpg", label: "Chlamydial Conjunctivitis", specialty: "Ophthalmology", type: "Clinical" },
  { dir: "spotdx-images", file: "meningococcal-rash.jpg", label: "Meningococcal Rash", specialty: "Infectious Diseases", type: "Clinical" },
  { dir: "spotdx-images", file: "chickenpox.jpg", label: "Chickenpox (Varicella)", specialty: "Infectious Diseases", type: "Clinical" },
  { dir: "spotdx-images", file: "slapped-cheek-erythema-infectiosum.jpg", label: "Slapped Cheek (Parvovirus B19)", specialty: "Infectious Diseases", type: "Clinical" },
  { dir: "spotdx-images", file: "scarlet-fever.jpg", label: "Scarlet Fever", specialty: "Infectious Diseases", type: "Clinical" },
  { dir: "spotdx-images", file: "psoriasis.jpg", label: "Psoriasis (Body)", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "psoriasis-plaque.jpg", label: "Plaque Psoriasis (Close-up)", specialty: "Dermatology", type: "Clinical" },
  { dir: "spotdx-images", file: "melanoma.jpg", label: "Malignant Melanoma", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "basal-cell-carcinoma.jpg", label: "Basal Cell Carcinoma", specialty: "Dermatology", type: "Clinical" },
  { dir: "spotdx-images", file: "atopic-eczema.jpg", label: "Atopic Eczema", specialty: "Dermatology", type: "Clinical" },
  { dir: "spotdx-images", file: "herpes-zoster-shingles.jpg", label: "Herpes Zoster (Shingles)", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "impetigo.jpg", label: "Impetigo", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "urticaria.jpg", label: "Urticaria (Hives)", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "scabies-burrows.jpg", label: "Scabies (Burrows)", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "pityriasis-rosea.jpg", label: "Pityriasis Rosea", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "tinea-corporis.jpg", label: "Tinea Corporis (Ringworm)", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "seborrhoeic-dermatitis.jpg", label: "Seborrhoeic Dermatitis", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "herpes-zoster.jpg", label: "Herpes Zoster (Dermatomal)", specialty: "Dermatology", type: "Clinical" },
  { dir: "spotdx-images", file: "rheumatoid-hands.jpg", label: "Rheumatoid Arthritis (Hands)", specialty: "Rheumatology", type: "Clinical" },
  { dir: "spotdx-images", file: "gout-foot.jpg", label: "Acute Gout (Podagra)", specialty: "Rheumatology", type: "Clinical" },
  { dir: "spotdx-images", file: "graves-disease.jpg", label: "Graves' Disease", specialty: "Endocrinology", type: "Clinical" },
  { dir: "spotdx-images", file: "neuropathic-diabetic-ulcer.jpg", label: "Neuropathic Diabetic Ulcer", specialty: "Endocrinology", type: "Clinical" },
  { dir: "spotdx-images", file: "kawasaki-disease.jpg", label: "Kawasaki Disease", specialty: "Paediatrics", type: "Clinical" },
  { dir: "spotdx-images", file: "croup-laryngotracheobronchitis.jpg", label: "Croup (Steeple Sign)", specialty: "Paediatrics", type: "CXR" },
  { dir: "spotdx-images", file: "otitis-externa.jpg", label: "Otitis Externa", specialty: "ENT", type: "Clinical" },
  { dir: "spotdx-images", file: "peritonsillar-abscess-quinsy.jpg", label: "Peritonsillar Abscess (Quinsy)", specialty: "ENT", type: "Clinical" },
  { dir: "spotdx-images", file: "obstructive-jaundice-pancreatic-cancer.jpg", label: "Obstructive Jaundice", specialty: "Gastroenterology", type: "Clinical" },
  { dir: "spotdx-images", file: "cirrhosis-stigmata.jpg", label: "Liver Cirrhosis Stigmata", specialty: "Gastroenterology", type: "Clinical" },
  { dir: "spotdx-images", file: "small-bowel-obstruction-axr.jpg", label: "Small Bowel Obstruction", specialty: "Radiology", type: "AXR" },
  { dir: "spotdx-images", file: "sigmoid-volvulus-axr.jpg", label: "Sigmoid Volvulus", specialty: "Radiology", type: "AXR" },
  { dir: "spotdx-images", file: "renal-calculus-kub.jpg", label: "Renal Calculus", specialty: "Urology", type: "KUB" },
  { dir: "spotdx-images", file: "complete-heart-block-ecg.jpg", label: "Complete Heart Block", specialty: "Cardiology", type: "ECG" },
  { dir: "spotdx-images", file: "lbbb-ecg.jpg", label: "Left Bundle Branch Block", specialty: "Cardiology", type: "ECG" },
  { dir: "spotdx-images", file: "svt-ecg.jpg", label: "Supraventricular Tachycardia", specialty: "Cardiology", type: "ECG" },
  { dir: "spotdx-images", file: "cardiomegaly-cxr.jpg", label: "Cardiomegaly", specialty: "Cardiology", type: "CXR" },
  { dir: "spotdx-images", file: "consolidation-cxr.jpg", label: "Lobar Consolidation", specialty: "Respiratory", type: "CXR" },
  { dir: "spotdx-images", file: "tension-pneumothorax-cxr.jpg", label: "Tension Pneumothorax", specialty: "Respiratory", type: "CXR" },
  { dir: "spotdx-images", file: "clubbing-fingers.jpg", label: "Finger Clubbing", specialty: "Respiratory", type: "Clinical" },
  { dir: "spotdx-images", file: "dupuytren-contracture.jpg", label: "Dupuytren's Contracture", specialty: "Orthopaedics", type: "Clinical" },
  { dir: "spotdx-images", file: "thyroid-goitre.jpg", label: "Thyroid Goitre", specialty: "Endocrinology", type: "Clinical" },
  { dir: "spotdx-images", file: "hypertensive-retinopathy-fundus.jpg", label: "Hypertensive Retinopathy", specialty: "Ophthalmology", type: "Fundoscopy" },
  { dir: "spotdx-images", file: "tonsillitis-exudate.jpg", label: "Exudative Tonsillitis (EBV)", specialty: "ENT", type: "Clinical" },
  { dir: "spotdx-images", file: "pagets-disease-skull-xray.jpg", label: "Paget's Disease (Skull)", specialty: "Rheumatology", type: "X-ray" },
  { dir: "spotdx-images", file: "epiglottitis-thumb-sign.jpg", label: "Epiglottitis (Thumb Sign)", specialty: "ENT", type: "X-ray" },
  { dir: "derm-images", file: "erythema-nodosum.jpg", label: "Erythema Nodosum", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "cellulitis.jpg", label: "Cellulitis", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "acne-vulgaris.jpg", label: "Acne Vulgaris", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "rosacea.jpg", label: "Rosacea", specialty: "Dermatology", type: "Clinical" },
  { dir: "derm-images", file: "lichen-planus.jpg", label: "Lichen Planus", specialty: "Dermatology", type: "Clinical" },
];

const IMAGES: GalleryItem[] = [...BASE_IMAGES, ...(extraImages as GalleryItem[])];

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
