import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface GenerationResult {
  specialty: string;
  batch: number;
  generated: number;
  total: number;
}

interface GenerationStatus {
  success: boolean;
  totalGenerated: number;
  target: number;
  progress: string;
  results: GenerationResult[];
  questionBankSize: number;
  savedToFile?: string;
}

export default function GenerationStatus() {
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-5000-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      const result = await response.json();
      setStatus(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const checkQuestionBankSize = async () => {
    try {
      const response = await fetch('/api/test/questions');
      const questions = await response.json();
      return questions.length;
    } catch {
      return 0;
    }
  };

  const pollProgress = async () => {
    const size = await checkQuestionBankSize();
    if (size > 8) {
      setStatus({
        success: true,
        totalGenerated: size,
        target: 10,
        progress: `${size}/10`,
        results: [],
        questionBankSize: size
      });
    }
  };

  useEffect(() => {
    // Initial check
    pollProgress();
    
    // Poll every 10 seconds for updates
    const interval = setInterval(pollProgress, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const progressPercentage = status ? Math.min((status.totalGenerated / 10) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PLAB Question Bank Generation
          </h1>
          <p className="text-gray-600">
            Generating 10 authentic medical questions using your 8 template questions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : status?.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-blue-600" />
              )}
              Generation Status
            </CardTitle>
            <CardDescription>
              smart medical question generation using OpenAI GPT-4o
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!status && !isGenerating && (
              <div className="text-center py-8">
                <Button onClick={startGeneration} size="lg">
                  Start 500 Question Generation
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  This will generate questions across all medical specialties
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">Generating questions...</p>
                <p className="text-sm text-gray-500">This may take several minutes</p>
              </div>
            )}

            {status && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{status.progress}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        {status.totalGenerated}
                      </div>
                      <p className="text-sm text-gray-500">Questions Generated</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        {status.target}
                      </div>
                      <p className="text-sm text-gray-500">Target Questions</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(progressPercentage)}%
                      </div>
                      <p className="text-sm text-gray-500">Complete</p>
                    </CardContent>
                  </Card>
                </div>

                {status.results.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Generation Results by Specialty</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {status.results.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <Badge variant="outline" className="mb-1">
                              {result.specialty}
                            </Badge>
                            <p className="text-sm text-gray-600">
                              Batch {result.batch} - {result.generated} questions
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">{result.total}</div>
                            <div className="text-xs text-gray-500">Total</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {status.savedToFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      Questions saved to: {status.savedToFile}
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Error: {error}</p>
                <Button 
                  onClick={startGeneration} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  Retry Generation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template Quality Standards</CardTitle>
            <CardDescription>
              Generated questions will match these specifications from your 8 templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Content Standards</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Authentic UK medical scenarios</li>
                  <li>• NICE, CKS, BNF, GMC compliance</li>
                  <li>• Realistic patient presentations</li>
                  <li>• Clinical vital signs & investigations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Format Standards</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• 5 options (A-E) with explanations</li>
                  <li>• Comprehensive correct answer reasoning</li>
                  <li>• Memorable mnemonics</li>
                  <li>• Verified reference links</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}