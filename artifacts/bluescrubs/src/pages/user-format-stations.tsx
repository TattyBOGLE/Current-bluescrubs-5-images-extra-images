import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Clock, Users, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface UserFormatStation {
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
}

interface GenerationStatus {
  totalStations: number;
  targetCount: number;
  remaining: number;
  percentComplete: number;
  targetReached: boolean;
}

export default function UserFormatStations() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStation, setSelectedStation] = useState<UserFormatStation | null>(null);

  const { data: stations = [], refetch: refetchStations } = useQuery<UserFormatStation[]>({
    queryKey: ['/api/user-format/stations'],
  });

  const { data: status, refetch: refetchStatus } = useQuery<GenerationStatus>({
    queryKey: ['/api/user-format/status'],
    refetchInterval: 2000,
  });

  const startGeneration = async () => {
    setIsGenerating(true);
    
    // Start multiple parallel generation processes
    const processes = 200; // Generate in parallel for speed
    const promises = [];
    
    for (let i = 0; i < processes; i++) {
      promises.push(
        fetch('/api/generate-user-format-3000-stations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })
      );
    }
    
    try {
      await Promise.all(promises);
      await refetchStations();
      await refetchStatus();
    } catch (error) {
      console.error('Generation error:', error);
    }
    
    setIsGenerating(false);
  };

  if (selectedStation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-700 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedStation(null)}
            className="mb-6 hover:bg-blue-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stations
          </Button>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-slate-200 dark:border-gray-600">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">{selectedStation.scenario_title}</CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    {selectedStation.station_type} Station
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  8 minutes
                </Badge>
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

              <div className="bg-slate-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-teal-800 dark:text-purple-300">Mark Scheme</h3>
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

              <div className="bg-teal-600 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-700">Guidelines & References</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(selectedStation.guideline_links).map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-600 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-700 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PLAB 2 OSCE Stations - User Format
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Streamlined format with actor scripts for practical OSCE preparation
          </p>
          
          {status && (
            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{status.totalStations} stations</span>
                <span>{status.percentComplete}% complete</span>
              </div>
              <Progress value={status.percentComplete} className="h-3 bg-gray-200 dark:bg-gray-700">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-700 rounded-full transition-all duration-300"
                  style={{ width: `${status.percentComplete}%` }}
                />
              </Progress>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Target: {status.targetCount} stations
                {status.remaining > 0 && ` (${status.remaining} remaining)`}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" className="hover:bg-blue-50 dark:hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            {status && !status.targetReached && (
              <Button
                onClick={startGeneration}
                disabled={isGenerating}
                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate More Stations
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station, index) => (
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
                    8 min
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

        {stations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No stations available yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Click "Generate More Stations" to create your user format OSCE stations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}