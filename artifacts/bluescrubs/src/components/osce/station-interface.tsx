import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Timer from "@/components/practice/timer";

interface StationInterfaceProps {
  station: any;
  timeRemaining: number;
  notes: string;
  onNotesChange: (notes: string) => void;
  onComplete: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function StationInterface({
  station,
  timeRemaining,
  notes,
  onNotesChange,
  onComplete,
  onBack,
  isSubmitting,
}: StationInterfaceProps) {
  const progressPercentage = ((station.duration * 60 - timeRemaining) / (station.duration * 60)) * 100;

  const assessmentActions = [
    { id: "pulse", label: "Take Pulse", icon: "💓" },
    { id: "bp", label: "Check BP", icon: "🩺" },
    { id: "listen", label: "Auscultate", icon: "👂" },
    { id: "examine", label: "Examine", icon: "👁️" },
    { id: "question", label: "Ask Question", icon: "❓" },
    { id: "explain", label: "Explain", icon: "💬" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Station Header */}
      <Card className="mb-8">
        <CardHeader className="medical-gradient text-white rounded-t-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <CardTitle className="text-2xl mb-2">{station.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {station.category}
                </Badge>
                <span className="text-sm opacity-90">{station.duration} minutes</span>
              </div>
            </div>
            <Timer timeRemaining={timeRemaining} />
          </div>
          
          <div className="mt-4">
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-white/20"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Station Content */}
        <div className="space-y-6">
          
          {/* Scenario */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Station Brief</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                <p className="text-foreground leading-relaxed">
                  {station.scenario}
                </p>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <strong>Instructions:</strong> This is a {station.category} station. 
                {station.category === "examination" && " Perform a systematic examination and document your findings."}
                {station.category === "communication" && " Focus on clear communication and patient interaction."}
                {station.category === "history" && " Take a focused history and present your findings."}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {assessmentActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center space-y-1 hover:border-primary hover:bg-primary/5"
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Assessment Criteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {station.assessmentCriteria.map((criteria: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="osce-criteria-dot pending" />
                    <span className="text-sm text-foreground">{criteria}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes and Actions */}
        <div className="space-y-6">
          
          {/* Clinical Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clinical Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Document your findings, observations, and clinical reasoning here..."
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                {notes.length} characters • Good documentation is essential for OSCE success
              </div>
            </CardContent>
          </Card>

          {/* Patient Information Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span className="font-medium">45 years old</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium">Female</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Setting:</span>
                  <span className="font-medium">GP Surgery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Presenting complaint:</span>
                  <span className="font-medium">As per scenario</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Station Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Station Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Used:</span>
                  <span className="font-medium">
                    {Math.floor((station.duration * 60 - timeRemaining) / 60)}m {((station.duration * 60 - timeRemaining) % 60)}s
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Remaining:</span>
                  <span className="font-medium text-primary">
                    {Math.floor(timeRemaining / 60)}m {timeRemaining % 60}s
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Notes Length:</span>
                  <span className="font-medium">{notes.length} characters</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onComplete}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                  <span>Completing Station...</span>
                </div>
              ) : (
                "Complete Station"
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full"
              disabled={isSubmitting}
            >
              Pause & Return
            </Button>
          </div>

          {/* Help Tips */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="text-sm space-y-2">
                <div className="font-medium text-foreground">💡 OSCE Tips:</div>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Introduce yourself and obtain consent</li>
                  <li>• Follow a systematic approach</li>
                  <li>• Communicate clearly throughout</li>
                  <li>• Document findings as you go</li>
                  <li>• Summarize your assessment</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
