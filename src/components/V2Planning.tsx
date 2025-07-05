import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, TrendingUp, Brain, Users, Zap, Calendar, BarChart3, Globe } from "lucide-react";

interface V2Feature {
  id: string;
  name: string;
  description: string;
  category: 'ai_ml' | 'automation' | 'analytics' | 'integration';
  priority: 'high' | 'medium' | 'low';
  effort: 'small' | 'medium' | 'large';
  impact: 'high' | 'medium' | 'low';
  status: 'planned' | 'in_progress' | 'completed';
  milestone_trigger: string;
}

const V2Planning = () => {
  const [v2Features] = useState<V2Feature[]>([
    {
      id: 'ml-noshow',
      name: 'ML-based No-show Predictor',
      description: 'Behavioral no-show prediction with fallback slots',
      category: 'ai_ml',
      priority: 'high',
      effort: 'large',
      impact: 'high',
      status: 'planned',
      milestone_trigger: 'M2 - No-Show Detection'
    },
    {
      id: 'cooldown-buffer',
      name: 'Interviewer Cooldown Buffer',
      description: 'Post-interview rest time auto-added',
      category: 'automation',
      priority: 'medium',
      effort: 'small',
      impact: 'medium',
      status: 'planned',
      milestone_trigger: 'M4 - Load Balancing'
    },
    {
      id: 'dynamic-priority',
      name: 'Dynamic Prioritization Engine',
      description: 'Real-time queue adjustment based on changing conditions',
      category: 'ai_ml',
      priority: 'high',
      effort: 'medium',
      impact: 'high',
      status: 'planned',
      milestone_trigger: 'M4 - Priority Engine'
    },
    {
      id: 'panel-calibration',
      name: 'Panel Calibration Metrics',
      description: 'Panelist feedback performance scoring',
      category: 'analytics',
      priority: 'medium',
      effort: 'medium',
      impact: 'medium',
      status: 'planned',
      milestone_trigger: 'M3 - Communication'
    },
    {
      id: 'bulk-scheduling',
      name: 'Bulk Scheduling Tool',
      description: 'Campus drives, hackathons, mass hiring events',
      category: 'automation',
      priority: 'medium',
      effort: 'large',
      impact: 'high',
      status: 'in_progress',
      milestone_trigger: 'M1 - Core Scheduling'
    },
    {
      id: 'slack-bot',
      name: 'Slack/MS Teams Bot',
      description: 'Alerts, reminders, scheduling commands',
      category: 'integration',
      priority: 'low',
      effort: 'medium',
      impact: 'medium',
      status: 'planned',
      milestone_trigger: 'M3 - Communication'
    },
    {
      id: 'panel-rotation',
      name: 'Panel Rotation Algorithm',
      description: 'Balanced assignment engine for fairness',
      category: 'ai_ml',
      priority: 'medium',
      effort: 'medium',
      impact: 'high',
      status: 'planned',
      milestone_trigger: 'M4 - Load Balancing'
    },
    {
      id: 'analytics-connector',
      name: 'External Analytics Connector',
      description: 'Push logs to Snowflake/BigQuery',
      category: 'analytics',
      priority: 'low',
      effort: 'small',
      impact: 'low',
      status: 'planned',
      milestone_trigger: 'M5 - Lifecycle'
    }
  ]);

  const mvpProgress = 85; // Based on completed milestones
  
  const categoryIcons = {
    ai_ml: Brain,
    automation: Zap,
    analytics: BarChart3,
    integration: Globe
  };

  const getCategoryColor = (category: V2Feature['category']) => {
    const colors = {
      ai_ml: 'text-brand-primary',
      automation: 'text-success',
      analytics: 'text-warning',
      integration: 'text-secondary'
    };
    return colors[category];
  };

  const getPriorityBadge = (priority: V2Feature['priority']) => {
    const variants = {
      high: { variant: 'destructive' as const, label: 'High Priority' },
      medium: { variant: 'secondary' as const, label: 'Medium' },
      low: { variant: 'outline' as const, label: 'Low Priority' }
    };
    return variants[priority];
  };

  const getEffortBadge = (effort: V2Feature['effort']) => {
    const variants = {
      small: { variant: 'default' as const, label: 'Small', weeks: '1-2 weeks' },
      medium: { variant: 'secondary' as const, label: 'Medium', weeks: '3-4 weeks' },
      large: { variant: 'destructive' as const, label: 'Large', weeks: '6-8 weeks' }
    };
    return variants[effort];
  };

  const groupedFeatures = v2Features.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, V2Feature[]>);

  return (
    <div className="space-y-6">
      {/* V2 Roadmap Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            V2 Roadmap & Feature Planning
          </CardTitle>
          <CardDescription>
            Advanced features and AI capabilities for the next version
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">MVP Progress</div>
                  <div className="text-2xl font-bold text-success">{mvpProgress}%</div>
                </div>
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <Progress value={mvpProgress} className="mt-2 h-2" />
            </div>
            
            <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">V2 Features</div>
                  <div className="text-2xl font-bold">{v2Features.length}</div>
                </div>
                <Brain className="h-6 w-6 text-brand-primary" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {v2Features.filter(f => f.priority === 'high').length} high priority
              </div>
            </div>
            
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Est. Timeline</div>
                  <div className="text-2xl font-bold">6-8</div>
                </div>
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">months to V2</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Categories */}
      <Tabs defaultValue="ai_ml" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai_ml">AI & ML</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        {Object.entries(groupedFeatures).map(([category, features]) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  {(() => {
                    const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
                    return <IconComponent className={`h-5 w-5 ${getCategoryColor(category as any)}`} />;
                  })()}
                  {category.replace('_', ' & ')} Features
                </CardTitle>
                <CardDescription>
                  Advanced capabilities for {category.replace('_', ' and ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {features.map((feature) => {
                    const priorityBadge = getPriorityBadge(feature.priority);
                    const effortBadge = getEffortBadge(feature.effort);
                    
                    return (
                      <div
                        key={feature.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-medium">{feature.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {feature.description}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant={priorityBadge.variant} className="text-xs">
                              {priorityBadge.label}
                            </Badge>
                            {feature.status === 'in_progress' && (
                              <Badge variant="default" className="text-xs">
                                In Progress
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-muted-foreground">Effort: </span>
                              <Badge variant={effortBadge.variant} className="text-xs">
                                {effortBadge.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-1">
                                ({effortBadge.weeks})
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Impact: </span>
                              <span className={`font-medium ${
                                feature.impact === 'high' ? 'text-success' :
                                feature.impact === 'medium' ? 'text-warning' : 'text-muted-foreground'
                              }`}>
                                {feature.impact}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Triggered by: {feature.milestone_trigger}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Implementation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Roadmap</CardTitle>
          <CardDescription>
            Phased rollout plan for V2 features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Phase 1: AI & ML Core', 'Phase 2: Advanced Automation', 'Phase 3: Analytics & Insights', 'Phase 4: Integrations'].map((phase, index) => (
              <div key={phase} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{phase}</div>
                  <div className="text-sm text-muted-foreground">
                    Q{index + 1} 2025 • {Math.floor(Math.random() * 3) + 2} features
                  </div>
                </div>
                <Badge variant="outline">
                  {index === 0 ? 'Next' : index === 1 ? 'Planning' : 'Future'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default V2Planning;