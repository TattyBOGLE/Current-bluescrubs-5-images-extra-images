// UK Clinical Scenarios - Based on Real NHS Practice
// Integrates NICE Guidelines, CKS, and GMC Good Medical Practice

export interface UKClinicalScenario {
  id: string;
  category: string;
  specialty: string;
  setting: 'GP' | 'Emergency' | 'Inpatient' | 'Outpatient' | 'Community';
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  niceGuideline: string;
  cksReference?: string;
  gmcOutcome: string[];
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  tags: string[];
  estimatedTime: number;
}

export const UK_CLINICAL_SCENARIOS: UKClinicalScenario[] = [
  {
    id: 'uk_cv_001',
    category: 'cardiovascular',
    specialty: 'Cardiology',
    setting: 'GP',
    title: 'Acute Chest Pain Assessment',
    scenario: "A 58-year-old taxi driver presents to your GP surgery with sudden onset crushing central chest pain that started 45 minutes ago while driving. The pain radiates to his left arm and jaw. He is sweating profusely and appears grey. He has a history of type 2 diabetes and hypertension. His current medications include metformin 1g BD and amlodipine 5mg OD. On examination: pulse 110/min irregular, BP 90/60 mmHg, oxygen saturation 94% on air.",
    question: "According to NICE guidelines, what is the most appropriate immediate management?",
    options: [
      "Give sublingual GTN and arrange routine cardiology referral",
      "Call 999 immediately, give aspirin 300mg and obtain 12-lead ECG",
      "Start high-flow oxygen and give IV morphine for pain relief",
      "Arrange urgent exercise stress test within 72 hours",
      "Prescribe atorvastatin 80mg and arrange lipid follow-up"
    ],
    correctAnswer: 1,
    explanation: "This presentation is highly suggestive of acute ST-elevation myocardial infarction (STEMI). The combination of crushing central chest pain with radiation, autonomic symptoms (sweating), and hemodynamic compromise (hypotension, irregular pulse) requires immediate emergency management. NICE CG167 emphasizes that suspected ACS requires immediate 999 call for emergency transport to a PCI-capable hospital. Aspirin 300mg should be given immediately unless contraindicated, as it provides immediate antiplatelet benefit. A 12-lead ECG should be obtained to confirm diagnosis and guide treatment. Time is muscle - every minute of delay increases myocardial damage and mortality risk. Primary PCI should be performed within 120 minutes of first medical contact for optimal outcomes.",
    niceGuideline: "NICE CG167: Acute coronary syndromes",
    cksReference: "CKS: Chest pain",
    gmcOutcome: [
      "Clinical assessment and diagnosis",
      "Emergency and urgent care",
      "Patient safety"
    ],
    difficulty: 'intermediate',
    tags: ['STEMI', 'emergency', 'chest-pain', 'ACS'],
    estimatedTime: 90
  },
  {
    id: 'uk_resp_001',
    category: 'respiratory',
    specialty: 'Respiratory',
    setting: 'Emergency',
    title: 'Acute Asthma Exacerbation',
    scenario: "A 23-year-old university student presents to A&E with severe breathlessness that started 2 hours ago. She has a history of asthma usually well-controlled with salbutamol PRN and beclometasone 200mcg BD. Today she was exposed to cats at a friend's house. On examination: she can only speak in single words, respiratory rate 35/min, pulse 130/min, peak flow 150 L/min (personal best 450 L/min), oxygen saturation 91% on air, widespread wheeze audible, accessory muscle use evident.",
    question: "According to BTS/SIGN guidelines, what defines this as life-threatening asthma?",
    options: [
      "Peak flow <33% of personal best and oxygen saturation <92%",
      "Inability to complete sentences and tachycardia >120 bpm",
      "Respiratory rate >25/min and widespread wheeze",
      "Recent exposure to known trigger and accessory muscle use",
      "Previous ICU admission and current severe breathlessness"
    ],
    correctAnswer: 0,
    explanation: "This patient has life-threatening asthma based on BTS/SIGN guidelines. Peak flow 150 L/min represents 33% of her personal best (150/450 = 33%), and oxygen saturation of 91% is <92%. Life-threatening features include: PEF <33% best/predicted, SpO2 <92%, altered consciousness, exhaustion, arrhythmia, hypotension, cyanosis, silent chest, or poor respiratory effort. This patient requires immediate high-dose bronchodilators (salbutamol 5mg nebulized with oxygen), prednisolone 40-50mg PO or hydrocortisone 100mg IV, and close monitoring. Magnesium sulfate 1.2-2g IV should be considered if poor response. The severity classification guides treatment intensity and admission decisions.",
    niceGuideline: "NICE NG80: Asthma diagnosis, monitoring and chronic asthma management",
    cksReference: "CKS: Asthma",
    gmcOutcome: [
      "Clinical assessment and diagnosis",
      "Emergency management",
      "Treatment and management"
    ],
    difficulty: 'advanced',
    tags: ['asthma', 'life-threatening', 'emergency', 'BTS-guidelines'],
    estimatedTime: 120
  },
  {
    id: 'uk_endo_001',
    category: 'endocrinology',
    specialty: 'Endocrinology',
    setting: 'GP',
    title: 'Type 2 Diabetes Diagnosis',
    scenario: "A 52-year-old office worker attends for routine health screening. She mentions feeling more tired recently and having to urinate frequently, especially at night. Her BMI is 32 kg/m². Family history includes mother with type 2 diabetes. Random plasma glucose today is 13.2 mmol/L. She is asymptomatic apart from polyuria and fatigue. Blood pressure is 145/88 mmHg. She takes no regular medications.",
    question: "According to NICE NG28, what is the most appropriate next step for diabetes diagnosis?",
    options: [
      "Repeat random plasma glucose on another day",
      "Arrange oral glucose tolerance test (OGTT)",
      "Request HbA1c and confirm diabetes if ≥48 mmol/mol",
      "Start metformin immediately and recheck in 3 months",
      "Refer urgently to endocrinology for specialist assessment"
    ],
    correctAnswer: 2,
    explanation: "NICE NG28 recommends HbA1c as the preferred diagnostic test for type 2 diabetes in adults, except where rapid diagnosis is needed or HbA1c is unreliable. With symptomatic hyperglycemia (polyuria, fatigue) and random glucose >11.1 mmol/L, diabetes diagnosis is likely, but HbA1c ≥48 mmol/mol (6.5%) confirms the diagnosis and provides information about glycemic control over the preceding 2-3 months. HbA1c is more convenient (non-fasting), has better pre-analytical stability, and reflects average glucose exposure. If HbA1c is ≥48 mmol/mol, diabetes is confirmed. If 42-47 mmol/mol, the patient has prediabetes. If <42 mmol/mol with symptoms, consider OGTT. This patient also needs cardiovascular risk assessment and blood pressure management as she has hypertension (≥140/90 mmHg).",
    niceGuideline: "NICE NG28: Type 2 diabetes in adults: management",
    cksReference: "CKS: Diabetes - type 2",
    gmcOutcome: [
      "Clinical assessment and diagnosis",
      "Investigation and diagnosis",
      "Health promotion and disease prevention"
    ],
    difficulty: 'intermediate',
    tags: ['diabetes', 'diagnosis', 'HbA1c', 'screening'],
    estimatedTime: 100
  },
  {
    id: 'uk_neuro_001',
    category: 'neurology',
    specialty: 'Neurology',
    setting: 'Emergency',
    title: 'Acute Stroke Recognition',
    scenario: "A 74-year-old retired teacher is brought to A&E by her daughter after sudden onset of speech difficulty and right-sided weakness 90 minutes ago. She was previously well and independent. On examination: NIHSS score 8, blood pressure 180/95 mmHg, glucose 8.2 mmol/L, temperature 36.8°C. She has left facial droop, right arm and leg weakness (power 2/5), and expressive dysphasia. CT head shows no hemorrhage. She takes warfarin for atrial fibrillation (INR 2.1 yesterday).",
    question: "According to NICE CG68, what is the most appropriate immediate treatment?",
    options: [
      "Start aspirin 300mg immediately and arrange rehabilitation",
      "Reverse anticoagulation with vitamin K and fresh frozen plasma",
      "Administer alteplase after urgent coagulation studies",
      "Arrange urgent carotid endarterectomy within 2 weeks",
      "Start dual antiplatelet therapy with aspirin and clopidogrel"
    ],
    correctAnswer: 2,
    explanation: "This patient has acute ischemic stroke within the thrombolysis window (onset 90 minutes ago). NICE CG68 recommends alteplase for acute ischemic stroke if: onset <4.5 hours, no contraindications, and CT excludes hemorrhage. Although she takes warfarin (INR 2.1), this is not an absolute contraindication if INR ≤1.7 or can be rapidly reversed. Urgent coagulation studies (INR, APTT, platelet count) should be performed immediately. If INR >1.7, consider prothrombin complex concentrate for rapid reversal before alteplase. The NIHSS score of 8 indicates moderate stroke severity - severe enough for significant disability but within thrombolysis criteria. Time is critical: 'time is brain' - every minute delay results in loss of 1.9 million neurons. Primary stroke centers should aim for door-to-needle time <60 minutes. Post-thrombolysis, the patient needs stroke unit care with specialist monitoring.",
    niceGuideline: "NICE CG68: Stroke and transient ischaemic attack in over 16s",
    cksReference: "CKS: Stroke",
    gmcOutcome: [
      "Clinical assessment and diagnosis",
      "Emergency management",
      "Treatment and management"
    ],
    difficulty: 'advanced',
    tags: ['stroke', 'thrombolysis', 'alteplase', 'emergency'],
    estimatedTime: 150
  },
  {
    id: 'uk_psych_001',
    category: 'psychiatry',
    specialty: 'Psychiatry',
    setting: 'GP',
    title: 'Depression Assessment and Management',
    scenario: "A 35-year-old teacher presents feeling 'down' for the past 6 weeks. She describes low mood, loss of interest in activities she previously enjoyed, difficulty sleeping, poor concentration affecting her work, and feelings of worthlessness. She has lost 3kg weight unintentionally. She denies suicidal ideation but feels 'life isn't worth living sometimes'. PHQ-9 score is 16. No past psychiatric history. She mentions her father died by suicide 10 years ago.",
    question: "According to NICE CG90, what is the most appropriate initial management?",
    options: [
      "Prescribe sertraline 50mg daily and review in 2 weeks",
      "Refer for urgent psychiatric assessment due to family history",
      "Offer high-intensity psychological intervention (CBT) as first-line",
      "Combine antidepressant medication with psychological therapy",
      "Arrange crisis team assessment for risk of self-harm"
    ],
    correctAnswer: 3,
    explanation: "This patient has moderate to severe depression (PHQ-9 score 16, functional impairment at work, biological symptoms). NICE CG90 recommends combined antidepressant medication and high-intensity psychological intervention for moderate to severe depression. The combination is more effective than either treatment alone. SSRI (sertraline) should be started as first-line antidepressant due to favorable side effect profile and safety in overdose. CBT or IPT should be offered as psychological intervention. Although she denies active suicidal ideation, the phrase 'life isn't worth living' and family history of suicide require careful risk assessment and safety planning. Follow-up should be weekly initially, then at 2, 4, 6, and 12 weeks. She should be advised about delayed onset (2-4 weeks) and potential initial increase in suicidal thoughts, especially in under-30s.",
    niceGuideline: "NICE CG90: Depression in adults: treatment and management",
    cksReference: "CKS: Depression",
    gmcOutcome: [
      "Clinical assessment and diagnosis",
      "Treatment and management",
      "Risk assessment and safety"
    ],
    difficulty: 'intermediate',
    tags: ['depression', 'PHQ-9', 'psychological-therapy', 'antidepressants'],
    estimatedTime: 120
  },
  {
    id: 'uk_obs_001',
    category: 'obstetrics',
    specialty: 'Obstetrics',
    setting: 'GP',
    title: 'Antenatal Care - Gestational Diabetes',
    scenario: "A 28-year-old woman at 28 weeks gestation attends for routine antenatal appointment. Her BMI is 34 kg/m² and she has a family history of type 2 diabetes (mother). She mentions increased thirst and urination recently. Oral glucose tolerance test (OGTT) results: fasting glucose 5.8 mmol/L, 2-hour glucose 9.2 mmol/L. Previous pregnancy was complicated by macrosomia (birth weight 4.2kg). Blood pressure today is 125/78 mmHg, urinalysis shows glucose ++.",
    question: "According to NICE NG3, how should this gestational diabetes be managed?",
    options: [
      "Dietary advice only and recheck glucose in 2 weeks",
      "Start metformin immediately and monitor with home glucose testing",
      "Refer to specialist diabetes team and start dietary management",
      "Begin insulin therapy and plan elective caesarean section",
      "Advise early delivery at 37 weeks due to macrosomia risk"
    ],
    correctAnswer: 2,
    explanation: "This patient has gestational diabetes mellitus (GDM) based on OGTT results: fasting glucose ≥5.6 mmol/L OR 2-hour glucose ≥7.8 mmol/L (NICE NG3 criteria). GDM diagnosis requires immediate specialist referral to diabetes team for comprehensive management. Initial management involves dietary advice (carbohydrate restriction, regular meals), home glucose monitoring (fasting and 1-hour post-meals), and lifestyle modification. Target glucose levels: fasting <5.3 mmol/L, 1-hour post-meal <7.8 mmol/L, 2-hour post-meal <6.4 mmol/L. If targets not achieved with diet alone within 1-2 weeks, consider metformin (first-line) or insulin. Additional monitoring includes serial growth scans for macrosomia, regular blood pressure checks, and increased antenatal surveillance. The patient's risk factors (obesity, family history, previous macrosomia) increase complications risk.",
    niceGuideline: "NICE NG3: Diabetes in pregnancy: management from preconception to the postnatal period",
    cksReference: "CKS: Diabetes in pregnancy",
    gmcOutcome: [
      "Clinical assessment and diagnosis",
      "Antenatal care",
      "Multi-disciplinary team working"
    ],
    difficulty: 'intermediate',
    tags: ['gestational-diabetes', 'OGTT', 'antenatal-care', 'specialist-referral'],
    estimatedTime: 110
  },
  {
    id: 'uk_paeds_001',
    category: 'pediatrics',
    specialty: 'Pediatrics',
    setting: 'Emergency',
    title: 'Febrile Child Assessment',
    scenario: "A 15-month-old girl is brought to A&E by worried parents. She has had fever for 18 hours (maximum 39.8°C), is irritable, and has reduced oral intake. She has a non-blanching rash on her legs that appeared 2 hours ago. She is lethargic but rousable. Observations: temperature 39.2°C, heart rate 160/min, respiratory rate 35/min, capillary refill time 3 seconds centrally. She received paracetamol 1 hour ago. She is up to date with vaccinations including MenB.",
    question: "According to NICE NG51, what is the most appropriate immediate management?",
    options: [
      "Observe for 4 hours and discharge if fever settles",
      "Give IV antibiotics immediately and arrange urgent pediatric assessment",
      "Perform lumbar puncture before starting any treatment",
      "Give oral antibiotics and arrange GP follow-up in 24 hours",
      "Cool the child with tepid sponging and repeat observations"
    ],
    correctAnswer: 1,
    explanation: "This child has possible bacterial meningitis/septicemia indicated by non-blanching rash in febrile child. NICE NG51 and CG160 emphasize that non-blanching rash in febrile child is a 'red flag' requiring immediate action. The presentation suggests possible meningococcal disease despite MenB vaccination (which doesn't cover all strains). Immediate management includes: IV/IO access, blood cultures, IV antibiotics (ceftriaxone 80mg/kg), and urgent pediatric/PICU consultation. Don't delay antibiotics for lumbar puncture if meningococcal disease suspected. Additional immediate actions: FBC, U&E, glucose, lactate, coagulation screen, blood gas. Close monitoring for shock, DIC, and multi-organ failure. Parents should be counseled about serious nature. Contact tracing and chemoprophylaxis for close contacts may be needed. Early recognition and treatment are crucial for reducing mortality and morbidity.",
    niceGuideline: "NICE NG51: Sepsis: recognition, diagnosis and early management",
    cksReference: "CKS: Meningitis and septicemia",
    gmcOutcome: [
      "Clinical assessment and diagnosis",
      "Emergency management",
      "Pediatric care"
    ],
    difficulty: 'advanced',
    tags: ['meningitis', 'septicemia', 'non-blanching-rash', 'pediatric-emergency'],
    estimatedTime: 120
  },
  {
    id: 'uk_ethics_001',
    category: 'ethics',
    specialty: 'Medical Ethics',
    setting: 'GP',
    title: 'Capacity and Consent Assessment',
    scenario: "An 82-year-old man with mild dementia attends with his daughter for routine review. He lives independently with daily support from his daughter. His MMSE score is 22/30. He mentions he doesn't want to take his medications anymore as they 'make him feel sick'. His daughter is concerned and wants you to 'make him understand he needs them'. Current medications include donepezil, atorvastatin, ramipril, and aspirin. He can explain why each medication was prescribed but says 'I'd rather feel well now than worry about the future'.",
    question: "According to the Mental Capacity Act 2005, what is the most appropriate approach?",
    options: [
      "Respect his decision as he has capacity to make this choice",
      "Override his decision due to his dementia diagnosis",
      "Ask his daughter to make the decision as his next of kin",
      "Refer to the Court of Protection for a capacity assessment",
      "Continue medications covertly in his best interests"
    ],
    correctAnswer: 0,
    explanation: "The Mental Capacity Act 2005 establishes that capacity is decision-specific and time-specific. This gentleman demonstrates capacity for this decision as he can: understand the information (knows what each medication is for), retain the information, weigh up the pros and cons (acknowledges future benefits but prioritizes current wellbeing), and communicate his decision. The fact he has mild dementia (MMSE 22/30) doesn't automatically mean he lacks capacity. Adults are presumed to have capacity unless proven otherwise. He's entitled to make decisions that others consider unwise - this is fundamental to autonomy. The doctor should ensure he fully understands consequences, explore his concerns about side effects (perhaps medications can be adjusted), but ultimately respect his autonomous decision. Covert medication would be assault. Family cannot override competent adult decisions. Documentation of capacity assessment is essential.",
    niceGuideline: "Mental Capacity Act 2005",
    cksReference: "CKS: Dementia",
    gmcOutcome: [
      "Medical ethics and law",
      "Capacity assessment",
      "Consent and autonomy"
    ],
    difficulty: 'advanced',
    tags: ['capacity', 'consent', 'autonomy', 'Mental-Capacity-Act'],
    estimatedTime: 150
  }
];

