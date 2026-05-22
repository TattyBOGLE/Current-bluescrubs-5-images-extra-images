import { useState } from "react";
import { AdaptiveLearningDashboard } from "@/components/adaptive-learning-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Lightbulb,
  BarChart3
} from "lucide-react";

export default function AdaptiveLearning() {
  const [currentUserId] = useState(1); // Demo user ID

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-16 w-16 text-primary mr-4" />
            <div className="text-left">
              <h1 className="text-5xl font-bold text-black">
                Adaptive AI Learning
              </h1>
              <p className="text-xl text-black mt-2">
                Intelligence that evolves with your learning
              </p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg text-black leading-relaxed">
              Experience the next generation of medical education with AI that understands your learning patterns, 
              identifies weaknesses in real-time, and adapts question difficulty to maximize your progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2 text-black">Adaptive Questions</h3>
                <p className="text-sm text-black">
                  Questions automatically adjust difficulty based on your performance patterns
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold mb-2 text-black">Weakness Detection</h3>
                <p className="text-sm text-black">
                  AI scans your answer patterns to identify specific knowledge gaps
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2 text-black">Success Prediction</h3>
                <p className="text-sm text-black">
                  ML algorithm predicts your exam success probability with confidence intervals
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <Lightbulb className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2 text-black">Smart Generation</h3>
                <p className="text-sm text-black">
                  Creates targeted questions using your existing bank to address weak areas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-blue-300 to-blue-400 adaptive-card-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Advanced Analytics Engine
              </CardTitle>
              <CardDescription>
                No external API calls - completely offline intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Pattern recognition algorithms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Statistical performance modeling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Real-time weakness identification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Predictive exam readiness scoring</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-300 to-purple-400 adaptive-card-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Intelligent Question System
              </CardTitle>
              <CardDescription>
                Template-based generation using your authentic question bank
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">5,000+ authentic medical questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Difficulty adaptation algorithms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Weakness-targeted question creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">UK medical guidelines integration</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Differentiators */}
        <Card className="mb-8 border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Why BlueScrubsPrep Adaptive AI Stands Out
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Advanced features that competing platforms don't offer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <Badge className="mb-3 bg-green-100 text-green-800">Unique Advantage</Badge>
                <h3 className="font-semibold mb-2 text-black">Authentic Content Only</h3>
                <p className="text-sm text-black">
                  Uses real medical scenarios, not smart-generated content, for genuine exam preparation
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Badge className="mb-3 bg-blue-100 text-blue-800">Technical Innovation</Badge>
                <h3 className="font-semibold mb-2 text-black">Offline Intelligence</h3>
                <p className="text-sm text-black">
                  Complete AI functionality without external API dependencies or internet requirements
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Badge className="mb-3 bg-purple-100 text-purple-800">Medical Focus</Badge>
                <h3 className="font-semibold mb-2 text-black">UK Guidelines Integration</h3>
                <p className="text-sm text-black">
                  Deep integration with NICE, BNF, CKS, and GMC standards for accurate learning
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Badge className="mb-3 bg-orange-100 text-orange-800">Predictive Analytics</Badge>
                <h3 className="font-semibold mb-2 text-black">ML Exam Prediction</h3>
                <p className="text-sm text-black">
                  Statistical models predict success probability with confidence intervals
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Badge className="mb-3 bg-red-100 text-red-800">Real-time Analysis</Badge>
                <h3 className="font-semibold mb-2 text-black">Instant Weakness Detection</h3>
                <p className="text-sm text-black">
                  Identifies knowledge gaps during practice with immediate feedback
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Badge className="mb-3 bg-yellow-100 text-yellow-800">Adaptive Learning</Badge>
                <h3 className="font-semibold mb-2 text-black">Dynamic Difficulty</h3>
                <p className="text-sm text-black">
                  Questions adapt in real-time based on performance patterns and learning speed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard */}
        <AdaptiveLearningDashboard userId={currentUserId} />

        {/* Technical Details */}
        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Technical Implementation
            </CardTitle>
            <CardDescription>
              Advanced algorithms working behind the scenes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-black">Adaptive Learning Engine</h3>
                <ul className="space-y-2 text-sm text-black">
                  <li>• Performance tracking across 11 medical specialties</li>
                  <li>• Mastery threshold algorithms (85% accuracy target)</li>
                  <li>• Dynamic difficulty adjustment based on user patterns</li>
                  <li>• Spaced repetition optimization for weak areas</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-black">Weakness Detection System</h3>
                <ul className="space-y-2 text-sm text-black">
                  <li>• Real-time pattern analysis of answer selections</li>
                  <li>• Common mistake identification and categorization</li>
                  <li>• Improvement trend tracking over time</li>
                  <li>• Critical vs moderate weakness classification</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-black">Performance Prediction</h3>
                <ul className="space-y-2 text-sm text-black">
                  <li>• Statistical modeling with confidence intervals</li>
                  <li>• Multi-factor analysis (accuracy, consistency, coverage)</li>
                  <li>• Time-to-readiness estimation algorithms</li>
                  <li>• Exam success probability calculation</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-black">Smart Question Generation</h3>
                <ul className="space-y-2 text-sm text-black">
                  <li>• Template extraction from authentic questions</li>
                  <li>• Weakness-targeted scenario creation</li>
                  <li>• Clinical pattern recognition and variation</li>
                  <li>• Quality scoring and confidence assessment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}