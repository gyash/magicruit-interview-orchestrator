import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Users, AlertTriangle, CheckCircle, Settings, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RoleRule {
  round: string;
  allowed_roles: string[];
  preferred_roles: string[];
  blocked_roles: string[];
  minimum_required: number;
  seniority_requirement?: 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
  mandatory_roles?: string[];
}

interface EligibilityViolation {
  id: string;
  interview_id: string;
  candidate_name: string;
  job_title: string;
  round: string;
  violation_type: 'blocked_role' | 'insufficient_seniority' | 'missing_mandatory' | 'below_minimum';
  assigned_interviewer: string;
  assigned_role: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}

const RoleEligibilityFramework = () => {
  const { toast } = useToast();
  const [roleRules, setRoleRules] = useState<RoleRule[]>([]);
  const [violations, setViolations] = useState<EligibilityViolation[]>([]);
  const [enforceRules, setEnforceRules] = useState(true);
  const [showRuleEditor, setShowRuleEditor] = useState(false);

  const initializeRules = () => {
    const defaultRules: RoleRule[] = [
      {
        round: "Recruiter Screen",
        allowed_roles: ["Recruiter", "Talent Acquisition"],
        preferred_roles: ["Senior Recruiter"],
        blocked_roles: ["Engineer", "Manager"],
        minimum_required: 1
      },
      {
        round: "Technical Round",
        allowed_roles: ["Software Engineer", "Senior Engineer", "Staff Engineer", "Principal Engineer"],
        preferred_roles: ["Senior Engineer", "Staff Engineer"],
        blocked_roles: ["Recruiter", "Product Manager"],
        minimum_required: 1,
        seniority_requirement: 'senior'
      },
      {
        round: "System Design",
        allowed_roles: ["Senior Engineer", "Staff Engineer", "Principal Engineer", "Engineering Manager"],
        preferred_roles: ["Staff Engineer", "Principal Engineer"],
        blocked_roles: ["Junior Engineer", "Recruiter"],
        minimum_required: 1,
        seniority_requirement: 'staff'
      },
      {
        round: "Final Round",
        allowed_roles: ["Engineering Manager", "Senior Manager", "Director", "VP Engineering"],
        preferred_roles: ["Engineering Manager", "Director"],
        blocked_roles: ["Junior Engineer", "Recruiter"],
        minimum_required: 1,
        mandatory_roles: ["Hiring Manager"],
        seniority_requirement: 'senior'
      },
      {
        round: "Behavioral",
        allowed_roles: ["HR Partner", "Engineering Manager", "Team Lead"],
        preferred_roles: ["HR Partner", "Engineering Manager"],
        blocked_roles: ["Individual Contributor"],
        minimum_required: 1
      }
    ];

    setRoleRules(defaultRules);
    generateMockViolations();
  };

  const generateMockViolations = () => {
    const mockViolations: EligibilityViolation[] = [
      {
        id: 'violation-1',
        interview_id: 'int-001',
        candidate_name: 'Sarah Chen',
        job_title: 'Senior Software Engineer',
        round: 'Technical Round',
        violation_type: 'insufficient_seniority',
        assigned_interviewer: 'Junior Dev',
        assigned_role: 'Junior Engineer',
        suggestion: 'Assign Senior Engineer or Staff Engineer instead',
        severity: 'high'
      },
      {
        id: 'violation-2',
        interview_id: 'int-002', 
        candidate_name: 'Marcus Johnson',
        job_title: 'Product Manager',
        round: 'Final Round',
        violation_type: 'missing_mandatory',
        assigned_interviewer: 'Tech Lead',
        assigned_role: 'Staff Engineer',
        suggestion: 'Must include Hiring Manager in final round',
        severity: 'high'
      },
      {
        id: 'violation-3',
        interview_id: 'int-003',
        candidate_name: 'Elena Rodriguez',
        job_title: 'DevOps Engineer',
        round: 'System Design',
        violation_type: 'blocked_role',
        assigned_interviewer: 'Alice Recruiter',
        assigned_role: 'Recruiter',
        suggestion: 'Recruiters cannot conduct system design rounds',
        severity: 'medium'
      }
    ];

    setViolations(mockViolations);
  };

  const validateAssignment = (round: string, assignedRole: string): string | null => {
    const rule = roleRules.find(r => r.round === round);
    if (!rule || !enforceRules) return null;

    if (rule.blocked_roles.includes(assignedRole)) {
      return `${assignedRole} is blocked for ${round}`;
    }

    if (rule.mandatory_roles && !rule.mandatory_roles.includes(assignedRole)) {
      return `${round} requires mandatory role: ${rule.mandatory_roles.join(' or ')}`;
    }

    if (!rule.allowed_roles.includes(assignedRole)) {
      return `${assignedRole} is not eligible for ${round}`;
    }

    return null;
  };

  const resolveViolation = (violationId: string, action: 'fix' | 'override' | 'dismiss') => {
    setViolations(prev => prev.filter(v => v.id !== violationId));
    
    const actionMessages = {
      fix: 'Violation resolved with suggested assignment',
      override: 'Manual override applied - violation ignored',
      dismiss: 'Violation dismissed by user'
    };

    toast({
      title: "Violation Resolved",
      description: actionMessages[action],
    });
  };

  const getSeverityBadge = (severity: EligibilityViolation['severity']) => {
    const variants = {
      high: { variant: 'destructive' as const, label: 'High Risk' }, 
      medium: { variant: 'secondary' as const, label: 'Medium' },
      low: { variant: 'outline' as const, label: 'Low Risk' }
    };
    return variants[severity];
  };

  const getViolationIcon = (type: EligibilityViolation['violation_type']) => {
    switch (type) {
      case 'blocked_role': return <Shield className="h-4 w-4 text-error" />;
      case 'insufficient_seniority': return <Crown className="h-4 w-4 text-warning" />;
      case 'missing_mandatory': return <AlertTriangle className="h-4 w-4 text-error" />;
      case 'below_minimum': return <Users className="h-4 w-4 text-warning" />;
      default: return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getViolationLabel = (type: EligibilityViolation['violation_type']) => {
    const labels = {
      blocked_role: 'Blocked Role',
      insufficient_seniority: 'Insufficient Seniority',
      missing_mandatory: 'Missing Mandatory Role',
      below_minimum: 'Below Minimum Count'
    };
    return labels[type];
  };

  return (
    <div className="space-y-6">
      {/* Framework Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Eligibility Framework
          </CardTitle>
          <CardDescription>
            Enforce role-based interview panel assignments with automatic validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-medium">Rule Enforcement</div>
                <div className="text-sm text-muted-foreground">
                  {enforceRules ? 'Active - violations will be flagged' : 'Disabled - rules ignored'}
                </div>
              </div>
              <Switch 
                checked={enforceRules}
                onCheckedChange={setEnforceRules}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={initializeRules}>
                Load Default Rules
              </Button>
              
              <Dialog open={showRuleEditor} onOpenChange={setShowRuleEditor}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Rules
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Role Eligibility Rules</DialogTitle>
                    <DialogDescription>
                      Configure which roles can participate in each interview round
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {roleRules.map((rule, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="font-medium mb-3">{rule.round}</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-xs font-medium text-success">Allowed Roles</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rule.allowed_roles.map(role => (
                                <Badge key={role} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs font-medium text-brand-primary">Preferred Roles</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rule.preferred_roles.map(role => (
                                <Badge key={role} variant="default" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs font-medium text-error">Blocked Roles</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rule.blocked_roles.map(role => (
                                <Badge key={role} variant="destructive" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs font-medium">Requirements</Label>
                            <div className="space-y-1 mt-1">
                              <div className="text-xs">Min Required: {rule.minimum_required}</div>
                              {rule.seniority_requirement && (
                                <div className="text-xs">Seniority: {rule.seniority_requirement}+</div>
                              )}
                              {rule.mandatory_roles && (
                                <div className="text-xs">Mandatory: {rule.mandatory_roles.join(', ')}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violations */}
      {violations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-error" />
              Role Eligibility Violations ({violations.length})
            </CardTitle>
            <CardDescription>
              Interview assignments that violate role eligibility rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {violations.map((violation) => {
                const severityBadge = getSeverityBadge(violation.severity);
                const violationIcon = getViolationIcon(violation.violation_type);
                const violationLabel = getViolationLabel(violation.violation_type);
                
                return (
                  <div
                    key={violation.id}
                    className="p-4 border border-error/20 bg-error/5 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {violationIcon}
                        <div>
                          <div className="font-medium">{violation.candidate_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {violation.job_title} • {violation.round}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={severityBadge.variant}>
                          {severityBadge.label}
                        </Badge>
                        <Badge variant="outline">
                          {violationLabel}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded text-sm">
                        <div className="font-medium text-error mb-1">Issue:</div>
                        <div>
                          {violation.assigned_interviewer} ({violation.assigned_role}) assigned to {violation.round}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-success/10 border border-success/20 rounded text-sm">
                        <div className="font-medium text-success mb-1">Suggestion:</div>
                        <div>{violation.suggestion}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => resolveViolation(violation.id, 'fix')}
                          className="bg-success hover:bg-success/90"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Apply Fix
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveViolation(violation.id, 'override')}
                        >
                          Override Rule
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveViolation(violation.id, 'dismiss')}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rule Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Role Matrix</CardTitle>
          <CardDescription>
            Overview of role eligibility across interview rounds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Round</th>
                  <th className="text-left p-2">Allowed Roles</th>
                  <th className="text-left p-2">Restrictions</th>
                  <th className="text-left p-2">Requirements</th>
                </tr>
              </thead>
              <tbody>
                {roleRules.map((rule, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{rule.round}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {rule.allowed_roles.slice(0, 3).map(role => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                        {rule.allowed_roles.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{rule.allowed_roles.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      {rule.blocked_roles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {rule.blocked_roles.slice(0, 2).map(role => (
                            <Badge key={role} variant="destructive" className="text-xs">
                              ❌ {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="text-xs space-y-1">
                        <div>Min: {rule.minimum_required}</div>
                        {rule.seniority_requirement && (
                          <div>Level: {rule.seniority_requirement}+</div>
                        )}
                        {rule.mandatory_roles && (
                          <div>Must: {rule.mandatory_roles[0]}</div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleEligibilityFramework;