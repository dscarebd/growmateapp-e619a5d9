import React, { createContext, useContext, useState, useCallback } from "react";

export type Platform = "youtube" | "instagram" | "tiktok" | "facebook";
export type TaskAction = "like" | "follow" | "subscribe" | "share" | "comment";
export type CampaignStatus = "active" | "paused" | "completed" | "pending";
export type TransactionType = "earned" | "spent" | "purchased" | "withdrawn";
export type WithdrawalStatus = "pending" | "approved" | "rejected" | "processing";

export interface Task {
  id: string;
  platform: Platform;
  action: TaskAction;
  title: string;
  description: string;
  reward: number;
  link: string;
  advertiser: string;
  isHighReward: boolean;
  completedCount: number;
  totalSlots: number;
}

export interface Campaign {
  id: string;
  platform: Platform;
  link: string;
  totalBudget: number;
  rewardPerAction: number;
  action: TaskAction;
  title: string;
  status: CampaignStatus;
  completedActions: number;
  estimatedReach: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  platform?: Platform;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: WithdrawalStatus;
  requestedAt: string;
  method: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  referralCode: string;
  tasksCompleted: number;
  campaignsRun: number;
  totalEarned: number;
  joinedDate: string;
  trustScore: number;
}

interface AppContextType {
  credits: number;
  user: UserProfile;
  tasks: Task[];
  campaigns: Campaign[];
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;
  setIsAuthenticated: (v: boolean) => void;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  completeTask: (taskId: string) => void;
  createCampaign: (campaign: Omit<Campaign, "id" | "completedActions" | "estimatedReach" | "createdAt" | "status">) => void;
}

const mockTasks: Task[] = [
  { id: "t1", platform: "youtube", action: "subscribe", title: "Subscribe to TechVlog", description: "Subscribe to channel and stay for 30 seconds", reward: 15, link: "https://youtube.com", advertiser: "TechVlog Pro", isHighReward: true, completedCount: 342, totalSlots: 500 },
  { id: "t2", platform: "instagram", action: "follow", title: "Follow @FashionDaily", description: "Follow the account", reward: 10, link: "https://instagram.com", advertiser: "Fashion Daily", isHighReward: true, completedCount: 128, totalSlots: 300 },
  { id: "t3", platform: "tiktok", action: "like", title: "Like viral dance video", description: "Watch and like the video", reward: 5, link: "https://tiktok.com", advertiser: "DanceStar", isHighReward: false, completedCount: 892, totalSlots: 1000 },
  { id: "t4", platform: "facebook", action: "share", title: "Share product page", description: "Share on your timeline", reward: 12, link: "https://facebook.com", advertiser: "ShopEasy", isHighReward: true, completedCount: 56, totalSlots: 200 },
  { id: "t5", platform: "youtube", action: "like", title: "Like cooking tutorial", description: "Watch 30s and like", reward: 8, link: "https://youtube.com", advertiser: "Chef Mike", isHighReward: false, completedCount: 445, totalSlots: 600 },
  { id: "t6", platform: "instagram", action: "like", title: "Like travel photo", description: "Double tap to like", reward: 3, link: "https://instagram.com", advertiser: "Wanderlust", isHighReward: false, completedCount: 1200, totalSlots: 2000 },
  { id: "t7", platform: "tiktok", action: "follow", title: "Follow @ComedyKing", description: "Follow and stay", reward: 7, link: "https://tiktok.com", advertiser: "ComedyKing", isHighReward: false, completedCount: 670, totalSlots: 800 },
  { id: "t8", platform: "youtube", action: "subscribe", title: "Sub to GamingHub", description: "Subscribe and ring bell", reward: 20, link: "https://youtube.com", advertiser: "GamingHub", isHighReward: true, completedCount: 89, totalSlots: 150 },
];

const mockCampaigns: Campaign[] = [
  { id: "c1", platform: "youtube", link: "https://youtube.com/mychannel", totalBudget: 500, rewardPerAction: 10, action: "subscribe", title: "Grow my YouTube", status: "active", completedActions: 32, estimatedReach: 50, createdAt: "2026-03-25" },
  { id: "c2", platform: "instagram", link: "https://instagram.com/mypage", totalBudget: 200, rewardPerAction: 5, action: "follow", title: "Instagram followers", status: "completed", completedActions: 40, estimatedReach: 40, createdAt: "2026-03-20" },
];

const mockTransactions: Transaction[] = [
  { id: "tx1", type: "earned", amount: 15, description: "Subscribed to TechVlog", date: "2026-03-29", platform: "youtube" },
  { id: "tx2", type: "earned", amount: 10, description: "Followed @FashionDaily", date: "2026-03-28", platform: "instagram" },
  { id: "tx3", type: "spent", amount: 500, description: "Campaign: Grow my YouTube", date: "2026-03-25" },
  { id: "tx4", type: "purchased", amount: 1000, description: "Bought 1000 credits", date: "2026-03-22" },
  { id: "tx5", type: "earned", amount: 5, description: "Liked viral dance video", date: "2026-03-27", platform: "tiktok" },
  { id: "tx6", type: "withdrawn", amount: -200, description: "Withdrawal to PayPal", date: "2026-03-21" },
];

const mockWithdrawals: WithdrawalRequest[] = [
  { id: "w1", amount: 250, commission: 37.5, netAmount: 212.5, status: "approved", requestedAt: "2026-03-20", method: "PayPal" },
  { id: "w2", amount: 100, commission: 15, netAmount: 85, status: "pending", requestedAt: "2026-03-28", method: "Bank Transfer" },
];

const mockUser: UserProfile = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "",
  referralCode: "BOOST-AX7K2",
  tasksCompleted: 47,
  campaignsRun: 3,
  totalEarned: 1250,
  joinedDate: "2026-01-15",
  trustScore: 92,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState(1530);
  const [tasks, setTasks] = useState(mockTasks);
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [withdrawals] = useState(mockWithdrawals);
  const [user] = useState(mockUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const addCredits = useCallback((amount: number) => {
    setCredits(prev => prev + amount);
  }, []);

  const spendCredits = useCallback((amount: number) => {
    if (credits >= amount) {
      setCredits(prev => prev - amount);
      return true;
    }
    return false;
  }, [credits]);

  const completeTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completedCount: t.completedCount + 1 } : t));
    addCredits(task.reward);
    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      type: "earned" as TransactionType,
      amount: task.reward,
      description: `${task.action} - ${task.title}`,
      date: new Date().toISOString().split("T")[0],
      platform: task.platform,
    }, ...prev]);
  }, [tasks, addCredits]);

  const createCampaign = useCallback((campaign: Omit<Campaign, "id" | "completedActions" | "estimatedReach" | "createdAt" | "status">) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: `c-${Date.now()}`,
      completedActions: 0,
      estimatedReach: Math.floor(campaign.totalBudget / campaign.rewardPerAction),
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    spendCredits(campaign.totalBudget);
    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      type: "spent" as TransactionType,
      amount: campaign.totalBudget,
      description: `Campaign: ${campaign.title}`,
      date: new Date().toISOString().split("T")[0],
    }, ...prev]);
  }, [spendCredits]);

  return (
    <AppContext.Provider value={{
      credits, user, tasks, campaigns, transactions, withdrawals,
      isAuthenticated, hasOnboarded, setHasOnboarded, setIsAuthenticated,
      addCredits, spendCredits, completeTask, createCampaign,
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
