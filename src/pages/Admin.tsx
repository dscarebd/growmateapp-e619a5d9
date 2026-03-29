import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Megaphone, Banknote, TrendingUp, Shield, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
                    <div className="flex items-center gap-1">
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      <span className="text-[10px] text-success font-semibold">{s.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3">Revenue Trend (7 days)</h3>
                <div className="flex items-end gap-1 h-24">
                  {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                    <div key={i} className="flex-1 gradient-primary rounded-t-sm transition-all" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <span key={d}>{d}</span>)}
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
                    <p className="text-[11px] text-muted-foreground">{c.platform} • {c.rewardPerAction} credits/action • {c.completedActions}/{c.estimatedReach}</p>
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
                  <p className="text-[11px] text-muted-foreground">{w.method} • Net: ${w.netAmount} • {w.requestedAt}</p>
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
