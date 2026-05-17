import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Globe, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface LeaderboardUser {
  id: number;
  username: string;
  country: string;
  city: string;
  flagEmoji: string;
  totalScore: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracyRate: number;
  studyStreak: number;
  rank: number;
}

export function Top10Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/scoreboard/global", { limit: 10 }],
    queryFn: async () => {
      const response = await fetch("/api/scoreboard/global?limit=10");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json() as LeaderboardUser[];
    }
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 10 Global Leaders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return (
      <div className="relative">
        <Trophy className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 drop-shadow-sm" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>
    );
    if (rank === 2) return <Medal className="h-5 w-5 md:h-6 md:w-6 text-gray-500 drop-shadow-sm" />;
    if (rank === 3) return <Award className="h-5 w-5 md:h-6 md:w-6 text-orange-500 drop-shadow-sm" />;
    return (
      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-300">
        <span className="text-xs md:text-sm font-bold text-blue-700">#{rank}</span>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3 px-3 md:px-6 md:pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 md:h-5 md:w-5 text-blue-800" />
            <span className="text-sm md:text-base text-black font-semibold">Top 10 Global Leaders</span>
          </div>
          <Link href="/global-scoreboard">
            <Button variant="outline" size="sm" className="text-xs md:text-sm text-blue-800 border-blue-400 hover:bg-blue-100 w-full sm:w-auto font-medium">
              <span className="hidden sm:inline">View Full Leaderboard</span>
              <span className="sm:hidden">Full Leaderboard</span>
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-3 md:px-6">
        <div className="space-y-1 md:space-y-2">
          {leaderboard?.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-2 md:p-3 rounded-lg transition-all duration-300 hover:shadow-md ${
                user.rank === 1 
                  ? 'bg-gradient-to-r from-yellow-50 via-yellow-100 to-gold-50 border-2 border-yellow-300 shadow-md' 
                  : user.rank === 2
                  ? 'bg-gradient-to-r from-gray-50 via-gray-100 to-slate-50 border-2 border-gray-300 shadow-sm'
                  : user.rank === 3
                  ? 'bg-gradient-to-r from-orange-50 via-orange-100 to-amber-50 border-2 border-orange-300 shadow-sm'
                  : user.rank <= 5
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:bg-blue-100'
                  : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-6 md:w-8 flex-shrink-0">
                  {getRankIcon(user.rank)}
                </div>
                <div className="flex items-center gap-1 md:gap-2 min-w-0 flex-1">
                  <span className="text-base md:text-xl flex-shrink-0">{user.flagEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm md:text-base truncate text-black">{user.username}</div>
                    <div className="text-sm truncate text-gray-800">{user.city}, {user.country}</div>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`font-bold text-sm md:text-base ${
                  user.rank === 1 ? 'text-amber-800' :
                  user.rank === 2 ? 'text-gray-900' :
                  user.rank === 3 ? 'text-orange-800' :
                  'text-blue-800'
                }`}>
                  {user.totalScore.toLocaleString()} pts
                </div>
                <div className="text-sm font-medium text-green-800">{user.accuracyRate}% accuracy</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200">
          <Link href="/global-scoreboard">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Globe className="h-4 w-4 mr-2" />
              View Interactive Global Map
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}