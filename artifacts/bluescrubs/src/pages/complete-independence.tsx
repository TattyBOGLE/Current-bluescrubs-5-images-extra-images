import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Zap, Database, Globe, VideoIcon, Image, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface CompleteStatus {
  totalStations: number;
  templateSystem: {
    questionTemplates: number;
    osceTemplates: number;
    contentGeneration: string;
    aiDependency: string;
  };
  independentFeatures: {
    questionGeneration: boolean;
    osceStations: boolean;
    medicalGuidance: boolean;
    contentCreation: boolean;
  };
  aiReplacement: {
    questionGeneration: string;
    videoAnalysis: string;
    translation: string;
    imageAnalysis: string;
    feedback: string;
    guidance: string;
  };
  completeDependency: string;
  offlineCapable: boolean;
}

export default function CompleteIndependence() {
  const { data: status } = useQuery<CompleteStatus>({
    queryKey: ['/api/independence/complete-status'],
  });

  const testIndependentFeature = async (feature: string) => {
    try {
      let response;
      
      switch (feature) {
        case 'video':
          response = await fetch('/api/independent-analysis/video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              stationTitle: 'Test Cardiology Station',
              stationCategory: 'Cardiology',
              learningObjectives: ['Cardiovascular examination'],
              recordingDuration: 480
            })
          });
          break;
        case 'feedback':
          response = await fetch('/api/independent-analysis/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              topic: 'chest pain assessment',
              userResponse: 'systematic SOCRATES approach'
            })
          });
          break;
        case 'image':
          response = await fetch('/api/independent-analysis/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imagePath: 'test.jpg',
              context: 'chest x-ray analysis'
            })
          });
          break;
      }
      
      if (response) {
        const result = await response.json();
        alert(`${feature} analysis completed successfully! Method: ${result.method || 'independent'}`);
      }
    } catch (error) {
      console.error(`Error testing ${feature}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Complete AI Independence Achieved
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Every AI feature replaced with independent, offline-capable alternatives
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

        {/* Complete Independence Status */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">100% Independent System</h2>
                <p className="text-xl">
                  {status?.totalStations?.toLocaleString() || 0} stations • Zero AI dependency • Complete offline capability
                </p>
              </div>
              <Shield className="h-16 w-16" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">£0</div>
                <p className="text-green-100">Monthly AI Costs</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">∞</div>
                <p className="text-green-100">Usage Limits</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">24/7</div>
                <p className="text-green-100">Offline Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Replacement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {status && Object.entries(status.aiReplacement).map(([feature, method]) => {
            const featureInfo = {
              questionGeneration: { icon: Database, title: 'Question Generation', color: 'blue' },
              videoAnalysis: { icon: VideoIcon, title: 'Video Analysis', color: 'purple' },
              translation: { icon: Globe, title: 'Translation', color: 'green' },
              imageAnalysis: { icon: Image, title: 'Image Analysis', color: 'orange' },
              feedback: { icon: MessageSquare, title: 'Feedback System', color: 'pink' },
              guidance: { icon: Zap, title: 'Medical Guidance', color: 'indigo' }
            };
            
            const info = featureInfo[feature as keyof typeof featureInfo];
            if (!info) return null;
            
            return (
              <Card
                key={feature}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-lg bg-${info.color}-100 dark:bg-${info.color}-900 flex items-center justify-center`}>
                      <info.icon className={`w-5 h-5 text-${info.color}-600 dark:text-${info.color}-400`} />
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                  <CardDescription>
                    Method: {method.replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <Badge className="w-full justify-center bg-green-600 text-white">
                      Independent
                    </Badge>
                    
                    {feature === 'videoAnalysis' && (
                      <Button
                        onClick={() => testIndependentFeature('video')}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Test Video Analysis
                      </Button>
                    )}
                    
                    {feature === 'feedback' && (
                      <Button
                        onClick={() => testIndependentFeature('feedback')}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Test Feedback
                      </Button>
                    )}
                    
                    {feature === 'imageAnalysis' && (
                      <Button
                        onClick={() => testIndependentFeature('image')}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Test Image Analysis
                      </Button>
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
                Complete Independence Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'Zero external API costs or dependencies',
                  'Unlimited usage without rate limits',
                  'Complete offline functionality',
                  'Professional medical accuracy maintained',
                  'Instant response times',
                  'Full data privacy and ownership',
                  'Predictable system performance',
                  'No internet connection required'
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
                System Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {status?.totalStations?.toLocaleString() || 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">OSCE Stations</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {status?.templateSystem?.questionTemplates || 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Question Templates</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Link href="/plab-independence">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      View PLAB Independence
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Achievement */}
        <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Technical Independence Milestone
            </h3>
            <p className="text-xl mb-6">
              Successfully replaced all AI dependencies with independent, template-based, and 
              structured assessment systems while maintaining professional medical accuracy.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/translation-dashboard">
                <Button variant="secondary" size="lg">
                  <Globe className="w-5 h-5 mr-2" />
                  Translation System
                </Button>
              </Link>
              <Link href="/content-independence">
                <Button variant="secondary" size="lg">
                  <Database className="w-5 h-5 mr-2" />
                  Content Library
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}