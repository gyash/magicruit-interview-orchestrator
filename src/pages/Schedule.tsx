import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, Mail, Phone, MapPin, Video, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { mockJobs, mockCandidates, mockInterviewers, mockWorkflows, getWorkflowByJobId } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Schedule = () => {
  const { toast } = useToast();
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [preferredTimes, setPreferredTimes] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedJob = mockJobs.find(job => job.id === selectedJobId);
  const selectedCandidate = mockCandidates.find(candidate => candidate.id === selectedCandidateId);
  const workflow = selectedJobId ? getWorkflowByJobId(selectedJobId) : null;

  const handleAutoSchedule = async () => {
    if (!selectedJobId || (!selectedCandidateId && !candidateEmail)) {
      toast({
        title: "Missing Information",
        description: "Please select a job and candidate before scheduling",
        variant: "destructive"
      });
      return;
    }

    if (!workflow) {
      toast({
        title: "No Workflow Found",
        description: "Please create a workflow for this job first",
        variant: "destructive"
      });
      return;
    }

    setIsScheduling(true);

    // Simulate AI scheduling process
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsScheduling(false);
    setShowSuccess(true);

    toast({
      title: "Interview Scheduled Successfully!",
      description: "All parties have been notified and calendar invites sent.",
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    const today = new Date();
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Generate morning and afternoon slots
      slots.push({
        date: date.toLocaleDateString(),
        time: "10:00 AM",
        available: Math.random() > 0.3
      });
      slots.push({
        date: date.toLocaleDateString(),
        time: "2:00 PM", 
        available: Math.random() > 0.3
      });
      slots.push({
        date: date.toLocaleDateString(),
        time: "4:00 PM",
        available: Math.random() > 0.3
      });
    }
    
    return slots.filter(slot => slot.available);
  };

  const availableSlots = generateTimeSlots();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Scheduling</h1>
          <p className="text-muted-foreground">
            AI-powered interview coordination with automatic conflict resolution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <Zap className="h-3 w-3" />
            AI Enabled
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scheduling Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Interview</CardTitle>
              <CardDescription>
                Let AI find the perfect time slots for all participants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-select">Job Position</Label>
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job position" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockJobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{job.title}</span>
                            <Badge variant="outline">{job.department}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedJob && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{selectedJob.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedJob.department} • {selectedJob.location}
                        </p>
                      </div>
                      <Badge variant={selectedJob.status === 'active' ? 'default' : 'secondary'}>
                        {selectedJob.status}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Candidate Selection */}
              <div className="space-y-4">
                <Label>Candidate</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidate-select">Existing Candidate</Label>
                    <Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCandidates.map((candidate) => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            <div>
                              <div className="font-medium">{candidate.name}</div>
                              <div className="text-sm text-muted-foreground">{candidate.email}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">or</span>
                  </div>
                </div>

                {/* New candidate form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidate-email">New Candidate Email</Label>
                    <Input
                      id="candidate-email"
                      type="email"
                      placeholder="candidate@email.com"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="candidate-phone">Phone (Optional)</Label>
                    <Input
                      id="candidate-phone"
                      placeholder="+1-555-0123"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Candidate Preferences */}
              <div className="space-y-2">
                <Label htmlFor="preferred-times">Candidate Preferences</Label>
                <Textarea
                  id="preferred-times"
                  placeholder="e.g., Mornings preferred, avoid Fridays, EST timezone..."
                  value={preferredTimes}
                  onChange={(e) => setPreferredTimes(e.target.value)}
                />
              </div>

              {/* Workflow Preview */}
              {workflow && (
                <div className="space-y-4">
                  <Label>Interview Workflow</Label>
                  <div className="border rounded-lg p-4 space-y-3">
                    {workflow.stages.map((stage, index) => (
                      <div key={stage.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{index + 1}</Badge>
                          <div>
                            <div className="font-medium">{stage.stage_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {stage.duration_mins} min • {stage.mode}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stage.interviewers.length} interviewer(s)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule Button */}
              <div className="flex justify-end">
                <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
                      disabled={!selectedJobId || (!selectedCandidateId && !candidateEmail)}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Auto-Schedule Interview
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-brand-primary" />
                        AI Scheduling in Progress...
                      </DialogTitle>
                      <DialogDescription>
                        Our AI is analyzing calendars and finding optimal time slots
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-brand-primary" />
                          </div>
                          <span>Analyzing panelist availability...</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center animate-pulse">
                            <Clock className="h-4 w-4 text-brand-primary" />
                          </div>
                          <span>Finding optimal time slots...</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-muted-foreground">Preparing calendar invites...</span>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsScheduling(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAutoSchedule}>
                        Complete Scheduling
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Slots & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Available Slots
              </CardTitle>
              <CardDescription>
                Next available time slots based on panel availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableSlots.slice(0, 6).map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div>
                      <div className="font-medium">{slot.date}</div>
                      <div className="text-sm text-muted-foreground">{slot.time}</div>
                    </div>
                    <Badge variant="outline">Available</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Panel Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockInterviewers.slice(0, 4).map((interviewer) => (
                  <div key={interviewer.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{interviewer.name}</div>
                      <div className="text-xs text-muted-foreground">{interviewer.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">{interviewer.availability_score}%</div>
                      <div className={`w-2 h-2 rounded-full ${
                        interviewer.availability_score > 80 ? 'bg-success' : 
                        interviewer.availability_score > 60 ? 'bg-warning' : 'bg-error'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Auto-schedule Rate</span>
                  <span className="font-medium text-success">84%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Schedule Time</span>
                  <span className="font-medium">2.3 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-medium text-success">96%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Interview Scheduled Successfully!
            </DialogTitle>
            <DialogDescription>
              All participants have been notified and calendar invites sent.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-4 bg-success/10 rounded-lg">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Calendar invites sent to all participants</li>
                <li>✓ Candidate confirmation link shared</li>
                <li>✓ Backup interviewers notified</li>
                <li>✓ Automatic reminders scheduled</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowSuccess(false)}>
              Great!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;