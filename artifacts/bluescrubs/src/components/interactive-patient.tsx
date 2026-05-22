import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { User, Bot, Clock, Award, MessageCircle, Stethoscope, Heart, Brain } from "lucide-react";

interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  presenting_complaint: string;
  medical_history: string[];
  medications: string[];
  social_history: string;
  examination_findings: Record<string, any>;
  investigation_results: Record<string, any>;
  diagnosis: string;
  management_plan: string[];
  learning_objectives: string[];
  difficulty_level: 'foundation' | 'intermediate' | 'advanced';
  specialty: string;
  scenario_type: string;
}

interface ConversationTurn {
  id: string;
  speaker: 'doctor' | 'patient';
  message: string;
  timestamp: Date;
  analysis?: {
    communication_score: number;
    empathy_score: number;
    clinical_relevance: number;
    suggestions: string[];
  };
}

interface InteractiveSession {
  id: string;
  patient_id: string;
  scenario_type: string;
  conversation: ConversationTurn[];
  current_phase: string;
  session_score: {
    overall: number;
    communication: number;
    clinical_knowledge: number;
    professionalism: number;
    time_management: number;
  };
  feedback: {
    strengths: string[];
    areas_for_improvement: string[];
    specific_advice: string[];
    next_steps: string[];
  };
  duration_minutes: number;
  completed: boolean;
}

