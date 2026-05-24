import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, Brain, CheckCircle, AlertTriangle, TrendingUp, BookOpen } from "lucide-react";

export default function SmartPlanner() {
  const [selectedWeek, setSelectedWeek] = useState(1);

  const studyPlan = {
    totalWeeks: 12,
    currentWeek: 3,
    examDate: "2024-08-15",
    overallProgress: 67,
    weeklyGoals: {
      questionsPerDay: 45,
      studyHours: 3,
      topicsToComplete: 2
    }
  };

  const weeklySchedule = [
    {
      week: 1,
      theme: "Foundation Building",
      progress: 100,
      topics: ["Cardiology Basics", "Respiratory Fundamentals"],
      questionsCompleted: 315,
      hoursStudied: 21,
      status: "completed"
    },
    {
      week: 2,
      theme: "System Integration",
      progress: 100,
      topics: ["Gastroenterology", "Endocrinology Intro"],
      questionsCompleted: 298,
      hoursStudied: 19,
      status: "completed"
    },
    {
      week: 3,
      theme: "Clinical Application",
      progress: 75,
      topics: ["Emergency Medicine", "Neurology Basics"],
      questionsCompleted: 234,
      hoursStudied: 16,
      status: "current"
    },
    {
      week: 4,
      theme: "Diagnostic Skills",
      progress: 0,
      topics: ["Radiology Interpretation", "Laboratory Values"],
      questionsCompleted: 0,
      hoursStudied: 0,
      status: "upcoming"
    }
  ];

  const dailyTasks = [
    {
      day: "Monday",
      date: "June 24",
      tasks: [
        { time: "09:00", subject: "Cardiology", type: "Questions", duration: "45 min", completed: true },
        { time: "14:00", subject: "Emergency Medicine", type: "Theory Review", duration: "30 min", completed: true },
        { time: "19:00", subject: "Mixed Practice", type: "Mock Test", duration: "60 min", completed: false }
      ]
    },
    {
      day: "Tuesday", 
      date: "June 25",
      tasks: [
        { time: "09:00", subject: "Respiratory", type: "Questions", duration: "45 min", completed: false },
        { time: "15:00", subject: "Pharmacology", type: "Flashcards", duration: "20 min", completed: false },
        { time: "20:00", subject: "Previous Errors", type: "Review", duration: "40 min", completed: false }
      ]
    }
  ];

  const smartRecommendations = [
    {
      type: "priority",
      icon: AlertTriangle,
      title: "Catch up on Neurology",
      description: "You're behind schedule on neurology topics. Recommend 1 extra hour this week.",
      action: "Add Session"
    },
    {
      type: "optimization",
      icon: TrendingUp,
      title: "Peak Performance Time",
      description: "Your accuracy is highest between 9-11 AM. Schedule difficult topics then.",
      action: "Optimize Schedule"
    },
    {
      type: "maintenance",
      icon: CheckCircle,
      title: "Strong in Cardiology",
      description: "Excellent progress in cardiology. Reduce daily allocation to maintain level.",
      action: "Adjust Plan"
    }
  ];

  const studyMetrics = [
    { label: "Daily Average", value: "2.8 hours", target: "3.0 hours", percentage: 93 },
    { label: "Questions/Day", value: "42", target: "45", percentage: 93 },
    { label: "Accuracy Rate", value: "78%", target: "80%", percentage: 98 },
    { label: "Topics Completed", value: "8/12", target: "12", percentage: 67 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Smart Study Planner</h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            smart study planning that adapts to your progress, optimizes your schedule, 
            and ensures you're exam-ready by your target date.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {studyMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-600">{metric.label}</div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target: {metric.target}</span>
                    <span>{metric.percentage}%</span>
                  </div>
                  <Progress value={metric.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weekly Plan */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Target className="w-5 h-5" />
                  12-Week Study Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklySchedule.map((week) => (
                    <div 
                      key={week.week}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        week.status === 'current' ? 'bg-indigo-50 border-indigo-200' :
                        week.status === 'completed' ? 'bg-green-50 border-green-200' :
                        'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedWeek(week.week)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            week.status === 'current' ? 'bg-indigo-600 text-white' :
                            week.status === 'completed' ? 'bg-green-600 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {week.week}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Week {week.week}: {week.theme}</h3>
                            <p className="text-sm text-gray-600">{week.topics.join(", ")}</p>
                          </div>
                        </div>
                        <Badge variant={
                          week.status === 'current' ? 'default' :
                          week.status === 'completed' ? 'secondary' : 'outline'
                        }>
                          {week.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{week.questionsCompleted} questions</span>
                        <span>{week.hoursStudied}h studied</span>
                        <div className="ml-auto">
                          <Progress value={week.progress} className="w-20 h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Clock className="w-5 h-5" />
                  This Week's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dailyTasks.map((day, dayIndex) => (
                    <div key={dayIndex}>
                      <h4 className="font-medium mb-3 text-gray-900">{day.day}, {day.date}</h4>
                      <div className="space-y-2">
                        {day.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className={`flex items-center justify-between p-3 rounded-lg ${
                            task.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full ${
                                task.completed ? 'bg-green-600' : 'bg-gray-300'
                              }`}></div>
                              <div>
                                <div className="font-medium text-gray-900">{task.time} - {task.subject}</div>
                                <div className="text-sm text-gray-600">{task.type} • {task.duration}</div>
                              </div>
                            </div>
                            {task.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Smart Recommendations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Brain className="w-5 h-5" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {smartRecommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg ${
                    rec.type === 'priority' ? 'bg-red-50 border border-red-200' :
                    rec.type === 'optimization' ? 'bg-blue-50 border border-teal-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <rec.icon className={`w-5 h-5 mt-0.5 ${
                        rec.type === 'priority' ? 'text-red-600' :
                        rec.type === 'optimization' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1 text-gray-900">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                        <Button size="sm" variant="outline">
                          {rec.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Exam Countdown</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  67 Days
                </div>
                <div className="text-gray-600 mb-4">Until PLAB 1 Exam</div>
                <div className="text-sm text-gray-500">
                  Target Date: August 15, 2024
                </div>
                <Progress value={67} className="mt-4" />
                <div className="text-xs text-gray-500 mt-2">67% preparation complete</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Today's Session
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Adjust Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Set New Goals
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}