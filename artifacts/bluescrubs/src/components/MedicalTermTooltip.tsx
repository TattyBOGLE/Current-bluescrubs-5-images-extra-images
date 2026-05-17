import { useState } from 'react';
import { BookOpen, Languages } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

interface MedicalTermTooltipProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

export function MedicalTermTooltip({ term, children, className = '' }: MedicalTermTooltipProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const { translateMedicalTerm, getMedicalDefinition, currentLanguage, nativeLanguage } = useI18n();

  if (currentLanguage === 'en' && nativeLanguage === 'en') {
    return <span className={className}>{children}</span>;
  }

  const translation = translateMedicalTerm(term);
  const definition = getMedicalDefinition(term);
  const hasTranslation = translation !== term;
  
  if (!hasTranslation) {
    return <span className={className}>{children}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span 
            className={`cursor-help underline decoration-dotted decoration-blue-400 hover:decoration-solid ${className}`}
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? translation : children}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium text-sm">Medical Term</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium">English:</span> {term}
              </div>
              {hasTranslation && (
                <div className="text-sm">
                  <span className="font-medium">Translation:</span> {translation}
                </div>
              )}
            </div>
            
            {definition && (
              <div className="text-xs text-muted-foreground border-t pt-2">
                {definition}
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTranslation(!showTranslation)}
              className="w-full text-xs"
            >
              <Languages className="w-3 h-3 mr-1" />
              {showTranslation ? 'Show English' : 'Show Translation'}
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Auto-detect medical terms in text and make them translatable
export function TranslatableText({ 
  text, 
  className = '',
  medicalTerms = [] 
}: { 
  text: string; 
  className?: string;
  medicalTerms?: string[];
}) {
  const { translateMedicalTerm, currentLanguage, nativeLanguage } = useI18n();

  if (currentLanguage === 'en' && nativeLanguage === 'en') {
    return <span className={className}>{text}</span>;
  }

  // Common medical terms to auto-detect
  const commonMedicalTerms = [
    'hypertension', 'diabetes', 'pneumonia', 'asthma', 'bronchitis',
    'myocardial infarction', 'angina', 'arrhythmia', 'tachycardia', 'bradycardia',
    'stroke', 'seizure', 'migraine', 'depression', 'anxiety',
    'arthritis', 'osteoporosis', 'fracture', 'sprain', 'dislocation',
    'appendicitis', 'gastritis', 'ulcer', 'hepatitis', 'cirrhosis',
    'nephritis', 'cystitis', 'uremia', 'anemia', 'leukemia',
    ...medicalTerms
  ];

  let processedText = text;
  const termsFound: string[] = [];

  // Find medical terms in the text
  commonMedicalTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    if (regex.test(text)) {
      termsFound.push(term);
    }
  });

  if (termsFound.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Split text and wrap medical terms
  const parts = text.split(new RegExp(`\\b(${termsFound.join('|')})\\b`, 'gi'));
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isTermMatch = termsFound.some(term => 
          term.toLowerCase() === part.toLowerCase()
        );
        
        if (isTermMatch) {
          return (
            <MedicalTermTooltip key={index} term={part.toLowerCase()}>
              {part}
            </MedicalTermTooltip>
          );
        }
        
        return part;
      })}
    </span>
  );
}