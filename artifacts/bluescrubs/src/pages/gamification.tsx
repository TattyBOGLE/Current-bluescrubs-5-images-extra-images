import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Target, Flame, Medal, Crown, Zap, BookOpen, Users, Calendar, Award, TrendingUp, Globe } from "lucide-react";

interface UserStats {
  totalPoints: number;
  level: {
    currentLevel: { level: number; name: string; icon: string };
    nextLevel: { level: number; minPoints: number; name: string; icon: string };
    progress: number;
    pointsToNext: number;
  };
  currentStreak: number;
  questionsAnswered: number;
  accuracy: number;
  badgesEarned: number;
}

interface BadgeCategory {
  id: string;
  label: string;
  icon: string;
}

interface BadgesData {
  badges: any[];
  categories: BadgeCategory[];
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  level: number;
  avatar?: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
}

export default function Gamification() {
  const [selectedAchievement, setSelectedAchievement] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('all-time');

  const { data: statsData } = useQuery<UserStats>({
    queryKey: ['/api/gamification/user-stats', 1],
  });

  const { data: badgesData } = useQuery<BadgesData>({
    queryKey: ['/api/gamification/badges'],
  });

  const { data: leaderboardData } = useQuery<LeaderboardData>({
    queryKey: ['/api/gamification/leaderboard', leaderboardPeriod],
  });

  const { data: levelsData } = useQuery({
    queryKey: ['/api/gamification/levels'],
  });

  const userStats: UserStats = statsData || {
    totalPoints: 8450,
    level: { 
      currentLevel: { level: 12, name: 'Expert', icon: '💡' }, 
      nextLevel: { level: 13, minPoints: 12000, name: 'Master', icon: '⭐' },
      progress: 70,
      pointsToNext: 3550
    },
    currentStreak: 15,
    questionsAnswered: 2847,
    accuracy: 82,
    badgesEarned: 23
  };

  const allBadges = badgesData?.badges || [];
  const badgeCategories = badgesData?.categories || [{ id: 'all', label: 'All Badges', icon: '🏅' }];
  const leaderboard = leaderboardData?.leaderboard || [];

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first 10 questions",
      icon: Target,
      category: "Progress",
      points: 100,
      completed: true,
      progress: 100,
      rarity: "common"
    },
    {
      id: 2,
      title: "Study Streak Master",
      description: "Maintain a 7-day study streak",
      icon: Flame,
      category: "Consistency",
      points: 250,
      completed: true,
      progress: 100,
      rarity: "uncommon"
    },
    {
      id: 3,
      title: "Cardiology Expert",
      description: "Achieve 90% accuracy in 100 cardiology questions",
      icon: Medal,
      category: "Mastery",
      points: 500,
      completed: true,
      progress: 100,
      rarity: "rare"
    },
    {
      id: 4,
      title: "Speed Demon",
      description: "Answer 50 questions in under 30 minutes",
      icon: Zap,
      category: "Speed",
      points: 300,
      completed: false,
      progress: 76,
      rarity: "uncommon"
    },
    {
      id: 5,
      title: "PLAB Perfectionist",
      description: "Score 100% on a 50-question mock exam",
      icon: Crown,
      category: "Excellence",
      points: 1000,
      completed: false,
      progress: 0,
      rarity: "legendary"
    },
    {
      id: 6,
      title: "Knowledge Seeker",
      description: "Complete 1000 questions across all specialties",
      icon: BookOpen,
      category: "Volume",
      points: 750,
      completed: false,
      progress: 85,
      rarity: "epic"
    }
  ];

  const staticLeaderboard = [
    { rank: 1, name: "Dr. Ahmed Hassan", points: 15420, level: 28, streak: 45, badge: "👑" },
    { rank: 2, name: "Dr. Maria Rodriguez", points: 14850, level: 26, streak: 32, badge: "🥈" },
    { rank: 3, name: "Dr. James Chen", points: 14200, level: 25, streak: 28, badge: "🥉" },
    { rank: 4, name: "Dr. Priya Patel", points: 13900, level: 24, streak: 31, badge: "⭐" },
    { rank: 5, name: "Dr. Sarah Johnson", points: 13450, level: 23, streak: 19, badge: "⭐" },
    { rank: 156, name: "You", points: 8450, level: 12, streak: 15, badge: "🔥", isUser: true }
  ];
  
  const displayLeaderboard = leaderboard.length > 0 ? leaderboard : staticLeaderboard;

  const challenges = [
    {
      title: "Weekly Challenge: Respiratory Master",
      description: "Complete 100 respiratory questions this week",
      progress: 67,
      target: 100,
      timeLeft: "3 days",
      reward: "500 XP + Respiratory Badge",
      difficulty: "Medium"
    },
    {
      title: "Speed Challenge: Quick Fire",
      description: "Answer 25 questions in 15 minutes",
      progress: 0,
      target: 25,
      timeLeft: "Available now",
      reward: "300 XP + Speed Badge",
      difficulty: "Hard"
    },
    {
      title: "Monthly Goal: Study Consistency",
      description: "Study for 20 days this month",
      progress: 15,
      target: 20,
      timeLeft: "12 days",
      reward: "1000 XP + Consistency Master Badge",
      difficulty: "Easy"
    }
  ];

  const dailyTasks = [
    { task: "Complete 30 questions", progress: 24, target: 30, points: 50, completed: false },
    { task: "Study for 1 hour", progress: 45, target: 60, points: 25, completed: false },
    { task: "Review 5 incorrect answers", progress: 5, target: 5, points: 30, completed: true },
    { task: "Practice 1 OSCE station", progress: 0, target: 1, points: 40, completed: false }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Achievements & Gamification</h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Track your progress, earn achievements, and compete with fellow PLAB candidates. 
            Stay motivated with our comprehensive gamification system.
          </p>
        </div>

        {/* User Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-slate-50 to-teal-700 border-teal-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">{userStats.level?.currentLevel?.icon || '💡'}</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                Level {userStats.level?.currentLevel?.level || 1}
              </div>
              <div className="text-sm text-blue-700 font-medium mb-2">
                {userStats.level?.currentLevel?.name || 'Newcomer'}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {userStats.totalPoints?.toLocaleString() || 0} points
              </div>
              <Progress value={userStats.level?.progress || 0} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">
                {userStats.level?.pointsToNext?.toLocaleString() || 0} to next level
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
            <CardContent className="p-6 text-center">
              <Flame className="w-10 h-10 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-700">{userStats.currentStreak || 0}</div>
              <div className="text-gray-600 font-medium">Day Streak</div>
              <div className="text-xs text-orange-600 mt-1">Keep it going!</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardContent className="p-6 text-center">
              <Award className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-700">{userStats.badgesEarned || 0}</div>
              <div className="text-gray-600 font-medium">Badges Earned</div>
              <div className="text-xs text-green-600 mt-1">
                {allBadges.length - (userStats.badgesEarned || 0)} more to unlock
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-teal-500 to-rose-500 border-purple-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {userStats.questionsAnswered?.toLocaleString() || 0}
              </div>
              <div className="text-gray-600 font-medium">Questions</div>
              <div className="text-xs text-purple-600 mt-1">Total answered</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
          </TabsList>

          {/* Achievements / Badge Showcase */}
          <TabsContent value="achievements" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {badgeCategories.map((cat: any) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="gap-1"
                >
                  <span>{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                </Button>
              ))}
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(allBadges.length > 0 ? allBadges : achievements).filter((badge: any) => 
                selectedCategory === 'all' || badge.category === selectedCategory
              ).map((badge: any, index: number) => {
                const isEarned = false;
                return (
                  <Card 
                    key={badge.id || index}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      isEarned 
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-300 shadow-md' 
                        : 'bg-gray-50 border-gray-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`text-4xl mb-2 ${!isEarned && 'grayscale'}`}>
                        {badge.badgeIcon || '🏅'}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{badge.name || badge.title}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{badge.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${badge.isRare ? 'bg-purple-100 text-purple-700' : ''}`}
                        >
                          {badge.isRare ? '✨ Rare' : badge.category}
                        </Badge>
                        <span className="text-xs font-bold text-yellow-600">+{badge.points} pts</span>
                      </div>
                      {isEarned && (
                        <div className="mt-2 text-green-600 text-xs font-medium flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Earned!
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Legacy achievements for fallback */}
            {allBadges.length === 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.id}
                    className={`cursor-pointer transition-all ${
                      achievement.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedAchievement(achievement.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <achievement.icon className={`w-8 h-8 ${
                          achievement.completed ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{achievement.category}</Badge>
                          <span className="font-bold text-yellow-600">+{achievement.points} XP</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Challenges */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="space-y-4">
              {challenges.map((challenge, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                        <p className="text-gray-600 mb-3">{challenge.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant={
                            challenge.difficulty === 'Easy' ? 'secondary' :
                            challenge.difficulty === 'Medium' ? 'default' : 'destructive'
                          }>
                            {challenge.difficulty}
                          </Badge>
                          <span className="text-gray-600">⏰ {challenge.timeLeft}</span>
                          <span className="text-yellow-600 font-medium">🎁 {challenge.reward}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress: {challenge.progress} / {challenge.target}</span>
                        <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} className="h-3" />
                      <Button className="w-full mt-3">
                        {challenge.progress === 0 ? 'Start Challenge' : 'Continue Challenge'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-6">
            {/* Period Filter */}
            <div className="flex gap-2 mb-4">
              {['daily', 'weekly', 'all-time'].map((period) => (
                <Button
                  key={period}
                  variant={leaderboardPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLeaderboardPeriod(period)}
                >
                  {period === 'all-time' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Global Leaderboard
                </CardTitle>
                <CardDescription>Top performers from around the world</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayLeaderboard.map((user: any) => (
                    <div 
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
                        user.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-amber-100 border border-yellow-300' :
                        user.rank === 2 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300' :
                        user.rank === 3 ? 'bg-gradient-to-r from-orange-50 to-amber-100 border border-orange-300' :
                        'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          user.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                          user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                          user.rank === 3 ? 'bg-orange-400 text-orange-900' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : `#${user.rank}`}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{user.flag}</span>
                            <h4 className="font-semibold">{user.username || user.name}</h4>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" /> {user.accuracy}%
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-500" /> {user.streak} days
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-primary">{user.points?.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Tasks */}
          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyTasks.map((task, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{task.task}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 font-medium">+{task.points} XP</span>
                          {task.completed && <Star className="w-4 h-4 text-green-600 fill-current" />}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{task.progress} / {task.target}</span>
                          <span>{Math.round((task.progress / task.target) * 100)}%</span>
                        </div>
                        <Progress value={(task.progress / task.target) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Daily Bonus Progress</h4>
                  <div className="flex justify-between text-sm text-blue-700 mb-1">
                    <span>Complete all tasks for bonus XP</span>
                    <span>1/4 completed</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  <div className="text-sm text-blue-600 mt-2">Bonus: +100 XP</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}