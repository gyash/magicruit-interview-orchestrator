import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, FileCheck, AlertTriangle } from "lucide-react";

export function ComplianceSecurityTab() {
  return (
    <div className="grid gap-6">
      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security & Authentication
          </CardTitle>
          <CardDescription>
            Configure security policies and authentication requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <div className="text-sm text-muted-foreground">
                    Require 2FA for all users
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Badge variant="default">Enforced</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>SSO Integration</Label>
                  <div className="text-sm text-muted-foreground">
                    Single Sign-On with corporate identity provider
                  </div>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout</Label>
                  <div className="text-sm text-muted-foreground">
                    Auto-logout inactive users
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Password Policy</Label>
                <Select defaultValue="strong">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ chars)</SelectItem>
                    <SelectItem value="strong">Strong (12+ chars, mixed)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (16+ chars, complex)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Session Duration</Label>
                <Select defaultValue="8">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Failed Login Attempts</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                    <SelectItem value="10">10 attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Privacy & GDPR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Privacy & GDPR Compliance
          </CardTitle>
          <CardDescription>
            Manage data retention, privacy policies, and compliance requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>GDPR Compliance Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable strict European data protection
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Minimization</Label>
                  <div className="text-sm text-muted-foreground">
                    Collect only necessary candidate information
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Right to be Forgotten</Label>
                  <div className="text-sm text-muted-foreground">
                    Automated data deletion requests
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Consent Management</Label>
                  <div className="text-sm text-muted-foreground">
                    Track and manage data processing consent
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Data Retention Period</Label>
                <Select defaultValue="12">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Data Processing Basis</Label>
                <Select defaultValue="legitimate">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consent">Explicit Consent</SelectItem>
                    <SelectItem value="legitimate">Legitimate Interest</SelectItem>
                    <SelectItem value="contract">Contract Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Auto-Delete After</Label>
                <Select defaultValue="rejected">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rejected">Rejection (6 months)</SelectItem>
                    <SelectItem value="hired">Hiring (transfer to HRIS)</SelectItem>
                    <SelectItem value="withdrawn">Candidate Withdrawal (immediate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex gap-4">
              <Button variant="outline">Export Privacy Report</Button>
              <Button variant="outline">Download Data Processing Record</Button>
              <Button variant="outline">Generate GDPR Compliance Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Trails */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Audit Trails & Monitoring
          </CardTitle>
          <CardDescription>
            Track system access, changes, and compliance events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>User Activity Logging</Label>
                  <div className="text-sm text-muted-foreground">
                    Log all user actions and access
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Access Monitoring</Label>
                  <div className="text-sm text-muted-foreground">
                    Track who accessed candidate data
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Configuration Changes</Label>
                  <div className="text-sm text-muted-foreground">
                    Log system configuration modifications
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Log Retention</Label>
                <Select defaultValue="36">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Alert Threshold</Label>
                <Select defaultValue="suspicious">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="suspicious">Suspicious Only</SelectItem>
                    <SelectItem value="critical">Critical Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-muted-foreground">Events Today</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-warning">3</div>
              <div className="text-sm text-muted-foreground">Security Alerts</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-success">0</div>
              <div className="text-sm text-muted-foreground">Policy Violations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Management & Alerts
          </CardTitle>
          <CardDescription>
            Configure security alerts and risk mitigation policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Security Alert Recipients</Label>
                <Input placeholder="security@company.com, admin@company.com" />
              </div>
              
              <div className="space-y-2">
                <Label>Incident Response Team</Label>
                <Input placeholder="incident-response@company.com" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automated Breach Detection</Label>
                  <div className="text-sm text-muted-foreground">
                    Auto-detect and alert on potential breaches
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Risk Assessment Frequency</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Compliance Review Cycle</Label>
                <Select defaultValue="quarterly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}