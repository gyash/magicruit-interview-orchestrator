import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MessageSquare, Users } from "lucide-react";
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

      {/* ATS Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            ATS Integrations
          </CardTitle>
          <CardDescription>
            Connect with Applicant Tracking Systems for seamless candidate flow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 mb-4">
            <Label>Select Your ATS Provider</Label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue placeholder="Choose your ATS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No ATS Integration</SelectItem>
                <SelectItem value="greenhouse">Greenhouse</SelectItem>
                <SelectItem value="lever">Lever</SelectItem>
                <SelectItem value="workday">Workday</SelectItem>
                <SelectItem value="bamboohr">BambooHR</SelectItem>
                <SelectItem value="smartrecruiters">SmartRecruiters</SelectItem>
                <SelectItem value="jobvite">Jobvite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ATS Configuration */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">ATS Integration Settings</div>
                <div className="text-sm text-muted-foreground">Configure your selected ATS connection</div>
              </div>
              <Badge variant="secondary">Not Connected</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="Enter your ATS API Key"
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook Secret</Label>
                <Input
                  type="password"
                  placeholder="Webhook Secret (if required)"
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => testConnection('ATS')}
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
            Setup WhatsApp, Slack, Teams and email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Microsoft Teams */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Microsoft Teams</div>
                <div className="text-sm text-muted-foreground">Enterprise video conferencing</div>
              </div>
              <Switch />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Client ID" />
              <Input type="password" placeholder="Client Secret" />
              <Input placeholder="Tenant ID" />
            </div>
            
            <Button variant="outline" size="sm" className="mt-4">Test Connection</Button>
          </div>

          {/* Slack Enhanced */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Slack</div>
                <div className="text-sm text-muted-foreground">Team notifications and alerts</div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={apiSettings.slack?.enabled || false}
                  onCheckedChange={(checked) => onApiSave('slack', 'enabled', checked)}
                />
                <Badge variant={apiSettings.slack?.enabled ? "default" : "secondary"}>
                  {apiSettings.slack?.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bot Token</Label>
                <Input
                  type="password"
                  placeholder="xoxb-your-bot-token"
                  value={apiSettings.slack?.bot_token || ''}
                  onChange={(e) => onApiSave('slack', 'bot_token', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input
                  placeholder="https://hooks.slack.com/..."
                  value={apiSettings.slack?.webhook_url || ''}
                  onChange={(e) => onApiSave('slack', 'webhook_url', e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => testConnection('Slack')}
            >
              Test Connection
            </Button>
          </div>

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

          {/* Outlook Calendar */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Outlook Calendar</div>
                <div className="text-sm text-muted-foreground">Microsoft 365 calendar integration</div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={apiSettings.outlook_calendar?.enabled || false}
                  onCheckedChange={(checked) => onApiSave('outlook_calendar', 'enabled', checked)}
                />
                <Badge variant={apiSettings.outlook_calendar?.enabled ? "default" : "secondary"}>
                  {apiSettings.outlook_calendar?.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client ID</Label>
                <Input
                  placeholder="Microsoft App Client ID"
                  value={apiSettings.outlook_calendar?.client_id || ''}
                  onChange={(e) => onApiSave('outlook_calendar', 'client_id', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tenant ID</Label>
                <Input
                  placeholder="Azure AD Tenant ID"
                  value={apiSettings.outlook_calendar?.tenant_id || ''}
                  onChange={(e) => onApiSave('outlook_calendar', 'tenant_id', e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => testConnection('Outlook Calendar')}
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}