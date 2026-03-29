import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code2, Github, Globe, Mail, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const DeveloperPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors">
            <ArrowLeft className="h-5 w-5 text-primary-foreground" />
          </button>
          <h1 className="text-lg font-bold text-primary-foreground">Developer</h1>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-4">
        <Card className="border-border">
          <CardContent className="p-5 text-center space-y-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">App Info</h2>
              <p className="text-xs text-muted-foreground mt-1">Version 1.0.0 • Build 2026.03</p>
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
              <div className="flex items-center gap-3 py-3 border-b border-border/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email Support</p>
                  <p className="text-[11px] text-muted-foreground">support@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-border/50">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Website</p>
                  <p className="text-[11px] text-muted-foreground">www.example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Github className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">GitHub</p>
                  <p className="text-[11px] text-muted-foreground">Open source contributions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="h-3 w-3 text-destructive" /> by the team
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPage;
