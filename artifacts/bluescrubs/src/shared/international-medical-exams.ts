// International Medical Licensing Exams - Global Comparison
// Comprehensive system covering major medical licensing pathways worldwide

export interface MedicalExam {
  id: string;
  country: string;
  examName: string;
  regulatoryBody: string;
  stages: ExamStage[];
  prerequisites: string[];
  validityPeriod: string;
  costUSD: number;
  passingScore: number;
  annualCandidates: number;
  difficulty: 'moderate' | 'challenging' | 'very-challenging';
  similarTo?: string[];
}

export interface ExamStage {
  stageName: string;
  format: 'MCQ' | 'OSCE' | 'Essay' | 'Oral' | 'Clinical' | 'Mixed';
  duration: string;
  questionCount: number;
  description: string;
  passingCriteria: string;
}

export const INTERNATIONAL_MEDICAL_EXAMS: MedicalExam[] = [
  {
    id: 'uk_plab',
    country: 'United Kingdom',
    examName: 'PLAB (Professional and Linguistic Assessments Board)',
    regulatoryBody: 'General Medical Council (GMC)',
    stages: [
      {
        stageName: 'PLAB 1',
        format: 'MCQ',
        duration: '3 hours',
        questionCount: 180,
        description: 'Knowledge-based multiple choice examination covering clinical medicine',
        passingCriteria: 'Standard setting methodology, typically ~120/180 (67%)'
      },
      {
        stageName: 'PLAB 2',
        format: 'OSCE',
        duration: '2.5 hours',
        questionCount: 18,
        description: '18 clinical stations testing practical skills, communication, and clinical reasoning',
        passingCriteria: 'Global score method across all stations'
      }
    ],
    prerequisites: [
      'Primary medical qualification recognized by GMC',
      'IELTS 7.0 overall (minimum 7.0 in speaking)',
      'Valid passport'
    ],
    validityPeriod: '4 years',
    costUSD: 900,
    passingScore: 67,
    annualCandidates: 15000,
    difficulty: 'challenging',
    similarTo: ['AMC', 'MCCQE']
  },
  {
    id: 'usa_usmle',
    country: 'United States',
    examName: 'USMLE (United States Medical Licensing Examination)',
    regulatoryBody: 'FSMB and NBME',
    stages: [
      {
        stageName: 'Step 1',
        format: 'MCQ',
        duration: '8 hours',
        questionCount: 280,
        description: 'Basic sciences knowledge including anatomy, physiology, pathology, pharmacology',
        passingCriteria: 'Pass/Fail (previously scored, changed 2022)'
      },
      {
        stageName: 'Step 2 CK',
        format: 'MCQ',
        duration: '9 hours',
        questionCount: 318,
        description: 'Clinical knowledge and decision-making in medicine, surgery, pediatrics, psychiatry, obstetrics/gynecology',
        passingCriteria: 'Scaled score ≥209'
      },
      {
        stageName: 'Step 2 CS',
        format: 'Clinical',
        duration: '8 hours',
        questionCount: 12,
        description: 'Clinical skills with standardized patients (suspended due to COVID-19)',
        passingCriteria: 'Pass in all components: ICE, CIS, SEP'
      },
      {
        stageName: 'Step 3',
        format: 'Mixed',
        duration: '2 days',
        questionCount: 465,
        description: 'Clinical decision-making and patient management in ambulatory and inpatient settings',
        passingCriteria: 'Scaled score ≥198'
      }
    ],
    prerequisites: [
      'Medical school enrollment or graduation from LCME/CACMS accredited school',
      'ECFMG certification for international graduates',
      'Valid identification'
    ],
    validityPeriod: '7 years for completion sequence',
    costUSD: 2400,
    passingScore: 65,
    annualCandidates: 50000,
    difficulty: 'very-challenging',
    similarTo: ['Canadian MCCQE', 'Australian AMC']
  },
  {
    id: 'australia_amc',
    country: 'Australia',
    examName: 'AMC (Australian Medical Council) Examinations',
    regulatoryBody: 'Australian Medical Council',
    stages: [
      {
        stageName: 'AMC CAT MCQ',
        format: 'MCQ',
        duration: '3.5 hours',
        questionCount: 150,
        description: 'Computer adaptive test covering clinical medicine with Australian healthcare context',
        passingCriteria: 'Adaptive scoring, typically 500+ scaled score'
      },
      {
        stageName: 'AMC Clinical',
        format: 'Clinical',
        duration: '1 day',
        questionCount: 16,
        description: '16 clinical stations including history, examination, procedures, and communication',
        passingCriteria: 'Competency-based assessment across domains'
      }
    ],
    prerequisites: [
      'Primary medical qualification',
      'English language proficiency (IELTS 7.0 overall, OET Grade B)',
      'AMC verification of medical qualifications'
    ],
    validityPeriod: '5 years',
    costUSD: 3200,
    passingScore: 70,
    annualCandidates: 5000,
    difficulty: 'challenging',
    similarTo: ['UK PLAB', 'NZ NZREX']
  },
  {
    id: 'canada_mccqe',
    country: 'Canada',
    examName: 'MCCQE (Medical Council of Canada Qualifying Examination)',
    regulatoryBody: 'Medical Council of Canada (MCC)',
    stages: [
      {
        stageName: 'MCCQE Part I',
        format: 'MCQ',
        duration: '7 hours',
        questionCount: 210,
        description: 'Clinical decision-making based on Canadian medical practice',
        passingCriteria: 'Standard score ≥390'
      },
      {
        stageName: 'MCCQE Part II',
        format: 'OSCE',
        duration: '4 hours',
        questionCount: 12,
        description: '12 clinical stations testing clinical skills and patient interaction',
        passingCriteria: 'Pass all key features and overall performance'
      }
    ],
    prerequisites: [
      'LCME or CACMS accredited medical degree',
      'English/French proficiency',
      'Successful completion of medical school'
    ],
    validityPeriod: '7 years',
    costUSD: 1200,
    passingScore: 68,
    annualCandidates: 8000,
    difficulty: 'challenging',
    similarTo: ['USMLE', 'UK PLAB']
  },
  {
    id: 'newzealand_nzrex',
    country: 'New Zealand',
    examName: 'NZREX (New Zealand Registration Examination)',
    regulatoryBody: 'Medical Council of New Zealand',
    stages: [
      {
        stageName: 'NZREX Clinical',
        format: 'Clinical',
        duration: '1 day',
        questionCount: 16,
        description: '16 clinical stations covering history, examination, practical procedures, and communication',
        passingCriteria: 'Borderline regression method'
      }
    ],
    prerequisites: [
      'Primary medical qualification',
      'English language competency (IELTS 7.0, OET Grade B)',
      'Completed 12 months medical practice'
    ],
    validityPeriod: '3 years',
    costUSD: 2800,
    passingScore: 72,
    annualCandidates: 800,
    difficulty: 'challenging',
    similarTo: ['AMC Clinical', 'PLAB 2']
  },
  {
    id: 'south_africa_hpcsa',
    country: 'South Africa',
    examName: 'HPCSA Foreign Qualification Evaluation',
    regulatoryBody: 'Health Professions Council of South Africa',
    stages: [
      {
        stageName: 'Board Examination',
        format: 'Mixed',
        duration: 'Variable',
        questionCount: 0,
        description: 'Written and oral examination in chosen specialty',
        passingCriteria: 'Specialty-specific requirements'
      }
    ],
    prerequisites: [
      'Foreign medical qualification evaluation',
      'English proficiency',
      'Community service commitment'
    ],
    validityPeriod: 'Permanent',
    costUSD: 500,
    passingScore: 65,
    annualCandidates: 2000,
    difficulty: 'moderate',
    similarTo: ['Other African medical councils']
  },
  {
    id: 'ireland_mcrsi',
    country: 'Ireland',
    examName: 'Medical Council Registration Examination',
    regulatoryBody: 'Medical Council of Ireland',
    stages: [
      {
        stageName: 'Written Examination',
        format: 'MCQ',
        duration: '3 hours',
        questionCount: 200,
        description: 'Multiple choice questions covering clinical medicine and Irish healthcare context',
        passingCriteria: '65% overall score'
      },
      {
        stageName: 'Clinical Assessment',
        format: 'Clinical',
        duration: '1 day',
        questionCount: 12,
        description: 'Clinical skills assessment with standardized patients',
        passingCriteria: 'Competency-based evaluation'
      }
    ],
    prerequisites: [
      'Primary medical qualification',
      'English language proficiency',
      'EU/EEA citizenship or work permit'
    ],
    validityPeriod: '5 years',
    costUSD: 1500,
    passingScore: 65,
    annualCandidates: 1200,
    difficulty: 'challenging',
    similarTo: ['UK PLAB']
  },
  {
    id: 'germany_fsp',
    country: 'Germany',
    examName: 'FSP (Fachsprachprüfung) + Kenntnisprüfung',
    regulatoryBody: 'State Medical Associations (Landesärztekammern)',
    stages: [
      {
        stageName: 'Fachsprachprüfung',
        format: 'Oral',
        duration: '1 hour',
        questionCount: 0,
        description: 'Medical German language examination',
        passingCriteria: 'B2/C1 level medical German'
      },
      {
        stageName: 'Kenntnisprüfung',
        format: 'Oral',
        duration: '45 minutes',
        questionCount: 0,
        description: 'Medical knowledge examination in German',
        passingCriteria: 'Demonstrate medical competency equivalent to German standards'
      }
    ],
    prerequisites: [
      'Medical degree recognition (Gleichwertigkeitsprüfung)',
      'German language B2 level minimum',
      'EU/EEA citizenship or residence permit'
    ],
    validityPeriod: 'Permanent',
    costUSD: 800,
    passingScore: 70,
    annualCandidates: 3000,
    difficulty: 'challenging',
    similarTo: ['Other EU examinations']
  },
  {
    id: 'uae_dha',
    country: 'United Arab Emirates',
    examName: 'DHA (Dubai Health Authority) Assessment',
    regulatoryBody: 'Dubai Health Authority',
    stages: [
      {
        stageName: 'Written Examination',
        format: 'MCQ',
        duration: '3 hours',
        questionCount: 150,
        description: 'Clinical medicine with Middle East healthcare context',
        passingCriteria: '60% minimum score'
      },
      {
        stageName: 'Clinical Assessment',
        format: 'Clinical',
        duration: '2 hours',
        questionCount: 8,
        description: 'Clinical skills and patient interaction assessment',
        passingCriteria: 'Satisfactory performance in all domains'
      }
    ],
    prerequisites: [
      'Primary medical qualification',
      'English language proficiency',
      'Valid UAE residence visa'
    ],
    validityPeriod: '2 years renewable',
    costUSD: 600,
    passingScore: 60,
    annualCandidates: 4000,
    difficulty: 'moderate',
    similarTo: ['Other GCC examinations']
  },
  {
    id: 'singapore_smc',
    country: 'Singapore',
    examName: 'SMC (Singapore Medical Council) Assessment',
    regulatoryBody: 'Singapore Medical Council',
    stages: [
      {
        stageName: 'Professional Examination',
        format: 'Mixed',
        duration: '2 days',
        questionCount: 0,
        description: 'Written and clinical examination covering Singapore medical practice',
        passingCriteria: 'Pass both written and clinical components'
      }
    ],
    prerequisites: [
      'Recognized medical qualification',
      'English proficiency',
      'Work pass/citizenship'
    ],
    validityPeriod: 'Permanent subject to CPD',
    costUSD: 2000,
    passingScore: 70,
    annualCandidates: 800,
    difficulty: 'challenging',
    similarTo: ['Other ASEAN medical councils']
  }
];

