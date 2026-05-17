import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MCQInterfaceProps {
  question: any;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  canGoBack: boolean;
  isSubmitting: boolean;
}

export default function MCQInterface({
  question,
  selectedAnswer,
  onAnswerSelect,
  onSubmit,
  onPrevious,
  canGoBack,
  isSubmitting,
}: MCQInterfaceProps) {
  if (!question) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">Loading question...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-8">
        
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {question.difficulty}
            </Badge>
            <Badge variant="secondary">
              {question.examType.toUpperCase()}
            </Badge>
          </div>
          
          {question.scenario && (
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-foreground mb-2">Clinical Scenario</h4>
              <p className="text-muted-foreground leading-relaxed">
                {question.scenario}
              </p>
            </div>
          )}
          
          <h3 className="text-xl font-semibold text-foreground leading-relaxed">
            {question.questionText}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              className={`mcq-option w-full text-left ${
                selectedAnswer === index ? "selected" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                  selectedAnswer === index
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-foreground">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => console.log('Question bookmarked for review')}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Bookmark
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => console.log('Question issue reported')}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Report Issue
            </Button>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!canGoBack}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            
            <Button
              onClick={onSubmit}
              disabled={selectedAnswer === null || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <>
                  Submit Answer
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Help Text */}
        {selectedAnswer === null && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              💡 Select an answer above to continue. Take your time to read the scenario carefully.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
