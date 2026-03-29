import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success("Check your email to confirm your account!");
      setLoading(false);
      return;
    }

    navigate("/home", { replace: true });
    setLoading(false);
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
          <Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-0" required />
        )}
        <Input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-0" required />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-0" required minLength={6} />
        <Button type="submit" disabled={loading} className="h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-base mt-2">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isLogin ? "Sign In" : "Sign Up"}
        </Button>
      </form>

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
