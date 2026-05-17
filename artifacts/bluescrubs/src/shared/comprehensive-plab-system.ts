// Comprehensive PLAB Learning System
// Integrates PLAB 1 knowledge testing with PLAB 2 clinical skills
// Based on GMC Blueprint and UK clinical guidelines

export interface PLABLearningPath {
  id: string;
  title: string;
  examType: 'plab1' | 'plab2' | 'integrated';
  totalWeeks: number;
  phases: PLABPhase[];
  prerequisites: string[];
}

export interface PLABPhase {
  week: number;
  title: string;
  objectives: string[];
  activities: PLABActivity[];
  assessments: PLABAssessment[];
  ukGuidelinesFocus: string[];
}

export interface PLABActivity {
  type: 'knowledge-review' | 'osce-practice' | 'clinical-reasoning' | 'guideline-study' | 'integrated-case';
  title: string;
  duration: number; // minutes
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  resources: string[];
}

export interface PLABAssessment {
  type: 'mock-plab1' | 'osce-station' | 'integrated-case';
  title: string;
  questions: number;
  timeLimit: number; // minutes
  passingScore: number;
}

// Comprehensive PLAB 1 + PLAB 2 Integration
export const COMPREHENSIVE_PLAB_PATHS: PLABLearningPath[] = [
  {
    id: 'plab-complete-12-week',
    title: 'Complete PLAB 1 & 2 Preparation (12 Weeks)',
    examType: 'integrated',
    totalWeeks: 12,
    prerequisites: [
      'Primary medical qualification recognized by GMC',
      'IELTS 7.0 overall (minimum 7.0 in speaking)',
      'Basic understanding of UK healthcare system'
    ],
    phases: [
      {
        week: 1,
        title: 'Foundation Knowledge & UK Context',
        objectives: [
          'Understand GMC Blueprint structure',
          'Learn UK clinical terminology',
          'Master NICE guideline format',
          'Establish baseline knowledge'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'UK Healthcare System Overview',
            duration: 180,
            difficulty: 'foundation',
            resources: [
              'NHS Constitution',
              'GMC Good Medical Practice',
              'NICE Guidelines Introduction'
            ]
          },
          {
            type: 'guideline-study',
            title: 'NICE CKS Essential Topics',
            duration: 240,
            difficulty: 'foundation',
            resources: [
              'CKS Hypertension',
              'CKS Diabetes Management',
              'CKS Asthma',
              'CKS Depression'
            ]
          }
        ],
        assessments: [
          {
            type: 'mock-plab1',
            title: 'Baseline Assessment',
            questions: 50,
            timeLimit: 120,
            passingScore: 70
          }
        ],
        ukGuidelinesFocus: [
          'NICE CKS core conditions',
          'NHS England pathways',
          'GMC ethical framework'
        ]
      },
      {
        week: 2,
        title: 'Cardiovascular & Respiratory Systems',
        objectives: [
          'Master cardiovascular emergencies',
          'Understand respiratory pathophysiology',
          'Apply UK treatment protocols',
          'Practice clinical reasoning'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'Acute Coronary Syndromes',
            duration: 180,
            difficulty: 'intermediate',
            resources: [
              'NICE CG167 Acute Coronary Syndromes',
              'ESC Guidelines ACS',
              'Resuscitation Council Guidelines'
            ]
          },
          {
            type: 'osce-practice',
            title: 'Cardiovascular Examination',
            duration: 120,
            difficulty: 'intermediate',
            resources: [
              'Standard CVS examination sequence',
              'Murmur recognition audio',
              'ECG interpretation guide'
            ]
          },
          {
            type: 'clinical-reasoning',
            title: 'Chest Pain Decision Tree',
            duration: 90,
            difficulty: 'intermediate',
            resources: [
              'NICE CG95 Chest Pain',
              'Troponin interpretation',
              'Risk stratification tools'
            ]
          }
        ],
        assessments: [
          {
            type: 'mock-plab1',
            title: 'Cardio-Respiratory Focus Test',
            questions: 40,
            timeLimit: 96,
            passingScore: 75
          },
          {
            type: 'osce-station',
            title: 'CVS Examination Station',
            questions: 1,
            timeLimit: 8,
            passingScore: 70
          }
        ],
        ukGuidelinesFocus: [
          'NICE Cardiovascular Guidelines',
          'BTS Respiratory Guidelines',
          'Resuscitation Council Protocols'
        ]
      },
      {
        week: 3,
        title: 'Gastrointestinal & Endocrine Systems',
        objectives: [
          'Understand GI emergencies',
          'Master diabetes management',
          'Apply thyroid disorder protocols',
          'Practice history taking skills'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'Diabetes Management in UK',
            duration: 200,
            difficulty: 'intermediate',
            resources: [
              'NICE NG28 Type 2 Diabetes',
              'NICE NG17 Type 1 Diabetes',
              'Diabetes UK Guidelines',
              'HbA1c targets and monitoring'
            ]
          },
          {
            type: 'osce-practice',
            title: 'Abdominal Examination',
            duration: 120,
            difficulty: 'intermediate',
            resources: [
              'Systematic abdominal examination',
              'Hepatomegaly assessment',
              'Bowel sound interpretation'
            ]
          },
          {
            type: 'clinical-reasoning',
            title: 'Thyroid Function Interpretation',
            duration: 90,
            difficulty: 'advanced',
            resources: [
              'BTA Guidelines',
              'Thyroid function test algorithms',
              'Drug interactions'
            ]
          }
        ],
        assessments: [
          {
            type: 'integrated-case',
            title: 'Diabetes Complications Case',
            questions: 15,
            timeLimit: 45,
            passingScore: 80
          }
        ],
        ukGuidelinesFocus: [
          'NICE Diabetes Guidelines',
          'British Thyroid Association',
          'BSG Guidelines'
        ]
      },
      {
        week: 4,
        title: 'Neurology & Psychiatry',
        objectives: [
          'Recognize neurological emergencies',
          'Apply mental health legislation',
          'Practice communication skills',
          'Understand capacity assessment'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'Stroke Management Pathway',
            duration: 180,
            difficulty: 'advanced',
            resources: [
              'NICE CG68 Stroke',
              'RCP Stroke Guidelines',
              'Thrombolysis protocols',
              'FAST assessment'
            ]
          },
          {
            type: 'osce-practice',
            title: 'Mental State Examination',
            duration: 150,
            difficulty: 'advanced',
            resources: [
              'MSE components',
              'Risk assessment tools',
              'Communication techniques'
            ]
          },
          {
            type: 'clinical-reasoning',
            title: 'Capacity Assessment',
            duration: 120,
            difficulty: 'advanced',
            resources: [
              'Mental Capacity Act 2005',
              'DoLS procedures',
              'Best interests decisions'
            ]
          }
        ],
        assessments: [
          {
            type: 'osce-station',
            title: 'Breaking Bad News',
            questions: 1,
            timeLimit: 10,
            passingScore: 75
          }
        ],
        ukGuidelinesFocus: [
          'NICE Mental Health Guidelines',
          'RCPsych Standards',
          'Mental Health Act 1983'
        ]
      },
      {
        week: 5,
        title: 'Women\'s Health & Pediatrics',
        objectives: [
          'Master obstetric emergencies',
          'Understand child safeguarding',
          'Apply pediatric protocols',
          'Practice sensitive communication'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'Antenatal Care Pathway',
            duration: 160,
            difficulty: 'intermediate',
            resources: [
              'NICE CG62 Antenatal Care',
              'RCOG Guidelines',
              'Fetal monitoring interpretation'
            ]
          },
          {
            type: 'osce-practice',
            title: 'Pediatric Examination',
            duration: 120,
            difficulty: 'intermediate',
            resources: [
              'Age-appropriate examination',
              'Growth chart interpretation',
              'Developmental milestones'
            ]
          },
          {
            type: 'clinical-reasoning',
            title: 'Safeguarding Children',
            duration: 90,
            difficulty: 'advanced',
            resources: [
              'Working Together 2018',
              'RCPCH Guidelines',
              'Documentation requirements'
            ]
          }
        ],
        assessments: [
          {
            type: 'integrated-case',
            title: 'Pregnancy Complications',
            questions: 20,
            timeLimit: 60,
            passingScore: 75
          }
        ],
        ukGuidelinesFocus: [
          'NICE Pregnancy Guidelines',
          'RCOG Standards',
          'RCPCH Guidelines'
        ]
      },
      {
        week: 6,
        title: 'Emergency Medicine & Acute Care',
        objectives: [
          'Master ABCDE approach',
          'Apply sepsis protocols',
          'Understand triage principles',
          'Practice emergency procedures'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'Sepsis Recognition & Management',
            duration: 180,
            difficulty: 'advanced',
            resources: [
              'NICE NG51 Sepsis',
              'Sepsis Trust Guidelines',
              'qSOFA scoring',
              'Antimicrobial protocols'
            ]
          },
          {
            type: 'osce-practice',
            title: 'Basic Life Support',
            duration: 90,
            difficulty: 'foundation',
            resources: [
              'Resuscitation Council Guidelines',
              'AED use protocols',
              'Team leadership skills'
            ]
          },
          {
            type: 'clinical-reasoning',
            title: 'Shock Recognition',
            duration: 120,
            difficulty: 'advanced',
            resources: [
              'Shock classification',
              'Fluid resuscitation',
              'Vasoactive drugs'
            ]
          }
        ],
        assessments: [
          {
            type: 'osce-station',
            title: 'Medical Emergency Station',
            questions: 1,
            timeLimit: 10,
            passingScore: 80
          }
        ],
        ukGuidelinesFocus: [
          'NICE Emergency Guidelines',
          'Resuscitation Council UK',
          'RCEM Standards'
        ]
      },
      {
        week: 7,
        title: 'Pharmacology & Therapeutics',
        objectives: [
          'Master drug interactions',
          'Understand prescribing safety',
          'Apply clinical pharmacology',
          'Practice drug calculations'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'Safe Prescribing Principles',
            duration: 200,
            difficulty: 'intermediate',
            resources: [
              'BNF Guidance',
              'NICE Prescribing Guidelines',
              'Drug safety alerts',
              'Controlled drugs regulations'
            ]
          },
          {
            type: 'clinical-reasoning',
            title: 'Antibiotic Selection',
            duration: 120,
            difficulty: 'advanced',
            resources: [
              'Local antimicrobial guidelines',
              'Resistance patterns',
              'Stewardship principles'
            ]
          }
        ],
        assessments: [
          {
            type: 'mock-plab1',
            title: 'Pharmacology Focus Test',
            questions: 35,
            timeLimit: 84,
            passingScore: 80
          }
        ],
        ukGuidelinesFocus: [
          'BNF Guidelines',
          'NICE Prescribing',
          'MHRA Safety Alerts'
        ]
      },
      {
        week: 8,
        title: 'Ethics & Communication',
        objectives: [
          'Apply GMC ethical principles',
          'Master consent processes',
          'Practice difficult conversations',
          'Understand confidentiality'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'GMC Ethical Framework',
            duration: 150,
            difficulty: 'intermediate',
            resources: [
              'Good Medical Practice',
              'Consent guidance',
              '0-18 years guidance',
              'Confidentiality guidance'
            ]
          },
          {
            type: 'osce-practice',
            title: 'Consent Discussion',
            duration: 120,
            difficulty: 'advanced',
            resources: [
              'Informed consent process',
              'Risk communication',
              'Capacity assessment'
            ]
          }
        ],
        assessments: [
          {
            type: 'osce-station',
            title: 'Ethical Dilemma',
            questions: 1,
            timeLimit: 8,
            passingScore: 75
          }
        ],
        ukGuidelinesFocus: [
          'GMC Guidance',
          'Medical Defence Union',
          'NHS Constitution'
        ]
      },
      {
        week: 9,
        title: 'Integrated Clinical Cases',
        objectives: [
          'Apply multi-system thinking',
          'Practice time management',
          'Integrate knowledge and skills',
          'Prepare for exam conditions'
        ],
        activities: [
          {
            type: 'integrated-case',
            title: 'Complex Medical Cases',
            duration: 240,
            difficulty: 'advanced',
            resources: [
              'Multi-system pathology',
              'Comorbidity management',
              'Polypharmacy issues'
            ]
          },
          {
            type: 'osce-practice',
            title: 'Full OSCE Circuit',
            duration: 180,
            difficulty: 'advanced',
            resources: [
              '18 station practice',
              'Timed conditions',
              'Performance feedback'
            ]
          }
        ],
        assessments: [
          {
            type: 'mock-plab1',
            title: 'Full Practice Exam 1',
            questions: 180,
            timeLimit: 180,
            passingScore: 75
          }
        ],
        ukGuidelinesFocus: [
          'Integrated care pathways',
          'Multi-disciplinary team working',
          'Quality improvement'
        ]
      },
      {
        week: 10,
        title: 'Exam Technique & Strategy',
        objectives: [
          'Master time management',
          'Develop exam strategies',
          'Practice under pressure',
          'Identify weak areas'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'Exam Strategy Workshop',
            duration: 120,
            difficulty: 'foundation',
            resources: [
              'Question analysis techniques',
              'Time allocation strategies',
              'Stress management'
            ]
          },
          {
            type: 'osce-practice',
            title: 'High-Pressure Scenarios',
            duration: 150,
            difficulty: 'advanced',
            resources: [
              'Difficult patient interactions',
              'Emergency scenarios',
              'Technical procedures'
            ]
          }
        ],
        assessments: [
          {
            type: 'mock-plab1',
            title: 'Full Practice Exam 2',
            questions: 180,
            timeLimit: 180,
            passingScore: 78
          },
          {
            type: 'osce-station',
            title: 'Complete OSCE Assessment',
            questions: 18,
            timeLimit: 144,
            passingScore: 75
          }
        ],
        ukGuidelinesFocus: [
          'Performance optimization',
          'Continuous improvement',
          'Reflective practice'
        ]
      },
      {
        week: 11,
        title: 'Final Preparation & Revision',
        objectives: [
          'Consolidate weak areas',
          'Practice final scenarios',
          'Build confidence',
          'Fine-tune performance'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'Targeted Revision',
            duration: 300,
            difficulty: 'advanced',
            resources: [
              'Personalized weak area focus',
              'High-yield topics',
              'Last-minute updates'
            ]
          }
        ],
        assessments: [
          {
            type: 'mock-plab1',
            title: 'Final Mock Exam',
            questions: 180,
            timeLimit: 180,
            passingScore: 80
          }
        ],
        ukGuidelinesFocus: [
          'Latest guideline updates',
          'Current best practice',
          'Quality indicators'
        ]
      },
      {
        week: 12,
        title: 'Exam Week & Beyond',
        objectives: [
          'Execute exam strategy',
          'Manage exam stress',
          'Plan post-exam steps',
          'Prepare for NHS career'
        ],
        activities: [
          {
            type: 'knowledge-review',
            title: 'NHS Career Preparation',
            duration: 120,
            difficulty: 'foundation',
            resources: [
              'Foundation Programme application',
              'Portfolio development',
              'Career pathways'
            ]
          }
        ],
        assessments: [],
        ukGuidelinesFocus: [
          'Professional development',
          'Continuing education',
          'NHS career pathways'
        ]
      }
    ]
  }
];

