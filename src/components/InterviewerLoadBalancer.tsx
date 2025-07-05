import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users, AlertTriangle, Clock, TrendingUp, BarChart3, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InterviewerLoad {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  
  // Load metrics
  interviews_today: number;
  interviews_this_week: number;
  max_daily_limit: number;
  max_weekly_limit: number;
  
  // Availability & performance
  availability_score: number; // 0-100
  avg_interview_duration: number; // minutes
  preferred_slots: string[];
  
  // Load balancing
  load_percentage: number;
  fatigue_score: number; // 0-100 (higher = more fatigued)
  next_available_slot: string;
  
  // Specializations
  can_interview_stages: string[];
  seniority_level: 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
  is_backup_panel: boolean;
}

interface LoadBalancingRule {
  max_consecutive_interviews: number;
  cooldown_period_mins: number;
  fair_distribution: boolean;
  senior_preference_final_rounds: boolean;
  backup_panel_threshold: number; // percentage
}

const InterviewerLoadBalancer = () => {
  const { toast } = useToast();
  const [interviewers, setInterviewers] = useState<InterviewerLoad[]>([]);
  const [balancingRules, setBalancingRules] = useState<LoadBalancingRule>({
    max_consecutive_interviews: 3,
    cooldown_period_mins: 30,
    fair_distribution: true,
    senior_preference_final_rounds: true,
    backup_panel_threshold: 80
  });
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [viewMode, setViewMode] = useState<'load' | 'availability' | 'fatigue'>('load');

  useEffect(() => {
    generateInterviewerData();
  }, []);

  const generateInterviewerData = () => {
    const mockInterviewers: InterviewerLoad[] = [
      {
        id: 'int-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'Senior Engineering Manager',
        department: 'Engineering',
        interviews_today: 3,
        interviews_this_week: 12,
        max_daily_limit: 4,
        max_weekly_limit: 15,
        availability_score: 75,
        avg_interview_duration: 55,
        preferred_slots: ['9-11 AM', '2-4 PM'],
        load_percentage: 80,
        fatigue_score: 65,
        next_available_slot: 'Tomorrow 10 AM',
        can_interview_stages: ['Technical', 'System Design', 'Final Round'],
        seniority_level: 'senior',
        is_backup_panel: false
      },
      {
        id: 'int-2',
        name: 'Michael Chen', 
        email: 'michael.chen@company.com',
        role: 'Staff Software Engineer',
        department: 'Engineering',
        interviews_today: 1,
        interviews_this_week: 8,
        max_daily_limit: 4,
        max_weekly_limit: 12,
        availability_score: 90,
        avg_interview_duration: 48,
        preferred_slots: ['Morning', 'Late afternoon'],
        load_percentage: 50,
        fatigue_score: 25,
        next_available_slot: 'Today 3 PM',
        can_interview_stages: ['Technical', 'System Design'],
        seniority_level: 'staff',
        is_backup_panel: true
      },
      {
        id: 'int-3',
        name: 'Elena Rodriguez',
        email: 'elena.rodriguez@company.com',
        role: 'Principal Engineer',
        department: 'Engineering',
        interviews_today: 4,
        interviews_this_week: 16,
        max_daily_limit: 4,
        max_weekly_limit: 20,
        availability_score: 45,
        avg_interview_duration: 62,
        preferred_slots: ['Afternoons only'],
        load_percentage: 95,
        fatigue_score: 85,
        next_available_slot: 'Friday 2 PM',
        can_interview_stages: ['System Design', 'Final Round', 'Architecture'],
        seniority_level: 'principal',
        is_backup_panel: false
      },
      {
        id: 'int-4',
        name: 'David Kim',
        email: 'david.kim@company.com',
        role: 'Senior Product Manager',
        department: 'Product',
        interviews_today: 2,
        interviews_this_week: 10,
        max_daily_limit: 5,
        max_weekly_limit: 18,
        availability_score: 85,
        avg_interview_duration: 45,
        preferred_slots: ['Flexible'],
        load_percentage: 60,
        fatigue_score: 40,
        next_available_slot: 'Tomorrow 11 AM',
        can_interview_stages: ['Product', 'Strategy', 'Final Round'],
        seniority_level: 'senior',
        is_backup_panel: true
      },
      {
        id: 'int-5',
        name: 'Priya Patel',
        email: 'priya.patel@company.com',
        role: 'Engineering Manager',
        department: 'Engineering',
        interviews_today: 2,
        interviews_this_week: 7,
        max_daily_limit: 3,
        max_weekly_limit: 12,
        availability_score: 70,
        avg_interview_duration: 52,
        preferred_slots: ['Morning', 'Early afternoon'],
        load_percentage: 65,
        fatigue_score: 45,
        next_available_slot: 'Tomorrow 9 AM',
        can_interview_stages: ['Technical', 'Behavioral', 'Final Round'],
        seniority_level: 'senior',
        is_backup_panel: false
      }
    ];

    setInterviewers(mockInterviewers);
  };

  const rebalanceLoad = () => {
    // Simulate load rebalancing algorithm
    setInterviewers(prev => 
      prev.map(interviewer => ({
        ...interviewer,
        load_percentage: Math.max(20, interviewer.load_percentage - Math.random() * 20),
        fatigue_score: Math.max(10, interviewer.fatigue_score - Math.random() * 15),
        availability_score: Math.min(100, interviewer.availability_score + Math.random() * 10)
      }))
    );

    toast({
      title: "Load Rebalanced",
      description: "Interview assignments have been optimized for fair distribution",
    });
  };

  const suggestOptimalPanel = (interviewType: string) => {
    const suitable = interviewers.filter(i => 
      i.can_interview_stages.some(stage => 
        stage.toLowerCase().includes(interviewType.toLowerCase())
      ) && i.load_percentage < 90
    );

    const optimal = suitable.sort((a, b) => {
      // Prioritize by load, availability, and fatigue
      const scoreA = (100 - a.load_percentage) + a.availability_score - a.fatigue_score;
      const scoreB = (100 - b.load_percentage) + b.availability_score - b.fatigue_score;
      return scoreB - scoreA;
    });

    return optimal.slice(0, 2); // Return top 2 suggestions
  };

  const getLoadColor = (percentage: number) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const getLoadBadge = (percentage: number) => {
    if (percentage >= 90) return { variant: 'destructive' as const, label: 'Overloaded' };
    if (percentage >= 70) return { variant: 'secondary' as const, label: 'High' };
    if (percentage >= 40) return { variant: 'default' as const, label: 'Optimal' };
    return { variant: 'outline' as const, label: 'Light' };
  };

  const getSeniorityIcon = (level: string) => {
    switch (level) {
      case 'principal': return '👑';
      case 'staff': return '⭐';
      case 'senior': return '🔹';
      default: return '📋';
    }
  };

  const overloadedCount = interviewers.filter(i => i.load_percentage >= 90).length;
  const avgLoad = Math.round(interviewers.reduce((sum, i) => sum + i.load_percentage, 0) / interviewers.length);

  return (
    <div className="space-y-6">
      {/* Load Balancer Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Interviewer Load Balancer
          </CardTitle>
          <CardDescription>
            Smart workload distribution and fatigue management across your interview panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Average Load</div>
                  <div className="text-2xl font-bold">{avgLoad}%</div>
                </div>
                <TrendingUp className={`h-6 w-6 ${getLoadColor(avgLoad)}`} />
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Overloaded</div>
                  <div className="text-2xl font-bold">{overloadedCount}</div>
                </div>
                <AlertTriangle className={`h-6 w-6 ${overloadedCount > 0 ? 'text-error' : 'text-success'}`} />
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-Balance</div>
                  <div className="text-sm text-muted-foreground">
                    {autoRebalance ? 'Active' : 'Manual'}
                  </div>
                </div>
                <Switch 
                  checked={autoRebalance}
                  onCheckedChange={setAutoRebalance}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="load">Load View</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                  <SelectItem value="fatigue">Fatigue Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={rebalanceLoad} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Rebalance Load
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interviewer Load Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Panel Load Distribution</CardTitle>
          <CardDescription>
            Real-time load monitoring and capacity management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviewers.map((interviewer) => {
              const loadBadge = getLoadBadge(interviewer.load_percentage);
              const displayValue = viewMode === 'load' ? interviewer.load_percentage :
                                 viewMode === 'availability' ? interviewer.availability_score :
                                 interviewer.fatigue_score;
              
              return (
                <div
                  key={interviewer.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                    interviewer.load_percentage >= 90 ? 'border-error bg-error/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">
                        {getSeniorityIcon(interviewer.seniority_level)}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {interviewer.name}
                          {interviewer.is_backup_panel && (
                            <Badge variant="outline" className="text-xs">Backup</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {interviewer.role} • {interviewer.department}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {displayValue}%
                        </div>
                        <Badge variant={loadBadge.variant} className="text-xs">
                          {loadBadge.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={displayValue} className="h-2" />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Today: </span>
                        <span className={interviewer.interviews_today >= interviewer.max_daily_limit ? 'text-error font-medium' : ''}>
                          {interviewer.interviews_today}/{interviewer.max_daily_limit}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">This Week: </span>
                        <span>{interviewer.interviews_this_week}/{interviewer.max_weekly_limit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Duration: </span>
                        <span>{interviewer.avg_interview_duration}min</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Slot: </span>
                        <span>{interviewer.next_available_slot}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {interviewer.can_interview_stages.map((stage) => (
                        <Badge key={stage} variant="outline" className="text-xs">
                          {stage}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {interviewer.load_percentage >= 90 && (
                    <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded text-sm">
                      <div className="flex items-center gap-2 text-error font-medium">
                        <AlertTriangle className="h-4 w-4" />
                        At Maximum Capacity
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">
                        Consider reassigning interviews or using backup panel members
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Smart Panel Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Optimal Panel Suggestions
          </CardTitle>
          <CardDescription>
            AI-recommended interviewer assignments based on load and expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Technical', 'System Design', 'Final Round'].map((interviewType) => {
              const suggestions = suggestOptimalPanel(interviewType);
              
              return (
                <div key={interviewType} className="p-4 border rounded-lg">
                  <div className="font-medium mb-3">{interviewType}</div>
                  <div className="space-y-2">
                    {suggestions.map((interviewer) => (
                      <div key={interviewer.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="text-sm">
                          <div className="font-medium">{interviewer.name.split(' ')[0]}</div>
                          <div className="text-xs text-muted-foreground">
                            {interviewer.load_percentage}% load
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Optimal
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewerLoadBalancer;