export const MEDICAL_CATEGORIES = [
  { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
  { id: 'respiratory', name: 'Respiratory', icon: '🫁' },
  { id: 'gastroenterology', name: 'Gastroenterology', icon: '🍎' },
  { id: 'neurology', name: 'Neurology', icon: '🧠' },
  { id: 'endocrinology', name: 'Endocrinology', icon: '⚡' },
  { id: 'rheumatology', name: 'Rheumatology', icon: '🦴' },
  { id: 'haematology', name: 'Haematology', icon: '🩸' },
  { id: 'psychiatry', name: 'Psychiatry', icon: '🧘' },
  { id: 'dermatology', name: 'Dermatology', icon: '🌟' },
  { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
  { id: 'obstetrics', name: 'Obstetrics & Gynecology', icon: '👩‍⚕️' },
  { id: 'surgery', name: 'Surgery', icon: '🔪' },
  { id: 'pharmacology', name: 'Pharmacology', icon: '💊' },
  { id: 'microbiology', name: 'Microbiology', icon: '🦠' },
  { id: 'radiology', name: 'Radiology', icon: '📸' },
  { id: 'pathology', name: 'Pathology', icon: '🔬' },
] as const;

export const OSCE_STATIONS = [
  { id: 'history-taking', name: 'History Taking', duration: 8 },
  { id: 'clinical-examination', name: 'Clinical Examination', duration: 6 },
  { id: 'communication', name: 'Communication Skills', duration: 8 },
  { id: 'practical-procedures', name: 'Practical Procedures', duration: 6 },
  { id: 'emergency', name: 'Emergency Management', duration: 8 },
  { id: 'data-interpretation', name: 'Data Interpretation', duration: 6 },
] as const;

export const COMMUNITY_CATEGORIES = [
  { id: 'plab1', name: 'PLAB 1 Questions', color: 'text-medical-blue' },
  { id: 'plab2', name: 'PLAB 2 OSCE', color: 'text-deep-rose' },
  { id: 'study-groups', name: 'Study Groups', color: 'text-mint-green' },
  { id: 'nhs', name: 'NHS Applications', color: 'text-amber-warning' },
  { id: 'success-stories', name: 'Success Stories', color: 'text-purple-accent' },
] as const;

export const NHS_CAREER_PATHS = [
  {
    id: 'foundation',
    title: 'Foundation Year 2',
    description: 'Most common entry point for PLAB graduates',
    duration: '12 months',
    salary: '£34,012 - £39,027',
    requirements: 'PLAB 1 & 2 passed'
  },
  {
    id: 'specialty',
    title: 'Specialty Training',
    description: 'Direct entry for experienced doctors',
    duration: '3-8 years',
    salary: '£40,257 - £69,325',
    requirements: 'PLAB + Experience'
  },
] as const;

export const STUDY_PLAN_TEMPLATES = {
  plab1: [
    { task: 'Daily MCQ Practice', target: 30, type: 'questions' },
    { task: 'Review Weak Topics', target: 45, type: 'minutes' },
    { task: 'Mock Exam', target: 1, type: 'exam' },
    { task: 'Flashcard Review', target: 50, type: 'cards' },
  ],
  plab2: [
    { task: 'OSCE Station Practice', target: 2, type: 'stations' },
    { task: 'Communication Skills', target: 30, type: 'minutes' },
    { task: 'Clinical Examination', target: 1, type: 'station' },
    { task: 'Scenario Discussion', target: 15, type: 'minutes' },
  ],
} as const;
