import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Key, Users, Bell, Zap, Shield, Calendar, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  
  // API Configuration State
  const [apiSettings, setApiSettings] = useState({
    google_calendar: { api_key: "", client_id: "", enabled: false },
    outlook_calendar: { api_key: "", tenant_id: "", enabled: false },
    zoom: { api_key: "", api_secret: "", webhook_url: "", enabled: false },
    google_meet: { enabled: true },
    whatsapp: { business_api_key: "", phone_number: "", enabled: false },
    slack: { webhook_url: "", bot_token: "", enabled: false },
    greenhouse: { api_key: "", webhook_secret: "", enabled: false }
  });

  // System Configuration State
  const [systemConfig, setSystemConfig] = useState({
    auto_smart_swap: true,
    fallback_panel_enabled: true,
    max_interviews_per_day: 4,
    block_on_mandatory_absence: true,
    manual_urgency_override: true,
    retry_attempts: 3,
    retry_intervals: [3, 5, 10], // minutes
    auto_reschedule_window: 24, // hours
    notification_reminder_times: [24, 1] // hours before
  });

  // Access Control State
  const [accessControl, setAccessControl] = useState({
    recruiter_permissions: {
      create_workflow: true,
      schedule_interview: true,
      reschedule_interview: true,
      override_priority: true,
      access_analytics: true
    },
    coordinator_permissions: {
      create_workflow: false,
      schedule_interview: true,
      reschedule_interview: true,
      override_priority: false,
      access_analytics: false
    },
    interviewer_permissions: {
      create_workflow: false,
      schedule_interview: false,
      reschedule_interview: false,
      override_priority: false,
      access_analytics: false
    }
  });

  const handleApiSave = (service: string, field: string, value: string | boolean) => {
    setApiSettings(prev => ({
      ...prev,
      [service]: {
        ...prev[service as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSystemConfigSave = (field: string, value: any) => {
    setSystemConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const testConnection = async (service: string) => {
    toast({
      title: "Testing Connection",
      description: `Testing ${service} integration...`,
    });
    
    // Simulate API test
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

  const saveAllSettings = () => {
    toast({
      title: "Settings Saved",
      description: "All configuration changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure integrations, permissions, and system behavior
          </p>
        </div>
        <Button onClick={saveAllSettings} className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90">
          <Settings className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">API Integrations</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* API Integrations Tab */}
        <TabsContent value="integrations">
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
                        onCheckedChange={(checked) => handleApiSave('google_calendar', 'enabled', checked)}
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
                        onChange={(e) => handleApiSave('google_calendar', 'client_id', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input
                        type="password"
                        placeholder="Google Calendar API Key"
                        value={apiSettings.google_calendar.api_key}
                        onChange={(e) => handleApiSave('google_calendar', 'api_key', e.target.value)}
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
                        onCheckedChange={(checked) => handleApiSave('zoom', 'enabled', checked)}
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
                        onChange={(e) => handleApiSave('zoom', 'api_key', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Secret</Label>
                      <Input
                        type="password"
                        placeholder="Zoom API Secret"
                        value={apiSettings.zoom.api_secret}
                        onChange={(e) => handleApiSave('zoom', 'api_secret', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input
                        placeholder="Webhook endpoint for join events"
                        value={apiSettings.zoom.webhook_url}
                        onChange={(e) => handleApiSave('zoom', 'webhook_url', e.target.value)}
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
                        onCheckedChange={(checked) => handleApiSave('whatsapp', 'enabled', checked)}
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
                        onChange={(e) => handleApiSave('whatsapp', 'business_api_key', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        placeholder="+1-555-0123"
                        value={apiSettings.whatsapp.phone_number}
                        onChange={(e) => handleApiSave('whatsapp', 'phone_number', e.target.value)}
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
        </TabsContent>

        {/* System Configuration Tab */}
        <TabsContent value="system">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Automation Settings
                </CardTitle>
                <CardDescription>
                  Configure system behavior and automation rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Smart Swap Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Smart Swap</Label>
                        <div className="text-sm text-muted-foreground">
                          Automatically replace cancelled candidates
                        </div>
                      </div>
                      <Switch
                        checked={systemConfig.auto_smart_swap}
                        onCheckedChange={(checked) => handleSystemConfigSave('auto_smart_swap', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Fallback Panel</Label>
                        <div className="text-sm text-muted-foreground">
                          Use backup interviewers when primary unavailable
                        </div>
                      </div>
                      <Switch
                        checked={systemConfig.fallback_panel_enabled}
                        onCheckedChange={(checked) => handleSystemConfigSave('fallback_panel_enabled', checked)}
                      />
                    </div>
                  </div>

                  {/* Interview Limits */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Max Interviews per Day</Label>
                      <Select
                        value={systemConfig.max_interviews_per_day.toString()}
                        onValueChange={(value) => handleSystemConfigSave('max_interviews_per_day', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 interviews</SelectItem>
                          <SelectItem value="3">3 interviews</SelectItem>
                          <SelectItem value="4">4 interviews</SelectItem>
                          <SelectItem value="5">5 interviews</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Retry Attempts</Label>
                      <Select
                        value={systemConfig.retry_attempts.toString()}
                        onValueChange={(value) => handleSystemConfigSave('retry_attempts', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 attempts</SelectItem>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="4">4 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Access Control Tab */}
        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role-Based Access Control
              </CardTitle>
              <CardDescription>
                Define permissions for different user roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(accessControl).map(([role, permissions]) => (
                  <div key={role} className="p-4 border rounded-lg">
                    <div className="font-medium mb-4 capitalize">
                      {role.replace('_permissions', '').replace('_', ' ')} Permissions
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(permissions).map(([permission, enabled]) => (
                        <div key={permission} className="flex items-center justify-between">
                          <Label className="text-sm capitalize">
                            {permission.replace('_', ' ')}
                          </Label>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => {
                              setAccessControl(prev => ({
                                ...prev,
                                [role]: {
                                  ...prev[role as keyof typeof prev],
                                  [permission]: checked
                                }
                              }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
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
                      <div className="text-sm text-muted-foreground">Send reminders at:</div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;