// Unified Adaptive AI Engine - Integrates all AI features without external API calls
// Combines adaptive learning, weakness detection, performance prediction, and smart generation

import { AdaptiveLearningEngine, type UserPerformance, type AdaptiveRecommendation } from '@shared/adaptive-learning';
import { WeaknessDetectionEngine, type WeaknessAnalysis, type WeaknessPattern } from '@shared/weakness-detection';
import { PerformancePredictionEngine, type ExamPrediction, type StudyMetrics } from '@shared/performance-prediction';
import { SmartQuestionGenerator, type GeneratedQuestion, type GenerationRequest } from '@shared/smart-question-generation';

export interface UserSession {
  userId: number;
  sessionId: string;
  startTime: Date;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  performance: UserPerformance[];
  lastWeaknessAnalysis: WeaknessAnalysis | null;
  lastPrediction: ExamPrediction | null;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  answeredAt: Date;
  question: {
    category?: string;
    topic?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    explanation?: string;
    correctAnswer: string;
    options: string[];
  };
}

export interface AdaptiveResponse {
  nextQuestions: any[];
  adaptiveInsights: {
    recommendation: AdaptiveRecommendation;
    weaknessAnalysis: WeaknessAnalysis;
    examPrediction: ExamPrediction;
    realTimeGuidance: string;
  };
  generatedQuestions?: GeneratedQuestion[];
  sessionStats: {
    questionsAnswered: number;
    currentAccuracy: number;
    sessionDuration: number;
    topicsExplored: string[];
  };
}

export class AdaptiveAIEngine {
  private static sessions: Map<string, UserSession> = new Map();
  private static questionBank: any[] = [];
  private static initialized = false;

  /**
   * Initialize the adaptive AI engine with question bank
   */
  static initialize(questions: any[]) {
    this.questionBank = questions;
    SmartQuestionGenerator.initialize(questions);
    this.initialized = true;
    console.log(`Adaptive AI Engine initialized with ${questions.length} questions`);
  }

