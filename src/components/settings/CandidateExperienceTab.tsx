import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Calendar, FileText, Star } from "lucide-react";

export function CandidateExperienceTab() {
  return (
    <div className="grid gap-6">
      {/* Self-Scheduling Portal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Self-Scheduling Portal
          </CardTitle>
          <CardDescription>
            Configure candidate self-service scheduling options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Self-Scheduling</Label>
                  <div className="text-sm text-muted-foreground">
                    Allow candidates to book their own interview slots
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Interviewer Names</Label>
                  <div className="text-sm text-muted-foreground">
                    Display interviewer details to candidates
                  </div>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Rescheduling</Label>
                  <div className="text-sm text-muted-foreground">
                    Candidates can reschedule once within 24h
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Booking Window</Label>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days ahead</SelectItem>
                    <SelectItem value="7">7 days ahead</SelectItem>
                    <SelectItem value="14">14 days ahead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Time Slot Duration</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Buffer Time</Label>
                <Select defaultValue="15">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No buffer</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview Preparation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Interview Preparation Materials
          </CardTitle>
          <CardDescription>
            Provide candidates with helpful preparation resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <Textarea 
                  placeholder="Welcome to the interview process! Here's what to expect..."
                  className="min-h-[100px]"
                  defaultValue="Thank you for your interest in joining our team! We're excited to learn more about you."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Company Overview PDF</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                  <div className="text-muted-foreground text-sm">Upload company information</div>
                  <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Interview Guidelines</Label>
                <Textarea 
                  placeholder="What to expect during the interview..."
                  className="min-h-[100px]"
                  defaultValue="Please join the video call 5 minutes early. Have your resume ready and prepare questions about the role."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Technical Requirements</Label>
                <Textarea 
                  placeholder="For technical roles, mention coding environment setup..."
                  className="min-h-[100px]"
                  defaultValue="For technical interviews, please ensure you have a stable internet connection and are comfortable with screen sharing."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Feedback & Experience Collection
          </CardTitle>
          <CardDescription>
            Gather candidate feedback to improve the interview process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Post-Interview Survey</Label>
                  <div className="text-sm text-muted-foreground">
                    Send feedback form after each interview
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Process Rating</Label>
                  <div className="text-sm text-muted-foreground">
                    Ask candidates to rate the interview experience
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Anonymous Feedback</Label>
                  <div className="text-sm text-muted-foreground">
                    Option for candidates to provide anonymous input
                  </div>
                </div>
                <Switch />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Custom Survey Questions</Label>
                <Textarea 
                  placeholder="1. How would you rate the interview process?
2. What could we improve?
3. Additional comments..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex gap-4">
              <Button variant="outline">Preview Survey</Button>
              <Button variant="outline">View Feedback Reports</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding & Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Candidate Portal Branding
          </CardTitle>
          <CardDescription>
            Customize the candidate-facing interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Portal Header</Label>
                <Input placeholder="Welcome to Acme Corp Interviews" />
              </div>
              
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input type="text" placeholder="#0066CC" className="flex-1" />
                  <div className="w-12 h-10 bg-primary rounded border"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Custom CSS</Label>
                <Textarea 
                  placeholder="Add custom styling..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Portal Footer</Label>
                <Input placeholder="© 2025 Acme Corp. All rights reserved." />
              </div>
              
              <div className="space-y-2">
                <Label>Contact Information</Label>
                <Input placeholder="hr@company.com | +1-555-0123" />
              </div>
              
              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                  <div className="text-muted-foreground text-sm">Upload company logo</div>
                  <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}