import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PlatformIcons } from "@/components/PlatformIcons";

interface CompletedSubmission {
  id: string;
  submitted_at: string;
  reviewed_at: string | null;
  task: {
    title: string;
    platform: string;
    action: string;
    reward: number;
  } | null;
}

const TasksCompleted = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<CompletedSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("task_submissions")
        .select("id, submitted_at, reviewed_at, task_id")
        .eq("user_id", user.id)
        .eq("status", "approved" as any)
        .order("reviewed_at", { ascending: false });

      if (!data || data.length === 0) {
        setSubmissions([]);
        setLoading(false);
        return;
      }

      const taskIds = [...new Set(data.map((s) => s.task_id))];
      const { data: tasks } = await supabase
        .from("tasks")
        .select("id, title, platform, action, reward")
        .in("id", taskIds);

      const taskMap = new Map(tasks?.map((t) => [t.id, t]) || []);
      setSubmissions(
        data.map((s) => ({
          id: s.id,
          submitted_at: s.submitted_at,
          reviewed_at: s.reviewed_at,
          task: taskMap.get(s.task_id) || null,
        }))
      );
      setLoading(false);
    };
    fetch();
  }, [user]);

  const totalEarned = submissions.reduce((s, sub) => s + (sub.task?.reward || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-primary-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-primary-foreground">Tasks Completed</h1>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{submissions.length}</p>
              <p className="text-xs text-muted-foreground">Total tasks completed</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{totalEarned}</p>
              <p className="text-xs text-muted-foreground">Credits earned</p>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No completed tasks yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {submissions.map((sub) => (
              <Card key={sub.id} className="border-border">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <PlatformIcons platform={sub.task?.platform || "website_visit"} className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{sub.task?.title || "Unknown Task"}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {sub.task?.action} • {sub.reviewed_at ? format(new Date(sub.reviewed_at), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-success">
                    <Coins className="h-3.5 w-3.5" />
                    +{sub.task?.reward || 0}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksCompleted;
