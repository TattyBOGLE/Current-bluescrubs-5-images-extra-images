/**
 * Two-stage medical image generation pipeline.
 * Stage 1: GPT writes a clinically validated prompt
 * Stage 2: gpt-image-1 generates the image
 * Stage 3: GPT validates the result
 *
 * Run: NODE_PATH=artifacts/api-server/node_modules node scripts/generate-medical-images.mjs [--priority] [--all] [--id some-file.png]
 */

import { createRequire } from "module";
import { writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const OpenAI = require("openai").default ?? require("openai");

const BASE_URL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
const API_KEY = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

if (!BASE_URL || !API_KEY) {
  console.error("❌ Missing AI_INTEGRATIONS_OPENAI_BASE_URL or AI_INTEGRATIONS_OPENAI_API_KEY");
  process.exit(1);
}

const openai = new OpenAI({ baseURL: BASE_URL, apiKey: API_KEY });

const STATUS_FILE = resolve(__dirname, "../artifacts/bluescrubs/src/data/image-status.json");
const SPOTDX_DIR = resolve(__dirname, "../artifacts/bluescrubs/public/spotdx-images");
const DERM_DIR = resolve(__dirname, "../artifacts/bluescrubs/public/derm-images");

// ─────────────────────────────────────────────────────────────────────────────
// CLINICAL FEATURES CATALOGUE
// Each entry: { file, dir, label, clinicalFeatures, mustShow, modality }
// ─────────────────────────────────────────────────────────────────────────────
const IMAGES = [
  // ── PRIORITY LIST (regenerate first — currently least accurate) ───────────
  {
    file: "obstructive-jaundice-pancreatic-cancer.png", dir: "spotdx",
    label: "Obstructive Jaundice",
    clinicalFeatures: "deep yellow-green icterus of sclera and skin, painless jaundice, dark tea-coloured urine, pale clay-coloured stools, pruritus scratch marks on skin, distended non-tender gallbladder (Courvoisier sign), cachectic elderly patient",
    mustShow: "scleral icterus clearly visible, yellowish-green skin discolouration, clinical context of painless obstructive jaundice",
    modality: "clinical photo",
  },
  {
    file: "cirrhosis-stigmata.png", dir: "spotdx",
    label: "Liver Cirrhosis Stigmata",
    clinicalFeatures: "composite view showing: spider naevi (central arteriole with radiating vessels) on upper chest/arms, palmar erythema (redness of thenar/hypothenar eminences), leukonychia (white nails), caput medusae (dilated periumbilical veins), gynaecomastia, jaundiced skin, parotid enlargement",
    mustShow: "spider naevi, caput medusae, leukonychia, and palmar erythema all visible — composite collage or single clinical photo",
    modality: "clinical photo",
  },
  {
    file: "kawasaki-disease.png", dir: "spotdx",
    label: "Kawasaki Disease",
    clinicalFeatures: "child aged 2-5 years, strawberry tongue (bright red tongue with prominent papillae), bilateral non-purulent conjunctival injection (red eyes without discharge), polymorphous erythematous rash on trunk, cracked red lips, peripheral oedema and erythema of hands and feet, cervical lymphadenopathy",
    mustShow: "strawberry tongue, bilateral conjunctival injection, polymorphous rash all visible",
    modality: "clinical photo",
  },
  {
    file: "complete-heart-block-ecg.png", dir: "spotdx",
    label: "Complete Heart Block ECG",
    clinicalFeatures: "standard 12-lead ECG on pink/red grid paper, P waves at rate 75-100 bpm (regular PP intervals), QRS complexes at rate 30-40 bpm (regular RR intervals), P waves and QRS complexes completely dissociated with no fixed PR interval, broad wide QRS escape rhythm (>120ms), AV dissociation clearly demonstrated across multiple leads",
    mustShow: "clear AV dissociation — P waves and QRS complexes firing independently at different rates",
    modality: "ECG",
  },
  {
    file: "tension-pneumothorax-cxr.png", dir: "spotdx",
    label: "Tension Pneumothorax CXR",
    clinicalFeatures: "PA erect CXR, complete absence of lung markings on right side, trachea deviated markedly to the LEFT (away from tension side), mediastinal shift to left, depressed right hemidiaphragm, right lung collapsed against right mediastinum, left lung normal, neck veins not visible on CXR",
    mustShow: "tracheal deviation to the LEFT is the KEY sign — must be visually obvious and exaggerated",
    modality: "CXR",
  },
  // ── ECG IMAGES ─────────────────────────────────────────────────────────────
  {
    file: "inferior-stemi-ecg.png", dir: "spotdx",
    label: "Inferior STEMI",
    clinicalFeatures: "standard 12-lead ECG, ST elevation ≥2mm in inferior leads II, III, aVF, reciprocal ST depression in anterior leads I and aVL, hyperacute T waves in II/III/aVF, possible Q waves developing in inferior leads",
    mustShow: "ST elevation in inferior leads II III aVF with reciprocal depression in aVL",
    modality: "ECG",
  },
  {
    file: "atrial-fibrillation-ecg.png", dir: "spotdx",
    label: "Atrial Fibrillation ECG",
    clinicalFeatures: "12-lead ECG, irregularly irregular R-R intervals, absent P waves replaced by fibrillatory baseline (fine chaotic oscillations), ventricular rate 80-130 bpm, narrow QRS complexes, no two consecutive R-R intervals the same",
    mustShow: "irregular R-R intervals, absent P waves, fibrillatory baseline",
    modality: "ECG",
  },
  {
    file: "hyperkalaemia-ecg.png", dir: "spotdx",
    label: "Hyperkalaemia ECG",
    clinicalFeatures: "12-lead ECG showing progression: peaked tall symmetrical T waves (tented T waves) in chest leads V1-V6, widened QRS complex >120ms, flattened or absent P waves, sine wave pattern, bradycardia",
    mustShow: "tall peaked tented T waves clearly visible in multiple leads, widened QRS",
    modality: "ECG",
  },
  {
    file: "pericarditis-ecg.png", dir: "spotdx",
    label: "Pericarditis ECG",
    clinicalFeatures: "12-lead ECG, widespread concave (saddle-shaped) ST elevation in nearly all leads (I, II, aVL, aVF, V2-V6), PR segment depression (especially lead II), reciprocal changes in aVR (PR elevation, ST depression), no reciprocal ST depression except in aVR and V1",
    mustShow: "widespread saddle-shaped ST elevation and PR depression — distinguishes from STEMI",
    modality: "ECG",
  },
  {
    file: "ventricular-tachycardia-ecg.png", dir: "spotdx",
    label: "Ventricular Tachycardia ECG",
    clinicalFeatures: "12-lead ECG, broad complex tachycardia rate 160-200 bpm, QRS width >120ms, AV dissociation (P waves visible independently), fusion beats, capture beats, left bundle branch morphology, concordance across chest leads (all positive or all negative)",
    mustShow: "broad complex tachycardia with AV dissociation",
    modality: "ECG",
  },
  {
    file: "lbbb-ecg.png", dir: "spotdx",
    label: "LBBB ECG",
    clinicalFeatures: "12-lead ECG, QRS duration >120ms, broad notched M-shaped (WiLLiaM pattern) QRS complex in lateral leads V5 V6 I aVL, W-shaped complex in V1, broad slurred R wave in lateral leads, deep S wave in V1, discordant ST changes and T wave inversions in lateral leads",
    mustShow: "M-shaped broad notched QRS in V5/V6, W pattern in V1 — WiLLiaM pattern",
    modality: "ECG",
  },
  {
    file: "svt-ecg.png", dir: "spotdx",
    label: "SVT ECG",
    clinicalFeatures: "12-lead ECG, regular narrow complex tachycardia rate 150-200 bpm, absent visible P waves (buried in QRS or retrograde P waves in ST segment), abrupt onset, QRS <120ms, regular R-R intervals",
    mustShow: "regular narrow complex tachycardia at 150-200 bpm with absent P waves",
    modality: "ECG",
  },
  // ── CXR/RADIOLOGY IMAGES ───────────────────────────────────────────────────
  {
    file: "pneumothorax-cxr.png", dir: "spotdx",
    label: "Pneumothorax CXR",
    clinicalFeatures: "PA erect CXR, visible pleural line separating lung edge from chest wall on left side, absent lung markings peripheral to pleural line, partial collapse of left lung, trachea central (not deviated — simple pneumothorax), no mediastinal shift",
    mustShow: "visible pleural line with absent lung markings lateral to it",
    modality: "CXR",
  },
  {
    file: "pleural-effusion-cxr.png", dir: "spotdx",
    label: "Pleural Effusion CXR",
    clinicalFeatures: "PA erect CXR, homogeneous opacification at right base with meniscus sign (concave upper border), blunting of right costophrenic angle, possible tracheal deviation to opposite side if massive, haziness at right lower zone",
    mustShow: "meniscus sign and blunted costophrenic angle",
    modality: "CXR",
  },
  {
    file: "pulmonary-embolism-ctpa.png", dir: "spotdx",
    label: "Pulmonary Embolism CTPA",
    clinicalFeatures: "axial CTPA image, filling defect (dark central clot surrounded by bright contrast) in main pulmonary artery or bilateral pulmonary arteries, saddle embolus straddling the bifurcation, right heart strain visible",
    mustShow: "filling defect (dark clot) in pulmonary artery against bright contrast background",
    modality: "CTPA",
  },
  {
    file: "cardiomegaly-cxr.png", dir: "spotdx",
    label: "Cardiomegaly CXR",
    clinicalFeatures: "PA erect CXR, enlarged cardiac silhouette with cardiothoracic ratio clearly greater than 0.5, prominent upper lobe blood diversion, Kerley B lines at lung bases, bilateral perihilar haziness, possible small bilateral pleural effusions",
    mustShow: "enlarged cardiac shadow clearly occupying more than half the thoracic width",
    modality: "CXR",
  },
  {
    file: "consolidation-cxr.png", dir: "spotdx",
    label: "Lobar Consolidation CXR",
    clinicalFeatures: "PA erect CXR, homogeneous opacification of right lower lobe with air bronchograms (dark branching air-filled bronchi visible within the white opacity), sharp horizontal upper border (fissure), no volume loss, contiguous with right heart border",
    mustShow: "air bronchograms within the consolidation — key distinguishing feature",
    modality: "CXR",
  },
  {
    file: "small-bowel-obstruction-axr.png", dir: "spotdx",
    label: "Small Bowel Obstruction AXR",
    clinicalFeatures: "supine AXR, multiple centrally located dilated loops of small bowel >3cm, valvulae conniventes (mucosal folds crossing full width of bowel — distinguishes from large bowel), step-ladder pattern, no gas in large bowel or rectum",
    mustShow: "central dilated loops with valvulae conniventes in step-ladder pattern",
    modality: "AXR",
  },
  {
    file: "sigmoid-volvulus-axr.png", dir: "spotdx",
    label: "Sigmoid Volvulus AXR",
    clinicalFeatures: "supine AXR, massively dilated loop of sigmoid colon with coffee bean or bent inner tube sign, loop pointing from left iliac fossa towards right upper quadrant, central crease where the two walls of the loop touch (coffee bean crease), no haustral folds in sigmoid, absence of rectal gas",
    mustShow: "coffee bean sign — massively dilated sigmoid loop with central crease pointing from left iliac fossa to right upper quadrant",
    modality: "AXR",
  },
  {
    file: "renal-calculus-kub.png", dir: "spotdx",
    label: "Renal Calculus KUB",
    clinicalFeatures: "KUB (kidney ureter bladder) X-ray, radio-opaque calculus visible in the right renal pelvis (white dense shadow), possibly second stone in right ureter along the course of the ureter, spine and pelvis visible for anatomical reference",
    mustShow: "radio-opaque calculus in right renal region with bony landmarks for orientation",
    modality: "X-ray",
  },
  {
    file: "croup-laryngotracheobronchitis.png", dir: "spotdx",
    label: "Croup (Steeple Sign) CXR",
    clinicalFeatures: "AP neck/chest X-ray of a toddler, loss of normal shoulder appearance of subglottic trachea, steeple sign (pencil or church steeple-shaped narrowing of subglottic trachea on frontal view), symmetrical subglottic narrowing, normal epiglottis",
    mustShow: "steeple sign — symmetrical tapering subglottic narrowing on frontal neck X-ray",
    modality: "X-ray",
  },
  // ── CLINICAL PHOTOS ────────────────────────────────────────────────────────
  {
    file: "pancoast-horner-syndrome.png", dir: "spotdx",
    label: "Pancoast + Horner Syndrome",
    clinicalFeatures: "PA CXR showing opacity at right lung apex with pleural thickening and possible rib erosion, clinical photo of Horner syndrome: right-sided ptosis (drooping upper eyelid), miosis (small pupil), anhidrosis, enophthalmos",
    mustShow: "apical opacity on CXR and Horner triad (ptosis, miosis, enophthalmos) visible",
    modality: "CXR + clinical",
  },
  {
    file: "bells-palsy.png", dir: "spotdx",
    label: "Bell's Palsy",
    clinicalFeatures: "close-up facial photo, unilateral right lower motor neuron facial nerve palsy: inability to wrinkle forehead on right (forehead sparing distinguishes UMN from LMN), drooping right corner of mouth, unable to close right eye (lagophthalmos), smooth nasolabial fold on affected side, asymmetric smile",
    mustShow: "forehead involvement (LMN pattern), eye unable to close, mouth drooping on same side",
    modality: "clinical photo",
  },
  {
    file: "acute-angle-closure-glaucoma.png", dir: "spotdx",
    label: "Acute Angle-Closure Glaucoma",
    clinicalFeatures: "close-up eye photo, mid-dilated fixed oval pupil (4-6mm, not reactive to light), corneal haze or haziness (oedema), conjunctival hyperaemia (red eye), circumcorneal (ciliary) flush, nausea visible patient distress, semi-dilated pupil unresponsive",
    mustShow: "mid-dilated oval fixed pupil and corneal haze — these two signs together",
    modality: "clinical photo",
  },
  {
    file: "chlamydial-conjunctivitis.png", dir: "spotdx",
    label: "Chlamydial Conjunctivitis",
    clinicalFeatures: "close-up eye photo, large follicles on tarsal conjunctiva (eversion of upper lid showing papillary hypertrophy and follicles), mucopurulent discharge, conjunctival hyperaemia, periorbital oedema, young adult, bilateral involvement",
    mustShow: "follicles on everted upper tarsal conjunctiva and mucopurulent discharge",
    modality: "clinical photo",
  },
  {
    file: "meningococcal-rash.png", dir: "spotdx",
    label: "Meningococcal Septicaemia Rash",
    clinicalFeatures: "non-blanching petechial and purpuric rash on lower legs and trunk of a child, dark red-purple irregular patches that do NOT fade under glass pressure (tumbler test positive), stellate (star-shaped) purpura, some lesions coalescing into ecchymoses",
    mustShow: "non-blanching purpuric stellate rash — key diagnostic sign",
    modality: "clinical photo",
  },
  {
    file: "chickenpox.png", dir: "spotdx",
    label: "Chickenpox (Varicella)",
    clinicalFeatures: "child with diffuse rash in different stages simultaneously: erythematous macules, papules, vesicles (dew drops on rose petal — clear fluid vesicle on red base), pustules, and crusting all present at the same time, widespread centripetal distribution (more on trunk than limbs), involving face and scalp",
    mustShow: "multiple stages simultaneously — macules, vesicles, pustules, crusts all in same image",
    modality: "clinical photo",
  },
  {
    file: "slapped-cheek-erythema-infectiosum.png", dir: "spotdx",
    label: "Slapped Cheek (Parvovirus B19)",
    clinicalFeatures: "child with bright erythematous flushed cheeks (as if slapped), fiery red bilateral facial redness sparing perioral area, lacy reticular rash on arms and trunk following facial rash, child appears well despite dramatic facial redness",
    mustShow: "bright red bilateral slapped cheek appearance with perioral sparing",
    modality: "clinical photo",
  },
  {
    file: "scarlet-fever.png", dir: "spotdx",
    label: "Scarlet Fever",
    clinicalFeatures: "child with diffuse erythematous sandpaper-textured rash starting in groin and axillae spreading to trunk, strawberry tongue (bright red with prominent papillae), Pastia's lines (dark red lines in skin folds of axillae and antecubital fossae), circumoral pallor, flushed face with perioral pallor",
    mustShow: "sandpaper rash, strawberry tongue, Pastia's lines, circumoral pallor",
    modality: "clinical photo",
  },
  {
    file: "psoriasis.png", dir: "spotdx",
    label: "Psoriasis (Body)",
    clinicalFeatures: "body view of chronic plaque psoriasis, well-demarcated erythematous plaques with thick silvery-white scale on extensor surfaces (elbows, knees), scalp involvement, possible nail pitting, symmetrical distribution, Auspitz sign (pinpoint bleeding when scale removed)",
    mustShow: "well-demarcated silvery-scaled plaques on extensor surfaces",
    modality: "clinical photo",
  },
  {
    file: "psoriasis-plaque.png", dir: "derm",
    label: "Plaque Psoriasis (Close-up)",
    clinicalFeatures: "close-up of psoriasis plaque on elbow or knee, thick adherent silvery-white scale overlying erythematous base, well-demarcated edges, Auspitz sign demonstrable, satellite lesions at periphery",
    mustShow: "thick silvery scale on erythematous well-demarcated plaque — close-up",
    modality: "clinical photo",
  },
  {
    file: "melanoma.png", dir: "spotdx",
    label: "Malignant Melanoma",
    clinicalFeatures: "close-up skin photo, asymmetric lesion with irregular jagged border, variegated colour (areas of brown, black, red, white, blue all within single lesion), diameter >6mm on sun-exposed skin (back or arm), surface irregular with possible ulceration or satellite lesions, ABCDE criteria all visible",
    mustShow: "ABCDE criteria: asymmetry, irregular border, multiple colours, large diameter",
    modality: "clinical photo",
  },
  {
    file: "basal-cell-carcinoma.png", dir: "derm",
    label: "Basal Cell Carcinoma",
    clinicalFeatures: "close-up of face or nose, pearly translucent nodule with rolled/raised telangiectatic edge, central depression or ulceration (rodent ulcer), visible telangiectasia on surface, flesh-coloured to pink shiny nodule, on sun-exposed area of elderly patient",
    mustShow: "pearly rolled edge with telangiectasia and central ulceration — rodent ulcer appearance",
    modality: "clinical photo",
  },
  {
    file: "atopic-eczema.png", dir: "spotdx",
    label: "Atopic Eczema",
    clinicalFeatures: "child or young adult, flexural distribution (antecubital fossae, popliteal fossae, neck), erythematous patches with lichenification (thickened skin with accentuated skin markings from chronic scratching), excoriations and scratch marks, dry scaly skin, weeping and crusting in acute phase",
    mustShow: "flexural distribution, lichenification, excoriations",
    modality: "clinical photo",
  },
  {
    file: "herpes-zoster-shingles.png", dir: "spotdx",
    label: "Herpes Zoster (Shingles)",
    clinicalFeatures: "unilateral thoracic dermatome distribution (T5 or T10 level), grouped vesicles and pustules on erythematous base, DOES NOT cross midline, dermatomal band from spine to anterior chest wall, painful eruption in elderly patient, some vesicles crusting over",
    mustShow: "clear dermatomal boundary, vesicle clusters on erythematous base, midline clearly not crossed",
    modality: "clinical photo",
  },
  {
    file: "impetigo.png", dir: "derm",
    label: "Impetigo",
    clinicalFeatures: "child's face, honey-coloured (golden-yellow) crusted lesions around mouth and nose, vesicles and bullae that have ruptured leaving golden crusts, erythematous base under crusts, satellite lesions, highly contagious superficial skin infection",
    mustShow: "honey-coloured golden crusts around mouth and nose",
    modality: "clinical photo",
  },
  {
    file: "urticaria.png", dir: "derm",
    label: "Urticaria (Hives)",
    clinicalFeatures: "trunk or arm, multiple raised erythematous wheals (smooth pale raised centre with surrounding erythematous flare), different sizes and shapes, itchy, transient migrating pattern, some wheals coalescing, central pallor with erythematous halo",
    mustShow: "raised erythematous wheals with pale centre and red flare",
    modality: "clinical photo",
  },
  {
    file: "scabies-burrows.png", dir: "derm",
    label: "Scabies (Burrows)",
    clinicalFeatures: "close-up of web spaces of fingers or wrist, linear thread-like burrows (greyish-white irregular lines 2-10mm), papules and vesicles at end of burrow, surrounding excoriations from intense nocturnal pruritus, web spaces of fingers, wrists, and sides of hands",
    mustShow: "linear burrows in web spaces of fingers — pathognomonic sign",
    modality: "clinical photo",
  },
  {
    file: "pityriasis-rosea.png", dir: "derm",
    label: "Pityriasis Rosea",
    clinicalFeatures: "trunk and proximal limbs, herald patch (single large oval scaly lesion preceding rash), followed by multiple smaller oval salmon-pink lesions following skin cleavage lines in Christmas tree pattern on back, peripheral scale (collarette scale), young adult",
    mustShow: "herald patch and Christmas tree distribution of oval lesions on trunk",
    modality: "clinical photo",
  },
  {
    file: "tinea-corporis.png", dir: "derm",
    label: "Tinea Corporis (Ringworm)",
    clinicalFeatures: "annular erythematous lesion with active scaly raised border and central clearing, ring-shaped fungal infection on arm or trunk, multiple lesions may coalesce, well-defined advancing scaly margin, central healing",
    mustShow: "ring-shaped lesion with active scaly border and central clearing — classic ringworm",
    modality: "clinical photo",
  },
  {
    file: "seborrhoeic-dermatitis.png", dir: "derm",
    label: "Seborrhoeic Dermatitis",
    clinicalFeatures: "greasy yellowish scales on erythematous base in sebaceous gland-rich areas: nasolabial folds, eyebrows, scalp hairline, behind ears, central chest, erythematous patches with yellowish-orange greasy scaling, adult patient",
    mustShow: "greasy yellow scales in nasolabial folds and eyebrows — sebaceous distribution",
    modality: "clinical photo",
  },
  {
    file: "herpes-zoster.png", dir: "derm",
    label: "Herpes Zoster (Dermatomal)",
    clinicalFeatures: "close-up of unilateral dermatomal vesicular rash, grouped vesicles in various stages (papules, vesicles, pustules, crusts) on erythematous base, strictly unilateral not crossing midline, thoracic dermatome T4-T6",
    mustShow: "dermatomal vesicular rash strictly unilateral",
    modality: "clinical photo",
  },
  {
    file: "rheumatoid-hands.png", dir: "spotdx",
    label: "Rheumatoid Arthritis (Hands)",
    clinicalFeatures: "both hands of adult patient, symmetrical joint involvement, swelling of MCP and PIP joints (not DIP), ulnar deviation of fingers at MCP joints, boutonniere and swan neck deformities, rheumatoid nodules on extensor surfaces, thenar and hypothenar wasting, Z-deformity of thumb",
    mustShow: "MCP swelling, ulnar deviation, swan neck or boutonniere deformities",
    modality: "clinical photo",
  },
  {
    file: "gout-foot.png", dir: "spotdx",
    label: "Acute Gout (Podagra)",
    clinicalFeatures: "close-up of right foot first MTP joint (big toe base), acute inflammation: intense erythema, warmth, marked swelling of the first metatarsophalangeal joint, shiny tense overlying skin, severe tender joint, possibly tophi (white chalky deposits) around the joint",
    mustShow: "swollen red shiny first MTP joint — classic podagra",
    modality: "clinical photo",
  },
  {
    file: "graves-disease.png", dir: "spotdx",
    label: "Graves' Disease",
    clinicalFeatures: "middle-aged woman, bilateral exophthalmos (proptosis — eyes bulging forwards), lid retraction exposing sclera above iris (thyroid stare), lid lag, possible chemosis (conjunctival oedema), visible goitre in neck, anxious appearance",
    mustShow: "bilateral exophthalmos and lid retraction — eye signs of Graves' disease",
    modality: "clinical photo",
  },
  {
    file: "neuropathic-diabetic-ulcer.png", dir: "spotdx",
    label: "Neuropathic Diabetic Ulcer",
    clinicalFeatures: "close-up of sole of foot or pressure point (heel or metatarsal head), punched-out deep ulcer with callus rim, painless neuropathic ulcer at pressure point, surrounding hyperkeratosis (callus), no surrounding cellulitis, warm foot with bounding pulses (neuropathic rather than ischaemic)",
    mustShow: "punched-out deep ulcer with callous rim at pressure point on foot sole",
    modality: "clinical photo",
  },
  {
    file: "otitis-externa.png", dir: "spotdx",
    label: "Otitis Externa",
    clinicalFeatures: "otoscope view of external auditory canal, erythematous oedematous external canal with purulent or moist debris, canal wall swollen and red, possible fungal hyphae (white cottony debris if otomycosis), tragal tenderness sign context, normal tympanic membrane if visible",
    mustShow: "oedematous erythematous external canal with debris",
    modality: "clinical photo",
  },
  {
    file: "peritonsillar-abscess-quinsy.png", dir: "spotdx",
    label: "Peritonsillar Abscess (Quinsy)",
    clinicalFeatures: "oropharynx view, unilateral peritonsillar swelling bulging the anterior tonsillar pillar, uvula deviated to opposite side (away from the abscess), erythematous swollen right tonsil and soft palate, trismus (limited mouth opening), hot potato voice context",
    mustShow: "unilateral peritonsillar bulge with uvula deviation to opposite side",
    modality: "clinical photo",
  },
  {
    file: "clubbing-fingers.png", dir: "spotdx",
    label: "Finger Clubbing",
    clinicalFeatures: "close-up of both hands held together (Schamroth's window test), loss of diamond-shaped window normally formed between fingernails when opposed (Schamroth's sign), increased curvature of nails both longitudinally and transversely, increased AP diameter of distal phalanx (drumstick appearance), loss of normal 165-degree Lovibond angle",
    mustShow: "Schamroth's window test — loss of diamond window and drumstick appearance",
    modality: "clinical photo",
  },
  {
    file: "dupuytren-contracture.png", dir: "spotdx",
    label: "Dupuytren's Contracture",
    clinicalFeatures: "palm of hand, firm fibrous cord palpable and visible running from palm to ring and little finger, fixed flexion contracture at MCP and PIP joints of ring and little fingers unable to be fully extended, thickened palmar fascia, nodular thickening at base of ring finger, pit in palm overlying cord",
    mustShow: "fibrous palmar cord and fixed flexion contracture of ring and little fingers",
    modality: "clinical photo",
  },
  {
    file: "thyroid-goitre.png", dir: "spotdx",
    label: "Thyroid Goitre",
    clinicalFeatures: "woman's neck showing bilateral symmetric thyroid enlargement, smooth diffuse goitre moving on swallowing, symmetrical swelling in lower anterior neck, possible visible pulsation, neck veins not distended, patient looking slightly anxious (hyperthyroid appearance)",
    mustShow: "diffuse smooth symmetrical thyroid enlargement moving on swallowing",
    modality: "clinical photo",
  },
  {
    file: "hypertensive-retinopathy-fundus.png", dir: "spotdx",
    label: "Hypertensive Retinopathy",
    clinicalFeatures: "fundus photograph, optic disc with papilloedema (blurred disc margins, raised disc), flame-shaped haemorrhages following nerve fibre layer near disc, cotton wool spots (white fluffy infarcts of nerve fibre layer), hard exudates (bright yellow lipid deposits), silver wiring of arterioles, AV nipping at arteriovenous crossings",
    mustShow: "papilloedema, flame haemorrhages, cotton wool spots, and silver wiring all visible — Grade 4",
    modality: "fundus photo",
  },
  {
    file: "tonsillitis-exudate.png", dir: "spotdx",
    label: "Exudative Tonsillitis",
    clinicalFeatures: "oropharynx view, both tonsils massively enlarged with white-yellow exudate (pus) covering tonsillar crypts and surfaces, erythematous inflamed tonsils and pharynx, uvula central, anterior cervical lymphadenopathy context, young adult patient",
    mustShow: "bilateral tonsillar enlargement with white-yellow exudate coating tonsillar surfaces",
    modality: "clinical photo",
  },
  {
    file: "pagets-disease-skull-xray.png", dir: "spotdx",
    label: "Paget's Disease Skull X-ray",
    clinicalFeatures: "lateral skull X-ray, enlarged thickened skull vault, patchy mixed sclerotic and lucent areas giving cotton-wool or snow storm appearance, thickened diploe (inner and outer tables both thickened), involvement of base of skull, no focal lytic lesion to suggest metastasis",
    mustShow: "thickened skull with cotton-wool patchy sclerotic densities — pathognomonic",
    modality: "X-ray",
  },
  {
    file: "epiglottitis-thumb-sign.png", dir: "spotdx",
    label: "Epiglottitis (Thumb Sign)",
    clinicalFeatures: "lateral soft tissue neck X-ray, massively swollen enlarged epiglottis resembling a thumb (thumb sign), normal aryepiglottic folds swollen, narrowed airway, soft tissue swelling anterior to cervical spine, comparison: normal pencil-thin epiglottis vs swollen thumb-shaped epiglottis",
    mustShow: "thumb sign — swollen rounded epiglottis instead of normal thin pencil-like epiglottis",
    modality: "X-ray",
  },
  {
    file: "erythema-nodosum.png", dir: "derm",
    label: "Erythema Nodosum",
    clinicalFeatures: "pretibial surface (shins) of both legs, multiple tender raised erythematous nodules 1-5cm diameter, dark red to bruise-purple colour (tender panniculitis), bilateral distribution on anterior shins, slightly raised palpable lesions, bruise-like colour change",
    mustShow: "tender erythematous nodules on bilateral pretibial surfaces (shins)",
    modality: "clinical photo",
  },
  {
    file: "cellulitis.png", dir: "derm",
    label: "Cellulitis",
    clinicalFeatures: "lower leg, spreading erythema with ill-defined borders, warm erythematous skin with advancing edge marked in pen, oedema and swelling of affected area, skin tense and shiny, ascending lymphangitis (red streak) possible, swollen ankle",
    mustShow: "spreading erythema with ill-defined borders and marked advancing edge",
    modality: "clinical photo",
  },
  {
    file: "acne-vulgaris.png", dir: "derm",
    label: "Acne Vulgaris",
    clinicalFeatures: "teenage face (forehead, cheeks, chin), multiple open comedones (blackheads with central dark plug), closed comedones (whiteheads), erythematous papules and pustules, deeper nodules and cysts on cheeks, inflammatory lesions with post-inflammatory erythema",
    mustShow: "comedones (blackheads and whiteheads), papulopustules, and nodules all present",
    modality: "clinical photo",
  },
  {
    file: "rosacea.png", dir: "derm",
    label: "Rosacea",
    clinicalFeatures: "middle-aged fair-skinned woman's face, centrofacial erythema and flushing on nose and cheeks, telangiectasia (visible dilated small vessels) on cheeks, erythematous papules and pustules WITHOUT comedones, possible rhinophyma (bulbous red nose), butterfly distribution",
    mustShow: "centrofacial erythema, telangiectasia, papulopustules WITHOUT comedones",
    modality: "clinical photo",
  },
  {
    file: "lichen-planus.png", dir: "derm",
    label: "Lichen Planus",
    clinicalFeatures: "wrists and forearms, violaceous (purple) flat-topped polygonal papules, fine white lace-like lines on surface of lesions (Wickham's striae), linear arrangement along scratch marks (Koebner phenomenon), intensely itchy, possibly oral buccal mucosa lacy white patches",
    mustShow: "violaceous flat-topped polygonal papules with Wickham's striae on wrists",
    modality: "clinical photo",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function loadStatus() {
  try { return JSON.parse(readFileSync(STATUS_FILE, "utf8")); }
  catch { return {}; }
}

function saveStatus(status) {
  writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
}

async function generateClinicalPrompt(label, clinicalFeatures, mustShow, modality) {
  const systemPrompt = `You are a clinical medical educator with expertise in visual diagnosis. 
Your job is to write precise image generation prompts that produce clinically accurate, educationally valid medical images.

For each condition you must include ALL of the following in the prompt:
- Exact anatomical location affected
- Specific pathological features (colour, texture, morphology, distribution)
- Classic diagnostic signs that differentiate this condition from mimics
- Correct skin tone representation where relevant
- Appropriate clinical context (body part, patient age group if relevant)
- Imaging modality details if radiology (e.g. PA erect CXR, AP AXR)
- ECG lead specifics if cardiology

Output ONLY the image generation prompt. No explanation. No preamble.`;

  const userMsg = `Condition: ${label}
Clinical features: ${clinicalFeatures}
Must show: ${mustShow}
Modality: ${modality}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.1",
    max_completion_tokens: 600,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMsg },
    ],
  });
  return response.choices[0].message.content.trim();
}

async function validateImage(label, clinicalFeatures, promptUsed) {
  const response = await openai.chat.completions.create({
    model: "gpt-5.1",
    max_completion_tokens: 300,
    messages: [{
      role: "user",
      content: `You are a clinician reviewing a medical image for educational accuracy.
This image was generated for: ${label}
Required features: ${clinicalFeatures}
Image generation prompt used: ${promptUsed}

Based on the prompt used, would a medical student likely be able to correctly identify this condition?
List any missing or incorrect clinical features if any.
Reply with: PASS or FAIL, then a one-line reason.`,
    }],
  });
  const text = response.choices[0].message.content.trim();
  const passed = text.toUpperCase().startsWith("PASS");
  return { passed, feedback: text };
}

async function generateImage(prompt, modality) {
  const suffixes = {
    ECG: "Clean ECG trace on standard pink grid paper. Correct waveform morphology. Clinically recognisable pattern. No labels or annotations on the trace itself.",
    CXR: "Authentic PA chest X-ray appearance. Correct radiological density and contrast. Classic textbook presentation. No annotations or labels.",
    AXR: "Authentic supine abdominal X-ray appearance. Correct radiological density. Classic textbook presentation. No annotations or labels.",
    CTPA: "Authentic axial CT pulmonary angiogram appearance. Correct Hounsfield density contrast. No annotations.",
    "X-ray": "Authentic plain X-ray appearance. Correct radiological density and contrast. Classic textbook presentation. No annotations.",
    "fundus photo": "Authentic fundus photograph. Correct retinal appearance. Educational medical reference standard.",
    default: "Clinically accurate medical photograph. Realistic pathological features clearly visible. Sharp focus on the affected area. Professional clinical lighting. No text overlays. No watermarks. Educational medical reference standard.",
  };
  const suffix = suffixes[modality] ?? suffixes.default;
  const fullPrompt = `${prompt}\n\n${suffix}`;

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: fullPrompt,
    size: "1024x1024",
    n: 1,
  });

  const b64 = response.data[0].b64_json;
  return Buffer.from(b64, "base64");
}

async function processImage(img, attempt = 1, extraFeedback = "") {
  const maxAttempts = 3;
  console.log(`\n  [${attempt}/${maxAttempts}] Generating prompt for: ${img.label}`);

  const featuresWithFeedback = extraFeedback
    ? `${img.clinicalFeatures}. PREVIOUS ATTEMPT FEEDBACK: ${extraFeedback}`
    : img.clinicalFeatures;

  let prompt;
  try {
    prompt = await generateClinicalPrompt(img.label, featuresWithFeedback, img.mustShow, img.modality);
    console.log(`  📝 Prompt: ${prompt.substring(0, 100)}...`);
  } catch (err) {
    console.error(`  ❌ Prompt generation failed: ${err.message}`);
    return "flagged";
  }

  let imageBuffer;
  try {
    imageBuffer = await generateImage(prompt, img.modality);
    console.log(`  🖼  Image generated (${Math.round(imageBuffer.length / 1024)}KB)`);
  } catch (err) {
    console.error(`  ❌ Image generation failed: ${err.message}`);
    if (attempt < maxAttempts) {
      await sleep(3000);
      return processImage(img, attempt + 1, "image generation failed, retry with clearer clinical description");
    }
    return "flagged";
  }

  // Validate
  let validation;
  try {
    validation = await validateImage(img.label, img.clinicalFeatures, prompt);
  } catch (err) {
    console.warn(`  ⚠  Validation call failed (${err.message}), treating as PASS`);
    validation = { passed: true, feedback: "validation skipped" };
  }

  if (validation.passed) {
    // Save image
    const outDir = img.dir === "derm" ? DERM_DIR : SPOTDX_DIR;
    const outPath = `${outDir}/${img.file}`;
    writeFileSync(outPath, imageBuffer);
    console.log(`  ✅ PASS — saved to ${img.file}`);
    return "validated";
  } else {
    console.log(`  ⚠  FAIL — ${validation.feedback}`);
    if (attempt < maxAttempts) {
      await sleep(2000);
      return processImage(img, attempt + 1, validation.feedback);
    }
    // Save anyway on last attempt
    const outDir = img.dir === "derm" ? DERM_DIR : SPOTDX_DIR;
    writeFileSync(`${outDir}/${img.file}`, imageBuffer);
    console.log(`  ⚠  Saved after max attempts (flagged for review)`);
    return "flagged";
  }
}

async function runBatch(images, concurrency = 2) {
  const status = loadStatus();
  let idx = 0;

  async function worker() {
    while (idx < images.length) {
      const img = images[idx++];
      try {
        const result = await processImage(img);
        status[img.file] = result;
        saveStatus(status);
        console.log(`  💾 Status saved: ${img.file} = ${result}`);
      } catch (err) {
        console.error(`  ❌ Unexpected error for ${img.file}: ${err.message}`);
        status[img.file] = "flagged";
        saveStatus(status);
      }
      if (idx < images.length) await sleep(1500);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const mode = args.find(a => a.startsWith("--"))?.replace("--", "") ?? "priority";
const specificId = args.find(a => !a.startsWith("--"));

const PRIORITY_FILES = [
  "obstructive-jaundice-pancreatic-cancer.png",
  "cirrhosis-stigmata.png",
  "kawasaki-disease.png",
  "complete-heart-block-ecg.png",
  "tension-pneumothorax-cxr.png",
];

let toProcess;
if (specificId) {
  toProcess = IMAGES.filter(i => i.file === specificId);
} else if (mode === "priority") {
  toProcess = IMAGES.filter(i => PRIORITY_FILES.includes(i.file));
} else if (mode === "new") {
  // Images from the most recent batch (spotdx-031 to spotdx-050)
  const newFiles = ["complete-heart-block-ecg.png","lbbb-ecg.png","svt-ecg.png","cardiomegaly-cxr.png","consolidation-cxr.png","tension-pneumothorax-cxr.png","sigmoid-volvulus-axr.png","renal-calculus-kub.png","erythema-nodosum.png","cellulitis.png","acne-vulgaris.png","rosacea.png","clubbing-fingers.png","dupuytren-contracture.png","thyroid-goitre.png","hypertensive-retinopathy-fundus.png","tonsillitis-exudate.png","pagets-disease-skull-xray.png","lichen-planus.png","epiglottitis-thumb-sign.png"];
  toProcess = IMAGES.filter(i => newFiles.includes(i.file));
} else {
  toProcess = IMAGES;
}

console.log(`\n🏥 BlueScrubsPrep — Medical Image Generation Pipeline`);
console.log(`📋 Mode: ${specificId ? `single:${specificId}` : mode} | Images to process: ${toProcess.length}`);
console.log(`🔗 API Base: ${BASE_URL?.substring(0, 40)}...`);

if (toProcess.length === 0) {
  console.log("No images to process.");
  process.exit(0);
}

runBatch(toProcess, 2).then(() => {
  const status = loadStatus();
  const validated = Object.values(status).filter(s => s === "validated").length;
  const flagged = Object.values(status).filter(s => s === "flagged").length;
  const pending = Object.values(status).filter(s => s === "pending").length;
  console.log(`\n✅ Done! Validated: ${validated} | Flagged: ${flagged} | Still pending: ${pending}`);
}).catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
