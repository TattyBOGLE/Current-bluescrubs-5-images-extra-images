import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards() {
  const { user } = useAuth();

  const { data: userAnswers = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "answers"],
    enabled: !!user?.id,
  });

  const { data: osceAttempts = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "osce-attempts"],
    enabled: !!user?.id,
  });

  const totalQuestions = userAnswers.length;
  const correctAnswers = userAnswers.filter((answer: any) => answer.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const completedStations = osceAttempts.filter((attempt: any) => attempt.completed).length;
  const averageOsceScore = osceAttempts.length > 0 
    ? Math.round(osceAttempts.reduce((sum: number, attempt: any) => sum + (attempt.score || 0), 0) / osceAttempts.length)
    : 0;

  const stats = [
    {
      title: "Questions Completed",
      value: totalQuestions.toString(),
      subtitle: "This week",
      icon: (
        <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
        </svg>
      ),
      bgColor: "bg-success/10",
      textColor: "text-success",
    },
    {
      title: "Accuracy Rate",
      value: `${accuracy}%`,
      subtitle: "Overall performance",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      title: "Study Streak",
      value: user?.studyStreak?.toString() || "0",
      subtitle: "Days in a row",
      icon: (
        <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
        </svg>
      ),
      bgColor: "bg-warning/10",
      textColor: "text-warning",
    },
    {
      title: "OSCE Stations",
      value: `${completedStations}/18`,
      subtitle: "Completed",
      icon: (
        <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
        </svg>
      ),
      bgColor: "bg-secondary/10",
      textColor: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <span className="text-sm text-muted-foreground">{stat.subtitle}</span>
            </div>
            
            <div className={`text-2xl font-bold mb-1 ${stat.textColor}`}>
              {stat.value}
            </div>
            
            <div className="text-sm font-medium text-foreground">
              {stat.title}
            </div>
            
            {index === 1 && accuracy > 0 && (
              <div className="text-xs text-success font-medium mt-2">
                {accuracy >= 80 ? "+Excellent!" : accuracy >= 60 ? "+Good progress" : "+Keep practicing"}
              </div>
            )}
            
            {index === 2 && user?.studyStreak && user.studyStreak > 7 && (
              <div className="text-xs text-warning font-medium mt-2">
                🔥 On fire!
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
