import { useState, useEffect, useCallback } from 'react';

export interface TextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

export function useTextToSpeech() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    setIsSupported(true);

    const loadVoices = () => {
      const allVoicesList = speechSynthesis.getVoices();
      setVoices(allVoicesList);

      if (allVoicesList.length === 0) return;

      const qualityVoices = allVoicesList.filter(v =>
        !v.name.toLowerCase().includes('robot') &&
        !v.name.toLowerCase().includes('synthetic') &&
        !v.name.toLowerCase().includes('compact')
      );
      const englishVoices = qualityVoices.filter(v => v.lang.startsWith('en'));
      const otherVoices = qualityVoices.filter(v =>
        !v.lang.startsWith('en') &&
        ['ar', 'hi', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'zh', 'ja', 'ko'].some(lang =>
          v.lang.startsWith(lang)
        )
      );
      const filtered = [...englishVoices, ...otherVoices].slice(0, 15);
      setAvailableVoices(filtered);

      setSelectedVoice(prev => {
        if (prev) return prev;
        const preferred = filtered.find(v =>
          v.name.toLowerCase().includes('enhanced') ||
          v.name.toLowerCase().includes('premium') ||
          v.name.toLowerCase().includes('neural') ||
          v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('alex') ||
          v.name.toLowerCase().includes('susan') ||
          v.name.toLowerCase().includes('daniel') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('moira')
        ) ?? filtered[0];
        return preferred?.name ?? '';
      });
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const speak = useCallback((text: string, options: TextToSpeechOptions = {}) => {
    if (!isSupported || !text.trim()) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    if (options.voice) {
      utterance.voice = options.voice;
    } else {
      const preferredVoice = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Enhanced') || v.name.includes('Premium') || v.default)
      ) ?? voices.find(v => v.lang.startsWith('en'));
      if (preferredVoice) utterance.voice = preferredVoice;
    }

    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };

    speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported, isPaused]);

  const cancel = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  const stopSpeaking = cancel;

  return {
    isSupported,
    isSpeaking,
    isPaused,
    voices,
    speechEnabled,
    setSpeechEnabled,
    selectedVoice,
    setSelectedVoice,
    availableVoices,
    speak,
    pause,
    resume,
    cancel,
    stopSpeaking,
  };
}
