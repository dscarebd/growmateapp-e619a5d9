import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;

type Review = {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  reviewer_id: string;
  reviewer_name?: string;
};

const AdvertiserReviews = ({ advertiserId }: { advertiserId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const enrichWithNames = useCallback(async (data: any[]): Promise<Review[]> => {
    const reviewerIds = [...new Set(data.map((r: any) => r.reviewer_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name")
      .in("id", reviewerIds);

    const nameMap: Record<string, string> = {};
    profiles?.forEach((p: any) => { nameMap[p.id] = p.name; });

    return data.map((r: any) => ({ ...r, reviewer_name: nameMap[r.reviewer_id] || "User" }));
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const [{ data }, { count }] = await Promise.all([
        supabase
          .from("advertiser_reviews")
          .select("*")
          .eq("advertiser_id", advertiserId)
          .order("created_at", { ascending: false })
          .range(0, PAGE_SIZE - 1),
        supabase
          .from("advertiser_reviews")
          .select("*", { count: "exact", head: true })
          .eq("advertiser_id", advertiserId),
      ]);

      if (data && data.length > 0) {
        const enriched = await enrichWithNames(data);
        setReviews(enriched);
        setTotalCount(count ?? data.length);
        setHasMore(data.length === PAGE_SIZE && (count ?? 0) > PAGE_SIZE);
      }
      setLoading(false);
    };
    fetchReviews();
  }, [advertiserId, enrichWithNames]);

  const loadMore = async () => {
    setLoadingMore(true);
    const { data } = await supabase
      .from("advertiser_reviews")
      .select("*")
      .eq("advertiser_id", advertiserId)
      .order("created_at", { ascending: false })
      .range(reviews.length, reviews.length + PAGE_SIZE - 1);

    if (data && data.length > 0) {
      const enriched = await enrichWithNames(data);
      setReviews(prev => [...prev, ...enriched]);
      setHasMore(reviews.length + data.length < totalCount);
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  if (loading || reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">Advertiser Reviews</p>
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-warning fill-warning" />
          <span className="text-xs font-bold text-foreground">{avgRating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({totalCount})</span>
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
            {r.review_text && <p className="text-xs text-foreground mt-1">{r.review_text}</p>}
            <p className="text-[10px] text-muted-foreground mt-1">{r.reviewer_name || "User"} · {new Date(r.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ))}
      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={loadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading..." : "Load More Reviews"}
        </Button>
      )}
    </div>
  );
};

export default AdvertiserReviews;