// Clinical Decision Support Tools for UK Practice
export const UK_CLINICAL_TOOLS = [
  {
    id: 'qrisk3',
    name: 'QRISK3 Calculator',
    purpose: 'Cardiovascular risk assessment',
    guideline: 'NICE CG181',
    description: 'Calculate 10-year cardiovascular disease risk for UK population',
    parameters: ['age', 'sex', 'ethnicity', 'smoking', 'diabetes', 'bloodPressure', 'cholesterol']
  },
  {
    id: 'cha2ds2-vasc',
    name: 'CHA2DS2-VASc Score',
    purpose: 'Stroke risk in atrial fibrillation',
    guideline: 'NICE CG180',
    description: 'Calculate stroke risk and guide anticoagulation decisions',
    parameters: ['heartFailure', 'hypertension', 'age', 'diabetes', 'stroke', 'vascularDisease', 'sex']
  },
  {
    id: 'hasbled',
    name: 'HAS-BLED Score',
    purpose: 'Bleeding risk on anticoagulation',
    guideline: 'NICE CG180',
    description: 'Assess bleeding risk for patients on anticoagulation',
    parameters: ['hypertension', 'abnormalRenal', 'abnormalLiver', 'stroke', 'bleeding', 'labile', 'elderly', 'drugs']
  },
  {
    id: 'wells-pe',
    name: 'Wells Score for PE',
    purpose: 'Pulmonary embolism probability',
    guideline: 'NICE CG144',
    description: 'Clinical probability of pulmonary embolism',
    parameters: ['clinicalPE', 'heartRate', 'immobilisation', 'previousPE', 'haemoptysis', 'malignancy']
  }
];