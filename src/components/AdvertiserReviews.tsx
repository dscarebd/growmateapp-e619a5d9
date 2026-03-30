import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  reviewer_id: string;
};

const AdvertiserReviews = ({ advertiserId }: { advertiserId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("advertiser_reviews")
      .select("*")
      .eq("advertiser_id", advertiserId)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setReviews(data as any);
        setLoading(false);
      });
  }, [advertiserId]);

  if (loading || reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">Advertiser Reviews</p>
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-warning fill-warning" />
          <span className="text-xs font-bold text-foreground">{avgRating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviews.length})</span>
        </div>
      </div>
      {reviews.map(r => (
        <Card key={r.id} className="border-border">
          <CardContent className="p-3">
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={cn("h-3 w-3", s <= r.rating ? "text-warning fill-warning" : "text-muted-foreground/20")} />
              ))}
            </div>
            {r.review_text && <p className="text-xs text-foreground">{r.review_text}</p>}
            <p className="text-[10px] text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdvertiserReviews;
