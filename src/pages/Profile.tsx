import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Copy, CheckCircle2, Megaphone, Coins, Shield, Settings, LogOut, ChevronRight, FileText, Code2, Users, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { user } = useApp();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [bonusesEarned, setBonusesEarned] = useState(0);
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (!authUser) return;
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("referred_by", authUser.id)
      .then(({ count }) => setReferralCount(count ?? 0));
    supabase.from("referral_bonuses").select("bonus_amount").eq("referrer_id", authUser.id)
      .then(({ data }) => setBonusesEarned(data?.reduce((s: number, r: any) => s + r.bonus_amount, 0) ?? 0));
  }, [authUser]);

  const copyCode = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  const stats = [
    { icon: CheckCircle2, label: "Tasks Done", value: user.tasks_completed, color: "text-success" },
    { icon: Megaphone, label: "Campaigns", value: user.campaigns_run, color: "text-primary" },
    { icon: Coins, label: "Total Earned", value: user.total_earned, color: "text-warning" },
  ];

  const menuItems = [
    { icon: Settings, label: "Settings", action: () => navigate("/settings") },
    { icon: Shield, label: "Security", action: () => navigate("/security") },
    { icon: FileText, label: "Policies", action: () => navigate("/policies") },
    { icon: Code2, label: "Developer", action: () => navigate("/developer") },
  ];

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
              <span className="text-xs text-primary-foreground/70">Trust Score: {user.trust_score}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4">
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

        <Card className="border-border">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Invite Friends, Earn Credits</h3>
            <p className="text-xs text-muted-foreground mb-3">Share your code and earn 50 credits when they withdraw or run a 500+ credit campaign</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl bg-muted px-4 py-2.5 text-sm font-mono font-bold text-foreground">{user.referral_code}</div>
              <Button size="sm" variant="outline" className="rounded-xl h-10 px-3" onClick={copyCode}>
                {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span><span className="font-semibold text-foreground">{referralCount}</span> referred</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Gift className="h-3.5 w-3.5 text-warning" />
                <span><span className="font-semibold text-foreground">{bonusesEarned}</span> bonus earned</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-1">
          {menuItems.map(item => (
            <button key={item.label} onClick={item.action} className="flex w-full items-center gap-3 rounded-xl p-3.5 hover:bg-muted transition-colors">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
          <button onClick={async () => { await signOut(); navigate("/", { replace: true }); }} className="flex w-full items-center gap-3 rounded-xl p-3.5 hover:bg-destructive/10 transition-colors">
            <LogOut className="h-5 w-5 text-destructive" />
            <span className="flex-1 text-left text-sm font-medium text-destructive">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
