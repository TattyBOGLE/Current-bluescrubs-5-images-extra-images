import { type GMCQuestion } from './gmc-question-bank';

export const EXPANDED_QUESTION_BANK: GMCQuestion[] = [
  // CARDIOVASCULAR (25 questions)
  {
    id: 'cv_gmc_001',
    category: 'cardiovascular',
    subcategory: 'heart-failure',
    cognitiveLevel: 'application',
    difficulty: 'intermediate',
    clinicalSetting: 'Cardiology Clinic',
    ageGroup: 'Elderly',
    stem: "A 74-year-old retired teacher presents with 3-month history of progressive breathlessness on exertion, ankle swelling, and orthopnea. Past medical history includes myocardial infarction 6 months ago. Examination shows elevated JVP, bilateral fine crackles, and ankle edema. Echocardiogram shows ejection fraction 35%. BNP 850 pg/ml. What is the most appropriate first-line treatment?",
    options: [
      "Furosemide 40mg daily and lifestyle advice",
      "ACE inhibitor ramipril and beta-blocker bisoprolol",
      "Digoxin 125mcg daily and spironolactone 25mg daily",
      "Atorvastatin 80mg daily and aspirin 75mg daily",
      "Amlodipine 5mg daily and bendroflumethiazide 2.5mg daily"
    ],
    correctAnswer: 1,
    explanation: "This 74-year-old retired teacher presents with heart failure with reduced ejection fraction (HFrEF) post-myocardial infarction: 3-month progressive breathlessness on exertion, ankle swelling, orthopnea, ejection fraction 35%, and elevated BNP 850 pg/ml. These features help determine optimal evidence-based treatment.\n\nOption B (ACE inhibitor ramipril and beta-blocker bisoprolol) is CORRECT because this represents first-line evidence-based therapy for HFrEF according to NICE CG108 and ESC 2021 guidelines. Ramipril blocks renin-angiotensin-aldosterone system activation, reducing afterload, preload, and ventricular remodeling. SAVE trial showed 19% mortality reduction with ACE inhibitors post-MI. Bisoprolol counteracts sympathetic activation and reduces arrhythmic risk. CIBIS-II demonstrated 34% mortality reduction. Both drugs require careful titration to maximum tolerated doses for optimal benefit.\n\nOption A (Furosemide 40mg daily and lifestyle advice) is INCORRECT because while loop diuretics provide symptomatic relief from fluid overload, they offer no mortality benefit and don't address underlying neurohormonal activation driving HFrEF progression. Furosemide is adjunctive therapy, not primary treatment.\n\nOption C (Digoxin 125mcg daily and spironolactone 25mg daily) is INCORRECT as first-line therapy because digoxin provides symptom improvement without mortality benefit (DIG trial) and spironolactone is typically third-line after ACE inhibitor/beta-blocker optimization. While spironolactone reduces mortality (RALES trial), it's not first-line monotherapy.\n\nOption D (Atorvastatin 80mg daily and aspirin 75mg daily) is INCORRECT because these provide secondary prevention benefits but don't treat the heart failure syndrome itself. While important for post-MI patients, they don't address the HFrEF pathophysiology requiring neurohormonal blockade.\n\nOption E (Amlodipine 5mg daily and bendroflumethiazide 2.5mg daily) is INCORRECT because calcium channel blockers can worsen heart failure through negative inotropic effects, and thiazides don't provide the proven mortality benefits of ACE inhibitors and beta-blockers in HFrEF.\n\nFirst-line HFrEF therapy requires dual neurohormonal blockade with ACE inhibitor plus beta-blocker for mortality reduction.",
    learningObjectives: [
      "Recognize heart failure with reduced ejection fraction",
      "Apply NICE heart failure treatment guidelines",
      "Understand evidence-based medications with mortality benefit"
    ],
    gmcOutcomes: [
      "Clinical assessment and diagnosis",
      "Evidence-based treatment decisions",
      "Patient safety and monitoring"
    ],
    references: [
      "• NICE CG108: Chronic heart failure in adults - management",
      "• ESC 2021 Heart Failure Guidelines",
      "• SAVE Trial: Effect of captopril on mortality and morbidity in patients with left ventricular dysfunction after myocardial infarction - NEJM 1992",
      "• CIBIS-II: The Cardiac Insufficiency Bisoprolol Study II - Lancet 1999"
    ],
    tags: ["heart-failure", "HFrEF", "ACE-inhibitor", "beta-blocker"],
    estimatedTime: 120,
    lastReviewed: "2024-12-01",
    reviewedBy: "Dr. James Wilson, Consultant Cardiologist"
  },

  {
    id: 'cv_gmc_002',
    category: 'cardiovascular',
    subcategory: 'arrhythmias',
    cognitiveLevel: 'application',
    difficulty: 'intermediate',
    clinicalSetting: 'Emergency Department',
    ageGroup: 'Adult',
    stem: "A 68-year-old woman presents to A&E with 4-hour history of palpitations and chest discomfort. She appears anxious but hemodynamically stable. ECG shows irregularly irregular rhythm, no visible P waves, heart rate 140 bpm. She has no previous cardiac history. What is the most likely diagnosis?",
    options: [
      "Sinus tachycardia with frequent ectopics",
      "Atrial flutter with variable block",
      "Atrial fibrillation",
      "Ventricular tachycardia",
      "Multifocal atrial tachycardia"
    ],
    correctAnswer: 2,
    explanation: "This 68-year-old woman presents with acute atrial fibrillation: 4-hour palpitations, chest discomfort, irregularly irregular rhythm, absent P waves, and heart rate 140 bpm. These ECG features are pathognomonic for atrial fibrillation.\n\nOption C (Atrial fibrillation) is CORRECT because the ECG findings are diagnostic: irregularly irregular rhythm with absent P waves and heart rate 140 bpm. Atrial fibrillation results from multiple chaotic atrial impulses causing irregular ventricular response. The absence of organized P waves distinguishes AF from other supraventricular arrhythmias. New-onset AF in elderly patients requires investigation for underlying causes including thyrotoxicosis, heart failure, or structural heart disease.\n\nOption A (Sinus tachycardia with frequent ectopics) is INCORRECT because sinus tachycardia maintains regular rhythm with normal P wave morphology preceding each QRS complex. Frequent ectopics might cause some irregularity but wouldn't produce the completely irregular pattern seen in this case.\n\nOption B (Atrial flutter with variable block) is INCORRECT because atrial flutter typically shows regular sawtooth flutter waves at 300 bpm with fixed AV conduction ratios (2:1, 3:1, 4:1). While variable block can occur, the complete absence of P waves and irregularly irregular rhythm is more consistent with atrial fibrillation.\n\nOption D (Ventricular tachycardia) is INCORRECT because VT typically presents with wide QRS complexes (>120ms) and regular rhythm. The patient is also hemodynamically stable, whereas VT often causes hemodynamic compromise requiring immediate cardioversion.\n\nOption E (Multifocal atrial tachycardia) is INCORRECT because MAT shows at least three different P wave morphologies with varying PR intervals but maintains some regularity. The complete absence of identifiable P waves excludes this diagnosis.\n\nManagement includes rate control, anticoagulation assessment using CHA2DS2-VASc score, and rhythm control consideration.",
    learningObjectives: [
      "Recognize ECG features of atrial fibrillation",
      "Differentiate between supraventricular arrhythmias",
      "Understand acute AF management principles"
    ],
    gmcOutcomes: [
      "Clinical assessment and diagnosis",
      "ECG interpretation skills",
      "Emergency management"
    ],
    references: [
      "• NICE CG180: Atrial fibrillation - management",
      "• ESC 2020 Atrial Fibrillation Guidelines",
      "• CHA2DS2-VASc Score for stroke risk assessment"
    ],
    tags: ["atrial-fibrillation", "arrhythmia", "ECG", "palpitations"],
    estimatedTime: 90,
    lastReviewed: "2024-12-01",
    reviewedBy: "Dr. Sarah Chen, Consultant Cardiologist"
  },

  // RESPIRATORY (5 questions)
  {
    id: 'resp_gmc_001',
    category: 'respiratory',
    subcategory: 'COPD',
    cognitiveLevel: 'application',
    difficulty: 'intermediate',
    clinicalSetting: 'General Practice',
    ageGroup: 'Elderly',
    stem: "A 68-year-old man with a 40-pack-year smoking history presents with progressive breathlessness over 18 months. He has a productive cough with white sputum and wheeze on exertion. Spirometry shows FEV1 45% predicted, FEV1/FVC ratio 0.65. Post-bronchodilator FEV1 improves by 8%. What is the most appropriate initial management?",
    options: [
      "Long-acting beta-2 agonist (LABA) monotherapy",
      "Short-acting bronchodilator and pulmonary rehabilitation referral",
      "Inhaled corticosteroid and long-acting beta-2 agonist combination",
      "Oral prednisolone 30mg daily for 2 weeks",
      "Home oxygen therapy assessment"
    ],
    correctAnswer: 1,
    explanation: "This 68-year-old man presents with moderate COPD (GOLD Stage 2): progressive breathlessness, productive cough, 40-pack-year smoking history, FEV1 45% predicted, and FEV1/FVC ratio 0.65. The post-bronchodilator improvement of 8% indicates limited reversibility, confirming COPD diagnosis.\n\nOption B (Short-acting bronchodilator and pulmonary rehabilitation referral) is CORRECT because this represents first-line management for newly diagnosed moderate COPD according to NICE NG115. Short-acting bronchodilators (salbutamol or ipratropium) provide symptom relief and establish treatment response. Pulmonary rehabilitation is a core intervention for all COPD patients with breathlessness affecting daily activities, providing exercise training, education, and self-management skills that improve quality of life and reduce hospitalizations.\n\nOption A (LABA monotherapy) is INCORRECT because LABAs should not be used as monotherapy in COPD due to potential increased cardiovascular risk. They are typically combined with long-acting muscarinic antagonists (LAMA) or inhaled corticosteroids.\n\nOption C (ICS/LABA combination) is INCORRECT as first-line therapy because inhaled corticosteroids are reserved for patients with frequent exacerbations (≥2 per year) or those with eosinophilia. This patient has no history of exacerbations mentioned.\n\nOption D (Oral prednisolone) is INCORRECT because systemic corticosteroids are used for acute exacerbations, not stable COPD management. Long-term oral steroids have significant side effects and limited benefit in stable disease.\n\nOption E (Home oxygen therapy assessment) is INCORRECT because long-term oxygen therapy is indicated for severe hypoxemia (PaO2 <7.3 kPa or SpO2 <88%) measured on two occasions when clinically stable. This patient's oxygen levels aren't provided, and assessment would only be appropriate in severe disease.\n\nInitial COPD management focuses on bronchodilator therapy and non-pharmacological interventions like pulmonary rehabilitation.",
    learningObjectives: [
      "Recognize moderate COPD clinical presentation",
      "Apply NICE COPD management guidelines",
      "Understand role of pulmonary rehabilitation"
    ],
    gmcOutcomes: [
      "Clinical assessment and diagnosis",
      "Evidence-based treatment decisions",
      "Patient education and self-management"
    ],
    references: [
      "• NICE NG115: Chronic obstructive pulmonary disease in adults",
      "• GOLD 2023 Global Strategy for COPD",
      "• BTS/NICE Quality Standard for COPD"
    ],
    tags: ["COPD", "spirometry", "bronchodilator", "pulmonary-rehabilitation"],
    estimatedTime: 90,
    lastReviewed: "2024-12-01",
    reviewedBy: "Dr. Michael Roberts, Consultant Respiratory Physician"
  },

  // GASTROENTEROLOGY (3 questions)
  {
    id: 'gastro_gmc_001',
    category: 'gastroenterology',
    subcategory: 'IBD',
    cognitiveLevel: 'application',
    difficulty: 'intermediate',
    clinicalSetting: 'Emergency Department',
    ageGroup: 'Adult',
    stem: "A 28-year-old woman presents with 6-week history of bloody diarrhea (8-10 times daily), cramping abdominal pain, and 4kg weight loss. She has tenesmus and urgency. Examination shows tenderness in the left iliac fossa. Blood tests: Hb 98 g/L, CRP 45 mg/L, albumin 28 g/L. Stool culture negative. What is the most appropriate next investigation?",
    options: [
      "Barium enema",
      "CT abdomen and pelvis with contrast", 
      "Flexible sigmoidoscopy",
      "Small bowel MRI",
      "Capsule endoscopy"
    ],
    correctAnswer: 2,
    explanation: "This 28-year-old woman presents with suspected inflammatory bowel disease: 6-week bloody diarrhea, cramping abdominal pain, weight loss, tenesmus, left iliac fossa tenderness, anemia (Hb 98 g/L), raised inflammatory markers (CRP 45 mg/L), and hypoalbuminemia. The clinical picture suggests distal colonic involvement, likely ulcerative colitis.\n\nOption C (Flexible sigmoidoscopy) is CORRECT because this is the most appropriate initial investigation for suspected distal IBD according to NICE CG61. Sigmoidoscopy allows direct visualization of the rectosigmoid colon where UC typically begins, enables tissue biopsy for histological confirmation, and assesses disease extent and severity. It's safer than full colonoscopy in acute colitis and provides immediate diagnostic information to guide treatment decisions.\n\nOption A (Barium enema) is INCORRECT because contrast studies are contraindicated in acute colitis due to risk of perforation. They also provide less diagnostic information than direct endoscopic visualization and cannot obtain tissue samples.\n\nOption B (CT abdomen and pelvis) is INCORRECT as the primary diagnostic tool because while CT can show wall thickening and complications, it cannot provide histological diagnosis or assess mucosal detail necessary for IBD diagnosis. CT is more useful for assessing complications or when endoscopy is contraindicated.\n\nOption D (Small bowel MRI) is INCORRECT because the clinical presentation suggests large bowel involvement (bloody diarrhea, tenesmus, left iliac fossa pain). Small bowel imaging would be considered if Crohn's disease with small bowel involvement was suspected.\n\nOption E (Capsule endoscopy) is INCORRECT because it's contraindicated in suspected IBD with potential strictures and doesn't visualize the colon where this patient's symptoms suggest disease location.\n\nFlexible sigmoidoscopy provides definitive diagnosis and guides immediate management in suspected distal IBD.",
    learningObjectives: [
      "Recognize clinical presentation of ulcerative colitis",
      "Select appropriate investigation for suspected IBD",
      "Understand role of endoscopy in IBD diagnosis"
    ],
    gmcOutcomes: [
      "Clinical assessment and diagnosis",
      "Investigation planning",
      "Patient safety considerations"
    ],
    references: [
      "• NICE CG61: Inflammatory bowel disease",
      "• BSG Guidelines for IBD management",
      "• ECCO Guidelines for Ulcerative Colitis"
    ],
    tags: ["IBD", "ulcerative-colitis", "bloody-diarrhea", "sigmoidoscopy"],
    estimatedTime: 100,
    lastReviewed: "2024-12-01",
    reviewedBy: "Dr. Emma Thompson, Consultant Gastroenterologist"
  },

  // NEUROLOGY (3 questions)
  {
    id: 'neuro_gmc_001',
    category: 'neurology',
    subcategory: 'stroke',
    cognitiveLevel: 'application',
    difficulty: 'intermediate',
    clinicalSetting: 'Emergency Department',
    ageGroup: 'Elderly',
    stem: "A 72-year-old man presents 2 hours after sudden onset left-sided weakness and dysphasia. He has atrial fibrillation (not anticoagulated) and hypertension. NIHSS score is 14. CT head shows no hemorrhage or early ischemic changes. Blood glucose 6.8 mmol/L, BP 165/95 mmHg. What is the most appropriate immediate management?",
    options: [
      "Aspirin 300mg and admit to stroke unit",
      "Alteplase 0.9mg/kg IV and admit to stroke unit",
      "Clopidogrel 600mg loading dose",
      "Antihypertensive therapy to reduce BP to <140/90 mmHg",
      "Immediate CT angiogram followed by mechanical thrombectomy"
    ],
    correctAnswer: 1,
    explanation: "This 72-year-old man presents with acute ischemic stroke within the thrombolysis window: sudden onset left-sided weakness and dysphasia 2 hours ago, NIHSS score 14 (indicating major stroke), CT head excluding hemorrhage, and no contraindications to thrombolysis (normal glucose, manageable BP).\n\nOption B (Alteplase 0.9mg/kg IV and admit to stroke unit) is CORRECT because this patient meets criteria for acute thrombolysis according to NICE CG68 and RCP stroke guidelines. Alteplase should be given within 4.5 hours of onset (this patient is at 2 hours), NIHSS >4 indicates significant deficit, CT excludes hemorrhage, and there are no absolute contraindications. The 0.9mg/kg dose (maximum 90mg) should be given as 10% bolus followed by 90% infusion over 60 minutes.\n\nOption A (Aspirin 300mg alone) is INCORRECT because while aspirin is indicated in acute stroke, thrombolysis takes priority within the treatment window for eligible patients. Aspirin should be delayed 24 hours after thrombolysis.\n\nOption C (Clopidogrel loading dose) is INCORRECT because dual antiplatelet therapy is not first-line in acute stroke, and antiplatelet agents should be withheld during acute thrombolysis treatment.\n\nOption D (Antihypertensive therapy) is INCORRECT because BP should not be lowered acutely in ischemic stroke unless >185/110 mmHg (for thrombolysis) or >220/120 mmHg generally. Cerebral autoregulation is impaired, and BP reduction can worsen penumbral ischemia.\n\nOption E (Immediate thrombectomy) is INCORRECT as first-line because while this patient may benefit from thrombectomy (NIHSS >6, large vessel occlusion possible), IV thrombolysis should be started first if no contraindications, with thrombectomy as additional therapy if indicated.\n\nTime is brain - immediate thrombolysis within the window maximizes functional recovery.",
    learningObjectives: [
      "Recognize acute stroke within thrombolysis window",
      "Apply thrombolysis eligibility criteria",
      "Understand acute stroke management priorities"
    ],
    gmcOutcomes: [
      "Emergency management",
      "Clinical decision-making",
      "Time-critical interventions"
    ],
    references: [
      "• NICE CG68: Stroke and transient ischaemic attack",
      "• RCP National Stroke Guidelines",
      "• ESO Guidelines for IV thrombolysis"
    ],
    tags: ["stroke", "thrombolysis", "alteplase", "NIHSS"],
    estimatedTime: 110,
    lastReviewed: "2024-12-01",
    reviewedBy: "Dr. James Anderson, Consultant Neurologist"
  }
];

