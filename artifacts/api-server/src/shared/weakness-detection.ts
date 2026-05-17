// Real-time Weakness Detection System - No external API calls
// Analyzes user answer patterns to identify knowledge gaps

export interface WeaknessPattern {
  topic: string;
  subCategory: string;
  weaknessScore: number; // 0-100, higher = more weakness
  commonMistakes: string[];
  questionsAttempted: number;
  lastMistake: Date;
  improvementTrend: 'declining' | 'stable' | 'improving';
}

export interface WeaknessAnalysis {
  criticalWeaknesses: WeaknessPattern[];
  moderateWeaknesses: WeaknessPattern[];
  improvingAreas: WeaknessPattern[];
  overallWeaknessScore: number;
  recommendedActions: string[];
}

export class WeaknessDetectionEngine {
  private static readonly CRITICAL_THRESHOLD = 70;
  private static readonly MODERATE_THRESHOLD = 50;
  private static readonly MIN_QUESTIONS = 5;

  /**
   * Analyzes answer patterns to detect knowledge gaps
   */
  static analyzeWeaknesses(userAnswers: any[]): WeaknessAnalysis {
    const patterns = this.extractWeaknessPatterns(userAnswers);
    
    const criticalWeaknesses = patterns.filter(p => p.weaknessScore >= this.CRITICAL_THRESHOLD);
    const moderateWeaknesses = patterns.filter(p => 
      p.weaknessScore >= this.MODERATE_THRESHOLD && p.weaknessScore < this.CRITICAL_THRESHOLD
    );
    const improvingAreas = patterns.filter(p => p.improvementTrend === 'improving');

    const overallWeaknessScore = this.calculateOverallWeakness(patterns);
    const recommendedActions = this.generateRecommendations(criticalWeaknesses, moderateWeaknesses);

    return {
      criticalWeaknesses,
      moderateWeaknesses,
      improvingAreas,
      overallWeaknessScore,
      recommendedActions
    };
  }

  /**
   * Extracts weakness patterns from user answers
   */
  private static extractWeaknessPatterns(userAnswers: any[]): WeaknessPattern[] {
    const topicGroups = this.groupByTopic(userAnswers);
    const patterns: WeaknessPattern[] = [];

    for (const [topic, answers] of Object.entries(topicGroups)) {
      if (answers.length < this.MIN_QUESTIONS) continue;

      const incorrectAnswers = answers.filter(a => !a.isCorrect);
      const recentAnswers = answers.slice(-10); // Last 10 attempts
      const recentIncorrect = recentAnswers.filter(a => !a.isCorrect);

      const weaknessScore = (incorrectAnswers.length / answers.length) * 100;
      const improvementTrend = this.calculateTrend(answers);
      const commonMistakes = this.extractCommonMistakes(incorrectAnswers);

      patterns.push({
        topic,
        subCategory: this.extractSubCategory(topic),
        weaknessScore,
        commonMistakes,
        questionsAttempted: answers.length,
        lastMistake: incorrectAnswers.length > 0 ? 
          new Date(Math.max(...incorrectAnswers.map(a => new Date(a.answeredAt).getTime()))) :
          new Date(0),
        improvementTrend
      });
    }

    return patterns.sort((a, b) => b.weaknessScore - a.weaknessScore);
  }

  /**
   * Groups answers by topic/category
   */
  private static groupByTopic(answers: any[]): Record<string, any[]> {
    return answers.reduce((groups, answer) => {
      const topic = answer.question?.category || answer.question?.topic || 'General';
      if (!groups[topic]) groups[topic] = [];
      groups[topic].push(answer);
      return groups;
    }, {});
  }

  /**
   * Calculates improvement trend for a topic
   */
  private static calculateTrend(answers: any[]): 'declining' | 'stable' | 'improving' {
    if (answers.length < 6) return 'stable';

    const firstHalf = answers.slice(0, Math.floor(answers.length / 2));
    const secondHalf = answers.slice(Math.floor(answers.length / 2));

    const firstAccuracy = firstHalf.filter(a => a.isCorrect).length / firstHalf.length;
    const secondAccuracy = secondHalf.filter(a => a.isCorrect).length / secondHalf.length;

    const difference = secondAccuracy - firstAccuracy;

    if (difference > 0.1) return 'improving';
    if (difference < -0.1) return 'declining';
    return 'stable';
  }

