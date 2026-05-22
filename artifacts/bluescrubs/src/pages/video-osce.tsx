import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Video, VideoOff, Mic, MicOff, Play, Pause, RotateCcw, 
  Clock, User, FileText, CheckCircle, AlertCircle, 
  Camera, Upload, Download, Settings, Volume2, VolumeX, X
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import videoBgImage from '@assets/3FEBA1E1-EE29-45D2-8251-602E336171C5_1750366172462.png';

interface VideoOSCESession {
  id: string;
  stationId: string;
  stationTitle: string;
  category: string;
  duration: number;
  recordingUrl?: string;
  analysisResults?: {
    overallScore: number;
    communicationScore: number;
    technicalScore: number;
    professionalismScore: number;
    feedback: {
      strengths: string[];
      improvements: string[];
      specificAdvice: string[];
    };
    detailedAnalysis: string;
  };
  status: 'not-started' | 'recording' | 'completed' | 'analyzing';
  createdAt: string;
  completedAt?: string;
}

interface OSCEStation {
  id: string;
  title: string;
  type: string;
  category: string;
  duration: number;
  scenario: string;
  instructions: {
    candidate: string;
    examiner: string;
    standardizedPatient?: string;
  };
  difficulty: string;
  keySkills: string[];
}

export default function VideoOSCE() {
  const [selectedStation, setSelectedStation] = useState<OSCEStation | null>(null);
  const [currentSession, setCurrentSession] = useState<VideoOSCESession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch available OSCE stations
  const { data: stations = [], isLoading: stationsLoading } = useQuery({
    queryKey: ['/api/osce/stations'],
    queryFn: async () => {
      const response = await fetch('/api/osce/stations');
      if (!response.ok) throw new Error('Failed to fetch stations');
      return response.json();
    }
  });

  // Fetch user's video sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/video-osce/sessions'],
    queryFn: async () => {
      const response = await fetch('/api/video-osce/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return response.json();
    }
  });

  const queryClient = useQueryClient();

  // Start video recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      setVideoStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setShowSaveButton(true);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Auto-stop after station duration
      if (selectedStation) {
        setTimeout(() => {
          stopRecording();
        }, selectedStation.duration * 60 * 1000);
      }

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check camera and microphone permissions.');
    }
  };

  // Stop video recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
    }
  };

  // Upload recording mutation
  const uploadRecordingMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      const formData = new FormData();
      formData.append('video', blob, 'osce-recording.webm');
      formData.append('stationId', selectedStation?.id || '');
      formData.append('duration', recordingTime.toString());

      const response = await fetch('/api/video-osce/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload recording');
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSession(data);
      queryClient.invalidateQueries({ queryKey: ['/api/video-osce/sessions'] });
    }
  });

  const uploadRecording = async (blob: Blob) => {
    uploadRecordingMutation.mutate(blob);
  };

  const saveRecording = () => {
    if (recordedBlob) {
      uploadRecording(recordedBlob);
      setShowSaveButton(false);
      setRecordedBlob(null);
    }
  };

  const discardRecording = () => {
    setRecordedBlob(null);
    setShowSaveButton(false);
  };

  // Toggle audio/video
  const toggleAudio = () => {
    if (videoStream) {
      videoStream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (videoStream) {
      videoStream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter stations by category
  const filteredStations = stations.filter((station: OSCEStation) => 
    selectedCategory === 'all' || station.category === selectedCategory
  );

  // Get unique categories
  const categories = Array.from(new Set(stations.map((s: OSCEStation) => s.category)));

  // Force text visibility after component mounts
  useEffect(() => {
    const forceTextVisibility = () => {
      // Target all text elements and force black color
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const element = el as HTMLElement;
        if (element.style) {
          element.style.color = '#000000';
          element.style.webkitTextFillColor = '#000000';
        }
      });

      // Specifically target dropdown elements
      const selectElements = document.querySelectorAll('[data-radix-select-content], [data-radix-select-item], [role="combobox"], [role="option"]');
      selectElements.forEach(el => {
        const element = el as HTMLElement;
        element.style.color = '#000000';
        element.style.backgroundColor = '#ffffff';
      });
    };

    // Run immediately and after a delay to catch dynamic content
    forceTextVisibility();
    setTimeout(forceTextVisibility, 100);
    setTimeout(forceTextVisibility, 500);
  }, [stations]);

  return (
    <div className="video-osce min-h-screen bg-white" data-page="video-osce">
      {/* Hero Banner */}
      <div 
        className="relative bg-gradient-to-r from-blue-600 to-purple-700 w-full h-64 md:h-80 lg:h-96 mb-8 overflow-hidden"
        style={{
          backgroundImage: `url(${videoBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
          willChange: 'transform',
          contain: 'layout style paint'
        }}
      >

        <div className="relative z-50 flex flex-col items-center justify-center text-center px-8 py-16 hero-text" style={{ contain: 'layout', transform: 'translateZ(0)' }}>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Video OSCE Practice
          </h1>
          <p className="text-xl lg:text-2xl mb-6 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Record yourself performing OSCE stations and get smart feedback
          </p>

        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Navigation */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Practice Sessions</h2>
          <p className="text-lg text-gray-600">
            Choose a station, record your performance, and receive detailed feedback
          </p>
        </div>

        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="practice">Practice Session</TabsTrigger>
            <TabsTrigger value="recordings">My Recordings</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Practice Session Tab */}
          <TabsContent value="practice" className="space-y-6">
            {!selectedStation ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900" style={{ color: '#000000', WebkitTextFillColor: '#000000' }}>Select OSCE Station</h2>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48" style={{ color: '#000000 !important' }}>
                      <SelectValue placeholder="Filter by category" style={{ color: '#000000 !important' }} />
                    </SelectTrigger>
                    <SelectContent style={{ color: '#000000 !important', backgroundColor: '#ffffff' }}>
                      <SelectItem value="all" style={{ color: '#000000 !important', backgroundColor: '#ffffff' }}>
                        All Categories ({filteredStations.length})
                      </SelectItem>
                      {categories.filter(cat => typeof cat === 'string').map((category: string) => {
                        const categoryCount = stations.filter((s: OSCEStation) => s.category === category).length;
                        return (
                          <SelectItem 
                            key={category} 
                            value={category} 
                            style={{ color: '#000000 !important', backgroundColor: '#ffffff' }}
                          >
                            {category} ({categoryCount})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredStations.map((station: OSCEStation) => (
                    <Card key={station.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{station.title}</CardTitle>
                            <CardDescription>{station.category}</CardDescription>
                          </div>
                          <Badge variant={station.difficulty === 'advanced' ? 'destructive' : 
                                       station.difficulty === 'intermediate' ? 'default' : 'secondary'}>
                            {station.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{station.duration} minutes</span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {station.scenario}
                          </p>
                          <Button 
                            onClick={() => setSelectedStation(station)}
                            className="w-full"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Start Recording
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              // Recording Interface
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{selectedStation.title}</CardTitle>
                        <CardDescription>{selectedStation.category}</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedStation(null)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Change Station
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Video Preview */}
                      <div className="space-y-4">
                        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                          <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          {!videoEnabled && (
                            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                              <VideoOff className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Recording Controls */}
                        <div className="flex justify-center gap-4">
                          <Button
                            variant={audioEnabled ? "default" : "destructive"}
                            size="sm"
                            onClick={toggleAudio}
                          >
                            {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant={videoEnabled ? "default" : "destructive"}
                            size="sm"
                            onClick={toggleVideo}
                          >
                            {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                          </Button>
                          {!isRecording ? (
                            <Button onClick={startRecording} className="px-6">
                              <Play className="w-4 h-4 mr-2" />
                              Start Recording
                            </Button>
                          ) : (
                            <Button onClick={stopRecording} variant="destructive" className="px-6">
                              <Pause className="w-4 h-4 mr-2" />
                              Stop Recording
                            </Button>
                          )}
                        </div>

                        {/* Recording Timer */}
                        {isRecording && (
                          <div className="text-center">
                            <div className="text-2xl font-mono text-red-600">
                              {formatTime(recordingTime)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Recording in progress...
                            </div>
                          </div>
                        )}

                        {/* Save Recording Buttons */}
                        {showSaveButton && (
                          <div className="text-center space-y-3">
                            <div className="text-sm text-gray-600 mb-3">
                              Recording completed! Choose what to do:
                            </div>
                            <div className="flex gap-3 justify-center">
                              <Button onClick={saveRecording} className="px-6" disabled={uploadRecordingMutation.isPending}>
                                <Upload className="w-4 h-4 mr-2" />
                                {uploadRecordingMutation.isPending ? 'Saving...' : 'Save Recording'}
                              </Button>
                              <Button onClick={discardRecording} variant="outline" className="px-6">
                                <X className="w-4 h-4 mr-2" />
                                Discard
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Station Instructions */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Scenario</h3>
                          <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                            {selectedStation?.scenario || 'Clinical scenario will be provided by the examiner.'}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Instructions</h3>
                          <p className="text-sm text-gray-700 bg-green-50 p-3 rounded">
                            {selectedStation.instructions?.candidate || 'Take a comprehensive history and examination as appropriate.'}
                          </p>
                        </div>

                        {(selectedStation as any).markingCriteria && (
                          <div>
                            <h3 className="font-semibold mb-2">Key Assessment Areas</h3>
                            <div className="flex flex-wrap gap-2">
                              {(selectedStation as any).markingCriteria.map((criteria: any, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {criteria.category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h3 className="font-semibold mb-2">Duration</h3>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{selectedStation?.duration || 8} minutes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Recordings Tab */}
          <TabsContent value="recordings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Recordings</h2>
            <div className="grid gap-4">
              {sessions.map((session: VideoOSCESession) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">{session.stationTitle}</CardTitle>
                        <CardDescription>{session.category}</CardDescription>
                      </div>
                      <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Recorded: {new Date(session.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        {session.recordingUrl && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => setPlayingVideo(session.id)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Play Recording
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </>
                        )}
                        {session.analysisResults && (
                          <Button size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            View Feedback
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Video Player Modal */}
            {playingVideo && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Recording Playback</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPlayingVideo(null)}
                    >
                      ✕
                    </Button>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <video 
                      controls 
                      className="w-full max-h-96 rounded"
                      src={sessions.find((s: VideoOSCESession) => s.id === playingVideo)?.recordingUrl}
                    >
                      Your browser does not support video playback.
                    </video>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Station:</strong> {sessions.find((s: VideoOSCESession) => s.id === playingVideo)?.stationTitle}</p>
                    <p><strong>Category:</strong> {sessions.find((s: VideoOSCESession) => s.id === playingVideo)?.category}</p>
                    <p><strong>Recorded:</strong> {sessions.find((s: VideoOSCESession) => s.id === playingVideo)?.createdAt ? new Date(sessions.find((s: VideoOSCESession) => s.id === playingVideo)!.createdAt).toLocaleString() : 'Unknown'}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Feedback Analysis</h2>
            <div className="text-center text-gray-600">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Complete a recording to receive detailed AI feedback on your performance.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}