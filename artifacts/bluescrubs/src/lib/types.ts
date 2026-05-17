export interface UserStats {
  totalAnswered: number;
  correctAnswers: number;
  averageTime: number;
  categoryStats: Record<string, { correct: number; total: number }>;
  totalPoints?: number;
  recentSessions?: Array<{
    date: string;
    accuracy: number;
    questionsAnswered: number;
    timeSpent: number;
  }>;
}

export interface ProgressData {
  dailyProgress: Array<{
    date: string;
    questionsAnswered: number;
    accuracy: number;
  }>;
  weeklyProgress: Array<{
    week: string;
    questionsAnswered: number;
    accuracy: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    accuracy: number;
    questionsAnswered: number;
  }>;
}

export interface User {
  id: number;
  email: string;
  username: string;
  currentStage: string;
  studyStreak: number;
  totalPoints: number;
  country?: string;
  city?: string;
  flagEmoji?: string;
  timezone?: string;
  isLocationPublic: boolean;
  createdAt: string;
}

export interface Question {
  id: number;
  type: string;
  category: string;
  difficulty: string;
  content: string;
  options?: any;
  correctAnswer: string;
  explanation: string;
  examType: string;
}

export interface CommunityPost {
  id: number;
  userId: number;
  username: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  likes: number;
  replies: number;
}

export interface StudyPlan {
  id: number;
  userId: number;
  date: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    type: string;
  }>;
  completed: boolean;
}