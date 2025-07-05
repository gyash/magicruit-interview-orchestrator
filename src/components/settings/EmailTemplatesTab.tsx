import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Plus, Edit, Copy, Trash2, Send } from "lucide-react";

export function EmailTemplatesTab() {
  const templates = [
    {
      id: 1,
      name: "Interview Invitation",
      subject: "Interview Invitation - {position} at {company}",
      type: "invitation",
      usage: 847,
      status: "active"
    },
    {
      id: 2,
      name: "Interview Confirmation",
      subject: "Interview Confirmed - {date} at {time}",
      type: "confirmation",
      usage: 623,
      status: "active"
    },
    {
      id: 3,
      name: "Interview Reminder",
      subject: "Reminder: Interview Tomorrow at {time}",
      type: "reminder",
      usage: 1205,
      status: "active"
    },
    {
      id: 4,
      name: "Reschedule Request",
      subject: "Interview Reschedule Request",
      type: "reschedule",
      usage: 89,
      status: "active"
    },
    {
      id: 5,
      name: "No Show Follow-up",
      subject: "Missed Interview - Let's Reschedule",
      type: "no-show",
      usage: 34,
      status: "draft"
    },
    {
      id: 6,
      name: "Thank You - Post Interview",
      subject: "Thank you for your time today",
      type: "thank-you",
      usage: 456,
      status: "active"
    }
  ];

  return (
    <div className="grid gap-6">
      {/* Template Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Template Library
          </CardTitle>
          <CardDescription>
            Manage automated email templates for different interview scenarios
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
                  <SelectItem value="invitation">Invitations</SelectItem>
                  <SelectItem value="reminder">Reminders</SelectItem>
                  <SelectItem value="confirmation">Confirmations</SelectItem>
                  <SelectItem value="reschedule">Reschedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{template.name}</h3>
                      <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                        {template.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Subject: {template.subject}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Used {template.usage} times this month
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Send className="h-4 w-4" />
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
            Email Template Builder
          </CardTitle>
          <CardDescription>
            Create custom email templates with dynamic variables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input placeholder="e.g., Technical Interview Reminder" />
              </div>
              
              <div className="space-y-2">
                <Label>Template Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invitation">Interview Invitation</SelectItem>
                    <SelectItem value="confirmation">Interview Confirmation</SelectItem>
                    <SelectItem value="reminder">Interview Reminder</SelectItem>
                    <SelectItem value="reschedule">Reschedule Request</SelectItem>
                    <SelectItem value="cancellation">Interview Cancellation</SelectItem>
                    <SelectItem value="no-show">No Show Follow-up</SelectItem>
                    <SelectItem value="thank-you">Thank You Message</SelectItem>
                    <SelectItem value="feedback">Feedback Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Email Subject</Label>
                <Input placeholder="Interview Invitation - {position} at {company}" />
              </div>
              
              <div className="space-y-2">
                <Label>Send Trigger</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="When to send this email" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediately after scheduling</SelectItem>
                    <SelectItem value="24h">24 hours before interview</SelectItem>
                    <SelectItem value="1h">1 hour before interview</SelectItem>
                    <SelectItem value="manual">Manual send only</SelectItem>
                    <SelectItem value="no-show">After no-show detected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Available Variables</Label>
                <div className="p-3 bg-muted rounded text-xs space-y-1">
                  <div><code>{"{candidate_name}"}</code> - Candidate's full name</div>
                  <div><code>{"{candidate_email}"}</code> - Candidate's email</div>
                  <div><code>{"{position}"}</code> - Job position title</div>
                  <div><code>{"{company}"}</code> - Company name</div>
                  <div><code>{"{date}"}</code> - Interview date</div>
                  <div><code>{"{time}"}</code> - Interview time</div>
                  <div><code>{"{duration}"}</code> - Interview duration</div>
                  <div><code>{"{meeting_link}"}</code> - Video call link</div>
                  <div><code>{"{interviewer_name}"}</code> - Interviewer's name</div>
                  <div><code>{"{reschedule_link}"}</code> - Reschedule URL</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Email Content</Label>
            <Textarea 
              placeholder="Dear {candidate_name},

We're excited to invite you for an interview for the {position} position at {company}.

Interview Details:
• Date: {date}
• Time: {time}
• Duration: {duration}
• Meeting Link: {meeting_link}
• Interviewer: {interviewer_name}

Please confirm your attendance by replying to this email.

Best regards,
{company} Hiring Team"
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90">
              Save Template
            </Button>
            <Button variant="outline">Preview Email</Button>
            <Button variant="outline">Send Test Email</Button>
          </div>
        </CardContent>
      </Card>

      {/* Template Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Performance Analytics
          </CardTitle>
          <CardDescription>
            Track email open rates, click rates, and response rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">94.3%</div>
              <div className="text-sm text-muted-foreground">Delivery Rate</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">78.9%</div>
              <div className="text-sm text-muted-foreground">Open Rate</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">45.2%</div>
              <div className="text-sm text-muted-foreground">Click Rate</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">89.7%</div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex gap-4">
              <Button variant="outline">View Detailed Analytics</Button>
              <Button variant="outline">Export Email Reports</Button>
              <Button variant="outline">A/B Test Templates</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}