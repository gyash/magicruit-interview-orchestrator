import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Users,
  Settings,
  MessageSquare,
  ArrowRight
} from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    type: "urgent",
    title: "Interview Conflict Detected",
    message: "Sarah Johnson has overlapping interviews scheduled for tomorrow at 2 PM",
    time: "2 minutes ago",
    icon: AlertTriangle,
    unread: true
  },
  {
    id: 2,
    type: "success",
    title: "Auto-Rescheduling Complete",
    message: "3 interviews successfully rescheduled due to panelist unavailability",
    time: "15 minutes ago",
    icon: CheckCircle,
    unread: true
  },
  {
    id: 3,
    type: "info",
    title: "New Candidate Response",
    message: "Mike Chen confirmed his interview slot for Friday 10 AM",
    time: "1 hour ago",
    icon: MessageSquare,
    unread: false
  },
  {
    id: 4,
    type: "reminder",
    title: "Panelist Reminder Sent",
    message: "Reminder sent to 5 panelists for tomorrow's interviews",
    time: "2 hours ago",
    icon: Clock,
    unread: false
  }
];

const mockActions = [
  {
    id: 1,
    title: "Review Schedule Conflicts",
    description: "3 conflicts need your attention",
    priority: "high",
    icon: Calendar,
    action: "review"
  },
  {
    id: 2,
    title: "Approve Panelist Swaps",
    description: "2 smart swaps suggested by AI",
    priority: "medium", 
    icon: Users,
    action: "approve"
  },
  {
    id: 3,
    title: "Update Integration Settings",
    description: "Zoom webhook requires reconnection",
    priority: "low",
    icon: Settings,
    action: "configure"
  }
];

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const unreadCount = mockNotifications.filter(n => n.unread).length;

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "urgent": return "text-destructive";
      case "success": return "text-green-600";
      case "info": return "text-blue-600";
      case "reminder": return "text-orange-600";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
      case "low": return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Updates & Actions</h3>
          <p className="text-xs text-muted-foreground">Stay on top of your recruitment workflow</p>
        </div>
        
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="mt-2">
            <ScrollArea className="h-80">
              <div className="space-y-1 p-2">
                {mockNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-colors hover:bg-muted/50 cursor-pointer ${
                        notification.unread ? "bg-primary/5 border-primary/20" : "border-border"
                      }`}
                    >
                      <div className="flex gap-3">
                        <Icon className={`h-4 w-4 mt-0.5 ${getNotificationTypeColor(notification.type)}`} />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            {notification.unread && (
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full justify-between text-xs">
                View All Notifications
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="mt-2">
            <ScrollArea className="h-80">
              <div className="space-y-2 p-2">
                {mockActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={action.id}
                      className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex gap-3">
                        <Icon className="h-4 w-4 mt-0.5 text-primary" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium">{action.title}</p>
                              <p className="text-xs text-muted-foreground">{action.description}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(action.priority)}`}
                            >
                              {action.priority}
                            </Badge>
                          </div>
                          <Button size="sm" className="h-7 text-xs">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full justify-between text-xs">
                View All Actions
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}