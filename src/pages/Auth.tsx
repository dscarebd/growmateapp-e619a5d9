import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { generateDeviceFingerprint } from "@/lib/deviceFingerprint";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      // Device fingerprint check
      const fingerprint = generateDeviceFingerprint();
      const { data: exists } = await supabase.rpc("check_device_fingerprint", { _fingerprint: fingerprint });
      if (exists) {
        toast.error("This device already has an account. Multiple accounts are not allowed.");
        setLoading(false);
        return;
      }

      const { error } = await signUp(email, password, name, referralCode.trim() || undefined, fingerprint);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success("Account created successfully!");
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
        <div className="relative">
          <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-0 pr-12" required minLength={6} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
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
