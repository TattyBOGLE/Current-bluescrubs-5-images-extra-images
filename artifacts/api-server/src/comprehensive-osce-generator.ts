// Comprehensive PLAB 2 OSCE Station Generator
// Targets: Premium Version (120-150+ scenarios) covering full GMC blueprint

import fs from 'fs';
import { userFormatTemplates } from './user-format-templates';

// GMC Blueprint Categories for PLAB 2 OSCE
export const GMC_BLUEPRINT_CATEGORIES = {
  // Core Clinical Skills (40% of exam)
  HISTORY_TAKING: {
    weight: 15,
    scenarios: [
      'Chest pain', 'Shortness of breath', 'Headache', 'Abdominal pain', 'Joint pain',
      'Weight loss', 'Fatigue', 'Palpitations', 'Dizziness', 'Back pain',
      'Urinary symptoms', 'Bowel changes', 'Skin rash', 'Memory problems', 'Sleep issues'
    ]
  },
  
  PHYSICAL_EXAMINATION: {
    weight: 15,
    scenarios: [
      'Cardiovascular examination', 'Respiratory examination', 'Abdominal examination',
      'Neurological examination', 'Musculoskeletal examination', 'ENT examination',
      'Dermatological examination', 'Eye examination', 'Breast examination',
      'Thyroid examination', 'Lymph node examination', 'Mental state examination'
    ]
  },
  
  DATA_INTERPRETATION: {
    weight: 10,
    scenarios: [
      'ECG interpretation', 'Chest X-ray', 'Blood results', 'Urine dipstick',
      'Peak flow', 'Blood pressure monitoring', 'Blood glucose', 'Spirometry',
      'ABG interpretation', 'Thyroid function tests'
    ]
  },

  // Communication Skills (35% of exam)
  PATIENT_COUNSELING: {
    weight: 15,
    scenarios: [
      'Diabetes counseling', 'Hypertension counseling', 'Smoking cessation',
      'Weight management', 'Medication compliance', 'Lifestyle modification',
      'Contraception counseling', 'Vaccination counseling', 'Diet counseling',
      'Exercise counseling', 'Alcohol reduction', 'Mental health support'
    ]
  },
  
  BREAKING_BAD_NEWS: {
    weight: 10,
    scenarios: [
      'Cancer diagnosis', 'Chronic disease diagnosis', 'Test results',
      'Treatment failure', 'Prognosis discussion', 'Genetic counseling',
      'Pregnancy complications', 'Fertility issues', 'Terminal illness',
      'Unexpected diagnosis'
    ]
  },
  
  SHARED_DECISION_MAKING: {
    weight: 10,
    scenarios: [
      'Treatment options discussion', 'Surgical consent', 'Investigation choices',
      'Medication selection', 'Care planning', 'Discharge planning',
      'Referral discussion', 'Second opinion', 'Risk vs benefit',
      'Patient preference exploration'
    ]
  },

  // Professional Skills (25% of exam)
  ETHICAL_SCENARIOS: {
    weight: 10,
    scenarios: [
      'Capacity assessment', 'Confidentiality breach', 'Safeguarding concerns',
      'Consent issues', 'Resource allocation', 'Whistleblowing',
      'Professional boundaries', 'Duty of candour', 'Cultural sensitivity',
      'Religious considerations', 'End of life decisions', 'Advance directives'
    ]
  },
  
  EMERGENCY_MANAGEMENT: {
    weight: 8,
    scenarios: [
      'Acute chest pain', 'Severe breathlessness', 'Collapse/syncope',
      'Seizure management', 'Acute confusion', 'Severe allergic reaction',
      'Acute bleeding', 'Severe pain', 'Mental health crisis',
      'Overdose/poisoning'
    ]
  },
  
  PRACTICAL_PROCEDURES: {
    weight: 7,
    scenarios: [
      'Venipuncture', 'Cannulation', 'Urinalysis', 'Blood pressure measurement',
      'Peak flow measurement', 'Blood glucose testing', 'Wound care',
      'Basic life support', 'Inhaler technique', 'Injection technique'
    ]
  }
};

// Specialty-specific scenarios for comprehensive coverage
export const SPECIALTY_SCENARIOS = {
  CARDIOLOGY: [
    'Acute coronary syndrome', 'Heart failure', 'Arrhythmias', 'Hypertension',
    'Valvular disease', 'Peripheral vascular disease', 'Deep vein thrombosis'
  ],
  RESPIRATORY: [
    'Asthma', 'COPD', 'Pneumonia', 'Pulmonary embolism', 'Lung cancer',
    'Pleural effusion', 'Pneumothorax', 'Sleep apnea'
  ],
  GASTROENTEROLOGY: [
    'Inflammatory bowel disease', 'Peptic ulcer disease', 'GORD', 'Liver disease',
    'Gallbladder disease', 'Bowel cancer', 'Irritable bowel syndrome'
  ],
  NEUROLOGY: [
    'Stroke', 'Epilepsy', 'Migraine', 'Parkinson\'s disease', 'Multiple sclerosis',
    'Peripheral neuropathy', 'Dementia', 'Brain tumour'
  ],
  PSYCHIATRY: [
    'Depression', 'Anxiety disorders', 'Bipolar disorder', 'Schizophrenia',
    'Substance abuse', 'Eating disorders', 'PTSD', 'Personality disorders'
  ],
  ENDOCRINOLOGY: [
    'Diabetes mellitus', 'Thyroid disorders', 'Adrenal disorders', 'Osteoporosis',
    'Polycystic ovary syndrome', 'Growth disorders', 'Calcium disorders'
  ],
  OBSTETRICS_GYNECOLOGY: [
    'Pregnancy complications', 'Contraception', 'Menstrual disorders', 'Infertility',
    'Menopause', 'Cervical screening', 'Ovarian cysts', 'Endometriosis'
  ],
  PEDIATRICS: [
    'Childhood infections', 'Developmental delays', 'Vaccination', 'Growth concerns',
    'Behavioral problems', 'Feeding difficulties', 'Respiratory infections'
  ],
  SURGERY: [
    'Acute appendicitis', 'Bowel obstruction', 'Hernia', 'Gallbladder disease',
    'Trauma assessment', 'Wound management', 'Post-operative care'
  ],
  EMERGENCY_MEDICINE: [
    'Triage assessment', 'Trauma management', 'Poisoning', 'Sepsis',
    'Acute abdomen', 'Head injury', 'Burns', 'Anaphylaxis'
  ],
  DERMATOLOGY: [
    'Skin cancer', 'Eczema', 'Psoriasis', 'Acne', 'Skin infections',
    'Hair loss', 'Nail disorders', 'Allergic reactions'
  ]
};

interface OSCEStationTemplate {
  station_type: string;
  scenario_title: string;
  brief: string;
  actor_script: {
    opening: string;
    details: string;
    hidden_info: string;
  };
  mark_scheme: string[];
  mnemonic: string;
  communication_notes: string;
  guideline_links: Record<string, string>;
  difficulty?: 'Foundation' | 'Intermediate' | 'Advanced';
  duration?: number;
  specialty?: string;
}

class ComprehensiveOSCEGenerator {
  private generatedStations: OSCEStationTemplate[] = [];
  private totalTarget: number;
  
  constructor(targetCount: number = 150) {
    this.totalTarget = targetCount;
  }

  // Generate stations based on GMC blueprint distribution
  generateComprehensiveStationBank(): OSCEStationTemplate[] {
    console.log(`Generating comprehensive PLAB 2 OSCE station bank (${this.totalTarget} stations)`);
    
    this.generatedStations = [...userFormatTemplates]; // Start with templates
    
    // Generate stations for each GMC category
    Object.entries(GMC_BLUEPRINT_CATEGORIES).forEach(([category, config]) => {
      const stationCount = Math.floor((config.weight / 100) * this.totalTarget);
      console.log(`Generating ${stationCount} stations for ${category}`);
      
      for (let i = 0; i < stationCount; i++) {
        const scenario = config.scenarios[i % config.scenarios.length];
        const station = this.createStationFromScenario(category, scenario);
        this.generatedStations.push(station);
      }
    });

    // Generate specialty-specific stations
    Object.entries(SPECIALTY_SCENARIOS).forEach(([specialty, scenarios]) => {
      scenarios.forEach(scenario => {
        const station = this.createSpecialtyStation(specialty, scenario);
        this.generatedStations.push(station);
      });
    });

    // Trim to target count
    this.generatedStations = this.generatedStations.slice(0, this.totalTarget);
    
    console.log(`Generated ${this.generatedStations.length} comprehensive OSCE stations`);
    return this.generatedStations;
  }

