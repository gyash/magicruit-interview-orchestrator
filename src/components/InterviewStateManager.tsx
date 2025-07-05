import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Calendar, Users, AlertTriangle, PlayCircle } from "lucide-react";
import { InterviewState, InterviewEvent, EnhancedInterview } from "@/types/interview";

interface InterviewStateManagerProps {
  interview: EnhancedInterview;
  onStateChange: (newState: InterviewState, metadata?: any) => void;
}

const InterviewStateManager = ({ interview, onStateChange }: InterviewStateManagerProps) => {
  const [currentState, setCurrentState] = useState<InterviewState>(interview.current_state);
  const [stateProgress, setStateProgress] = useState(0);

  // State progression mapping
  const stateFlow: InterviewState[] = [
    'created',
    'slots_generated', 
    'slot_confirmed',
    'notified',
    'in_progress',
    'completed',
    'closed'
  ];

  const stateConfig = {
    created: {
      label: "Interview Created",
      description: "Candidate marked ready in ATS",
      color: "secondary",
      icon: Calendar,
      canProgress: true,
      nextAction: "Generate Smart Link"
    },
    slots_generated: {
      label: "Smart Link Generated", 
      description: "Available slots sent to candidate",
      color: "default",
      icon: Clock,
      canProgress: false,
      nextAction: "Waiting for candidate selection"
    },
    slot_confirmed: {
      label: "Slot Confirmed",
      description: "Candidate selected preferred time",
      color: "default", 
      icon: CheckCircle,
      canProgress: true,
      nextAction: "Send Calendar Invites"
    },
    notified: {
      label: "All Parties Notified",
      description: "Calendar invites and reminders sent",
      color: "default",
      icon: Users,
      canProgress: true,
      nextAction: "Ready for interview"
    },
    in_progress: {
      label: "Interview In Progress",
      description: "Both parties have joined the call",
      color: "default",
      icon: PlayCircle,
      canProgress: true,
      nextAction: "Mark as completed"
    },
    completed: {
      label: "Interview Completed", 
      description: "Interview ended, feedback pending",
      color: "outline",
      icon: CheckCircle,
      canProgress: true,
      nextAction: "Collect feedback"
    },
    closed: {
      label: "Process Closed",
      description: "Feedback received, process complete", 
      color: "outline",
      icon: CheckCircle,
      canProgress: false,
      nextAction: null
    },
    no_show: {
      label: "No Show",
      description: "One or both parties failed to join",
      color: "destructive",
      icon: AlertTriangle,
      canProgress: true,
      nextAction: "Reschedule"
    },
    rescheduled: {
      label: "Rescheduled",
      description: "Interview moved to new time",
      color: "secondary", 
      icon: Calendar,
      canProgress: false,
      nextAction: "Generate new smart link"
    }
  };

  useEffect(() => {
    const currentIndex = stateFlow.indexOf(currentState);
    const progress = currentIndex >= 0 ? ((currentIndex + 1) / stateFlow.length) * 100 : 0;
    setStateProgress(progress);
  }, [currentState]);

  const handleStateTransition = (newState: InterviewState) => {
    setCurrentState(newState);
    onStateChange(newState, {
      timestamp: new Date().toISOString(),
      triggered_by: 'system'
    });
  };

  const getNextState = (): InterviewState | null => {
    const currentIndex = stateFlow.indexOf(currentState);
    return currentIndex < stateFlow.length - 1 ? stateFlow[currentIndex + 1] : null;
  };

  const config = stateConfig[currentState];
  const IconComponent = config.icon;
  const nextState = getNextState();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconComponent className="h-5 w-5" />
          Interview State Management
        </CardTitle>
        <CardDescription>
          Track interview progression through the complete lifecycle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current State Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{config.label}</div>
              <div className="text-sm text-muted-foreground">{config.description}</div>
            </div>
            <Badge variant={config.color as any}>
              {currentState.replace('_', ' ')}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(stateProgress)}%</span>
            </div>
            <Progress value={stateProgress} className="h-2" />
          </div>
        </div>

        {/* Action Button */}
        {config.canProgress && config.nextAction && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Next Step: {config.nextAction}
            </div>
            {nextState && (
              <Button
                onClick={() => handleStateTransition(nextState)}
                className="w-full"
                variant="outline"
              >
                {config.nextAction}
              </Button>
            )}
          </div>
        )}

        {/* State History */}
        <div className="space-y-3">
          <div className="font-medium text-sm">State History</div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {interview.state_history?.slice(0, 5).map((event, index) => {
              const eventConfig = stateConfig[event.state];
              const EventIcon = eventConfig.icon;
              
              return (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <EventIcon className="h-3 w-3 text-muted-foreground" />
                  <div className="flex-1">
                    <span className="font-medium">{eventConfig.label}</span>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.triggered_by}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special State Indicators */}
        {currentState === 'no_show' && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center gap-2 text-error text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              Requires Immediate Attention
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Interview marked as no-show. Reschedule or escalate to recruiter.
            </div>
          </div>
        )}

        {currentState === 'slots_generated' && (
          <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-brand-primary text-sm font-medium">
              <Clock className="h-4 w-4" />
              Waiting for Candidate Response
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Smart link sent. Auto-reminder in 24 hours if no selection.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewStateManager;