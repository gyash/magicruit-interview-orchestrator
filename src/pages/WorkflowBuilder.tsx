import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Clock, 
  Users, 
  Video, 
  Save,
  Eye,
  ArrowRight
} from "lucide-react";
import { mockJobs, mockInterviewers, WorkflowStage } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const WorkflowBuilder = () => {
  const { toast } = useToast();
  const [selectedJobId, setSelectedJobId] = useState("");
  const [activeTab, setActiveTab] = useState("select-job");
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [atsImportedStages, setAtsImportedStages] = useState<WorkflowStage[]>([]);

  // Mock ATS imported stages based on job selection
  const getATSStagesForJob = (jobId: string): WorkflowStage[] => {
    const baseStages = [
      {
        id: `ats-phone-screening`,
        stage_name: "Phone Screening",
        interviewers: ["recruiter@company.com"],
        duration_mins: 30,
        mode: "Phone" as any,
        buffer_before_mins: 5,
        buffer_after_mins: 5,
        notes: "Initial screening call - ATS Generated",
        isATSGenerated: true
      },
      {
        id: `ats-technical-interview`,
        stage_name: "Technical Interview",
        interviewers: ["tech.lead@company.com"],
        duration_mins: 60,
        mode: "Google Meet" as any,
        buffer_before_mins: 10,
        buffer_after_mins: 10,
        notes: "Technical assessment - ATS Generated",
        isATSGenerated: true
      },
      {
        id: `ats-final-interview`,
        stage_name: "Final Interview",
        interviewers: ["hiring.manager@company.com"],
        duration_mins: 45,
        mode: "Google Meet" as any,
        buffer_before_mins: 5,
        buffer_after_mins: 5,
        notes: "Final decision interview - ATS Generated",
        isATSGenerated: true
      }
    ];
    
    return baseStages;
  };

  const loadATSStages = (jobId: string) => {
    const importedStages = getATSStagesForJob(jobId);
    setAtsImportedStages(importedStages);
    setStages(importedStages); // Pre-populate with ATS stages
    toast({
      title: "ATS Stages Loaded",
      description: `${importedStages.length} interview stages imported from ATS`,
    });
  };

  const addStage = () => {
    const newStage: WorkflowStage = {
      id: `stage-${Date.now()}`,
      stage_name: "",
      interviewers: [],
      duration_mins: 60,
      mode: "Google Meet",
      buffer_before_mins: 5,
      buffer_after_mins: 5,
      notes: ""
    };
    setStages([...stages, newStage]);
  };

  const updateStage = (stageId: string, updates: Partial<WorkflowStage>) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, ...updates } : stage
    ));
  };

  const deleteStage = (stageId: string) => {
    setStages(stages.filter(stage => stage.id !== stageId));
  };

  const handleInterviewerToggle = (stageId: string, email: string) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return;

    const isSelected = stage.interviewers.includes(email);
    const newInterviewers = isSelected 
      ? stage.interviewers.filter(e => e !== email)
      : [...stage.interviewers, email];

    updateStage(stageId, { interviewers: newInterviewers });
  };

  const saveWorkflow = () => {
    if (!selectedJobId) {
      toast({
        title: "Error",
        description: "Please select a job first",
        variant: "destructive"
      });
      return;
    }

    if (stages.length === 0) {
      toast({
        title: "Error", 
        description: "Please add at least one interview stage",
        variant: "destructive"
      });
      return;
    }

    // Validate stages
    const invalidStages = stages.filter(stage => 
      !stage.stage_name || stage.interviewers.length === 0
    );

    if (invalidStages.length > 0) {
      toast({
        title: "Error",
        description: "All stages must have a name and at least one interviewer",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Workflow saved successfully! Ready for scheduling.",
    });
  };

  const selectedJob = mockJobs.find(job => job.id === selectedJobId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workflow Builder 🔧</h1>
        <p className="text-muted-foreground">
          Design your perfect interview process. Create templates, set stages, and let AI handle the execution. Build once, use everywhere.
        </p>
      </div>

      {/* Workflow Builder Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="select-job">1. Select Job</TabsTrigger>
          <TabsTrigger value="define-workflow" disabled={!selectedJobId}>
            2. Define Workflow
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={stages.length === 0}>
            3. Preview & Save
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Select Job */}
        <TabsContent value="select-job">
          <Card>
            <CardHeader>
              <CardTitle>Select Job Position</CardTitle>
              <CardDescription>
                Choose the job position for which you want to create an interview workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Getting Started Guide */}
              {!selectedJobId && (
                <div className="border-dashed border-2 border-muted-foreground/25 rounded-lg p-8 text-center mb-6">
                  <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">Create Your First Interview Workflow</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Design standardized interview processes that ensure consistency and quality across all hiring decisions. Save hours of coordination time!
                  </p>
                  
                  <div className="w-full max-w-md mx-auto">
                    <div className="text-sm font-medium mb-3 text-left">💡 Getting Started Tips:</div>
                    <div className="space-y-2 text-sm text-muted-foreground text-left">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                        <span>Select a job position below to get started</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                        <span>Import existing stages from your ATS automatically</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                        <span>Customize stages, assign interviewers, set durations</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                        <span>Save and activate for AI-powered scheduling</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockJobs.map((job) => (
                  <Card 
                    key={job.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedJobId === job.id ? 'ring-2 ring-brand-primary' : ''
                    }`}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{job.title}</h3>
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{job.department}</p>
                        <p className="text-sm text-muted-foreground">{job.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedJobId && (
                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      loadATSStages(selectedJobId);
                      setActiveTab("define-workflow");
                    }}
                    className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
                  >
                    Continue to Workflow
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Define Workflow */}
        <TabsContent value="define-workflow">
          <div className="space-y-6">
            {/* ATS Import Notification */}
            {atsImportedStages.length > 0 && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <h4 className="font-medium text-blue-900">ATS Workflow Imported</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          {atsImportedStages.length} interview stages have been automatically imported from your ATS. 
                          You can edit, delete, or add new stages as needed.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const customStages = stages.filter(s => !s.isATSGenerated);
                          setStages(customStages);
                          toast({
                            title: "ATS Stages Removed",
                            description: "All ATS-imported stages have been removed. You can start fresh.",
                          });
                        }}
                      >
                        Remove All ATS Stages
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setStages([...atsImportedStages]);
                          toast({
                            title: "Workflow Reset",
                            description: "Workflow has been reset to original ATS stages.",
                          });
                        }}
                      >
                        Reset to ATS Default
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Define Interview Stages</CardTitle>
                    <CardDescription>
                      Customize interview stages for {selectedJob?.title}
                      {atsImportedStages.length > 0 && (
                        <span className="block text-blue-600 text-sm mt-1">
                          ✓ {atsImportedStages.length} stages imported from ATS
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Button onClick={addStage} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Stage
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stages.map((stage, index) => (
                    <Card key={stage.id} className={`relative ${stage.isATSGenerated ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                            <Badge variant="outline">Stage {index + 1}</Badge>
                            {stage.isATSGenerated && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                ATS Import
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteStage(stage.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`stage-name-${stage.id}`}>Stage Name</Label>
                          <Input
                            id={`stage-name-${stage.id}`}
                            placeholder="e.g., Technical Interview"
                            value={stage.stage_name}
                            onChange={(e) => updateStage(stage.id, { stage_name: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`duration-${stage.id}`}>Duration (minutes)</Label>
                          <Select 
                            value={stage.duration_mins.toString()} 
                            onValueChange={(value) => updateStage(stage.id, { duration_mins: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="90">90 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`mode-${stage.id}`}>Interview Mode</Label>
                          <Select 
                            value={stage.mode} 
                            onValueChange={(value: any) => updateStage(stage.id, { mode: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Google Meet">Google Meet</SelectItem>
                              <SelectItem value="Zoom">Zoom</SelectItem>
                              <SelectItem value="Phone">Phone</SelectItem>
                              <SelectItem value="In-person">In-person</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Buffer Time</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Before"
                              value={stage.buffer_before_mins}
                              onChange={(e) => updateStage(stage.id, { buffer_before_mins: parseInt(e.target.value) || 0 })}
                              className="w-20"
                            />
                            <span className="text-muted-foreground py-2">min before,</span>
                            <Input
                              type="number"
                              placeholder="After"
                              value={stage.buffer_after_mins}
                              onChange={(e) => updateStage(stage.id, { buffer_after_mins: parseInt(e.target.value) || 0 })}
                              className="w-20"
                            />
                            <span className="text-muted-foreground py-2">min after</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Select Interviewers</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {mockInterviewers.map((interviewer) => (
                            <div
                              key={interviewer.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                                stage.interviewers.includes(interviewer.email)
                                  ? 'bg-primary/10 border-primary'
                                  : 'hover:bg-muted/50'
                              }`}
                              onClick={() => handleInterviewerToggle(stage.id, interviewer.email)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm">{interviewer.name}</div>
                                  <div className="text-xs text-muted-foreground">{interviewer.role}</div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {interviewer.availability_score}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`notes-${stage.id}`}>Notes (Optional)</Label>
                        <Textarea
                          id={`notes-${stage.id}`}
                          placeholder="Add any specific instructions or requirements for this stage..."
                          value={stage.notes}
                          onChange={(e) => updateStage(stage.id, { notes: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {stages.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No interview stages yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first interview stage to get started
                    </p>
                    <Button onClick={addStage} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Stage
                    </Button>
                  </div>
                )}

                {stages.length > 0 && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={addStage}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Stage
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("preview")}
                      className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
                    >
                      Preview Workflow
                      <Eye className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Preview & Save */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Preview</CardTitle>
              <CardDescription>
                Review your workflow for {selectedJob?.title} before saving
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Summary */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Job Position</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Title:</span>
                    <div className="font-medium">{selectedJob?.title}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Department:</span>
                    <div className="font-medium">{selectedJob?.department}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <div className="font-medium">{selectedJob?.location}</div>
                  </div>
                </div>
              </div>

              {/* Workflow Stages */}
              <div>
                <h3 className="font-semibold mb-4">Interview Stages ({stages.length})</h3>
                <div className="space-y-4">
                  {stages.map((stage, index) => (
                    <div key={stage.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline">Stage {index + 1}</Badge>
                        <h4 className="font-medium">{stage.stage_name}</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{stage.duration_mins} minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span>{stage.mode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{stage.interviewers.length} interviewer(s)</span>
                        </div>
                        <div className="text-muted-foreground">
                          Buffer: {stage.buffer_before_mins}m / {stage.buffer_after_mins}m
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="text-muted-foreground text-sm mb-1">Interviewers:</div>
                        <div className="flex flex-wrap gap-2">
                          {stage.interviewers.map((email) => {
                            const interviewer = mockInterviewers.find(i => i.email === email);
                            return (
                              <Badge key={email} variant="secondary">
                                {interviewer?.name || email}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      {stage.notes && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                          <span className="text-muted-foreground">Notes:</span> {stage.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Workflow Time */}
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Total Interview Time</h4>
                    <p className="text-sm text-muted-foreground">
                      Estimated time including buffers
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {stages.reduce((total, stage) => 
                        total + stage.duration_mins + stage.buffer_before_mins + stage.buffer_after_mins, 0
                      )} min
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(stages.reduce((total, stage) => 
                        total + stage.duration_mins + stage.buffer_before_mins + stage.buffer_after_mins, 0
                      ) / 60 * 10) / 10} hours
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setActiveTab("define-workflow")}>
                  Edit Workflow
                </Button>
                <Button 
                  onClick={saveWorkflow}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowBuilder;