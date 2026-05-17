// BNF Integration System for Medical Questions
// Provides comprehensive medication information for clinical scenarios

export interface BNFMedication {
  name: string;
  dosing: {
    adult: string;
    elderly?: string;
    renal?: string;
    hepatic?: string;
  };
  indications: string[];
  contraindications: string[];
  cautions: string[];
  interactions: string[];
  monitoring: string[];
  bnfSection: string;
  pregnancyCategory?: string;
  breastfeedingAdvice?: string;
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe';
  effect: string;
  management: string;
  bnfReference: string;
}

// Comprehensive BNF medication database
export const BNF_MEDICATIONS: Record<string, BNFMedication> = {
  amlodipine: {
    name: "Amlodipine",
    dosing: {
      adult: "5mg once daily, max 10mg daily",
      elderly: "2.5mg once daily initially",
      renal: "No dose adjustment needed",
      hepatic: "2.5mg once daily initially"
    },
    indications: ["Hypertension", "Angina"],
    contraindications: ["Cardiogenic shock", "Severe aortic stenosis"],
    cautions: ["Heart failure", "Hepatic impairment"],
    interactions: ["Grapefruit juice", "CYP3A4 inhibitors"],
    monitoring: ["Blood pressure", "Ankle swelling", "Heart rate"],
    bnfSection: "2.6.2",
    pregnancyCategory: "Not recommended",
    breastfeedingAdvice: "Amount too small to be harmful"
  },

  ramipril: {
    name: "Ramipril",
    dosing: {
      adult: "1.25-2.5mg once daily, max 10mg daily",
      elderly: "1.25mg once daily initially",
      renal: "Reduce dose if eGFR <60",
      hepatic: "1.25mg once daily initially"
    },
    indications: ["Hypertension", "Heart failure", "Post-MI", "Diabetic nephropathy"],
    contraindications: ["Pregnancy", "Angioedema history", "Bilateral renal artery stenosis"],
    cautions: ["Renal impairment", "Aortic stenosis", "First dose hypotension"],
    interactions: ["Potassium supplements", "NSAIDs", "Lithium"],
    monitoring: ["Blood pressure", "Renal function", "Potassium", "Cough"],
    bnfSection: "2.5.5.1",
    pregnancyCategory: "Avoid - teratogenic",
    breastfeedingAdvice: "Avoid in first few weeks postpartum"
  },

  furosemide: {
    name: "Furosemide",
    dosing: {
      adult: "20-80mg daily orally, 20-80mg IV",
      elderly: "Start with lower doses",
      renal: "Higher doses may be needed",
      hepatic: "Use with caution"
    },
    indications: ["Heart failure", "Pulmonary edema", "Hypertension"],
    contraindications: ["Anuria", "Severe hypovolaemia"],
    cautions: ["Diabetes", "Gout", "Hearing disorders"],
    interactions: ["Digoxin", "Lithium", "Aminoglycosides"],
    monitoring: ["Electrolytes", "Renal function", "Blood pressure", "Hearing"],
    bnfSection: "2.2.2",
    pregnancyCategory: "Use only if potential benefit outweighs risk",
    breastfeedingAdvice: "Amount too small to be harmful"
  },

  methotrexate: {
    name: "Methotrexate",
    dosing: {
      adult: "7.5-10mg weekly initially, max 25mg weekly",
      elderly: "Start with lower doses",
      renal: "Reduce dose if eGFR <60",
      hepatic: "Avoid in hepatic impairment"
    },
    indications: ["Rheumatoid arthritis", "Psoriasis", "Crohn's disease"],
    contraindications: ["Pregnancy", "Breastfeeding", "Severe hepatic/renal impairment"],
    cautions: ["Infection risk", "Bone marrow suppression", "Pulmonary toxicity"],
    interactions: ["Trimethoprim", "NSAIDs", "Phenytoin"],
    monitoring: ["FBC", "LFTs", "Renal function", "Chest X-ray"],
    bnfSection: "10.1.3",
    pregnancyCategory: "Avoid - teratogenic and fetotoxic",
    breastfeedingAdvice: "Discontinue breastfeeding"
  },

  amoxicillin: {
    name: "Amoxicillin",
    dosing: {
      adult: "250-500mg TDS, 1g TDS for severe infections",
      elderly: "No dose adjustment usually needed",
      renal: "Reduce dose if eGFR <30",
      hepatic: "No dose adjustment needed"
    },
    indications: ["Respiratory tract infections", "UTI", "Skin infections"],
    contraindications: ["Penicillin allergy"],
    cautions: ["Glandular fever", "Lymphatic leukaemia"],
    interactions: ["Warfarin (minor)", "Oral contraceptives"],
    monitoring: ["Allergic reactions", "C. difficile colitis"],
    bnfSection: "5.1.1.3",
    pregnancyCategory: "Not known to be harmful",
    breastfeedingAdvice: "Trace amounts in milk - not known to be harmful"
  },

  clarithromycin: {
    name: "Clarithromycin",
    dosing: {
      adult: "250-500mg BD, 500mg BD for severe infections",
      elderly: "No dose adjustment usually needed",
      renal: "Reduce dose if eGFR <30",
      hepatic: "Use with caution"
    },
    indications: ["Respiratory tract infections", "H. pylori eradication"],
    contraindications: ["Hypersensitivity to macrolides"],
    cautions: ["QT prolongation", "Myasthenia gravis"],
    interactions: ["Warfarin", "Digoxin", "Statins", "Carbamazepine"],
    monitoring: ["QT interval", "Liver function", "Drug interactions"],
    bnfSection: "5.1.5",
    pregnancyCategory: "Not known to be harmful",
    breastfeedingAdvice: "Present in milk - use only if potential benefit outweighs risk"
  },

  insulin: {
    name: "Insulin (Human)",
    dosing: {
      adult: "Individualized based on blood glucose",
      elderly: "May need dose reduction",
      renal: "May need dose reduction",
      hepatic: "May need dose reduction"
    },
    indications: ["Type 1 diabetes", "Type 2 diabetes", "DKA", "Perioperative glucose control"],
    contraindications: ["Hypoglycaemia"],
    cautions: ["Renal impairment", "Hepatic impairment", "Infection"],
    interactions: ["Beta-blockers", "Corticosteroids", "ACE inhibitors"],
    monitoring: ["Blood glucose", "HbA1c", "Hypoglycaemia awareness"],
    bnfSection: "6.1.1",
    pregnancyCategory: "Not known to be harmful",
    breastfeedingAdvice: "Not known to be harmful"
  }
};

