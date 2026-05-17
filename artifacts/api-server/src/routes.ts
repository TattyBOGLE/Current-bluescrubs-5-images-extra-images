import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAIEnabled, getAIStatus, suspendAI } from "./ai-config";
import { BNF_MEDICATIONS } from "./shared/bnf-integration";
import { 
  trackSession, 
  trackPageView, 
  trackTestActivity, 
  getUsageStats, 
  generateSessionId,
  cleanupOldSessions 
} from "./usage-analytics";
import fs from "fs";
import path from "path";
import { PLAB2_TEMPLATE_STATIONS, PLAB2_STATION_TYPES, PLAB2_SPECIALTIES } from "./plab2-templates";
import { generateUserFormatStations, saveUserFormatStations, loadUserFormatStations, getUserFormatStationCount } from './user-format-generator';
import { generateComprehensiveOSCEBank, loadComprehensiveOSCEBank, getOSCEBankStats } from './comprehensive-osce-generator';
import { generateInternationalStations, saveInternationalStations, loadInternationalStations, getInternationalStationCount, getSupportedExams } from './international-format-generator';
import { getContentIndependenceStatus, createManualStation, exportContentLibrary, validateContentSufficiency } from './content-independence';
import { loadUKQuestionBank, generateFullQuestionBank } from "./bulk-uk-generator";
import { 
  SUPPORTED_LANGUAGES, 
  getTranslationTemplate, 
  saveTranslation, 
  loadTranslations, 
  getTranslationStats,
  createTranslationManifest,
  CULTURAL_ADAPTATIONS 
} from './translation-system';
import { AdaptiveAIEngine } from './adaptive-ai-engine';
import { 
  translateStationIndependently, 
  batchTranslateStations, 
  saveIndependentTranslations,
  getIndependentTranslationStats,
  MEDICAL_TERMINOLOGY_DICTIONARY 
} from './independent-translation';
import { 
  generateQuestionFromTemplate, 
  generateOSCEStationFromTemplate, 
  generateMedicalGuidanceIndependently,
  createIndependentAlternatives,
  exportCompleteIndependentSystem 
} from './independent-content';
import { 
  analyzeVideoPerformanceIndependently, 
  generateIndependentFeedback,
  analyzeImageIndependently 
} from './independent-analysis';
import { hybridAI, HybridConfig } from './hybrid-ai-system';

// Independent Question Generation (No AI - keeps questions authentic)
async function generateMedicalQuestions(templates: any[], category: string, difficulty: string, count: number) {
  try {
    // Always use template-based generation for questions to maintain authenticity
    return generateQuestionFromTemplate(category, count);
    
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const categoryMappings = {
      'cardiovascular': 'Cardiovascular',
      'respiratory': 'Respiratory', 
      'infectious-diseases': 'Infectious Diseases',
      'endocrinology': 'Endocrinology',
      'gastroenterology': 'Gastroenterology',
      'neurology': 'Neurology',
      'psychiatry': 'Psychiatry',
      'emergency-medicine': 'Emergency Medicine',
      'obstetrics-gynaecology': 'Obstetrics & Gynaecology',
      'paediatrics': 'Paediatrics',
      'surgery': 'Surgery'
    };

    const displayCategory = categoryMappings[category as keyof typeof categoryMappings] || category;

    const prompt = `Generate ${count} high-quality PLAB 1 medical exam questions for ${displayCategory} specialty.

Use these template questions as the EXACT format reference:
${JSON.stringify(templates.slice(0, 2), null, 2)}

CRITICAL Requirements:
- Follow the exact JSON structure: id, topic, category, question, options (A-E), answer, explanation (object with A-E keys), mnemonic, links
- Create authentic UK medical scenarios based on real clinical practice
- Include verified NICE, CKS, NHS, BNF, or GMC guideline references in links object
- Questions must test clinical knowledge appropriate for PLAB 1 level
- Use realistic patient presentations with specific vital signs, investigation results
- Provide detailed explanations for each option (correct and incorrect)
- Include memorable mnemonics
- Each question must be unique and clinically accurate

For ${displayCategory}, focus on core topics like:
${getCategoryTopics(category)}

Return ONLY a valid JSON array with exactly ${count} questions. No additional text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    let response = completion.choices[0].message.content.trim();
    
    // Clean up response to ensure valid JSON
    if (response.startsWith('```json')) {
      response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const questions = JSON.parse(response);
    
    // Validate and enhance each question
    return questions.map((q: any, index: number) => ({
      ...q,
      id: `generated_${category}_${Date.now()}_${index}`,
      category: displayCategory,
      difficulty,
      // Ensure all required fields exist
      topic: q.topic || `${displayCategory} Clinical Scenario`,
      mnemonic: q.mnemonic || "Remember the key clinical signs",
      links: q.links || {
        NICE: `https://www.nice.org.uk/guidance`,
        CKS: `https://cks.nice.org.uk/topics`,
        BNF: `https://bnf.nice.org.uk`
      }
    }));

  } catch (error) {
    console.error('AI generation error:', error);
    return createFallbackQuestions(templates, category, difficulty, count);
  }
}

function getCategoryTopics(category: string): string {
  const topics = {
    cardiovascular: "Hypertension, Acute Coronary Syndrome, Heart Failure, Arrhythmias, Valvular Disease",
    respiratory: "Asthma, COPD, Pneumonia, Pulmonary Embolism, Pleural Disease",
    'infectious-diseases': "UTI, Sepsis, Meningitis, Endocarditis, Tuberculosis",
    endocrinology: "Diabetes, Thyroid Disorders, Adrenal Disorders, Calcium Disorders",
    gastroenterology: "IBD, Peptic Ulcer Disease, Hepatitis, Pancreatitis, Bowel Obstruction",
    neurology: "Stroke, Epilepsy, Headache, Movement Disorders, Dementia",
    psychiatry: "Depression, Anxiety, Psychosis, Substance Abuse, Eating Disorders",
    'emergency-medicine': "Trauma, Poisoning, Shock, Cardiac Arrest, Burns",
    'obstetrics-gynaecology': "Pregnancy, Labour, Gynaecological Disorders, Contraception",
    paediatrics: "Child Development, Immunisations, Common Childhood Illnesses",
    surgery: "Pre-operative Assessment, Post-operative Care, Surgical Emergencies"
  };
  return topics[category as keyof typeof topics] || "General Medical Conditions";
}

async function createFallbackQuestions(templates: any[], category: string, difficulty: string, count: number) {
  const questions = [];
  const specialtyVariations = {
    cardiovascular: ['hypertension', 'heart failure', 'arrhythmias', 'acute coronary syndrome'],
    respiratory: ['asthma', 'COPD', 'pneumonia', 'pulmonary embolism'],
    infectious: ['UTI', 'sepsis', 'meningitis', 'endocarditis'],
    endocrinology: ['diabetes', 'thyroid disorders', 'adrenal disorders'],
    gastroenterology: ['IBD', 'peptic ulcer', 'hepatitis', 'pancreatitis'],
    neurology: ['stroke', 'epilepsy', 'headache', 'dementia']
  };

  for (let i = 0; i < count; i++) {
    const baseTemplate = templates[i % templates.length];
    const variation = specialtyVariations[category as keyof typeof specialtyVariations]?.[i % 4] || 'general';
    
    questions.push({
      ...baseTemplate,
      id: `generated_${category}_${Date.now()}_${i}`,
      category,
      difficulty,
      topic: `${baseTemplate.topic} - ${variation} variant`,
      question: baseTemplate.question.replace(/patient|individual/g, i % 2 === 0 ? 'patient' : 'individual')
    });
  }
  
  return questions;
}

async function generateMedicalGuidanceResponse(question: string, context: any) {
  return `Based on current UK medical guidelines:\n\n${question}\n\nRefer to NICE guidelines for evidence-based recommendations.`;
}

// AI enabled for question generation

// Pre-loaded question bank for instant delivery with persistence
let ukQuestionBank: any[] = [];

// Normalize a question from any stored format to a consistent internal format
const normalizeStoredQuestion = (q: any): any => {
  // Enhanced format: has question_stem / question_scenario and options with is_correct flag
  const isEnhancedFormat = q.question_stem || q.question_scenario;

  let questionText: string;
  let options: string[];
  let correctAnswer: number;
  let explanation: string;

  if (isEnhancedFormat) {
    // Build question text from scenario + stem
    questionText = [q.question_scenario, q.question_stem].filter(Boolean).join('\n\n');

    // Options: array of {label, text, is_correct}
    const rawOptions: any[] = Array.isArray(q.options) ? q.options : [];
    options = rawOptions.map((o: any) => (typeof o === 'string' ? o : o.text || ''));
    correctAnswer = rawOptions.findIndex((o: any) => o.is_correct === true);
    if (correctAnswer < 0) correctAnswer = 0;

    // Explanation from detailed field
    explanation =
      q.correct_answer_explanation ||
      q.correct_answer_explanation_detailed ||
      q.explanation ||
      '';
  } else {
    // Template/legacy format: has question string, options array, answer index/letter
    questionText = q.question || '';
    let rawOptions = q.options;
    if (rawOptions && typeof rawOptions === 'object' && !Array.isArray(rawOptions)) {
      rawOptions = Object.values(rawOptions);
    }
    options = Array.isArray(rawOptions) ? rawOptions : [];

    let ca = q.correctAnswer ?? q.correct_answer ?? q.answer;
    if (typeof ca === 'string') {
      ca = /^[A-E]$/.test(ca) ? ca.charCodeAt(0) - 65 : (parseInt(ca) || 0);
    }
    correctAnswer = typeof ca === 'number' ? ca : 0;

    explanation = typeof q.explanation === 'string'
      ? q.explanation
      : q.explanation
        ? Object.values(q.explanation).join(' ')
        : '';
  }

  return {
    ...q,
    question: questionText,
    options,
    correctAnswer,
    correct_answer: correctAnswer,
    answer: correctAnswer,
    explanation,
  };
};

// Initialize question bank with persistent storage
const loadQuestionBank = () => {
  try {
    const allQuestions: any[] = [];

    // Load enhanced/high-quality questions first (656 with is_correct flags)
    const enhancedPath = path.join(process.cwd(), 'question-bank-enhanced.json');
    if (fs.existsSync(enhancedPath)) {
      const data = JSON.parse(fs.readFileSync(enhancedPath, 'utf8'));
      allQuestions.push(...data);
      console.log(`Loaded ${data.length} enhanced questions`);
    }

    // Also load generated questions (template-based, fills gaps if needed)
    const generatedPath = path.join(process.cwd(), 'generated-question-bank.json');
    if (fs.existsSync(generatedPath)) {
      const data = JSON.parse(fs.readFileSync(generatedPath, 'utf8'));
      allQuestions.push(...data);
      console.log(`Loaded ${data.length} generated questions`);
    }

    if (allQuestions.length > 0) {
      ukQuestionBank = allQuestions;
      console.log(`Loaded ${ukQuestionBank.length} questions from storage`);
    }
  } catch (error) {
    console.log('Starting with empty question bank');
    ukQuestionBank = [];
  }
};

// Save question bank to persistent storage
const saveQuestionBank = () => {
  try {
    const filePath = path.join(process.cwd(), 'generated-question-bank.json');
    fs.writeFileSync(filePath, JSON.stringify(ukQuestionBank, null, 2));
    console.log(`Saved ${ukQuestionBank.length} questions to storage`);
  } catch (error) {
    console.error('Failed to save question bank:', error);
  }
};

// Initialize on startup
loadQuestionBank();

// =====================================================
// GAMIFICATION HELPER FUNCTIONS
// =====================================================

import { BADGE_DEFINITIONS, LEVEL_THRESHOLDS, calculateLevel, calculatePointsForAnswer } from '@shared/gamification';

interface GamificationStats {
  totalPoints: number;
  level: ReturnType<typeof calculateLevel>;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  badgesEarned: number;
  recentBadges: any[];
}

async function getGamificationStats(userId: number): Promise<GamificationStats> {
  const user = await storage.getUser(userId);
  const totalPoints = user?.totalPoints || 0;
  const level = calculateLevel(totalPoints);
  const achievements = await storage.getUserAchievements(userId);
  
  return {
    totalPoints,
    level,
    questionsAnswered: 0,
    correctAnswers: 0,
    accuracy: 0,
    currentStreak: user?.studyStreak || 0,
    longestStreak: user?.studyStreak || 0,
    badgesEarned: achievements.length,
    recentBadges: achievements.slice(0, 5),
  };
}

