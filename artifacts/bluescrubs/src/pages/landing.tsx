import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Brain, Users, Trophy, Clock, BookOpen, Video, MessageCircle, Target, Zap, Shield, Star, Play, CheckCircle, Globe, Award, Stethoscope } from "lucide-react";
import { Logo } from "@/components/logo";

import { QUESTION_BANK_STATS } from "@shared/expanded-question-bank";
import heroVideo from "@assets/video_compressed.mp4";


export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Video Hero Banner - Full Screen */}
      <div className="landing-hero relative w-full h-screen overflow-hidden bg-gradient-to-r from-teal-600 to-teal-700 mb-0">
        <video 
          src={heroVideo}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center center',
            transform: 'scale(1.5)',
            transformOrigin: 'center center',
            willChange: 'transform'
          }}
          autoPlay
          muted
          playsInline
          preload="auto"
          loop={false}
          onLoadStart={() => {
            // Video loading started
          }}
          onCanPlay={() => {
            // Video can start playing
          }}
          onEnded={(e) => {
            const video = e.target as HTMLVideoElement;
            video.currentTime = video.duration;
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        

        
        {/* Hero Content - Bottom Aligned Layout */}
        <div className="relative z-10 flex flex-col justify-end items-center min-h-screen px-4 pb-8" style={{ contain: 'layout' }}>
          {/* Compact Bottom Content */}
          <div className="text-center space-y-4 hero-text" style={{ transform: 'translateZ(0)' }}>
            {/* Small Badge */}
            <div className="inline-flex items-center justify-center px-6 py-3 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30" style={{ willChange: 'transform' }}>
              <Star className="w-5 h-5 mr-3 text-yellow-400" />
              <span className="text-lg font-medium text-white text-center">5,528 <span className="font-bold">PLAB</span> Questions</span>
            </div>
            
            {/* Compact Title */}
            <div className="space-y-2">
              <div className="text-white">
                <Logo size="xl" className="text-white" />
              </div>
              <h1 className="text-sm lg:text-base font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                Master Your Journey
              </h1>
              <p className="text-sm font-medium text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                Comprehensive <span className="font-bold">PLAB</span> Preparation
              </p>
            </div>
            
            {/* Bottom Button */}
            <div className="pt-2">
              <Link href="/premium">
                <Button size="sm" className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-700 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-lg transition-all duration-200 group">
                  Start Free Trial
                  <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>


      </div>



      {/* Why We're Different Section - Core BlueScrubsPrep Features */}
      <div className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-800 rounded-full mb-4 sm:mb-6">
              <span className="hero-text font-semibold text-sm sm:text-base" style={{ color: 'white' }}>Premium PLAB Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6 leading-tight px-2">
              Why We're Different
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
              The world's first comprehensive PLAB preparation ecosystem combining smart learning, 
              real-time expert consultations, and immersive clinical training in 35 languages.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Brain,
                title: "Smart Adaptive Learning",
                subtitle: "Smart Technology",
                description: "Advanced machine learning predicts weaknesses 2-3 weeks before failure, provides contextual hints, and creates personalized study paths with real-time difficulty adjustment.",
                features: ["Weakness prediction", "Contextual hint system", "Adaptive difficulty", "Success probability calculator"],
                color: "from-teal-500 to-cyan-500"
              },
              {
                icon: Video,
                title: "VR OSCE Training",
                subtitle: "Immersive Practice",
                description: "World's first virtual reality OSCE stations with Virtual patient actors, realistic hospital environments, and collaborative multi-user training sessions.",
                features: ["VR hospital environments", "Virtual patient actors", "Multi-user sessions", "Real-time performance analysis"],
                color: "from-teal-500 to-rose-500"
              },
              {
                icon: Globe,
                title: "UK Clinical Integration",
                subtitle: "Authentic Content",
                description: "Live NHS guidelines integration, real hospital partnerships with Imperial College and Manchester Royal Infirmary, plus cultural competency training.",
                features: ["Live NHS updates", "Hospital partnerships", "Cultural training", "Post-PLAB career support"],
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Users,
                title: "Professional Development",
                subtitle: "Career Growth",
                description: "Complete ARCP portfolio builder, continuing education recommendations, professional networking, and NHS career pathway analysis.",
                features: ["ARCP portfolio builder", "Continuing education", "Professional networking", "Career pathway analysis"],
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Target,
                title: "Mobile-First Learning",
                subtitle: "Learn Anywhere",
                description: "Microlearning modules for 5-10 minute sessions, smart notifications, voice-to-revision notes, and full offline content synchronization.",
                features: ["Microlearning modules", "Smart notifications", "Voice-to-notes", "Offline sync"],
                color: "from-teal-500 to-teal-700"
              },
              {
                icon: Trophy,
                title: "Advanced Gamification",
                subtitle: "Stay Motivated",
                description: "Personalized achievements, dynamic challenges, virtual study buddy with adaptive personality, and meaningful progress celebrations.",
                features: ["Personalized achievements", "Dynamic challenges", "Virtual study buddy", "Progress celebrations"],
                color: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="premium-plab-card group border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 bg-white overflow-hidden text-gray-900">
                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                <CardContent className="p-8 text-gray-900">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                    <span className="text-sm font-semibold text-white bg-blue-800 px-3 py-1 rounded-full">
                      {feature.subtitle}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-6 leading-relaxed font-medium">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-800 font-medium">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Competitive Advantages */}
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">BlueScrubsPrep</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the unique advantages that make BlueScrubsPrep the most comprehensive PLAB preparation platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="premium-plab-card">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Our Competitive <span className="text-blue-600">Advantages</span>
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Independent Content System",
                    description: "Complete medical accuracy with 5,528 authentic stations generated independently without bias. Zero external dependencies ensure unlimited usage, predictable performance, and professional medical standards maintained at all times."
                  },
                  {
                    icon: Zap,
                    title: "Hybrid Enhancement",
                    description: "Optional enhancement for video analysis and feedback generation with complete independent fallbacks. Questions remain independent for authenticity while advanced features benefit from smart helpers when available."
                  },
                  {
                    icon: Globe,
                    title: "39-Language Translation",
                    description: "Complete offline translation system with medical terminology dictionaries covering Arabic, Chinese, Hindi, Spanish, French and 34 additional languages. Cultural adaptations and RTL support ensure global accessibility."
                  },
                  {
                    icon: Shield,
                    title: "Complete System Independence",
                    description: "Zero external API costs, unlimited offline usage, complete data ownership, and instant content access. Professional medical standards maintained with predictable performance and no usage restrictions."
                  }
                ].map((advantage, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <advantage.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{advantage.title}</h4>
                      <p className="text-gray-800 leading-relaxed font-medium">{advantage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ 
              background: 'linear-gradient(to bottom right, #1e3a8a, #1e1b4b)', 
              borderRadius: '1.5rem', 
              padding: '2rem', 
              border: '1px solid #1e40af',
              color: 'white'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h4 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center', WebkitTextFillColor: '#ffffff' }}>Complete Premium Package</h4>
                <div style={{ color: '#ffffff', fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center', WebkitTextFillColor: '#ffffff' }}>£79<span style={{ color: '#ffffff', fontSize: '1.25rem', WebkitTextFillColor: '#ffffff' }}>/month</span></div>
                <p style={{ color: '#ffffff', textAlign: 'center', WebkitTextFillColor: '#ffffff' }}>Everything you need for PLAB success</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  "5,528+ authentic medical stations",
                  "Complete independence option",
                  "39-language translation system",
                  "Global exam preparation",
                  "Hybrid enhancement",
                  "Unlimited offline usage",
                  "Professional medical accuracy",
                  "Zero external dependencies"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: '#ffffff' }} />
                    <span className="text-sm font-medium" style={{ color: '#ffffff' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/premium">
                <Button className="w-full bg-white hover:bg-gray-100 font-bold py-3 rounded-xl" style={{ color: '#2563eb' }}>
                  Start Premium Trial
                  <ArrowRight className="ml-2 w-5 h-5" style={{ color: '#2563eb' }} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Revenue Projections & Market Position */}
          <div className="mt-20 text-center">
            <div className="premium-plab-card bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Independent Medical Platform</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">5,528</div>
                  <p className="text-gray-800 font-medium">Authentic Stations</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">£0</div>
                  <p className="text-gray-800 font-medium">API Costs</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">39</div>
                  <p className="text-gray-800 font-medium">Languages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Platform Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full mb-6">
              <span className="hero-text text-white font-semibold">Complete Feature Set</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Learning Systems Working Together
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              The most comprehensive medical education platform with features no competitor can match. 
              Every system is designed to accelerate your path from PLAB to NHS career success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                category: "Comprehensive Question Bank",
                icon: Shield,
                color: "from-green-500 to-emerald-500",
                features: [
                  "656+ authentic PLAB questions",
                  "Enhanced clinical explanations",
                  "Professional medical mnemonics",
                  "UK guideline integration",
                  "Multiple choice practice",
                  "Category-based filtering"
                ]
              },
              {
                category: "Complete OSCE Practice",
                icon: Stethoscope,
                color: "from-teal-500 to-cyan-500",
                features: [
                  "176 comprehensive OSCE stations",
                  "History taking scenarios",
                  "Physical examination skills",
                  "Communication training",
                  "Marking criteria included",
                  "Clinical skills tutor"
                ]
              },
              {
                category: "Multimedia Learning",
                icon: Video,
                color: "from-teal-500 to-rose-500",
                features: [
                  "Custom video player with chapters",
                  "Interactive study materials",
                  "Audio support for accessibility",
                  "Subtitle and speed controls",
                  "Progress tracking",
                  "Offline video capability"
                ]
              },
              {
                category: "Personalized Analytics",
                icon: Target,
                color: "from-orange-500 to-red-500",
                features: [
                  "Local performance tracking",
                  "Weakness detection system",
                  "Adaptive difficulty adjustment",
                  "Study schedule management",
                  "Progress visualization",
                  "Exam countdown timer"
                ]
              },
              {
                category: "Neurodiversity Support",
                icon: Users,
                color: "from-teal-500 to-teal-700",
                features: [
                  "8 accommodation types",
                  "Extended time options",
                  "Larger text and buttons",
                  "Audio support features",
                  "Reduced visual clutter",
                  "Memory aid assistance"
                ]
              },
              {
                category: "Multi-language Access",
                icon: Globe,
                color: "from-yellow-500 to-orange-500",
                features: [
                  "39 language translations",
                  "Medical terminology support",
                  "Built-in translation system",
                  "Cultural adaptations",
                  "Voice pronunciation",
                  "Offline language support"
                ]
              }
            ].map((category, index) => (
              <Card key={index} className="group border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Statistics */}
          <div className="mt-16 bg-gradient-to-r from-slate-50 to-teal-700 rounded-3xl p-8 border border-teal-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Platform Impact</h3>
              <p className="text-gray-600">Real-world results from comprehensive feature integration</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">40+</div>
                <p className="text-gray-700 font-medium">Smart Systems</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">35</div>
                <p className="text-gray-700 font-medium">Languages</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                <p className="text-gray-700 font-medium">Success Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">Real</div>
                <p className="text-gray-700 font-medium">Hospital Partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BlueScrubsPrep+ Global Expansion Section */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500/20 to-teal-500/20 backdrop-blur-sm rounded-full border border-purple-400/30 shadow-lg mb-6">
              <Globe className="w-5 h-5 mr-3 text-purple-300" />
              <span className="text-sm font-semibold text-white">Now Available Globally</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              <span className="text-white">Beyond</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">BlueScrubsPrep</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Introducing <span className="font-bold">BlueScrubsPrep+</span> - Your gateway to medical careers across 6 countries with support for 15+ international medical exams
            </p>
          </div>

          {/* Global Exam Coverage */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                country: "🇺🇸 United States",
                exam: "USMLE Steps 1, 2, 3",
                description: "Complete preparation for US medical licensing",
                placements: "Preparation program available"
              },
              {
                country: "🇦🇺 Australia", 
                exam: "AMC CAT & Clinical",
                description: "Australian Medical Council certification",
                placements: "Study materials included"
              },
              {
                country: "🇨🇦 Canada",
                exam: "MCCEE & NAC OSCE",
                description: "Medical Council of Canada evaluation",
                placements: "Comprehensive exam prep"
              },
              {
                country: "🇪🇺 European Union",
                exam: "MRCP & Specialty",
                description: "Royal College certification pathways",
                placements: "Specialty training support"
              },
              {
                country: "🇦🇪 Middle East",
                exam: "DHA, MOH, HAAD",
                description: "Gulf region medical licensing",
                placements: "Regional exam preparation"
              },
              {
                country: "🌍 Global English",
                exam: "IELTS Medical",
                description: "Medical English proficiency testing",
                placements: "Language skills development"
              }
            ].map((region, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white country-name mb-2">{region.country}</h3>
                  <div className="text-purple-300 font-semibold mb-3">{region.exam}</div>
                  <p className="text-gray-300 text-sm mb-4">{region.description}</p>
                  <div className="text-xs text-green-300 font-medium">{region.placements}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Statistics */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Global Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">656+</div>
                <p className="text-gray-300">PLAB Questions</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">176</div>
                <p className="text-gray-300">OSCE Stations</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
                <p className="text-gray-300">Offline Capable</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">39</div>
                <p className="text-gray-300">Languages Supported</p>
              </div>
            </div>
          </div>

          {/* Global Features */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Advanced Global Features</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Globe,
                    title: "Multi-Language Support",
                    description: "Study in your native language with 35 supported languages including Arabic, Hindi, Mandarin, Spanish, French, German, Portuguese, Russian, Japanese, Korean, and 25 more"
                  },
                  {
                    icon: Award,
                    title: "Regional Job Placement",
                    description: "Direct partnerships with 156 hospitals across 6 countries for guaranteed placement opportunities"
                  },
                  {
                    icon: Brain,
                    title: "Country-Specific Tutor",
                    description: "Localised tutoring adapted to each country's medical system and examination patterns"
                  },
                  {
                    icon: Video,
                    title: "Cultural Adaptation",
                    description: "Scenario-based training adapted to local healthcare systems and patient interaction styles"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500/40 to-teal-800/40 rounded-3xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-white mb-4">BlueScrubsPrep+ Global Access</h4>
                <div className="text-5xl font-bold text-white mb-2">£129<span className="text-xl">/month</span></div>
                <p className="text-gray-300">Access to all global medical exams</p>
              </div>
              
              <div className="space-y-3 mb-8">
                {[
                  "8 major international medical exams",
                  "45-language content library",
                  "Global job placement network",
                  "Country-specific tutoring",
                  "Cultural adaptation training",
                  "Regional exam strategies",
                  "International mentor network",
                  "Multi-timezone support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/plab1-new">
                <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white font-bold py-3 rounded-xl">
                  Start Global Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}