import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  content: text("content").notNull(),
  options: jsonb("options"),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  examType: text("exam_type").notNull(),
  imageUrl: text("image_url"),
  tags: jsonb("tags"),
});

const spotDxQuestions = [
  {
    type: "mcq",
    category: "cardiology",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: "/spotdx-images/inferior-stemi-ecg.png",
    tags: ["spot-diagnosis", "ecg", "cardiology"],
    content:
      "A 58-year-old man presents to A&E with crushing central chest pain radiating to his jaw for the past 90 minutes. He is diaphoretic and pale. His ECG is shown above. What is the most likely diagnosis?",
    options: ["Anterior STEMI", "Inferior STEMI", "Pericarditis", "Left bundle branch block", "Posterior STEMI"],
    correctAnswer: "Inferior STEMI",
    explanation:
      "The ECG shows ST elevation in leads II, III, and aVF with reciprocal ST depression in leads I and aVL — the classic pattern of an inferior STEMI, most commonly caused by right coronary artery occlusion. PLAB pearl: always check right-sided leads (V4R) in inferior STEMI to exclude right ventricular involvement before giving nitrates.",
  },
  {
    type: "mcq",
    category: "cardiology",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: "/spotdx-images/atrial-fibrillation-ecg.png",
    tags: ["spot-diagnosis", "ecg", "cardiology"],
    content:
      "A 72-year-old woman attends her GP with a 2-week history of palpitations and occasional breathlessness. She has no chest pain. Her ECG is shown above. What is the most likely rhythm?",
    options: ["Sinus tachycardia", "Atrial flutter", "Atrial fibrillation", "Ventricular tachycardia", "Supraventricular tachycardia"],
    correctAnswer: "Atrial fibrillation",
    explanation:
      "The ECG demonstrates irregularly irregular R-R intervals with absent P waves replaced by a chaotic fibrillatory baseline — the hallmark of atrial fibrillation. PLAB pearl: AF is the most common sustained cardiac arrhythmia. Always assess thromboembolic risk (CHA\u2082DS\u2082-VASc) and bleeding risk (ORBIT) before initiating anticoagulation.",
  },
  {
    type: "mcq",
    category: "respiratory",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: "/spotdx-images/pneumothorax-cxr.png",
    tags: ["spot-diagnosis", "radiology", "respiratory"],
    content:
      "A 22-year-old tall, slim man presents with sudden-onset right-sided pleuritic chest pain and mild breathlessness. He is haemodynamically stable. His chest X-ray is shown above. What is the immediate management?",
    options: [
      "Reassurance and discharge with review in 2 weeks",
      "Aspiration with 14G cannula in the second intercostal space mid-clavicular line",
      "Immediate needle decompression",
      "Chest drain insertion",
      "High-flow oxygen and urgent CT chest",
    ],
    correctAnswer: "Aspiration with 14G cannula in the second intercostal space mid-clavicular line",
    explanation:
      "The CXR shows a right-sided pneumothorax with a visible pleural line and absent lung markings laterally. In a haemodynamically stable patient with a first episode of primary spontaneous pneumothorax >2 cm, BTS guidelines recommend needle aspiration as first-line treatment. Reserve chest drain for failed aspiration or secondary pneumothorax. PLAB pearl: tension pneumothorax is a clinical diagnosis — do not wait for X-ray; decompress immediately.",
  },
  {
    type: "mcq",
    category: "neurology",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: "/spotdx-images/bells-palsy.png",
    tags: ["spot-diagnosis", "neurology", "facial-nerve"],
    content:
      "A 34-year-old woman wakes up with sudden-onset left-sided facial weakness. She is unable to close her left eye fully or raise her left eyebrow. She has no limb weakness and no hearing changes. The clinical photograph is shown above. What is the most likely diagnosis?",
    options: ["Left middle cerebral artery stroke", "Bell's palsy", "Ramsay Hunt syndrome", "Acoustic neuroma", "Multiple sclerosis"],
    correctAnswer: "Bell's palsy",
    explanation:
      "Bell's palsy is an idiopathic lower motor neurone (LMN) facial nerve palsy affecting all ipsilateral facial muscles including the forehead. This distinguishes it from a UMN cause (e.g. stroke), where forehead sparing occurs due to bilateral cortical representation. PLAB pearl: inability to close the eye risks corneal exposure — prescribe lubricating eye drops and tape the eye shut at night. Prescribe prednisolone within 72 hours of onset.",
  },
  {
    type: "mcq",
    category: "ophthalmology",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: "/spotdx-images/acute-angle-closure-glaucoma.png",
    tags: ["spot-diagnosis", "ophthalmology", "emergency"],
    content:
      "A 65-year-old woman presents to A&E with a 3-hour history of severe right-sided headache, nausea, blurred vision, and seeing halos around lights. On examination her right eye appears red with a hazy cornea. The clinical photograph is shown above. What is the most appropriate immediate management?",
    options: [
      "Prescribe topical antibiotic eye drops and review in 48 hours",
      "IV morphine and anti-emetics; refer to ophthalmology for urgent review",
      "Oral acetazolamide, topical pilocarpine, and urgent ophthalmology referral",
      "Topical steroid eye drops",
      "Urgent MRI head to exclude subarachnoid haemorrhage",
    ],
    correctAnswer: "Oral acetazolamide, topical pilocarpine, and urgent ophthalmology referral",
    explanation:
      "This is acute angle-closure glaucoma — a sight-threatening emergency. Key signs are: painful red eye, fixed mid-dilated pupil, hazy cornea, and raised intraocular pressure. Management: oral/IV acetazolamide to reduce aqueous production, topical pilocarpine to constrict the pupil and open the drainage angle, and urgent ophthalmology review. PLAB pearl: avoid all anticholinergic and sympathomimetic drugs which can precipitate acute angle closure.",
  },
  {
    type: "mcq",
    category: "infectious-diseases",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: "/spotdx-images/meningococcal-rash.png",
    tags: ["spot-diagnosis", "dermatology", "infectious-diseases", "emergency"],
    content:
      "A 19-year-old university student is brought to A&E by his flatmate. He is confused, febrile (39.8\u00b0C), and has neck stiffness. The rash shown above is visible on his legs and does not blanch on a glass tumbler test. What is the single most important immediate action?",
    options: [
      "Perform a lumbar puncture to confirm diagnosis",
      "Arrange urgent CT head before any treatment",
      "Administer IV benzylpenicillin immediately",
      "Start IV aciclovir",
      "Isolate the patient and wait for blood culture results",
    ],
    correctAnswer: "Administer IV benzylpenicillin immediately",
    explanation:
      "This presentation is meningococcal septicaemia with a non-blanching petechial/purpuric rash — a life-threatening emergency. Do NOT delay antibiotics for any investigation. IV benzylpenicillin should be given immediately; if penicillin-allergic, use IV cefotaxime or chloramphenicol. PLAB pearl: the non-blanching rash is caused by disseminated intravascular coagulation (DIC) and indicates septicaemia. Notify Public Health England urgently and give prophylaxis (ciprofloxacin or rifampicin) to close contacts.",
  },
  {
    type: "mcq",
    category: "rheumatology",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: "/spotdx-images/rheumatoid-hands.png",
    tags: ["spot-diagnosis", "rheumatology", "hands"],
    content:
      "A 52-year-old woman presents with a 2-year history of morning stiffness lasting over 1 hour, symmetrical joint pain, and fatigue. Her hands are shown above. Blood tests reveal raised ESR, CRP, and positive anti-CCP antibodies. What is the most likely diagnosis?",
    options: ["Osteoarthritis", "Rheumatoid arthritis", "Psoriatic arthritis", "Gout", "Systemic lupus erythematosus"],
    correctAnswer: "Rheumatoid arthritis",
    explanation:
      "Rheumatoid arthritis (RA) classically presents with symmetrical small joint involvement (MCPJs and PIPJs), morning stiffness >1 hour, and systemic features. The image shows characteristic features: MCPJ swelling, ulnar deviation, and swan-neck deformities. Anti-CCP is highly specific for RA. PLAB pearl: in RA, DIP joints are typically spared (unlike OA). Early DMARD therapy (methotrexate first-line) reduces joint destruction.",
  },
  {
    type: "mcq",
    category: "endocrinology",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: "/spotdx-images/graves-disease.png",
    tags: ["spot-diagnosis", "endocrinology", "thyroid"],
    content:
      "A 28-year-old woman presents with a 3-month history of weight loss despite increased appetite, heat intolerance, palpitations, and anxiety. The clinical photograph is shown above. TFTs reveal suppressed TSH with elevated free T3 and T4. What is the most likely diagnosis?",
    options: ["Toxic multinodular goitre", "Graves' disease", "Hashimoto's thyroiditis", "De Quervain's thyroiditis", "Thyroid adenoma"],
    correctAnswer: "Graves' disease",
    explanation:
      "Graves' disease is the most common cause of hyperthyroidism in young women. The photograph shows bilateral proptosis (exophthalmos), lid retraction, and a diffuse goitre — features specific to Graves' (caused by TSH receptor antibodies). Toxic MNG would not cause proptosis. PLAB pearl: Graves' ophthalmopathy can occur even in euthyroid or hypothyroid patients. First-line treatment is carbimazole (block-replace or titration regimen).",
  },
  {
    type: "mcq",
    category: "paediatrics",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: "/spotdx-images/kawasaki-disease.png",
    tags: ["spot-diagnosis", "paediatrics", "vasculitis"],
    content:
      "A 4-year-old boy has had a fever for 6 days. On examination he has bilateral conjunctival injection, a strawberry tongue, cervical lymphadenopathy, and an erythematous rash on his trunk. The photograph is shown above. What is the most important complication to screen for?",
    options: [
      "Intussusception",
      "Coronary artery aneurysms",
      "Renal failure",
      "Encephalitis",
      "Hepatosplenomegaly",
    ],
    correctAnswer: "Coronary artery aneurysms",
    explanation:
      "Kawasaki disease is a medium-vessel vasculitis of unknown aetiology. The diagnosis requires fever \u22655 days plus \u22654 of 5 features (conjunctivitis, rash, lymphadenopathy, oral changes, extremity changes). The most serious complication is coronary artery aneurysms, which occur in up to 25% of untreated cases. PLAB pearl: treat promptly with high-dose aspirin and IV immunoglobulin (IVIG) to reduce coronary artery complications. Aspirin is used here despite the usual caution in children — this is one exception.",
  },
  {
    type: "mcq",
    category: "radiology",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: "/spotdx-images/small-bowel-obstruction-axr.png",
    tags: ["spot-diagnosis", "radiology", "gastroenterology", "surgery"],
    content:
      "A 68-year-old man with a history of previous appendicectomy presents with colicky central abdominal pain, vomiting, and absolute constipation for 24 hours. His abdomen is distended. His abdominal X-ray is shown above. What is the most likely diagnosis?",
    options: [
      "Large bowel obstruction",
      "Small bowel obstruction",
      "Paralytic ileus",
      "Sigmoid volvulus",
      "Toxic megacolon",
    ],
    correctAnswer: "Small bowel obstruction",
    explanation:
      "The AXR shows multiple centrally placed dilated loops of small bowel in a step-ladder pattern with visible valvulae conniventes (plicae circulares) crossing the full width of the bowel — characteristic of small bowel obstruction. Large bowel dilation is peripheral with haustra that do not cross the full width. Adhesions from previous surgery are the most common cause in adults. PLAB pearl: initial management is 'drip and suck' (IV fluids + NG tube). Most resolve conservatively but surgery is needed for strangulation or failure to resolve.",
  },
];

async function main() {
  console.log("Seeding 10 spot diagnosis questions…\n");

  for (const q of spotDxQuestions) {
    await db.insert(questions).values({
      type: q.type,
      category: q.category,
      difficulty: q.difficulty,
      content: q.content,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      examType: q.examType,
      imageUrl: q.imageUrl,
      tags: q.tags,
    });
    console.log(`  \u2713 ${q.category} \u2014 ${q.correctAnswer}`);
  }

  console.log("\nDone.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
