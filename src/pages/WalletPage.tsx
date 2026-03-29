import { useState } from "react";
import { useApp, TransactionType } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ArrowUpRight, ArrowDownLeft, ShoppingCart, CreditCard, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

const txIcon: Record<TransactionType, typeof ArrowUpRight> = { earned: ArrowDownLeft, spent: ArrowUpRight, purchased: ShoppingCart, withdrawn: Banknote };
const txColor: Record<TransactionType, string> = { earned: "text-success", spent: "text-destructive", purchased: "text-primary", withdrawn: "text-warning" };

const packages = [
  { credits: 500, price: "$4.99", popular: false },
  { credits: 1200, price: "$9.99", popular: true },
  { credits: 3000, price: "$19.99", popular: false },
  { credits: 8000, price: "$39.99", popular: false },
];

const WalletPage = () => {
  const { credits, transactions, withdrawals } = useApp();
  const [tab, setTab] = useState<"history" | "buy" | "withdraw">("history");

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
                      <p className="text-[11px] text-muted-foreground">{tx.date}</p>
                    </div>
                    <span className={cn("text-sm font-bold", tx.type === "earned" || tx.type === "purchased" ? "text-success" : "text-destructive")}>
                      {tx.type === "earned" || tx.type === "purchased" ? "+" : "-"}{Math.abs(tx.amount)}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {tab === "buy" && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            {packages.map(pkg => (
              <Card key={pkg.credits} className={cn("border-2 hover-scale", pkg.popular ? "border-primary" : "border-border")}>
                <CardContent className="p-4 text-center relative">
                  {pkg.popular && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] gradient-primary text-primary-foreground px-2.5 py-0.5 rounded-full font-bold">POPULAR</span>}
                  <div className="flex items-center justify-center gap-1 mb-1 mt-1">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{pkg.credits.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mb-3">credits</p>
                  <Button size="sm" className={cn("w-full rounded-xl text-xs font-semibold h-9", pkg.popular ? "gradient-primary text-primary-foreground" : "")}>
                    {pkg.price}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {tab === "withdraw" && (
          <div className="space-y-4 animate-fade-in">
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Request Withdrawal</h3>
                <p className="text-xs text-muted-foreground">Minimum: 500 credits • Commission: 15%</p>
                <Button className="w-full gradient-primary text-primary-foreground rounded-xl h-10 text-sm font-semibold">Request Withdrawal</Button>
              </CardContent>
            </Card>
            {withdrawals.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Withdrawal History</h3>
                {withdrawals.map(w => (
                  <Card key={w.id} className="mb-2 border-border">
                    <CardContent className="p-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{w.amount} credits → ${w.netAmount.toFixed(2)}</p>
                        <p className="text-[11px] text-muted-foreground">{w.method} • {w.requestedAt}</p>
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
