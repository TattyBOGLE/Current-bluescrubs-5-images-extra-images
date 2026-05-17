export const POINTS_CONFIG = {
  BASE_CORRECT_ANSWER: 10,
  DIFFICULTY_MULTIPLIERS: {
    foundation: 1,
    intermediate: 1.5,
    advanced: 2,
  },
  STREAK_BONUSES: {
    3: 5,
    5: 10,
    10: 25,
    20: 50,
    50: 100,
  },
  SPEED_BONUS_THRESHOLD: 30,
  SPEED_BONUS_POINTS: 5,
  PERFECT_SESSION_BONUS: 50,
  FIRST_ATTEMPT_BONUS: 2,
};

export const BADGE_DEFINITIONS = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Answer your first question correctly',
    category: 'milestone',
    requirement: { type: 'questions_correct', value: 1 },
    badgeIcon: '🎯',
    badgeColor: 'bg-blue-500',
    points: 10,
    isRare: false,
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Complete 10 questions',
    category: 'milestone',
    requirement: { type: 'questions_answered', value: 10 },
    badgeIcon: '📚',
    badgeColor: 'bg-green-500',
    points: 25,
    isRare: false,
  },
  {
    id: 'dedicated_learner',
    name: 'Dedicated Learner',
    description: 'Complete 100 questions',
    category: 'milestone',
    requirement: { type: 'questions_answered', value: 100 },
    badgeIcon: '📖',
    badgeColor: 'bg-purple-500',
    points: 100,
    isRare: false,
  },
  {
    id: 'question_master',
    name: 'Question Master',
    description: 'Complete 500 questions',
    category: 'milestone',
    requirement: { type: 'questions_answered', value: 500 },
    badgeIcon: '🏆',
    badgeColor: 'bg-yellow-500',
    points: 500,
    isRare: true,
  },
  {
    id: 'plab_warrior',
    name: 'PLAB Warrior',
    description: 'Complete 1000 questions',
    category: 'milestone',
    requirement: { type: 'questions_answered', value: 1000 },
    badgeIcon: '⚔️',
    badgeColor: 'bg-red-500',
    points: 1000,
    isRare: true,
  },
  {
    id: 'streak_starter',
    name: 'Streak Starter',
    description: 'Get 3 correct answers in a row',
    category: 'streak',
    requirement: { type: 'streak', value: 3 },
    badgeIcon: '🔥',
    badgeColor: 'bg-orange-500',
    points: 15,
    isRare: false,
  },
  {
    id: 'on_fire',
    name: 'On Fire',
    description: 'Get 5 correct answers in a row',
    category: 'streak',
    requirement: { type: 'streak', value: 5 },
    badgeIcon: '💥',
    badgeColor: 'bg-orange-600',
    points: 30,
    isRare: false,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Get 10 correct answers in a row',
    category: 'streak',
    requirement: { type: 'streak', value: 10 },
    badgeIcon: '🚀',
    badgeColor: 'bg-red-600',
    points: 75,
    isRare: true,
  },
  {
    id: 'legendary_streak',
    name: 'Legendary Streak',
    description: 'Get 20 correct answers in a row',
    category: 'streak',
    requirement: { type: 'streak', value: 20 },
    badgeIcon: '👑',
    badgeColor: 'bg-amber-500',
    points: 200,
    isRare: true,
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Achieve 80% accuracy in a session',
    category: 'accuracy',
    requirement: { type: 'session_accuracy', value: 80 },
    badgeIcon: '🎯',
    badgeColor: 'bg-teal-500',
    points: 25,
    isRare: false,
  },
  {
    id: 'precision_expert',
    name: 'Precision Expert',
    description: 'Achieve 90% accuracy in a session',
    category: 'accuracy',
    requirement: { type: 'session_accuracy', value: 90 },
    badgeIcon: '💎',
    badgeColor: 'bg-cyan-500',
    points: 50,
    isRare: false,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Get 100% accuracy in a session with 10+ questions',
    category: 'accuracy',
    requirement: { type: 'perfect_session', value: 10 },
    badgeIcon: '✨',
    badgeColor: 'bg-pink-500',
    points: 100,
    isRare: true,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer a question correctly in under 30 seconds',
    category: 'speed',
    requirement: { type: 'fast_answer', value: 30 },
    badgeIcon: '⚡',
    badgeColor: 'bg-yellow-400',
    points: 20,
    isRare: false,
  },
  {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    description: 'Answer 5 questions correctly under 30 seconds each',
    category: 'speed',
    requirement: { type: 'fast_answers_count', value: 5 },
    badgeIcon: '🌩️',
    badgeColor: 'bg-indigo-500',
    points: 50,
    isRare: false,
  },
  {
    id: 'daily_dedication',
    name: 'Daily Dedication',
    description: 'Study for 3 consecutive days',
    category: 'study_streak',
    requirement: { type: 'daily_streak', value: 3 },
    badgeIcon: '📅',
    badgeColor: 'bg-blue-600',
    points: 30,
    isRare: false,
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Study for 7 consecutive days',
    category: 'study_streak',
    requirement: { type: 'daily_streak', value: 7 },
    badgeIcon: '🗓️',
    badgeColor: 'bg-green-600',
    points: 100,
    isRare: false,
  },
  {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Study for 30 consecutive days',
    category: 'study_streak',
    requirement: { type: 'daily_streak', value: 30 },
    badgeIcon: '🏅',
    badgeColor: 'bg-purple-600',
    points: 500,
    isRare: true,
  },
  {
    id: 'cardio_specialist',
    name: 'Cardiology Specialist',
    description: 'Answer 50 cardiology questions correctly',
    category: 'specialty',
    requirement: { type: 'category_correct', category: 'cardiovascular', value: 50 },
    badgeIcon: '❤️',
    badgeColor: 'bg-red-500',
    points: 75,
    isRare: false,
  },
  {
    id: 'neuro_expert',
    name: 'Neurology Expert',
    description: 'Answer 50 neurology questions correctly',
    category: 'specialty',
    requirement: { type: 'category_correct', category: 'neurology', value: 50 },
    badgeIcon: '🧠',
    badgeColor: 'bg-pink-600',
    points: 75,
    isRare: false,
  },
  {
    id: 'respiratory_pro',
    name: 'Respiratory Pro',
    description: 'Answer 50 respiratory questions correctly',
    category: 'specialty',
    requirement: { type: 'category_correct', category: 'respiratory', value: 50 },
    badgeIcon: '🫁',
    badgeColor: 'bg-sky-500',
    points: 75,
    isRare: false,
  },
  {
    id: 'point_collector',
    name: 'Point Collector',
    description: 'Earn 500 total points',
    category: 'points',
    requirement: { type: 'total_points', value: 500 },
    badgeIcon: '💰',
    badgeColor: 'bg-yellow-500',
    points: 50,
    isRare: false,
  },
  {
    id: 'point_hoarder',
    name: 'Point Hoarder',
    description: 'Earn 2000 total points',
    category: 'points',
    requirement: { type: 'total_points', value: 2000 },
    badgeIcon: '💎',
    badgeColor: 'bg-blue-500',
    points: 100,
    isRare: false,
  },
  {
    id: 'point_master',
    name: 'Point Master',
    description: 'Earn 10000 total points',
    category: 'points',
    requirement: { type: 'total_points', value: 10000 },
    badgeIcon: '👑',
    badgeColor: 'bg-amber-500',
    points: 500,
    isRare: true,
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a study session before 7 AM',
    category: 'special',
    requirement: { type: 'early_session', value: 7 },
    badgeIcon: '🌅',
    badgeColor: 'bg-orange-400',
    points: 25,
    isRare: false,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a study session after 11 PM',
    category: 'special',
    requirement: { type: 'late_session', value: 23 },
    badgeIcon: '🦉',
    badgeColor: 'bg-indigo-600',
    points: 25,
    isRare: false,
  },
];

