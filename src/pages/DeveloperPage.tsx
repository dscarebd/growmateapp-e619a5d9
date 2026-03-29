import { useNavigate } from "react-router-dom";
import { Globe, Mail, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import annurLogo from "@/assets/annur-logo.jpeg";

const DeveloperPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = useCallback(async () => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => { tapCountRef.current = 0; }, 2000);

    if (tapCountRef.current >= 7) {
      tapCountRef.current = 0;
      if (!user) return;
      const { data } = await supabase.rpc("is_admin", { _user_id: user.id } as any);
      if (data) {
        navigate("/admin");
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <div>
          <h1 className="text-lg font-bold text-primary-foreground">Developer</h1>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-4">
        <Card className="border-border">
          <CardContent className="p-5 text-center space-y-3">
            <button
              onClick={handleLogoTap}
              className="mx-auto block rounded-2xl overflow-hidden h-20 w-20 active:scale-95 transition-transform select-none"
            >
              <img src={annurLogo} alt="An-Nur Digital" className="h-full w-full object-contain" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-foreground">An-Nur Digital</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 space-y-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This platform connects content creators and social media enthusiasts. Earn credits by engaging with content, or promote your own by creating campaigns.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 space-y-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Contact</h3>
            <div className="space-y-0">
              <a href="mailto:support@annurdigital.com" className="flex items-center gap-3 py-3 border-b border-border/50 active:bg-muted/50 transition-colors rounded-lg px-1 -mx-1">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email Support</p>
                  <p className="text-[11px] text-primary">support@annurdigital.com</p>
                </div>
              </a>
              <a href="https://annurdigital.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-3 border-b border-border/50 active:bg-muted/50 transition-colors rounded-lg px-1 -mx-1">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Website</p>
                  <p className="text-[11px] text-primary">annurdigital.com</p>
                </div>
              </a>
              <a href="https://t.me/nuralamin_official" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-3 active:bg-muted/50 transition-colors rounded-lg px-1 -mx-1">
                <Send className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Telegram</p>
                  <p className="text-[11px] text-primary">@nuralamin_official</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default DeveloperPage;
