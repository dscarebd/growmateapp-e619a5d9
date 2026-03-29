import { useState } from "react";
import { useApp, TransactionType } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Coins, ArrowUpRight, ArrowDownLeft, ShoppingCart, Banknote, CheckCircle, Clock, XCircle, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const txIcon: Record<TransactionType, typeof ArrowUpRight> = { earned: ArrowDownLeft, spent: ArrowUpRight, purchased: ShoppingCart, withdrawn: Banknote };
const txColor: Record<TransactionType, string> = { earned: "text-success", spent: "text-destructive", purchased: "text-primary", withdrawn: "text-warning" };

const paymentMethods = [
  { id: "bKash", label: "bKash", instructions: "Send payment to:", detail: "01XXXXXXXXX", note: "Use 'Send Money' option. Personal number." },
  { id: "Nagad", label: "Nagad", instructions: "Send payment to:", detail: "01XXXXXXXXX", note: "Use 'Send Money' from Nagad app." },
  { id: "Bank Transfer", label: "Bank Transfer", instructions: "Transfer to:", detail: "AC: 1234567890 • Bank: Example Bank • Branch: Main", note: "Include your username in the reference." },
  { id: "Binance", label: "Binance", instructions: "Send USDT (TRC20) to:", detail: "TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", note: "Only send USDT via TRC20 network. Other tokens will be lost." },
] as const;