// Regional Comparison and Difficulty Analysis
export const EXAM_DIFFICULTY_COMPARISON = {
  'Very Challenging': ['USMLE (USA)'],
  'Challenging': ['PLAB (UK)', 'AMC (Australia)', 'MCCQE (Canada)', 'NZREX (New Zealand)', 'Ireland MCR', 'FSP (Germany)', 'SMC (Singapore)'],
  'Moderate': ['HPCSA (South Africa)', 'DHA (UAE)']
};

export const EXAM_SIMILARITIES = {
  'PLAB-Style': ['UK PLAB', 'Ireland MCR', 'Some EU countries'],
  'USMLE-Style': ['USA USMLE', 'Some Caribbean medical schools'],
  'OSCE-Heavy': ['Australia AMC', 'New Zealand NZREX', 'Canada MCCQE Part II'],
  'Language-Focused': ['Germany FSP', 'Some European countries']
};

// International Medical Graduate Pathways
export const IMG_PATHWAYS = [
  {
    region: 'English-Speaking Countries',
    countries: ['UK', 'USA', 'Canada', 'Australia', 'New Zealand', 'Ireland'],
    commonRequirements: ['English proficiency', 'Medical qualification verification', 'Licensing examination'],
    difficulty: 'High',
    timeToLicense: '1-3 years',
    costsUSD: '1000-4000'
  },
  {
    region: 'European Union',
    countries: ['Germany', 'France', 'Netherlands', 'Sweden', 'Austria'],
    commonRequirements: ['EU recognition of qualifications', 'Language proficiency', 'Some countries require examinations'],
    difficulty: 'Variable',
    timeToLicense: '6 months - 2 years',
    costsUSD: '500-2000'
  },
  {
    region: 'Middle East',
    countries: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'],
    commonRequirements: ['Medical license verification', 'Experience requirements', 'Local examinations'],
    difficulty: 'Moderate',
    timeToLicense: '3-12 months',
    costsUSD: '300-1500'
  },
  {
    region: 'Asia-Pacific',
    countries: ['Singapore', 'Japan', 'South Korea', 'Hong Kong'],
    commonRequirements: ['Local language proficiency', 'Medical qualification assessment', 'Clinical examinations'],
    difficulty: 'High',
    timeToLicense: '1-4 years',
    costsUSD: '1500-5000'
  }
];

