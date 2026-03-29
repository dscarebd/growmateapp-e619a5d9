import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Coins, Megaphone, ShoppingCart, Flame, ArrowRight, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const platformIcons: Record<string, string> = {
  youtube: "🎬", instagram: "📸", tiktok: "🎵", facebook: "📘",
};

const Home = () => {
  const { credits, user, tasks, campaigns } = useApp();
  const navigate = useNavigate();
  const activeCampaigns = campaigns.filter(c => c.status === "active");
  const topTasks = [...tasks].sort((a, b) => b.reward - a.reward).slice(0, 3);

  const quickActions = [
    { icon: Coins, label: "Earn", path: "/tasks", color: "bg-primary/10 text-primary" },
    { icon: Megaphone, label: "Promote", path: "/create-campaign", color: "bg-secondary/10 text-secondary" },
    { icon: ShoppingCart, label: "Buy Credits", path: "/wallet", color: "bg-warning/10 text-warning" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary px-5 pb-8 pt-12 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/70 text-sm">Welcome back,</p>
            <h1 className="text-xl font-bold text-primary-foreground">{user.name}</h1>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
        <Card className="border-0 shadow-lg animate-fade-in">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Credits</p>
              <p className="text-3xl font-bold text-foreground animate-count-up">{credits.toLocaleString()}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
              <Coins className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-5 mt-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          {quickActions.map(a => (
            <button key={a.label} onClick={() => navigate(a.path)} className="hover-scale flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm border border-border">
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", a.color)}>
                <a.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-foreground">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Active Campaigns */}
        {activeCampaigns.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-foreground">Active Campaigns</h2>
              <button onClick={() => navigate("/wallet")} className="flex items-center gap-1 text-xs text-primary font-medium">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            {activeCampaigns.map(c => (
              <Card key={c.id} className="mb-2 hover-scale border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{platformIcons[c.platform]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${(c.completedActions / c.estimatedReach) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{c.completedActions}/{c.estimatedReach}</span>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        {/* High Reward Tasks */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-1">
              <Flame className="h-4 w-4 text-warning" /> Top Tasks
            </h2>
            <button onClick={() => navigate("/tasks")} className="flex items-center gap-1 text-xs text-primary font-medium">
              See all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {topTasks.map(t => (
              <Card key={t.id} className="hover-scale border-border" onClick={() => navigate("/tasks")}>
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-xl">{platformIcons[t.platform]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground truncate">{t.title}</p>
                      {t.isHighReward && <span className="text-[10px] bg-warning/15 text-warning font-bold px-1.5 py-0.5 rounded-full">🔥</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.advertiser}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">+{t.reward}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
