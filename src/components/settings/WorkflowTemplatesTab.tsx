import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Copy, Share, Star, Plus, Edit, Trash2 } from "lucide-react";

export function WorkflowTemplatesTab() {
  const templates = [
    {
      id: 1,
      name: "Software Engineer - Full Stack",
      stages: ["Phone Screen", "Technical", "System Design", "Cultural Fit"],
      duration: "3-4 weeks",
      usage: 45,
      rating: 4.8,
      isShared: true
    },
    {
      id: 2, 
      name: "Product Manager - Senior",
      stages: ["Recruiter Screen", "PM Interview", "Case Study", "Executive Review"],
      duration: "2-3 weeks",
      usage: 32,
      rating: 4.6,
      isShared: false
    },
    {
      id: 3,
      name: "Data Scientist",
      stages: ["Phone Screen", "Technical Assessment", "Presentation", "Team Interview"],
      duration: "3-4 weeks", 
      usage: 28,
      rating: 4.7,
      isShared: true
    }
  ];

  return (
    <div className="grid gap-6">
      {/* Template Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Interview Workflow Templates
          </CardTitle>
          <CardDescription>
            Pre-built and custom interview workflows for different roles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Import Template
              </Button>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Search templates..." className="w-48" />
            </div>
          </div>

          <div className="grid gap-4">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{template.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{template.rating}</span>
                      </div>
                      {template.isShared && (
                        <Badge variant="secondary" className="text-xs">
                          <Share className="h-3 w-3 mr-1" />
                          Shared
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {template.stages.map((stage, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {stage}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Duration: {template.duration}</span>
                      <span>Used {template.usage} times</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Template Builder
          </CardTitle>
          <CardDescription>
            Create a new interview workflow template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input placeholder="e.g., Senior Frontend Engineer" />
              </div>
              
              <div className="space-y-2">
                <Label>Role Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                    <SelectItem value="principal">Principal/Staff (10+ years)</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Interview Stages</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Stage name (e.g., Phone Screen)" className="flex-1" />
                    <Button variant="outline" size="sm">Add</Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Suggested: Phone Screen → Technical → System Design → Cultural Fit
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Estimated Duration</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 weeks</SelectItem>
                    <SelectItem value="2-3">2-3 weeks</SelectItem>
                    <SelectItem value="3-4">3-4 weeks</SelectItem>
                    <SelectItem value="4-6">4-6 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90">
              Create Template
            </Button>
            <Button variant="outline">Save as Draft</Button>
            <Button variant="outline">Preview</Button>
          </div>
        </CardContent>
      </Card>

      {/* Template Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Template Sharing & Collaboration
          </CardTitle>
          <CardDescription>
            Share templates across teams and organizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">My Templates</div>
              <Button variant="outline" size="sm" className="mt-2">Manage</Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">Shared with Me</div>
              <Button variant="outline" size="sm" className="mt-2">View All</Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-muted-foreground">Public Library</div>
              <Button variant="outline" size="sm" className="mt-2">Browse</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Share Settings</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium text-sm">Team Sharing</div>
                    <div className="text-xs text-muted-foreground">Share with your hiring team</div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium text-sm">Organization Library</div>
                    <div className="text-xs text-muted-foreground">Contribute to company templates</div>
                  </div>
                  <Button variant="outline" size="sm">Contribute</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Import Options</Label>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Import from ATS
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Copy className="h-4 w-4 mr-2" />
                  Import from File
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="h-4 w-4 mr-2" />
                  Browse Public Templates
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}