export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Newcomer', minPoints: 0, icon: '🌱' },
  { level: 2, name: 'Student', minPoints: 100, icon: '📚' },
  { level: 3, name: 'Learner', minPoints: 300, icon: '📖' },
  { level: 4, name: 'Practitioner', minPoints: 600, icon: '🩺' },
  { level: 5, name: 'Scholar', minPoints: 1000, icon: '🎓' },
  { level: 6, name: 'Expert', minPoints: 2000, icon: '💡' },
  { level: 7, name: 'Master', minPoints: 4000, icon: '⭐' },
  { level: 8, name: 'Specialist', minPoints: 7000, icon: '🏆' },
  { level: 9, name: 'Elite', minPoints: 12000, icon: '💎' },
  { level: 10, name: 'Legend', minPoints: 20000, icon: '👑' },
];

export function calculateLevel(totalPoints: number) {
  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel = LEVEL_THRESHOLDS[1];

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVEL_THRESHOLDS[i].minPoints) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || null;
      break;
    }
  }

  const pointsInLevel = totalPoints - currentLevel.minPoints;
  const pointsToNextLevel = nextLevel ? nextLevel.minPoints - currentLevel.minPoints : 0;
  const progress = nextLevel ? (pointsInLevel / pointsToNextLevel) * 100 : 100;

  return {
    currentLevel,
    nextLevel,
    progress: Math.min(progress, 100),
    pointsToNext: nextLevel ? nextLevel.minPoints - totalPoints : 0,
  };
}

