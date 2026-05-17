// Adaptive Learning Algorithm - No external API calls required
// Uses existing user performance data to optimize question selection

export interface UserPerformance {
  userId: number;
  topic: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  totalAttempts: number;
  correctAnswers: number;
  averageTime: number;
  lastAttempt: Date;
  accuracy: number;
}

export interface AdaptiveRecommendation {
  nextDifficulty: 'basic' | 'intermediate' | 'advanced';
  focusTopics: string[];
  confidenceScore: number;
  recommendedQuestions: number;
}

export class AdaptiveLearningEngine {
  private static readonly MASTERY_THRESHOLD = 0.85; // 85% accuracy
  private static readonly WEAKNESS_THRESHOLD = 0.60; // 60% accuracy
  private static readonly MIN_ATTEMPTS = 3;

  /**
   * Analyzes user performance to determine next optimal difficulty
   */
  static getNextDifficulty(performance: UserPerformance[]): 'basic' | 'intermediate' | 'advanced' {
    if (performance.length === 0) return 'basic';

    const recentPerformance = performance
      .filter(p => p.totalAttempts >= this.MIN_ATTEMPTS)
      .sort((a, b) => b.lastAttempt.getTime() - a.lastAttempt.getTime())
      .slice(0, 10); // Last 10 topics

    if (recentPerformance.length === 0) return 'basic';

    const avgAccuracy = recentPerformance.reduce((sum, p) => sum + p.accuracy, 0) / recentPerformance.length;

    if (avgAccuracy >= this.MASTERY_THRESHOLD) {
      return 'advanced';
    } else if (avgAccuracy >= this.WEAKNESS_THRESHOLD) {
      return 'intermediate';
    } else {
      return 'basic';
    }
  }

  /**
   * Identifies topics where user needs more practice
   */
  static identifyWeaknesses(performance: UserPerformance[]): string[] {
    return performance
      .filter(p => p.totalAttempts >= this.MIN_ATTEMPTS)
      .filter(p => p.accuracy < this.WEAKNESS_THRESHOLD)
      .sort((a, b) => a.accuracy - b.accuracy) // Weakest first
      .slice(0, 5) // Top 5 weaknesses
      .map(p => p.topic);
  }

  /**
   * Calculates confidence score for exam readiness
   */
  static calculateConfidenceScore(performance: UserPerformance[]): number {
    if (performance.length === 0) return 0;

    const topicCoverage = performance.filter(p => p.totalAttempts >= this.MIN_ATTEMPTS);
    if (topicCoverage.length === 0) return 0;

    const avgAccuracy = topicCoverage.reduce((sum, p) => sum + p.accuracy, 0) / topicCoverage.length;
    const consistencyBonus = topicCoverage.filter(p => p.accuracy >= this.MASTERY_THRESHOLD).length / topicCoverage.length;
    
    return Math.min(100, Math.round((avgAccuracy * 0.7 + consistencyBonus * 0.3) * 100));
  }

  /**
   * Generates adaptive recommendations based on user performance
   */
  static generateRecommendations(performance: UserPerformance[]): AdaptiveRecommendation {
    const nextDifficulty = this.getNextDifficulty(performance);
    const focusTopics = this.identifyWeaknesses(performance);
    const confidenceScore = this.calculateConfidenceScore(performance);
    
    // Recommend more questions for weaker areas
    const recommendedQuestions = focusTopics.length > 0 ? 20 : 10;

    return {
      nextDifficulty,
      focusTopics,
      confidenceScore,
      recommendedQuestions
    };
  }

  /**
   * Filters questions based on adaptive recommendations
   */
  static filterQuestions(
    questions: any[], 
    recommendations: AdaptiveRecommendation,
    excludeRecentIds: string[] = []
  ): any[] {
    let filtered = questions.filter(q => !excludeRecentIds.includes(q.id));

    // Prioritize focus topics if identified
    if (recommendations.focusTopics.length > 0) {
      const focusQuestions = filtered.filter(q => 
        recommendations.focusTopics.some(topic => 
          q.category?.toLowerCase().includes(topic.toLowerCase()) ||
          q.topic?.toLowerCase().includes(topic.toLowerCase())
        )
      );
      
      if (focusQuestions.length > 0) {
        filtered = focusQuestions;
      }
    }

    // Filter by recommended difficulty
    const difficultyQuestions = filtered.filter(q => 
      q.difficulty?.toLowerCase() === recommendations.nextDifficulty.toLowerCase()
    );

    return difficultyQuestions.length > 0 ? difficultyQuestions : filtered;
  }

  /**
   * Updates user performance after answering a question
   */
  static updatePerformance(
    existing: UserPerformance[],
    userId: number,
    topic: string,
    difficulty: 'basic' | 'intermediate' | 'advanced',
    isCorrect: boolean,
    timeSpent: number
  ): UserPerformance[] {
    const index = existing.findIndex(p => 
      p.userId === userId && p.topic === topic && p.difficulty === difficulty
    );

    if (index >= 0) {
      // Update existing performance
      const updated = { ...existing[index] };
      updated.totalAttempts += 1;
      if (isCorrect) updated.correctAnswers += 1;
      updated.averageTime = (updated.averageTime * (updated.totalAttempts - 1) + timeSpent) / updated.totalAttempts;
      updated.lastAttempt = new Date();
      updated.accuracy = updated.correctAnswers / updated.totalAttempts;
      
      return [
        ...existing.slice(0, index),
        updated,
        ...existing.slice(index + 1)
      ];
    } else {
      // Create new performance record
      const newPerformance: UserPerformance = {
        userId,
        topic,
        difficulty,
        totalAttempts: 1,
        correctAnswers: isCorrect ? 1 : 0,
        averageTime: timeSpent,
        lastAttempt: new Date(),
        accuracy: isCorrect ? 1 : 0
      };
      
      return [...existing, newPerformance];
    }
  }
}