  /**
   * Starts a new adaptive learning session
   */
  static startSession(userId: number, existingPerformance: UserPerformance[] = []): string {
    const sessionId = `session_${userId}_${Date.now()}`;
    
    const session: UserSession = {
      userId,
      sessionId,
      startTime: new Date(),
      currentQuestionIndex: 0,
      answers: [],
      performance: existingPerformance,
      lastWeaknessAnalysis: null,
      lastPrediction: null
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * Processes user answer and provides adaptive response
   */
  static processAnswer(
    sessionId: string,
    questionId: string,
    selectedAnswer: string,
    timeSpent: number
  ): AdaptiveResponse {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const question = this.questionBank.find(q => q.id === questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    
    // Record the answer
    const userAnswer: UserAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent,
      answeredAt: new Date(),
      question: {
        category: question.category,
        topic: question.topic,
        difficulty: question.difficulty,
        explanation: question.explanation,
        correctAnswer: question.correctAnswer,
        options: question.options
      }
    };

    session.answers.push(userAnswer);
    session.currentQuestionIndex++;

    // Update performance data
    const topic = question.category || question.topic || 'General';
    const difficulty = question.difficulty || 'medium';
    
    session.performance = AdaptiveLearningEngine.updatePerformance(
      session.performance,
      session.userId,
      topic,
      difficulty as 'easy' | 'medium' | 'hard',
      isCorrect,
      timeSpent
    );

    // Generate adaptive insights
    const adaptiveInsights = this.generateAdaptiveInsights(session);
    
    // Get next questions based on adaptive recommendations
    const nextQuestions = this.getAdaptiveNextQuestions(session, adaptiveInsights.recommendation);
    
    // Generate targeted questions if needed
    let generatedQuestions: GeneratedQuestion[] | undefined;
    if (adaptiveInsights.weaknessAnalysis.criticalWeaknesses.length > 0) {
      generatedQuestions = this.generateTargetedQuestions(session, adaptiveInsights.weaknessAnalysis);
    }

    // Calculate session stats
    const sessionStats = this.calculateSessionStats(session);

    // Update session
    session.lastWeaknessAnalysis = adaptiveInsights.weaknessAnalysis;
    session.lastPrediction = adaptiveInsights.examPrediction;
    this.sessions.set(sessionId, session);

    return {
      nextQuestions,
      adaptiveInsights,
      generatedQuestions,
      sessionStats
    };
  }

  /**
   * Generates comprehensive adaptive insights
   */
  private static generateAdaptiveInsights(session: UserSession): AdaptiveResponse['adaptiveInsights'] {
    const recommendation = AdaptiveLearningEngine.generateRecommendations(session.performance);
    const weaknessAnalysis = WeaknessDetectionEngine.analyzeWeaknesses(session.answers);
    
    // Prepare study metrics for prediction
    const studyMetrics = this.prepareStudyMetrics(session);
    const examPrediction = PerformancePredictionEngine.predictExamSuccess(studyMetrics, session.answers);
    
    // Generate real-time guidance
    const realTimeGuidance = this.generateRealTimeGuidance(session, recommendation, weaknessAnalysis, examPrediction);

    return {
      recommendation,
      weaknessAnalysis,
      examPrediction,
      realTimeGuidance
    };
  }

  /**
   * Prepares study metrics for performance prediction
   */
  private static prepareStudyMetrics(session: UserSession): StudyMetrics {
    const correctAnswers = session.answers.filter(a => a.isCorrect).length;
    const totalTime = session.answers.reduce((sum, a) => sum + a.timeSpent, 0);
    const avgSessionLength = totalTime / Math.max(1, session.answers.length);
    
    const topicsCovered = [...new Set(session.answers.map(a => 
      a.question.category || a.question.topic || 'General'
    ))];
    
    const difficultyDistribution = session.answers.reduce((dist, answer) => {
      const difficulty = answer.question.difficulty || 'medium';
      dist[difficulty as keyof typeof dist]++;
      return dist;
    }, { easy: 0, medium: 0, hard: 0 });

    // Calculate recent performance (last 10 sessions approximated)
    const recentAnswers = session.answers.slice(-10);
    const recentPerformance = recentAnswers.length > 0 ? 
      [recentAnswers.filter(a => a.isCorrect).length / recentAnswers.length] : [0];

    return {
      totalQuestions: session.answers.length,
      correctAnswers,
      studyDays: Math.max(1, Math.ceil((Date.now() - session.startTime.getTime()) / (24 * 60 * 60 * 1000))),
      averageSessionLength: avgSessionLength,
      topicsCovered,
      difficultyDistribution,
      recentPerformance
    };
  }

  /**
   * Gets next questions based on adaptive recommendations
   */
  private static getAdaptiveNextQuestions(session: UserSession, recommendation: AdaptiveRecommendation): any[] {
    const recentQuestionIds = session.answers.slice(-10).map(a => a.questionId);
    
    // Filter questions based on adaptive recommendations
    const filtered = AdaptiveLearningEngine.filterQuestions(
      this.questionBank,
      recommendation,
      recentQuestionIds
    );

    // Select questions with variety
    const selected = filtered
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, Math.min(5, recommendation.recommendedQuestions));

    return selected.length > 0 ? selected : this.questionBank.slice(0, 5);
  }

  /**
   * Generates targeted questions for weak areas
   */
  private static generateTargetedQuestions(session: UserSession, analysis: WeaknessAnalysis): GeneratedQuestion[] {
    if (analysis.criticalWeaknesses.length === 0) return [];

    const request: GenerationRequest = {
      targetTopics: analysis.criticalWeaknesses.slice(0, 2).map(w => w.topic),
      difficulty: 'medium', // Start with medium difficulty for weak areas
      weaknessAreas: analysis.criticalWeaknesses.map(w => w.topic),
      questionCount: 3,
      avoidRecentIds: session.answers.slice(-20).map(a => a.questionId)
    };

    return SmartQuestionGenerator.generateTargetedQuestions(request);
  }

  /**
   * Generates real-time guidance for the user
   */
  private static generateRealTimeGuidance(
    session: UserSession,
    recommendation: AdaptiveRecommendation,
    analysis: WeaknessAnalysis,
    prediction: ExamPrediction
  ): string {
    const recentAccuracy = session.answers.length > 0 ? 
      session.answers.slice(-5).filter(a => a.isCorrect).length / Math.min(5, session.answers.length) : 0;

    // Priority guidance based on current state
    if (analysis.criticalWeaknesses.length > 0) {
      const weakness = analysis.criticalWeaknesses[0];
      return `Focus on ${weakness.topic} - you've answered ${weakness.questionsAttempted} questions with ${Math.round(100 - weakness.weaknessScore)}% accuracy. Consider reviewing fundamentals before continuing.`;
    }

    if (recentAccuracy < 0.6) {
      return `Your recent accuracy is ${Math.round(recentAccuracy * 100)}%. Consider slowing down and reviewing explanations more carefully.`;
    }

    if (recentAccuracy > 0.85 && recommendation.nextDifficulty === 'easy') {
      return `Excellent work! Your accuracy is ${Math.round(recentAccuracy * 100)}%. Ready to try medium difficulty questions?`;
    }

    if (prediction.successProbability < 60) {
      return `Current exam readiness: ${prediction.successProbability}%. Focus on ${prediction.keyImprovementAreas[0]} to improve your chances.`;
    }

    if (prediction.successProbability > 85) {
      return `You're performing excellently! Current exam readiness: ${prediction.successProbability}%. Consider practicing harder questions to maintain your edge.`;
    }

    return `Keep up the good work! Current accuracy: ${Math.round(recentAccuracy * 100)}%. ${recommendation.focusTopics.length > 0 ? `Consider practicing ${recommendation.focusTopics[0]} next.` : ''}`;
  }

  /**
   * Calculates session statistics
   */
  private static calculateSessionStats(session: UserSession): AdaptiveResponse['sessionStats'] {
    const correctAnswers = session.answers.filter(a => a.isCorrect).length;
    const sessionDuration = Date.now() - session.startTime.getTime();
    const topicsExplored = [...new Set(session.answers.map(a => 
      a.question.category || a.question.topic || 'General'
    ))];

    return {
      questionsAnswered: session.answers.length,
      currentAccuracy: session.answers.length > 0 ? correctAnswers / session.answers.length : 0,
      sessionDuration: Math.round(sessionDuration / 1000), // in seconds
      topicsExplored
    };
  }

  /**
   * Gets comprehensive user analytics
   */
  static getUserAnalytics(userId: number): {
    overallPerformance: UserPerformance[];
    weaknessAnalysis: WeaknessAnalysis | null;
    examPrediction: ExamPrediction | null;
    adaptiveRecommendations: AdaptiveRecommendation | null;
    sessionHistory: any[];
  } {
    const userSessions = Array.from(this.sessions.values()).filter(s => s.userId === userId);
    
    if (userSessions.length === 0) {
      return {
        overallPerformance: [],
        weaknessAnalysis: null,
        examPrediction: null,
        adaptiveRecommendations: null,
        sessionHistory: []
      };
    }

    // Combine performance from all sessions
    const overallPerformance = userSessions.reduce((combined, session) => {
      return [...combined, ...session.performance];
    }, [] as UserPerformance[]);

    // Get latest analysis from most recent session
    const latestSession = userSessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0];
    
    return {
      overallPerformance,
      weaknessAnalysis: latestSession.lastWeaknessAnalysis,
      examPrediction: latestSession.lastPrediction,
      adaptiveRecommendations: AdaptiveLearningEngine.generateRecommendations(overallPerformance),
      sessionHistory: userSessions.map(s => ({
        sessionId: s.sessionId,
        startTime: s.startTime,
        questionsAnswered: s.answers.length,
        accuracy: s.answers.length > 0 ? s.answers.filter(a => a.isCorrect).length / s.answers.length : 0,
        duration: Date.now() - s.startTime.getTime(),
        topicsExplored: [...new Set(s.answers.map(a => a.question.category || a.question.topic))]
      }))
    };
  }

  /**
   * Gets real-time weakness check during quiz
   */
  static getRealTimeWeaknessCheck(sessionId: string, currentAnswer: UserAnswer): {
    isWeakArea: boolean;
    confidenceLevel: 'low' | 'medium' | 'high';
    suggestion: string;
  } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return {
        isWeakArea: false,
        confidenceLevel: 'medium',
        suggestion: 'Continue practicing'
      };
    }

    return WeaknessDetectionEngine.checkRealTimeWeakness(currentAnswer, session.answers);
  }

  /**
   * Cleanup old sessions (call periodically)
   */
  static cleanupOldSessions(maxAgeHours: number = 24) {
    const cutoff = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.startTime.getTime() < cutoff) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * Gets engine statistics
   */
  static getEngineStats() {
    return {
      initialized: this.initialized,
      activeSessions: this.sessions.size,
      questionBankSize: this.questionBank.length,
      generationStats: SmartQuestionGenerator.getGenerationStats()
    };
  }
}