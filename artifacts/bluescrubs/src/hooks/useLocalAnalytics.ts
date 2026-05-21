import { useState, useEffect, useCallback } from 'react';

export interface QuestionAttempt {
  questionId: string;
  category: string;
  difficulty: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  timestamp: number;
  selectedAnswer: string;
  correctAnswer: string;
}

export interface CategoryPerformance {
  category: string;
  totalAttempts: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  weaknessScore: number; // 0-100, higher = weaker
  lastAttempt: number;
  improvementTrend: number; // -1 to 1, positive = improving
}

export interface StudySession {
  date: string;
  questionsAnswered: number;
  timeSpent: number;
  accuracy: number;
  categories: string[];
}

export interface WeakAreaRecommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedAction: string;
  estimatedStudyTime: number;
}

export interface DifficultyAdjustment {
  category: string;
  currentLevel: string;
  recommendedLevel: string;
  confidence: number; // 0-1
}

export interface StudySchedule {
  id: string;
  title: string;
  targetDate: string;
  dailyGoal: number; // questions per day
  weeklyGoal: number;
  reminderTime: string; // HH:MM format
  enabled: boolean;
  categories: string[];
  progress: {
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    completedDays: number;
  };
}

class LocalAnalyticsEngine {
  private storageKey = 'bluescrubsprep-analytics';
  private scheduleKey = 'bluescrubsprep-schedules';
  
  recordAttempt(attempt: Omit<QuestionAttempt, 'timestamp'>) {
    const attempts = this.getAttempts();
    const newAttempt: QuestionAttempt = {
      ...attempt,
      timestamp: Date.now()
    };
    
    attempts.push(newAttempt);
    localStorage.setItem(this.storageKey, JSON.stringify(attempts));
    
    this.updateStudySession(newAttempt);
  }

