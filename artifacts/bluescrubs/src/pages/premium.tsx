import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video, 
  Brain, 
  Headset, 
  Award, 
  Users, 
  Clock, 
  Star, 
  Globe, 
  Zap,
  CheckCircle,
  PlayCircle,
  Calendar,
  MessageSquare,
  BookOpen,
  Trophy,
  Shield,
  Download,
  Stethoscope,
  TrendingUp
} from "lucide-react";

export default function Premium() {
  const [activeFeature, setActiveFeature] = useState("comprehensive-question-bank");

  const premiumFeatures = [
    {
      id: "comprehensive-question-bank",
      name: "Full Question Bank Access",
      icon: Brain,
      description: "Complete access to 656+ authentic PLAB questions",
      price: "£19/month",
      features: [
        "656+ authentic MCQ questions",
        "Detailed clinical explanations",
        "UK guideline integration",
        "Professional mnemonics",
        "Category-based filtering"
      ],
      stats: {
        questions: "656+ questions",
        coverage: "11 specialties",
        accuracy: "UK standard"
      }
    },
    {
      id: "osce-practice-full",
      name: "Complete OSCE Practice",
      icon: Stethoscope,
      description: "176 comprehensive PLAB 2 clinical stations",
      price: "£25/month",
      features: [
        "176 authentic OSCE stations",
        "Detailed marking criteria",
        "Clinical skills tutor",
        "Multi-language support",
        "Progress tracking"
      ],
      stats: {
        stations: "176 stations",
        types: "6 station types",
        languages: "39 languages"
      }
    },
    {
      id: "multimedia-learning",
      name: "Multimedia Learning Suite",
      icon: Video,
      description: "Advanced video learning with custom player",
      price: "£15/month",
      features: [
        "Custom video player",
        "Chapter navigation",
        "Progress tracking",
        "Subtitle support",
        "Offline capability"
      ],
      stats: {
        features: "Full multimedia",
        tracking: "Progress saved",
        access: "Offline ready"
      }
    },
    {
      id: "personalized-analytics",
      name: "Advanced Analytics",
      icon: TrendingUp,
      description: "Comprehensive performance tracking and insights",
      price: "£12/month",
      features: [
        "Local analytics engine",
        "Weakness detection",
        "Adaptive difficulty",
        "Study scheduling",
        "Performance visualization"
      ],
      stats: {
        tracking: "Real-time",
        features: "5 analytics tabs",
        insights: "Personalized"
      }
    }
  ];

  const tutorMarketplace = [
    {
      name: "Dr. Sarah Thompson",
      specialty: "Cardiology",
      experience: "10 years",
      rating: 4.9,
      reviews: 127,
      rate: "£80/hour",
      languages: ["English", "French"],
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. Amira Hassan", 
      specialty: "General Practice",
      experience: "8 years",
      rating: 4.8,
      reviews: 94,
      rate: "£75/hour",
      languages: ["English", "Arabic", "Urdu"],
      image: "https://images.unsplash.com/photo-1594824804732-ca8db76fb37d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. Rajesh Patel",
      specialty: "Internal Medicine", 
      experience: "15 years",
      rating: 4.95,
      reviews: 203,
      rate: "£90/hour",
      languages: ["English", "Hindi", "Gujarati"],
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const vrScenarios = [
    {
      title: "NHS Medical Ward Round",
      description: "Practice communication with diverse patients in a UK hospital setting",
      difficulty: "Intermediate",
      duration: "45 minutes",
      category: "Cultural Communication",
      completion: 78
    },
    {
      title: "A&E Trauma Response",
      description: "Respond to emergency situations with rapid assessment protocols",
      difficulty: "Advanced", 
      duration: "30 minutes",
      category: "Emergency Medicine",
      completion: 65
    },
    {
      title: "Cardiology Examination",
      description: "Interactive 3D heart anatomy with clinical correlations",
      difficulty: "Beginner",
      duration: "60 minutes", 
      category: "Anatomy Practice",
      completion: 92
    }
  ];

  const certificationPaths = [
    {
      title: "PLAB Foundation Certificate",
      level: "Foundation",
      duration: "40 hours",
      cpdPoints: 15,
      modules: 8,
      assessments: 3,
      recognition: "Royal College of Physicians",
      progress: 45
    },
    {
      title: "Clinical Communication Excellence",
      level: "Advanced", 
      duration: "60 hours",
      cpdPoints: 25,
      modules: 12,
      assessments: 5,
      recognition: "Academy of Medical Royal Colleges",
      progress: 0
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Premium Features</h1>
        <p className="text-lg text-muted-foreground">
          Unlock advanced capabilities designed for serious PLAB preparation and professional development
        </p>
      </div>

      {/* Feature Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {premiumFeatures.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card 
              key={feature.id}
              className={`cursor-pointer transition-all ${
                activeFeature === feature.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">{feature.price}</Badge>
                </div>
                <CardTitle className="text-lg">{feature.name}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {Object.entries(feature.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Feature Tabs */}
      <Tabs value={activeFeature} onValueChange={setActiveFeature} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-1">
          {premiumFeatures.map((feature) => (
            <TabsTrigger key={feature.id} value={feature.id} className="text-xs py-2 px-2 whitespace-normal text-center leading-tight">
              {feature.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="comprehensive-question-bank" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Live Video Consultations
                </CardTitle>
                <CardDescription className="text-gray-700 font-medium">
                  Connect with qualified UK doctors for personalised OSCE practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {premiumFeatures.find(f => f.id === 'video-consultation')?.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Available Tutors</CardTitle>
                <CardDescription className="text-gray-700 font-medium">Verified PLAB examiners and NHS doctors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tutorMarketplace.slice(0, 2).map((tutor, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar>
                      <AvatarImage src={tutor.image} />
                      <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{tutor.name}</div>
                      <div className="text-sm text-gray-700 font-medium">{tutor.specialty}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{tutor.rating}</span>
                        <span>({tutor.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{tutor.rate}</div>
                      <div className="text-xs text-gray-600 font-medium">{tutor.experience}</div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View All Tutors</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-essay-marking" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Smart Essay Assessment
                </CardTitle>
                <CardDescription>
                  Comprehensive feedback on clinical reasoning and communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Sample Essay Feedback</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Clinical Knowledge: 22/25</div>
                      <div className="text-green-600">Excellent medical accuracy</div>
                    </div>
                    <div>
                      <div className="font-medium">Clinical Reasoning: 26/30</div>
                      <div className="text-blue-600">Strong logical approach</div>
                    </div>
                    <div>
                      <div className="font-medium">Communication: 18/20</div>
                      <div className="text-green-600">Clear and professional</div>
                    </div>
                    <div>
                      <div className="font-medium">Overall Grade: B+</div>
                      <div className="text-green-600">Ready for PLAB 2</div>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Try Sample Essay
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Clinical Knowledge</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Clinical Reasoning</span>
                    <span>76%</span>
                  </div>
                  <Progress value={76} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Communication</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Structure</span>
                    <span>81%</span>
                  </div>
                  <Progress value={81} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vr-scenarios" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headset className="h-5 w-5" />
                  Immersive VR Training
                </CardTitle>
                <CardDescription>
                  Practice in realistic NHS hospital environments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">VR Hardware Requirements</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Recommended:</span>
                      <span>Meta Quest 3, PICO 4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minimum:</span>
                      <span>Quest 2, Mobile VR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span>5GB available space</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download VR App
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Scenarios</CardTitle>
                <CardDescription>Choose from 50+ clinical scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {vrScenarios.map((scenario, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">{scenario.title}</div>
                      <Badge variant={scenario.difficulty === 'Advanced' ? 'destructive' : 
                                   scenario.difficulty === 'Intermediate' ? 'default' : 'secondary'}>
                        {scenario.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{scenario.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span>{scenario.duration}</span>
                      <span>{scenario.completion}% completed</span>
                    </div>
                    <Progress value={scenario.completion} className="mt-2 h-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certification" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Professional Certifications
                </CardTitle>
                <CardDescription>
                  Advance your career with recognised qualifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {certificationPaths.map((path, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{path.title}</div>
                        <div className="text-sm text-muted-foreground">{path.level} Level</div>
                      </div>
                      <Badge variant="outline">{path.cpdPoints} CPD Points</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>Duration: {path.duration}</div>
                      <div>Modules: {path.modules}</div>
                      <div>Assessments: {path.assessments}</div>
                      <div>Recognition: {path.recognition.split(' ')[0]}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} />
                    </div>
                  </div>
                ))}
                <Button className="w-full">
                  <Trophy className="h-4 w-4 mr-2" />
                  Start Certification Path
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificate Verification</CardTitle>
                <CardDescription>Blockchain-secured digital credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Digital Certificate Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Blockchain verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span>Global recognition</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-purple-500" />
                      <span>Instant download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span>LinkedIn integration</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-teal-700 p-4 rounded-lg border">
                  <div className="text-center">
                    <Award className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <div className="font-medium">Sample Certificate</div>
                    <div className="text-sm text-muted-foreground">PLAB Foundation Graduate</div>
                    <div className="text-xs mt-2">Verification: VERIFY_2024_ABC123</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pricing Summary */}
      <Card className="bg-gradient-to-r from-slate-50 to-teal-700 border-teal-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Premium Package</CardTitle>
          <CardDescription className="text-lg">
            All premium features included for comprehensive PLAB preparation
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">£79/month</div>
            <div className="text-muted-foreground">or £799/year (save 15%)</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div className="flex flex-col items-center">
              <Video className="h-8 w-8 text-blue-500 mb-2" />
              <span>Unlimited Video Sessions</span>
            </div>
            <div className="flex flex-col items-center">
              <Brain className="h-8 w-8 text-green-500 mb-2" />
              <span>Essay Marking</span>
            </div>
            <div className="flex flex-col items-center">
              <Headset className="h-8 w-8 text-purple-500 mb-2" />
              <span>VR Scenarios</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-orange-500 mb-2" />
              <span>All Certifications</span>
            </div>
          </div>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            <Zap className="h-5 w-5 mr-2" />
            Upgrade to Premium
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            14-day free trial • Cancel anytime • 30-day money-back guarantee
          </p>
        </CardContent>
      </Card>
    </div>
  );
}