  /**
   * Extracts common mistake patterns from incorrect answers
   */
  private static extractCommonMistakes(incorrectAnswers: any[]): string[] {
    const mistakes: Record<string, number> = {};

    incorrectAnswers.forEach(answer => {
      const question = answer.question;
      const selectedAnswer = answer.selectedAnswer;
      const correctAnswer = question.correctAnswer;

      // Analyze mistake patterns
      if (question.options && selectedAnswer && correctAnswer) {
        const mistake = `Selected "${selectedAnswer}" instead of "${correctAnswer}"`;
        mistakes[mistake] = (mistakes[mistake] || 0) + 1;
      }

      // Analyze topic-specific patterns
      if (question.explanation) {
        const keywords = this.extractKeywords(question.explanation);
        keywords.forEach(keyword => {
          const pattern = `Confusion with ${keyword}`;
          mistakes[pattern] = (mistakes[pattern] || 0) + 1;
        });
      }
    });

    return Object.entries(mistakes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([mistake]) => mistake);
  }

  /**
   * Extracts keywords from explanation text
   */
  private static extractKeywords(text: string): string[] {
    const medicalTerms = [
      'hypertension', 'diabetes', 'infection', 'inflammation', 'diagnosis',
      'treatment', 'medication', 'surgery', 'therapy', 'prevention',
      'symptoms', 'signs', 'examination', 'investigation', 'management'
    ];

    return medicalTerms.filter(term => 
      text.toLowerCase().includes(term.toLowerCase())
    );
  }

  /**
   * Extracts subcategory from topic
   */
  private static extractSubCategory(topic: string): string {
    const subcategories: Record<string, string> = {
      'cardiology': 'Cardiovascular System',
      'respiratory': 'Respiratory System',
      'gastroenterology': 'Digestive System',
      'neurology': 'Nervous System',
      'endocrinology': 'Endocrine System',
      'psychiatry': 'Mental Health',
      'emergency': 'Emergency Medicine',
      'surgery': 'Surgical Procedures',
      'pediatrics': 'Child Health',
      'obstetrics': 'Women\'s Health'
    };

    const key = topic.toLowerCase();
    return subcategories[key] || 'General Medicine';
  }

  /**
   * Calculates overall weakness score
   */
  private static calculateOverallWeakness(patterns: WeaknessPattern[]): number {
    if (patterns.length === 0) return 0;

    const weightedScore = patterns.reduce((sum, pattern) => {
      const weight = pattern.questionsAttempted / patterns.reduce((total, p) => total + p.questionsAttempted, 0);
      return sum + (pattern.weaknessScore * weight);
    }, 0);

    return Math.round(weightedScore);
  }

  /**
   * Generates personalized recommendations
   */
  private static generateRecommendations(critical: WeaknessPattern[], moderate: WeaknessPattern[]): string[] {
    const recommendations: string[] = [];

    if (critical.length > 0) {
      recommendations.push(`Focus immediately on ${critical[0].topic} - your weakest area (${Math.round(critical[0].weaknessScore)}% error rate)`);
      
      if (critical[0].commonMistakes.length > 0) {
        recommendations.push(`Review common mistakes: ${critical[0].commonMistakes[0]}`);
      }
    }

    if (moderate.length > 0) {
      recommendations.push(`Schedule regular practice for ${moderate.slice(0, 2).map(p => p.topic).join(' and ')}`);
    }

    const decliningAreas = [...critical, ...moderate].filter(p => p.improvementTrend === 'declining');
    if (decliningAreas.length > 0) {
      recommendations.push(`Urgent attention needed for declining performance in ${decliningAreas[0].topic}`);
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue current study pattern - performance is stable across all topics');
    }

    return recommendations.slice(0, 4); // Max 4 recommendations
  }

  /**
   * Real-time weakness check during quiz
   */
  static checkRealTimeWeakness(currentAnswer: any, userHistory: any[]): {
    isWeakArea: boolean;
    confidenceLevel: 'low' | 'medium' | 'high';
    suggestion: string;
  } {
    const topic = currentAnswer.question?.category || currentAnswer.question?.topic;
    const topicHistory = userHistory.filter(h => 
      (h.question?.category || h.question?.topic) === topic
    );

    if (topicHistory.length < 3) {
      return {
        isWeakArea: false,
        confidenceLevel: 'medium',
        suggestion: 'Continue practicing to establish performance pattern'
      };
    }

    const recentErrors = topicHistory.slice(-5).filter(h => !h.isCorrect).length;
    const errorRate = recentErrors / Math.min(5, topicHistory.length);

    if (errorRate >= 0.6) {
      return {
        isWeakArea: true,
        confidenceLevel: 'low',
        suggestion: `This is a weak area - review ${topic} fundamentals before continuing`
      };
    } else if (errorRate >= 0.4) {
      return {
        isWeakArea: true,
        confidenceLevel: 'medium',
        suggestion: `Practice more ${topic} questions to improve consistency`
      };
    } else {
      return {
        isWeakArea: false,
        confidenceLevel: 'high',
        suggestion: `Good performance in ${topic} - maintain current approach`
      };
    }
  }
}