import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Copy, CheckCircle2, Award, Megaphone, Coins, Shield, Settings, LogOut, ChevronRight, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { user, credits, setIsAuthenticated } = useApp();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { icon: CheckCircle2, label: "Tasks Done", value: user.tasksCompleted, color: "text-success" },
    { icon: Megaphone, label: "Campaigns", value: user.campaignsRun, color: "text-primary" },
    { icon: Coins, label: "Total Earned", value: user.totalEarned, color: "text-warning" },
  ];

  const menuItems = [
    { icon: Settings, label: "Settings", action: () => {} },
    { icon: Shield, label: "Security", action: () => {} },
    { icon: Award, label: "Admin Panel", action: () => navigate("/admin") },
  ];

  const darkModeRow = (
    <div className="flex w-full items-center gap-3 rounded-xl p-3.5">
      <Moon className="h-5 w-5 text-muted-foreground" />
      <span className="flex-1 text-left text-sm font-medium text-foreground">Dark Mode</span>
      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-8 pt-12 rounded-b-3xl">
        <div className="flex items-center gap-4 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">{user.name}</h1>
            <p className="text-sm text-primary-foreground/70">{user.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Shield className="h-3 w-3 text-primary-foreground/70" />
              <span className="text-xs text-primary-foreground/70">Trust Score: {user.trustScore}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 animate-fade-in-up">
          {stats.map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="p-3 text-center">
                <s.icon className={cn("h-5 w-5 mx-auto mb-1", s.color)} />
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Referral */}
        <Card className="border-border">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Invite Friends, Earn Credits</h3>
            <p className="text-xs text-muted-foreground mb-3">Share your code and earn 50 credits per referral</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl bg-muted px-4 py-2.5 text-sm font-mono font-bold text-foreground">{user.referralCode}</div>
              <Button size="sm" variant="outline" className="rounded-xl h-10 px-3" onClick={copyCode}>
                {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu */}
        <div className="space-y-1">
          {darkModeRow}
          {menuItems.map(item => (
            <button key={item.label} onClick={item.action} className="flex w-full items-center gap-3 rounded-xl p-3.5 hover:bg-muted transition-colors">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
          <button onClick={() => { setIsAuthenticated(false); navigate("/", { replace: true }); }} className="flex w-full items-center gap-3 rounded-xl p-3.5 hover:bg-destructive/10 transition-colors">
            <LogOut className="h-5 w-5 text-destructive" />
            <span className="flex-1 text-left text-sm font-medium text-destructive">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
