import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  PlayCircle, 
  Target, 
  CheckCircle, 
  Users, 
  BarChart3, 
  Brain, 
  Stethoscope,
  Clock,
  Award,
  ArrowRight,
  Lightbulb,
  FileText,
  Video,
  MessageCircle,
  Globe
} from "lucide-react";
import { Link } from "wouter";

export default function HowToPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            How to Use BlueScrubsPrep
          </h1>
          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            Your complete guide to mastering PLAB 1 & 2 preparation
          </p>
          <Badge className="bg-white/20 text-white text-lg px-6 py-2">
            Professional PLAB Preparation Platform
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Start Guide */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start Guide</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get started with BlueScrubsPrep in just a few simple steps and begin your PLAB preparation journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">1. Choose Your Path</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Select between PLAB 1 MCQ practice or PLAB 2 OSCE stations based on your current preparation stage
                </p>
                <Link href="/plab1-new">
                  <Button variant="outline" className="w-full">
                    Start PLAB 1 <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">2. Practice & Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Answer questions, review explanations, and use our AI tutor for personalised guidance
                </p>
                <Link href="/plab2-osce">
                  <Button variant="outline" className="w-full">
                    Start PLAB 2 <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">3. Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Monitor your performance, identify weak areas, and compete on leaderboards
                </p>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    View Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Feature Guides */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for PLAB preparation success
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* PLAB 1 Guide */}
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-blue-900">PLAB 1 MCQ Practice</CardTitle>
                    <CardDescription className="text-blue-700">
                      5,528 authentic medical questions across 11 specialties
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Question Bank</h4>
                    <p className="text-gray-600 text-sm">GMC-aligned questions with detailed explanations and UK medical guidelines</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Adaptive Learning</h4>
                    <p className="text-gray-600 text-sm">smart difficulty adjustment based on your performance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Memory Aids</h4>
                    <p className="text-gray-600 text-sm">SOCRATES, CHADS-VASc, CURB-65 and other medical mnemonics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">NICE Guidelines</h4>
                    <p className="text-gray-600 text-sm">Integrated UK clinical guidelines and decision frameworks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PLAB 2 Guide */}
            <Card className="border-2 border-purple-200 bg-purple-50/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-purple-900">PLAB 2 OSCE Practice</CardTitle>
                    <CardDescription className="text-purple-700">
                      3,898 clinical stations with actor scripts and mark schemes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Clinical Stations</h4>
                    <p className="text-gray-600 text-sm">History-taking, examinations, and practical procedures</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Actor Scripts</h4>
                    <p className="text-gray-600 text-sm">Detailed patient presentations and standardised responses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mark Schemes</h4>
                    <p className="text-gray-600 text-sm">Professional assessment criteria and scoring guidelines</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Communication Skills</h4>
                    <p className="text-gray-600 text-sm">NHS consultation frameworks and professional communication</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Advanced Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful tools to enhance your learning experience and exam preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Medical Tutor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">
                  Get instant answers to medical questions with evidence-based responses and clinical reasoning
                </p>
                <Link href="/ask-ai">
                  <Button variant="outline" size="sm" className="w-full">
                    Try Tutor
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">
                  Track your progress with detailed analytics, weakness identification, and exam predictions
                </p>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="w-full">
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Global Leaderboards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">
                  Compete with students worldwide and track your ranking in the global PLAB community
                </p>
                <Link href="/community">
                  <Button variant="outline" size="sm" className="w-full">
                    Join Community
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg">Multi-Language Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">
                  Study in 39 languages with medical terminology translations and cultural adaptations
                </p>
                <Badge variant="secondary" className="w-full justify-center">
                  39 Languages Available
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-lg">Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">
                  Smart difficulty adjustment, weakness detection, and personalised study recommendations
                </p>
                <Badge variant="secondary" className="w-full justify-center">
                  Smart System
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle className="text-lg">Neurodiversity Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">
                  Comprehensive accommodations for ADHD, dyslexia, autism, and other learning differences
                </p>
                <Badge variant="secondary" className="w-full justify-center">
                  8 Accommodation Types
                </Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Study Tips */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Study Tips & Best Practices</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Proven strategies to maximise your PLAB preparation effectiveness
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                  <CardTitle className="text-xl text-blue-900">PLAB 1 Success Strategy</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-blue-800 text-sm"><strong>Daily Practice:</strong> Complete 50-100 questions daily across different specialties</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-blue-800 text-sm"><strong>Review Explanations:</strong> Always read detailed explanations, even for correct answers</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-blue-800 text-sm"><strong>Use Memory Aids:</strong> Master SOCRATES, CHADS-VASc, and other clinical mnemonics</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-blue-800 text-sm"><strong>Track Weak Areas:</strong> Focus extra time on specialties with lower accuracy</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Stethoscope className="w-6 h-6 text-purple-600" />
                  <CardTitle className="text-xl text-purple-900">PLAB 2 Excellence Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-purple-800 text-sm"><strong>Practice Communication:</strong> Use structured frameworks like SPIKES for difficult conversations</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-purple-800 text-sm"><strong>Time Management:</strong> Practice stations within realistic time limits (8-10 minutes)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-purple-800 text-sm"><strong>Physical Examination:</strong> Follow systematic approaches like IPPA (inspection, palpation, percussion, auscultation)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-purple-800 text-sm"><strong>Actor Interaction:</strong> Maintain professionalism and empathy throughout the station</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Common questions about using BlueScrubsPrep for PLAB preparation
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How many questions should I practice daily?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  For PLAB 1, aim for 50-100 questions daily. Start with 30-50 questions and gradually increase as you build confidence. Quality over quantity - ensure you thoroughly review explanations and understand the clinical reasoning behind each answer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I use the Medical Tutor effectively?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ask specific clinical questions, request explanations for concepts you don't understand, and use it to clarify UK medical guidelines. The AI tutor provides evidence-based responses with proper citations to support your learning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What are the neurodiversity accommodations available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We support 8 accommodation types including ADHD, dyslexia, autism, dyspraxia, processing differences, memory support, sensory sensitivity, and executive function support. These include extended time, larger text, reduced visual clutter, and audio support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the adaptive learning system work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI system automatically adjusts question difficulty based on your performance, identifies knowledge gaps in real-time, predicts exam success probability, and generates targeted questions for your weak areas. It learns from every interaction to personalise your study experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your PLAB Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of medical graduates who have successfully prepared with BlueScrubsPrep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plab1-new">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <BookOpen className="w-5 h-5 mr-2" />
                Start PLAB 1 Practice
              </Button>
            </Link>
            <Link href="/plab2-osce">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Stethoscope className="w-5 h-5 mr-2" />
                Try PLAB 2 OSCE
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}