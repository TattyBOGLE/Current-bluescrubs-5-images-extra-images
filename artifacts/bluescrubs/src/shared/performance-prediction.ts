// Performance Prediction Model - No external API calls
// ML algorithm that predicts exam success probability using statistical analysis

export interface PredictionFactors {
  accuracyTrend: number;
  studyConsistency: number;
  topicCoverage: number;
  difficultyProgression: number;
  timeManagement: number;
  weaknessImprovement: number;
}

export interface ExamPrediction {
  successProbability: number; // 0-100%
  readinessLevel: 'not-ready' | 'needs-work' | 'likely-ready' | 'highly-ready';
  timeToReadiness: number; // days
  keyImprovementAreas: string[];
  strengthAreas: string[];
  confidenceInterval: { min: number; max: number };
}

export interface StudyMetrics {
  totalQuestions: number;
  correctAnswers: number;
  studyDays: number;
  averageSessionLength: number;
  topicsCovered: string[];
  difficultyDistribution: { easy: number; medium: number; hard: number };
  recentPerformance: number[]; // Last 10 session accuracies
}

export class PerformancePredictionEngine {
  private static readonly MINIMUM_QUESTIONS = 50;
  private static readonly MINIMUM_TOPICS = 5;
  private static readonly OPTIMAL_ACCURACY = 0.85;
  private static readonly READINESS_THRESHOLDS = {
    'not-ready': 0.4,
    'needs-work': 0.6,
    'likely-ready': 0.8,
    'highly-ready': 0.9
  };

  /**
   * Predicts exam success probability based on user performance
   */
  static predictExamSuccess(metrics: StudyMetrics, userAnswers: any[]): ExamPrediction {
    if (metrics.totalQuestions < this.MINIMUM_QUESTIONS) {
      return this.getInsufficientDataPrediction();
    }

    const factors = this.calculatePredictionFactors(metrics, userAnswers);
    const successProbability = this.calculateSuccessProbability(factors);
    const readinessLevel = this.determineReadinessLevel(successProbability);
    const timeToReadiness = this.estimateTimeToReadiness(factors, successProbability);
    const keyImprovementAreas = this.identifyImprovementAreas(factors);
    const strengthAreas = this.identifyStrengthAreas(factors);
    const confidenceInterval = this.calculateConfidenceInterval(successProbability, metrics.totalQuestions);

    return {
      successProbability: Math.round(successProbability * 100),
      readinessLevel,
      timeToReadiness,
      keyImprovementAreas,
      strengthAreas,
      confidenceInterval: {
        min: Math.round(confidenceInterval.min * 100),
        max: Math.round(confidenceInterval.max * 100)
      }
    };
  }

  /**
   * Calculates key factors that influence exam success
   */
  private static calculatePredictionFactors(metrics: StudyMetrics, userAnswers: any[]): PredictionFactors {
    return {
      accuracyTrend: this.calculateAccuracyTrend(metrics.recentPerformance),
      studyConsistency: this.calculateStudyConsistency(userAnswers),
      topicCoverage: this.calculateTopicCoverage(metrics.topicsCovered),
      difficultyProgression: this.calculateDifficultyProgression(metrics.difficultyDistribution),
      timeManagement: this.calculateTimeManagement(userAnswers),
      weaknessImprovement: this.calculateWeaknessImprovement(userAnswers)
    };
  }

  /**
   * Calculates accuracy trend from recent performance
   */
  private static calculateAccuracyTrend(recentPerformance: number[]): number {
    if (recentPerformance.length < 3) return 0.5;

    const recent = recentPerformance.slice(-5);
    const earlier = recentPerformance.slice(0, -5);

    if (earlier.length === 0) return recent.reduce((a, b) => a + b, 0) / recent.length;

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;

    const improvement = (recentAvg - earlierAvg) + recentAvg;
    return Math.max(0, Math.min(1, improvement));
  }

  /**
   * Calculates study consistency score
   */
  private static calculateStudyConsistency(userAnswers: any[]): number {
    if (userAnswers.length < 7) return 0.5;

    const dates = userAnswers.map(a => new Date(a.answeredAt).toDateString());
    const uniqueDates = [...new Set(dates)];
    const daySpan = Math.max(1, uniqueDates.length);
    const questionsPerDay = userAnswers.length / daySpan;

    // Optimal range: 10-50 questions per day
    if (questionsPerDay >= 10 && questionsPerDay <= 50) return 1.0;
    if (questionsPerDay >= 5 && questionsPerDay < 10) return 0.8;
    if (questionsPerDay >= 2 && questionsPerDay < 5) return 0.6;
    return 0.4;
  }

  /**
   * Calculates topic coverage completeness
   */
  private static calculateTopicCoverage(topicsCovered: string[]): number {
    const essentialTopics = [
      'cardiology', 'respiratory', 'gastroenterology', 'neurology',
      'endocrinology', 'psychiatry', 'emergency', 'surgery',
      'pediatrics', 'obstetrics'
    ];

    const coveredEssential = essentialTopics.filter(topic => 
      topicsCovered.some(covered => 
        covered.toLowerCase().includes(topic.toLowerCase())
      )
    );

    return coveredEssential.length / essentialTopics.length;
  }

  /**
   * Calculates difficulty progression score
   */
  private static calculateDifficultyProgression(distribution: { easy: number; medium: number; hard: number }): number {
    const total = distribution.easy + distribution.medium + distribution.hard;
    if (total === 0) return 0;

    const easyRatio = distribution.easy / total;
    const mediumRatio = distribution.medium / total;
    const hardRatio = distribution.hard / total;

    // Optimal distribution: 30% easy, 50% medium, 20% hard
    const optimalScore = 1 - (
      Math.abs(easyRatio - 0.3) +
      Math.abs(mediumRatio - 0.5) +
      Math.abs(hardRatio - 0.2)
    ) / 2;

    return Math.max(0, optimalScore);
  }

