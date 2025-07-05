import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, Zap, CheckCircle, Clock } from "lucide-react";
import { mockCandidates, mockJobs, mockInterviewers } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const BulkScheduling = () => {
  const { toast } = useToast();
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [schedulingResults, setSchedulingResults] = useState<any[]>([]);

  const selectedJob = mockJobs.find(job => job.id === selectedJobId);
  const availableCandidates = mockCandidates.filter(c => c.status === 'screening');

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleInterviewerToggle = (interviewerId: string) => {
    setSelectedInterviewers(prev => 
      prev.includes(interviewerId) 
        ? prev.filter(id => id !== interviewerId)
        : [...prev, interviewerId]
    );
  };

  const handleBulkSchedule = async () => {
    if (!selectedJobId || selectedCandidates.length === 0 || selectedInterviewers.length === 0) {
      toast({
        title: "Missing Selection",
        description: "Please select job, candidates, and interviewers",
        variant: "destructive"
      });
      return;
    }

    setIsScheduling(true);
    setProgress(0);

    // Simulate bulk scheduling with progress
    const results = [];
    for (let i = 0; i < selectedCandidates.length; i++) {
      const candidate = mockCandidates.find(c => c.id === selectedCandidates[i]);
      const randomInterviewer = selectedInterviewers[Math.floor(Math.random() * selectedInterviewers.length)];
      const interviewer = mockInterviewers.find(int => int.email === randomInterviewer);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const success = Math.random() > 0.15; // 85% success rate
      
      results.push({
        candidateId: selectedCandidates[i],
        candidateName: candidate?.name,
        interviewer: interviewer?.name,
        success,
        scheduledTime: success ? `Jan ${15 + Math.floor(Math.random() * 5)}, ${10 + Math.floor(Math.random() * 6)}:00 AM` : null,
        reason: success ? 'Scheduled successfully' : 'No available slots this week'
      });
      
      setProgress(((i + 1) / selectedCandidates.length) * 100);
    }
    
    setSchedulingResults(results);
    setIsScheduling(false);
    
    const successCount = results.filter(r => r.success).length;
    
    toast({
      title: "Bulk Scheduling Complete",
      description: `${successCount}/${results.length} interviews scheduled successfully`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk Interview Scheduling
        </CardTitle>
        <CardDescription>
          Schedule multiple interviews simultaneously with automatic distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Job Selection */}
        <div className="space-y-2">
          <Label htmlFor="bulk-job-select">Job Position</Label>
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger>
              <SelectValue placeholder="Select job position" />
            </SelectTrigger>
            <SelectContent>
              {mockJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title} - {job.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedJob && (
          <>
            {/* Candidate Selection */}
            <div className="space-y-3">
              <Label>Select Candidates ({selectedCandidates.length} selected)</Label>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
                {availableCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded"
                  >
                    <Checkbox
                      id={candidate.id}
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={() => handleCandidateToggle(candidate.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-sm text-muted-foreground">{candidate.email}</div>
                    </div>
                    <Badge variant="outline">{candidate.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Interviewer Selection */}
            <div className="space-y-3">
              <Label>Available Interviewers ({selectedInterviewers.length} selected)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mockInterviewers.map((interviewer) => (
                  <div
                    key={interviewer.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedInterviewers.includes(interviewer.email)
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleInterviewerToggle(interviewer.email)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{interviewer.name}</div>
                        <div className="text-xs text-muted-foreground">{interviewer.role}</div>
                      </div>
                      <div className="text-xs">
                        {interviewer.availability_score}% available
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk Schedule Button */}
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
                    disabled={selectedCandidates.length === 0 || selectedInterviewers.length === 0}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Bulk Schedule ({selectedCandidates.length} interviews)
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Bulk Scheduling Progress
                    </DialogTitle>
                    <DialogDescription>
                      AI is automatically scheduling {selectedCandidates.length} interviews across {selectedInterviewers.length} interviewers
                    </DialogDescription>
                  </DialogHeader>

                  {isScheduling && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Scheduling progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="text-center text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                        <p>Finding optimal time slots...</p>
                      </div>
                    </div>
                  )}

                  {schedulingResults.length > 0 && !isScheduling && (
                    <div className="space-y-4">
                      <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="font-medium">
                            Bulk Scheduling Complete
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {schedulingResults.filter(r => r.success).length}/{schedulingResults.length} interviews scheduled successfully
                        </p>
                      </div>

                      <div className="max-h-64 overflow-y-auto">
                        {schedulingResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0">
                            <div>
                              <div className="font-medium text-sm">{result.candidateName}</div>
                              <div className="text-xs text-muted-foreground">
                                {result.success ? `with ${result.interviewer}` : result.reason}
                              </div>
                            </div>
                            <div className="text-right">
                              {result.success ? (
                                <div>
                                  <Badge variant="outline">Scheduled</Badge>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {result.scheduledTime}
                                  </div>
                                </div>
                              ) : (
                                <Badge variant="destructive">Failed</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    {!isScheduling && schedulingResults.length === 0 && (
                      <>
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleBulkSchedule}>
                          Start Bulk Scheduling
                        </Button>
                      </>
                    )}
                    {schedulingResults.length > 0 && (
                      <Button onClick={() => setSchedulingResults([])}>
                        Close
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkScheduling;