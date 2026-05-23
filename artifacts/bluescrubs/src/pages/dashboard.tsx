import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { User } from "@shared/schema";
import { Flame, Award } from "lucide-react";
import dashboardHeroImage from '@assets/B584B977-70BB-4134-8338-FD9B4B07B0D0_1750518606574.jpg';
import type { UserStats } from "@/lib/types";

// Mock user for demo - in real app this would come from auth
const DEMO_USER: User = {
  id: 1,
  email: "demo@example.com",
  username: "Dr. Sarah Ahmed",
  password: "",
  currentStage: "plab1",
  studyStreak: 12,
  totalPoints: 2847,
  country: "UK",
  city: "London",
  flagEmoji: "🇬🇧",
  timezone: "Europe/London",
  isLocationPublic: true,
  createdAt: new Date()
};

export default function Dashboard() {
  const user = DEMO_USER;

  const { data: userStats } = useQuery<UserStats>({
    queryKey: ["/api/users", user.id, "stats"],
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/users", user.id, "progress"],
  });

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Dashboard Hero Section */}
      <section className="relative min-h-[400px] overflow-hidden dashboard-hero">
        <img 
          src={dashboardHeroImage}
          alt="Medical Dashboard"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700/40 to-teal-500/30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center hero-text-white">
            <h1 className="font-bold mb-6" style={{color: 'white', fontSize: '2.25rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.6)'}}>
              Welcome back, {user.username.split(' ')[1]}!
            </h1>
            <p className="mb-2" style={{color: 'white', fontSize: '1.125rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.6)'}}>
              {currentDate} • Ready to continue your PLAB journey?
            </p>
            
            <div className="flex justify-center gap-4 mt-8">
              <div className="bg-white/30 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/50">
                <div className="flex items-center space-x-2 mb-1">
                  <Flame className="w-5 h-5" style={{color: 'white'}} />
                  <span className="font-medium" style={{color: 'white', fontSize: '0.875rem', textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>Day Streak</span>
                </div>
                <div className="font-bold" style={{color: 'white', fontSize: '1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{user.studyStreak}</div>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/50">
                <div className="flex items-center space-x-2 mb-1">
                  <Award className="w-5 h-5" style={{color: 'white'}} />
                  <span className="font-medium" style={{color: 'white', fontSize: '0.875rem', textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>Total Points</span>
                </div>
                <div className="font-bold" style={{color: 'white', fontSize: '1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{user.totalPoints.toLocaleString()}</div>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/50">
                <div className="flex items-center space-x-2 mb-1">
                  <span style={{fontSize: '1.5rem'}}>📚</span>
                  <span className="font-medium" style={{color: 'white', fontSize: '0.875rem', textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>Questions Correct</span>
                </div>
                <div className="font-bold" style={{color: 'white', fontSize: '1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>0</div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Link href="/plab1-new">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3">
                  Continue PLAB 1
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Questions Answered Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Questions Answered</h3>
                <div className="text-3xl font-bold text-gray-900 mt-1">0</div>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats?.totalAnswered || 0}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">📝</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userStats?.totalAnswered ? Math.round((userStats.correctAnswers / userStats.totalAnswered) * 100) : 0}%
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">🎯</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{user.studyStreak} days</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600">🔥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">{user.totalPoints.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600">🏆</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to display</p>
              <Link href="/plab1-new">
                <Button className="mt-4">Start Practicing</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}