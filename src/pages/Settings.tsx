import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { APIIntegrationsTab } from "@/components/settings/APIIntegrationsTab";
import { SystemConfigTab } from "@/components/settings/SystemConfigTab";
import { AccessControlTab } from "@/components/settings/AccessControlTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { MasterAdminTab } from "@/components/settings/MasterAdminTab";
import { CandidateExperienceTab } from "@/components/settings/CandidateExperienceTab";
import { ComplianceSecurityTab } from "@/components/settings/ComplianceSecurityTab";
import { WorkflowTemplatesTab } from "@/components/settings/WorkflowTemplatesTab";
import { ReportingConfigTab } from "@/components/settings/ReportingConfigTab";
import { EmailTemplatesTab } from "@/components/settings/EmailTemplatesTab";

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
          <h1 className="text-3xl font-bold tracking-tight">System Configuration ⚙️</h1>
          <p className="text-muted-foreground">
            Power up your recruitment engine. Connect your tools, customize workflows, and configure AI preferences for maximum efficiency.
          </p>
        </div>
        <Button onClick={saveAllSettings} className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90">
          <Settings className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full min-w-max grid-cols-7 gap-1">
            <TabsTrigger value="integrations" className="text-xs">🔗 Integrations</TabsTrigger>
            <TabsTrigger value="system" className="text-xs">⚙️ System & AI</TabsTrigger>
            <TabsTrigger value="communications" className="text-xs">📧 Communications</TabsTrigger>
            <TabsTrigger value="access" className="text-xs">🔐 Access & Security</TabsTrigger>
            <TabsTrigger value="workflows" className="text-xs">🎯 Workflows & Templates</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">📊 Analytics & Reports</TabsTrigger>
            <TabsTrigger value="admin" className="text-xs">👑 Admin</TabsTrigger>
          </TabsList>
        </div>

        {/* API Integrations Tab */}
        <TabsContent value="integrations">
          <APIIntegrationsTab 
            apiSettings={apiSettings}
            onApiSave={handleApiSave}
          />
        </TabsContent>

        {/* System Configuration Tab */}
        <TabsContent value="system">
          <SystemConfigTab 
            systemConfig={systemConfig}
            onSystemConfigSave={handleSystemConfigSave}
          />
        </TabsContent>

        {/* Communications Tab - Combines notifications, emails, and candidate experience */}
        <TabsContent value="communications">
          <div className="space-y-6">
            <div className="grid gap-6">
              <EmailTemplatesTab />
              <NotificationsTab />
              <CandidateExperienceTab />
            </div>
          </div>
        </TabsContent>

        {/* Access & Security Tab - Combines access control and compliance */}
        <TabsContent value="access">
          <div className="space-y-6">
            <AccessControlTab 
              accessControl={accessControl}
              setAccessControl={setAccessControl}
            />
            <ComplianceSecurityTab />
          </div>
        </TabsContent>

        {/* Workflows & Templates Tab */}
        <TabsContent value="workflows">
          <WorkflowTemplatesTab />
        </TabsContent>

        {/* Analytics & Reports Tab */}
        <TabsContent value="analytics">
          <ReportingConfigTab />
        </TabsContent>

        {/* Master Admin Tab */}
        <TabsContent value="admin">
          <MasterAdminTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;