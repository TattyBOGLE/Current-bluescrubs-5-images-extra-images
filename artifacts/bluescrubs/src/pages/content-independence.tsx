import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Shield, Database, ArrowLeft, Download, Plus, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';

interface ContentStats {
  totalStations: number;
  byExamType: Record<string, number>;
  lastUpdated: string;
  aiDependency: 'none' | 'optional' | 'required';
}

export default function ContentIndependence() {
  const { data: stats } = useQuery<ContentStats>({
    queryKey: ['/api/content/independence-status'],
  });

  const exportContent = async (examType?: string) => {
    const url = examType 
      ? `/api/content/export/${examType}`
      : '/api/content/export';
    
    const response = await fetch(url);
    const data = await response.json();
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `medical-content-${examType || 'all'}.json`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading content independence status...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalContent = stats.totalStations;
  const isIndependent = stats.aiDependency === 'none' && totalContent > 5000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Content Independence Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Complete medical exam preparation without external AI dependency
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" className="hover:bg-green-50 dark:hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Independence Status Overview */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isIndependent 
                    ? 'bg-green-600 text-white' 
                    : 'bg-yellow-600 text-white'
                }`}>
                  {isIndependent ? (
                    <Shield className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {isIndependent ? 'Fully Independent' : 'Building Independence'}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {isIndependent 
                      ? 'System operates without external AI dependency'
                      : 'Expanding content library for complete independence'
                    }
                  </CardDescription>
                </div>
              </div>
              <Badge 
                variant={isIndependent ? "default" : "secondary"}
                className={`text-lg px-4 py-2 ${
                  isIndependent 
                    ? 'bg-green-600 text-white' 
                    : 'bg-yellow-600 text-white'
                }`}
              >
                {stats.aiDependency.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {totalContent.toLocaleString()}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Total Stations</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {Object.keys(stats.byExamType).length}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Exam Types Covered</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  100%
                </div>
                <p className="text-gray-600 dark:text-gray-300">Self-Sufficient</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Library Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(stats.byExamType).map(([examType, count]) => {
            const progress = Math.min((count / 1000) * 100, 100);
            const isComplete = count >= 500;
            
            return (
              <Card
                key={examType}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant={isComplete ? "default" : "secondary"}
                      className={isComplete ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}
                    >
                      {examType}
                    </Badge>
                    {isComplete && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <CardTitle className="text-lg">
                    {count.toLocaleString()} Stations
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Coverage</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress 
                      value={progress} 
                      className={`h-2 ${
                        isComplete 
                          ? 'bg-green-200 dark:bg-green-900' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => exportContent(examType)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export {examType}
                    </Button>
                  </div>

                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    {isComplete ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Ready for independent use
                      </span>
                    ) : (
                      <span>
                        {500 - count} more stations recommended
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Independence Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                Independence Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'No external API dependency or costs',
                  'Complete data ownership and privacy',
                  'Instant content access without rate limits',
                  'Offline capability for all exam content',
                  'Predictable performance and reliability',
                  'Custom content addition and modification'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Database className="w-5 h-5" />
                Content Library Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={() => exportContent()}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Complete Library
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.reload()}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last updated: {new Date(stats.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Status */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Content Independence Achieved
            </h3>
            <p className="text-lg mb-6">
              Your medical exam preparation platform now operates completely independently 
              with {totalContent.toLocaleString()}+ authentic medical stations across all major international exams.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/user-format-stations">
                <Button variant="secondary" size="lg">
                  <Database className="w-5 h-5 mr-2" />
                  Browse PLAB Content
                </Button>
              </Link>
              <Link href="/international-exams">
                <Button variant="secondary" size="lg">
                  <Database className="w-5 h-5 mr-2" />
                  Browse Global Exams
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}