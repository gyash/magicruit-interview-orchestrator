import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Search, Filter, Eye, Edit, RotateCcw, MessageCircle, AlertTriangle } from "lucide-react";
import { mockInterviews, mockCandidates, mockJobs, getCandidateById, getJobById, formatInterviewerName } from "@/lib/mockData";

const Interviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInterview, setSelectedInterview] = useState<any>(null);

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

  // Group interviews by status
  const interviewsByStatus = {
    pending: filteredInterviews.filter(i => i.status === 'pending'),
    scheduled: filteredInterviews.filter(i => i.status === 'scheduled'),
    completed: filteredInterviews.filter(i => i.status === 'completed'),
    cancelled: filteredInterviews.filter(i => i.status === 'cancelled'),
    rescheduled: filteredInterviews.filter(i => i.status === 'rescheduled')
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-brand-primary" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'completed':
        return <Users className="h-4 w-4 text-success" />;
      case 'cancelled':
      case 'rescheduled':
        return <AlertTriangle className="h-4 w-4 text-error" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const InterviewCard = ({ interview }: { interview: any }) => {
    const candidate = getCandidateById(interview.candidate_id);
    const job = getJobById(interview.job_id);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(interview.status)}
              <div>
                <h4 className="font-semibold">{candidate?.name}</h4>
                <p className="text-sm text-muted-foreground">{job?.title}</p>
              </div>
            </div>
            {getStatusBadge(interview.status)}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
              <span>{interview.stage_name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDate(interview.scheduled_time)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{interview.interviewers.length} interviewer(s)</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setSelectedInterview(interview)}>
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Interview Details</DialogTitle>
                  <DialogDescription>
                    {candidate?.name} - {job?.title}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Candidate</label>
                      <div className="mt-1">
                        <div>{candidate?.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate?.email}</div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Position</label>
                      <div className="mt-1">
                        <div>{job?.title}</div>
                        <div className="text-sm text-muted-foreground">{job?.department}</div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Stage</label>
                      <div className="mt-1">{interview.stage_name}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Duration</label>
                      <div className="mt-1">{interview.duration_mins} minutes</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Scheduled Time</label>
                      <div className="mt-1">{formatDate(interview.scheduled_time)}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Meeting Mode</label>
                      <div className="mt-1">{interview.video_mode}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Interviewers</label>
                    <div className="mt-1 space-y-1">
                      {interview.interviewers.map((email: string) => (
                        <div key={email} className="text-sm">
                          {formatInterviewerName(email)} ({email})
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {interview.notes && (
                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <div className="mt-1 p-2 bg-muted rounded text-sm">
                        {interview.notes}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            
            {interview.status === 'cancelled' && (
              <Button variant="outline" size="sm">
                <RotateCcw className="h-3 w-3 mr-1" />
                Reschedule
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all interview activities across your organization
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates, positions, or stages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interview Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({filteredInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending ({interviewsByStatus.pending.length})
            {interviewsByStatus.pending.length > 0 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full"></div>
            )}
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({interviewsByStatus.scheduled.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({interviewsByStatus.completed.length})
          </TabsTrigger>
          <TabsTrigger value="issues" className="relative">
            Issues ({interviewsByStatus.cancelled.length + interviewsByStatus.rescheduled.length})
            {(interviewsByStatus.cancelled.length + interviewsByStatus.rescheduled.length) > 0 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></div>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInterviews.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="mb-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="font-medium">Pending Interviews Need Attention</span>
            </div>
            <p className="text-sm text-muted-foreground">
              These interviews are waiting for scheduling confirmation or have conflicts that need resolution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewsByStatus.pending.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewsByStatus.scheduled.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewsByStatus.completed.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-error" />
              <span className="font-medium">Interviews Requiring Action</span>
            </div>
            <p className="text-sm text-muted-foreground">
              These interviews have been cancelled or rescheduled and may need follow-up.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...interviewsByStatus.cancelled, ...interviewsByStatus.rescheduled].map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredInterviews.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No interviews found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search criteria" 
              : "Start by scheduling your first interview"
            }
          </p>
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Schedule New Interview
          </Button>
        </div>
      )}
    </div>
  );
};

export default Interviews;