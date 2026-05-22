import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Menu, Stethoscope, Home, BookOpen, Users, GraduationCap, User, Brain, Calendar, UserCheck, Flag, Video, BarChart3, Trophy, Wifi, Route, MoreHorizontal, Accessibility, Globe, FileText, Zap, Building, Settings, ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";

interface NavigationProps {
  user?: { username: string; studyStreak: number } | null;
}

export function Navigation({ user }: NavigationProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, current: location === "/dashboard" },
    { name: "PLAB 1", href: "/plab1-new", icon: BookOpen, current: location === "/plab1-new" },
    { name: "Analytics", href: "/analytics", icon: BarChart3, current: location === "/analytics" },
    { name: "Adaptive", href: "/adaptive-learning", icon: Zap, current: location === "/adaptive-learning" },
    { name: "Spaced Learning", href: "/spaced-repetition", icon: Brain, current: location === "/spaced-repetition" },
    { name: "Study Tools", href: "/ai-study-tools", icon: Brain, current: location === "/ai-study-tools" },
    { name: "Smart Planner", href: "/smart-planner", icon: Calendar, current: location === "/smart-planner" },
    { name: "Clinical Guides", href: "/clinical-guides", icon: FileText, current: location === "/clinical-guides" },
    { name: "Leaderboards", href: "/leaderboard", icon: Trophy, current: location === "/leaderboard" },
    { name: "NHS Prep", href: "/nhs-prep", icon: GraduationCap, current: location === "/nhs-prep" },
    { name: "Placements", href: "/placements", icon: Building, current: location === "/placements" },
    { name: "Community", href: "/community", icon: Users, current: location === "/community" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <Logo size="lg" />
              </Link>
            </div>
            
            {/* Desktop Navigation Links - Reduced for landscape mobile */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3 2xl:space-x-4 overflow-x-auto">
              {navigation.slice(0, 5).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors text-xs lg:text-sm whitespace-nowrap px-2 lg:px-3 py-2 rounded-md ${
                    item.current
                      ? "text-blue-600 bg-blue-50 border border-blue-200"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* More Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium transition-colors text-xs lg:text-sm whitespace-nowrap px-2 lg:px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center gap-1"
                  >
                    More
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {navigation.slice(5).map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 w-full px-2 py-2 text-sm cursor-pointer ${
                          item.current
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:text-blue-600"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right Side - Simplified */}
            <div className="flex items-center space-x-2">
              {/* Notifications - Hidden on small screens */}
              <Button variant="ghost" size="sm" className="relative hidden lg:flex">
                <Bell className="w-5 h-5 text-gray-600 hover:text-medical-blue" />
                <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-deep-rose" />
              </Button>

              {/* Mobile Menu Trigger */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="md:hidden p-2 hover:bg-gray-100 rounded-md"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="w-6 h-6 text-gray-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[340px] h-full overflow-hidden bg-white/95 backdrop-blur-xl border-l-0 shadow-2xl">
                  <div className="flex flex-col h-full">
                    {/* Header - iPhone Style */}
                    <div className="flex items-center justify-between pb-6 pt-2 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-lg font-bold text-gray-900">BlueScrubsPrep</span>
                          <p className="text-xs text-gray-500">Medical Education</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Scrollable Navigation - iPhone Style */}
                    <div className="flex-1 overflow-y-auto py-4 space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center space-x-4 p-4 mx-2 rounded-2xl transition-all duration-200 ${
                            item.current
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[0.98]"
                              : "text-gray-700 hover:bg-gray-100/80 active:scale-[0.96]"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            item.current ? "bg-white/20" : "bg-gray-100"
                          }`}>
                            <item.icon className={`w-5 h-5 ${item.current ? "text-white" : "text-gray-600"}`} />
                          </div>
                          <span className="font-medium text-base">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Footer - iPhone Style */}
                    <div className="pt-4 pb-2 px-2">
                      <div className="bg-gray-50/80 rounded-2xl p-4 text-center">
                        <p className="text-sm font-medium text-gray-700">Premium Features</p>
                        <p className="text-xs text-gray-500 mt-1">5,528 authentic medical stations</p>
                        <p className="text-xs text-gray-500">39 language support</p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - iPhone Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 md:hidden z-40 shadow-lg">
        <div className="safe-area-pb">
          <div className="flex items-center justify-between px-1 py-1">
            {/* Essential Navigation Items */}
            <Link
              href="/dashboard"
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200 flex-1 ${
                location === "/dashboard"
                  ? "text-blue-600 bg-blue-100/80"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Home className={`w-5 h-5 mb-0.5 ${location === "/dashboard" ? "scale-110" : ""}`} />
              <span className="text-xs font-medium">Home</span>
            </Link>

            <Link
              href="/plab1-new"
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200 flex-1 ${
                location === "/plab1-new"
                  ? "text-blue-600 bg-blue-100/80"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BookOpen className={`w-5 h-5 mb-0.5 ${location === "/plab1-new" ? "scale-110" : ""}`} />
              <span className="text-xs font-medium">PLAB 1</span>
            </Link>

            <Link
              href="/plab2-osce"
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200 flex-1 ${
                location === "/plab2-osce"
                  ? "text-blue-600 bg-blue-100/80"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Video className={`w-5 h-5 mb-0.5 ${location === "/plab2-osce" ? "scale-110" : ""}`} />
              <span className="text-xs font-medium">PLAB 2</span>
            </Link>

            <Link
              href="/adaptive-learning"
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200 flex-1 ${
                location === "/adaptive-learning"
                  ? "text-blue-600 bg-blue-100/80"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Brain className={`w-5 h-5 mb-0.5 ${location === "/adaptive-learning" ? "scale-110" : ""}`} />
              <span className="text-xs font-medium">AI</span>
            </Link>

            <Link
              href="/more"
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200 flex-1 ${
                location === "/more"
                  ? "text-blue-600 bg-blue-100/80"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Settings className={`w-5 h-5 mb-0.5 ${location === "/more" ? "scale-110" : ""}`} />
              <span className="text-xs font-medium">More</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
