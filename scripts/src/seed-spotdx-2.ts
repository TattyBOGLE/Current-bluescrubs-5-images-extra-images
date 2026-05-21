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

const newQuestions = [
  // DERMATOLOGY
  {
    type: "mcq",
    category: "dermatology",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "dermatology", "psoriasis"],
    content:
      "A 35-year-old man presents with a 6-month history of well-demarcated, erythematous plaques with silvery-white scales on his elbows and scalp. There is nail pitting. He reports the rash worsens under stress. What is the most likely diagnosis?",
    options: ["Eczema", "Psoriasis", "Seborrhoeic dermatitis", "Tinea corporis", "Lichen planus"],
    correctAnswer: "Psoriasis",
    explanation:
      "Psoriasis presents with well-demarcated erythematous plaques with silvery scales, typically affecting extensor surfaces (elbows, knees), scalp, and nails. Nail pitting and onycholysis are characteristic. Auspitz sign (pinpoint bleeding on scale removal) is pathognomonic. PLAB pearl: psoriasis is associated with psoriatic arthritis in ~30% — always ask about joint symptoms and screen with the PEST questionnaire.",
  },
  {
    type: "mcq",
    category: "dermatology",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "dermatology", "eczema"],
    content:
      "A 7-year-old boy is brought by his mother with intensely itchy, red, weeping patches in the antecubital fossae and behind his knees. He has a personal history of asthma and hayfever. What is the most likely diagnosis?",
    options: ["Contact dermatitis", "Psoriasis", "Atopic eczema", "Scabies", "Impetigo"],
    correctAnswer: "Atopic eczema",
    explanation:
      "Atopic eczema (atopic dermatitis) classically affects flexural surfaces (antecubital and popliteal fossae, neck) and is associated with the atopic triad: eczema, asthma, and allergic rhinitis. In infants it typically affects the face and extensors. PLAB pearl: first-line treatment is regular emollients and topical corticosteroids during flares. Avoid soap substitutes and triggers. Use the mildest effective corticosteroid for the shortest duration.",
  },
  {
    type: "mcq",
    category: "dermatology",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "dermatology", "melanoma"],
    content:
      "A 55-year-old woman presents with a pigmented lesion on her back. It has been present for years but has recently changed. It measures 8mm, has irregular borders, multiple colours (brown, black, and pink), and asymmetry. What is the most appropriate next step?",
    options: [
      "Reassure and review in 6 months",
      "Apply topical steroid and review in 4 weeks",
      "Urgent 2-week-wait referral to dermatology",
      "Punch biopsy in primary care",
      "Dermoscopy and cryotherapy",
    ],
    correctAnswer: "Urgent 2-week-wait referral to dermatology",
    explanation:
      "This lesion fulfils multiple ABCDE criteria for melanoma: Asymmetry, Border irregularity, Colour variation, Diameter >6mm, and Evolution (recent change). NICE NG12 criteria mandate urgent suspected cancer referral (2WW) for any suspicious pigmented lesion. PLAB pearl: never perform punch biopsy in primary care for suspected melanoma — it risks incomplete excision and staging error. Refer urgently.",
  },
  {
    type: "mcq",
    category: "dermatology",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "dermatology", "shingles"],
    content:
      "A 68-year-old woman presents with a 3-day history of burning pain followed by a unilateral vesicular rash in a dermatomal distribution along her left T5 dermatome. She did not have a fever. What is the most appropriate treatment?",
    options: [
      "Topical aciclovir cream",
      "Oral aciclovir 800mg five times daily for 7 days",
      "IV aciclovir",
      "Oral prednisolone only",
      "Reassurance and analgesia — antiviral not required",
    ],
    correctAnswer: "Oral aciclovir 800mg five times daily for 7 days",
    explanation:
      "Herpes zoster (shingles) is caused by reactivation of varicella-zoster virus and causes a painful dermatomal vesicular rash. Oral aciclovir (or valaciclovir/famciclovir) should be started within 72 hours of rash onset to reduce severity, duration, and risk of postherpetic neuralgia. PLAB pearl: shingles affecting the V1 branch of the trigeminal nerve (Hutchinson's sign — vesicles on the nose tip) risks ophthalmic involvement — refer urgently to ophthalmology.",
  },
  // ENT
  {
    type: "mcq",
    category: "ent",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "ent", "otitis-externa"],
    content:
      "A 24-year-old swimmer presents with a 5-day history of right ear pain and discharge. On examination the ear canal is red and oedematous, and there is pain on tragus pressure. The tympanic membrane is intact. What is the most likely diagnosis and first-line treatment?",
    options: [
      "Acute otitis media — oral amoxicillin",
      "Otitis externa — topical acetic acid or antibiotic-steroid drops",
      "Cholesteatoma — urgent ENT referral",
      "Eustachian tube dysfunction — nasal decongestants",
      "Furunculosis — oral flucloxacillin",
    ],
    correctAnswer: "Otitis externa — topical acetic acid or antibiotic-steroid drops",
    explanation:
      "Otitis externa (swimmer's ear) is infection/inflammation of the external ear canal, commonly caused by Pseudomonas aeruginosa or Staphylococcus aureus. Features include ear canal tenderness, discharge, and pain on tragus/pinna movement. First-line: topical acetic acid 2% spray or combination antibiotic-steroid drops (e.g. Sofradex). PLAB pearl: keep ears dry; use cotton wool with Vaseline while bathing. Aural toilet by microsuction improves drop penetration.",
  },
  {
    type: "mcq",
    category: "ent",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "ent", "peritonsillar-abscess"],
    content:
      "An 18-year-old man presents with severe sore throat, difficulty swallowing, and a muffled 'hot potato' voice for 3 days. On examination there is unilateral swelling of the soft palate with uvular deviation to the right. He is drooling and unable to open his mouth fully. What is the most likely diagnosis?",
    options: [
      "Infectious mononucleosis",
      "Epiglottitis",
      "Left peritonsillar abscess (quinsy)",
      "Ludwig's angina",
      "Retropharyngeal abscess",
    ],
    correctAnswer: "Left peritonsillar abscess (quinsy)",
    explanation:
      "Peritonsillar abscess (quinsy) is a collection of pus between the tonsil and its capsule. Classic features: severe unilateral sore throat, trismus (inability to open mouth), hot potato voice, drooling, and uvular deviation away from the affected side. Management: IV antibiotics (benzylpenicillin + metronidazole), needle aspiration or incision and drainage under LA, and IV fluids. PLAB pearl: quinsy most commonly occurs as a complication of tonsillitis caused by Group A Streptococcus.",
  },
  // GASTROENTEROLOGY
  {
    type: "mcq",
    category: "gastroenterology",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "gastroenterology", "radiology", "jaundice"],
    content:
      "A 52-year-old man presents with a 4-week history of progressive painless jaundice, dark urine, pale stools, and a 5kg weight loss. On examination there is a palpable, non-tender gallbladder. What is the most likely diagnosis?",
    options: [
      "Gallstone disease (choledocholithiasis)",
      "Primary sclerosing cholangitis",
      "Carcinoma of the head of the pancreas",
      "Hepatitis A",
      "Alcoholic hepatitis",
    ],
    correctAnswer: "Carcinoma of the head of the pancreas",
    explanation:
      "Painless obstructive jaundice with a palpable non-tender gallbladder is Courvoisier's law and strongly suggests malignant biliary obstruction — most commonly pancreatic head carcinoma. Gallstones typically cause a shrunken, fibrosed gallbladder that cannot distend. PLAB pearl: CA 19-9 is a tumour marker for pancreatic cancer but has low sensitivity/specificity. CT pancreas protocol is the investigation of choice. Refer urgently via 2WW pathway.",
  },
  {
    type: "mcq",
    category: "gastroenterology",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "gastroenterology", "cirrhosis"],
    content:
      "A 58-year-old man with a long history of alcohol use presents for review. On examination you note spider naevi, palmar erythema, gynaecomastia, caput medusae, and shifting dullness in the abdomen. What is the most likely underlying diagnosis?",
    options: [
      "Right heart failure",
      "Nephrotic syndrome",
      "Liver cirrhosis",
      "Inferior vena cava obstruction",
      "Hypothyroidism",
    ],
    correctAnswer: "Liver cirrhosis",
    explanation:
      "This clinical picture is classic for decompensated liver cirrhosis with portal hypertension. Spider naevi (>5 is significant) and palmar erythema are due to hyperoestrogenaemia. Caput medusae reflects portosystemic shunting. Ascites causes shifting dullness. Gynaecomastia results from impaired oestrogen metabolism. PLAB pearl: ascites in cirrhosis is managed with dietary sodium restriction and spironolactone (first-line diuretic). Large volume paracentesis + human albumin solution for refractory ascites.",
  },
  // INFECTIOUS DISEASES — more
  {
    type: "mcq",
    category: "infectious-diseases",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "dermatology", "infectious-diseases", "paediatrics"],
    content:
      "A 6-year-old girl develops a fever followed by a widespread itchy rash. The rash consists of lesions in different stages — macules, papules, vesicles, and crusted lesions — distributed over the trunk, face, and scalp. What is the most likely diagnosis?",
    options: ["Measles", "Chickenpox", "Hand, foot and mouth disease", "Impetigo", "Scabies"],
    correctAnswer: "Chickenpox",
    explanation:
      "Chickenpox (varicella) classically presents with a pruritic rash showing lesions at different stages ('crops') — a hallmark feature. It starts on the trunk and spreads centrifugally. Lesions begin as macules, progress to papules, then vesicles ('dewdrops on a rose petal'), and finally crust over. PLAB pearl: chickenpox is contagious from 48 hours before the rash until all lesions are crusted. Children with chickenpox should NOT be given aspirin (risk of Reye's syndrome).",
  },
  {
    type: "mcq",
    category: "infectious-diseases",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "dermatology", "infectious-diseases", "paediatrics"],
    content:
      "A 5-year-old boy presents with a bright red confluent rash on both cheeks that appeared 2 days ago, giving a 'slapped cheek' appearance. His mother reports he had a mild fever and runny nose the week before. The rash is now spreading to his limbs with a lacy reticular pattern. What is the most likely diagnosis?",
    options: ["Rubella", "Roseola infantum", "Erythema infectiosum (slapped cheek)", "Kawasaki disease", "Scarlet fever"],
    correctAnswer: "Erythema infectiosum (slapped cheek)",
    explanation:
      "Erythema infectiosum (Fifth disease) is caused by Parvovirus B19. It presents in three stages: a prodrome of mild fever and coryza, then a bright red slapped-cheek facial rash, followed by a lacy reticular rash on the limbs. By the time the rash appears the child is no longer infectious. PLAB pearl: Parvovirus B19 can cause aplastic crisis in patients with haemolytic anaemia (e.g. sickle cell disease). In pregnancy it can cause hydrops fetalis — refer urgently to fetal medicine if the mother is exposed.",
  },
  {
    type: "mcq",
    category: "infectious-diseases",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "infectious-diseases", "paediatrics", "scarlet-fever"],
    content:
      "A 9-year-old boy presents with a sore throat, fever, and a widespread sandpaper-like rash that started on the trunk and spread to the limbs, sparing the perioral area. His tongue has a white coating with red papillae ('strawberry tongue'). What is the most appropriate treatment?",
    options: [
      "Oral aciclovir",
      "Oral phenoxymethylpenicillin (penicillin V) for 10 days",
      "Topical fusidic acid",
      "IV cefotaxime",
      "Reassurance — self-limiting viral illness",
    ],
    correctAnswer: "Oral phenoxymethylpenicillin (penicillin V) for 10 days",
    explanation:
      "Scarlet fever is caused by Group A Streptococcus (Streptococcus pyogenes) producing erythrogenic toxin. Characteristic features: sandpaper rash, strawberry tongue, circumoral pallor, and Pastia's lines (accentuation of rash in skin folds). Treatment is penicillin V for 10 days. PLAB pearl: scarlet fever is a notifiable disease in the UK. Complications include acute rheumatic fever and post-streptococcal glomerulonephritis.",
  },
  // PAEDIATRICS
  {
    type: "mcq",
    category: "paediatrics",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "paediatrics", "ent"],
    content:
      "A 2-year-old boy is brought to A&E at night with a barking cough, stridor at rest, and mild intercostal recession. He was well earlier that day with just a runny nose. His temperature is 37.9°C. What is the most appropriate immediate management?",
    options: [
      "IV amoxicillin",
      "Urgent nasopharyngoscopy",
      "Oral dexamethasone 0.15mg/kg single dose",
      "Nebulised salbutamol",
      "Immediate intubation",
    ],
    correctAnswer: "Oral dexamethasone 0.15mg/kg single dose",
    explanation:
      "Croup (laryngotracheobronchitis) is caused by parainfluenza virus and presents with a seal-like barking cough, stridor, and varying degrees of respiratory distress — typically worse at night. Treatment: oral or IM dexamethasone (0.15mg/kg) is the cornerstone — it reduces mucosal oedema. Add nebulised adrenaline (1:1000) for severe cases while awaiting effect. PLAB pearl: epiglottitis (caused by Haemophilus influenzae type b) presents with sudden high fever, drooling, a muffled voice, and the 'tripod' position — do NOT examine the throat; call senior immediately.",
  },
  // NEUROLOGY — more
  {
    type: "mcq",
    category: "neurology",
    difficulty: "hard",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "neurology", "horner-syndrome"],
    content:
      "A 52-year-old heavy smoker presents with a 3-month history of right shoulder and arm pain, weakness of the right hand intrinsic muscles, and wasting of the thenar eminence. On examination you note right-sided ptosis and miosis. The right pupil does not dilate in the dark. What is the most likely diagnosis?",
    options: [
      "Cervical disc prolapse at C8/T1",
      "Pancoast tumour with Horner syndrome",
      "Syringomyelia",
      "Thoracic outlet syndrome",
      "Motor neurone disease",
    ],
    correctAnswer: "Pancoast tumour with Horner syndrome",
    explanation:
      "A Pancoast tumour is an apical lung tumour that invades the brachial plexus (C8/T1 — causing hand weakness/wasting) and the sympathetic chain (causing ipsilateral Horner syndrome: ptosis, miosis, anhidrosis). This combination in a smoker is highly specific. PLAB pearl: Horner syndrome = ptosis + miosis + anhidrosis. Never miss it — investigate urgently for an apical lung tumour with CXR and CT chest. Always consider carotid artery dissection as another cause.",
  },
  // CARDIOLOGY — more
  {
    type: "mcq",
    category: "cardiology",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "ecg", "cardiology", "hyperkalaemia"],
    content:
      "A 70-year-old man with CKD stage 4 and type 2 diabetes presents unwell. His potassium is 7.2 mmol/L. His ECG shows tall, peaked T waves with a widened QRS complex. What is the most urgent immediate treatment to protect the myocardium?",
    options: [
      "Calcium gluconate 10% IV",
      "Nebulised salbutamol",
      "Insulin-dextrose IV infusion",
      "Oral resonium",
      "Emergency haemodialysis",
    ],
    correctAnswer: "Calcium gluconate 10% IV",
    explanation:
      "In severe hyperkalaemia with ECG changes, calcium gluconate (10ml of 10% over 5-10 minutes IV) is the first and most urgent treatment. It membrane-stabilises the myocardium within minutes — it does NOT lower potassium but prevents cardiac arrest. This is immediately followed by insulin-dextrose (to shift K+ intracellularly) and nebulised salbutamol. PLAB pearl: ECG progression in hyperkalaemia: peaked T waves → PR prolongation → flat P waves → widened QRS → sine wave → VF/asystole.",
  },
  {
    type: "mcq",
    category: "cardiology",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "ecg", "cardiology", "pericarditis"],
    content:
      "A 26-year-old man presents with sharp, pleuritic chest pain that is worse lying flat and relieved sitting forward. He had a viral illness 2 weeks ago. His ECG shows widespread saddle-shaped ST elevation in multiple leads with PR depression. His troponin is mildly elevated. What is the most likely diagnosis?",
    options: ["STEMI", "Pericarditis", "Pulmonary embolism", "Aortic dissection", "Myocarditis"],
    correctAnswer: "Pericarditis",
    explanation:
      "Pericarditis presents with positional pleuritic chest pain (better sitting forward, worse lying flat), a pericardial friction rub, and saddle-shaped (concave up) ST elevation in multiple leads with PR depression — distinguishing it from the regional ST elevation of STEMI. Treatment: NSAIDs + colchicine. PLAB pearl: the key ECG difference from STEMI is: pericarditis = widespread ST elevation in multiple territories + PR depression + saddle shape; STEMI = regional ST elevation with reciprocal changes in one territory.",
  },
  // RESPIRATORY — more
  {
    type: "mcq",
    category: "respiratory",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "radiology", "respiratory", "pleural-effusion"],
    content:
      "A 65-year-old man presents with progressive breathlessness and dullness to percussion at the right lung base. Chest X-ray shows a homogeneous opacity at the right base with a meniscus sign, blunting of the costophrenic angle, and mediastinal shift to the left. What is the most likely finding?",
    options: [
      "Right lower lobe consolidation",
      "Right pneumothorax",
      "Large right pleural effusion",
      "Right hemidiaphragm elevation",
      "Right pleural mesothelioma",
    ],
    correctAnswer: "Large right pleural effusion",
    explanation:
      "A pleural effusion on CXR shows: blunting of the costophrenic angle (>200ml), a concave meniscus sign at the upper border, and mediastinal shift AWAY from the effusion (if large). Consolidation does not shift the mediastinum and shows air bronchograms. PLAB pearl: always determine if the effusion is a transudate (heart failure, hypoalbuminaemia) or exudate (infection, malignancy) using Light's criteria on pleural fluid aspirate. Unilateral effusion in an older patient — always consider malignancy.",
  },
  {
    type: "mcq",
    category: "respiratory",
    difficulty: "hard",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "radiology", "respiratory", "pulmonary-embolism"],
    content:
      "A 38-year-old woman who returned from a long-haul flight 3 days ago presents with sudden-onset breathlessness, pleuritic right chest pain, and haemoptysis. She is tachycardic (HR 115) and her oxygen saturations are 93% on air. Her ECG shows sinus tachycardia with an S1Q3T3 pattern. What is the investigation of choice to confirm the diagnosis?",
    options: [
      "Chest X-ray",
      "D-dimer only",
      "CT pulmonary angiography (CTPA)",
      "V/Q scan",
      "Echocardiography",
    ],
    correctAnswer: "CT pulmonary angiography (CTPA)",
    explanation:
      "CTPA is the gold-standard investigation for confirming pulmonary embolism. Risk factors here: recent long-haul travel, young woman (likely OCP use). The S1Q3T3 ECG pattern (deep S in lead I, Q wave in III, inverted T in III) is classic but insensitive. CXR is often normal or shows Hampton's hump. PLAB pearl: if Wells score indicates high probability, start treatment dose LMWH immediately before waiting for CTPA. D-dimer is useful only in low clinical probability — a negative D-dimer rules out PE.",
  },
  // RHEUMATOLOGY — more
  {
    type: "mcq",
    category: "rheumatology",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "rheumatology", "gout"],
    content:
      "A 52-year-old man presents with sudden onset of severe pain, swelling, redness, and warmth in his right first metatarsophalangeal (MTP) joint. He was started on a thiazide diuretic 2 weeks ago. His serum uric acid is 580 \u03bcmol/L. Joint aspiration shows negatively birefringent needle-shaped crystals under polarised light. What is the most appropriate acute treatment?",
    options: [
      "Start allopurinol immediately",
      "Oral colchicine or NSAIDs",
      "IV benzylpenicillin",
      "Oral prednisolone and allopurinol together",
      "Intra-articular steroid injection only",
    ],
    correctAnswer: "Oral colchicine or NSAIDs",
    explanation:
      "This is acute gout — confirmed by negatively birefringent needle-shaped monosodium urate crystals. First-line treatment for acute attacks: NSAIDs (naproxen/indomethacin) or colchicine. If contraindicated, use oral prednisolone. PLAB pearl: do NOT start allopurinol during an acute attack — it can prolong or worsen it. Start urate-lowering therapy (allopurinol) 2-4 weeks after the acute attack has completely resolved. Thiazide diuretics raise uric acid — a common exam trigger.",
  },
  // OPHTHALMOLOGY — more
  {
    type: "mcq",
    category: "ophthalmology",
    difficulty: "easy",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "ophthalmology", "conjunctivitis"],
    content:
      "A 22-year-old woman presents with a 3-day history of red, gritty, bilateral eyes with a mucopurulent discharge that causes her eyelids to stick together in the mornings. Her vision is unaffected. She has recently had a new sexual partner. What is the most likely causative organism?",
    options: [
      "Adenovirus",
      "Staphylococcus aureus",
      "Chlamydia trachomatis",
      "Herpes simplex virus",
      "Haemophilus influenzae",
    ],
    correctAnswer: "Chlamydia trachomatis",
    explanation:
      "Chlamydial conjunctivitis (inclusion conjunctivitis) presents with a chronic mucopurulent unilateral or bilateral conjunctivitis in sexually active young adults. It is caused by Chlamydia trachomatis serovars D-K. It may be associated with a genital chlamydial infection. Treatment: oral azithromycin 1g single dose or doxycycline 100mg BD for 7 days (to treat the systemic infection). PLAB pearl: always screen for and treat concurrent genital chlamydia, and trace and treat sexual partners. Topical treatment alone is insufficient.",
  },
];

async function main() {
  console.log("Seeding 20 additional spot diagnosis questions…\n");

  for (const q of newQuestions) {
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
