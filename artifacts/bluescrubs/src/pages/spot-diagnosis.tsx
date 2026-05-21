import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const IMAGES = [
  { file: "inferior-stemi-ecg.png", label: "Inferior STEMI", specialty: "Cardiology", type: "ECG" },
  { file: "atrial-fibrillation-ecg.png", label: "Atrial Fibrillation", specialty: "Cardiology", type: "ECG" },
  { file: "hyperkalaemia-ecg.png", label: "Hyperkalaemia", specialty: "Cardiology", type: "ECG" },
  { file: "pericarditis-ecg.png", label: "Pericarditis", specialty: "Cardiology", type: "ECG" },
  { file: "pneumothorax-cxr.png", label: "Pneumothorax", specialty: "Respiratory", type: "CXR" },
  { file: "pleural-effusion-cxr.png", label: "Pleural Effusion", specialty: "Respiratory", type: "CXR" },
  { file: "pulmonary-embolism-ctpa.png", label: "Pulmonary Embolism", specialty: "Respiratory", type: "CTPA" },
  { file: "bells-palsy.png", label: "Bell's Palsy", specialty: "Neurology", type: "Clinical" },
  { file: "pancoast-horner-syndrome.png", label: "Pancoast + Horner", specialty: "Neurology", type: "Clinical" },
  { file: "acute-angle-closure-glaucoma.png", label: "Acute Angle-Closure Glaucoma", specialty: "Ophthalmology", type: "Clinical" },
  { file: "chlamydial-conjunctivitis.png", label: "Chlamydial Conjunctivitis", specialty: "Ophthalmology", type: "Clinical" },
  { file: "meningococcal-rash.png", label: "Meningococcal Rash", specialty: "Infectious Diseases", type: "Clinical" },
  { file: "chickenpox.png", label: "Chickenpox", specialty: "Infectious Diseases", type: "Clinical" },
  { file: "slapped-cheek-erythema-infectiosum.png", label: "Slapped Cheek (Parvovirus B19)", specialty: "Infectious Diseases", type: "Clinical" },
  { file: "scarlet-fever.png", label: "Scarlet Fever", specialty: "Infectious Diseases", type: "Clinical" },
  { file: "psoriasis.png", label: "Psoriasis", specialty: "Dermatology", type: "Clinical" },
  { file: "atopic-eczema.png", label: "Atopic Eczema", specialty: "Dermatology", type: "Clinical" },
  { file: "melanoma.png", label: "Melanoma", specialty: "Dermatology", type: "Clinical" },
  { file: "herpes-zoster-shingles.png", label: "Herpes Zoster (Shingles)", specialty: "Dermatology", type: "Clinical" },
  { file: "rheumatoid-hands.png", label: "Rheumatoid Arthritis", specialty: "Rheumatology", type: "Clinical" },
  { file: "gout-foot.png", label: "Acute Gout", specialty: "Rheumatology", type: "Clinical" },
  { file: "graves-disease.png", label: "Graves' Disease", specialty: "Endocrinology", type: "Clinical" },
  { file: "neuropathic-diabetic-ulcer.png", label: "Neuropathic Diabetic Ulcer", specialty: "Endocrinology", type: "Clinical" },
  { file: "kawasaki-disease.png", label: "Kawasaki Disease", specialty: "Paediatrics", type: "Clinical" },
  { file: "croup-laryngotracheobronchitis.png", label: "Croup (Steeple Sign)", specialty: "Paediatrics", type: "CXR" },
  { file: "otitis-externa.png", label: "Otitis Externa", specialty: "ENT", type: "Clinical" },
  { file: "peritonsillar-abscess-quinsy.png", label: "Peritonsillar Abscess (Quinsy)", specialty: "ENT", type: "Clinical" },
  { file: "obstructive-jaundice-pancreatic-cancer.png", label: "Obstructive Jaundice", specialty: "Gastroenterology", type: "Clinical" },
  { file: "cirrhosis-stigmata.png", label: "Liver Cirrhosis Stigmata", specialty: "Gastroenterology", type: "Clinical" },
  { file: "small-bowel-obstruction-axr.png", label: "Small Bowel Obstruction", specialty: "Radiology", type: "AXR" },
];

const SPECIALTY_COLORS: Record<string, string> = {
  Cardiology: "bg-red-100 text-red-700",
  Respiratory: "bg-sky-100 text-sky-700",
  Neurology: "bg-purple-100 text-purple-700",
  Ophthalmology: "bg-teal-100 text-teal-700",
  "Infectious Diseases": "bg-orange-100 text-orange-700",
  Dermatology: "bg-pink-100 text-pink-700",
  Rheumatology: "bg-amber-100 text-amber-700",
  Endocrinology: "bg-lime-100 text-lime-700",
  Paediatrics: "bg-violet-100 text-violet-700",
  ENT: "bg-cyan-100 text-cyan-700",
  Gastroenterology: "bg-yellow-100 text-yellow-700",
  Radiology: "bg-slate-100 text-slate-700",
};

const ALL_SPECIALTIES = [...new Set(IMAGES.map((i) => i.specialty))].sort();

export default function SpotDiagnosis() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<(typeof IMAGES)[0] | null>(null);

  const filtered = IMAGES.filter((img) => {
    const matchesSearch =
      !search ||
      img.label.toLowerCase().includes(search.toLowerCase()) ||
      img.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || img.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Spot Diagnosis Gallery</h1>
              <p className="text-sm text-gray-500">{IMAGES.length} AI-generated clinical images</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            placeholder="Search by diagnosis or specialty…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSpecialty(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                !selectedSpecialty
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              All ({IMAGES.length})
            </button>
            {ALL_SPECIALTIES.map((sp) => (
              <button
                key={sp}
                onClick={() => setSelectedSpecialty(selectedSpecialty === sp ? null : sp)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selectedSpecialty === sp
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
              >
                {sp} ({IMAGES.filter((i) => i.specialty === sp).length})
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((img) => (
            <button
              key={img.file}
              onClick={() => setLightbox(img)}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all text-left"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={`/spotdx-images/${img.file}`}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-gray-800 leading-tight mb-1.5 line-clamp-2">{img.label}</p>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${SPECIALTY_COLORS[img.specialty] ?? "bg-gray-100 text-gray-600"}`}>
                    {img.specialty}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{img.type}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No images match your search.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`/spotdx-images/${lightbox.file}`}
              alt={lightbox.label}
              className="w-full object-contain max-h-[70vh]"
            />
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{lightbox.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SPECIALTY_COLORS[lightbox.specialty] ?? "bg-gray-100 text-gray-600"}`}>
                    {lightbox.specialty}
                  </span>
                  <span className="text-xs text-gray-400">{lightbox.type}</span>
                </div>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
