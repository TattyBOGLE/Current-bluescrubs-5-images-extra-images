import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Languages, Users, Download, ArrowLeft, CheckCircle, Clock, FileText, Shield } from 'lucide-react';
import { Link } from 'wouter';

interface SupportedLanguages {
  [key: string]: {
    name: string;
    rtl: boolean;
    medicalStandard: string;
  };
}

interface TranslationStats {
  totalLanguages: number;
  translatedExams: Record<string, string[]>;
  coveragePercentage: Record<string, number>;
}

interface IndependentStats {
  totalLanguages: number;
  supportedLanguages: string[];
  dictionarySize: number;
  patternCount: number;
  culturalAdaptations: number;
  aiDependency: string;
  offlineCapable: boolean;
}

export default function TranslationDashboard() {
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const { data: languages } = useQuery<{ languages: SupportedLanguages; totalCount: number }>({
    queryKey: ['/api/translations/supported-languages'],
  });

  const { data: stats } = useQuery<TranslationStats>({
    queryKey: ['/api/translations/stats'],
  });

  const { data: manifest } = useQuery({
    queryKey: ['/api/translations/manifest'],
  });

  const { data: independentStats } = useQuery<IndependentStats>({
    queryKey: ['/api/independent-translations/stats'],
  });

  const examTypes = ['PLAB2', 'USMLE', 'AMC', 'MCCQE', 'SCHS', 'DHA', 'HAAD'];

  const downloadTranslations = async (examType?: string, language?: string) => {
    let url = '/api/translations/template';
    if (examType && language) {
      url = `/api/translations/${examType}/${language}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = examType && language 
      ? `${examType}-${language}-translations.json`
      : 'translation-template.json';
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const priorityLanguages = [
    'ar', 'zh', 'hi', 'es', 'fr', 'de', 'pt', 'ru', 'ja', 'ko'
  ];

  const translateIndependently = async (examType: string) => {
    try {
      const response = await fetch('/api/independent-translations/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          examType, 
          targetLanguages: priorityLanguages.slice(0, 5) // First 5 priority languages
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Successfully created ${result.totalTranslations} independent translations for ${examType}!`);
      }
    } catch (error) {
      console.error('Independent translation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Translation Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Multi-language medical content without external dependency
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" className="hover:bg-purple-50 dark:hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Independence Status */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Independent Translation System</h2>
                <p className="text-lg">
                  {independentStats?.dictionarySize || 0} medical terms • {independentStats?.totalLanguages || 0} languages • Zero AI dependency
                </p>
              </div>
              <Shield className="h-12 w-12" />
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Supported Languages
                  </p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {languages?.totalCount || 0}
                  </p>
                </div>
                <Languages className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Translated Exams
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats ? Object.keys(stats.translatedExams).length : 0}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Translations
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats?.totalLanguages || 0}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    External Dependency
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    NONE
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Priority Grid */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              High-Priority Languages
            </CardTitle>
            <CardDescription>
              Languages covering major medical graduate populations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {priorityLanguages.map(langCode => {
                const language = languages?.languages[langCode];
                if (!language) return null;
                
                const isTranslated = stats?.translatedExams.PLAB2?.includes(langCode);
                
                return (
                  <div
                    key={langCode}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isTranslated 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {language.name}
                      </h3>
                      {isTranslated && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {langCode.toUpperCase()}
                    </p>
                    <Badge 
                      variant={isTranslated ? "default" : "secondary"}
                      className={`text-xs ${
                        isTranslated 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-600 text-white'
                      }`}
                    >
                      {language.rtl ? 'RTL' : 'LTR'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Translation Progress by Exam */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Translation Coverage by Exam Type</CardTitle>
            <CardDescription>
              Progress toward complete multi-language support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {examTypes.map(examType => {
                const translatedLanguages = stats?.translatedExams[examType]?.length || 0;
                const totalLanguages = languages?.totalCount || 1;
                const coverage = Math.round((translatedLanguages / totalLanguages) * 100);
                
                return (
                  <div key={examType} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{examType}</Badge>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {translatedLanguages} of {totalLanguages} languages
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {coverage}%
                      </span>
                    </div>
                    <Progress 
                      value={coverage} 
                      className="h-2"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Translation Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Translation Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map(exam => (
                      <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages && Object.entries(languages.languages).map(([code, lang]) => (
                      <SelectItem key={code} value={code}>
                        {lang.name} ({code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => downloadTranslations()}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
                
                <Button
                  onClick={() => translateIndependently(selectedExam || 'PLAB2')}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Create Independent Translations
                </Button>
                
                <Button
                  onClick={() => downloadTranslations(selectedExam, selectedLanguage)}
                  disabled={!selectedExam || !selectedLanguage}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Translations
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Independence Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'No external translation API required',
                  'Built-in medical terminology dictionary',
                  'Pattern-based translation system',
                  'Cultural adaptation guidelines',
                  'Complete offline capability',
                  'Zero AI dependency',
                  'Medical accuracy preservation',
                  'RTL language support included'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Translation System Ready
            </h3>
            <p className="text-lg mb-6">
              Support for {languages?.totalCount || 0} languages with professional medical translation 
              capabilities, completely independent from external services.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/content-independence">
                <Button variant="secondary" size="lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  View Independence Status
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => window.location.reload()}
              >
                <Clock className="w-5 h-5 mr-2" />
                Refresh Stats
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}