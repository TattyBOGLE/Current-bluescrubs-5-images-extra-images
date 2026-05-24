import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, Send, Loader2, ExternalLink, BookOpen, 
  MessageSquare, Lightbulb, AlertCircle, Zap 
} from "lucide-react";

interface AIResponse {
  answer: string;
  citations: string[];
  confidence: 'high' | 'medium' | 'low';
  sources: {
    title: string;
    url: string;
    type: 'guideline' | 'research' | 'educational';
  }[];
}

interface GeneratedQuestion {
  id: string;
  category: string;
  stem: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  references: string[];
}

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Question generation state
  const [selectedSpecialty, setSelectedSpecialty] = useState("cardiology");
  const [selectedDifficulty, setSelectedDifficulty] = useState("intermediate");
  const [generatedQuestion, setGeneratedQuestion] = useState<GeneratedQuestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuestion = async () => {
    setIsGenerating(true);
    setError("");
    setGeneratedQuestion(null);

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examType: 'PLAB',
          specialty: selectedSpecialty,
          difficulty: selectedDifficulty,
          count: 1
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate question');
      }

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setGeneratedQuestion(data.questions[0]);
      } else {
        throw new Error('No questions generated');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate question');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          context: 'medical_education'
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError('Unable to get response. Please try again.');
      console.error('AI response error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Hero */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-sm shadow-teal-200 mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2">Medical Assistant</h1>
          <p className="text-base md:text-lg text-slate-600">
            Ask any medical question and get evidence-based answers
          </p>
        </div>

        {/* AI Question Generator */}
        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Question Generator
            </CardTitle>
            <CardDescription>
              Generate medical examination questions using OpenAI integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Medical Specialty</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="respiratory">Respiratory</SelectItem>
                    <SelectItem value="endocrinology">Endocrinology</SelectItem>
                    <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={generateQuestion}
              disabled={isGenerating}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Question...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Medical Question
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Question Display */}
        {generatedQuestion && (
          <Card className="shadow-lg border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Generated Question - {generatedQuestion.category}
              </CardTitle>
              <Badge variant="outline" className="w-fit">
                {generatedQuestion.difficulty}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Question:</h4>
                <p className="text-gray-800">{generatedQuestion.stem}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Options:</h4>
                <div className="space-y-2">
                  {generatedQuestion.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${
                        index === generatedQuestion.correctAnswer 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Explanation:</h4>
                <p className="text-gray-800 whitespace-pre-wrap">{generatedQuestion.explanation}</p>
              </div>
              
              {generatedQuestion.references && generatedQuestion.references.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">References:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {generatedQuestion.references.map((ref: string, index: number) => (
                      <li key={index} className="text-gray-800">{ref}</li>
                    ))}
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Question Input */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Ask Your Medical Question
            </CardTitle>
            <CardDescription>
              Get detailed, evidence-based answers with citations from medical literature and guidelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What are the current guidelines for managing acute myocardial infarction?"
                className="min-h-[120px] text-base"
                disabled={isLoading}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {question.length}/500 characters
                </p>
                <Button 
                  type="submit" 
                  disabled={!question.trim() || isLoading || question.length > 500}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Getting Answer...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Ask
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Response */}
        {response && (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Response
                </CardTitle>
                <Badge className={getConfidenceColor(response.confidence)}>
                  {response.confidence} confidence
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Answer */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Answer:</h4>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {response.answer}
                  </p>
                </div>
              </div>

              {/* Sources */}
              {response.sources && response.sources.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Medical Sources & Guidelines:
                  </h4>
                  <div className="space-y-2">
                    {response.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border"
                      >
                        <ExternalLink className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{source.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                source.type === 'guideline' 
                                  ? 'border-teal-300 text-blue-700' 
                                  : source.type === 'research'
                                  ? 'border-green-300 text-green-700'
                                  : 'border-purple-300 text-purple-700'
                              }`}
                            >
                              {source.type}
                            </Badge>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Citations */}
              {response.citations && response.citations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Citations:</h4>
                  <div className="space-y-1">
                    {response.citations.map((citation, index) => (
                      <p key={index} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-300">
                        {citation}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Educational Disclaimer */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium mb-1">
                      Educational Disclaimer
                    </p>
                    <p className="text-xs text-amber-700">
                      This smart-generated information is for educational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Example Questions */}
        <Card className="bg-white border-slate-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Example Questions</CardTitle>
            <CardDescription className="text-slate-600">Try asking about these medical topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "What are the latest NICE guidelines for hypertension management?",
                "How do you diagnose and treat acute coronary syndrome?",
                "What are the contraindications for thrombolysis in stroke?",
                "What is the difference between type 1 and type 2 diabetes?",
                "How do you manage COPD exacerbations?",
                "What are the signs and symptoms of heart failure?"
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto p-3 text-sm text-slate-700 border-slate-200 hover:bg-teal-50 hover:border-teal-300"
                  onClick={() => setQuestion(example)}
                  disabled={isLoading}
                >
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}