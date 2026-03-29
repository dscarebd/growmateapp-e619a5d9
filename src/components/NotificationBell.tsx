import { Bell, CheckCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-full bg-primary-foreground/20 transition-transform active:scale-95">
          <Bell className="h-5 w-5 text-primary-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-scale-in">
              {unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-5 pt-6 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-foreground">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs text-primary h-7 gap-1" onClick={markAllRead}>
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-6rem)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Bell className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map(n => (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={cn(
                  "flex gap-3 w-full px-5 py-4 text-left transition-colors border-b border-border/50 hover:bg-muted/50",
                  !n.read && "bg-accent/30"
                )}
              >
                <span className="text-xl mt-0.5 shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm truncate", !n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>{n.title}</p>
                    {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationBell;
