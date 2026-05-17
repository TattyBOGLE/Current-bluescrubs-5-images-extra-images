import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Pause, Play, Settings } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';

interface AudioSupportProps {
  text: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showSettings?: boolean;
}

export function AudioSupport({ text, className = '', size = 'default', showSettings = true }: AudioSupportProps) {
  const { isSupported, isSpeaking, isPaused, voices, speak, pause, resume, cancel } = useTextToSpeech();
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  if (!isSupported) {
    return null;
  }

  const handleSpeak = () => {
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak(text, {
        rate,
        pitch,
        volume,
        voice: selectedVoice
      });
    }
  };

  const handleStop = () => {
    cancel();
  };

  const buttonSize = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className={buttonSize}
        onClick={handleSpeak}
        title={isSpeaking && !isPaused ? 'Pause audio' : isPaused ? 'Resume audio' : 'Read aloud'}
      >
        {isSpeaking && !isPaused ? (
          <Pause className={iconSize} />
        ) : (
          <Play className={iconSize} />
        )}
      </Button>

      {isSpeaking && (
        <Button
          variant="outline"
          size="icon"
          className={buttonSize}
          onClick={handleStop}
          title="Stop audio"
        >
          <VolumeX className={iconSize} />
        </Button>
      )}

      {showSettings && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={buttonSize}
              title="Audio settings"
            >
              <Settings className={iconSize} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Audio Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Speed</label>
                <Slider
                  value={[rate]}
                  onValueChange={(value) => setRate(value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">{rate.toFixed(1)}x</div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Pitch</label>
                <Slider
                  value={[pitch]}
                  onValueChange={(value) => setPitch(value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">{pitch.toFixed(1)}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Volume</label>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">{Math.round(volume * 100)}%</div>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Voice Selection</DropdownMenuLabel>
            
            <div className="max-h-40 overflow-y-auto">
              {voices.filter(voice => voice.lang.startsWith('en')).map((voice, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => setSelectedVoice(voice)}
                  className={selectedVoice?.name === voice.name ? 'bg-blue-50' : ''}
                >
                  <div className="flex flex-col">
                    <span className="text-sm">{voice.name}</span>
                    <span className="text-xs text-gray-500">{voice.lang}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

interface ReadableTextProps {
  children: React.ReactNode;
  className?: string;
  showAudioControls?: boolean;
  audioControlsSize?: 'sm' | 'default' | 'lg';
}

export function ReadableText({ 
  children, 
  className = '', 
  showAudioControls = true,
  audioControlsSize = 'sm'
}: ReadableTextProps) {
  const textContent = typeof children === 'string' ? children : 
    React.Children.toArray(children).join(' ');

  return (
    <div className={`relative group ${className}`}>
      {children}
      {showAudioControls && (
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <AudioSupport 
            text={textContent} 
            size={audioControlsSize}
            showSettings={false}
          />
        </div>
      )}
    </div>
  );
}