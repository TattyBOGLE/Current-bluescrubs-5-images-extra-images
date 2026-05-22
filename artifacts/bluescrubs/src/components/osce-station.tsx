import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Volume2, Maximize, Clock, Mic } from "lucide-react";
import type { OsceStation, OsceAttemptData } from "@/lib/types";

interface OsceStationProps {
  station: OsceStation;
  onStationComplete: (attemptData: OsceAttemptData) => void;
}

export function OsceStationComponent({ station, onStationComplete }: OsceStationProps) {
  const [timeRemaining, setTimeRemaining] = useState(station.timeLimit * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>({});

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleStationComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeProgress = () => {
    const totalTime = station.timeLimit * 60;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const handleActionSelect = (action: string) => {
    setSelectedActions(prev => 
      prev.includes(action) 
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
  };

  const handleStationComplete = () => {
    const attemptData: OsceAttemptData = {
      stationId: station.id,
      notes,
      timeSpent: (station.timeLimit * 60) - timeRemaining,
      selfAssessment
    };
    onStationComplete(attemptData);
  };

  const assessmentCriteria = station.markingCriteria as Record<string, string[]>;
  const patientInfo = station.patientInfo as Record<string, any>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Station Header */}
      <Card className="overflow-hidden">
        <div className="gradient-secondary p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{station.title}</h2>
              <p className="opacity-90">{station.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatTime(timeRemaining)}</div>
              <div className="text-sm opacity-90">Time remaining</div>
            </div>
          </div>
          
          <Progress value={getTimeProgress()} className="h-2 bg-white/20" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video/Patient Interaction Panel */}
        <Card>
          <CardContent className="p-6">
            {/* Video Player Mockup */}
            <div className="aspect-video bg-gray-900 rounded-xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-semibold">Interactive Patient Scenario</p>
                  <p className="text-sm opacity-75">Click to start interaction</p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 rounded-lg p-4">
                  <div className="flex items-center justify-between text-white mb-2">
                    <span className="text-sm">Patient Response</span>
                    <span className="text-sm">2:30 / 8:00</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-1 mb-3">
                    <div className="bg-white h-1 rounded-full" style={{ width: '31%' }} />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {patientInfo.name} (Standardized Patient)</div>
                <div><strong>Age:</strong> {patientInfo.age}</div>
                <div><strong>Presenting complaint:</strong> {patientInfo.presenting_complaint}</div>
                <div><strong>Setting:</strong> {patientInfo.setting}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes and Assessment Panel */}
        <Card>
          <CardContent className="p-6">
            {/* Clinical Notes */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Clinical Notes</h4>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document your observations, history, and clinical findings here..."
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Quick Assessment Actions */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Assessment Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { action: "Take Pulse", icon: "💓" },
                  { action: "Check BP", icon: "🩺" },
                  { action: "Auscultate", icon: "👂" },
                  { action: "Examine", icon: "🔍" },
                  { action: "Palpate", icon: "✋" },
                  { action: "Test Reflexes", icon: "🔨" }
                ].map(({ action, icon }) => (
                  <Button
                    key={action}
                    variant={selectedActions.includes(action) ? "default" : "outline"}
                    onClick={() => handleActionSelect(action)}
                    className="p-3 h-auto flex flex-col items-center"
                  >
                    <span className="text-lg mb-1">{icon}</span>
                    <span className="text-sm">{action}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Marking Criteria Preview */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-teal-600" />
                Assessment Criteria
              </h4>
              <div className="space-y-2 text-sm">
                {Object.entries(assessmentCriteria).map(([category, criteria]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize">{category.replace('_', ' ')}</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3].map(i => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            (selfAssessment[category] || 0) >= i 
                              ? 'bg-emerald-500' 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Self Assessment */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Self Assessment</h4>
              <div className="space-y-3">
                {Object.keys(assessmentCriteria).map(category => (
                  <div key={category}>
                    <label className="text-sm font-medium text-gray-700 capitalize mb-2 block">
                      {category.replace('_', ' ')}
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3].map(score => (
                        <Button
                          key={score}
                          variant={selfAssessment[category] === score ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelfAssessment(prev => ({ ...prev, [category]: score }))}
                        >
                          {score}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsActive(!isActive)}
                className="flex-1"
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Station
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {timeRemaining === station.timeLimit * 60 ? "Start Station" : "Resume"}
                  </>
                )}
              </Button>
              <Button
                onClick={handleStationComplete}
                className="flex-1 btn-secondary"
              >
                Complete Station
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
