// App-wide state context
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

export type Platform = "youtube" | "instagram" | "tiktok" | "facebook" | "twitter" | "telegram";
export type TaskAction = "like" | "follow" | "subscribe" | "share" | "comment";
export type CampaignStatus = "active" | "paused" | "completed" | "pending";
export type TransactionType = "earned" | "spent" | "purchased" | "withdrawn";
export type WithdrawalStatus = "pending" | "approved" | "rejected" | "processing";

export type Task = Tables<"tasks">;
export type Campaign = Tables<"campaigns">;
export type Transaction = Tables<"transactions">;
export type WithdrawalRequest = Tables<"withdrawals">;
export type UserProfile = Tables<"profiles">;

interface AppContextType {
  credits: number;
  user: UserProfile | null;
  tasks: Task[];
  campaigns: Campaign[];
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  loading: boolean;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  completeTask: (taskId: string) => void;
  createCampaign: (campaign: { platform: Platform; action: TaskAction; link: string; title: string; totalBudget: number; rewardPerAction: number }) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [credits, setCredits] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!authUser) {
      setProfile(null);
      setCredits(0);
      setTasks([]);
      setCampaigns([]);
      setTransactions([]);
      setWithdrawals([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const [profileRes, tasksRes, campaignsRes, txRes, wdRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", authUser.id).single(),
      supabase.from("tasks").select("*").order("reward", { ascending: false }),
      supabase.from("campaigns").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }),
      supabase.from("withdrawals").select("*").eq("user_id", authUser.id).order("requested_at", { ascending: false }),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setCredits(profileRes.data.credits);
    }
    if (tasksRes.data) setTasks(tasksRes.data);
    if (campaignsRes.data) setCampaigns(campaignsRes.data);
    if (txRes.data) setTransactions(txRes.data);
    if (wdRes.data) setWithdrawals(wdRes.data);

    setLoading(false);
  }, [authUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addCredits = useCallback(async (amount: number) => {
    if (!authUser) return;
    setCredits(prev => prev + amount);
    await supabase.from("profiles").update({ credits: credits + amount }).eq("id", authUser.id);
  }, [authUser, credits]);

  const spendCredits = useCallback((amount: number) => {
    if (credits >= amount && authUser) {
      const newCredits = credits - amount;
      setCredits(newCredits);
      supabase.from("profiles").update({ credits: newCredits }).eq("id", authUser.id);
      return true;
    }
    return false;
  }, [credits, authUser]);

  const completeTask = useCallback(async (taskId: string) => {
    if (!authUser) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Update local state optimistically
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed_count: t.completed_count + 1 } : t));
    setCredits(prev => prev + task.reward);

    // Persist
    await Promise.all([
      supabase.from("tasks").update({ completed_count: task.completed_count + 1 }).eq("id", taskId),
      supabase.from("profiles").update({
        credits: credits + task.reward,
        tasks_completed: (profile?.tasks_completed ?? 0) + 1,
        total_earned: (profile?.total_earned ?? 0) + task.reward,
      }).eq("id", authUser.id),
      supabase.from("transactions").insert({
        user_id: authUser.id,
        type: "earned" as const,
        amount: task.reward,
        description: `${task.action} - ${task.title}`,
        platform: task.platform,
      }),
    ]);

    // Refresh transactions
    const { data } = await supabase.from("transactions").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false });
    if (data) setTransactions(data);
  }, [authUser, tasks, credits, profile]);

  const createCampaign = useCallback(async (campaign: { platform: Platform; action: TaskAction; link: string; title: string; totalBudget: number; rewardPerAction: number }) => {
    if (!authUser) return;
    const estimatedReach = Math.floor(campaign.totalBudget / campaign.rewardPerAction);

    const { data: newCampaign } = await supabase.from("campaigns").insert({
      user_id: authUser.id,
      platform: campaign.platform,
      action: campaign.action,
      link: campaign.link,
      title: campaign.title,
      total_budget: campaign.totalBudget,
      reward_per_action: campaign.rewardPerAction,
      estimated_reach: estimatedReach,
      status: "active" as const,
    }).select().single();

    if (newCampaign) setCampaigns(prev => [newCampaign, ...prev]);

    spendCredits(campaign.totalBudget);

    await supabase.from("transactions").insert({
      user_id: authUser.id,
      type: "spent" as const,
      amount: campaign.totalBudget,
      description: `Campaign: ${campaign.title}`,
    });

    await supabase.from("profiles").update({
      campaigns_run: (profile?.campaigns_run ?? 0) + 1,
    }).eq("id", authUser.id);

    // Trigger referral bonus if campaign budget >= 500
    if (campaign.totalBudget >= 500) {
      await supabase.rpc("award_referral_bonus", { _user_id: authUser.id, _trigger: "campaign_500" });
    }

    const { data } = await supabase.from("transactions").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false });
    if (data) setTransactions(data);
  }, [authUser, spendCredits, profile]);

  return (
    <AppContext.Provider value={{
      credits, user: profile, tasks, campaigns, transactions, withdrawals, loading,
      addCredits, spendCredits, completeTask, createCampaign, refreshData: fetchData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
