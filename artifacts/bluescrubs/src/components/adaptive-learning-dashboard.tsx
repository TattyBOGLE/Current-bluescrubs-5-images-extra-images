import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  BarChart3,
  Lightbulb,
  Trophy
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AdaptiveDashboardProps {
  userId: number;
}

export function AdaptiveLearningDashboard({ userId }: AdaptiveDashboardProps) {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(0);
  const queryClient = useQueryClient();

  // Get user analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: [`/api/adaptive/analytics/${userId}`],
    enabled: !!userId
  });

  // Get adaptive AI stats
  const { data: aiStats } = useQuery({
    queryKey: ['/api/adaptive/stats']
  });

  // Start adaptive session
  const startSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/adaptive/start-session", {
        userId,
        existingPerformance: analytics?.overallPerformance || []
      });
      return response.json();
    },
    onSuccess: (data) => {
      setActiveSession(data.sessionId);
      queryClient.invalidateQueries({ queryKey: [`/api/adaptive/analytics/${userId}`] });
    }
  });

  // Process answer
  const processAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer, timeSpent }: { questionId: string; answer: string; timeSpent: number }) => {
      const response = await apiRequest("POST", "/api/adaptive/process-answer", {
        sessionId: activeSession,
        questionId,
        selectedAnswer: answer,
        timeSpent
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentQuestion(null);
      setSelectedAnswer("");
      queryClient.invalidateQueries({ queryKey: [`/api/adaptive/analytics/${userId}`] });
      
      // Set next question if available
      if (data.nextQuestions && data.nextQuestions.length > 0) {
        setCurrentQuestion(data.nextQuestions[0]);
        setStartTime(Date.now());
      }
    }
  });

  const handleStartSession = () => {
    startSessionMutation.mutate();
  };

  const handleAnswerSubmit = () => {
    if (!currentQuestion || !selectedAnswer || !activeSession) return;
    
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    processAnswerMutation.mutate({
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      timeSpent
    });
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'highly-ready': return 'text-green-600 bg-green-100';
      case 'likely-ready': return 'text-blue-600 bg-blue-100';
      case 'needs-work': return 'text-yellow-600 bg-yellow-100';
      case 'not-ready': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatReadinessLevel = (level: string) => {
    return level.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (analyticsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading adaptive analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-2 text-black">
          <Brain className="h-8 w-8 text-primary" />
          Adaptive Learning Dashboard
        </h1>
        <p className="text-lg text-black">
          Intelligent learning system that adapts to your performance patterns
        </p>
      </div>

      {!activeSession ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Start Adaptive Learning Session
            </CardTitle>
            <CardDescription>
              Begin an intelligent learning session that adapts to your strengths and weaknesses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold text-black">Adaptive Questions</h3>
                <p className="text-sm text-black">Difficulty adjusts to your performance</p>
              </div>
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <h3 className="font-semibold text-black">Weakness Detection</h3>
                <p className="text-sm text-black">Real-time identification of knowledge gaps</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-black">Performance Prediction</h3>
                <p className="text-sm text-black">ML-powered exam success forecasting</p>
              </div>
            </div>
            
            <Button 
              onClick={handleStartSession} 
              className="w-full"
              disabled={startSessionMutation.isPending}
            >
              {startSessionMutation.isPending ? 'Starting...' : 'Start Adaptive Session'}
            </Button>
          </CardContent>
        </Card>
      ) : currentQuestion ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Adaptive Question</span>
              <Badge variant="secondary">{currentQuestion.difficulty}</Badge>
            </CardTitle>
            <CardDescription>{currentQuestion.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-lg mb-4">{currentQuestion.question}</p>
              
              <div className="space-y-2">
                {currentQuestion.options?.map((option: string, index: number) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="text-primary"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer || processAnswerMutation.isPending}
              className="w-full"
            >
              {processAnswerMutation.isPending ? 'Processing...' : 'Submit Answer'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Alert className="mb-8">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Session active! Processing your performance to select the next optimal question...
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
          <TabsTrigger value="recommendations">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Total Questions</span>
                      <span className="text-lg font-bold">{analytics?.overallPerformance?.length || 0}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Average Accuracy</span>
                      <span className="text-lg font-bold">
                        {analytics?.overallPerformance?.length 
                          ? Math.round(analytics.overallPerformance.reduce((sum: number, p: any) => sum + p.accuracy, 0) / analytics.overallPerformance.length * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Topics Covered</span>
                      <span className="text-lg font-bold">
                        {analytics?.overallPerformance 
                          ? new Set(analytics.overallPerformance.map((p: any) => p.topic)).size
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics?.sessionHistory?.slice(0, 3).map((session: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <span className="text-sm font-medium">{session.questionsAnswered} questions</span>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(session.accuracy * 100)}% accuracy
                        </p>
                      </div>
                      <Badge variant="outline">{session.topicsExplored?.length || 0} topics</Badge>
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground">No session history available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  AI Engine Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant={aiStats?.initialized ? "default" : "secondary"}>
                      {aiStats?.initialized ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Sessions</span>
                    <span className="font-medium">{aiStats?.activeSessions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Question Bank</span>
                    <span className="font-medium">{aiStats?.questionBankSize || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Templates</span>
                    <span className="font-medium">{aiStats?.generationStats?.totalTemplates || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weaknesses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Weakness Analysis
              </CardTitle>
              <CardDescription>
                AI-identified knowledge gaps requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.weaknessAnalysis ? (
                <div className="space-y-6">
                  {analytics.weaknessAnalysis.criticalWeaknesses?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-red-600 mb-3">Critical Weaknesses</h3>
                      <div className="space-y-3">
                        {analytics.weaknessAnalysis.criticalWeaknesses.map((weakness: any, index: number) => (
                          <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{weakness.topic}</h4>
                              <Badge variant="destructive">{Math.round(weakness.weaknessScore)}% error rate</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {weakness.questionsAttempted} questions attempted
                            </p>
                            {weakness.commonMistakes?.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-1">Common mistakes:</p>
                                <ul className="text-sm text-muted-foreground">
                                  {weakness.commonMistakes.slice(0, 2).map((mistake: string, idx: number) => (
                                    <li key={idx}>• {mistake}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analytics.weaknessAnalysis.moderateWeaknesses?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-yellow-600 mb-3">Areas for Improvement</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analytics.weaknessAnalysis.moderateWeaknesses.slice(0, 4).map((weakness: any, index: number) => (
                          <div key={index} className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-sm">{weakness.topic}</h4>
                              <Badge variant="outline">{Math.round(weakness.weaknessScore)}%</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {weakness.questionsAttempted} questions • {weakness.improvementTrend}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analytics.weaknessAnalysis.improvingAreas?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-green-600 mb-3">Improving Areas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analytics.weaknessAnalysis.improvingAreas.slice(0, 4).map((area: any, index: number) => (
                          <div key={index} className="border border-green-200 rounded-lg p-3 bg-green-50">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-sm">{area.topic}</h4>
                              <Badge variant="outline" className="text-green-600">Improving</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Great progress in this area!
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">Overall Weakness Score</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={100 - analytics.weaknessAnalysis.overallWeaknessScore} className="flex-1" />
                      <span className="font-bold">{100 - analytics.weaknessAnalysis.overallWeaknessScore}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Knowledge strength across all topics
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Complete more questions to generate weakness analysis</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Exam Success Prediction
              </CardTitle>
              <CardDescription>
                ML-powered analysis of your exam readiness
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.examPrediction ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary mb-2">
                      {analytics.examPrediction.successProbability}%
                    </div>
                    <Badge className={getReadinessColor(analytics.examPrediction.readinessLevel)} variant="secondary">
                      {formatReadinessLevel(analytics.examPrediction.readinessLevel)}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Confidence interval: {analytics.examPrediction.confidenceInterval.min}% - {analytics.examPrediction.confidenceInterval.max}%
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time to Readiness
                      </h3>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="text-2xl font-bold">
                          {analytics.examPrediction.timeToReadiness === 0 ? 'Ready now!' : `${analytics.examPrediction.timeToReadiness} days`}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {analytics.examPrediction.timeToReadiness === 0 
                            ? 'You are exam-ready based on current performance'
                            : 'Estimated time to reach 80% readiness'
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Strengths
                      </h3>
                      <div className="space-y-2">
                        {analytics.examPrediction.strengthAreas?.length > 0 ? (
                          analytics.examPrediction.strengthAreas.map((strength: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{strength}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Complete more questions to identify strengths</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {analytics.examPrediction.keyImprovementAreas?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Key Improvement Areas</h3>
                      <div className="space-y-2">
                        {analytics.examPrediction.keyImprovementAreas.map((area: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Complete more questions to generate exam prediction</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Adaptive Recommendations
              </CardTitle>
              <CardDescription>
                Personalized study guidance based on your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.adaptiveRecommendations || analytics?.weaknessAnalysis ? (
                <div className="space-y-6">
                  {analytics.weaknessAnalysis?.recommendedActions?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Immediate Actions</h3>
                      <div className="space-y-3">
                        {analytics.weaknessAnalysis.recommendedActions.map((action: string, index: number) => (
                          <Alert key={index}>
                            <Lightbulb className="h-4 w-4" />
                            <AlertDescription>{action}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {analytics.adaptiveRecommendations && (
                    <div>
                      <h3 className="font-semibold mb-3">Study Plan Recommendations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Next Difficulty Level</h4>
                          <Badge variant="outline" className="capitalize">
                            {analytics.adaptiveRecommendations.nextDifficulty}
                          </Badge>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Recommended Questions</h4>
                          <span className="text-lg font-bold">
                            {analytics.adaptiveRecommendations.recommendedQuestions}
                          </span>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Confidence Score</h4>
                          <div className="flex items-center gap-2">
                            <Progress value={analytics.adaptiveRecommendations.confidenceScore} className="flex-1" />
                            <span className="font-bold">{analytics.adaptiveRecommendations.confidenceScore}%</span>
                          </div>
                        </div>
                        
                        {analytics.adaptiveRecommendations.focusTopics?.length > 0 && (
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Focus Topics</h4>
                            <div className="flex flex-wrap gap-1">
                              {analytics.adaptiveRecommendations.focusTopics.slice(0, 3).map((topic: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Start an adaptive session to receive personalized recommendations</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}