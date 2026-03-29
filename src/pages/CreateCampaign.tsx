import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, Platform, TaskAction } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon } from "@/components/PlatformIcons";

const platformOptions: { key: Platform; label: string; icon: ReactNode }[] = [
  { key: "youtube", label: "YouTube", icon: <YouTubeIcon className="h-7 w-7" /> },
  { key: "instagram", label: "Instagram", icon: <InstagramIcon className="h-7 w-7" /> },
  { key: "tiktok", label: "TikTok", icon: <TikTokIcon className="h-7 w-7" /> },
  { key: "facebook", label: "Facebook", icon: <FacebookIcon className="h-7 w-7" /> },
];

const actionOptions: { key: TaskAction; label: string }[] = [
  { key: "like", label: "Like" },
  { key: "follow", label: "Follow" },
  { key: "subscribe", label: "Subscribe" },
  { key: "share", label: "Share" },
  { key: "comment", label: "Comment" },
];

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { credits, createCampaign } = useApp();
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [action, setAction] = useState<TaskAction>("like");
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [reward, setReward] = useState("");
  const [done, setDone] = useState(false);

  const budgetNum = parseInt(budget) || 0;
  const rewardNum = parseInt(reward) || 1;
  const estimatedReach = rewardNum > 0 ? Math.floor(budgetNum / rewardNum) : 0;
  const canAfford = budgetNum <= credits && budgetNum > 0 && rewardNum > 0;

  const handleCreate = () => {
    createCampaign({ platform, action, link, title, totalBudget: budgetNum, rewardPerAction: rewardNum });
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-8 animate-scale-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 mb-4">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">Campaign Created!</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">Your campaign is now live and will start receiving engagements soon.</p>
        <Button className="gradient-primary text-primary-foreground rounded-xl h-12 px-8" onClick={() => navigate("/home")}>Back to Home</Button>
      </div>
    );
  }

  const steps = [
    // Step 0: Platform & Action
    <div key="0" className="space-y-6 animate-fade-in-up">
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">Select Platform</label>
        <div className="grid grid-cols-2 gap-3">
          {platformOptions.map(p => (
            <button key={p.key} onClick={() => setPlatform(p.key)} className={cn("flex items-center gap-2 rounded-xl p-4 border-2 transition-all", platform === p.key ? "border-primary bg-accent" : "border-border bg-card")}>
              {p.icon}
              <span className="text-sm font-semibold">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">Action Type</label>
        <div className="flex flex-wrap gap-2">
          {actionOptions.map(a => (
            <button key={a.key} onClick={() => setAction(a.key)} className={cn("rounded-full px-4 py-2 text-xs font-semibold border transition-all", action === a.key ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground")}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    // Step 1: Details
    <div key="1" className="space-y-4 animate-fade-in-up">
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Campaign Title</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Grow my channel" className="h-12 rounded-xl bg-muted/50 border-0" />
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Content Link</label>
        <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." className="h-12 rounded-xl bg-muted/50 border-0" />
      </div>
    </div>,
    // Step 2: Budget
    <div key="2" className="space-y-4 animate-fade-in-up">
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Total Budget (credits)</label>
        <Input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g., 500" className="h-12 rounded-xl bg-muted/50 border-0" />
        <p className="text-xs text-muted-foreground mt-1">Your balance: {credits} credits</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Reward per Action (credits)</label>
        <Input type="number" value={reward} onChange={e => setReward(e.target.value)} placeholder="e.g., 10" className="h-12 rounded-xl bg-muted/50 border-0" />
        <p className="text-xs text-muted-foreground mt-1">Higher reward = more visibility 🔥</p>
      </div>
      <Card className="border-border mt-4">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Estimated Reach</span><span className="font-bold text-foreground">{estimatedReach} actions</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Cost per action</span><span className="font-bold text-foreground">{rewardNum} credits</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total cost</span><span className="font-bold text-primary">{budgetNum} credits</span></div>
        </CardContent>
      </Card>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Create Campaign</h1>
      </div>
      <div className="flex gap-1.5 px-5 mb-6">
        {[0, 1, 2].map(i => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", i <= step ? "gradient-primary" : "bg-muted")} />
        ))}
      </div>
      <div className="px-5">
        {steps[step]}
      </div>
      <div className="fixed bottom-24 left-0 right-0 px-5 max-w-lg mx-auto">
        {step < 2 ? (
          <Button className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold gap-1.5" onClick={() => setStep(step + 1)}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold" disabled={!canAfford} onClick={handleCreate}>
            Launch Campaign — {budgetNum} credits
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;
