import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Star, Clock, CheckCircle2, XCircle, ImagePlus, Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon, TwitterIcon, TelegramIcon } from "@/components/PlatformIcons";
import { toast } from "sonner";
import AdvertiserReviews from "@/components/AdvertiserReviews";
import type { Task } from "@/contexts/AppContext";

const platformIcons: Record<string, React.ReactNode> = {
  youtube: <YouTubeIcon className="h-6 w-6" />,
  instagram: <InstagramIcon className="h-6 w-6" />,
  tiktok: <TikTokIcon className="h-6 w-6" />,
  facebook: <FacebookIcon className="h-6 w-6" />,
  twitter: <TwitterIcon className="h-6 w-6" />,
  telegram: <TelegramIcon className="h-6 w-6" />,
};

type Submission = {
  id: string;
  task_id: string;
  user_id: string;
  advertiser_id: string;
  status: string;
  proof_text: string;
  proof_images: string[];
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string;
};

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { refreshData } = useApp();
  const [task, setTask] = useState<(Task & { proof_requirements?: string }) | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [proofText, setProofText] = useState("");
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTask = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase.from("tasks").select("*").eq("id", id).single();
    if (data) setTask(data as any);

    if (authUser) {
      const { data: sub } = await supabase
        .from("task_submissions")
        .select("*")
        .eq("task_id", id)
        .eq("user_id", authUser.id)
        .order("submitted_at", { ascending: false })
        .limit(1);
      if (sub && sub.length > 0) setSubmission(sub[0] as any);
    }
    setLoading(false);
  }, [id, authUser]);

  useEffect(() => { fetchTask(); }, [fetchTask]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !authUser) return;
    setUploading(true);
    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${authUser.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("task-proofs").upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("task-proofs").getPublicUrl(path);
        newImages.push(urlData.publicUrl);
      }
    }
    setProofImages(prev => [...prev, ...newImages]);
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    setProofImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!task || !authUser) return;
    if (!proofText.trim() && proofImages.length === 0) {
      toast.error("Please provide proof text or upload screenshots");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.from("task_submissions").insert({
      task_id: task.id,
      user_id: authUser.id,
      advertiser_id: task.user_id,
      proof_text: proofText.trim(),
      proof_images: proofImages,
    } as any).select().single();

    if (error) {
      toast.error("Failed to submit proof");
    } else {
      toast.success("Proof submitted! Waiting for advertiser review.");
      setSubmission(data as any);
      refreshData();
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Task not found</p>
        <Button variant="outline" onClick={() => navigate("/tasks")}>Back to Tasks</Button>
      </div>
    );
  }

  const isOwnTask = authUser?.id === task.user_id;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">{platformIcons[task.platform]}</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-primary-foreground">{task.title}</h1>
            <p className="text-sm text-primary-foreground/70 mt-0.5">by {task.advertiser}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-primary-foreground">+{task.reward}</p>
            <p className="text-[10px] text-primary-foreground/60">credits</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {/* Task Info */}
        <Card className="border-border">
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</p>
              <p className="text-sm text-foreground mt-1">{task.description || "Complete the required action on the platform."}</p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="capitalize">Action: <strong className="text-foreground">{task.action}</strong></span>
              <span>Slots: <strong className="text-foreground">{task.completed_count}/{task.total_slots}</strong></span>
            </div>
            {task.link && (
              <a href={task.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-1">
                <ExternalLink className="h-3.5 w-3.5" /> Open Content Link
              </a>
            )}
          </CardContent>
        </Card>

        {/* Proof Requirements */}
        {(task as any).proof_requirements && (
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Proof Requirements</p>
              <p className="text-sm text-foreground">{(task as any).proof_requirements}</p>
            </CardContent>
          </Card>
        )}

        {/* Submission Status */}
        {submission && (
          <Card className={cn("border-2", 
            submission.status === "pending" && "border-warning/50 bg-warning/5",
            submission.status === "approved" && "border-success/50 bg-success/5",
            submission.status === "rejected" && "border-destructive/50 bg-destructive/5"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {submission.status === "pending" && <Clock className="h-4 w-4 text-warning" />}
                {submission.status === "approved" && <CheckCircle2 className="h-4 w-4 text-success" />}
                {submission.status === "rejected" && <XCircle className="h-4 w-4 text-destructive" />}
                <p className="text-sm font-semibold capitalize text-foreground">
                  {submission.status === "pending" ? "Waiting for Review" :
                   submission.status === "approved" ? "Approved! Credits Added" :
                   "Submission Rejected"}
                </p>
              </div>
              {submission.status === "rejected" && submission.rejection_reason && (
                <p className="text-xs text-muted-foreground mt-1">Reason: {submission.rejection_reason}</p>
              )}
              <p className="text-[11px] text-muted-foreground mt-2">
                Submitted {new Date(submission.submitted_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Submit Proof Form — only show if no submission or rejected */}
        {!isOwnTask && (!submission || submission.status === "rejected") && (
          <Card className="border-border">
            <CardContent className="p-4 space-y-4">
              <p className="text-sm font-bold text-foreground">Submit Proof</p>
              
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Proof Description</label>
                <Textarea
                  value={proofText}
                  onChange={e => setProofText(e.target.value)}
                  placeholder="Describe what you did (e.g., 'Subscribed to the channel, here's my screenshot')"
                  className="min-h-[80px] rounded-xl bg-muted/50 border-0 text-sm"
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Screenshots (optional)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {proofImages.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex items-center justify-center w-20 h-20 rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    {uploading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                    ) : (
                      <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    )}
                  </label>
                </div>
              </div>

              <Button
                className="w-full h-11 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm"
                disabled={submitting || (!proofText.trim() && proofImages.length === 0)}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting..." : "Submit for Verification"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Review Section — only after approval */}
        {submission?.status === "approved" && (
          <ReviewForm
            taskId={task.id}
            submissionId={submission.id}
            advertiserId={task.user_id}
          />
        )}

        {/* Advertiser Reviews */}
        <AdvertiserReviews advertiserId={task.user_id} />
      </div>
    </div>
  );
};

// Inline review form for after approval
const ReviewForm = ({ taskId, submissionId, advertiserId }: { taskId: string; submissionId: string; advertiserId: string }) => {
  const { user: authUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [existing, setExisting] = useState(false);

  useEffect(() => {
    if (!authUser) return;
    supabase.from("advertiser_reviews").select("id").eq("submission_id", submissionId).eq("reviewer_id", authUser.id).then(({ data }) => {
      if (data && data.length > 0) setExisting(true);
    });
  }, [authUser, submissionId]);

  const handleReview = async () => {
    if (!authUser || rating === 0) return;
    const { error } = await supabase.from("advertiser_reviews").insert({
      task_id: taskId,
      submission_id: submissionId,
      reviewer_id: authUser.id,
      advertiser_id: advertiserId,
      rating,
      review_text: reviewText.trim(),
    } as any);

    if (error) {
      toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted!");
      setSubmitted(true);
    }
  };

  if (existing || submitted) {
    return (
      <Card className="border-border">
        <CardContent className="p-4 text-center">
          <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">You've already reviewed this advertiser</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardContent className="p-4 space-y-3">
        <p className="text-sm font-bold text-foreground">Rate This Advertiser</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} onClick={() => setRating(s)}>
              <Star className={cn("h-6 w-6 transition-colors", s <= rating ? "text-warning fill-warning" : "text-muted-foreground/30")} />
            </button>
          ))}
        </div>
        <Textarea
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          placeholder="Share your experience (optional)"
          className="min-h-[60px] rounded-xl bg-muted/50 border-0 text-sm"
          maxLength={500}
        />
        <Button
          size="sm"
          className="w-full h-9 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold"
          disabled={rating === 0}
          onClick={handleReview}
        >
          Submit Review
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskDetail;
