import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Copy, Sparkles, CheckCircle, Clock, XCircle, Zap, Crown, Gem, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CREDITS_PER_DOLLAR = 100;

const packs = [
  { id: "starter", label: "Starter", credits: 100, price: 1, icon: Zap, color: "from-blue-500 to-cyan-400", popular: false },
  { id: "basic", label: "Basic", credits: 500, price: 5, icon: Coins, color: "from-emerald-500 to-green-400", popular: false },
  { id: "popular", label: "Popular", credits: 1000, price: 10, icon: Sparkles, color: "from-primary to-purple-500", popular: true },
  { id: "pro", label: "Pro", credits: 2500, price: 25, icon: Rocket, color: "from-orange-500 to-amber-400", popular: false },
  { id: "premium", label: "Premium", credits: 5000, price: 50, icon: Crown, color: "from-yellow-500 to-orange-400", popular: false },
  { id: "elite", label: "Elite", credits: 10000, price: 100, icon: Gem, color: "from-pink-500 to-rose-400", popular: false },
];

const FALLBACK_METHODS = [
  { id: "bKash", label: "bKash", instructions: "Send payment to:", detail: "01XXXXXXXXX", note: "Use 'Send Money' option. Personal number." },
  { id: "Nagad", label: "Nagad", instructions: "Send payment to:", detail: "01XXXXXXXXX", note: "Use 'Send Money' from Nagad app." },
  { id: "Bank Transfer", label: "Bank Transfer", instructions: "Transfer to:", detail: "AC: 1234567890 • Bank: Example Bank • Branch: Main", note: "Include your username in the reference." },
  { id: "Binance", label: "Binance", instructions: "Send USDT (TRC20) to:", detail: "TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", note: "Only send USDT via TRC20 network. Other tokens will be lost." },
];

