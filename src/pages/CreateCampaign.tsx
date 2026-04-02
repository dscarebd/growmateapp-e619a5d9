import { useState, ReactNode } from "react";

import { useNavigate } from "react-router-dom";
import { useApp, Platform, TaskAction } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, Heart, UserPlus, Bell, Share2, MessageCircle, Repeat2, DoorOpen, Eye, Download, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon, TwitterIcon, TelegramIcon, AppDownloadIcon, WebsiteVisitIcon } from "@/components/PlatformIcons";

const platformOptions: { key: Platform; label: string; icon: ReactNode }[] = [
  { key: "youtube", label: "YouTube", icon: <YouTubeIcon className="h-7 w-7" /> },
  { key: "instagram", label: "Instagram", icon: <InstagramIcon className="h-7 w-7" /> },
  { key: "tiktok", label: "TikTok", icon: <TikTokIcon className="h-7 w-7" /> },
  { key: "facebook", label: "Facebook", icon: <FacebookIcon className="h-7 w-7" /> },
  { key: "twitter", label: "X (Twitter)", icon: <TwitterIcon className="h-7 w-7" /> },
  { key: "telegram", label: "Telegram", icon: <TelegramIcon className="h-7 w-7" /> },
  { key: "app_download", label: "APP Download", icon: <AppDownloadIcon className="h-7 w-7" /> },
  { key: "website_visit", label: "Website Visit", icon: <WebsiteVisitIcon className="h-7 w-7" /> },
];

const actionIcons: Record<string, ReactNode> = {
  like: <Heart className="h-4 w-4" />,
  follow: <UserPlus className="h-4 w-4" />,
  subscribe: <Bell className="h-4 w-4" />,
  comment: <MessageCircle className="h-4 w-4" />,
  share: <Share2 className="h-4 w-4" />,
  reply: <MessageCircle className="h-4 w-4" />,
  repost: <Repeat2 className="h-4 w-4" />,
  "join channel": <DoorOpen className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
  download: <Download className="h-4 w-4" />,
  visit: <Globe className="h-4 w-4" />,
};

