import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BarChart, Mail, Calendar, Bell, Download, Settings, TrendingUp } from "lucide-react";

export function ReportingConfigTab() {
  const reportTypes = [
    { id: 'interview-metrics', label: 'Interview Metrics', description: 'Completion rates, no-shows, feedback scores' },
    { id: 'interviewer-load', label: 'Interviewer Load', description: 'Workload distribution and availability' },
    { id: 'time-analytics', label: 'Time Analytics', description: 'Time to hire, scheduling efficiency' },
    { id: 'candidate-experience', label: 'Candidate Experience', description: 'Feedback scores and satisfaction' },
    { id: 'system-performance', label: 'System Performance', description: 'Usage stats and technical metrics' },
    { id: 'compliance-audit', label: 'Compliance Audit', description: 'GDPR compliance and data handling' }
  ];

  const scheduledReports = [
    { name: 'Weekly Interview Summary', recipients: 'hr-team@company.com', frequency: 'Weekly', nextRun: '2025-01-12' },
    { name: 'Monthly Analytics Dashboard', recipients: 'management@company.com', frequency: 'Monthly', nextRun: '2025-02-01' },
    { name: 'Quarterly Compliance Report', recipients: 'legal@company.com', frequency: 'Quarterly', nextRun: '2025-04-01' }
  ];

  return (
    <div className="grid gap-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>
            Configure automated reports and analytics dashboards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Report Name</Label>
                <Input placeholder="e.g., Weekly Hiring Dashboard" />
              </div>
              
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Executive Dashboard</SelectItem>
                    <SelectItem value="detailed">Detailed Analytics</SelectItem>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="compliance">Compliance Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Data Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Include Metrics</Label>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {reportTypes.map((type) => (
                  <div key={type.id} className="flex items-start space-x-2">
                    <Checkbox id={type.id} defaultChecked />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={type.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.label}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90">
              Create Report
            </Button>
            <Button variant="outline">Preview</Button>
            <Button variant="outline">Save Template</Button>
          </div>
        </CardContent>
      </Card>

      {/* Automated Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Automated Report Scheduling
          </CardTitle>
          <CardDescription>
            Schedule regular delivery of reports via email or dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Delivery Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Delivery Time</Label>
                <div className="flex gap-2">
                  <Select defaultValue="09:00">
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">6:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="monday">
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Recipients</Label>
                <Input placeholder="email1@company.com, email2@company.com" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Delivery Format</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" defaultChecked />
                    <label htmlFor="email" className="text-sm">Email Report</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dashboard" />
                    <label htmlFor="dashboard" className="text-sm">Dashboard Notification</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="slack" />
                    <label htmlFor="slack" className="text-sm">Slack Message</label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Report Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV Data</SelectItem>
                    <SelectItem value="html">HTML Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Scheduled Reports
          </CardTitle>
          <CardDescription>
            Manage your active automated reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {scheduledReports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{report.name}</div>
                <div className="text-sm text-muted-foreground">
                  Recipients: {report.recipients}
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{report.frequency}</Badge>
                  <Badge variant="secondary">Next: {report.nextRun}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Switch defaultChecked />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* KPI Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            KPI Alerts & Thresholds
          </CardTitle>
          <CardDescription>
            Set up automated alerts when key metrics exceed thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label>No-show Rate Alert</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex gap-2">
                  <Input placeholder="15" className="w-20" />
                  <span className="text-sm text-muted-foreground self-center">% threshold</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Alert when no-show rate exceeds threshold
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label>Interview Load Alert</Label>
                  <Switch />
                </div>
                <div className="flex gap-2">
                  <Input placeholder="8" className="w-20" />
                  <span className="text-sm text-muted-foreground self-center">interviews/day</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Alert when interviewer load is too high
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label>Scheduling Efficiency</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex gap-2">
                  <Input placeholder="48" className="w-20" />
                  <span className="text-sm text-muted-foreground self-center">hours avg</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Alert when time-to-schedule exceeds target
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label>Candidate Satisfaction</Label>
                  <Switch />
                </div>
                <div className="flex gap-2">
                  <Input placeholder="4.0" className="w-20" />
                  <span className="text-sm text-muted-foreground self-center">rating minimum</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Alert when satisfaction drops below threshold
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <Label>Alert Recipients</Label>
              <Input placeholder="hr-managers@company.com, team-leads@company.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard Config */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analytics Dashboard Configuration
          </CardTitle>
          <CardDescription>
            Customize your analytics dashboard layout and widgets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Active Widgets</div>
              <Button variant="outline" size="sm" className="mt-2">Customize</Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Dashboard Views</div>
              <Button variant="outline" size="sm" className="mt-2">Manage</Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-muted-foreground">Data Sources</div>
              <Button variant="outline" size="sm" className="mt-2">Configure</Button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline">Dashboard Builder</Button>
            <Button variant="outline">Widget Library</Button>
            <Button variant="outline">Export Configuration</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}