import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, DollarSign, Zap } from 'lucide-react';

export default function CostCalculator() {
  const [questionCount, setQuestionCount] = useState(500);
  const [batchSize, setBatchSize] = useState(5);

  const calculateCost = () => {
    const batches = Math.ceil(questionCount / batchSize);
    const inputTokensPerBatch = 1500; // Template + prompt
    const outputTokensPerBatch = 800 * batchSize; // Per question generated
    
    const totalInputTokens = batches * inputTokensPerBatch;
    const totalOutputTokens = batches * outputTokensPerBatch;
    
    const inputCost = (totalInputTokens / 1000000) * 2.50;
    const outputCost = (totalOutputTokens / 1000000) * 10.00;
    
    return {
      batches,
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost,
      totalInputTokens,
      totalOutputTokens
    };
  };

  const cost = calculateCost();

  const startGeneration = async (count: number) => {
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category: 'cardiovascular', 
          count,
          testMode: true 
        })
      });
      
      if (response.ok) {
        alert(`Successfully generated ${count} test questions!`);
      }
    } catch (error) {
      alert('Generation failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OpenAI Cost Calculator
          </h1>
          <p className="text-gray-600">
            Calculate generation costs for PLAB medical questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Generation Parameters
              </CardTitle>
              <CardDescription>
                Configure your question generation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="questions">Number of Questions</Label>
                <Input
                  id="questions"
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  min="1"
                  max="10000"
                />
              </div>
              <div>
                <Label htmlFor="batch">Questions per API Call</Label>
                <Input
                  id="batch"
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  min="1"
                  max="20"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost Breakdown
              </CardTitle>
              <CardDescription>
                GPT-4o pricing calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Batches:</span>
                  <span className="font-medium">{cost.batches}</span>
                </div>
                <div className="flex justify-between">
                  <span>Input Cost:</span>
                  <span className="font-medium">${cost.inputCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Output Cost:</span>
                  <span className="font-medium">${cost.outputCost.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Cost:</span>
                    <span className="text-green-600">${cost.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generation Options</CardTitle>
            <CardDescription>
              Choose your generation approach based on cost and needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <Zap className="h-8 w-8 text-blue-600 mx-auto" />
                    <h3 className="font-semibold">Test Generation</h3>
                    <p className="text-sm text-gray-600">Generate 10 questions</p>
                    <p className="text-lg font-bold text-blue-600">~$0.10</p>
                    <Button 
                      onClick={() => startGeneration(10)}
                      className="w-full"
                      variant="outline"
                    >
                      Start Test
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <Calculator className="h-8 w-8 text-green-600 mx-auto" />
                    <h3 className="font-semibold">Medium Set</h3>
                    <p className="text-sm text-gray-600">Generate 100 questions</p>
                    <p className="text-lg font-bold text-green-600">~$1.00</p>
                    <Button 
                      onClick={() => startGeneration(100)}
                      className="w-full"
                      variant="outline"
                    >
                      Start Medium
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <DollarSign className="h-8 w-8 text-purple-600 mx-auto" />
                    <h3 className="font-semibold">Full Generation</h3>
                    <p className="text-sm text-gray-600">Generate {questionCount} questions</p>
                    <p className="text-lg font-bold text-purple-600">${cost.totalCost.toFixed(2)}</p>
                    <Button 
                      onClick={() => window.location.href = '/generation'}
                      className="w-full"
                    >
                      Start Full Generation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Usage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Input Tokens</p>
                <p className="text-gray-600">{cost.totalInputTokens.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Output Tokens</p>
                <p className="text-gray-600">{cost.totalOutputTokens.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Input Rate</p>
                <p className="text-gray-600">$2.50/1M tokens</p>
              </div>
              <div>
                <p className="font-medium">Output Rate</p>
                <p className="text-gray-600">$10.00/1M tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}