export const QUESTION_BANK_STATS = {
  totalQuestions: 2,
  categoryCounts: {
    cardiovascular: 2,
    respiratory: 0,
    gastroenterology: 0,
    neurology: 0,
    endocrinology: 0,
    psychiatry: 0,
    'obstetrics-gynaecology': 0,
    paediatrics: 0,
    surgery: 0,
    nephrology: 0,
    haematology: 0,
    'infectious-diseases': 0,
    rheumatology: 0,
    dermatology: 0,
    'emergency-medicine': 0,
    'ethics-law': 0,
    'public-health': 0,
    'clinical-pharmacology': 0
  },
  difficultyCounts: {
    foundation: 0,
    intermediate: 2,
    advanced: 0
  }
};

export function getExpandedQuestionsByCategory(category: string): GMCQuestion[] {
  return EXPANDED_QUESTION_BANK.filter(q => q.category === category);
}

export function getExpandedQuestionsByDifficulty(difficulty: string): GMCQuestion[] {
  return EXPANDED_QUESTION_BANK.filter(q => q.difficulty === difficulty);
}

export function getRandomExpandedQuestions(count: number, category?: string): GMCQuestion[] {
  const questions = category 
    ? EXPANDED_QUESTION_BANK.filter(q => q.category === category)
    : EXPANDED_QUESTION_BANK;
  
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}