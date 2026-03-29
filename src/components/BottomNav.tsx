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
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0px)] max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="gradient-primary -mt-5 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
              >
                <item.icon className="h-7 w-7 text-primary-foreground" />
              </button>
            );
          }
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "animate-scale-in")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