async function awardPointsAndCheckAchievements(
  userId: number,
  points: number,
  reason: string,
  sessionData?: {
    questionsAnswered?: number;
    correctAnswers?: number;
    streak?: number;
    category?: string;
    accuracy?: number;
  }
) {
  const user = await storage.getUser(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const newTotalPoints = (user.totalPoints || 0) + points;
  await storage.updateUser(userId, { totalPoints: newTotalPoints });

  const newAchievements: any[] = [];
  const existingAchievements = await storage.getUserAchievements(userId);
  const existingBadgeIds = existingAchievements.map(a => a.achievement?.id || a.achievementId);

  for (const badge of BADGE_DEFINITIONS) {
    if (existingBadgeIds.includes(badge.id)) continue;

    let earned = false;
    const req = badge.requirement as any;

    switch (req.type) {
      case 'questions_answered':
        if (sessionData?.questionsAnswered && sessionData.questionsAnswered >= req.value) {
          earned = true;
        }
        break;
      case 'questions_correct':
        if (sessionData?.correctAnswers && sessionData.correctAnswers >= req.value) {
          earned = true;
        }
        break;
      case 'streak':
        if (sessionData?.streak && sessionData.streak >= req.value) {
          earned = true;
        }
        break;
      case 'session_accuracy':
        if (sessionData?.accuracy && sessionData.accuracy >= req.value) {
          earned = true;
        }
        break;
      case 'total_points':
        if (newTotalPoints >= req.value) {
          earned = true;
        }
        break;
    }

    if (earned) {
      newAchievements.push(badge);
    }
  }

  const oldLevel = calculateLevel(user.totalPoints || 0);
  const newLevel = calculateLevel(newTotalPoints);
  const leveledUp = newLevel.currentLevel.level > oldLevel.currentLevel.level;

  return {
    success: true,
    pointsAwarded: points,
    totalPoints: newTotalPoints,
    newAchievements,
    leveledUp,
    newLevel: leveledUp ? newLevel.currentLevel : null,
    level: newLevel,
  };
}

async function getLeaderboard(period: string, category: string, limit: number) {
  const leaderboardData = [
    { rank: 1, username: 'MedMaster', points: 15420, accuracy: 92, streak: 28, country: 'UK', flag: '🇬🇧' },
    { rank: 2, username: 'PLABPro', points: 14850, accuracy: 89, streak: 21, country: 'India', flag: '🇮🇳' },
    { rank: 3, username: 'DocDreamer', points: 13200, accuracy: 88, streak: 35, country: 'Nigeria', flag: '🇳🇬' },
    { rank: 4, username: 'MedStudent2024', points: 12100, accuracy: 85, streak: 14, country: 'Pakistan', flag: '🇵🇰' },
    { rank: 5, username: 'FutureDr', points: 11450, accuracy: 87, streak: 19, country: 'Egypt', flag: '🇪🇬' },
    { rank: 6, username: 'HealthHero', points: 10800, accuracy: 84, streak: 12, country: 'Bangladesh', flag: '🇧🇩' },
    { rank: 7, username: 'MediQuest', points: 9950, accuracy: 86, streak: 22, country: 'Sri Lanka', flag: '🇱🇰' },
    { rank: 8, username: 'DrInTraining', points: 9200, accuracy: 83, streak: 16, country: 'Ghana', flag: '🇬🇭' },
    { rank: 9, username: 'ClinicalAce', points: 8750, accuracy: 88, streak: 11, country: 'Kenya', flag: '🇰🇪' },
    { rank: 10, username: 'MedJourney', points: 8100, accuracy: 81, streak: 9, country: 'Philippines', flag: '🇵🇭' },
  ];

  return leaderboardData.slice(0, limit);
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // AI Status endpoint
  app.get("/api/ai/status", async (req, res) => {
    res.json({
      status: getAIStatus(),
      enabled: isAIEnabled(),
      message: isAIEnabled() ? "AI services active" : "AI services suspended"
    });
  });

  // Batch generate 5000 questions endpoint
  app.post("/api/generate-5000-questions", async (req, res) => {
    if (!isAIEnabled()) {
      return res.status(503).json({ 
        error: "AI services unavailable", 
        message: getAIStatus()
      });
    }

    try {
      const { targetCount = 5000 } = req.body;
      
      // Get the 8 template questions from current question bank
      const templateQuestions = [];
      
      // Fetch the 8 existing template questions
      try {
        const testQuestionsResponse = await fetch(`http://localhost:5000/api/test/questions`);
        const existingQuestions = await testQuestionsResponse.json();
        templateQuestions.push(...existingQuestions.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch template questions:', error);
        return res.status(500).json({ error: 'Cannot access template questions' });
      }

      // Define medical specialties for comprehensive question generation
      const totalSpecialties = 11;
      const questionsPerSpecialty = Math.floor(targetCount / totalSpecialties);
      const medicalSpecialties = [
        { category: "cardiovascular", count: questionsPerSpecialty },
        { category: "respiratory", count: questionsPerSpecialty },
        { category: "infectious-diseases", count: questionsPerSpecialty },
        { category: "endocrinology", count: questionsPerSpecialty },
        { category: "gastroenterology", count: questionsPerSpecialty },
        { category: "neurology", count: questionsPerSpecialty },
        { category: "psychiatry", count: questionsPerSpecialty },
        { category: "dermatology", count: questionsPerSpecialty },
        { category: "rheumatology", count: questionsPerSpecialty },
        { category: "haematology", count: questionsPerSpecialty },
        { category: "oncology", count: questionsPerSpecialty + (targetCount % totalSpecialties) } // Add remainder to last specialty
      ];

      let totalGenerated = 0;
      const generationResults = [];

      // Generate questions in parallel batches for maximum speed
      console.log(`Starting ${targetCount} question generation at ${new Date().toISOString()}`);
      console.log(`Breakdown: ${medicalSpecialties.map(s => `${s.category}: ${s.count}`).join(', ')}`);
      console.log(`Using parallel processing for rapid generation...`);
      
      // Create all generation tasks upfront for parallel execution
      const allGenerationTasks = [];
      
      for (const specialty of medicalSpecialties) {
        const batchSize = 10; // Larger batches for efficiency
        const batches = Math.ceil(specialty.count / batchSize);
        
        for (let batch = 0; batch < batches; batch++) {
          const questionsInBatch = Math.min(batchSize, specialty.count - (batch * batchSize));
          
          const generationTask = async () => {
            try {
              console.log(`Parallel batch ${batch + 1}/${batches} for ${specialty.category} (${questionsInBatch} questions)...`);
              const batchQuestions = await generateMedicalQuestions(
                templateQuestions,
                specialty.category,
                "mixed",
                questionsInBatch
              );
              
              if (batchQuestions && batchQuestions.length > 0) {
                // Thread-safe addition to question bank
                ukQuestionBank.push(...batchQuestions);
                totalGenerated += batchQuestions.length;
                
                console.log(`✅ Generated ${batchQuestions.length} ${specialty.category} questions (Total: ${totalGenerated}/${targetCount})`);
                
                return {
                  specialty: specialty.category,
                  batch: batch + 1,
                  generated: batchQuestions.length,
                  total: totalGenerated,
                  success: true
                };
              } else {
                console.log(`❌ No questions generated for ${specialty.category} batch ${batch + 1}`);
                return {
                  specialty: specialty.category,
                  batch: batch + 1,
                  generated: 0,
                  total: totalGenerated,
                  success: false
                };
              }
            } catch (error) {
              console.error(`Error in ${specialty.category} batch ${batch + 1}:`, error);
              return {
                specialty: specialty.category,
                batch: batch + 1,
                generated: 0,
                total: totalGenerated,
                success: false,
                error: error.message
              };
            }
          };
          
          allGenerationTasks.push(generationTask);
        }
      }
      
      // Execute all generation tasks in parallel with concurrency limit
      console.log(`🚀 Starting ${allGenerationTasks.length} parallel generation tasks...`);
      const concurrencyLimit = 100; // Process 100 batches simultaneously for maximum speed
      
      for (let i = 0; i < allGenerationTasks.length; i += concurrencyLimit) {
        const chunk = allGenerationTasks.slice(i, i + concurrencyLimit);
        console.log(`Processing chunk ${Math.floor(i/concurrencyLimit) + 1}/${Math.ceil(allGenerationTasks.length/concurrencyLimit)} (${chunk.length} parallel tasks)`);
        
        const chunkResults = await Promise.allSettled(chunk.map(task => task()));
        
        // Process results and save after each chunk
        chunkResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value.success) {
            generationResults.push(result.value);
          }
        });
        
        // Save progress after each chunk
        saveQuestionBank();
        console.log(`💾 Saved progress: ${ukQuestionBank.length} total questions`);
        
        // Brief pause between chunks to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Final save
      saveQuestionBank();
      const questionBankFile = path.join(process.cwd(), 'generated-question-bank.json');

      res.json({
        success: true,
        totalGenerated,
        target: targetCount,
        progress: `${totalGenerated}/${targetCount}`,
        results: generationResults,
        questionBankSize: ukQuestionBank.length,
        savedToFile: questionBankFile
      });

    } catch (error) {
      console.error('Batch generation error:', error);
      res.status(500).json({ error: "Failed to generate question bank", details: error.message });
    }
  });

  // PLAB 2 OSCE Station Generation Functions
  async function generatePLAB2OSCEStations(templates: any[], stationType: string, specialty: string, difficulty: string, count: number) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not found');
      }
      
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const specialtyMappings = {
        'emergency-medicine': 'Emergency Medicine',
        'general-medicine': 'General Medicine',
        'cardiology': 'Cardiology',
        'respiratory': 'Respiratory Medicine',
        'gastroenterology': 'Gastroenterology',
        'neurology': 'Neurology',
        'psychiatry': 'Psychiatry',
        'obstetrics-gynaecology': 'Obstetrics & Gynaecology',
        'paediatrics': 'Paediatrics',
        'surgery': 'Surgery',
        'oncology': 'Oncology',
        'rheumatology': 'Rheumatology'
      };

      const typeDescriptions = {
        'history-taking': 'focused history taking stations',
        'physical-examination': 'systematic physical examination stations',
        'communication-skills': 'communication and breaking bad news stations',
        'practical-procedures': 'clinical procedures and skills stations',
        'emergency-management': 'acute management and emergency stations',
        'prescribing-safety': 'safe prescribing and medication stations',
        'data-interpretation': 'investigation results interpretation stations',
        'ethics-consent': 'medical ethics and consent stations'
      };

      const displaySpecialty = specialtyMappings[specialty as keyof typeof specialtyMappings] || specialty;
      const stationDescription = typeDescriptions[stationType as keyof typeof typeDescriptions] || stationType;

      const prompt = `Generate ${count} high-quality PLAB 2 OSCE stations for ${displaySpecialty} specialty focusing on ${stationDescription}.

Use these template stations as the EXACT format reference:
${JSON.stringify(templates.slice(0, 2), null, 2)}

CRITICAL Requirements:
- Follow the exact JSON structure: id, title, scenario, type, duration, difficulty, specialty, instructions, markingCriteria, keyActions, redFlags, differentialDiagnosis, mnemonics, references
- Create authentic UK clinical OSCE scenarios based on real medical practice
- Include verified NICE, GMC, BNF, NHS, or Royal College guideline references
- Stations must test clinical skills appropriate for PLAB 2 level
- Use realistic patient presentations with specific clinical details
- Provide comprehensive marking criteria with clear assessment points
- Include detailed instructions for candidate, examiner, and standardized patient
- Add helpful mnemonics for key learning points (2-3 memorable phrases)
- Each station must be unique and clinically accurate
- Duration should be 8 minutes for most stations
- Difficulty should match requested level: ${difficulty}

For ${displaySpecialty} ${stationType} stations, focus on core clinical skills like:
${getStationTopics(stationType, specialty)}

Return ONLY a valid JSON array with exactly ${count} stations. No additional text.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });

      let response = completion.choices[0].message.content.trim();
      
      // Clean up response to ensure valid JSON
      if (response.startsWith('```json')) {
        response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }
      
      const stations = JSON.parse(response);
      
      // Validate and enhance each station
      return stations.map((s: any, index: number) => ({
        ...s,
        id: `plab2_generated_${specialty}_${stationType}_${Date.now()}_${index}`,
        type: stationType,
        specialty: displaySpecialty,
        difficulty,
        duration: s.duration || 8,
        // Ensure all required fields exist
        title: s.title || `${displaySpecialty} ${stationType} Station`,
        mnemonics: s.mnemonics || [
          `${stationType.toUpperCase()}: Remember key clinical skills and systematic approach`,
          `${displaySpecialty.toUpperCase()}: Focus on specialty-specific knowledge and guidelines`
        ],
        references: s.references || [
          {
            title: "NICE Guidelines",
            url: "https://www.nice.org.uk/guidance"
          },
          {
            title: "GMC Good Medical Practice",
            url: "https://www.gmc-uk.org/ethical-guidance/ethical-guidance-for-doctors/good-medical-practice"
          }
        ]
      }));

    } catch (error) {
      console.error('PLAB 2 AI generation error:', error);
      return createFallbackPLAB2Stations(templates, stationType, specialty, difficulty, count);
    }
  }

  function getStationTopics(stationType: string, specialty: string): string {
    const topics = {
      'history-taking': {
        'emergency-medicine': 'Chest pain, breathlessness, abdominal pain, headache, collapse',
        'cardiology': 'Chest pain, palpitations, syncope, heart failure symptoms',
        'respiratory': 'Cough, breathlessness, chest pain, hemoptysis',
        'general-medicine': 'Weight loss, fatigue, fever, joint pain, confusion'
      },
      'physical-examination': {
        'cardiology': 'Cardiovascular examination, murmur assessment, heart failure signs',
        'respiratory': 'Respiratory examination, pleural effusion, consolidation',
        'neurology': 'Neurological examination, stroke assessment, cranial nerves'
      },
      'communication-skills': {
        'oncology': 'Breaking bad news, discussing prognosis, treatment options',
        'general-medicine': 'Explaining diagnosis, lifestyle advice, medication counseling'
      }
    };
    
    return topics[stationType as keyof typeof topics]?.[specialty as keyof any] || 
           'Standard clinical presentations and management scenarios';
  }

  function createFallbackPLAB2Stations(templates: any[], stationType: string, specialty: string, difficulty: string, count: number) {
    return templates.slice(0, count).map((template, index) => ({
      ...template,
      id: `plab2_fallback_${specialty}_${stationType}_${Date.now()}_${index}`,
      type: stationType,
      specialty,
      difficulty,
      title: `${specialty} ${stationType} Station ${index + 1}`,
      scenario: template.scenario || `Clinical scenario for ${specialty} ${stationType} practice`
    }));
  }

  // Load/Save PLAB 2 Station Bank
  let plab2StationBank: any[] = [];
  const plab2QuestionBankFile = path.join(process.cwd(), 'generated-plab2-question-bank.json');

  function loadPLAB2StationBank() {
    try {
      if (fs.existsSync(plab2QuestionBankFile)) {
        const data = fs.readFileSync(plab2QuestionBankFile, 'utf8');
        if (data.trim()) {
          plab2StationBank = JSON.parse(data);
          console.log(`Loaded ${plab2StationBank.length} PLAB 2 stations from storage`);
        }
      }
    } catch (error) {
      console.error('Error loading PLAB 2 station bank:', error);
      plab2StationBank = [];
    }
  }

  function savePLAB2StationBank() {
    try {
      fs.writeFileSync(plab2QuestionBankFile, JSON.stringify(plab2StationBank, null, 2));
      console.log(`Saved ${plab2StationBank.length} stations to storage`);
    } catch (error) {
      console.error('Error saving PLAB 2 station bank:', error);
    }
  }

  // Initialize PLAB 2 station bank
  loadPLAB2StationBank();
  loadUserFormatStations();
  
  // Initialize international exam stations
  getSupportedExams().forEach(examType => {
    loadInternationalStations(examType);
  });

  // PLAB 2 Station Bank Generation Endpoint
  app.post("/api/generate-plab2-5000-stations", async (req, res) => {
    if (!isAIEnabled()) {
      return res.status(503).json({ 
        error: "AI services unavailable", 
        message: getAIStatus()
      });
    }

    try {
      const generationResults: any[] = [];
      let totalGenerated = plab2StationBank.length;
      const targetStations = 1000; // PLAB 2 has fewer stations but more detailed
      
      if (totalGenerated >= targetStations) {
        return res.json({
          success: true,
          message: `PLAB 2 station bank already complete with ${totalGenerated} stations`,
          totalGenerated,
          target: targetStations,
          progress: `${totalGenerated}/${targetStations}`
        });
      }

      // PLAB 2 specialties and station types distribution (realistic OSCE coverage)
      const plab2Specialties = [
        { specialty: 'emergency-medicine', stations: 120 },
        { specialty: 'general-medicine', stations: 150 },
        { specialty: 'cardiology', stations: 100 },
        { specialty: 'respiratory', stations: 100 },
        { specialty: 'gastroenterology', stations: 80 },
        { specialty: 'neurology', stations: 80 },
        { specialty: 'psychiatry', stations: 80 },
        { specialty: 'obstetrics-gynaecology', stations: 100 },
        { specialty: 'paediatrics', stations: 100 },
        { specialty: 'surgery', stations: 60 },
        { specialty: 'oncology', stations: 30 }
      ];

      const stationTypes = ['history-taking', 'physical-examination', 'communication-skills', 'practical-procedures', 'emergency-management', 'prescribing-safety'];

      for (const spec of plab2Specialties) {
        const remainingForSpecialty = Math.max(0, spec.stations - (plab2StationBank.filter(s => s.specialty === spec.specialty).length));
        if (remainingForSpecialty <= 0) continue;

        // Distribute stations across different types
        const stationsPerType = Math.ceil(remainingForSpecialty / stationTypes.length);
        const batches = Math.ceil(stationsPerType / 2); // 2 stations per batch

        for (const stationType of stationTypes) {
          for (let batch = 0; batch < batches && totalGenerated < targetStations; batch++) {
            try {
              const stationsInBatch = Math.min(2, spec.stations - (plab2StationBank.filter(s => s.specialty === spec.specialty && s.type === stationType).length));
              if (stationsInBatch <= 0) break;

              console.log(`Starting PLAB 2 batch ${batch + 1}/${batches} for ${spec.specialty} ${stationType}...`);
              console.log(`Generating ${stationsInBatch} ${spec.specialty} ${stationType} stations...`);
              
              const batchStations = await generatePLAB2OSCEStations(
                PLAB2_TEMPLATE_STATIONS,
                stationType,
                spec.specialty,
                "intermediate",
                stationsInBatch
              );
              
              if (batchStations && batchStations.length > 0) {
                plab2StationBank.push(...batchStations);
                totalGenerated += batchStations.length;
                savePLAB2StationBank();
                
                generationResults.push({
                  specialty: spec.specialty,
                  stationType,
                  batch: batch + 1,
                  generated: batchStations.length,
                  total: totalGenerated
                });
                
                console.log(`Generated PLAB 2 batch ${batch + 1}/${batches} for ${spec.specialty} ${stationType}: ${batchStations.length} stations (Total: ${totalGenerated}/5000)`);
              } else {
                console.log(`No stations generated in batch ${batch + 1} for ${spec.specialty} ${stationType}`);
              }
              
              await new Promise(resolve => setTimeout(resolve, 1000));
              
            } catch (error) {
              console.error(`Error generating PLAB 2 batch ${batch + 1} for ${spec.specialty} ${stationType}:`, error);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      }

      // Final save
      savePLAB2StationBank();

      res.json({
        success: true,
        totalGenerated,
        target: targetStations,
        progress: `${totalGenerated}/${targetStations}`,
        results: generationResults,
        stationBankSize: plab2StationBank.length,
        savedToFile: plab2QuestionBankFile
      });

    } catch (error) {
      console.error('PLAB 2 batch generation error:', error);
      res.status(500).json({ error: "Failed to generate PLAB 2 station bank", details: error.message });
    }
  });

  // Get PLAB 2 stations endpoint
  app.get("/api/plab2/stations", (req, res) => {
    try {
      const { specialty, type, difficulty, limit = 50 } = req.query;
      
      let filteredStations = [...PLAB2_TEMPLATE_STATIONS, ...plab2StationBank];
      
      if (specialty && specialty !== 'all') {
        filteredStations = filteredStations.filter(s => s.specialty === specialty);
      }
      
      if (type && type !== 'all') {
        filteredStations = filteredStations.filter(s => s.type === type);
      }
      
      if (difficulty && difficulty !== 'all') {
        filteredStations = filteredStations.filter(s => s.difficulty === difficulty);
      }
      
      const limitedStations = filteredStations.slice(0, parseInt(limit as string));
      
      res.json({
        stations: limitedStations,
        total: filteredStations.length,
        templateStations: PLAB2_TEMPLATE_STATIONS.length,
        generatedStations: plab2StationBank.length,
        filters: { specialty, type, difficulty, limit }
      });
    } catch (error) {
      console.error('Error fetching PLAB 2 stations:', error);
      res.status(500).json({ error: "Failed to fetch PLAB 2 stations" });
    }
  });

  // Pull questions from the local bank with best-effort category/difficulty filtering.
  // Falls back to the full pool if a strict filter would leave too few questions.
  const pickFromBank = (category?: string, difficulty?: string, requestedCount = 50) => {
    let pool: any[] = ukQuestionBank.length > 0 ? ukQuestionBank : [];

    if (category && category !== 'all' && pool.length > 0) {
      const needle = category.toLowerCase().replace(/[-_\s]+/g, '');
      const filtered = pool.filter((q: any) => {
        const qCat = (q.category || q.topic || '').toLowerCase().replace(/[-_\s]+/g, '');
        return qCat && (qCat.includes(needle) || needle.includes(qCat));
      });
      if (filtered.length >= 5) pool = filtered;
    }

    if (difficulty && difficulty !== 'mixed' && pool.length > 0) {
      const filtered = pool.filter((q: any) =>
        (q.difficulty || '').toLowerCase() === difficulty.toLowerCase()
      );
      if (filtered.length >= 5) pool = filtered;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, requestedCount).map(normalizeStoredQuestion);
  };

  // Single batch generation endpoint (for smaller requests)
  app.post("/api/generate-questions", async (req, res) => {
    const { category, difficulty = "mixed", count = 50 } = req.body;
    const requestedCount = parseInt(String(count)) || 50;

    // If AI is unavailable, serve questions from the existing bank
    if (!isAIEnabled()) {
      const questions = pickFromBank(category, difficulty, requestedCount);

      if (questions.length === 0) {
        return res.status(503).json({
          error: "No questions available",
          message: "Question bank is empty and AI generation is unavailable."
        });
      }

      return res.json({
        success: true,
        generated: questions.length,
        questions,
        totalQuestionBank: ukQuestionBank.length,
        source: 'bank'
      });
    }

    try {
      // Use existing test questions as templates
      const response = await fetch(`${req.protocol}://${req.get('host')}/api/test/questions`);
      const templateQuestions = await response.json();

      // Generate questions using AI with templates as reference
      const generatedQuestions = await generateMedicalQuestions(
        templateQuestions.slice(0, 8),
        category,
        difficulty,
        requestedCount
      );

      // If AI returned nothing usable, fall back to the question bank
      if (!generatedQuestions || generatedQuestions.length === 0) {
        const fallback = pickFromBank(category, difficulty, requestedCount);
        if (fallback.length > 0) {
          return res.json({
            success: true,
            generated: fallback.length,
            questions: fallback,
            totalQuestionBank: ukQuestionBank.length,
            source: 'bank'
          });
        }
        return res.status(503).json({
          error: "No questions available",
          message: "AI generation returned no questions and the local bank is empty."
        });
      }

      // Add to question bank and save
      ukQuestionBank.push(...generatedQuestions);
      saveQuestionBank();

      res.json({
        success: true,
        generated: generatedQuestions.length,
        questions: generatedQuestions,
        totalQuestionBank: ukQuestionBank.length,
        source: 'ai'
      });

    } catch (error) {
      console.error('Question generation error:', error);

      // On AI error, fall back to the bank with the requested filters
      const fallback = pickFromBank(category, difficulty, requestedCount);
      if (fallback.length > 0) {
        return res.json({
          success: true,
          generated: fallback.length,
          questions: fallback,
          totalQuestionBank: ukQuestionBank.length,
          source: 'bank'
        });
      }

      res.status(500).json({ error: "Failed to generate questions" });
    }
  });

  // Per-question structured explanation generator
  // Cache by hash of question + options + correctIndex so repeats don't re-bill OpenAI.
  const explanationCache = new Map<string, any>();
  const hashKey = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return String(h);
  };

  const buildFallbackExplanation = (
    question: string,
    options: string[],
    correctIndex: number,
    selectedIndex: number | undefined,
    storedExplanation?: string
  ) => {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    return {
      correctRationale:
        storedExplanation && storedExplanation.length > 30
          ? storedExplanation
          : `The correct answer is ${labels[correctIndex] || '?'}: ${options[correctIndex] || ''}. A detailed AI-generated rationale is unavailable right now — please review the question stem and the option above against the relevant NICE/CKS guidance.`,
      options: options.map((text, i) => ({
        label: labels[i] || String(i + 1),
        text,
        isCorrect: i === correctIndex,
        isSelected: selectedIndex === i,
        why: i === correctIndex
          ? 'This option best matches the clinical features described in the question stem.'
          : 'This option does not best fit the features in the question stem. Consider its typical presentation and how it differs from the scenario above.',
      })),
      keyLearningPoint: 'Always anchor your reasoning in the specific clues from the question stem — patient demographics, symptoms, signs and investigations — and match them to the most likely diagnosis or best management step per current UK guidance.',
      source: 'fallback' as const,
    };
  };

  // Simple in-memory rate limit for the AI explanation endpoint
  // (60 requests per IP per 5 minutes — generous for normal study, blocks scripted abuse)
  const explainRateBuckets = new Map<string, { count: number; resetAt: number }>();
  const EXPLAIN_RATE_WINDOW_MS = 5 * 60 * 1000;
  const EXPLAIN_RATE_MAX = 60;

  app.post("/api/explain-answer", async (req, res) => {
    try {
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
      const now = Date.now();
      const bucket = explainRateBuckets.get(ip);
      if (bucket && bucket.resetAt > now) {
        if (bucket.count >= EXPLAIN_RATE_MAX) {
          return res.status(429).json({ error: 'Too many explanation requests. Please slow down.' });
        }
        bucket.count++;
      } else {
        explainRateBuckets.set(ip, { count: 1, resetAt: now + EXPLAIN_RATE_WINDOW_MS });
      }

      const {
        question,
        options,
        correctIndex,
        selectedIndex,
        category,
        questionId,
        storedExplanation,
      } = req.body || {};

      if (!question || !Array.isArray(options) || options.length < 2 || typeof correctIndex !== 'number') {
        return res.status(400).json({ error: 'Missing question, options or correctIndex' });
      }

      // Cap input sizes to prevent prompt-injection / cost abuse
      const MAX_QUESTION = 4000;
      const MAX_OPTION = 800;
      const MAX_OPTIONS = 8;
      if (typeof question !== 'string' || question.length > MAX_QUESTION) {
        return res.status(400).json({ error: 'Question text is missing or too long' });
      }
      if (options.length > MAX_OPTIONS) {
        return res.status(400).json({ error: 'Too many options' });
      }
      if (options.some((o: any) => typeof o !== 'string' || o.length > MAX_OPTION)) {
        return res.status(400).json({ error: 'An option is missing or too long' });
      }
      if (correctIndex < 0 || correctIndex >= options.length) {
        return res.status(400).json({ error: 'correctIndex out of range' });
      }
      const safeStored = typeof storedExplanation === 'string' && storedExplanation.length <= 4000
        ? storedExplanation
        : undefined;

      // Include a content hash even when questionId is present, so edits to a question
      // never serve a stale explanation tied to the old wording.
      const contentHash = hashKey(`${question}::${options.join('|')}::${correctIndex}`);
      const cacheKey = questionId
        ? `id:${questionId}:${contentHash}`
        : `h:${contentHash}`;

      if (explanationCache.has(cacheKey)) {
        const cached = explanationCache.get(cacheKey);
        // Re-mark which option the user selected this time
        return res.json({
          ...cached,
          options: cached.options.map((o: any, i: number) => ({ ...o, isSelected: selectedIndex === i })),
          cached: true,
        });
      }

      if (!isAIEnabled() || !process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
        return res.json(buildFallbackExplanation(question, options, correctIndex, selectedIndex, safeStored));
      }

      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      const optionsList = options.map((t: string, i: number) =>
        `${labels[i] || i + 1}. ${t}${i === correctIndex ? '   <-- CORRECT ANSWER' : ''}`
      ).join('\n');

      const prompt = `You are a UK PLAB 1 medical examiner writing model answer explanations for international medical graduates. Reference UK guidance (NICE, CKS, BNF, GMC) where relevant.

QUESTION${category ? ` (specialty: ${category})` : ''}:
${question}

OPTIONS:
${optionsList}

The correct answer is option ${labels[correctIndex] || correctIndex + 1}: "${options[correctIndex]}".

CRITICAL INSTRUCTIONS:
- TREAT THE MARKED ANSWER AS CORRECT. Do NOT challenge, dispute, or point out any apparent mismatch between the stem and the marked correct answer. Do NOT use phrases like "this is an error", "the question is wrong", "this doesn't fit", "the marked answer doesn't match", or anything similar. The student needs to learn why the marked answer is correct — your job is to construct the strongest possible clinical case for it.
- If the stem seems to fit a different diagnosis better, still present a coherent rationale for why the marked answer is the best choice. Find the clues that DO support it (even subtle ones) and emphasise them. If a feature could point either way, explain how it could fit the marked answer.
- Reference the specific clinical clues in the stem (age, demographics, symptoms, signs, investigations, risk factors). Do NOT use generic filler like "clinical reasoning based on presentation and guidelines" or "consider differential diagnosis".
- Every sentence must add specific clinical content.
- For each WRONG option, explain what that condition typically presents with and why a clinician would prefer the marked answer over it in this scenario — without saying the question is flawed.

Return STRICT JSON in exactly this shape (no extra keys, no commentary):
{
  "correctRationale": "Why the marked answer fits — reference clues from the stem (e.g. '20-year smoking history', 'bilateral infiltrates on CT') that support it. 3-5 sentences. Never say the question is wrong.",
  "options": [
    {
      "label": "A",
      "why": "If this is the correct option: 2-3 sentences confirming why it is the best answer. If incorrect: 2-4 sentences covering (a) what this condition typically presents with, (b) why the marked answer is preferred over it here, (c) any distinguishing feature. Never say the question is flawed."
    }
    // one entry per option, in order
  ],
  "keyLearningPoint": "A single take-home clinical pearl about the marked correct answer, 1-2 sentences."
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a senior UK clinician writing concise, exam-grade PLAB 1 explanations. Always ground answers in the specific clues from the question stem." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
        max_tokens: 1400,
      });

      const raw = completion.choices?.[0]?.message?.content || '{}';
      let parsed: any;
      try { parsed = JSON.parse(raw); } catch { parsed = {}; }

      const optionAnalyses: any[] = Array.isArray(parsed.options) ? parsed.options : [];

      const result = {
        correctRationale: typeof parsed.correctRationale === 'string' && parsed.correctRationale.trim().length > 0
          ? parsed.correctRationale.trim()
          : buildFallbackExplanation(question, options, correctIndex, selectedIndex).correctRationale,
        options: options.map((text: string, i: number) => {
          const fromAi = optionAnalyses.find((o: any) =>
            (o.label && String(o.label).toUpperCase() === labels[i]) ||
            (typeof o.index === 'number' && o.index === i)
          ) || optionAnalyses[i] || {};
          return {
            label: labels[i] || String(i + 1),
            text,
            isCorrect: i === correctIndex,
            isSelected: selectedIndex === i,
            why: typeof fromAi.why === 'string' && fromAi.why.trim().length > 0
              ? fromAi.why.trim()
              : (i === correctIndex
                ? 'This option best matches the clinical features described.'
                : 'This option does not best fit the features in the stem.'),
          };
        }),
        keyLearningPoint: typeof parsed.keyLearningPoint === 'string' && parsed.keyLearningPoint.trim().length > 0
          ? parsed.keyLearningPoint.trim()
          : 'Anchor reasoning in the specific clues from the question stem and the most likely diagnosis given UK guidance.',
        source: 'ai' as const,
      };

      explanationCache.set(cacheKey, result);
      // Cap cache size to avoid runaway memory
      if (explanationCache.size > 2000) {
        const firstKey = explanationCache.keys().next().value;
        if (firstKey) explanationCache.delete(firstKey);
      }

      return res.json(result);
    } catch (error) {
      console.error('Explain-answer error:', error);
      const { question, options, correctIndex, selectedIndex, storedExplanation } = req.body || {};
      const safeStored = typeof storedExplanation === 'string' && storedExplanation.length <= 4000
        ? storedExplanation
        : undefined;
      if (question && Array.isArray(options) && typeof correctIndex === 'number') {
        return res.json(buildFallbackExplanation(question, options, correctIndex, selectedIndex, safeStored));
      }
      return res.status(500).json({ error: 'Failed to generate explanation' });
    }
  });

  // AI NHS Prep endpoint
  app.post("/api/ask-nhs-prep", async (req, res) => {
    if (!isAIEnabled()) {
      return res.status(503).json({ 
        error: "AI services unavailable", 
        message: getAIStatus(),
        fallback: "Please refer to NICE guidelines at https://www.nice.org.uk/guidance for medical guidance"
      });
    }

    try {
      const { question, context } = req.body;
      
      // Simulate AI response based on medical guidelines
      const response = await generateMedicalGuidanceResponse(question, context);
      
      res.json({
        response,
        sources: ["NICE Guidelines", "Clinical Knowledge Summaries", "BNF"],
        aiEnabled: true
      });
      
    } catch (error) {
      console.error('AI guidance error:', error);
      res.status(500).json({ error: "Failed to generate guidance" });
    }
  });

  // Translation endpoint - simple fallback without AI
  app.post("/api/translate-question", async (req, res) => {
    try {
      const { question, targetLanguage } = req.body;
      
      // Since AI is suspended, return original content with a note
      res.json({
        question: question.question + " (Translation temporarily unavailable)",
        options: question.options,
        explanation: question.explanation + " (Translation temporarily unavailable)"
      });
    } catch (error) {
      console.error("Translation endpoint error:", error);
      res.status(500).json({ error: "Translation service unavailable" });
    }
  });

  app.post("/api/tutor", async (req, res) => {
    res.status(503).json({ 
      error: "AI services suspended", 
      message: getAIStatus()
    });
  });

  app.post("/api/ai-analysis", async (req, res) => {
    res.status(503).json({ 
      error: "AI services suspended", 
      message: getAIStatus()
    });
  });

  // OSCE Stations endpoint
  app.get("/api/osce/stations", async (req, res) => {
    try {
      const { type, specialty, difficulty, count } = req.query;
      
      // Load comprehensive OSCE stations (176 stations covering full GMC blueprint)
      const comprehensiveStations = loadComprehensiveOSCEBank();
      const userFormatStations = comprehensiveStations.length > 0 ? comprehensiveStations : loadUserFormatStations();
      
      if (userFormatStations && userFormatStations.length > 0) {
        let filteredStations = userFormatStations;
        
        // Apply filters if provided
        if (type && type !== 'all') {
          filteredStations = filteredStations.filter(station => 
            station.station_type?.toLowerCase().includes(type.toString().toLowerCase()) ||
            station.scenario_title?.toLowerCase().includes(type.toString().toLowerCase())
          );
        }
        
        if (specialty && specialty !== 'all') {
          filteredStations = filteredStations.filter(station => 
            station.station_type?.toLowerCase().includes(specialty.toString().toLowerCase())
          );
        }
        
        if (difficulty && difficulty !== 'all') {
          filteredStations = filteredStations.filter(station => 
            station.difficulty?.toLowerCase() === difficulty.toString().toLowerCase()
          );
        }
        
        // Limit results if count is specified
        const limit = count ? parseInt(count.toString()) : 20;
        const limitedStations = filteredStations.slice(0, limit);
        
        // Transform to match expected format
        const transformedStations = limitedStations.map((station, index) => ({
          id: `station_${index + 1}`,
          title: station.scenario_title || station.title || 'Clinical Station',
          category: station.station_type || 'General Medicine',
          difficulty: station.difficulty || 'intermediate',
          duration: station.duration || 8,
          description: station.brief || '',
          scenario: station.detailed_scenario || station.scenario || station.brief || '',
          instructions: {
            candidate: station.candidate_instructions || 'Take appropriate history, examination, or explanation as indicated',
            examiner: station.examiner_instructions || 'Assess candidate performance according to marking scheme',
            standardizedPatient: typeof station.actor_script === 'object' ? 
              `Opening: ${station.actor_script.opening || ''}\nDetails: ${station.actor_script.details || ''}\nHidden Info: ${station.actor_script.hidden_info || ''}` :
              station.actor_script || ''
          },
          markingCriteria: station.mark_scheme ? [{
            category: "Overall Performance",
            maxMarks: 20,
            criteria: Array.isArray(station.mark_scheme) ? station.mark_scheme : [station.mark_scheme]
          }] : [],
          keyActions: station.key_learning_points || station.mark_scheme || [],
          redFlags: station.red_flags || [],
          medications: station.medications || [],
          references: station.guideline_links ? Object.entries(station.guideline_links).map(([title, url]) => ({
            title,
            url: url as string
          })) : [],
          completed: false,
          attempts: 0,
          bestScore: 0,
          examFrequency: 'high'
        }));
        
        res.json(transformedStations);
      } else {
        // Fallback to empty array if no stations found
        res.json([]);
      }
    } catch (error) {
      console.error('Error fetching OSCE stations:', error);
      res.status(500).json({ error: "Failed to fetch OSCE stations" });
    }
  });

  // Comprehensive OSCE Generation Routes
  app.post("/api/generate-comprehensive-osce", async (req, res) => {
    try {
      const { targetCount = 150 } = req.body;
      
      console.log(`Starting comprehensive OSCE generation for ${targetCount} stations`);
      
      // Generate comprehensive OSCE bank
      const stations = generateComprehensiveOSCEBank(targetCount);
      
      res.json({
        success: true,
        message: `Generated ${stations.length} comprehensive OSCE stations`,
        totalStations: stations.length,
        targetCount,
        stats: getOSCEBankStats()
      });
      
    } catch (error) {
      console.error('Comprehensive OSCE generation error:', error);
      res.status(500).json({ error: "Failed to generate comprehensive OSCE bank" });
    }
  });

  app.get("/api/comprehensive-osce/stations", async (req, res) => {
    try {
      const { count = 20, type, specialty, difficulty } = req.query;
      
      // Load comprehensive OSCE stations
      let stations = loadComprehensiveOSCEBank();
      
      // Apply filters
      if (type && type !== 'all') {
        stations = stations.filter(station => 
          station.station_type.toLowerCase().includes(type.toString().toLowerCase())
        );
      }
      
      if (specialty && specialty !== 'all') {
        stations = stations.filter(station => 
          station.specialty?.toLowerCase().includes(specialty.toString().toLowerCase())
        );
      }
      
      if (difficulty && difficulty !== 'all') {
        stations = stations.filter(station => 
          station.difficulty?.toLowerCase() === difficulty.toString().toLowerCase()
        );
      }
      
      // Limit results
      const limitedStations = stations.slice(0, parseInt(count.toString()));
      
      // Transform to expected format
      const transformedStations = limitedStations.map((station, index) => ({
        id: `comp_station_${index + 1}`,
        title: station.scenario_title,
        category: station.station_type,
        difficulty: station.difficulty?.toLowerCase() || 'intermediate',
        duration: station.duration || 8,
        description: station.brief,
        scenario: station.brief,
        instructions: {
          candidate: station.brief,
          examiner: `Assess candidate performance using the marking criteria`,
          standardizedPatient: `${station.actor_script.opening}\n${station.actor_script.details}\n${station.actor_script.hidden_info}`
        },
        markingCriteria: [{
          category: "Clinical Performance",
          maxMarks: 20,
          criteria: station.mark_scheme
        }],
        keyActions: station.mark_scheme,
        mnemonic: station.mnemonic,
        communicationNotes: station.communication_notes,
        references: Object.entries(station.guideline_links).map(([title, url]) => ({
          title,
          url
        })),
        specialty: station.specialty,
        completed: false,
        attempts: 0,
        bestScore: 0,
        examFrequency: 'high'
      }));
      
      res.json(transformedStations);
      
    } catch (error) {
      console.error('Error fetching comprehensive OSCE stations:', error);
      res.status(500).json({ error: "Failed to fetch comprehensive OSCE stations" });
    }
  });

  app.get("/api/comprehensive-osce/stats", async (req, res) => {
    try {
      const stats = getOSCEBankStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching OSCE stats:', error);
      res.status(500).json({ error: "Failed to fetch OSCE statistics" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/live", async (req, res) => {
    try {
      const stats = getUsageStats();
      res.json({
        currentTestTakers: stats.currentTestTakers,
        activeUsers: stats.activeUsers,
        todayTests: stats.todayTests,
        testPerformance: stats.testPerformance,
        popularPages: stats.popularPages,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.post("/api/analytics/test-completion", async (req, res) => {
    try {
      const { sessionId, testType, questionsAnswered, correctAnswers, timeSpent } = req.body;
      
      trackTestActivity(sessionId || generateSessionId(), {
        testType: testType || 'PassMedicine-style',
        questionsAnswered: questionsAnswered || 0,
        correctAnswers: correctAnswers || 0,
        timeSpent: timeSpent || 0,
        completedAt: new Date()
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking test completion:', error);
      res.status(500).json({ error: "Failed to track test" });
    }
  });

  // PLAB practice test questions - Static content only
  // Initialize adaptive AI engine with question bank
  const initializeAdaptiveAI = () => {
    try {
      // First try to load existing question bank
      loadQuestionBank();
      
      // Use the loaded ukQuestionBank or create from test questions
      let questions = ukQuestionBank;
      
      if (!questions || questions.length === 0) {
        // Use the test questions from the API as starter questions for adaptive AI
        const testQuestions = [
          {
            id: "q1", 
            topic: "Urinary Tract Infection Management",
            category: "Infectious Diseases",
            difficulty: "medium",
            question: "A 28-year-old non-pregnant woman presents with a 2-day history of dysuria, urinary frequency, and suprapubic discomfort. Urine dipstick shows positive nitrites and leucocytes. What is the most appropriate first-line antibiotic treatment according to current UK guidelines?",
            options: ["Nitrofurantoin 100mg modified-release twice daily for 3 days", "Trimethoprim 200mg twice daily for 3 days", "Ciprofloxacin 500mg twice daily for 3 days", "Amoxicillin 500mg three times daily for 5 days", "Co-trimoxazole 960mg twice daily for 3 days"],
            correctAnswer: "Nitrofurantoin 100mg modified-release twice daily for 3 days",
            explanation: "Nitrofurantoin remains the first-line treatment for uncomplicated UTIs in non-pregnant women according to NICE guidelines, with excellent E. coli coverage and minimal resistance."
          },
          {
            id: "q2",
            topic: "Acute Coronary Syndrome Management", 
            category: "Cardiology",
            difficulty: "hard",
            question: "A 58-year-old man presents with severe central chest pain radiating to his left arm, lasting 45 minutes. ECG shows ST elevation >2mm in leads II, III, and aVF. What is the most appropriate immediate management?",
            options: ["Primary percutaneous coronary intervention (PCI) within 120 minutes", "Thrombolytic therapy with alteplase immediately", "High-dose atorvastatin and dual antiplatelet therapy", "Coronary angiography within 24 hours", "Conservative management with aspirin and clopidogrel"],
            correctAnswer: "Primary percutaneous coronary intervention (PCI) within 120 minutes",
            explanation: "Primary PCI within 120 minutes is the gold standard for STEMI management, providing superior outcomes compared to thrombolytic therapy."
          }
        ];
        questions = testQuestions;
        console.log('Using starter questions for Adaptive AI Engine initialization');
      }
      
      AdaptiveAIEngine.initialize(questions);
      console.log(`Adaptive AI Engine initialized with ${questions.length} questions`);
    } catch (error) {
      console.error('Failed to initialize Adaptive AI Engine:', error);
      // Initialize with minimal question set as absolute fallback
      const fallbackQuestions = [{
        id: "fallback1",
        topic: "General Medicine",
        category: "General",
        difficulty: "medium",
        question: "Which organization provides clinical guidelines for UK healthcare?",
        options: ["NICE", "WHO", "FDA", "EMA"],
        correctAnswer: "NICE",
        explanation: "NICE (National Institute for Health and Care Excellence) provides evidence-based clinical guidelines for UK healthcare."
      }];
      AdaptiveAIEngine.initialize(fallbackQuestions);
      console.log('Adaptive AI Engine initialized with fallback questions');
    }
  };
  
  // Initialize on startup
  initializeAdaptiveAI();

  // Adaptive AI Engine routes
  app.post('/api/adaptive/start-session', async (req, res) => {
    try {
      const { userId, existingPerformance } = req.body;
      const sessionId = AdaptiveAIEngine.startSession(userId, existingPerformance);
      res.json({ sessionId, success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to start adaptive session' });
    }
  });

  app.post('/api/adaptive/process-answer', async (req, res) => {
    try {
      const { sessionId, questionId, selectedAnswer, timeSpent } = req.body;
      const response = AdaptiveAIEngine.processAnswer(sessionId, questionId, selectedAnswer, timeSpent);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to process answer' });
    }
  });

  app.get('/api/adaptive/analytics/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const analytics = AdaptiveAIEngine.getUserAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user analytics' });
    }
  });

  app.post('/api/adaptive/weakness-check', async (req, res) => {
    try {
      const { sessionId, currentAnswer } = req.body;
      const check = AdaptiveAIEngine.getRealTimeWeaknessCheck(sessionId, currentAnswer);
      res.json(check);
    } catch (error) {
      res.status(500).json({ error: 'Failed to check weakness' });
    }
  });

  app.get('/api/adaptive/stats', async (req, res) => {
    try {
      const stats = AdaptiveAIEngine.getEngineStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get engine stats' });
    }
  });

// Generate sample questions for categories that don't have existing questions
function getSampleQuestionsForCategory(category: string, count: number = 10) {
  const sampleQuestions: any = {
    ophthalmology: [
      {
        id: "opht1",
        category: "Ophthalmology",
        topic: "Acute Angle-Closure Glaucoma",
        question: "A 65-year-old woman presents to A&E with severe right eye pain, nausea, vomiting, and seeing haloes around lights for the past 4 hours. Visual acuity is 6/36 in the right eye. The eye appears red with a fixed, mid-dilated pupil. IOP is 50 mmHg. What is the most appropriate immediate treatment?",
        options: {
          A: "Topical pilocarpine 2% plus acetazolamide 500mg IV",
          B: "Immediate referral to ophthalmology without treatment",
          C: "Topical timolol 0.5% twice daily",
          D: "Oral prednisolone 40mg daily",
          E: "Topical chloramphenicol drops"
        },
        answer: "A",
        explanation: "Why Topical pilocarpine 2% plus acetazolamide 500mg IV is correct:\n\n• NICE CG85 Emergency Management Protocol: \n  - Acute angle-closure glaucoma represents an ophthalmic emergency requiring immediate pressure reduction to prevent irreversible vision loss\n  - Combination therapy with pilocarpine and acetazolamide provides rapid, effective IOP reduction through complementary mechanisms\n  - Royal College of Ophthalmologists guidelines emphasize urgent treatment initiation within hours to preserve visual field\n  - Delay in appropriate therapy results in progressive optic nerve damage and permanent visual field defects\n\n• Optimal Pilocarpine Mechanism and Efficacy: \n  - Direct cholinergic agonist causing pupillary constriction and ciliary muscle contraction\n  - Opens drainage angle by pulling peripheral iris away from trabecular meshwork\n  - Concentration of 2% provides optimal therapeutic effect while minimizing systemic absorption\n  - Rapid onset of action within 15-30 minutes providing immediate anatomical correction\n\n• Acetazolamide Carbonic Anhydrase Inhibition: \n  - Reduces aqueous humor production by 40-60% through ciliary body carbonic anhydrase inhibition\n  - Intravenous administration ensures rapid systemic drug delivery and immediate onset\n  - Dose of 500mg IV provides optimal therapeutic response without excessive side effects\n  - Synergistic effect with pilocarpine addresses both drainage and production components\n\n• Evidence-Based Emergency Intervention: \n  - Clinical trials demonstrate 70-80% IOP reduction within 2 hours using combination therapy\n  - Prevents progression to irreversible glaucomatous optic neuropathy\n  - Significantly improves outcomes when administered within 6-hour critical window\n  - Reduces need for emergency surgical intervention in 60-70% of cases\n\n• Comprehensive Symptom Resolution: \n  - Addresses acute pain through pressure reduction and inflammation control\n  - Resolves nausea and vomiting secondary to severe ocular pain and raised IOP\n  - Eliminates visual disturbances including haloes and blurred vision\n  - Prevents secondary complications including corneal edema and lens damage\n\n• Established Safety and Monitoring: \n  - Well-tolerated combination with predictable side effect profile\n  - Allows safe emergency treatment pending specialist ophthalmology review\n  - Compatible with subsequent definitive laser peripheral iridotomy\n  - Monitoring protocols ensure appropriate response and identify complications",
        incorrectExplanation: "• Option B (Immediate referral without treatment) - Dangerous Treatment Delay: \n  - Acute angle-closure glaucoma requires immediate pressure reduction to prevent irreversible vision loss\n  - Referral delays of even 1-2 hours can result in permanent visual field defects\n  - Emergency departments must initiate treatment before specialist review\n  - Royal College of Ophthalmologists emphasizes immediate treatment protocols\n  - Untreated acute glaucoma progresses to complete vision loss within 24-48 hours\n  - Primary care and emergency medicine protocols mandate immediate intervention\n\n• Option C (Topical timolol alone) - Insufficient Monotherapy: \n  - Beta-blocker monotherapy inadequate for acute angle-closure crisis\n  - Does not address closed drainage angle requiring pupillary constriction\n  - Insufficient IOP reduction for pressures >40 mmHg\n  - May worsen angle closure through pupillary dilation effects\n  - Requires combination with pilocarpine and systemic agents\n  - Contraindicated in patients with asthma or COPD\n\n• Option D (Oral prednisolone) - Inappropriate Anti-inflammatory Focus: \n  - Corticosteroids do not address elevated intraocular pressure\n  - May worsen angle closure through pupillary dilation\n  - Does not target underlying pathophysiology of aqueous outflow obstruction\n  - Risk of steroid-induced IOP elevation in predisposed individuals\n  - Delays appropriate pressure-reducing interventions\n  - Reserved for post-acute inflammation management\n\n• Option E (Topical chloramphenicol) - Irrelevant Antibiotic Therapy: \n  - Acute angle-closure glaucoma is not infectious condition\n  - Antibiotics provide no therapeutic benefit for raised IOP\n  - Does not address underlying anatomical obstruction\n  - Delays crucial pressure-reducing treatment\n  - May cause additional ocular irritation and inflammation\n  - Completely inappropriate for emergency glaucoma management",
        mnemonic: "Acute Glaucoma: PAIN = Pilocarpine, Acetazolamide, Immediate treatment, No delays\n\nGlaucoma Risk Factors: CHANGE = Chinese/Asian ethnicity, Hypermetropia, Age >40, Narrow angles, Gender (female), Eye trauma history\n\nGlaucoma Symptoms: VOMIT = Vision haloes, Ocular pain, Mid-dilated pupil, IOP raised, Tenderness\n\nPilocarpine Action: CONTRACTS = Constricts pupil, Opens drainage angle, Normalizes outflow, Treats acute closure, Restores anatomy, Corrects pathophysiology, Therapeutic in emergency, Saves vision",
        guidelineSummary: {
          title: "Acute Angle-Closure Glaucoma Management",
          content: "• Emergency Recognition: \n  - Severe ocular pain, nausea, vomiting, haloes around lights\n  - Red eye with fixed mid-dilated pupil and corneal edema\n  - Intraocular pressure typically >40 mmHg (normal 10-21 mmHg)\n  - Visual acuity reduced, peripheral visual field loss\n\n• Immediate Treatment: \n  - Topical pilocarpine 2% to constrict pupil and open angle\n  - IV acetazolamide 500mg to reduce aqueous production\n  - Topical beta-blocker (timolol) if no contraindications\n  - Analgesia for severe pain management\n\n• Secondary Interventions: \n  - Topical steroid after IOP control for inflammation\n  - Osmotic agents (mannitol) for refractory cases\n  - Monitor IOP response every 30-60 minutes\n  - Urgent ophthalmology referral within 24 hours\n\n• Definitive Management: \n  - Laser peripheral iridotomy (YAG laser) when inflammation settles\n  - Prophylactic iridotomy in fellow eye (50% risk of acute attack)\n  - Consider lens extraction if significant cataract component\n  - Long-term IOP monitoring and glaucoma surveillance\n\n• Contraindications to Treatment: \n  - Acetazolamide: severe renal/hepatic impairment, sulfa allergy\n  - Pilocarpine: acute iritis, lens-induced angle closure\n  - Beta-blockers: asthma, COPD, heart block\n\n• Prevention and Follow-up: \n  - Avoid mydriatic drugs in high-risk patients\n  - Regular ophthalmology review for chronic angle-closure\n  - Patient education regarding symptoms requiring urgent attention\n  - Family screening for anatomical predisposition"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.nice.org.uk/guidance/cg85",
            description: "NICE CG85: Glaucoma - diagnosis and management"
          },
          supplementary: [
            {
              title: "Royal College of Ophthalmologists",
              url: "https://www.rcophth.ac.uk/standards-publications-research/clinical-guidelines/",
              description: "RCOphth acute glaucoma management guidelines"
            },
            {
              title: "NHS Ophthalmology",
              url: "https://www.nhs.uk/conditions/glaucoma/",
              description: "NHS glaucoma treatment protocols"
            },
            {
              title: "SIGN Glaucoma Guidelines",
              url: "https://www.sign.ac.uk/our-guidelines/glaucoma-referral-and-safe-discharge/",
              description: "Scottish glaucoma referral guidance"
            },
            {
              title: "Emergency Eye Care",
              url: "https://www.college-optometrists.org/guidance/clinical-management-guidelines/",
              description: "Emergency ophthalmic care protocols"
            }
          ]
        }
      }
    ],
    dermatology: [
      {
        id: "derm2", 
        topic: "Psoriasis Diagnosis",
        category: "dermatology",

        question: "A 35-year-old man presents with well-demarcated, erythematous plaques covered with thick, silvery scales on his elbows and knees. He also has multiple small pits in his fingernails and some yellow-brown discoloration under the nail plates. The lesions are non-pruritic. What is the most likely diagnosis?",
        options: {
          A: "Atopic dermatitis",
          B: "Psoriasis vulgaris", 
          C: "Seborrheic dermatitis",
          D: "Lichen planus",
          E: "Contact dermatitis"
        },
        answer: "B",
        explanation: "Why Psoriasis vulgaris is correct:\n\n• Classic Plaque Morphology: \n  - Well-demarcated erythematous plaques represent the pathognomonic presentation of chronic plaque psoriasis (psoriasis vulgaris)\n  - Thick, silvery scales demonstrate the characteristic hyperkeratotic response with parakeratosis typical of psoriatic lesions\n  - Distribution on extensor surfaces (elbows, knees) follows classic psoriatic predilection sites as documented in dermatological literature\n  - Non-pruritic nature distinguishes psoriasis from eczematous conditions which are characteristically intensely itchy\n\n• Definitive Nail Psoriasis Features: \n  - Nail pitting (punctate depressions) occurs in 70-80% of psoriatic patients and represents focal loss of nail plate cells\n  - Oil spot changes (yellow-brown subungual discoloration) pathognomonic for psoriatic nail involvement, caused by accumulation of parakeratotic cells\n  - Combined nail findings strongly support psoriasis diagnosis - nail involvement seen in <5% of other inflammatory dermatoses\n  - Nail changes often precede skin lesions and may be only manifestation in 5-10% of psoriatic patients\n\n• Pathophysiological Correlation: \n  - Hyperproliferation of keratinocytes with shortened epidermal transit time from 28 days to 3-5 days\n  - Koebner phenomenon potential at sites of trauma, explaining common elbow/knee involvement\n  - Type 17 helper T-cell mediated immune response with IL-17, IL-22, TNF-alpha inflammatory cascade\n  - Genetic predisposition with HLA-Cw6 association in 60% of early-onset cases\n\n• NICE CG153 Diagnostic Criteria: \n  - Clinical diagnosis based on characteristic morphology, distribution, and associated features\n  - Auspitz sign (punctate bleeding when scales removed) may be demonstrable\n  - Family history positive in 30-40% of cases supporting genetic component\n  - Associated with psoriatic arthritis in 20-30% requiring joint screening",
        incorrectExplanation: "• Option A (Atopic dermatitis) - Distribution and Characteristics Mismatch: \n  - Atopic dermatitis typically affects flexural areas (antecubital fossae, popliteal fossae) rather than extensor surfaces\n  - Lesions characteristically intensely pruritic, contrasting with non-pruritic nature described\n  - Nail involvement extremely rare in isolated atopic dermatitis\n  - Scales less thick and silvery compared to psoriatic plaques\n  - Usually associated with personal/family history of atopy\n\n• Option C (Seborrheic dermatitis) - Anatomical and Morphological Inconsistencies: \n  - Seborrheic dermatitis shows predilection for sebaceous areas (scalp, nasolabial folds, presternal area)\n  - Scales typically greasy and yellowish rather than thick and silvery\n  - Nail changes not characteristic of seborrheic dermatitis\n  - Elbow and knee involvement would be unusual for seborrheic pattern\n  - Associated with Malassezia overgrowth rather than T-cell mediated inflammation\n\n• Option D (Lichen planus) - Morphological and Clinical Distinctions: \n  - Lichen planus presents with purple, polygonal, pruritic papules rather than erythematous plaques\n  - Characteristic Wickham's striae (white lacy pattern) on surface\n  - Nail changes include longitudinal ridging and pterygium formation, not pitting or oil spots\n  - Typically affects wrists, ankles, oral mucosa rather than elbows and knees\n  - Koebner phenomenon present but morphology completely different\n\n• Option E (Contact dermatitis) - Pattern and Progression Inconsistencies: \n  - Contact dermatitis requires identifiable allergen exposure with corresponding distribution\n  - Acute phase shows vesiculation and weeping rather than thick scaling\n  - Nail involvement not typical unless direct contact with nail area\n  - Would expect history of exposure and temporal relationship\n  - Bilateral symmetrical elbow/knee involvement unlikely for contact pattern",
        mnemonic: "Psoriasis Features: PLAQUES = Pitting (nails), Lesions well-demarcated, Auspitz sign, Quality silvery scales, Unusual extensor sites, Erythematous base, Symmetrical distribution\n\nNail Psoriasis: POSH = Pitting, Oil spots, Subungual hyperkeratosis, Hyperkeratosis/onycholysis\n\nPsoriasis Types: PEGIG = Plaque (chronic), Erythrodermic, Guttate, Inverse, Generalized pustular\n\nPsoriasis Triggers: SPLIT = Streptococcal infection, Physical trauma, Lithium/beta-blockers, Infection, Trauma/stress",
        guidelineSummary: {
          title: "Psoriasis Vulgaris Management Summary", 
          content: "• Clinical Recognition: \n  - Well-demarcated erythematous plaques with silvery scale\n  - Extensor surface predilection (elbows, knees, scalp, lower back)\n  - Nail involvement in 50-80%: pitting, oil spots, onycholysis\n  - Koebner phenomenon: lesions at trauma sites\n\n• Severity Assessment: \n  - PASI score (Psoriasis Area Severity Index) for clinical trials\n  - BSA (Body Surface Area) >10% or palms/soles = severe\n  - DLQI (Dermatology Life Quality Index) for impact assessment\n  - Joint screening for psoriatic arthritis (20-30% develop)\n\n• First-line Topical Treatment: \n  - Topical corticosteroids (potent for body, mild for face)\n  - Vitamin D analogues (calcipotriol, calcitriol)\n  - Combination products (betamethasone/calcipotriol)\n  - Coal tar preparations for chronic stable plaques\n\n• Systemic Treatment Indications: \n  - >10% BSA or significant functional impairment\n  - First-line: methotrexate, ciclosporin, acitretin\n  - Biologics: TNF-alpha inhibitors, IL-12/23, IL-17 inhibitors\n  - Regular monitoring for hepatotoxicity, nephrotoxicity\n\n• Lifestyle and Comorbidity Management: \n  - Cardiovascular risk assessment and modification\n  - Screening for metabolic syndrome, depression\n  - Avoid triggers: infection, trauma, stress, certain medications\n  - Psychological support and patient education important"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.nice.org.uk/guidance/cg153",
            description: "NICE CG153: Psoriasis - assessment and management"
          },
          supplementary: [
            {
              title: "NHS Psoriasis Information",
              url: "https://www.nhs.uk/conditions/psoriasis/",
              description: "NHS patient information and treatment options"
            },
            {
              title: "CKS NICE - Psoriasis",
              url: "https://cks.nice.org.uk/topics/psoriasis/",
              description: "NICE Clinical Knowledge Summaries for psoriasis"
            },
            {
              title: "British Association of Dermatologists - Psoriasis Guidelines",
              url: "https://www.bad.org.uk/pils/psoriasis/",
              description: "BAD professional clinical guidelines for psoriasis management"
            }
          ]
        }
      },
      {
        id: "derm1",
        topic: "Eczema Management",
        category: "dermatology",

        question: "A 25-year-old woman presents with a 6-month history of itchy, red, scaly patches on her hands and flexural areas. The rash worsens with stress and certain soaps. What is the most likely diagnosis?",
        options: {
          A: "Atopic dermatitis (eczema)",
          B: "Contact dermatitis", 
          C: "Psoriasis",
          D: "Seborrheic dermatitis",
          E: "Fungal infection"
        },
        answer: "A",
        explanation: "Why Atopic dermatitis (eczema) is correct:\n\n• NICE CG57 Diagnostic Gold Standard: \n  - Atopic dermatitis represents the most clinically appropriate diagnosis based on the constellation of presenting features aligning with UK Working Party diagnostic criteria\n  - The 6-month chronicity combined with classic flexural distribution (hands, elbows, knees) establishes the chronic relapsing nature characteristic of constitutional eczema\n  - Family history of atopic conditions strongly supports genetic predisposition consistent with atopic dermatitis per British Association of Dermatologists guidelines\n  - NICE Clinical Guideline 57 specifically emphasises that combination of chronic course, typical distribution, identified triggers, and characteristic morphology provides sufficient clinical evidence for diagnosis\n\n• Pathophysiological Confirmation: \n  - Trigger identification (stress and soaps) demonstrates the typical multifactorial pathophysiology involving barrier dysfunction, immune dysregulation, and environmental precipitants\n  - Bilateral symmetrical involvement reflects the constitutional nature rather than external contact patterns seen in allergic contact dermatitis\n  - Pruritic nature with secondary excoriation fulfils major diagnostic criteria per Royal College of Dermatologists clinical standards\n  - Type 2 inflammatory response with elevated IgE levels commonly associated with atopic constitution and genetic predisposition\n\n• Clinical Morphology Assessment: \n  - Eczematous changes (erythema, scaling, vesiculation) characteristic of acute and chronic atopic dermatitis phases documented in dermatological literature\n  - Flexural predilection represents classic distribution pattern seen in adolescent and adult atopic dermatitis, distinguishing from childhood extensor involvement\n  - Absence of other characteristic features (well-demarcated plaques, silvery scale, greasy appearance) helps exclude important differential diagnoses\n  - Lichenification and excoriation marks indicate chronic scratching behaviour typical of pruritic atopic conditions requiring long-term management\n\n• Evidence-Based Management Framework: \n  - British Association of Dermatologists consensus statements emphasise stepped care approach: emollients as foundation therapy, topical corticosteroids for acute flares, comprehensive trigger identification protocols\n  - NICE Quality Standard QS44 specifies structured patient education regarding condition management, appropriate topical therapy application techniques, and realistic treatment expectations\n  - Management should follow NICE stepped care model with regular monitoring for treatment response, side effect assessment, and quality of life impact evaluation\n  - Long-term prognosis excellent with appropriate evidence-based therapy, though condition typically persists requiring ongoing maintenance treatment and lifestyle modifications\n\n• Epidemiological and Genetic Context: \n  - Adult-onset atopic dermatitis increasingly recognised in contemporary dermatological practice, affecting 25-30% of adult cases with distinct clinical characteristics\n  - Strong genetic component with 70% concordance in monozygotic twins and clear familial clustering patterns supporting constitutional rather than environmental aetiology\n  - Associated with other atopic conditions (asthma, allergic rhinitis) in 60-80% of cases, forming part of progressive 'atopic march' requiring holistic management\n  - Environmental triggers include soap irritants, stress responses, temperature extremes, and specific allergens identified through comprehensive history taking and trigger identification protocols\n\n• Therapeutic Evidence Base and Outcomes: \n  - Cochrane systematic reviews demonstrate superior efficacy of emollient-based maintenance therapy combined with appropriate anti-inflammatory treatment during active disease phases\n  - Randomised controlled trials consistently show 70-85% clinical improvement with evidence-based stepped therapy protocols and comprehensive patient education programmes\n  - Quality of life scores significantly improve with early accurate diagnosis and implementation of evidence-based management strategies addressing both physical and psychological aspects\n  - Patient education programmes focusing on trigger avoidance and proper skincare techniques reduce healthcare utilisation and improve long-term clinical outcomes per NHS England commissioning data",
        incorrectExplanation: "• Option B (Allergic contact dermatitis) - Temporal and Distribution Pattern Contradictions: \n  - Contact dermatitis typically demonstrates clear temporal relationship between specific exposure and symptom onset, contrasting sharply with the 6-month chronic relapsing pattern described in this clinical scenario\n  - Would require prior sensitisation exposure and typically manifests 24-72 hours post-contact with specific allergen patterns corresponding directly to anatomical contact sites rather than bilateral flexural distribution\n  - Bilateral symmetrical flexural involvement more strongly suggestive of constitutional eczema rather than external contact patterns characteristic of allergic or irritant contact dermatitis\n  - Diagnostic confirmation would require comprehensive patch testing per British Contact Dermatitis Society protocols involving standardised European baseline series and extended allergen panels with 48-96 hour delayed readings\n  - Management approach differs fundamentally, focusing primarily on allergen identification through detailed occupational and environmental history, strict avoidance protocols, rather than chronic anti-inflammatory maintenance therapy\n  - Family history component significantly less relevant for contact sensitivity development compared to the strong genetic predisposition and constitutional factors central to atopic dermatitis pathogenesis\n\n• Option C (Plaque psoriasis) - Morphological and Clinical Distribution Misalignment: \n  - Psoriasis characteristically presents with well-demarcated, erythematous plaques covered by thick, silvery-white scales demonstrating positive Auspitz sign when removed, contrasting with poorly-defined eczematous patches\n  - Classic psoriatic distribution predominantly involves extensor surfaces (elbows, knees, sacrum, scalp) and nail apparatus, whilst this patient demonstrates flexural involvement characteristic of atopic dermatitis\n  - Koebner phenomenon (isomorphic response) in psoriasis shows lesion development specifically at sites of mechanical trauma or friction, fundamentally different from stress-triggered eczematous flares\n  - Psoriatic triggers include streptococcal infections, physical trauma, certain medications (lithium, beta-blockers, antimalarials), and alcohol consumption rather than soap irritants and stress sensitivity\n  - Treatment algorithms differ significantly: psoriasis responds optimally to topical vitamin D analogues, coal tar preparations, and systemic immunosuppressive agents targeting TNF-alpha and IL-17 pathways\n  - Family history patterns show distinct HLA-Cw6 association and different genetic clustering compared to atopic constitution with multiple allergic manifestations\n  - Nail involvement extremely common in psoriasis (pitting, onycholysis, oil spot changes, subungual hyperkeratosis) but characteristically absent in uncomplicated atopic dermatitis presentations\n\n• Option D (Seborrheic dermatitis) - Anatomical Predilection and Pathophysiological Distinctions: \n  - Seborrheic dermatitis demonstrates strong predilection for sebaceous gland-rich anatomical areas including scalp, nasolabial folds, eyebrows, presternal area, and axillae rather than flexural hand involvement\n  - Pathophysiology centres specifically on Malassezia species (particularly M. restricta and M. globosa) overgrowth in sebaceous environments rather than type 2 immune response and barrier dysfunction characteristic of atopic conditions\n  - Clinical morphology consistently shows greasy, yellowish scales with underlying erythema and occasional crusting rather than the dry, pruritic, scaly eczematous patches described\n  - Trigger factors include hormonal fluctuations, neurological conditions (Parkinson's disease, depression), immunosuppressive states, and seasonal variation rather than stress and soap sensitivity patterns\n  - Therapeutic approach emphasises antifungal agents (ketoconazole, selenium sulfide, zinc pyrithione) and mild anti-inflammatory preparations rather than intensive emollient therapy and barrier restoration\n  - Family history of atopic conditions not relevant for seborrheic dermatitis pathogenesis, which relates more to individual sebaceous gland activity and Malassezia colonisation patterns\n\n• Option E (Tinea corporis/superficial fungal infection) - Microbiological and Clinical Morphology Contradictions: \n  - Superficial fungal infections would demonstrate positive potassium hydroxide (KOH) microscopy showing characteristic fungal hyphae and spores, requiring mycological confirmation for definitive diagnosis\n  - Typical morphology includes well-demarcated annular lesions with raised, scaly, inflammatory borders and characteristic central clearing ('ringworm' appearance) rather than diffuse eczematous changes\n  - Fungal infections rarely demonstrate bilateral symmetrical distribution patterns and typically affect exposed areas or sites of increased moisture and friction rather than constitutional flexural involvement\n  - Clinical response to appropriate antifungal therapy (topical terbinafine, clotrimazole, or systemic antifungals) would be expected within 2-4 weeks, contrasting with chronic relapsing course and trigger responsiveness\n  - Risk factors include immunosuppression, diabetes mellitus, communal bathing facilities, occupational animal contact, and tropical climates rather than stress sensitivity and genetic atopic predisposition\n  - Tinea manuum (hand dermatophytosis) typically presents unilaterally with characteristic 'two-foot-one-hand' syndrome when associated with concurrent pedal involvement, not bilateral flexural distribution patterns",
        mnemonic: {
          title: "Atopic Dermatitis Assessment",
          content: [
            "ECZEMA Management: Education, Zone identification, Chronic nature, Emollients, Medication (topical), Avoidance (triggers)",
            "FLEXURAL Distribution: Face, Lower arms/legs, Extensor (in children), eXcoriations, Upper arms/legs, Reactive patterns, Areas of friction, Lichenification",
            "TRIGGER Identification: Temperature changes, Rough fabrics, Irritants (soaps), Genetics, Genetics, Environmental allergens, Respiratory associations"
          ]
        },
        clinicalGuidelines: {
          title: "Comprehensive Atopic Dermatitis Management Summary",
          content: [
            "Definition & Recognition: Chronic inflammatory skin condition affecting 15-20% of children and 2-10% of adults - characterised by pruritic, eczematous lesions in typical distribution - strong association with personal/family history of atopic diseases",
            "Diagnostic Criteria: UK Working Party criteria require itchy skin plus 3+ of: visible flexural dermatitis, personal history of flexural dermatitis, personal history of dry skin, personal history of other atopic disease, onset before age 2",
            "Primary Management Strategy: Stepped care approach beginning with trigger identification, emollient therapy, and topical anti-inflammatories - escalation to systemic therapy reserved for severe, treatment-resistant cases",
            "Quality of Life Impact: Significant psychosocial burden requiring holistic management approach including sleep hygiene, stress management, and family support systems"
          ]
        },
        ukGuidance: {
          title: "NICE CG57: Atopic eczema in under 12s",
          url: "https://www.nice.org.uk/guidance/cg57"
        },
        supplementaryReferences: [
          {
            title: "NHS Eczema Treatment Guidelines",
            url: "https://www.nhs.uk/conditions/atopic-eczema/"
          },
          {
            title: "National Eczema Society UK", 
            url: "https://eczema.org/"
          },
          {
            title: "DermNet NZ Atopic Dermatitis",
            url: "https://dermnetnz.org/topics/atopic-dermatitis"
          }
        ],
        studyTip: {
          title: "Foundation Doctor Study Tip",
          content: "Use this comprehensive summary for quick revision, then explore the supplementary guidelines for deeper understanding. Each reference provides specific protocols used in UK clinical practice for optimal patient outcomes."
        }
      },
      {
        id: "derm2", 
        topic: "Psoriasis Visual Diagnosis",
        category: "dermatology",
        images: [
          {
            type: "svg",
            content: `<svg width="400" height="320" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- Ultra-detailed silvery scale pattern -->
                <pattern id="silverScale1" patternUnits="userSpaceOnUse" width="6" height="6">
                  <rect width="6" height="6" fill="#f8f8f8"/>
                  <rect width="3" height="3" fill="#ffffff" opacity="0.95"/>
                  <rect x="1" y="1" width="2" height="2" fill="#f0f0f0"/>
                  <rect x="2" y="2" width="1" height="1" fill="#e8e8e8"/>
                  <circle cx="3" cy="3" r="0.5" fill="#ffffff"/>
                </pattern>
                
                <!-- Microvascular pattern for inflammation -->
                <pattern id="microVessels1" patternUnits="userSpaceOnUse" width="4" height="4">
                  <line x1="0" y1="2" x2="4" y2="2" stroke="#cc4444" stroke-width="0.3" opacity="0.7"/>
                  <line x1="2" y1="0" x2="2" y2="4" stroke="#cc4444" stroke-width="0.3" opacity="0.7"/>
                </pattern>
                
                <!-- Advanced skin gradient with realistic tones -->
                <radialGradient id="skinGrad1" cx="50%" cy="50%">
                  <stop offset="0%" stop-color="#f7d7b8"/>
                  <stop offset="30%" stop-color="#f4c2a1"/>
                  <stop offset="70%" stop-color="#e8b896"/>
                  <stop offset="100%" stop-color="#dda975"/>
                </radialGradient>
                
                <!-- Complex plaque gradient with depth -->
                <radialGradient id="plaqueGrad1" cx="25%" cy="25%">
                  <stop offset="0%" stop-color="#f87171"/>
                  <stop offset="20%" stop-color="#e85d75"/>
                  <stop offset="60%" stop-color="#dc2626"/>
                  <stop offset="85%" stop-color="#b91c1c"/>
                  <stop offset="100%" stop-color="#991b1b"/>
                </radialGradient>
                
                <!-- Inflammatory border gradient -->
                <radialGradient id="inflammatoryBorder1" cx="50%" cy="50%">
                  <stop offset="80%" stop-color="transparent"/>
                  <stop offset="90%" stop-color="#dc2626" stop-opacity="0.6"/>
                  <stop offset="100%" stop-color="#991b1b" stop-opacity="0.8"/>
                </radialGradient>
              </defs>
              
              <!-- Background skin with realistic texture -->
              <rect width="400" height="250" fill="url(#skinGrad1)"/>
              
              <!-- Skin pores and texture details -->
              <circle cx="80" cy="60" r="0.8" fill="#d4a574" opacity="0.6"/>
              <circle cx="95" cy="75" r="0.6" fill="#d4a574" opacity="0.5"/>
              <circle cx="110" cy="50" r="0.7" fill="#d4a574" opacity="0.6"/>
              <circle cx="250" cy="65" r="0.8" fill="#d4a574" opacity="0.6"/>
              <circle cx="280" cy="80" r="0.6" fill="#d4a574" opacity="0.5"/>
              <circle cx="320" cy="55" r="0.7" fill="#d4a574" opacity="0.6"/>
              
              <!-- Elbow joint anatomy with detailed structure -->
              <ellipse cx="200" cy="130" rx="150" ry="100" fill="#deb896" stroke="#c8a270" stroke-width="2"/>
              <ellipse cx="200" cy="115" rx="40" ry="25" fill="#d4a574" stroke="#b8935f" stroke-width="1"/>
              
              <!-- Olecranon prominence -->
              <ellipse cx="200" cy="110" rx="25" ry="15" fill="#c8a270" stroke="#b8935f" stroke-width="1"/>
              
              <!-- Main psoriatic plaque with 3D appearance -->
              <ellipse cx="200" cy="140" rx="80" ry="55" fill="url(#plaqueGrad1)" stroke="#991b1b" stroke-width="4"/>
              <ellipse cx="200" cy="138" rx="78" ry="53" fill="url(#microVessels1)" opacity="0.4"/>
              <ellipse cx="200" cy="136" rx="76" ry="51" fill="url(#silverScale1)" opacity="0.85"/>
              
              <!-- Inflammatory halo around main plaque -->
              <ellipse cx="200" cy="140" rx="85" ry="60" fill="url(#inflammatoryBorder1)"/>
              
              <!-- Satellite lesions with detail -->
              <ellipse cx="140" cy="105" rx="25" ry="18" fill="url(#plaqueGrad1)" stroke="#991b1b" stroke-width="3"/>
              <ellipse cx="140" cy="104" rx="24" ry="17" fill="url(#microVessels1)" opacity="0.3"/>
              <ellipse cx="140" cy="103" rx="23" ry="16" fill="url(#silverScale1)" opacity="0.8"/>
              
              <ellipse cx="260" cy="155" rx="30" ry="22" fill="url(#plaqueGrad1)" stroke="#991b1b" stroke-width="3"/>
              <ellipse cx="260" cy="154" rx="29" ry="21" fill="url(#microVessels1)" opacity="0.3"/>
              <ellipse cx="260" cy="153" rx="28" ry="20" fill="url(#silverScale1)" opacity="0.8"/>
              
              <ellipse cx="170" cy="180" rx="20" ry="15" fill="url(#plaqueGrad1)" stroke="#991b1b" stroke-width="2"/>
              <ellipse cx="170" cy="179" rx="19" ry="14" fill="url(#silverScale1)" opacity="0.75"/>
              
              <!-- Koebner phenomenon with precise detail -->
              <rect x="150" y="85" width="100" height="6" fill="#dc2626" rx="3"/>
              <rect x="150" y="84" width="100" height="6" fill="url(#silverScale1)" opacity="0.7"/>
              
              <!-- Well-demarcated borders with inflammatory edge -->
              <ellipse cx="200" cy="140" rx="80" ry="55" fill="none" stroke="#7f1d1d" stroke-width="3" stroke-dasharray="4,3"/>
              
              <!-- Individual scale flakes with shadows -->
              <ellipse cx="185" cy="125" rx="4" ry="2" fill="#ffffff" opacity="0.95" transform="rotate(15 185 125)"/>
              <ellipse cx="184" cy="126" rx="4" ry="2" fill="#cccccc" opacity="0.3" transform="rotate(15 184 126)"/>
              
              <ellipse cx="215" cy="145" rx="5" ry="2.5" fill="#ffffff" opacity="0.95" transform="rotate(-20 215 145)"/>
              <ellipse cx="214" cy="146" rx="5" ry="2.5" fill="#cccccc" opacity="0.3" transform="rotate(-20 214 146)"/>
              
              <ellipse cx="190" cy="160" rx="3" ry="1.5" fill="#ffffff" opacity="0.9" transform="rotate(45 190 160)"/>
              <ellipse cx="189" cy="161" rx="3" ry="1.5" fill="#cccccc" opacity="0.3" transform="rotate(45 189 161)"/>
              
              <!-- Auspitz sign (pinpoint bleeding) with detail -->
              <circle cx="195" cy="135" r="1.5" fill="#cc0000" opacity="0.9"/>
              <circle cx="194.5" cy="134.5" r="0.8" fill="#ff4444" opacity="0.7"/>
              
              <circle cx="210" cy="150" r="1.2" fill="#cc0000" opacity="0.9"/>
              <circle cx="209.5" cy="149.5" r="0.6" fill="#ff4444" opacity="0.7"/>
              
              <!-- Capillary loops (dermatoscopic detail) -->
              <path d="M180 130 Q185 128 190 130" stroke="#cc4444" stroke-width="0.8" fill="none" opacity="0.8"/>
              <path d="M205 155 Q210 153 215 155" stroke="#cc4444" stroke-width="0.8" fill="none" opacity="0.8"/>
              
              <!-- Hyperkeratotic scale buildup -->
              <ellipse cx="200" cy="135" rx="50" ry="30" fill="#ffffff" opacity="0.8" stroke="#e8e8e8" stroke-width="2"/>
              <ellipse cx="195" cy="130" rx="20" ry="12" fill="#ffffff" opacity="0.9" stroke="#e0e0e0" stroke-width="1"/>
              <ellipse cx="205" cy="145" rx="25" ry="15" fill="#ffffff" opacity="0.9" stroke="#e0e0e0" stroke-width="1"/>
              
              <!-- Surface texture ridges -->
              <path d="M160 125 Q200 120 240 125" stroke="#dddddd" stroke-width="1" fill="none" opacity="0.7"/>
              <path d="M165 135 Q200 130 235 135" stroke="#dddddd" stroke-width="1" fill="none" opacity="0.7"/>
              <path d="M170 145 Q200 140 230 145" stroke="#dddddd" stroke-width="1" fill="none" opacity="0.7"/>
              
              <text x="200" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#333">Elbow: Classic Extensor Surface Psoriasis</text>
              <text x="200" y="295" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">Well-demarcated plaques with silvery scale, Auspitz sign, and Koebner phenomenon</text>
              <text x="200" y="310" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#888">Note: Capillary loops, inflammatory halo, and hyperkeratotic scale buildup</text>
            </svg>`,
            alt: "Detailed psoriasis lesion on elbow showing well-demarcated erythematous plaques with silvery scales",
            caption: "Classic extensor surface involvement with satellite lesions"
          },
          {
            type: "svg", 
            content: `<svg width="400" height="320" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- Ultra-detailed silvery scale pattern for knee -->
                <pattern id="silverScale2" patternUnits="userSpaceOnUse" width="5" height="5">
                  <rect width="5" height="5" fill="#f9f9f9"/>
                  <rect width="2.5" height="2.5" fill="#ffffff" opacity="0.98"/>
                  <rect x="1" y="1" width="1.5" height="1.5" fill="#f2f2f2"/>
                  <circle cx="2.5" cy="2.5" r="0.4" fill="#ffffff"/>
                  <path d="M0 2.5 L5 2.5 M2.5 0 L2.5 5" stroke="#f5f5f5" stroke-width="0.2"/>
                </pattern>
                
                <!-- Advanced microvascular network -->
                <pattern id="microVessels2" patternUnits="userSpaceOnUse" width="6" height="6">
                  <path d="M0 3 Q3 1 6 3" stroke="#dd4444" stroke-width="0.4" fill="none" opacity="0.8"/>
                  <path d="M3 0 Q1 3 3 6" stroke="#dd4444" stroke-width="0.4" fill="none" opacity="0.8"/>
                  <circle cx="3" cy="3" r="0.3" fill="#ee5555" opacity="0.6"/>
                </pattern>
                
                <!-- Sophisticated skin gradient -->
                <radialGradient id="skinGrad2" cx="50%" cy="50%">
                  <stop offset="0%" stop-color="#f8d8bb"/>
                  <stop offset="25%" stop-color="#f5c5a4"/>
                  <stop offset="65%" stop-color="#e9bb99"/>
                  <stop offset="90%" stop-color="#ddaa78"/>
                  <stop offset="100%" stop-color="#d19c6d"/>
                </radialGradient>
                
                <!-- Complex inflammatory plaque gradient -->
                <radialGradient id="plaqueGrad2" cx="20%" cy="20%">
                  <stop offset="0%" stop-color="#fca5a5"/>
                  <stop offset="15%" stop-color="#f87171"/>
                  <stop offset="40%" stop-color="#e85d75"/>
                  <stop offset="70%" stop-color="#dc2626"/>
                  <stop offset="90%" stop-color="#b91c1c"/>
                  <stop offset="100%" stop-color="#7f1d1d"/>
                </radialGradient>
                
                <!-- Inflammatory zone gradient -->
                <radialGradient id="inflammatoryZone2" cx="50%" cy="50%">
                  <stop offset="75%" stop-color="transparent"/>
                  <stop offset="85%" stop-color="#dc2626" stop-opacity="0.4"/>
                  <stop offset="95%" stop-color="#b91c1c" stop-opacity="0.7"/>
                  <stop offset="100%" stop-color="#7f1d1d" stop-opacity="0.9"/>
                </radialGradient>
                
                <!-- Patella bone structure gradient -->
                <linearGradient id="patellaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#d4a574"/>
                  <stop offset="50%" stop-color="#c8a270"/>
                  <stop offset="100%" stop-color="#b8935f"/>
                </linearGradient>
              </defs>
              
              <!-- Background skin with realistic texture -->
              <rect width="400" height="250" fill="url(#skinGrad2)"/>
              
              <!-- Detailed skin texture and pores -->
              <circle cx="70" cy="50" r="1" fill="#d4a574" opacity="0.7"/>
              <circle cx="90" cy="70" r="0.8" fill="#d4a574" opacity="0.6"/>
              <circle cx="110" cy="45" r="0.9" fill="#d4a574" opacity="0.7"/>
              <circle cx="330" cy="60" r="1" fill="#d4a574" opacity="0.7"/>
              <circle cx="310" cy="80" r="0.8" fill="#d4a574" opacity="0.6"/>
              <circle cx="290" cy="55" r="0.9" fill="#d4a574" opacity="0.7"/>
              
              <!-- Skin creases and natural folds -->
              <path d="M50 120 Q200 115 350 120" stroke="#c8a270" stroke-width="1" fill="none" opacity="0.5"/>
              <path d="M60 140 Q200 135 340 140" stroke="#c8a270" stroke-width="0.8" fill="none" opacity="0.4"/>
              
              <!-- Knee joint anatomy with detailed structure -->
              <ellipse cx="200" cy="155" rx="140" ry="110" fill="#deb896" stroke="#c8a270" stroke-width="3"/>
              
              <!-- Patella (kneecap) with realistic bone contour -->
              <ellipse cx="200" cy="130" rx="45" ry="35" fill="url(#patellaGrad)" stroke="#b8935f" stroke-width="2"/>
              <ellipse cx="200" cy="125" rx="35" ry="25" fill="#c8a270" stroke="#b8935f" stroke-width="1"/>
              
              <!-- Patellar tendon area -->
              <ellipse cx="200" cy="180" rx="25" ry="40" fill="#c8a270" stroke="#b8935f" stroke-width="1" opacity="0.8"/>
              
              <!-- Main confluent psoriatic plaque with 3D depth -->
              <ellipse cx="200" cy="155" rx="85" ry="60" fill="url(#plaqueGrad2)" stroke="#991b1b" stroke-width="5"/>
              <ellipse cx="200" cy="153" rx="83" ry="58" fill="url(#microVessels2)" opacity="0.5"/>
              <ellipse cx="200" cy="151" rx="81" ry="56" fill="url(#silverScale2)" opacity="0.9"/>
              
              <!-- Inflammatory halo with vascular prominence -->
              <ellipse cx="200" cy="155" rx="90" ry="65" fill="url(#inflammatoryZone2)"/>
              
              <!-- Bilateral symmetrical satellite lesions -->
              <ellipse cx="125" cy="115" rx="28" ry="22" fill="url(#plaqueGrad2)" stroke="#991b1b" stroke-width="3"/>
              <ellipse cx="125" cy="114" rx="27" ry="21" fill="url(#microVessels2)" opacity="0.4"/>
              <ellipse cx="125" cy="113" rx="26" ry="20" fill="url(#silverScale2)" opacity="0.85"/>
              
              <ellipse cx="275" cy="115" rx="28" ry="22" fill="url(#plaqueGrad2)" stroke="#991b1b" stroke-width="3"/>
              <ellipse cx="275" cy="114" rx="27" ry="21" fill="url(#microVessels2)" opacity="0.4"/>
              <ellipse cx="275" cy="113" rx="26" ry="20" fill="url(#silverScale2)" opacity="0.85"/>
              
              <ellipse cx="140" cy="195" rx="32" ry="24" fill="url(#plaqueGrad2)" stroke="#991b1b" stroke-width="3"/>
              <ellipse cx="140" cy="194" rx="31" ry="23" fill="url(#microVessels2)" opacity="0.4"/>
              <ellipse cx="140" cy="193" rx="30" ry="22" fill="url(#silverScale2)" opacity="0.85"/>
              
              <ellipse cx="260" cy="195" rx="32" ry="24" fill="url(#plaqueGrad2)" stroke="#991b1b" stroke-width="3"/>
              <ellipse cx="260" cy="194" rx="31" ry="23" fill="url(#microVessels2)" opacity="0.4"/>
              <ellipse cx="260" cy="193" rx="30" ry="22" fill="url(#silverScale2)" opacity="0.85"/>
              
              <!-- Additional small lesions showing coalescence -->
              <ellipse cx="180" cy="185" rx="18" ry="14" fill="url(#plaqueGrad2)" stroke="#991b1b" stroke-width="2"/>
              <ellipse cx="180" cy="184" rx="17" ry="13" fill="url(#silverScale2)" opacity="0.8"/>
              
              <ellipse cx="220" cy="185" rx="18" ry="14" fill="url(#plaqueGrad2)" stroke="#991b1b" stroke-width="2"/>
              <ellipse cx="220" cy="184" rx="17" ry="13" fill="url(#silverScale2)" opacity="0.8"/>
              
              <!-- Auspitz sign with detailed bleeding points -->
              <circle cx="185" cy="145" r="2" fill="#cc0000" opacity="0.95"/>
              <circle cx="184.5" cy="144.5" r="1" fill="#ff4444" opacity="0.8"/>
              <circle cx="184" cy="144" r="0.5" fill="#ffaaaa" opacity="0.6"/>
              
              <circle cx="215" cy="160" r="1.8" fill="#cc0000" opacity="0.95"/>
              <circle cx="214.5" cy="159.5" r="0.9" fill="#ff4444" opacity="0.8"/>
              
              <circle cx="200" cy="175" r="2.2" fill="#cc0000" opacity="0.95"/>
              <circle cx="199.5" cy="174.5" r="1.1" fill="#ff4444" opacity="0.8"/>
              
              <!-- Dermatoscopic features - capillary loops -->
              <path d="M170 140 Q175 138 180 140 Q175 142 170 140" stroke="#dd4444" stroke-width="1" fill="none" opacity="0.9"/>
              <path d="M220 165 Q225 163 230 165 Q225 167 220 165" stroke="#dd4444" stroke-width="1" fill="none" opacity="0.9"/>
              <path d="M190 180 Q195 178 200 180 Q195 182 190 180" stroke="#dd4444" stroke-width="1" fill="none" opacity="0.9"/>
              
              <!-- Individual scale flakes with realistic shadows -->
              <ellipse cx="175" cy="135" rx="6" ry="3" fill="#ffffff" opacity="0.98" transform="rotate(25 175 135)"/>
              <ellipse cx="174" cy="136" rx="6" ry="3" fill="#cccccc" opacity="0.4" transform="rotate(25 174 136)"/>
              
              <ellipse cx="225" cy="155" rx="7" ry="3.5" fill="#ffffff" opacity="0.98" transform="rotate(-15 225 155)"/>
              <ellipse cx="224" cy="156" rx="7" ry="3.5" fill="#cccccc" opacity="0.4" transform="rotate(-15 224 156)"/>
              
              <ellipse cx="190" cy="170" rx="5" ry="2.5" fill="#ffffff" opacity="0.95" transform="rotate(60 190 170)"/>
              <ellipse cx="189" cy="171" rx="5" ry="2.5" fill="#cccccc" opacity="0.4" transform="rotate(60 189 171)"/>
              
              <!-- Thick hyperkeratotic scale accumulation -->
              <ellipse cx="200" cy="150" rx="55" ry="35" fill="#ffffff" opacity="0.85" stroke="#e8e8e8" stroke-width="3"/>
              <ellipse cx="190" cy="145" rx="25" ry="15" fill="#ffffff" opacity="0.95" stroke="#e0e0e0" stroke-width="2"/>
              <ellipse cx="210" cy="160" rx="30" ry="18" fill="#ffffff" opacity="0.95" stroke="#e0e0e0" stroke-width="2"/>
              
              <!-- Surface contour lines showing raised plaque -->
              <ellipse cx="200" cy="155" rx="85" ry="60" fill="none" stroke="#7f1d1d" stroke-width="3" stroke-dasharray="5,4"/>
              <ellipse cx="200" cy="155" rx="70" ry="45" fill="none" stroke="#991b1b" stroke-width="2" stroke-dasharray="3,2" opacity="0.8"/>
              
              <!-- Scale ridge patterns -->
              <path d="M140 140 Q200 135 260 140" stroke="#f0f0f0" stroke-width="1.5" fill="none" opacity="0.8"/>
              <path d="M145 150 Q200 145 255 150" stroke="#f0f0f0" stroke-width="1.5" fill="none" opacity="0.8"/>
              <path d="M150 160 Q200 155 250 160" stroke="#f0f0f0" stroke-width="1.5" fill="none" opacity="0.8"/>
              <path d="M155 170 Q200 165 245 170" stroke="#f0f0f0" stroke-width="1.5" fill="none" opacity="0.8"/>
              
              <text x="200" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#333">Knee: Bilateral Symmetrical Psoriatic Distribution</text>
              <text x="200" y="295" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">Confluent plaques over joint prominence with prominent Auspitz sign</text>
              <text x="200" y="310" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#888">Note: Dermatoscopic capillary loops, hyperkeratotic scaling, and bilateral symmetry</text>
            </svg>`,
            alt: "Psoriasis lesions on knee showing bilateral symmetrical pattern with confluent plaques",
            caption: "Bilateral extensor involvement with positive Auspitz sign"
          },
          {
            type: "svg",
            content: `<svg width="400" height="320" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- Ultra-detailed scalp scale pattern -->
                <pattern id="silverScale3" patternUnits="userSpaceOnUse" width="3" height="3">
                  <rect width="3" height="3" fill="#fcfcfc"/>
                  <rect width="1.5" height="1.5" fill="#ffffff" opacity="0.99"/>
                  <rect x="0.5" y="0.5" width="1" height="1" fill="#f8f8f8"/>
                  <circle cx="1.5" cy="1.5" r="0.2" fill="#ffffff"/>
                  <path d="M0 1.5 L3 1.5 M1.5 0 L1.5 3" stroke="#fafafa" stroke-width="0.1"/>
                </pattern>
                
                <!-- Realistic hair pattern with varying thickness -->
                <pattern id="hairPattern" patternUnits="userSpaceOnUse" width="4" height="16">
                  <line x1="1" y1="0" x2="1" y2="16" stroke="#8b4513" stroke-width="1.2" opacity="0.8"/>
                  <line x1="0.2" y1="0" x2="0.2" y2="16" stroke="#654321" stroke-width="0.8" opacity="0.7"/>
                  <line x1="3.8" y1="0" x2="3.8" y2="16" stroke="#a0522d" stroke-width="1" opacity="0.7"/>
                  <line x1="2" y1="0" x2="2" y2="16" stroke="#5d4e37" stroke-width="0.6" opacity="0.6"/>
                  <line x1="3" y1="0" x2="3" y2="16" stroke="#8b7355" stroke-width="0.9" opacity="0.7"/>
                </pattern>
                
                <!-- Detailed thinning hair pattern -->
                <pattern id="thinningHair" patternUnits="userSpaceOnUse" width="6" height="20">
                  <line x1="2" y1="0" x2="2" y2="20" stroke="#8b4513" stroke-width="0.6" opacity="0.4"/>
                  <line x1="4" y1="0" x2="4" y2="20" stroke="#654321" stroke-width="0.4" opacity="0.3"/>
                  <line x1="0.5" y1="0" x2="0.5" y2="20" stroke="#a0522d" stroke-width="0.5" opacity="0.3"/>
                </pattern>
                
                <!-- Advanced scalp gradient with realistic tones -->
                <radialGradient id="scalpGrad" cx="50%" cy="50%">
                  <stop offset="0%" stop-color="#f9dcc4"/>
                  <stop offset="20%" stop-color="#f6c7aa"/>
                  <stop offset="50%" stop-color="#f0b896"/>
                  <stop offset="80%" stop-color="#e8aa7d"/>
                  <stop offset="100%" stop-color="#dd9964"/>
                </radialGradient>
                
                <!-- Complex scalp psoriasis plaque gradient -->
                <radialGradient id="scalyPlaque" cx="30%" cy="30%">
                  <stop offset="0%" stop-color="#ff9999"/>
                  <stop offset="10%" stop-color="#f87171"/>
                  <stop offset="30%" stop-color="#e85d75"/>
                  <stop offset="60%" stop-color="#dc2626"/>
                  <stop offset="85%" stop-color="#b91c1c"/>
                  <stop offset="100%" stop-color="#7f1d1d"/>
                </radialGradient>
                
                <!-- Inflammatory scalp gradient -->
                <radialGradient id="inflammatoryScalp" cx="50%" cy="50%">
                  <stop offset="70%" stop-color="transparent"/>
                  <stop offset="80%" stop-color="#dc2626" stop-opacity="0.3"/>
                  <stop offset="90%" stop-color="#b91c1c" stop-opacity="0.6"/>
                  <stop offset="100%" stop-color="#7f1d1d" stop-opacity="0.8"/>
                </radialGradient>
                
                <!-- Candle grease effect gradient -->
                <linearGradient id="candleGrease" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
                  <stop offset="30%" stop-color="#f8f8f8" stop-opacity="0.9"/>
                  <stop offset="70%" stop-color="#f0f0f0" stop-opacity="0.85"/>
                  <stop offset="100%" stop-color="#e8e8e8" stop-opacity="0.8"/>
                </linearGradient>
              </defs>
              
              <!-- Background scalp with realistic texture -->
              <rect width="400" height="250" fill="url(#scalpGrad)"/>
              
              <!-- Scalp pores and follicle details -->
              <circle cx="80" cy="50" r="0.6" fill="#dd9964" opacity="0.8"/>
              <circle cx="120" cy="40" r="0.8" fill="#dd9964" opacity="0.7"/>
              <circle cx="280" cy="45" r="0.7" fill="#dd9964" opacity="0.8"/>
              <circle cx="320" cy="60" r="0.6" fill="#dd9964" opacity="0.7"/>
              
              <!-- Head/scalp anatomical outline -->
              <ellipse cx="200" cy="155" rx="130" ry="100" fill="#e8bb99" stroke="#d4a574" stroke-width="3"/>
              <ellipse cx="200" cy="140" rx="120" ry="85" fill="#f0c8a6" stroke="#e0b896" stroke-width="2"/>
              
              <!-- Detailed hair coverage with natural growth patterns -->
              <ellipse cx="200" cy="120" rx="115" ry="75" fill="url(#hairPattern)" opacity="0.85"/>
              
              <!-- Hair whorl patterns -->
              <circle cx="180" cy="100" r="20" fill="url(#hairPattern)" opacity="0.7" transform="rotate(15 180 100)"/>
              <circle cx="220" cy="110" r="15" fill="url(#hairPattern)" opacity="0.6" transform="rotate(-20 220 110)"/>
              
              <!-- Main scalp psoriasis lesion with complex morphology -->
              <path d="M80 105 Q200 80 320 105 Q310 145 200 155 Q90 145 80 105" fill="url(#scalyPlaque)" stroke="#991b1b" stroke-width="4"/>
              <path d="M82 107 Q200 82 318 107 Q308 143 200 153 Q92 143 82 107" fill="url(#silverScale3)" opacity="0.95"/>
              
              <!-- Inflammatory halo around lesion -->
              <path d="M75 100 Q200 75 325 100 Q315 150 200 160 Q85 150 75 100" fill="url(#inflammatoryScalp)"/>
              
              <!-- Linear lesions extending beyond hairline with precise detail -->
              <ellipse cx="95" cy="85" rx="15" ry="35" fill="url(#scalyPlaque)" stroke="#991b1b" stroke-width="3"/>
              <ellipse cx="95" cy="85" rx="14" ry="34" fill="url(#silverScale3)" opacity="0.9"/>
              
              <ellipse cx="305" cy="85" rx="15" ry="35" fill="url(#scalyPlaque)" stroke="#991b1b" stroke-width="3"/>
              <ellipse cx="305" cy="85" rx="14" ry="34" fill="url(#silverScale3)" opacity="0.9"/>
              
              <!-- Additional satellite lesions -->
              <ellipse cx="140" cy="95" rx="18" ry="25" fill="url(#scalyPlaque)" stroke="#991b1b" stroke-width="2"/>
              <ellipse cx="140" cy="95" rx="17" ry="24" fill="url(#silverScale3)" opacity="0.85"/>
              
              <ellipse cx="260" cy="95" rx="18" ry="25" fill="url(#scalyPlaque)" stroke="#991b1b" stroke-width="2"/>
              <ellipse cx="260" cy="95" rx="17" ry="24" fill="url(#silverScale3)" opacity="0.85"/>
              
              <!-- Thick adherent scale buildup (candle grease sign) -->
              <ellipse cx="200" cy="105" rx="70" ry="30" fill="url(#candleGrease)" stroke="#e8e8e8" stroke-width="4"/>
              <ellipse cx="180" cy="100" rx="30" ry="12" fill="#ffffff" stroke="#e0e0e0" stroke-width="3" opacity="0.95"/>
              <ellipse cx="220" cy="110" rx="35" ry="15" fill="#ffffff" stroke="#e0e0e0" stroke-width="3" opacity="0.95"/>
              <ellipse cx="200" cy="125" rx="25" ry="10" fill="#ffffff" stroke="#e0e0e0" stroke-width="2" opacity="0.95"/>
              
              <!-- Individual scale flakes with realistic 3D shadows -->
              <ellipse cx="170" cy="95" rx="8" ry="4" fill="#ffffff" opacity="0.99" transform="rotate(35 170 95)"/>
              <ellipse cx="169" cy="96" rx="8" ry="4" fill="#cccccc" opacity="0.5" transform="rotate(35 169 96)"/>
              
              <ellipse cx="230" cy="105" rx="10" ry="5" fill="#ffffff" opacity="0.99" transform="rotate(-25 230 105)"/>
              <ellipse cx="229" cy="106" rx="10" ry="5" fill="#cccccc" opacity="0.5" transform="rotate(-25 229 106)"/>
              
              <ellipse cx="190" cy="120" rx="7" ry="3.5" fill="#ffffff" opacity="0.98" transform="rotate(60 190 120)"/>
              <ellipse cx="189" cy="121" rx="7" ry="3.5" fill="#cccccc" opacity="0.5" transform="rotate(60 189 121)"/>
              
              <ellipse cx="210" cy="115" rx="6" ry="3" fill="#ffffff" opacity="0.98" transform="rotate(-45 210 115)"/>
              <ellipse cx="209" cy="116" rx="6" ry="3" fill="#cccccc" opacity="0.5" transform="rotate(-45 209 116)"/>
              
              <!-- Candle grease sign characteristic ridges -->
              <ellipse cx="200" cy="105" rx="50" ry="20" fill="none" stroke="#d0d0d0" stroke-width="3" stroke-dasharray="3,2"/>
              <ellipse cx="200" cy="105" rx="40" ry="15" fill="none" stroke="#d8d8d8" stroke-width="2" stroke-dasharray="2,1"/>
              <ellipse cx="200" cy="105" rx="30" ry="10" fill="none" stroke="#e0e0e0" stroke-width="1" stroke-dasharray="1,1"/>
              
              <!-- Hair thinning and breakage in affected areas -->
              <ellipse cx="200" cy="105" rx="50" ry="25" fill="url(#thinningHair)" opacity="0.6"/>
              
              <!-- Hair shaft disruption -->
              <path d="M160 90 L165 95" stroke="#8b4513" stroke-width="1" opacity="0.4"/>
              <path d="M240 100 L235 105" stroke="#8b4513" stroke-width="1" opacity="0.4"/>
              <path d="M180 110 L185 115" stroke="#654321" stroke-width="0.8" opacity="0.4"/>
              
              <!-- Follicular involvement -->
              <circle cx="175" cy="100" r="1.5" fill="#dc2626" opacity="0.8"/>
              <circle cx="225" cy="110" r="1.2" fill="#dc2626" opacity="0.8"/>
              <circle cx="195" cy="115" r="1.8" fill="#dc2626" opacity="0.8"/>
              
              <!-- Perifollicular erythema -->
              <circle cx="175" cy="100" r="3" fill="#dc2626" opacity="0.3"/>
              <circle cx="225" cy="110" r="2.5" fill="#dc2626" opacity="0.3"/>
              <circle cx="195" cy="115" r="3.5" fill="#dc2626" opacity="0.3"/>
              
              <!-- Scale accumulation patterns -->
              <path d="M130 95 Q200 90 270 95" stroke="#f5f5f5" stroke-width="2" fill="none" opacity="0.9"/>
              <path d="M135 105 Q200 100 265 105" stroke="#f5f5f5" stroke-width="2" fill="none" opacity="0.9"/>
              <path d="M140 115 Q200 110 260 115" stroke="#f5f5f5" stroke-width="2" fill="none" opacity="0.9"/>
              <path d="M145 125 Q200 120 255 125" stroke="#f5f5f5" stroke-width="2" fill="none" opacity="0.9"/>
              
              <!-- Micaceous scale texture -->
              <rect x="185" y="95" width="8" height="3" fill="#ffffff" opacity="0.95" rx="1" transform="rotate(20 185 95)"/>
              <rect x="215" y="105" width="10" height="4" fill="#ffffff" opacity="0.95" rx="1" transform="rotate(-30 215 105)"/>
              <rect x="175" y="115" width="6" height="2" fill="#ffffff" opacity="0.95" rx="1" transform="rotate(50 175 115)"/>
              <rect x="225" y="100" width="9" height="3" fill="#ffffff" opacity="0.95" rx="1" transform="rotate(-10 225 100)"/>
              
              <text x="200" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#333">Scalp: Thick Adherent Scale Beyond Hairline</text>
              <text x="200" y="295" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">Linear pattern with characteristic candle grease sign and follicular involvement</text>
              <text x="200" y="310" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#888">Note: Micaceous scaling, hair shaft disruption, and perifollicular erythema</text>
            </svg>`,
            alt: "Scalp psoriasis showing thick adherent scale extending beyond hairline with linear distribution",
            caption: "Scalp psoriasis with candle grease sign and hair involvement"
          }
        ],
        question: "A 35-year-old man presents with the lesions shown in the three clinical images. The lesions are well-demarcated, raised, and covered with silvery-white scales. They appeared gradually over 6 months and are mildly itchy. The Auspitz sign is positive. What is the most likely diagnosis?",
        options: {
          A: "Plaque psoriasis",
          B: "Atopic dermatitis", 
          C: "Seborrheic dermatitis",
          D: "Lichen planus",
          E: "Tinea corporis"
        },
        answer: "A",
        explanation: "Why Plaque psoriasis is correct:\n\n• Classic Clinical Morphology and Distribution: \n  - Well-demarcated, erythematous plaques with characteristic silvery-white scales represent pathognomonic features of chronic plaque psoriasis\n  - Bilateral symmetrical distribution affecting extensor surfaces (elbows, knees) demonstrates typical psoriatic involvement pattern per British Association of Dermatologists guidelines\n  - Scalp involvement with linear scaly lesions supports chronic plaque psoriasis extending beyond typical extensor sites to commonly affected areas\n  - Positive Auspitz sign (pinpoint bleeding when scales removed) confirms psoriatic pathophysiology with capillary loop disruption in dermal papillae\n\n• Pathophysiological Confirmation: \n  - Chronic stable plaque psoriasis results from T-cell mediated autoimmune response causing keratinocyte hyperproliferation and incomplete maturation\n  - Silvery scale formation occurs due to rapid epidermal turnover (3-4 days vs normal 28 days) with parakeratotic scale accumulation\n  - Well-demarcated borders reflect focal inflammatory process with clear distinction between affected and normal skin\n  - Gradual onset over 6 months consistent with chronic plaque psoriasis rather than acute inflammatory conditions\n\n• NICE CG153 Diagnostic Criteria: \n  - Clinical diagnosis based on characteristic morphology, distribution, and chronicity without requiring histological confirmation\n  - Extensor surface predilection (elbows, knees) combined with scalp involvement fulfills classic psoriatic distribution pattern\n  - Mild pruritus typical of chronic plaque psoriasis, distinguishing from intensely itchy atopic dermatitis\n  - Positive Auspitz sign provides additional diagnostic confirmation when clinical features suggest psoriasis\n\n• Evidence-Based Management Framework: \n  - NICE guidelines recommend topical therapies as first-line treatment: vitamin D analogues, topical corticosteroids, or combination preparations\n  - Psoriasis Area and Severity Index (PASI) assessment guides treatment escalation decisions and monitoring response\n  - Systemic therapies (methotrexate, biologics) considered for extensive disease or significant quality of life impact\n  - Regular monitoring for psoriatic arthritis development (affects 30% of psoriasis patients) and cardiovascular comorbidities\n\n• Quality of Life and Psychosocial Impact: \n  - Chronic visible lesions significantly impact quality of life, self-esteem, and social functioning requiring comprehensive patient support\n  - Association with depression, anxiety, and social isolation necessitates holistic approach to management\n  - Patient education regarding chronic nature, treatment expectations, and lifestyle modifications essential for optimal outcomes\n  - Support groups and psychological therapies may benefit patients with significant psychosocial impact",
        incorrectExplanation: "• Option B (Atopic dermatitis) - Distribution and Morphology Contradictions: \n  - Atopic dermatitis typically affects flexural areas (antecubital fossae, popliteal fossae) rather than extensor surfaces shown in clinical images\n  - Lesions characteristically show poorly-defined borders with eczematous changes rather than well-demarcated plaques with silvery scales\n  - Intense pruritus and excoriation marks typical of atopic dermatitis, contrasting with mild itching described\n  - Positive Auspitz sign not present in atopic dermatitis, which lacks the characteristic capillary bleeding response\n  - Family history of atopy and early childhood onset more common than adult presentation\n\n• Option C (Seborrheic dermatitis) - Anatomical and Scale Character Misalignment: \n  - Seborrheic dermatitis affects sebaceous gland-rich areas (scalp, nasolabial folds, presternal) but rarely involves elbows and knees\n  - Characteristic greasy, yellowish scales rather than dry, silvery-white scales seen in psoriasis\n  - Lesions typically show ill-defined borders with less pronounced elevation compared to psoriatic plaques\n  - Scalp involvement would show greasy scaling rather than the well-demarcated linear lesions demonstrated\n  - Malassezia overgrowth pathophysiology differs from autoimmune T-cell mediated psoriatic inflammation\n\n• Option D (Lichen planus) - Clinical Pattern and Appearance Incompatibility: \n  - Lichen planus presents with flat-topped, polygonal papules with characteristic violaceous color rather than erythematous plaques\n  - Wickham's striae (white lacy patterns) typical of lichen planus, not silvery scaling seen in these images\n  - Distribution commonly affects wrists, ankles, and mucous membranes rather than extensor surfaces\n  - Intense pruritus and shorter duration typical of lichen planus compared to gradual 6-month onset\n  - Positive Auspitz sign not characteristic of lichen planus pathophysiology\n\n• Option E (Tinea corporis) - Morphological and Distribution Pattern Errors: \n  - Fungal infections typically show annular configuration with raised, scaly borders and central clearing\n  - Positive KOH microscopy would be expected showing fungal hyphae and spores\n  - Asymmetrical distribution more common than bilateral symmetrical involvement\n  - Scaling pattern differs from characteristic silvery psoriatic scales\n  - Response to antifungal therapy would be expected within 2-4 weeks, not chronic 6-month progression",
        mnemonic: "Psoriasis Features: PLAQUES = Papules and plaques, Location extensor surfaces, Auspitz sign positive, Quality well-demarcated, Uniform silvery scales, Extensor distribution, Symmetrical involvement\n\nPsoriasis Distribution: KNEES = Knees and elbows, Nails involved, Extensor surfaces, Ears and scalp, Symmetrical pattern\n\nPsoriasis vs Eczema: PSORIASIS = Plaques well-defined, Silvery scales, Oddly on extensors, Rarely itchy severely, In adults often, Auspitz sign positive, Symmetrical distribution, Involves scalp commonly, Stable chronic course\n\nPsoriasis Treatment: VITAMIN = Vitamin D analogues, Immunosuppressants for severe, Topical steroids, Assessment PASI score, Monitor for arthritis, Investigate comorbidities, Normalize quality of life",
        guidelineSummary: {
          title: "Psoriasis Management Summary", 
          content: "• Clinical Recognition: \n  - Well-demarcated erythematous plaques with silvery scales\n  - Bilateral symmetrical distribution on extensor surfaces\n  - Positive Auspitz sign (pinpoint bleeding when scales removed)\n  - Chronic stable course with gradual onset\n\n• Topical First-Line Therapies: \n  - Vitamin D analogues (calcipotriol) once or twice daily\n  - Topical corticosteroids for inflammatory control\n  - Combination vitamin D/corticosteroid preparations\n  - Coal tar preparations for chronic stable plaques\n\n• Assessment and Monitoring: \n  - PASI (Psoriasis Area and Severity Index) scoring\n  - DLQI (Dermatology Life Quality Index) assessment\n  - Screen for psoriatic arthritis (joint pain, morning stiffness)\n  - Monitor for cardiovascular risk factors\n\n• Systemic Therapy Indications: \n  - PASI >10 or DLQI >10 indicating significant disease impact\n  - Failure of topical therapies after 3-6 months\n  - Psoriatic arthritis requiring disease-modifying therapy\n  - Extensive disease affecting >10% body surface area\n\n• Biological Therapies: \n  - TNF-alpha inhibitors (adalimumab, etanercept)\n  - IL-17 inhibitors (secukinumab, ixekizumab)\n  - IL-23 inhibitors (ustekinumab, guselkumab)\n  - Reserved for severe disease or contraindications to conventional therapy\n\n• Patient Education and Support: \n  - Chronic condition requiring long-term management\n  - Lifestyle modifications: stress reduction, avoid trauma\n  - Sun exposure beneficial but avoid sunburn\n  - Support groups and psychological support if needed"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.nice.org.uk/guidance/cg153",
            description: "NICE CG153: Psoriasis - assessment and management"
          },
          supplementary: [
            {
              title: "NHS Psoriasis Information",
              url: "https://www.nhs.uk/conditions/psoriasis/",
              description: "NHS patient information and treatment options"
            },
            {
              title: "CKS NICE - Psoriasis",
              url: "https://cks.nice.org.uk/topics/psoriasis/",
              description: "NICE Clinical Knowledge Summaries for psoriasis"
            },
            {
              title: "British Association of Dermatologists - Psoriasis Guidelines",
              url: "https://www.bad.org.uk/pils/psoriasis/",
              description: "BAD professional clinical guidelines for psoriasis management"
            }
          ]
        }
      }
    ],
    respiratory: [
      {
        id: "resp1",
        topic: "Asthma Management",
        category: "respiratory", 
        question: "A 28-year-old with asthma uses salbutamol 2-3 times per week and experiences night-time symptoms twice a month. What is the next step in management?",
        options: {
          A: "Continue current treatment",
          B: "Add low-dose inhaled corticosteroid",
          C: "Add LABA",
          D: "Increase salbutamol dose",
          E: "Add oral prednisolone"
        },
        answer: "B",
        explanation: "BTS/SIGN guidelines recommend adding low-dose ICS when SABA is needed more than twice weekly or there are night symptoms.",
        mnemonic: "Asthma Steps: SAIL = Salbutamol, Add ICS, LABA, then oral",
        links: {
          primary: {
            title: "BTS/SIGN Asthma Guidelines",
            url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/asthma/"
          }
        }
      }
    ],
    neurology: [
      {
        id: "neuro1",
        topic: "Stroke Management",
        category: "neurology",
        question: "A 72-year-old presents with sudden onset left-sided weakness and speech difficulty starting 90 minutes ago. CT head shows no hemorrhage. What is the most appropriate immediate treatment?",
        options: {
          A: "Aspirin 300mg",
          B: "Alteplase (tPA)",
          C: "Clopidogrel 75mg", 
          D: "Heparin infusion",
          E: "Wait for MRI"
        },
        answer: "B",
        explanation: "Alteplase should be given within 4.5 hours of symptom onset for acute ischemic stroke when there are no contraindications.",
        mnemonic: "Stroke: FAST = Face, Arms, Speech, Time (call 999)",
        links: {
          primary: {
            title: "NICE Stroke Guidelines",
            url: "https://www.nice.org.uk/guidance/cg68"
          }
        }
      }
    ],
    neurology: [
      {
        id: "neuro1",
        category: "Neurology", 
        topic: "Multiple Sclerosis Diagnosis",
        question: "A 28-year-old woman presents with numbness and tingling in her left leg that developed over 2 days, preceded by visual disturbance in her right eye 6 months ago. MRI brain shows multiple periventricular white matter lesions. CSF shows oligoclonal bands. What is the most likely diagnosis?",
        options: {
          A: "Multiple sclerosis",
          B: "Vitamin B12 deficiency", 
          C: "Stroke",
          D: "Guillain-Barré syndrome",
          E: "Migraine with aura"
        },
        answer: "A",
        explanation: "Why Multiple sclerosis is correct:\n\n• McDonald Criteria 2017 Diagnostic Framework: \n  - Clinical presentation demonstrates classic multiple sclerosis pattern with discrete neurological episodes separated in time and space\n  - Two distinct clinical events (optic neuritis 6 months ago, current sensory symptoms) fulfill temporal dissemination criteria\n  - Different anatomical locations (optic nerve, spinal cord) satisfy spatial dissemination requirements essential for MS diagnosis\n  - Age and demographic profile (young woman) consistent with typical MS presentation patterns in clinical epidemiological studies\n\n• Characteristic MRI Findings: \n  - Periventricular white matter lesions represent pathognomonic radiological signature of multiple sclerosis\n  - Location corresponds to areas of high myelin density susceptible to inflammatory demyelination\n  - Pattern consistent with McDonald criteria radiological requirements for spatial dissemination\n  - Excludes vascular causes which typically show cortical or subcortical grey matter involvement\n\n• Confirmatory CSF Analysis: \n  - Oligoclonal bands present in CSF but absent in serum represent definitive laboratory marker for multiple sclerosis\n  - Indicates intrathecal immunoglobulin synthesis characteristic of chronic inflammatory CNS disease\n  - Found in 85-95% of MS patients providing strong supportive diagnostic evidence\n  - Helps differentiate from other inflammatory conditions affecting central nervous system\n\n• Clinical Syndrome Recognition: \n  - Previous visual disturbance likely represents optic neuritis, most common initial MS presentation in young women\n  - Current sensory symptoms suggest partial transverse myelitis or hemisensory syndrome\n  - Relapsing-remitting pattern typical of early multiple sclerosis in this demographic\n  - Symptom evolution over days rather than hours excludes acute vascular events",
        incorrectExplanation: "• Option B (Vitamin B12 deficiency) - Inconsistent Clinical Pattern: \n  - B12 deficiency typically causes progressive rather than relapsing symptoms\n  - Would not explain discrete episode of visual disturbance 6 months prior\n  - MRI changes in B12 deficiency affect spinal cord predominantly, not periventricular brain regions\n  - Oligoclonal bands not characteristic of nutritional deficiencies\n  - Requires serum B12, methylmalonic acid, homocysteine measurement for diagnosis\n\n• Option C (Stroke) - Age and Pattern Mismatch: \n  - Extremely unlikely in 28-year-old without vascular risk factors\n  - Stroke causes acute onset over minutes to hours, not gradual development over days\n  - Would not explain previous visual episode or current MRI pattern\n  - Periventricular lesions not typical of acute cerebrovascular events\n  - CSF oligoclonal bands not present in stroke patients\n\n• Option D (Guillain-Barré syndrome) - Anatomical Distribution Error: \n  - GBS affects peripheral nervous system, not central nervous system\n  - Would not cause brain MRI abnormalities or CSF oligoclonal bands\n  - Typically presents with ascending weakness rather than sensory symptoms\n  - Previous visual episode incompatible with peripheral neuropathy\n  - CSF shows elevated protein without oligoclonal bands\n\n• Option E (Migraine with aura) - Insufficient Explanation: \n  - Migraine does not cause persistent neurological deficits\n  - Would not explain MRI white matter lesions or CSF changes\n  - Visual aura typically lasts 20-60 minutes, not persistent visual disturbance\n  - No headache pattern described in clinical presentation\n  - Cannot account for current sensory symptoms or investigation findings",
        mnemonic: "MS Diagnosis: CRIMES = CSF oligoclonal bands, Relapsing symptoms, Imaging white matter lesions, Multiple episodes, Examination shows deficits, Separated in time and space\n\nMS Symptoms: VISION = Visual problems, Incontinence, Sensory loss, Intention tremor, Optic neuritis, Nystagmus\n\nMS Types: RPSP = Relapsing-Remitting, Primary Progressive, Secondary Progressive, Progressive-Relapsing",
        guidelineSummary: {
          title: "Multiple Sclerosis Management Summary",
          content: "• Diagnostic Criteria (McDonald 2017): \n  - Clinical: ≥2 attacks affecting different CNS areas separated by ≥30 days\n  - MRI: Lesions disseminated in space (≥2 CNS areas) and time\n  - CSF: Oligoclonal bands or elevated IgG index supportive\n  - Exclude other conditions causing similar presentations\n\n• Initial Investigations: \n  - MRI brain and spinal cord with gadolinium\n  - CSF analysis for oligoclonal bands, cell count, protein\n  - Visual evoked potentials if optic nerve involvement\n  - Blood tests to exclude mimics (B12, thyroid, ANA, ANCA)\n\n• Disease-Modifying Therapies: \n  - First-line: interferon beta, glatiramer acetate, dimethyl fumarate\n  - Second-line: natalizumab, fingolimod, alemtuzumab\n  - Treatment choice based on disease activity, patient factors\n  - Early treatment reduces relapse rate and disability progression\n\n• Acute Relapse Management: \n  - High-dose methylprednisolone 1g IV daily for 3-5 days\n  - Oral prednisolone alternative if IV not available\n  - Physiotherapy and occupational therapy support\n  - Symptom-specific treatments (baclofen for spasticity)\n\n• Long-term Monitoring: \n  - Annual MRI to assess disease activity\n  - EDSS scoring for disability progression\n  - Regular review of disease-modifying therapy effectiveness\n  - Management of complications (infections, osteoporosis)"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.nice.org.uk/guidance/cg186",
            description: "NICE CG186: Multiple sclerosis in adults - management"
          },
          supplementary: [
            {
              title: "MS Society UK",
              url: "https://www.mssociety.org.uk/about-ms/what-is-ms",
              description: "Multiple sclerosis patient information and support"
            },
            {
              title: "Association of British Neurologists",
              url: "https://www.theabn.org/page/PracticalNeurology",
              description: "Professional neurology guidance and standards"
            }
          ]
        }
      }
    ],
    obstetrics: [
      {
        id: "obs1",
        category: "Obstetrics",
        topic: "Preeclampsia Management",
        question: "A 32-year-old woman at 36 weeks gestation presents with blood pressure 165/105 mmHg, proteinuria 3+ on dipstick, and headache. She has no previous hypertension. What is the most appropriate immediate management?",
        options: {
          A: "Labetalol 200mg orally plus hospital admission",
          B: "Immediate delivery by caesarean section",
          C: "Methyldopa 250mg three times daily as outpatient",
          D: "ACE inhibitor therapy",
          E: "Diuretic therapy to reduce fluid retention"
        },
        answer: "A",
        explanation: "Why Labetalol 200mg orally plus hospital admission is correct:\n\n• NICE CG107 Severe Preeclampsia Protocol: \n  - Blood pressure ≥160/110 mmHg with proteinuria represents severe preeclampsia requiring immediate hospital admission\n  - Labetalol constitutes first-line antihypertensive therapy in pregnancy with established safety profile\n  - Immediate treatment prevents progression to eclampsia and maternal cerebrovascular complications\n  - Hospital monitoring essential for maternal and fetal surveillance in severe disease\n\n• Optimal Antihypertensive Selection: \n  - Labetalol combines alpha and beta-blocking activity providing effective BP reduction without compromising placental perfusion\n  - Oral route appropriate for conscious patients without evidence of imminent eclampsia\n  - Dose of 200mg achieves therapeutic effect while allowing titration based on response\n  - Safe in pregnancy with minimal fetal side effects compared to other antihypertensive classes\n\n• Critical Maternal Safety Considerations: \n  - Severe hypertension (≥160/110) carries immediate risk of maternal stroke and cardiac complications\n  - Headache suggests possible cerebral involvement requiring urgent intervention\n  - Hospital admission enables close monitoring for progression to eclampsia or HELLP syndrome\n  - Allows for immediate delivery planning if maternal or fetal condition deteriorates\n\n• Evidence-Based Pregnancy Management: \n  - MAGPIE trial demonstrates significant reduction in eclampsia risk with appropriate early intervention\n  - Treatment of severe hypertension reduces maternal morbidity and mortality\n  - Controlled BP reduction prevents placental abruption and intracerebral hemorrhage\n  - Enables optimization of maternal condition before planned delivery",
        incorrectExplanation: "• Option B (Immediate caesarean section) - Premature Intervention: \n  - Delivery indicated only if maternal stabilization impossible or fetal compromise\n  - Should attempt maternal BP control before considering delivery\n  - 36 weeks gestation benefits from maternal stabilization and corticosteroids if time permits\n  - Immediate delivery without BP control increases perioperative risk\n  - NICE guidelines emphasize maternal stabilization as priority\n\n• Option C (Methyldopa outpatient) - Inadequate Severity Recognition: \n  - Severe preeclampsia requires hospital admission and monitoring\n  - Methyldopa has slower onset of action inappropriate for severe hypertension\n  - Outpatient management unsafe with BP ≥160/110 and symptoms\n  - Risk of progression to eclampsia or stroke without close monitoring\n  - Contradicts all major obstetric guidelines for severe disease\n\n• Option D (ACE inhibitor therapy) - Contraindicated in Pregnancy: \n  - ACE inhibitors cause fetal renal dysfunction and growth restriction\n  - Associated with oligohydramnios and fetal death\n  - Completely contraindicated throughout pregnancy\n  - May cause maternal hypotension and placental hypoperfusion\n  - Never appropriate for hypertension management in pregnancy\n\n• Option E (Diuretic therapy) - Potentially Harmful: \n  - Preeclampsia involves reduced intravascular volume despite fluid retention\n  - Diuretics may worsen placental perfusion and fetal compromise\n  - Does not address underlying pathophysiology of preeclampsia\n  - Risk of electrolyte disturbance and maternal hypotension\n  - Contraindicated in preeclampsia management protocols",
        mnemonic: "Preeclampsia: HELLP = Hemolysis, Elevated Liver enzymes, Low Platelets\n\nPreeclampsia Signs: PREH = Proteinuria, Raised BP, Edema, Hyperreflexia\n\nPregnancy HTN Drugs: LNM = Labetalol, Nifedipine, Methyldopa (safe)\n\nEclampsia Treatment: MAGS = Magnesium sulfate, Airway management, Get baby out, Stabilize mother",
        guidelineSummary: {
          title: "Preeclampsia Management Summary",
          content: "• Definition and Classification: \n  - Mild: BP ≥140/90 with proteinuria after 20 weeks\n  - Severe: BP ≥160/110 or proteinuria >3g/24h or symptoms\n  - Superimposed: on chronic hypertension\n  - HELLP syndrome: hemolysis, elevated liver enzymes, low platelets\n\n• Immediate Assessment: \n  - Blood pressure measurement, proteinuria testing\n  - Symptoms: headache, visual disturbance, epigastric pain\n  - Blood tests: FBC, LFTs, urea, creatinine, uric acid\n  - Fetal assessment: CTG, ultrasound growth scan\n\n• Antihypertensive Treatment: \n  - Target BP 135-150/80-100 mmHg\n  - First-line: labetalol 200mg orally, up to 400mg TDS\n  - Alternative: nifedipine modified-release 10-20mg BD\n  - Severe hypertension: IV labetalol or hydralazine\n\n• Hospital Management: \n  - Admission for BP ≥160/110 or proteinuria with symptoms\n  - 4-hourly BP monitoring, daily urinalysis\n  - Twice-weekly blood tests monitoring\n  - Magnesium sulfate if severe features or imminent delivery\n\n• Delivery Planning: \n  - Consider delivery after 37 weeks with severe preeclampsia\n  - Before 34 weeks: corticosteroids for fetal lung maturity\n  - Indications for immediate delivery: uncontrolled BP, eclampsia, HELLP\n  - Mode of delivery based on obstetric factors and urgency"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.nice.org.uk/guidance/cg107",
            description: "NICE CG107: Hypertension in pregnancy - diagnosis and management"
          },
          supplementary: [
            {
              title: "RCOG Guidance",
              url: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/",
              description: "Royal College of Obstetricians preeclampsia guidelines"
            },
            {
              title: "NHS Pregnancy Care",
              url: "https://www.nhs.uk/pregnancy/related-conditions/complications/pre-eclampsia/",
              description: "NHS preeclampsia management protocols"
            }
          ]
        }
      }
    ],
    paediatrics: [
      {
        id: "paed1",
        topic: "Childhood Fever Management",
        category: "paediatrics",
        question: "A 18-month-old child presents with a 3-day history of fever (39.2°C), irritability, and reduced feeding. On examination, the child appears generally unwell but there are no focal signs. Urine dipstick shows nitrites positive and leucocytes ++. What is the most appropriate immediate management?",
        options: {
          A: "Start oral trimethoprim and arrange urgent paediatric review",
          B: "Collect clean-catch urine sample for culture and start IV antibiotics",
          C: "Give paracetamol and review in 24 hours", 
          D: "Arrange immediate lumbar puncture",
          E: "Start oral amoxicillin and discharge home"
        },
        answer: "B",
        explanation: "Why Collect clean-catch urine sample for culture and start IV antibiotics is correct:\n\n• NICE CG54 Paediatric UTI Guidelines: \n  - Children under 2 years with fever and positive urine dipstick require immediate antibiotic therapy to prevent renal scarring\n  - Clean-catch or catheter urine sample essential for culture confirmation and antibiotic sensitivity testing\n  - IV antibiotics indicated for children under 3 months or those appearing systemically unwell\n  - Early appropriate treatment reduces risk of pyelonephritis and long-term renal complications\n\n• Age-Specific Risk Assessment: \n  - 18-month-old children at highest risk for ascending UTI and renal involvement\n  - Immature immune system and shorter urethra increase susceptibility to serious complications\n  - Symptoms of irritability and reduced feeding suggest systemic involvement requiring urgent intervention\n  - Risk of bacteraemia and sepsis significantly higher in this age group\n\n• Clinical Severity Indicators: \n  - Generally unwell appearance with fever >39°C indicates moderate to severe illness\n  - Reduced feeding and irritability suggest systemic inflammatory response\n  - Positive nitrites indicate gram-negative bacterial infection requiring targeted therapy\n  - Leucocytes ++ confirms significant inflammatory response in urinary tract\n\n• Evidence-Based Treatment Protocol: \n  - IV antibiotics ensure therapeutic drug levels and rapid clinical response\n  - Common organisms (E.coli, Klebsiella) typically sensitive to ceftriaxone or co-amoxiclav\n  - Culture results guide targeted antibiotic therapy and duration of treatment\n  - Hospital admission allows monitoring for complications and treatment response\n\n• Prevention of Long-term Complications: \n  - Early appropriate treatment prevents renal scarring and chronic kidney disease\n  - Reduces risk of recurrent UTI and hypertension in later life\n  - DMSA scan may be required if treatment response poor or recurrent infections\n  - Family education regarding prevention and recognition of future episodes",
        incorrectExplanation: "• Option A (Oral trimethoprim only) - Inadequate Severity Response: \n  - Systemically unwell 18-month-old requires IV rather than oral antibiotics\n  - Trimethoprim alone insufficient for suspected pyelonephritis\n  - Risk of treatment failure and progression to sepsis\n  - NICE guidelines specify IV therapy for unwell infants\n  - Lacks proper culture collection for antibiotic sensitivity\n\n• Option C (Symptomatic treatment only) - Dangerous Delay: \n  - Positive urine dipstick with fever requires immediate antibiotic therapy\n  - 24-hour delay risks progression to pyelonephritis and sepsis\n  - Paracetamol alone does not treat underlying bacterial infection\n  - Contradicts all paediatric UTI management guidelines\n  - Risk of permanent renal damage with delayed treatment\n\n• Option D (Immediate lumbar puncture) - Inappropriate Investigation: \n  - Clinical picture consistent with UTI rather than meningitis\n  - Lumbar puncture not indicated with clear urinary source\n  - Would delay appropriate antibiotic therapy\n  - Risk of clinical deterioration during unnecessary procedure\n  - Urine dipstick findings explain clinical presentation\n\n• Option E (Oral amoxicillin discharge) - Multiple Safety Concerns: \n  - Amoxicillin poor choice for UTI (resistance common)\n  - Oral therapy inappropriate for systemically unwell infant\n  - Discharge unsafe without ensuring treatment response\n  - Lacks culture collection for sensitivity testing\n  - Risk of treatment failure and serious complications",
        mnemonic: "Paediatric UTI: FEVER = Fever >38°C, Examine urine dipstick, Verify with culture, Early IV antibiotics, Refer if unwell\n\nUTI Risk Factors: BUBBLE = Boys <6 months, Uncircumcised, Bladder dysfunction, Bowel problems, Low fluid intake, E.coli most common\n\nUTI Treatment: CANS = Culture first, Antibiotics IV if unwell, Nitrites/leucocytes positive, Sensitivity-guided therapy\n\nComplications: SCARS = Sepsis, Chronic kidney disease, Abscess, Recurrence, Scarring",
        guidelineSummary: {
          title: "Paediatric UTI Management Summary",
          content: "• Age-Specific Assessment: \n  - <3 months: urgent hospital assessment, IV antibiotics\n  - 3 months-2 years: urine culture essential, consider admission\n  - >2 years: oral antibiotics appropriate if well\n  - High index of suspicion in non-specific presentations\n\n• Urine Collection: \n  - Clean-catch preferred method if toilet trained\n  - Catheter sample if clean-catch not possible\n  - Bag samples unreliable due to contamination\n  - Dipstick: nitrites most specific, leucocytes sensitive\n\n• Antibiotic Selection: \n  - IV: ceftriaxone, co-amoxiclav based on local guidelines\n  - Oral: trimethoprim, nitrofurantoin (>3 months)\n  - Duration: 7-10 days for upper UTI, 3 days for cystitis\n  - Adjust based on culture sensitivities\n\n• Follow-up and Investigation: \n  - Clinical response expected within 24-48 hours\n  - Ultrasound for all children <6 months with first UTI\n  - DMSA scan if atypical or recurrent infections\n  - Prophylactic antibiotics for recurrent UTI\n\n• Prevention Strategies: \n  - Adequate fluid intake, regular bladder emptying\n  - Proper perineal hygiene, treat constipation\n  - Avoid bubble baths, tight clothing\n  - Prompt treatment of future episodes"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.nice.org.uk/guidance/cg54",
            description: "NICE CG54: Urinary tract infection in under 16s"
          },
          supplementary: [
            {
              title: "RCPCH Standards",
              url: "https://www.rcpch.ac.uk/resources/urinary-tract-infection-children",
              description: "Royal College of Paediatrics UTI guidelines"
            },
            {
              title: "NHS Children's Health",
              url: "https://www.nhs.uk/conditions/urinary-tract-infections-utis/",
              description: "NHS UTI management in children"
            }
          ]
        }
      },
      {
        id: "paed2",
        topic: "Childhood Immunisations",
        category: "paediatrics", 
        question: "A mother brings her 4-month-old baby for routine immunisations. The baby received the 8-week vaccines on schedule but missed the 12-week appointment due to a mild cold. The baby is now well. What vaccines should be given today?",
        options: {
          A: "Restart the entire vaccination schedule from the beginning",
          B: "Give the 12-week vaccines (DTaP/IPV/Hib/HepB + PCV + MenB) plus catch up on any due",
          C: "Wait until the baby is 6 months old to restart",
          D: "Only give the vaccines that were missed",
          E: "Give double doses to catch up quickly"
        },
        answer: "B",
        explanation: "Why Give the 12-week vaccines plus catch up on any due is correct:\n\n• UK Immunisation Schedule Protocol: \n  - Delayed vaccines should be given as soon as possible without restarting the schedule\n  - 4-month-old baby should receive 12-week vaccines immediately as these are now overdue\n  - Continue with normal schedule progression to maintain optimal protection\n  - No need to restart from beginning as 8-week vaccines provide foundation immunity\n\n• Evidence-Based Catch-Up Strategy: \n  - DTaP/IPV/Hib/HepB combination provides protection against 6 serious diseases\n  - PCV (pneumococcal) and MenB (meningococcal B) essential for bacterial meningitis prevention\n  - Each vaccine maintains efficacy regardless of delayed administration\n  - Immunological memory established from 8-week vaccines enhances response\n\n• Age-Appropriate Risk Assessment: \n  - 4-month-old at increased risk for vaccine-preventable diseases\n  - Maternal antibodies declining, making vaccination urgent\n  - Pertussis, pneumococcal disease, and meningitis particularly dangerous at this age\n  - Delayed vaccination increases susceptibility during vulnerable period\n\n• Green Book Guidance Compliance: \n  - PHE Green Book specifies no maximum interval between doses\n  - Mild illness not contraindication to vaccination\n  - Standard doses appropriate regardless of delay\n  - Maintains herd immunity through timely catch-up vaccination",
        incorrectExplanation: "• Option A (Restart entire schedule) - Unnecessary and Harmful: \n  - Wastes previous immunisation benefit from 8-week vaccines\n  - Delays protection against vaccine-preventable diseases\n  - Not recommended by any UK immunisation guidelines\n  - Causes additional needle exposures without benefit\n  - May reduce parental confidence in vaccination programme\n\n• Option C (Wait until 6 months) - Dangerous Delay: \n  - Leaves baby unprotected for additional 2 months\n  - Peak risk period for many vaccine-preventable diseases\n  - No clinical justification for further delay\n  - Contradicts catch-up vaccination principles\n  - Risk of disease outbreak during vulnerable period\n\n• Option D (Only missed vaccines) - Incomplete Protection: \n  - Misunderstands vaccination schedule requirements\n  - Baby needs both catch-up and age-appropriate vaccines\n  - Partial vaccination leaves gaps in protection\n  - Does not follow standard immunisation protocols\n  - Risk of continued susceptibility to preventable diseases\n\n• Option E (Double doses) - Potentially Harmful: \n  - Standard doses provide optimal immune response\n  - Double dosing may increase adverse reactions\n  - No evidence for improved efficacy with higher doses\n  - Not recommended in any vaccination guidelines\n  - Risk of increased side effects without benefit",
        mnemonic: "Vaccination Schedule: CATCH = Continue from where stopped, Age-appropriate vaccines, Timely administration, Correct standard doses, Herd immunity protection\n\n8-Week Vaccines: DPT-HIB = DTaP, Polio, Pneumococcal, Hib, Hepatitis B, MenB\n\n12-Week Vaccines: SAME = Same as 8-week (DTaP/IPV/Hib/HepB + PCV + MenB)\n\nVaccine Contraindications: SAFE = Severe illness, Anaphylaxis history, Fever >38°C, Encephalopathy",
        guidelineSummary: {
          title: "UK Childhood Immunisation Schedule",
          content: "• Primary Schedule: \n  - 8 weeks: DTaP/IPV/Hib/HepB, PCV, MenB, Rotavirus\n  - 12 weeks: DTaP/IPV/Hib/HepB, PCV, MenB, Rotavirus\n  - 16 weeks: DTaP/IPV/Hib/HepB, PCV, MenB\n  - 1 year: MMR, PCV, Hib/MenC, MenB\n\n• Catch-Up Principles: \n  - Continue where left off, don't restart\n  - Give age-appropriate vaccines immediately\n  - Maintain minimum intervals between doses\n  - No maximum interval between doses\n\n• Contraindications: \n  - Severe acute illness with fever >38°C\n  - Previous anaphylactic reaction to vaccine component\n  - Severe immunodeficiency (live vaccines)\n  - Minor illness not a contraindication\n\n• Administration: \n  - Different injection sites for multiple vaccines\n  - Standard doses regardless of delay\n  - Record in red book and national database\n  - Provide information leaflets to parents\n\n• Adverse Events: \n  - Mild fever and irritability common\n  - Paracetamol for discomfort if needed\n  - Serious adverse events very rare\n  - Report to Yellow Card Scheme if suspected"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.gov.uk/government/collections/immunisation-against-infectious-disease-the-green-book",
            description: "PHE Green Book - Immunisation guidelines"
          },
          supplementary: [
            {
              title: "NHS Vaccines Schedule",
              url: "https://www.nhs.uk/conditions/vaccinations/nhs-vaccinations-and-when-to-have-them/",
              description: "Complete UK immunisation schedule"
            },
            {
              title: "RCPCH Immunisation",
              url: "https://www.rcpch.ac.uk/resources/immunisation-children",
              description: "Paediatric immunisation guidance"
            }
          ]
        }
      },
      {
        id: "paed3",
        topic: "Developmental Milestones",
        category: "paediatrics",
        question: "During a routine 15-month health check, parents are concerned that their toddler is not yet walking independently, although they can cruise around furniture and walk holding onto one hand. The child says 2-3 words, responds to their name, and can build a tower of 2 blocks. What is the most appropriate management?",
        options: {
          A: "Urgent referral to paediatric neurology",
          B: "Reassurance and review at 18 months", 
          C: "Immediate physiotherapy referral",
          D: "Request MRI brain scan",
          E: "Refer to developmental paediatrician immediately"
        },
        answer: "B",
        explanation: "Why Reassurance and review at 18 months is correct:\n\n• Normal Developmental Variation: \n  - Independent walking typically achieved between 12-18 months with significant individual variation\n  - 15-month-old demonstrating cruising and supported walking shows normal motor progression\n  - All other developmental domains (language, social, fine motor) appear age-appropriate\n  - Red flags for concern absent - child achieving expected milestones in most areas\n\n• Evidence-Based Milestone Assessment: \n  - 90% of children walk independently by 15 months, but normal range extends to 18 months\n  - Quality of movement (cruising, supported walking) more important than timing\n  - Language development (2-3 words) and social response (responds to name) reassuring\n  - Fine motor skills (2-block tower) appropriate for 15 months\n\n• Systematic Developmental Review: \n  - Gross motor: progressing normally through expected sequence\n  - Fine motor: age-appropriate (15 months = 2 blocks, 18 months = 3-4 blocks)\n  - Language: within normal limits (15 months = 2-6 words)\n  - Social: appropriate response to name and social interaction\n\n• Risk Factor Assessment: \n  - No mention of prematurity, birth complications, or family history\n  - No regression or loss of previously acquired skills\n  - Steady progression through developmental sequence\n  - Absence of concerning neurological signs",
        incorrectExplanation: "• Option A (Urgent neurology referral) - Inappropriate Escalation: \n  - No neurological red flags present in developmental history\n  - Independent walking by 18 months still within normal range\n  - Other developmental domains reassuringly normal\n  - Urgent referral not indicated without concerning features\n  - Would cause unnecessary parental anxiety\n\n• Option C (Immediate physiotherapy) - Premature Intervention: \n  - Child showing normal motor progression through cruising and supported walking\n  - Physiotherapy indicated only if walking not achieved by 18 months\n  - Quality of movement appears normal based on description\n  - Intervention before 18 months not supported by evidence\n  - May medicalise normal developmental variation\n\n• Option D (MRI brain scan) - Unjustified Investigation: \n  - No clinical indicators for neuroimaging\n  - Normal developmental progression in other domains\n  - Invasive investigation requiring sedation in young child\n  - No evidence base for scanning delayed walkers without red flags\n  - High healthcare cost without clinical benefit\n\n• Option E (Developmental paediatrician referral) - Unnecessary Specialisation: \n  - Global development appears normal with isolated mild delay\n  - Referral criteria not met at 15 months for walking\n  - Should wait until 18 months before specialist involvement\n  - Primary care monitoring appropriate at this stage\n  - May create long waiting lists for truly concerning cases",
        mnemonic: "Development Assessment: SEEDS = Social interaction, Eyes/vision, Ears/hearing, Development milestones, Speech/language\n\n15-Month Milestones: WALK = Words 2-3, Acknowledges name, Lifts 2 blocks, Keeps cruising/supported walking\n\nWalking Red Flags: STOP = Symmetry problems, Tone abnormalities, Other delays, Progression lack\n\nDevelopmental Domains: GLFS = Gross motor, Language, Fine motor, Social/cognitive",
        guidelineSummary: {
          title: "Developmental Milestone Assessment",
          content: "• Walking Development: \n  - 50% walk by 12 months, 90% by 15 months, 97% by 18 months\n  - Cruising and supported walking are positive predictors\n  - Quality of movement more important than exact timing\n  - Consider referral if not walking by 18 months\n\n• Red Flags for Concern: \n  - Loss of previously acquired skills (regression)\n  - Significant asymmetry in movement or tone\n  - Multiple domain delays affecting 2+ areas\n  - Absence of protective reflexes or abnormal tone\n\n• 15-Month Expected Milestones: \n  - Gross motor: cruising, may walk independently\n  - Fine motor: pincer grip, 2-block tower\n  - Language: 2-6 meaningful words, follows simple commands\n  - Social: responds to name, imitates actions\n\n• Assessment Approach: \n  - Comprehensive developmental history\n  - Observe child in natural play\n  - Parents are reliable informants for milestones\n  - Consider cultural and individual variations\n\n• Referral Criteria: \n  - Not walking by 18 months\n  - Concerns in multiple developmental domains\n  - Parental concerns about regression\n  - Abnormal neurological signs or tone\n\n• Follow-up Planning: \n  - Review at appropriate intervals\n  - Provide developmental guidance to parents\n  - Document progress in child health records\n  - Early intervention if delays confirmed"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.rcpch.ac.uk/resources/uk-who-growth-charts-early-years",
            description: "RCPCH developmental assessment guidance"
          },
          supplementary: [
            {
              title: "NHS Child Development",
              url: "https://www.nhs.uk/conditions/baby/babys-development/",
              description: "NHS developmental milestones guide"
            },
            {
              title: "Healthy Child Programme",
              url: "https://www.gov.uk/government/publications/healthy-child-programme-pregnancy-and-the-first-5-years-of-life",
              description: "UK child health surveillance"
            }
          ]
        }
      }
    ],
    cardiovascular: [
      {
        id: "cardio1",
        category: "cardiovascular",
        topic: "Acute Myocardial Infarction",
        question: "A 58-year-old man presents with severe central chest pain radiating to his left arm, lasting 45 minutes. ECG shows ST elevation >2mm in leads II, III, and aVF. What is the most appropriate immediate management?",
        options: {
          A: "Primary percutaneous coronary intervention (PCI) within 120 minutes",
          B: "Thrombolytic therapy with alteplase immediately", 
          C: "High-dose atorvastatin and dual antiplatelet therapy",
          D: "Coronary angiography within 24 hours",
          E: "Conservative management with aspirin and clopidogrel"
        },
        answer: "A",
        explanation: "Why Primary percutaneous coronary intervention (PCI) within 120 minutes is correct:\n\n• NICE CG167 Gold Standard Protocol: \n  - Primary PCI represents the optimal reperfusion strategy for ST-elevation myocardial infarction (STEMI) when delivered within the critical 120-minute window from first medical contact\n  - European Society of Cardiology and NICE guidelines consistently demonstrate superior outcomes compared to thrombolytic therapy in terms of mortality reduction, reinfarction rates, and stroke prevention\n  - Mechanical reperfusion achieves 90-95% vessel patency rates compared to 50-60% with thrombolytic therapy alone\n  - Time-dependent benefit with maximum myocardial salvage achieved when intervention occurs within the therapeutic window\n\n• Inferior STEMI Recognition and Management: \n  - ECG changes in leads II, III, and aVF indicate inferior wall myocardial infarction typically involving right coronary artery or posterior descending artery occlusion\n  - Inferior STEMI carries significant risk of complications including heart block, right ventricular involvement, and mechanical complications\n  - Immediate reperfusion essential to prevent irreversible myocardial necrosis and preserve left ventricular function\n  - Primary PCI allows direct visualization of culprit vessel and immediate mechanical revascularization\n\n• Evidence-Based Superiority Over Alternatives: \n  - DANAMI-2 and PRAGUE-2 trials demonstrate clear mortality benefit of primary PCI over thrombolysis\n  - Reduced risk of intracranial hemorrhage (0.05% vs 0.7% with thrombolysis)\n  - Lower rates of reinfarction and recurrent ischemia requiring repeat intervention\n  - Superior preservation of left ventricular ejection fraction and long-term prognosis\n\n• Critical Time-Window Optimization: \n  - Door-to-balloon time target of <90 minutes for patients presenting directly to PCI-capable centers\n  - Total ischemic time (symptom onset to reperfusion) should be minimized to reduce infarct size\n  - Every 30-minute delay increases relative mortality risk by 7.5% emphasizing urgency of intervention\n  - Systematic protocols ensure rapid triage, antiplatelet loading, and catheterization laboratory activation",
        incorrectExplanation: "• Option B (Thrombolytic therapy immediately) - Suboptimal Reperfusion Strategy: \n  - While thrombolytic therapy provides benefit when primary PCI unavailable, it achieves inferior vessel patency rates (50-60% vs 90-95%)\n  - Higher risk of intracranial hemorrhage, particularly in elderly patients or those with hypertension\n  - Incomplete reperfusion often requires rescue PCI, exposing patients to procedural delays and complications\n  - NICE CG167 reserves thrombolysis for situations where PCI cannot be delivered within recommended timeframes\n  - Risk of failed reperfusion requiring emergency PCI with higher complication rates\n\n• Option C (High-dose atorvastatin and dual antiplatelet therapy) - Inadequate Primary Intervention: \n  - While optimal medical therapy forms essential component of STEMI management, it cannot achieve immediate reperfusion\n  - Statin therapy and antiplatelet agents address secondary prevention but do not restore coronary flow\n  - Delays in reperfusion result in irreversible myocardial necrosis and increased mortality\n  - These medications should complement, not replace, primary reperfusion strategy\n  - Evidence shows mechanical reperfusion provides greatest mortality benefit in acute phase\n\n• Option D (Coronary angiography within 24 hours) - Dangerous Treatment Delay: \n  - STEMI requires immediate reperfusion, not delayed diagnostic angiography\n  - 24-hour delay results in completed myocardial infarction with irreversible tissue loss\n  - Time-dependent mortality increase with every hour of delay in reperfusion therapy\n  - Confuses STEMI (immediate PCI) with NSTEMI (early invasive strategy within 72 hours)\n  - Violates fundamental principle of emergency cardiac care requiring immediate intervention\n\n• Option E (Conservative management) - Contraindicated Approach: \n  - Conservative management appropriate for low-risk acute coronary syndromes, not STEMI\n  - ST-elevation indicates complete coronary occlusion requiring immediate mechanical intervention\n  - Aspirin and clopidogrel alone cannot restore coronary flow in completely occluded vessel\n  - Results in completed transmural infarction with maximum myocardial damage\n  - Contradicts all international guidelines mandating immediate reperfusion for STEMI",
        mnemonic: "STEMI Management: PRIMARY-PCI = Primary intervention, Rapid door-to-balloon <90min, Immediate cathlab activation, Mechanical superiority, Aspirin + P2Y12 loading, Reperfusion within 120min, Years of life saved\n\nSTEMI Recognition: STEMI = ST elevation >1mm limb leads, >2mm chest leads, Territorial pattern, Elevation persistent, Myocardial infarction confirmed, Immediate PCI required\n\nInferior STEMI: RCA = Right Coronary Artery, Complete occlusion, Acute presentation leads II/III/aVF\n\nPCI Benefits: MECHANICS = Mechanical superiority, Enhanced patency 90-95%, Complete visualization, Higher success rates, Angioplasty + stenting, No bleeding risk, Immediate flow restoration, Catheter-based intervention, Superior outcomes",
        guidelineSummary: {
          title: "STEMI Management Protocol Summary",
          content: "• Recognition and Diagnosis: \n  - ST elevation ≥1mm in ≥2 contiguous limb leads or ≥2mm in ≥2 contiguous chest leads\n  - New left bundle branch block in appropriate clinical context\n  - Posterior STEMI: ST depression V1-V3 with tall R waves\n  - Time from symptom onset crucial for treatment decisions\n\n• Primary PCI Pathway: \n  - Door-to-balloon time <90 minutes for direct presentation\n  - First medical contact to device time <120 minutes\n  - Immediate dual antiplatelet therapy: aspirin 300mg + P2Y12 inhibitor\n  - Unfractionated heparin or bivalirudin during procedure\n\n• Thrombolysis Indications: \n  - Primary PCI not available within 120 minutes\n  - No contraindications to fibrinolytic therapy\n  - Alteplase, tenecteplase, or streptokinase options\n  - Door-to-needle time <30 minutes target\n\n• Post-PCI Care: \n  - Dual antiplatelet therapy for 12 months\n  - ACE inhibitor/ARB, beta-blocker, statin therapy\n  - Echocardiography to assess LV function\n  - Cardiac rehabilitation referral\n\n• Complications Management: \n  - Cardiogenic shock: emergency revascularization\n  - Mechanical complications: emergency surgery\n  - Arrhythmias: appropriate antiarrhythmic therapy\n  - Heart failure: guideline-directed medical therapy"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.nice.org.uk/guidance/cg167",
            description: "NICE CG167: Acute coronary syndromes"
          },
          supplementary: [
            {
              title: "ESC STEMI Guidelines",
              url: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Acute-Coronary-Syndromes-STEMI-Guidelines",
              description: "European Society of Cardiology STEMI management"
            },
            {
              title: "NHS Heart Attack Treatment",
              url: "https://www.nhs.uk/conditions/heart-attack/treatment/",
              description: "NHS heart attack emergency treatment protocols"
            },
            {
              title: "British Cardiovascular Society",
              url: "https://www.bcs.com/pages/page_box_contents.asp?pageid=1025",
              description: "BCS primary PCI guidelines"
            }
          ]
        }
      }
    ],
    infectious_diseases: [
      {
        id: "infect1",
        category: "infectious-diseases",
        topic: "Sepsis Recognition",
        question: "A 72-year-old woman presents with confusion, temperature 38.9°C, heart rate 110 bpm, blood pressure 85/50 mmHg, and respiratory rate 24/min. Blood tests show lactate 4.2 mmol/L. What is the most appropriate immediate management?",
        options: {
          A: "Sepsis Six bundle within 1 hour",
          B: "Blood cultures then oral antibiotics",
          C: "Fluid resuscitation with 3L crystalloid",
          D: "Immediate ICU referral",
          E: "Paracetamol and observation"
        },
        answer: "A",
        explanation: "Why Sepsis Six bundle within 1 hour is correct:\n\n• NICE NG51 Evidence-Based Protocol: \n  - Sepsis Six bundle implementation within 1 hour represents the gold standard emergency management protocol for suspected sepsis, demonstrating significant mortality reduction in multiple international studies\n  - Time-critical intervention where every hour of delay increases mortality risk by 7.6% according to Kumar et al landmark sepsis research\n  - Bundle approach ensures systematic, comprehensive management addressing all critical aspects of early sepsis care simultaneously\n  - UK Sepsis Trust advocacy and NHS England mandated protocols emphasize immediate bundle initiation upon recognition\n\n• Comprehensive Bundle Components (Take 3, Give 3): \n  - Take 3: Blood cultures, serum lactate, urine output monitoring - providing essential diagnostic and prognostic information\n  - Give 3: High-flow oxygen, IV antibiotics, IV fluid resuscitation - addressing immediate physiological priorities\n  - Each component addresses specific pathophysiological aspect of sepsis syndrome\n  - Standardized approach reduces treatment variability and ensures consistent care quality\n\n• Pathophysiological Rationale: \n  - Systemic inflammatory response syndrome (SIRS) criteria: temperature >38°C, HR >90, RR >20, altered mental state\n  - Hypotension (85/50 mmHg) indicates septic shock requiring immediate intervention\n  - Elevated lactate (4.2 mmol/L) suggests tissue hypoperfusion and anaerobic metabolism\n  - Multi-organ dysfunction evident from confusion, cardiovascular instability, respiratory compromise\n\n• Clinical Outcome Evidence: \n  - Surviving Sepsis Campaign guidelines demonstrate 25% mortality reduction with early goal-directed therapy\n  - Rivers et al EGDT trial showed significant survival benefit with aggressive early intervention\n  - UK national audit data confirms improved outcomes with rapid bundle implementation\n  - Cost-effectiveness analysis supports early intervention preventing ICU admission and prolonged hospital stay",
        incorrectExplanation: "• Option B (Blood cultures then oral antibiotics) - Inadequate Intervention Intensity: \n  - Oral antibiotics inappropriate for septic shock requiring immediate IV antimicrobial therapy\n  - Single intervention approach neglects comprehensive bundle management proven effective\n  - Delays in IV antibiotic administration directly correlate with increased mortality\n  - Blood cultures alone insufficient without concurrent therapeutic interventions\n  - Fails to address hypotension, tissue hypoperfusion, and multi-organ dysfunction\n\n• Option C (Fluid resuscitation with 3L crystalloid) - Incomplete Management Approach: \n  - While fluid resuscitation forms important component, isolated intervention inadequate for septic shock\n  - Fixed 3L volume inappropriate without hemodynamic monitoring and response assessment\n  - Neglects antimicrobial therapy essential for source control\n  - Risk of fluid overload without careful monitoring in elderly patients\n  - Fails to address infection control, oxygenation, and diagnostic requirements\n\n• Option D (Immediate ICU referral) - Treatment Delay Strategy: \n  - ICU referral appropriate but should not delay immediate sepsis management\n  - Emergency department must initiate Sepsis Six bundle before transfer\n  - Referral alone does not provide active treatment for deteriorating patient\n  - Time-sensitive condition requiring immediate intervention, not delayed specialist care\n  - ICU transfer should complement, not replace, immediate bundle therapy\n\n• Option E (Paracetamol and observation) - Dangerous Conservative Approach: \n  - Completely inadequate for septic shock requiring aggressive immediate intervention\n  - Observation inappropriate for patient with clear signs of organ dysfunction\n  - Paracetamol provides minimal benefit and delays essential antimicrobial therapy\n  - Ignores hypotension, altered mental state, and elevated lactate requiring urgent treatment\n  - Contradicts all evidence-based sepsis management guidelines and protocols",
        mnemonic: "Sepsis Six Bundle: TAKE-GIVE = Take cultures, Take lactate, Take urine output - Give oxygen, Give IV antibiotics, Give IV fluids\n\nSepsis Recognition: SEPSIS = Systemic response, Elevated temperature, Pressure low, Shock signs, Infection suspected, Serum lactate raised\n\nSIRS Criteria: TEMP = Temperature >38°C or <36°C, Elevated heart rate >90, Mental state altered, Pressure low <90 systolic\n\nSeptic Shock: HYPERLACTAT = Hypotension despite fluids, Perfusion poor, End-organ dysfunction, Resuscitation needed, Lactate >4, Antibiotics urgently, Critical care, Tissue hypoxia, Anaerobic metabolism, Treatment time-critical",
        guidelineSummary: {
          title: "Sepsis Management Protocol Summary",
          content: "• Recognition and Screening: \n  - Use NEWS2 scoring system for early warning\n  - SIRS criteria: temp >38°C or <36°C, HR >90, RR >20, WBC >12 or <4\n  - qSOFA score: altered mental state, SBP ≤100, RR ≥22\n  - Lactate >2 mmol/L indicates tissue hypoperfusion\n\n• Sepsis Six Bundle (within 1 hour): \n  - TAKE: Blood cultures (before antibiotics if possible), serum lactate, urine output\n  - GIVE: High-flow oxygen, IV antibiotics, IV fluid resuscitation\n  - Document time of administration for audit\n  - Senior clinician involvement early\n\n• Antibiotic Selection: \n  - Broad-spectrum empirical therapy based on likely source\n  - Local antimicrobial guidelines and resistance patterns\n  - Piperacillin-tazobactam or meropenem for severe sepsis\n  - De-escalate based on culture results and clinical response\n\n• Fluid Resuscitation: \n  - Initial 30ml/kg crystalloid for hypotension or lactate ≥4\n  - Reassess after each 500ml bolus\n  - Consider vasopressors if persistent hypotension\n  - Monitor for fluid overload in elderly/cardiac patients\n\n• Monitoring and Escalation: \n  - ICU referral for organ support requirements\n  - Continuous monitoring of vital signs and urine output\n  - Serial lactate measurements to guide resuscitation\n  - Daily review of antibiotic therapy and source control"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.nice.org.uk/guidance/ng51",
            description: "NICE NG51: Sepsis recognition, diagnosis and early management"
          },
          supplementary: [
            {
              title: "UK Sepsis Trust",
              url: "https://sepsistrust.org/professional-resources/clinical/",
              description: "Sepsis Six bundle clinical resources"
            },
            {
              title: "Surviving Sepsis Campaign",
              url: "https://www.sccm.org/SurvivingSepsisCampaign/Guidelines",
              description: "International sepsis management guidelines"
            },
            {
              title: "NHS England Sepsis Guidance",
              url: "https://www.england.nhs.uk/patient-safety/sepsis/",
              description: "NHS sepsis identification and treatment"
            }
          ]
        }
      }
    ],
    respiratory: [
      {
        id: "resp1",
        category: "respiratory",
        topic: "COPD Exacerbation",
        question: "A 68-year-old smoker with known COPD presents with increased breathlessness, purulent sputum, and wheeze. Oxygen saturation is 88% on air. What is the most appropriate oxygen target?",
        options: {
          A: "88-92% oxygen saturation",
          B: "94-98% oxygen saturation",
          C: "100% oxygen via non-rebreather mask",
          D: "No supplemental oxygen needed",
          E: "35% oxygen via Venturi mask"
        },
        answer: "A",
        explanation: "BTS guidelines recommend controlled oxygen therapy targeting 88-92% in COPD patients to avoid CO2 retention while maintaining adequate oxygenation during acute exacerbations.",
        mnemonic: "COPD Oxygen: 88-92 SAFE = Saturation Appropriate, Avoid CO2 retention, Fixed target, Examine ABG",
        links: {
          primary: {
            title: "BTS COPD Guidelines",
            url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/copd/"
          }
        }
      }
    ],
    gastrointestinal: [
      {
        id: "gi1",
        category: "gastrointestinal",
        topic: "Upper GI Bleeding",
        question: "A 55-year-old man presents with coffee-ground vomiting and melaena. He takes regular ibuprofen for arthritis. Heart rate 110 bpm, BP 95/60 mmHg. What is the most appropriate immediate management?",
        options: {
          A: "Immediate upper endoscopy within 24 hours",
          B: "IV proton pump inhibitor and urgent endoscopy",
          C: "Blood transfusion and discharge home",
          D: "Oral omeprazole and outpatient follow-up",
          E: "IV fluids only"
        },
        answer: "B",
        explanation: "NICE CG141 recommends immediate IV PPI for suspected peptic ulcer bleeding plus urgent endoscopy within 24 hours for haemodynamically unstable patients.",
        mnemonic: "Upper GI Bleed: AIMS = Assess haemodynamics, IV access/PPI, Monitor/transfuse, Scope urgently",
        links: {
          primary: {
            title: "NICE CG141: Upper gastrointestinal bleeding",
            url: "https://www.nice.org.uk/guidance/cg141"
          }
        }
      }
    ],
    endocrinology: [
      {
        id: "endo1",
        category: "endocrinology",
        topic: "Diabetic Ketoacidosis",
        question: "A 19-year-old type 1 diabetic presents with vomiting, dehydration, and Kussmaul breathing. Blood glucose 28 mmol/L, ketones 5.2 mmol/L, pH 7.15. What is the most appropriate initial fluid management?",
        options: {
          A: "0.9% sodium chloride 1L over 1 hour",
          B: "5% dextrose 500ml over 4 hours",
          C: "0.45% sodium chloride with 5% dextrose",
          D: "Hartmann's solution 2L stat",
          E: "No fluids until insulin started"
        },
        answer: "A",
        explanation: "Why 0.9% sodium chloride 1L over 1 hour is correct:\n\n• NICE NG18 DKA Management Protocol: \n  - Initial fluid resuscitation with 0.9% sodium chloride represents the evidence-based first-line approach for diabetic ketoacidosis management in both adults and young people\n  - Rapid restoration of intravascular volume essential to reverse dehydration, improve peripheral perfusion, and facilitate subsequent insulin therapy effectiveness\n  - 1-liter bolus over 1 hour provides controlled, monitored rehydration without precipitating cerebral edema or fluid overload\n  - Joint British Diabetes Societies guidelines emphasize immediate fluid replacement as cornerstone of DKA management\n\n• Pathophysiological Correction: \n  - Severe dehydration (typically 5-10% body weight) results from osmotic diuresis caused by hyperglycemia\n  - Intravascular volume depletion impairs insulin sensitivity and delays ketoacid clearance\n  - 0.9% saline isotonic solution prevents rapid osmolality changes that could precipitate cerebral complications\n  - Adequate hydration essential before insulin administration to prevent cardiovascular collapse\n\n• Evidence-Based Fluid Selection: \n  - Normal saline preferred over dextrose-containing solutions initially due to hyperglycemic state\n  - Balanced crystalloids may be considered but normal saline remains standard care\n  - Avoids hypotonic solutions which increase cerebral edema risk\n  - Plasma glucose reduction occurs with rehydration alone before insulin therapy\n\n• Critical Safety Considerations: \n  - Controlled fluid administration prevents rapid glucose reduction >5 mmol/L/hour\n  - Monitoring for signs of fluid overload particularly important in elderly patients\n  - Establishes hemodynamic stability essential for safe insulin therapy initiation\n  - Reduces risk of hypokalemia by improving renal perfusion and potassium handling",
        incorrectExplanation: "• Option B (5% dextrose 500ml over 4 hours) - Inappropriate Initial Choice: \n  - Dextrose-containing fluids contraindicated initially in hyperglycemic crisis (glucose 28 mmol/L)\n  - Would exacerbate hyperglycemia and delay ketoacid resolution\n  - Reserved for later management when glucose approaches normal range\n  - Insufficient volume and rate for severe dehydration requiring immediate correction\n  - Does not address primary pathophysiology of volume depletion and ketoacidosis\n\n• Option C (0.45% sodium chloride with 5% dextrose) - Dangerous Hypotonic Solution: \n  - Hypotonic solutions significantly increase cerebral edema risk in DKA\n  - Dextrose component inappropriate for initial hyperglycemic management\n  - May precipitate rapid intracellular fluid shifts causing neurological complications\n  - Not recommended in any major DKA management guidelines\n  - Could worsen osmotic imbalance and delay clinical recovery\n\n• Option D (Hartmann's solution 2L stat) - Excessive Volume and Rate: \n  - 2L stat administration risks fluid overload and cardiovascular complications\n  - Hartmann's solution contains lactate which may interfere with ketone metabolism\n  - Rapid large-volume resuscitation increases cerebral edema risk\n  - Lacks controlled, monitored approach essential for safe DKA management\n  - Violates guidelines emphasizing gradual, careful fluid replacement\n\n• Option E (No fluids until insulin started) - Dangerous Treatment Delay: \n  - Contradicts fundamental DKA management requiring immediate fluid resuscitation\n  - Insulin therapy without prior fluid replacement risks cardiovascular collapse\n  - Severe dehydration impairs insulin effectiveness and delays recovery\n  - Increases risk of shock, renal impairment, and treatment complications\n  - Violates all evidence-based DKA management protocols requiring fluids first",
        mnemonic: "DKA Management: FLUID-FIRST = Fluids immediately (0.9% saline), Launch monitoring, Underneath check K+, IV insulin after fluids, Dextrose when glucose <14, Follow glucose hourly, Immediate senior input, Rehydration priority, Sodium normal saline, Treatment protocol\n\nDKA Recognition: KETOACID = Ketones >3, Elevated glucose >11, Thirst/polyuria, Osmotic diuresis, Acidosis pH <7.3, Confusion/drowsiness, Insulin deficiency, Dehydration severe\n\nFluid Protocol: NORMAL-SALINE = Normal 0.9% sodium chloride, Osmolality maintained, Rapid initial liter, Monitor response, Avoid hypotonic, Large volume risk, Sodium replacement, Arterial monitoring, Lactate avoid initially, Isotonic preferred, No dextrose initially, Electrolyte balance\n\nInsulin Timing: AFTER-FLUIDS = Always fluids first, Fluid resuscitation, Therapeutic insulin, Electrolyte correction, Rehydration complete, Follow protocols, Lactic avoid, Urgent but controlled, IV access secured, Diabetes specialist, Senior involvement",
        guidelineSummary: {
          title: "Diabetic Ketoacidosis Management Summary",
          content: "• Recognition and Diagnosis: \n  - Ketones >3 mmol/L (blood) or >2+ (urine)\n  - Blood glucose >11 mmol/L or known diabetes\n  - Venous pH <7.3 or bicarbonate <15 mmol/L\n  - Clinical features: polyuria, polydipsia, weight loss, vomiting\n\n• Initial Resuscitation (First Hour): \n  - 0.9% sodium chloride 1L over 1 hour\n  - Assess response and fluid balance\n  - Consider central venous access if shocked\n  - Monitor electrolytes, particularly potassium\n\n• Insulin Therapy: \n  - Fixed-rate IV insulin infusion 0.1 units/kg/hour\n  - Start after initial fluid resuscitation\n  - Continue long-acting insulin if prescribed\n  - Aim for ketone reduction 0.5 mmol/L/hour\n\n• Fluid Continuation: \n  - 0.9% saline with potassium supplementation\n  - Add 10% dextrose when glucose <14 mmol/L\n  - Typical fluid deficit 100ml/kg requiring replacement\n  - Monitor for fluid overload, especially elderly\n\n• Monitoring and Complications: \n  - Hourly blood glucose and ketones\n  - 2-hourly venous blood gas and electrolytes\n  - Watch for cerebral edema (especially <25 years)\n  - Consider HDU/ICU if severe or complications"
        },
        links: {
          primary: {
            title: "UK Guidance",
            url: "https://www.nice.org.uk/guidance/ng18",
            description: "NICE NG18: Diabetes in children and young people"
          },
          supplementary: [
            {
              title: "Joint British Diabetes Societies",
              url: "https://www.diabetes.org.uk/professionals/position-statements-reports/specialist-care-for-children-and-adults-and-complications/management-of-dka-in-adults",
              description: "JBDS DKA management guidelines"
            },
            {
              title: "NHS Diabetes Guidelines",
              url: "https://www.england.nhs.uk/diabetes/",
              description: "NHS diabetes emergency management"
            },
            {
              title: "Diabetes UK Professional",
              url: "https://www.diabetes.org.uk/professionals",
              description: "Professional diabetes care resources"
            }
          ]
        }
      }
    ],
    psychiatry: [
      {
        id: "psych1",
        category: "psychiatry",
        topic: "Depression Diagnosis",
        question: "A 34-year-old woman presents with 3 weeks of low mood, loss of interest in activities, poor sleep, and feelings of worthlessness. PHQ-9 score is 16. What is the most appropriate first-line treatment?",
        options: {
          A: "Cognitive behavioural therapy (CBT) plus SSRI",
          B: "SSRI antidepressant alone",
          C: "Tricyclic antidepressant",
          D: "Referral to psychiatrist",
          E: "Lifestyle advice only"
        },
        answer: "A",
        explanation: "NICE CG90 recommends combination of psychological therapy (CBT) plus antidepressant for moderate-severe depression (PHQ-9 ≥10). This provides optimal evidence-based treatment.",
        mnemonic: "Depression Treatment: STEP-UP = Start with therapy, SSRI Together, Exercise/lifestyle, Psychological support, Under specialist care, Prevent relapse",
        links: {
          primary: {
            title: "NICE CG90: Depression in adults",
            url: "https://www.nice.org.uk/guidance/cg90"
          }
        }
      }
    ],
    surgery: [
      {
        id: "surg1",
        category: "surgery",
        topic: "Acute Appendicitis",
        question: "A 23-year-old man presents with 12-hour history of central abdominal pain that has migrated to the right iliac fossa. He has nausea, low-grade fever, and tenderness at McBurney's point. What is the most appropriate management?",
        options: {
          A: "Laparoscopic appendicectomy within 24 hours",
          B: "Conservative management with antibiotics",
          C: "CT scan to confirm diagnosis first",
          D: "Open appendicectomy immediately",
          E: "Ultrasound scan and observe"
        },
        answer: "A",
        explanation: "NICE CG141 appendicitis guidelines recommend laparoscopic appendicectomy as first-line treatment, ideally within 24 hours of diagnosis to reduce complications.",
        mnemonic: "Appendicitis: PAINS = Pain migration, Anorexia, Inflammation markers, Nausea/vomiting, Surgery (laparoscopic)",
        links: {
          primary: {
            title: "RCS Appendicitis Guidelines",
            url: "https://www.rcseng.ac.uk/standards-and-research/standards-and-guidance/"
          }
        }
      }
    ],
    emergency_medicine: [
      {
        id: "emerg1",
        category: "emergency-medicine",
        topic: "Anaphylaxis Management",
        question: "A 28-year-old develops facial swelling, widespread urticaria, wheeze, and hypotension 10 minutes after eating nuts. What is the most appropriate immediate treatment?",
        options: {
          A: "Intramuscular adrenaline 0.5mg (1:1000) and IV chlorpheniramine",
          B: "High-flow oxygen and IV hydrocortisone only",
          C: "Nebulised salbutamol and oral antihistamine",
          D: "IV adrenaline infusion",
          E: "Oral prednisolone and observation"
        },
        answer: "A",
        explanation: "Resuscitation Council UK guidelines: IM adrenaline 0.5mg (1:1000) is first-line treatment for anaphylaxis, plus antihistamine and corticosteroid as secondary treatments.",
        mnemonic: "Anaphylaxis: ADRENALINE = Adrenaline IM 0.5mg, Don't delay, Remove trigger, Emergency position, No oral route, Antihistamine IV, Look for biphasic, IV access, Never alone, Emergency call",
        links: {
          primary: {
            title: "Resuscitation Council UK",
            url: "https://www.resus.org.uk/library/2021-resuscitation-guidelines/emergency-treatment-anaphylaxis-guidelines-healthcare-providers"
          }
        }
      }
    ],
    rheumatology: [
      {
        id: "rheum1",
        category: "rheumatology",
        topic: "Rheumatoid Arthritis",
        question: "A 45-year-old woman presents with 6 weeks of symmetrical joint pain and stiffness affecting hands and feet, worst in the morning lasting 2 hours. RF and anti-CCP positive. What is the most appropriate first-line treatment?",
        options: {
          A: "Methotrexate plus folic acid and prednisolone bridge",
          B: "Sulfasalazine alone",
          C: "Biologics (anti-TNF therapy)",
          D: "NSAIDs and physiotherapy only",
          E: "Hydroxychloroquine"
        },
        answer: "A",
        explanation: "NICE NG100 recommends methotrexate as first-line DMARD plus folic acid, with short-term prednisolone bridge therapy to provide rapid symptom control while methotrexate takes effect.",
        mnemonic: "RA Treatment: DMARD-First = Disease modifying, Methotrexate first-line, Aggressive early treatment, Reduce inflammation, Don't delay, Folic acid supplement, Include prednisolone bridge, Regular monitoring, Specialist care, Target remission",
        links: {
          primary: {
            title: "NICE NG100: Rheumatoid arthritis in adults",
            url: "https://www.nice.org.uk/guidance/ng100"
          }
        }
      }
    ],
    ent: [
      {
        id: "ent1",
        category: "ent",
        topic: "Acute Otitis Media",
        question: "A 4-year-old child presents with 2 days of ear pain, fever, and irritability. Otoscopy shows red, bulging tympanic membrane. What is the most appropriate management?",
        options: {
          A: "Immediate antibiotics (amoxicillin) for 5 days",
          B: "Watchful waiting for 72 hours then antibiotics if no improvement",
          C: "Topical antibiotic drops",
          D: "Urgent ENT referral",
          E: "Decongestants and pain relief only"
        },
        answer: "B",
        explanation: "NICE CKS recommends watchful waiting for 72 hours in uncomplicated acute otitis media, as many cases resolve spontaneously. Antibiotics if symptoms persist or worsen.",
        mnemonic: "Otitis Media: WAIT-3 = Watch And wait Initially, Antibiotics if persisting, In 72 hours reassess, Temperature and pain control",
        links: {
          primary: {
            title: "NICE CKS: Otitis media - acute",
            url: "https://cks.nice.org.uk/topics/otitis-media-acute/"
          }
        }
      }
    ],
    pharmacology: [
      {
        id: "pharm1",
        category: "pharmacology",
        topic: "Warfarin Interaction",
        question: "A 68-year-old on warfarin for atrial fibrillation (target INR 2-3) develops a chest infection. His INR today is 2.4. Which antibiotic is SAFEST to prescribe?",
        options: {
          A: "Amoxicillin 500mg three times daily",
          B: "Clarithromycin 500mg twice daily",
          C: "Ciprofloxacin 500mg twice daily",
          D: "Co-trimoxazole 960mg twice daily",
          E: "Erythromycin 500mg four times daily"
        },
        answer: "A",
        explanation: "Amoxicillin has minimal interaction with warfarin compared to macrolides (clarithromycin/erythromycin), quinolones (ciprofloxacin), and co-trimoxazole which significantly increase INR.",
        mnemonic: "Warfarin Interactions: CREAM = Clarithromycin, Rifampicin (decreases), Erythromycin, Antibiotics (most), Metronidazole. Amoxicillin safest.",
        links: {
          primary: {
            title: "BNF Drug Interactions",
            url: "https://bnf.nice.org.uk/interactions/"
          }
        }
      }
    ],
    ethics_law: [
      {
        id: "ethics1",
        category: "ethics-law",
        topic: "Consent Capacity",
        question: "A 17-year-old requests contraception but asks you not to inform her parents. She demonstrates understanding of risks and benefits. What is the most appropriate action?",
        options: {
          A: "Provide contraception without parental consent (Gillick competent)",
          B: "Refuse unless parents are informed",
          C: "Provide but inform parents anyway",
          D: "Refer to family planning clinic only",
          E: "Wait until 18th birthday"
        },
        answer: "A",
        explanation: "GMC 0-18 years guidance: if under-16 demonstrates sufficient understanding (Gillick competent), contraception can be provided confidentially without parental consent in their best interests.",
        mnemonic: "Gillick Competence: MATURE = Mind capable, Autonomous decision, Thorough understanding, Understands consequences, Rational thought, Ethical practice",
        links: {
          primary: {
            title: "GMC 0-18 years: guidance for doctors",
            url: "https://www.gmc-uk.org/ethical-guidance/ethical-guidance-for-doctors/0-18-years"
          }
        }
      }
    ]
  };
  
  // Get questions from comprehensive sample bank with all medical specialties
  const categoryQuestions = sampleQuestions[category] || [];
  
  // Log available question count for this category
  console.log(`${category}: ${categoryQuestions.length} questions available`);
  
  return categoryQuestions.slice(0, count);
}

app.get("/api/test/questions", async (req, res) => {
    try {
      // Track page view
      const sessionId = Array.isArray(req.headers['x-session-id']) 
        ? req.headers['x-session-id'][0] 
        : req.headers['x-session-id'] || generateSessionId();
      trackPageView(sessionId, '/test');

      // Extract query parameters for filtering
      const { category, difficulty, count } = req.query;
      const requestedCount = count ? parseInt(count as string) : 10;

      const testQuestions = [
        {
          id: "q1", 
          topic: "Urinary Tract Infection Management",
          question: "A 28-year-old non-pregnant woman presents to your GP practice with a 2-day history of dysuria, urinary frequency, and suprapubic pain. She has no fever, flank pain, or vaginal discharge. Urine dipstick shows nitrites positive and leucocytes 2+. What is the most appropriate first-line antibiotic treatment?",
          options: {
            A: "Nitrofurantoin 100mg modified-release twice daily for 3 days",
            B: "Trimethoprim 200mg twice daily for 3 days",
            C: "Amoxicillin 500mg three times daily for 3 days", 
            D: "Ciprofloxacin 250mg twice daily for 3 days",
            E: "Fosfomycin 3g single dose"
          },
          answer: "A",
          explanation: "Why Nitrofurantoin 100mg modified-release twice daily for 3 days is correct:\n\n• Gold Standard Treatment: \n  - NICE NG109 specifically recommends nitrofurantoin as first-line therapy for uncomplicated lower UTIs in non-pregnant women aged 16-64\n  - Endorsed by Clinical Knowledge Summaries, British National Formulary, and Public Health England guidelines\n  - Consistently ranked as primary choice across all major UK antimicrobial prescribing protocols\n  - Forms the cornerstone of evidence-based UTI management in primary care settings\n\n• Exceptional Microbiological Efficacy: \n  - Demonstrates outstanding in vitro and in vivo activity against Escherichia coli, which accounts for 80-85% of uncomplicated UTIs\n  - Maintains >95% sensitivity rates against common uropathogens including Klebsiella pneumoniae and Enterococcus faecalis\n  - Shows consistent bactericidal activity with minimal inhibitory concentrations well below achievable urinary levels\n  - Retains effectiveness against extended-spectrum beta-lactamase producing organisms\n\n• Unique Multi-Target Mechanism: \n  - Inhibits bacterial DNA synthesis, RNA synthesis, protein synthesis, and cell wall formation simultaneously\n  - Multiple antimicrobial pathways significantly reduce the likelihood of resistance development\n  - Acts through nitrofuran reduction by bacterial nitroreductases, creating reactive intermediates that damage multiple cellular components\n  - This multi-target approach explains the remarkably low resistance rates observed in clinical surveillance\n\n• Pharmacokinetic Advantages: \n  - Achieves urinary concentrations of 200-400 mcg/ml, far exceeding minimum inhibitory concentrations for target pathogens\n  - Minimal systemic absorption and distribution reduces systemic side effects and drug interactions\n  - Rapid renal elimination ensures concentrated antibacterial activity specifically within the urinary tract\n  - Modified-release formulation provides sustained therapeutic levels throughout 12-hour dosing intervals\n\n• Robust Clinical Evidence: \n  - Multiple randomized controlled trials demonstrate bacteriological cure rates of 85-95% for uncomplicated cystitis\n  - Cochrane systematic reviews confirm non-inferiority to other first-line agents with superior safety profile\n  - Real-world effectiveness studies show consistent clinical cure rates across diverse patient populations\n  - Long-term follow-up studies demonstrate sustained efficacy with minimal impact on normal flora\n\n• Optimized Pharmaceutical Formulation: \n  - Modified-release preparation ensures steady drug release and optimal absorption kinetics\n  - Reduces peak plasma concentrations while maintaining therapeutic urinary levels\n  - Significantly decreases gastrointestinal adverse effects compared to immediate-release formulations\n  - Improves patient compliance through twice-daily dosing convenience\n\n• Resistance Profile Excellence: \n  - UK antimicrobial resistance surveillance data consistently shows <5% resistance rates for E. coli\n  - European Centre for Disease Prevention and Control reports stable low resistance across EU countries\n  - Resistance development remains minimal even after decades of clinical use\n  - Preserves effectiveness of other antimicrobials through narrow-spectrum targeting\n\n• Optimal Treatment Duration: \n  - Three-day duration provides optimal balance between therapeutic efficacy and antimicrobial stewardship\n  - Clinical trials confirm non-inferiority of 3-day vs 5-7 day courses for uncomplicated infections\n  - Reduces selective pressure for resistance development through shorter exposure duration\n  - Minimizes disruption to normal microbiota while ensuring complete pathogen eradication\n\n• Antimicrobial Stewardship Alignment: \n  - Supports WHO, NICE, and local antimicrobial stewardship principles through targeted narrow-spectrum therapy\n  - Preserves broad-spectrum agents for complicated infections and resistant organisms\n  - Contributes to global efforts to combat antimicrobial resistance through responsible prescribing\n  - Demonstrates commitment to evidence-based medicine and rational antibiotic use",
          incorrectExplanation: "• Option B (Trimethoprim 200mg twice daily) - Compromised First-Line Status: \n  - UK surveillance data demonstrates 20-30% resistance rates among E. coli isolates, significantly reducing empirical effectiveness\n  - European Centre for Disease Prevention and Control reports rising resistance trends across EU member states\n  - NICE guidelines now classify as second-line due to declining clinical reliability in uncomplicated UTIs\n  - Should be reserved for culture-guided therapy when sensitivity testing confirms susceptibility\n  - Folate antagonism mechanism susceptible to widespread resistance through dihydrofolate reductase mutations\n  - No longer meets the >90% efficacy threshold required for empirical first-line therapy\n\n• Option C (Amoxicillin 500mg three times daily) - Inadequate Uropathogen Coverage: \n  - Demonstrates poor intrinsic activity against gram-negative uropathogens, particularly E. coli and Klebsiella species\n  - Beta-lactamase production by >50% of E. coli strains renders amoxicillin ineffective for empirical treatment\n  - Lacks sufficient urinary concentrations to overcome resistance mechanisms in common UTI pathogens\n  - NICE, CKS, and BNF explicitly exclude from recommended UTI treatment protocols\n  - Broad-spectrum activity unnecessarily disrupts normal flora without targeted uropathogen efficacy\n  - Clinical trials consistently demonstrate inferior cure rates compared to nitrofurantoin and trimethoprim\n\n• Option D (Ciprofloxacin 250mg twice daily) - Inappropriate Broad-Spectrum Use: \n  - Fluoroquinolone class reserved for complicated UTIs, pyelonephritis, and multi-resistant organisms per NICE guidance\n  - Contributes significantly to antimicrobial resistance development through selective pressure on gram-negative bacteria\n  - UK antimicrobial stewardship policies explicitly restrict fluoroquinolone use for uncomplicated lower UTIs\n  - Associated with Clostridioides difficile infection risk and other serious adverse effects\n  - Unnecessary exposure to broad-spectrum agent when narrow-spectrum alternatives remain effective\n  - Public Health England guidelines emphasize preservation for serious infections requiring broad coverage\n\n• Option E (Fosfomycin 3g single dose) - Specialized Second-Line Therapy: \n  - Currently licensed and recommended for treatment failures, recurrent infections, or specific clinical circumstances\n  - Significantly more expensive than first-line options, impacting healthcare resource allocation\n  - Limited clinical experience compared to established first-line agents in UK primary care settings\n  - NICE guidance reserves for specific indications rather than routine empirical therapy\n  - Single-dose regimen may not provide sustained antimicrobial pressure for complete bacterial eradication\n  - Should be considered after first-line therapy failure or in patients with contraindications to standard treatments",
          mnemonic: "UTI Treatment: NITRO = Nice Initial Treatment Recommended Option\n\nUTI Risk Factors: FEMALES = Frequent intercourse, E.coli, Males (uncircumcised), Age extremes, Low fluid intake, Estrogen deficiency, Sexual activity\n\nUTI Symptoms: FUND = Frequency, Urgency, Nocturia, Dysuria\n\nComplicated UTI: PHUNK = Pregnancy, Hospitalisation, Urological abnormality, Nephritis, Kids (pediatric)",
          guidelineSummary: {
            title: "UTI Management Summary",
            content: "• **Definition & Diagnosis**: \n  - Uncomplicated UTI presents with dysuria, frequency, urgency, suprapubic pain in healthy non-pregnant women aged 16-64\n  - Diagnosis confirmed by positive urine dipstick (nitrites/leucocytes) or MSU culture\n  - Consider alternative diagnoses in atypical presentations\n\n• **First-line Treatment**: \n  - Nitrofurantoin 100mg modified-release BD for 3 days remains gold standard\n  - Excellent E. coli coverage (>95% sensitivity), minimal resistance development\n  - Concentrated urinary excretion\n  - Avoid in eGFR <45ml/min\n\n• **Alternative Options**: \n  - Trimethoprim 200mg BD for 3 days (second-line due to 20-30% E. coli resistance)\n  - Fosfomycin 3g single dose for treatment failures or intolerance\n  - Avoid quinolones unless specifically indicated\n\n• **When to Culture**: \n  - Suspected pyelonephritis, treatment failure, recurrent UTIs (≥2 episodes in 6 months)\n  - Pregnancy, immunocompromised patients, or atypical organisms suspected\n\n• **Safety Netting**: \n  - Advise patients to return if symptoms persist >48 hours post-treatment\n  - Develop fever/flank pain, or experience severe systemic symptoms\n  - Provide written information on fluid intake and symptom monitoring\n\n• **Prevention**: \n  - Recommend adequate hydration, complete bladder emptying\n  - Post-coital voiding for sexually active women\n  - Consider cranberry products for recurrent cases, though evidence remains limited\n\n• **Antibiotic Stewardship**: \n  - Reserve broad-spectrum antibiotics for complicated cases\n  - Encourage symptom diaries for recurrent infections to identify triggers and optimize prevention strategies"
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/ng109",
              description: "NICE NG109: Urinary tract infection (lower) - antimicrobial prescribing"
            },
            supplementary: [
              {
                title: "NICE Visual Summary",
                url: "https://www.nice.org.uk/guidance/ng136/resources/visual-summary-pdf-6899919517",
                description: "NICE NG136 Visual Summary - Hypertension treatment flowchart"
              },
              {
                title: "NICE Guidance",
                url: "https://cks.nice.org.uk/topics/urinary-tract-infection-lower-women/",
                description: "Clinical Knowledge Summaries - comprehensive UTI guidance"
              },
              {
                title: "BNF Antimicrobial Guidance", 
                url: "https://bnf.nice.org.uk/treatment-summaries/urinary-tract-infections/",
                description: "British National Formulary - UTI treatment protocols"
              },
              {
                title: "PHE Antimicrobial Guidelines",
                url: "https://www.gov.uk/government/publications/managing-common-infections-guidance-for-primary-care",
                description: "Public Health England - managing common infections in primary care"
              },
              {
                title: "SIGN Antimicrobial Prescribing",
                url: "https://www.sign.ac.uk/our-guidelines/antibiotic-prophylaxis-in-surgery/",
                description: "Scottish Intercollegiate Guidelines Network - infection management"
              }
            ]
          }
        },
        {
          id: "q2",
          topic: "Acute Coronary Syndrome Management",
          question: "A 58-year-old man presents to the emergency department with severe central chest pain radiating to his left arm, lasting 45 minutes. He appears sweaty and nauseous. ECG shows ST elevation >2mm in leads II, III, and aVF. His blood pressure is 140/85 mmHg, heart rate 95 bpm. What is the most appropriate immediate management?",
          options: {
            A: "Primary percutaneous coronary intervention (PCI) within 120 minutes",
            B: "Thrombolytic therapy with alteplase immediately",
            C: "High-dose atorvastatin and dual antiplatelet therapy",
            D: "Coronary angiography within 24 hours",
            E: "Conservative management with aspirin and clopidogrel"
          },
          answer: "A",
          explanation: "Why Primary PCI within 120 minutes is correct:\n\n• NICE CG167 Gold Standard Treatment: \n  - Primary PCI represents the definitive reperfusion strategy for STEMI when delivered within 120 minutes of first medical contact\n  - European Society of Cardiology and American Heart Association guidelines consistently rank primary PCI as Class I recommendation\n  - Achieves superior outcomes compared to thrombolytic therapy in terms of mortality, reinfarction, and stroke reduction\n  - Forms the cornerstone of contemporary acute coronary syndrome management in healthcare systems with PCI capability\n\n• Superior Clinical Outcomes: \n  - Meta-analyses of randomized controlled trials demonstrate 25-30% relative risk reduction in 30-day mortality compared to thrombolysis\n  - Significantly reduces risk of intracranial hemorrhage (0.05% vs 0.7% with thrombolysis)\n  - Lower rates of reinfarction, target vessel revascularization, and major bleeding complications\n  - Provides immediate restoration of epicardial and microvascular flow with TIMI 3 flow achievement >95%\n\n• Optimal Timing Advantages: \n  - 120-minute door-to-balloon time threshold balances logistical feasibility with clinical benefit\n  - Every 30-minute delay in reperfusion increases relative mortality risk by 7.5%\n  - Time-dependent myocardial salvage maximized when intervention occurs within therapeutic window\n  - Modern cardiac networks designed to achieve primary PCI within recommended timeframes\n\n• Comprehensive Mechanical Revascularization: \n  - Allows complete assessment of coronary anatomy and multivessel disease evaluation\n  - Enables treatment of culprit vessel with optimal stent selection (drug-eluting vs bare metal)\n  - Provides immediate hemodynamic support capability if cardiogenic shock develops\n  - Permits assessment of left ventricular function and mechanical complications\n\n• Evidence-Based Guideline Compliance: \n  - NICE CG167 specifically recommends primary PCI as first-line reperfusion strategy\n  - Myocardial Infarction National Audit Project data supports improved outcomes with primary PCI\n  - Quality indicators and clinical governance frameworks emphasize door-to-balloon time optimization\n  - Aligns with international best practice and reduces medico-legal risk\n\n• Resource Utilization Efficiency: \n  - Single procedure addresses both diagnosis and treatment simultaneously\n  - Reduces hospital length of stay compared to thrombolysis with subsequent angiography\n  - Lower long-term healthcare costs through reduced readmissions and complications\n  - Optimal use of specialist cardiac intervention facilities and expertise",
          incorrectExplanation: "• Option B (Thrombolytic therapy with alteplase) - Suboptimal Reperfusion Strategy: \n  - Reserved for situations where primary PCI cannot be delivered within 120 minutes of first medical contact\n  - NICE CG167 relegates thrombolysis to second-line therapy when PCI facilities unavailable\n  - Higher rates of intracranial hemorrhage, reinfarction, and incomplete reperfusion compared to primary PCI\n  - Requires subsequent angiography within 24 hours, essentially delaying definitive treatment\n  - Contraindicated in patients with recent surgery, stroke, or bleeding disorders\n  - Does not provide immediate assessment of coronary anatomy or multivessel disease\n\n• Option C (High-dose atorvastatin and dual antiplatelet therapy) - Important but Insufficient: \n  - Represents essential adjunctive therapy but does not address acute vessel occlusion requiring immediate reperfusion\n  - Dual antiplatelet therapy alone cannot restore flow in completely occluded coronary arteries\n  - High-dose statin therapy provides plaque stabilization but requires days to weeks for clinical benefit\n  - Delays definitive reperfusion therapy during critical therapeutic window\n  - Should be initiated alongside, not instead of, primary PCI\n  - Time-dependent myocardial necrosis continues without mechanical intervention\n\n• Option D (Coronary angiography within 24 hours) - Inappropriate Delay: \n  - Represents non-primary PCI approach suitable for NSTEMI, not STEMI management\n  - 24-hour delay results in significant irreversible myocardial necrosis and adverse remodeling\n  - NICE guidelines specifically emphasize emergency reperfusion within 120 minutes for STEMI\n  - Misses critical therapeutic window where myocardial salvage remains possible\n  - Associated with worse clinical outcomes including higher mortality and heart failure rates\n  - Does not align with time-sensitive nature of ST-elevation myocardial infarction\n\n• Option E (Conservative management) - Contraindicated Approach: \n  - Completely inappropriate for STEMI requiring immediate reperfusion therapy\n  - Results in completed myocardial infarction with maximum infarct size and worst clinical outcomes\n  - Associated with highest mortality rates, mechanical complications, and long-term heart failure\n  - Contradicts all major international guidelines for acute coronary syndrome management\n  - Represents substandard care with significant medico-legal implications\n  - Antiplatelet therapy alone cannot restore flow in acutely occluded epicardial coronary arteries",
          mnemonic: "STEMI Management: PCI = Primary Choice Immediately\n\nACS Risk Factors: MATCH = Male, Age, Total cholesterol high, Cigarettes, Hypertension\n\nMI Complications: DREAD = Death, Rupture, Embolism, Arrhythmia, Dressler syndrome\n\nContraindications to Thrombolysis: HARBINS = Haemorrhage (active/recent), Aortic dissection, Recent surgery, Blood pressure >200/110, Intracranial pathology, Non-compressible puncture sites, Stroke (recent)",
          guidelineSummary: {
            title: "STEMI Management Summary",
            content: "• Definition & Recognition: \n  - ST elevation >2mm in chest leads or >1mm in limb leads in clinical context of acute coronary syndrome\n  - Symptoms include severe central chest pain, radiation to arms/jaw, associated autonomic features\n  - ECG changes reflect acute coronary occlusion requiring immediate reperfusion\n\n• Primary PCI Strategy: \n  - Gold standard reperfusion when achievable within 120 minutes of first medical contact\n  - Superior to thrombolysis for mortality, reinfarction, stroke, and bleeding outcomes\n  - Requires immediate activation of cardiac catheterization laboratory\n\n• Thrombolytic Therapy: \n  - Second-line when PCI unavailable within therapeutic window\n  - Alteplase, tenecteplase, or streptokinase depending on contraindications\n  - Requires subsequent angiography within 24 hours\n\n• Adjunctive Pharmacotherapy: \n  - Dual antiplatelet therapy (aspirin 300mg loading, clopidogrel 600mg or ticagrelor 180mg)\n  - High-dose atorvastatin 80mg immediately\n  - Anticoagulation with unfractionated heparin or bivalirudin\n\n• Secondary Prevention: \n  - ACE inhibitor within 24 hours if no contraindications\n  - Beta-blocker when hemodynamically stable\n  - Long-term dual antiplatelet therapy duration per guidelines\n\n• Complications Monitoring: \n  - Mechanical complications (papillary muscle rupture, ventricular septal defect)\n  - Arrhythmias requiring continuous cardiac monitoring\n  - Heart failure and cardiogenic shock assessment"
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/cg167",
              description: "NICE CG167: Myocardial infarction - cardiac rehabilitation and prevention"
            },
            supplementary: [
              {
                title: "NICE Guidance",
                url: "https://www.nice.org.uk/guidance/ng185",
                description: "Acute coronary syndromes - comprehensive management pathway"
              },
              {
                title: "NHS Cardiac Guidance",
                url: "https://www.nhs.uk/conditions/heart-attack/",
                description: "NHS guidance on heart attack management and treatment"
              },
              {
                title: "ESC Guidelines",
                url: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines",
                description: "European Society of Cardiology - STEMI management guidelines"
              },
              {
                title: "British Cardiovascular Society",
                url: "https://www.britishcardiovascularsociety.org",
                description: "Professional guidance for cardiac interventions"
              }
            ]
          }
        },
        {
          id: "q3",
          topic: "Type 2 Diabetes Management",
          question: "A 52-year-old woman with newly diagnosed type 2 diabetes has an HbA1c of 75 mmol/mol (9.0%). Her BMI is 32 kg/m², blood pressure 145/90 mmHg, and eGFR 85 ml/min/1.73m². She has no contraindications to medications. What is the most appropriate initial pharmacological management?",
          options: {
            A: "Metformin 500mg twice daily with lifestyle modifications",
            B: "Insulin detemir 10 units once daily",
            C: "Gliclazide 80mg twice daily",
            D: "Metformin plus empagliflozin combination",
            E: "Lifestyle modifications only for 6 months"
          },
          answer: "A",
          explanation: "Why Metformin 500mg twice daily with lifestyle modifications is correct:\n\n• NICE NG28 First-Line Treatment Standard: \n  - Metformin represents the evidence-based first-line pharmacological intervention for type 2 diabetes across all major international guidelines\n  - Demonstrated efficacy in reducing HbA1c by 1.0-1.5% (11-16 mmol/mol) when combined with lifestyle interventions\n  - Extensive clinical trial evidence spanning over three decades supports metformin as initial therapy\n  - UK Prospective Diabetes Study established metformin's role in reducing macrovascular complications\n\n• Superior Cardiovascular Protection: \n  - Metformin provides significant cardiovascular benefits beyond glycemic control\n  - Reduces risk of myocardial infarction by 39% and all-cause mortality by 36% compared to conventional therapy\n  - Cardioprotective effects demonstrated across diverse patient populations including those with established cardiovascular disease\n  - Neutral or beneficial effects on heart failure outcomes unlike some other antidiabetic agents\n\n• Optimal Weight Management Profile: \n  - Weight-neutral or modest weight reduction effects particularly beneficial in overweight patients (BMI 32 kg/m²)\n  - Contrasts favorably with insulin and sulfonylureas which typically cause weight gain\n  - Supports long-term metabolic health through improved insulin sensitivity\n  - Enhances effectiveness of concurrent lifestyle modifications\n\n• Comprehensive Metabolic Benefits: \n  - Improves insulin sensitivity at hepatic and peripheral muscle sites\n  - Reduces hepatic glucose production through AMP-activated protein kinase pathway activation\n  - Beneficial effects on lipid profile including modest reduction in LDL cholesterol\n  - May improve endothelial function and reduce inflammation markers\n\n• Excellent Safety and Tolerability Profile: \n  - Low risk of hypoglycemia when used as monotherapy\n  - Contraindications limited to severe renal impairment (eGFR <30), acute illness, or lactic acidosis risk\n  - Gastrointestinal side effects typically mild and transient, minimized by gradual dose escalation\n  - Extensive post-marketing surveillance confirms long-term safety\n\n• Cost-Effectiveness and Accessibility: \n  - Generic formulations available ensuring affordability across healthcare systems\n  - Well-established prescribing patterns and clinical familiarity among healthcare providers\n  - Lower overall healthcare costs through prevention of diabetes complications\n  - Suitable for resource-limited settings with proven efficacy",
          incorrectExplanation: "• Option B (Insulin detemir 10 units once daily) - Premature Intensive Therapy: \n  - Reserved for patients with severe hyperglycemia, ketosis, or failure of oral antidiabetic agents\n  - NICE NG28 recommends insulin initiation only after metformin optimization and consideration of additional oral agents\n  - Associated with significant weight gain (2-4 kg average) particularly problematic in overweight patients\n  - Higher risk of severe hypoglycemia requiring emergency intervention\n  - More complex dosing regimen requiring blood glucose monitoring and dose adjustment\n  - Does not address underlying insulin resistance characteristic of type 2 diabetes\n\n• Option C (Gliclazide 80mg twice daily) - Suboptimal First-Line Choice: \n  - Sulfonylureas relegated to second-line therapy due to hypoglycemia risk and weight gain\n  - Mechanism of action (insulin secretagogue) does not address insulin resistance\n  - Associated with 2-5 kg weight gain potentially exacerbating metabolic dysfunction\n  - Higher cardiovascular mortality concerns raised in some observational studies\n  - Progressive beta-cell exhaustion with prolonged use leading to secondary failure\n  - Lack of cardiovascular protection compared to metformin\n\n• Option D (Metformin plus empagliflozin combination) - Inappropriate Initial Intensification: \n  - Combination therapy reserved for patients failing to achieve targets on metformin monotherapy\n  - NICE guidelines emphasize stepwise approach starting with metformin optimization\n  - Empagliflozin more expensive than metformin alone without additional benefit as initial therapy\n  - Increased risk of genitourinary infections and diabetic ketoacidosis\n  - Should be considered only after 3-6 months of metformin therapy if targets not achieved\n  - Lacks evidence for superior initial efficacy compared to metformin monotherapy\n\n• Option E (Lifestyle modifications only) - Inadequate for Severe Hyperglycemia: \n  - HbA1c of 75 mmol/mol represents significant hyperglycemia requiring immediate pharmacological intervention\n  - NICE guidelines recommend immediate metformin initiation when HbA1c >58 mmol/mol (7.5%)\n  - Lifestyle modifications alone insufficient to achieve target HbA1c reduction from this elevated baseline\n  - Delays appropriate treatment potentially increasing risk of diabetic complications\n  - May result in progressive beta-cell dysfunction and more difficult future glycemic control\n  - Contradicts evidence-based approach to diabetes management in moderate to severe hyperglycemia",
          mnemonic: "Diabetes Management: MET = Metformin Every Time (first-line)\n\nDiabetes Complications: DIVINE = Diabetic nephropathy, Ischaemic heart disease, Visual problems, Infections, Neuropathy, Emergencies (DKA/HHS)\n\nDKA Precipitants: 4 I's = Infection, Ischaemia, Iatrogenic (drugs), Idiopathic\n\nHbA1c Targets: SAFE = Standard 53mmol/mol (7%), Avoid tight control in elderly, Frail patients 58-64mmol/mol, Everyone individualised",
          guidelineSummary: {
            title: "Type 2 Diabetes Management Summary",
            content: "• Definition & Diagnosis: \n  - HbA1c ≥48 mmol/mol (6.5%) or fasting glucose ≥7.0 mmol/L in symptomatic patients\n  - Confirmed with repeat testing unless symptomatic with random glucose ≥11.1 mmol/L\n  - Consider MODY, LADA in atypical presentations\n\n• First-Line Pharmacotherapy: \n  - Metformin 500mg twice daily, increase to 1g twice daily if tolerated\n  - Contraindicated if eGFR <30 ml/min/1.73m² or acute illness\n  - Continue alongside lifestyle modifications throughout treatment\n\n• HbA1c Targets: \n  - Standard target 53 mmol/mol (7.0%) for most adults\n  - Individualized targets considering age, comorbidities, hypoglycemia risk\n  - Relaxed targets (58-64 mmol/mol) in elderly or high bleeding risk\n\n• Second-Line Options: \n  - Add sulfonylurea, pioglitazone, DPP4 inhibitor, SGLT2 inhibitor, or GLP1 agonist\n  - Choice depends on patient factors: weight, cardiovascular risk, renal function\n  - Consider insulin if HbA1c >75 mmol/mol despite dual therapy\n\n• Cardiovascular Protection: \n  - SGLT2 inhibitors or GLP1 agonists for established cardiovascular disease\n  - Blood pressure target <140/90 mmHg (or <130/80 with kidney/eye disease)\n  - Statin therapy for primary prevention if QRISK >10%\n\n• Complications Screening: \n  - Annual diabetic retinopathy screening\n  - Foot examination annually\n  - Urine albumin:creatinine ratio and eGFR monitoring"
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/ng28",
              description: "NICE NG28: Type 2 diabetes in adults - management"
            },
            supplementary: [
              {
                title: "NICE Guidance",
                url: "https://www.nice.org.uk/guidance/ng17",
                description: "Type 1 and 2 diabetes in children and young people"
              },
              {
                title: "NHS Diabetes Guidance",
                url: "https://www.nhs.uk/conditions/type-2-diabetes/",
                description: "NHS guidance on type 2 diabetes management"
              },
              {
                title: "Diabetes UK Guidelines", 
                url: "https://www.diabetes.org.uk/professionals",
                description: "Professional guidance for diabetes management"
              },
              {
                title: "SIGN Diabetes Guidelines",
                url: "https://www.sign.ac.uk/our-guidelines/management-of-diabetes/",
                description: "Scottish diabetes management recommendations"
              }
            ]
          }
        },
        {
          id: "q4",
          topic: "Community-Acquired Pneumonia",
          question: "A 45-year-old previously healthy man presents with a 3-day history of fever, productive cough with purulent sputum, and right-sided chest pain. His temperature is 38.8°C, respiratory rate 24/min, blood pressure 110/70 mmHg, pulse 95 bpm, oxygen saturation 94% on air. Chest X-ray shows right lower lobe consolidation. What is the most appropriate initial antibiotic treatment?",
          options: {
            A: "Amoxicillin 500mg three times daily for 5 days",
            B: "Co-amoxiclav 625mg three times daily for 7 days",
            C: "Clarithromycin 500mg twice daily for 5 days",
            D: "Levofloxacin 500mg once daily for 5 days",
            E: "Doxycycline 200mg loading then 100mg daily"
          },
          answer: "A",
          explanation: "Why Amoxicillin 500mg three times daily for 5 days is correct:\n\n• NICE CG191 First-Line Evidence-Based Treatment: \n  - Amoxicillin represents the definitive first-line antibiotic for community-acquired pneumonia in previously healthy adults\n  - British Thoracic Society guidelines consistently recommend amoxicillin for low-severity CAP management\n  - Extensive clinical trial evidence demonstrates non-inferiority to broader spectrum agents for typical bacterial pneumonia\n  - Cost-effective choice reducing unnecessary antibiotic resistance pressure\n\n• Optimal Streptococcus pneumoniae Coverage: \n  - Targets the most common cause of bacterial community-acquired pneumonia (30-50% of cases)\n  - Excellent activity against penicillin-sensitive pneumococcal strains prevalent in UK\n  - Bactericidal activity through beta-lactam mechanism disrupting bacterial cell wall synthesis\n  - Achieves therapeutic concentrations in respiratory tract tissues and alveolar fluid\n\n• Appropriate Spectrum for Typical Bacteria: \n  - Effective against Haemophilus influenzae, the second most common CAP pathogen\n  - Covers Moraxella catarrhalis in patients without significant risk factors\n  - Avoids unnecessary broad-spectrum coverage in immunocompetent patients\n  - Preserves effectiveness of broader agents for complicated or resistant infections\n\n• Proven Clinical Efficacy Profile: \n  - Randomized controlled trials demonstrate 85-90% clinical cure rates for mild-moderate CAP\n  - Equivalent outcomes to combination therapies in appropriately selected patients\n  - Shorter duration (5 days) proven non-inferior to traditional 7-10 day courses\n  - Well-tolerated with minimal adverse effects in healthy adults\n\n• Antimicrobial Stewardship Compliance: \n  - Narrow-spectrum approach supports global antimicrobial resistance reduction efforts\n  - Minimizes selective pressure on gram-negative organisms and anaerobic flora\n  - Reduces risk of Clostridioides difficile infection compared to broader spectrum alternatives\n  - Aligns with NICE antimicrobial prescribing guidelines and local formularies\n\n• Pharmacokinetic Advantages: \n  - Excellent oral bioavailability (74-92%) ensuring adequate systemic exposure\n  - Predictable pharmacokinetics allowing standard dosing without monitoring\n  - Minimal drug interactions compared to macrolides and fluoroquinolones\n  - Safe in patients with mild-moderate renal impairment",
          incorrectExplanation: "• Option B (Co-amoxiclav 625mg three times daily) - Unnecessarily Broad Spectrum: \n  - Beta-lactamase inhibitor combination adds no benefit for typical community-acquired pneumonia\n  - NICE CG191 reserves co-amoxiclav for patients with specific risk factors or treatment failure\n  - Higher rates of gastrointestinal side effects including antibiotic-associated diarrhea\n  - Increased selective pressure on resistant organisms without additional clinical benefit\n  - More expensive than amoxicillin without improved outcomes in this clinical scenario\n  - Should be considered for patients with chronic lung disease or previous antibiotic exposure\n\n• Option C (Clarithromycin 500mg twice daily) - Inappropriate Monotherapy: \n  - Macrolide monotherapy inadequate for pneumococcal pneumonia due to resistance concerns\n  - UK pneumococcal resistance rates to macrolides approach 15-20% in some regions\n  - Risk of treatment failure particularly in severe pneumococcal infections\n  - Reserved for atypical pathogen coverage or penicillin-allergic patients\n  - Should be used in combination with beta-lactam for severe CAP, not as monotherapy\n  - Drug interactions with multiple medications through CYP3A4 inhibition\n\n• Option D (Levofloxacin 500mg once daily) - Excessive Broad-Spectrum Coverage: \n  - Fluoroquinolone therapy reserved for treatment failure or specific clinical indications\n  - NICE guidelines emphasize preservation of fluoroquinolones for resistant organisms\n  - Associated with increased risk of Clostridioides difficile infection and tendon rupture\n  - Contributes to fluoroquinolone resistance in pneumococci and gram-negative bacteria\n  - More expensive than first-line alternatives without superior efficacy\n  - Should be avoided in uncomplicated CAP to preserve effectiveness\n\n• Option E (Doxycycline loading dose regimen) - Suboptimal Pneumococcal Activity: \n  - Tetracycline antibiotics demonstrate variable activity against Streptococcus pneumoniae\n  - Pneumococcal resistance to tetracyclines reported in 10-15% of isolates\n  - Primarily indicated for atypical pathogen coverage (Mycoplasma, Chlamydia)\n  - Gastrointestinal side effects and photosensitivity reactions common\n  - Less reliable than beta-lactam antibiotics for typical bacterial pneumonia\n  - Should be considered for atypical pathogen suspected infections or penicillin allergy",
          mnemonic: "Pneumonia Management: AMOX = Always Most Optimal eXcellent choice\n\nPneumonia Severity (CURB-65): CURB = Confusion, Urea >7mmol/L, Respiratory rate ≥30, Blood pressure <90/60, Age ≥65\n\nPneumonia Organisms: CHAMPS = Chlamydia, Haemophilus, Atypicals (Mycoplasma), Moraxella, Pneumococcus, Staph aureus\n\nAtypical Pneumonia: CLAM = Chlamydia, Legionella, Atypicals, Mycoplasma",
          guidelineSummary: {
            title: "Community-Acquired Pneumonia Management Summary",
            content: "• Clinical Assessment: \n  - CURB-65 score guides severity assessment and management location\n  - Score 0-1: home treatment, 2: consider hospital, 3-5: hospital admission\n  - Symptoms include fever, cough, dyspnea, chest pain, sputum production\n\n• First-Line Antibiotic Therapy: \n  - Amoxicillin 500mg TDS for 5 days in previously healthy adults\n  - Co-amoxiclav if risk factors for resistance or structural lung disease\n  - Add clarithromycin if atypical pathogens suspected\n\n• Severe CAP Management: \n  - Combination therapy: co-amoxiclav plus clarithromycin\n  - Consider levofloxacin monotherapy in selected cases\n  - ICU admission if CURB-65 ≥4 or clinical deterioration\n\n• Special Considerations: \n  - Penicillin allergy: clarithromycin, doxycycline, or levofloxacin\n  - Suspected aspiration: co-amoxiclav or clindamycin\n  - Recent hospitalization: consider broader spectrum coverage\n\n• Treatment Duration: \n  - 5 days standard for uncomplicated CAP\n  - Extend to 7-10 days if slow clinical response\n  - Clinical improvement expected within 48-72 hours\n\n• Follow-up and Safety Netting: \n  - Chest X-ray if no improvement at 6 weeks\n  - Return if worsening symptoms or new concerning features\n  - Consider complications: empyema, lung abscess, sepsis"
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/cg191",
              description: "NICE CG191: Pneumonia in adults - diagnosis and management"
            },
            supplementary: [
              {
                title: "NICE Guidance",
                url: "https://www.nice.org.uk/guidance/ng138",
                description: "Antimicrobial prescribing for respiratory tract infections"
              },
              {
                title: "NHS Respiratory Guidance",
                url: "https://www.nhs.uk/conditions/pneumonia/",
                description: "NHS guidance on pneumonia treatment and management"
              },
              {
                title: "British Thoracic Society",
                url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/",
                description: "BTS guidelines for respiratory medicine"
              },
              {
                title: "PHE Respiratory Guidelines",
                url: "https://www.gov.uk/government/collections/respiratory-diseases-guidance-data-and-analysis",
                description: "Public Health England respiratory infection guidance"
              }
            ]
          }
        },
        {
          id: "q5",
          topic: "Hypertension Management",
          question: "A 65-year-old Afro-Caribbean woman presents for routine blood pressure monitoring. Her readings over 3 visits are: 165/95, 158/92, and 162/90 mmHg. She has no other cardiovascular risk factors, normal renal function (eGFR 78), and no contraindications to medications. What is the most appropriate first-line antihypertensive treatment?",
          options: {
            A: "Amlodipine 5mg once daily",
            B: "Ramipril 2.5mg once daily",
            C: "Bendroflumethiazide 2.5mg once daily",
            D: "Atenolol 50mg once daily",
            E: "Losartan 50mg once daily"
          },
          answer: "A",
          explanation: "Why Amlodipine 5mg once daily is correct:\n\n• NICE NG136 Evidence-Based Ethnic-Specific Recommendations: \n  - Calcium channel blockers represent first-line therapy for hypertension in patients of African or Caribbean family origin\n  - Based on extensive clinical trial evidence demonstrating superior efficacy compared to ACE inhibitors in this population\n  - ALLHAT trial and subsequent meta-analyses confirm optimal cardiovascular outcomes with calcium channel blockers in Black patients\n  - Addresses genetic polymorphisms affecting renin-angiotensin system responsiveness in Afro-Caribbean populations\n\n• Superior Antihypertensive Efficacy in Target Population: \n  - Achieves greater blood pressure reduction (15-20 mmHg systolic) compared to ACE inhibitors in Afro-Caribbean patients\n  - Addresses low-renin hypertension phenotype common in patients of African ancestry\n  - Overcomes genetic variations in ACE gene polymorphisms that reduce ACE inhibitor effectiveness\n  - Provides consistent 24-hour blood pressure control with once-daily dosing\n\n• Optimal Cardiovascular Protection Profile: \n  - Reduces stroke risk by 35-40% in clinical trials involving predominantly Black populations\n  - Significant reduction in coronary events and heart failure hospitalizations\n  - Excellent end-organ protection including renal and retinal benefits\n  - Neutral effects on glucose metabolism and lipid profiles\n\n• Comprehensive Mechanism of Action: \n  - Blocks L-type calcium channels in vascular smooth muscle causing direct vasodilation\n  - Reduces peripheral vascular resistance without significantly affecting cardiac contractility\n  - Long half-life (35-50 hours) provides sustained antihypertensive effect\n  - Minimal reflex tachycardia compared to immediate-release calcium channel blockers\n\n• Excellent Tolerability and Safety: \n  - Well-tolerated with predictable side effect profile\n  - Ankle edema occurs in 10-15% of patients but rarely requires discontinuation\n  - No significant drug interactions with common medications\n  - Safe in patients with diabetes, chronic kidney disease, and coronary artery disease\n\n• Cost-Effectiveness and Accessibility: \n  - Generic formulations widely available reducing healthcare costs\n  - Once-daily dosing improves medication adherence\n  - Established safety profile with decades of clinical experience\n  - Suitable for long-term management with proven cardiovascular benefits",
          incorrectExplanation: "• Option B (Ramipril 2.5mg once daily) - Suboptimal for Afro-Caribbean Patients: \n  - ACE inhibitors demonstrate reduced efficacy in patients of African or Caribbean family origin\n  - NICE NG136 specifically recommends ACE inhibitors as second-line therapy in this population\n  - Genetic polymorphisms in ACE and angiotensinogen genes reduce therapeutic response\n  - Higher rates of angioedema (0.1-0.7%) in Black patients compared to other ethnicities\n  - Should be considered as add-on therapy rather than initial monotherapy\n  - Less effective at preventing stroke, the most common cardiovascular complication in this population\n\n• Option C (Bendroflumethiazide 2.5mg once daily) - Second-Line Diuretic Choice: \n  - Thiazide-like diuretics effective but not preferred first-line in current NICE guidelines\n  - May cause electrolyte disturbances requiring monitoring (hyponatremia, hypokalemia)\n  - Potential adverse effects on glucose tolerance and lipid profiles\n  - Less convenient dosing schedule compared to modern antihypertensives\n  - Associated with higher rates of erectile dysfunction in men\n  - Reserved for combination therapy or specific clinical indications\n\n• Option D (Atenolol 50mg once daily) - Inappropriate Beta-Blocker Selection: \n  - Beta-blockers not recommended as first-line therapy for uncomplicated hypertension\n  - NICE guidelines restrict beta-blockers to specific indications (heart failure, post-MI, arrhythmias)\n  - Associated with increased stroke risk compared to other antihypertensive classes\n  - May mask hypoglycemic symptoms in diabetic patients\n  - Potential for withdrawal syndrome if discontinued abruptly\n  - Less effective at preventing cardiovascular events in elderly patients\n\n• Option E (Losartan 50mg once daily) - Similar Limitations to ACE Inhibitors: \n  - Angiotensin receptor blockers share similar efficacy limitations in Afro-Caribbean populations\n  - Target the same renin-angiotensin pathway with reduced activity in low-renin hypertension\n  - More expensive than calcium channel blockers without superior efficacy in this population\n  - Should be considered for patients intolerant of ACE inhibitors\n  - Better tolerated than ACE inhibitors but still second-line choice per NICE guidance\n  - Useful in combination therapy but not optimal as initial monotherapy",
          mnemonic: "Hypertension Management: CCB = Calcium Channel Blocker for Caribbean/Black patients\n\nHypertension Causes: RENAL CHAMP = Renal disease, Endocrine (Conn's, Cushing's, Phaeochromocytoma), Neurogenic, Aortic coarctation, Liquorice, Contraceptive pill, Hyperaldosteronism, Age, Male, Pregnancy\n\nMalignant Hypertension: FRESH = Fundal changes (papilloedema), Renal failure, Encephalopathy, Stroke, Heart failure\n\nACE Inhibitor Side Effects: CHASM = Cough, Hyperkalaemia, Angioedema, Syncope, Metallic taste",
          guidelineSummary: {
            title: "Hypertension Management Summary",
            content: "• Definition & Diagnosis: \n  - Persistent blood pressure ≥140/90 mmHg confirmed by ambulatory or home monitoring\n  - Stage 1: 140-159/90-99 mmHg, Stage 2: 160-179/100-109 mmHg, Stage 3: ≥180/110 mmHg\n  - Consider white coat hypertension if clinic BP elevated but ambulatory/home BP normal\n\n• Ethnic-Specific First-Line Treatment: \n  - Afro-Caribbean patients: Calcium channel blocker (amlodipine 5mg) or thiazide-like diuretic\n  - Other ethnicities <55 years: ACE inhibitor or ARB\n  - All patients ≥55 years: Calcium channel blocker or thiazide-like diuretic\n\n• Treatment Targets: \n  - <80 years: <140/90 mmHg (or <135/85 home/ambulatory)\n  - ≥80 years: <150/90 mmHg\n  - Diabetes/CKD: <130/80 mmHg\n\n• Combination Therapy: \n  - Step 2: Add ACE inhibitor/ARB to CCB/diuretic or vice versa\n  - Step 3: Triple therapy (ACE inhibitor + CCB + diuretic)\n  - Step 4: Add spironolactone or alpha/beta blocker\n\n• Lifestyle Modifications: \n  - Weight reduction, dietary sodium restriction (<6g/day)\n  - Regular exercise (150 minutes moderate activity/week)\n  - Alcohol moderation, smoking cessation\n\n• Monitoring and Follow-up: \n  - Annual review once controlled\n  - Monitor renal function and electrolytes\n  - Assess cardiovascular risk factors and end-organ damage"
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/ng136",
              description: "NICE NG136: Hypertension in adults - diagnosis and management"
            },
            supplementary: [
              {
                title: "NICE Guidance",
                url: "https://www.nice.org.uk/guidance/cg127",
                description: "Hypertension in pregnancy - diagnosis and management"
              },
              {
                title: "NHS Hypertension Guidance",
                url: "https://www.nhs.uk/conditions/high-blood-pressure-hypertension/treatment/",
                description: "NHS hypertension treatment protocols"
              },
              {
                title: "NHS Blood Pressure Guidance",
                url: "https://www.nhs.uk/conditions/high-blood-pressure-hypertension/",
                description: "NHS guidance for blood pressure management"
              },
              {
                title: "NHS Stroke Prevention",
                url: "https://www.nhs.uk/conditions/stroke/",
                description: "NHS stroke prevention and risk factor management"
              }
            ]
          }
        },
        {
          id: "q6",
          topic: "Atrial Fibrillation Management",
          question: "A 72-year-old man with newly diagnosed atrial fibrillation presents for anticoagulation assessment. He has a history of hypertension and type 2 diabetes but no previous stroke or bleeding history. His CHA₂DS₂-VASc score is 4. Renal function is normal. What is the most appropriate anticoagulation strategy?",
          options: {
            A: "Apixaban 5mg twice daily",
            B: "Warfarin with target INR 2.0-3.0",
            C: "Aspirin 75mg once daily",
            D: "Rivaroxaban 20mg once daily",
            E: "No anticoagulation, rate control only"
          },
          answer: "A",
          explanation: "Why Apixaban 5mg twice daily is correct:\n\n• NICE CG180 Direct Oral Anticoagulant Preference: \n  - DOACs represent first-line anticoagulation for stroke prevention in atrial fibrillation\n  - Apixaban demonstrates superior efficacy and safety profile compared to warfarin in landmark ARISTOTLE trial\n  - Reduced stroke risk by 21% and major bleeding by 31% compared to warfarin\n  - NICE guidelines recommend DOACs over warfarin for newly diagnosed atrial fibrillation\n\n• Optimal Stroke Prevention Efficacy: \n  - CHA₂DS₂-VASc score of 4 indicates high stroke risk requiring definitive anticoagulation\n  - Annual stroke risk of 8-10% without anticoagulation versus 2-3% with effective treatment\n  - Factor Xa inhibition provides consistent anticoagulant effect without vitamin K dependence\n  - Proven stroke prevention in both paroxysmal and persistent atrial fibrillation\n\n• Superior Safety Profile Compared to Warfarin: \n  - 50% reduction in intracranial hemorrhage risk, the most feared anticoagulation complication\n  - Lower rates of major bleeding requiring hospitalization or transfusion\n  - Reduced gastrointestinal bleeding compared to rivaroxaban and dabigatran\n  - No requirement for routine anticoagulation monitoring\n\n• Practical Clinical Advantages: \n  - Fixed-dose regimen without need for INR monitoring\n  - Minimal food interactions allowing flexible dosing schedule\n  - Fewer drug interactions compared to warfarin's extensive interaction profile\n  - Rapid onset and offset of action beneficial for procedures\n\n• Patient-Centered Benefits: \n  - Improved quality of life through elimination of frequent blood tests\n  - Better treatment adherence due to simplified dosing regimen\n  - Lower healthcare utilization costs despite higher drug acquisition costs\n  - Reduced dietary restrictions compared to warfarin therapy\n\n• Evidence-Based Dosing Strategy: \n  - Standard dose 5mg twice daily appropriate for patients without dose reduction criteria\n  - Dose reduction to 2.5mg twice daily only if ≥2 of: age ≥80, weight ≤60kg, creatinine ≥133 μmol/L\n  - Twice-daily dosing provides consistent anticoagulant effect throughout 24-hour period\n  - Extensive pharmacokinetic studies confirm optimal dosing strategy",
          incorrectExplanation: "• Option B (Warfarin with target INR 2.0-3.0) - Second-Line Vitamin K Antagonist: \n  - NICE CG180 relegates warfarin to second-line choice when DOACs contraindicated or unsuitable\n  - Requires frequent INR monitoring with associated healthcare resource utilization\n  - Time in therapeutic range typically 60-70% even in specialized anticoagulation clinics\n  - Higher intracranial bleeding risk compared to DOACs\n  - Extensive drug and food interactions complicating management\n  - Should be reserved for patients with contraindications to DOACs or mechanical heart valves\n\n• Option C (Aspirin 75mg once daily) - Inadequate Stroke Prevention: \n  - Antiplatelet therapy provides minimal stroke prevention benefit in atrial fibrillation\n  - 20% relative risk reduction compared to 60-70% with effective anticoagulation\n  - NICE guidelines explicitly state aspirin should not be used for stroke prevention in AF\n  - May increase bleeding risk without proportional stroke prevention benefit\n  - Relegates patient to suboptimal treatment with preventable stroke risk\n  - Only indicated for patients with absolute contraindications to anticoagulation\n\n• Option D (Rivaroxaban 20mg once daily) - Acceptable but Less Optimal DOAC: \n  - Factor Xa inhibitor with proven efficacy but higher bleeding rates than apixaban\n  - ROCKET-AF trial showed non-inferiority to warfarin but included higher-risk population\n  - Higher gastrointestinal bleeding rates compared to apixaban in real-world studies\n  - Once-daily dosing may result in end-of-dose anticoagulant effect reduction\n  - Food requirements for optimal absorption may reduce adherence\n  - More expensive than apixaban without superior clinical outcomes\n\n• Option E (No anticoagulation, rate control only) - Unacceptable Stroke Risk: \n  - CHA₂DS₂-VASc score of 4 represents high stroke risk requiring anticoagulation\n  - Withholding anticoagulation results in preventable stroke with devastating consequences\n  - Rate control alone does not address thromboembolic risk in atrial fibrillation\n  - Contradicts all major international guidelines for atrial fibrillation management\n  - Represents substandard care with significant medico-legal implications\n  - Only acceptable if absolute contraindications to all anticoagulant options exist",
          mnemonic: "Atrial Fibrillation: APEX = Apixaban Excels for stroke Prevention\n\nCHADS-VASc Score: CHADS-VASc = Congestive heart failure, Hypertension, Age ≥75 (2 points), Diabetes, Stroke/TIA (2 points), Vascular disease, Age 65-74, Sex (female)\n\nHAS-BLED Score: HAS-BLED = Hypertension, Abnormal liver/kidney function, Stroke history, Bleeding predisposition, Labile INRs, Elderly >65, Drugs/alcohol\n\nAF Complications: HEART = Heart failure, Embolism, Arrhythmia complications, Rate problems, Thrombosis",
          guidelineSummary: {
            title: "Atrial Fibrillation Management Summary",
            content: "• Risk Assessment: \n  - CHA₂DS₂-VASc score for stroke risk: age ≥75 (2 points), stroke/TIA/thromboembolism (2), age 65-74, hypertension, diabetes, heart failure, vascular disease, female sex (1 point each)\n  - HAS-BLED score for bleeding risk assessment\n  - Score ≥2 warrants anticoagulation consideration\n\n• Anticoagulation Strategy: \n  - First-line: DOACs (apixaban, rivaroxaban, edoxaban, dabigatran)\n  - Second-line: Warfarin (target INR 2.0-3.0)\n  - Avoid aspirin for stroke prevention\n\n• DOAC Selection: \n  - Apixaban: lowest bleeding risk, twice daily\n  - Rivaroxaban: once daily, take with food\n  - Edoxaban: once daily, avoid if CrCl >95\n  - Dabigatran: twice daily, higher GI bleeding\n\n• Rate vs Rhythm Control: \n  - Rate control first-line: beta-blockers, calcium channel blockers, digoxin\n  - Target heart rate <110 bpm (lenient control)\n  - Rhythm control for symptomatic patients or heart failure\n\n• Cardioversion Considerations: \n  - Anticoagulate 3 weeks before and 4 weeks after\n  - TOE-guided cardioversion if urgent\n  - Success rates higher within 48 hours of onset\n\n• Follow-up and Monitoring: \n  - Annual review of anticoagulation needs\n  - Monitor renal function for DOAC dosing\n  - Assess bleeding and stroke risk changes"
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/cg180",
              description: "NICE CG180: Atrial fibrillation - diagnosis and management"
            },
            supplementary: [
              {
                title: "NICE Guidance",
                url: "https://www.nice.org.uk/guidance/ta355",
                description: "Apixaban for preventing stroke in atrial fibrillation"
              },
              {
                title: "NHS Anticoagulation Guidance",
                url: "https://www.nhs.uk/conditions/anticoagulants/",
                description: "NHS anticoagulation protocols and guidance"
              },
              {
                title: "ESC AF Guidelines",
                url: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Atrial-Fibrillation-Guidelines",
                description: "European Society of Cardiology atrial fibrillation guidelines"
              },
              {
                title: "NHS Atrial Fibrillation",
                url: "https://www.nhs.uk/conditions/atrial-fibrillation/",
                description: "NHS atrial fibrillation and stroke prevention guidance"
              }
            ]
          }
        },
        {
          id: "q7",
          topic: "Depression Management",
          question: "A 28-year-old woman presents with a 6-week history of persistent low mood, loss of interest in activities, fatigue, and poor concentration affecting her work performance. She has no suicidal ideation, psychotic symptoms, or substance use. PHQ-9 score is 14. What is the most appropriate initial management?",
          options: {
            A: "Sertraline 50mg once daily",
            B: "Cognitive behavioral therapy (CBT) referral",
            C: "Sertraline plus CBT combination",
            D: "Watchful waiting for 2 weeks",
            E: "Mirtazapine 15mg at bedtime"
          },
          answer: "B",
          explanation: "Why Cognitive behavioral therapy (CBT) referral is correct:\n\n• NICE CG90 Evidence-Based First-Line Psychological Therapy: \n  - CBT represents the gold standard first-line treatment for moderate depression in adults\n  - Extensive meta-analyses demonstrate equivalent efficacy to antidepressants for moderate depression\n  - Provides lasting benefits beyond treatment duration, reducing relapse rates by 40-50%\n  - Addresses cognitive distortions and behavioral patterns underlying depressive episodes\n\n• Optimal Treatment for Moderate Depression (PHQ-9: 10-14): \n  - PHQ-9 score of 14 indicates moderate depression severity requiring active intervention\n  - Individual CBT shows superior long-term outcomes compared to medication alone\n  - Develops patient's own coping strategies and problem-solving skills\n  - Addresses psychosocial factors contributing to depression maintenance\n\n• Strong Evidence Base for Effectiveness: \n  - Multiple randomized controlled trials demonstrate 60-70% response rates\n  - Cochrane systematic reviews confirm CBT efficacy for depression across age groups\n  - Structured approach targeting automatic thoughts, cognitive distortions, and behavioral activation\n  - Maintains effectiveness in both individual and group therapy formats\n\n• Absence of Medication Side Effects: \n  - Avoids potential adverse effects of antidepressants including sexual dysfunction, weight gain, and withdrawal symptoms\n  - No drug interactions or contraindications to consider\n  - Suitable for patients planning pregnancy or with medical comorbidities\n  - Eliminates concerns about medication adherence and monitoring\n\n• Cost-Effectiveness and Accessibility: \n  - NICE health economic analyses support CBT as cost-effective intervention\n  - Available through NHS IAPT services with standardized protocols\n  - Computerized CBT options provide accessible alternatives\n  - Long-term cost savings through reduced relapse rates and healthcare utilization\n\n• Skill Development and Empowerment: \n  - Teaches transferable skills for managing future depressive episodes\n  - Enhances patient autonomy and self-efficacy\n  - Addresses workplace difficulties through behavioral activation and problem-solving\n  - Provides structured approach to mood monitoring and relapse prevention",
          incorrectExplanation: "• Option A (Sertraline 50mg once daily) - Premature Pharmacological Intervention: \n  - NICE CG90 recommends psychological therapy as first-line for moderate depression\n  - Antidepressants reserved for severe depression, patient preference, or CBT failure\n  - May cause sexual dysfunction, gastrointestinal effects, and initial anxiety increase\n  - Withdrawal symptoms possible upon discontinuation\n  - Does not address underlying cognitive and behavioral patterns\n  - Should be considered if CBT unavailable or after psychological therapy failure\n\n• Option C (Sertraline plus CBT combination) - Unnecessary Combination: \n  - Combination therapy reserved for severe depression or treatment-resistant cases\n  - No additional benefit over CBT alone for moderate depression\n  - Increases treatment costs without improving outcomes\n  - Adds medication side effects without proportional benefit\n  - NICE guidelines recommend stepwise approach starting with psychological therapy\n  - Combination should be considered only if monotherapy ineffective\n\n• Option D (Watchful waiting for 2 weeks) - Inappropriate Delay: \n  - PHQ-9 score of 14 indicates moderate depression requiring active treatment\n  - Six-week duration suggests persistent depressive episode beyond natural recovery\n  - Functional impairment at work necessitates immediate intervention\n  - Watchful waiting only appropriate for mild depression or recent onset\n  - Delays access to effective treatment potentially worsening outcomes\n  - May result in further functional decline and increased treatment complexity\n\n• Option E (Mirtazapine 15mg at bedtime) - Suboptimal Antidepressant Choice: \n  - Sedating antidepressant with significant weight gain and metabolic effects\n  - Higher discontinuation rates due to side effect profile\n  - Not first-line antidepressant choice per NICE guidelines\n  - More appropriate for depression with insomnia or poor appetite\n  - Psychological therapy remains preferred first-line intervention\n  - Should be reserved for specific clinical indications or SSRI intolerance",
          mnemonic: "CBT = Cognitive Behavioral Therapy first",
          guidelineSummary: {
            title: "Depression Management Summary",
            content: "• Assessment and Diagnosis: \n  - PHQ-9 questionnaire for severity assessment: mild (5-9), moderate (10-14), severe (15-19), very severe (20-27)\n  - Exclude bipolar disorder, psychotic symptoms, substance use\n  - Assess suicide risk and safeguarding needs\n\n• Treatment by Severity: \n  - Mild depression: watchful waiting, guided self-help, group CBT\n  - Moderate depression: individual CBT, counselling, or antidepressant\n  - Severe depression: combination therapy (CBT + antidepressant)\n\n• Psychological Therapies: \n  - CBT most evidence-based, 16-20 sessions over 4-6 months\n  - Interpersonal therapy, counselling, behavioral activation\n  - IAPT services provide stepped care approach\n\n• Antidepressant Selection: \n  - First-line: SSRIs (sertraline, citalopram, fluoxetine)\n  - Second-line: SNRIs, mirtazapine, tricyclics\n  - Start low dose, review at 2 weeks, optimize at 4-6 weeks\n\n• Monitoring and Follow-up: \n  - Review at 2 weeks initially, then monthly\n  - Continue treatment 6 months after remission\n  - Assess side effects, adherence, suicidal ideation\n\n• Relapse Prevention: \n  - Maintain therapy for 6-12 months post-remission\n  - Identify early warning signs and triggers\n  - Lifestyle interventions: exercise, sleep hygiene, social support"
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/cg90",
              description: "NICE CG90: Depression in adults - recognition and management"
            },
            supplementary: [
              {
                title: "NICE Guidance",
                url: "https://www.nice.org.uk/guidance/cg91",
                description: "Depression in adults with chronic physical health problems"
              },
              {
                title: "NHS Mental Health",
                url: "https://www.nhs.uk/mental-health/conditions/depression-in-adults/",
                description: "NHS mental health treatment protocols"
              },
              {
                title: "NHS IAPT",
                url: "https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/",
                description: "Improving Access to Psychological Therapies program"
              },
              {
                title: "Royal College of Psychiatrists",
                url: "https://www.rcpsych.ac.uk/mental-health/problems-disorders/depression",
                description: "Professional guidance for depression management"
              }
            ]
          }
        },
        {
          id: "q8",
          topic: "Chronic Obstructive Pulmonary Disease",
          question: "A 68-year-old man with COPD presents with worsening breathlessness and increased sputum production over 4 days. He has had 2 exacerbations in the past year. Chest examination reveals wheeze and reduced air entry bilaterally. Oxygen saturation is 88% on room air. What is the most appropriate initial treatment?",
          options: {
            A: "Prednisolone 30mg daily for 5 days plus antibiotics",
            B: "Increase bronchodilator therapy only",
            C: "Immediate non-invasive ventilation",
            D: "High-flow oxygen to achieve SpO2 94-98%",
            E: "Nebulized bronchodilators alone"
          },
          answer: "A",
          explanation: "Why Prednisolone 30mg daily for 5 days plus antibiotics is correct:\n\n• NICE CG101 Evidence-Based Exacerbation Management: \n  - Combination therapy with corticosteroids and antibiotics represents standard care for COPD exacerbations\n  - Clinical presentation suggests infective exacerbation requiring dual therapy approach\n  - Prednisolone 30mg daily for 5 days reduces hospital admission rates by 25-30%\n  - Antibiotics target bacterial pathogens commonly responsible for COPD exacerbations\n\n• Optimal Corticosteroid Protocol: \n  - Prednisolone 30mg daily proven effective dose for reducing inflammation and improving outcomes\n  - Five-day course minimizes side effects while maintaining therapeutic benefit\n  - Reduces exacerbation duration by 1-2 days and improves lung function recovery\n  - Decreases risk of treatment failure and subsequent hospitalization\n\n• Targeted Antibiotic Therapy: \n  - Increased sputum production indicates bacterial infection requiring antibiotic treatment\n  - Common pathogens include Haemophilus influenzae, Streptococcus pneumoniae, Moraxella catarrhalis\n  - First-line antibiotics: amoxicillin, doxycycline, or clarithromycin based on local resistance patterns\n  - Reduces bacterial load and accelerates clinical recovery\n\n• Comprehensive Anti-Inflammatory Approach: \n  - Addresses both infectious and inflammatory components of COPD exacerbation\n  - Corticosteroids reduce airway inflammation and improve bronchodilator responsiveness\n  - Combination therapy more effective than either treatment alone\n  - Prevents progression to respiratory failure requiring ventilatory support\n\n• Evidence-Based Hospitalization Avoidance: \n  - Early appropriate treatment reduces need for hospital admission\n  - Maintains patient independence and quality of life\n  - Cost-effective approach reducing healthcare resource utilization\n  - Enables home-based recovery with appropriate safety netting\n\n• Established Safety Profile: \n  - Short-course prednisolone well-tolerated with minimal adverse effects\n  - Risk-benefit ratio strongly favors treatment in COPD exacerbations\n  - Monitoring for hyperglycemia in diabetic patients recommended\n  - Appropriate dose and duration minimize systemic side effects",
          incorrectExplanation: "• Option B (Increase bronchodilator therapy only) - Insufficient for Exacerbation: \n  - Bronchodilator optimization alone inadequate for managing COPD exacerbation\n  - Does not address inflammatory component requiring corticosteroid therapy\n  - Fails to treat bacterial infection suggested by increased sputum production\n  - May result in treatment failure and delayed recovery\n  - NICE guidelines emphasize combination therapy for exacerbations\n  - Appropriate as adjunctive therapy but not sole treatment\n\n• Option C (Immediate non-invasive ventilation) - Premature Escalation: \n  - NIV reserved for patients with respiratory acidosis (pH <7.35) or hypercapnic respiratory failure\n  - Oxygen saturation of 88% does not automatically indicate NIV requirement\n  - Should be considered only after medical therapy optimization\n  - Requires specialized monitoring and expertise\n  - May be necessary if medical therapy fails or respiratory acidosis develops\n  - Patient requires trial of medical therapy first\n\n• Option D (High-flow oxygen to achieve SpO2 94-98%) - Inappropriate Target: \n  - COPD patients require controlled oxygen therapy with target SpO2 88-92%\n  - Higher oxygen targets risk carbon dioxide retention and respiratory acidosis\n  - May suppress hypoxic drive in chronic CO2 retainers\n  - Does not address underlying exacerbation requiring anti-inflammatory and antibiotic therapy\n  - Oxygen therapy should be titrated to achieve appropriate saturation levels\n  - Requires concurrent medical treatment for exacerbation\n\n• Option E (Nebulized bronchodilators alone) - Incomplete Treatment: \n  - Addresses bronchospasm component but ignores inflammation and infection\n  - Bronchodilators alone insufficient for managing COPD exacerbation\n  - May provide symptomatic relief but does not alter disease course\n  - Higher risk of treatment failure and hospitalization\n  - Should be used as part of comprehensive exacerbation management\n  - Requires combination with corticosteroids and antibiotics for optimal outcomes",
          mnemonic: "COPD Exacerbation: COPD = Corticosteroids plus Oral antibiotics for Pulmonary Disease\n\nCOPD Causes: ASTHMA = Alpha-1 antitrypsin deficiency, Smoking, Tuberculosis, Hypersensitivity pneumonitis, Manufacturing (occupational), Air pollution\n\nCOPD Exacerbation Triggers: HIVES = Haemophilus influenzae, Infection (viral), Viral, Environmental pollutants, Streptococcus pneumoniae\n\nRespiratory Failure Type 2: STOP = Sleep apnoea, Thoracic wall abnormalities, Opiates, Pneumonia (severe)",
          guidelineSummary: {
            title: "COPD Exacerbation Management Summary",
            content: "• Definition and Recognition: \n  - Acute worsening of respiratory symptoms beyond normal variation\n  - Increased dyspnea, cough, sputum volume/purulence\n  - May include systemic symptoms: fever, malaise, reduced exercise tolerance\n\n• Severity Assessment: \n  - Mild: managed at home with bronchodilator increase\n  - Moderate: requires corticosteroids ± antibiotics\n  - Severe: may need hospital admission, oxygen, NIV\n\n• Pharmacological Treatment: \n  - Corticosteroids: prednisolone 30mg daily for 5 days\n  - Antibiotics if purulent sputum: amoxicillin, doxycycline, clarithromycin\n  - Bronchodilators: increase frequency, consider nebulized therapy\n\n• Oxygen Therapy: \n  - Target SpO2 88-92% in COPD patients\n  - Controlled oxygen delivery to avoid CO2 retention\n  - Monitor for hypercapnic respiratory failure\n\n• Indications for Hospital Admission: \n  - Severe breathlessness, cyanosis, peripheral edema\n  - Impaired consciousness, acute confusion\n  - Oxygen saturation <90% despite controlled oxygen\n  - Social circumstances preventing home management\n\n• Non-Invasive Ventilation: \n  - Indicated for respiratory acidosis (pH 7.25-7.35)\n  - Hypercapnic respiratory failure despite medical therapy\n  - Reduces intubation rates and mortality\n\n• Discharge Planning: \n  - Ensure adequate bronchodilator therapy\n  - Complete antibiotic course, steroid weaning if required\n  - Follow-up within 2-4 weeks"
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/cg101",
              description: "NICE CG101: Chronic obstructive pulmonary disease - management"
            },
            supplementary: [
              {
                title: "NICE Guidance",
                url: "https://www.nice.org.uk/guidance/ng114",
                description: "Chronic obstructive pulmonary disease in over 16s"
              },
              {
                title: "NHS COPD Guidance",
                url: "https://www.nhs.uk/conditions/chronic-obstructive-pulmonary-disease-copd/",
                description: "NHS COPD treatment protocols"
              },
              {
                title: "British Thoracic Society",
                url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/copd/",
                description: "BTS guidelines for COPD management"
              },
              {
                title: "GOLD Guidelines",
                url: "https://goldcopd.org/2024-gold-report/",
                description: "Global Initiative for Chronic Obstructive Lung Disease"
              }
            ]
          }
        },
        {
          id: "q9",
          topic: "Gastroesophageal Reflux Disease",
          question: "A 42-year-old woman presents with a 3-month history of heartburn and regurgitation occurring 3-4 times per week, particularly after meals and when lying down. She has no alarm symptoms. Lifestyle modifications have provided minimal relief. What is the most appropriate next management step?",
          options: {
            A: "Proton pump inhibitor therapy for 4-8 weeks",
            B: "H2 receptor antagonist therapy",
            C: "Urgent upper endoscopy",
            D: "Helicobacter pylori testing",
            E: "Antacid therapy only"
          },
          answer: "A",
          explanation: "Why Proton pump inhibitor therapy for 4-8 weeks is correct:\n\n• NICE CG184 First-Line Acid Suppression Therapy: \n  - PPIs represent the most effective first-line treatment for GERD symptoms\n  - Superior acid suppression compared to H2 receptor antagonists and antacids\n  - Omeprazole 20mg, lansoprazole 30mg, or equivalent provide optimal symptom control\n  - Evidence-based duration of 4-8 weeks allows adequate therapeutic trial\n\n• Superior Efficacy for Symptom Control: \n  - Clinical trials demonstrate 70-85% symptom improvement with PPI therapy\n  - More effective than H2 receptor antagonists for healing esophagitis and symptom relief\n  - Provides rapid onset of action with significant improvement within 2-3 days\n  - Maintains consistent acid suppression throughout 24-hour period\n\n• Optimal Pharmacological Mechanism: \n  - Irreversible inhibition of gastric H+/K+-ATPase (proton pump)\n  - Achieves profound acid suppression with gastric pH >4 for 12-16 hours daily\n  - Blocks acid secretion regardless of stimulatory pathway (histamine, gastrin, acetylcholine)\n  - Long duration of action due to covalent binding to proton pump\n\n• Evidence-Based Treatment Duration: \n  - 4-8 week course provides adequate time for esophageal healing\n  - Allows assessment of symptom response before considering step-up therapy\n  - Balances therapeutic efficacy with cost-effectiveness\n  - Permits evaluation of underlying GERD severity\n\n• Appropriate for Uncomplicated GERD: \n  - Absence of alarm symptoms allows empirical PPI therapy\n  - Avoids unnecessary endoscopic investigation in typical GERD presentation\n  - Cost-effective approach for symptom-based diagnosis\n  - Therapeutic response supports GERD diagnosis\n\n• Established Safety Profile: \n  - Generally well-tolerated with minimal adverse effects\n  - Short-term use associated with low risk of complications\n  - Interactions primarily with clopidogrel and warfarin requiring monitoring\n  - Appropriate for most patients without contraindications",
          incorrectExplanation: "• Option B (H2 receptor antagonist therapy) - Less Effective Acid Suppression: \n  - H2 antagonists provide inferior symptom control compared to PPIs\n  - Ranitidine and famotidine achieve less profound acid suppression\n  - Development of tolerance with reduced efficacy over time\n  - NICE guidelines recommend PPIs as first-line therapy\n  - May be appropriate for mild symptoms or PPI intolerance\n  - Results in suboptimal symptom control and patient satisfaction\n\n• Option C (Urgent upper endoscopy) - Inappropriate for Uncomplicated GERD: \n  - Endoscopy reserved for patients with alarm symptoms or treatment failure\n  - Alarm symptoms include dysphagia, weight loss, anemia, persistent vomiting\n  - Cost-ineffective approach for typical GERD presentation\n  - Empirical PPI therapy more appropriate initial strategy\n  - Endoscopy should be considered after PPI failure or symptom progression\n  - Invasive procedure with associated risks and patient discomfort\n\n• Option D (Helicobacter pylori testing) - Irrelevant for GERD Management: \n  - H. pylori testing not indicated for typical GERD symptoms\n  - May be appropriate for dyspepsia or peptic ulcer disease\n  - Does not address acid reflux pathophysiology\n  - Delays appropriate anti-reflux therapy\n  - Test-and-treat strategy reserved for uninvestigated dyspepsia in specific populations\n  - Not recommended in NICE guidelines for GERD management\n\n• Option E (Antacid therapy only) - Inadequate for Persistent Symptoms: \n  - Antacids provide temporary symptomatic relief but do not address underlying acid production\n  - Insufficient for managing frequent symptoms occurring 3-4 times weekly\n  - Short duration of action requiring frequent dosing\n  - Does not prevent esophageal damage from ongoing acid exposure\n  - Appropriate for occasional symptoms but inadequate for chronic GERD\n  - Lifestyle modifications plus antacids have already failed to provide adequate relief",
          mnemonic: "GERD Management: PPI = Powerful Proton Pump Inhibition\n\nGERD Risk Factors: CLOTHES = Coffee, Lying down after meals, Obesity, Tomatoes, Hiatus hernia, Eating large meals, Smoking\n\nAlarm Symptoms: VOMITS = Vomiting, Odynophagia, Mass, Iron deficiency anaemia, Telltale weight loss, Swallowing difficulty\n\nPPI Side Effects: MAGIC = Magnesium deficiency, Absorption problems (B12, iron), GI infections (C.diff), Interactions (clopidogrel), Carcinoid tumours (long-term)",
          guidelineSummary: {
            title: "GERD Management Summary",
            content: "• Definition and Symptoms: \n  - Gastroesophageal reflux disease with typical symptoms: heartburn, regurgitation\n  - Atypical symptoms: chest pain, chronic cough, hoarseness, dental erosion\n  - Diagnosis primarily symptom-based in absence of alarm features\n\n• Lifestyle Modifications: \n  - Weight loss, smoking cessation, alcohol reduction\n  - Avoid trigger foods (spicy, fatty, acidic, caffeine)\n  - Elevate head of bed, avoid late meals\n  - Smaller, more frequent meals\n\n• Pharmacological Treatment: \n  - First-line: PPI therapy (omeprazole 20mg, lansoprazole 30mg) for 4-8 weeks\n  - Second-line: H2 receptor antagonists or antacids\n  - Long-term PPI therapy if symptoms recur\n\n• Alarm Symptoms Requiring Endoscopy: \n  - Dysphagia, odynophagia, weight loss\n  - Gastrointestinal bleeding, iron deficiency anemia\n  - Persistent vomiting, family history of upper GI cancer\n  - Age >55 with new-onset symptoms\n\n• Complications: \n  - Erosive esophagitis, peptic stricture\n  - Barrett's esophagus, adenocarcinoma risk\n  - Respiratory complications from aspiration\n\n• Management of Refractory Symptoms: \n  - Optimize PPI therapy (timing, dose, compliance)\n  - Consider twice-daily dosing\n  - Alternative PPI if inadequate response\n  - Investigate for other causes or complications"
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/cg184",
              description: "NICE CG184: Gastro-oesophageal reflux disease and dyspepsia"
            },
            supplementary: [
              {
                title: "NICE Guidance",
                url: "https://www.nice.org.uk/guidance/cg27",
                description: "Barrett's oesophagus and stage 1 oesophageal adenocarcinoma"
              },
              {
                title: "NHS Gastroenterology",
                url: "https://www.nhs.uk/conditions/heartburn-and-acid-reflux/",
                description: "NHS gastrointestinal treatment protocols"
              },
              {
                title: "BSG Guidelines",
                url: "https://www.bsg.org.uk/clinical-guidance/",
                description: "British Society of Gastroenterology clinical guidance"
              },
              {
                title: "RCGP Guidance",
                url: "https://www.rcgp.org.uk/clinical-and-research/resources/toolkits",
                description: "Royal College of General Practitioners clinical resources"
              }
            ]
          }
        },
        {
          id: "q10",
          topic: "Osteoporosis Prevention",
          question: "A 65-year-old postmenopausal woman presents for fracture risk assessment. She has a history of early menopause at age 48 and her mother had a hip fracture at age 70. She is otherwise healthy with no current medications. FRAX score indicates 10-year major osteoporotic fracture risk of 15%. What is the most appropriate management?",
          options: {
            A: "Alendronate 70mg weekly plus calcium and vitamin D",
            B: "Calcium and vitamin D supplementation only",
            C: "DEXA scan before treatment decision",
            D: "Lifestyle advice only",
            E: "Hormone replacement therapy"
          },
          answer: "A",
          explanation: "Why Alendronate 70mg weekly plus calcium and vitamin D is correct:\n\n• NICE CG146 Evidence-Based Fracture Prevention: \n  - FRAX score of 15% exceeds treatment threshold of 10% for major osteoporotic fractures\n  - Alendronate represents first-line bisphosphonate therapy for osteoporosis prevention\n  - Combination with calcium and vitamin D optimizes bone mineral density improvement\n  - Reduces vertebral fracture risk by 40-50% and hip fracture risk by 30-40%\n\n• Optimal Bisphosphonate Selection: \n  - Alendronate has most extensive evidence base for fracture prevention\n  - Weekly dosing (70mg) improves compliance compared to daily regimens\n  - Superior gastrointestinal tolerability compared to daily formulations\n  - Generic availability ensures cost-effectiveness\n\n• Comprehensive Bone Health Optimization: \n  - Calcium supplementation (1000-1200mg daily) supports bone mineralization\n  - Vitamin D (800-1000 IU daily) enhances calcium absorption and reduces falls\n  - Combination therapy more effective than bisphosphonate alone\n  - Addresses multiple pathways of bone metabolism\n\n• Strong Evidence for Fracture Risk Reduction: \n  - Fracture Intervention Trial demonstrated significant vertebral and hip fracture reduction\n  - Real-world studies confirm effectiveness across diverse populations\n  - Number needed to treat: 100 patients for 3 years to prevent one hip fracture\n  - Maintains bone density improvements with continued therapy\n\n• Appropriate for High-Risk Patient Profile: \n  - Early menopause increases fracture risk through prolonged estrogen deficiency\n  - Maternal hip fracture indicates genetic predisposition\n  - Age 65 represents optimal time for intervention initiation\n  - FRAX score accurately predicts fracture probability\n\n• Established Safety and Monitoring: \n  - Generally well-tolerated with proper administration instructions\n  - Rare serious adverse events (osteonecrosis jaw, atypical fractures) with long-term use\n  - Requires adequate calcium and vitamin D status\n  - Annual review of efficacy and safety",
          incorrectExplanation: "• Option B (Calcium and vitamin D supplementation only) - Insufficient Fracture Prevention: \n  - Nutritional supplementation alone inadequate for high fracture risk (FRAX 15%)\n  - Calcium and vitamin D provide modest bone density benefits without anti-resorptive therapy\n  - Meta-analyses show minimal fracture reduction with supplementation alone\n  - Does not address accelerated bone loss in postmenopausal women\n  - Appropriate as adjunctive therapy but not monotherapy\n  - Undertreatment given established fracture risk requiring bisphosphonate therapy\n\n• Option C (DEXA scan before treatment decision) - Unnecessary Delay: \n  - FRAX score already incorporates bone density estimation\n  - Treatment indicated based on fracture risk assessment without DEXA requirement\n  - NICE guidelines support treatment based on clinical risk factors\n  - DEXA scanning adds cost and delays appropriate therapy\n  - May be useful for monitoring treatment response\n  - Clinical risk assessment sufficient for treatment initiation\n\n• Option D (Lifestyle advice only) - Inadequate for High Fracture Risk: \n  - Lifestyle modifications important but insufficient for FRAX score 15%\n  - Exercise and smoking cessation provide modest fracture risk reduction\n  - Weight-bearing exercise improves bone density by 1-2% annually\n  - Does not address underlying pathophysiology of postmenopausal bone loss\n  - Appropriate as adjunctive measure but not primary intervention\n  - Contradicts evidence-based guidelines for fracture prevention\n\n• Option E (Hormone replacement therapy) - Inappropriate Risk-Benefit Profile: \n  - HRT carries increased risks of breast cancer, stroke, and venous thromboembolism\n  - Not recommended as first-line therapy for osteoporosis prevention\n  - Bisphosphonates provide superior fracture prevention with better safety profile\n  - Women's Health Initiative demonstrated unfavorable risk-benefit ratio\n  - May be considered for younger postmenopausal women with severe symptoms\n  - Requires careful individual risk assessment before consideration",
          mnemonic: "Osteoporosis Management: ALEX = Alendronate EXcellent for osteoporosis\n\nOsteoporosis Risk Factors: SHATTERED = Steroids, Hyperthyroidism/Hyperparathyroidism, Alcohol/Smoking, Thin (low BMI), Testosterone low, Early menopause, Renal/liver disease, Erosive/inflammatory bone disease, Dietary calcium low\n\nFracture Risk Assessment: FRAX = Fracture Risk Assessment eXamination tool\n\nBisphosphonate Side Effects: JEAN = Jaw osteonecrosis, Esophageal irritation, Atypical fractures, Nephrotoxicity",
          guidelineSummary: {
            title: "Osteoporosis Prevention Summary",
            content: "• Risk Assessment: \n  - FRAX tool estimates 10-year fracture probability\n  - Major risk factors: age, sex, previous fracture, parental hip fracture\n  - Secondary causes: steroids, rheumatoid arthritis, alcohol excess\n  - Treatment threshold: 10% major osteoporotic fracture risk\n\n• First-Line Pharmacotherapy: \n  - Alendronate 70mg weekly (or 10mg daily)\n  - Risedronate 35mg weekly alternative\n  - Calcium 1000-1200mg and vitamin D 800-1000 IU daily\n  - Take on empty stomach, remain upright 30 minutes\n\n• Lifestyle Modifications: \n  - Weight-bearing exercise, resistance training\n  - Smoking cessation, moderate alcohol consumption\n  - Adequate calcium intake (dairy, leafy greens)\n  - Fall prevention strategies\n\n• Monitoring and Duration: \n  - Annual review of adherence, side effects, fractures\n  - Consider treatment holiday after 5 years alendronate\n  - DEXA scan every 2-3 years if available\n  - Maintain calcium and vitamin D throughout\n\n• Second-Line Treatments: \n  - Denosumab 60mg 6-monthly injection\n  - Zoledronic acid 5mg annually\n  - Teriparatide for severe osteoporosis\n  - Raloxifene in selected postmenopausal women\n\n• Special Considerations: \n  - Contraindications: esophageal disorders, hypocalcemia\n  - Renal impairment: avoid if eGFR <35\n  - Dental procedures: inform dentist of bisphosphonate use"
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/cg146",
              description: "NICE CG146: Osteoporosis - assessing the risk of fragility fracture"
            },
            supplementary: [
              {
                title: "NICE Guidance",
                url: "https://www.nice.org.uk/guidance/ta464",
                description: "Bisphosphonates for treating osteoporosis"
              },
              {
                title: "NHS Osteoporosis Guidance",
                url: "https://www.nhs.uk/conditions/osteoporosis/",
                description: "NHS bone health and osteoporosis guidance"
              },
              {
                title: "Royal Osteoporosis Society",
                url: "https://theros.org.uk/healthcare-professionals/",
                description: "Professional guidance for osteoporosis management"
              },
              {
                title: "NOGG Guidelines",
                url: "https://www.nogg.org.uk/",
                description: "National Osteoporosis Guideline Group recommendations"
              }
            ]
          }
        },
        {
          id: "q11",
          topic: "Familial Hypercholesterolaemia",
          question: "A 33-year-old woman with familial hypercholesterolaemia is planning pregnancy. She is currently on atorvastatin 80 mg. What is the most appropriate advice?",
          options: {
            A: "Switch to atorvastatin 10mg",
            B: "Continue current dose",
            C: "Stop atorvastatin before trying to conceive",
            D: "Switch to ezetimibe",
            E: "Switch to simvastatin 40mg"
          },
          answer: "C",
          explanation: "Stopping atorvastatin before trying to conceive represents the evidence-based standard of care for women with familial hypercholesterolaemia planning pregnancy, as comprehensively outlined in current UK clinical guidelines. All HMG-CoA reductase inhibitors (statins) are classified as pregnancy category X medications due to demonstrated teratogenic potential in animal studies and case reports of birth defects in humans. The mechanism involves interference with cholesterol biosynthesis, which is crucial for normal fetal development, particularly affecting neural tube formation and limb development. NICE guidelines specifically recommend discontinuation at least three months before planned conception to ensure complete drug clearance and metabolite elimination. This timeframe accounts for atorvastatin's elimination half-life and allows for one complete ovarian cycle before conception attempts. While temporary statin cessation may result in elevated cholesterol levels, the cardiovascular risk during pregnancy remains relatively low in young women, even those with familial hypercholesterolaemia. Alternative lipid management strategies during pregnancy include dietary modification, bile acid sequestrants (which have minimal systemic absorption), and careful monitoring. The decision prioritizes fetal safety while acknowledging that short-term lipid elevation poses minimal maternal risk compared to potential teratogenic effects. Post-delivery, statin therapy can be safely resumed, though breastfeeding considerations require evaluation of individual circumstances and alternative lipid-lowering strategies may be preferred during lactation.",
          mnemonic: "Pregnancy & Statins: STATIN = Stop Three months Ahead To Inhibit Neonatal risk\n\nFamilial Hypercholesterolemia: FAMILY = Familial history, Atherosclerosis early, Male relatives <55, Increased LDL >4.9, Lady relatives <65, Yellow xanthomas\n\nStatin Side Effects: MEMORY = Myopathy, Elevated liver enzymes, Memory problems, Outcome diabetes risk, Rhabdomyolysis, Yellow skin (rare)\n\nPregnancy Drug Categories: ABCDX = A (safe), B (probably safe), C (caution), D (dangerous), X (contraindicated)",
          guidelineSummary: {
            title: "Familial Hypercholesterolaemia & Pregnancy Management Summary",
            content: "• **Definition & Recognition**: FH affects 1:250 individuals, characterized by LDL-C >4.9mmol/L, tendon xanthomata, family history of premature CHD. Use Dutch Lipid Clinic Network criteria for diagnosis. Early identification crucial for cardiovascular risk reduction.\n\n• **Pre-conception Planning**: Discontinue all statins ≥3 months before planned conception due to teratogenic risk (Category X). Atorvastatin has 14-hour half-life; clearance requires multiple elimination cycles. Consider switching to bile acid sequestrants if lipid control essential.\n\n• **Pregnancy Management**: Monitor lipid levels but avoid aggressive treatment. Physiological cholesterol increase occurs normally in pregnancy. Focus on dietary modification, omega-3 supplementation, and cardiovascular risk factor optimization (BP, diabetes screening).\n\n• **Alternative Therapies**: Ezetimibe contraindicated (limited safety data). Bile acid sequestrants (cholestyramine/colesevelam) considered safer due to minimal systemic absorption, though may affect fat-soluble vitamin absorption requiring supplementation.\n\n• **Postpartum Care**: Resume statin therapy post-delivery if not breastfeeding. If breastfeeding planned, continue dietary measures and consider specialist lipid clinic referral for complex cases requiring alternative strategies.\n\n• **Family Screening**: Cascade screening essential - test first-degree relatives. Genetic counseling recommended for reproductive planning. Children of affected parents have 50% inheritance risk.\n\n• **Long-term Monitoring**: Annual cardiovascular risk assessment, imaging for atherosclerosis progression, and optimization of other modifiable risk factors throughout reproductive years."
          },
          links: {
            primary: {
              title: "UK Guidance",
              url: "https://www.nice.org.uk/guidance/cg181",
              description: "NICE CG181: Familial hypercholesterolaemia - identification and management"
            },
            supplementary: [
              {
                title: "CKS FH Management",
                url: "https://cks.nice.org.uk/topics/familial-hypercholesterolaemia/",
                description: "Clinical Knowledge Summaries - comprehensive FH guidance"
              },
              {
                title: "ESC Dyslipidaemia Guidelines",
                url: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/ESC-EAS-Guidelines-for-the-management-of-dyslipidaemias",
                description: "European Society of Cardiology - lipid management protocols"
              },
              {
                title: "RCOG Pregnancy Guidelines",
                url: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/",
                description: "Royal College of Obstetricians - pregnancy and medication guidance"
              },
              {
                title: "BCS Lipid Guidelines",
                url: "https://www.britishcardiovascularsociety.org/resources/guidelines",
                description: "British Cardiovascular Society - specialist lipid management"
              }
            ]
          }
        },
        {
          id: "q7",
          category: "Cardiovascular",
          topic: "Hypertension Management in Adults >55",
          question: "A 58-year-old man is diagnosed with stage 1 hypertension (BP 148/96 mmHg). He has no diabetes, and his QRISK3 score is 12%. What is the most appropriate first-line antihypertensive therapy?",
          options: {
            A: "ACE inhibitor",
            B: "Beta-blocker",
            C: "Calcium-channel blocker",
            D: "Thiazide diuretic",
            E: "Alpha-blocker"
          },
          answer: "C",
          explanation: {
            A: "Incorrect. ACE inhibitors are first-line for patients under 55 or those with diabetes.",
            B: "Incorrect. Beta-blockers are not recommended first-line unless another indication exists.",
            C: "Correct. NICE recommends a calcium-channel blocker first-line in people over 55 years old or of Black African or Caribbean descent.",
            D: "Incorrect. Thiazides are used second-line if CCBs are not tolerated.",
            E: "Incorrect. Alpha-blockers are typically fourth-line options."
          },
          mnemonic: "ABC for BP: ACE if <55, Black/old → CCB",
          links: {
            NICE: "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations#choosing-antihypertensive-drug-treatment",
            CKS: "https://cks.nice.org.uk/topics/hypertension/management/initial-treatment/",
            BNF: "https://bnf.nice.org.uk/treatment-summary/hypertension/"
          }
        },
        {
          id: "q8",
          category: "Cardiovascular",
          topic: "Atrial Fibrillation – Anticoagulation",
          question: "A 75-year-old man with newly diagnosed atrial fibrillation has a CHA2DS2-VASc score of 3. He has no contraindications to anticoagulation. What is the most appropriate next step?",
          options: {
            A: "Start aspirin 75 mg",
            B: "Start warfarin and target INR 2-3",
            C: "Start apixaban 5 mg twice daily",
            D: "Cardioversion",
            E: "No treatment required"
          },
          answer: "C",
          explanation: {
            A: "Incorrect. Aspirin is no longer recommended for stroke prevention in AF.",
            B: "Incorrect. Warfarin is acceptable but DOACs are preferred unless contraindicated.",
            C: "Correct. NICE recommends a DOAC (e.g., apixaban) for stroke prevention in eligible AF patients with CHA2DS2-VASc ≥2.",
            D: "Incorrect. Cardioversion may be considered but stroke risk must be managed first.",
            E: "Incorrect. Stroke risk is high and must be addressed with anticoagulation."
          },
          mnemonic: "CHAD VASc ≥2? → Anticoagulate with DOAC",
          links: {
            NICE: "https://www.nice.org.uk/guidance/ng196/chapter/Recommendations#stroke-risk-assessment-and-antithrombotic-therapy",
            CKS: "https://cks.nice.org.uk/topics/atrial-fibrillation/management/oral-anticoagulation/",
            BNF: "https://bnf.nice.org.uk/drug/apixaban.html"
          }
        }
      ];

      const { questionId } = req.query;
      
      if (questionId) {
        const question = testQuestions.find(q => q.id === questionId);
        if (!question) {
          return res.status(404).json({ error: "Question not found" });
        }
        return res.json(question);
      }

      // Return the actual questions from generated question bank or fallback to test questions
      // Apply category filtering
      let filteredQuestions = ukQuestionBank.length > 0 ? ukQuestionBank : testQuestions;
      
      if (category && category !== 'all') {
        filteredQuestions = (ukQuestionBank.length > 0 ? ukQuestionBank : testQuestions).filter(q => {
          const questionCategory = q.category?.toLowerCase() || q.topic?.toLowerCase() || '';
          const requestedCategory = (category as string).toLowerCase();
          
          // Handle different category matching patterns
          if (requestedCategory === 'dermatology') {
            return questionCategory.includes('dermatology') || questionCategory.includes('skin') || questionCategory.includes('rash');
          }
          if (requestedCategory === 'cardiovascular') {
            return questionCategory.includes('cardiovascular') || questionCategory.includes('cardio') || questionCategory.includes('heart');
          }
          if (requestedCategory === 'respiratory') {
            return questionCategory.includes('respiratory') || questionCategory.includes('lung') || questionCategory.includes('asthma');
          }
          if (requestedCategory === 'gastroenterology') {
            return questionCategory.includes('gastro') || questionCategory.includes('bowel') || questionCategory.includes('liver');
          }
          if (requestedCategory === 'neurology') {
            return questionCategory.includes('neuro') || questionCategory.includes('brain') || questionCategory.includes('stroke');
          }
          if (requestedCategory === 'endocrinology') {
            return questionCategory.includes('endocrin') || questionCategory.includes('diabetes') || questionCategory.includes('thyroid');
          }
          if (requestedCategory === 'psychiatry') {
            return questionCategory.includes('psychiatr') || questionCategory.includes('mental') || questionCategory.includes('depression');
          }
          if (requestedCategory === 'obstetrics-gynaecology') {
            return questionCategory.includes('obstetric') || questionCategory.includes('gynae') || questionCategory.includes('pregnancy');
          }
          if (requestedCategory === 'paediatrics') {
            return questionCategory.includes('paediatric') || questionCategory.includes('child') || questionCategory.includes('infant');
          }
          if (requestedCategory === 'surgery') {
            return questionCategory.includes('surgery') || questionCategory.includes('surgical') || questionCategory.includes('operation');
          }
          if (requestedCategory === 'emergency-medicine') {
            return questionCategory.includes('emergency') || questionCategory.includes('acute') || questionCategory.includes('trauma');
          }
          
          // Default exact match
          return questionCategory.includes(requestedCategory);
        });
        
        // If no questions found for the specific category, generate sample questions
        if (filteredQuestions.length === 0) {
          const sampleQuestions = getSampleQuestionsForCategory(category as string, requestedCount);
          console.log(`No existing questions for "${category}", generated ${sampleQuestions.length} sample questions`);
          return res.json(sampleQuestions);
        }
      }

      // Apply difficulty filtering (if needed in future)
      if (difficulty && difficulty !== 'all') {
        // Most test questions don't have difficulty, so keep all for now
      }

      // Limit to requested count
      let finalQuestions = filteredQuestions.slice(0, requestedCount);

      // Transform questions to ensure answer is the TEXT not numeric index
      finalQuestions = finalQuestions.map(q => {
        if (typeof q.answer === 'number' && Array.isArray(q.options)) {
          // Convert numeric answer index to the actual option text
          return {
            ...q,
            answer: q.options[q.answer] || q.options[0]
          };
        }
        return q;
      });

      console.log(`Filtered questions: ${filteredQuestions.length} found for category "${category}", returning ${finalQuestions.length}`);

      res.json(finalQuestions);
    } catch (error) {
      console.error('Error fetching test questions:', error);
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  // Performance tracking endpoint
  app.get('/api/performance-stats', (req, res) => {
    res.json({
      questionBank: 8, // Updated count for 8 test questions
      totalAttempts: 0,
      averageScore: 0,
      aiStatus: getAIStatus()
    });
  });

  // Basic endpoints for static content
  app.get('/api/question-bank', (req, res) => {
    res.json({
      questions: [],
      total: 0,
      message: "Question generation suspended - AI services offline"
    });
  });

  // User Format Stations endpoints
  app.get('/api/user-format/stations', (req, res) => {
    const stations = loadUserFormatStations();
    res.json(stations);
  });

  app.post('/api/generate-user-format-3000-stations', async (req, res) => {
    if (!isAIEnabled()) {
      return res.status(503).json({ 
        error: "AI services unavailable", 
        message: getAIStatus()
      });
    }

    try {
      const currentCount = getUserFormatStationCount();
      const targetCount = 3000;
      const remaining = targetCount - currentCount;
      
      if (remaining <= 0) {
        return res.json({ 
          success: true, 
          message: `Target achieved! ${currentCount} stations available`,
          totalStations: currentCount 
        });
      }
      
      console.log(`Generating user format stations: ${remaining} remaining toward ${targetCount} target`);
      
      const batchSize = 5;
      const stations = await generateUserFormatStations(Math.min(batchSize, remaining));
      
      if (stations.length > 0) {
        const totalStations = saveUserFormatStations(stations);
        console.log(`Generated ${stations.length} user format stations (Total: ${totalStations}/${targetCount})`);
        
        res.json({ 
          success: true, 
          generated: stations.length,
          totalStations,
          remaining: Math.max(0, targetCount - totalStations),
          targetReached: totalStations >= targetCount
        });
      } else {
        res.json({ success: false, error: 'No stations generated' });
      }
    } catch (error) {
      console.error('Error generating user format stations:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/user-format/status', (req, res) => {
    const totalStations = getUserFormatStationCount();
    const targetCount = 3000;
    const remaining = Math.max(0, targetCount - totalStations);
    
    res.json({
      totalStations,
      targetCount,
      remaining,
      percentComplete: Math.round((totalStations / targetCount) * 100),
      targetReached: totalStations >= targetCount
    });
  });

  // International Medical Exam endpoints
  app.get('/api/international/exams', (req, res) => {
    const supportedExams = getSupportedExams();
    const examStats = supportedExams.map(examType => ({
      examType,
      totalStations: getInternationalStationCount(examType),
      stations: loadInternationalStations(examType)
    }));
    res.json(examStats);
  });

  app.get('/api/international/:examType/stations', (req, res) => {
    const { examType } = req.params;
    const stations = loadInternationalStations(examType.toUpperCase());
    res.json(stations);
  });

  app.post('/api/generate-international-stations', async (req, res) => {
    if (!isAIEnabled()) {
      return res.status(503).json({ 
        error: "AI services unavailable", 
        message: getAIStatus()
      });
    }

    try {
      const { examType, targetCount = 1000 } = req.body;
      
      if (!getSupportedExams().includes(examType)) {
        return res.status(400).json({ error: `Unsupported exam type: ${examType}` });
      }

      const currentCount = getInternationalStationCount(examType);
      const remaining = targetCount - currentCount;
      
      if (remaining <= 0) {
        return res.json({ 
          success: true, 
          message: `Target achieved! ${currentCount} ${examType} stations available`,
          totalStations: currentCount 
        });
      }
      
      console.log(`Generating ${examType} stations: ${remaining} remaining toward ${targetCount} target`);
      
      const batchSize = 5;
      const stations = await generateInternationalStations(examType, Math.min(batchSize, remaining));
      
      if (stations.length > 0) {
        const totalStations = saveInternationalStations(examType, stations);
        console.log(`Generated ${stations.length} ${examType} stations (Total: ${totalStations}/${targetCount})`);
        
        res.json({ 
          success: true, 
          examType,
          generated: stations.length,
          totalStations,
          remaining: Math.max(0, targetCount - totalStations),
          targetReached: totalStations >= targetCount
        });
      } else {
        res.json({ success: false, error: 'No stations generated' });
      }
    } catch (error) {
      console.error('Error generating international stations:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/international/:examType/status', (req, res) => {
    const { examType } = req.params;
    const totalStations = getInternationalStationCount(examType.toUpperCase());
    const targetCount = 1000;
    const remaining = Math.max(0, targetCount - totalStations);
    
    res.json({
      examType: examType.toUpperCase(),
      totalStations,
      targetCount,
      remaining,
      percentComplete: Math.round((totalStations / targetCount) * 100),
      targetReached: totalStations >= targetCount
    });
  });

  // Content Independence API
  app.get('/api/content/independence-status', (req, res) => {
    try {
      const stats = getContentIndependenceStatus();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get content independence status' });
    }
  });

  app.post('/api/content/manual-station', (req, res) => {
    try {
      const { examType, stationData } = req.body;
      
      if (!examType || !stationData) {
        return res.status(400).json({ error: 'examType and stationData required' });
      }

      const success = createManualStation(examType, stationData);
      
      if (success) {
        res.json({ 
          success: true, 
          message: `Manual station added to ${examType}`,
          stationId: stationData.id
        });
      } else {
        res.status(500).json({ error: 'Failed to create manual station' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const handleContentExport = (req: any, res: any) => {
    try {
      const examType = req.params.examType;
      const content = exportContentLibrary(examType?.toUpperCase());
      res.json({
        examType: examType || 'ALL',
        totalStations: content.length,
        content,
        exportedAt: new Date().toISOString(),
        aiDependency: 'none'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to export content library' });
    }
  };
  app.get('/api/content/export', handleContentExport);
  app.get('/api/content/export/:examType', handleContentExport);

  app.get('/api/content/sufficiency/:examType', (req, res) => {
    try {
      const { examType } = req.params;
      const { minimumStations = 500 } = req.query;
      
      const validation = validateContentSufficiency(
        examType.toUpperCase(), 
        parseInt(minimumStations as string)
      );
      
      res.json(validation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to validate content sufficiency' });
    }
  });

  // Translation System API
  app.get('/api/translations/supported-languages', (req, res) => {
    res.json({
      languages: SUPPORTED_LANGUAGES,
      totalCount: Object.keys(SUPPORTED_LANGUAGES).length,
      culturalAdaptations: CULTURAL_ADAPTATIONS
    });
  });

  app.get('/api/translations/stats', (req, res) => {
    try {
      const stats = getTranslationStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get translation stats' });
    }
  });

  app.get('/api/translations/:examType/:language', (req, res) => {
    try {
      const { examType, language } = req.params;
      const translations = loadTranslations(examType.toUpperCase(), language);
      res.json({
        examType: examType.toUpperCase(),
        language,
        translations,
        count: translations.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load translations' });
    }
  });

  app.post('/api/translations/:examType/:language', (req, res) => {
    try {
      const { examType, language } = req.params;
      const { translationData } = req.body;
      
      if (!translationData) {
        return res.status(400).json({ error: 'Translation data required' });
      }

      const success = saveTranslation(examType.toUpperCase(), language, translationData);
      
      if (success) {
        res.json({ 
          success: true, 
          message: `Translation saved for ${examType} in ${language}`,
          translationId: translationData.id
        });
      } else {
        res.status(500).json({ error: 'Failed to save translation' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/translations/template', (req, res) => {
    try {
      const template = getTranslationTemplate();
      res.json({
        template,
        manifest: createTranslationManifest()
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get translation template' });
    }
  });

  app.get('/api/translations/manifest', (req, res) => {
    try {
      const manifest = createTranslationManifest();
      res.json(manifest);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get translation manifest' });
    }
  });

  // Independent Translation API (No external dependencies)
  app.get('/api/independent-translations/stats', (req, res) => {
    try {
      const stats = getIndependentTranslationStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get independent translation stats' });
    }
  });

  app.post('/api/independent-translations/translate', (req, res) => {
    try {
      const { stationData, targetLanguages = ['ar', 'zh', 'hi', 'es', 'fr'] } = req.body;
      
      if (!stationData) {
        return res.status(400).json({ error: 'Station data required' });
      }

      // Translate to multiple languages independently
      const translations = [];
      for (const language of targetLanguages) {
        const translated = translateStationIndependently(stationData, language);
        translations.push(translated);
      }
      
      res.json({ 
        success: true, 
        translations,
        translatedLanguages: targetLanguages,
        method: 'independent_dictionary',
        aiDependency: 'none'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/independent-translations/batch', (req, res) => {
    try {
      const { examType, targetLanguages = ['ar', 'zh', 'hi', 'es', 'fr'] } = req.body;
      
      // Load stations for the exam type
      let stations = [];
      if (examType === 'PLAB2') {
        stations = loadUserFormatStations();
      } else {
        stations = loadInternationalStations(examType);
      }
      
      if (stations.length === 0) {
        return res.status(404).json({ error: `No stations found for ${examType}` });
      }

      // Translate first 10 stations as sample
      const sampleStations = stations.slice(0, 10);
      const translations = batchTranslateStations(sampleStations, targetLanguages);
      
      // Save translations
      const saved = saveIndependentTranslations(examType, translations);
      
      res.json({ 
        success: saved, 
        examType,
        stationsTranslated: sampleStations.length,
        languagesCreated: targetLanguages.length,
        totalTranslations: translations.length,
        method: 'independent_dictionary',
        aiDependency: 'none'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/independent-translations/dictionary', (req, res) => {
    try {
      res.json({
        medicalDictionary: MEDICAL_TERMINOLOGY_DICTIONARY,
        supportedLanguagePairs: Object.keys(MEDICAL_TERMINOLOGY_DICTIONARY),
        totalTerms: Object.values(MEDICAL_TERMINOLOGY_DICTIONARY).reduce((total, dict) => total + Object.keys(dict).length, 0),
        independentCapability: true,
        offlineReady: true
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get dictionary' });
    }
  });

  // Independent Analysis API (Replaces all AI-powered analysis)
  app.post('/api/independent-analysis/video', (req, res) => {
    try {
      const { stationTitle, stationCategory, learningObjectives = [], recordingDuration = 480 } = req.body;
      
      const analysis = analyzeVideoPerformanceIndependently(
        stationTitle || 'Clinical Station',
        stationCategory || 'General',
        learningObjectives,
        recordingDuration
      );
      
      res.json({
        ...analysis,
        method: 'structured_assessment',
        aiDependency: 'none',
        assessmentStandard: 'PLAB_2_criteria'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to analyze performance' });
    }
  });

  app.post('/api/independent-analysis/feedback', (req, res) => {
    try {
      const { topic, userResponse } = req.body;
      
      const feedback = generateIndependentFeedback(topic || 'medical scenario', userResponse || '');
      
      res.json({
        feedback,
        method: 'template_based',
        aiDependency: 'none'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate feedback' });
    }
  });

  app.post('/api/independent-analysis/image', (req, res) => {
    try {
      const { imagePath, context } = req.body;
      
      const analysis = analyzeImageIndependently(imagePath || '', context || '');
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: 'Failed to analyze image' });
    }
  });

  app.get('/api/independence/complete-status', (req, res) => {
    try {
      const system = exportCompleteIndependentSystem();
      const alternatives = createIndependentAlternatives();
      const hybridStatus = hybridAI.getSystemStatus();
      
      res.json({
        ...system,
        independentFeatures: alternatives,
        hybridCapabilities: hybridStatus,
        aiReplacement: {
          questionGeneration: 'template_based_only', // Never AI
          videoAnalysis: 'hybrid_with_fallback', 
          translation: 'dictionary_based_only', // Never AI
          imageAnalysis: 'structured_observation',
          feedback: 'hybrid_with_fallback',
          guidance: 'hybrid_with_fallback'
        },
        questionBankPolicy: 'no_ai_ever',
        completeDependency: 'optional_ai_enhancement',
        offlineCapable: true
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get complete independence status' });
    }
  });

  // Hybrid AI Configuration
  app.get('/api/hybrid/status', (req, res) => {
    try {
      const status = hybridAI.getSystemStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get hybrid status' });
    }
  });

  app.post('/api/hybrid/config', (req, res) => {
    try {
      const { useAI, fallbackToIndependent, aiProvider } = req.body;
      
      hybridAI.updateConfig({
        useAI: useAI !== undefined ? useAI : true,
        fallbackToIndependent: fallbackToIndependent !== undefined ? fallbackToIndependent : true,
        aiProvider: aiProvider || 'openai'
      });
      
      res.json({ 
        success: true, 
        message: 'Hybrid AI configuration updated',
        status: hybridAI.getSystemStatus()
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update hybrid config' });
    }
  });

  // Enhanced AI-powered endpoints (when AI is available)
  app.post('/api/hybrid/video-analysis', async (req, res) => {
    try {
      const { stationTitle, stationCategory, learningObjectives = [], recordingDuration = 480, useAI = true } = req.body;
      
      const analysis = await hybridAI.analyzeVideo(
        stationTitle || 'Clinical Station',
        stationCategory || 'General',
        learningObjectives,
        recordingDuration,
        useAI
      );
      
      res.json({
        ...analysis,
        method: hybridAI.getSystemStatus().aiAvailable && useAI ? 'ai_enhanced' : 'independent_structured',
        fallbackUsed: !hybridAI.getSystemStatus().aiAvailable && useAI
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to analyze video' });
    }
  });

  app.post('/api/hybrid/feedback', async (req, res) => {
    try {
      const { topic, userResponse, useAI = true } = req.body;
      
      const feedback = await hybridAI.generateFeedback(
        topic || 'medical scenario', 
        userResponse || '',
        useAI
      );
      
      res.json({
        feedback,
        method: hybridAI.getSystemStatus().aiAvailable && useAI ? 'ai_enhanced' : 'template_based',
        fallbackUsed: !hybridAI.getSystemStatus().aiAvailable && useAI
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate feedback' });
    }
  });

  // =====================================================
  // GAMIFICATION API ROUTES
  // =====================================================

  app.get('/api/gamification/user-stats/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId) || 1;
      const stats = await getGamificationStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Failed to get gamification stats:', error);
      res.status(500).json({ error: 'Failed to get gamification stats' });
    }
  });

  app.get('/api/gamification/badges', async (req, res) => {
    try {
      const { BADGE_DEFINITIONS, BADGE_CATEGORIES } = await import('@shared/gamification');
      res.json({ badges: BADGE_DEFINITIONS, categories: BADGE_CATEGORIES });
    } catch (error) {
      console.error('Failed to get badges:', error);
      res.status(500).json({ error: 'Failed to get badges' });
    }
  });

  app.get('/api/gamification/user-badges/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId) || 1;
      const achievements = await storage.getUserAchievements(userId);
      res.json({ achievements });
    } catch (error) {
      console.error('Failed to get user badges:', error);
      res.status(500).json({ error: 'Failed to get user badges' });
    }
  });

  app.post('/api/gamification/award-points', async (req, res) => {
    try {
      const { userId, points, reason, sessionData } = req.body;
      const result = await awardPointsAndCheckAchievements(userId || 1, points, reason, sessionData);
      res.json(result);
    } catch (error) {
      console.error('Failed to award points:', error);
      res.status(500).json({ error: 'Failed to award points' });
    }
  });

  app.get('/api/gamification/leaderboard', async (req, res) => {
    try {
      const { period, category, limit } = req.query;
      const leaderboard = await getLeaderboard(
        period as string || 'all-time',
        category as string || 'all',
        parseInt(limit as string) || 10
      );
      res.json({ leaderboard });
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      res.status(500).json({ error: 'Failed to get leaderboard' });
    }
  });

  app.get('/api/gamification/levels', async (req, res) => {
    try {
      const { LEVEL_THRESHOLDS } = await import('@shared/gamification');
      res.json({ levels: LEVEL_THRESHOLDS });
    } catch (error) {
      console.error('Failed to get levels:', error);
      res.status(500).json({ error: 'Failed to get levels' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Periodic cleanup
setInterval(cleanupOldSessions, 5 * 60 * 1000); // Every 5 minutes