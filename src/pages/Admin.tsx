import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Megaphone, Banknote, TrendingUp, Shield, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "hsl(0, 84%, 60%)",
  Instagram: "hsl(280, 70%, 55%)",
  TikTok: "hsl(174, 62%, 47%)",
  Facebook: "hsl(199, 89%, 48%)",
};

const PLATFORM_LABELS: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Admin = () => {
  const navigate = useNavigate();
  const { campaigns, withdrawals, tasks, transactions } = useApp();
  const [tab, setTab] = useState<"overview" | "users" | "campaigns" | "withdrawals">("overview");

  // Derive revenue data from transactions (earned = revenue, spent = expenses), grouped by day of week
  const revenueData = useMemo(() => {
    const byDay: Record<string, { revenue: number; expenses: number }> = {};
    DAY_NAMES.forEach(d => { byDay[d] = { revenue: 0, expenses: 0 }; });
    transactions.forEach(tx => {
      const day = DAY_NAMES[new Date(tx.created_at).getDay()];
      if (tx.type === "earned" || tx.type === "purchased") byDay[day].revenue += tx.amount;
      else byDay[day].expenses += Math.abs(tx.amount);
    });
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({ day: d, revenue: byDay[d].revenue, expenses: byDay[d].expenses }));
  }, [transactions]);

  // Derive task completion data by action type, grouped by day
  const taskCompletionData = useMemo(() => {
    const byDay: Record<string, { likes: number; follows: number; subscribes: number; shares: number }> = {};
    DAY_NAMES.forEach(d => { byDay[d] = { likes: 0, follows: 0, subscribes: 0, shares: 0 }; });
    tasks.forEach(t => {
      const day = DAY_NAMES[new Date(t.created_at).getDay()];
      if (t.action === "like") byDay[day].likes += t.completed_count;
      else if (t.action === "follow") byDay[day].follows += t.completed_count;
      else if (t.action === "subscribe") byDay[day].subscribes += t.completed_count;
      else if (t.action === "share") byDay[day].shares += t.completed_count;
    });
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({ day: d, ...byDay[d] }));
  }, [tasks]);

  // Platform distribution from tasks
  const platformDistribution = useMemo(() => {
    const counts: Record<string, number> = { youtube: 0, instagram: 0, tiktok: 0, facebook: 0 };
    tasks.forEach(t => { counts[t.platform] = (counts[t.platform] || 0) + t.completed_count; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).map(([key, val]) => ({
      name: PLATFORM_LABELS[key] || key,
      value: Math.round((val / total) * 100),
    }));
  }, [tasks]);

  // Stats from real data
  const totalTaskCompletions = tasks.reduce((sum, t) => sum + t.completed_count, 0);
  const totalRevenue = transactions.filter(t => t.type === "earned" || t.type === "purchased").reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    { icon: Users, label: "Total Tasks", value: tasks.length.toString(), change: "", color: "text-primary" },
    { icon: Megaphone, label: "Active Campaigns", value: campaigns.filter(c => c.status === "active").length.toString(), change: "", color: "text-secondary" },
    { icon: Banknote, label: "Credits Earned", value: totalRevenue.toLocaleString(), change: "", color: "text-success" },
    { icon: TrendingUp, label: "Completions", value: totalTaskCompletions.toLocaleString(), change: "", color: "text-warning" },
  ];

  const mockUsers = [
    { id: 1, name: "Sarah Chen", email: "sarah@mail.com", tasks: 156, trust: 95, status: "active" },
    { id: 2, name: "Mike Ross", email: "mike@mail.com", tasks: 89, trust: 72, status: "active" },
    { id: 3, name: "Lisa Wang", email: "lisa@mail.com", tasks: 23, trust: 45, status: "flagged" },
    { id: 4, name: "Tom Hardy", email: "tom@mail.com", tasks: 312, trust: 98, status: "active" },
  ];

  const chartTooltipStyle = {
    contentStyle: {
      background: "hsl(210, 40%, 9%)",
      border: "1px solid hsl(210, 30%, 18%)",
      borderRadius: "0.75rem",
      fontSize: "11px",
      color: "hsl(200, 20%, 95%)",
    },
  };

  const platformColorArray = platformDistribution.map(p => PLATFORM_COLORS[p.name] || "hsl(210, 15%, 46%)");

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
      </div>

      <div className="flex gap-1 mx-5 bg-muted rounded-xl p-1 mb-5 overflow-x-auto">
        {(["overview", "users", "campaigns", "withdrawals"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn("flex-1 py-2 text-[11px] font-semibold rounded-lg transition-all capitalize whitespace-nowrap px-2", tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-5">
        {tab === "overview" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              {stats.map(s => (
                <Card key={s.label} className="border-border">
                  <CardContent className="p-4">
                    <s.icon className={cn("h-5 w-5 mb-2", s.color)} />
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Revenue Area Chart */}
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Credits Earned vs Spent</h3>
                <p className="text-[11px] text-muted-foreground mb-3">By day of week</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(174, 62%, 47%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(174, 62%, 47%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 30%, 18%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(210, 15%, 46%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(210, 15%, 46%)" }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip {...chartTooltipStyle} />
                    <Area type="monotone" dataKey="revenue" name="Earned" stroke="hsl(199, 89%, 48%)" fill="url(#gradRevenue)" strokeWidth={2} animationDuration={1500} />
                    <Area type="monotone" dataKey="expenses" name="Spent" stroke="hsl(174, 62%, 47%)" fill="url(#gradExpenses)" strokeWidth={2} animationDuration={1500} animationBegin={300} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task Completion Bar Chart */}
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Task Completions by Type</h3>
                <p className="text-[11px] text-muted-foreground mb-3">By day of week</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 30%, 18%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(210, 15%, 46%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(210, 15%, 46%)" }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip {...chartTooltipStyle} />
                    <Bar dataKey="likes" stackId="a" fill="hsl(199, 89%, 48%)" radius={[0, 0, 0, 0]} animationDuration={1200} />
                    <Bar dataKey="follows" stackId="a" fill="hsl(174, 62%, 47%)" animationDuration={1200} animationBegin={200} />
                    <Bar dataKey="subscribes" stackId="a" fill="hsl(38, 92%, 50%)" animationDuration={1200} animationBegin={400} />
                    <Bar dataKey="shares" stackId="a" fill="hsl(280, 70%, 55%)" radius={[4, 4, 0, 0]} animationDuration={1200} animationBegin={600} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-3">
                  {[
                    { label: "Likes", color: "bg-primary" },
                    { label: "Follows", color: "bg-secondary" },
                    { label: "Subscribes", color: "bg-warning" },
                    { label: "Shares", color: "bg-[hsl(280,70%,55%)]" },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className={cn("h-2.5 w-2.5 rounded-full", l.color)} />
                      <span className="text-[10px] text-muted-foreground">{l.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Distribution Pie Chart */}
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Platform Distribution</h3>
                <p className="text-[11px] text-muted-foreground mb-3">Tasks by platform</p>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={160}>
                    <PieChart>
                      <Pie data={platformDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" animationDuration={1500} animationBegin={200}>
                        {platformDistribution.map((_, i) => (
                          <Cell key={i} fill={platformColorArray[i]} />
                        ))}
                      </Pie>
                      <Tooltip {...chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2.5">
                    {platformDistribution.map((p, i) => (
                      <div key={p.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ background: platformColorArray[i] }} />
                        <span className="text-xs text-foreground font-medium">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Budget Line Chart */}
            {campaigns.length > 0 && (
              <Card className="border-border">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Campaign Budgets</h3>
                  <p className="text-[11px] text-muted-foreground mb-3">Your campaigns</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={campaigns.map(c => ({ name: c.title.slice(0, 12), budget: c.total_budget, spent: c.completed_actions * c.reward_per_action }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 30%, 18%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(210, 15%, 46%)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(210, 15%, 46%)" }} axisLine={false} tickLine={false} width={35} />
                      <Tooltip {...chartTooltipStyle} />
                      <Bar dataKey="budget" name="Budget" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} animationDuration={1200} />
                      <Bar dataKey="spent" name="Spent" fill="hsl(174, 62%, 47%)" radius={[4, 4, 0, 0]} animationDuration={1200} animationBegin={300} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {tab === "users" && (
          <div className="space-y-2 animate-fade-in">
            {mockUsers.map(u => (
              <Card key={u.id} className="border-border">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">{u.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                    <p className="text-[11px] text-muted-foreground">{u.tasks} tasks • Trust: {u.trust}%</p>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full capitalize", u.status === "active" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>
                    {u.status === "flagged" && <Shield className="h-2.5 w-2.5 inline mr-0.5" />}
                    {u.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {tab === "campaigns" && (
          <div className="space-y-2 animate-fade-in">
            {campaigns.map(c => (
              <Card key={c.id} className="border-border">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{c.platform} • {c.reward_per_action} credits/action • {c.completed_actions}/{c.estimated_reach}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-success"><CheckCircle2 className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive"><XCircle className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {campaigns.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No campaigns yet</p>}
          </div>
        )}

        {tab === "withdrawals" && (
          <div className="space-y-2 animate-fade-in">
            {withdrawals.map(w => (
              <Card key={w.id} className="border-border">
                <CardContent className="p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">{w.amount} credits</p>
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full capitalize", w.status === "approved" ? "bg-success/15 text-success" : w.status === "pending" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive")}>{w.status}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{w.method} • Net: ${Number(w.net_amount).toFixed(2)} • {new Date(w.requested_at).toLocaleDateString()}</p>
                  {w.status === "pending" && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="h-7 text-xs flex-1 bg-success text-success-foreground rounded-lg">Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs flex-1 rounded-lg text-destructive">Reject</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {withdrawals.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No withdrawals yet</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
