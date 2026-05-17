import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserStats, ProgressData } from "@/lib/types";

interface ProgressChartProps {
  userStats: UserStats;
  progressData?: ProgressData;
}

export function ProgressChart({ userStats, progressData }: ProgressChartProps) {
  const accuracyPercentage = useMemo(() => {
    if (userStats.totalAnswered === 0) return 0;
    return Math.round((userStats.correctAnswers / userStats.totalAnswered) * 100);
  }, [userStats.correctAnswers, userStats.totalAnswered]);

  const categoryPerformance = useMemo(() => {
    return Object.entries(userStats.categoryStats)
      .map(([category, stats]) => ({
        category,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        total: stats.total,
        correct: stats.correct
      }))
      .sort((a, b) => b.accuracy - a.accuracy);
  }, [userStats.categoryStats]);

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 85) return "text-mint-green";
    if (accuracy >= 70) return "text-amber-warning";
    return "text-deep-rose";
  };

  const getPerformanceBadge = (accuracy: number) => {
    if (accuracy >= 85) return "Excellent";
    if (accuracy >= 70) return "Good";
    if (accuracy >= 60) return "Fair";
    return "Needs Work";
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Accuracy */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${accuracyPercentage * 2.51} 251`}
                    className={getPerformanceColor(accuracyPercentage)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getPerformanceColor(accuracyPercentage)}`}>
                    {accuracyPercentage}%
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Overall Accuracy</h3>
              <Badge variant="secondary" className="mt-1">
                {getPerformanceBadge(accuracyPercentage)}
              </Badge>
            </div>

            {/* Questions Completed */}
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-medical-blue">{userStats.totalAnswered}</span>
              </div>
              <h3 className="font-semibold text-gray-900">Questions Completed</h3>
              <p className="text-sm text-gray-600">{userStats.correctAnswers} correct answers</p>
            </div>

            {/* Average Time */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-purple-accent">
                  {Math.round(userStats.averageTime)}s
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Avg. Time per Question</h3>
              <p className="text-sm text-gray-600">Time management</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Performance by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryPerformance.map(({ category, accuracy, total, correct }) => (
              <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-medical-blue/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">
                      {category === 'cardiology' ? '❤️' :
                       category === 'respiratory' ? '🫁' :
                       category === 'neurology' ? '🧠' :
                       category === 'endocrinology' ? '🩺' :
                       category === 'gastroenterology' ? '🍽️' :
                       category === 'psychiatry' ? '🧘' :
                       '📚'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{category}</h4>
                    <p className="text-sm text-gray-600">{correct}/{total} questions</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getPerformanceColor(accuracy)}`}>
                    {accuracy}%
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        accuracy >= 85 ? 'bg-mint-green' :
                        accuracy >= 70 ? 'bg-amber-warning' :
                        'bg-deep-rose'
                      }`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categoryPerformance.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Yet</h3>
              <p className="text-gray-600">Start practicing to see your performance by category</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Progress (if data available) */}
      {progressData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const dayData = progressData.weekly[index] || { correct: 0, total: 0 };
                  const dayAccuracy = dayData.total > 0 ? (dayData.correct / dayData.total) * 100 : 0;
                  
                  return (
                    <div key={day} className="text-center">
                      <div className="text-xs font-medium text-gray-600 mb-2">{day}</div>
                      <div className={`h-20 rounded-lg flex items-end justify-center text-xs font-medium text-white ${
                        dayAccuracy >= 85 ? 'bg-mint-green' :
                        dayAccuracy >= 70 ? 'bg-amber-warning' :
                        dayData.total > 0 ? 'bg-deep-rose' :
                        'bg-gray-200'
                      }`}>
                        {dayData.total > 0 && (
                          <div className="mb-2">
                            {Math.round(dayAccuracy)}%
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {dayData.total} Q's
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
