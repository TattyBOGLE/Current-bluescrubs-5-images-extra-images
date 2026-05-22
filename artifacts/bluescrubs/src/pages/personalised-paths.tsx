import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Route, 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Brain,
  Stethoscope,
  Users,
  Award,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

export default function PersonalisedPaths() {
  const [selectedPath, setSelectedPath] = useState('plab1');

  const learningPaths = {
    plab1: {
      title: "PLAB 1 Preparation Path",
      description: "Comprehensive pathway for PLAB 1 exam success",
      duration: "12-16 weeks",
      difficulty: "Intermediate",
      progress: 35,
      modules: [
        {
          id: 1,
          title: "Medical Knowledge Foundation",
          status: "completed",
          duration: "3 weeks",
          topics: ["Anatomy", "Physiology", "Pathology", "Pharmacology"],
          score: 92
        },
        {
          id: 2,
          title: "Clinical Medicine",
          status: "in-progress",
          duration: "4 weeks", 
          topics: ["Internal Medicine", "Surgery", "Pediatrics", "Obstetrics"],
          score: 78
        },
        {
          id: 3,
          title: "UK Medical Practice",
          status: "locked",
          duration: "2 weeks",
          topics: ["NICE Guidelines", "NHS Protocols", "UK Prescribing"],
          score: null
        },
        {
          id: 4,
          title: "Exam Techniques",
          status: "locked", 
          duration: "3 weeks",
          topics: ["SBA Questions", "Time Management", "Mock Exams"],
          score: null
        }
      ]
    },
    plab2: {
      title: "PLAB 2 OSCE Preparation Path",
      description: "Intensive clinical skills and communication training",
      duration: "8-12 weeks",
      difficulty: "Advanced",
      progress: 20,
      modules: [
        {
          id: 1,
          title: "Clinical Examination Skills",
          status: "in-progress",
          duration: "3 weeks",
          topics: ["CVS Exam", "Respiratory Exam", "Neurological Exam"],
          score: 85
        },
        {
          id: 2,
          title: "Communication Skills",
          status: "locked",
          duration: "2 weeks",
          topics: ["History Taking", "Breaking Bad News", "Counseling"],
          score: null
        },
        {
          id: 3,
          title: "Practical Procedures",
          status: "locked",
          duration: "3 weeks",
          topics: ["Venipuncture", "ECG", "Peak Flow", "Urinalysis"],
          score: null
        },
        {
          id: 4,
          title: "OSCE Stations Practice",
          status: "locked",
          duration: "4 weeks",
          topics: ["Mock OSCEs", "Standardized Patients", "Feedback"],
          score: null
        }
      ]
    },
    foundation: {
      title: "Foundation Knowledge Path",
      description: "Essential medical knowledge for international graduates",
      duration: "6-8 weeks",
      difficulty: "Beginner",
      progress: 60,
      modules: [
        {
          id: 1,
          title: "Basic Sciences Review",
          status: "completed",
          duration: "2 weeks",
          topics: ["Human Biology", "Basic Pathology", "Microbiology"],
          score: 88
        },
        {
          id: 2,
          title: "UK Healthcare System",
          status: "completed",
          duration: "1 week",
          topics: ["NHS Structure", "Patient Rights", "Healthcare Delivery"],
          score: 94
        },
        {
          id: 3,
          title: "Medical English",
          status: "in-progress",
          duration: "2 weeks",
          topics: ["Medical Terminology", "Patient Communication", "Documentation"],
          score: 76
        },
        {
          id: 4,
          title: "Professional Standards",
          status: "locked",
          duration: "1 week",
          topics: ["GMC Standards", "Medical Ethics", "Professionalism"],
          score: null
        }
      ]
    }
  };

  const currentPath = learningPaths[selectedPath];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-blue-600" />;
      case 'locked':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Basic':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
      case 'PLAB Standard':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ color: '#1a1a1a' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Route className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>
                Personalised Learning Paths
              </h1>
              <p className="text-lg" style={{ color: '#555555' }}>
                curated study pathways tailored to your goals and progress
              </p>
            </div>
          </div>
        </div>

        {/* Path Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Object.entries(learningPaths).map(([key, path]) => (
            <Card 
              key={key} 
              className={`cursor-pointer transition-all ${
                selectedPath === key 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPath(key)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg" style={{ color: '#000000' }}>
                      {path.title}
                    </CardTitle>
                    <CardDescription style={{ color: '#666666' }}>
                      {path.description}
                    </CardDescription>
                  </div>
                  <Badge className={getDifficultyColor(path.difficulty)}>
                    {path.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#666666' }}>Progress</span>
                    <span style={{ color: '#000000' }} className="font-medium">
                      {path.progress}%
                    </span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                  <div className="flex items-center gap-4 text-sm" style={{ color: '#666666' }}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {path.modules.length} modules
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Path Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Path Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#000000' }}>
                  <Target className="w-5 h-5" />
                  {currentPath.title}
                </CardTitle>
                <CardDescription style={{ color: '#666666' }}>
                  {currentPath.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentPath.modules.map((module, index) => (
                    <div 
                      key={module.id}
                      className={`p-4 rounded-lg border ${
                        module.status === 'locked' 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(module.status)}
                          <div>
                            <h3 className="font-semibold" style={{ color: '#000000' }}>
                              {module.title}
                            </h3>
                            <p className="text-sm" style={{ color: '#666666' }}>
                              Duration: {module.duration}
                            </p>
                          </div>
                        </div>
                        {module.score && (
                          <Badge variant="outline" className="text-green-700">
                            Score: {module.score}%
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {module.topics.map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          disabled={module.status === 'locked'}
                          className={
                            module.status === 'completed' 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : module.status === 'in-progress'
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : ''
                          }
                        >
                          {module.status === 'completed' ? 'Review' : 
                           module.status === 'in-progress' ? 'Continue' : 'Locked'}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: '#000000' }}>
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
                      {currentPath.progress}%
                    </div>
                    <Progress value={currentPath.progress} className="h-3 mb-2" />
                    <p className="text-sm" style={{ color: '#666666' }}>
                      Overall completion
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: '#666666' }}>Completed</span>
                      <span className="text-sm font-medium" style={{ color: '#000000' }}>
                        {currentPath.modules.filter(m => m.status === 'completed').length} modules
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: '#666666' }}>In Progress</span>
                      <span className="text-sm font-medium" style={{ color: '#000000' }}>
                        {currentPath.modules.filter(m => m.status === 'in-progress').length} modules
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: '#666666' }}>Remaining</span>
                      <span className="text-sm font-medium" style={{ color: '#000000' }}>
                        {currentPath.modules.filter(m => m.status === 'locked').length} modules
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#000000' }}>
                  <Calendar className="w-5 h-5" />
                  Study Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span style={{ color: '#666666' }}>Daily Target</span>
                      <span style={{ color: '#000000' }} className="font-medium">2 hours</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: '#666666' }}>This Week</span>
                      <span style={{ color: '#000000' }} className="font-medium">12 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#666666' }}>Estimated Completion</span>
                      <span style={{ color: '#000000' }} className="font-medium">{currentPath.duration}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#000000' }}>
                  <Brain className="w-5 h-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p style={{ color: '#000000' }}>
                      Focus on weak areas in Clinical Medicine module to improve overall score
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p style={{ color: '#000000' }}>
                      Great progress! You're ahead of schedule in Foundation Knowledge
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p style={{ color: '#000000' }}>
                      Consider increasing study time to 3 hours daily for faster progress
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}