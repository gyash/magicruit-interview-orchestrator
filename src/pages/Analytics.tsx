import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, TrendingUp, BarChart3, Download, Mail, Save, DollarSign, Zap, Target, UserCheck, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PanelistLoadChart from "@/components/PanelistLoadChart";

const Analytics = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("7d");
  const [emailEnabled, setEmailEnabled] = useState(false);

  // Mock analytics data
  const metrics = {
    totalInterviews: 247,
    scheduledInterviews: 198,
    completedInterviews: 176,
    cancelledInterviews: 22,
    noShows: 8,
    timeSavedHours: 124,
    autoScheduleRate: 89,
    avgSchedulingTime: 12, // minutes
    candidateSatisfaction: 4.6,
    interviewerUtilization: 78,
    costSavings: 15600, // dollars
    slaCompliance: 94
  };

  const weeklyTrends = [
    { week: "Week 1", interviews: 45, timeSaved: 28, satisfaction: 4.5 },
    { week: "Week 2", interviews: 52, timeSaved: 32, satisfaction: 4.6 },
    { week: "Week 3", interviews: 61, timeSaved: 35, satisfaction: 4.7 },
    { week: "Week 4", interviews: 89, timeSaved: 29, satisfaction: 4.4 }
  ];

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics report is being generated...",
    });
  };

  const handleEmailSetup = () => {
    setEmailEnabled(!emailEnabled);
    toast({
      title: emailEnabled ? "Email Reports Disabled" : "Email Reports Enabled",
      description: emailEnabled ? 
        "Weekly reports will no longer be sent" : 
        "Weekly reports will be sent every Monday at 9 AM",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track performance, efficiency, and key recruitment metrics</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button 
            variant={emailEnabled ? "default" : "outline"} 
            onClick={handleEmailSetup}
          >
            <Mail className="h-4 w-4 mr-2" />
            {emailEnabled ? "Email On" : "Email Off"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalInterviews}</div>
                <p className="text-xs text-muted-foreground">+23% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {Math.round((metrics.completedInterviews / metrics.totalInterviews) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">{metrics.completedInterviews} completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {Math.round((metrics.noShows / metrics.totalInterviews) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">{metrics.noShows} no-shows</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{metrics.slaCompliance}%</div>
                <p className="text-xs text-muted-foreground">Above 90% target</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Efficiency Tab */}
        <TabsContent value="efficiency">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{metrics.timeSavedHours}h</div>
                <p className="text-xs text-muted-foreground">Through automation</p>
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground mb-2">Weekly breakdown:</div>
                  <Progress value={78} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">78% from auto-scheduling</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto-Schedule Rate</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{metrics.autoScheduleRate}%</div>
                <p className="text-xs text-muted-foreground">Target: 80%</p>
                <div className="mt-4">
                  <Progress value={metrics.autoScheduleRate} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">Exceeding target by 9%</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">${metrics.costSavings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Coordination efficiency</p>
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    <div>• Reduced manual work: $8,400</div>
                    <div>• Fewer reschedules: $4,200</div>
                    <div>• Improved utilization: $3,000</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Satisfaction Tab */}
        <TabsContent value="satisfaction">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Satisfaction</CardTitle>
                <CardDescription>Based on post-interview surveys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success mb-4">{metrics.candidateSatisfaction}/5.0</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scheduling Experience</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-20 h-2" />
                      <span className="text-sm">4.6</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Communication Quality</span>
                    <div className="flex items-center gap-2">
                      <Progress value={88} className="w-20 h-2" />
                      <span className="text-sm">4.4</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Technical Issues</span>
                    <div className="flex items-center gap-2">
                      <Progress value={94} className="w-20 h-2" />
                      <span className="text-sm">4.7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interviewer Utilization</CardTitle>
                <CardDescription>Panel efficiency and workload balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-4">{metrics.interviewerUtilization}%</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Senior Engineers</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20 h-2" />
                      <Badge variant="outline">85%</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tech Leads</span>
                    <div className="flex items-center gap-2">
                      <Progress value={72} className="w-20 h-2" />
                      <Badge variant="outline">72%</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Managers</span>
                    <div className="flex items-center gap-2">
                      <Progress value={68} className="w-20 h-2" />
                      <Badge variant="outline">68%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Weekly performance over the last month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {weeklyTrends.map((week, index) => (
                  <div key={week.week} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{week.week}</div>
                      <div className="text-sm text-muted-foreground">
                        {week.interviews} interviews • {week.timeSaved}h saved • {week.satisfaction}★
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{week.interviews}</div>
                        <div className="text-xs text-muted-foreground">interviews</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-success">{week.timeSaved}h</div>
                        <div className="text-xs text-muted-foreground">saved</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{week.satisfaction}</div>
                        <div className="text-xs text-muted-foreground">rating</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email Notification Setup */}
      {emailEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Weekly Email Reports
            </CardTitle>
            <CardDescription>
              Automated reports will be sent every Monday at 9:00 AM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipients</label>
                <div className="space-y-1">
                  <Badge variant="secondary">team@company.com</Badge>
                  <Badge variant="secondary">hr@company.com</Badge>
                  <Badge variant="secondary">management@company.com</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Sections</label>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>✓ Executive Summary</div>
                  <div>✓ Key Metrics</div>
                  <div>✓ Efficiency Gains</div>
                  <div>✓ Action Items</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule</label>
                <div className="text-sm text-muted-foreground">
                  <div>Every Monday, 9:00 AM</div>
                  <div>Timezone: UTC-8 (PST)</div>
                  <div>Format: PDF + Email</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Panelist Load Analytics */}
      <PanelistLoadChart />
    </div>
  );
};

export default Analytics;