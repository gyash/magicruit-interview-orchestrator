import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Users, TrendingUp, Search, Filter, Eye, Edit } from "lucide-react";
import { mockInterviews, mockCandidates, mockJobs, getCandidateById, getJobById, formatInterviewerName } from "@/lib/mockData";
import PanelistLoadChart from "@/components/PanelistLoadChart";
import EdgeCaseAlerts from "@/components/EdgeCaseAlerts";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate metrics
  const totalInterviews = mockInterviews.length;
  const scheduledInterviews = mockInterviews.filter(i => i.status === 'scheduled').length;
  const pendingInterviews = mockInterviews.filter(i => i.status === 'pending').length;
  const autoScheduleRate = Math.round((scheduledInterviews / totalInterviews) * 100);

  // Filter interviews
  const filteredInterviews = mockInterviews.filter(interview => {
    const candidate = getCandidateById(interview.candidate_id);
    const job = getJobById(interview.job_id);
    
    const matchesSearch = candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.stage_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      scheduled: "default",
      pending: "secondary", 
      completed: "outline",
      cancelled: "destructive",
      rescheduled: "secondary"
    };
    
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your recruitment coordination activities</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New Interview
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledInterviews}</div>
            <p className="text-xs text-muted-foreground">Ready to go</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingInterviews}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Schedule Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{autoScheduleRate}%</div>
            <p className="text-xs text-muted-foreground">Above target of 80%</p>
          </CardContent>
        </Card>
      </div>

      {/* Interview Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Manage and monitor all interview activities</CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates, jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Interviewers</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterviews.map((interview) => {
                  const candidate = getCandidateById(interview.candidate_id);
                  const job = getJobById(interview.job_id);
                  
                  return (
                    <TableRow key={interview.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{candidate?.name}</div>
                          <div className="text-sm text-muted-foreground">{candidate?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{job?.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                          {interview.stage_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {interview.interviewers.slice(0, 2).map((email) => (
                            <div key={email} className="text-sm">
                              {formatInterviewerName(email)}
                            </div>
                          ))}
                          {interview.interviewers.length > 2 && (
                            <div className="text-sm text-muted-foreground">
                              +{interview.interviewers.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDate(interview.scheduled_time)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(interview.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Panelist Load Analytics */}
      <PanelistLoadChart />

      {/* Edge Case Management */}
      <EdgeCaseAlerts />
    </div>
  );
};

export default Dashboard;