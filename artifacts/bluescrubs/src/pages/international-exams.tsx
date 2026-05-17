import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Clock, Users, BookOpen, CheckCircle, ArrowLeft, Globe, MapPin } from 'lucide-react';
import { Link } from 'wouter';

interface InternationalStation {
  id?: string;
  station_type: string;
  scenario_title: string;
  brief: string;
  actor_script: {
    opening: string;
    details: string;
    hidden_info: string;
  };
  mark_scheme: string[];
  mnemonic: string;
  communication_notes: string;
  guideline_links: Record<string, string>;
  exam_specific: {
    exam_type: string;
    country: string;
    duration: string;
    difficulty: string;
  };
}

interface ExamStats {
  examType: string;
  totalStations: number;
  stations: InternationalStation[];
}

const examDetails = {
  USMLE: { 
    name: 'USMLE', 
    fullName: 'United States Medical Licensing Examination',
    country: 'USA',
    flag: '🇺🇸',
    color: 'from-blue-600 to-red-600'
  },
  AMC: { 
    name: 'AMC', 
    fullName: 'Australian Medical Council',
    country: 'Australia',
    flag: '🇦🇺',
    color: 'from-green-600 to-yellow-600'
  },
  MCCQE: { 
    name: 'MCCQE', 
    fullName: 'Medical Council of Canada',
    country: 'Canada',
    flag: '🇨🇦',
    color: 'from-red-600 to-red-600'
  },
  SCHS: { 
    name: 'SCHS', 
    fullName: 'Saudi Commission for Health Specialties',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    color: 'from-green-600 to-green-800'
  },
  DHA: { 
    name: 'DHA', 
    fullName: 'Dubai Health Authority',
    country: 'UAE',
    flag: '🇦🇪',
    color: 'from-red-600 to-green-600'
  },
  HAAD: { 
    name: 'HAAD', 
    fullName: 'Health Authority Abu Dhabi',
    country: 'UAE',
    flag: '🇦🇪',
    color: 'from-blue-600 to-green-600'
  }
};

export default function InternationalExams() {
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedStation, setSelectedStation] = useState<InternationalStation | null>(null);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  const { data: examStats = [], refetch: refetchStats } = useQuery<ExamStats[]>({
    queryKey: ['/api/international/exams'],
  });

  const generateStations = async (examType: string) => {
    setIsGenerating(prev => ({ ...prev, [examType]: true }));
    
    // Start multiple parallel generation processes
    const processes = 100;
    const promises = [];
    
    for (let i = 0; i < processes; i++) {
      promises.push(
        fetch('/api/generate-international-stations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ examType, targetCount: 1000 })
        })
      );
    }
    
    try {
      await Promise.all(promises);
      await refetchStats();
    } catch (error) {
      console.error('Generation error:', error);
    }
    
    setIsGenerating(prev => ({ ...prev, [examType]: false }));
  };

  if (selectedStation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedStation(null)}
            className="mb-6 hover:bg-blue-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stations
          </Button>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-gray-600">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">{selectedStation.scenario_title}</CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    {selectedStation.exam_specific.exam_type} - {selectedStation.station_type} Station
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {selectedStation.exam_specific.duration}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {selectedStation.exam_specific.country}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">Task Brief</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">{selectedStation.brief}</p>
              </div>

              <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-300">Actor Script</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Opening Line:</h4>
                    <p className="text-gray-700 dark:text-gray-300 italic">"{selectedStation.actor_script.opening}"</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Background Details:</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedStation.actor_script.details}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Hidden Information:</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedStation.actor_script.hidden_info}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-300">Mark Scheme</h3>
                <ul className="space-y-2">
                  {selectedStation.mark_scheme.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-yellow-800 dark:text-yellow-300">Memory Aid</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">{selectedStation.mnemonic}</p>
              </div>

              <div className="bg-orange-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-orange-800 dark:text-orange-300">Communication Notes</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedStation.communication_notes}</p>
              </div>

              <div className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Guidelines & References</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(selectedStation.guideline_links).map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {name}
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            International Medical Exams
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Streamlined OSCE stations for global medical licensing examinations
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" className="hover:bg-blue-50 dark:hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(examDetails).map(([examType, details]) => {
            const examStat = examStats.find(stat => stat.examType === examType);
            const stationCount = examStat?.totalStations || 0;
            const progress = Math.round((stationCount / 1000) * 100);
            
            return (
              <Card
                key={examType}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{details.flag}</span>
                      <Badge className={`bg-gradient-to-r ${details.color} text-white`}>
                        {details.name}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      {details.country}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {details.fullName}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>{stationCount} stations</span>
                      <span>{progress}% complete</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => generateStations(examType)}
                      disabled={isGenerating[examType]}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      size="sm"
                    >
                      {isGenerating[examType] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Generate Stations
                        </>
                      )}
                    </Button>

                    {stationCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedExam(examType)}
                        className="w-full"
                        size="sm"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Stations ({stationCount})
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      15 min
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      International
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedExam && (
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {examDetails[selectedExam as keyof typeof examDetails].fullName} Stations
              </h2>
              <Button
                variant="outline"
                onClick={() => setSelectedExam('')}
                size="sm"
              >
                Clear Selection
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {examStats
                .find(stat => stat.examType === selectedExam)
                ?.stations.map((station, index) => (
                <Card
                  key={station.id || index}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => setSelectedStation(station)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mb-2"
                      >
                        {station.station_type}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {station.exam_specific.duration}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white">
                      {station.scenario_title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                      {station.brief}
                    </p>
                    
                    <div className="bg-green-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
                      <p className="text-sm text-green-800 dark:text-green-300 italic">
                        "{station.actor_script.opening}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {station.mark_scheme.length} marks
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {Object.keys(station.guideline_links).length} refs
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {examStats.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No international exam stations available yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Click "Generate Stations" on any exam card to create streamlined OSCE stations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}