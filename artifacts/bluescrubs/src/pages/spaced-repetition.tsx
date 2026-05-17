import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Clock, Calendar, Target, Lightbulb, RotateCcw, 
  CheckCircle, AlertCircle, BookOpen, TrendingUp, Star 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SpacedRepetitionCard {
  id: string;
  questionId: number;
  specialty: string;
  difficulty: string;
  concept: string;
  nextReviewDate: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  lastReviewed: string;
  confidence: number;
  question: {
    content: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
}

interface StudySession {
  dueCards: SpacedRepetitionCard[];
  newCards: SpacedRepetitionCard[];
  reviewStats: {
    totalDue: number;
    completed: number;
    accuracy: number;
    averageConfidence: number;
  };
}

export default function SpacedRepetition() {
  const [currentCard, setCurrentCard] = useState<SpacedRepetitionCard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(3);
  const queryClient = useQueryClient();

  // Mock data for demonstration - replace with real API calls
  const session: StudySession = {
    dueCards: [
      {
        id: '1',
        questionId: 101,
        specialty: 'Cardiology',
        difficulty: 'intermediate',
        concept: 'Heart Failure Management',
        nextReviewDate: '2024-01-22',
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        lastReviewed: '2024-01-21',
        confidence: 3,
        question: {
          content: 'A 65-year-old patient presents with shortness of breath and ankle swelling. What is the first-line treatment for heart failure?',
          options: ['ACE inhibitors', 'Beta blockers', 'Diuretics', 'Digoxin'],
          correctAnswer: 'ACE inhibitors',
          explanation: 'ACE inhibitors are first-line treatment for heart failure as they reduce mortality and improve symptoms.'
        }
      }
    ],
    newCards: [],
    reviewStats: {
      totalDue: 1,
      completed: 0,
      accuracy: 0,
      averageConfidence: 3
    }
  };

  const schedule = [
    { date: '2024-01-22', dueCount: 5, newCount: 3 },
    { date: '2024-01-23', dueCount: 8, newCount: 2 },
    { date: '2024-01-24', dueCount: 3, newCount: 5 }
  ];

  const progressStats = {
    retentionRate: 85,
    masteryLevel: 72,
    specialties: {
      'Basic Level Questions': { retention: 92, mastery: 88 },
      'Intermediate + Guidelines': { retention: 85, mastery: 75 },
      'Advanced Multi-system': { retention: 78, mastery: 68 },
      'Multi-language Practice': { retention: 81, mastery: 73 }
    }
  };

  const isLoading = false;

  const reviewCardMutation = useMutation({
    mutationFn: (data: { cardId: string; confidence: number; correct: boolean; timeSpent: number }) =>
      apiRequest('/api/spaced-repetition/review', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spaced-repetition'] });
      toast({
        title: "Card reviewed",
        description: "Your progress has been updated",
      });
      nextCard();
    },
  });

  const resetCardMutation = useMutation({
    mutationFn: (cardId: string) =>
      apiRequest(`/api/spaced-repetition/reset/${cardId}`, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spaced-repetition'] });
      toast({
        title: "Card reset",
        description: "This concept will appear again soon",
      });
    },
  });

  const startSession = () => {
    if (session?.dueCards.length > 0) {
      setCurrentCard(session.dueCards[0]);
      setShowAnswer(false);
      setSelectedAnswer('');
      setConfidence(3);
    }
  };

  const nextCard = () => {
    if (!session) return;
    
    const allCards = [...session.dueCards, ...session.newCards];
    const currentIndex = allCards.findIndex(card => card.id === currentCard?.id);
    
    if (currentIndex < allCards.length - 1) {
      setCurrentCard(allCards[currentIndex + 1]);
      setShowAnswer(false);
      setSelectedAnswer('');
      setConfidence(3);
    } else {
      setCurrentCard(null);
      toast({
        title: "Session complete!",
        description: "Great job! Come back tomorrow for your next review session.",
      });
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const handleReview = (confidenceLevel: number) => {
    if (!currentCard) return;
    
    const isCorrect = selectedAnswer === currentCard.question.correctAnswer;
    const timeSpent = 30; // Would track actual time in real implementation
    
    reviewCardMutation.mutate({
      cardId: currentCard.id,
      confidence: confidenceLevel,
      correct: isCorrect,
      timeSpent
    });
  };

  const getConfidenceColor = (level: number) => {
    if (level >= 4) return 'text-green-600';
    if (level >= 3) return 'text-blue-600';
    if (level >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIntervalText = (interval: number) => {
    if (interval === 1) return 'Tomorrow';
    if (interval < 7) return `${interval} days`;
    if (interval < 30) return `${Math.floor(interval / 7)} weeks`;
    return `${Math.floor(interval / 30)} months`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Spaced Repetition Learning
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Scientifically optimised review system for long-term retention
          </p>
        </div>

        {!currentCard ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Due Today</p>
                        <p className="text-3xl font-bold text-red-600">
                          {session?.reviewStats.totalDue || 0}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">New Cards</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {session?.newCards.length || 0}
                        </p>
                      </div>
                      <BookOpen className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Accuracy</p>
                        <p className="text-3xl font-bold text-green-600">
                          {session?.reviewStats.accuracy?.toFixed(1) || 0}%
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-500" />
                    Start Learning Session
                  </CardTitle>
                  <CardDescription>
                    Review due cards and learn new concepts with optimized timing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    {session?.reviewStats.totalDue > 0 ? (
                      <div>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                          You have {session.reviewStats.totalDue} cards due for review
                        </p>
                        <Button onClick={startSession} size="lg" className="bg-green-600 hover:bg-green-700">
                          <Brain className="h-5 w-5 mr-2" />
                          Start Review Session
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          All Caught Up!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          No cards are due for review right now. Come back later or practice more questions to add new cards.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-blue-500" />
                    Review Schedule
                  </CardTitle>
                  <CardDescription>
                    Upcoming review sessions optimized for retention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {schedule ? (
                    <div className="space-y-4">
                      {schedule.map((day: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {new Date(day.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {day.specialties.join(', ')}
                            </p>
                          </div>
                          <Badge variant={day.priority === 'high' ? 'destructive' : 'secondary'}>
                            {day.dueCount} cards
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">
                        No scheduled reviews yet. Start practicing to build your review schedule.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                    Learning Progress
                  </CardTitle>
                  <CardDescription>
                    Track your retention and mastery over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {progressStats ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Retention Rate</h3>
                          <Progress value={progressStats.retentionRate} className="h-3" />
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {progressStats.retentionRate}% - Excellent long-term memory
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Mastery Level</h3>
                          <Progress value={progressStats.masteryLevel} className="h-3" />
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {progressStats.masteryLevel}% concepts mastered
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-4">Specialty Progress</h3>
                        <div className="space-y-3">
                          {Object.entries(progressStats.specialties).map(([specialtyName, stats]: [string, any]) => (
                            <div key={specialtyName} className="flex items-center justify-between">
                              <span className="capitalize">{specialtyName}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={stats.mastery} className="h-2 w-24" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {stats.mastery}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Progress data will appear as you complete more review sessions
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">
                    {currentCard.specialty}
                  </Badge>
                  <Badge variant={currentCard.difficulty === 'hard' ? 'destructive' : 'secondary'}>
                    {currentCard.difficulty}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Next review: {getIntervalText(currentCard.interval)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetCardMutation.mutate(currentCard.id)}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Card
                </Button>
              </div>
              <Progress 
                value={((session?.reviewStats.completed || 0) / (session?.reviewStats.totalDue || 1)) * 100} 
                className="h-2"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {currentCard.question.content}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {currentCard.question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        showAnswer
                          ? option === currentCard.question.correctAnswer
                            ? 'default'
                            : selectedAnswer === option
                            ? 'destructive'
                            : 'outline'
                          : selectedAnswer === option
                          ? 'default'
                          : 'outline'
                      }
                      className="justify-start text-left h-auto p-4"
                      onClick={() => !showAnswer && handleAnswer(option)}
                      disabled={showAnswer}
                    >
                      <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                      {showAnswer && option === currentCard.question.correctAnswer && (
                        <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                      )}
                      {showAnswer && selectedAnswer === option && option !== currentCard.question.correctAnswer && (
                        <AlertCircle className="h-4 w-4 ml-auto text-red-600" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {showAnswer && (
                <div className="border-t pt-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      <Lightbulb className="h-4 w-4 inline mr-2" />
                      Explanation
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200">
                      {currentCard.question.explanation}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      How confident do you feel about this concept?
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { level: 1, label: 'Again', color: 'bg-red-500 hover:bg-red-600' },
                        { level: 2, label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600' },
                        { level: 3, label: 'Good', color: 'bg-blue-500 hover:bg-blue-600' },
                        { level: 4, label: 'Easy', color: 'bg-green-500 hover:bg-green-600' }
                      ].map(({ level, label, color }) => (
                        <Button
                          key={level}
                          onClick={() => handleReview(level)}
                          className={`${color} text-white`}
                          disabled={reviewCardMutation.isPending}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      This affects when you'll see this card next
                    </p>
                  </div>
                </div>
              )}

              {!showAnswer && selectedAnswer && (
                <div className="text-center">
                  <Button onClick={() => setShowAnswer(true)} size="lg">
                    Show Answer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}