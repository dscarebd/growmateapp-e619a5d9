import { useNavigate } from "react-router-dom";
import { Lock, Smartphone, KeyRound, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const SecurityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <div>
          <h1 className="text-lg font-bold text-primary-foreground">Security</h1>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-4">
        <Card className="border-border">
          <CardContent className="p-4 space-y-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</h3>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-[11px] text-muted-foreground">{user?.email || "Not set"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Change Password</p>
                  <p className="text-[11px] text-muted-foreground">Update your account password</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="rounded-xl text-xs h-8">Update</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 space-y-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Protection</h3>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-[11px] text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Login Alerts</p>
                  <p className="text-[11px] text-muted-foreground">Get notified of new sign-ins</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 space-y-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sessions</h3>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Active Sessions</p>
                <p className="text-[11px] text-muted-foreground">1 device currently signed in</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-xl text-xs h-8 text-destructive border-destructive/30">Sign Out All</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityPage;
