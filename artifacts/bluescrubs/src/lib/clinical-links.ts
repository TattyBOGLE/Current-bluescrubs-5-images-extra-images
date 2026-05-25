// All clinical link helpers extracted from plab1-new.tsx
// URLs below are openly accessible — no login, paywall, or subscription required.

export function extractTopicFromLabel(text: string): string {
  return text
    .replace(/\b(NICE|CKS|BNF|GMC|SIGN|RCGP|ESC|BTS|BSG|RCOG|ADA|MLA)\b/gi, '')
    .replace(/\b(Guidelines?|Guidance|Clinical Knowledge Summaries?|British National Formulary|Good Medical Practice|Content Map|Medical Licensing Assessment|Foundation Programme Curriculum?|European Society of Cardiology|British Thoracic Society|British Society of Gastroenterology|Royal College of Obstetricians and Gynaecologists?|Royal College of General Practitioners|American Diabetes Association|Scottish Intercollegiate Guidelines? Network|Scottish|evidence.based|recommendations?|standards|evidence|practice)\b/gi, '')
    .replace(/[-—–]+/g, ' ')
    .replace(/[()[\]{};,./\\]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function toQ(s: string) { return encodeURIComponent(s.trim()); }
export function toSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

const NICE_VISUAL_SUMMARY_MAP: Record<string, string> = {
  'ng136': 'https://www.nice.org.uk/guidance/ng136/resources/visual-summary-pdf-6899919517',
  'ng217': 'https://www.nice.org.uk/guidance/ng217/resources/visual-summary-pdf-11067088285',
  'ng106': 'https://www.nice.org.uk/guidance/ng106/resources/chronic-heart-failure-core-treatments-for-heart-failure-visual-summary-pdf-6663137725',
  'ng158': 'https://www.nice.org.uk/guidance/ng158/resources/visual-summary-pdf-11193380893',
  'ng28':  'https://www.nice.org.uk/guidance/ng28/resources/visual-summary-full-version-choosing-medicines-for-firstline-and-further-treatment-pdf-10956472093',
};

export const NICE_GUIDELINE_MAP: Record<string, string> = {
  'hypertension': 'ng136',
  'heart-failure': 'ng106',
  'heart-failure-general-variant': 'ng106',
  'heart-failure-with-reduced-ef-first-line-therapy': 'ng106',
  'heart-failure-with-reduced-ejection-fraction': 'ng106',
  'heart-failure-with-preserved-ejection-fraction': 'ng106',
  'chronic-heart-failure': 'ng106',
  'atrial-fibrillation': 'ng196',
  'af': 'ng196',
  'acute-coronary-syndromes': 'ng185',
  'myocardial-infarction': 'ng185',
  'stemi': 'ng185',
  'lipids': 'ng238',
  'cholesterol': 'ng238',
  'statin': 'ng238',
  'stroke': 'ng128',
  'tia': 'ng128',
  'vte': 'ng158',
  'pulmonary-embolism': 'ng158',
  'dvt': 'ng158',
  'deep-vein-thrombosis': 'ng158',
  'venous-thromboembolism': 'ng158',
  'asthma': 'ng245',
  'copd': 'ng115',
  'obstructive-pulmonary-disease': 'ng115',
  'pneumonia': 'ng250',
  'community-acquired-pneumonia': 'ng250',
  'cap': 'ng250',
  'hospital-acquired-pneumonia': 'ng250',
  'type-1-diabetes': 'ng17',
  'type-2-diabetes': 'ng28',
  'diabetic-ketoacidosis': 'ng17',
  'dka': 'ng17',
  'gestational-diabetes': 'ng3',
  'hypothyroidism': 'ng145',
  'hyperthyroidism': 'ng145',
  'uti': 'ng109',
  'urinary-tract-infection': 'ng109',
  'sepsis': 'ng253',
  'depression': 'ng222',
  'anxiety-old': 'cg113',
  'epilepsy': 'ng217',
  'parkinsons': 'ng71',
  'dementia': 'ng97',
  'migraine': 'ng150',
  'osteoporosis': 'ng187',
  'rheumatoid-arthritis': 'ng100',
  'gout': 'ng219',
  'psoriasis': 'ng96',
  'eczema': 'ng190',
  'atopic-eczema': 'ng190',
  'acne': 'ng98',
  'ckd': 'ng203',
  'kidney-disease': 'ng203',
  'aki': 'ng148',
  'acute-kidney-injury': 'ng148',
  'appendicitis': 'cg141',
  'gord': 'cg184',
  'ibd': 'ng129',
  'crohns': 'ng129',
  'ulcerative-colitis': 'ng129',
  'ibs': 'ng61',
  'irritable-bowel': 'ng61',
  'coeliac': 'ng20',
  'coeliac-disease': 'ng20',
  'upper-gi-bleed': 'ng141',
  'gi-bleed': 'ng141',
  'anxiety': 'ng197',
  'generalised-anxiety': 'ng197',
  'schizophrenia': 'ng185',
  'adhd': 'ng87',
  'eating-disorders': 'ng69',
  'bipolar': 'ng185',
  'multiple-sclerosis': 'ng220',
  'ms': 'ng220',
  'endometriosis': 'ng73',
  'menopause': 'ng23',
  'feverish-illness': 'ng143',
  'uti-children': 'ng224',
  'constipation': 'cg99',
  'safeguarding': 'ng76',
  'osteoarthritis': 'ng226',
  'back-pain': 'ng59',
  'low-back-pain': 'ng59',
  'melanoma': 'ng14',
  'prostate-cancer': 'ng131',
  'preeclampsia': 'ng133',
  'antenatal': 'ng201',
};

const ESC_GUIDELINE_MAP: Record<string, string> = {
  'heart-failure': 'Acute-and-Chronic-Heart-Failure',
  'heart-failure-general-variant': 'Acute-and-Chronic-Heart-Failure',
  'heart-failure-with-reduced-ef-first-line-therapy': 'Acute-and-Chronic-Heart-Failure',
  'heart-failure-with-reduced-ejection-fraction': 'Acute-and-Chronic-Heart-Failure',
  'heart-failure-with-preserved-ejection-fraction': 'Acute-and-Chronic-Heart-Failure',
  'chronic-heart-failure': 'Acute-and-Chronic-Heart-Failure',
  'atrial-fibrillation': 'atrial-fibrillation',
  'af': 'atrial-fibrillation',
  'acute-coronary-syndromes': 'acute-coronary-syndromes-acs-guidelines',
  'stemi': 'acute-coronary-syndromes-acs-guidelines',
  'myocardial-infarction': 'acute-coronary-syndromes-acs-guidelines',
  'nstemi': 'acute-coronary-syndromes-acs-guidelines',
  'dyslipidaemia': 'dyslipidaemias',
  'dyslipidaemias': 'dyslipidaemias',
  'lipids': 'dyslipidaemias',
  'lipid': 'dyslipidaemias',
  'cholesterol': 'dyslipidaemias',
  'hypertension': 'elevated-blood-pressure-and-hypertension',
  'endocarditis': 'endocarditis-guidelines',
  'pericarditis': 'myocarditis-and-pericarditis',
  'pericardial-disease': 'myocarditis-and-pericarditis',
  'myocarditis': 'myocarditis-and-pericarditis',
  'cardiomyopathy': 'cardiomyopathy-guidelines',
  'valvular': 'valvular-heart-disease',
  'ventricular-arrhythmias': 'ventricular-arrhythmias-and-the-prevention-of-sudden-cardiac-death',
  'diabetes': 'cvd-and-diabetes-guidelines',
};

const BTS_GUIDELINE_MAP: Record<string, string> = {
  'asthma': 'asthma-chronic',
  'asthma-chronic': 'asthma-chronic',
  'asthma-severe': 'asthma-severe',
  'pneumonia': 'pneumonia-adults',
  'community-acquired-pneumonia': 'pneumonia-adults',
  'cap': 'pneumonia-adults',
  'hospital-acquired-pneumonia': 'pneumonia-adults',
  'bronchiectasis': 'bronchiectasis-in-adults',
  'non-cf-bronchiectasis': 'bronchiectasis-in-adults',
  'pe': 'pulmonary-embolism',
  'pulmonary-embolism': 'pulmonary-embolism',
  'pleural-disease': 'pleural-disease',
  'pleural-effusion': 'pleural-disease',
  'oxygen': 'emergency-oxygen',
  'smoking': 'tobacco-dependency',
  'smoking-cessation': 'tobacco-dependency',
};

const BSG_GUIDELINE_MAP: Record<string, string> = {
  'gord': 'oesophageal',
  'reflux': 'oesophageal',
  'oesophageal': 'oesophageal',
  'barretts': 'oesophageal',
  'ibd': 'small-bowel-and-nutrition',
  'crohns': 'small-bowel-and-nutrition',
  'ulcerative-colitis': 'small-bowel-and-nutrition',
  'ibs': 'small-bowel-and-nutrition',
  'irritable-bowel': 'small-bowel-and-nutrition',
  'coeliac': 'small-bowel-and-nutrition',
  'h-pylori': 'upper-gi',
  'helicobacter': 'upper-gi',
  'dyspepsia': 'upper-gi',
  'peptic-ulcer': 'upper-gi',
  'liver': 'liver',
  'hepatitis': 'liver',
  'cirrhosis': 'liver',
  'pancreatitis': 'pancreas',
  'pancreas': 'pancreas',
  'colorectal': 'colorectal',
  'bowel-cancer': 'colorectal',
  'colonoscopy': 'endoscopy',
};

const RCOG_GUIDELINE_MAP: Record<string, string> = {
  'vte': 'thrombosis-and-embolism-during-pregnancy-and-the-puerperium-acute-management-green-top-guideline-no-37b',
  'dvt': 'thrombosis-and-embolism-during-pregnancy-and-the-puerperium-acute-management-green-top-guideline-no-37b',
  'thromboembolism': 'thrombosis-and-embolism-during-pregnancy-and-the-puerperium-acute-management-green-top-guideline-no-37b',
  'postpartum-haemorrhage': 'prevention-and-management-of-postpartum-haemorrhage-green-top-guideline-no-52',
  'pph': 'prevention-and-management-of-postpartum-haemorrhage-green-top-guideline-no-52',
  'ectopic': 'diagnosis-and-management-of-ectopic-pregnancy-green-top-guideline-no-21',
  'ectopic-pregnancy': 'diagnosis-and-management-of-ectopic-pregnancy-green-top-guideline-no-21',
  'miscarriage': 'early-pregnancy-loss-management-green-top-guideline-no-25',
  'early-pregnancy-loss': 'early-pregnancy-loss-management-green-top-guideline-no-25',
  'preterm-labour': 'preterm-labour-tocolytic-drugs-green-top-guideline-no-1b',
  'shoulder-dystocia': 'shoulder-dystocia-green-top-guideline-no-42',
  'cord-prolapse': 'umbilical-cord-prolapse-green-top-guideline-no-50',
  'sepsis': 'bacterial-sepsis-following-pregnancy-green-top-guideline-no-64b',
};

export const BNF_TREATMENT_MAP: Record<string, string> = {
  'heart-failure': 'chronic-heart-failure',
  'heart-failure-general-variant': 'chronic-heart-failure',
  'heart-failure-with-reduced-ef-first-line-therapy': 'chronic-heart-failure',
  'heart-failure-with-reduced-ejection-fraction': 'chronic-heart-failure',
  'heart-failure-with-preserved-ejection-fraction': 'chronic-heart-failure',
  'chronic-heart-failure': 'chronic-heart-failure',
  'hypertension': 'hypertension',
  'atrial-fibrillation': 'arrhythmias',
  'af': 'arrhythmias',
  'dvt': 'anticoagulation',
  'deep-vein-thrombosis': 'anticoagulation',
  'venous-thromboembolism': 'anticoagulation',
  'vte': 'anticoagulation',
  'pulmonary-embolism': 'anticoagulation',
  'anticoagulants': 'anticoagulation',
  'statins': 'lipid-regulating-drugs',
  'lipids': 'lipid-regulating-drugs',
  'asthma': 'asthma',
  'copd': 'chronic-obstructive-pulmonary-disease',
  'obstructive-pulmonary-disease': 'chronic-obstructive-pulmonary-disease',
  'type-1-diabetes': 'diabetes-mellitus',
  'type-2-diabetes': 'diabetes-mellitus',
  'diabetes': 'diabetes-mellitus',
  'insulin': 'diabetes-mellitus',
  'depression': 'antidepressant-drugs',
  'anxiety': 'hypnotics-and-anxiolytics',
  'epilepsy': 'epilepsy',
  'parkinsons': 'parkinsons-disease-and-related-disorders',
  'pain': 'analgesics',
  'analgesics': 'analgesics',
  'antibiotics': 'antibacterials-principles-of-therapy',
  'sepsis': 'antibacterials-principles-of-therapy',
  'pneumonia': 'respiratory-tract-infections',
  'community-acquired-pneumonia': 'respiratory-tract-infections',
  'cap': 'respiratory-tract-infections',
  'hospital-acquired-pneumonia': 'respiratory-tract-infections',
  'stroke': 'stroke',
  'tia': 'stroke',
  'uti': 'urinary-tract-infections',
  'urinary-tract-infection': 'urinary-tract-infections',
  'ckd': 'prescribing-in-renal-impairment',
  'kidney-disease': 'prescribing-in-renal-impairment',
  'contraception': 'contraception-overview',
  'gord': 'dyspepsia-and-gastro-oesophageal-reflux-disease',
  'osteoporosis': 'osteoporosis',
  'rheumatoid-arthritis': 'rheumatoid-arthritis',
  'thyroid': 'thyroid-disorders',
  'hypothyroidism': 'thyroid-disorders',
  'hyperthyroidism': 'thyroid-disorders',
  'psoriasis': 'psoriasis',
  'eczema': 'eczema',
};

export const CKS_SLUG_MAP: Record<string, string> = {
  'asthma': 'asthma',
  'copd': 'chronic-obstructive-pulmonary-disease',
  'chronic-obstructive-pulmonary-disease': 'chronic-obstructive-pulmonary-disease',
  'obstructive-pulmonary-disease': 'chronic-obstructive-pulmonary-disease',
  'hypertension': 'hypertension',
  'heart-failure': 'heart-failure-chronic',
  'heart-failure-general-variant': 'heart-failure-chronic',
  'heart-failure-with-reduced-ef-first-line-therapy': 'heart-failure-chronic',
  'heart-failure-with-reduced-ejection-fraction': 'heart-failure-chronic',
  'heart-failure-with-preserved-ejection-fraction': 'heart-failure-chronic',
  'chronic-heart-failure': 'heart-failure-chronic',
  'atrial-fibrillation': 'atrial-fibrillation',
  'af': 'atrial-fibrillation',
  'stroke': 'stroke-and-tia',
  'tia': 'stroke-and-tia',
  'type-1-diabetes': 'diabetes-type-1',
  'type-2-diabetes': 'diabetes-type-2',
  'diabetic-ketoacidosis': 'diabetes-type-1',
  'dka': 'diabetes-type-1',
  'hypothyroidism': 'hypothyroidism',
  'hyperthyroidism': 'hyperthyroidism',
  'uti': 'urinary-tract-infection-lower-women',
  'urinary-tract-infection': 'urinary-tract-infection-lower-women',
  'sepsis': 'sepsis',
  'pneumonia': 'pneumonia',
  'community-acquired-pneumonia': 'pneumonia',
  'cap': 'pneumonia',
  'hospital-acquired-pneumonia': 'pneumonia',
  'depression': 'depression',
  'anxiety': 'generalized-anxiety-disorder',
  'epilepsy': 'epilepsy',
  'migraine': 'migraine',
  'gord': 'gastro-oesophageal-reflux-disease',
  'gastro-oesophageal-reflux-disease': 'gastro-oesophageal-reflux-disease',
  'gastroesophageal-reflux-disease': 'gastro-oesophageal-reflux-disease',
  'peptic-ulcer': 'dyspepsia',
  'dyspepsia': 'dyspepsia',
  'eczema': 'eczema-atopic',
  'atopic-eczema': 'eczema-atopic',
  'atopic-dermatitis': 'eczema-atopic',
  'psoriasis': 'psoriasis',
  'osteoporosis': 'osteoporosis-prevention-of-fragility-fractures',
  'rheumatoid-arthritis': 'rheumatoid-arthritis',
  'gout': 'gout',
  'ckd': 'chronic-kidney-disease',
  'chronic-kidney-disease': 'chronic-kidney-disease',
  'kidney-disease': 'chronic-kidney-disease',
  'anaphylaxis': 'anaphylaxis',
  'otitis-media': 'otitis-media-acute',
  'dvt': 'deep-vein-thrombosis',
  'deep-vein-thrombosis': 'deep-vein-thrombosis',
  'venous-thromboembolism': 'deep-vein-thrombosis',
  'vte': 'deep-vein-thrombosis',
  'coronary-syndrome': 'acute-coronary-syndromes',
  'acute-coronary-syndromes': 'acute-coronary-syndromes',
  'nstemi': 'acute-coronary-syndromes',
  'stemi': 'acute-coronary-syndromes',
  'angina': 'stable-angina',
  'anaemia': 'anaemia-iron-deficiency',
  'iron-deficiency': 'anaemia-iron-deficiency',
  'meningitis': 'meningitis-bacterial',
  'copd-exacerbation': 'chronic-obstructive-pulmonary-disease',
  'chest-infection': 'chest-infections-adult',
  'back-pain': 'back-pain-low-without-radiculopathy',
  'low-back-pain': 'back-pain-low-without-radiculopathy',
  'knee-pain': 'knee-pain',
  'shoulder-pain': 'shoulder-pain',
  'chest-pain': 'chest-pain',
  'headache': 'headache',
  'dizziness': 'dizziness-vertigo',
  'vertigo': 'dizziness-vertigo',
  'palpitations': 'palpitations',
  'syncope': 'syncope',
  'tinnitus': 'tinnitus',
  'alcohol': 'alcohol-problem-drinking',
  'smoking-cessation': 'stop-smoking',
  'obesity': 'obesity',
  'palliative-care': 'palliative-cancer-care-pain',
};

export function toConditionSlug(topic: string): string {
  const stripped = topic
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\b(management|diagnosis|recognition|treatment|exacerbation|prevention|care|overview|approach|assessment|investigation|workup|acute|chronic|mellitus|adults|in)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  return toSlug(stripped || topic);
}

export function toCKSSlug(topic: string): string | null {
  const base = toConditionSlug(topic);
  return CKS_SLUG_MAP[base] ?? null;
}

export function toNICEUrl(topic: string): string | null {
  const base = toConditionSlug(topic);
  const code = NICE_GUIDELINE_MAP[base];
  return code ? `https://www.nice.org.uk/guidance/${code}` : null;
}

export function toNICEVisualUrl(topic: string): string | null {
  const base = toConditionSlug(topic);
  const code = NICE_GUIDELINE_MAP[base];
  if (!code) return null;
  return NICE_VISUAL_SUMMARY_MAP[code] ?? null;
}

const BNF_DRUG_CLASS_SLUGS = new Set([
  'anticoagulation', 'analgesics', 'antibacterials-principles-of-therapy',
  'lipid-regulating-drugs', 'antidepressant-drugs', 'hypnotics-and-anxiolytics',
  'contraception-overview', 'prescribing-in-renal-impairment',
  'respiratory-tract-infections', 'urinary-tract-infections',
  'parkinsons-disease-and-related-disorders',
]);

export function toBNFUrl(topic: string): string | null {
  const base = toConditionSlug(topic);
  const cksSlug = CKS_SLUG_MAP[base];
  if (cksSlug) return `https://cks.nice.org.uk/topics/${cksSlug}/`;
  const bnfSlug = BNF_TREATMENT_MAP[base];
  if (!bnfSlug) return null;
  if (BNF_DRUG_CLASS_SLUGS.has(bnfSlug)) return `https://bnf.nice.org.uk/treatment-summaries/${bnfSlug}/`;
  const q = toQ(base.replace(/-/g, ' '));
  return `https://cks.nice.org.uk/search#q=${q}`;
}

export function toESCUrl(topic: string): string | null {
  const base = toConditionSlug(topic);
  const slug = ESC_GUIDELINE_MAP[base];
  return slug ? `https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/${slug}/` : null;
}

export function toBTSUrl(topic: string): string | null {
  const base = toConditionSlug(topic);
  const slug = BTS_GUIDELINE_MAP[base];
  return slug ? `https://www.brit-thoracic.org.uk/clinical-resources/guidelines/${slug}/` : null;
}

export function toBSGUrl(topic: string): string | null {
  const base = toConditionSlug(topic);
  const category = BSG_GUIDELINE_MAP[base];
  return category ? `https://www.bsg.org.uk/clinical-guidance/${category}/` : null;
}

export function toRCOGUrl(topic: string): string | null {
  const base = toConditionSlug(topic);
  const slug = RCOG_GUIDELINE_MAP[base];
  return slug ? `https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/${slug}/` : null;
}

export interface RefLink { url: string; label: string; visualUrl?: string }

export function buildDynamicLink(text: string, contextTopic?: string): RefLink | null {
  if (!text) return null;
  const rawTopic = (contextTopic && contextTopic.length > 2)
    ? contextTopic
    : extractTopicFromLabel(text);
  const hasT = rawTopic.length > 2;
  const q = toQ(rawTopic);
  const cksSlug = toCKSSlug(rawTopic);

  if (/\bNICE\b/i.test(text)) {
    const specific = hasT ? toNICEUrl(rawTopic) : null;
    const visualUrl = hasT ? toNICEVisualUrl(rawTopic) : null;
    return {
      url: specific ?? (hasT ? `https://www.nice.org.uk/search#q=${q}&ndt=Guidance` : 'https://www.nice.org.uk/guidance'),
      label: hasT ? `NICE — ${rawTopic}` : 'NICE Guidelines',
      ...(visualUrl ? { visualUrl } : {}),
    };
  }
  if (/\bCKS\b|Clinical Knowledge Summaries/i.test(text)) {
    return {
      url: hasT
        ? (cksSlug ? `https://cks.nice.org.uk/topics/${cksSlug}/` : `https://cks.nice.org.uk/search#q=${q}`)
        : 'https://cks.nice.org.uk/topics',
      label: hasT ? `CKS — ${rawTopic}` : 'CKS Clinical Knowledge Summaries',
    };
  }
  if (/\bBNF\b|British National Formulary/i.test(text)) {
    const specific = hasT ? toBNFUrl(rawTopic) : null;
    const resolvedToCKS = specific?.includes('cks.nice.org.uk') ?? false;
    return {
      url: specific ?? (hasT ? `https://bnf.nice.org.uk/search/?q=${q}` : 'https://bnf.nice.org.uk/treatment-summaries/'),
      label: hasT
        ? (resolvedToCKS ? `CKS — ${rawTopic}` : `BNF — ${rawTopic}`)
        : 'BNF — British National Formulary',
    };
  }
  if (/\bGMC\b|Good Medical Practice/i.test(text)) {
    if (/consent/i.test(text)) return { url: 'https://www.gmc-uk.org/ethical-guidance/ethical-guidance-for-doctors/consent', label: 'GMC — Consent' };
    if (/child|0.18/i.test(text)) return { url: 'https://www.gmc-uk.org/ethical-guidance/ethical-guidance-for-doctors/0-18-years', label: 'GMC — 0-18 Years' };
    return {
      url: 'https://www.gmc-uk.org/professional-standards/professional-standards-for-doctors/good-medical-practice',
      label: 'GMC Good Medical Practice',
    };
  }
  if (/\bSIGN\b|Scottish Intercollegiate/i.test(text)) {
    return {
      url: hasT ? `https://www.sign.ac.uk/search/?q=${q}` : 'https://www.sign.ac.uk/our-guidelines/',
      label: hasT ? `SIGN — ${rawTopic}` : 'SIGN Guidelines',
    };
  }
  if (/\bRCGP\b|Royal College of General Practitioners/i.test(text)) {
    return {
      url: hasT
        ? (cksSlug ? `https://cks.nice.org.uk/topics/${cksSlug}/` : `https://cks.nice.org.uk/search#q=${q}`)
        : 'https://cks.nice.org.uk/topics',
      label: hasT ? `CKS (RCGP) — ${rawTopic}` : 'CKS — RCGP-aligned Guidelines',
    };
  }
  if (/\bESC\b|European Society of Cardiology/i.test(text)) {
    const specific = hasT ? toESCUrl(rawTopic) : null;
    if (specific) return { url: specific, label: hasT ? `ESC — ${rawTopic}` : 'ESC Clinical Practice Guidelines' };
    if (/atrial fibrillation|\bAF\b/i.test(text)) return { url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/', label: 'ESC — Atrial Fibrillation' };
    if (/STEMI|acute coronary|myocardial infarction|\bMI\b/i.test(text)) return { url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes-acs-guidelines/', label: 'ESC — ACS / STEMI' };
    if (/dyslipidaemia|lipid|cholesterol/i.test(text)) return { url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/dyslipidaemias/', label: 'ESC — Dyslipidaemia' };
    if (/heart failure/i.test(text)) return { url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-and-chronic-heart-failure/', label: 'ESC — Heart Failure' };
    return { url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/', label: hasT ? `ESC — ${rawTopic}` : 'ESC Clinical Practice Guidelines' };
  }
  if (/\bBTS\b|British Thoracic Society/i.test(text)) {
    const specific = hasT ? toBTSUrl(rawTopic) : null;
    if (specific) return { url: specific, label: hasT ? `BTS — ${rawTopic}` : 'BTS Guidelines' };
    if (/asthma/i.test(text)) return { url: 'https://www.brit-thoracic.org.uk/clinical-resources/guidelines/asthma-chronic/', label: 'BTS — Asthma' };
    if (/COPD|obstructive/i.test(text)) return { url: 'https://www.brit-thoracic.org.uk/clinical-resources/guidelines/', label: 'BTS — COPD Guidelines' };
    if (/pneumonia|\bCAP\b/i.test(text)) return { url: 'https://www.brit-thoracic.org.uk/clinical-resources/guidelines/pneumonia-adults/', label: 'BTS — Pneumonia' };
    if (/bronchiectasis/i.test(text)) return { url: 'https://www.brit-thoracic.org.uk/clinical-resources/guidelines/bronchiectasis-in-adults/', label: 'BTS — Bronchiectasis' };
    if (/pleural|effusion/i.test(text)) return { url: 'https://www.brit-thoracic.org.uk/clinical-resources/guidelines/pleural-disease/', label: 'BTS — Pleural Disease' };
    if (/pneumothorax/i.test(text)) return { url: 'https://www.brit-thoracic.org.uk/clinical-resources/guidelines/', label: 'BTS — Guidelines' };
    return { url: 'https://www.brit-thoracic.org.uk/clinical-resources/guidelines/', label: hasT ? `BTS — ${rawTopic}` : 'BTS Guidelines' };
  }
  if (/\bBSG\b|British Society of Gastroenterology/i.test(text)) {
    const specific = hasT ? toBSGUrl(rawTopic) : null;
    if (specific) return { url: specific, label: hasT ? `BSG — ${rawTopic}` : 'BSG Clinical Guidelines' };
    if (/GORD|reflux|oesophag/i.test(text)) return { url: 'https://www.bsg.org.uk/clinical-guidance/oesophageal/', label: 'BSG — Oesophageal / GORD' };
    if (/Crohn|ulcerative colitis|\bIBD\b/i.test(text)) return { url: 'https://www.bsg.org.uk/clinical-guidance/small-bowel-and-nutrition/', label: 'BSG — IBD' };
    if (/H\.?pylori|helicobacter|dyspepsia/i.test(text)) return { url: 'https://www.bsg.org.uk/clinical-guidance/upper-gi/', label: 'BSG — Upper GI / H. pylori' };
    if (/liver|hepatitis|cirrhosis/i.test(text)) return { url: 'https://www.bsg.org.uk/clinical-guidance/liver/', label: 'BSG — Liver' };
    if (/pancrea/i.test(text)) return { url: 'https://www.bsg.org.uk/clinical-guidance/pancreas/', label: 'BSG — Pancreas' };
    if (/colorectal|bowel cancer/i.test(text)) return { url: 'https://www.bsg.org.uk/clinical-guidance/colorectal/', label: 'BSG — Colorectal' };
    return { url: 'https://www.bsg.org.uk/clinical-guidance/', label: hasT ? `BSG — ${rawTopic}` : 'BSG Clinical Guidelines' };
  }
  if (/\bRCOG\b|Royal College of Obstetricians/i.test(text)) {
    const specific = hasT ? toRCOGUrl(rawTopic) : null;
    if (specific) return { url: specific, label: hasT ? `RCOG — ${rawTopic}` : 'RCOG Green-top Guidelines' };
    if (/pre.?eclampsia|hypertension in pregnancy/i.test(text)) return { url: 'https://www.nice.org.uk/guidance/ng133', label: 'NICE NG133 — Hypertension in Pregnancy' };
    if (/VTE|thromboembolism|\bDVT\b|pulmonary embolism/i.test(text)) return { url: 'https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/thrombosis-and-embolism-during-pregnancy-and-the-puerperium-acute-management-green-top-guideline-no-37b/', label: 'RCOG — VTE in Pregnancy' };
    if (/postpartum|PPH|haemorrhage/i.test(text)) return { url: 'https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/prevention-and-management-of-postpartum-haemorrhage-green-top-guideline-no-52/', label: 'RCOG — Postpartum Haemorrhage' };
    if (/ectopic/i.test(text)) return { url: 'https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/diagnosis-and-management-of-ectopic-pregnancy-green-top-guideline-no-21/', label: 'RCOG — Ectopic Pregnancy' };
    if (/miscarriage|early pregnancy loss/i.test(text)) return { url: 'https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/early-pregnancy-loss-management-green-top-guideline-no-25/', label: 'RCOG — Miscarriage' };
    if (/sepsis/i.test(text)) return { url: 'https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/bacterial-sepsis-following-pregnancy-green-top-guideline-no-64b/', label: 'RCOG — Sepsis in Pregnancy' };
    return { url: 'https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/', label: hasT ? `RCOG — ${rawTopic}` : 'RCOG Green-top Guidelines' };
  }
  if (/\bADA\b|American Diabetes Association/i.test(text)) {
    return { url: 'https://www.nice.org.uk/guidance/ng28', label: 'NICE NG28 — Type 2 Diabetes (ADA-aligned)' };
  }
  if (/\bMLA\b|Medical Licensing Assessment/i.test(text)) {
    return { url: 'https://www.gmc-uk.org/education/standards-guidance-and-curricula/curricula/medical-licensing-assessment', label: 'GMC MLA Content Map' };
  }
  if (/Foundation Programme/i.test(text)) {
    return { url: 'https://foundationprogramme.nhs.uk/curriculum/', label: 'Foundation Programme Curriculum' };
  }
  return null;
}

export const getReferenceUrl = (text: string, topic?: string): string | null =>
  buildDynamicLink(text, topic)?.url ?? null;

export interface NICERef {
  title: string;
  url: string;
  type: 'NICE Guideline' | 'NICE CKS';
  guidelineId?: string;
  relevance: string;
  primary?: boolean;
}

export function getNICEReferencesForQuestion(question: any): NICERef[] {
  const cat = (question.category || question.topic || '').toLowerCase();
  const topic = (question.topic || question.category || '').toLowerCase();
  const combined = cat + ' ' + topic;

  const refs: NICERef[] = [];

  if (/asthma/i.test(combined)) {
    refs.push({ title: 'NICE NG80 — Asthma: diagnosis, monitoring and chronic asthma management', url: 'https://www.nice.org.uk/guidance/ng80', type: 'NICE Guideline', guidelineId: 'NG80', relevance: 'Primary guideline for asthma step therapy and diagnosis', primary: true });
    refs.push({ title: 'NICE CKS — Asthma', url: 'https://cks.nice.org.uk/topics/asthma/', type: 'NICE CKS', relevance: 'Clinical summary of asthma management for primary care' });
  }
  if (/copd|obstructive pulmonary/i.test(combined)) {
    refs.push({ title: 'NICE NG115 — Chronic obstructive pulmonary disease in over 16s', url: 'https://www.nice.org.uk/guidance/ng115', type: 'NICE Guideline', guidelineId: 'NG115', relevance: 'Covers diagnosis, GOLD staging, pharmacological and non-pharmacological management', primary: true });
    refs.push({ title: 'NICE CKS — COPD', url: 'https://cks.nice.org.uk/topics/chronic-obstructive-pulmonary-disease/', type: 'NICE CKS', relevance: 'Practical prescribing and follow-up summary' });
  }
  if (/pneumonia/i.test(combined)) {
    refs.push({ title: 'NICE NG138 — Pneumonia (community-acquired): antimicrobial prescribing', url: 'https://www.nice.org.uk/guidance/ng138', type: 'NICE Guideline', guidelineId: 'NG138', relevance: 'Antibiotic selection by CURB-65 severity for CAP', primary: true });
    refs.push({ title: 'NICE CKS — Pneumonia', url: 'https://cks.nice.org.uk/topics/pneumonia/', type: 'NICE CKS', relevance: 'Clinical assessment, severity scoring and referral thresholds' });
  }
  if (/\bpe\b|pulmonary embolism|deep.vein|dvt|vte|thromboembolism/i.test(combined)) {
    refs.push({ title: 'NICE NG158 — Venous thromboembolic diseases: diagnosis, management and thrombophilia testing', url: 'https://www.nice.org.uk/guidance/ng158', type: 'NICE Guideline', guidelineId: 'NG158', relevance: 'Covers Wells score, anticoagulation choice and duration for DVT/PE', primary: true });
  }
  if (/bronchiectasis/i.test(combined)) {
    refs.push({ title: 'NICE NG117 — Bronchiectasis (non-cystic fibrosis)', url: 'https://www.nice.org.uk/guidance/ng117', type: 'NICE Guideline', guidelineId: 'NG117', relevance: 'Diagnosis criteria and airway clearance management', primary: true });
  }
  if (/\bibs\b|irritable bowel/i.test(combined)) {
    refs.push({ title: 'NICE NG61 — Irritable bowel syndrome in adults', url: 'https://www.nice.org.uk/guidance/ng61', type: 'NICE Guideline', guidelineId: 'NG61', relevance: 'Diagnostic criteria and pharmacological management of IBS', primary: true });
    refs.push({ title: 'NICE CKS — IBS', url: 'https://cks.nice.org.uk/topics/irritable-bowel-syndrome/', type: 'NICE CKS', relevance: 'Practical prescribing summary for primary care' });
  }
  if (/\bibd\b|crohn|ulcerative colitis/i.test(combined)) {
    refs.push({ title: "NICE NG129 — Crohn's disease and ulcerative colitis", url: 'https://www.nice.org.uk/guidance/ng129', type: 'NICE Guideline', guidelineId: 'NG129', relevance: 'Induction and maintenance therapies for IBD', primary: true });
  }
  if (/gord|reflux|oesophageal/i.test(combined)) {
    refs.push({ title: 'NICE CKS — Gastro-oesophageal reflux disease', url: 'https://cks.nice.org.uk/topics/gastro-oesophageal-reflux-disease/', type: 'NICE CKS', relevance: 'First-line PPI therapy, step-down approach and referral indications', primary: true });
  }
  if (/coeliac/i.test(combined)) {
    refs.push({ title: 'NICE NG20 — Coeliac disease: recognition, assessment and management', url: 'https://www.nice.org.uk/guidance/ng20', type: 'NICE Guideline', guidelineId: 'NG20', relevance: 'Serological testing, biopsy criteria and dietary management', primary: true });
  }
  if (/upper gi bleed|gi bleed|haematemesis|melaena/i.test(combined)) {
    refs.push({ title: 'NICE NG141 — Acute upper gastrointestinal bleeding in over 16s', url: 'https://www.nice.org.uk/guidance/ng141', type: 'NICE Guideline', guidelineId: 'NG141', relevance: 'Rockford/Blatchford scoring, endoscopy timing and resuscitation', primary: true });
  }
  if (/migraine|headache/i.test(combined)) {
    refs.push({ title: 'NICE NG150 — Headaches in over 12s: diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng150', type: 'NICE Guideline', guidelineId: 'NG150', relevance: 'Step therapy for acute migraine treatment and prophylaxis', primary: true });
    refs.push({ title: 'NICE CKS — Migraine', url: 'https://cks.nice.org.uk/topics/migraine/', type: 'NICE CKS', relevance: 'Acute and preventive treatment options' });
  }
  if (/epilepsy|seizure/i.test(combined)) {
    refs.push({ title: 'NICE NG217 — Epilepsies: diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng217', type: 'NICE Guideline', guidelineId: 'NG217', relevance: 'AED selection, monitoring and specialist referral', primary: true });
  }
  if (/stroke|\btia\b/i.test(combined)) {
    refs.push({ title: 'NICE NG128 — Stroke and transient ischaemic attack in over 16s', url: 'https://www.nice.org.uk/guidance/ng128', type: 'NICE Guideline', guidelineId: 'NG128', relevance: 'Acute management, secondary prevention and rehabilitation', primary: true });
  }
  if (/multiple sclerosis|\bms\b/i.test(combined)) {
    refs.push({ title: 'NICE NG220 — Multiple sclerosis in adults', url: 'https://www.nice.org.uk/guidance/ng220', type: 'NICE Guideline', guidelineId: 'NG220', relevance: 'Disease-modifying therapies and relapse management', primary: true });
  }
  if (/parkinson/i.test(combined)) {
    refs.push({ title: "NICE NG71 — Parkinson's disease in adults", url: 'https://www.nice.org.uk/guidance/ng71', type: 'NICE Guideline', guidelineId: 'NG71', relevance: 'First-line dopaminergic therapy and non-motor feature management', primary: true });
  }
  if (/depression/i.test(combined)) {
    refs.push({ title: 'NICE NG222 — Depression in adults: treatment and management', url: 'https://www.nice.org.uk/guidance/ng222', type: 'NICE Guideline', guidelineId: 'NG222', relevance: 'Antidepressant choice, monitoring and stepped-care model', primary: true });
  }
  if (/anxiety|gad|generalised anxiety/i.test(combined)) {
    refs.push({ title: 'NICE NG197 — Generalised anxiety disorder and panic disorder in adults', url: 'https://www.nice.org.uk/guidance/ng197', type: 'NICE Guideline', guidelineId: 'NG197', relevance: 'Stepped-care approach, SSRI/SNRI prescribing and CBT referral', primary: true });
  }
  if (/schizophrenia|psychosis/i.test(combined)) {
    refs.push({ title: 'NICE NG185 — Psychosis and schizophrenia in adults', url: 'https://www.nice.org.uk/guidance/ng185', type: 'NICE Guideline', guidelineId: 'NG185', relevance: 'Antipsychotic choice, clozapine criteria and monitoring', primary: true });
  }
  if (/adhd/i.test(combined)) {
    refs.push({ title: 'NICE NG87 — Attention deficit hyperactivity disorder: diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng87', type: 'NICE Guideline', guidelineId: 'NG87', relevance: 'Medication thresholds, stimulant use and follow-up intervals', primary: true });
  }
  if (/eating disorder|anorexia|bulimia/i.test(combined)) {
    refs.push({ title: 'NICE NG69 — Eating disorders: recognition and treatment', url: 'https://www.nice.org.uk/guidance/ng69', type: 'NICE Guideline', guidelineId: 'NG69', relevance: 'Assessment, medical monitoring and psychological intervention', primary: true });
  }
  if (/antenatal|prenatal|pregnancy care/i.test(combined)) {
    refs.push({ title: 'NICE NG201 — Antenatal care', url: 'https://www.nice.org.uk/guidance/ng201', type: 'NICE Guideline', guidelineId: 'NG201', relevance: 'Routine antenatal schedule, screening and folic acid supplementation', primary: true });
  }
  if (/pre.?eclampsia|hypertension in pregnancy/i.test(combined)) {
    refs.push({ title: 'NICE NG133 — Hypertension in pregnancy: diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng133', type: 'NICE Guideline', guidelineId: 'NG133', relevance: 'BP thresholds, labetalol/nifedipine use and eclampsia prevention', primary: true });
  }
  if (/endometriosis/i.test(combined)) {
    refs.push({ title: 'NICE NG73 — Endometriosis: diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng73', type: 'NICE Guideline', guidelineId: 'NG73', relevance: 'Hormonal management and surgical referral criteria', primary: true });
  }
  if (/menopause/i.test(combined)) {
    refs.push({ title: 'NICE NG23 — Menopause: diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng23', type: 'NICE Guideline', guidelineId: 'NG23', relevance: 'HRT prescribing, contraindications and monitoring', primary: true });
  }
  if (/ectopic/i.test(combined)) {
    refs.push({ title: 'NICE CKS — Ectopic pregnancy', url: 'https://cks.nice.org.uk/topics/ectopic-pregnancy/', type: 'NICE CKS', relevance: 'Diagnosis algorithm, methotrexate and surgical management', primary: true });
  }
  if (/fever|feverish|pyrexia/i.test(combined)) {
    refs.push({ title: 'NICE NG143 — Fever in under 5s: assessment and initial management', url: 'https://www.nice.org.uk/guidance/ng143', type: 'NICE Guideline', guidelineId: 'NG143', relevance: 'Traffic-light system for fever assessment and referral', primary: true });
  }
  if (/uti.*child|urinary.*child|child.*uti/i.test(combined)) {
    refs.push({ title: 'NICE NG224 — Urinary tract infection in under 16s', url: 'https://www.nice.org.uk/guidance/ng224', type: 'NICE Guideline', guidelineId: 'NG224', relevance: 'Antibiotic choice, imaging criteria and follow-up after childhood UTI', primary: true });
  }
  if (/constipation.*child|child.*constipation/i.test(combined)) {
    refs.push({ title: 'NICE CG99 — Constipation in children and young people', url: 'https://www.nice.org.uk/guidance/cg99', type: 'NICE Guideline', guidelineId: 'CG99', relevance: 'Osmotic laxative dosing (Movicol) and disimpaction regimen', primary: true });
  }
  if (/safeguarding/i.test(combined)) {
    refs.push({ title: 'NICE NG76 — Child abuse and neglect', url: 'https://www.nice.org.uk/guidance/ng76', type: 'NICE Guideline', guidelineId: 'NG76', relevance: 'Recognition, referral pathways and documentation requirements', primary: true });
  }
  if (/osteoporosis|fragility fracture/i.test(combined)) {
    refs.push({ title: 'NICE NG187 — Osteoporosis: assessing the risk of fragility fracture', url: 'https://www.nice.org.uk/guidance/ng187', type: 'NICE Guideline', guidelineId: 'NG187', relevance: 'FRAX/QFracture thresholds, bisphosphonate prescribing and monitoring', primary: true });
  }
  if (/rheumatoid arthritis/i.test(combined)) {
    refs.push({ title: 'NICE NG100 — Rheumatoid arthritis in adults', url: 'https://www.nice.org.uk/guidance/ng100', type: 'NICE Guideline', guidelineId: 'NG100', relevance: 'DMARD initiation, treat-to-target strategy and biologics criteria', primary: true });
  }
  if (/osteoarthritis/i.test(combined)) {
    refs.push({ title: 'NICE NG226 — Osteoarthritis in over 16s', url: 'https://www.nice.org.uk/guidance/ng226', type: 'NICE Guideline', guidelineId: 'NG226', relevance: 'Exercise, weight management and analgesic step-up in OA', primary: true });
  }
  if (/low back|back pain/i.test(combined)) {
    refs.push({ title: 'NICE NG59 — Low back pain and sciatica in over 16s', url: 'https://www.nice.org.uk/guidance/ng59', type: 'NICE Guideline', guidelineId: 'NG59', relevance: 'Exercise programme, imaging indications and surgical referral', primary: true });
  }
  if (/\bgout\b/i.test(combined)) {
    refs.push({ title: 'NICE NG219 — Gout: diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng219', type: 'NICE Guideline', guidelineId: 'NG219', relevance: 'Colchicine for acute attack, allopurinol initiation and urate targets', primary: true });
  }
  if (/\bacne\b/i.test(combined)) {
    refs.push({ title: 'NICE NG98 — Acne vulgaris: management', url: 'https://www.nice.org.uk/guidance/ng98', type: 'NICE Guideline', guidelineId: 'NG98', relevance: 'Topical/systemic antibiotic choice and isotretinoin referral', primary: true });
  }
  if (/eczema|atopic dermatitis/i.test(combined)) {
    refs.push({ title: 'NICE NG190 — Eczema in under 12s: atopic eczema', url: 'https://www.nice.org.uk/guidance/ng190', type: 'NICE Guideline', guidelineId: 'NG190', relevance: 'Emollient-first approach and topical corticosteroid potency ladder', primary: true });
    refs.push({ title: 'NICE CKS — Eczema — atopic', url: 'https://cks.nice.org.uk/topics/eczema-atopic/', type: 'NICE CKS', relevance: 'Management across all ages including adults' });
  }
  if (/psoriasis/i.test(combined)) {
    refs.push({ title: 'NICE NG96 — Psoriasis: assessment and management', url: 'https://www.nice.org.uk/guidance/ng96', type: 'NICE Guideline', guidelineId: 'NG96', relevance: 'PASI scoring, topical/systemic therapy and biologic criteria', primary: true });
  }
  if (/melanoma/i.test(combined)) {
    refs.push({ title: 'NICE NG14 — Melanoma: assessment and management', url: 'https://www.nice.org.uk/guidance/ng14', type: 'NICE Guideline', guidelineId: 'NG14', relevance: 'Two-week-wait referral criteria, staging and adjuvant therapy', primary: true });
  }
  if (/scabies/i.test(combined)) {
    refs.push({ title: 'NICE CKS — Scabies', url: 'https://cks.nice.org.uk/topics/scabies/', type: 'NICE CKS', relevance: 'Permethrin application, household treatment and crusted scabies', primary: true });
  }
  if (/\bckd\b|chronic kidney disease/i.test(combined)) {
    refs.push({ title: 'NICE NG203 — Chronic kidney disease: assessment and management', url: 'https://www.nice.org.uk/guidance/ng203', type: 'NICE Guideline', guidelineId: 'NG203', relevance: 'eGFR/ACR staging, ACE inhibitor use and referral thresholds', primary: true });
  }
  if (/\baki\b|acute kidney injury/i.test(combined)) {
    refs.push({ title: 'NICE NG148 — Acute kidney injury: prevention, detection and management', url: 'https://www.nice.org.uk/guidance/ng148', type: 'NICE Guideline', guidelineId: 'NG148', relevance: 'KDIGO staging, nephrotoxin avoidance and fluid resuscitation', primary: true });
  }
  if (/\buti\b|urinary tract infection/i.test(combined) && !/child/i.test(combined)) {
    refs.push({ title: 'NICE NG109 — Urinary tract infection (lower) — women', url: 'https://www.nice.org.uk/guidance/ng109', type: 'NICE Guideline', guidelineId: 'NG109', relevance: 'Nitrofurantoin/trimethoprim first-line and culture indications', primary: true });
  }
  if (/prostate cancer/i.test(combined)) {
    refs.push({ title: 'NICE NG131 — Prostate cancer: diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng131', type: 'NICE Guideline', guidelineId: 'NG131', relevance: 'PSA interpretation, biopsy criteria and staging', primary: true });
  }
  if (/nephrotic/i.test(combined)) {
    refs.push({ title: 'NICE CKS — Nephrotic syndrome', url: 'https://cks.nice.org.uk/topics/nephrotic-syndrome/', type: 'NICE CKS', relevance: 'Steroid therapy, oedema management and specialist referral', primary: true });
  }

  if (refs.length === 0) {
    if (/cardio/i.test(combined)) {
      refs.push({ title: 'NICE — Cardiovascular guidelines', url: 'https://www.nice.org.uk/search#q=cardiovascular&ndt=Guidance', type: 'NICE Guideline', relevance: 'All NICE cardiovascular guidance', primary: true });
    } else {
      const qTopic = question.topic || question.category || '';
      const niceUrl = toNICEUrl(qTopic);
      const cksSlug2 = toCKSSlug(qTopic);
      if (niceUrl) refs.push({ title: `NICE — ${qTopic}`, url: niceUrl, type: 'NICE Guideline', relevance: 'Most relevant NICE guideline for this topic', primary: true });
      if (cksSlug2) refs.push({ title: `NICE CKS — ${qTopic}`, url: `https://cks.nice.org.uk/topics/${cksSlug2}/`, type: 'NICE CKS', relevance: 'Clinical Knowledge Summary for primary care management' });
    }
  }

  let foundPrimary = false;
  return refs.map(r => {
    if (r.primary && !foundPrimary) { foundPrimary = true; return r; }
    return { ...r, primary: false };
  });
}
