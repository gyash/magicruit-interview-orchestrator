import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, MessageSquare, Bell, CheckCircle, AlertTriangle, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationChannel {
  type: 'email' | 'whatsapp' | 'slack';
  enabled: boolean;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  error?: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'confirmation' | 'reminder_24h' | 'reminder_1h' | 'retry_join' | 'cancellation';
  subject: string;
  content: string;
  channels: NotificationChannel[];
}

interface NotificationSystemProps {
  interview: any;
  onNotificationSent: (template: NotificationTemplate) => void;
}

const NotificationSystem = ({ interview, onNotificationSent }: NotificationSystemProps) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showCustomMessage, setShowCustomMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  // Initialize notification templates
  useEffect(() => {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'confirmation',
        name: 'Interview Confirmation',
        type: 'confirmation',
        subject: 'Interview Confirmed - {{job_title}}',
        content: `Hi {{candidate_name}},

Your interview for {{job_title}} has been confirmed for:
📅 {{date}} at {{time}}
⏱️ Duration: {{duration}} minutes
💻 Video Link: {{vc_link}}

Panel Members: {{interviewers}}

We look forward to speaking with you!

Best regards,
{{company_name}} Team`,
        channels: [
          { type: 'email', enabled: true, status: 'pending' },
          { type: 'whatsapp', enabled: true, status: 'pending' }
        ]
      },
      {
        id: 'reminder_24h',
        name: '24 Hour Reminder',
        type: 'reminder_24h',
        subject: 'Interview Reminder - Tomorrow at {{time}}',
        content: `Hi {{candidate_name}},

This is a friendly reminder about your interview tomorrow:
📅 {{date}} at {{time}}
💻 Join link: {{vc_link}}

Please ensure you have a stable internet connection and join 5 minutes early.

Questions? Reply to this message.`,
        channels: [
          { type: 'email', enabled: true, status: 'pending' },
          { type: 'whatsapp', enabled: true, status: 'pending' }
        ]
      },
      {
        id: 'reminder_1h',
        name: '1 Hour Reminder',
        type: 'reminder_1h',
        subject: 'Interview Starting Soon - {{time}}',
        content: `Hi {{candidate_name}},

Your interview starts in 1 hour:
🕐 {{time}}
💻 {{vc_link}}

Join 5 minutes early. Good luck!`,
        channels: [
          { type: 'whatsapp', enabled: true, status: 'pending' }
        ]
      },
      {
        id: 'retry_join',
        name: 'Join Retry Alert',
        type: 'retry_join',
        subject: 'Interview Starting - Please Join',
        content: `Hi {{candidate_name}},

Your interview has started. Please join now:
💻 {{vc_link}}

The interviewer is waiting for you.`,
        channels: [
          { type: 'whatsapp', enabled: true, status: 'pending' },
          { type: 'email', enabled: true, status: 'pending' }
        ]
      }
    ];
    
    setTemplates(defaultTemplates);
  }, []);

  const sendNotification = async (template: NotificationTemplate) => {
    setIsSending(true);
    
    try {
      // Simulate multi-channel sending
      const updatedChannels = await Promise.all(
        template.channels.map(async (channel) => {
          if (!channel.enabled) return channel;
          
          // Simulate channel-specific delays
          const delay = channel.type === 'email' ? 1000 : 
                       channel.type === 'whatsapp' ? 1500 : 2000;
          
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Simulate success/failure rates
          const success = Math.random() > 0.1; // 90% success rate
          
          if (success) {
            const now = new Date().toISOString();
            return {
              ...channel,
              status: 'sent' as const,
              sent_at: now,
              // Simulate delivery and read times
              delivered_at: channel.type === 'whatsapp' ? now : undefined,
              read_at: channel.type === 'whatsapp' && Math.random() > 0.3 ? now : undefined
            };
          } else {
            return {
              ...channel,
              status: 'failed' as const,
              error: `${channel.type} delivery failed - retry in 5 minutes`
            };
          }
        })
      );
      
      const updatedTemplate = { ...template, channels: updatedChannels };
      
      // Update template state
      setTemplates(prev => 
        prev.map(t => t.id === template.id ? updatedTemplate : t)
      );
      
      onNotificationSent(updatedTemplate);
      
      const successCount = updatedChannels.filter(c => c.status === 'sent').length;
      const failCount = updatedChannels.filter(c => c.status === 'failed').length;
      
      toast({
        title: `Notification Sent`,
        description: `${successCount} sent successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
        variant: failCount > 0 ? "destructive" : "default"
      });
      
    } catch (error) {
      toast({
        title: "Notification Failed",
        description: "Unable to send notifications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'whatsapp': return MessageSquare;
      case 'slack': return Bell;
      default: return Mail;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'delivered': return 'default'; 
      case 'read': return 'outline';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Multi-Channel Notifications
          </CardTitle>
          <CardDescription>
            Send automated notifications via email, WhatsApp, and Slack
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.slice(0, 4).map((template) => {
              const hasFailures = template.channels.some(c => c.status === 'failed');
              const allSent = template.channels.filter(c => c.enabled).every(c => c.status === 'sent' || c.status === 'delivered' || c.status === 'read');
              
              return (
                <Button
                  key={template.id}
                  variant="outline"
                  onClick={() => sendNotification(template)}
                  disabled={isSending}
                  className={`h-auto p-4 text-left justify-start ${
                    allSent ? 'border-success bg-success/5' : 
                    hasFailures ? 'border-error bg-error/5' : ''
                  }`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{template.name}</span>
                      <div className="flex gap-1">
                        {template.channels.map((channel, idx) => {
                          if (!channel.enabled) return null;
                          const Icon = getChannelIcon(channel.type);
                          return (
                            <Icon 
                              key={idx} 
                              className={`h-3 w-3 ${
                                channel.status === 'sent' ? 'text-success' :
                                channel.status === 'failed' ? 'text-error' :
                                'text-muted-foreground'
                              }`} 
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {template.channels.filter(c => c.enabled).length} channels configured
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>
            Track delivery status and engagement across all channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => {
              const anySent = template.channels.some(c => c.status !== 'pending');
              if (!anySent) return null;
              
              return (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {template.channels.find(c => c.sent_at)?.sent_at && 
                          `Sent ${new Date(template.channels.find(c => c.sent_at)!.sent_at!).toLocaleString()}`
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {template.channels.map((channel, idx) => {
                      if (!channel.enabled) return null;
                      const Icon = getChannelIcon(channel.type);
                      
                      return (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                          <Icon className="h-4 w-4" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium capitalize">
                              {channel.type}
                            </div>
                            <Badge 
                              variant={getStatusColor(channel.status) as any}
                              className="text-xs"
                            >
                              {channel.status}
                            </Badge>
                          </div>
                          {channel.status === 'sent' && (
                            <CheckCircle className="h-3 w-3 text-success" />
                          )}
                          {channel.status === 'failed' && (
                            <AlertTriangle className="h-3 w-3 text-error" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {template.channels.some(c => c.error) && (
                    <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded text-xs">
                      <div className="text-error font-medium">Delivery Issues:</div>
                      {template.channels
                        .filter(c => c.error)
                        .map((c, idx) => (
                          <div key={idx}>• {c.error}</div>
                        ))
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Message Dialog */}
      <Dialog open={showCustomMessage} onOpenChange={setShowCustomMessage}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Send Custom Message
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Custom Notification</DialogTitle>
            <DialogDescription>
              Send a personalized message to candidate and interviewers
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Type your custom message here..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  // Handle custom message sending
                  setShowCustomMessage(false);
                  setCustomMessage("");
                  toast({
                    title: "Custom Message Sent",
                    description: "Your message has been delivered to all parties."
                  });
                }}
                disabled={!customMessage.trim()}
              >
                Send Message
              </Button>
              <Button variant="outline" onClick={() => setShowCustomMessage(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationSystem;