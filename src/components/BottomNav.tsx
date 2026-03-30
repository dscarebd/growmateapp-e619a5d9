import { Home, ListTodo, Megaphone, Wallet, User, TrendingUp, Users, Banknote, CreditCard, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Megaphone, label: "Campaign", path: "/create-campaign" },
  { icon: ListTodo, label: "", path: "/tasks", isCenter: true },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
  { icon: User, label: "Profile", path: "/profile" },
];

const adminNavItems = [
  { icon: TrendingUp, label: "Overview", tab: "overview" },
  { icon: Users, label: "Users", tab: "users" },
  { icon: Megaphone, label: "", tab: "campaigns", isCenter: true },
  { icon: Banknote, label: "Withdraw", tab: "withdrawals" },
  { icon: CreditCard, label: "Payments", tab: "payments" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tapped, setTapped] = useState<string | null>(null);
  const isAdmin = location.pathname === "/admin";
  const activeTab = searchParams.get("tab") || "overview";

  const handleTap = useCallback((path: string) => {
    if (navigator.vibrate) navigator.vibrate(8);
    setTapped(path);
    setTimeout(() => setTapped(null), 350);
    navigate(path);
  }, [navigate]);

  const handleAdminTap = useCallback((tab: string) => {
    if (navigator.vibrate) navigator.vibrate(8);
    setTapped(tab);
    setTimeout(() => setTapped(null), 350);
    navigate(`/admin?tab=${tab}`, { replace: true });
  }, [navigate]);

  if (isAdmin) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-card/80 backdrop-blur-2xl border-t border-border/50" />
        <div className="relative flex items-end justify-between px-0 pb-[env(safe-area-inset-bottom,0px)] max-w-lg mx-auto">
          {adminNavItems.map((item) => {
            const isActive = activeTab === item.tab;
            const isTapped = tapped === item.tab;

            if (item.isCenter) {
              return (
                <div key={item.tab} className="flex flex-col items-center -mt-6 w-[20%]">
                  <button
                    onClick={() => handleAdminTap(item.tab)}
                    className={cn(
                      "relative flex h-[56px] w-[56px] items-center justify-center rounded-[18px] shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.5)] transition-all duration-200 origin-center",
                      "bg-gradient-to-br from-primary to-[hsl(var(--gradient-end))]",
                      isActive && "shadow-[0_6px_32px_-4px_hsl(var(--primary)/0.6)]",
                      isTapped ? "scale-[0.88]" : isActive ? "scale-105" : "scale-100"
                    )}
                    style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                  >
                    <div className="absolute inset-[1px] rounded-[17px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <item.icon
                      className={cn(
                        "h-6 w-6 text-primary-foreground relative z-10 transition-transform duration-200",
                        isTapped && "scale-90"
                      )}
                      strokeWidth={2.2}
                      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                    />
                  </button>
                  <span className={cn(
                    "text-[10px] font-semibold text-primary mt-1 transition-all duration-200",
                    isTapped && "scale-90 opacity-70"
                  )}>Campaigns</span>
                </div>
              );
            }

            return (
              <button
                key={item.tab}
                onClick={() => handleAdminTap(item.tab)}
                className="flex flex-col items-center gap-[2px] pt-2.5 pb-1.5 w-[20%] group"
              >
                <div className={cn(
                  "relative flex items-center justify-center h-7 w-7 transition-all duration-200 origin-center",
                  isActive && !isTapped && "scale-110",
                  isTapped && "scale-[0.78]"
                )} style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
                  {isActive && (
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-primary animate-scale-in" />
                  )}
                  {isTapped && (
                    <div className="absolute inset-[-6px] rounded-full bg-primary/10 animate-[ping_0.35s_ease-out_forwards]" />
                  )}
                  <item.icon
                    className={cn(
                      "h-[22px] w-[22px] transition-all duration-200",
                      isActive ? "text-primary" : "text-muted-foreground",
                      isTapped && "text-primary"
                    )}
                    strokeWidth={isActive ? 2.4 : 1.8}
                    style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                  />
                </div>
                <span className={cn(
                  "text-[10px] transition-all duration-200 tracking-tight",
                  isActive ? "font-bold text-primary" : "font-medium text-muted-foreground",
                  isTapped && "scale-90 opacity-70 text-primary"
                )} style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-card/80 backdrop-blur-2xl border-t border-border/50" />

      <div className="relative flex items-end justify-between px-0 pb-[env(safe-area-inset-bottom,0px)] max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isTapped = tapped === item.path;

          if (item.isCenter) {
            return (
              <div key={item.path} className="flex flex-col items-center -mt-6 w-[20%]">
                <button
                  onClick={() => handleTap(item.path)}
                  className={cn(
                    "relative flex h-[56px] w-[56px] items-center justify-center rounded-[18px] shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.5)] transition-all duration-200 origin-center",
                    "bg-gradient-to-br from-primary to-[hsl(var(--gradient-end))]",
                    isActive && "shadow-[0_6px_32px_-4px_hsl(var(--primary)/0.6)]",
                    isTapped ? "scale-[0.88]" : isActive ? "scale-105" : "scale-100"
                  )}
                  style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                >
                  <div className="absolute inset-[1px] rounded-[17px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                  <item.icon
                    className={cn(
                      "h-6 w-6 text-primary-foreground relative z-10 transition-transform duration-200",
                      isTapped && "scale-90"
                    )}
                    strokeWidth={2.2}
                    style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                  />
                </button>
                <span className={cn(
                  "text-[10px] font-semibold text-primary mt-1 transition-all duration-200",
                  isTapped && "scale-90 opacity-70"
                )}>Tasks</span>
              </div>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => handleTap(item.path)}
              className="flex flex-col items-center gap-[2px] pt-2.5 pb-1.5 w-[20%] group"
            >
              <div className={cn(
                "relative flex items-center justify-center h-7 w-7 transition-all duration-200 origin-center",
                isActive && !isTapped && "scale-110",
                isTapped && "scale-[0.78]"
              )} style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
                {isActive && (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-primary animate-scale-in" />
                )}
                {/* Tap ripple */}
                {isTapped && (
                  <div className="absolute inset-[-6px] rounded-full bg-primary/10 animate-[ping_0.35s_ease-out_forwards]" />
                )}
                <item.icon
                  className={cn(
                    "h-[22px] w-[22px] transition-all duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground",
                    isTapped && "text-primary"
                  )}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                />
              </div>
              <span className={cn(
                "text-[10px] transition-all duration-200 tracking-tight",
                isActive
                  ? "font-bold text-primary"
                  : "font-medium text-muted-foreground",
                isTapped && "scale-90 opacity-70 text-primary"
              )} style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