const BuyCredits = () => {
  const { user: authUser } = useAuth();
  const { credits, refreshData } = useApp();
  const navigate = useNavigate();

  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [step, setStep] = useState<"packs" | "payment">("packs");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [myPayments, setMyPayments] = useState<any[]>([]);
  const [paymentsLoaded, setPaymentsLoaded] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(FALLBACK_METHODS);

  useEffect(() => {
    const fetchMethods = async () => {
      const { data } = await supabase.from("payment_methods" as any).select("*").eq("is_active", true).order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        const methods = data.map((m: any) => ({ id: m.name, label: m.name, instructions: m.instructions, detail: m.detail, note: m.note }));
        setPaymentMethods(methods);
        if (!paymentMethod) setPaymentMethod(methods[0].id);
      } else {
        setPaymentMethod(FALLBACK_METHODS[0].id);
      }
    };
    fetchMethods();
  }, []);

  const getSelectedCredits = () => {
    if (selectedPack === "custom") return parseInt(customAmount) || 0;
    return packs.find(p => p.id === selectedPack)?.credits || 0;
  };

  const getSelectedPrice = () => {
    const c = getSelectedCredits();
    return (c / CREDITS_PER_DOLLAR).toFixed(2);
  };

  const loadMyPayments = async () => {
    if (!authUser || paymentsLoaded) return;
    const { data } = await supabase
      .from("manual_payments")
      .select("*")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setMyPayments(data);
    setPaymentsLoaded(true);
  };

  const handleSubmitPayment = async () => {
    if (!authUser) return;
    const amount = getSelectedCredits();
    if (!amount || amount < 1) {
      toast.error("Select a valid pack");
      return;
    }
    if (!transactionRef.trim()) {
      toast.error("Enter the transaction reference");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("manual_payments").insert({
      user_id: authUser.id,
      amount,
      method: paymentMethod,
      transaction_ref: transactionRef.trim(),
      status: "pending",
    });
    if (error) {
      toast.error("Failed to submit payment request");
    } else {
      toast.success("Payment request submitted! Awaiting approval.");
      setTransactionRef("");
      setStep("packs");
      setSelectedPack(null);
      setCustomAmount("");
      setPaymentsLoaded(false);
      loadMyPayments();
      refreshData();
    }
    setSubmitting(false);
  };

  if (!paymentsLoaded) loadMyPayments();

  const statusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle className="h-4 w-4 text-success" />;
    if (status === "pending") return <Clock className="h-4 w-4 text-warning" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <h1 className="text-xl font-bold text-primary-foreground mb-4">Buy Credits</h1>
        <div className="flex items-center gap-3 bg-white/15 rounded-2xl p-3.5 backdrop-blur-sm">
          <Coins className="h-6 w-6 text-primary-foreground" />
          <div>
            <p className="text-xs text-primary-foreground/70">Current Balance</p>
            <p className="text-2xl font-bold text-primary-foreground">{credits.toLocaleString()} <span className="text-sm font-normal">credits</span></p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        {step === "packs" && (
          <div className="space-y-4 animate-fade-in">
            {/* Exchange rate */}
            <div className="rounded-xl bg-accent/50 border border-border p-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Exchange Rate</span>
              <span className="text-sm font-bold text-primary">$1 = {CREDITS_PER_DOLLAR} Credits</span>
            </div>

            {/* Packs grid */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Choose a Pack</Label>
              <div className="grid grid-cols-2 gap-3">
                {packs.map(pack => {
                  const Icon = pack.icon;
                  return (
                    <button
                      key={pack.id}
                      onClick={() => { setSelectedPack(pack.id); setCustomAmount(""); }}
                      className={cn(
                        "relative p-3.5 rounded-2xl border-2 text-left transition-all",
                        selectedPack === pack.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      )}
                    >
                      {pack.popular && (
                        <span className="absolute -top-2.5 right-2 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full">BEST VALUE</span>
                      )}
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br mb-2", pack.color)}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm font-bold text-foreground">{pack.credits.toLocaleString()}</p>
                      <p className="text-[11px] text-muted-foreground">credits</p>
                      <p className="text-base font-bold text-primary mt-1">${pack.price}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom amount */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Or enter custom amount</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="e.g. 750"
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setSelectedPack("custom"); }}
                  className="rounded-xl flex-1"
                  min={1}
                />
                <div className="flex items-center px-3 rounded-xl bg-accent/50 border border-border">
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    = ${((parseInt(customAmount) || 0) / CREDITS_PER_DOLLAR).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Continue button */}
            <Button
              onClick={() => {
                if (!getSelectedCredits()) {
                  toast.error("Select a pack or enter a custom amount");
                  return;
                }
                setStep("payment");
              }}
              disabled={!getSelectedCredits()}
              className="w-full gradient-primary text-primary-foreground rounded-xl h-11 text-sm font-semibold"
            >
              Continue — {getSelectedCredits().toLocaleString()} credits for ${getSelectedPrice()}
            </Button>

            {/* Recent payment requests */}
            {myPayments.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-2">Recent Requests</h3>
                <div className="space-y-2">
                  {myPayments.map(p => (
                    <Card key={p.id} className="border-border">
                      <CardContent className="p-3 flex items-center gap-3">
                        {statusIcon(p.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">{p.amount} credits via {p.method}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Ref: {p.transaction_ref}</p>
                        </div>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize",
                          p.status === "approved" ? "bg-success/15 text-success" :
                          p.status === "pending" ? "bg-warning/15 text-warning" :
                          "bg-destructive/15 text-destructive"
                        )}>{p.status}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4 animate-fade-in">
            {/* Order summary */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">You're buying</p>
                  <p className="text-xl font-bold text-foreground">{getSelectedCredits().toLocaleString()} credits</p>
                </div>
                <p className="text-2xl font-bold text-primary">${getSelectedPrice()}</p>
              </CardContent>
            </Card>

            {/* Payment method */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={cn(
                      "py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all",
                      paymentMethod === m.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment details */}
            {(() => {
              const selected = paymentMethods.find(m => m.id === paymentMethod);
              if (!selected) return null;
              return (
                <div className="rounded-xl bg-accent/50 border border-border p-3.5 space-y-2">
                  <p className="text-xs font-semibold text-foreground">{selected.instructions}</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg flex-1 break-all">
                      {selected.detail}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selected.detail);
                        toast.success("Copied!");
                      }}
                      className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{selected.note}</p>
                </div>
              );
            })()}

            {/* Transaction ref */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Transaction Reference / TxID</Label>
              <Input
                placeholder="e.g. TRX123ABC..."
                value={transactionRef}
                onChange={e => setTransactionRef(e.target.value)}
                className="rounded-xl"
                maxLength={200}
              />
            </div>

            <Button
              onClick={handleSubmitPayment}
              disabled={submitting || !transactionRef.trim()}
              className="w-full gradient-primary text-primary-foreground rounded-xl h-11 text-sm font-semibold"
            >
              {submitting ? "Submitting..." : "Submit Payment Request"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyCredits;
