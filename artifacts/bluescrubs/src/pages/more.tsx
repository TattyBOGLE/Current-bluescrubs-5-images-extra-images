import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft,
  ChevronRight,
  Settings,
  Shield,
  Database,
  BookOpen,
  Award,
  Users,
  Clock,
  User,
  FileText,
  Heart,
  Activity,
  Target,
  Camera,
  BarChart3,
  Brain,
  Stethoscope,
  MapPin,
  Video,
  Phone,
  Building,
  Scale,
  Accessibility,
  Timer,
  Palette,
  UserCheck,
  MessageCircle,
  Settings2,
  Monitor,
  Headphones,
  Zap,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import moreBgImage from '@assets/9252557F-8639-4C96-BFDA-AEACAAA7E77E_1750366172462.png';

export default function More() {
  // Leaderboard state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<Array<{
    rank: number;
    name: string;
    score: number;
    time: number;
    accuracy: number;
    category: string;
    date: string;
  }>>([]);

  // Initialize mock leaderboard data
  useEffect(() => {
    const mockLeaderboard = [
      { rank: 1, name: "Dr. Sarah Chen", score: 2450, time: 1245000, accuracy: 98, category: "All", date: "2024-06-13" },
      { rank: 2, name: "Dr. Ahmed Hassan", score: 2380, time: 1320000, accuracy: 96, category: "Cardiology", date: "2024-06-12" },
      { rank: 3, name: "Dr. Priya Sharma", score: 2320, time: 1410000, accuracy: 94, category: "All", date: "2024-06-11" },
      { rank: 4, name: "Dr. James Wilson", score: 2290, time: 1480000, accuracy: 93, category: "Neurology", date: "2024-06-10" },
      { rank: 5, name: "Dr. Maria Rodriguez", score: 2250, time: 1520000, accuracy: 91, category: "All", date: "2024-06-09" },
      { rank: 6, name: "Dr. Raj Patel", score: 2210, time: 1580000, accuracy: 90, category: "Surgery", date: "2024-06-08" },
      { rank: 7, name: "Dr. Emily Johnson", score: 2180, time: 1620000, accuracy: 89, category: "Respiratory", date: "2024-06-07" },
      { rank: 8, name: "Dr. Omar Al-Mansouri", score: 2150, time: 1680000, accuracy: 88, category: "All", date: "2024-06-06" },
      { rank: 9, name: "Dr. Lisa Thompson", score: 2120, time: 1720000, accuracy: 87, category: "Psychiatry", date: "2024-06-05" },
      { rank: 10, name: "Dr. Michael Brown", score: 2090, time: 1760000, accuracy: 86, category: "All", date: "2024-06-04" }
    ];
    setLeaderboardData(mockLeaderboard);
  }, []);

  // Format time function
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const adminTools = [
    {
      icon: Database,
      title: "Storage Management",
      description: "System management and optimization tools",
      hasArrow: true,
      link: "/cost-calculator"
    },
    {
      icon: Shield,
      title: "Security",
      description: "Security settings and access controls",
      hasArrow: true,
      link: "/security"
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Platform configuration and preferences",
      hasArrow: true,
      link: "/settings"
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "How to Use BlueScrubsPrep",
      description: "Complete guide to mastering PLAB 1 & 2 preparation with our platform",
      hasArrow: true,
      link: "/how-to"
    },
    {
      icon: Users,
      title: "Who are BlueScrubsPrep",
      description: "Meet the founders - NHS doctor Yasar and developer Keith Hunter",
      hasArrow: true,
      link: "/team"
    },
    {
      icon: Stethoscope,
      title: "PLAB 1 Practice Tests",
      description: "656+ authentic MCQ questions with detailed clinical explanations",
      hasArrow: true,
      link: "/plab1-new"
    },
    {
      icon: Camera,
      title: "PLAB 2 OSCE Stations",
      description: "176 comprehensive clinical scenarios with marking criteria",
      hasArrow: true,
      link: "/plab2-osce"
    },
    {
      icon: BarChart3,
      title: "Personalized Dashboard",
      description: "Performance analytics with adaptive learning insights",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: Video,
      title: "Multimedia Learning",
      description: "Custom video player with chapters and progress tracking",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: Brain,
      title: "Medical Tutor",
      description: "Get instant answers to medical questions with UK guidelines",
      hasArrow: true,
      link: "/ask-ai"
    },
    {
      icon: Accessibility,
      title: "Neurodiversity Support",
      description: "8 accommodation types including extended time and audio",
      hasArrow: true,
      link: "/settings"
    },
    {
      icon: Activity,
      title: "Local Analytics Engine",
      description: "Performance tracking and weakness detection system",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: Timer,
      title: "Study Scheduling",
      description: "Smart scheduling with browser notifications and reminders",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: Target,
      title: "Adaptive Difficulty",
      description: "Automatic difficulty adjustment based on performance",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: MapPin,
      title: "Multi-language Support",
      description: "39 languages with medical terminology translations",
      hasArrow: true,
      link: "/settings"
    },
    {
      icon: Activity,
      title: "Performance Analytics",
      description: "Detailed analysis of your PLAB preparation performance",
      hasArrow: true,
      link: "/analytics"
    },
    {
      icon: Camera,
      title: "OSCE Practice",
      description: "Video-based OSCE station practice and skill assessment",
      hasArrow: true,
      link: "/plab2-osce"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with fellow PLAB candidates and share experiences",
      hasArrow: true,
      link: "/community"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Advanced performance tracking and progress analytics",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: MapPin,
      title: "Cultural Bridge",
      description: "UK healthcare culture and communication training",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: Building,
      title: "NHS Preparation",
      description: "Complete NHS job application and interview preparation",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: UserCheck,
      title: "Expert Mentors",
      description: "1-on-1 guidance from qualified NHS doctors",
      hasArrow: true,
      link: "/community"
    },
    {
      icon: Video,
      title: "Video OSCE",
      description: "Advanced video-based OSCE practice stations",
      hasArrow: true,
      link: "/plab2-osce"
    },
    {
      icon: FileText,
      title: "Practice Tests",
      description: "Full-length PLAB 1 mock exams and timed practice tests",
      hasArrow: true,
      link: "/plab1-new"
    },
    {
      icon: Target,
      title: "Job Placement",
      description: "NHS job search, CV review, and interview preparation",
      hasArrow: true,
      link: "/premium"
    },
    {
      icon: MessageCircle,
      title: "Study Groups",
      description: "Join study groups and collaborate with other candidates",
      hasArrow: true,
      link: "/community"
    },
    {
      icon: Brain,
      title: "Ask BlueScrubsPrep",
      description: "Get instant answers to any medical question with UK guidelines",
      hasArrow: true,
link: "/ask-ai"
    },
    {
      icon: Accessibility,
      title: "Accessibility",
      description: "Customizable learning experience for diverse needs",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: Scale,
      title: "Legal & Privacy",
      description: "Privacy policy, terms of service, and data protection",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: Zap,
      title: "Premium Features",
      description: "Unlock advanced tutoring and exclusive content",
      hasArrow: true,
      link: "/premium"
    },
    {
      icon: Brain,
      title: "Neurodiverse Support",
      description: "Specialized learning tools for different cognitive styles",
      hasArrow: true,
      link: "/dashboard"
    },
    {
      icon: Headphones,
      title: "Help Center",
      description: "Get support, tutorials, and frequently asked questions",
      hasArrow: true,
      link: "/dashboard"
    }
  ];

  // Medical specialization features for PLAB
  const medicalFeatures = [
    {
      icon: Stethoscope,
      title: "Medical Specialization",
      description: "Advanced training modules for different medical specialties",
      hasArrow: true
    },
    {
      icon: Brain,
      title: "Smart Learning",
      description: "Personalised tutoring and adaptive learning systems",
      hasArrow: true
    },
    {
      icon: MapPin,
      title: "Career Support",
      description: "Post-PLAB career guidance and NHS job placement",
      hasArrow: true
    },
    {
      icon: Video,
      title: "Video Consultations",
      description: "Live sessions with medical experts and mentors",
      hasArrow: true
    },
    {
      icon: Building,
      title: "GMC Registration",
      description: "Complete guidance through UK medical registration",
      hasArrow: true
    },
    {
      icon: Scale,
      title: "Legal Support",
      description: "Professional legal guidance for medical practice",
      hasArrow: true
    },
    {
      icon: Accessibility,
      title: "Neurodiverse Support",
      description: "Specialized support for ADHD, dyslexia, and autism",
      hasArrow: true
    },
    {
      icon: Monitor,
      title: "VR Clinical Scenarios",
      description: "Immersive virtual reality medical training",
      hasArrow: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div 
        className="relative bg-gradient-to-r from-blue-600 to-purple-700 w-full h-64 md:h-80 lg:h-96 mb-8 overflow-hidden"
        style={{
          backgroundImage: `url(${moreBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >

        <div className="relative z-50 flex flex-col items-center justify-center text-center px-8 py-16 hero-text">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-2xl" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.6)'}}>
            More Resources
          </h1>
          <p className="text-xl lg:text-2xl mb-6 drop-shadow-2xl" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.6)'}}>
            Advanced tools and comprehensive medical education resources
          </p>

        </div>
      </div>

      <div className="container max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Navigation */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">All Features</h2>
        </div>

        {/* Admin Tools Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Tools</h2>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Admin Tools</h3>
              <p className="text-blue-700 text-sm">System management and optimization tools</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {adminTools.map((tool, index) => (
                <Link key={index} href={tool.link || "/dashboard"}>
                  <Card className="bg-white border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <tool.icon className="h-8 w-8 text-blue-600 mb-3" />
                      <h4 className="font-medium text-gray-900" style={{color: '#111827 !important'}}>{tool.title}</h4>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>
        </div>



        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const cardContent = (
                <Card className="bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer border-blue-200">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                    {feature.hasArrow && (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </CardContent>
                </Card>
              );
              
              if (feature.link) {
                return (
                  <Link key={index} href={feature.link}>
                    {cardContent}
                  </Link>
                );
              }
              
              return (
                <div key={index}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>










      </div>
    </div>
  );
}