// Drug interaction database
export const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    drug1: "warfarin",
    drug2: "clarithromycin",
    severity: "moderate",
    effect: "Enhanced anticoagulant effect",
    management: "Monitor INR closely, consider dose reduction",
    bnfReference: "Appendix 1: Interactions"
  },
  {
    drug1: "methotrexate",
    drug2: "trimethoprim",
    severity: "severe",
    effect: "Increased risk of methotrexate toxicity",
    management: "Avoid combination if possible",
    bnfReference: "Appendix 1: Interactions"
  },
  {
    drug1: "digoxin",
    drug2: "furosemide",
    severity: "moderate",
    effect: "Hypokalaemia increases digoxin toxicity risk",
    management: "Monitor potassium and digoxin levels",
    bnfReference: "Appendix 1: Interactions"
  }
];

// Enhanced question generation with BNF integration
export function enhanceQuestionWithBNF(
  stem: string,
  options: string[],
  explanation: string,
  medications: string[]
): {
  enhancedStem: string;
  enhancedOptions: string[];
  enhancedExplanation: string;
} {
  let enhancedStem = stem;
  let enhancedOptions = [...options];
  let enhancedExplanation = explanation;

  // Add medication context to stem if relevant
  medications.forEach(med => {
    const medInfo = BNF_MEDICATIONS[med.toLowerCase()];
    if (medInfo) {
      // Add monitoring parameters to stem if relevant
      if (stem.includes('monitor') || stem.includes('follow-up')) {
        enhancedStem += ` (BNF monitoring: ${medInfo.monitoring.slice(0, 2).join(', ')})`;
      }
    }
  });

  // Enhance options with BNF dosing and safety information
  enhancedOptions = options.map((option, index) => {
    let enhancedOption = option;
    
    medications.forEach(med => {
      const medInfo = BNF_MEDICATIONS[med.toLowerCase()];
      if (medInfo && option.toLowerCase().includes(med.toLowerCase())) {
        // Add dosing information
        if (!option.includes('BNF:')) {
          enhancedOption += ` (BNF: ${medInfo.dosing.adult})`;
        }
        
        // Add contraindication warnings for incorrect options
        if (index !== 0 && medInfo.contraindications.length > 0) {
          const relevantContraindication = medInfo.contraindications[0];
          if (!option.includes('contraindicated')) {
            enhancedOption += ` - contraindicated in ${relevantContraindication}`;
          }
        }
      }
    });
    
    return enhancedOption;
  });

  // Enhance explanation with comprehensive BNF guidance
  let bnfGuidance = "BNF guidance: ";
  medications.forEach(med => {
    const medInfo = BNF_MEDICATIONS[med.toLowerCase()];
    if (medInfo) {
      bnfGuidance += `${medInfo.name} (BNF section ${medInfo.bnfSection}): ${medInfo.dosing.adult}. `;
      
      if (medInfo.monitoring.length > 0) {
        bnfGuidance += `Monitor: ${medInfo.monitoring.join(', ')}. `;
      }
      
      if (medInfo.interactions.length > 0) {
        bnfGuidance += `Key interactions: ${medInfo.interactions.slice(0, 2).join(', ')}. `;
      }
    }
  });

  // Check for drug interactions
  const interactionWarnings = checkDrugInteractions(medications);
  if (interactionWarnings.length > 0) {
    bnfGuidance += `Drug interactions: ${interactionWarnings.join('; ')}. `;
  }

  enhancedExplanation = bnfGuidance + enhancedExplanation;

  return {
    enhancedStem,
    enhancedOptions,
    enhancedExplanation
  };
}

