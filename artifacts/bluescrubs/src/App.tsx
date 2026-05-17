import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/hooks/useI18n";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Plab2Osce from "@/pages/plab2-osce";
import PLAB1New from "@/pages/plab1-new";
import UserFormatStations from "@/pages/user-format-stations";
import InteractiveFlashcards from "@/pages/interactive-flashcards";
import ClinicalGuides from "@/pages/clinical-guides";
import Leaderboards from "@/pages/leaderboards";
import Analytics from "@/pages/analytics";
import SpacedRepetition from "@/pages/spaced-repetition";
import Placements from "@/pages/placements";
import Premium from "@/pages/premium";
import AskAI from "@/pages/ask-ai";
import AIStudyTools from "@/pages/ai-study-tools";
import Community from "@/pages/community";
import Pricing from "@/pages/pricing";

import InteractivePatientPage from "@/pages/interactive-patient-page";
import PersonalisedPaths from "@/pages/personalised-paths";
import VideoOSCE from "@/pages/video-osce";
import More from "@/pages/more";
import AdaptiveLearning from "@/pages/adaptive-learning";
import SmartPlanner from "@/pages/smart-planner";
import CulturalTraining from "@/pages/cultural-training";
import Mentors from "@/pages/mentors";
import Gamification from "@/pages/gamification";
import InternationalExamsPage from "@/pages/international-exams";
import PLABIndependence from "@/pages/plab-independence";
import TranslationDashboard from "@/pages/translation-dashboard";
import ContentIndependence from "@/pages/content-independence";
import CompleteIndependence from "@/pages/complete-independence";
import HybridAIDashboard from "@/pages/hybrid-ai-dashboard";
import NotFound from "@/pages/not-found";

import LiveAnalytics from "@/pages/live-analytics";
import GenerationStatus from "@/pages/generation-status";
import CostCalculator from "@/pages/cost-calculator";
import HowTo from "@/pages/how-to";
import Security from "@/pages/security";
import Settings from "@/pages/settings";
import Team from "@/pages/team";

// Mock user for demo - in real app this would come from auth context
const DEMO_USER = {
  username: "Dr. Sarah Ahmed",
  studyStreak: 12
};

function Router() {
  return (
    <Switch>
      <Route path="/">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <PLAB1New />
          </div>
        </div>
      </Route>
      <Route path="/landing" component={Landing} />
      <Route path="/home">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Home />
          </div>
        </div>
      </Route>
      <Route path="/dashboard">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Dashboard />
          </div>
        </div>
      </Route>


      <Route path="/plab1">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <PLAB1New />
          </div>
        </div>
      </Route>
      <Route path="/plab1-new">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <PLAB1New />
          </div>
        </div>
      </Route>
      <Route path="/flashcards">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <InteractiveFlashcards />
          </div>
        </div>
      </Route>
      <Route path="/clinical-guides">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <ClinicalGuides />
          </div>
        </div>
      </Route>
      <Route path="/analytics/live">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <LiveAnalytics />
          </div>
        </div>
      </Route>

      <Route path="/leaderboards">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Leaderboards />
          </div>
        </div>
      </Route>
      <Route path="/plab2-osce">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Plab2Osce />
          </div>
        </div>
      </Route>
      <Route path="/user-format-stations">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <UserFormatStations />
          </div>
        </div>
      </Route>
      <Route path="/premium">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Premium />
          </div>
        </div>
      </Route>

      <Route path="/ask-ai">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <AskAI />
          </div>
          <Footer />
        </div>
      </Route>

      <Route path="/ai-study-tools">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <AIStudyTools />
          </div>
        </div>
      </Route>

      <Route path="/adaptive-learning">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <AdaptiveLearning />
          </div>
        </div>
      </Route>

      <Route path="/community">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Community />
          </div>
        </div>
      </Route>

      <Route path="/pricing">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Pricing />
          </div>
        </div>
      </Route>



      <Route path="/interactive-patient">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <InteractivePatientPage />
          </div>
        </div>
      </Route>

      <Route path="/personalized-paths">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <PersonalisedPaths />
          </div>
        </div>
      </Route>

      <Route path="/video-osce">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <VideoOSCE />
          </div>
        </div>
      </Route>

      <Route path="/more">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <More />
          </div>
        </div>
      </Route>



      <Route path="/smart-planner">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <SmartPlanner />
          </div>
        </div>
      </Route>

      <Route path="/cultural-training">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <CulturalTraining />
          </div>
        </div>
      </Route>

      <Route path="/mentors">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Mentors />
          </div>
        </div>
      </Route>

      <Route path="/gamification">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Gamification />
          </div>
        </div>
      </Route>

      <Route path="/international-exams">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <InternationalExamsPage />
          </div>
        </div>
      </Route>

      <Route path="/plab-independence">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <PLABIndependence />
          </div>
        </div>
      </Route>

      <Route path="/translation-dashboard">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <TranslationDashboard />
          </div>
        </div>
      </Route>

      <Route path="/content-independence">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <ContentIndependence />
          </div>
        </div>
      </Route>

      <Route path="/complete-independence">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <CompleteIndependence />
          </div>
        </div>
      </Route>

      <Route path="/hybrid-ai">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <HybridAIDashboard />
          </div>
        </div>
      </Route>

      <Route path="/leaderboard">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Leaderboards />
          </div>
        </div>
      </Route>

      <Route path="/analytics">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Analytics />
          </div>
        </div>
      </Route>

      <Route path="/spaced-repetition">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <SpacedRepetition />
          </div>
        </div>
      </Route>

      <Route path="/placements">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Placements />
          </div>
        </div>
      </Route>

      <Route path="/offline-mode">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Dashboard />
          </div>
        </div>
      </Route>

      <Route path="/generation">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <GenerationStatus />
          </div>
        </div>
      </Route>

      <Route path="/cost-calculator">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <CostCalculator />
          </div>
        </div>
      </Route>

      <Route path="/how-to">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <HowTo />
          </div>
        </div>
      </Route>

      <Route path="/security">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Security />
          </div>
        </div>
      </Route>

      <Route path="/settings">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Settings />
          </div>
        </div>
      </Route>

      <Route path="/team">
        <div className="flex flex-col min-h-screen">
          <Navigation user={DEMO_USER} />
          <div className="flex-1 pb-16 md:pb-0">
            <Team />
          </div>
        </div>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;