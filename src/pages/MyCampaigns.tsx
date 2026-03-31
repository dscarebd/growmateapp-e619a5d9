import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Coins, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import * as PlatformIcons from "@/components/PlatformIcons";
import type { Tables } from "@/integrations/supabase/types";

const platformIconMap: Record<string, any> = {
  youtube: PlatformIcons.YouTubeIcon,
  instagram: PlatformIcons.InstagramIcon,
  tiktok: PlatformIcons.TikTokIcon,
  facebook: PlatformIcons.FacebookIcon,
  twitter: PlatformIcons.TwitterIcon,
  telegram: PlatformIcons.TelegramIcon,
};

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  paused: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-muted text-muted-foreground border-border",
  pending: "bg-primary/10 text-primary border-primary/20",
};

const MyCampaigns = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Tables<"campaigns">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCampaigns(data || []);
        setLoading(false);
      });
  }, [user]);

  const totalBudget = campaigns.reduce((s, c) => s + c.total_budget, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-primary-foreground">My Campaigns</h1>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{campaigns.length}</p>
              <p className="text-xs text-muted-foreground">Total campaigns</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{totalBudget}</p>
              <p className="text-xs text-muted-foreground">Total budget</p>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No campaigns yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {campaigns.map((c) => (
              <Card key={c.id} className="border-border">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      {(() => { const Icon = platformIconMap[c.platform] || Megaphone; return <Icon className="h-5 w-5" />; })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{c.action} • {format(new Date(c.created_at), "MMM d, yyyy")}</p>
                    </div>
                    <Badge variant="outline" className={statusColors[c.status] || ""}>
                      {c.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 mt-2 ml-13">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Coins className="h-3 w-3" />
                      <span>{c.total_budget} budget</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{c.completed_actions}/{c.estimated_reach} done</span>
                    </div>
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

export default MyCampaigns;
