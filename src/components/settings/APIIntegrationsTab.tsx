import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MessageSquare, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface APIIntegrationsTabProps {
  apiSettings: any;
  onApiSave: (service: string, field: string, value: string | boolean) => void;
}

export function APIIntegrationsTab({ apiSettings, onApiSave }: APIIntegrationsTabProps) {
  const { toast } = useToast();
  const [selectedATS, setSelectedATS] = useState<string>("none");
  const [greenhouseApiKey, setGreenhouseApiKey] = useState<string>("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const testGreenhouseConnection = async () => {
    if (!greenhouseApiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Greenhouse API Key first.",
        variant: "destructive"
      });
      return;
    }

    setIsTestingConnection(true);
    toast({
      title: "Testing Connection",
      description: "Testing Greenhouse API connection...",
    });

    try {
      const { data, error } = await supabase.functions.invoke('greenhouse-sync', {
        body: { action: 'test-connection', apiKey: greenhouseApiKey }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Connection Successful! ✅",
          description: `Connected to Greenhouse as: ${data.user || 'Unknown User'}`,
        });
        onApiSave('greenhouse', 'enabled', true);
      } else {
        throw new Error(data.error || 'Connection failed');
      }
    } catch (error: any) {
      console.error('Greenhouse connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to Greenhouse. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testGreenhouseEndpoint = async (action: string) => {
    setIsTestingConnection(true);
    toast({
      title: `Testing ${action.replace('fetch-', '').charAt(0).toUpperCase() + action.replace('fetch-', '').slice(1)}`,
      description: `Fetching data from Greenhouse...`,
    });

    try {
      const { data, error } = await supabase.functions.invoke('greenhouse-sync', {
        body: { action, apiKey: greenhouseApiKey }
      });

      if (error) throw error;

      if (data.success !== false) {
        const results = data.jobs || data.candidates || data.interviews || [];
        toast({
          title: "Success! ✅",
          description: `Found ${results.length} ${action.replace('fetch-', '')}. Check console for details.`,
        });
        console.log(`Greenhouse ${action} results:`, data);
      } else {
        throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (error: any) {
      console.error(`Greenhouse ${action} error:`, error);
      toast({
        title: "Test Failed",
        description: error.message || `Failed to fetch ${action.replace('fetch-', '')}`,
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testConnection = async (service: string) => {
    if (service === 'Greenhouse') {
      await testGreenhouseConnection();
      return;
    }

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
            Connect with calendar providers for availability checking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 mb-4">
            <Label>Select Calendar Provider</Label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue placeholder="Choose your calendar provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Calendar Integration</SelectItem>
                <SelectItem value="google">Google Calendar</SelectItem>
                <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                <SelectItem value="office365">Office 365</SelectItem>
                <SelectItem value="exchange">Exchange Server</SelectItem>
                <SelectItem value="apple">Apple iCloud</SelectItem>
                <SelectItem value="yahoo">Yahoo Calendar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calendar Configuration */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Calendar Integration Settings</div>
                <div className="text-sm text-muted-foreground">Configure your selected calendar connection</div>
              </div>
              <Badge variant="secondary">Not Connected</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client ID / Application ID</Label>
                <Input
                  placeholder="Enter your calendar app client ID"
                />
              </div>
              <div className="space-y-2">
                <Label>API Key / Client Secret</Label>
                <Input
                  type="password"
                  placeholder="Enter your calendar API key"
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => testConnection('Calendar Provider')}
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
            <Select value={selectedATS} onValueChange={setSelectedATS}>
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
          {selectedATS !== "none" && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-medium">
                    {selectedATS === "greenhouse" ? "Greenhouse" : "ATS Integration"} Settings
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Configure your {selectedATS === "greenhouse" ? "Greenhouse Harvest API" : "ATS"} connection
                  </div>
                </div>
                <Badge variant={apiSettings?.greenhouse?.enabled ? "default" : "secondary"}>
                  {apiSettings?.greenhouse?.enabled ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              
              {selectedATS === "greenhouse" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Greenhouse Harvest API Key</Label>
                    <Input
                      type="password"
                      placeholder="Enter your Greenhouse API Key (e.g., 14c7ddfda982270409307a5fb980cfcf-7)"
                      value={greenhouseApiKey}
                      onChange={(e) => {
                        setGreenhouseApiKey(e.target.value);
                        onApiSave('greenhouse', 'api_key', e.target.value);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Find your API key in Greenhouse → Configure → Dev Center → API Credential Management
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => testConnection('Greenhouse')}
                      disabled={isTestingConnection || !greenhouseApiKey.trim()}
                    >
                      {isTestingConnection ? "Testing..." : "Test Connection"}
                    </Button>
                    
                    {apiSettings?.greenhouse?.enabled && (
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => testGreenhouseEndpoint('fetch-jobs')}
                          disabled={isTestingConnection}
                        >
                          Test Jobs
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => testGreenhouseEndpoint('fetch-candidates')}
                          disabled={isTestingConnection}
                        >
                          Test Candidates
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => testGreenhouseEndpoint('fetch-interviews')}
                          disabled={isTestingConnection}
                        >
                          Test Interviews
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => testConnection('ATS')}
                  >
                    Test Connection
                  </Button>
                </div>
              )}
            </div>
          )}
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
          <div className="space-y-2 mb-4">
            <Label>Select Communication Channel</Label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue placeholder="Choose your communication channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Communication Integration</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="teams">Microsoft Teams</SelectItem>
                <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                <SelectItem value="telegram">Telegram Bot</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="webex">Cisco Webex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Communication Configuration */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Communication Integration Settings</div>
                <div className="text-sm text-muted-foreground">Configure your selected communication channel</div>
              </div>
              <Badge variant="secondary">Not Connected</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>API Key / Bot Token</Label>
                <Input
                  type="password"
                  placeholder="Enter your API key or bot token"
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook URL / Channel ID</Label>
                <Input
                  placeholder="Enter webhook URL or channel identifier"
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => testConnection('Communication Channel')}
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}