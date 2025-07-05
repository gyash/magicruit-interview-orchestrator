import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, Key, Settings } from "lucide-react";

export function MasterAdminTab() {
  return (
    <div className="grid gap-6">
      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage system users, roles, and organization settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
                <Button variant="outline" size="sm" className="mt-2">Manage Users</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Admin Users</div>
                <Button variant="outline" size="sm" className="mt-2">View Admins</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Pending Invites</div>
                <Button variant="outline" size="sm" className="mt-2">Send Invites</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Organization Settings</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input placeholder="Enter company name" defaultValue="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select defaultValue="pst">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health & Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Health & Monitoring
          </CardTitle>
          <CardDescription>
            Monitor system performance, health, and audit logs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-success">99.8%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">247ms</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-warning">2</div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-muted-foreground">Daily Requests</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline">View Audit Logs</Button>
            <Button variant="outline">System Diagnostics</Button>
            <Button variant="outline">Export Health Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* White-labeling & Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            White-labeling & Branding
          </CardTitle>
          <CardDescription>
            Customize branding, logos, and white-label settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <div className="text-muted-foreground">Upload your company logo</div>
                  <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Brand Colors</Label>
                <div className="flex gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Primary</Label>
                    <div className="w-12 h-8 bg-primary rounded border"></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Secondary</Label>
                    <div className="w-12 h-8 bg-secondary rounded border"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Custom Domain</Label>
                <Input placeholder="interviews.yourcompany.com" />
                <div className="text-xs text-muted-foreground">
                  Configure custom domain for candidate-facing pages
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Email Templates</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Custom Email Footer</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Remove "Powered by Magicruit"</span>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Data Management & Backup
          </CardTitle>
          <CardDescription>
            Export data, configure backups, and manage system maintenance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Data Export</Label>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Export All Interview Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Export User Analytics
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Export System Logs
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Automated Backups</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Backups</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly Full Export</span>
                  <Switch />
                </div>
                <div className="text-xs text-muted-foreground">
                  Last backup: Today at 3:00 AM
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex gap-4">
              <Button variant="destructive" size="sm">Emergency Maintenance Mode</Button>
              <Button variant="outline" size="sm">Schedule Maintenance</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}