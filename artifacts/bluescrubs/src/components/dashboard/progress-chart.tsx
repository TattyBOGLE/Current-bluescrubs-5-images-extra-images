import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProgressChart() {
  const { user } = useAuth();

  const { data: userAnswers = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "answers"],
    enabled: !!user?.id,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "progress"],
    enabled: !!user?.id,
  });

  // Generate weekly data from user answers
  const generateWeeklyData = () => {
    const now = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayAnswers = userAnswers.filter((answer: any) => {
        const answerDate = new Date(answer.answeredAt);
        return answerDate.toDateString() === date.toDateString();
      });
      
      const correct = dayAnswers.filter((answer: any) => answer.isCorrect).length;
      const total = dayAnswers.length;
      
      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        correct,
        total,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      });
    }
    
    return weekData;
  };

  const weeklyData = generateWeeklyData();
  const totalCorrect = userAnswers.filter((answer: any) => answer.isCorrect).length;
  const totalAnswers = userAnswers.length;
  const overallAccuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Progress Overview
          <Tabs defaultValue="daily" className="w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsContent value="daily" className="space-y-6">
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">{overallAccuracy}%</span>
                </div>
                <h3 className="font-medium text-foreground">Overall Accuracy</h3>
                <p className="text-sm text-muted-foreground">{totalCorrect}/{totalAnswers} correct</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-success">{weeklyData[6]?.total || 0}</span>
                </div>
                <h3 className="font-medium text-foreground">Today's Questions</h3>
                <p className="text-sm text-muted-foreground">{weeklyData[6]?.accuracy || 0}% accuracy</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-secondary">{user?.studyStreak || 0}</span>
                </div>
                <h3 className="font-medium text-foreground">Study Streak</h3>
                <p className="text-sm text-muted-foreground">Days in a row</p>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h4 className="font-medium mb-4">This Week's Performance</h4>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-muted-foreground">
                      {day.day}
                    </div>
                    <div className="flex-1 bg-background rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-success h-6 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(day.accuracy, 5)}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {day.total > 0 ? `${day.correct}/${day.total} (${day.accuracy}%)` : "No practice"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Weekly Analytics</h3>
              <p className="text-muted-foreground">
                Complete more practice sessions to see your weekly trends and patterns.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Monthly Overview</h3>
              <p className="text-muted-foreground">
                Monthly performance insights will appear as you continue your PLAB preparation journey.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