const WalletPage = () => {
  const { credits, transactions, withdrawals, refreshData } = useApp();
  const { user: authUser } = useAuth();
  const [tab, setTab] = useState<"history" | "buy" | "withdraw">("history");
  const [paymentMethod, setPaymentMethod] = useState<string>("bKash");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bKash");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [myPayments, setMyPayments] = useState<any[]>([]);
  const [paymentsLoaded, setPaymentsLoaded] = useState(false);

  const CREDITS_PER_DOLLAR = 100;
  const COMMISSION_RATE = 0.15;
  const MIN_WITHDRAWAL = 500;
  const withdrawNum = parseInt(withdrawAmount) || 0;
  const commission = Math.round(withdrawNum * COMMISSION_RATE);
  const netAmount = withdrawNum - commission;

  const loadMyPayments = async () => {
    if (!authUser || paymentsLoaded) return;
    const { data } = await supabase
      .from("manual_payments")
      .select("*")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: false });
    if (data) setMyPayments(data);
    setPaymentsLoaded(true);
  };

  const handleSubmitPayment = async () => {
    if (!authUser) return;
    const amount = parseInt(paymentAmount);
    if (!amount || amount < 1) {
      toast.error("Enter a valid amount");
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
      toast.success("Payment request submitted! Awaiting admin approval.");
      setPaymentAmount("");
      setTransactionRef("");
      setPaymentsLoaded(false);
      loadMyPayments();
    }
    setSubmitting(false);
  };

  // Load payments when switching to buy tab
  if (tab === "buy" && !paymentsLoaded) {
    loadMyPayments();
  }

  const statusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle className="h-4 w-4 text-success" />;
    if (status === "pending") return <Clock className="h-4 w-4 text-warning" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-8 pt-12 rounded-b-3xl">
        <h1 className="text-xl font-bold text-primary-foreground mb-4">Wallet</h1>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Available Balance</p>
              <p className="text-3xl font-bold text-foreground">{credits.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">credits</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
              <Coins className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-5 mt-5">
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-5">
          {(["history", "buy", "withdraw"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={cn("flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all capitalize", tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>
              {t === "buy" ? "Buy Credits" : t === "withdraw" ? "Withdraw" : "History"}
            </button>
          ))}
        </div>

        {tab === "history" && (
          <div className="space-y-2 animate-fade-in">
            {transactions.map(tx => {
              const Icon = txIcon[tx.type];
              return (
                <Card key={tx.id} className="border-border">
                  <CardContent className="p-3.5 flex items-center gap-3">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-muted", txColor[tx.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                      <p className="text-[11px] text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={cn("text-sm font-bold", tx.type === "earned" || tx.type === "purchased" ? "text-success" : "text-destructive")}>
                      {tx.type === "earned" || tx.type === "purchased" ? "+" : "-"}{Math.abs(tx.amount)}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
            {transactions.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>}
          </div>
        )}

        {tab === "buy" && (
          <div className="space-y-4 animate-fade-in">
            <Card className="border-border">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Submit Manual Payment</h3>
                <p className="text-xs text-muted-foreground">Send payment via one of the methods below, then submit the details for admin approval.</p>
                <div className="rounded-xl bg-accent/50 border border-border p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Exchange Rate</span>
                  <span className="text-sm font-bold text-primary">$1 = {CREDITS_PER_DOLLAR} Credits</span>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Payment Method</Label>
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

                <div className="space-y-1.5">
                  <Label className="text-xs">Amount (credits)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    className="rounded-xl"
                    min={1}
                  />
                  {parseInt(paymentAmount) > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      You pay: <span className="font-semibold text-foreground">${(parseInt(paymentAmount) / CREDITS_PER_DOLLAR).toFixed(2)}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Transaction Reference / TxID</Label>
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
                  disabled={submitting}
                  className="w-full gradient-primary text-primary-foreground rounded-xl h-10 text-sm font-semibold"
                >
                  {submitting ? "Submitting..." : "Submit Payment Request"}
                </Button>
              </CardContent>
            </Card>

            {myPayments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Your Payment Requests</h3>
                {myPayments.map(p => (
                  <Card key={p.id} className="mb-2 border-border">
                    <CardContent className="p-3.5 flex items-center gap-3">
                      {statusIcon(p.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{p.amount} credits via {p.method}</p>
                        <p className="text-[11px] text-muted-foreground">Ref: {p.transaction_ref} • {new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full capitalize",
                        p.status === "approved" ? "bg-success/15 text-success" :
                        p.status === "pending" ? "bg-warning/15 text-warning" :
                        "bg-destructive/15 text-destructive"
                      )}>{p.status}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "withdraw" && (
          <div className="space-y-4 animate-fade-in">
            <Card className="border-border">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Request Withdrawal</h3>
                <p className="text-xs text-muted-foreground">Minimum: {MIN_WITHDRAWAL} credits • Commission: {COMMISSION_RATE * 100}%</p>

                <div className="space-y-1.5">
                  <Label className="text-xs">Withdrawal Method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["bKash", "Nagad", "Bank Transfer", "Binance"].map(m => (
                      <button
                        key={m}
                        onClick={() => setWithdrawMethod(m)}
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all",
                          withdrawMethod === m
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Account / Wallet Address</Label>
                  <Input
                    placeholder={withdrawMethod === "Binance" ? "USDT TRC20 address" : withdrawMethod === "Bank Transfer" ? "Account number & bank name" : `${withdrawMethod} number`}
                    value={withdrawAccount}
                    onChange={e => setWithdrawAccount(e.target.value)}
                    className="rounded-xl"
                    maxLength={200}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Amount (credits)</Label>
                  <Input
                    type="number"
                    placeholder={`Min ${MIN_WITHDRAWAL}`}
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    className="rounded-xl"
                    min={MIN_WITHDRAWAL}
                    max={credits}
                  />
                </div>

                {withdrawNum > 0 && (
                  <div className="rounded-xl bg-accent/50 border border-border p-3.5 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="text-foreground font-medium">{withdrawNum} credits</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Commission ({COMMISSION_RATE * 100}%)</span>
                      <span className="text-destructive font-medium">-{commission} credits</span>
                    </div>
                    <div className="border-t border-border pt-1.5 flex justify-between text-sm">
                      <span className="text-foreground font-semibold">You receive</span>
                      <span className="text-success font-bold">{netAmount} credits</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    if (!authUser) return;
                    if (withdrawNum < MIN_WITHDRAWAL) {
                      toast.error(`Minimum withdrawal is ${MIN_WITHDRAWAL} credits`);
                      return;
                    }
                    if (withdrawNum > credits) {
                      toast.error("Insufficient balance");
                      return;
                    }
                    if (!withdrawAccount.trim()) {
                      toast.error("Enter your account details");
                      return;
                    }
                    setShowWithdrawConfirm(true);
                  }}
                  disabled={withdrawSubmitting || withdrawNum < MIN_WITHDRAWAL || withdrawNum > credits}
                  className="w-full gradient-primary text-primary-foreground rounded-xl h-10 text-sm font-semibold"
                >
                  {withdrawSubmitting ? "Submitting..." : "Request Withdrawal"}
                </Button>

                <AlertDialog open={showWithdrawConfirm} onOpenChange={setShowWithdrawConfirm}>
                  <AlertDialogContent className="max-w-[340px] rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Withdrawal</AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className="space-y-2">
                          <p>Are you sure you want to withdraw?</p>
                          <div className="rounded-lg bg-accent/50 border border-border p-3 space-y-1 text-xs">
                            <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium text-foreground">{withdrawNum} credits</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Commission ({COMMISSION_RATE * 100}%)</span><span className="text-destructive font-medium">-{commission} credits</span></div>
                            <div className="border-t border-border pt-1 flex justify-between"><span className="font-semibold text-foreground">You receive</span><span className="text-success font-bold">{netAmount} credits</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-medium text-foreground">{withdrawMethod}</span></div>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          if (!authUser) return;
                          setWithdrawSubmitting(true);
                          const { error } = await supabase.from("withdrawals").insert({
                            user_id: authUser.id,
                            amount: withdrawNum,
                            commission,
                            net_amount: netAmount,
                            method: `${withdrawMethod}: ${withdrawAccount.trim()}`,
                            status: "pending",
                          });
                          if (error) {
                            toast.error("Failed to submit withdrawal request");
                          } else {
                            const newCredits = credits - withdrawNum;
                            await supabase.from("profiles").update({ credits: newCredits }).eq("id", authUser.id);
                            await supabase.from("transactions").insert({
                              user_id: authUser.id,
                              type: "withdrawn" as const,
                              amount: withdrawNum,
                              description: `Withdrawal via ${withdrawMethod}`,
                            });
                            toast.success("Withdrawal request submitted!");
                            setWithdrawAmount("");
                            setWithdrawAccount("");
                            refreshData();
                          }
                          setWithdrawSubmitting(false);
                        }}
                        className="bg-primary text-primary-foreground"
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
            {withdrawals.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Withdrawal History</h3>
                {withdrawals.map(w => (
                  <Card key={w.id} className="mb-2 border-border">
                    <CardContent className="p-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{w.amount} credits → {Number(w.net_amount)} credits</p>
                        <p className="text-[11px] text-muted-foreground">{w.method} • {new Date(w.requested_at).toLocaleDateString()}</p>
                      </div>
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full capitalize",
                        w.status === "approved" ? "bg-success/15 text-success" :
                        w.status === "pending" ? "bg-warning/15 text-warning" :
                        "bg-destructive/15 text-destructive"
                      )}>{w.status}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
