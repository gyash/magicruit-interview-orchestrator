import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUp, Users, Clock, AlertTriangle, Zap, Settings, Crown, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriorityScore {
  urgency: number;        // 0-100 (notice period, deadline pressure)
  pipeline_stage: number; // 0-100 (final round > initial screen)
  availability: number;   // 0-100 (candidate flexibility)
  interviewer_load: number; // 0-100 (less loaded = higher score)
  total_score: number;
}

interface CandidatePriority {
  id: string;
  name: string;
  email: string;
  job_title: string;
  stage: string;
  urgency_flag: boolean;
  notice_period: string;
  pipeline_position: number; // 1=screening, 5=final round
  availability_slots: number;
  preferred_times: string[];
  priority_score: PriorityScore;
  manual_override?: boolean;
  override_reason?: string;
  last_updated: string;
}

interface PriorityWeights {
  urgency: number;
  pipeline_stage: number;
  availability: number;
  interviewer_load: number;
}

const PriorityEngine = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<CandidatePriority[]>([]);
  const [weights, setWeights] = useState<PriorityWeights>({
    urgency: 40,           // 40% weight for urgency
    pipeline_stage: 25,    // 25% weight for pipeline stage
    availability: 20,      // 20% weight for availability
    interviewer_load: 15   // 15% weight for interviewer load
  });
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [showWeightConfig, setShowWeightConfig] = useState(false);
  const [conflictResolution, setConflictResolution] = useState<'urgency' | 'stage' | 'fair'>('urgency');

  // Generate mock candidates with priority scoring
  useEffect(() => {
    generateMockCandidates();
  }, [weights]);

  const calculatePriorityScore = (candidate: Partial<CandidatePriority>): PriorityScore => {
    // Urgency scoring (0-100)
    const urgency = candidate.urgency_flag ? 90 : 
                   candidate.notice_period === 'immediate' ? 95 :
                   candidate.notice_period === '2 weeks' ? 75 :
                   candidate.notice_period === '1 month' ? 50 : 25;

    // Pipeline stage scoring (0-100)  
    const pipeline_stage = (candidate.pipeline_position || 1) * 20; // 1-5 stages, max 100

    // Availability scoring (0-100)
    const availability = Math.min((candidate.availability_slots || 1) * 20, 100);

    // Interviewer load scoring (mock - inverted load)
    const interviewer_load = 85 - Math.random() * 30; // Random load simulation

    const total_score = 
      (urgency * weights.urgency / 100) +
      (pipeline_stage * weights.pipeline_stage / 100) +
      (availability * weights.availability / 100) +
      (interviewer_load * weights.interviewer_load / 100);

    return {
      urgency,
      pipeline_stage,
      availability,
      interviewer_load,
      total_score: Math.round(total_score)
    };
  };

  const generateMockCandidates = () => {
    const mockData: Partial<CandidatePriority>[] = [
      {
        id: 'priority-1',
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        job_title: 'Senior Software Engineer',
        stage: 'Final Round',
        urgency_flag: true,
        notice_period: '2 weeks',
        pipeline_position: 5,
        availability_slots: 3,
        preferred_times: ['9-11 AM', '2-4 PM']
      },
      {
        id: 'priority-2',
        name: 'Marcus Johnson',
        email: 'marcus.johnson@email.com', 
        job_title: 'Product Manager',
        stage: 'Technical Round',
        urgency_flag: false,
        notice_period: '1 month',
        pipeline_position: 3,
        availability_slots: 5,
        preferred_times: ['Morning', 'Afternoon']
      },
      {
        id: 'priority-3',
        name: 'Elena Rodriguez',
        email: 'elena.rodriguez@email.com',
        job_title: 'DevOps Engineer', 
        stage: 'System Design',
        urgency_flag: true,
        notice_period: 'immediate',
        pipeline_position: 4,
        availability_slots: 2,
        preferred_times: ['Afternoons only']
      },
      {
        id: 'priority-4',
        name: 'David Kim',
        email: 'david.kim@email.com',
        job_title: 'Frontend Developer',
        stage: 'Recruiter Screen',
        urgency_flag: false,
        notice_period: '6 weeks',
        pipeline_position: 1,
        availability_slots: 4,
        preferred_times: ['Flexible']
      },
      {
        id: 'priority-5',
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        job_title: 'Data Scientist',
        stage: 'Hiring Manager',
        urgency_flag: false,
        notice_period: '1 month',
        pipeline_position: 2,
        availability_slots: 3,
        preferred_times: ['Mornings preferred']
      }
    ];

    const prioritizedCandidates = mockData.map(candidate => ({
      ...candidate,
      priority_score: calculatePriorityScore(candidate),
      last_updated: new Date().toISOString()
    })) as CandidatePriority[];

    // Sort by total score descending
    prioritizedCandidates.sort((a, b) => b.priority_score.total_score - a.priority_score.total_score);
    
    setCandidates(prioritizedCandidates);
  };

  const handleManualOverride = (candidateId: string, override: boolean, reason?: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { 
              ...candidate, 
              manual_override: override,
              override_reason: reason,
              last_updated: new Date().toISOString()
            }
          : candidate
      )
    );

    toast({
      title: override ? "Priority Override Applied" : "Override Removed",
      description: `${candidates.find(c => c.id === candidateId)?.name} priority ${override ? 'boosted' : 'reset'}`,
    });
  };

  const moveCandidateUp = (candidateId: string) => {
    setCandidates(prev => {
      const currentIndex = prev.findIndex(c => c.id === candidateId);
      if (currentIndex > 0) {
        const newArray = [...prev];
        [newArray[currentIndex], newArray[currentIndex - 1]] = [newArray[currentIndex - 1], newArray[currentIndex]];
        return newArray;
      }
      return prev;
    });
  };

  const moveCandidateDown = (candidateId: string) => {
    setCandidates(prev => {
      const currentIndex = prev.findIndex(c => c.id === candidateId);
      if (currentIndex < prev.length - 1) {
        const newArray = [...prev];
        [newArray[currentIndex], newArray[currentIndex + 1]] = [newArray[currentIndex + 1], newArray[currentIndex]];
        return newArray;
      }
      return prev;
    });
  };

  const updateWeights = (newWeights: PriorityWeights) => {
    setWeights(newWeights);
    toast({
      title: "Priority Weights Updated",
      description: "Candidate priority scores have been recalculated",
    });
  };

  const getPriorityLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: 'destructive', icon: '🔥' };
    if (score >= 65) return { level: 'High', color: 'default', icon: '⚡' };
    if (score >= 45) return { level: 'Medium', color: 'secondary', icon: '⭐' };
    return { level: 'Low', color: 'outline', icon: '📋' };
  };

  const getScoreBreakdown = (score: PriorityScore) => [
    { label: 'Urgency', value: score.urgency, weight: weights.urgency },
    { label: 'Pipeline Stage', value: score.pipeline_stage, weight: weights.pipeline_stage },
    { label: 'Availability', value: score.availability, weight: weights.availability },
    { label: 'Interviewer Load', value: score.interviewer_load, weight: weights.interviewer_load }
  ];

  return (
    <div className="space-y-6">
      {/* Priority Engine Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Smart Prioritization Engine
          </CardTitle>
          <CardDescription>
            AI-powered candidate ranking based on urgency, pipeline stage, and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="font-medium">Auto-Rebalancing</div>
                <div className="text-muted-foreground">Real-time priority updates</div>
              </div>
              <Switch 
                checked={autoRebalance}
                onCheckedChange={setAutoRebalance}
              />
            </div>
            
            <div className="flex gap-2">
              <Dialog open={showWeightConfig} onOpenChange={setShowWeightConfig}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Adjust Weights
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Priority Weight Configuration</DialogTitle>
                    <DialogDescription>
                      Adjust the importance of each factor in candidate prioritization
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {Object.entries(weights).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="capitalize">{key.replace('_', ' ')}</Label>
                          <span className="text-sm font-medium">{value}%</span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={([newValue]) => 
                            setWeights(prev => ({ ...prev, [key]: newValue }))
                          }
                          max={50}
                          min={5}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Total Weight:</span>
                        <span className={Object.values(weights).reduce((a, b) => a + b, 0) === 100 ? 'text-success' : 'text-error'}>
                          {Object.values(weights).reduce((a, b) => a + b, 0)}%
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        updateWeights(weights);
                        setShowWeightConfig(false);
                      }}
                      disabled={Object.values(weights).reduce((a, b) => a + b, 0) !== 100}
                      className="w-full"
                    >
                      Apply Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm" onClick={generateMockCandidates}>
                <Zap className="h-4 w-4 mr-2" />
                Recompute
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Priority Queue</CardTitle>
          <CardDescription>
            Ranked candidates ready for scheduling (higher priority first)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {candidates.map((candidate, index) => {
              const priority = getPriorityLevel(candidate.priority_score.total_score);
              const breakdown = getScoreBreakdown(candidate.priority_score);
              
              return (
                <div
                  key={candidate.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                    candidate.manual_override ? 'border-brand-primary bg-brand-primary/5' : ''
                  } ${index === 0 ? 'animate-fade-in' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-8 h-6 justify-center">
                          #{index + 1}
                        </Badge>
                        {candidate.manual_override && (
                          <Crown className="h-4 w-4 text-brand-primary" />
                        )}
                      </div>
                      
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {candidate.job_title} • {candidate.stage}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {candidate.priority_score.total_score}
                          </span>
                          <Badge variant={priority.color as any}>
                            {priority.icon} {priority.level}
                          </Badge>
                        </div>
                        {candidate.urgency_flag && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveCandidateUp(candidate.id)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => moveCandidateDown(candidate.id)}
                          disabled={index === candidates.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    {breakdown.map((item) => (
                      <div key={item.label} className="text-center p-2 bg-muted/30 rounded">
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="font-medium">{Math.round(item.value)}</div>
                        <div className="text-xs">({item.weight}% weight)</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Candidate Details */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <span>Notice: {candidate.notice_period}</span>
                      <span>Slots: {candidate.availability_slots}</span>
                      <span>Times: {candidate.preferred_times.join(', ')}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => 
                          handleManualOverride(
                            candidate.id, 
                            !candidate.manual_override,
                            candidate.manual_override ? undefined : 'Manual priority boost'
                          )
                        }
                      >
                        {candidate.manual_override ? 'Remove Override' : 'Priority Boost'}
                      </Button>
                      
                      <Button size="sm" className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90">
                        Schedule First
                      </Button>
                    </div>
                  </div>
                  
                  {candidate.override_reason && (
                    <div className="mt-2 p-2 bg-brand-primary/10 border border-brand-primary/20 rounded text-xs">
                      Override Reason: {candidate.override_reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conflict Resolution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Conflict Resolution
          </CardTitle>
          <CardDescription>
            Handle scheduling conflicts when multiple high-priority candidates compete for slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="font-medium text-warning mb-2">Scheduling Conflict Detected</div>
              <div className="text-sm">
                2 high-priority candidates competing for the same interview slot:
                <div className="mt-2 space-y-1">
                  <div>• Sarah Chen (Score: 89) - Final Round, 2 weeks notice</div>
                  <div>• Elena Rodriguez (Score: 87) - System Design, Immediate availability</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant={conflictResolution === 'urgency' ? 'default' : 'outline'}
                onClick={() => setConflictResolution('urgency')}
                className="text-left p-4 h-auto"
              >
                <div>
                  <div className="font-medium">Urgency First</div>
                  <div className="text-xs text-muted-foreground">Prioritize urgent candidates</div>
                </div>
              </Button>
              
              <Button
                variant={conflictResolution === 'stage' ? 'default' : 'outline'}
                onClick={() => setConflictResolution('stage')}
                className="text-left p-4 h-auto"
              >
                <div>
                  <div className="font-medium">Pipeline Stage</div>
                  <div className="text-xs text-muted-foreground">Final rounds get priority</div>
                </div>
              </Button>
              
              <Button
                variant={conflictResolution === 'fair' ? 'default' : 'outline'}
                onClick={() => setConflictResolution('fair')}
                className="text-left p-4 h-auto"
              >
                <div>
                  <div className="font-medium">Fair Distribution</div>
                  <div className="text-xs text-muted-foreground">Balance workload evenly</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriorityEngine;