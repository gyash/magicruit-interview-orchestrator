import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Clock, Users, Zap, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SchedulingConflict {
  id: string;
  type: 'slot_competition' | 'interviewer_overload' | 'mandatory_unavailable';
  priority: 'high' | 'medium' | 'low';
  conflicting_candidates: {
    id: string;
    name: string;
    score: number;
    urgency_flag: boolean;
    stage: string;
  }[];
  contested_slot: {
    date: string;
    time: string;
    interviewer: string;
  };
  auto_resolution?: string;
  requires_manual_intervention: boolean;
  created_at: string;
}

const ConflictResolutionManager = () => {
  const { toast } = useToast();
  const [conflicts, setConflicts] = useState<SchedulingConflict[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<SchedulingConflict | null>(null);
  const [showResolutionDialog, setShowResolutionDialog] = useState(false);
  const [resolutionStrategy, setResolutionStrategy] = useState<'priority' | 'urgency' | 'stage' | 'fair'>('priority');

  // Generate mock conflicts
  const generateMockConflicts = () => {
    const mockConflicts: SchedulingConflict[] = [
      {
        id: 'conflict-1',
        type: 'slot_competition',
        priority: 'high',
        conflicting_candidates: [
          {
            id: 'cand-1',
            name: 'Sarah Chen',
            score: 89,
            urgency_flag: true,
            stage: 'Final Round'
          },
          {
            id: 'cand-2', 
            name: 'Elena Rodriguez',
            score: 87,
            urgency_flag: true,
            stage: 'System Design'
          }
        ],
        contested_slot: {
          date: 'Tomorrow',
          time: '2:00 PM',
          interviewer: 'Michael Chen'
        },
        requires_manual_intervention: false,
        created_at: new Date().toISOString()
      },
      {
        id: 'conflict-2',
        type: 'interviewer_overload',
        priority: 'medium',
        conflicting_candidates: [
          {
            id: 'cand-3',
            name: 'Marcus Johnson',
            score: 75,
            urgency_flag: false,
            stage: 'Technical Round'
          }
        ],
        contested_slot: {
          date: 'Friday',
          time: '3:00 PM',
          interviewer: 'Sarah Johnson'
        },
        auto_resolution: 'Suggest backup panelist: David Kim',
        requires_manual_intervention: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'conflict-3',
        type: 'mandatory_unavailable',
        priority: 'high',
        conflicting_candidates: [
          {
            id: 'cand-4',
            name: 'David Park',
            score: 82,
            urgency_flag: false,
            stage: 'Final Round'
          }
        ],
        contested_slot: {
          date: 'Thursday',
          time: '11:00 AM',
          interviewer: 'Elena Rodriguez (Required)'
        },
        requires_manual_intervention: true,
        created_at: new Date().toISOString()
      }
    ];

    setConflicts(mockConflicts);
  };

  const resolveConflict = (conflictId: string, resolution: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    
    toast({
      title: "Conflict Resolved",
      description: `Applied resolution: ${resolution}`,
    });
  };

  const autoResolveConflict = (conflict: SchedulingConflict) => {
    let resolution = "";
    
    switch (resolutionStrategy) {
      case 'priority':
        const highestScore = Math.max(...conflict.conflicting_candidates.map(c => c.score));
        const winner = conflict.conflicting_candidates.find(c => c.score === highestScore);
        resolution = `Assigned to ${winner?.name} (highest priority score: ${highestScore})`;
        break;
        
      case 'urgency':
        const urgentCandidate = conflict.conflicting_candidates.find(c => c.urgency_flag);
        resolution = urgentCandidate 
          ? `Assigned to ${urgentCandidate.name} (urgent flag)`
          : `No urgent candidates - assigned to ${conflict.conflicting_candidates[0].name}`;
        break;
        
      case 'stage':
        const finalRoundCandidate = conflict.conflicting_candidates.find(c => c.stage === 'Final Round');
        resolution = finalRoundCandidate
          ? `Assigned to ${finalRoundCandidate.name} (final round priority)`
          : `Assigned to ${conflict.conflicting_candidates[0].name} (stage priority)`;
        break;
        
      case 'fair':
        resolution = `Distributed fairly - ${conflict.conflicting_candidates[0].name} gets this slot, others rescheduled`;
        break;
    }
    
    resolveConflict(conflict.id, resolution);
  };

  const getConflictIcon = (type: SchedulingConflict['type']) => {
    switch (type) {
      case 'slot_competition': return <Users className="h-4 w-4 text-warning" />;
      case 'interviewer_overload': return <Clock className="h-4 w-4 text-error" />;
      case 'mandatory_unavailable': return <AlertTriangle className="h-4 w-4 text-error" />;
      default: return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getConflictLabel = (type: SchedulingConflict['type']) => {
    switch (type) {
      case 'slot_competition': return 'Slot Competition';
      case 'interviewer_overload': return 'Interviewer Overload';
      case 'mandatory_unavailable': return 'Mandatory Unavailable';
      default: return 'Unknown Conflict';
    }
  };

  const getPriorityBadge = (priority: SchedulingConflict['priority']) => {
    const variants = {
      high: { variant: 'destructive' as const, label: 'High Priority' },
      medium: { variant: 'secondary' as const, label: 'Medium' },
      low: { variant: 'outline' as const, label: 'Low' }
    };
    return variants[priority];
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Conflict Resolution Manager
          </CardTitle>
          <CardDescription>
            Handle scheduling conflicts with AI-powered resolution strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resolution Strategy */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="font-medium mb-3">Auto-Resolution Strategy</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { key: 'priority', label: 'Priority Score', desc: 'Highest score wins' },
                { key: 'urgency', label: 'Urgency First', desc: 'Urgent candidates prioritized' },
                { key: 'stage', label: 'Pipeline Stage', desc: 'Final rounds preferred' },
                { key: 'fair', label: 'Fair Distribution', desc: 'Balanced assignment' }
              ].map((strategy) => (
                <Button
                  key={strategy.key}
                  variant={resolutionStrategy === strategy.key ? 'default' : 'outline'}
                  onClick={() => setResolutionStrategy(strategy.key as any)}
                  className="h-auto p-3 text-left"
                >
                  <div>
                    <div className="font-medium text-sm">{strategy.label}</div>
                    <div className="text-xs text-muted-foreground">{strategy.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Conflicts for Demo */}
          {conflicts.length === 0 && (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">No active conflicts</div>
              <Button onClick={generateMockConflicts} variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Simulate Conflicts
              </Button>
            </div>
          )}

          {/* Active Conflicts */}
          {conflicts.length > 0 && (
            <div className="space-y-4">
              <div className="font-medium">Active Conflicts ({conflicts.length})</div>
              
              {conflicts.map((conflict) => {
                const priorityBadge = getPriorityBadge(conflict.priority);
                
                return (
                  <div
                    key={conflict.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-all animate-fade-in"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getConflictIcon(conflict.type)}
                        <div>
                          <div className="font-medium">{getConflictLabel(conflict.type)}</div>
                          <div className="text-sm text-muted-foreground">
                            {conflict.contested_slot.date} at {conflict.contested_slot.time}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={priorityBadge.variant}>
                          {priorityBadge.label}
                        </Badge>
                        {conflict.requires_manual_intervention && (
                          <Badge variant="outline">
                            Manual Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Conflicting Candidates */}
                    <div className="space-y-2 mb-4">
                      <div className="text-sm font-medium">Competing Candidates:</div>
                      {conflict.conflicting_candidates.map((candidate) => (
                        <div key={candidate.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div>
                            <div className="font-medium text-sm">{candidate.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {candidate.stage} • Score: {candidate.score}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {candidate.urgency_flag && (
                              <Badge variant="destructive" className="text-xs">Urgent</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {candidate.score}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Interviewer Info */}
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded mb-4">
                      <div className="text-sm">
                        <strong>Contested Resource:</strong> {conflict.contested_slot.interviewer}
                      </div>
                      {conflict.auto_resolution && (
                        <div className="text-sm mt-1">
                          <strong>Suggested Resolution:</strong> {conflict.auto_resolution}
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => autoResolveConflict(conflict)}
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Auto-Resolve
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedConflict(conflict);
                          setShowResolutionDialog(true);
                        }}
                      >
                        Manual Review
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveConflict(conflict.id, 'Dismissed by user')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Resolution Dialog */}
      <Dialog open={showResolutionDialog} onOpenChange={setShowResolutionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manual Conflict Resolution</DialogTitle>
            <DialogDescription>
              Review conflict details and choose resolution approach
            </DialogDescription>
          </DialogHeader>
          
          {selectedConflict && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="font-medium mb-2">Conflict Details</div>
                <div className="text-sm space-y-1">
                  <div>Type: {getConflictLabel(selectedConflict.type)}</div>
                  <div>Time Slot: {selectedConflict.contested_slot.date} at {selectedConflict.contested_slot.time}</div>
                  <div>Interviewer: {selectedConflict.contested_slot.interviewer}</div>
                  <div>Candidates: {selectedConflict.conflicting_candidates.length}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedConflict.conflicting_candidates.map((candidate) => (
                  <div key={candidate.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {candidate.stage} • Priority Score: {candidate.score}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => {
                          resolveConflict(selectedConflict.id, `Manually assigned to ${candidate.name}`);
                          setShowResolutionDialog(false);
                        }}
                      >
                        Select This Candidate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    resolveConflict(selectedConflict.id, 'Reschedule all candidates to different slots');
                    setShowResolutionDialog(false);
                  }}
                >
                  Reschedule All
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowResolutionDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConflictResolutionManager;