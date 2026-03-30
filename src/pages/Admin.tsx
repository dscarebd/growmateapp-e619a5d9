import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Users, Megaphone, Banknote, TrendingUp, Shield, CheckCircle2, XCircle,
  Pause, Play, Search, Plus, CreditCard, Eye, Wallet, ChevronLeft, ChevronRight, Gift, ArrowLeft, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "hsl(0, 84%, 60%)", Instagram: "hsl(280, 70%, 55%)",
  TikTok: "hsl(174, 62%, 47%)", Facebook: "hsl(199, 89%, 48%)",
  "X (Twitter)": "hsl(0, 0%, 15%)", Telegram: "hsl(199, 82%, 55%)",
};
const PLATFORM_LABELS: Record<string, string> = {
  youtube: "YouTube", instagram: "Instagram", tiktok: "TikTok",
  facebook: "Facebook", twitter: "X (Twitter)", telegram: "Telegram",
};

const PAYMENT_METHODS = ["bKash", "Nagad", "Bank Transfer", "Binance"];

const chartTooltipStyle = {
  contentStyle: {
    background: "hsl(210, 40%, 9%)", border: "1px solid hsl(210, 30%, 18%)",
    borderRadius: "0.75rem", fontSize: "11px", color: "hsl(200, 20%, 95%)",
  },
};

type Tab = "overview" | "users" | "campaigns" | "withdrawals" | "payments" | "referrals";

const Admin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const admin = useAdmin();
  const [tab, setTab] = useState<Tab>(() => {
    const urlTab = searchParams.get("tab");
    return (urlTab && ["overview", "users", "campaigns", "withdrawals", "payments", "referrals"].includes(urlTab))
      ? urlTab as Tab : "overview";
  });

  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && ["overview", "users", "campaigns", "withdrawals", "payments", "referrals"].includes(urlTab)) {
      setTab(urlTab as Tab);
    }
  }, [searchParams]);
  const [search, setSearch] = useState("");
  const [withdrawalSearch, setWithdrawalSearch] = useState("");
  const [addCreditsDialog, setAddCreditsDialog] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditMethod, setCreditMethod] = useState("bKash");
  const [creditRef, setCreditRef] = useState("");
  const [creditNotes, setCreditNotes] = useState("");
  const [userDetailDialog, setUserDetailDialog] = useState<string | null>(null);
  const [editTrust, setEditTrust] = useState("");
  const [withdrawalFilter, setWithdrawalFilter] = useState<"all" | "pending" | "approved" | "rejected" | "processing">("all");
  const [wdPage, setWdPage] = useState(1);
  const WD_PER_PAGE = 10;
  const [pmPage, setPmPage] = useState(1);
  const PM_PER_PAGE = 10;
  const [refPage, setRefPage] = useState(1);
  const REF_PER_PAGE = 10;
  const [editBonusAmount, setEditBonusAmount] = useState("");
  const [editMinBudget, setEditMinBudget] = useState("");
  const [editPaymentDialog, setEditPaymentDialog] = useState<string | null>(null);
  const [editPaymentMethod, setEditPaymentMethod] = useState("");
  const [editPaymentRef, setEditPaymentRef] = useState("");
  const [editPaymentNotes, setEditPaymentNotes] = useState("");

  // Charts (hooks must be before conditionals)
  const platformDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    admin.campaigns.forEach(c => { counts[c.platform] = (counts[c.platform] || 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).map(([key, val]) => ({
      name: PLATFORM_LABELS[key] || key, value: Math.round((val / total) * 100),
    }));
  }, [admin.campaigns]);

  const revenueByDay = useMemo(() => {
    const days: Record<string, number> = {};
    admin.transactions.filter(t => t.type === "purchased").forEach((t: any) => {
      const day = new Date(t.created_at).toLocaleDateString("en", { weekday: "short" });
      days[day] = (days[day] || 0) + t.amount;
    });
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({ day: d, revenue: days[d] || 0 }));
  }, [admin.transactions]);

  if (admin.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!admin.isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-8">
        <Shield className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">You don't have admin privileges. Contact the administrator to get access.</p>
        <Button onClick={() => navigate("/home")} className="gradient-primary text-primary-foreground rounded-xl">Go Home</Button>
      </div>
    );
  }

  // Stats
  const totalUsers = admin.profiles.length;
  const totalCreditsInCirculation = admin.profiles.reduce((s, p) => s + p.credits, 0);
  const activeCampaigns = admin.campaigns.filter(c => c.status === "active").length;
  const pendingWithdrawals = admin.withdrawals.filter(w => w.status === "pending").length;
  const pendingPayments = admin.payments.filter(p => p.status === "pending").length;
  const totalRevenue = admin.transactions.filter(t => t.type === "purchased").reduce((s: number, t: any) => s + t.amount, 0);

  const platformColors = platformDistribution.map(p => PLATFORM_COLORS[p.name] || "hsl(210, 15%, 46%)");

  const filteredUsers = admin.profiles.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCredits = async () => {
    if (!addCreditsDialog || !creditAmount) return;
    await admin.addCreditsManually(addCreditsDialog, parseInt(creditAmount), creditMethod, creditRef, creditNotes);
    setAddCreditsDialog(null);
    setCreditAmount(""); setCreditRef(""); setCreditNotes("");
  };

  const selectedUser = admin.profiles.find(p => p.id === userDetailDialog);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-primary-foreground">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-1 text-xs"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Users", value: totalUsers, icon: Users },
            { label: "Revenue", value: totalRevenue, icon: Banknote },
            { label: "Active", value: activeCampaigns, icon: Megaphone },
          ].map(s => (
            <div key={s.label} className="bg-primary-foreground/15 rounded-xl p-3 text-center">
              <s.icon className="h-4 w-4 mx-auto mb-1 text-primary-foreground/80" />
              <p className="text-lg font-bold text-primary-foreground">{s.value}</p>
              <p className="text-[10px] text-primary-foreground/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2 px-5 mt-4 mb-4 overflow-x-auto">
        {pendingWithdrawals > 0 && (
          <button onClick={() => setTab("withdrawals")} className="flex items-center gap-1.5 bg-warning/15 text-warning px-3 py-1.5 rounded-full text-xs font-semibold shrink-0">
            <Wallet className="h-3 w-3" /> {pendingWithdrawals} pending withdrawals
          </button>
        )}
        {pendingPayments > 0 && (
          <button onClick={() => setTab("payments")} className="flex items-center gap-1.5 bg-success/15 text-success px-3 py-1.5 rounded-full text-xs font-semibold shrink-0">
            <CreditCard className="h-3 w-3" /> {pendingPayments} pending payments
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mx-5 bg-muted rounded-xl p-1 mb-5 overflow-x-auto">
        {(["overview", "users", "campaigns", "withdrawals", "payments", "referrals"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn(
            "flex-1 py-2 text-[11px] font-semibold rounded-lg transition-all capitalize whitespace-nowrap px-2",
            tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          )}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-5">
        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users, label: "Total Users", value: totalUsers, color: "text-primary" },
                { icon: Megaphone, label: "Active Campaigns", value: activeCampaigns, color: "text-secondary" },
                { icon: Banknote, label: "Total Revenue", value: `${totalRevenue}`, color: "text-success" },
                { icon: TrendingUp, label: "Credits in Circulation", value: totalCreditsInCirculation, color: "text-warning" },
              ].map(s => (
                <Card key={s.label} className="border-border">
                  <CardContent className="p-4">
                    <s.icon className={cn("h-5 w-5 mb-2", s.color)} />
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Revenue Chart */}
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Revenue Overview</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={revenueByDay}>
                    <defs>
                      <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 30%, 18%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(210, 15%, 46%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(210, 15%, 46%)" }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip {...chartTooltipStyle} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(160, 84%, 39%)" fill="url(#gradRev)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            {platformDistribution.length > 0 && (
              <Card className="border-border">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Platform Distribution</h3>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={140}>
                      <PieChart>
                        <Pie data={platformDistribution} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                          {platformDistribution.map((_, i) => <Cell key={i} fill={platformColors[i]} />)}
                        </Pie>
                        <Tooltip {...chartTooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2">
                      {platformDistribution.map((p, i) => (
                        <div key={p.name} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ background: platformColors[i] }} />
                          <span className="text-xs text-foreground">{p.name}</span>
                          <span className="text-[10px] text-muted-foreground">{p.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {tab === "users" && (
          <div className="space-y-3 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl bg-muted/50 border-0" />
            </div>
            {filteredUsers.map(u => (
              <Card key={u.id} className="border-border">
                <CardContent className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">{u.name[0]?.toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{u.credits}</p>
                      <p className="text-[10px] text-muted-foreground">credits</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span>Tasks: {u.tasks_completed}</span>
                    <span>Campaigns: {u.campaigns_run}</span>
                    <span>Trust: {u.trust_score}%</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="h-7 text-xs flex-1 rounded-lg" onClick={() => { setUserDetailDialog(u.id); setEditTrust(u.trust_score.toString()); }}>
                      <Eye className="h-3 w-3 mr-1" /> Details
                    </Button>
                    <Button size="sm" className="h-7 text-xs flex-1 rounded-lg bg-success text-success-foreground" onClick={() => setAddCreditsDialog(u.id)}>
                      <Plus className="h-3 w-3 mr-1" /> Add Credits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredUsers.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No users found</p>}
          </div>
        )}

        {/* CAMPAIGNS TAB */}
        {tab === "campaigns" && (
          <div className="space-y-3 animate-fade-in">
            {admin.campaigns.map(c => {
              const ownerProfile = admin.profiles.find(p => p.id === c.user_id);
              return (
                <Card key={c.id} className="border-border">
                  <CardContent className="p-3.5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                        <p className="text-[11px] text-muted-foreground">by {ownerProfile?.name || "Unknown"}</p>
                      </div>
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full capitalize shrink-0",
                        c.status === "active" ? "bg-success/15 text-success" :
                        c.status === "paused" ? "bg-warning/15 text-warning" :
                        c.status === "completed" ? "bg-primary/15 text-primary" :
                        "bg-muted text-muted-foreground"
                      )}>{c.status}</span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-muted-foreground mb-2">
                      <span>{PLATFORM_LABELS[c.platform] || c.platform}</span>
                      <span>{c.action}</span>
                      <span>{c.reward_per_action} cr/action</span>
                      <span>{c.completed_actions}/{c.estimated_reach}</span>
                    </div>
                    <div className="flex gap-2">
                      {c.status === "pending" && (
                        <>
                          <Button size="sm" className="h-7 text-xs flex-1 rounded-lg bg-success text-success-foreground" onClick={() => admin.updateCampaignStatus(c.id, "active")}>
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs flex-1 rounded-lg text-destructive" onClick={() => admin.updateCampaignStatus(c.id, "completed")}>
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      {c.status === "active" && (
                        <>
                          <Button size="sm" variant="outline" className="h-7 text-xs flex-1 rounded-lg" onClick={() => admin.updateCampaignStatus(c.id, "paused")}>
                            <Pause className="h-3 w-3 mr-1" /> Pause
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs flex-1 rounded-lg text-destructive" onClick={() => admin.updateCampaignStatus(c.id, "completed")}>
                            <XCircle className="h-3 w-3 mr-1" /> End
                          </Button>
                        </>
                      )}
                      {c.status === "paused" && (
                        <Button size="sm" className="h-7 text-xs flex-1 rounded-lg bg-success text-success-foreground" onClick={() => admin.updateCampaignStatus(c.id, "active")}>
                          <Play className="h-3 w-3 mr-1" /> Resume
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {admin.campaigns.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No campaigns yet</p>}
          </div>
        )}

        {/* WITHDRAWALS TAB */}
        {tab === "withdrawals" && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {(["all", "pending", "processing", "approved", "rejected"] as const).map(f => (
                <button key={f} onClick={() => { setWithdrawalFilter(f); setWdPage(1); }} className={cn(
                  "px-3 py-1.5 text-[11px] font-semibold rounded-full capitalize whitespace-nowrap transition-all",
                  withdrawalFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>{f}</button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by user name..." value={withdrawalSearch} onChange={e => { setWithdrawalSearch(e.target.value); setWdPage(1); }} className="pl-9 h-10 rounded-xl bg-muted/50 border-0" />
            </div>
            {(() => {
              const filtered = admin.withdrawals.filter(w => {
                const ownerName = admin.profiles.find(p => p.id === w.user_id)?.name || "";
                return (withdrawalFilter === "all" || w.status === withdrawalFilter) && ownerName.toLowerCase().includes(withdrawalSearch.toLowerCase());
              });
              const totalPages = Math.max(1, Math.ceil(filtered.length / WD_PER_PAGE));
              const safePage = Math.min(wdPage, totalPages);
              const paginated = filtered.slice((safePage - 1) * WD_PER_PAGE, safePage * WD_PER_PAGE);
              return (
                <>
                  {paginated.map(w => {
                    const ownerProfile = admin.profiles.find(p => p.id === w.user_id);
                    return (
                      <Card key={w.id} className="border-border">
                        <CardContent className="p-3.5">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <p className="text-sm font-medium text-foreground">{w.amount} credits</p>
                              <p className="text-[11px] text-muted-foreground">by {ownerProfile?.name || "Unknown"} • Balance: <span className="font-medium text-foreground">{ownerProfile?.credits ?? 0}</span></p>
                            </div>
                            <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full capitalize",
                              w.status === "approved" ? "bg-success/15 text-success" :
                              w.status === "pending" ? "bg-warning/15 text-warning" :
                              w.status === "processing" ? "bg-primary/15 text-primary" :
                              "bg-destructive/15 text-destructive"
                            )}>{w.status}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{w.method} • Net: ${Number(w.net_amount).toFixed(2)} • Commission: ${Number(w.commission).toFixed(2)}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(w.requested_at).toLocaleDateString()}</p>
                          {w.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" className="h-7 text-xs flex-1 rounded-lg bg-success text-success-foreground" onClick={() => admin.updateWithdrawalStatus(w.id, "approved")}>
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs flex-1 rounded-lg" onClick={() => admin.updateWithdrawalStatus(w.id, "processing")}>
                                Processing
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs flex-1 rounded-lg text-destructive" onClick={() => admin.updateWithdrawalStatus(w.id, "rejected")}>
                                <XCircle className="h-3 w-3 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                  {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No {withdrawalFilter === "all" ? "" : withdrawalFilter} withdrawals found</p>}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" disabled={safePage <= 1} onClick={() => setWdPage(safePage - 1)}>
                        <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                      </Button>
                      <span className="text-xs text-muted-foreground">Page {safePage} of {totalPages}</span>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" disabled={safePage >= totalPages} onClick={() => setWdPage(safePage + 1)}>
                        Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {tab === "payments" && (
          <div className="space-y-3 animate-fade-in">
            <Card className="border-primary/30 bg-accent/30">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Manual Payment Methods</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PAYMENT_METHODS.map(m => (
                    <span key={m} className="text-[11px] bg-card px-3 py-1.5 rounded-full border border-border font-medium text-foreground">{m}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {(() => {
              const totalPages = Math.max(1, Math.ceil(admin.payments.length / PM_PER_PAGE));
              const safePage = Math.min(pmPage, totalPages);
              const paginated = admin.payments.slice((safePage - 1) * PM_PER_PAGE, safePage * PM_PER_PAGE);
              return (
                <>
                  {paginated.map(p => {
                    const ownerProfile = admin.profiles.find(pr => pr.id === p.user_id);
                    return (
                      <Card key={p.id} className="border-border">
                        <CardContent className="p-3.5">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <p className="text-sm font-medium text-foreground">{p.amount} credits</p>
                              <p className="text-[11px] text-muted-foreground">by {ownerProfile?.name || "Unknown"}</p>
                            </div>
                            <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full capitalize",
                              p.status === "approved" ? "bg-success/15 text-success" :
                              p.status === "pending" ? "bg-warning/15 text-warning" :
                              "bg-destructive/15 text-destructive"
                            )}>{p.status}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground space-y-0.5">
                            <p>Method: <span className="text-foreground font-medium">{p.method}</span></p>
                            {p.transaction_ref && <p>Ref: <span className="text-foreground font-medium">{p.transaction_ref}</span></p>}
                            {p.notes && <p>Notes: {p.notes}</p>}
                            <p>{new Date(p.created_at).toLocaleDateString()}</p>
                          </div>
                          {p.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" className="h-7 text-xs flex-1 rounded-lg bg-success text-success-foreground" onClick={() => admin.approvePayment(p)}>
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Approve & Add Credits
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs flex-1 rounded-lg text-destructive" onClick={() => admin.rejectPayment(p.id)}>
                                <XCircle className="h-3 w-3 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                  {admin.payments.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No payment requests yet</p>}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" disabled={safePage <= 1} onClick={() => setPmPage(safePage - 1)}>
                        <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                      </Button>
                      <span className="text-xs text-muted-foreground">Page {safePage} of {totalPages}</span>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" disabled={safePage >= totalPages} onClick={() => setPmPage(safePage + 1)}>
                        Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* REFERRALS TAB */}
        {tab === "referrals" && (
          <div className="space-y-4 animate-fade-in">
            {/* Bonus Settings */}
            <Card className="border-primary/30 bg-accent/30">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Referral Settings</h3>

                <div>
                  <p className="text-[11px] text-muted-foreground mb-1.5">Bonus per referral: <span className="font-bold text-foreground">{admin.referralBonusAmount} credits</span></p>
                  <div className="flex gap-2">
                    <Input type="number" placeholder={admin.referralBonusAmount.toString()} value={editBonusAmount} onChange={e => setEditBonusAmount(e.target.value)} className="h-9 rounded-xl flex-1" min={1} max={10000} />
                    <Button size="sm" className="h-9 rounded-xl gradient-primary text-primary-foreground" disabled={!editBonusAmount || parseInt(editBonusAmount) < 1} onClick={() => { admin.updateReferralBonusAmount(parseInt(editBonusAmount)); setEditBonusAmount(""); }}>
                      Update
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-muted-foreground mb-1.5">Min campaign budget for referral trigger: <span className="font-bold text-foreground">{admin.minCampaignBudgetReferral} credits</span></p>
                  <div className="flex gap-2">
                    <Input type="number" placeholder={admin.minCampaignBudgetReferral.toString()} value={editMinBudget} onChange={e => setEditMinBudget(e.target.value)} className="h-9 rounded-xl flex-1" min={1} max={100000} />
                    <Button size="sm" className="h-9 rounded-xl gradient-primary text-primary-foreground" disabled={!editMinBudget || parseInt(editMinBudget) < 1} onClick={() => { admin.updateMinCampaignBudgetReferral(parseInt(editMinBudget)); setEditMinBudget(""); }}>
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Stats */}
            {(() => {
              const bonuses = admin.referralBonuses || [];
              const totalBonuses = bonuses.length;
              const totalCreditsAwarded = bonuses.reduce((s, b) => s + (b.bonus_amount || 50), 0);
              const usersWithReferrals = admin.profiles.filter(p => p.referred_by).length;
              const uniqueReferrers = new Set(bonuses.map(b => b.referrer_id)).size;

              const totalPages = Math.max(1, Math.ceil(bonuses.length / REF_PER_PAGE));
              const safePage = Math.min(refPage, totalPages);
              const paginated = bonuses.slice((safePage - 1) * REF_PER_PAGE, safePage * REF_PER_PAGE);

              return (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Gift, label: "Total Bonuses", value: totalBonuses, color: "text-primary" },
                      { icon: Banknote, label: "Credits Awarded", value: totalCreditsAwarded, color: "text-success" },
                      { icon: Users, label: "Referred Users", value: usersWithReferrals, color: "text-secondary" },
                      { icon: TrendingUp, label: "Active Referrers", value: uniqueReferrers, color: "text-warning" },
                    ].map(s => (
                      <Card key={s.label} className="border-border">
                        <CardContent className="p-4">
                          <s.icon className={cn("h-5 w-5 mb-2", s.color)} />
                          <p className="text-xl font-bold text-foreground">{s.value}</p>
                          <p className="text-[11px] text-muted-foreground">{s.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Top Referrers */}
                  {(() => {
                    const referrerCounts: Record<string, { count: number; earned: number }> = {};
                    bonuses.forEach(b => {
                      if (!referrerCounts[b.referrer_id]) referrerCounts[b.referrer_id] = { count: 0, earned: 0 };
                      referrerCounts[b.referrer_id].count++;
                      referrerCounts[b.referrer_id].earned += b.bonus_amount || 50;
                    });
                    const topReferrers = Object.entries(referrerCounts)
                      .sort((a, b) => b[1].count - a[1].count)
                      .slice(0, 5);

                    if (topReferrers.length === 0) return null;
                    return (
                      <Card className="border-border">
                        <CardContent className="p-4">
                          <h3 className="text-sm font-semibold text-foreground mb-3">Top Referrers</h3>
                          <div className="space-y-2">
                            {topReferrers.map(([userId, data], i) => {
                              const profile = admin.profiles.find(p => p.id === userId);
                              return (
                                <div key={userId} className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                                    {profile?.name?.[0]?.toUpperCase() || "?"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{profile?.name || "Unknown"}</p>
                                    <p className="text-[10px] text-muted-foreground">{data.count} referrals • {data.earned} credits earned</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}

                  {/* Bonus History */}
                  <h3 className="text-sm font-semibold text-foreground">Bonus History</h3>
                  {paginated.map(b => {
                    const referrer = admin.profiles.find(p => p.id === b.referrer_id);
                    const referred = admin.profiles.find(p => p.id === b.referred_id);
                    return (
                      <Card key={b.id} className="border-border">
                        <CardContent className="p-3.5">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                <Gift className="h-3.5 w-3.5 inline mr-1 text-primary" />
                                {referrer?.name || "Unknown"} earned {b.bonus_amount || 50} credits
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Referred: {referred?.name || "Unknown"} • Trigger: <span className="capitalize font-medium text-foreground">{b.trigger_type?.replace("_", " ")}</span>
                              </p>
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {bonuses.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No referral bonuses yet</p>}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" disabled={safePage <= 1} onClick={() => setRefPage(safePage - 1)}>
                        <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                      </Button>
                      <span className="text-xs text-muted-foreground">Page {safePage} of {totalPages}</span>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" disabled={safePage >= totalPages} onClick={() => setRefPage(safePage + 1)}>
                        Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* ADD CREDITS DIALOG */}
      <Dialog open={!!addCreditsDialog} onOpenChange={() => setAddCreditsDialog(null)}>
        <DialogContent className="rounded-2xl mx-4">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Credits Manually</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              To: <span className="font-medium text-foreground">{admin.profiles.find(p => p.id === addCreditsDialog)?.name}</span>
            </p>
            <Input type="number" placeholder="Amount (credits)" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} className="h-10 rounded-xl" />
            <Select value={creditMethod} onValueChange={setCreditMethod}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Transaction Reference / TxID" value={creditRef} onChange={e => setCreditRef(e.target.value)} className="h-10 rounded-xl" />
            <Input placeholder="Notes (optional)" value={creditNotes} onChange={e => setCreditNotes(e.target.value)} className="h-10 rounded-xl" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCreditsDialog(null)} className="rounded-xl">Cancel</Button>
            <Button className="rounded-xl gradient-primary text-primary-foreground" disabled={!creditAmount || parseInt(creditAmount) <= 0} onClick={handleAddCredits}>
              Add {creditAmount || 0} Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* USER DETAIL DIALOG */}
      <Dialog open={!!userDetailDialog} onOpenChange={() => setUserDetailDialog(null)}>
        <DialogContent className="rounded-2xl mx-4">
          <DialogHeader>
            <DialogTitle className="text-foreground">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">{selectedUser.name[0]?.toUpperCase()}</div>
                <div>
                  <p className="font-semibold text-foreground">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Credits", value: selectedUser.credits },
                  { label: "Tasks Done", value: selectedUser.tasks_completed },
                  { label: "Campaigns", value: selectedUser.campaigns_run },
                  { label: "Total Earned", value: selectedUser.total_earned },
                ].map(s => (
                  <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Trust Score</label>
                <div className="flex gap-2">
                  <Input type="number" value={editTrust} onChange={e => setEditTrust(e.target.value)} className="h-9 rounded-xl flex-1" min={0} max={100} />
                  <Button size="sm" className="h-9 rounded-xl" onClick={() => { admin.updateUserTrustScore(selectedUser.id, parseInt(editTrust)); setUserDetailDialog(null); }}>
                    Save
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">Joined: {new Date(selectedUser.joined_date).toLocaleDateString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
