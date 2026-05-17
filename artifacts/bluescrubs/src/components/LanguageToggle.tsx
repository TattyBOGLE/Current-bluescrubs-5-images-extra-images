import { useState, useEffect } from 'react';
import { Globe, Languages, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/hooks/useI18n';

// Simple language data for the toggle component
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
];

interface LanguageToggleProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export function LanguageToggle({ 
  className = '', 
  variant = 'ghost',
  size = 'default' 
}: LanguageToggleProps) {
  const { currentLanguage, setLanguage } = useI18n();
  const [isTranslationMode, setIsTranslationMode] = useState(false);

  const currentLangData = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (langCode: any) => {
    setLanguage(langCode);
  };

  const toggleTranslationMode = () => {
    setIsTranslationMode(!isTranslationMode);
    if (isTranslationMode) {
      handleLanguageChange('en');
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Language Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">
              {currentLangData?.flag} {currentLangData?.nativeName}
            </span>
            <span className="sm:hidden">
              {currentLangData?.flag}
            </span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 max-h-80 overflow-y-auto">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Choose Language
          </div>
          <DropdownMenuSeparator />
          
          {/* English First */}
          <DropdownMenuItem
            onClick={() => handleLanguageChange('en')}
            className={`flex items-center gap-3 ${currentLanguage === 'en' ? 'bg-accent' : ''}`}
          >
            <span className="text-lg">🇬🇧</span>
            <div className="flex flex-col">
              <span className="font-medium">English (UK)</span>
              <span className="text-xs text-muted-foreground">Official exam language</span>
            </div>
            {currentLanguage === 'en' && (
              <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Other Languages */}
          {SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'en').map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center gap-3 ${currentLanguage === language.code ? 'bg-accent' : ''}`}
            >
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-xs text-muted-foreground">{language.name}</span>
              </div>
              {currentLanguage === language.code && (
                <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function ExamModeToggle({ className = '' }: { className?: string }) {
  const [currentLanguage] = useState('en');
  const [isTranslationMode, setIsTranslationMode] = useState(false);

  if (currentLanguage === 'en') return null;

  const currentLangData = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  return (
    <div className={`flex items-center gap-4 p-4 bg-muted/50 rounded-lg border ${className}`}>
      <div className="flex-1">
        <h4 className="font-medium text-sm">
          Translation Mode
        </h4>
        <p className="text-xs text-muted-foreground">
          {isTranslationMode 
            ? `Currently viewing in ${currentLangData?.nativeName}. Switch to English for exam practice.`
            : 'Currently in English (exam mode). Switch to your native language for better understanding.'
          }
        </p>
      </div>
      <Button
        variant={isTranslationMode ? "default" : "outline"}
        size="sm"
        onClick={() => setIsTranslationMode(!isTranslationMode)}
        className="shrink-0"
      >
        {isTranslationMode ? (
          <>🇬🇧 English</>
        ) : (
          <>{currentLangData?.flag} {currentLangData?.nativeName}</>
        )}
      </Button>
    </div>
  );
}