// Success Strategies by Country
export const SUCCESS_STRATEGIES = {
  'UK_PLAB': {
    preparation: '6-12 months',
    keyResources: ['NICE Guidelines', 'CKS', 'GMC Good Medical Practice'],
    studyTips: ['Focus on UK clinical practice', 'Practice OSCE communication skills', 'Learn NHS referral pathways'],
    commonPitfalls: ['Not understanding UK healthcare system', 'Poor communication skills', 'Insufficient guideline knowledge']
  },
  'USA_USMLE': {
    preparation: '12-24 months',
    keyResources: ['First Aid', 'UWorld', 'Pathoma', 'Sketchy Medical'],
    studyTips: ['Master basic sciences thoroughly', 'Practice extensive QBanks', 'Understand US healthcare delivery'],
    commonPitfalls: ['Inadequate Step 1 preparation', 'Poor time management', 'Not matching into residency']
  },
  'Australia_AMC': {
    preparation: '8-15 months',
    keyResources: ['Therapeutic Guidelines', 'AMC Handbook', 'Australian clinical scenarios'],
    studyTips: ['Learn Australian medical terminology', 'Practice clinical reasoning', 'Understand rural health issues'],
    commonPitfalls: ['Not adapting to Australian clinical context', 'Insufficient practical experience', 'Poor performance in clinical stations']
  }
};