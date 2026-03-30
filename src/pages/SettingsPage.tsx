import { useNavigate } from "react-router-dom";
import { Globe, Bell, Moon, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { preferences, updatePreference } = useNotifications();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <div>
          <h1 className="text-lg font-bold text-primary-foreground">Settings</h1>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-4">
        <Card className="border-border">
          <CardContent className="p-4 space-y-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Appearance</h3>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Dark Mode</p>
                  <p className="text-[11px] text-muted-foreground">Switch between light and dark themes</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Language</p>
                  <p className="text-[11px] text-muted-foreground">English</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 space-y-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notifications</h3>
            {([
              { key: "taskCompleted" as const, label: "Task Completions", desc: "When you earn credits", icon: Bell },
              { key: "campaignUpdates" as const, label: "Campaign Updates", desc: "Progress and milestones", icon: Bell },
              { key: "withdrawalStatus" as const, label: "Withdrawals", desc: "Approval and payout status", icon: Bell },
              { key: "promotions" as const, label: "Promotions", desc: "Special events and offers", icon: Bell },
              { key: "systemAlerts" as const, label: "System Alerts", desc: "Security and trust score", icon: Bell },
            ]).map((pref, i, arr) => (
              <div key={pref.key} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? "border-b border-border/50" : ""}`}>
                <div>
                  <p className="text-sm font-medium text-foreground">{pref.label}</p>
                  <p className="text-[11px] text-muted-foreground">{pref.desc}</p>
                </div>
                <Switch checked={preferences[pref.key]} onCheckedChange={v => updatePreference(pref.key, v)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 space-y-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Privacy</h3>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Profile Visibility</p>
                  <p className="text-[11px] text-muted-foreground">Allow others to see your profile</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
