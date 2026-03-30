import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon, TwitterIcon, TelegramIcon } from "@/components/PlatformIcons";
import { format } from "date-fns";

interface CompletedTask {
  id: string;
  task_id: string;
  submitted_at: string;
  reviewed_at: string | null;
  task: {
    title: string;
    platform: string;
    action: string;
    reward: number;
    link: string;
  } | null;
}

const PAGE_SIZE = 5;

const CompletedTasks = () => {
  const { user: authUser } = useAuth();
  const [tasks, setTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTasks = async (offset: number) => {
    if (!authUser) return [];
    const { data } = await supabase
      .from("task_submissions")
      .select("id, task_id, submitted_at, reviewed_at, task:tasks(title, platform, action, reward, link)")
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
    const newTasks = [...tasks, ...data];
    setTasks(newTasks);
    // If we got fewer than PAGE_SIZE, no more to load
    setHasMore(data.length === PAGE_SIZE);
    setLoadingMore(false);
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

  const PlatformIcon = (platform: string) => {
    const icons = PlatformIcons as Record<string, any>;
    const Icon = icons[platform];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" /> Completed Tasks
          <span className="text-xs font-normal text-muted-foreground">({tasks.length}{hasMore ? "+" : ""})</span>
        </h3>
        <div className="space-y-2">
          {tasks.map((sub) => (
            <div key={sub.id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success shrink-0">
                {PlatformIcon(sub.task?.platform ?? "")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{sub.task?.title ?? "Unknown Task"}</p>
                <p className="text-[10px] text-muted-foreground capitalize">
                  {sub.task?.action} · {sub.reviewed_at ? format(new Date(sub.reviewed_at), "MMM d, yyyy") : ""}
                </p>
              </div>
              <span className="text-xs font-bold text-success whitespace-nowrap">+{sub.task?.reward ?? 0}</span>
            </div>
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
  );
};

export default CompletedTasks;
