import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

const typeConfig: Record<string, { color: string; icon: typeof TrendingUp; prefix: string }> = {
  earned: { color: "bg-success/10 text-success border-success/20", icon: TrendingUp, prefix: "+" },
  spent: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: TrendingDown, prefix: "-" },
  purchased: { color: "bg-primary/10 text-primary border-primary/20", icon: TrendingUp, prefix: "+" },
  withdrawn: { color: "bg-warning/10 text-warning border-warning/20", icon: TrendingDown, prefix: "-" },
};

const Earnings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Tables<"transactions">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTransactions(data || []);
        setLoading(false);
      });
  }, [user]);

  const totalEarned = transactions.filter((t) => t.type === "earned" || t.type === "purchased").reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions.filter((t) => t.type === "spent" || t.type === "withdrawn").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-primary-foreground">Earnings & Transactions</h1>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-success">{totalEarned}</p>
              <p className="text-[10px] text-muted-foreground">Total Earned</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-destructive">{totalSpent}</p>
              <p className="text-[10px] text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <Coins className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => {
              const config = typeConfig[t.type] || typeConfig.earned;
              const Icon = config.icon;
              return (
                <Card key={t.id} className="border-border">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{t.description || t.type}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(t.created_at), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className={config.color}>
                        {config.prefix}{t.amount}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Earnings;
