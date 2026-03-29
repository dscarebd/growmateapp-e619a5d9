import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  credits: number;
  tasks_completed: number;
  campaigns_run: number;
  total_earned: number;
  trust_score: number;
  joined_date: string;
  avatar_url: string | null;
}

export interface AdminCampaign {
  id: string;
  user_id: string;
  title: string;
  platform: string;
  action: string;
  link: string;
  total_budget: number;
  reward_per_action: number;
  completed_actions: number;
  estimated_reach: number;
  status: string;
  created_at: string;
}

export interface AdminWithdrawal {
  id: string;
  user_id: string;
  amount: number;
  commission: number;
  net_amount: number;
  method: string;
  status: string;
  requested_at: string;
}

export interface ManualPayment {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  transaction_ref: string;
  status: string;
  notes: string;
  approved_by: string | null;
  created_at: string;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const checkAdmin = useCallback(async () => {
    if (!user) { setIsAdmin(false); setLoading(false); return; }
    const { data } = await supabase.rpc("is_admin", { _user_id: user.id } as any);
    setIsAdmin(!!data);
    setLoading(false);
  }, [user]);

  const fetchAll = useCallback(async () => {
    if (!isAdmin) return;
    const [pRes, cRes, wRes, pmRes, tRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("withdrawals").select("*").order("requested_at", { ascending: false }),
      supabase.from("manual_payments").select("*").order("created_at", { ascending: false }) as any,
      supabase.from("transactions").select("*").order("created_at", { ascending: false }),
    ]);
    if (pRes.data) setProfiles(pRes.data as AdminProfile[]);
    if (cRes.data) setCampaigns(cRes.data as AdminCampaign[]);
    if (wRes.data) setWithdrawals(wRes.data as AdminWithdrawal[]);
    if (pmRes.data) setPayments(pmRes.data as ManualPayment[]);
    if (tRes.data) setTransactions(tRes.data);
  }, [isAdmin]);

  useEffect(() => { checkAdmin(); }, [checkAdmin]);
  useEffect(() => { if (isAdmin) fetchAll(); }, [isAdmin, fetchAll]);

  // Campaign actions
  const updateCampaignStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("campaigns").update({ status } as any).eq("id", id);
    if (error) { toast.error("Failed to update campaign"); return; }
    toast.success(`Campaign ${status}`);
    fetchAll();
  };

  // Withdrawal actions
  const updateWithdrawalStatus = async (id: string, status: string) => {
    const withdrawal = withdrawals.find(w => w.id === id);
    const { error } = await supabase.from("withdrawals").update({ status } as any).eq("id", id);
    if (error) { toast.error("Failed to update withdrawal"); return; }

    if (withdrawal) {
      const profile = profiles.find(p => p.id === withdrawal.user_id);

      // Refund credits on rejection
      if (status === "rejected" && profile) {
        await supabase.from("profiles").update({ credits: profile.credits + withdrawal.amount }).eq("id", withdrawal.user_id);
        // Remove the withdrawn transaction
        await supabase.from("transactions").insert({
          user_id: withdrawal.user_id,
          type: "purchased" as any,
          amount: withdrawal.amount,
          description: `Refund: Withdrawal rejected (${withdrawal.method})`,
        });
      }

      // Send notification
      const messages: Record<string, { title: string; message: string; icon: string }> = {
        approved: { title: "Withdrawal Approved!", message: `Your withdrawal of ${withdrawal.amount} credits via ${withdrawal.method} has been approved.`, icon: "✅" },
        rejected: { title: "Withdrawal Rejected", message: `Your withdrawal of ${withdrawal.amount} credits was rejected. Credits have been refunded.`, icon: "❌" },
        processing: { title: "Withdrawal Processing", message: `Your withdrawal of ${withdrawal.amount} credits is being processed.`, icon: "⏳" },
      };
      const notif = messages[status];
      if (notif) {
        await supabase.from("notifications").insert({
          user_id: withdrawal.user_id,
          type: "withdrawal",
          ...notif,
        });
      }
    }

    toast.success(`Withdrawal ${status}`);
    fetchAll();
  };

  // User actions
  const updateUserCredits = async (userId: string, credits: number) => {
    const { error } = await supabase.from("profiles").update({ credits }).eq("id", userId);
    if (error) { toast.error("Failed to update credits"); return; }
    toast.success("Credits updated");
    fetchAll();
  };

  const updateUserTrustScore = async (userId: string, trust_score: number) => {
    const { error } = await supabase.from("profiles").update({ trust_score }).eq("id", userId);
    if (error) { toast.error("Failed to update trust score"); return; }
    toast.success("Trust score updated");
    fetchAll();
  };

  // Manual payment actions
  const approvePayment = async (payment: ManualPayment) => {
    if (!user) return;
    // Update payment status
    const { error: pmError } = await supabase.from("manual_payments" as any).update({
      status: "approved",
      approved_by: user.id,
    }).eq("id", payment.id);
    if (pmError) { toast.error("Failed to approve payment"); return; }

    // Add credits to user
    const profile = profiles.find(p => p.id === payment.user_id);
    if (profile) {
      await supabase.from("profiles").update({ credits: profile.credits + payment.amount }).eq("id", payment.user_id);
    }

    // Create transaction record
    await supabase.from("transactions").insert({
      user_id: payment.user_id,
      type: "purchased" as any,
      amount: payment.amount,
      description: `Manual payment via ${payment.method} (Ref: ${payment.transaction_ref})`,
    });

    // Notify user
    await supabase.from("notifications").insert({
      user_id: payment.user_id,
      type: "payment",
      title: "Payment Approved!",
      message: `Your ${payment.method} payment of ${payment.amount} credits has been approved.`,
      icon: "💰",
    });

    toast.success("Payment approved & credits added");
    fetchAll();
  };

  const rejectPayment = async (paymentId: string) => {
    if (!user) return;
    const payment = payments.find(p => p.id === paymentId);
    const { error } = await supabase.from("manual_payments" as any).update({
      status: "rejected",
      approved_by: user.id,
    }).eq("id", paymentId);
    if (error) { toast.error("Failed to reject payment"); return; }

    if (payment) {
      await supabase.from("notifications").insert({
        user_id: payment.user_id,
        type: "payment",
        title: "Payment Rejected",
        message: `Your ${payment.method} payment request was rejected. Please contact support.`,
        icon: "❌",
      });
    }

    toast.success("Payment rejected");
    fetchAll();
  };

  // Admin manually adds credits
  const addCreditsManually = async (userId: string, amount: number, method: string, transactionRef: string, notes: string) => {
    if (!user) return;
    const profile = profiles.find(p => p.id === userId);
    if (!profile) { toast.error("User not found"); return; }

    // Add credits
    await supabase.from("profiles").update({ credits: profile.credits + amount }).eq("id", userId);

    // Create transaction
    await supabase.from("transactions").insert({
      user_id: userId,
      type: "purchased" as any,
      amount,
      description: `Admin credit: ${method} (Ref: ${transactionRef}) ${notes}`,
    });

    // Create payment record
    await supabase.from("manual_payments" as any).insert({
      user_id: userId,
      amount,
      method,
      transaction_ref: transactionRef,
      status: "approved",
      approved_by: user.id,
      notes,
    });

    // Notify user
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "payment",
      title: "Credits Added!",
      message: `${amount} credits have been added to your account via ${method}.`,
      icon: "💰",
    });

    toast.success(`${amount} credits added to user`);
    fetchAll();
  };

  return {
    isAdmin, loading, profiles, campaigns, withdrawals, payments, transactions,
    updateCampaignStatus, updateWithdrawalStatus, updateUserCredits, updateUserTrustScore,
    approvePayment, rejectPayment, addCreditsManually, fetchAll,
  };
};
