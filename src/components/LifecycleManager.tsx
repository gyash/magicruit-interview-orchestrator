import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Clock, Users, FileText, AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import { InterviewState, InterviewEvent } from "@/types/interview";
import { useToast } from "@/hooks/use-toast";

interface LifecycleStage {
  state: InterviewState;
  label: string;
  description: string;
  icon: any;
  color: string;
  automated: boolean;
  sla_hours?: number;
  escalation_threshold?: number;
}

interface InterviewLifecycle {
  id: string;
  candidate_name: string;
  job_title: string;
  current_state: InterviewState;
  state_history: InterviewEvent[];
  stage_progress: number;
  sla_status: 'on_track' | 'at_risk' | 'overdue';
  time_in_current_state: number; // hours
  next_action: string;
  assigned_rc: string;
}

const LifecycleManager = () => {
  const { toast } = useToast();
  const [interviews, setInterviews] = useState<InterviewLifecycle[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<InterviewLifecycle | null>(null);
  const [showLifecycleDetails, setShowLifecycleDetails] = useState(false);

  const lifecycleStages: LifecycleStage[] = [
    {
      state: 'created',
      label: 'Created',
      description: 'Interview request received from ATS',
      icon: FileText,
      color: 'bg-muted',
      automated: true,
      sla_hours: 1
    },
    {
      state: 'slots_generated',
      label: 'Slots Generated',
      description: 'Smart link created and sent to candidate',
      icon: Clock,
      color: 'bg-brand-primary',
      automated: true,
      sla_hours: 0.5
    },
    {
      state: 'slot_confirmed',
      label: 'Slot Confirmed',
      description: 'Candidate selected preferred time',
      icon: CheckCircle,
      color: 'bg-success',
      automated: false,
      sla_hours: 48,
      escalation_threshold: 24
    },
    {
      state: 'notified',
      label: 'All Notified',
      description: 'Calendar invites and reminders sent',
      icon: Users,
      color: 'bg-brand-primary',
      automated: true,
      sla_hours: 0.25
    },
    {
      state: 'in_progress',
      label: 'In Progress',
      description: 'Interview is currently happening',
      icon: Users,
      color: 'bg-warning',
      automated: false
    },
    {
      state: 'completed',
      label: 'Completed',
      description: 'Interview finished, feedback pending',
      icon: CheckCircle,
      color: 'bg-success',
      automated: false,
      sla_hours: 24,
      escalation_threshold: 4
    },
    {
      state: 'closed',
      label: 'Closed',
      description: 'Feedback received, process complete',
      icon: CheckCircle,
      color: 'bg-success',
      automated: false
    }
  ];

  useEffect(() => {
    generateMockInterviews();
  }, []);

  const generateMockInterviews = () => {
    const mockInterviews: InterviewLifecycle[] = [
      {
        id: 'lifecycle-1',
        candidate_name: 'Sarah Chen',
        job_title: 'Senior Software Engineer',
        current_state: 'slot_confirmed',
        state_history: [
          { id: '1', interview_id: 'lifecycle-1', state: 'created', timestamp: new Date(Date.now() - 3600000).toISOString(), triggered_by: 'ats' },
          { id: '2', interview_id: 'lifecycle-1', state: 'slots_generated', timestamp: new Date(Date.now() - 3300000).toISOString(), triggered_by: 'system' },
          { id: '3', interview_id: 'lifecycle-1', state: 'slot_confirmed', timestamp: new Date(Date.now() - 1800000).toISOString(), triggered_by: 'candidate' }
        ],
        stage_progress: 50,
        sla_status: 'on_track',
        time_in_current_state: 0.5,
        next_action: 'Send calendar invites',
        assigned_rc: 'Alice Cooper'
      },
      {
        id: 'lifecycle-2',
        candidate_name: 'Marcus Johnson',
        job_title: 'Product Manager',
        current_state: 'completed',
        state_history: [
          { id: '4', interview_id: 'lifecycle-2', state: 'created', timestamp: new Date(Date.now() - 86400000).toISOString(), triggered_by: 'ats' },
          { id: '5', interview_id: 'lifecycle-2', state: 'completed', timestamp: new Date(Date.now() - 7200000).toISOString(), triggered_by: 'system' }
        ],
        stage_progress: 85,
        sla_status: 'at_risk',
        time_in_current_state: 2,
        next_action: 'Follow up on feedback',
        assigned_rc: 'Bob Smith'
      },
      {
        id: 'lifecycle-3',
        candidate_name: 'Elena Rodriguez',
        job_title: 'DevOps Engineer',
        current_state: 'slots_generated',
        state_history: [
          { id: '6', interview_id: 'lifecycle-3', state: 'created', timestamp: new Date(Date.now() - 7200000).toISOString(), triggered_by: 'ats' },
          { id: '7', interview_id: 'lifecycle-3', state: 'slots_generated', timestamp: new Date(Date.now() - 6000000).toISOString(), triggered_by: 'system' }
        ],
        stage_progress: 25,
        sla_status: 'overdue',
        time_in_current_state: 26,
        next_action: 'Candidate reminder needed',
        assigned_rc: 'Carol Davis'
      }
    ];

    setInterviews(mockInterviews);
  };

  const progressToNextState = (interviewId: string) => {
    setInterviews(prev => 
      prev.map(interview => {
        if (interview.id === interviewId) {
          const currentStageIndex = lifecycleStages.findIndex(s => s.state === interview.current_state);
          const nextStage = lifecycleStages[currentStageIndex + 1];
          
          if (nextStage) {
            const newEvent: InterviewEvent = {
              id: `event-${Date.now()}`,
              interview_id: interviewId,
              state: nextStage.state,
              timestamp: new Date().toISOString(),
              triggered_by: 'system'
            };

            return {
              ...interview,
              current_state: nextStage.state,
              state_history: [...interview.state_history, newEvent],
              stage_progress: Math.min(100, interview.stage_progress + 15),
              time_in_current_state: 0,
              sla_status: 'on_track' as const
            };
          }
        }
        return interview;
      })
    );

    toast({
      title: "State Advanced",
      description: "Interview progressed to next stage",
    });
  };

  const escalateInterview = (interviewId: string) => {
    setInterviews(prev =>
      prev.map(interview =>
        interview.id === interviewId
          ? { ...interview, sla_status: 'overdue' as const }
          : interview
      )
    );

    toast({
      title: "Interview Escalated",
      description: "RC has been notified for manual intervention",
      variant: "destructive"
    });
  };

  const getSLABadge = (status: InterviewLifecycle['sla_status']) => {
    const variants = {
      on_track: { variant: 'default' as const, label: 'On Track', color: 'text-success' },
      at_risk: { variant: 'secondary' as const, label: 'At Risk', color: 'text-warning' },
      overdue: { variant: 'destructive' as const, label: 'Overdue', color: 'text-error' }
    };
    return variants[status];
  };

  const getProgressColor = (progress: number, slaStatus: string) => {
    if (slaStatus === 'overdue') return 'bg-error';
    if (slaStatus === 'at_risk') return 'bg-warning';
    return 'bg-success';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Interview Lifecycle Management
          </CardTitle>
          <CardDescription>
            Complete coordination workflow from creation to closure with SLA tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lifecycle Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">On Track</div>
                  <div className="text-2xl font-bold text-success">
                    {interviews.filter(i => i.sla_status === 'on_track').length}
                  </div>
                </div>
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
            
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">At Risk</div>
                  <div className="text-2xl font-bold text-warning">
                    {interviews.filter(i => i.sla_status === 'at_risk').length}
                  </div>
                </div>
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
            
            <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Overdue</div>
                  <div className="text-2xl font-bold text-error">
                    {interviews.filter(i => i.sla_status === 'overdue').length}
                  </div>
                </div>
                <AlertTriangle className="h-6 w-6 text-error" />
              </div>
            </div>
          </div>

          {/* Active Interviews */}
          <div className="space-y-4">
            <div className="font-medium">Active Interview Workflows</div>
            
            {interviews.map((interview) => {
              const currentStage = lifecycleStages.find(s => s.state === interview.current_state);
              const slaInfo = getSLABadge(interview.sla_status);
              const IconComponent = currentStage?.icon || Clock;
              
              return (
                <div
                  key={interview.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                    interview.sla_status === 'overdue' ? 'border-error bg-error/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{interview.candidate_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {interview.job_title} • RC: {interview.assigned_rc}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={slaInfo.variant}>
                        {slaInfo.label}
                      </Badge>
                      <Badge variant="outline">
                        {currentStage?.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{interview.stage_progress}%</span>
                    </div>
                    <Progress 
                      value={interview.stage_progress} 
                      className="h-2"
                    />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current State: </span>
                        <span>{currentStage?.description}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time in State: </span>
                        <span className={interview.time_in_current_state > 24 ? 'text-error' : ''}>
                          {interview.time_in_current_state}h
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded text-sm">
                      <div className="font-medium mb-1">Next Action Required:</div>
                      <div>{interview.next_action}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => progressToNextState(interview.id)}
                        disabled={interview.current_state === 'closed'}
                      >
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Progress
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedInterview(interview);
                          setShowLifecycleDetails(true);
                        }}
                      >
                        View Details
                      </Button>
                      
                      {interview.sla_status !== 'overdue' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => escalateInterview(interview.id)}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showLifecycleDetails} onOpenChange={setShowLifecycleDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Interview Lifecycle Details</DialogTitle>
            <DialogDescription>
              Complete state history and audit trail
            </DialogDescription>
          </DialogHeader>
          
          {selectedInterview && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="font-medium mb-2">{selectedInterview.candidate_name}</div>
                <div className="text-sm space-y-1">
                  <div>Position: {selectedInterview.job_title}</div>
                  <div>Current State: {lifecycleStages.find(s => s.state === selectedInterview.current_state)?.label}</div>
                  <div>Progress: {selectedInterview.stage_progress}%</div>
                  <div>RC: {selectedInterview.assigned_rc}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="font-medium">State History</div>
                {selectedInterview.state_history.map((event, index) => {
                  const stage = lifecycleStages.find(s => s.state === event.state);
                  const EventIcon = stage?.icon || Clock;
                  
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                      <EventIcon className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{stage?.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()} • by {event.triggered_by}
                        </div>
                      </div>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs">Current</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LifecycleManager;