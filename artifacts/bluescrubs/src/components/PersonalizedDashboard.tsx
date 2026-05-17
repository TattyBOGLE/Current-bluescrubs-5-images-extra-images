import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Brain, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Bell,
  Play,
  BookOpen,
  Award
} from 'lucide-react';
import { useLocalAnalytics } from '@/hooks/useLocalAnalytics';
import { VideoPlayer } from './VideoPlayer';

interface PersonalizedDashboardProps {
  className?: string;
}

export function PersonalizedDashboard({ className = '' }: PersonalizedDashboardProps) {
  const { 
    performance, 
    recommendations, 
    sessions, 
    schedules,
    getDifficultyAdjustments,
    createSchedule,
    updateProgress,
    requestNotificationPermission
  } = useLocalAnalytics();

  const [selectedVideoTopic, setSelectedVideoTopic] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check notification permission status
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Sample video explanations (these would be actual video files in production)
  const videoExplanations = {
    'cardiovascular': {
      title: 'ECG Interpretation Fundamentals',
      src: '/videos/ecg-basics.mp4', // This would be actual video file
      chapters: [
        { title: 'Normal ECG Components', startTime: 0, endTime: 120, description: 'P wave, QRS complex, T wave analysis' },
        { title: 'Common Arrhythmias', startTime: 120, endTime: 240, description: 'AF, VT, heart blocks' },
        { title: 'Clinical Correlation', startTime: 240, endTime: 360, description: 'When to refer, emergency signs' }
      ],
      subtitles: '/videos/ecg-basics.vtt'
    },
    'dermatology': {
      title: 'Skin Lesion Assessment',
      src: '/videos/skin-assessment.mp4',
      chapters: [
        { title: 'ABCDE Method', startTime: 0, endTime: 90, description: 'Systematic lesion evaluation' },
        { title: 'Common Conditions', startTime: 90, endTime: 180, description: 'Eczema, psoriasis, skin cancer' },
        { title: 'Referral Criteria', startTime: 180, endTime: 270, description: 'When to refer to dermatology' }
      ],
      subtitles: '/videos/skin-assessment.vtt'
    }
  };

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
  };

  const createDefaultSchedule = () => {
    const schedule = {
      title: 'PLAB 1 Preparation',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
      dailyGoal: 20,
      weeklyGoal: 140,
      reminderTime: '09:00',
      enabled: true,
      categories: ['cardiovascular', 'dermatology', 'endocrinology', 'respiratory']
    };
    createSchedule(schedule);
  };

  const difficultyAdjustments = getDifficultyAdjustments();

  // Calculate overall stats
  const totalAttempts = performance.reduce((sum, p) => sum + p.totalAttempts, 0);
  const overallAccuracy = totalAttempts > 0 
    ? performance.reduce((sum, p) => sum + p.correctAnswers, 0) / totalAttempts 
    : 0;
  const recentSessions = sessions.slice(-7);
  const currentStreak = schedules[0]?.progress.currentStreak || 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallAccuracy * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalAttempts} questions attempted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weak Areas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations.length}</div>
            <p className="text-xs text-muted-foreground">
              need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentSessions.reduce((sum, s) => sum + s.questionsAnswered, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              questions completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="videos">Video Learning</TabsTrigger>
          <TabsTrigger value="schedule">Study Schedule</TabsTrigger>
          <TabsTrigger value="adaptive">Difficulty</TabsTrigger>
        </TabsList>

        {/* Performance Analytics */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Your accuracy and progress across medical specialties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium capitalize">{category.category}</h4>
                        {category.improvementTrend > 0.1 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : category.improvementTrend < -0.1 ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(category.accuracy * 100)}% ({category.totalAttempts} attempts)
                      </div>
                    </div>
                    <Progress value={category.accuracy * 100} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                      <div>Avg Time: {Math.round(category.averageTime)}s</div>
                      <div>Last: {new Date(category.lastAttempt).toLocaleDateString()}</div>
                      <div>
                        Weakness: 
                        <Badge 
                          variant={category.weaknessScore > 50 ? 'destructive' : 'secondary'}
                          className="ml-1"
                        >
                          {category.weaknessScore}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personalized Recommendations */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Study Recommendations</CardTitle>
              <CardDescription>AI-generated suggestions based on your performance patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>Great job! No weak areas detected.</p>
                    <p className="text-sm">Keep practicing to maintain your performance.</p>
                  </div>
                ) : (
                  recommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-5 w-5 ${
                            rec.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                          <h4 className="font-medium capitalize">{rec.category}</h4>
                        </div>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'default'}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Suggested Action:
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">{rec.suggestedAction}</p>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Est. study time: {rec.estimatedStudyTime} minutes
                        </div>
                        <Button size="sm" variant="outline">Start Practice</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Learning */}
        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Explanations</CardTitle>
              <CardDescription>Watch detailed explanations for complex medical topics</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedVideoTopic ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      {videoExplanations[selectedVideoTopic as keyof typeof videoExplanations].title}
                    </h3>
                    <Button variant="outline" onClick={() => setSelectedVideoTopic(null)}>
                      Back to Topics
                    </Button>
                  </div>
                  <VideoPlayer
                    src={videoExplanations[selectedVideoTopic as keyof typeof videoExplanations].src}
                    title={videoExplanations[selectedVideoTopic as keyof typeof videoExplanations].title}
                    chapters={videoExplanations[selectedVideoTopic as keyof typeof videoExplanations].chapters}
                    subtitles={videoExplanations[selectedVideoTopic as keyof typeof videoExplanations].subtitles}
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(videoExplanations).map(([topic, video]) => (
                    <div key={topic} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Play className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">{video.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{topic} specialty</p>
                      <div className="space-y-1">
                        {video.chapters.map((chapter, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            • {chapter.title}
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedVideoTopic(topic)}
                      >
                        Watch Video
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Schedule */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Schedule</CardTitle>
              <CardDescription>Manage your study goals and track progress</CardDescription>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">No study schedule created</p>
                    <p className="text-sm text-muted-foreground">Create a schedule to track your progress</p>
                  </div>
                  <Button onClick={createDefaultSchedule}>Create Default Schedule</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{schedule.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Target: {new Date(schedule.targetDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={schedule.enabled ? 'default' : 'secondary'}>
                          {schedule.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Daily Goal</p>
                          <p className="text-2xl font-bold">{schedule.dailyGoal}</p>
                          <p className="text-xs text-muted-foreground">questions per day</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Current Streak</p>
                          <p className="text-2xl font-bold">{schedule.progress.currentStreak}</p>
                          <p className="text-xs text-muted-foreground">days in a row</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{schedule.progress.completedDays} / {schedule.progress.totalDays} days</span>
                        </div>
                        <Progress 
                          value={schedule.progress.totalDays > 0 ? (schedule.progress.completedDays / schedule.progress.totalDays) * 100 : 0} 
                        />
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Bell className="h-4 w-4" />
                        <span>Reminder: {schedule.reminderTime}</span>
                        {!notificationsEnabled && (
                          <Button size="sm" variant="outline" onClick={enableNotifications}>
                            Enable Notifications
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adaptive Difficulty */}
        <TabsContent value="adaptive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Difficulty</CardTitle>
              <CardDescription>AI-recommended difficulty levels based on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {difficultyAdjustments.map((adjustment) => (
                  <div key={adjustment.category} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium capitalize">{adjustment.category}</h4>
                      <Badge variant="outline">
                        {Math.round(adjustment.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Level</p>
                        <Badge variant="secondary">{adjustment.currentLevel}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Recommended Level</p>
                        <Badge variant={
                          adjustment.recommendedLevel === 'advanced' ? 'default' :
                          adjustment.recommendedLevel === 'intermediate' ? 'secondary' : 'outline'
                        }>
                          {adjustment.recommendedLevel}
                        </Badge>
                      </div>
                    </div>

                    {adjustment.recommendedLevel !== adjustment.currentLevel && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {adjustment.recommendedLevel === 'advanced' 
                            ? 'You\'re ready for more challenging questions!' 
                            : adjustment.recommendedLevel === 'intermediate'
                            ? 'Consider moving to intermediate level.'
                            : 'Focus on basic concepts first.'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}