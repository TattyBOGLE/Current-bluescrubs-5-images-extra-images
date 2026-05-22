import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Clock, User, AlertTriangle, CheckCircle2, 
  Stethoscope, Heart, Brain, Pill, Search, Filter,
  ChevronRight, Star, Calendar, Users, MessageCircle, Bot
} from "lucide-react";
import { CLINICAL_GUIDES, QUICK_CLINICAL_SUMMARIES, CLINICAL_PATHWAYS, type ClinicalGuide, type QuickClinicalSummary } from "@shared/clinical-guides";

export default function ClinicalGuides() {
  const [selectedGuide, setSelectedGuide] = useState<ClinicalGuide | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [activeTab, setActiveTab] = useState("guides");

  // Tutor state
  const [showAITutor, setShowAITutor] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [tutorInput, setTutorInput] = useState('');
  const [isLoadingTutorResponse, setIsLoadingTutorResponse] = useState(false);

  const filteredGuides = CLINICAL_GUIDES.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.content.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || guide.category === selectedCategory;
    const matchesSpecialty = selectedSpecialty === "all" || guide.specialty === selectedSpecialty;
    
    return matchesSearch && matchesCategory && matchesSpecialty;
  });

  const filteredSummaries = QUICK_CLINICAL_SUMMARIES.filter(summary => {
    const matchesSearch = summary.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summary.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || summary.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(CLINICAL_GUIDES.map(guide => guide.category)));
  const specialties = Array.from(new Set(CLINICAL_GUIDES.map(guide => guide.specialty)));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'foundation': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'very-high': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Tutor functionality for clinical guides
  const handleAskTutor = async (question: string) => {
    if (!question.trim()) return;
    
    const userMessage = { role: 'user' as const, content: question };
    setTutorMessages(prev => [...prev, userMessage]);
    setTutorInput('');
    setIsLoadingTutorResponse(true);

    try {
      const context = selectedGuide ? {
        guideType: 'Clinical Guide',
        guideTitle: selectedGuide.title,
        category: selectedGuide.category,
        specialty: selectedGuide.specialty,
        overview: selectedGuide.content.overview,
        keyPoints: selectedGuide.content.keyPoints
      } : { guideType: 'Clinical Guides General' };

      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context,
          specialty: selectedGuide?.specialty || 'general-medicine',
          examType: 'clinical-knowledge'
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

  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" style={{ color: '#1a1a1a' }}>
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setSelectedGuide(null)}
            className="mb-4"
            style={{ color: '#000000', borderColor: '#000000' }}
          >
            ← Back to Guides
          </Button>
          
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>
                    {selectedGuide.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{selectedGuide.category}</Badge>
                    <Badge variant="outline">{selectedGuide.specialty}</Badge>
                    <Badge className={getDifficultyColor(selectedGuide.difficulty)}>
                      {selectedGuide.difficulty}
                    </Badge>
                    <Badge variant="destructive">
                      {selectedGuide.examRelevance.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getRelevanceColor(selectedGuide.clinicalRelevance)}`}></div>
                  <span className="text-sm" style={{ color: '#333333' }}>Clinical Priority</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm" style={{ color: '#333333' }}>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedGuide.estimatedReadTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedGuide.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Updated {selectedGuide.lastUpdated.toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Overview</h3>
                <p className="text-gray-700 leading-relaxed">{selectedGuide.content.overview}</p>
              </div>

              <Tabs defaultValue="key-points" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="key-points">Key Points</TabsTrigger>
                  <TabsTrigger value="clinical">Clinical</TabsTrigger>
                  <TabsTrigger value="management">Management</TabsTrigger>
                  <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                  <TabsTrigger value="tutor">Tutor</TabsTrigger>
                  <TabsTrigger value="cases">Cases</TabsTrigger>
                </TabsList>
                
                <TabsContent value="key-points" className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Essential Points</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedGuide.content.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    {selectedGuide.content.mnemonics.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            Memory Aids
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedGuide.content.mnemonics.map((mnemonic, index) => (
                              <li key={index} className="bg-purple-50 p-3 rounded-lg">
                                <span className="font-medium text-purple-800">{mnemonic}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="clinical" className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Clinical Presentation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Symptoms</h4>
                          <ul className="grid grid-cols-2 gap-1">
                            {selectedGuide.content.clinicalPresentation.symptoms.map((symptom, index) => (
                              <li key={index} className="text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Signs</h4>
                          <ul className="grid grid-cols-2 gap-1">
                            {selectedGuide.content.clinicalPresentation.signs.map((sign, index) => (
                              <li key={index} className="text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                {sign}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Investigations</h4>
                          <ul className="grid grid-cols-1 gap-1">
                            {selectedGuide.content.clinicalPresentation.investigations.map((investigation, index) => (
                              <li key={index} className="text-sm flex items-center gap-2">
                                <Stethoscope className="w-3 h-3 text-purple-500" />
                                {investigation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          Red Flags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedGuide.content.redFlags.map((flag, index) => (
                            <li key={index} className="bg-red-50 p-2 rounded-lg border-l-4 border-red-400">
                              <span className="text-red-800 font-medium">{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Tutor Integration for Clinical Guides */}
                <TabsContent value="tutor" className="space-y-4">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bot className="w-5 h-5 text-blue-600" />
                          <CardTitle className="text-blue-800">AI Clinical Knowledge Tutor</CardTitle>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAITutor(!showAITutor)}
                        >
                          {showAITutor ? 'Hide' : 'Show'} Tutor
                        </Button>
                      </div>
                    </CardHeader>
                    
                    {showAITutor && (
                      <CardContent className="p-4">
                        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                          {tutorMessages.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <p>Ask me about this clinical guide, medical conditions, or treatment protocols!</p>
                              <p className="text-sm mt-1">Examples: "Explain the pathophysiology" or "What are the differential diagnoses?"</p>
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
                                <p className="text-sm text-gray-600">Tutor is analyzing...</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Input
                            value={tutorInput}
                            onChange={(e) => setTutorInput(e.target.value)}
                            placeholder="Ask about clinical knowledge, guidelines, or medical concepts..."
                            className="flex-1"
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
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="management" className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-red-600">Immediate Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedGuide.content.management.immediate.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-600">Long-term Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedGuide.content.management.longTerm.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-orange-600">Potential Complications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid grid-cols-2 gap-2">
                          {selectedGuide.content.management.complications.map((complication, index) => (
                            <li key={index} className="bg-orange-50 p-2 rounded border-l-2 border-orange-400">
                              <span className="text-sm text-orange-800">{complication}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="guidelines" className="space-y-4">
                  {selectedGuide.content.guidelines.map((guideline, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{guideline.source} ({guideline.year})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {guideline.keyRecommendations.map((recommendation, recIndex) => (
                            <li key={recIndex} className="flex items-start gap-2">
                              <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="cases" className="space-y-4">
                  {selectedGuide.content.casesStudies.map((caseStudy, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">Case Study {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-medium text-blue-600 mb-2">Scenario</h4>
                          <p className="text-sm bg-blue-50 p-3 rounded">{caseStudy.scenario}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">Diagnosis</h4>
                          <p className="text-sm bg-green-50 p-3 rounded font-medium">{caseStudy.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-600 mb-2">Clinical Reasoning</h4>
                          <p className="text-sm bg-purple-50 p-3 rounded">{caseStudy.reasoning}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" style={{ color: '#1a1a1a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>Clinical Knowledge Hub</h1>
          <p style={{ color: '#333333' }}>Comprehensive medical guides and clinical summaries for PLAB preparation</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search guides, conditions, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guides">Comprehensive Guides</TabsTrigger>
            <TabsTrigger value="summaries">Quick Summaries</TabsTrigger>
            <TabsTrigger value="pathways">Clinical Pathways</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredGuides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedGuide(guide)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold leading-tight mb-2" style={{ color: '#000000' }}>
                          {guide.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="secondary" className="text-xs">{guide.category}</Badge>
                          <Badge className={`text-xs ${getDifficultyColor(guide.difficulty)}`}>
                            {guide.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getRelevanceColor(guide.clinicalRelevance)} flex-shrink-0`}></div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm mb-3 line-clamp-3" style={{ color: '#333333' }}>
                      {guide.content.overview}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs" style={{ color: '#666666' }}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {guide.estimatedReadTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />
                        Read Guide
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredGuides.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p style={{ color: '#666666' }}>No guides found matching your criteria</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="summaries" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSummaries.map((summary, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{summary.condition}</CardTitle>
                      <Badge variant="outline">{summary.category}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-blue-600">Key Facts</h4>
                      <ul className="text-sm space-y-1">
                        {summary.keyFacts.map((fact, factIndex) => (
                          <li key={factIndex} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">First-line Management</h4>
                      <ul className="text-sm space-y-1">
                        {summary.firstLineManagement.slice(0, 3).map((management, mgmtIndex) => (
                          <li key={mgmtIndex} className="flex items-start gap-2">
                            <Pill className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            {management}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-red-600">Red Flags</h4>
                      <ul className="text-sm space-y-1">
                        {summary.redFlags.slice(0, 2).map((flag, flagIndex) => (
                          <li key={flagIndex} className="flex items-start gap-2">
                            <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600">
                        <strong>Prognosis:</strong> {summary.prognosis}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pathways" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(CLINICAL_PATHWAYS).map(([key, pathway]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg">{pathway.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {pathway.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}