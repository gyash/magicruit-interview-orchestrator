import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock, User, Calendar, Bell, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EdgeCase {
  id: string;
  type: 'candidate_no_response' | 'no_availability' | 'interviewer_overloaded' | 'no_show';
  title: string;
  description: string;
  candidate?: string;
  interviewer?: string;
  timeRemaining?: string;
  severity: 'low' | 'medium' | 'high';
  actionRequired: boolean;
}

const EdgeCaseAlerts = () => {
  const { toast } = useToast();
  const [edgeCases, setEdgeCases] = useState<EdgeCase[]>([
    {
      id: '1',
      type: 'candidate_no_response',
      title: 'Candidate No Response',
      description: 'John Doe has not selected an interview slot within 48 hours',
      candidate: 'John Doe',
      timeRemaining: '4 hours',
      severity: 'high',
      actionRequired: true
    },
    {
      id: '2', 
      type: 'no_availability',
      title: 'No Panelist Availability',
      description: 'All interviewers are fully booked for Senior Engineer position this week',
      timeRemaining: 'Next week',
      severity: 'medium',
      actionRequired: true
    },
    {
      id: '3',
      type: 'interviewer_overloaded',
      title: 'Interviewer Overloaded',
      description: 'Alice Johnson has 12+ interviews scheduled this week',
      interviewer: 'Alice Johnson',
      severity: 'medium',
      actionRequired: false
    },
    {
      id: '4',
      type: 'no_show',
      title: 'Candidate No-Show',
      description: 'Jane Smith did not attend scheduled interview',
      candidate: 'Jane Smith',
      severity: 'high',
      actionRequired: true
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive">Critical</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'candidate_no_response': return <Clock className="h-4 w-4" />;
      case 'no_availability': return <Calendar className="h-4 w-4" />;
      case 'interviewer_overloaded': return <User className="h-4 w-4" />;
      case 'no_show': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleResolveCase = (caseId: string, action: string) => {
    setEdgeCases(prev => prev.filter(c => c.id !== caseId));
    
    toast({
      title: "Action Taken",
      description: `${action} completed successfully`,
    });
  };

  const getActionButtons = (edgeCase: EdgeCase) => {
    switch (edgeCase.type) {
      case 'candidate_no_response':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResolveCase(edgeCase.id, "Reminder sent")}
            >
              <Bell className="h-3 w-3 mr-1" />
              Send Reminder
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResolveCase(edgeCase.id, "Recruiter contacted")}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Contact Recruiter
            </Button>
          </div>
        );
      
      case 'no_availability':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResolveCase(edgeCase.id, "External interviewer added")}
            >
              Add External Interviewer
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResolveCase(edgeCase.id, "Interview moved to next week")}
            >
              Reschedule Next Week
            </Button>
          </div>
        );
      
      case 'interviewer_overloaded':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResolveCase(edgeCase.id, "Load redistributed")}
            >
              Redistribute Load
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResolveCase(edgeCase.id, "Acknowledged")}
            >
              Acknowledge
            </Button>
          </div>
        );
      
      case 'no_show':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResolveCase(edgeCase.id, "Interview rescheduled")}
            >
              Reschedule
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResolveCase(edgeCase.id, "Candidate marked as no-show")}
            >
              Mark No-Show
            </Button>
          </div>
        );
      
      default:
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleResolveCase(edgeCase.id, "Resolved")}
          >
            Resolve
          </Button>
        );
    }
  };

  const criticalCases = edgeCases.filter(c => c.severity === 'high');

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalCases.length > 0 && (
        <Alert className="border-error bg-error/10">
          <AlertTriangle className="h-4 w-4 text-error" />
          <AlertDescription className="text-error">
            <strong>{criticalCases.length} critical issue(s)</strong> require immediate attention
          </AlertDescription>
        </Alert>
      )}

      {/* Edge Cases List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Edge Cases & Alerts ({edgeCases.length})
          </CardTitle>
          <CardDescription>
            Automated detection and handling of scheduling edge cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {edgeCases.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No edge cases detected</p>
                <p className="text-sm">All interviews are running smoothly!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {edgeCases.map((edgeCase) => (
                <div key={edgeCase.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted/50 ${getSeverityColor(edgeCase.severity)}`}>
                        {getIcon(edgeCase.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{edgeCase.title}</h4>
                        <p className="text-sm text-muted-foreground">{edgeCase.description}</p>
                      </div>
                    </div>
                    {getSeverityBadge(edgeCase.severity)}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {edgeCase.candidate && (
                        <span>Candidate: {edgeCase.candidate}</span>
                      )}
                      {edgeCase.interviewer && (
                        <span>Interviewer: {edgeCase.interviewer}</span>
                      )}
                      {edgeCase.timeRemaining && (
                        <span>Time: {edgeCase.timeRemaining}</span>
                      )}
                    </div>
                    
                    {edgeCase.actionRequired && getActionButtons(edgeCase)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EdgeCaseAlerts;