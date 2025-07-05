import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function NotificationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure reminder timings and delivery preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reminder Schedule</Label>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground mb-2">Send reminders at:</div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">24 hours before</Badge>
                  <Badge variant="outline">1 hour before</Badge>
                  <Badge variant="outline">At start time</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Default Channels</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">WhatsApp Alerts</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Slack Integration</span>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}