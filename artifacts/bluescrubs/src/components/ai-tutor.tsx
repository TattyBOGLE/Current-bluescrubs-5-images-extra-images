import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, BookOpen, Target, Lightbulb, X, Upload, Mic, MicOff, FileText, Headphones, Zap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AITutorProps {
  currentQuestion?: any;
  userPerformance?: any;
  onClose: () => void;
  isVisible: boolean;
}

interface StudySession {
  id: string;
  title: string;
  progress: number;
  flashcards: number;
  questions: number;
  timeSpent: number;
}

interface TutorResponse {
  explanation: string;
  studyTips: string[];
  relatedConcepts: string[];
  mnemonics: string[];
  recommendedTopics: string[];
}

export function AITutor({ currentQuestion, userPerformance, onClose, isVisible }: AITutorProps) {
  const [userQuery, setUserQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'help' | 'study' | 'concepts' | 'upload' | 'voice'>('help');
  const [uploadedContent, setUploadedContent] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const queryClient = useQueryClient();

  const tutorMutation = useMutation({
    mutationFn: async (data: { query: string; context?: any }) => {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to get tutor response');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tutor-history'] });
    }
  });

  const handleAskTutor = () => {
    if (!userQuery.trim()) return;
    
    tutorMutation.mutate({
      query: userQuery,
      context: {
        question: currentQuestion,
        performance: userPerformance
      }
    });
  };

  const getQuestionHelp = () => {
    if (!currentQuestion) return;
    
    tutorMutation.mutate({
      query: `Please explain this medical question and provide study guidance: ${currentQuestion.scenario}`,
      context: { question: currentQuestion }
    });
  };

  const getStudyPlan = () => {
    tutorMutation.mutate({
      query: 'Create a personalized study plan based on my performance',
      context: { performance: userPerformance }
    });
  };

  const generateFlashcards = () => {
    const content = uploadedContent || currentQuestion?.explanation || 'Current medical topic';
    tutorMutation.mutate({
      query: `Generate spaced-repetition flashcards from this content: ${content}`,
      context: { type: 'flashcard_generation', specialty: currentQuestion?.category || 'general' }
    });
  };

  const generatePodcast = () => {
    const content = uploadedContent || currentQuestion?.explanation || 'Current medical topic';
    tutorMutation.mutate({
      query: `Create an AI-narrated podcast script from this content: ${content}`,
      context: { type: 'podcast_generation', audioFormat: true }
    });
  };

  const startVoiceInteraction = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserQuery(transcript);
        handleAskTutor();
      };
      
      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <CardTitle>AI Medical Tutor</CardTitle>
            <Badge variant="secondary">PLAB 1 Assistant</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b overflow-x-auto">
            <Button
              variant={activeTab === 'help' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('help')}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Help
            </Button>
            <Button
              variant={activeTab === 'study' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('study')}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Study Plan
            </Button>
            <Button
              variant={activeTab === 'concepts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('concepts')}
            >
              <Target className="w-4 h-4 mr-1" />
              Concepts
            </Button>
            <Button
              variant={activeTab === 'upload' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('upload')}
            >
              <Upload className="w-4 h-4 mr-1" />
              Content
            </Button>
            <Button
              variant={activeTab === 'voice' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('voice')}
            >
              <Mic className="w-4 h-4 mr-1" />
              Voice
            </Button>
          </div>

          {/* Content Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Upload Medical Content</h3>
                <p className="text-gray-600 mb-4">Upload lectures, articles, or medical documents to generate study materials</p>
                <Textarea
                  placeholder="Paste medical content here (lectures, articles, case studies)..."
                  value={uploadedContent}
                  onChange={(e) => setUploadedContent(e.target.value)}
                  className="min-h-32 mb-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button onClick={generateFlashcards} disabled={!uploadedContent || tutorMutation.isPending}>
                    <Zap className="w-4 h-4 mr-1" />
                    Generate Flashcards
                  </Button>
                  <Button onClick={generatePodcast} disabled={!uploadedContent || tutorMutation.isPending}>
                    <Headphones className="w-4 h-4 mr-1" />
                    Create Podcast
                  </Button>
                  <Button onClick={() => tutorMutation.mutate({
                    query: `Summarize this content: ${uploadedContent}`,
                    context: { type: 'content_summary' }
                  })} disabled={!uploadedContent || tutorMutation.isPending}>
                    <FileText className="w-4 h-4 mr-1" />
                    AI Summary
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Voice Interaction Tab */}
          {activeTab === 'voice' && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <Mic className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">Voice OSCE Simulator</h3>
                <p className="text-gray-600 mb-4">Practice clinical scenarios with voice interaction</p>
                <Button
                  onClick={startVoiceInteraction}
                  disabled={isListening}
                  className={`w-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Listening... Click to stop
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Start Voice Interaction
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice Query Result:</label>
                <Textarea
                  placeholder="Your voice will be transcribed here..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="min-h-20"
                />
              </div>
            </div>
          )}

          {/* Question Help Tab */}
          {activeTab === 'help' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={getQuestionHelp}
                  disabled={!currentQuestion || tutorMutation.isPending}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Lightbulb className="h-6 w-6 mb-2" />
                  Explain Current Question
                </Button>
                <Button
                  variant="outline"
                  onClick={() => tutorMutation.mutate({
                    query: 'What are the key learning points for this topic?',
                    context: { question: currentQuestion }
                  })}
                  disabled={!currentQuestion || tutorMutation.isPending}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <BookOpen className="h-6 w-6 mb-2" />
                  Key Learning Points
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ask the AI Tutor:</label>
                <Textarea
                  placeholder="Ask me anything about medical concepts, exam strategies, or study tips..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="min-h-20"
                />
                <Button
                  onClick={handleAskTutor}
                  disabled={!userQuery.trim() || tutorMutation.isPending}
                  className="w-full"
                >
                  {tutorMutation.isPending ? 'Thinking...' : 'Ask Tutor'}
                </Button>
              </div>
            </div>
          )}

          {/* Study Plan Tab */}
          {activeTab === 'study' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={getStudyPlan}
                  disabled={tutorMutation.isPending}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Target className="h-6 w-6 mb-2" />
                  Personalized Study Plan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => tutorMutation.mutate({
                    query: 'What are my weak areas and how can I improve?',
                    context: { performance: userPerformance }
                  })}
                  disabled={tutorMutation.isPending}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <BookOpen className="h-6 w-6 mb-2" />
                  Weak Areas Analysis
                </Button>
              </div>
            </div>
          )}

          {/* Concepts Tab */}
          {activeTab === 'concepts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => tutorMutation.mutate({
                    query: 'Explain the pathophysiology and clinical approach for this condition',
                    context: { question: currentQuestion }
                  })}
                  disabled={!currentQuestion || tutorMutation.isPending}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <BookOpen className="h-6 w-6 mb-2" />
                  Clinical Pathophysiology
                </Button>
                <Button
                  variant="outline"
                  onClick={() => tutorMutation.mutate({
                    query: 'Provide memory aids and mnemonics for this topic',
                    context: { question: currentQuestion }
                  })}
                  disabled={!currentQuestion || tutorMutation.isPending}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Lightbulb className="h-6 w-6 mb-2" />
                  Memory Aids
                </Button>
              </div>
            </div>
          )}

          {/* Tutor Response */}
          {tutorMutation.data && (
            <Card className="bg-blue-50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  AI Tutor Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{tutorMutation.data.response}</p>
                </div>
                
                {tutorMutation.data.studyTips?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Study Tips:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {tutorMutation.data.studyTips.map((tip: string, index: number) => (
                        <li key={index} className="text-sm">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {tutorMutation.data.mnemonics?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Memory Aids:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tutorMutation.data.mnemonics.map((mnemonic: string, index: number) => (
                        <Badge key={index} variant="secondary">{mnemonic}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tutorMutation.data.relatedConcepts?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Related Concepts:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tutorMutation.data.relatedConcepts.map((concept: string, index: number) => (
                        <Badge key={index} variant="outline">{concept}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {tutorMutation.error && (
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
              <CardContent className="pt-6">
                <p className="text-red-600 dark:text-red-400">
                  Sorry, I'm having trouble responding right now. Please try again.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}