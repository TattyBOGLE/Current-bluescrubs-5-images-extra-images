export const userFormatTemplates = [
  {
    id: "template-cardiology-1",
    stationType: "Cardiology",
    specialty: "cardiology",
    brief: "This is a station about acute chest pain. Take a focused history, perform relevant examination, and explain your findings and management plan to the patient.",
    actorScript: "You are a 55-year-old male presenting with central crushing chest pain radiating to the left arm for 2 hours. You are anxious. You smoke 20 cigarettes daily for 30 years. Father had MI at 50. You take atorvastatin and ramipril for hypertension.",
    markScheme: [
      "Introduces self, confirms patient identity, gains consent",
      "Takes focused cardiovascular history (SOCRATES for chest pain)",
      "Asks about risk factors: smoking, family history, diabetes, hypertension",
      "Explains likely diagnosis and immediate management (ECG, troponin, aspirin)",
      "Addresses patient concerns with empathy and clear communication"
    ],
    mnemonic: "SOCRATES - Site, Onset, Character, Radiation, Associated symptoms, Time/duration, Exacerbating/relieving factors, Severity",
    communicationNotes: "Maintain calm demeanour despite urgency. Use simple language when explaining cardiac investigations. Address smoking cessation sensitively.",
    guidelines: {
      nice: "https://www.nice.org.uk/guidance/cg95",
      gmc: "https://www.gmc-uk.org/ethical-guidance",
      bnf: "https://bnf.nice.org.uk",
      resus: "https://www.resus.org.uk/guidelines"
    }
  },
  {
    id: "template-respiratory-1",
    stationType: "Respiratory",
    specialty: "respiratory",
    brief: "This is a station about an acute asthma exacerbation. Assess the patient, provide appropriate management, and counsel on inhaler technique and action plan.",
    actorScript: "You are a 28-year-old female presenting with worsening breathlessness and wheeze for 3 days. Your usual salbutamol inhaler is not helping. You were admitted once before for asthma aged 16. You are worried about missing work.",
    markScheme: [
      "Assesses severity using BTS/SIGN criteria (speech, RR, HR, SpO2, PEFR)",
      "Initiates appropriate acute management (oxygen, nebulised salbutamol, ipratropium, steroids)",
      "Reviews current medications and adherence",
      "Demonstrates/checks inhaler technique",
      "Provides personalised asthma action plan and safety-netting advice"
    ],
    mnemonic: "OSHIT - Oxygen, Salbutamol, Hydrocortisone/steroids, Ipratropium, Theophylline (escalation)",
    communicationNotes: "Reassure patient while maintaining clinical urgency. Explore concerns about work impact. Use teach-back method for inhaler technique.",
    guidelines: {
      nice: "https://www.nice.org.uk/guidance/ng80",
      gmc: "https://www.gmc-uk.org/ethical-guidance",
      bnf: "https://bnf.nice.org.uk",
      resus: "https://www.resus.org.uk/guidelines"
    }
  },
  {
    id: "template-ethics-1",
    stationType: "Ethics",
    specialty: "ethics",
    brief: "This is a station about capacity assessment and consent. A patient is refusing a life-saving blood transfusion on religious grounds. Assess capacity and manage appropriately.",
    actorScript: "You are a 45-year-old Jehovah's Witness who has been in a road traffic accident and needs a blood transfusion. You are fully alert, orientated, and clearly understand the consequences but firmly refuse blood products on religious grounds. You have an advance directive.",
    markScheme: [
      "Assesses capacity using the 4-stage test (understand, retain, weigh up, communicate)",
      "Respects patient autonomy when capacity is confirmed",
      "Explores alternatives to blood transfusion (cell salvage, iron, erythropoietin)",
      "Documents decision clearly and involves senior colleague",
      "Handles situation with sensitivity, professionalism, and without judgement"
    ],
    mnemonic: "CURB capacity - Comprehend, Use/weigh, Retain, Base decision and communicate",
    communicationNotes: "Avoid being confrontational or dismissive of religious beliefs. Clearly document the capacity assessment. Explore patient values respectfully.",
    guidelines: {
      nice: "https://www.nice.org.uk/guidance/ng108",
      gmc: "https://www.gmc-uk.org/ethical-guidance/ethical-guidance-for-doctors/consent",
      bnf: "https://bnf.nice.org.uk",
      resus: "https://www.resus.org.uk/guidelines"
    }
  }
];