  private createStationFromScenario(category: string, scenario: string): OSCEStationTemplate {
    const stationId = `${category.toLowerCase()}_${this.generatedStations.length + 1}`;
    
    // Determine station type based on category
    const stationType = this.mapCategoryToStationType(category);
    const specialty = this.inferSpecialtyFromScenario(scenario);
    const difficulty = this.assignDifficulty();
    
    return {
      station_type: stationType,
      scenario_title: this.generateScenarioTitle(scenario),
      brief: this.generateBrief(stationType, scenario),
      actor_script: this.generateActorScript(scenario),
      mark_scheme: this.generateMarkScheme(stationType),
      mnemonic: this.generateMnemonic(scenario, specialty),
      communication_notes: this.generateCommunicationNotes(stationType, specialty),
      guideline_links: this.generateGuidelineLinks(specialty),
      difficulty,
      duration: 8, // Standard PLAB 2 duration
      specialty
    };
  }

  private createSpecialtyStation(specialty: string, scenario: string): OSCEStationTemplate {
    const stationType = this.inferStationTypeFromScenario(scenario);
    
    return {
      station_type: specialty,
      scenario_title: scenario,
      brief: `This is a station about ${scenario.toLowerCase()}. Take history, examine, explain, or counsel appropriately.`,
      actor_script: {
        opening: this.generateSpecialtyOpening(scenario),
        details: "Patient provides relevant history when prompted with appropriate questions.",
        hidden_info: "Additional information revealed through skilled questioning and examination."
      },
      mark_scheme: this.generateSpecialtyMarkScheme(stationType, scenario),
      mnemonic: this.generateSpecialtyMnemonic(specialty, scenario),
      communication_notes: this.generateSpecialtyCommunicationNotes(specialty),
      guideline_links: this.generateSpecialtyGuidelineLinks(specialty),
      difficulty: this.assignDifficulty(),
      duration: 8,
      specialty: specialty.toLowerCase()
    };
  }

  private mapCategoryToStationType(category: string): string {
    const mapping: Record<string, string> = {
      'HISTORY_TAKING': 'History Taking',
      'PHYSICAL_EXAMINATION': 'Physical Examination',
      'DATA_INTERPRETATION': 'Data Interpretation',
      'PATIENT_COUNSELING': 'Patient Counselling',
      'BREAKING_BAD_NEWS': 'Communication Skills',
      'SHARED_DECISION_MAKING': 'Shared Decision Making',
      'ETHICAL_SCENARIOS': 'Ethics',
      'EMERGENCY_MANAGEMENT': 'Emergency Medicine',
      'PRACTICAL_PROCEDURES': 'Practical Skills'
    };
    return mapping[category] || 'General Practice';
  }