// Advanced Assessment Integration
export interface PLABPerformanceMetrics {
  userId: number;
  week: number;
  plab1Readiness: number; // 0-100
  plab2Readiness: number; // 0-100
  weakAreas: string[];
  strongAreas: string[];
  timeToExam: number; // days
  recommendedActions: string[];
  predictedScore: {
    plab1: number;
    plab2: number;
    confidence: number;
  };
}

// UK-Specific Clinical Scenarios
export const UK_CLINICAL_SCENARIOS = [
  {
    id: 'uk_scenario_001',
    title: 'NHS Referral Process',
    description: 'Navigate GP to specialist referral system',
    learningPoints: [
      'Two-week wait referrals',
      'Choose and Book system',
      'Referral criteria understanding'
    ]
  },
  {
    id: 'uk_scenario_002', 
    title: 'Prescribing in Primary Care',
    description: 'Handle prescription requests and medication reviews',
    learningPoints: [
      'FP10 prescription requirements',
      'Controlled drug regulations',
      'Patient safety considerations'
    ]
  },
  {
    id: 'uk_scenario_003',
    title: 'Safeguarding Adults',
    description: 'Recognize and respond to safeguarding concerns',
    learningPoints: [
      'Care Act 2014 requirements',
      'Multi-agency working',
      'Documentation standards'
    ]
  }
];

export const CLINICAL_DECISION_TOOLS = [
  {
    name: 'CHA2DS2-VASc Score',
    purpose: 'Stroke risk in atrial fibrillation',
    reference: 'NICE CG180',
    implementation: 'embedded-calculator'
  },
  {
    name: 'QRISK3',
    purpose: 'Cardiovascular risk assessment',
    reference: 'NICE CG181',
    implementation: 'embedded-calculator'
  },
  {
    name: 'FRAX Tool',
    purpose: 'Fracture risk assessment',
    reference: 'NOGG Guidelines',
    implementation: 'embedded-calculator'
  }
];