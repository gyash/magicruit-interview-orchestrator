import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, Database, CheckCircle, Users, Briefcase, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ATSData {
  candidates: any[];
  jobs: any[];
  interviews: any[];
  interviewers: any[];
  workflows: any[];
}

interface SyncProgress {
  stage: string;
  progress: number;
  status: 'pending' | 'syncing' | 'completed' | 'error';
  count?: number;
  errors?: string[];
}

const ATSSyncManager = ({ onDataSynced }: { onDataSynced: (data: ATSData) => void }) => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress[]>([]);
  const [showSyncDetails, setShowSyncDetails] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [syncedData, setSyncedData] = useState<ATSData | null>(null);

  const mockATSSync = async (): Promise<ATSData> => {
    const syncStages: SyncProgress[] = [
      { stage: "Connecting to Greenhouse ATS", progress: 0, status: 'pending' },
      { stage: "Fetching active job positions", progress: 0, status: 'pending' },
      { stage: "Syncing candidate profiles", progress: 0, status: 'pending' },
      { stage: "Pulling interview schedules", progress: 0, status: 'pending' },
      { stage: "Updating interviewer availability", progress: 0, status: 'pending' },
      { stage: "Syncing workflow configurations", progress: 0, status: 'pending' }
    ];

    setSyncProgress(syncStages);

    // Simulate API calls with realistic data
    for (let i = 0; i < syncStages.length; i++) {
      // Update current stage to syncing
      setSyncProgress(prev => 
        prev.map((stage, index) => 
          index === i ? { ...stage, status: 'syncing' } : stage
        )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setSyncProgress(prev => 
          prev.map((stage, index) => 
            index === i ? { ...stage, progress } : stage
          )
        );
      }

      // Complete stage with mock data count
      const mockCounts = [0, 12, 45, 23, 18, 8];
      setSyncProgress(prev => 
        prev.map((stage, index) => 
          index === i ? { 
            ...stage, 
            status: 'completed', 
            progress: 100,
            count: mockCounts[i] 
          } : stage
        )
      );
    }

    // Return realistic mock data from ATS
    return {
      candidates: [
        {
          id: "ats-cand-1",
          name: "Alex Thompson",
          email: "alex.thompson@email.com",
          phone: "+1-555-0123",
          position_applied: "Senior Software Engineer",
          stage: "Technical Interview",
          ats_id: "greenhouse-12345",
          resume_url: "https://ats.com/resume/12345",
          timezone: "EST",
          availability: "Weekdays 9AM-5PM",
          status: "interview_ready",
          created_at: "2025-01-10T10:00:00Z",
          last_updated: "2025-01-15T14:30:00Z"
        },
        {
          id: "ats-cand-2", 
          name: "Sarah Kim",
          email: "sarah.kim@email.com",
          phone: "+1-555-0124",
          position_applied: "Product Manager",
          stage: "Hiring Manager Screen",
          ats_id: "greenhouse-12346",
          resume_url: "https://ats.com/resume/12346",
          timezone: "PST",
          availability: "Flexible",
          status: "interview_ready",
          created_at: "2025-01-12T09:15:00Z",
          last_updated: "2025-01-15T16:45:00Z"
        },
        {
          id: "ats-cand-3",
          name: "Michael Rodriguez",
          email: "michael.rodriguez@email.com", 
          phone: "+1-555-0125",
          position_applied: "DevOps Engineer",
          stage: "System Design",
          ats_id: "greenhouse-12347",
          resume_url: "https://ats.com/resume/12347",
          timezone: "CST",
          availability: "Afternoons preferred",
          status: "interview_ready",
          created_at: "2025-01-08T11:20:00Z",
          last_updated: "2025-01-15T13:10:00Z"
        }
      ],
      jobs: [
        {
          id: "ats-job-1",
          title: "Senior Software Engineer",
          department: "Engineering",
          location: "San Francisco, CA",
          status: "active",
          ats_id: "greenhouse-job-001",
          hiring_manager: "john.doe@company.com",
          created_at: "2025-01-05T08:00:00Z",
          candidates_count: 15,
          interviews_scheduled: 8
        },
        {
          id: "ats-job-2",
          title: "Product Manager",
          department: "Product", 
          location: "Remote",
          status: "active",
          ats_id: "greenhouse-job-002",
          hiring_manager: "jane.smith@company.com",
          created_at: "2025-01-03T09:30:00Z",
          candidates_count: 23,
          interviews_scheduled: 12
        }
      ],
      interviews: [
        {
          id: "ats-int-1",
          candidate_id: "ats-cand-1",
          job_id: "ats-job-1",
          stage_name: "Technical Interview",
          scheduled_time: "2025-01-16T15:00:00Z",
          duration_mins: 60,
          interviewers: ["tech.lead@company.com"],
          status: "scheduled",
          ats_id: "greenhouse-int-001",
          video_link: "https://zoom.us/j/123456789",
          notes: "Focus on system design and coding"
        }
      ],
      interviewers: [
        {
          id: "ats-int-p-1",
          name: "John Doe",
          email: "john.doe@company.com",
          role: "Senior Engineering Manager",
          department: "Engineering",
          calendar_connected: true,
          availability_score: 85,
          interviews_this_week: 3,
          max_interviews_per_week: 6
        }
      ],
      workflows: [
        {
          id: "ats-wf-1",
          job_id: "ats-job-1",
          stages: [
            {
              stage_name: "Recruiter Screen",
              duration_mins: 30,
              interviewers: ["recruiter@company.com"],
              required: true
            },
            {
              stage_name: "Technical Interview", 
              duration_mins: 60,
              interviewers: ["tech.lead@company.com"],
              required: true
            }
          ]
        }
      ]
    };
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setShowSyncDetails(true);
    
    try {
      const atsData = await mockATSSync();
      setSyncedData(atsData);
      setLastSyncTime(new Date().toLocaleString());
      
      onDataSynced(atsData);
      
      toast({
        title: "ATS Sync Complete!",
        description: `Synced ${atsData.candidates.length} candidates, ${atsData.jobs.length} jobs, and ${atsData.interviews.length} interviews.`,
      });
      
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Unable to connect to ATS. Please check your API credentials.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getSyncStatusIcon = (status: SyncProgress['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin text-brand-primary" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-error" />;
      default: return <div className="h-4 w-4 rounded-full bg-muted"></div>;
    }
  };

  const totalSynced = syncedData ? 
    syncedData.candidates.length + syncedData.jobs.length + syncedData.interviews.length : 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            ATS Integration
          </CardTitle>
          <CardDescription>
            Real-time sync with Greenhouse ATS for candidates, jobs, and interviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sync Status */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium">Greenhouse ATS</div>
                <div className="text-sm text-muted-foreground">
                  {lastSyncTime ? `Last synced: ${lastSyncTime}` : 'Not synced yet'}
                </div>
              </div>
              <Badge variant={lastSyncTime ? "default" : "secondary"}>
                {lastSyncTime ? "Connected" : "Not Synced"}
              </Badge>
            </div>
            
            {syncedData && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{syncedData.candidates.length} candidates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{syncedData.jobs.length} active jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{syncedData.interviews.length} interviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>{totalSynced} total records</span>
                </div>
              </div>
            )}
          </div>

          {/* Sync Controls */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync with ATS
                </>
              )}
            </Button>
            
            {lastSyncTime && (
              <Button variant="outline" onClick={() => setShowSyncDetails(true)}>
                View Details
              </Button>
            )}
          </div>

          {/* Recent Updates */}
          {syncedData && (
            <div className="space-y-3">
              <div className="font-medium text-sm">Recently Synced Data</div>
              <div className="space-y-2">
                {syncedData.candidates.slice(0, 3).map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-2 bg-success/10 border border-success/20 rounded">
                    <div>
                      <div className="font-medium text-sm">{candidate.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {candidate.position_applied} • {candidate.stage}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Ready for Interview
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Details Dialog */}
      <Dialog open={showSyncDetails} onOpenChange={setShowSyncDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              ATS Sync Progress
            </DialogTitle>
            <DialogDescription>
              Real-time synchronization with your ATS system
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {syncProgress.map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSyncStatusIcon(stage.status)}
                    <span className="text-sm font-medium">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {stage.count !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        {stage.count} records
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {stage.progress}%
                    </span>
                  </div>
                </div>
                <Progress value={stage.progress} className="h-2" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ATSSyncManager;