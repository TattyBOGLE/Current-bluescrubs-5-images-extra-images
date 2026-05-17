import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, Check } from "lucide-react";
import { i18n, SUPPORTED_LANGUAGES, type Language, type LanguageOption } from "@/lib/i18n";

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
  showLabel?: boolean;
  compact?: boolean;
}

export function LanguageSelector({ onLanguageChange, showLabel = true, compact = false }: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18n.getCurrentLanguage());

  useEffect(() => {
    const unsubscribe = i18n.onLanguageChange((language) => {
      setCurrentLanguage(language);
    });
    return unsubscribe;
  }, []);

  const handleLanguageChange = (language: Language) => {
    i18n.setLanguage(language);
    setCurrentLanguage(language);
    onLanguageChange?.(language);
  };

  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);

  if (compact) {
    return (
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px]">
          <div className="flex items-center gap-2">
            <span>{currentLangInfo?.flag}</span>
            <span className="text-sm">{currentLangInfo?.code.toUpperCase()}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {lang.code === currentLanguage && <Check className="h-4 w-4 text-green-600" />}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-blue-600" />
          {showLabel && <h3 className="font-semibold text-gray-900">{i18n.t('profile.language')}</h3>}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Button
              key={lang.code}
              variant={currentLanguage === lang.code ? "default" : "outline"}
              className={`justify-start h-auto p-3 ${
                currentLanguage === lang.code ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-lg">{lang.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-xs opacity-75">{lang.nativeName}</div>
                </div>
                {currentLanguage === lang.code && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Current:</strong> {currentLangInfo?.nativeName} ({currentLangInfo?.name})
          </p>
          {i18n.isRTL() && (
            <Badge className="mt-2 bg-purple-100 text-purple-800">
              Right-to-Left Layout
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default LanguageSelector;