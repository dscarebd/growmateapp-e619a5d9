import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Coins, Megaphone, TrendingUp } from "lucide-react";

const steps = [
  { icon: Coins, title: "Earn Credits", desc: "Complete simple social media tasks and earn credits instantly. Like, follow, and subscribe to grow your balance.", color: "text-primary" },
  { icon: Megaphone, title: "Run Campaigns", desc: "Spend your credits to promote your own content. Set your own bid and watch your audience grow.", color: "text-secondary" },
  { icon: TrendingUp, title: "Grow Fast", desc: "Our dynamic bidding system ensures the best visibility. Higher bids get more engagement — you're in control.", color: "text-success" },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    navigate("/auth", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="sm" onClick={finish} className="text-muted-foreground">Skip</Button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <div className="animate-fade-in-up" key={step}>
          <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-accent">
            {(() => { const Icon = steps[step].icon; return <Icon className={`h-14 w-14 ${steps[step].color}`} />; })()}
          </div>
          <h2 className="mb-3 text-center text-2xl font-bold text-foreground">{steps[step].title}</h2>
          <p className="text-center text-muted-foreground leading-relaxed max-w-xs mx-auto">{steps[step].desc}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 px-8 pb-12">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-primary" : "w-2 bg-muted"}`} />
          ))}
        </div>
        <Button className="w-full gradient-primary text-primary-foreground h-12 rounded-xl text-base font-semibold" onClick={() => step < 2 ? setStep(step + 1) : finish()}>
          {step < 2 ? "Next" : "Get Started"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
