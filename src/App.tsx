import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import Splash from "@/pages/Splash";
import Onboarding from "@/pages/Onboarding";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Tasks from "@/pages/Tasks";
import TaskDetail from "@/pages/TaskDetail";
import CreateCampaign from "@/pages/CreateCampaign";
import MySubmissions from "@/pages/MySubmissions";
import ReviewSubmissions from "@/pages/ReviewSubmissions";
import WalletPage from "@/pages/WalletPage";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import SettingsPage from "@/pages/SettingsPage";
import SecurityPage from "@/pages/SecurityPage";
import PoliciesPage from "@/pages/PoliciesPage";
import DeveloperPage from "@/pages/DeveloperPage";
import BuyCredits from "@/pages/BuyCredits";
import NotFound from "@/pages/NotFound";
import { useRef } from "react";

const queryClient = new QueryClient();

const navPages = ["/home", "/tasks", "/create-campaign", "/wallet", "/profile"];
const navOrder: Record<string, number> = {
  "/home": 0,
  "/create-campaign": 1,
  "/tasks": 2,
  "/wallet": 3,
  "/profile": 4,
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
  }),
};

const pageTransition = {
  type: "tween" as const,
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.25,
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const isNavPage = navPages.includes(location.pathname);
  const wasNavPage = navPages.includes(prevPathRef.current);

  // Determine swipe direction based on nav order
  let direction = 0;
  if (isNavPage && wasNavPage) {
    const cur = navOrder[location.pathname] ?? 0;
    const prev = navOrder[prevPathRef.current] ?? 0;
    direction = cur > prev ? 1 : cur < prev ? -1 : 0;
  }

  // Update ref after calculating direction
  if (prevPathRef.current !== location.pathname) {
    prevPathRef.current = location.pathname;
  }

  const shouldAnimate = isNavPage;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={shouldAnimate ? pageVariants : undefined}
        initial={shouldAnimate ? "enter" : false}
        animate="center"
        exit={shouldAnimate ? "exit" : undefined}
        transition={pageTransition}
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/task/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
          <Route path="/create-campaign" element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} />
          <Route path="/my-submissions" element={<ProtectedRoute><MySubmissions /></ProtectedRoute>} />
          <Route path="/review-submissions" element={<ProtectedRoute><ReviewSubmissions /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
          <Route path="/policies" element={<ProtectedRoute><PoliciesPage /></ProtectedRoute>} />
          <Route path="/developer" element={<ProtectedRoute><DeveloperPage /></ProtectedRoute>} />
          <Route path="/buy-credits" element={<ProtectedRoute><BuyCredits /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AppLayout = () => {
  const location = useLocation();
  const hideNav = ["/", "/onboarding", "/auth"].includes(location.pathname);

  return (
    <>
      <AnimatedRoutes />
      {!hideNav && <BottomNav />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </NotificationProvider>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
