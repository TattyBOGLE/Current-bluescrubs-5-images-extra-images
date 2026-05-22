import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Stethoscope, Play, Clock, Users, Video, Mic, 
  CheckCircle, Star, Calendar, Award, BookOpen,
  ClipboardList, Heart, Brain, AlertTriangle, ArrowLeft, Volume2,
  Globe, Languages, MessageCircle, Bot, Activity, Eye, Maximize
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPANDED_PLAB2_STATIONS, EXPANDED_STATION_STATS, EnhancedOSCEStation } from "@shared/expanded-plab2-stations";
import plab2BgImage from '@assets/6675ABC6-B1E7-4E4C-92C4-D90C32FA1CB4_1750366172462.png';

// Define station types for filtering
const OSCE_STATION_TYPES = [
  { value: 'all', label: 'All Stations' },
  { value: 'history', label: 'History Taking' },
  { value: 'examination', label: 'Physical Examination' },
  { value: 'communication', label: 'Communication Skills' },
  { value: 'practical', label: 'Practical Procedures' },
  { value: 'data-interpretation', label: 'Data Interpretation' },
  { value: 'emergency', label: 'Emergency Management' }
];
import { useQuery } from "@tanstack/react-query";
import { NeuroSettings, useNeuroAccommodations } from "@/components/neurodiversity-settings";
import { type NeuroAtypicalType, NEURO_ACCOMMODATIONS } from "@shared/neurodiversity-schema";
import { AudioSupport } from "@/components/audio-support";

interface OSCEStation {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration: number;
  description: string;
  scenario: string;
  instructions: {
    candidate: string;
    examiner: string;
    standardizedPatient?: string;
  };
  markingCriteria: Array<{
    category: string;
    maxMarks: number;
    criteria: string[];
  }>;
  keyActions: string[];
  redFlags: string[];
  differentialDiagnosis?: string[];
  medications?: Array<{
    name: string;
    indication: string;
    dosage: string;
    sideEffects: string[];
    contraindications: string[];
  }>;
  references: Array<{
    title: string;
    url: string;
  }>;
  completed: boolean;
  attempts: number;
  bestScore: number;
}

