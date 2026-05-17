// Clinical Knowledge Summaries and Medical Guides
// Comprehensive collection for PLAB preparation and clinical practice

export interface ClinicalGuide {
  id: string;
  title: string;
  category: string;
  specialty: string;
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  estimatedReadTime: number; // minutes
  lastUpdated: Date;
  author: string;
  reviewedBy: string[];
  clinicalRelevance: 'very-high' | 'high' | 'medium' | 'low';
  examRelevance: 'plab1' | 'plab2' | 'both' | 'general';
  content: {
    overview: string;
    keyPoints: string[];
    clinicalPresentation: {
      symptoms: string[];
      signs: string[];
      investigations: string[];
    };
    management: {
      immediate: string[];
      longTerm: string[];
      complications: string[];
    };
    differentialDiagnosis: string[];
    redFlags: string[];
    guidelines: {
      source: 'NICE' | 'CKS' | 'ESC' | 'ADA' | 'SIGN' | 'BTS' | 'RCOG' | 'RCPCH' | 'RCPsych' | 'BSG' | 'BHS' | 'DVLA' | 'GMC' | 'MHRA' | 'PHE' | 'WHO' | 'EASD' | 'EHRA' | 'ESH' | 'ESMO' | 'ASCO' | 'NCCN' | 'KDIGO' | 'ATS' | 'GOLD' | 'GINA' | 'BSR' | 'ACR' | 'EULAR' | 'IDSA' | 'ECDC' | 'UKHSA';
      year: number;
      keyRecommendations: string[];
      url?: string;
    }[];
    mnemonics: string[];
    casesStudies: {
      scenario: string;
      diagnosis: string;
      reasoning: string;
    }[];
  };
  tags: string[];
  references: string[];
}

