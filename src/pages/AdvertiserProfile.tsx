import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, Award, Briefcase, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon, TwitterIcon, TelegramIcon } from "@/components/PlatformIcons";
import AdvertiserReviews from "@/components/AdvertiserReviews";

const platformIcons: Record<string, React.ReactNode> = {
  youtube: <YouTubeIcon className="h-5 w-5" />,
  instagram: <InstagramIcon className="h-5 w-5" />,
  tiktok: <TikTokIcon className="h-5 w-5" />,
  facebook: <FacebookIcon className="h-5 w-5" />,
  twitter: <TwitterIcon className="h-5 w-5" />,
  telegram: <TelegramIcon className="h-5 w-5" />,
};

type Profile = {
  name: string;
  avatar_url: string | null;
  joined_date: string;
  trust_score: number;
  tasks_completed: number;
  campaigns_run: number;
};

type TaskItem = {
  id: string;
  title: string;
  platform: string;
  action: string;
  reward: number;
  completed_count: number;
  total_slots: number;
  created_at: string;
};

const AdvertiserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) return;
    const [profileRes, tasksRes, reviewsRes] = await Promise.all([
      supabase.from("profiles").select("name, avatar_url, joined_date, trust_score, tasks_completed, campaigns_run").eq("id", id).single(),
      supabase.from("tasks").select("id, title, platform, action, reward, completed_count, total_slots, created_at").eq("user_id", id).order("created_at", { ascending: false }),
      supabase.from("advertiser_reviews").select("rating").eq("advertiser_id", id),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (tasksRes.data) setTasks(tasksRes.data);
    if (reviewsRes.data && reviewsRes.data.length > 0) {
      setReviewCount(reviewsRes.data.length);
      setAvgRating(reviewsRes.data.reduce((s, r) => s + r.rating, 0) / reviewsRes.data.length);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Advertiser not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <div className="gradient-primary px-5 pb-8 pt-12 rounded-b-3xl">
        <div className="flex flex-col items-center text-center">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover border-4 border-primary-foreground/20" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-xl font-bold text-primary-foreground mt-3">{profile.name}</h1>
          <div className="flex items-center gap-2 mt-1.5">
            {reviewCount > 0 ? (
              <>
                <Star className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
                <span className="text-sm font-semibold text-primary-foreground">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-primary-foreground/60">({reviewCount} review{reviewCount !== 1 ? "s" : ""})</span>
              </>
            ) : (
              <span className="text-xs text-primary-foreground/60">No reviews yet</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-primary-foreground/50">
            <Calendar className="h-3 w-3" />
            <span>Joined {new Date(profile.joined_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <Briefcase className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-lg font-bold text-foreground">{tasks.length}</p>
              <p className="text-[10px] text-muted-foreground">Tasks Created</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <Star className="h-4 w-4 mx-auto text-warning mb-1" />
              <p className="text-lg font-bold text-foreground">{reviewCount}</p>
              <p className="text-[10px] text-muted-foreground">Reviews</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <Award className="h-4 w-4 mx-auto text-success mb-1" />
              <p className="text-lg font-bold text-foreground">{profile.trust_score}</p>
              <p className="text-[10px] text-muted-foreground">Trust Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks by this advertiser */}
        <div>
          <p className="text-sm font-bold text-foreground mb-2">Tasks by this Advertiser</p>
          {tasks.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-4 text-center text-xs text-muted-foreground">No tasks yet</CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {tasks.map(t => (
                <Card
                  key={t.id}
                  className="border-border cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => navigate(`/task/${t.id}`)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="shrink-0">{platformIcons[t.platform]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{t.title}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{t.action} · {t.completed_count}/{t.total_slots} completed</p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-1">
                      <span className="text-sm font-bold text-primary">+{t.reward}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <p className="text-sm font-bold text-foreground mb-2">Reviews</p>
          <AdvertiserReviews advertiserId={id!} />
        </div>
      </div>
    </div>
  );
};

export default AdvertiserProfile;
