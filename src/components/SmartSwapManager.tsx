import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserCheck, Users, Clock, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackupCandidate {
  id: string;
  name: string;
  email: string;
  timezone: string;
  stage: string;
  role: string;
  priority_score: number;
  availability_match: number;
  last_activity: string;
}

interface SmartSwapManagerProps {
  originalInterview: any;
  onSwapApproved: (candidate: BackupCandidate) => void;
  onSwapRejected: (reason: string) => void;
}

const SmartSwapManager = ({ originalInterview, onSwapApproved, onSwapRejected }: SmartSwapManagerProps) => {
  const { toast } = useToast();
  const [autoSwapEnabled, setAutoSwapEnabled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [backupCandidates, setBackupCandidates] = useState<BackupCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<BackupCandidate | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  // Mock backup candidate search
  const searchBackupCandidates = async (): Promise<BackupCandidate[]> => {
    setIsSearching(true);
    
    // Simulate AI-powered candidate matching
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockCandidates: BackupCandidate[] = [
      {
        id: "backup-1",
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        timezone: "EST",
        stage: "Technical Round",
        role: "Software Engineer II",
        priority_score: 85,
        availability_match: 92,
        last_activity: "2 hours ago"
      },
      {
        id: "backup-2", 
        name: "Michael Chen",
        email: "michael.chen@email.com",
        timezone: "PST",
        stage: "Technical Round",
        role: "Software Engineer II",
        priority_score: 78,
        availability_match: 87,
        last_activity: "1 day ago"
      },
      {
        id: "backup-3",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@email.com", 
        timezone: "EST",
        stage: "System Design",
        role: "Senior Software Engineer",
        priority_score: 91,
        availability_match: 76,
        last_activity: "3 hours ago"
      }
    ];
    
    setIsSearching(false);
    return mockCandidates.sort((a, b) => 
      (b.priority_score + b.availability_match) - (a.priority_score + a.availability_match)
    );
  };

  const handleSearchBackups = async () => {
    const candidates = await searchBackupCandidates();
    setBackupCandidates(candidates);
    
    if (candidates.length > 0) {
      toast({
        title: "Backup Candidates Found",
        description: `${candidates.length} suitable candidates identified for swap`,
      });
      
      // Auto-select best match if auto-swap is enabled
      if (autoSwapEnabled && candidates[0].availability_match > 85) {
        handleAutoSwap(candidates[0]);
      }
    } else {
      toast({
        title: "No Backup Candidates",
        description: "No suitable candidates found for this time slot",
        variant: "destructive"
      });
    }
  };

  const handleAutoSwap = (candidate: BackupCandidate) => {
    toast({
      title: "Auto-Swap Triggered",
      description: `${candidate.name} has been automatically scheduled`,
    });
    onSwapApproved(candidate);
  };

  const handleManualSwapRequest = (candidate: BackupCandidate) => {
    setSelectedCandidate(candidate);
    setShowApprovalDialog(true);
  };

  const approveSwap = () => {
    if (selectedCandidate) {
      onSwapApproved(selectedCandidate);
      setShowApprovalDialog(false);
      toast({
        title: "Swap Approved",
        description: `${selectedCandidate.name} has been scheduled for the interview`,
      });
    }
  };

  const rejectSwap = () => {
    if (selectedCandidate) {
      onSwapRejected(`Manual rejection for ${selectedCandidate.name}`);
      setShowApprovalDialog(false);
      toast({
        title: "Swap Rejected",
        description: "Interview slot will remain open for rescheduling",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { variant: 'default' as const, label: 'Excellent' };
    if (score >= 70) return { variant: 'secondary' as const, label: 'Good' };
    return { variant: 'destructive' as const, label: 'Poor' };
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Smart Swap Manager
          </CardTitle>
          <CardDescription>
            AI-powered backup candidate replacement for last-minute cancellations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-Swap Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium">Auto-Swap Mode</div>
              <div className="text-sm text-muted-foreground">
                Automatically replace candidates when availability match &gt; 85%
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-swap"
                checked={autoSwapEnabled}
                onCheckedChange={setAutoSwapEnabled}
              />
              <Label htmlFor="auto-swap" className="text-sm">
                {autoSwapEnabled ? 'Enabled' : 'Manual Approval'}
              </Label>
            </div>
          </div>

          {/* Search Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Backup Candidate Search</div>
                <div className="text-sm text-muted-foreground">
                  Find compatible candidates for this interview slot
                </div>
              </div>
              <Button
                onClick={handleSearchBackups}
                disabled={isSearching}
                variant="outline"
              >
                {isSearching ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Find Backups
                  </>
                )}
              </Button>
            </div>

            {/* Original Interview Context */}
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="font-medium text-sm text-error mb-1">Cancellation Context</div>
              <div className="text-sm">
                <div>Role: {originalInterview?.job?.title || 'Software Engineer'}</div>
                <div>Stage: {originalInterview?.stage_name || 'Technical Round'}</div>
                <div>Time: {originalInterview?.scheduled_time ? 
                  new Date(originalInterview.scheduled_time).toLocaleString() : 
                  'Today 2:00 PM'
                }</div>
                <div>Reason: Last-minute candidate cancellation</div>
              </div>
            </div>
          </div>

          {/* Backup Candidates List */}
          {backupCandidates.length > 0 && (
            <div className="space-y-3">
              <div className="font-medium text-sm">Compatible Backup Candidates</div>
              
              {backupCandidates.map((candidate, index) => {
                const overallScore = Math.round((candidate.priority_score + candidate.availability_match) / 2);
                const scoreBadge = getScoreBadge(overallScore);
                
                return (
                  <div
                    key={candidate.id}
                    className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {candidate.email} • {candidate.timezone}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Best Match
                          </Badge>
                        )}
                        <Badge variant={scoreBadge.variant} className="text-xs">
                          {scoreBadge.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Priority Score: </span>
                        <span className={getScoreColor(candidate.priority_score)}>
                          {candidate.priority_score}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Availability: </span>
                        <span className={getScoreColor(candidate.availability_match)}>
                          {candidate.availability_match}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stage: </span>
                        <span>{candidate.stage}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Active: </span>
                        <span>{candidate.last_activity}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleManualSwapRequest(candidate)}
                        disabled={autoSwapEnabled && candidate.availability_match > 85}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {autoSwapEnabled && candidate.availability_match > 85 ? 'Auto-Selected' : 'Select Candidate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // View candidate profile
                          toast({
                            title: "Profile Preview",
                            description: `Viewing ${candidate.name}'s profile and interview history`,
                          });
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Approve Smart Swap
            </DialogTitle>
            <DialogDescription>
              Review backup candidate selection before confirming
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="font-medium mb-2">{selectedCandidate.name}</div>
                <div className="space-y-1 text-sm">
                  <div>📧 {selectedCandidate.email}</div>
                  <div>🎯 Role: {selectedCandidate.role}</div>
                  <div>📊 Match Score: {Math.round((selectedCandidate.priority_score + selectedCandidate.availability_match) / 2)}%</div>
                  <div>🕐 Time Zone: {selectedCandidate.timezone}</div>
                </div>
              </div>
              
              <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
                <div className="font-medium mb-2">Swap Actions</div>
                <ul className="text-sm space-y-1">
                  <li>✓ Send interview invitation to backup candidate</li>
                  <li>✓ Cancel original candidate's slot</li>
                  <li>✓ Update calendar invites for panel</li>
                  <li>✓ Notify all parties of the change</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={approveSwap} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Swap
                </Button>
                <Button onClick={rejectSwap} variant="outline" className="flex-1">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SmartSwapManager;