export const CLINICAL_GUIDES: ClinicalGuide[] = [
  {
    id: 'guide_001',
    title: 'Acute Coronary Syndromes: Comprehensive Management Guide',
    category: 'Cardiovascular Medicine',
    specialty: 'Cardiology',
    difficulty: 'intermediate',
    estimatedReadTime: 15,
    lastUpdated: new Date('2024-01-15'),
    author: 'Dr. Sarah Ahmed, Consultant Cardiologist',
    reviewedBy: ['Dr. Michael Chen', 'Dr. Priya Patel'],
    clinicalRelevance: 'very-high',
    examRelevance: 'both',
    content: {
      overview: "Acute coronary syndromes (ACS) represent a spectrum of conditions caused by sudden reduction in coronary blood flow, including unstable angina, NSTEMI, and STEMI. Early recognition and appropriate management are crucial for patient outcomes.",
      keyPoints: [
        "ACS includes unstable angina, NSTEMI, and STEMI",
        "ECG and troponins are key diagnostic tools",
        "Time-sensitive condition requiring immediate intervention",
        "Primary PCI is preferred for STEMI when available",
        "Dual antiplatelet therapy is cornerstone of treatment"
      ],
      clinicalPresentation: {
        symptoms: [
          "Central crushing chest pain",
          "Radiation to left arm, jaw, neck, or back",
          "Shortness of breath",
          "Nausea and vomiting",
          "Sweating and clamminess",
          "Sense of impending doom"
        ],
        signs: [
          "Pallor and diaphoresis",
          "Tachycardia or bradycardia",
          "Hypotension or hypertension",
          "Fourth heart sound (S4)",
          "Mitral regurgitation murmur",
          "Signs of heart failure"
        ],
        investigations: [
          "12-lead ECG (serial if initial normal)",
          "High-sensitivity troponin (0 and 3 hours)",
          "FBC, U&E, glucose, lipids",
          "Chest X-ray",
          "Echocardiogram",
          "Coronary angiography"
        ]
      },
      management: {
        immediate: [
          "MONA: Morphine, Oxygen (if SpO2 <90%), Nitrates, Aspirin 300mg",
          "Clopidogrel 600mg loading dose",
          "Atorvastatin 80mg",
          "Metoprolol if no contraindications",
          "Primary PCI within 90 minutes for STEMI",
          "Thrombolysis within 30 minutes if PCI unavailable"
        ],
        longTerm: [
          "Dual antiplatelet therapy (aspirin + clopidogrel) for 12 months",
          "ACE inhibitor or ARB",
          "Beta-blocker",
          "High-intensity statin",
          "Lifestyle modifications",
          "Cardiac rehabilitation program"
        ],
        complications: [
          "Cardiogenic shock",
          "Mechanical complications (papillary muscle rupture, VSD)",
          "Pericarditis",
          "Ventricular arrhythmias",
          "Heart failure",
          "Reinfarction"
        ]
      },
      differentialDiagnosis: [
        "Aortic dissection",
        "Pulmonary embolism",
        "Pneumothorax",
        "Pericarditis",
        "Gastroesophageal reflux disease",
        "Musculoskeletal chest pain"
      ],
      redFlags: [
        "Persistent chest pain >20 minutes",
        "ST elevation on ECG",
        "Hemodynamic instability",
        "Acute heart failure",
        "New murmur suggesting mechanical complication",
        "Syncope or pre-syncope"
      ],
      guidelines: [
        {
          source: "ESC Guidelines on ACS",
          year: 2023,
          keyRecommendations: [
            "Primary PCI within 90 minutes for STEMI",
            "High-sensitivity troponin for diagnosis",
            "GRACE score for risk stratification",
            "Invasive strategy within 24 hours for high-risk NSTEMI"
          ]
        },
        {
          source: "NICE CG95",
          year: 2022,
          keyRecommendations: [
            "Offer immediate dual antiplatelet therapy",
            "Consider prasugrel or ticagrelor over clopidogrel",
            "Start ACE inhibitor within 24 hours",
            "Offer cardiac rehabilitation"
          ]
        }
      ],
      mnemonics: [
        "MONA BASH: Morphine, Oxygen, Nitrates, Aspirin, Beta-blockers, ACE inhibitors, Statins, Heparin",
        "GRACE: Global Registry of Acute Coronary Events (risk scoring)",
        "HEART score: History, ECG, Age, Risk factors, Troponin"
      ],
      casesStudies: [
        {
          scenario: "58-year-old male presents with 2 hours of severe central chest pain, ST elevation in leads II, III, aVF",
          diagnosis: "Inferior STEMI",
          reasoning: "ST elevation in inferior leads indicates RCA occlusion. Immediate primary PCI indicated within 90 minutes."
        },
        {
          scenario: "65-year-old diabetic female with 6 hours of chest discomfort, normal ECG, troponin elevated",
          diagnosis: "NSTEMI",
          reasoning: "Elevated troponin with normal ECG suggests NSTEMI. Risk stratify with GRACE score and consider early invasive strategy."
        }
      ]
    },
    tags: ['cardiology', 'emergency', 'STEMI', 'NSTEMI', 'chest pain', 'PCI'],
    references: [
      "ESC Guidelines for ACS without persistent ST-segment elevation, 2023",
      "NICE CG95: Unstable angina and NSTEMI, 2022",
      "Thygesen K. Fourth universal definition of myocardial infarction. Circulation 2018"
    ]
  },
  {
    id: 'guide_002',
    title: 'Diabetes Mellitus: Comprehensive Management Strategy',
    category: 'Endocrinology',
    specialty: 'Endocrinology',
    difficulty: 'intermediate',
    estimatedReadTime: 20,
    lastUpdated: new Date('2024-01-10'),
    author: 'Dr. Raj Patel, Consultant Endocrinologist',
    reviewedBy: ['Dr. Emma Thompson', 'Dr. James Wilson'],
    clinicalRelevance: 'very-high',
    examRelevance: 'both',
    content: {
      overview: "Diabetes mellitus is a group of metabolic disorders characterized by hyperglycemia. Type 2 diabetes accounts for 90-95% of cases and requires comprehensive management including lifestyle modifications, medications, and monitoring for complications.",
      keyPoints: [
        "HbA1c target <7% (53 mmol/mol) for most patients",
        "Metformin is first-line therapy for Type 2 diabetes",
        "SGLT-2 inhibitors and GLP-1 agonists provide cardiovascular benefits",
        "Annual screening for diabetic complications is essential",
        "Lifestyle modifications are fundamental to management"
      ],
      clinicalPresentation: {
        symptoms: [
          "Polyuria (excessive urination)",
          "Polydipsia (excessive thirst)",
          "Polyphagia (excessive hunger)",
          "Unexplained weight loss",
          "Fatigue and weakness",
          "Blurred vision",
          "Slow-healing wounds",
          "Recurrent infections"
        ],
        signs: [
          "Hyperglycemia",
          "Glycosuria",
          "Ketones in urine (Type 1)",
          "Diabetic retinopathy",
          "Peripheral neuropathy",
          "Reduced peripheral pulses",
          "Skin infections",
          "Acanthosis nigricans"
        ],
        investigations: [
          "HbA1c ≥6.5% (48 mmol/mol)",
          "Fasting glucose ≥7.0 mmol/L",
          "Random glucose ≥11.1 mmol/L with symptoms",
          "OGTT: 2-hour glucose ≥11.1 mmol/L",
          "C-peptide and autoantibodies (if Type 1 suspected)",
          "Urinalysis for proteinuria"
        ]
      },
      management: {
        immediate: [
          "Lifestyle counseling (diet and exercise)",
          "Metformin 500mg BD (if eGFR >30)",
          "HbA1c monitoring every 3-6 months",
          "Blood pressure and lipid management",
          "Smoking cessation if applicable",
          "Diabetic education and support"
        ],
        longTerm: [
          "Escalate therapy if HbA1c >7% after 3 months",
          "Add SGLT-2 inhibitor or GLP-1 agonist for CV benefits",
          "Consider insulin if multiple oral agents insufficient",
          "Annual diabetic complications screening",
          "Optimize cardiovascular risk factors",
          "Regular podiatry and ophthalmology review"
        ],
        complications: [
          "Diabetic ketoacidosis (Type 1)",
          "Hyperosmolar hyperglycemic state (Type 2)",
          "Diabetic retinopathy",
          "Diabetic nephropathy",
          "Diabetic neuropathy",
          "Cardiovascular disease",
          "Diabetic foot disease"
        ]
      },
      differentialDiagnosis: [
        "MODY (Maturity Onset Diabetes of Young)",
        "Secondary diabetes (pancreatic disease, steroids)",
        "Stress hyperglycemia",
        "Diabetes insipidus",
        "Hyperthyroidism",
        "Cushing's syndrome"
      ],
      redFlags: [
        "DKA symptoms (vomiting, abdominal pain, Kussmaul breathing)",
        "Severe hyperglycemia >30 mmol/L",
        "Acute visual changes",
        "Infected diabetic foot ulcer",
        "Signs of severe dehydration",
        "Reduced consciousness"
      ],
      guidelines: [
        {
          source: "ADA/EASD Consensus 2022",
          year: 2022,
          keyRecommendations: [
            "Individualized HbA1c targets",
            "Early combination therapy for high HbA1c",
            "SGLT-2i or GLP-1 RA for patients with ASCVD",
            "Comprehensive cardiovascular risk management"
          ]
        },
        {
          source: "NICE NG28",
          year: 2022,
          keyRecommendations: [
            "Metformin first-line unless contraindicated",
            "Dual therapy if HbA1c >7.5% at diagnosis",
            "Consider insulin if HbA1c >10% with symptoms",
            "Annual screening for complications"
          ]
        }
      ],
      mnemonics: [
        "DIABETES symptoms: Drinking (polydipsia), Insulin deficiency, Appetite (polyphagia), Blood sugar high, Energy loss, Toilet visits (polyuria), Eyes affected, Sugar in urine",
        "ABC approach: A1c <7%, Blood pressure <140/90, Cholesterol management",
        "SGLT-2: Sugar Goes Lost Through-2 (kidneys)"
      ],
      casesStudies: [
        {
          scenario: "45-year-old obese patient, HbA1c 9.2% despite maximum metformin, BMI 32, no cardiovascular disease",
          diagnosis: "Type 2 diabetes requiring intensification",
          reasoning: "Add SGLT-2 inhibitor or GLP-1 agonist for weight loss benefits and cardiovascular protection"
        },
        {
          scenario: "28-year-old thin patient presenting with DKA, recent weight loss, family history of Type 1 diabetes",
          diagnosis: "Type 1 diabetes",
          reasoning: "Young age, DKA presentation, and phenotype suggest Type 1. Check autoantibodies and start insulin"
        }
      ]
    },
    tags: ['diabetes', 'endocrinology', 'metformin', 'HbA1c', 'complications', 'SGLT-2'],
    references: [
      "ADA/EASD Consensus Report on Type 2 Diabetes Management, 2022",
      "NICE NG28: Type 2 diabetes in adults management, 2022",
      "Diabetes UK Guidelines for Clinical Care, 2023"
    ]
  },
  {
    id: 'guide_003',
    title: 'Acute Asthma Management: Emergency to Outpatient Care',
    category: 'Respiratory Medicine',
    specialty: 'Pulmonology',
    difficulty: 'intermediate',
    estimatedReadTime: 12,
    lastUpdated: new Date('2024-01-08'),
    author: 'Dr. Lisa Chen, Consultant Respiratory Physician',
    reviewedBy: ['Dr. Ahmed Hassan', 'Dr. Maria Rodriguez'],
    clinicalRelevance: 'very-high',
    examRelevance: 'both',
    content: {
      overview: "Asthma is a chronic inflammatory airway disease characterized by variable airflow obstruction. Acute exacerbations require prompt recognition and treatment to prevent life-threatening complications.",
      keyPoints: [
        "Peak flow <50% predicted indicates severe asthma attack",
        "High-flow oxygen, bronchodilators, and steroids are mainstays of treatment",
        "Silent chest is an ominous sign requiring immediate intervention",
        "Most patients improve with nebulized bronchodilators",
        "Follow-up within 48 hours essential after emergency treatment"
      ],
      clinicalPresentation: {
        symptoms: [
          "Progressive wheeze and breathlessness",
          "Tight chest sensation",
          "Cough (often nocturnal)",
          "Difficulty speaking in sentences",
          "Use of accessory muscles",
          "Inability to lie flat"
        ],
        signs: [
          "Tachypnea >25/min",
          "Tachycardia >110 bpm",
          "Widespread wheeze",
          "Hyperinflated chest",
          "Accessory muscle use",
          "Cyanosis (late sign)"
        ],
        investigations: [
          "Peak expiratory flow rate",
          "Arterial blood gas if severe",
          "Chest X-ray to exclude pneumothorax",
          "No routine blood tests in acute setting",
          "Pulse oximetry monitoring",
          "Consider sputum culture if purulent"
        ]
      },
      management: {
        immediate: [
          "High-flow oxygen to maintain SpO2 94-98%",
          "Nebulized salbutamol 5mg",
          "Nebulized ipratropium 500mcg",
          "Oral prednisolone 40mg",
          "Consider IV hydrocortisone if severe vomiting",
          "Magnesium sulfate 2g IV if poor response"
        ],
        longTerm: [
          "Step up preventer therapy",
          "Ensure correct inhaler technique",
          "Written asthma action plan",
          "Identify and avoid triggers",
          "Annual asthma review",
          "Influenza vaccination"
        ],
        complications: [
          "Pneumothorax",
          "Pneumomediastinum",
          "Respiratory failure",
          "Status asthmaticus",
          "Cardiac arrest",
          "Mucus plugging"
        ]
      },
      differentialDiagnosis: [
        "COPD exacerbation",
        "Pneumonia",
        "Pulmonary edema",
        "Foreign body aspiration",
        "Vocal cord dysfunction",
        "Anaphylaxis"
      ],
      redFlags: [
        "Silent chest (absent wheeze)",
        "Cyanosis or SpO2 <92%",
        "Exhaustion or reduced conscious level",
        "Peak flow <33% predicted",
        "Rising CO2 on ABG",
        "Pneumothorax on CXR"
      ],
      guidelines: [
        {
          source: "BTS/SIGN Asthma Guidelines",
          year: 2019,
          keyRecommendations: [
            "Severity assessment using peak flow and clinical features",
            "High-dose inhaled bronchodilators via nebulizer",
            "Systemic corticosteroids for all but mildest attacks",
            "Consider IV magnesium sulfate in severe attacks"
          ]
        },
        {
          source: "NICE NG80",
          year: 2021,
          keyRecommendations: [
            "Offer ICS-formoterol as reliever therapy",
            "Annual structured review",
            "Personalized asthma action plan",
            "Consider biological therapy for severe asthma"
          ]
        }
      ],
      mnemonics: [
        "ASTHMA emergency: Airways (bronchodilators), Steroids, Theophylline (if severe), High-flow oxygen, Magnesium, Admit if severe",
        "WHEEZE: Widespread, High-pitched, Expiratory, Episodic, Zonal, Expands chest",
        "SMART therapy: Single Maintenance And Reliever Therapy (ICS-formoterol)"
      ],
      casesStudies: [
        {
          scenario: "28-year-old with known asthma, peak flow 40% predicted, unable to complete sentences, SpO2 92%",
          diagnosis: "Acute severe asthma",
          reasoning: "Peak flow <50% and inability to speak in sentences indicates severe attack requiring immediate nebulized bronchodilators and steroids"
        },
        {
          scenario: "45-year-old smoker with wheeze, productive cough, and breathlessness over 3 days",
          diagnosis: "Consider COPD exacerbation vs asthma",
          reasoning: "Age, smoking history, and productive cough suggest COPD. Response to bronchodilators helps differentiate"
        }
      ]
    },
    tags: ['asthma', 'emergency', 'bronchodilators', 'wheeze', 'respiratory', 'steroids'],
    references: [
      "BTS/SIGN British Guideline on the Management of Asthma, 2019",
      "NICE NG80: Asthma diagnosis, monitoring and chronic asthma management, 2021",
      "Global Initiative for Asthma (GINA) Strategy, 2023"
    ]
  },
  {
    id: 'guide_005',
    title: 'Urinary Tract Infections in Women: Evidence-Based Management',
    category: 'Infectious Diseases',
    specialty: 'General Practice',
    difficulty: 'foundation',
    estimatedReadTime: 10,
    lastUpdated: new Date('2024-01-20'),
    author: 'Dr. Emma Williams, GP Partner',
    reviewedBy: ['Dr. Sarah Ahmed', 'Dr. Michael Chen'],
    clinicalRelevance: 'very-high',
    examRelevance: 'both',
    content: {
      overview: "Lower urinary tract infections in women are common presentations requiring evidence-based management. NICE guidelines emphasize empirical treatment for uncomplicated cases without routine culture.",
      keyPoints: [
        "Empirical antibiotics for women <65 with ≥2 typical symptoms",
        "No routine urine culture required for uncomplicated UTI",
        "First-line: nitrofurantoin or trimethoprim",
        "3-day course sufficient for most cases",
        "Safety netting advice essential"
      ],
      clinicalPresentation: {
        symptoms: [
          "Dysuria (burning sensation)",
          "Urinary frequency",
          "Urinary urgency",
          "Suprapubic pain or discomfort",
          "Nocturia",
          "Haematuria (may be present)"
        ],
        signs: [
          "Suprapubic tenderness",
          "No fever in uncomplicated cases",
          "No flank pain or costovertebral angle tenderness",
          "Normal vital signs",
          "Clear urine or mild cloudiness"
        ],
        investigations: [
          "Urinalysis (dipstick) if diagnostic uncertainty",
          "Urine culture only if recurrent, atypical, or treatment failure",
          "MSU for culture in pregnancy or immunocompromised",
          "Consider STI screening if sexually active"
        ]
      },
      management: {
        immediate: [
          "Empirical antibiotics without culture",
          "Nitrofurantoin 100mg BD for 3 days (first-line)",
          "Trimethoprim 200mg BD for 3 days (if local resistance <20%)",
          "Increase fluid intake",
          "Paracetamol for symptom relief"
        ],
        longTerm: [
          "Prevention advice: post-coital voiding",
          "Adequate hydration",
          "Complete bladder emptying",
          "Cranberry products may help prevention",
          "Consider prophylaxis if ≥3 episodes/year"
        ],
        complications: [
          "Pyelonephritis if untreated",
          "Recurrent infections",
          "Chronic cystitis",
          "Renal scarring (rare)",
          "Sepsis (very rare in healthy women)"
        ]
      },
      differentialDiagnosis: [
        "Sexually transmitted infections (chlamydia, gonorrhoea)",
        "Vaginal candidiasis",
        "Bacterial vaginosis",
        "Urethral syndrome",
        "Interstitial cystitis",
        "Bladder cancer (in older patients)"
      ],
      redFlags: [
        "Fever >38°C",
        "Flank pain or costovertebral angle tenderness",
        "Rigors or signs of sepsis",
        "Haematuria in women >40",
        "Recurrent infections",
        "Symptoms not improving after 48 hours"
      ],
      guidelines: [
        {
          source: "NICE",
          year: 2018,
          keyRecommendations: [
            "Empirical treatment without culture for uncomplicated UTI",
            "Use local antibiogram to guide first-line choice",
            "3-day course for most antibiotics",
            "Safety netting advice essential"
          ],
          url: "https://www.nice.org.uk/guidance/ng109/chapter/Recommendations#treatment-of-lower-uti-in-non-pregnant-women-aged-16-and-over"
        },
        {
          source: "CKS",
          year: 2023,
          keyRecommendations: [
            "Immediate empirical antibiotic treatment",
            "Consider resistance patterns locally",
            "Avoid fluoroquinolones as first-line",
            "Follow-up if symptoms persist"
          ],
          url: "https://cks.nice.org.uk/topics/urinary-tract-infection-lower-women/management/empirical-antibiotic-treatment/"
        },
        {
          source: "BNF",
          year: 2024,
          keyRecommendations: [
            "Nitrofurantoin 100mg twice daily for 3 days",
            "Trimethoprim 200mg twice daily for 3 days",
            "Avoid in pregnancy: trimethoprim (first trimester)",
            "Consider local resistance patterns"
          ],
          url: "https://bnf.nice.org.uk/treatment-summary/urinary-tract-infections-utis/#uncomplicated-lower-uti-in-nonpregnant-wom"
        }
      ],
      mnemonics: [
        "DUS = Dysuria + Urgency + Suprapubic pain → Treat empirically",
        "UTI treatment: No Culture Unless Complicated",
        "3-day rule: Most UTIs need 3 days of antibiotics"
      ],
      casesStudies: [
        {
          scenario: "24-year-old woman with dysuria, frequency, and suprapubic pain for 2 days. No fever or flank pain.",
          diagnosis: "Uncomplicated lower UTI",
          reasoning: "Classic symptoms in young woman without red flags. Treat empirically with nitrofurantoin without culture per NICE guidance."
        },
        {
          scenario: "45-year-old woman with recurrent UTIs (4th episode in 6 months), current symptoms include fever and back pain.",
          diagnosis: "Complicated UTI with possible pyelonephritis",
          reasoning: "Recurrent nature plus systemic symptoms require urine culture and consideration of specialist referral."
        }
      ]
    },
    tags: ['uti', 'cystitis', 'antibiotics', 'womens-health', 'primary-care', 'nice'],
    references: [
      "NICE NG109: Urinary tract infection (lower): antimicrobial prescribing, 2018",
      "Clinical Knowledge Summaries: Urinary tract infection (lower) - women, 2023",
      "British National Formulary: Urinary tract infections, 2024"
    ]
  }
];

