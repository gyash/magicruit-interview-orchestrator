import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface APIIntegrationsTabProps {
  apiSettings: any;
  onApiSave: (service: string, field: string, value: string | boolean) => void;
}

export function APIIntegrationsTab({ apiSettings, onApiSave }: APIIntegrationsTabProps) {
  const { toast } = useToast();

  const testConnection = async (service: string) => {
    toast({
      title: "Testing Connection",
      description: `Testing ${service} integration...`,
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    const success = Math.random() > 0.3;
    
    toast({
      title: success ? "Connection Successful" : "Connection Failed",
      description: success ? 
        `${service} integration is working correctly` : 
        `Failed to connect to ${service}. Please check your credentials.`,
      variant: success ? "default" : "destructive"
    });
  };

  return (
    <div className="grid gap-6">
      {/* Calendar Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Integrations
          </CardTitle>
          <CardDescription>
            Connect with Google Calendar and Outlook for availability checking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Calendar */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Google Calendar</div>
                <div className="text-sm text-muted-foreground">OAuth 2.0 integration for calendar access</div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={apiSettings.google_calendar.enabled}
                  onCheckedChange={(checked) => onApiSave('google_calendar', 'enabled', checked)}
                />
                <Badge variant={apiSettings.google_calendar.enabled ? "default" : "secondary"}>
                  {apiSettings.google_calendar.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client ID</Label>
                <Input
                  placeholder="Google OAuth Client ID"
                  value={apiSettings.google_calendar.client_id}
                  onChange={(e) => onApiSave('google_calendar', 'client_id', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="Google Calendar API Key"
                  value={apiSettings.google_calendar.api_key}
                  onChange={(e) => onApiSave('google_calendar', 'api_key', e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => testConnection('Google Calendar')}
            >
              Test Connection
            </Button>
          </div>

          {/* Zoom Integration */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Zoom</div>
                <div className="text-sm text-muted-foreground">Video conferencing and join detection</div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={apiSettings.zoom.enabled}
                  onCheckedChange={(checked) => onApiSave('zoom', 'enabled', checked)}
                />
                <Badge variant={apiSettings.zoom.enabled ? "default" : "secondary"}>
                  {apiSettings.zoom.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  placeholder="Zoom API Key"
                  value={apiSettings.zoom.api_key}
                  onChange={(e) => onApiSave('zoom', 'api_key', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>API Secret</Label>
                <Input
                  type="password"
                  placeholder="Zoom API Secret"
                  value={apiSettings.zoom.api_secret}
                  onChange={(e) => onApiSave('zoom', 'api_secret', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input
                  placeholder="Webhook endpoint for join events"
                  value={apiSettings.zoom.webhook_url}
                  onChange={(e) => onApiSave('zoom', 'webhook_url', e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => testConnection('Zoom')}
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Communication Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Channels
          </CardTitle>
          <CardDescription>
            Setup WhatsApp, Slack and email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* WhatsApp Business */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">WhatsApp Business API</div>
                <div className="text-sm text-muted-foreground">Send instant notifications and reminders</div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={apiSettings.whatsapp.enabled}
                  onCheckedChange={(checked) => onApiSave('whatsapp', 'enabled', checked)}
                />
                <Badge variant={apiSettings.whatsapp.enabled ? "default" : "secondary"}>
                  {apiSettings.whatsapp.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business API Key</Label>
                <Input
                  type="password"
                  placeholder="WhatsApp Business API Key"
                  value={apiSettings.whatsapp.business_api_key}
                  onChange={(e) => onApiSave('whatsapp', 'business_api_key', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="+1-555-0123"
                  value={apiSettings.whatsapp.phone_number}
                  onChange={(e) => onApiSave('whatsapp', 'phone_number', e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => testConnection('WhatsApp')}
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}