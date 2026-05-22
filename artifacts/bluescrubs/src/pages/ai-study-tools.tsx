import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  FileText, 
  Mic, 
  BookOpen, 
  Eye, 
  Clock, 
  Target,
  TrendingUp,
  Star,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartFlashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: Date;
  reviewCount: number;
  successRate: number;
  tags: string[];
  medicalSpecialty: string;
}

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'image-based';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  confidenceLevel?: number;
  timeLimit?: number;
}

export default function AIStudyTools() {
  const [activeTab, setActiveTab] = useState('flashcards');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [concept, setConcept] = useState('');
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flashcards, setFlashcards] = useState<SmartFlashcard[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [confidenceLevels, setConfidenceLevels] = useState<Record<number, number>>({});
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate Flashcards
  const generateFlashcardsMutation = useMutation({
    mutationFn: async (data: { content: string; specialty: string }) => {
      const response = await fetch('/api/study-tools/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      setFlashcards(data.flashcards);
      setCurrentFlashcard(0);
      setShowAnswer(false);
      toast({
        title: "Flashcards Generated",
        description: `Created ${data.count} smart flashcards with spaced repetition`
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate flashcards. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Auto-Summarizer
  const summarizeMutation = useMutation({
    mutationFn: async (data: { content: string; format: string }) => {
      const response = await fetch('/api/study-tools/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Content Summarized",
        description: "Summary generated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Summarization Failed",
        description: "Unable to summarize content. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Interactive Quiz Generator
  const generateQuizMutation = useMutation({
    mutationFn: async (data: { topic: string; questionCount: number; types: string[] }) => {
      const response = await fetch('/api/study-tools/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      setQuiz(data.questions);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setConfidenceLevels({});
      setTimeSpent(0);
      toast({
        title: "Quiz Generated",
        description: `Created ${data.questions.length} interactive questions`
      });
    },
    onError: () => {
      toast({
        title: "Quiz Generation Failed",
        description: "Unable to generate quiz. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Visual Explanation Assistant
  const generateExplanationMutation = useMutation({
    mutationFn: async (data: { concept: string; complexity: string }) => {
      const response = await fetch('/api/study-tools/visual-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Visual Explanation Generated",
        description: "Comprehensive explanation with diagrams created"
      });
    },
    onError: () => {
      toast({
        title: "Explanation Failed",
        description: "Unable to generate explanation. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFlashcardReview = async (success: boolean) => {
    const card = flashcards[currentFlashcard];
    if (!card) return;

    // Update flashcard performance with spaced repetition
    try {
      await fetch(`/api/study-tools/flashcards/${card.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success, confidenceLevel: 3 })
      });
    } catch (error) {
      console.error('Failed to update flashcard:', error);
    }

    // Move to next card
    if (currentFlashcard < flashcards.length - 1) {
      setCurrentFlashcard(prev => prev + 1);
      setShowAnswer(false);
    } else {
      toast({
        title: "Flashcard Session Complete",
        description: "All flashcards reviewed! Your progress has been saved."
      });
    }
  };

  const handleQuizSubmit = async () => {
    if (quiz.length === 0) return;

    const answers = Object.values(selectedAnswers);
    const confidences = Object.values(confidenceLevels);

    try {
      await fetch(`/api/study-tools/quiz/${Date.now()}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          confidenceLevels: confidences,
          timeSpent
        })
      });

      toast({
        title: "Quiz Submitted",
        description: "Your performance has been analyzed and saved"
      });
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit quiz. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Study Tools</h1>
        <p className="text-muted-foreground text-lg">
          Advanced smart features to enhance your medical education experience
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Smart Flashcards
          </TabsTrigger>
          <TabsTrigger value="summarizer" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Auto-Summarizer
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice to Notes
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Interactive Quiz
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Visual Assistant
          </TabsTrigger>
        </TabsList>

        {/* Smart Flashcards with Spaced Repetition */}
        <TabsContent value="flashcards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Smart Flashcards with Spaced Repetition
              </CardTitle>
              <CardDescription>
                AI generates Q&A flashcards from your notes with automatic difficulty adjustment and spaced repetition algorithms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="flashcard-content">Medical Content or Notes</Label>
                  <Textarea
                    id="flashcard-content"
                    placeholder="Paste your medical notes, textbook content, or lecture material here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Medical Specialty</Label>
                  <Select defaultValue="general-medicine">
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general-medicine">General Medicine</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="respiratory">Respiratory</SelectItem>
                      <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="endocrinology">Endocrinology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => generateFlashcardsMutation.mutate({ content, specialty: 'general-medicine' })}
                  disabled={!content || generateFlashcardsMutation.isPending}
                  className="w-full"
                >
                  {generateFlashcardsMutation.isPending ? 'Generating...' : 'Generate Smart Flashcards'}
                </Button>
              </div>

              {flashcards.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Review Session</h3>
                    <Badge variant="outline">
                      {currentFlashcard + 1} of {flashcards.length}
                    </Badge>
                  </div>
                  
                  <Progress value={(currentFlashcard / flashcards.length) * 100} />
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(flashcards[currentFlashcard]?.difficulty)}>
                            {flashcards[currentFlashcard]?.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            Review #{flashcards[currentFlashcard]?.reviewCount || 0}
                          </Badge>
                          <Badge variant="outline">
                            {Math.round((flashcards[currentFlashcard]?.successRate || 0) * 100)}% success
                          </Badge>
                        </div>
                        
                        <div className="text-lg font-medium">
                          {flashcards[currentFlashcard]?.front}
                        </div>
                        
                        {showAnswer && (
                          <div className="border-t pt-4">
                            <div className="text-muted-foreground mb-2">Answer:</div>
                            <div>{flashcards[currentFlashcard]?.back}</div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          {!showAnswer ? (
                            <Button onClick={() => setShowAnswer(true)}>
                              Show Answer
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => handleFlashcardReview(false)}
                                className="flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Difficult
                              </Button>
                              <Button 
                                onClick={() => handleFlashcardReview(true)}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Got it!
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto-Summarizer */}
        <TabsContent value="summarizer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Auto-Summarizer
              </CardTitle>
              <CardDescription>
                AI processes your class notes or textbook content into concise summaries with bullet points and diagrams
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="summary-content">Content to Summarize</Label>
                  <Textarea
                    id="summary-content"
                    placeholder="Paste your medical notes, lecture content, or textbook chapters here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                  />
                </div>
                <div>
                  <Label htmlFor="format">Summary Format</Label>
                  <Select defaultValue="bullets">
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bullets">Bullet Points</SelectItem>
                      <SelectItem value="paragraphs">Structured Paragraphs</SelectItem>
                      <SelectItem value="diagrams">Text-based Diagrams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => summarizeMutation.mutate({ content, format: 'bullets' })}
                  disabled={!content || summarizeMutation.isPending}
                  className="w-full"
                >
                  {summarizeMutation.isPending ? 'Summarizing...' : 'Generate Summary'}
                </Button>
              </div>

              {summarizeMutation.data && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Generated Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap">{(summarizeMutation.data as any)?.summary}</div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice-to-Revision Notes */}
        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice-to-Revision Notes
              </CardTitle>
              <CardDescription>
                Transcribe recorded lectures or voice memos into study notes and automatically generate flashcards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <Mic className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Record or Upload Audio</h3>
                <p className="text-muted-foreground mb-4">
                  Upload audio files or record directly to convert lectures into revision notes
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                  <Button variant="outline" className="w-full">
                    Upload Audio File
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <strong>Supported formats:</strong> MP3, WAV, M4A, OGG
                <br />
                <strong>Features:</strong> Automatic transcription, note generation, flashcard creation
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interactive Quiz Generator */}
        <TabsContent value="quiz" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Interactive Quiz Generator
              </CardTitle>
              <CardDescription>
                Generate various types of quizzes with confidence tracking and timed modes for comprehensive assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="quiz-topic">Medical Topic</Label>
                  <Input
                    id="quiz-topic"
                    placeholder="e.g., Acute Coronary Syndrome, Diabetes Management, Respiratory Infections"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="question-count">Number of Questions</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                        <SelectItem value="20">20 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="question-types">Question Types</Label>
                    <Select defaultValue="multiple-choice">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                        <SelectItem value="mixed">Mixed Types</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={() => generateQuizMutation.mutate({ 
                    topic, 
                    questionCount: 5, 
                    types: ['multiple-choice'] 
                  })}
                  disabled={!topic || generateQuizMutation.isPending}
                  className="w-full"
                >
                  {generateQuizMutation.isPending ? 'Generating Quiz...' : 'Generate Interactive Quiz'}
                </Button>
              </div>

              {quiz.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Quiz Session</h3>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">
                        Question {currentQuestion + 1} of {quiz.length}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Progress value={((currentQuestion + 1) / quiz.length) * 100} />
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="text-lg font-medium">
                          {quiz[currentQuestion]?.question}
                        </div>
                        
                        {quiz[currentQuestion]?.options && (
                          <div className="space-y-2">
                            {quiz[currentQuestion].options?.map((option, index) => (
                              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question-${currentQuestion}`}
                                  value={option}
                                  onChange={(e) => setSelectedAnswers(prev => ({
                                    ...prev,
                                    [currentQuestion]: e.target.value
                                  }))}
                                  className="w-4 h-4"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label>Confidence Level</Label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <Button
                                key={level}
                                variant={confidenceLevels[currentQuestion] === level ? "default" : "outline"}
                                size="sm"
                                onClick={() => setConfidenceLevels(prev => ({
                                  ...prev,
                                  [currentQuestion]: level
                                }))}
                              >
                                <Star className="w-4 h-4" />
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {currentQuestion > 0 && (
                            <Button 
                              variant="outline" 
                              onClick={() => setCurrentQuestion(prev => prev - 1)}
                            >
                              Previous
                            </Button>
                          )}
                          {currentQuestion < quiz.length - 1 ? (
                            <Button 
                              onClick={() => setCurrentQuestion(prev => prev + 1)}
                              disabled={!selectedAnswers[currentQuestion]}
                            >
                              Next Question
                            </Button>
                          ) : (
                            <Button 
                              onClick={handleQuizSubmit}
                              disabled={!selectedAnswers[currentQuestion]}
                            >
                              Submit Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visual Explanation Assistant */}
        <TabsContent value="visual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Visual Explanation Assistant
              </CardTitle>
              <CardDescription>
                AI generates comprehensive visual explanations with diagrams and key learning points for complex medical concepts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="concept">Medical Concept</Label>
                  <Input
                    id="concept"
                    placeholder="e.g., Cardiac Cycle, Respiratory Physiology, Pathophysiology of Heart Failure"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="complexity">Complexity Level</Label>
                  <Select defaultValue="intermediate">
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Foundation Level)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Clinical Level)</SelectItem>
                      <SelectItem value="advanced">Advanced (Specialist Level)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => generateExplanationMutation.mutate({ concept, complexity: 'intermediate' })}
                  disabled={!concept || generateExplanationMutation.isPending}
                  className="w-full"
                >
                  {generateExplanationMutation.isPending ? 'Generating Explanation...' : 'Generate Visual Explanation'}
                </Button>
              </div>

              {generateExplanationMutation.data && (
                <div className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Explanation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap">{(generateExplanationMutation.data as any)?.explanation}</div>
                    </CardContent>
                  </Card>
                  
                  {(generateExplanationMutation.data as any)?.diagram && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Visual Diagram</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded">
                          {(generateExplanationMutation.data as any)?.diagram}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                  
                  {(generateExplanationMutation.data as any)?.keyPoints && (generateExplanationMutation.data as any)?.keyPoints.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Key Learning Points</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {(generateExplanationMutation.data as any)?.keyPoints.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <Target className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}