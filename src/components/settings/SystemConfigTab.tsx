import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Calendar } from "lucide-react";

interface SystemConfigTabProps {
  systemConfig: any;
  onSystemConfigSave: (field: string, value: any) => void;
}

export function SystemConfigTab({ systemConfig, onSystemConfigSave }: SystemConfigTabProps) {
  return (
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
                onCheckedChange={(checked) => onSystemConfigSave('auto_smart_swap', checked)}
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
                onCheckedChange={(checked) => onSystemConfigSave('fallback_panel_enabled', checked)}
              />
            </div>
          </div>

          {/* Interview Limits */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Max Interviews per Day</Label>
              <Select
                value={systemConfig.max_interviews_per_day.toString()}
                onValueChange={(value) => onSystemConfigSave('max_interviews_per_day', parseInt(value))}
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
                onValueChange={(value) => onSystemConfigSave('retry_attempts', parseInt(value))}
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
  );
}