const platformActions: Record<Platform, { key: TaskAction; label: string; icon: ReactNode }[]> = {
  youtube: [
    { key: "like", label: "Like", icon: actionIcons.like },
    { key: "subscribe", label: "Subscribe", icon: actionIcons.subscribe },
    { key: "comment", label: "Comment", icon: actionIcons.comment },
    { key: "share", label: "Share", icon: actionIcons.share },
    { key: "view", label: "View", icon: actionIcons.view },
  ],
  instagram: [
    { key: "like", label: "Like", icon: actionIcons.like },
    { key: "follow", label: "Follow", icon: actionIcons.follow },
    { key: "comment", label: "Comment", icon: actionIcons.comment },
    { key: "share", label: "Share", icon: actionIcons.share },
    { key: "view", label: "View", icon: actionIcons.view },
  ],
  tiktok: [
    { key: "like", label: "Like", icon: actionIcons.like },
    { key: "follow", label: "Follow", icon: actionIcons.follow },
    { key: "comment", label: "Comment", icon: actionIcons.comment },
    { key: "share", label: "Share", icon: actionIcons.share },
    { key: "view", label: "View", icon: actionIcons.view },
  ],
  facebook: [
    { key: "like", label: "Like", icon: actionIcons.like },
    { key: "follow", label: "Follow", icon: actionIcons.follow },
    { key: "comment", label: "Comment", icon: actionIcons.comment },
    { key: "share", label: "Share", icon: actionIcons.share },
    { key: "view", label: "View", icon: actionIcons.view },
  ],
  twitter: [
    { key: "like", label: "Like", icon: actionIcons.like },
    { key: "follow", label: "Follow", icon: actionIcons.follow },
    { key: "comment", label: "Reply", icon: actionIcons.reply },
    { key: "share", label: "Repost", icon: actionIcons.repost },
    { key: "view", label: "View", icon: actionIcons.view },
  ],
  telegram: [
    { key: "follow", label: "Join Channel", icon: actionIcons["join channel"] },
    { key: "comment", label: "Comment", icon: actionIcons.comment },
    { key: "share", label: "Share", icon: actionIcons.share },
  ],
  app_download: [
    { key: "view", label: "Download App", icon: actionIcons.download },
  ],
  website_visit: [
    { key: "view", label: "Visit Website", icon: actionIcons.visit },
  ],
};

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { credits, createCampaign } = useApp();
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [action, setAction] = useState<TaskAction>("like");

  const availableActions = platformActions[platform];

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    const newActions = platformActions[p];
    if (!newActions.some(a => a.key === action)) {
      setAction(newActions[0].key);
    }
  };
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [reward, setReward] = useState("");
  const [proofRequirements, setProofRequirements] = useState("");
  const [done, setDone] = useState(false);
  const [step1Touched, setStep1Touched] = useState(false);

  const isValidUrl = (url: string) => { try { const u = new URL(url); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; } };
  const titleError = step1Touched && title.trim() === "" ? "Title is required" : title.length > 100 ? "Title must be under 100 characters" : "";
  const linkError = step1Touched && link.trim() === "" ? "Link is required" : link.trim() !== "" && !isValidUrl(link.trim()) ? "Enter a valid URL (https://...)" : "";
  const step1Valid = title.trim() !== "" && title.length <= 100 && isValidUrl(link.trim());

  const budgetNum = parseFloat(budget) || 0;
  const rewardNum = parseFloat(reward) || 0;
  const estimatedReach = rewardNum > 0 ? Math.floor(budgetNum / rewardNum) : 0;
  const budgetError = budget !== "" && budgetNum <= 0 ? "Budget must be greater than 0" : budgetNum > credits ? "Exceeds your balance" : "";
  const rewardError = reward !== "" && rewardNum <= 0 ? "Reward must be greater than 0" : rewardNum > budgetNum && budgetNum > 0 ? "Reward exceeds budget" : "";
  const canAfford = budgetNum > 0 && rewardNum > 0 && budgetNum <= credits && rewardNum <= budgetNum;

  const handleCreate = () => {
    createCampaign({ platform, action, link, title, totalBudget: budgetNum, rewardPerAction: rewardNum, proofRequirements: proofRequirements.trim() });
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
            <button key={p.key} onClick={() => handlePlatformChange(p.key)} className={cn("flex items-center gap-2 rounded-xl p-4 border-2 transition-all", platform === p.key ? "border-primary bg-accent" : "border-border bg-card")}>
              {p.icon}
              <span className="text-sm font-semibold">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">Action Type</label>
        <div className="flex flex-col gap-2">
          {availableActions.map(a => (
            <button key={a.key} onClick={() => setAction(a.key)} className={cn("w-full rounded-full px-4 py-3 text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2", action === a.key ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground bg-card")}>
              {a.icon}
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    // Step 1: Details & Proof Requirements
    <div key="1" className="space-y-4 animate-fade-in-up">
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Campaign Title</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Grow my channel" maxLength={100} className={cn("h-12 rounded-xl bg-muted/50 border-0", titleError && "ring-2 ring-destructive")} />
        {titleError && <p className="text-xs text-destructive mt-1">{titleError}</p>}
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Content Link</label>
        <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." className={cn("h-12 rounded-xl bg-muted/50 border-0", linkError && "ring-2 ring-destructive")} />
        {linkError && <p className="text-xs text-destructive mt-1">{linkError}</p>}
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Proof Requirements</label>
        <Textarea
          value={proofRequirements}
          onChange={e => setProofRequirements(e.target.value)}
          placeholder="e.g., Take a screenshot showing you subscribed to the channel and include your username"
          className="min-h-[80px] rounded-xl bg-muted/50 border-0 text-sm"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1">Tell users what proof they need to submit for verification</p>
      </div>
    </div>,
    // Step 2: Budget
    <div key="2" className="space-y-4 animate-fade-in-up">
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Total Budget (credits)</label>
        <Input type="number" min="0.01" step="any" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g., 500" className={cn("h-12 rounded-xl bg-muted/50 border-0", budgetError && "ring-2 ring-destructive")} />
        {budgetError ? <p className="text-xs text-destructive mt-1">{budgetError}</p> : <p className="text-xs text-muted-foreground mt-1">Your balance: {credits} credits</p>}
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Reward per Action (credits)</label>
        <Input type="number" min="0.01" step="any" value={reward} onChange={e => setReward(e.target.value)} placeholder="e.g., 10" className={cn("h-12 rounded-xl bg-muted/50 border-0", rewardError && "ring-2 ring-destructive")} />
        {rewardError ? <p className="text-xs text-destructive mt-1">{rewardError}</p> : <p className="text-xs text-muted-foreground mt-1">Higher reward = more visibility 🔥</p>}
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
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <div className="mb-4">
          <h1 className="text-lg font-bold text-primary-foreground">Create Campaign</h1>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", i <= step ? "bg-primary-foreground" : "bg-white/20")} />
          ))}
        </div>
      </div>
      <div className="px-5">
        {steps[step]}
      </div>
      <div className="px-5 mt-6">
        {step < 2 ? (
          <Button className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold gap-1.5" disabled={step === 1 && !step1Valid} onClick={() => { if (step === 1) setStep1Touched(true); if (step === 0 || step1Valid) setStep(step + 1); }}>
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
