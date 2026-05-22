import React, { useState } from "react";
import { 
  Flame, Calendar, Activity, CheckCircle2, Target, TrendingUp, Play, Plus, 
  Settings2, ChevronRight, Home, BarChart2, Bookmark, User, Volume2, Globe, Clock, List
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProgressDashboard() {
  const [customSheetOpen, setCustomSheetOpen] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[402px] mx-auto bg-slate-50 relative overflow-hidden font-sans">
      {/* Header Band */}
      <div className="bg-[#0A2540] text-white pt-12 pb-24 px-6 rounded-b-[2rem] shadow-sm flex-shrink-0 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hi, Dr. Sam 👋</h1>
            <p className="text-blue-200 text-sm mt-1">Ready for today's practice?</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-800 border-2 border-blue-400 flex items-center justify-center overflow-hidden">
            <User size={20} className="text-blue-100" />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/30 px-3 py-1.5 flex items-center gap-1.5 rounded-full">
            <Flame size={14} className="fill-orange-400" />
            <span className="font-semibold">12-day streak</span>
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30 px-3 py-1.5 flex items-center gap-1.5 rounded-full">
            <Calendar size={14} />
            <span className="font-semibold">PLAB 1 in 47 days</span>
          </Badge>
        </div>
      </div>

      {/* Main Content Area */}
      <ScrollArea className="flex-1 -mt-16 px-5 relative z-20 pb-20">
        {/* Hero Stats Card */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl mb-6 bg-white overflow-hidden">
          <CardContent className="p-0">
            <div className="p-5 border-b border-slate-100 flex justify-between items-end">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <Activity size={14} /> Weekly Accuracy
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold text-slate-900">76%</h2>
                  <span className="text-xs font-medium text-emerald-600 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" /> +4%
                  </span>
                </div>
              </div>
              {/* Fake Sparkline */}
              <div className="flex items-end gap-1.5 h-10">
                {[40, 55, 45, 60, 72, 65, 76].map((h, i) => (
                  <div key={i} className={`w-2 rounded-t-sm ${i === 6 ? 'bg-blue-600' : 'bg-blue-100'}`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-100 bg-slate-50/50">
              <div className="p-4 flex flex-col justify-center items-center text-center">
                <span className="text-xl font-semibold text-slate-800">1,248</span>
                <span className="text-xs text-slate-500 font-medium">Questions Done</span>
              </div>
              <div className="p-4 flex flex-col justify-center items-center text-center">
                <span className="text-xl font-semibold text-slate-800">14</span>
                <span className="text-xs text-slate-500 font-medium">Mock Exams</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Your Plan */}
        <div className="mb-4 flex justify-between items-center px-1">
          <h3 className="text-lg font-bold text-slate-900">Today's Plan</h3>
          <Button variant="ghost" size="sm" className="text-blue-600 h-8 px-2 text-xs font-semibold">View All</Button>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {/* Card 1: Weak area focus */}
          <Card className="border-slate-200/60 shadow-sm rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
            <CardContent className="p-0">
              <div className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <Target size={24} className="text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-1.5 h-4 bg-rose-50 border-rose-200 text-rose-600">Weak Area</Badge>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-[15px] truncate">Cardiology Focus</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center"><List size={12} className="mr-1" /> 10 Qs</span>
                    <span className="flex items-center"><Clock size={12} className="mr-1" /> ~12 min</span>
                  </p>
                </div>
                <Button size="icon" className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 flex-shrink-0 shadow-sm shadow-blue-200">
                  <Play size={18} className="fill-white" />
                </Button>
              </div>
              <div className="px-4 pb-3 pt-0">
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 text-right font-medium">42% average accuracy</p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Mixed timed sim */}
          <Card className="border-slate-200/60 shadow-sm rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 text-[15px] truncate">Mixed Timed Sim</h4>
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center"><List size={12} className="mr-1" /> 20 Qs</span>
                  <span className="flex items-center"><TrendingUp size={12} className="mr-1" /> Medium</span>
                </p>
              </div>
              <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 flex-shrink-0">
                <Play size={18} className="ml-0.5" />
              </Button>
            </CardContent>
          </Card>

          {/* Card 3: Another subject */}
          <Card className="border-slate-200/60 shadow-sm rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Activity size={24} className="text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 text-[15px] truncate">Neurology Review</h4>
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center"><List size={12} className="mr-1" /> 15 Qs</span>
                  <span className="flex items-center"><CheckCircle2 size={12} className="mr-1" /> 68% Acc</span>
                </p>
              </div>
              <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 flex-shrink-0">
                <Play size={18} className="ml-0.5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Custom Session Button */}
        <Sheet open={customSheetOpen} onOpenChange={setCustomSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full h-14 rounded-xl border-dashed border-2 border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 mb-8 transition-all font-semibold flex gap-2">
              <Plus size={18} />
              Create Custom Session
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl sm:max-w-[402px] mx-auto p-0 flex flex-col bg-white">
            <div className="px-6 py-4 border-b border-slate-100 shrink-0 flex items-center justify-between">
              <div>
                <SheetTitle className="text-xl">Custom Session</SheetTitle>
                <SheetDescription className="text-xs mt-0.5">Configure your practice parameters</SheetDescription>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6 pb-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Specialty</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Mixed (All Specialties)</SelectItem>
                      <SelectItem value="cardio">Cardiology</SelectItem>
                      <SelectItem value="resp">Respiratory</SelectItem>
                      <SelectItem value="neuro">Neurology</SelectItem>
                      <SelectItem value="endo">Endocrinology</SelectItem>
                      <SelectItem value="gastro">Gastroenterology</SelectItem>
                      <SelectItem value="renal">Renal</SelectItem>
                      <SelectItem value="paeds">Paediatrics</SelectItem>
                      <SelectItem value="psych">Psychiatry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Mode</Label>
                  <Tabs defaultValue="practice" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-11 p-1 bg-slate-100 rounded-xl">
                      <TabsTrigger value="practice" className="rounded-lg text-sm font-semibold">Practice</TabsTrigger>
                      <TabsTrigger value="timed" className="rounded-lg text-sm font-semibold">Timed</TabsTrigger>
                      <TabsTrigger value="unlimited" className="rounded-lg text-sm font-semibold">Mock</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Difficulty</Label>
                    <Select defaultValue="mixed">
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mixed">Mixed</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Questions</Label>
                    <Select defaultValue="20">
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
                        <SelectValue placeholder="Count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Qs</SelectItem>
                        <SelectItem value="10">10 Qs</SelectItem>
                        <SelectItem value="20">20 Qs</SelectItem>
                        <SelectItem value="50">50 Qs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100 my-2"></div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                    <Settings2 size={16} /> Advanced Controls
                  </Label>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col gap-1">
                      <Label className="text-sm font-semibold flex items-center gap-2"><Globe size={16} className="text-slate-500" /> Translation</Label>
                      <span className="text-xs text-slate-500">Translate questions to local language</span>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col gap-1">
                      <Label className="text-sm font-semibold flex items-center gap-2"><Volume2 size={16} className="text-slate-500" /> Text-to-Speech</Label>
                      <span className="text-xs text-slate-500">Read questions aloud automatically</span>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 pb-safe">
              <Button className="w-full h-14 rounded-xl text-base font-bold bg-[#0A2540] hover:bg-[#113A64] text-white shadow-lg shadow-blue-900/20" onClick={() => setCustomSheetOpen(false)}>
                Start Custom Session
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex justify-around items-center px-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-30">
        <button className="flex flex-col items-center justify-center gap-1 text-blue-600 w-16">
          <Home size={22} className="fill-blue-600/20" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 w-16">
          <BarChart2 size={22} />
          <span className="text-[10px] font-medium">Progress</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 w-16">
          <Bookmark size={22} />
          <span className="text-[10px] font-medium">Saved</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 w-16">
          <User size={22} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}
