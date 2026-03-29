import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  icon: string;
  read: boolean;
  created_at: string;
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

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    taskCompleted: true,
    campaignUpdates: true,
    withdrawalStatus: true,
    promotions: true,
    systemAlerts: true,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch existing notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) {
      setNotifications(data as Notification[]);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Subscribe to realtime inserts on the notifications table for this user
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications(prev => [newNotif, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
  }, [user]);

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
