import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Shield, Zap, AlertTriangle, Settings, ArrowLeft, VideoIcon, MessageSquare } from 'lucide-react';
import { Link } from 'wouter';

interface HybridStatus {
  aiAvailable: boolean;
  independentBackup: boolean;
  currentMode: 'ai_primary' | 'independent_primary' | 'hybrid';
  capabilities: string[];
}

export default function HybridAIDashboard() {
  const [useAI, setUseAI] = useState(true);
  const [aiProvider, setAiProvider] = useState('openai');
  const queryClient = useQueryClient();

  const { data: status } = useQuery<HybridStatus>({
    queryKey: ['/api/hybrid/status'],
  });

  const configMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/hybrid/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hybrid/status'] });
    }
  });

  const updateConfig = () => {
    configMutation.mutate({
      useAI,
      fallbackToIndependent: true,
      aiProvider
    });
  };

  const testAIFeature = async (feature: 'video' | 'feedback') => {
    try {
      let response;
      
      if (feature === 'video') {
        response = await fetch('/api/hybrid/video-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stationTitle: 'Test Cardiology OSCE',
            stationCategory: 'Cardiology',
            learningObjectives: ['Cardiovascular examination'],
            recordingDuration: 480,
            useAI: true
          })
        });
      } else {
        response = await fetch('/api/hybrid/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: 'chest pain assessment',
            userResponse: 'Used SOCRATES approach systematically',
            useAI: true
          })
        });
      }
      
      const result = await response.json();
      alert(`${feature} test completed! Method: ${result.method}${result.fallbackUsed ? ' (fallback used)' : ''}`);
    } catch (error) {
      console.error(`Error testing ${feature}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hybrid AI System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Best of both worlds: AI enhancement with independent fallback
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" className="hover:bg-purple-50 dark:hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {status?.aiAvailable ? (
                    <Zap className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Shield className="w-5 h-5 text-green-600" />
                  )}
                  Hybrid System Status
                </CardTitle>
                <CardDescription>
                  Current mode: {status?.currentMode?.replace('_', ' ')}
                </CardDescription>
              </div>
              <Badge 
                className={status?.aiAvailable ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}
              >
                {status?.aiAvailable ? 'AI Available' : 'Independent Mode'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Questions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Always Independent</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800 dark:text-purple-300">Video Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI Enhanced</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 dark:text-green-300">Always Works</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Independent Backup</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              AI Configuration
            </CardTitle>
            <CardDescription>
              Configure AI enhancement preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable AI Enhancement</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use AI for video analysis and feedback when available
                </p>
              </div>
              <Switch 
                checked={useAI} 
                onCheckedChange={setUseAI}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">AI Provider</label>
              <Select value={aiProvider} onValueChange={setAiProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={updateConfig}
              disabled={configMutation.isPending}
              className="w-full"
            >
              {configMutation.isPending ? 'Updating...' : 'Update Configuration'}
            </Button>
          </CardContent>
        </Card>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <VideoIcon className="w-5 h-5 text-purple-600" />
                Video Analysis
              </CardTitle>
              <CardDescription>
                AI-enhanced OSCE performance analysis with structured fallback
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Method</span>
                  <Badge variant="outline">
                    {status?.aiAvailable && useAI ? 'AI Enhanced' : 'Structured Assessment'}
                  </Badge>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm">
                  {status?.aiAvailable && useAI ? (
                    "Uses AI for detailed performance analysis with natural language feedback"
                  ) : (
                    "Uses structured assessment criteria based on PLAB 2 standards"
                  )}
                </div>

                <Button 
                  onClick={() => testAIFeature('video')}
                  variant="outline"
                  className="w-full"
                >
                  Test Video Analysis
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                Feedback Generation
              </CardTitle>
              <CardDescription>
                Personalized feedback with template-based fallback
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Method</span>
                  <Badge variant="outline">
                    {status?.aiAvailable && useAI ? 'AI Personalized' : 'Template Based'}
                  </Badge>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm">
                  {status?.aiAvailable && useAI ? (
                    "Generates personalized feedback based on specific responses"
                  ) : (
                    "Uses educational templates with contextual medical guidance"
                  )}
                </div>

                <Button 
                  onClick={() => testAIFeature('feedback')}
                  variant="outline"
                  className="w-full"
                >
                  Test Feedback System
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  Question Bank Policy
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Medical questions are ALWAYS generated independently using templates to ensure 
                  authenticity and prevent AI hallucinations. This maintains medical accuracy 
                  and prevents bias in educational content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Benefits */}
        <Card className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Hybrid System Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">AI When Available</h4>
                <p>Enhanced features with AI when API keys are provided</p>
              </div>
              <div>
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Always Functional</h4>
                <p>Independent fallbacks ensure system always works</p>
              </div>
              <div>
                <Zap className="w-6 h-6 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Best Quality</h4>
                <p>Questions remain independent for medical accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}