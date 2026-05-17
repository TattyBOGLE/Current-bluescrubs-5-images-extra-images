import { 
  users, questions, userProgress, studyPlan, communityPosts, postReplies, 
  osceStations, userOsceAttempts, studySessions, userPreferences, performanceMetrics, studyReminders,
  globalScoreboard, weeklyLeaderboard, countryStats, achievements, userAchievements,
  block1Leaderboard, block2Leaderboard, block3Leaderboard,
  type User, type InsertUser, type Question, type InsertQuestion,
  type UserProgress, type InsertUserProgress, type StudyPlan, type InsertStudyPlan,
  type CommunityPost, type InsertCommunityPost, type PostReply, type InsertPostReply,
  type OsceStation, type InsertOsceStation, type UserOsceAttempt, type InsertUserOsceAttempt,
  type StudySession, type InsertStudySession, type UserPreferences, type InsertUserPreferences,
  type PerformanceMetrics, type InsertPerformanceMetrics, type StudyReminder, type InsertStudyReminder,
  type GlobalScoreboard, type InsertGlobalScoreboard, type WeeklyLeaderboard, type InsertWeeklyLeaderboard,
  type CountryStats, type InsertCountryStats, type Achievement, type InsertAchievement,
  type UserAchievement, type InsertUserAchievement,
  type Block1LeaderboardEntry, type InsertBlock1Entry,
  type Block2LeaderboardEntry, type InsertBlock2Entry,
  type Block3LeaderboardEntry, type InsertBlock3Entry
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import { GMC_QUESTION_BANK, getQuestionsByCategory, getRandomQuestions, type GMCQuestion } from "@shared/gmc-question-bank";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Questions
  getQuestions(examType: string, category?: string, limit?: number): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // GMC Questions
  getGMCQuestions(): Promise<import("@shared/gmc-question-bank").GMCQuestion[]>;
  getGMCQuestionsByCategory(category: string): Promise<import("@shared/gmc-question-bank").GMCQuestion[]>;
  getRandomGMCQuestions(count: number, category?: string): Promise<import("@shared/gmc-question-bank").GMCQuestion[]>;

  // User Progress
  getUserProgress(userId: number): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserStats(userId: number): Promise<{
    totalAnswered: number;
    correctAnswers: number;
    averageTime: number;
    categoryStats: Record<string, { correct: number; total: number }>;
  }>;

  // Study Plan
  getUserStudyPlan(userId: number, date: string): Promise<StudyPlan | undefined>;
  createStudyPlan(plan: InsertStudyPlan): Promise<StudyPlan>;
  updateStudyPlan(id: number, updates: Partial<StudyPlan>): Promise<StudyPlan | undefined>;

  // Community
  getCommunityPosts(category?: string, limit?: number): Promise<(CommunityPost & { author: Pick<User, 'username'> })[]>;
  getCommunityPost(id: number): Promise<CommunityPost | undefined>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  getPostReplies(postId: number): Promise<(PostReply & { author: Pick<User, 'username'> })[]>;
  createPostReply(reply: InsertPostReply): Promise<PostReply>;

  // OSCE Stations
  getOsceStations(): Promise<OsceStation[]>;
  getOsceStation(id: number): Promise<OsceStation | undefined>;
  createOsceStation(station: InsertOsceStation): Promise<OsceStation>;
  getUserOsceAttempts(userId: number): Promise<UserOsceAttempt[]>;
  createUserOsceAttempt(attempt: InsertUserOsceAttempt): Promise<UserOsceAttempt>;

  // Study Scheduler
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: number, updates: Partial<UserPreferences>): Promise<UserPreferences>;
  
  getUserStudySessions(userId: number, filters?: { startDate?: Date; endDate?: Date; completed?: boolean }): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  updateStudySession(sessionId: string, updates: Partial<StudySession>): Promise<StudySession>;
  
  getUserPerformanceMetrics(userId: number, filters?: { category?: string; difficulty?: string }): Promise<PerformanceMetrics[]>;
  createPerformanceMetrics(metrics: InsertPerformanceMetrics): Promise<PerformanceMetrics>;
  
  getUserStudyReminders(userId: number, filters?: { upcoming?: boolean; sent?: boolean }): Promise<StudyReminder[]>;
  createStudyReminder(reminder: InsertStudyReminder): Promise<StudyReminder>;

  // Global Scoreboard
  getGlobalScoreboard(filters?: { category?: string; country?: string; limit?: number }): Promise<(GlobalScoreboard & { username: string; country: string; city: string; flagEmoji: string })[]>;
  getWeeklyLeaderboard(filters?: { country?: string; limit?: number }): Promise<(WeeklyLeaderboard & { username: string; country: string; flagEmoji: string })[]>;
  getCountryStats(): Promise<CountryStats[]>;
  updateUserLocation(userId: number, location: { country: string; city: string; flagEmoji: string }): Promise<void>;
  updateScoreboard(userId: number, scoreData: { questionsAnswered: number; correctAnswers: number; studyTime: number; category: string }): Promise<void>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;

  // Block-based Leaderboards
  insertBlock1Entry(entry: InsertBlock1Entry): Promise<Block1LeaderboardEntry>;
  insertBlock2Entry(entry: InsertBlock2Entry): Promise<Block2LeaderboardEntry>;
  insertBlock3Entry(entry: InsertBlock3Entry): Promise<Block3LeaderboardEntry>;
  getBlock1Leaderboard(questionCount: number, category: string, difficulty: string, limit: number): Promise<Block1LeaderboardEntry[]>;
  getBlock2Leaderboard(timeLimit: number, category: string, difficulty: string, limit: number): Promise<Block2LeaderboardEntry[]>;
  getBlock3Leaderboard(limit: number): Promise<Block3LeaderboardEntry[]>;
  getBlock3EntryByUser(userId: number): Promise<Block3LeaderboardEntry | undefined>;
  updateBlock3Entry(userId: number, updates: Partial<Block3LeaderboardEntry>): Promise<Block3LeaderboardEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private questions: Map<number, Question> = new Map();
  private userProgress: Map<number, UserProgress> = new Map();
  private studyPlans: Map<number, StudyPlan> = new Map();
  private communityPosts: Map<number, CommunityPost> = new Map();
  private postReplies: Map<number, PostReply> = new Map();
  private osceStations: Map<number, OsceStation> = new Map();
  private userOsceAttempts: Map<number, UserOsceAttempt> = new Map();
  
  private currentUserId = 1;
  private currentQuestionId = 1;
  private currentProgressId = 1;
  private currentPlanId = 1;
  private currentPostId = 1;
  private currentReplyId = 1;
  private currentStationId = 1;
  private currentAttemptId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create demo user
    const demoUser: User = {
      id: 1,
      email: "demo@plabmaster.com",
      username: "DemoUser",
      password: "password123",
      currentStage: "plab1",
      studyStreak: 7,
      totalPoints: 245,
      createdAt: new Date()
    };
    this.users.set(1, demoUser);
    this.currentUserId = 2; // Next user will get ID 2

    // GMC question bank will be loaded from external source
    
    // Create sample questions from GMC bank
    const sampleQuestions: InsertQuestion[] = [
      {
        type: "mcq",
        category: "cardiology", 
        difficulty: "medium",
        content: "A 65-year-old man presents with severe central chest pain that started 2 hours ago. The pain is crushing in nature and radiates to his left arm and jaw. His ECG shows ST elevation in leads II, III, and aVF. What is the most likely diagnosis?",
        options: [
          "Anterior myocardial infarction",
          "Inferior myocardial infarction", 
          "Pulmonary embolism",
          "Unstable angina",
          "Aortic dissection"
        ],
        correctAnswer: "Inferior myocardial infarction",
        explanation: "ST elevation in leads II, III, and aVF indicates an inferior STEMI, typically caused by occlusion of the right coronary artery.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "respiratory",
        difficulty: "easy",
        content: "A 28-year-old woman presents with sudden onset shortness of breath and pleuritic chest pain. She is on oral contraceptives. What is the most appropriate immediate investigation?",
        options: [
          "Chest X-ray",
          "ECG",
          "D-dimer",
          "CTPA",
          "Arterial blood gas"
        ],
        correctAnswer: "CTPA",
        explanation: "Young woman on oral contraceptives with acute onset pleuritic chest pain and dyspnea has high probability for PE. CTPA is the gold standard investigation.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "endocrinology",
        difficulty: "hard",
        content: "A 45-year-old woman presents with weight gain, moon face, and purple striae. Her 24-hour urinary free cortisol is elevated. What is the next most appropriate test?",
        options: [
          "Dexamethasone suppression test",
          "ACTH level",
          "MRI pituitary",
          "CT adrenals",
          "Midnight salivary cortisol"
        ],
        correctAnswer: "Dexamethasone suppression test",
        explanation: "After confirming hypercortisolism, the next step is to determine if it's ACTH-dependent or independent using dexamethasone suppression test.",
        examType: "plab1"
      },
      
      // ADDITIONAL CARDIOLOGY QUESTIONS
      {
        type: "mcq",
        category: "cardiology",
        difficulty: "hard",
        content: "A 45-year-old woman presents with palpitations and dizziness. ECG shows narrow complex tachycardia at 180 bpm. Carotid sinus massage terminates the arrhythmia. What is the most likely diagnosis?",
        options: [
          "Atrial fibrillation",
          "Atrial flutter", 
          "Supraventricular tachycardia",
          "Ventricular tachycardia",
          "Sinus tachycardia"
        ],
        correctAnswer: "Supraventricular tachycardia",
        explanation: "SVT typically responds to vagal maneuvers like carotid sinus massage, unlike other arrhythmias.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "cardiology",
        difficulty: "easy",
        content: "What is the first-line medication for hypertension in a 30-year-old African Caribbean patient?",
        options: [
          "ACE inhibitor",
          "Calcium channel blocker",
          "Beta blocker", 
          "Thiazide diuretic",
          "ARB"
        ],
        correctAnswer: "Calcium channel blocker",
        explanation: "NICE guidelines recommend calcium channel blockers as first-line for African Caribbean patients due to lower renin levels.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "cardiology",
        difficulty: "medium",
        content: "A patient with heart failure has an ejection fraction of 35%. Which medication has been shown to reduce mortality?",
        options: [
          "Furosemide",
          "Digoxin",
          "Ramipril",
          "Amlodipine",
          "Spironolactone"
        ],
        correctAnswer: "Ramipril",
        explanation: "ACE inhibitors like ramipril have proven mortality benefit in heart failure with reduced ejection fraction.",
        examType: "plab1"
      },

      // ADDITIONAL RESPIRATORY QUESTIONS
      {
        type: "mcq",
        category: "respiratory",
        difficulty: "medium",
        content: "A 70-year-old smoker presents with progressive dyspnea and productive cough. Spirometry shows FEV1/FVC ratio of 0.6. What is the most likely diagnosis?",
        options: [
          "Asthma",
          "COPD",
          "Pulmonary fibrosis",
          "Bronchiectasis",
          "Lung cancer"
        ],
        correctAnswer: "COPD",
        explanation: "FEV1/FVC ratio <0.7 in a smoker with progressive symptoms indicates COPD.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "respiratory",
        difficulty: "hard",
        content: "A patient with pneumonia fails to respond to amoxicillin. Chest X-ray shows bilateral infiltrates. What is the most likely organism?",
        options: [
          "Streptococcus pneumoniae",
          "Mycoplasma pneumoniae",
          "Haemophilus influenzae",
          "Staphylococcus aureus",
          "Legionella pneumophila"
        ],
        correctAnswer: "Mycoplasma pneumoniae",
        explanation: "Atypical pneumonia with bilateral infiltrates not responding to beta-lactams suggests Mycoplasma.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "respiratory",
        difficulty: "medium",
        content: "What is the most appropriate initial treatment for massive pulmonary embolism with hemodynamic instability?",
        options: [
          "Heparin",
          "Warfarin",
          "Thrombolysis",
          "IVC filter",
          "Embolectomy"
        ],
        correctAnswer: "Thrombolysis",
        explanation: "Massive PE with hemodynamic compromise requires immediate thrombolysis if no contraindications.",
        examType: "plab1"
      },

      // GASTROENTEROLOGY QUESTIONS
      {
        type: "mcq",
        category: "gastroenterology",
        difficulty: "medium",
        content: "A 35-year-old man presents with epigastric pain and coffee-ground vomiting. What is the most appropriate initial investigation?",
        options: [
          "CT abdomen",
          "Upper endoscopy",
          "H. pylori testing",
          "Abdominal ultrasound",
          "Barium swallow"
        ],
        correctAnswer: "Upper endoscopy",
        explanation: "Upper GI bleeding requires urgent endoscopy for diagnosis and potential therapeutic intervention.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "gastroenterology",
        difficulty: "easy",
        content: "What is the first-line treatment for H. pylori eradication?",
        options: [
          "Amoxicillin alone",
          "PPI + clarithromycin + amoxicillin",
          "Bismuth quadruple therapy",
          "PPI alone",
          "Metronidazole + clarithromycin"
        ],
        correctAnswer: "PPI + clarithromycin + amoxicillin",
        explanation: "Triple therapy with PPI, clarithromycin, and amoxicillin is first-line H. pylori treatment.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "gastroenterology",
        difficulty: "hard",
        content: "A patient with ulcerative colitis develops severe abdominal pain and distension. X-ray shows colonic dilatation >6cm. What is the most likely complication?",
        options: [
          "Perforation",
          "Toxic megacolon",
          "Stricture",
          "Malignancy",
          "Abscess"
        ],
        correctAnswer: "Toxic megacolon",
        explanation: "Toxic megacolon is characterized by colonic dilatation >6cm with systemic toxicity in IBD.",
        examType: "plab1"
      },

      // NEUROLOGY QUESTIONS
      {
        type: "mcq",
        category: "neurology",
        difficulty: "medium",
        content: "A 25-year-old woman presents with unilateral facial weakness, unable to close her eye or wrinkle her forehead. What is the most likely diagnosis?",
        options: [
          "Stroke",
          "Bell's palsy",
          "Multiple sclerosis",
          "Trigeminal neuralgia",
          "Ramsay Hunt syndrome"
        ],
        correctAnswer: "Bell's palsy",
        explanation: "Bell's palsy affects both upper and lower facial muscles, unlike upper motor neuron lesions.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "neurology",
        difficulty: "hard",
        content: "A patient presents with sudden severe headache described as 'worst headache of my life'. CT head is normal. What is the next most appropriate investigation?",
        options: [
          "MRI brain",
          "Lumbar puncture",
          "CT angiogram",
          "Repeat CT in 24 hours",
          "EEG"
        ],
        correctAnswer: "Lumbar puncture",
        explanation: "Suspected SAH with normal CT requires lumbar puncture to detect xanthochromia.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "neurology",
        difficulty: "easy",
        content: "What is the first-line treatment for focal seizures?",
        options: [
          "Phenytoin",
          "Carbamazepine",
          "Valproate",
          "Lamotrigine",
          "Levetiracetam"
        ],
        correctAnswer: "Carbamazepine",
        explanation: "Carbamazepine is first-line for focal seizures according to NICE guidelines.",
        examType: "plab1"
      },

      // PSYCHIATRY QUESTIONS
      {
        type: "mcq",
        category: "psychiatry",
        difficulty: "medium",
        content: "A 22-year-old student presents with low mood, loss of interest, and thoughts of self-harm for 6 weeks. What is the most appropriate initial treatment?",
        options: [
          "Antidepressants",
          "CBT",
          "Hospitalization",
          "Antipsychotics",
          "ECT"
        ],
        correctAnswer: "CBT",
        explanation: "CBT is first-line for moderate depression in young adults, with antidepressants if severe or CBT ineffective.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "psychiatry",
        difficulty: "hard",
        content: "A patient with bipolar disorder is started on lithium. Which blood test requires regular monitoring?",
        options: [
          "LFTs",
          "Creatinine",
          "FBC",
          "Lipids",
          "Glucose"
        ],
        correctAnswer: "Creatinine",
        explanation: "Lithium requires regular monitoring of renal function (creatinine) and thyroid function.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "psychiatry",
        difficulty: "easy",
        content: "What is the most common side effect of SSRIs?",
        options: [
          "Weight gain",
          "Gastrointestinal upset",
          "Sedation",
          "Hypotension",
          "Dry mouth"
        ],
        correctAnswer: "Gastrointestinal upset",
        explanation: "GI upset including nausea is the most common early side effect of SSRIs.",
        examType: "plab1"
      },

      // OBSTETRICS & GYNECOLOGY QUESTIONS
      {
        type: "mcq",
        category: "obstetrics-gynecology",
        difficulty: "medium",
        content: "A 28-year-old woman at 36 weeks gestation presents with severe headache and visual disturbances. BP is 160/110 mmHg. What is the most likely diagnosis?",
        options: [
          "Gestational hypertension",
          "Pre-eclampsia",
          "Eclampsia",
          "HELLP syndrome",
          "Chronic hypertension"
        ],
        correctAnswer: "Pre-eclampsia",
        explanation: "Pre-eclampsia is hypertension with end-organ dysfunction (visual symptoms) after 20 weeks gestation.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "obstetrics-gynecology",
        difficulty: "easy",
        content: "What is the recommended folic acid dose for women planning pregnancy?",
        options: [
          "200 mcg",
          "400 mcg",
          "800 mcg",
          "5 mg",
          "1 mg"
        ],
        correctAnswer: "400 mcg",
        explanation: "400 mcg daily folic acid is recommended from before conception until 12 weeks gestation.",
        examType: "plab1"
      },

      // PEDIATRICS QUESTIONS
      {
        type: "mcq",
        category: "pediatrics",
        difficulty: "medium",
        content: "A 3-year-old child presents with barking cough and stridor. Temperature is 38.5°C. What is the most likely diagnosis?",
        options: [
          "Epiglottitis",
          "Croup",
          "Bronchiolitis",
          "Pneumonia",
          "Asthma"
        ],
        correctAnswer: "Croup",
        explanation: "Croup presents with barking cough, stridor, and low-grade fever in young children.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "pediatrics",
        difficulty: "easy",
        content: "At what age should the MMR vaccine be first given?",
        options: [
          "6 months",
          "12 months",
          "18 months",
          "2 years",
          "4 years"
        ],
        correctAnswer: "12 months",
        explanation: "First MMR vaccine is given at 12-13 months as part of UK immunization schedule.",
        examType: "plab1"
      },

      // SURGERY QUESTIONS
      {
        type: "mcq",
        category: "surgery",
        difficulty: "medium",
        content: "A 65-year-old man presents with severe epigastric pain radiating to the back. Amylase is markedly elevated. What is the most common cause?",
        options: [
          "Alcohol",
          "Gallstones",
          "Drugs",
          "Trauma",
          "Malignancy"
        ],
        correctAnswer: "Gallstones",
        explanation: "Gallstones are the most common cause of acute pancreatitis, followed by alcohol.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "surgery",
        difficulty: "easy",
        content: "What is the most appropriate management for uncomplicated appendicitis?",
        options: [
          "Antibiotics alone",
          "Appendicectomy",
          "Conservative management",
          "CT scan",
          "Laparoscopy"
        ],
        correctAnswer: "Appendicectomy",
        explanation: "Appendicectomy remains the gold standard treatment for uncomplicated appendicitis.",
        examType: "plab1"
      },

      // EMERGENCY MEDICINE QUESTIONS
      {
        type: "mcq",
        category: "emergency-medicine",
        difficulty: "medium",
        content: "A patient presents with crushing chest pain and ST elevation in leads V1-V4. What is the most appropriate immediate treatment?",
        options: [
          "Aspirin",
          "Primary PCI",
          "Thrombolysis",
          "GTN",
          "Morphine"
        ],
        correctAnswer: "Primary PCI",
        explanation: "Anterior STEMI requires primary PCI if available within 120 minutes, otherwise thrombolysis.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "emergency-medicine",
        difficulty: "easy",
        content: "What is the correct compression:ventilation ratio for adult CPR?",
        options: [
          "15:2",
          "30:2",
          "5:1",
          "3:1",
          "100:2"
        ],
        correctAnswer: "30:2",
        explanation: "Adult CPR uses 30 chest compressions to 2 ventilations.",
        examType: "plab1"
      },

      // PHARMACOLOGY QUESTIONS
      {
        type: "mcq",
        category: "pharmacology",
        difficulty: "medium",
        content: "Which medication should be stopped before contrast imaging due to risk of lactic acidosis?",
        options: [
          "Ramipril",
          "Metformin",
          "Atorvastatin",
          "Aspirin",
          "Warfarin"
        ],
        correctAnswer: "Metformin",
        explanation: "Metformin should be stopped before contrast to prevent contrast-induced nephropathy and lactic acidosis.",
        examType: "plab1"
      },
      {
        type: "mcq",
        category: "pharmacology",
        difficulty: "easy",
        content: "What is the mechanism of action of simvastatin?",
        options: [
          "ACE inhibition",
          "HMG-CoA reductase inhibition",
          "Beta blockade",
          "Calcium channel blockade",
          "Angiotensin receptor blockade"
        ],
        correctAnswer: "HMG-CoA reductase inhibition",
        explanation: "Statins inhibit HMG-CoA reductase, the rate-limiting enzyme in cholesterol synthesis.",
        examType: "plab1"
      }
    ];

    sampleQuestions.forEach(q => this.createQuestion(q));

    // Create comprehensive OSCE stations - Full 18 Station PLAB 2 System
    const sampleStations: InsertOsceStation[] = [
      // HISTORY TAKING STATIONS
      {
        title: "History Taking - Chest Pain",
        category: "history-taking",
        description: "Take a focused history from a patient presenting with chest pain in the emergency department",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Introduction", "Presenting complaint", "History of presenting complaint", "Past medical history", "Social history"],
          communication: ["Appropriate body language", "Active listening", "Empathy", "Clear questions"],
          clinical: ["Systematic approach", "Relevant questions", "Risk factor assessment"]
        },
        patientInfo: {
          name: "John Smith",
          age: 55,
          presenting_complaint: "Chest pain for 3 hours",
          setting: "Emergency Department"
        }
      },
      {
        title: "History Taking - Shortness of Breath",
        category: "history-taking",
        description: "Take a comprehensive history from a patient with acute shortness of breath",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Introduction", "Presenting complaint", "Systems review", "Drug history", "Social history"],
          communication: ["Professional manner", "Clarifying questions", "Appropriate pace", "Summarizing"],
          clinical: ["Differential diagnosis consideration", "Relevant screening questions", "Risk stratification"]
        },
        patientInfo: {
          name: "Sarah Wilson",
          age: 68,
          presenting_complaint: "Increasing breathlessness over 2 weeks",
          setting: "GP Surgery"
        }
      },
      {
        title: "History Taking - Abdominal Pain",
        category: "history-taking",
        description: "Take a focused history from a patient with acute abdominal pain",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Introduction", "Pain assessment (SOCRATES)", "Associated symptoms", "Past medical history", "Family history"],
          communication: ["Empathy for pain", "Appropriate questioning", "Professional demeanor"],
          clinical: ["Systematic pain assessment", "Red flag symptoms", "Relevant investigations mentioned"]
        },
        patientInfo: {
          name: "David Brown",
          age: 42,
          presenting_complaint: "Severe right-sided abdominal pain for 6 hours",
          setting: "Emergency Department"
        }
      },

      // COMMUNICATION STATIONS
      {
        title: "Breaking Bad News - Cancer Diagnosis",
        category: "communication",
        description: "Break bad news to a patient about their recent cancer diagnosis",
        timeLimit: 10,
        markingCriteria: {
          structure: ["SPIKES framework", "Setting preparation", "Perception assessment", "Information sharing", "Emotional response", "Strategy planning"],
          communication: ["Empathy", "Clear language", "Appropriate pace", "Active listening"],
          clinical: ["Accurate information", "Support offered", "Follow-up arranged"]
        },
        patientInfo: {
          name: "Mary Johnson",
          age: 62,
          diagnosis: "Breast cancer",
          setting: "Outpatient clinic"
        }
      },
      {
        title: "Explaining Investigation Results",
        category: "communication",
        description: "Explain abnormal blood test results to a concerned patient",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Introduction", "Explanation of results", "Answering questions", "Next steps", "Safety netting"],
          communication: ["Clear explanations", "Checking understanding", "Reassurance where appropriate"],
          clinical: ["Accurate interpretation", "Appropriate follow-up", "Risk explanation"]
        },
        patientInfo: {
          name: "Robert Taylor",
          age: 45,
          results: "Elevated cholesterol and HbA1c",
          setting: "GP Surgery"
        }
      },
      {
        title: "Discussing Treatment Options",
        category: "communication",
        description: "Discuss treatment options with a patient newly diagnosed with hypertension",
        timeLimit: 10,
        markingCriteria: {
          structure: ["Diagnosis explanation", "Treatment options", "Lifestyle advice", "Monitoring plan", "Questions"],
          communication: ["Shared decision making", "Patient-centered approach", "Clear explanations"],
          clinical: ["Evidence-based options", "Side effect discussion", "Monitoring requirements"]
        },
        patientInfo: {
          name: "Linda Green",
          age: 58,
          diagnosis: "Hypertension",
          setting: "GP Surgery"
        }
      },

      // PHYSICAL EXAMINATION STATIONS
      {
        title: "Cardiovascular Examination",
        category: "examination",
        description: "Perform a complete cardiovascular examination on a patient with suspected heart murmur",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Introduction", "Inspection", "Palpation", "Auscultation", "Summary"],
          communication: ["Explanation of examination", "Patient comfort", "Professional manner"],
          clinical: ["Systematic approach", "Correct technique", "Accurate findings", "Appropriate conclusion"]
        },
        patientInfo: {
          name: "Michael Davis",
          age: 35,
          presenting_complaint: "Heart murmur found on routine examination",
          setting: "Cardiology Clinic"
        }
      },
      {
        title: "Respiratory Examination",
        category: "examination",
        description: "Examine the respiratory system of a patient with chronic cough",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Introduction", "Inspection", "Palpation", "Percussion", "Auscultation"],
          communication: ["Clear instructions", "Patient dignity", "Explanation of findings"],
          clinical: ["Systematic examination", "Correct technique", "Accurate interpretation"]
        },
        patientInfo: {
          name: "Jennifer White",
          age: 55,
          presenting_complaint: "Persistent cough for 6 weeks",
          setting: "Respiratory Clinic"
        }
      },
      {
        title: "Abdominal Examination",
        category: "examination",
        description: "Perform an abdominal examination on a patient with weight loss",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Introduction", "Inspection", "Palpation", "Percussion", "Auscultation"],
          communication: ["Gentle approach", "Explanation throughout", "Patient comfort"],
          clinical: ["Systematic examination", "Organomegaly assessment", "Mass detection technique"]
        },
        patientInfo: {
          name: "Thomas Anderson",
          age: 67,
          presenting_complaint: "Unexplained weight loss over 3 months",
          setting: "Gastroenterology Clinic"
        }
      },
      {
        title: "Neurological Examination - Upper Limb",
        category: "examination",
        description: "Examine the upper limb neurological system in a patient with weakness",
        timeLimit: 10,
        markingCriteria: {
          structure: ["Introduction", "Inspection", "Tone", "Power", "Reflexes", "Sensation", "Coordination"],
          communication: ["Clear instructions", "Encouragement", "Professional manner"],
          clinical: ["Systematic approach", "Accurate technique", "Lateralization", "Upper vs lower motor neuron signs"]
        },
        patientInfo: {
          name: "Patricia Moore",
          age: 72,
          presenting_complaint: "Left arm weakness following stroke",
          setting: "Neurology Ward"
        }
      },

      // PRACTICAL PROCEDURES
      {
        title: "Blood Pressure Measurement",
        category: "procedure",
        description: "Accurately measure blood pressure and counsel patient on hypertension",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Equipment check", "Patient preparation", "Measurement technique", "Recording", "Patient counseling"],
          communication: ["Explanation of procedure", "Results discussion", "Lifestyle advice"],
          clinical: ["Correct technique", "Accurate reading", "Appropriate cuff size", "Hypertension counseling"]
        },
        patientInfo: {
          name: "James Wilson",
          age: 50,
          indication: "Routine health check",
          setting: "GP Surgery"
        }
      },
      {
        title: "Peak Flow Measurement",
        category: "procedure",
        description: "Demonstrate and measure peak expiratory flow rate in an asthmatic patient",
        timeLimit: 6,
        markingCriteria: {
          structure: ["Equipment preparation", "Patient instruction", "Demonstration", "Patient performance", "Recording"],
          communication: ["Clear instructions", "Encouragement", "Technique correction"],
          clinical: ["Correct technique", "Accurate measurement", "Interpretation of results"]
        },
        patientInfo: {
          name: "Emma Thompson",
          age: 28,
          diagnosis: "Asthma monitoring",
          setting: "Respiratory Clinic"
        }
      },
      {
        title: "Venepuncture",
        category: "procedure",
        description: "Safely perform venepuncture for blood sampling",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Hand hygiene", "Patient identification", "Equipment preparation", "Procedure", "Disposal"],
          communication: ["Consent", "Explanation", "Reassurance"],
          clinical: ["Aseptic technique", "Correct vein selection", "Safe disposal", "Sample labeling"]
        },
        patientInfo: {
          name: "Christopher Lee",
          age: 40,
          indication: "Routine blood tests",
          setting: "Phlebotomy Clinic"
        }
      },

      // EMERGENCY SCENARIOS
      {
        title: "Basic Life Support",
        category: "emergency",
        description: "Manage a patient in cardiac arrest using BLS protocol",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Scene safety", "Responsiveness check", "Help activation", "CPR technique", "AED use"],
          communication: ["Clear commands", "Team communication", "Family interaction"],
          clinical: ["Correct CPR ratio", "Adequate compression depth", "Minimal interruptions"]
        },
        patientInfo: {
          name: "Cardiac Arrest Scenario",
          age: 65,
          scenario: "Collapsed in hospital corridor",
          setting: "Hospital Ward"
        }
      },
      {
        title: "Anaphylaxis Management",
        category: "emergency",
        description: "Recognize and manage acute anaphylactic reaction",
        timeLimit: 10,
        markingCriteria: {
          structure: ["Recognition", "ABCDE assessment", "Adrenaline administration", "Monitoring", "Follow-up"],
          communication: ["Clear instructions", "Reassurance", "Information gathering"],
          clinical: ["Rapid diagnosis", "Correct drug doses", "Monitoring priorities", "Discharge planning"]
        },
        patientInfo: {
          name: "Sophie Clark",
          age: 22,
          scenario: "Allergic reaction after eating nuts",
          setting: "Emergency Department"
        }
      },

      // MENTAL HEALTH STATIONS
      {
        title: "Depression Assessment",
        category: "mental-health",
        description: "Assess a patient presenting with low mood and suicidal ideation",
        timeLimit: 10,
        markingCriteria: {
          structure: ["Mental state examination", "Risk assessment", "Social history", "Management plan"],
          communication: ["Non-judgmental approach", "Active listening", "Empathy", "Safety planning"],
          clinical: ["Suicide risk factors", "Mental capacity", "Safeguarding", "Appropriate referral"]
        },
        patientInfo: {
          name: "Andrew Harris",
          age: 34,
          presenting_complaint: "Feeling depressed and having thoughts of self-harm",
          setting: "GP Surgery"
        }
      },
      {
        title: "Alcohol History Assessment",
        category: "mental-health",
        description: "Take a sensitive alcohol history from a patient with liver problems",
        timeLimit: 8,
        markingCriteria: {
          structure: ["Alcohol consumption patterns", "CAGE questionnaire", "Social impact", "Medical complications"],
          communication: ["Non-judgmental approach", "Motivational interviewing", "Confidentiality"],
          clinical: ["Accurate assessment", "Complications screening", "Support services", "Follow-up plan"]
        },
        patientInfo: {
          name: "Richard Baker",
          age: 48,
          presenting_complaint: "Abnormal liver function tests",
          setting: "GP Surgery"
        }
      },

      // PEDIATRIC STATIONS
      {
        title: "Pediatric Development Assessment",
        category: "pediatrics",
        description: "Assess development in a 2-year-old child with parental concerns",
        timeLimit: 10,
        markingCriteria: {
          structure: ["Development history", "Observation", "Milestone assessment", "Parental concerns", "Advice"],
          communication: ["Child-friendly approach", "Parent interaction", "Clear explanations"],
          clinical: ["Age-appropriate milestones", "Red flag signs", "Appropriate referrals"]
        },
        patientInfo: {
          name: "Oliver Martinez",
          age: 2,
          parental_concern: "Not talking as much as expected",
          setting: "Pediatric Clinic"
        }
      }
    ];

    sampleStations.forEach(s => this.createOsceStation(s));

    // Create sample community posts
    const samplePosts: InsertCommunityPost[] = [
      {
        userId: 1,
        title: "PLAB 1 Success! Here's how I prepared",
        content: "Just passed PLAB 1 with 78%! Here are the key strategies that helped me succeed...",
        category: "success-stories"
      },
      {
        userId: 1,
        title: "Struggling with cardiology MCQs - any tips?",
        content: "I'm consistently scoring low on cardiology questions. Any recommendations for study resources?",
        category: "plab1"
      }
    ];

    samplePosts.forEach(p => this.createCommunityPost(p));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      studyStreak: 0,
      totalPoints: 0,
      createdAt: new Date(),
      currentStage: insertUser.currentStage || 'plab1'
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Question methods
  async getQuestions(examType: string, category?: string, limit = 20): Promise<Question[]> {
    let filtered = Array.from(this.questions.values()).filter(q => q.examType === examType);
    
    if (category) {
      filtered = filtered.filter(q => q.category === category);
    }
    
    return filtered.slice(0, limit);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const question: Question = { 
      ...insertQuestion, 
      id,
      options: insertQuestion.options || []
    };
    this.questions.set(id, question);
    return question;
  }

  // User Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(p => p.userId === userId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentProgressId++;
    const progress: UserProgress = {
      ...insertProgress,
      id,
      attemptedAt: new Date()
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async getUserStats(userId: number): Promise<{
    totalAnswered: number;
    correctAnswers: number;
    averageTime: number;
    categoryStats: Record<string, { correct: number; total: number }>;
  }> {
    const userProgressList = await this.getUserProgress(userId);
    const totalAnswered = userProgressList.length;
    const correctAnswers = userProgressList.filter(p => p.isCorrect).length;
    const averageTime = userProgressList.reduce((sum, p) => sum + p.timeSpent, 0) / totalAnswered || 0;
    
    const categoryStats: Record<string, { correct: number; total: number }> = {};
    
    for (const progress of userProgressList) {
      const question = await this.getQuestion(progress.questionId);
      if (question) {
        if (!categoryStats[question.category]) {
          categoryStats[question.category] = { correct: 0, total: 0 };
        }
        categoryStats[question.category].total++;
        if (progress.isCorrect) {
          categoryStats[question.category].correct++;
        }
      }
    }

    return { totalAnswered, correctAnswers, averageTime, categoryStats };
  }

  // Study Plan methods
  async getUserStudyPlan(userId: number, date: string): Promise<StudyPlan | undefined> {
    return Array.from(this.studyPlans.values()).find(p => p.userId === userId && p.date === date);
  }

  async createStudyPlan(insertPlan: InsertStudyPlan): Promise<StudyPlan> {
    const id = this.currentPlanId++;
    const plan: StudyPlan = { 
      ...insertPlan, 
      id,
      completed: insertPlan.completed || false
    };
    this.studyPlans.set(id, plan);
    return plan;
  }

  async updateStudyPlan(id: number, updates: Partial<StudyPlan>): Promise<StudyPlan | undefined> {
    const plan = this.studyPlans.get(id);
    if (!plan) return undefined;
    
    const updatedPlan = { ...plan, ...updates };
    this.studyPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  // Community methods
  async getCommunityPosts(category?: string, limit = 20): Promise<(CommunityPost & { author: Pick<User, 'username'> })[]> {
    let filtered = Array.from(this.communityPosts.values());
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return filtered.slice(0, limit).map(post => {
      const author = this.users.get(post.userId);
      return {
        ...post,
        author: { username: author?.username || 'Unknown User' }
      };
    });
  }

  async getCommunityPost(id: number): Promise<CommunityPost | undefined> {
    return this.communityPosts.get(id);
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = this.currentPostId++;
    const post: CommunityPost = {
      ...insertPost,
      id,
      likes: 0,
      replies: 0,
      createdAt: new Date()
    };
    this.communityPosts.set(id, post);
    return post;
  }

  async getPostReplies(postId: number): Promise<(PostReply & { author: Pick<User, 'username'> })[]> {
    const replies = Array.from(this.postReplies.values()).filter(r => r.postId === postId);
    return replies.map(reply => {
      const author = this.users.get(reply.userId);
      return {
        ...reply,
        author: { username: author?.username || 'Unknown User' }
      };
    });
  }

  async createPostReply(insertReply: InsertPostReply): Promise<PostReply> {
    const id = this.currentReplyId++;
    const reply: PostReply = {
      ...insertReply,
      id,
      createdAt: new Date()
    };
    this.postReplies.set(id, reply);
    return reply;
  }

  // OSCE methods
  async getOsceStations(): Promise<OsceStation[]> {
    return Array.from(this.osceStations.values());
  }

  async getOsceStation(id: number): Promise<OsceStation | undefined> {
    return this.osceStations.get(id);
  }

  async createOsceStation(insertStation: InsertOsceStation): Promise<OsceStation> {
    const id = this.currentStationId++;
    const station: OsceStation = { ...insertStation, id };
    this.osceStations.set(id, station);
    return station;
  }

  async getUserOsceAttempts(userId: number): Promise<UserOsceAttempt[]> {
    return Array.from(this.userOsceAttempts.values()).filter(a => a.userId === userId);
  }

  async createUserOsceAttempt(insertAttempt: InsertUserOsceAttempt): Promise<UserOsceAttempt> {
    const id = this.currentAttemptId++;
    const attempt: UserOsceAttempt = {
      ...insertAttempt,
      id,
      completedAt: new Date(),
      feedback: insertAttempt.feedback || null
    };
    this.userOsceAttempts.set(id, attempt);
    return attempt;
  }
}



export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        currentStage: insertUser.currentStage || 'plab1'
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getQuestions(examType: string, category?: string, limit = 20): Promise<Question[]> {
    if (category) {
      return await db.select().from(questions)
        .where(and(eq(questions.examType, examType), eq(questions.category, category)))
        .limit(limit);
    }
    
    return await db.select().from(questions)
      .where(eq(questions.examType, examType))
      .limit(limit);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values({
        ...insertQuestion,
        options: insertQuestion.options || []
      })
      .returning();
    return question;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }

  async getUserStats(userId: number): Promise<{
    totalAnswered: number;
    correctAnswers: number;
    averageTime: number;
    categoryStats: Record<string, { correct: number; total: number }>;
  }> {
    const progressData = await this.getUserProgress(userId);
    
    const totalAnswered = progressData.length;
    const correctAnswers = progressData.filter(p => p.isCorrect).length;
    const averageTime = progressData.length > 0 
      ? progressData.reduce((acc, p) => acc + p.timeSpent, 0) / progressData.length 
      : 0;

    const categoryStats: Record<string, { correct: number; total: number }> = {};
    
    for (const progress of progressData) {
      const question = await this.getQuestion(progress.questionId);
      if (question) {
        if (!categoryStats[question.category]) {
          categoryStats[question.category] = { correct: 0, total: 0 };
        }
        categoryStats[question.category].total++;
        if (progress.isCorrect) {
          categoryStats[question.category].correct++;
        }
      }
    }

    return { totalAnswered, correctAnswers, averageTime, categoryStats };
  }

  async getUserStudyPlan(userId: number, date: string): Promise<StudyPlan | undefined> {
    const [plan] = await db
      .select()
      .from(studyPlan)
      .where(and(eq(studyPlan.userId, userId), eq(studyPlan.date, date)));
    return plan || undefined;
  }

  async createStudyPlan(insertPlan: InsertStudyPlan): Promise<StudyPlan> {
    const [plan] = await db
      .insert(studyPlan)
      .values({
        ...insertPlan,
        completed: insertPlan.completed || false
      })
      .returning();
    return plan;
  }

  async updateStudyPlan(id: number, updates: Partial<StudyPlan>): Promise<StudyPlan | undefined> {
    const [plan] = await db
      .update(studyPlan)
      .set(updates)
      .where(eq(studyPlan.id, id))
      .returning();
    return plan || undefined;
  }

  async getCommunityPosts(category?: string, limit = 20): Promise<(CommunityPost & { author: Pick<User, 'username'> })[]> {
    let query = db
      .select({
        id: communityPosts.id,
        userId: communityPosts.userId,
        title: communityPosts.title,
        content: communityPosts.content,
        category: communityPosts.category,
        createdAt: communityPosts.createdAt,
        author: {
          username: users.username
        }
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.userId, users.id));

    if (category) {
      query = query.where(eq(communityPosts.category, category));
    }

    const results = await query.limit(limit);
    return results as (CommunityPost & { author: Pick<User, 'username'> })[];
  }

  async getCommunityPost(id: number): Promise<CommunityPost | undefined> {
    const [post] = await db.select().from(communityPosts).where(eq(communityPosts.id, id));
    return post || undefined;
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const [post] = await db
      .insert(communityPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async getPostReplies(postId: number): Promise<(PostReply & { author: Pick<User, 'username'> })[]> {
    const results = await db
      .select({
        id: postReplies.id,
        postId: postReplies.postId,
        userId: postReplies.userId,
        content: postReplies.content,
        createdAt: postReplies.createdAt,
        author: {
          username: users.username
        }
      })
      .from(postReplies)
      .leftJoin(users, eq(postReplies.userId, users.id))
      .where(eq(postReplies.postId, postId));

    return results as (PostReply & { author: Pick<User, 'username'> })[];
  }

  async createPostReply(insertReply: InsertPostReply): Promise<PostReply> {
    const [reply] = await db
      .insert(postReplies)
      .values(insertReply)
      .returning();
    return reply;
  }

  async getOsceStations(): Promise<OsceStation[]> {
    return await db.select().from(osceStations);
  }

  async getOsceStation(id: number): Promise<OsceStation | undefined> {
    const [station] = await db.select().from(osceStations).where(eq(osceStations.id, id));
    return station || undefined;
  }

  async createOsceStation(insertStation: InsertOsceStation): Promise<OsceStation> {
    const [station] = await db
      .insert(osceStations)
      .values(insertStation)
      .returning();
    return station;
  }

  async getUserOsceAttempts(userId: number): Promise<UserOsceAttempt[]> {
    return await db.select().from(userOsceAttempts).where(eq(userOsceAttempts.userId, userId));
  }

  async createUserOsceAttempt(insertAttempt: InsertUserOsceAttempt): Promise<UserOsceAttempt> {
    const [attempt] = await db
      .insert(userOsceAttempts)
      .values({
        ...insertAttempt,
        feedback: insertAttempt.feedback || null
      })
      .returning();
    return attempt;
  }

  // Advanced Analytics Storage Methods
  async getUserStats(userId: number): Promise<any> {
    const progress = await this.getUserProgress(userId);
    
    if (progress.length === 0) {
      return {
        totalAnswered: 0,
        correctAnswers: 0,
        averageTime: 0,
        categoryStats: {},
        totalPoints: 0,
        recentSessions: []
      };
    }

    const totalAnswered = progress.length;
    const correctAnswers = progress.filter(p => p.isCorrect).length;
    const averageTime = progress.reduce((sum, p) => sum + p.timeSpent, 0) / totalAnswered;
    
    // Calculate category statistics
    const categoryStats: Record<string, any> = {};
    progress.forEach(p => {
      const category = p.category || 'general';
      if (!categoryStats[category]) {
        categoryStats[category] = { correct: 0, total: 0 };
      }
      categoryStats[category].total++;
      if (p.isCorrect) categoryStats[category].correct++;
    });

    // Calculate total points based on performance
    const totalPoints = correctAnswers * 10 + Math.floor(totalAnswered * 2);

    // Get recent sessions (last 10)
    const recentSessions = progress.slice(-10).map(p => ({
      date: p.attemptedAt,
      accuracy: p.isCorrect ? 100 : 0,
      questionsAnswered: 1,
      timeSpent: p.timeSpent
    }));

    return {
      totalAnswered,
      correctAnswers,
      averageTime,
      categoryStats,
      totalPoints,
      recentSessions
    };
  }

  async getAllUserStats(): Promise<any[]> {
    // Get all users and their stats
    const users = await db.select().from(this.users);
    const allStats = [];
    
    for (const user of users.slice(0, 100)) { // Limit to 100 users for performance
      const stats = await this.getUserStats(user.id);
      allStats.push({ ...stats, userId: user.id });
    }
    
    return allStats;
  }

  async getUserProgress(userId: number): Promise<any[]> {
    const progress = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    
    return progress.map(p => ({
      id: p.id,
      userId: p.userId,
      questionId: p.questionId,
      isCorrect: p.isCorrect,
      timeSpent: p.timeSpent,
      attemptedAt: p.attemptedAt,
      category: p.category || 'general'
    }));
  }

  // Gamification Storage Methods
  async getUserAchievements(userId: number): Promise<any[]> {
    // In a real implementation, this would query a user_achievements table
    // For now, return empty array since achievements are calculated dynamically
    return [];
  }

  async saveUserAchievement(userId: number, achievementId: string): Promise<void> {
    // In a real implementation, this would save to user_achievements table
    // For now, just log the achievement
    console.log(`Achievement unlocked: ${achievementId} for user ${userId}`);
  }

  async updateUserPoints(userId: number, points: number): Promise<void> {
    // Update user's total points
    const currentStats = await this.getUserStats(userId);
    const newTotal = currentStats.totalPoints + points;
    
    // In a real implementation, this would update a user points field
    console.log(`User ${userId} earned ${points} points. Total: ${newTotal}`);
  }

  async getLeaderboardData(timeframe: string, category?: string): Promise<any[]> {
    const users = await db.select().from(this.users);
    const leaderboard = [];
    
    for (const user of users.slice(0, 50)) { // Limit for performance
      const stats = await this.getUserStats(user.id);
      
      // Filter by category if specified
      let score = stats.totalPoints;
      if (category && stats.categoryStats[category]) {
        score = stats.categoryStats[category].correct * 10;
      }
      
      leaderboard.push({
        userId: user.id,
        username: user.username || `User${user.id}`,
        score,
        accuracy: stats.totalAnswered > 0 ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100) : 0,
        totalQuestions: stats.totalAnswered
      });
    }
    
    return leaderboard.sort((a, b) => b.score - a.score);
  }

  // Study Scheduler Methods
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    const [preferences] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [newPreferences] = await db.insert(userPreferences).values(preferences).returning();
    return newPreferences;
  }

  async updateUserPreferences(userId: number, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const [updatedPreferences] = await db.update(userPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId))
      .returning();
    return updatedPreferences;
  }

  async getUserStudySessions(
    userId: number, 
    filters?: { startDate?: Date; endDate?: Date; completed?: boolean }
  ): Promise<StudySession[]> {
    let query = db.select().from(studySessions).where(eq(studySessions.userId, userId));
    
    if (filters?.startDate) {
      query = query.where(and(
        eq(studySessions.userId, userId),
        sql`${studySessions.scheduledStart} >= ${filters.startDate}`
      ));
    }
    
    if (filters?.endDate) {
      query = query.where(and(
        eq(studySessions.userId, userId),
        sql`${studySessions.scheduledEnd} <= ${filters.endDate}`
      ));
    }
    
    if (filters?.completed !== undefined) {
      query = query.where(and(
        eq(studySessions.userId, userId),
        eq(studySessions.completed, filters.completed)
      ));
    }
    
    return await query.orderBy(studySessions.scheduledStart);
  }

  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const [newSession] = await db.insert(studySessions).values(session).returning();
    return newSession;
  }

  async updateStudySession(sessionId: string, updates: Partial<StudySession>): Promise<StudySession> {
    const [updatedSession] = await db.update(studySessions)
      .set(updates)
      .where(eq(studySessions.id, sessionId))
      .returning();
    return updatedSession;
  }

  async getUserPerformanceMetrics(
    userId: number,
    filters?: { category?: string; difficulty?: string }
  ): Promise<PerformanceMetrics[]> {
    let query = db.select().from(performanceMetrics).where(eq(performanceMetrics.userId, userId));
    
    if (filters?.category) {
      query = query.where(and(
        eq(performanceMetrics.userId, userId),
        eq(performanceMetrics.category, filters.category)
      ));
    }
    
    if (filters?.difficulty) {
      query = query.where(and(
        eq(performanceMetrics.userId, userId),
        eq(performanceMetrics.difficulty, filters.difficulty)
      ));
    }
    
    return await query.orderBy(performanceMetrics.lastStudied);
  }

  async createPerformanceMetrics(metrics: InsertPerformanceMetrics): Promise<PerformanceMetrics> {
    const [newMetrics] = await db.insert(performanceMetrics).values(metrics).returning();
    return newMetrics;
  }

  async getUserStudyReminders(
    userId: number,
    filters?: { upcoming?: boolean; sent?: boolean }
  ): Promise<StudyReminder[]> {
    let query = db.select().from(studyReminders).where(eq(studyReminders.userId, userId));
    
    if (filters?.upcoming) {
      query = query.where(and(
        eq(studyReminders.userId, userId),
        sql`${studyReminders.reminderTime} > NOW()`
      ));
    }
    
    if (filters?.sent !== undefined) {
      query = query.where(and(
        eq(studyReminders.userId, userId),
        eq(studyReminders.sent, filters.sent)
      ));
    }
    
    return await query.orderBy(studyReminders.reminderTime);
  }

  async createStudyReminder(reminder: InsertStudyReminder): Promise<StudyReminder> {
    const [newReminder] = await db.insert(studyReminders).values(reminder).returning();
    return newReminder;
  }

  // Global Scoreboard Methods
  async getGlobalScoreboard(filters?: { category?: string; country?: string; limit?: number }): Promise<(GlobalScoreboard & { username: string; country: string; city: string; flagEmoji: string })[]> {
    let query = db
      .select({
        id: globalScoreboard.id,
        userId: globalScoreboard.userId,
        totalScore: globalScoreboard.totalScore,
        questionsAnswered: globalScoreboard.questionsAnswered,
        correctAnswers: globalScoreboard.correctAnswers,
        accuracyRate: globalScoreboard.accuracyRate,
        studyStreak: globalScoreboard.studyStreak,
        totalStudyTime: globalScoreboard.totalStudyTime,
        plabCategory: globalScoreboard.plabCategory,
        rank: globalScoreboard.rank,
        countryRank: globalScoreboard.countryRank,
        lastActive: globalScoreboard.lastActive,
        updatedAt: globalScoreboard.updatedAt,
        username: users.username,
        country: users.country,
        city: users.city,
        flagEmoji: users.flagEmoji,
      })
      .from(globalScoreboard)
      .leftJoin(users, eq(globalScoreboard.userId, users.id))
      .where(eq(users.isLocationPublic, true));

    if (filters?.category && filters.category !== "all") {
      query = query.where(eq(globalScoreboard.plabCategory, filters.category));
    }

    if (filters?.country && filters.country !== "all") {
      query = query.where(eq(users.country, filters.country));
    }

    const results = await query
      .orderBy(globalScoreboard.rank)
      .limit(filters?.limit || 100);

    return results.map(row => ({
      ...row,
      country: row.country || "Unknown",
      city: row.city || "Unknown", 
      flagEmoji: row.flagEmoji || "🌍"
    }));
  }

  async getWeeklyLeaderboard(filters?: { country?: string; limit?: number }): Promise<(WeeklyLeaderboard & { username: string; country: string; flagEmoji: string })[]> {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    
    let query = db
      .select({
        id: weeklyLeaderboard.id,
        userId: weeklyLeaderboard.userId,
        weekStart: weeklyLeaderboard.weekStart,
        weekEnd: weeklyLeaderboard.weekEnd,
        questionsThisWeek: weeklyLeaderboard.questionsThisWeek,
        correctThisWeek: weeklyLeaderboard.correctThisWeek,
        studyTimeThisWeek: weeklyLeaderboard.studyTimeThisWeek,
        weeklyRank: weeklyLeaderboard.weeklyRank,
        countryWeeklyRank: weeklyLeaderboard.countryWeeklyRank,
        createdAt: weeklyLeaderboard.createdAt,
        username: users.username,
        country: users.country,
        flagEmoji: users.flagEmoji,
      })
      .from(weeklyLeaderboard)
      .leftJoin(users, eq(weeklyLeaderboard.userId, users.id))
      .where(eq(weeklyLeaderboard.weekStart, weekStart.toISOString().split('T')[0]));

    if (filters?.country && filters.country !== "all") {
      query = query.where(eq(users.country, filters.country));
    }

    const results = await query
      .orderBy(weeklyLeaderboard.weeklyRank)
      .limit(filters?.limit || 50);

    return results.map(row => ({
      ...row,
      country: row.country || "Unknown",
      flagEmoji: row.flagEmoji || "🌍"
    }));
  }

  async getCountryStats(): Promise<CountryStats[]> {
    return await db.select().from(countryStats).orderBy(countryStats.totalUsers);
  }

  async updateUserLocation(userId: number, location: { country: string; city: string; flagEmoji: string }): Promise<void> {
    await db
      .update(users)
      .set({
        country: location.country,
        city: location.city,
        flagEmoji: location.flagEmoji,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      .where(eq(users.id, userId));

    // Update or create country stats
    const existingCountry = await db
      .select()
      .from(countryStats)
      .where(eq(countryStats.country, location.country))
      .limit(1);

    if (existingCountry.length === 0) {
      await db.insert(countryStats).values({
        country: location.country,
        flagEmoji: location.flagEmoji,
        totalUsers: 1,
        activeUsers: 1,
        averageScore: 0,
        topUserScore: 0,
        totalQuestionsAnswered: 0,
      });
    } else {
      await db
        .update(countryStats)
        .set({
          totalUsers: sql`${countryStats.totalUsers} + 1`,
          activeUsers: sql`${countryStats.activeUsers} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(countryStats.country, location.country));
    }
  }

  async updateScoreboard(userId: number, scoreData: { questionsAnswered: number; correctAnswers: number; studyTime: number; category: string }): Promise<void> {
    const accuracyRate = scoreData.questionsAnswered > 0 ? (scoreData.correctAnswers / scoreData.questionsAnswered) * 100 : 0;
    const points = scoreData.correctAnswers * 10 + (accuracyRate > 80 ? 50 : 0);

    // Update or create global scoreboard entry
    const existingScore = await db
      .select()
      .from(globalScoreboard)
      .where(eq(globalScoreboard.userId, userId))
      .limit(1);

    if (existingScore.length === 0) {
      await db.insert(globalScoreboard).values({
        userId,
        totalScore: points,
        questionsAnswered: scoreData.questionsAnswered,
        correctAnswers: scoreData.correctAnswers,
        accuracyRate,
        studyStreak: 1,
        totalStudyTime: scoreData.studyTime,
        plabCategory: scoreData.category,
        rank: 0,
        countryRank: 0,
      });
    } else {
      await db
        .update(globalScoreboard)
        .set({
          totalScore: sql`${globalScoreboard.totalScore} + ${points}`,
          questionsAnswered: sql`${globalScoreboard.questionsAnswered} + ${scoreData.questionsAnswered}`,
          correctAnswers: sql`${globalScoreboard.correctAnswers} + ${scoreData.correctAnswers}`,
          accuracyRate: sql`ROUND((${globalScoreboard.correctAnswers} + ${scoreData.correctAnswers}) * 100.0 / (${globalScoreboard.questionsAnswered} + ${scoreData.questionsAnswered}), 2)`,
          totalStudyTime: sql`${globalScoreboard.totalStudyTime} + ${scoreData.studyTime}`,
          lastActive: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(globalScoreboard.userId, userId));
    }

    // Update weekly leaderboard
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const existingWeekly = await db
      .select()
      .from(weeklyLeaderboard)
      .where(and(
        eq(weeklyLeaderboard.userId, userId),
        eq(weeklyLeaderboard.weekStart, weekStart.toISOString().split('T')[0])
      ))
      .limit(1);

    if (existingWeekly.length === 0) {
      await db.insert(weeklyLeaderboard).values({
        userId,
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        questionsThisWeek: scoreData.questionsAnswered,
        correctThisWeek: scoreData.correctAnswers,
        studyTimeThisWeek: scoreData.studyTime,
        weeklyRank: 0,
        countryWeeklyRank: 0,
      });
    } else {
      await db
        .update(weeklyLeaderboard)
        .set({
          questionsThisWeek: sql`${weeklyLeaderboard.questionsThisWeek} + ${scoreData.questionsAnswered}`,
          correctThisWeek: sql`${weeklyLeaderboard.correctThisWeek} + ${scoreData.correctAnswers}`,
          studyTimeThisWeek: sql`${weeklyLeaderboard.studyTimeThisWeek} + ${scoreData.studyTime}`,
        })
        .where(and(
          eq(weeklyLeaderboard.userId, userId),
          eq(weeklyLeaderboard.weekStart, weekStart.toISOString().split('T')[0])
        ));
    }

    // Recalculate ranks (simplified version)
    await this.recalculateRanks();
  }

  private async recalculateRanks(): Promise<void> {
    // Global ranks
    const globalUsers = await db
      .select()
      .from(globalScoreboard)
      .orderBy(sql`${globalScoreboard.totalScore} DESC`);

    for (let i = 0; i < globalUsers.length; i++) {
      await db
        .update(globalScoreboard)
        .set({ rank: i + 1 })
        .where(eq(globalScoreboard.id, globalUsers[i].id));
    }

    // Weekly ranks
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    
    const weeklyUsers = await db
      .select()
      .from(weeklyLeaderboard)
      .where(eq(weeklyLeaderboard.weekStart, weekStart.toISOString().split('T')[0]))
      .orderBy(sql`${weeklyLeaderboard.questionsThisWeek} DESC`);

    for (let i = 0; i < weeklyUsers.length; i++) {
      await db
        .update(weeklyLeaderboard)
        .set({ weeklyRank: i + 1 })
        .where(eq(weeklyLeaderboard.id, weeklyUsers[i].id));
    }
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }

  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    return await db
      .select({
        id: userAchievements.id,
        userId: userAchievements.userId,
        achievementId: userAchievements.achievementId,
        unlockedAt: userAchievements.unlockedAt,
        isDisplayed: userAchievements.isDisplayed,
        achievement: achievements,
      })
      .from(userAchievements)
      .leftJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(userAchievements.unlockedAt);
  }

  // Block-based Leaderboard Methods
  async insertBlock1Entry(entry: InsertBlock1Entry): Promise<Block1LeaderboardEntry> {
    const [newEntry] = await db.insert(block1Leaderboard).values(entry).returning();
    return newEntry;
  }

  async insertBlock2Entry(entry: InsertBlock2Entry): Promise<Block2LeaderboardEntry> {
    const [newEntry] = await db.insert(block2Leaderboard).values(entry).returning();
    return newEntry;
  }

  async insertBlock3Entry(entry: InsertBlock3Entry): Promise<Block3LeaderboardEntry> {
    const [newEntry] = await db.insert(block3Leaderboard).values(entry).returning();
    return newEntry;
  }

  async getBlock1Leaderboard(questionCount: number, category: string, difficulty: string, limit: number): Promise<Block1LeaderboardEntry[]> {
    const conditions = [];
    
    if (questionCount > 0) {
      conditions.push(eq(block1Leaderboard.questionCount, questionCount));
    }
    
    if (category !== 'all') {
      conditions.push(eq(block1Leaderboard.category, category));
    }
    
    if (difficulty !== 'all') {
      conditions.push(eq(block1Leaderboard.difficulty, difficulty));
    }
    
    let query = db.select().from(block1Leaderboard);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query
      .orderBy(sql`${block1Leaderboard.score} DESC`)
      .limit(limit);
  }

  async getBlock2Leaderboard(timeLimit: number, category: string, difficulty: string, limit: number): Promise<Block2LeaderboardEntry[]> {
    const conditions = [];
    
    if (timeLimit > 0) {
      conditions.push(eq(block2Leaderboard.timeLimit, timeLimit));
    }
    
    if (category !== 'all') {
      conditions.push(eq(block2Leaderboard.category, category));
    }
    
    if (difficulty !== 'all') {
      conditions.push(eq(block2Leaderboard.difficulty, difficulty));
    }
    
    let query = db.select().from(block2Leaderboard);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query
      .orderBy(sql`${block2Leaderboard.score} DESC`)
      .limit(limit);
  }

  async getBlock3Leaderboard(limit: number): Promise<Block3LeaderboardEntry[]> {
    return await db
      .select()
      .from(block3Leaderboard)
      .orderBy(sql`${block3Leaderboard.score} DESC`)
      .limit(limit);
  }

  async getBlock3EntryByUser(userId: number): Promise<Block3LeaderboardEntry | undefined> {
    const [entry] = await db
      .select()
      .from(block3Leaderboard)
      .where(eq(block3Leaderboard.userId, userId))
      .limit(1);
    
    return entry;
  }

  async updateBlock3Entry(userId: number, updates: Partial<Block3LeaderboardEntry>): Promise<Block3LeaderboardEntry> {
    const [updatedEntry] = await db
      .update(block3Leaderboard)
      .set(updates)
      .where(eq(block3Leaderboard.userId, userId))
      .returning();
    
    return updatedEntry;
  }
}

export const storage = new DatabaseStorage();
