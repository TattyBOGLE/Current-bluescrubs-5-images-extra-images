// PLAB 2 OSCE Stations - Official Format
// 16-20 clinical stations, 8-10 minutes each
// Covers history taking, examinations, explanations, ethics, acute care

export interface OSCEStation {
  id: string;
  stationNumber: number;
  title: string;
  type: 'history' | 'examination' | 'explanation' | 'ethics' | 'acute-care' | 'practical-skills';
  category: string;
  duration: number; // minutes
  scenario: string;
  instructions: {
    candidate: string;
    examiner: string;
    standardizedPatient?: string;
  };
  markingCriteria: {
    category: string;
    maxMarks: number;
    criteria: string[];
  }[];
  commonMistakes: string[];
  keyLearningPoints: string[];
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  examFrequency: 'very-high' | 'high' | 'medium' | 'low';
}

export const PLAB2_OSCE_STATIONS: OSCEStation[] = [
  {
    id: 'osce_001',
    stationNumber: 1,
    title: 'History Taking - Chest Pain',
    type: 'history',
    category: 'Cardiology',
    duration: 8,
    scenario: "You are an FY2 doctor in the Emergency Department. A 55-year-old man presents with chest pain that started 2 hours ago. Take a focused history to determine the likely diagnosis and next steps.",
    instructions: {
      candidate: "Take a focused history from this patient presenting with chest pain. You have 6 minutes for history taking and 2 minutes to present your findings to the examiner.",
      examiner: "Observe the candidate's history-taking skills, communication, and clinical reasoning. Award marks based on the marking criteria.",
      standardizedPatient: "You are a 55-year-old businessman experiencing crushing central chest pain radiating to your left arm. You are anxious and sweaty. The pain started suddenly while climbing stairs at work."
    },
    markingCriteria: [
      {
        category: "Communication Skills",
        maxMarks: 4,
        criteria: [
          "Introduces self appropriately",
          "Explains purpose of consultation",
          "Active listening and empathy",
          "Clear and appropriate language"
        ]
      },
      {
        category: "History Taking",
        maxMarks: 8,
        criteria: [
          "Character of pain (crushing/tight)",
          "Radiation to arm/jaw/neck",
          "Associated symptoms (SOB, nausea, sweating)",
          "Risk factors (smoking, diabetes, family history)",
          "Onset and progression",
          "Exacerbating/relieving factors",
          "Past medical history",
          "Current medications"
        ]
      },
      {
        category: "Clinical Reasoning",
        maxMarks: 4,
        criteria: [
          "Recognizes acute coronary syndrome",
          "Identifies high-risk features",
          "Appropriate differential diagnosis",
          "Plans immediate management"
        ]
      }
    ],
    commonMistakes: [
      "Fails to explore radiation of pain",
      "Doesn't ask about cardiovascular risk factors",
      "Misses associated symptoms",
      "Poor time management"
    ],
    keyLearningPoints: [
      "Chest pain history must be systematic",
      "Always assess cardiovascular risk factors",
      "Time-critical symptoms need urgent assessment",
      "Communication skills are as important as clinical knowledge"
    ],
    difficulty: 'intermediate',
    examFrequency: 'very-high'
  },
  {
    id: 'osce_002',
    stationNumber: 2,
    title: 'Cardiovascular Examination',
    type: 'examination',
    category: 'Cardiology',
    duration: 8,
    scenario: "Examine this patient's cardiovascular system. The patient has been referred by their GP for investigation of a heart murmur.",
    instructions: {
      candidate: "Perform a focused cardiovascular examination on this patient. Explain your findings and likely diagnosis. You have 6 minutes for examination and 2 minutes for discussion.",
      examiner: "The patient has aortic stenosis with a grade 3/6 ejection systolic murmur. Assess the candidate's examination technique and interpretation of findings."
    },
    markingCriteria: [
      {
        category: "Examination Technique",
        maxMarks: 8,
        criteria: [
          "Hand hygiene and introduces self",
          "Positions patient correctly (45 degrees)",
          "Systematic approach to inspection",
          "Correct palpation technique",
          "Appropriate auscultation (all areas, maneuvers)",
          "Examines peripheral pulses",
          "Checks for peripheral edema",
          "Professional demeanor throughout"
        ]
      },
      {
        category: "Clinical Findings",
        maxMarks: 6,
        criteria: [
          "Identifies ejection systolic murmur",
          "Localizes murmur correctly",
          "Describes radiation to carotids",
          "Assesses pulse character (slow-rising)",
          "Checks for signs of heart failure",
          "Recognizes severity indicators"
        ]
      },
      {
        category: "Interpretation",
        maxMarks: 2,
        criteria: [
          "Correctly diagnoses aortic stenosis",
          "Suggests appropriate investigations"
        ]
      }
    ],
    commonMistakes: [
      "Forgets hand hygiene",
      "Inadequate positioning of patient",
      "Misses radiation of murmur",
      "Doesn't perform dynamic maneuvers"
    ],
    keyLearningPoints: [
      "Systematic approach prevents missing findings",
      "Dynamic maneuvers help characterize murmurs",
      "Always correlate examination with history",
      "Professional manner maintains patient confidence"
    ],
    difficulty: 'intermediate',
    examFrequency: 'very-high'
  },
  {
    id: 'osce_003',
    stationNumber: 3,
    title: 'Explaining Diagnosis - Type 2 Diabetes',
    type: 'explanation',
    category: 'Endocrinology',
    duration: 8,
    scenario: "Mrs. Smith is a 52-year-old teacher who has just been diagnosed with Type 2 diabetes. Explain the diagnosis, treatment options, and lifestyle modifications.",
    instructions: {
      candidate: "Explain the diagnosis of Type 2 diabetes to this patient. Discuss treatment options and lifestyle modifications. Address any concerns the patient may have.",
      examiner: "Assess the candidate's ability to explain a complex diagnosis in simple terms, provide appropriate information, and address patient concerns.",
      standardizedPatient: "You are worried about diabetes because your father had complications. You want to know if you'll need insulin and what this means for your job as a teacher."
    },
    markingCriteria: [
      {
        category: "Communication Skills",
        maxMarks: 4,
        criteria: [
          "Uses clear, jargon-free language",
          "Checks patient understanding",
          "Shows empathy and reassurance",
          "Allows patient to ask questions"
        ]
      },
      {
        category: "Information Giving",
        maxMarks: 8,
        criteria: [
          "Explains what diabetes is",
          "Discusses blood sugar control",
          "Explains lifestyle modifications (diet, exercise)",
          "Outlines medication options",
          "Mentions monitoring and follow-up",
          "Discusses potential complications",
          "Provides realistic prognosis",
          "Offers written information/support"
        ]
      },
      {
        category: "Addressing Concerns",
        maxMarks: 4,
        criteria: [
          "Acknowledges family history concerns",
          "Explains modern diabetes management",
          "Discusses work-related implications",
          "Provides reassurance about prognosis"
        ]
      }
    ],
    commonMistakes: [
      "Uses too much medical jargon",
      "Doesn't check patient understanding",
      "Focuses on complications too early",
      "Fails to address specific concerns"
    ],
    keyLearningPoints: [
      "Tailor explanation to patient's level",
      "Address emotions as well as facts",
      "Provide hope alongside realistic information",
      "Use analogies to explain complex concepts"
    ],
    difficulty: 'intermediate',
    examFrequency: 'very-high'
  },
  {
    id: 'osce_004',
    stationNumber: 4,
    title: 'Ethical Scenario - Confidentiality',
    type: 'ethics',
    category: 'Medical Ethics',
    duration: 8,
    scenario: "A 16-year-old girl requests contraception but specifically asks you not to tell her parents. Discuss the ethical principles involved and your approach.",
    instructions: {
      candidate: "Discuss this ethical scenario with the examiner. Consider confidentiality, consent, and safeguarding issues. Outline your approach to this situation.",
      examiner: "Assess the candidate's understanding of confidentiality laws, consent issues in minors, and safeguarding principles. Look for balanced ethical reasoning."
    },
    markingCriteria: [
      {
        category: "Ethical Knowledge",
        maxMarks: 6,
        criteria: [
          "Understands Gillick competence",
          "Knows confidentiality laws for minors",
          "Recognizes Fraser guidelines",
          "Understands safeguarding principles",
          "Considers patient autonomy",
          "Balances competing interests"
        ]
      },
      {
        category: "Clinical Approach",
        maxMarks: 6,
        criteria: [
          "Assesses patient's competence",
          "Explores patient's reasons",
          "Considers safeguarding risks",
          "Discusses benefits of parental involvement",
          "Outlines documentation requirements",
          "Plans appropriate follow-up"
        ]
      },
      {
        category: "Professional Standards",
        maxMarks: 4,
        criteria: [
          "References GMC guidance",
          "Considers legal obligations",
          "Demonstrates professional judgment",
          "Shows respect for patient rights"
        ]
      }
    ],
    commonMistakes: [
      "Assumes parental consent always required",
      "Doesn't consider Gillick competence",
      "Fails to assess safeguarding risks",
      "Doesn't explain confidentiality limits"
    ],
    keyLearningPoints: [
      "Fraser guidelines protect young people's rights",
      "Competence is decision-specific",
      "Safeguarding overrides confidentiality",
      "Documentation is crucial in sensitive cases"
    ],
    difficulty: 'advanced',
    examFrequency: 'high'
  },
  {
    id: 'osce_005',
    stationNumber: 5,
    title: 'Acute Care - Anaphylaxis Management',
    type: 'acute-care',
    category: 'Emergency Medicine',
    duration: 8,
    scenario: "A 25-year-old patient develops facial swelling, difficulty breathing, and widespread urticaria 10 minutes after eating nuts. Demonstrate your immediate management.",
    instructions: {
      candidate: "This patient is having an anaphylactic reaction. Demonstrate your immediate management using the mannequin and available equipment. Talk through your actions.",
      examiner: "Assess the candidate's ability to recognize anaphylaxis and implement appropriate emergency management. Time-critical actions should be prioritized."
    },
    markingCriteria: [
      {
        category: "Recognition and Assessment",
        maxMarks: 4,
        criteria: [
          "Recognizes anaphylaxis",
          "Assesses ABC",
          "Identifies trigger (nuts)",
          "Calls for help appropriately"
        ]
      },
      {
        category: "Immediate Management",
        maxMarks: 8,
        criteria: [
          "Removes trigger/stops exposure",
          "Gives IM adrenaline 0.5mg",
          "Correct injection site (anterolateral thigh)",
          "High-flow oxygen",
          "IV access and fluids",
          "Monitors vital signs",
          "Considers second adrenaline dose",
          "Gives antihistamines and steroids"
        ]
      },
      {
        category: "Communication and Safety",
        maxMarks: 4,
        criteria: [
          "Reassures patient",
          "Explains actions clearly",
          "Ensures continuous monitoring",
          "Plans appropriate disposal"
        ]
      }
    ],
    commonMistakes: [
      "Delays adrenaline administration",
      "Wrong adrenaline dose or route",
      "Doesn't call for help early",
      "Forgets to remove trigger"
    ],
    keyLearningPoints: [
      "Adrenaline is first-line treatment",
      "IM route is preferred in anaphylaxis",
      "Early recognition saves lives",
      "Biphasic reactions can occur"
    ],
    difficulty: 'advanced',
    examFrequency: 'very-high'
  },
  {
    id: 'osce_006',
    stationNumber: 6,
    title: 'History Taking - Headache',
    type: 'history',
    category: 'Neurology',
    duration: 8,
    scenario: "A 35-year-old woman presents with a 3-week history of worsening headaches. Take a focused history to determine the likely cause and urgency.",
    instructions: {
      candidate: "Take a focused history from this patient with headaches. Consider red flag features and determine the appropriate urgency of referral.",
      examiner: "The patient has features suggestive of raised intracranial pressure. Assess whether the candidate identifies red flag symptoms.",
      standardizedPatient: "Your headaches are getting worse, especially in the mornings. You've been vomiting and your vision seems blurry. You're worried because they're different from your usual headaches."
    },
    markingCriteria: [
      {
        category: "History Taking",
        maxMarks: 8,
        criteria: [
          "Character and location of headache",
          "Temporal pattern and progression",
          "Associated symptoms (vomiting, visual changes)",
          "Precipitating factors",
          "Previous headache history",
          "Neurological symptoms",
          "Medication history",
          "Red flag features"
        ]
      },
      {
        category: "Red Flag Recognition",
        maxMarks: 6,
        criteria: [
          "Identifies worsening pattern",
          "Notes morning headaches",
          "Recognizes vomiting",
          "Notes visual symptoms",
          "Assesses change from usual pattern",
          "Considers raised ICP"
        ]
      },
      {
        category: "Clinical Reasoning",
        maxMarks: 2,
        criteria: [
          "Recognizes urgent referral needed",
          "Appropriate differential diagnosis"
        ]
      }
    ],
    commonMistakes: [
      "Doesn't ask about red flag features",
      "Misses change in headache pattern",
      "Fails to recognize urgency",
      "Doesn't explore associated symptoms"
    ],
    keyLearningPoints: [
      "New or changing headaches need investigation",
      "Morning headaches suggest raised ICP",
      "Vomiting with headache is concerning",
      "Pattern change is more important than severity"
    ],
    difficulty: 'intermediate',
    examFrequency: 'high'
  },
  {
    id: 'osce_007',
    stationNumber: 7,
    title: 'Respiratory Examination',
    type: 'examination',
    category: 'Respiratory Medicine',
    duration: 8,
    scenario: "Examine this patient's respiratory system. They have been referred with a 6-week history of cough and weight loss.",
    instructions: {
      candidate: "Perform a focused respiratory examination. Present your findings and suggest the most likely diagnosis and next steps.",
      examiner: "The patient has reduced expansion and dullness to percussion at the right base with reduced breath sounds. Consider pleural effusion."
    },
    markingCriteria: [
      {
        category: "Examination Technique",
        maxMarks: 8,
        criteria: [
          "Hand hygiene and introduction",
          "Inspection (chest shape, breathing pattern)",
          "Palpation (expansion, vocal fremitus)",
          "Percussion (systematic approach)",
          "Auscultation (all areas)",
          "Additional signs (lymph nodes, clubbing)",
          "Professional throughout",
          "Positions patient appropriately"
        ]
      },
      {
        category: "Clinical Findings",
        maxMarks: 6,
        criteria: [
          "Identifies reduced expansion",
          "Notes dullness to percussion",
          "Recognizes reduced breath sounds",
          "Assesses for pleural rub",
          "Checks for tracheal deviation",
          "Examines for associated signs"
        ]
      },
      {
        category: "Interpretation",
        maxMarks: 2,
        criteria: [
          "Suggests pleural effusion",
          "Plans appropriate investigations"
        ]
      }
    ],
    commonMistakes: [
      "Inadequate inspection",
      "Doesn't compare both sides",
      "Poor percussion technique",
      "Misses reduced expansion"
    ],
    keyLearningPoints: [
      "Always compare left and right",
      "Inspection provides vital clues",
      "Percussion is key for pleural effusion",
      "Weight loss with respiratory symptoms needs investigation"
    ],
    difficulty: 'intermediate',
    examFrequency: 'high'
  },
  {
    id: 'osce_008',
    stationNumber: 8,
    title: 'Breaking Bad News - Cancer Diagnosis',
    type: 'explanation',
    category: 'Oncology',
    duration: 10,
    scenario: "Mr. Jones, a 60-year-old smoker, has had investigations for weight loss and cough. The CT scan shows lung cancer. Break the news of this diagnosis.",
    instructions: {
      candidate: "Break the news of a lung cancer diagnosis to this patient. Use appropriate communication skills and provide initial support and information about next steps.",
      examiner: "Assess the candidate's ability to break bad news sensitively while providing appropriate information and support.",
      standardizedPatient: "You're expecting test results. You've been worried but hoping it's just an infection. You become very upset when told about cancer."
    },
    markingCriteria: [
      {
        category: "Setting and Preparation",
        maxMarks: 3,
        criteria: [
          "Ensures appropriate setting",
          "Checks patient's understanding",
          "Warns about serious news"
        ]
      },
      {
        category: "Breaking the News",
        maxMarks: 6,
        criteria: [
          "Uses clear, direct language",
          "Gives information in chunks",
          "Allows silence for processing",
          "Responds to emotional reactions",
          "Provides support and empathy",
          "Checks understanding"
        ]
      },
      {
        category: "Information and Support",
        maxMarks: 5,
        criteria: [
          "Explains next steps clearly",
          "Discusses treatment options",
          "Offers written information",
          "Arranges appropriate follow-up",
          "Provides contact information"
        ]
      },
      {
        category: "Communication Skills",
        maxMarks: 2,
        criteria: [
          "Shows empathy throughout",
          "Uses appropriate body language"
        ]
      }
    ],
    commonMistakes: [
      "Gives too much information at once",
      "Doesn't allow time for processing",
      "Avoids using the word 'cancer'",
      "Doesn't respond to emotions"
    ],
    keyLearningPoints: [
      "Breaking bad news is a skill that can be learned",
      "Patients need time to process information",
      "Emotional support is as important as information",
      "Follow-up arrangements are essential"
    ],
    difficulty: 'advanced',
    examFrequency: 'high'
  }
];

