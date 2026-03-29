import { Home, ListTodo, Megaphone, Wallet, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Megaphone, label: "Campaign", path: "/create-campaign" },
  { icon: ListTodo, label: "", path: "/tasks", isCenter: true },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-card/80 backdrop-blur-2xl border-t border-border/50" />

      <div className="relative flex items-end justify-around px-1 pb-[env(safe-area-inset-bottom,0px)] max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.isCenter) {
            return (
              <div key={item.path} className="flex flex-col items-center -mt-6 px-1">
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "relative flex h-[56px] w-[56px] items-center justify-center rounded-[18px] shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.5)] transition-all duration-300 active:scale-90",
                    "bg-gradient-to-br from-primary to-[hsl(var(--gradient-end))]",
                    isActive && "shadow-[0_6px_32px_-4px_hsl(var(--primary)/0.6)] scale-105"
                  )}
                >
                  {/* Subtle inner highlight */}
                  <div className="absolute inset-[1px] rounded-[17px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                  <item.icon className="h-6 w-6 text-primary-foreground relative z-10" strokeWidth={2.2} />
                </button>
                <span className="text-[10px] font-semibold text-primary mt-1">Tasks</span>
              </div>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-[2px] pt-2.5 pb-1.5 px-3 min-w-[56px] group"
            >
              <div className={cn(
                "relative flex items-center justify-center h-7 w-7 transition-all duration-300",
                isActive && "scale-110"
              )}>
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-primary animate-scale-in" />
                )}
                <item.icon
                  className={cn(
                    "h-[22px] w-[22px] transition-all duration-300",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-active:text-foreground"
                  )}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
              </div>
              <span className={cn(
                "text-[10px] transition-all duration-300 tracking-tight",
                isActive
                  ? "font-bold text-primary"
                  : "font-medium text-muted-foreground group-active:text-foreground"
              )}>
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
