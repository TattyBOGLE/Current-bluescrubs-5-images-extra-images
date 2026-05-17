import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, TrendingUp, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AnalyticsData {
  currentTestTakers: number;
  activeUsers: number;
  todayTests: number;
  testPerformance: {
    averageScore: number;
    totalTests: number;
    averageTime: number;
  };
  popularPages: Array<{page: string, views: number}>;
  timestamp: string;
}

export default function LiveAnalytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/live"],
    refetchInterval: 5000, // Update every 5 seconds
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Platform Analytics</h1>
          <p className="text-gray-600">Real-time usage statistics and testing activity</p>
          {analytics && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {new Date(analytics.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Current Test Takers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Test Takers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.currentTestTakers}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently taking tests
                </p>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.activeUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 5 minutes
                </p>
              </CardContent>
            </Card>

            {/* Today's Tests */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tests Today</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.todayTests}
                </div>
                <p className="text-xs text-muted-foreground">
                  Completed today
                </p>
              </CardContent>
            </Card>

            {/* Average Score */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {analytics.testPerformance.averageScore}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics.testPerformance.averageTime}min avg time
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Performance Details */}
        {analytics && analytics.testPerformance.totalTests > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Performance Today</CardTitle>
              <CardDescription>Detailed statistics for tests completed today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analytics.testPerformance.totalTests}
                  </div>
                  <p className="text-sm text-gray-600">Total Tests</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analytics.testPerformance.averageScore}%
                  </div>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {analytics.testPerformance.averageTime}min
                  </div>
                  <p className="text-sm text-gray-600">Average Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Pages */}
        {analytics && analytics.popularPages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Popular Pages Today</CardTitle>
              <CardDescription>Most visited pages and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.popularPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-6 text-xs">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{page.page}</span>
                    </div>
                    <Badge variant="secondary">
                      {page.views} views
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Real-time Status */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live analytics updating every 5 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}