export function calculatePointsForAnswer(
  isCorrect: boolean,
  difficulty: string,
  timeSpent: number,
  currentStreak: number
): { points: number; breakdown: { base: number; difficulty: number; speed: number; streak: number } } {
  if (!isCorrect) {
    return { points: 0, breakdown: { base: 0, difficulty: 0, speed: 0, streak: 0 } };
  }

  const base = POINTS_CONFIG.BASE_CORRECT_ANSWER;
  const difficultyMultiplier = POINTS_CONFIG.DIFFICULTY_MULTIPLIERS[difficulty as keyof typeof POINTS_CONFIG.DIFFICULTY_MULTIPLIERS] || 1;
  const difficultyBonus = Math.floor(base * (difficultyMultiplier - 1));

  let speedBonus = 0;
  if (timeSpent <= POINTS_CONFIG.SPEED_BONUS_THRESHOLD) {
    speedBonus = POINTS_CONFIG.SPEED_BONUS_POINTS;
  }

  let streakBonus = 0;
  const streakThresholds = Object.keys(POINTS_CONFIG.STREAK_BONUSES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const threshold of streakThresholds) {
    if (currentStreak >= threshold) {
      streakBonus = POINTS_CONFIG.STREAK_BONUSES[threshold as keyof typeof POINTS_CONFIG.STREAK_BONUSES];
      break;
    }
  }

  const total = base + difficultyBonus + speedBonus + streakBonus;

  return {
    points: total,
    breakdown: {
      base,
      difficulty: difficultyBonus,
      speed: speedBonus,
      streak: streakBonus,
    },
  };
}

export const BADGE_CATEGORIES = [
  { id: 'all', label: 'All Badges', icon: '🏅' },
  { id: 'milestone', label: 'Milestones', icon: '🎯' },
  { id: 'streak', label: 'Streaks', icon: '🔥' },
  { id: 'accuracy', label: 'Accuracy', icon: '💎' },
  { id: 'speed', label: 'Speed', icon: '⚡' },
  { id: 'study_streak', label: 'Daily Streaks', icon: '📅' },
  { id: 'specialty', label: 'Specialties', icon: '🩺' },
  { id: 'points', label: 'Points', icon: '💰' },
  { id: 'special', label: 'Special', icon: '✨' },
];
