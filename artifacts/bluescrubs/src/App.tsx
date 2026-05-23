import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/hooks/useI18n";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { FeedbackWidget } from "@/components/feedback-widget";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { getBypassAuth } from "@/pages/login";

const Landing = lazy(() => import("@/pages/landing"));
const Home = lazy(() => import("@/pages/home"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Plab2Osce = lazy(() => import("@/pages/plab2-osce"));
const PLAB1New = lazy(() => import("@/pages/plab1-new"));
const UserFormatStations = lazy(() => import("@/pages/user-format-stations"));
const InteractiveFlashcards = lazy(() => import("@/pages/interactive-flashcards"));
const ClinicalGuides = lazy(() => import("@/pages/clinical-guides"));
const Leaderboards = lazy(() => import("@/pages/leaderboards"));
const Analytics = lazy(() => import("@/pages/analytics"));
const SpacedRepetition = lazy(() => import("@/pages/spaced-repetition"));
const Placements = lazy(() => import("@/pages/placements"));
const Premium = lazy(() => import("@/pages/premium"));
const AskAI = lazy(() => import("@/pages/ask-ai"));
const AIStudyTools = lazy(() => import("@/pages/ai-study-tools"));
const Community = lazy(() => import("@/pages/community"));
const Pricing = lazy(() => import("@/pages/pricing"));
const InteractivePatientPage = lazy(() => import("@/pages/interactive-patient-page"));
const PersonalisedPaths = lazy(() => import("@/pages/personalised-paths"));
const VideoOSCE = lazy(() => import("@/pages/video-osce"));
const More = lazy(() => import("@/pages/more"));
const AdaptiveLearning = lazy(() => import("@/pages/adaptive-learning"));
const SmartPlanner = lazy(() => import("@/pages/smart-planner"));
const CulturalTraining = lazy(() => import("@/pages/cultural-training"));
const Mentors = lazy(() => import("@/pages/mentors"));
const Gamification = lazy(() => import("@/pages/gamification"));
const InternationalExamsPage = lazy(() => import("@/pages/international-exams"));
const PLABIndependence = lazy(() => import("@/pages/plab-independence"));
const TranslationDashboard = lazy(() => import("@/pages/translation-dashboard"));
const ContentIndependence = lazy(() => import("@/pages/content-independence"));
const CompleteIndependence = lazy(() => import("@/pages/complete-independence"));
const HybridAIDashboard = lazy(() => import("@/pages/hybrid-ai-dashboard"));
const LiveAnalytics = lazy(() => import("@/pages/live-analytics"));
const GenerationStatus = lazy(() => import("@/pages/generation-status"));
const CostCalculator = lazy(() => import("@/pages/cost-calculator"));
const HowTo = lazy(() => import("@/pages/how-to"));
const Security = lazy(() => import("@/pages/security"));
const Settings = lazy(() => import("@/pages/settings"));
const Team = lazy(() => import("@/pages/team"));
const SpotDiagnosis = lazy(() => import("@/pages/spot-diagnosis"));
const LoginPage = lazy(() => import("@/pages/login"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

class ChunkErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Something went wrong loading this page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const bypass = getBypassAuth();

  useEffect(() => {
    import("@/pages/plab1-new");
    import("@/pages/dashboard");
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated && !bypass) {
    return (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    );
  }

  const navUser = {
    username: user?.firstName
      ? `${user.firstName} ${user.lastName ?? ""}`.trim()
      : (user?.username ?? user?.email ?? "Guest"),
    studyStreak: user?.studyStreak ?? 0,
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Home />
            </div>
          </div>
        </Route>
        <Route path="/landing" component={Landing} />
        <Route path="/home">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Home />
            </div>
          </div>
        </Route>
        <Route path="/dashboard">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Dashboard />
            </div>
          </div>
        </Route>

        <Route path="/plab1">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <PLAB1New />
            </div>
          </div>
        </Route>
        <Route path="/plab1-new">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <PLAB1New />
            </div>
          </div>
        </Route>
        <Route path="/flashcards">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <InteractiveFlashcards />
            </div>
          </div>
        </Route>
        <Route path="/clinical-guides">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <ClinicalGuides />
            </div>
          </div>
        </Route>
        <Route path="/analytics/live">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <LiveAnalytics />
            </div>
          </div>
        </Route>

        <Route path="/leaderboards">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Leaderboards />
            </div>
          </div>
        </Route>
        <Route path="/plab2-osce">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Plab2Osce />
            </div>
          </div>
        </Route>
        <Route path="/user-format-stations">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <UserFormatStations />
            </div>
          </div>
        </Route>
        <Route path="/premium">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Premium />
            </div>
          </div>
        </Route>

        <Route path="/ask-ai">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <AskAI />
            </div>
            <Footer />
          </div>
        </Route>

        <Route path="/ai-study-tools">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <AIStudyTools />
            </div>
          </div>
        </Route>

        <Route path="/adaptive-learning">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <AdaptiveLearning />
            </div>
          </div>
        </Route>

        <Route path="/community">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Community />
            </div>
          </div>
        </Route>

        <Route path="/pricing">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Pricing />
            </div>
          </div>
        </Route>

        <Route path="/interactive-patient">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <InteractivePatientPage />
            </div>
          </div>
        </Route>

        <Route path="/personalized-paths">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <PersonalisedPaths />
            </div>
          </div>
        </Route>

        <Route path="/video-osce">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <VideoOSCE />
            </div>
          </div>
        </Route>

        <Route path="/more">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <More />
            </div>
          </div>
        </Route>

        <Route path="/smart-planner">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <SmartPlanner />
            </div>
          </div>
        </Route>

        <Route path="/cultural-training">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <CulturalTraining />
            </div>
          </div>
        </Route>

        <Route path="/mentors">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Mentors />
            </div>
          </div>
        </Route>

        <Route path="/gamification">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Gamification />
            </div>
          </div>
        </Route>

        <Route path="/international-exams">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <InternationalExamsPage />
            </div>
          </div>
        </Route>

        <Route path="/plab-independence">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <PLABIndependence />
            </div>
          </div>
        </Route>

        <Route path="/translation-dashboard">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <TranslationDashboard />
            </div>
          </div>
        </Route>

        <Route path="/content-independence">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <ContentIndependence />
            </div>
          </div>
        </Route>

        <Route path="/complete-independence">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <CompleteIndependence />
            </div>
          </div>
        </Route>

        <Route path="/hybrid-ai">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <HybridAIDashboard />
            </div>
          </div>
        </Route>

        <Route path="/leaderboard">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Leaderboards />
            </div>
          </div>
        </Route>

        <Route path="/analytics">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Analytics />
            </div>
          </div>
        </Route>

        <Route path="/spaced-repetition">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <SpacedRepetition />
            </div>
          </div>
        </Route>

        <Route path="/placements">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Placements />
            </div>
          </div>
        </Route>

        <Route path="/offline-mode">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Dashboard />
            </div>
          </div>
        </Route>

        <Route path="/generation">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <GenerationStatus />
            </div>
          </div>
        </Route>

        <Route path="/cost-calculator">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <CostCalculator />
            </div>
          </div>
        </Route>

        <Route path="/how-to">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <HowTo />
            </div>
          </div>
        </Route>

        <Route path="/security">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Security />
            </div>
          </div>
        </Route>

        <Route path="/settings">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Settings />
            </div>
          </div>
        </Route>

        <Route path="/team">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <Team />
            </div>
          </div>
        </Route>

        <Route path="/spot-diagnosis">
          <div className="flex flex-col min-h-screen">
            <Navigation user={navUser} />
            <div className="flex-1 pb-16 md:pb-0">
              <SpotDiagnosis />
            </div>
          </div>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ChunkErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <FeedbackWidget />
          </TooltipProvider>
        </I18nProvider>
      </QueryClientProvider>
    </ChunkErrorBoundary>
  );
}

export default App;
