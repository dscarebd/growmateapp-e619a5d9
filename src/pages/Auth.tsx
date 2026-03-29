import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated, setHasOnboarded } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setHasOnboarded(true);
    navigate("/home", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-16">
      <div className="animate-fade-in flex flex-col items-center mb-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary mb-4">
          <Zap className="h-8 w-8 text-primary-foreground" fill="currentColor" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className="text-muted-foreground text-sm mt-1">{isLogin ? "Sign in to continue" : "Join Boostly today"}</p>
      </div>

      <form onSubmit={handleSubmit} className="animate-fade-in-up flex flex-col gap-4 max-w-sm mx-auto w-full">
        {!isLogin && (
          <Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-0" />
        )}
        <Input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-0" />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-0" />
        <Button type="submit" className="h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-base mt-2">
          {isLogin ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3 max-w-sm mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-12 rounded-xl">Google</Button>
          <Button variant="outline" className="flex-1 h-12 rounded-xl">Apple</Button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button className="text-primary font-semibold" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
