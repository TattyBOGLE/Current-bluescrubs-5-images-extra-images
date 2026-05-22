import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Target, Clock, Brain, Award, 
  Calendar, Book, Star, Zap, CheckCircle, XCircle, MessageCircle, Bot 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  userId: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  averageTimePerQuestion: number;
  studyStreak: number;
  specialtyBreakdown: Record<string, {
    total: number;
    correct: number;
    accuracy: number;
    weaknessScore: number;
    improvementTrend: number;
  }>;
  weeklyProgress: {
    questionsThisWeek: number;
    accuracyThisWeek: number;
    timeStudiedThisWeek: number;
  };
  recommendations: string[];
  achievements: Array<{
    id: number;
    name: string;
    description: string;
    unlockedAt: Date;
    category: string;
    points: number;
  }>;
}

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  
  // Tutor state for analytics insights
  const [showAITutor, setShowAITutor] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [tutorInput, setTutorInput] = useState('');
  const [isLoadingTutorResponse, setIsLoadingTutorResponse] = useState(false);
  
  // Tutor functionality for analytics insights
  const handleAskTutor = async (question: string) => {
    if (!question.trim()) return;
    
    const userMessage = { role: 'user' as const, content: question };
    setTutorMessages(prev => [...prev, userMessage]);
    setTutorInput('');
    setIsLoadingTutorResponse(true);

    try {
      const context = analytics ? {
        analyticsType: 'Performance Analytics',
        accuracyRate: analytics.accuracyRate,
        totalQuestions: analytics.totalQuestions,
        correctAnswers: analytics.correctAnswers,
        studyStreak: analytics.studyStreak,
        specialtyBreakdown: analytics.specialtyBreakdown,
        recommendations: analytics.recommendations
      } : { analyticsType: 'Performance Analytics General' };

      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context,
          specialty: 'study-analytics',
          examType: 'performance-improvement'
        })
      });

      if (!response.ok) throw new Error('Failed to get tutor response');
      
      const data = await response.json();
      const assistantMessage = { role: 'assistant' as const, content: data.response };
      setTutorMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Tutor error:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'I apologize, but I encountered an error. Please try asking your question again.' 
      };
      setTutorMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoadingTutorResponse(false);
    }
  };

  // Mock data for demonstration
  const analytics: AnalyticsData = {
    userId: 1,
    totalQuestions: 1247,
    correctAnswers: 934,
    accuracyRate: 75,
    averageTimePerQuestion: 42,
    studyStreak: 12,
    specialtyBreakdown: {
      'Cardiology': {
        total: 156,
        correct: 134,
        accuracy: 86,
        weaknessScore: 14,
        improvementTrend: 8
      },
      'Respiratory': {
        total: 142,
        correct: 98,
        accuracy: 69,
        weaknessScore: 31,
        improvementTrend: -5
      },
      'Neurology': {
        total: 134,
        correct: 89,
        accuracy: 66,
        weaknessScore: 34,
        improvementTrend: 12
      },
      'Gastroenterology': {
        total: 128,
        correct: 102,
        accuracy: 80,
        weaknessScore: 20,
        improvementTrend: 3
      }
    },
    weeklyProgress: {
      questionsThisWeek: 147,
      accuracyThisWeek: 78,
      timeStudiedThisWeek: 1260
    },
    recommendations: [
      "Focus on Basic level questions across all specialties to build foundation knowledge",
      "Advanced level questions show excellent engagement - continue challenging yourself",
      "Intermediate questions with NICE/BTS guidelines showing strong performance",
      "Multi-language practice sessions improving comprehension scores by 15%"
    ],
    achievements: [
      {
        id: 1,
        name: "Three-Level Mastery",
        description: "Completed Basic, Intermediate, and Advanced levels",
        unlockedAt: new Date(),
        category: "Progression",
        points: 300
      },
      {
        id: 2,
        name: "Guidelines Expert",
        description: "Perfect score on NICE/BTS guideline questions",
        unlockedAt: new Date(),
        category: "Medical Knowledge",
        points: 250
      },
      {
        id: 3,
        name: "Multi-Language Scholar",
        description: "Practiced in 5+ languages",
        unlockedAt: new Date(),
        category: "Language",
        points: 200
      }
    ]
  };

  const performanceHistory = [
    { date: '2024-01-15', accuracy: 72, questionsAnswered: 25 },
    { date: '2024-01-16', accuracy: 74, questionsAnswered: 30 },
    { date: '2024-01-17', accuracy: 78, questionsAnswered: 28 },
    { date: '2024-01-18', accuracy: 75, questionsAnswered: 32 },
    { date: '2024-01-19', accuracy: 80, questionsAnswered: 35 },
    { date: '2024-01-20', accuracy: 77, questionsAnswered: 29 },
    { date: '2024-01-21', accuracy: 82, questionsAnswered: 38 }
  ];

  const studyHeatmap = Array.from({ length: 28 }, (_, i) => ({
    date: `2024-01-${i + 1}`,
    questions: Math.floor(Math.random() * 40),
    intensity: Math.floor(Math.random() * 5)
  }));

  const isLoading = false;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-blue-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0.1) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < -0.1) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Target className="h-4 w-4 text-gray-500" />;
  };

  const getWeaknessLevel = (score: number) => {
    if (score < 0.3) return { level: 'Strong', color: 'bg-green-500' };
    if (score < 0.6) return { level: 'Good', color: 'bg-blue-500' };
    if (score < 0.8) return { level: 'Needs Work', color: 'bg-yellow-500' };
    return { level: 'Critical', color: 'bg-red-500' };
  };

  const specialtyColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', 
    '#00c49f', '#ffbb28', '#ff8042', '#8dd1e1', '#d084d0'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Analytics Data Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Start practicing questions to see your detailed performance analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Performance Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Detailed insights into your PLAB 1 preparation
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Questions</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalQuestions.toLocaleString()}
                  </p>
                </div>
                <Book className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Accuracy</p>
                  <p className={`text-3xl font-bold ${getAccuracyColor(analytics.accuracyRate)}`}>
                    {analytics.accuracyRate.toFixed(1)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Time/Question</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {Math.round(analytics.averageTimePerQuestion)}s
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Study Streak</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {analytics.studyStreak}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="tutor">Tutor</TabsTrigger>
            <TabsTrigger value="recommendations">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                  <CardDescription>Your progress over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Questions This Week</span>
                        <span className="font-semibold">{analytics.weeklyProgress.questionsThisWeek}</span>
                      </div>
                      <Progress value={(analytics.weeklyProgress.questionsThisWeek / 100) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Weekly Accuracy</span>
                        <span className={`font-semibold ${getAccuracyColor(analytics.weeklyProgress.accuracyThisWeek)}`}>
                          {analytics.weeklyProgress.accuracyThisWeek.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={analytics.weeklyProgress.accuracyThisWeek} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Study Time</span>
                        <span className="font-semibold">{Math.floor(analytics.weeklyProgress.timeStudiedThisWeek / 60)}h {analytics.weeklyProgress.timeStudiedThisWeek % 60}m</span>
                      </div>
                      <Progress value={(analytics.weeklyProgress.timeStudiedThisWeek / 480) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>7-day performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  {performanceHistory ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="accuracy" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="questionsAnswered" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-500">
                      Performance data will appear as you practice more
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Study Heatmap</CardTitle>
                <CardDescription>Your daily study activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {studyHeatmap?.map((day: any, index: number) => (
                    <div
                      key={index}
                      className={`h-8 rounded text-xs flex items-center justify-center ${
                        day.intensity === 0 ? 'bg-gray-100 dark:bg-gray-800' :
                        day.intensity === 1 ? 'bg-green-100 dark:bg-green-900' :
                        day.intensity === 2 ? 'bg-green-200 dark:bg-green-800' :
                        day.intensity === 3 ? 'bg-green-300 dark:bg-green-700' :
                        'bg-green-400 dark:bg-green-600'
                      }`}
                      title={`${day.date}: ${day.questions} questions`}
                    >
                      {day.questions > 0 && <span className="text-xs">{day.questions}</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specialties" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Specialty Performance</CardTitle>
                  <CardDescription>Accuracy by medical specialty</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(analytics.specialtyBreakdown).map(([name, data]) => ({
                      name: name.charAt(0).toUpperCase() + name.slice(1),
                      accuracy: data.accuracy,
                      total: data.total
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="accuracy" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Question Distribution</CardTitle>
                  <CardDescription>Questions attempted by specialty</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics.specialtyBreakdown).map(([name, data], index) => ({
                          name: name.charAt(0).toUpperCase() + name.slice(1),
                          value: data.total,
                          fill: specialtyColors[index % specialtyColors.length]
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(analytics.specialtyBreakdown).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={specialtyColors[index % specialtyColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Specialty Analysis</CardTitle>
                <CardDescription>Comprehensive breakdown with improvement trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.specialtyBreakdown).map(([specialty, data]) => {
                    const weakness = getWeaknessLevel(data.weaknessScore);
                    return (
                      <div key={specialty} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold capitalize">{specialty}</h3>
                            <Badge variant="outline" className={weakness.color}>
                              {weakness.level}
                            </Badge>
                            {getTrendIcon(data.improvementTrend)}
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getAccuracyColor(data.accuracy)}`}>
                              {data.accuracy.toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {data.correct}/{data.total} correct
                            </p>
                          </div>
                        </div>
                        <Progress value={data.accuracy} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Long-term Progress</CardTitle>
                <CardDescription>Your improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  {['7d', '30d', '90d', 'all'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedPeriod === period
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {period === 'all' ? 'All Time' : period.toUpperCase()}
                    </button>
                  ))}
                </div>
                {performanceHistory ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={performanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="accuracy" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="speed" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-96 flex items-center justify-center text-gray-500">
                    More data will appear as you continue practicing
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-500" />
                  Achievement Gallery
                </CardTitle>
                <CardDescription>
                  Your earned badges and milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analytics.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Star className="h-8 w-8 text-yellow-500" />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {achievement.name}
                            </h3>
                            <Badge variant="outline">{achievement.points} points</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Achievements Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Keep practicing to earn your first achievement badge!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutor" className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-purple-800">AI Performance Tutor</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAITutor(!showAITutor)}
                  >
                    {showAITutor ? 'Hide' : 'Show'} Tutor
                  </Button>
                </div>
                <CardDescription className="text-purple-600">
                  Get personalised insights about your study performance and improvement strategies
                </CardDescription>
              </CardHeader>
              
              {showAITutor && (
                <CardContent className="p-4">
                  <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {tutorMessages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Ask me about your performance analytics and study strategies!</p>
                        <p className="text-sm mt-1">Examples: "How can I improve my weak areas?" or "What's my best study schedule?"</p>
                      </div>
                    )}
                    {tutorMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoadingTutorResponse && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Tutor is analyzing your performance...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tutorInput}
                      onChange={(e) => setTutorInput(e.target.value)}
                      placeholder="Ask about your performance, study strategies, or improvement tips..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAskTutor(tutorInput);
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleAskTutor(tutorInput)}
                      disabled={!tutorInput.trim() || isLoadingTutorResponse}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-500" />
                  Smart Insights
                </CardTitle>
                <CardDescription>
                  Personalised recommendations for improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-900 dark:text-white">{recommendation}</p>
                    </div>
                  ))}
                  {analytics.recommendations.length === 0 && (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Answer more questions to receive personalised insights
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}