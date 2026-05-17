// PLAB 2 OSCE Station Templates - Quality Standards for AI Generation
export const PLAB2_TEMPLATE_STATIONS = [
  {
    id: "plab2_template_001",
    title: "History Taking - Chest Pain",
    scenario: "You are a Foundation Year 2 doctor in the Emergency Department. A 58-year-old man has presented with chest pain that started 2 hours ago. Take a focused history to determine the likely cause and urgency of his presentation.",
    type: "history-taking",
    duration: 8,
    difficulty: "intermediate",
    specialty: "emergency-medicine",
    instructions: {
      candidate: "You have 8 minutes to take a focused history from this patient who presents with chest pain. You may ask questions and should demonstrate appropriate communication skills. At the end, you will be asked about your differential diagnosis and immediate management plan.",
      examiner: "Patient presents with central crushing chest pain radiating to left arm, started 2 hours ago while watching TV. Patient appears anxious and sweaty. Observe candidate's communication skills, systematic approach to history taking, and ability to identify red flags.",
      standardizedPatient: "You are a 58-year-old accountant experiencing severe central chest pain (8/10) that feels like 'someone sitting on my chest'. Pain started suddenly 2 hours ago while watching television. You feel nauseated and sweaty. You smoke 20 cigarettes daily for 25 years. Your father died of a heart attack at 62. You take no regular medications."
    },
    markingCriteria: [
      {
        category: "History Taking Skills",
        maxMarks: 8,
        criteria: [
          "Appropriate introduction and consent",
          "Pain characteristics (SOCRATES framework)",
          "Associated symptoms (nausea, sweating, dyspnea)",
          "Risk factors for coronary artery disease",
          "Past medical history",
          "Drug history and allergies",
          "Social history (smoking, alcohol)",
          "Family history of cardiac disease"
        ]
      },
      {
        category: "Communication Skills",
        maxMarks: 4,
        criteria: [
          "Professional manner and empathy",
          "Clear, jargon-free questions",
          "Active listening and summarizing",
          "Responds appropriately to patient concerns"
        ]
      },
      {
        category: "Clinical Reasoning",
        maxMarks: 8,
        criteria: [
          "Identifies acute coronary syndrome as likely diagnosis",
          "Recognizes urgency of presentation",
          "Mentions relevant differential diagnoses",
          "Appropriate immediate management plan"
        ]
      }
    ],
    keyActions: [
      "Systematic pain history using SOCRATES",
      "Assess cardiovascular risk factors",
      "Screen for red flag symptoms",
      "Demonstrate empathy and professionalism",
      "Formulate appropriate differential diagnosis"
    ],
    redFlags: [
      "Central crushing chest pain",
      "Radiation to arm/jaw",
      "Associated sweating and nausea",
      "Significant smoking history",
      "Family history of early cardiac death"
    ],
    differentialDiagnosis: [
      "ST-elevation myocardial infarction (STEMI)",
      "Non-ST elevation myocardial infarction (NSTEMI)",
      "Unstable angina",
      "Pulmonary embolism",
      "Aortic dissection",
      "Pneumothorax"
    ],
    references: [
      {
        title: "NICE CG95: Chest pain of recent onset",
        url: "https://www.nice.org.uk/guidance/cg95"
      },
      {
        title: "ESC Guidelines for acute coronary syndromes",
        url: "https://www.escardio.org/Guidelines"
      },
      {
        title: "GMC Good Medical Practice - Communication",
        url: "https://www.gmc-uk.org/ethical-guidance/ethical-guidance-for-doctors/good-medical-practice"
      }
    ],
    mnemonics: [
      "SOCRATES for pain history: Site, Onset, Character, Radiation, Associated symptoms, Timing, Exacerbating factors, Severity",
      "CARDIOVASCULAR risk factors: Diabetes, Hypertension, High cholesterol, Family history, Smoking, Age, Male gender",
      "RED FLAGS chest pain: Tearing pain (aortic dissection), Pleuritic + breathless (PE), Crushing central (MI)"
    ]
  },
  {
    id: "plab2_template_002", 
    title: "Physical Examination - Respiratory System",
    scenario: "You are an FY1 doctor on a respiratory ward. A 45-year-old woman has been admitted with increasing breathlessness over the past week. Please perform a focused respiratory examination.",
    type: "physical-examination",
    duration: 8,
    difficulty: "intermediate", 
    specialty: "respiratory",
    instructions: {
      candidate: "You have 8 minutes to perform a focused respiratory examination on this patient. Please explain what you are doing as you examine the patient. Present your findings and differential diagnosis to the examiner.",
      examiner: "Patient has signs consistent with right-sided pleural effusion. Assess candidate's examination technique, ability to elicit and interpret physical signs, and clinical reasoning skills.",
      standardizedPatient: "You are comfortable at rest but become breathless with minimal exertion. You may cough occasionally but this is not productive. You have no chest pain. Allow the candidate to examine you appropriately."
    },
    markingCriteria: [
      {
        category: "Examination Technique",
        maxMarks: 10,
        criteria: [
          "Appropriate introduction and consent",
          "Correct patient positioning (45 degrees)",
          "Systematic inspection (chest wall, breathing pattern)",
          "Palpation (chest expansion, tactile fremitus, trachea)",
          "Percussion (systematic approach, identifies dullness)",
          "Auscultation (systematically examines all areas)",
          "Examines for lymphadenopathy",
          "Checks for ankle edema",
          "Professional manner throughout",
          "Explains procedures to patient"
        ]
      },
      {
        category: "Clinical Findings",
        maxMarks: 6,
        criteria: [
          "Identifies reduced chest expansion on right",
          "Detects reduced tactile fremitus on right",
          "Finds dullness to percussion on right",
          "Notes reduced breath sounds on right",
          "Absence of added sounds",
          "May identify tracheal deviation"
        ]
      },
      {
        category: "Interpretation & Management",
        maxMarks: 4,
        criteria: [
          "Correctly identifies pleural effusion",
          "Suggests appropriate investigations (chest X-ray)",
          "Mentions need for pleural aspiration",
          "Discusses potential causes"
        ]
      }
    ],
    keyActions: [
      "Systematic respiratory examination",
      "Clear explanation of procedures",
      "Accurate identification of physical signs",
      "Appropriate interpretation of findings",
      "Professional patient interaction"
    ],
    redFlags: [
      "Severe breathlessness at rest",
      "Tracheal deviation (tension pneumothorax)",
      "Signs of respiratory distress",
      "Hemoptysis",
      "Chest pain with breathing"
    ],
    differentialDiagnosis: [
      "Pleural effusion (most likely)",
      "Pneumonia with consolidation", 
      "Pneumothorax",
      "Pulmonary edema",
      "Lung collapse/atelectasis"
    ],
    references: [
      {
        title: "NICE CG121: Lung cancer diagnosis and management",
        url: "https://www.nice.org.uk/guidance/cg121"
      },
      {
        title: "BTS Guidelines for pleural disease",
        url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/"
      }
    ],
    mnemonics: [
      "RESPIRATORY examination: Inspect, Palpate, Percuss, Auscultate (IPPA)",
      "PLEURAL EFFUSION signs: Reduced expansion, Reduced tactile fremitus, Dull percussion, Reduced breath sounds",
      "CHEST POSITIONING: 45 degrees for respiratory examination to optimize visualization"
    ]
  },
  {
    id: "plab2_template_003",
    title: "Communication Skills - Breaking Bad News",
    scenario: "You are an FY2 doctor. A 52-year-old woman attended for routine mammography screening. The results show a suspicious lesion requiring urgent referral. You need to explain these results to the patient.",
    type: "communication-skills",
    duration: 8,
    difficulty: "advanced",
    specialty: "oncology",
    instructions: {
      candidate: "You need to explain the mammography results to this patient. The report shows 'irregular spiculated mass in upper outer quadrant of right breast, highly suspicious for malignancy - urgent 2-week referral required'. Use appropriate communication skills to break this news sensitively.",
      examiner: "Assess the candidate's ability to break potentially bad news using appropriate communication techniques. Patient should become understandably distressed. Observe empathy, information giving, and support offered.",
      standardizedPatient: "You attended routine breast screening and expected normal results. You have no symptoms and feel well. When told about the abnormal result, become increasingly worried and ask direct questions about cancer. You live alone and have no family history of breast cancer."
    },
    markingCriteria: [
      {
        category: "Communication Structure",
        maxMarks: 6,
        criteria: [
          "Uses SPIKES or similar framework",
          "Assesses patient's understanding first",
          "Gives warning shot before bad news",
          "Delivers information clearly and sensitively", 
          "Checks understanding regularly",
          "Responds to emotions appropriately"
        ]
      },
      {
        category: "Information Giving",
        maxMarks: 6,
        criteria: [
          "Explains mammography findings clearly",
          "Discusses need for urgent referral",
          "Avoids premature false reassurance",
          "Uses appropriate language (not medical jargon)",
          "Addresses patient's specific concerns",
          "Discusses next steps and timeline"
        ]
      },
      {
        category: "Empathy & Support",
        maxMarks: 8,
        criteria: [
          "Demonstrates genuine empathy",
          "Acknowledges patient's emotional response",
          "Provides appropriate reassurance about support",
          "Offers practical help (appointments, transport)",
          "Discusses support systems available",
          "Maintains professional boundaries",
          "Arranges appropriate follow-up",
          "Provides written information if needed"
        ]
      }
    ],
    keyActions: [
      "Create appropriate setting for discussion",
      "Use structured approach to breaking news",
      "Respond empathetically to distress",
      "Provide clear information about next steps",
      "Arrange appropriate support and follow-up"
    ],
    redFlags: [
      "Giving false reassurance too early",
      "Using medical jargon without explanation",
      "Dismissing patient's emotional response",
      "Failing to arrange follow-up",
      "Not addressing practical concerns"
    ],
    references: [
      {
        title: "NICE NG101: Early and locally advanced breast cancer",
        url: "https://www.nice.org.uk/guidance/ng101"
      },
      {
        title: "GMC guidance on breaking bad news",
        url: "https://www.gmc-uk.org/ethical-guidance/ethical-guidance-for-doctors/good-medical-practice"
      },
      {
        title: "NHS Breast Screening Programme",
        url: "https://www.gov.uk/guidance/breast-screening-programme-overview"
      }
    ],
    mnemonics: [
      "SPIKES for breaking bad news: Setting, Perception, Invitation, Knowledge, Emotions, Strategy",
      "BAD NEWS delivery: Be prepared, Allow time, Deliver sensitively",
      "BREAST CANCER referral: 2-week rule for suspicious mammography findings"
    ]
  }
];

// PLAB 2 Station Types for comprehensive coverage
export const PLAB2_STATION_TYPES = [
  'history-taking',
  'physical-examination',
  'communication-skills', 
  'practical-procedures',
  'emergency-management',
  'prescribing-safety',
  'data-interpretation',
  'ethics-consent'
];

export const PLAB2_SPECIALTIES = [
  'emergency-medicine',
  'general-medicine',
  'cardiology',
  'respiratory',
  'gastroenterology',
  'neurology',
  'psychiatry',
  'obstetrics-gynaecology',
  'paediatrics',
  'surgery',
  'oncology',
  'rheumatology'
];

export const PLAB2_DIFFICULTIES = ['foundation', 'intermediate', 'advanced'];