// Quick reference clinical summaries for common conditions
export interface QuickClinicalSummary {
  condition: string;
  category: string;
  keyFacts: string[];
  diagnosticCriteria: string[];
  firstLineManagement: string[];
  redFlags: string[];
  prognosis: string;
}

// Additional comprehensive clinical guides
const ADDITIONAL_CLINICAL_GUIDES: ClinicalGuide[] = [
  {
    id: 'guide_004',
    title: 'Sepsis Recognition and Management Protocol',
    category: 'Emergency Medicine',
    specialty: 'Emergency Medicine',
    difficulty: 'advanced',
    estimatedReadTime: 18,
    lastUpdated: new Date('2024-01-12'),
    author: 'Dr. Michael Thompson, Emergency Medicine Consultant',
    reviewedBy: ['Dr. Sarah Wilson', 'Dr. Ahmed Hassan'],
    clinicalRelevance: 'very-high',
    examRelevance: 'both',
    content: {
      overview: "Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. Early recognition and treatment with the Sepsis Six bundle significantly improves outcomes and reduces mortality.",
      keyPoints: [
        "Sepsis Six bundle must be completed within 1 hour",
        "qSOFA score ≥2 indicates high risk of poor outcomes",
        "Blood cultures before antibiotics when possible",
        "Broad-spectrum antibiotics within 1 hour",
        "Fluid resuscitation with crystalloids"
      ],
      clinicalPresentation: {
        symptoms: [
          "Altered mental state",
          "Fever or hypothermia",
          "Rigors and chills",
          "Breathlessness",
          "Nausea and vomiting",
          "Reduced urine output"
        ],
        signs: [
          "Tachycardia >90 bpm",
          "Tachypnea >22/min",
          "Hypotension <90 mmHg systolic",
          "Altered consciousness (GCS <15)",
          "Mottled skin",
          "Prolonged capillary refill >2 seconds"
        ],
        investigations: [
          "Blood cultures (before antibiotics)",
          "Lactate level",
          "FBC with differential",
          "U&E, LFTs, CRP, PCT",
          "ABG or VBG",
          "Urine dipstick and culture"
        ]
      },
      management: {
        immediate: [
          "High-flow oxygen if SpO2 <94%",
          "IV access and blood cultures",
          "Broad-spectrum antibiotics within 1 hour",
          "IV fluid challenge 500ml crystalloid",
          "Measure lactate and urine output",
          "Senior review and ITU consideration"
        ],
        longTerm: [
          "De-escalate antibiotics based on cultures",
          "Complete antibiotic course (usually 5-7 days)",
          "Monitor for organ dysfunction",
          "Rehabilitation and physiotherapy",
          "Follow-up for post-sepsis syndrome"
        ],
        complications: [
          "Septic shock",
          "Multi-organ failure",
          "ARDS",
          "AKI requiring dialysis",
          "Post-sepsis syndrome",
          "Death"
        ]
      },
      differentialDiagnosis: [
        "Cardiogenic shock",
        "Anaphylaxis",
        "Drug toxicity",
        "Massive pulmonary embolism",
        "Hypovolemic shock",
        "Neurogenic shock"
      ],
      redFlags: [
        "Lactate >4 mmol/L",
        "Systolic BP <90 mmHg",
        "Altered consciousness",
        "Oliguria <0.5 ml/kg/hr",
        "Mottled skin",
        "Temperature <36°C or >38.3°C"
      ],
      guidelines: [
        {
          source: "Surviving Sepsis Campaign 2021",
          year: 2021,
          keyRecommendations: [
            "1-hour bundle for sepsis and septic shock",
            "Lactate measurement within 6 hours",
            "Blood cultures before antibiotics",
            "Empirical broad-spectrum antibiotics within 1 hour"
          ]
        },
        {
          source: "NICE NG51",
          year: 2017,
          keyRecommendations: [
            "Use structured assessment tools",
            "Take blood cultures before antibiotics",
            "Give intravenous antibiotics within 1 hour",
            "Consider source control"
          ]
        }
      ],
      mnemonics: [
        "SEPSIS: Slurred speech/confusion, Extreme shivering, Passing no urine, Severe breathlessness, I feel like I might die, Skin mottled/discolored",
        "Sepsis Six: Send cultures, Examine lactate, Prescribe antibiotics, Supply oxygen, Initiate fluids, Scrutinize hourly urine output"
      ],
      casesStudies: [
        {
          scenario: "75-year-old with UTI, confusion, temperature 38.5°C, HR 110, BP 85/50, lactate 3.2",
          diagnosis: "Urosepsis with septic shock",
          reasoning: "Meets sepsis criteria with source identified. Requires immediate Sepsis Six bundle and ITU assessment for vasopressor support."
        }
      ]
    },
    tags: ['sepsis', 'emergency', 'shock', 'antibiotics', 'critical care'],
    references: [
      "Surviving Sepsis Campaign Guidelines 2021",
      "NICE NG51: Sepsis recognition, diagnosis and early management, 2017"
    ]
  },
  {
    id: 'guide_005',
    title: 'Stroke Assessment and Acute Management',
    category: 'Neurology',
    specialty: 'Neurology',
    difficulty: 'advanced',
    estimatedReadTime: 22,
    lastUpdated: new Date('2024-01-09'),
    author: 'Dr. Rachel Chen, Stroke Consultant',
    reviewedBy: ['Dr. James Murphy', 'Dr. Anita Sharma'],
    clinicalRelevance: 'very-high',
    examRelevance: 'both',
    content: {
      overview: "Acute stroke is a medical emergency requiring rapid assessment and treatment. Time-critical interventions include thrombolysis within 4.5 hours and thrombectomy within 6 hours for eligible patients.",
      keyPoints: [
        "FAST-BEFAST assessment for stroke recognition",
        "CT head within 1 hour of arrival",
        "Thrombolysis within 4.5 hours of symptom onset",
        "Thrombectomy for large vessel occlusion within 6 hours",
        "Aspirin 300mg after hemorrhage excluded"
      ],
      clinicalPresentation: {
        symptoms: [
          "Sudden onset focal neurological deficit",
          "Facial drooping",
          "Arm weakness",
          "Speech disturbance",
          "Visual field defects",
          "Sudden severe headache (hemorrhagic)"
        ],
        signs: [
          "Hemiparesis or hemiplegia",
          "Facial asymmetry",
          "Dysphasia or dysarthria",
          "Visual field defects",
          "Ataxia or vertigo",
          "Reduced consciousness"
        ],
        investigations: [
          "Non-contrast CT head (within 1 hour)",
          "CT angiography if thrombectomy candidate",
          "ECG and troponin",
          "FBC, U&E, glucose, lipids",
          "INR if on anticoagulation",
          "CXR and urinalysis"
        ]
      },
      management: {
        immediate: [
          "ABCDE assessment and stabilization",
          "Urgent CT head to exclude hemorrhage",
          "Thrombolysis with alteplase if within 4.5 hours",
          "Thrombectomy assessment if large vessel occlusion",
          "Aspirin 300mg if ischemic stroke confirmed",
          "Admit to stroke unit"
        ],
        longTerm: [
          "Secondary prevention with antiplatelet therapy",
          "Statin therapy for all ischemic strokes",
          "Blood pressure management",
          "Anticoagulation for atrial fibrillation",
          "Multidisciplinary rehabilitation",
          "Swallowing assessment"
        ],
        complications: [
          "Cerebral edema",
          "Hemorrhagic transformation",
          "Aspiration pneumonia",
          "Deep vein thrombosis",
          "Depression",
          "Recurrent stroke"
        ]
      },
      differentialDiagnosis: [
        "Hypoglycemia",
        "Seizure with Todd's paresis",
        "Migraine with aura",
        "Functional neurological disorder",
        "Brain tumor",
        "Subdural hematoma"
      ],
      redFlags: [
        "Sudden onset symptoms",
        "Rapid deterioration",
        "Reduced consciousness",
        "Signs of raised intracranial pressure",
        "Brainstem signs",
        "Seizures"
      ],
      guidelines: [
        {
          source: "ESO Guidelines 2021",
          year: 2021,
          keyRecommendations: [
            "Intravenous thrombolysis up to 4.5 hours",
            "Mechanical thrombectomy up to 6 hours",
            "Direct admission to stroke unit",
            "Early mobilization within 24 hours"
          ]
        }
      ],
      mnemonics: [
        "FAST-BEFAST: Face, Arms, Speech, Time, Balance, Eyes, Face, Arms, Speech, Time",
        "NIHSS: National Institutes of Health Stroke Scale for severity assessment"
      ],
      casesStudies: [
        {
          scenario: "68-year-old presents 2 hours after sudden right-sided weakness and speech difficulty, NIHSS 12",
          diagnosis: "Acute ischemic stroke - thrombolysis candidate",
          reasoning: "Within thrombolysis window with significant deficit. Urgent CT head and thrombolysis assessment required."
        }
      ]
    },
    tags: ['stroke', 'neurology', 'thrombolysis', 'emergency', 'FAST'],
    references: [
      "European Stroke Organisation Guidelines 2021",
      "NICE CG68: Stroke and transient ischaemic attack in over 16s, 2019"
    ]
  }
];