  getAttempts(): QuestionAttempt[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  getCategoryPerformance(): CategoryPerformance[] {
    const attempts = this.getAttempts();
    const categoryMap = new Map<string, QuestionAttempt[]>();

    attempts.forEach(attempt => {
      if (!categoryMap.has(attempt.category)) {
        categoryMap.set(attempt.category, []);
      }
      categoryMap.get(attempt.category)!.push(attempt);
    });

    return Array.from(categoryMap.entries()).map(([category, categoryAttempts]) => {
      const totalAttempts = categoryAttempts.length;
      const correctAnswers = categoryAttempts.filter(a => a.isCorrect).length;
      const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;
      const averageTime = categoryAttempts.reduce((sum, a) => sum + a.timeSpent, 0) / totalAttempts;
      const lastAttempt = Math.max(...categoryAttempts.map(a => a.timestamp));

      const recentAttempts = categoryAttempts.filter(a => a.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentAccuracy = recentAttempts.length > 0 
        ? recentAttempts.filter(a => a.isCorrect).length / recentAttempts.length 
        : accuracy;
      const weaknessScore = Math.round((1 - recentAccuracy) * 100);

      const oldAttempts = categoryAttempts.filter(a => a.timestamp < Date.now() - 7 * 24 * 60 * 60 * 1000);
      const oldAccuracy = oldAttempts.length > 0 
        ? oldAttempts.filter(a => a.isCorrect).length / oldAttempts.length 
        : 0;
      const improvementTrend = recentAccuracy - oldAccuracy;

      return {
        category,
        totalAttempts,
        correctAnswers,
        accuracy,
        averageTime,
        weaknessScore,
        lastAttempt,
        improvementTrend
      };
    }).sort((a, b) => b.weaknessScore - a.weaknessScore);
  }

  getWeakAreaRecommendations(): WeakAreaRecommendation[] {
    const performance = this.getCategoryPerformance();
    
    return performance
      .filter(p => p.totalAttempts >= 3)
      .map(p => {
        let priority: 'high' | 'medium' | 'low' = 'low';
        let reason = '';
        let suggestedAction = '';
        let estimatedStudyTime = 30;

        if (p.weaknessScore >= 70) {
          priority = 'high';
          reason = `Very low accuracy (${Math.round(p.accuracy * 100)}%) in recent attempts`;
          suggestedAction = 'Focus on fundamental concepts and practice basic questions';
          estimatedStudyTime = 60;
        } else if (p.weaknessScore >= 40) {
          priority = 'medium';
          reason = `Below average performance (${Math.round(p.accuracy * 100)}% accuracy)`;
          suggestedAction = 'Review key topics and practice targeted questions';
          estimatedStudyTime = 45;
        } else if (p.improvementTrend < -0.2) {
          priority = 'medium';
          reason = 'Performance declining in recent attempts';
          suggestedAction = 'Refresh knowledge and identify knowledge gaps';
          estimatedStudyTime = 30;
        }

        return {
          category: p.category,
          priority,
          reason,
          suggestedAction,
          estimatedStudyTime
        };
      })
      .filter(r => r.priority !== 'low')
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }

  getDifficultyAdjustments(): DifficultyAdjustment[] {
    const performance = this.getCategoryPerformance();
    
    return performance.map(p => {
      let recommendedLevel = 'basic';
      let confidence = 0;

      if (p.totalAttempts >= 5) {
        if (p.accuracy >= 0.8 && p.improvementTrend >= 0) {
          recommendedLevel = 'advanced';
          confidence = 0.8;
        } else if (p.accuracy >= 0.6) {
          recommendedLevel = 'intermediate';
          confidence = 0.7;
        } else {
          recommendedLevel = 'basic';
          confidence = 0.9;
        }
      }

      return {
        category: p.category,
        currentLevel: 'basic',
        recommendedLevel,
        confidence
      };
    });
  }

  private updateStudySession(attempt: QuestionAttempt) {
    const today = new Date().toISOString().split('T')[0];
    const sessions = this.getStudySessions();
    
    let todaySession = sessions.find(s => s.date === today);
    if (!todaySession) {
      todaySession = {
        date: today,
        questionsAnswered: 0,
        timeSpent: 0,
        accuracy: 0,
        categories: []
      };
      sessions.push(todaySession);
    }

    todaySession.questionsAnswered++;
    todaySession.timeSpent += attempt.timeSpent;
    
    if (!todaySession.categories.includes(attempt.category)) {
      todaySession.categories.push(attempt.category);
    }

    const todayAttempts = this.getAttempts().filter(a => {
      const attemptDate = new Date(a.timestamp).toISOString().split('T')[0];
      return attemptDate === today;
    });
    todaySession.accuracy = todayAttempts.filter(a => a.isCorrect).length / todayAttempts.length;

    localStorage.setItem('bluescrubsprep-sessions', JSON.stringify(sessions));
  }

  getStudySessions(): StudySession[] {
    const stored = localStorage.getItem('bluescrubsprep-sessions');
    return stored ? JSON.parse(stored) : [];
  }

  createStudySchedule(schedule: Omit<StudySchedule, 'id' | 'progress'>) {
    const schedules = this.getStudySchedules();
    const newSchedule: StudySchedule = {
      ...schedule,
      id: Date.now().toString(),
      progress: {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        completedDays: 0
      }
    };
    
    schedules.push(newSchedule);
    localStorage.setItem(this.scheduleKey, JSON.stringify(schedules));
    
    if (newSchedule.enabled) {
      this.scheduleNotification(newSchedule);
    }
    
    return newSchedule;
  }

  getStudySchedules(): StudySchedule[] {
    const stored = localStorage.getItem(this.scheduleKey);
    return stored ? JSON.parse(stored) : [];
  }

  updateScheduleProgress(scheduleId: string, questionsCompleted: number) {
    const schedules = this.getStudySchedules();
    const schedule = schedules.find(s => s.id === scheduleId);
    
    if (schedule) {
      const today = new Date().toISOString().split('T')[0];
      const todaySession = this.getStudySessions().find(s => s.date === today);
      
      if (todaySession && todaySession.questionsAnswered >= schedule.dailyGoal) {
        schedule.progress.currentStreak++;
        schedule.progress.completedDays++;
        
        if (schedule.progress.currentStreak > schedule.progress.longestStreak) {
          schedule.progress.longestStreak = schedule.progress.currentStreak;
        }
      }
      
      schedule.progress.totalDays = Math.floor(
        (Date.now() - new Date(schedule.targetDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      localStorage.setItem(this.scheduleKey, JSON.stringify(schedules));
    }
  }

  private scheduleNotification(schedule: StudySchedule) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const [hours, minutes] = schedule.reminderTime.split(':').map(Number);
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);
      
      if (reminderTime < now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }
      
      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      
      setTimeout(() => {
        new Notification('BlueScrubsPrep Study Reminder', {
          body: `Time to practice! Goal: ${schedule.dailyGoal} questions`,
          icon: '/favicon.ico'
        });
      }, timeUntilReminder);
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  clearAllData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.scheduleKey);
    localStorage.removeItem('bluescrubsprep-sessions');
  }
}

export const localAnalytics = new LocalAnalyticsEngine();

export function useLocalAnalytics() {
  const [performance, setPerformance] = useState<CategoryPerformance[]>([]);
  const [recommendations, setRecommendations] = useState<WeakAreaRecommendation[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);

  const refreshData = useCallback(() => {
    setPerformance(localAnalytics.getCategoryPerformance());
    setRecommendations(localAnalytics.getWeakAreaRecommendations());
    setSessions(localAnalytics.getStudySessions());
    setSchedules(localAnalytics.getStudySchedules());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const recordAttempt = useCallback((attempt: Omit<QuestionAttempt, 'timestamp'>) => {
    localAnalytics.recordAttempt(attempt);
    refreshData();
  }, [refreshData]);

  const recordSession = useCallback((_session?: Partial<StudySession>) => {
    refreshData();
  }, [refreshData]);

  const getWeakAreas = useCallback((): WeakAreaRecommendation[] => {
    return localAnalytics.getWeakAreaRecommendations();
  }, []);

  const createSchedule = useCallback((schedule: Omit<StudySchedule, 'id' | 'progress'>) => {
    const newSchedule = localAnalytics.createStudySchedule(schedule);
    refreshData();
    return newSchedule;
  }, [refreshData]);

  const updateProgress = useCallback((scheduleId: string, questionsCompleted: number) => {
    localAnalytics.updateScheduleProgress(scheduleId, questionsCompleted);
    refreshData();
  }, [refreshData]);

  return {
    performance,
    recommendations,
    sessions,
    schedules,
    recordAttempt,
    recordSession,
    getWeakAreas,
    createSchedule,
    updateProgress,
    refreshData,
    getDifficultyAdjustments: localAnalytics.getDifficultyAdjustments.bind(localAnalytics),
    requestNotificationPermission: localAnalytics.requestNotificationPermission.bind(localAnalytics)
  };
}