  /**
   * Calculates time management efficiency
   */
  private static calculateTimeManagement(userAnswers: any[]): number {
    const answersWithTime = userAnswers.filter(a => a.timeSpent > 0);
    if (answersWithTime.length < 10) return 0.5;

    const avgTime = answersWithTime.reduce((sum, a) => sum + a.timeSpent, 0) / answersWithTime.length;
    
    // Optimal time: 60-120 seconds per question
    if (avgTime >= 60 && avgTime <= 120) return 1.0;
    if (avgTime >= 45 && avgTime < 60) return 0.8;
    if (avgTime >= 30 && avgTime < 45) return 0.6;
    return 0.4;
  }

  /**
   * Calculates weakness improvement trend
   */
  private static calculateWeaknessImprovement(userAnswers: any[]): number {
    if (userAnswers.length < 20) return 0.5;

    const firstQuarter = userAnswers.slice(0, Math.floor(userAnswers.length / 4));
    const lastQuarter = userAnswers.slice(-Math.floor(userAnswers.length / 4));

    const firstAccuracy = firstQuarter.filter(a => a.isCorrect).length / firstQuarter.length;
    const lastAccuracy = lastQuarter.filter(a => a.isCorrect).length / lastQuarter.length;

    const improvement = lastAccuracy - firstAccuracy;
    return Math.max(0, Math.min(1, 0.5 + improvement));
  }

  /**
   * Calculates overall success probability using weighted factors
   */
  private static calculateSuccessProbability(factors: PredictionFactors): number {
    const weights = {
      accuracyTrend: 0.25,
      studyConsistency: 0.15,
      topicCoverage: 0.20,
      difficultyProgression: 0.15,
      timeManagement: 0.10,
      weaknessImprovement: 0.15
    };

    return Object.entries(factors).reduce((probability, [factor, value]) => {
      return probability + value * weights[factor as keyof typeof weights];
    }, 0);
  }

  /**
   * Determines readiness level based on success probability
   */
  private static determineReadinessLevel(probability: number): ExamPrediction['readinessLevel'] {
    if (probability >= this.READINESS_THRESHOLDS['highly-ready']) return 'highly-ready';
    if (probability >= this.READINESS_THRESHOLDS['likely-ready']) return 'likely-ready';
    if (probability >= this.READINESS_THRESHOLDS['needs-work']) return 'needs-work';
    return 'not-ready';
  }

  /**
   * Estimates days needed to reach readiness
   */
  private static estimateTimeToReadiness(factors: PredictionFactors, currentProbability: number): number {
    if (currentProbability >= 0.8) return 0;

    const improvementNeeded = 0.8 - currentProbability;
    const currentImprovementRate = factors.weaknessImprovement - 0.5; // Baseline improvement
    
    if (currentImprovementRate <= 0) return 90; // Conservative estimate

    const daysNeeded = Math.ceil(improvementNeeded / (currentImprovementRate / 30));
    return Math.min(90, Math.max(7, daysNeeded));
  }

  /**
   * Identifies key areas needing improvement
   */
  private static identifyImprovementAreas(factors: PredictionFactors): string[] {
    const areas: Array<{ area: string; score: number }> = [
      { area: 'Accuracy Consistency', score: factors.accuracyTrend },
      { area: 'Study Regularity', score: factors.studyConsistency },
      { area: 'Topic Coverage', score: factors.topicCoverage },
      { area: 'Difficulty Progression', score: factors.difficultyProgression },
      { area: 'Time Management', score: factors.timeManagement },
      { area: 'Weakness Improvement', score: factors.weaknessImprovement }
    ];

    return areas
      .filter(area => area.score < 0.7)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map(area => area.area);
  }

  /**
   * Identifies strength areas
   */
  private static identifyStrengthAreas(factors: PredictionFactors): string[] {
    const areas: Array<{ area: string; score: number }> = [
      { area: 'Accuracy Trends', score: factors.accuracyTrend },
      { area: 'Study Habits', score: factors.studyConsistency },
      { area: 'Knowledge Breadth', score: factors.topicCoverage },
      { area: 'Challenge Level', score: factors.difficultyProgression },
      { area: 'Time Efficiency', score: factors.timeManagement },
      { area: 'Learning Progress', score: factors.weaknessImprovement }
    ];

    return areas
      .filter(area => area.score >= 0.8)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(area => area.area);
  }

  /**
   * Calculates confidence interval for prediction
   */
  private static calculateConfidenceInterval(probability: number, sampleSize: number): { min: number; max: number } {
    // Statistical confidence interval calculation
    const z = 1.96; // 95% confidence
    const margin = z * Math.sqrt((probability * (1 - probability)) / sampleSize);
    
    return {
      min: Math.max(0, probability - margin),
      max: Math.min(1, probability + margin)
    };
  }

  /**
   * Returns prediction for insufficient data
   */
  private static getInsufficientDataPrediction(): ExamPrediction {
    return {
      successProbability: 50,
      readinessLevel: 'needs-work',
      timeToReadiness: 30,
      keyImprovementAreas: ['Complete more practice questions', 'Cover more topics', 'Establish study routine'],
      strengthAreas: [],
      confidenceInterval: { min: 20, max: 80 }
    };
  }
}