  private generateScenarioTitle(scenario: string): string {
    const variations = [
      `${scenario} in Primary Care`,
      `Managing ${scenario}`,
      `${scenario} Assessment`,
      `${scenario} Consultation`,
      `Investigating ${scenario}`
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  }

  private generateBrief(stationType: string, scenario: string): string {
    const briefTemplates: Record<string, string> = {
      'History Taking': `This is a station about ${scenario.toLowerCase()}. Take a focused history and discuss your findings.`,
      'Physical Examination': `This is a station about examining a patient with ${scenario.toLowerCase()}. Perform the appropriate examination.`,
      'Patient Counselling': `This is a station about counselling regarding ${scenario.toLowerCase()}. Provide appropriate advice and support.`,
      'Communication Skills': `This is a station about communicating with a patient regarding ${scenario.toLowerCase()}. Use appropriate communication skills.`,
      'Ethics': `This is a station about ethical considerations in ${scenario.toLowerCase()}. Address the ethical issues appropriately.`
    };
    return briefTemplates[stationType] || `This is a station about ${scenario.toLowerCase()}. Manage appropriately.`;
  }

  private generateActorScript(scenario: string): { opening: string; details: string; hidden_info: string } {
    return {
      opening: `Doctor, I'm concerned about ${scenario.toLowerCase()}...`,
      details: "Patient elaborates on symptoms and concerns when asked appropriate questions.",
      hidden_info: "Additional relevant information revealed through skilled questioning and rapport building."
    };
  }

  private generateMarkScheme(stationType: string): string[] {
    const baseScheme = [
      "Introduces self and clarifies role appropriately",
      "Demonstrates professional communication throughout",
      "Shows empathy and builds rapport effectively",
      "Structures consultation/examination systematically",
      "Summarizes findings and discusses next steps clearly"
    ];

    const typeSpecificSchemes: Record<string, string[]> = {
      'History Taking': [
        "Takes comprehensive and focused history",
        "Explores presenting complaint using appropriate framework",
        "Assesses relevant medical and social history",
        "Identifies key risk factors and red flags",
        "Formulates appropriate differential diagnosis"
      ],
      'Physical Examination': [
        "Gains appropriate consent and explains procedure",
        "Performs examination systematically and thoroughly",
        "Demonstrates correct examination technique",
        "Identifies and interprets clinical signs",
        "Presents findings clearly and accurately"
      ],
      'Patient Counselling': [
        "Assesses patient's understanding and concerns",
        "Provides clear and appropriate information",
        "Uses appropriate language and communication style",
        "Addresses patient questions and concerns",
        "Provides appropriate resources and follow-up"
      ]
    };

    return typeSpecificSchemes[stationType] || baseScheme;
  }

  private generateMnemonic(scenario: string, specialty: string): string {
    const mnemonicMap: Record<string, string> = {
      'cardiology': 'SOCRATES + HEART FAILURE (SOB, Orthopnea, Ankle swelling)',
      'respiratory': 'COPD Assessment: MRC dyspnoea scale + Exacerbation frequency',
      'neurology': 'FAST (Face, Arms, Speech, Time) + Stroke risk factors',
      'psychiatry': 'SAD PERSONS (Suicide risk assessment)',
      'endocrinology': 'NICE Type 2 DM: HbA1c targets + Cardiovascular risk',
      'emergency': 'ABCDE approach + SAMPLE history',
      'obstetrics': 'GTPAL + Risk factors in pregnancy',
      'pediatrics': 'Growth charts + Developmental milestones',
      'default': 'SOCRATES for symptom analysis'
    };
    
    return mnemonicMap[specialty.toLowerCase()] || mnemonicMap['default'];
  }

  private generateCommunicationNotes(stationType: string, specialty: string): string {
    return `Maintain professional boundaries, use clear language appropriate for the patient's understanding, and ensure patient-centered approach throughout the ${stationType.toLowerCase()} consultation.`;
  }

  private generateGuidelineLinks(specialty: string): Record<string, string> {
    return {
      "NICE": "https://www.nice.org.uk/guidance",
      "GMC": "https://www.gmc-uk.org/ethical-guidance",
      "BNF": "https://bnf.nice.org.uk",
      "NHS": "https://www.nhs.uk/conditions"
    };
  }

  private inferSpecialtyFromScenario(scenario: string): string {
    const specialtyKeywords: Record<string, string[]> = {
      'cardiology': ['chest pain', 'heart', 'cardiac', 'blood pressure', 'palpitations'],
      'respiratory': ['breathing', 'cough', 'asthma', 'copd', 'lung'],
      'neurology': ['headache', 'seizure', 'stroke', 'memory', 'neurological'],
      'psychiatry': ['depression', 'anxiety', 'mental health', 'mood'],
      'endocrinology': ['diabetes', 'thyroid', 'weight', 'hormone'],
      'emergency': ['acute', 'emergency', 'urgent', 'collapse']
    };

    for (const [specialty, keywords] of Object.entries(specialtyKeywords)) {
      if (keywords.some(keyword => scenario.toLowerCase().includes(keyword))) {
        return specialty;
      }
    }
    return 'general practice';
  }

  private assignDifficulty(): 'Foundation' | 'Intermediate' | 'Advanced' {
    const rand = Math.random();
    if (rand < 0.3) return 'Foundation';
    if (rand < 0.7) return 'Intermediate';
    return 'Advanced';
  }

  private inferStationTypeFromScenario(scenario: string): string {
    if (scenario.includes('counseling') || scenario.includes('advice')) return 'Patient Counselling';
    if (scenario.includes('examination') || scenario.includes('assess')) return 'Physical Examination';
    if (scenario.includes('history') || scenario.includes('complaint')) return 'History Taking';
    if (scenario.includes('ethical') || scenario.includes('consent')) return 'Ethics';
    return 'General Practice';
  }

  private generateSpecialtyOpening(scenario: string): string {
    return `Doctor, I'm worried about ${scenario.toLowerCase()}. Can you help me understand what's happening?`;
  }

  private generateSpecialtyMarkScheme(stationType: string, scenario: string): string[] {
    return [
      "Professional introduction and role clarification",
      `Systematic approach to ${scenario.toLowerCase()}`,
      "Appropriate clinical reasoning demonstrated",
      "Clear communication and patient involvement",
      "Summary and appropriate next steps discussed"
    ];
  }

  private generateSpecialtyMnemonic(specialty: string, scenario: string): string {
    const specialtyMnemonics: Record<string, string> = {
      'CARDIOLOGY': 'HEART: History, Examination, Assessment, Risk stratification, Treatment',
      'RESPIRATORY': 'BREATHE: Background, Respiratory rate, Examination, Assessment, Treatment, Health education',
      'NEUROLOGY': 'NEURO: Neurological history, Examination, Understanding, Risk factors, Ongoing care',
      'PSYCHIATRY': 'MIND: Mental state, Ideas/concerns, Neurovegetative symptoms, Danger assessment',
      'ENDOCRINOLOGY': 'SWEET: Symptoms, Weight, Eating habits, Exercise, Treatment compliance',
      'EMERGENCY_MEDICINE': 'CRASH: Circulation, Respiration, Airway, Spine, Head injury'
    };
    return specialtyMnemonics[specialty] || 'SOCRATES symptom framework';
  }

  private generateSpecialtyCommunicationNotes(specialty: string): string {
    const notes: Record<string, string> = {
      'CARDIOLOGY': 'Focus on cardiovascular risk factors, lifestyle modifications, and medication adherence.',
      'RESPIRATORY': 'Emphasize smoking cessation, inhaler technique, and self-management strategies.',
      'NEUROLOGY': 'Use clear explanations for complex neurological concepts, involve family when appropriate.',
      'PSYCHIATRY': 'Maintain non-judgmental approach, assess safety, and explore patient\'s perspective.',
      'ENDOCRINOLOGY': 'Provide lifestyle counseling, discuss long-term complications, and empower self-management.'
    };
    return notes[specialty] || 'Maintain patient-centered communication throughout.';
  }

  private generateSpecialtyGuidelineLinks(specialty: string): Record<string, string> {
    return {
      "NICE": "https://www.nice.org.uk/guidance",
      "GMC": "https://www.gmc-uk.org/ethical-guidance", 
      "BNF": "https://bnf.nice.org.uk",
      "NHS": `https://www.nhs.uk/conditions`
    };
  }

  // Save generated stations to file
  saveStationsToFile(filename: string = 'comprehensive-osce-stations.json'): void {
    try {
      const jsonData = JSON.stringify(this.generatedStations, null, 2);
      fs.writeFileSync(filename, jsonData);
      console.log(`Saved ${this.generatedStations.length} comprehensive OSCE stations to ${filename}`);
    } catch (error) {
      console.error('Error saving stations:', error);
    }
  }

  // Load stations from file
  loadStationsFromFile(filename: string = 'comprehensive-osce-stations.json'): OSCEStationTemplate[] {
    try {
      if (fs.existsSync(filename)) {
        const data = fs.readFileSync(filename, 'utf8');
        this.generatedStations = JSON.parse(data);
        console.log(`Loaded ${this.generatedStations.length} comprehensive OSCE stations from ${filename}`);
        return this.generatedStations;
      }
    } catch (error) {
      console.error('Error loading stations:', error);
    }
    return [];
  }

  getStationStats() {
    const stats = {
      total: this.generatedStations.length,
      byType: {} as Record<string, number>,
      bySpecialty: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>
    };

    this.generatedStations.forEach(station => {
      // Count by type
      stats.byType[station.station_type] = (stats.byType[station.station_type] || 0) + 1;
      
      // Count by specialty
      if (station.specialty) {
        stats.bySpecialty[station.specialty] = (stats.bySpecialty[station.specialty] || 0) + 1;
      }
      
      // Count by difficulty
      if (station.difficulty) {
        stats.byDifficulty[station.difficulty] = (stats.byDifficulty[station.difficulty] || 0) + 1;
      }
    });

    return stats;
  }
}

// Export functions for use in routes
export function generateComprehensiveOSCEBank(targetCount: number = 150): OSCEStationTemplate[] {
  const generator = new ComprehensiveOSCEGenerator(targetCount);
  const stations = generator.generateComprehensiveStationBank();
  generator.saveStationsToFile();
  return stations;
}

export function loadComprehensiveOSCEBank(): OSCEStationTemplate[] {
  const generator = new ComprehensiveOSCEGenerator();
  return generator.loadStationsFromFile();
}

export function getOSCEBankStats(): any {
  const generator = new ComprehensiveOSCEGenerator();
  generator.loadStationsFromFile();
  return generator.getStationStats();
}