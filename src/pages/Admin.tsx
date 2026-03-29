import { useState } from "react";
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

const revenueData = [
  { day: "Mon", revenue: 1200, expenses: 400 },
  { day: "Tue", revenue: 1900, expenses: 600 },
  { day: "Wed", revenue: 1500, expenses: 500 },
  { day: "Thu", revenue: 2400, expenses: 700 },
  { day: "Fri", revenue: 1800, expenses: 550 },
  { day: "Sat", revenue: 2800, expenses: 900 },
  { day: "Sun", revenue: 2200, expenses: 650 },
];

const userGrowthData = [
  { month: "Jan", users: 820 },
  { month: "Feb", users: 1100 },
  { month: "Mar", users: 1450 },
  { month: "Apr", users: 1800 },
  { month: "May", users: 2200 },
  { month: "Jun", users: 2847 },
];

const taskCompletionData = [
  { day: "Mon", likes: 180, follows: 120, subscribes: 60, shares: 40 },
  { day: "Tue", likes: 220, follows: 150, subscribes: 80, shares: 55 },
  { day: "Wed", likes: 190, follows: 130, subscribes: 70, shares: 45 },
  { day: "Thu", likes: 280, follows: 180, subscribes: 95, shares: 70 },
  { day: "Fri", likes: 240, follows: 160, subscribes: 85, shares: 60 },
  { day: "Sat", likes: 310, follows: 200, subscribes: 110, shares: 85 },
  { day: "Sun", likes: 260, follows: 170, subscribes: 90, shares: 65 },
];

const platformDistribution = [
  { name: "YouTube", value: 35 },
  { name: "Instagram", value: 28 },
  { name: "TikTok", value: 22 },
  { name: "Facebook", value: 15 },
];

const PLATFORM_COLORS = [
  "hsl(0, 84%, 60%)",
  "hsl(280, 70%, 55%)",
  "hsl(174, 62%, 47%)",
  "hsl(199, 89%, 48%)",
];

const Admin = () => {
  const navigate = useNavigate();
  const { campaigns, withdrawals } = useApp();
  const [tab, setTab] = useState<"overview" | "users" | "campaigns" | "withdrawals">("overview");

  const stats = [
    { icon: Users, label: "Total Users", value: "2,847", change: "+12%", color: "text-primary" },
    { icon: Megaphone, label: "Active Campaigns", value: campaigns.filter(c => c.status === "active").length.toString(), change: "+5%", color: "text-secondary" },
    { icon: Banknote, label: "Revenue", value: "$12,450", change: "+23%", color: "text-success" },
    { icon: TrendingUp, label: "Daily Tasks", value: "1,204", change: "+8%", color: "text-warning" },
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
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(s => (
                <Card key={s.label} className="border-border">
                  <CardContent className="p-4">
                    <s.icon className={cn("h-5 w-5 mb-2", s.color)} />
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      <span className="text-[10px] text-success font-semibold">{s.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Revenue Area Chart */}
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Revenue vs Expenses</h3>
                <p className="text-[11px] text-muted-foreground mb-3">Last 7 days</p>
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
                    <Area type="monotone" dataKey="revenue" stroke="hsl(199, 89%, 48%)" fill="url(#gradRevenue)" strokeWidth={2} animationDuration={1500} />
                    <Area type="monotone" dataKey="expenses" stroke="hsl(174, 62%, 47%)" fill="url(#gradExpenses)" strokeWidth={2} animationDuration={1500} animationBegin={300} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Growth Line Chart */}
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">User Growth</h3>
                <p className="text-[11px] text-muted-foreground mb-3">Last 6 months</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 30%, 18%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(210, 15%, 46%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(210, 15%, 46%)" }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip {...chartTooltipStyle} />
                    <Line type="monotone" dataKey="users" stroke="hsl(199, 89%, 48%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(199, 89%, 48%)", strokeWidth: 2, stroke: "hsl(210, 40%, 9%)" }} activeDot={{ r: 6 }} animationDuration={2000} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task Completion Bar Chart */}
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Task Completions by Type</h3>
                <p className="text-[11px] text-muted-foreground mb-3">Last 7 days breakdown</p>
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
                          <Cell key={i} fill={PLATFORM_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip {...chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2.5">
                    {platformDistribution.map((p, i) => (
                      <div key={p.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ background: PLATFORM_COLORS[i] }} />
                        <span className="text-xs text-foreground font-medium">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
