import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Settings, Brain, Heart, Accessibility } from 'lucide-react';
import { NEURO_ACCOMMODATIONS, type NeuroAtypicalType, type NeuroAccommodation } from '@shared/neurodiversity-schema';

interface NeuroSettingsProps {
  selectedAccommodations: NeuroAtypicalType[];
  onAccommodationsChange: (accommodations: NeuroAtypicalType[]) => void;
}

export function NeuroSettings({ selectedAccommodations, onAccommodationsChange }: NeuroSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<NeuroAtypicalType[]>(selectedAccommodations);

  const handleToggleAccommodation = (id: NeuroAtypicalType) => {
    if (id === 'none') {
      setTempSelected(['none']);
      return;
    }

    const newSelected = tempSelected.includes(id)
      ? tempSelected.filter(item => item !== id && item !== 'none')
      : [...tempSelected.filter(item => item !== 'none'), id];

    setTempSelected(newSelected.length === 0 ? ['none'] : newSelected);
  };

  const handleSave = () => {
    onAccommodationsChange(tempSelected);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedAccommodations);
    setIsOpen(false);
  };

  const getActiveAccommodationsCount = () => {
    return selectedAccommodations.filter(acc => acc !== 'none').length;
  };

  const getAccommodationSummary = () => {
    if (selectedAccommodations.includes('none') || selectedAccommodations.length === 0) {
      return 'Standard format';
    }
    const names = selectedAccommodations
      .filter(acc => acc !== 'none')
      .map(acc => NEURO_ACCOMMODATIONS.find(na => na.id === acc)?.name)
      .filter(Boolean);
    return names.join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 relative"
          size="sm"
        >
          <Accessibility className="w-4 h-4" />
          <span>Neurodiversity Support</span>
          {getActiveAccommodationsCount() > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {getActiveAccommodationsCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Neurodiversity Support Settings
          </DialogTitle>
          <DialogDescription>
            Customize your learning experience with accommodations designed for different cognitive styles and learning needs.
            Select all that apply to you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {NEURO_ACCOMMODATIONS.map((accommodation) => (
              <Card 
                key={accommodation.id}
                className={`cursor-pointer transition-all ${
                  tempSelected.includes(accommodation.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => handleToggleAccommodation(accommodation.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={tempSelected.includes(accommodation.id)}
                      onChange={() => handleToggleAccommodation(accommodation.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl" role="img" aria-label={accommodation.name}>
                          {accommodation.icon}
                        </span>
                        <h3 className="font-semibold text-sm">{accommodation.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{accommodation.description}</p>
                      
                      <div className="space-y-2">
                        {/* Display key accommodations */}
                        <div className="flex flex-wrap gap-1">
                          {accommodation.accommodations.timing.extendedTime && (
                            <Badge variant="outline" className="text-xs">Extended Time</Badge>
                          )}
                          {accommodation.accommodations.display.fontSize !== 'normal' && (
                            <Badge variant="outline" className="text-xs">Large Text</Badge>
                          )}
                          {accommodation.accommodations.content.audioSupport && (
                            <Badge variant="outline" className="text-xs">Audio Support</Badge>
                          )}
                          {accommodation.accommodations.content.visualCues && (
                            <Badge variant="outline" className="text-xs">Visual Cues</Badge>
                          )}
                          {accommodation.accommodations.cognitive.spacedRepetition && (
                            <Badge variant="outline" className="text-xs">Spaced Repetition</Badge>
                          )}
                          {accommodation.accommodations.interaction.reducedClutter && (
                            <Badge variant="outline" className="text-xs">Reduced Clutter</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Selection Summary */}
          {tempSelected.length > 0 && !tempSelected.includes('none') && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-green-800">Active Accommodations</h4>
                </div>
                <p className="text-sm text-green-700">
                  {tempSelected
                    .filter(id => id !== 'none')
                    .map(id => NEURO_ACCOMMODATIONS.find(acc => acc.id === id)?.name)
                    .join(', ')}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for applying accommodations to question display
export function useNeuroAccommodations(selectedAccommodations: NeuroAtypicalType[]) {
  const getAccommodationStyles = () => {
    if (selectedAccommodations.includes('none') || selectedAccommodations.length === 0) {
      return {};
    }

    // Combine all selected accommodations
    const combinedAccommodations = selectedAccommodations
      .filter(acc => acc !== 'none')
      .map(acc => NEURO_ACCOMMODATIONS.find(na => na.id === acc)?.accommodations)
      .filter((acc): acc is NonNullable<typeof acc> => acc != null);

    // Merge display settings (taking the most accessible option)
    const fontSize = combinedAccommodations.some(acc => acc.display.fontSize === 'extra-large') 
      ? 'extra-large' 
      : combinedAccommodations.some(acc => acc.display.fontSize === 'large') 
        ? 'large' 
        : 'normal';

    const contrast = combinedAccommodations.some(acc => acc.display.contrast === 'extra-high')
      ? 'extra-high'
      : combinedAccommodations.some(acc => acc.display.contrast === 'high')
        ? 'high'
        : 'normal';

    const lineSpacing = combinedAccommodations.some(acc => acc.display.lineSpacing === 'extra-wide')
      ? 'extra-wide'
      : combinedAccommodations.some(acc => acc.display.lineSpacing === 'wide')
        ? 'wide'
        : 'normal';

    return {
      fontSize,
      contrast,
      lineSpacing,
      reducedClutter: combinedAccommodations.some(acc => acc.interaction.reducedClutter),
      largerButtons: combinedAccommodations.some(acc => acc.interaction.largerButtons),
      visualCues: combinedAccommodations.some(acc => acc.content.visualCues),
      extendedTime: combinedAccommodations.some(acc => acc.timing.extendedTime),
      timeMultiplier: Math.max(...combinedAccommodations.map(acc => acc.timing.timeMultiplier), 1),
      audioSupport: combinedAccommodations.some(acc => acc.content.audioSupport),
      keywordHighlighting: combinedAccommodations.some(acc => acc.content.keywordHighlighting)
    };
  };

  const getQuestionStyles = () => {
    const accommodations = getAccommodationStyles();
    
    let className = 'transition-all duration-200 ';
    
    // Font size
    if (accommodations.fontSize === 'extra-large') {
      className += 'text-xl ';
    } else if (accommodations.fontSize === 'large') {
      className += 'text-lg ';
    }

    // Line spacing
    if (accommodations.lineSpacing === 'extra-wide') {
      className += 'leading-loose ';
    } else if (accommodations.lineSpacing === 'wide') {
      className += 'leading-relaxed ';
    }

    // Contrast
    if (accommodations.contrast === 'extra-high') {
      className += 'text-black ';
    } else if (accommodations.contrast === 'high') {
      className += 'text-gray-900 ';
    }

    return className;
  };

  const getButtonStyles = () => {
    const accommodations = getAccommodationStyles();
    return accommodations.largerButtons ? 'h-14 text-base' : '';
  };

  return {
    accommodations: getAccommodationStyles(),
    questionStyles: getQuestionStyles(),
    buttonStyles: getButtonStyles()
  };
}