// Combine all clinical guides
CLINICAL_GUIDES.push(...ADDITIONAL_CLINICAL_GUIDES);

export const QUICK_CLINICAL_SUMMARIES: QuickClinicalSummary[] = [
  {
    condition: "Acute Appendicitis",
    category: "Surgery",
    keyFacts: [
      "Most common surgical emergency",
      "Peak incidence 10-30 years",
      "Classic pain migration from umbilicus to RIF",
      "CT scan is diagnostic test of choice",
      "Laparoscopic appendicectomy preferred"
    ],
    diagnosticCriteria: [
      "McBurney's point tenderness",
      "Rovsing's sign positive",
      "Raised inflammatory markers",
      "CT showing appendiceal wall thickening",
      "Alvarado score >7"
    ],
    firstLineManagement: [
      "IV antibiotics (co-amoxiclav)",
      "Analgesia and antiemetics",
      "NBM preparation for surgery",
      "Urgent surgical referral",
      "Laparoscopic appendicectomy"
    ],
    redFlags: [
      "Generalized peritonitis",
      "Septic shock",
      "Appendix mass/abscess",
      "Perforation",
      "Pregnancy"
    ],
    prognosis: "Excellent with early surgery. Mortality <1% if uncomplicated."
  },
  {
    condition: "Urinary Tract Infection",
    category: "Infectious Diseases",
    keyFacts: [
      "More common in women (8:1 ratio)",
      "E.coli causes 80% of uncomplicated UTIs",
      "Nitrites and leucocytes on dipstick",
      "3-day course for uncomplicated cystitis",
      "Consider resistant organisms in healthcare settings"
    ],
    diagnosticCriteria: [
      "Dysuria and frequency",
      "Positive urine dipstick",
      "Nitrites and/or leucocytes",
      "Mid-stream urine culture",
      ">10^5 CFU/ml significant bacteriuria"
    ],
    firstLineManagement: [
      "Trimethoprim 200mg BD 3 days",
      "Nitrofurantoin 100mg BD 7 days",
      "Increase fluid intake",
      "Paracetamol for symptom relief",
      "Safety net advice"
    ],
    redFlags: [
      "Loin pain and fever (pyelonephritis)",
      "Sepsis",
      "Pregnancy",
      "Male patient",
      "Immunocompromised"
    ],
    prognosis: "Excellent with appropriate antibiotics. Recurrence common in some women."
  },
  {
    condition: "Depression",
    category: "Psychiatry",
    keyFacts: [
      "Affects 1 in 6 adults at some point",
      "PHQ-9 score useful for assessment",
      "First-line: psychological interventions",
      "SSRIs first-line antidepressants",
      "Review after 2 weeks initially"
    ],
    diagnosticCriteria: [
      "Low mood for ≥2 weeks",
      "Anhedonia (loss of pleasure)",
      "≥5 symptoms from DSM-5 criteria",
      "Functional impairment",
      "PHQ-9 score ≥10"
    ],
    firstLineManagement: [
      "Watchful waiting if mild",
      "CBT or counseling",
      "Citalopram 20mg OD if moderate-severe",
      "Sleep hygiene advice",
      "Exercise and social support"
    ],
    redFlags: [
      "Suicidal ideation",
      "Psychotic symptoms",
      "Severe functional impairment",
      "Self-harm",
      "Rapid deterioration"
    ],
    prognosis: "Good with treatment. 50-80% response to first-line therapy."
  },
  {
    condition: "Pneumonia",
    category: "Respiratory Medicine",
    keyFacts: [
      "Community-acquired pneumonia most common",
      "Streptococcus pneumoniae leading cause",
      "CURB-65 score guides management",
      "Amoxicillin first-line for mild CAP",
      "Consider atypical organisms in younger patients"
    ],
    diagnosticCriteria: [
      "Fever and cough with purulent sputum",
      "Focal chest signs",
      "CXR showing consolidation",
      "Raised inflammatory markers",
      "CURB-65 score assessment"
    ],
    firstLineManagement: [
      "Amoxicillin 500mg TDS for mild CAP",
      "Co-amoxiclav + clarithromycin for severe",
      "Oxygen if SpO2 <94%",
      "Analgesia for pleuritic pain",
      "Safety net advice"
    ],
    redFlags: [
      "CURB-65 score ≥2",
      "Sepsis",
      "Respiratory failure",
      "Bilateral pneumonia",
      "Immunocompromised patient"
    ],
    prognosis: "Good with appropriate antibiotics. Mortality 1-5% for CAP treated in community."
  },
  {
    condition: "Acute Myocardial Infarction",
    category: "Cardiology",
    keyFacts: [
      "Time-critical emergency",
      "Primary PCI preferred over thrombolysis",
      "Dual antiplatelet therapy essential",
      "Door-to-balloon time <90 minutes",
      "Troponin confirms diagnosis"
    ],
    diagnosticCriteria: [
      "Ischemic chest pain >20 minutes",
      "ST elevation on ECG",
      "Elevated troponin",
      "Regional wall motion abnormality",
      "Response to nitrates absent"
    ],
    firstLineManagement: [
      "Aspirin 300mg + clopidogrel 600mg",
      "Atorvastatin 80mg",
      "Metoprolol if no contraindications",
      "Primary PCI within 90 minutes",
      "ACE inhibitor within 24 hours"
    ],
    redFlags: [
      "Cardiogenic shock",
      "Mechanical complications",
      "Ventricular arrhythmias",
      "Complete heart block",
      "Pericarditis"
    ],
    prognosis: "Excellent with timely reperfusion. 30-day mortality <5% with primary PCI."
  },
  {
    condition: "Diabetic Ketoacidosis",
    category: "Endocrinology",
    keyFacts: [
      "Life-threatening emergency",
      "Usually in Type 1 diabetes",
      "Infection common precipitant",
      "Fixed-rate insulin infusion treatment",
      "Fluid replacement crucial"
    ],
    diagnosticCriteria: [
      "Glucose >11 mmol/L",
      "Ketones >3 mmol/L",
      "pH <7.3 or bicarbonate <15",
      "Dehydration and ketotic breath",
      "Kussmaul breathing"
    ],
    firstLineManagement: [
      "IV normal saline 500ml/hour",
      "Fixed-rate insulin 0.1 units/kg/hour",
      "Potassium replacement",
      "Treat underlying cause",
      "HDU/ITU monitoring"
    ],
    redFlags: [
      "Severe dehydration",
      "Reduced consciousness",
      "Severe acidosis pH <7.1",
      "Hypokalaemia <3.5",
      "Cerebral edema (especially children)"
    ],
    prognosis: "Good with appropriate treatment. Mortality <1% in experienced centers."
  },
  {
    condition: "Cellulitis",
    category: "Dermatology",
    keyFacts: [
      "Bacterial skin and soft tissue infection",
      "Streptococcus pyogenes most common",
      "Lower limbs most affected",
      "Oral antibiotics usually sufficient",
      "Recurrence common in some patients"
    ],
    diagnosticCriteria: [
      "Spreading erythema",
      "Warmth and tenderness",
      "Swelling and induration",
      "Systemic symptoms if severe",
      "Raised inflammatory markers"
    ],
    firstLineManagement: [
      "Flucloxacillin 500mg QDS",
      "Clarithromycin if penicillin allergic",
      "Elevation of affected limb",
      "Analgesia and rest",
      "Mark extent of erythema"
    ],
    redFlags: [
      "Necrotizing fasciitis",
      "Systemic toxicity",
      "Diabetic foot involvement",
      "Immunocompromised patient",
      "Failure to respond to treatment"
    ],
    prognosis: "Excellent with appropriate antibiotics. Most resolve within 7-10 days."
  },
  {
    condition: "Gastroenteritis",
    category: "Gastroenterology",
    keyFacts: [
      "Usually viral and self-limiting",
      "Fluid replacement most important",
      "Antibiotics rarely indicated",
      "Campylobacter most common bacterial cause",
      "Notifiable if food poisoning suspected"
    ],
    diagnosticCriteria: [
      "Acute diarrhea ± vomiting",
      "Abdominal cramps",
      "Low-grade fever",
      "Recent travel or food exposure",
      "Stool culture if severe"
    ],
    firstLineManagement: [
      "Oral rehydration solution",
      "Continue normal diet when tolerated",
      "Loperamide for symptomatic relief",
      "Probiotics may help",
      "Hand hygiene advice"
    ],
    redFlags: [
      "Severe dehydration",
      "Blood in stool",
      "High fever",
      "Immunocompromised patient",
      "Hospital-acquired infection"
    ],
    prognosis: "Excellent. Most cases resolve within 3-5 days without treatment."
  },
  {
    condition: "Hypertension",
    category: "Cardiovascular Medicine",
    keyFacts: [
      "Silent killer - often asymptomatic",
      "ACE inhibitors first-line in most patients",
      "Target <140/90 in most patients",
      "ABCD approach to treatment",
      "Lifestyle modifications essential"
    ],
    diagnosticCriteria: [
      "Clinic BP ≥140/90 on 2+ occasions",
      "ABPM or HBPM confirmation",
      "Target organ damage assessment",
      "Cardiovascular risk calculation",
      "Secondary cause investigation if severe"
    ],
    firstLineManagement: [
      "ACE inhibitor (ramipril 2.5mg OD)",
      "Calcium channel blocker if Afro-Caribbean",
      "Lifestyle advice (diet, exercise, alcohol)",
      "Annual review",
      "Statin if 10-year CVD risk >10%"
    ],
    redFlags: [
      "Malignant hypertension >180/120",
      "End-organ damage",
      "Secondary hypertension features",
      "Hypertensive emergency",
      "Young patient <40 years"
    ],
    prognosis: "Excellent with treatment. Reduces stroke risk by 30-40%."
  }
];

export const CLINICAL_PATHWAYS = {
  chestPain: {
    title: "Chest Pain Assessment Pathway",
    steps: [
      "Initial triage: ABCDE approach",
      "12-lead ECG within 10 minutes",
      "High-sensitivity troponin at 0 and 3 hours",
      "Risk stratification (HEART/GRACE score)",
      "Appropriate disposal based on risk"
    ]
  },
  breathlessness: {
    title: "Acute Breathlessness Pathway",
    steps: [
      "Oxygen saturation and ABG if indicated",
      "Chest X-ray",
      "ECG and BNP if heart failure suspected",
      "Consider PE if risk factors present",
      "Targeted treatment based on cause"
    ]
  },
  abdominalPain: {
    title: "Acute Abdominal Pain Pathway",
    steps: [
      "History and examination",
      "Urinalysis and pregnancy test",
      "FBC, CRP, LFTs, amylase",
      "CT abdomen if indicated",
      "Surgical opinion if peritonism"
    ]
  }
};