export function InteractivePatient() {
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [currentSession, setCurrentSession] = useState<InteractiveSession | null>(null);
  const [message, setMessage] = useState("");
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: patientsData, isLoading: loadingPatients } = useQuery({
    queryKey: ['/api/interactive-patient/patients'],
    enabled: true
  });

  const startSessionMutation = useMutation({
    mutationFn: async ({ patientId, scenarioType }: { patientId: string; scenarioType: string }) => {
      const response = await fetch('/api/interactive-patient/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, scenarioType })
      });
      if (!response.ok) throw new Error('Failed to start session');
      return await response.json();
    },
    onSuccess: (data) => {
      setCurrentSession(data.session);
      queryClient.invalidateQueries({ queryKey: ['/api/interactive-patient/sessions'] });
    }
  });

  const conversationMutation = useMutation({
    mutationFn: async ({ sessionId, message }: { sessionId: string; message: string }) => {
      const response = await fetch('/api/interactive-patient/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message })
      });
      if (!response.ok) throw new Error('Failed to process conversation');
      return await response.json();
    },
    onSuccess: (data) => {
      setCurrentSession(data.updatedSession);
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ['/api/interactive-patient/sessions'] });
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.conversation]);

  const handleStartSession = (patient: PatientProfile) => {
    setSelectedPatient(patient);
    startSessionMutation.mutate({
      patientId: patient.id,
      scenarioType: patient.scenario_type
    });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !currentSession) return;
    
    conversationMutation.mutate({
      sessionId: currentSession.id,
      message: message.trim()
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'foundation': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'introduction': return <User className="h-4 w-4" />;
      case 'history': return <MessageCircle className="h-4 w-4" />;
      case 'examination': return <Stethoscope className="h-4 w-4" />;
      case 'explanation': return <Brain className="h-4 w-4" />;
      case 'management': return <Heart className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loadingPatients) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading virtual patients...</p>
        </div>
      </div>
    );
  }

  if (!currentSession && !selectedPatient) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Interactive Virtual Patients</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice clinical communication skills with smart virtual patients. 
            Each interaction is analyzed for communication effectiveness, empathy, and clinical reasoning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(patientsData?.patients || [])?.map((patient: PatientProfile) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{patient.name}</CardTitle>
                  <Badge className={getDifficultyColor(patient.difficulty_level)}>
                    {patient.difficulty_level}
                  </Badge>
                </div>
                <CardDescription>
                  {patient.age} year old {patient.gender.toLowerCase()} • {patient.specialty}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Presenting Complaint:</p>
                    <p className="text-sm text-gray-600">{patient.presenting_complaint}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Scenario Type:</p>
                    <Badge variant="outline" className="text-xs">
                      {patient.scenario_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Learning Objectives:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {patient.learning_objectives.slice(0, 3).map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    onClick={() => handleStartSession(patient)}
                    className="w-full mt-4"
                    disabled={startSessionMutation.isPending}
                  >
                    {startSessionMutation.isPending ? "Starting..." : "Start Session"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getPhaseIcon(currentSession?.current_phase || 'introduction')}
                    Session with {selectedPatient?.name}
                  </CardTitle>
                  <CardDescription>
                    {currentSession?.current_phase?.replace('_', ' ').toUpperCase()} Phase • 
                    {selectedPatient?.scenario_type?.replace('_', ' ')} Scenario
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPatientInfo(!showPatientInfo)}
                  >
                    Patient Info
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentSession(null);
                      setSelectedPatient(null);
                    }}
                  >
                    End Session
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {(!currentSession?.conversation || currentSession?.conversation.length === 0) && (
                    <div className="text-center py-8">
                      <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                        <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">Ready to begin</h3>
                        <p className="text-sm text-gray-600">
                          Start the conversation by introducing yourself and asking about the patient's concerns.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentSession?.conversation?.map((turn) => (
                    <div key={turn.id} className={`flex gap-3 ${turn.speaker === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-lg rounded-lg p-3 ${
                        turn.speaker === 'doctor' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {turn.speaker === 'doctor' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-xs font-medium">
                            {turn.speaker === 'doctor' ? 'You' : selectedPatient?.name}
                          </span>
                        </div>
                        <p className="text-sm">{turn.message}</p>
                        
                        {turn.analysis && turn.speaker === 'doctor' && (
                          <div className="mt-2 pt-2 border-t border-blue-500/20">
                            <div className="flex gap-4 text-xs">
                              <span>Communication: {turn.analysis.communication_score}/10</span>
                              <span>Empathy: {turn.analysis.empathy_score}/10</span>
                              <span>Clinical: {turn.analysis.clinical_relevance}/10</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {!currentSession?.completed && (
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your response to the patient..."
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      disabled={conversationMutation.isPending}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!message.trim() || conversationMutation.isPending}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Session Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Session Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Score</span>
                  <span>{currentSession?.session_score.overall || 0}/10</span>
                </div>
                <Progress value={(currentSession?.session_score.overall || 0) * 10} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Communication</span>
                  <span>{currentSession?.session_score.communication || 0}/10</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Clinical Knowledge</span>
                  <span>{currentSession?.session_score.clinical_knowledge || 0}/10</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Professionalism</span>
                  <span>{currentSession?.session_score.professionalism || 0}/10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Information */}
          {showPatientInfo && selectedPatient && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Medical History:</p>
                  <ul className="text-xs space-y-1 mt-1">
                    {selectedPatient.medical_history.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <p className="font-medium">Current Medications:</p>
                  <ul className="text-xs space-y-1 mt-1">
                    {selectedPatient.medications.map((med, index) => (
                      <li key={index}>• {med}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <p className="font-medium">Social History:</p>
                  <p className="text-xs mt-1">{selectedPatient.social_history}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session Feedback */}
          {currentSession?.completed && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Session Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-green-700">Strengths:</p>
                  <ul className="text-xs space-y-1 mt-1">
                    {currentSession.feedback.strengths.map((strength, index) => (
                      <li key={index} className="text-green-600">• {strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-orange-700">Areas for Improvement:</p>
                  <ul className="text-xs space-y-1 mt-1">
                    {currentSession.feedback.areas_for_improvement.map((area, index) => (
                      <li key={index} className="text-orange-600">• {area}</li>
                    ))}
                  </ul>
                </div>

                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setCurrentSession(null);
                    setSelectedPatient(null);
                  }}
                >
                  Try Another Patient
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}