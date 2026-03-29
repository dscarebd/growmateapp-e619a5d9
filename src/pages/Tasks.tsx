import { useState, ReactNode } from "react";
import { useApp, Platform } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Timer, CheckCircle2, Flame, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon } from "@/components/PlatformIcons";

const platforms: { key: Platform | "all"; label: string; icon: ReactNode }[] = [
  { key: "all", label: "All", icon: <Globe className="h-4 w-4" /> },
  { key: "youtube", label: "YouTube", icon: <YouTubeIcon className="h-4 w-4" /> },
  { key: "instagram", label: "Instagram", icon: <InstagramIcon className="h-4 w-4" /> },
  { key: "tiktok", label: "TikTok", icon: <TikTokIcon className="h-4 w-4" /> },
  { key: "facebook", label: "Facebook", icon: <FacebookIcon className="h-4 w-4" /> },
];

const Tasks = () => {
  const { tasks, completeTask } = useApp();
  const [filter, setFilter] = useState<Platform | "all">("all");
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const filtered = [...tasks]
    .filter(t => filter === "all" || t.platform === filter)
    .sort((a, b) => b.reward - a.reward);

  const startTask = (taskId: string) => {
    setActiveTask(taskId);
    setTimer(5);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyTask = (taskId: string) => {
    completeTask(taskId);
    setCompleted(prev => new Set(prev).add(taskId));
    setActiveTask(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <h1 className="text-xl font-bold text-primary-foreground mb-4">Task Marketplace</h1>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {platforms.map(p => (
            <button key={p.key} onClick={() => setFilter(p.key)}
              className={cn("flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all",
                filter === p.key ? "bg-primary-foreground text-primary shadow-sm" : "bg-primary-foreground/20 text-primary-foreground"
              )}>
              <span>{p.icon}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5 space-y-3">
        {filtered.map((task, i) => {
          const isActive = activeTask === task.id;
          const isDone = completed.has(task.id);
          return (
            <Card key={task.id} className={cn("border-border animate-fade-in-up overflow-hidden", isDone && "opacity-60")} style={{ animationDelay: `${i * 50}ms` }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{platforms.find(p => p.key === task.platform)?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-sm font-semibold text-foreground truncate">{task.title}</h3>
                      {task.is_high_reward && (
                        <span className="flex items-center gap-0.5 text-[10px] bg-warning/15 text-warning font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          <Flame className="h-2.5 w-2.5" /> High
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                      <span className="capitalize">{task.action}</span>
                      <span>•</span>
                      <span>{task.completed_count}/{task.total_slots} done</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-primary">+{task.reward}</p>
                    <p className="text-[10px] text-muted-foreground">credits</p>
                  </div>
                </div>
                {!isDone && (
                  <div className="mt-3 flex gap-2">
                    {!isActive ? (
                      <Button size="sm" className="w-full h-9 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold gap-1.5" onClick={() => startTask(task.id)}>
                        <ExternalLink className="h-3.5 w-3.5" /> Start Task
                      </Button>
                    ) : timer > 0 ? (
                      <Button size="sm" disabled className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5">
                        <Timer className="h-3.5 w-3.5 animate-pulse-soft" /> Verifying... {timer}s
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full h-9 rounded-xl bg-success text-success-foreground text-xs font-semibold gap-1.5" onClick={() => verifyTask(task.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Claim +{task.reward} Credits
                      </Button>
                    )}
                  </div>
                )}
                {isDone && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-success font-semibold">
                    <CheckCircle2 className="h-4 w-4" /> Completed!
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">No tasks available yet</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
