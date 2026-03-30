import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon, TwitterIcon, TelegramIcon } from "@/components/PlatformIcons";

const platformIcons: Record<string, React.ReactNode> = {
  youtube: <YouTubeIcon className="h-5 w-5" />,
  instagram: <InstagramIcon className="h-5 w-5" />,
  tiktok: <TikTokIcon className="h-5 w-5" />,
  facebook: <FacebookIcon className="h-5 w-5" />,
  twitter: <TwitterIcon className="h-5 w-5" />,
  telegram: <TelegramIcon className="h-5 w-5" />,
};

type Submission = {
  id: string;
  task_id: string;
  status: string;
  proof_text: string;
  proof_images: string[];
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string;
  task_title: string;
  task_platform: string;
  task_reward: number;
  task_action: string;
};

type FilterStatus = "all" | "pending" | "approved" | "rejected";

const MySubmissions = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const fetchSubmissions = useCallback(async () => {
    if (!authUser) return;
    const { data: subs } = await supabase
      .from("task_submissions")
      .select("*")
      .eq("user_id", authUser.id)
      .order("submitted_at", { ascending: false });

    if (!subs || subs.length === 0) { setSubmissions([]); setLoading(false); return; }

    const taskIds = [...new Set(subs.map((s: any) => s.task_id))];
    const { data: tasks } = await supabase.from("tasks").select("id, title, platform, reward, action").in("id", taskIds);
    const taskMap = Object.fromEntries((tasks || []).map(t => [t.id, t]));

    setSubmissions(subs.map((s: any) => ({
      ...s,
      task_title: taskMap[s.task_id]?.title || "Unknown Task",
      task_platform: taskMap[s.task_id]?.platform || "youtube",
      task_reward: taskMap[s.task_id]?.reward || 0,
      task_action: taskMap[s.task_id]?.action || "",
    })));
    setLoading(false);
  }, [authUser]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const filtered = filter === "all" ? submissions : submissions.filter(s => s.status === filter);

  const counts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
  };

  const filters: { key: FilterStatus; label: string; color: string }[] = [
    { key: "all", label: "All", color: "" },
    { key: "pending", label: "Pending", color: "text-warning" },
    { key: "approved", label: "Approved", color: "text-success" },
    { key: "rejected", label: "Rejected", color: "text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-primary-foreground/80 text-sm mb-3">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-primary-foreground">My Submissions</h1>
        <p className="text-sm text-primary-foreground/70 mt-1">{submissions.length} total submissions</p>
      </div>

      {/* Filter tabs */}
      <div className="px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all border",
                filter === f.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border"
              )}
            >
              {f.label}
              <span className={cn("text-[10px] font-bold", filter === f.key ? "text-primary-foreground/80" : f.color)}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-muted-foreground text-sm">Loading submissions...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-sm text-muted-foreground">
              {filter === "all" ? "No submissions yet. Start completing tasks!" : `No ${filter} submissions.`}
            </p>
            {filter === "all" && (
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate("/tasks")}>
                Browse Tasks
              </Button>
            )}
          </div>
        ) : (
          filtered.map((sub, i) => (
            <Card
              key={sub.id}
              className={cn(
                "border-border animate-fade-in-up overflow-hidden cursor-pointer",
                sub.status === "approved" && "border-success/30",
                sub.status === "rejected" && "border-destructive/30",
                sub.status === "pending" && "border-warning/30"
              )}
              style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => navigate(`/task/${sub.task_id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{platformIcons[sub.task_platform]}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{sub.task_title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {sub.status === "pending" && (
                        <span className="flex items-center gap-1 text-[11px] text-warning font-semibold">
                          <Clock className="h-3 w-3" /> Pending Review
                        </span>
                      )}
                      {sub.status === "approved" && (
                        <span className="flex items-center gap-1 text-[11px] text-success font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Approved
                        </span>
                      )}
                      {sub.status === "rejected" && (
                        <span className="flex items-center gap-1 text-[11px] text-destructive font-semibold">
                          <XCircle className="h-3 w-3" /> Rejected
                        </span>
                      )}
                    </div>
                    {sub.status === "rejected" && sub.rejection_reason && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                        Reason: {sub.rejection_reason}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      {new Date(sub.submitted_at).toLocaleDateString()} · {sub.task_action}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-sm font-bold", sub.status === "approved" ? "text-success" : "text-primary")}>
                      {sub.status === "approved" ? "+" : ""}{sub.task_reward}
                    </p>
                    <p className="text-[10px] text-muted-foreground">credits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MySubmissions;
