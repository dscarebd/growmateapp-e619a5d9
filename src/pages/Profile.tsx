import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Copy, CheckCircle2, Megaphone, Coins, Shield, Settings, LogOut, ChevronRight, FileText, Code2, Users, Gift, Share2, MessageCircle, Send } from "lucide-react";
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

  const shareText = user ? `Use my referral code ${user.referral_code} to sign up and we both earn rewards! ${window.location.origin}/auth` : "";

  const shareCode = async () => {
    if (!user) return;
    if (navigator.share) {
      try { await navigator.share({ title: "Join me on BoostHub!", text: shareText }); } catch {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + "/auth")}&text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + "/auth")}&quote=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
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
            <div className="flex justify-center gap-3 mt-3">
              <button onClick={shareWhatsApp} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1da851] text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </button>
              <button onClick={shareTelegram} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0088cc] hover:bg-[#006fa1] text-white transition-colors">
                <Send className="h-5 w-5" />
              </button>
              <button onClick={shareFacebook} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] hover:bg-[#1565c0] text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button onClick={shareTwitter} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#000000] hover:bg-[#333333] text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>
              <button onClick={shareCode} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/70 text-foreground transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
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