export default function Plab2Osce() {
  const [activeStation, setActiveStation] = useState<EnhancedOSCEStation | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [completedStations, setCompletedStations] = useState<string[]>([]);
  const [stationScores, setStationScores] = useState<Record<string, number>>({});

  // Translation and language state
  const [isTranslationMode, setIsTranslationMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translateStations, setTranslateStations] = useState(false);
  const [translatedStations, setTranslatedStations] = useState<Record<string, any>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Neurodiversity settings
  const [neuroAccommodations, setNeuroAccommodations] = useState<NeuroAtypicalType[]>(['none']);
  const { accommodations, questionStyles, buttonStyles } = useNeuroAccommodations(neuroAccommodations);

  // Tutor state
  const [showAITutor, setShowAITutor] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [tutorInput, setTutorInput] = useState('');
  const [isLoadingTutorResponse, setIsLoadingTutorResponse] = useState(false);

  // Load neurodiversity settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('neuro-accommodations');
    if (saved) {
      try {
        setNeuroAccommodations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved accommodations');
      }
    }
  }, []);

  // Save neurodiversity settings to localStorage
  const handleAccommodationsChange = (accommodations: NeuroAtypicalType[]) => {
    setNeuroAccommodations(accommodations);
    localStorage.setItem('neuro-accommodations', JSON.stringify(accommodations));
  };

  // Translation and voice functions
  const translateText = (text: string): string => {
    if (!isTranslationMode || selectedLanguage === 'en') return text;
    
    // Quick fallback translations for common medical terms
    const quickTranslations: Record<string, Record<string, string>> = {
      'ar': {
        'PLAB 2 OSCE': 'بلاب 2 أوسي', 'History Taking': 'أخذ التاريخ المرضي', 'Physical Examination': 'الفحص الجسدي',
        'Communication': 'التواصل', 'Clinical Skills': 'المهارات السريرية', 'Start Station': 'بدء المحطة'
      },
      'hi': {
        'PLAB 2 OSCE': 'प्लैब 2 ओएससीई', 'History Taking': 'इतिहास लेना', 'Physical Examination': 'शारीरिक परीक्षा',
        'Communication': 'संचार', 'Clinical Skills': 'नैदानिक कौशल', 'Start Station': 'स्टेशन शुरू करें'
      },
      'ur': {
        'PLAB 2 OSCE': 'پلیب 2 او ایس سی ای', 'History Taking': 'تاریخ لینا', 'Physical Examination': 'جسمانی معائنہ',
        'Communication': 'رابطہ', 'Clinical Skills': 'طبی مہارتیں', 'Start Station': 'سٹیشن شروع کریں'
      }
    };
    
    const translations = quickTranslations[selectedLanguage] || {};
    let translated = text;
    Object.entries(translations).forEach(([english, native]) => {
      translated = translated.replace(new RegExp(english, 'gi'), native);
    });
    return translated;
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 0.95;
      
      const voices = window.speechSynthesis.getVoices();
      let preferredVoice;
      
      if (selectedLanguage && selectedLanguage !== 'en') {
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith(selectedLanguage) && 
          (voice.name.includes('Natural') || voice.name.includes('Enhanced'))
        ) || voices.find(voice => voice.lang.startsWith(selectedLanguage));
      }
      
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Natural') || voice.name.includes('Enhanced') || voice.name.includes('Premium'))
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Translate OSCE station content
  const translateStation = async (station: EnhancedOSCEStation) => {
    if (!translateStations || selectedLanguage === 'en') return station;
    
    const cacheKey = `${station.id}_${selectedLanguage}`;
    if (translatedStations[cacheKey]) {
      return translatedStations[cacheKey];
    }
    
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate-osce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          station: station,
          targetLanguage: selectedLanguage
        })
      });
      
      if (response.ok) {
        const translated = await response.json();
        setTranslatedStations(prev => ({ ...prev, [cacheKey]: translated }));
        return translated;
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
    
    return station;
  };

  // Fetch authentic UK medical OSCE stations
  const { data: osceStations = [], isLoading, error } = useQuery({
    queryKey: ['/api/osce/stations', selectedType],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: selectedType,
        count: '20'
      });
      const response = await fetch(`/api/osce/stations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch OSCE stations');
      return response.json();
    }
  });

  const filteredStations = osceStations.filter((station: OSCEStation) => 
    selectedType === 'all' || station.category.toLowerCase().includes(selectedType.toLowerCase())
  );

  const handleStationComplete = (stationId: string, score: number) => {
    setCompletedStations(prev => [...prev, stationId]);
    setStationScores(prev => ({ ...prev, [stationId]: score }));
    setActiveStation(null);
  };

  const getStationTypeIcon = (type: string) => {
    switch (type) {
      case 'history': return ClipboardList;
      case 'examination': return Stethoscope;
      case 'explanation': return BookOpen;
      case 'ethics': return Users;
      case 'acute-care': return AlertTriangle;
      case 'practical-skills': return Heart;
      default: return Star;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'foundation': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverallProgress = () => {
    return (completedStations.length / EXPANDED_PLAB2_STATIONS.length) * 100;
  };

  const getAverageScore = () => {
    const scores = Object.values(stationScores);
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  };

  // Tutor functionality
  const handleAskTutor = async (question: string) => {
    if (!question.trim()) return;
    
    const userMessage = { role: 'user' as const, content: question };
    setTutorMessages(prev => [...prev, userMessage]);
    setTutorInput('');
    setIsLoadingTutorResponse(true);

    try {
      const context = activeStation ? {
        stationType: 'PLAB 2 OSCE',
        stationTitle: activeStation.title,
        scenario: activeStation.scenario,
        instructions: activeStation.instructions,
        keyActions: activeStation.keyActions || [],
        redFlags: activeStation.redFlags
      } : { stationType: 'PLAB 2 OSCE General' };

      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context,
          specialty: 'clinical-skills',
          examType: 'plab2-osce'
        })
      });

      if (!response.ok) throw new Error('Failed to get tutor response');
      
      const data = await response.json();
      const assistantMessage = { role: 'assistant' as const, content: data.response };
      setTutorMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Tutor error:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'I apologize, but I encountered an error. Please try asking your question again.' 
      };
      setTutorMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoadingTutorResponse(false);
    }
  };

  if (activeStation) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setActiveStation(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Stations
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{activeStation.title}</h1>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-lg font-semibold">Station Scenario</h3>
                  {accommodations.audioSupport && (
                    <AudioSupport 
                      text={activeStation.scenario}
                      size="default"
                    />
                  )}
                </div>
                <p className="text-gray-700 mb-6">{activeStation.scenario}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Instructions</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Candidate:</strong> {activeStation.instructions.candidate}</p>
                      <p><strong>Examiner:</strong> {activeStation.instructions.examiner}</p>
                      {activeStation.instructions.standardizedPatient && (
                        <p><strong>Standardized Patient:</strong> {activeStation.instructions.standardizedPatient}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Marking Criteria</h4>
                    <div className="space-y-3 text-sm text-gray-600">
                      {activeStation.markingCriteria.map((criteria, index) => (
                        <div key={index} className="border-l-2 border-slate-200 pl-3">
                          <div className="font-medium text-gray-900">{criteria.category}</div>
                          <div className="text-xs text-gray-500 mb-1">Max: {criteria.maxMarks} marks</div>
                          <ul className="list-disc pl-4 space-y-1">
                            {criteria.criteria.map((criterion, idx) => (
                              <li key={idx}>{criterion}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* BNF Medication Information */}
                {activeStation.medications && activeStation.medications.length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">BNF Medication Guidance</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Key Medications:</h5>
                        <div className="flex flex-wrap gap-2">
                          {activeStation.medications.map((med, index) => (
                            <Badge key={index} variant="outline" className="bg-white border-green-300 text-green-700">
                              {med}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {activeStation.bnfGuidance && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">Clinical Guidance:</h5>
                          <p className="text-sm text-green-600 leading-relaxed">{activeStation.bnfGuidance}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Clinical Reasoning */}
                {activeStation.clinicalReasoning && (
                  <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Clinical Reasoning</h4>
                    </div>
                    <ul className="space-y-2">
                      {activeStation.clinicalReasoning.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-purple-700">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Red Flags */}
                {activeStation.redFlags && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold text-red-800">Red Flags</h4>
                    </div>
                    <ul className="space-y-2">
                      {activeStation.redFlags.map((flag, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tutor Chat Interface */}
                <div className="mt-6 border border-gray-200 rounded-lg">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-teal-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        <h4 
                          id="ai-clinical-skills-tutor-heading" 
                          className="font-semibold ai-tutor-text" 
                          style={{ 
                            color: '#000000 !important',
                            backgroundColor: 'rgba(59, 130, 246, 0.9)',
                            padding: '2px 4px',
                            borderRadius: '4px'
                          }}
                        >
                          Clinical Skills Tutor
                        </h4>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAITutor(!showAITutor)}
                      >
                        {showAITutor ? 'Hide' : 'Show'} Tutor
                      </Button>
                    </div>
                  </div>
                  
                  {showAITutor && (
                    <div className="p-4">
                      <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                        {tutorMessages.length === 0 && (
                          <div className="text-center text-gray-500 py-8">
                            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p>Ask me about this OSCE station, clinical skills, or exam techniques!</p>
                            <p className="text-sm mt-1">Examples: "What are key communication skills for this scenario?" or "How should I approach the physical examination?"</p>
                          </div>
                        )}
                        {tutorMessages.map((message, index) => (
                          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        ))}
                        {isLoadingTutorResponse && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 p-3 rounded-lg">
                              <p className="text-sm text-gray-600">Tutor is thinking...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Textarea
                          value={tutorInput}
                          onChange={(e) => setTutorInput(e.target.value)}
                          placeholder="Ask about clinical skills, examination techniques, or this OSCE station..."
                          className="flex-1"
                          rows={2}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAskTutor(tutorInput);
                            }
                          }}
                        />
                        <Button
                          onClick={() => handleAskTutor(tutorInput)}
                          disabled={!tutorInput.trim() || isLoadingTutorResponse}
                          className="self-end"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">
                      Time Limit: {accommodations.extendedTime ? Math.round(activeStation.duration * accommodations.timeMultiplier) : activeStation.duration} minutes
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">Use the timer to practice under exam conditions</p>
                </div>

                {/* Educational Disclaimer */}
                <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800 font-medium">
                    ⚠️ Educational Disclaimer: This information is for educational purposes only and not a substitute for professional medical advice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div 
        className="relative bg-gradient-to-r from-teal-600 to-teal-700 w-full h-64 md:h-80 lg:h-96 mb-8 overflow-hidden"
        style={{
          backgroundImage: `url(${plab2BgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
          willChange: 'transform',
          contain: 'layout style paint'
        }}
      >

        <div className="relative z-50 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-12 sm:py-16 hero-text">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-black">
            PLAB 2 OSCE Practice
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-6 px-4 text-black">
            Master clinical skills with comprehensive OSCE stations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">{translateText('Practice Overview')}</h2>
          </div>
          <p className="text-lg text-gray-600">{translateText('Comprehensive OSCE practice with 16-20 clinical stations covering history taking, examination, explanation, ethics, and acute care scenarios')}</p>
          
          {/* Language Toggle */}
          <div className="flex items-center gap-4 mt-4 p-3 bg-blue-50 rounded-lg border border-slate-200">
            <Globe className="w-4 h-4 text-blue-600" />
            <div className="flex items-center gap-3">
              <Switch
                checked={isTranslationMode}
                onCheckedChange={(checked) => {
                  setIsTranslationMode(checked);
                  setTranslateStations(checked);
                }}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className="text-sm font-medium text-blue-900">{translateText('Translation Mode')}</span>
            </div>
            {isTranslationMode && (
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-48 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72 overflow-y-auto">
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                  <SelectItem value="ar">🇸🇦 Arabic</SelectItem>
                  <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
                  <SelectItem value="ur">🇵🇰 Urdu</SelectItem>
                  <SelectItem value="bn">🇧🇩 Bengali</SelectItem>
                  <SelectItem value="ta">🇱🇰 Tamil</SelectItem>
                  <SelectItem value="te">🇮🇳 Telugu</SelectItem>
                  <SelectItem value="gu">🇮🇳 Gujarati</SelectItem>
                  <SelectItem value="kn">🇮🇳 Kannada</SelectItem>
                  <SelectItem value="ml">🇮🇳 Malayalam</SelectItem>
                  <SelectItem value="pa">🇮🇳 Punjabi</SelectItem>
                  <SelectItem value="mr">🇮🇳 Marathi</SelectItem>
                  <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                  <SelectItem value="fr">🇫🇷 French</SelectItem>
                  <SelectItem value="de">🇩🇪 German</SelectItem>
                  <SelectItem value="it">🇮🇹 Italian</SelectItem>
                  <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
                  <SelectItem value="ru">🇷🇺 Russian</SelectItem>
                  <SelectItem value="pl">🇵🇱 Polish</SelectItem>
                  <SelectItem value="ro">🇷🇴 Romanian</SelectItem>
                  <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                  <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                  <SelectItem value="ko">🇰🇷 Korean</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Official PLAB 2 Format</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>8-10 minutes per station</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>16-20 total stations</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Pass mark: 50%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility & Neurodiversity Support */}
        <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-r from-teal-500 to-rose-500">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-purple-900">Accessibility Settings</h3>
                  <p className="text-purple-700">Customize your OSCE practice for ADHD, dyslexia, autism, and other learning differences</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-purple-700 font-medium">Enhanced support for diverse learning needs</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <NeuroSettings 
                  selectedAccommodations={neuroAccommodations}
                  onAccommodationsChange={handleAccommodationsChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Neurodiversity Information */}
        {neuroAccommodations.length > 0 && !neuroAccommodations.includes('none') && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Active Accessibility Settings</h3>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Your OSCE accommodations are active: {neuroAccommodations
                  .filter(acc => acc !== 'none')
                  .map(acc => {
                    const accommodation = NEURO_ACCOMMODATIONS.find(na => na.id === acc);
                    return accommodation?.name;
                  })
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <div className="flex flex-wrap gap-2">
                {accommodations.extendedTime && (
                  <Badge variant="outline" className="text-xs bg-white">
                    {accommodations.timeMultiplier}x Extended Time
                  </Badge>
                )}
                {accommodations.largerButtons && (
                  <Badge variant="outline" className="text-xs bg-white">Larger Buttons</Badge>
                )}
                {accommodations.visualCues && (
                  <Badge variant="outline" className="text-xs bg-white">Visual Cues</Badge>
                )}
                {accommodations.audioSupport && (
                  <Badge variant="outline" className="text-xs bg-white flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    Audio Support
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* PLAB 2 OSCE Practice Section - Now under accessibility settings */}
        <div className="border-t-4 border-slate-200 pt-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">OSCE Practice Stations</h2>
          </div>



          {/* Station Type Filters with 3D Anatomy */}
          <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 gap-1">
              <TabsTrigger 
                value="all" 
                className={accommodations.largerButtons ? 'text-[10px] md:text-sm py-2 text-gray-700' : 'text-[9px] md:text-xs text-gray-700'}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className={accommodations.largerButtons ? 'text-[10px] md:text-sm py-2 text-gray-700' : 'text-[9px] md:text-xs text-gray-700'}
              >
                History
              </TabsTrigger>
              <TabsTrigger 
                value="examination" 
                className={accommodations.largerButtons ? 'text-[10px] md:text-sm py-2 text-gray-700' : 'text-[9px] md:text-xs text-gray-700'}
              >
                Exam
              </TabsTrigger>
              <TabsTrigger 
                value="explanation" 
                className={accommodations.largerButtons ? 'text-[10px] md:text-sm py-2 text-gray-700' : 'text-[9px] md:text-xs text-gray-700'}
              >
                Explain
              </TabsTrigger>
              <TabsTrigger 
                value="ethics" 
                className={accommodations.largerButtons ? 'text-[10px] md:text-sm py-2 text-gray-700' : 'text-[9px] md:text-xs text-gray-700'}
              >
                Ethics
              </TabsTrigger>
              <TabsTrigger 
                value="acute-care" 
                className={accommodations.largerButtons ? 'text-[10px] md:text-sm py-2 text-gray-700' : 'text-[9px] md:text-xs text-gray-700'}
              >
                Acute
              </TabsTrigger>
              <TabsTrigger 
                value="practical-skills" 
                className={accommodations.largerButtons ? 'text-[10px] md:text-sm py-2 text-gray-700' : 'text-[9px] md:text-xs text-gray-700'}
              >
                Skills
              </TabsTrigger>

            </TabsList>



          <TabsContent value={selectedType} className="mt-6">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading OSCE stations...</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">Error loading stations: {error.message}</p>
              </div>
            )}
            
            {!isLoading && !error && filteredStations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No stations found for the selected type.</p>
              </div>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredStations.map((station: any, index: number) => {
                const IconComponent = getStationTypeIcon(station.category);
                const isCompleted = completedStations.includes(station.id);
                const score = stationScores[station.id];

                return (
                  <Card key={station.id} className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
                    isCompleted 
                      ? 'border-green-300 bg-green-50 shadow-md' 
                      : 'border-gray-200 hover:border-teal-300 hover:shadow-md'
                  }`} onClick={() => setActiveStation(station)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">Station {index + 1}</span>
                        </div>
                        {isCompleted && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{score}/20</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight text-gray-900">{station.title}</CardTitle>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">{station.category}</Badge>
                        <Badge className={`text-xs ${getDifficultyColor(station.difficulty)}`}>
                          {station.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {station.duration}min
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {station.description || station.scenario}
                      </p>
                      
                      {/* Medication Information */}
                      {station.medications && station.medications.length > 0 && (
                        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center gap-1 mb-1">
                            <Heart className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-medium text-green-700">Key Medications</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {station.medications.slice(0, 3).map((med: any, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs bg-white border-green-300 text-green-700">
                                {typeof med === 'string' ? med : med.name}
                              </Badge>
                            ))}
                            {station.medications.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-white border-green-300 text-green-700">
                                +{station.medications.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {station.duration} minutes
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className={`w-3 h-3 ${station.examFrequency === 'very-high' ? 'text-red-500' : station.examFrequency === 'high' ? 'text-orange-500' : 'text-gray-400'}`} />
                          {station.examFrequency}
                        </div>
                      </div>

                      <Button 
                        onClick={() => setActiveStation(station)}
                        className={`w-full ${accommodations.largerButtons ? 'py-3 text-base' : ''}`}
                        variant={isCompleted ? "outline" : "default"}
                      >
                        {isCompleted ? 'Review Station' : 'Start Station'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
        </div>


      </div>
    </div>
  );
}

// OSCE Station View Component
function OSCEStationView({ 
  station, 
  onComplete, 
  onBack 
}: { 
  station: OSCEStation; 
  onComplete: (stationId: string, score: number) => void;
  onBack: () => void;
}) {
  const [currentSection, setCurrentSection] = useState<'instructions' | 'scenario' | 'marking' | 'feedback'>('instructions');
  const [timeRemaining, setTimeRemaining] = useState(station.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [selfScore, setSelfScore] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'foundation': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stations
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeRemaining)}</div>
              <div className="text-sm text-gray-600">Time Remaining</div>
            </div>
            <Button
              onClick={() => setIsRunning(!isRunning)}
              variant={isRunning ? "destructive" : "default"}
            >
              {isRunning ? 'Pause' : 'Start Timer'}
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2 text-gray-900">Station {(station as any).stationNumber || station.id}: {station.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{OSCE_STATION_TYPES.find(t => t.value === (station as any).type)?.label || (station as any).type}</Badge>
                  <Badge className={getDifficultyColor(station.difficulty)}>{station.difficulty}</Badge>
                  <Badge variant="outline">{station.category}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={currentSection} onValueChange={setCurrentSection as any} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="scenario">Scenario</TabsTrigger>
            <TabsTrigger value="marking">Marking Criteria</TabsTrigger>
            <TabsTrigger value="feedback">Self-Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="instructions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Candidate Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-gray-700">{station.instructions.candidate}</p>
              </CardContent>
            </Card>
            
            {station.instructions.standardizedPatient && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-gray-700">{station.instructions.standardizedPatient}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="scenario" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Clinical Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-gray-700">{station.scenario}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marking" className="space-y-4">
            {station.markingCriteria.map((criteria, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{criteria.category} ({criteria.maxMarks} marks)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {criteria.criteria.map((criterion, criterionIndex) => (
                      <li key={criterionIndex} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-600 font-medium">•</span>
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Your Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Record your approach, observations, and key points..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="min-h-32"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Self-Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Self-Score (out of 20):</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="20" 
                    value={selfScore}
                    onChange={(e) => setSelfScore(parseInt(e.target.value) || 0)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <Button 
                  onClick={() => onComplete(station.id, selfScore)}
                  className="w-full"
                >
                  Complete Station
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}