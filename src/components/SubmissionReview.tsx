import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SubmissionItem = {
  id: string;
  task_id: string;
  user_id: string;
  status: string;
  proof_text: string;
  proof_images: string[];
  submitted_at: string;
  rejection_reason: string;
};

const SubmissionReview = () => {
  const { user: authUser } = useAuth();
  const [submissions, setSubmissions] = useState<(SubmissionItem & { task_title?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  const fetchSubmissions = useCallback(async () => {
    if (!authUser) return;
    // Get tasks owned by current user
    const { data: tasks } = await supabase.from("tasks").select("id, title").eq("user_id", authUser.id);
    if (!tasks || tasks.length === 0) { setLoading(false); return; }

    const taskIds = tasks.map(t => t.id);
    const taskMap = Object.fromEntries(tasks.map(t => [t.id, t.title]));

    const { data: subs } = await supabase
      .from("task_submissions")
      .select("*")
      .in("task_id", taskIds)
      .order("submitted_at", { ascending: false });

    if (subs) {
      setSubmissions(subs.map((s: any) => ({ ...s, task_title: taskMap[s.task_id] })));
    }
    setLoading(false);
  }, [authUser]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleApprove = async (subId: string) => {
    const { error } = await supabase.rpc("approve_submission", { _submission_id: subId } as any);
    if (error) {
      toast.error("Failed to approve");
    } else {
      toast.success("Submission approved! Credits awarded.");
      fetchSubmissions();
    }
  };

  const handleReject = async (subId: string) => {
    const reason = rejectionReasons[subId] || "";
    const { error } = await supabase
      .from("task_submissions")
      .update({ status: "rejected", reviewed_at: new Date().toISOString(), rejection_reason: reason } as any)
      .eq("id", subId);
    if (error) {
      toast.error("Failed to reject");
    } else {
      toast.success("Submission rejected.");
      fetchSubmissions();
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground text-center py-8">Loading submissions...</p>;
  if (submissions.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">No submissions yet</p>;

  const pending = submissions.filter(s => s.status === "pending");
  const reviewed = submissions.filter(s => s.status !== "pending");

  return (
    <div className="space-y-4">
      {pending.length > 0 && (
        <div>
          <p className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-warning" /> Pending Review ({pending.length})
          </p>
          <div className="space-y-3">
            {pending.map(sub => (
              <Card key={sub.id} className="border-warning/30">
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">{sub.task_title}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {new Date(sub.submitted_at).toLocaleDateString()}
                  </p>

                  {sub.proof_text && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground">{sub.proof_text}</p>
                    </div>
                  )}

                  {sub.proof_images.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sub.proof_images.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block w-16 h-16 rounded-lg overflow-hidden border border-border">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Input
                      placeholder="Rejection reason (optional)"
                      value={rejectionReasons[sub.id] || ""}
                      onChange={e => setRejectionReasons(prev => ({ ...prev, [sub.id]: e.target.value }))}
                      className="h-9 text-xs rounded-lg bg-muted/50 border-0"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 h-9 rounded-xl bg-success text-success-foreground text-xs font-semibold gap-1" onClick={() => handleApprove(sub.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 h-9 rounded-xl text-destructive border-destructive/30 text-xs font-semibold gap-1" onClick={() => handleReject(sub.id)}>
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <p className="text-sm font-bold text-foreground mb-2">Reviewed ({reviewed.length})</p>
          <div className="space-y-2">
            {reviewed.map(sub => (
              <Card key={sub.id} className={cn("border-border opacity-70", sub.status === "approved" && "border-success/30", sub.status === "rejected" && "border-destructive/30")}>
                <CardContent className="p-3 flex items-center gap-2">
                  {sub.status === "approved" ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{sub.task_title}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{sub.status}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionReview;
