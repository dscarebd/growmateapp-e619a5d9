import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Zap } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();
  const { hasOnboarded, isAuthenticated } = useApp();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => {
        if (isAuthenticated) navigate("/home", { replace: true });
        else if (hasOnboarded) navigate("/auth", { replace: true });
        else navigate("/onboarding", { replace: true });
      }, 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, hasOnboarded, isAuthenticated]);

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center gradient-primary transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
      <div className="animate-scale-in flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
          <Zap className="h-10 w-10 text-primary-foreground" fill="currentColor" />
        </div>
        <h1 className="text-4xl font-bold text-primary-foreground tracking-tight">Boostly</h1>
        <p className="text-primary-foreground/70 text-sm font-medium">Grow your social presence</p>
      </div>
      <div className="absolute bottom-12 flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary-foreground/50 animate-pulse-soft" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>
    </div>
  );
};

export default Splash;
