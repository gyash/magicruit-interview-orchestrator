import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Clock, Users, PhoneCall, RotateCcw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JoinStatus {
  participant_email: string;
  participant_name: string;
  participant_type: 'candidate' | 'interviewer';
  joined: boolean;
  join_time?: string;
  last_seen?: string;
  retry_count: number;
}

interface NoShowDetectorProps {
  interview: any;
  onNoShowDetected: (participants: JoinStatus[]) => void;
  onRetryTriggered: (participant: JoinStatus) => void;
}

const NoShowDetector = ({ interview, onNoShowDetected, onRetryTriggered }: NoShowDetectorProps) => {
  const { toast } = useToast();
  const [joinStatuses, setJoinStatuses] = useState<JoinStatus[]>([]);
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [retryPhase, setRetryPhase] = useState<'waiting' | 'retry_3min' | 'retry_5min' | 'no_show'>('waiting');

  // Initialize join monitoring
  useEffect(() => {
    if (interview?.status === 'scheduled') {
      initializeMonitoring();
    }
  }, [interview]);

  const initializeMonitoring = () => {
    // Mock participant setup
    const mockParticipants: JoinStatus[] = [
      {
        participant_email: "candidate@email.com",
        participant_name: "John Candidate", 
        participant_type: 'candidate',
        joined: false,
        retry_count: 0
      },
      ...interview.interviewers.map((email: string, index: number) => ({
        participant_email: email,
        participant_name: `Interviewer ${index + 1}`,
        participant_type: 'interviewer' as const,
        joined: false,
        retry_count: 0
      }))
    ];
    
    setJoinStatuses(mockParticipants);
    startMonitoring();
  };

  const startMonitoring = () => {
    setMonitoringActive(true);
    setTimeElapsed(0);
    
    // Simulate interview start monitoring
    const monitoringInterval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        
        // Simulate random joins
        if (newTime > 2 && Math.random() > 0.7) {
          simulateParticipantJoin();
        }
        
        // Trigger retry phases
        if (newTime === 180) { // 3 minutes
          setRetryPhase('retry_3min');
          triggerRetryLogic();
        } else if (newTime === 300) { // 5 minutes  
          setRetryPhase('retry_5min');
          triggerRetryLogic();
        } else if (newTime === 600) { // 10 minutes
          setRetryPhase('no_show');
          handleNoShow();
        }
        
        return newTime;
      });
    }, 1000);

    // Cleanup after 12 minutes
    setTimeout(() => {
      clearInterval(monitoringInterval);
      setMonitoringActive(false);
    }, 720000);
  };

  const simulateParticipantJoin = () => {
    setJoinStatuses(prev => 
      prev.map(participant => {
        if (!participant.joined && Math.random() > 0.5) {
          return {
            ...participant,
            joined: true,
            join_time: new Date().toISOString(),
            last_seen: new Date().toISOString()
          };
        }
        return participant;
      })
    );
  };

  const triggerRetryLogic = () => {
    const absentParticipants = joinStatuses.filter(p => !p.joined);
    
    if (absentParticipants.length > 0) {
      absentParticipants.forEach(participant => {
        const updatedParticipant = {
          ...participant,
          retry_count: participant.retry_count + 1
        };
        
        onRetryTriggered(updatedParticipant);
        
        // Update retry count
        setJoinStatuses(prev =>
          prev.map(p => 
            p.participant_email === participant.participant_email 
              ? updatedParticipant 
              : p
          )
        );
      });

      toast({
        title: "Retry Notifications Sent",
        description: `${absentParticipants.length} participant(s) notified to join`,
        variant: "default"
      });
    }
  };

  const handleNoShow = () => {
    const absentParticipants = joinStatuses.filter(p => !p.joined);
    
    if (absentParticipants.length > 0) {
      onNoShowDetected(absentParticipants);
      
      toast({
        title: "No-Show Detected",
        description: `${absentParticipants.length} participant(s) failed to join. Triggering reschedule flow.`,
        variant: "destructive"
      });
    }
  };

  const manualRetry = (participant: JoinStatus) => {
    const updatedParticipant = {
      ...participant,
      retry_count: participant.retry_count + 1
    };
    
    setJoinStatuses(prev =>
      prev.map(p => 
        p.participant_email === participant.participant_email 
          ? updatedParticipant 
          : p
      )
    );
    
    onRetryTriggered(updatedParticipant);
    
    toast({
      title: "Manual Retry Sent",
      description: `Notification sent to ${participant.participant_name}`,
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRetryPhaseColor = () => {
    switch (retryPhase) {
      case 'waiting': return 'text-muted-foreground';
      case 'retry_3min': return 'text-warning';
      case 'retry_5min': return 'text-warning';
      case 'no_show': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const joinedCount = joinStatuses.filter(p => p.joined).length;
  const totalCount = joinStatuses.length;
  const joinPercentage = totalCount > 0 ? (joinedCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Live Join Monitoring
        </CardTitle>
        <CardDescription>
          Real-time VC attendance tracking with automated retry logic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monitoring Status */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium">Interview Status</div>
              <div className="text-sm text-muted-foreground">
                {monitoringActive ? 'Live monitoring active' : 'Monitoring inactive'}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatTime(timeElapsed)}</div>
              <div className={`text-sm ${getRetryPhaseColor()}`}>
                {retryPhase.replace('_', ' ')}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Participants Joined</span>
              <span>{joinedCount}/{totalCount}</span>
            </div>
            <Progress value={joinPercentage} className="h-2" />
          </div>
        </div>

        {/* Participant Status */}
        <div className="space-y-3">
          <div className="font-medium text-sm">Participant Join Status</div>
          
          {joinStatuses.map((participant) => (
            <div
              key={participant.participant_email}
              className={`p-3 border rounded-lg ${
                participant.joined ? 'border-success bg-success/5' : 'border-warning bg-warning/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    participant.joined ? 'bg-success' : 'bg-warning'
                  }`}></div>
                  <div>
                    <div className="font-medium text-sm">{participant.participant_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {participant.participant_type} • {participant.participant_email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {participant.joined ? (
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Joined
                      </Badge>
                      {participant.join_time && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(participant.join_time).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="text-right text-xs">
                        <div className="text-warning">Not joined</div>
                        {participant.retry_count > 0 && (
                          <div className="text-muted-foreground">
                            {participant.retry_count} retries sent
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => manualRetry(participant)}
                        className="text-xs h-7"
                      >
                        <PhoneCall className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Retry Logic Status */}
        {monitoringActive && (
          <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
            <div className="font-medium text-sm mb-2">Automated Retry Schedule</div>
            <div className="space-y-1 text-xs">
              <div className={timeElapsed >= 180 ? 'text-success' : 'text-muted-foreground'}>
                ✓ 3 min: First retry notification {timeElapsed >= 180 && '(Completed)'}
              </div>
              <div className={timeElapsed >= 300 ? 'text-success' : 'text-muted-foreground'}>
                ✓ 5 min: Second retry + escalation {timeElapsed >= 300 && '(Completed)'}
              </div>
              <div className={timeElapsed >= 600 ? 'text-error' : 'text-muted-foreground'}>
                ✓ 10 min: Mark as no-show + trigger reschedule {timeElapsed >= 600 && '(Triggered)'}
              </div>
            </div>
          </div>
        )}

        {/* Manual Controls */}
        {monitoringActive && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMonitoringActive(false)}
            >
              Stop Monitoring
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNoShow()}
              className="text-error border-error"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Mark No-Show
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoShowDetector;