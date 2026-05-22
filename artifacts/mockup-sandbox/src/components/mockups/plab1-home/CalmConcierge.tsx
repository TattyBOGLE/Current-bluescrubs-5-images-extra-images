import React, { useState } from 'react';
import { 
  Settings, User, Home, BarChart2, Bookmark, Play, 
  ChevronRight, Brain, HeartPulse, Activity, 
  FileText, Clock, Volume2, Globe, BookOpen, Infinity as InfinityIcon
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Custom Icon for Lungs since it might not be in older lucide versions
const LungsIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v6" />
    <path d="M12 8c-2.5 0-6 2.5-6 6v3c0 2 1.5 3 3 3s3-1 3-3" />
    <path d="M12 8c2.5 0 6 2.5 6 6v3c0 2-1.5 3-3 3s-3-1-3-3" />
  </svg>
);

export function CalmConcierge() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('mixed');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedMode, setSelectedMode] = useState('practice');
  const [questionCount, setQuestionCount] = useState(10);
  
  return (
    <div className="w-[402px] h-[874px] bg-[#FAFAFA] relative overflow-hidden flex flex-col font-sans text-slate-800 shadow-2xl border border-slate-200">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* Header */}
        <div className="px-6 pt-14 pb-6 flex justify-between items-center bg-gradient-to-b from-[#F2F7F9] to-[#FAFAFA]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hi, Dr. Sam <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-pointer">👋</span>
            </h1>
            <p className="text-slate-500 text-[15px] mt-1 font-medium">Ready for today's practice?</p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-400 hover:text-[#148F85] hover:shadow-md transition-all">
                <Settings size={20} strokeWidth={2.5} />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-[2rem] h-[400px] border-none shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
              <SheetHeader className="mb-6 pt-2">
                <SheetTitle className="text-xl font-bold">Advanced Settings</SheetTitle>
              </SheetHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Globe size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Translation</p>
                      <p className="text-xs text-slate-500 mt-0.5">Translate to Arabic</p>
                    </div>
                  </div>
                  <div className="w-[50px] h-[28px] bg-slate-200 rounded-full relative cursor-pointer transition-colors shadow-inner">
                    <div className="w-[24px] h-[24px] bg-white rounded-full absolute left-[2px] top-[2px] shadow-sm"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 text-[#148F85] rounded-full flex items-center justify-center shrink-0">
                      <Volume2 size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Voice Assistant</p>
                      <p className="text-xs text-slate-500 mt-0.5">Read questions aloud</p>
                    </div>
                  </div>
                  <div className="w-[50px] h-[28px] bg-[#148F85] rounded-full relative cursor-pointer transition-colors shadow-inner">
                    <div className="w-[24px] h-[24px] bg-white rounded-full absolute right-[2px] top-[2px] shadow-sm"></div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Hero Card */}
        <div className="px-5 mt-2">
          <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 relative overflow-hidden">
            {/* Soft decorative background shape */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#148F85] opacity-[0.04] rounded-full blur-3xl"></div>
            <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-blue-500 opacity-[0.03] rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <Badge className="bg-[#148F85]/10 text-[#148F85] hover:bg-[#148F85]/10 border-none font-bold px-3 py-1 rounded-full text-xs shadow-none tracking-wide">
                  Smart Default
                </Badge>
              </div>
              
              <h2 className="text-[1.8rem] font-bold leading-tight mb-3 text-slate-900 tracking-tight">Today's Focus</h2>
              <p className="text-slate-500 text-[15px] mb-8 leading-relaxed max-w-[250px]">
                A mixed review of all specialties, tailored to your recent weak areas.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                <div className="bg-[#FAFAFA] border border-slate-100 px-3.5 py-2 rounded-xl text-[13px] font-bold text-slate-600 flex items-center gap-2 shadow-sm">
                  <Brain size={15} className="text-purple-500" strokeWidth={2.5} /> Mixed
                </div>
                <div className="bg-[#FAFAFA] border border-slate-100 px-3.5 py-2 rounded-xl text-[13px] font-bold text-slate-600 flex items-center gap-2 shadow-sm">
                  <Activity size={15} className="text-amber-500" strokeWidth={2.5} /> Medium
                </div>
                <div className="bg-[#FAFAFA] border border-slate-100 px-3.5 py-2 rounded-xl text-[13px] font-bold text-slate-600 flex items-center gap-2 shadow-sm">
                  <FileText size={15} className="text-blue-500" strokeWidth={2.5} /> 10 Qs
                </div>
              </div>
              
              <Button className="w-full h-14 bg-[#148F85] hover:bg-[#0F766E] text-white rounded-[1.25rem] text-[17px] font-bold shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                <Play fill="currentColor" size={20} />
                Start practicing
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full h-[52px] mt-3 rounded-[1.25rem] border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 bg-white">
                    Customise session
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-[2rem] max-h-[88vh] border-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col p-0">
                  <SheetHeader className="mb-2 pt-6 px-6 shrink-0">
                    <SheetTitle className="text-xl font-bold">Customise Session</SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4 [&::-webkit-scrollbar]:hidden space-y-8">
                    {/* Specialty */}
                    <div>
                      <label className="text-[15px] font-bold text-slate-900 mb-3.5 block">Medical Specialty</label>
                      <div className="flex flex-wrap gap-2.5">
                        {['Mixed', 'Cardiology', 'Respiratory', 'Neurology', 'Paediatrics', 'Psychiatry', 'Renal', 'Gastroenterology'].map(s => (
                          <div 
                            key={s} 
                            onClick={() => setSelectedSpecialty(s.toLowerCase())}
                            className={`px-4 py-2.5 rounded-[1rem] text-[14px] font-bold border cursor-pointer transition-all ${
                              selectedSpecialty === s.toLowerCase() 
                                ? 'bg-[#148F85] text-white border-[#148F85] shadow-md shadow-teal-500/20' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="text-[15px] font-bold text-slate-900 mb-3.5 block">Difficulty Level</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Easy', 'Medium', 'Hard'].map(d => (
                          <div 
                            key={d} 
                            onClick={() => setSelectedDifficulty(d.toLowerCase())}
                            className={`flex justify-center items-center h-[52px] rounded-[1rem] text-[14px] font-bold border cursor-pointer transition-all ${
                              selectedDifficulty === d.toLowerCase() 
                                ? 'bg-[#148F85] text-white border-[#148F85] shadow-md shadow-teal-500/20' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Mode */}
                    <div>
                      <label className="text-[15px] font-bold text-slate-900 mb-3.5 block">Practice Mode</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'practice', label: 'Practice', icon: <BookOpen size={18} strokeWidth={2.5} /> },
                          { id: 'timed', label: 'Timed', icon: <Clock size={18} strokeWidth={2.5} /> },
                          { id: 'unlimited', label: 'Endless', icon: <InfinityIcon size={18} strokeWidth={2.5} /> }
                        ].map(m => (
                          <div 
                            key={m.id} 
                            onClick={() => setSelectedMode(m.id)}
                            className={`flex flex-col justify-center items-center h-[72px] rounded-[1rem] text-[13px] font-bold border cursor-pointer transition-all gap-1.5 ${
                              selectedMode === m.id 
                                ? 'bg-[#148F85] text-white border-[#148F85] shadow-md shadow-teal-500/20' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {m.icon}
                            {m.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Questions */}
                    <div>
                      <label className="text-[15px] font-bold text-slate-900 mb-3.5 block">Number of Questions</label>
                      <div className="grid grid-cols-4 gap-3">
                        {[5, 10, 20, 50].map(q => (
                          <div 
                            key={q} 
                            onClick={() => setQuestionCount(q)}
                            className={`flex justify-center items-center h-[52px] rounded-[1rem] text-[14px] font-bold border cursor-pointer transition-all ${
                              questionCount === q 
                                ? 'bg-[#148F85] text-white border-[#148F85] shadow-md shadow-teal-500/20' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Fixed bottom button in sheet */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-white/90">
                    <Button className="w-full h-14 bg-[#148F85] hover:bg-[#0F766E] text-white rounded-[1.25rem] text-[17px] font-bold shadow-lg shadow-teal-500/25">
                      Apply & Start
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Continue Section */}
        <div className="px-5 mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-bold text-slate-900">Pick up where you left off</h3>
          </div>
          
          <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-[#148F85]/40 hover:shadow-md transition-all active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[1rem] bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <HeartPulse size={26} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[15px] mb-1">Cardiology</h4>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[62%] h-full bg-rose-500 rounded-full"></div>
                  </div>
                  <span className="text-[13px] font-bold text-slate-400">62% • 12 due</span>
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <ChevronRight size={18} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Recommended Specialties */}
        <div className="mt-10 mb-8">
          <div className="px-6 flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-bold text-slate-900">Recommended for you</h3>
          </div>
          
          <div className="flex overflow-x-auto px-5 gap-3.5 pb-4 [&::-webkit-scrollbar]:hidden">
            <div className="flex-shrink-0 w-[140px] bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#148F85]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 mb-3.5">
                <LungsIcon size={24} />
              </div>
              <h4 className="font-bold text-[14px] text-slate-900">Respiratory</h4>
              <p className="text-[12px] text-slate-400 mt-1 font-medium">Needs work</p>
            </div>
            
            <div className="flex-shrink-0 w-[140px] bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#148F85]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-3.5">
                <Brain size={24} strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-[14px] text-slate-900">Neurology</h4>
              <p className="text-[12px] text-slate-400 mt-1 font-medium">45% accuracy</p>
            </div>
            
            <div className="flex-shrink-0 w-[140px] bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#148F85]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-3.5">
                <Activity size={24} strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-[14px] text-slate-900">Gastro</h4>
              <p className="text-[12px] text-slate-400 mt-1 font-medium">20 Qs pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-white border-t border-slate-100 flex justify-between items-center px-6 pb-6 pt-3 z-50">
        <div className="flex flex-col items-center justify-center gap-1.5 text-[#148F85] w-16 cursor-pointer">
          <div className="bg-teal-50 w-12 h-8 rounded-full flex items-center justify-center">
            <Home size={22} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors w-16 cursor-pointer">
          <div className="w-12 h-8 flex items-center justify-center">
            <BarChart2 size={22} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-bold">Progress</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors w-16 cursor-pointer">
          <div className="w-12 h-8 flex items-center justify-center">
            <Bookmark size={22} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-bold">Saved</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors w-16 cursor-pointer">
          <div className="w-12 h-8 flex items-center justify-center">
            <User size={22} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-bold">Profile</span>
        </div>
      </div>
    </div>
  );
}