export const OSCE_STATION_TYPES = {
  'history': 'History Taking',
  'examination': 'Physical Examination',
  'explanation': 'Information Giving & Explanation',
  'ethics': 'Ethics & Professional Issues',
  'acute-care': 'Acute Care & Emergency Management',
  'practical-skills': 'Practical Procedures'
};

export const OSCE_CATEGORIES = [
  'Cardiology',
  'Respiratory Medicine',
  'Gastroenterology',
  'Neurology',
  'Endocrinology',
  'Psychiatry',
  'Obstetrics & Gynaecology',
  'Paediatrics',
  'Emergency Medicine',
  'Medical Ethics',
  'Dermatology',
  'Rheumatology',
  'Ophthalmology',
  'ENT',
  'Orthopaedics'
];

export const MARKING_GUIDELINES = {
  excellent: { range: '16-20', description: 'Exceptional performance, well above standard expected' },
  good: { range: '13-15', description: 'Good performance, above standard expected' },
  borderline: { range: '10-12', description: 'Borderline performance, just meets standard' },
  poor: { range: '0-9', description: 'Poor performance, below standard expected' }
};

export const OSCE_STATION_STATS = {
  total: PLAB2_OSCE_STATIONS.length,
  byType: {
    'history': PLAB2_OSCE_STATIONS.filter(s => s.type === 'history').length,
    'examination': PLAB2_OSCE_STATIONS.filter(s => s.type === 'examination').length,
    'explanation': PLAB2_OSCE_STATIONS.filter(s => s.type === 'explanation').length,
    'ethics': PLAB2_OSCE_STATIONS.filter(s => s.type === 'ethics').length,
    'acute-care': PLAB2_OSCE_STATIONS.filter(s => s.type === 'acute-care').length,
    'practical-skills': PLAB2_OSCE_STATIONS.filter(s => s.type === 'practical-skills').length
  },
  byDifficulty: {
    'foundation': PLAB2_OSCE_STATIONS.filter(s => s.difficulty === 'foundation').length,
    'intermediate': PLAB2_OSCE_STATIONS.filter(s => s.difficulty === 'intermediate').length,
    'advanced': PLAB2_OSCE_STATIONS.filter(s => s.difficulty === 'advanced').length
  },
  averageDuration: PLAB2_OSCE_STATIONS.reduce((sum, station) => sum + station.duration, 0) / PLAB2_OSCE_STATIONS.length
};