// Check for drug interactions
function checkDrugInteractions(medications: string[]): string[] {
  const warnings: string[] = [];
  
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const interaction = DRUG_INTERACTIONS.find(int => 
        (int.drug1.toLowerCase() === medications[i].toLowerCase() && 
         int.drug2.toLowerCase() === medications[j].toLowerCase()) ||
        (int.drug2.toLowerCase() === medications[i].toLowerCase() && 
         int.drug1.toLowerCase() === medications[j].toLowerCase())
      );
      
      if (interaction) {
        warnings.push(`${interaction.drug1}-${interaction.drug2}: ${interaction.effect} (${interaction.severity})`);
      }
    }
  }
  
  return warnings;
}

// Generate medication-focused clinical scenarios
export function generateMedicationScenario(
  specialty: string,
  primaryMedication: string,
  comorbidities: string[] = []
): string {
  const medInfo = BNF_MEDICATIONS[primaryMedication.toLowerCase()];
  if (!medInfo) return "";

  const scenarios = {
    cardiovascular: [
      `A patient with hypertension is prescribed ${medInfo.name}. They also have ${comorbidities.join(' and ')}.`,
      `Following acute coronary syndrome, a patient requires ${medInfo.name} therapy. Consider their existing medications.`
    ],
    respiratory: [
      `A patient with pneumonia requires antibiotic therapy. They are currently taking ${comorbidities.join(' and ')}.`,
      `For severe asthma exacerbation, consider ${medInfo.name} while monitoring for interactions.`
    ],
    endocrinology: [
      `A diabetic patient presents with ketoacidosis requiring ${medInfo.name}. Monitor closely for complications.`,
      `Long-term diabetes management with ${medInfo.name} requires careful monitoring.`
    ]
  };

  return scenarios[specialty as keyof typeof scenarios]?.[0] || 
         `Clinical scenario involving ${medInfo.name} therapy requiring BNF guidance.`;
}

// Export medication lists by specialty
export const SPECIALTY_MEDICATIONS = {
  cardiovascular: ['amlodipine', 'ramipril', 'furosemide', 'atenolol', 'simvastatin'],
  respiratory: ['amoxicillin', 'clarithromycin', 'prednisolone', 'salbutamol'],
  endocrinology: ['insulin', 'metformin', 'gliclazide'],
  rheumatology: ['methotrexate', 'prednisolone', 'hydroxychloroquine'],
  psychiatry: ['sertraline', 'mirtazapine', 'lithium', 'haloperidol'],
  neurology: ['levetiracetam', 'carbamazepine', 'phenytoin'],
  gastroenterology: ['omeprazole', 'mesalazine', 'azathioprine']
};