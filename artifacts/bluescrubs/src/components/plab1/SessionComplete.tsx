import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, RotateCcw, Home } from "lucide-react";

interface SessionCompleteProps {
  totalQuestions: number;
  timeSpent: number;
  selectedCategory: string;
  onRestart: () => void;
  onHome: () => void;
}

export function SessionComplete({
  totalQuestions,
  timeSpent,
  selectedCategory,
  onRestart,
  onHome,
}: SessionCompleteProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto mb-16">
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Complete!</h2>
            <p className="text-gray-600 mb-6">You've completed your practice session</p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-600 font-medium">Questions Answered</p>
                <p className="text-2xl font-bold text-blue-900">{totalQuestions}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-600 font-medium">Time Spent</p>
                <p className="text-2xl font-bold text-green-900">{Math.round(timeSpent / 1000 / 60)}m</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-purple-600 font-medium">Category</p>
                <p className="text-2xl font-bold text-purple-900 capitalize">{selectedCategory}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={onRestart} className="bg-blue-600 hover:bg-blue-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
              <Button variant="outline" onClick={onHome}>
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
