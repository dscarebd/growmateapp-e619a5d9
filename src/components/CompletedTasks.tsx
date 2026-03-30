import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ChevronDown, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as PlatformIcons from "@/components/PlatformIcons";
import { format } from "date-fns";

interface CompletedTask {
  id: string;
  task_id: string;
  submitted_at: string;
  reviewed_at: string | null;
  proof_text: string | null;
  proof_images: string[] | null;
  task: {
    title: string;
    platform: string;
    action: string;
    reward: number;
    link: string;
    description: string;
  } | null;
}

const PAGE_SIZE = 5;

const platformIconMap: Record<string, any> = {
  youtube: PlatformIcons.YouTubeIcon,
  instagram: PlatformIcons.InstagramIcon,
  tiktok: PlatformIcons.TikTokIcon,
  facebook: PlatformIcons.FacebookIcon,
  twitter: PlatformIcons.TwitterIcon,
  telegram: PlatformIcons.TelegramIcon,
};

const CompletedTasks = () => {
  const { user: authUser } = useAuth();
  const [tasks, setTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState<CompletedTask | null>(null);

  const fetchTasks = async (offset: number) => {
    if (!authUser) return [];
    const { data } = await supabase
      .from("task_submissions")
      .select("id, task_id, submitted_at, reviewed_at, proof_text, proof_images, task:tasks(title, platform, action, reward, link, description)")
      .eq("user_id", authUser.id)
      .eq("status", "approved" as any)
      .order("reviewed_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);
    return (data as any[]) ?? [];
  };

  useEffect(() => {
    if (!authUser) return;
    (async () => {
      setLoading(true);
      const { count } = await supabase
        .from("task_submissions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", authUser.id)
        .eq("status", "approved" as any);
      const data = await fetchTasks(0);
      setTasks(data);
      setHasMore(data.length < (count ?? 0));
      setLoading(false);
    })();
  }, [authUser]);

  const loadMore = async () => {
    setLoadingMore(true);
    const data = await fetchTasks(tasks.length);
    setTasks(prev => [...prev, ...data]);
    setHasMore(data.length === PAGE_SIZE);
    setLoadingMore(false);
  };

  const renderIcon = (platform: string, size = "h-4 w-4") => {
    const Icon = platformIconMap[platform];
    return Icon ? <Icon className={size} /> : null;
  };

  if (loading) {
    return (
      <Card className="border-border">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" /> Completed Tasks
          </h3>
          <p className="text-xs text-muted-foreground text-center py-4">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" /> Completed Tasks
          </h3>
          <p className="text-xs text-muted-foreground text-center py-4">No completed tasks yet. Start earning by completing tasks!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" /> Completed Tasks
            <span className="text-xs font-normal text-muted-foreground">({tasks.length}{hasMore ? "+" : ""})</span>
          </h3>
          <div className="space-y-2">
            {tasks.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelected(sub)}
                className="flex w-full items-center gap-3 rounded-xl bg-muted/50 p-3 text-left hover:bg-muted transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success shrink-0">
                  {renderIcon(sub.task?.platform ?? "")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{sub.task?.title ?? "Unknown Task"}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {sub.task?.action} · {sub.reviewed_at ? format(new Date(sub.reviewed_at), "MMM d, yyyy") : ""}
                  </p>
                </div>
                <span className="text-xs font-bold text-success whitespace-nowrap">+{sub.task?.reward ?? 0}</span>
              </button>
            ))}
          </div>
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-xs text-muted-foreground"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
              {!loadingMore && <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="rounded-2xl max-w-[380px] p-0 gap-0 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              {/* Header */}
              <div className="gradient-primary p-4 rounded-t-2xl">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 shrink-0">
                      {renderIcon(selected.task?.platform ?? "", "h-5 w-5")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-base font-bold text-primary-foreground truncate">
                        {selected.task?.title ?? "Unknown Task"}
                      </DialogTitle>
                      <p className="text-xs text-primary-foreground/70 capitalize mt-0.5">
                        {selected.task?.platform} · {selected.task?.action}
                      </p>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              <div className="p-4 space-y-4">
                {/* Status & Reward */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                  </span>
                  <span className="text-lg font-bold text-success">+{selected.task?.reward ?? 0} credits</span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted p-3">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Submitted</p>
                    <p className="text-xs font-medium text-foreground">
                      {format(new Date(selected.submitted_at), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Approved</p>
                    <p className="text-xs font-medium text-foreground">
                      {selected.reviewed_at ? format(new Date(selected.reviewed_at), "MMM d, yyyy h:mm a") : "—"}
                    </p>
                  </div>
                </div>

                {/* Task Description */}
                {selected.task?.description && (
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Task Description</p>
                    <p className="text-xs text-foreground leading-relaxed">{selected.task.description}</p>
                  </div>
                )}

                {/* Task Link */}
                {selected.task?.link && (
                  <a
                    href={selected.task.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-muted p-3 hover:bg-muted/70 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-xs text-primary truncate">{selected.task.link}</span>
                  </a>
                )}

                {/* Proof Section */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Proof</p>
                  
                  {selected.proof_text && (
                    <div className="rounded-xl bg-muted p-3 mb-2">
                      <p className="text-xs text-foreground whitespace-pre-wrap">{selected.proof_text}</p>
                    </div>
                  )}

                  {selected.proof_images && selected.proof_images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {selected.proof_images.map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="block">
                          <img
                            src={img}
                            alt={`Proof ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-xl border border-border hover:opacity-80 transition-opacity"
                          />
                        </a>
                      ))}
                    </div>
                  ) : !selected.proof_text ? (
                    <p className="text-xs text-muted-foreground italic">No proof attached</p>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompletedTasks;
