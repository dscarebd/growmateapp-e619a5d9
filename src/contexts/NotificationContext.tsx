import React, { createContext, useContext, useState, useCallback } from "react";

export interface Notification {
  id: string;
  type: "task" | "campaign" | "withdrawal" | "promo" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export interface NotificationPreferences {
  taskCompleted: boolean;
  campaignUpdates: boolean;
  withdrawalStatus: boolean;
  promotions: boolean;
  systemAlerts: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  preferences: NotificationPreferences;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  updatePreference: (key: keyof NotificationPreferences, value: boolean) => void;
}

const mockNotifications: Notification[] = [
  { id: "n1", type: "task", title: "Task Completed!", message: "You earned 15 credits for subscribing to TechVlog", time: "2 min ago", read: false, icon: "✅" },
  { id: "n2", type: "campaign", title: "Campaign Milestone", message: "Your YouTube campaign reached 32 completions", time: "1 hr ago", read: false, icon: "🎯" },
  { id: "n3", type: "withdrawal", title: "Withdrawal Approved", message: "Your PayPal withdrawal of $212.50 was approved", time: "3 hrs ago", read: false, icon: "💰" },
  { id: "n4", type: "promo", title: "🔥 Double Credits Event!", message: "Complete tasks today and earn 2x credits", time: "5 hrs ago", read: true, icon: "🔥" },
  { id: "n5", type: "system", title: "Trust Score Updated", message: "Your trust score increased to 92%", time: "1 day ago", read: true, icon: "🛡️" },
  { id: "n6", type: "task", title: "New High-Reward Task", message: "A 20-credit YouTube task is now available", time: "1 day ago", read: true, icon: "⭐" },
  { id: "n7", type: "campaign", title: "Campaign Completed", message: "Instagram followers campaign finished successfully", time: "2 days ago", read: true, icon: "🎉" },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    taskCompleted: true,
    campaignUpdates: true,
    withdrawalStatus: true,
    promotions: true,
    systemAlerts: true,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const updatePreference = useCallback((key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, preferences, unreadCount, markAsRead, markAllRead, updatePreference }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
};
