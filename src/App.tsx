import { Route, Routes } from "react-router-dom";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import Volunteer from "./pages/Volunteer";
import Quiz from "./pages/Quiz";
import About from "./pages/About";
import Library from "./pages/Library";
import SafeMap from "./pages/SafeMap";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Donate from "./pages/Donate";
import StudentGuide from "./pages/StudentGuide";
import DigitalAwareness from "./pages/DigitalAwareness";
import Partners from "./pages/Partners";
import CodeOfConduct from "./pages/CodeOfConduct";
import FAQ from "./pages/FAQ";
import KnowYourRights from "./pages/KnowYourRights";
import VolunteersShowcase from "./pages/VolunteersShowcase";
import Forum from "./pages/Forum";
import Install from "./pages/Install";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import WelcomeModal from "@/components/WelcomeModal";
import AIChatbot from "@/components/AIChatbot";
const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [pwaPromptDone, setPwaPromptDone] = useState(() => !!localStorage.getItem("pwa-install-dismissed"));
  const [showWelcome, setShowWelcome] = useState(false);

  const handlePwaDismiss = useCallback(() => {
    setPwaPromptDone(true);
    // Show welcome modal after PWA prompt is dismissed
    if (!localStorage.getItem("welcome-modal-seen")) {
      setTimeout(() => setShowWelcome(true), 300);
    }
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  // If PWA prompt already dismissed on mount, check welcome
  useEffect(() => {
    if (pwaPromptDone && !localStorage.getItem("welcome-modal-seen")) {
      setShowWelcome(true);
    }
  }, [pwaPromptDone]);

  return (
    <div className="min-h-screen flex flex-col font-cairo bg-background text-foreground overflow-x-hidden" dir="rtl">
      <Navbar />
      <main className="flex-grow pt-20 pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      {!pwaPromptDone && <PWAInstallPrompt onDismiss={handlePwaDismiss} />}
      {showWelcome && <WelcomeModal />}
      <AIChatbot />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/report" element={<Report />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activity/:id" element={<ActivityDetail />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/volunteers" element={<VolunteersShowcase />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/about" element={<About />} />
              <Route path="/library" element={<Library />} />
              <Route path="/safe-map" element={<SafeMap />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/student-guide" element={<StudentGuide />} />
              <Route path="/digital-awareness" element={<DigitalAwareness />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/code-of-conduct" element={<CodeOfConduct />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/know-your-rights" element={<KnowYourRights />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/install" element={<Install />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
