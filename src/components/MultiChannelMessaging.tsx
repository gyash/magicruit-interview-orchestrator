import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, MessageSquare, Bell, Clock, CheckCircle, AlertTriangle, Send, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageChannel {
  type: 'email' | 'whatsapp' | 'slack';
  enabled: boolean;
  status: 'pending' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  error_message?: string;
  retry_count: number;
}

interface MessageTemplate {
  id: string;
  trigger: 't_24h' | 't_1h' | 't_start' | 'retry' | 'escalation';
  subject: string;
  content: string;
  channels: MessageChannel[];
  recipients: ('candidate' | 'interviewer' | 'recruiter')[];
}

interface CommunicationLog {
  id: string;
  interview_id: string;
  message_id: string;
  timestamp: string;
  trigger: string;
  status: 'success' | 'partial' | 'failed';
  channels_attempted: number;
  channels_successful: number;
  escalated: boolean;
}

const MultiChannelMessaging = ({ interview }: { interview: any }) => {
  const { toast } = useToast();
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([]);
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([]);
  const [activeReminders, setActiveReminders] = useState<string[]>([]);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageTemplate | null>(null);

  // Initialize message templates
  useEffect(() => {
    const templates: MessageTemplate[] = [
      {
        id: 'reminder_24h',
        trigger: 't_24h',
        subject: 'Interview Reminder - Tomorrow at {{time}}',
        content: `Hi {{name}},

This is a friendly reminder about your interview tomorrow:

📅 Date: {{date}}
🕐 Time: {{time}} ({{timezone}})
⏱️ Duration: {{duration}} minutes
💻 Join Link: {{vc_link}}
👥 Interviewer(s): {{interviewers}}

Please join 5 minutes early and ensure you have a stable internet connection.

Best regards,
{{company}} Team`,
        channels: [
          { type: 'email', enabled: true, status: 'pending', retry_count: 0 },
          { type: 'whatsapp', enabled: true, status: 'pending', retry_count: 0 }
        ],
        recipients: ['candidate', 'interviewer']
      },
      {
        id: 'reminder_1h',
        trigger: 't_1h',
        subject: 'Interview Starting Soon - {{time}}',
        content: `Hi {{name}},

Your interview starts in 1 hour:

🕐 {{time}}
💻 {{vc_link}}

Join 5 minutes early. Good luck! 🍀`,
        channels: [
          { type: 'whatsapp', enabled: true, status: 'pending', retry_count: 0 },
          { type: 'email', enabled: false, status: 'pending', retry_count: 0 }
        ],
        recipients: ['candidate', 'interviewer']
      },
      {
        id: 'join_retry',
        trigger: 'retry',
        subject: 'Interview Started - Please Join Now',
        content: `🚨 URGENT: Your interview has started!

Please join immediately:
💻 {{vc_link}}

The interviewer is waiting for you.`,
        channels: [
          { type: 'whatsapp', enabled: true, status: 'pending', retry_count: 0 },
          { type: 'email', enabled: true, status: 'pending', retry_count: 0 },
          { type: 'slack', enabled: true, status: 'pending', retry_count: 0 }
        ],
        recipients: ['candidate']
      },
      {
        id: 'escalation',
        trigger: 'escalation',
        subject: 'Interview Issue - Immediate Attention Required',
        content: `⚠️ ESCALATION: Interview requires immediate attention

Interview: {{job_title}} - {{candidate_name}}
Issue: {{issue_description}}
Time: {{time}}

Please review and take action immediately.`,
        channels: [
          { type: 'slack', enabled: true, status: 'pending', retry_count: 0 },
          { type: 'email', enabled: true, status: 'pending', retry_count: 0 }
        ],
        recipients: ['recruiter']
      }
    ];
    
    setMessageTemplates(templates);
  }, []);

  const sendMessage = async (template: MessageTemplate) => {
    const messageId = `msg-${Date.now()}`;
    
    // Update template status to sending
    setMessageTemplates(prev =>
      prev.map(t => 
        t.id === template.id 
          ? {
              ...t,
              channels: t.channels.map(c => 
                c.enabled ? { ...c, status: 'sending' as const } : c
              )
            }
          : t
      )
    );

    toast({
      title: "Sending Messages",
      description: `Delivering ${template.trigger.replace('t_', '')} reminders via multiple channels...`,
    });

    // Simulate channel-by-channel sending
    const enabledChannels = template.channels.filter(c => c.enabled);
    let successfulChannels = 0;

    for (const channel of enabledChannels) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Simulate success/failure rates
      const success = Math.random() > 0.15; // 85% success rate
      const delivered = success && Math.random() > 0.2; // 80% delivery rate
      const read = delivered && Math.random() > 0.4; // 60% read rate

      const now = new Date().toISOString();
      
      setMessageTemplates(prev =>
        prev.map(t => 
          t.id === template.id
            ? {
                ...t,
                channels: t.channels.map(c => 
                  c.type === channel.type && c.enabled
                    ? {
                        ...c,
                        status: success ? (read ? 'read' : delivered ? 'delivered' : 'sent') : 'failed',
                        sent_at: success ? now : undefined,
                        delivered_at: delivered ? now : undefined,
                        read_at: read ? now : undefined,
                        error_message: success ? undefined : `${channel.type} delivery failed`,
                        retry_count: success ? c.retry_count : c.retry_count + 1
                      }
                    : c
                )
              }
            : t
        )
      );

      if (success) successfulChannels++;
    }

    // Log communication attempt
    const logEntry: CommunicationLog = {
      id: messageId,
      interview_id: interview.id,
      message_id: template.id,
      timestamp: new Date().toISOString(),
      trigger: template.trigger,
      status: successfulChannels === enabledChannels.length ? 'success' : 
              successfulChannels > 0 ? 'partial' : 'failed',
      channels_attempted: enabledChannels.length,
      channels_successful: successfulChannels,
      escalated: successfulChannels === 0 && template.trigger !== 'escalation'
    };

    setCommunicationLogs(prev => [logEntry, ...prev]);

    // Handle escalation if all channels failed
    if (successfulChannels === 0 && template.trigger !== 'escalation') {
      setTimeout(() => {
        const escalationTemplate = messageTemplates.find(t => t.id === 'escalation');
        if (escalationTemplate) {
          sendMessage(escalationTemplate);
        }
      }, 2000);
    }

    const resultMessage = successfulChannels === enabledChannels.length 
      ? `All ${enabledChannels.length} channels delivered successfully`
      : successfulChannels > 0
      ? `${successfulChannels}/${enabledChannels.length} channels delivered`
      : "All channels failed - escalating to recruiter";

    toast({
      title: successfulChannels > 0 ? "Messages Sent" : "Delivery Failed",
      description: resultMessage,
      variant: successfulChannels === 0 ? "destructive" : "default"
    });
  };

  const scheduleReminder = (trigger: MessageTemplate['trigger'], delayMs: number) => {
    const template = messageTemplates.find(t => t.trigger === trigger);
    if (!template) return;

    setActiveReminders(prev => [...prev, trigger]);
    
    setTimeout(() => {
      sendMessage(template);
      setActiveReminders(prev => prev.filter(r => r !== trigger));
    }, delayMs);

    toast({
      title: "Reminder Scheduled",
      description: `${trigger.replace('t_', '')} reminder scheduled for ${new Date(Date.now() + delayMs).toLocaleTimeString()}`,
    });
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'whatsapp': return MessageSquare;
      case 'slack': return Bell;
      default: return Mail;
    }
  };

  const getStatusBadge = (status: MessageChannel['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      sending: { variant: 'default' as const, label: 'Sending' },
      sent: { variant: 'default' as const, label: 'Sent' },
      delivered: { variant: 'default' as const, label: 'Delivered' },
      read: { variant: 'outline' as const, label: 'Read' },
      failed: { variant: 'destructive' as const, label: 'Failed' }
    };
    return variants[status] || variants.pending;
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Communication Center
          </CardTitle>
          <CardDescription>
            Multi-channel messaging with delivery tracking and escalation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => scheduleReminder('t_24h', 1000)}
              disabled={activeReminders.includes('t_24h')}
            >
              <Clock className="h-4 w-4 mr-2" />
              24h Reminder
            </Button>
            
            <Button
              variant="outline"
              onClick={() => scheduleReminder('t_1h', 500)}
              disabled={activeReminders.includes('t_1h')}
            >
              <Clock className="h-4 w-4 mr-2" />
              1h Reminder
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const retryTemplate = messageTemplates.find(t => t.id === 'join_retry');
                if (retryTemplate) sendMessage(retryTemplate);
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Join Retry
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const escalationTemplate = messageTemplates.find(t => t.id === 'escalation');
                if (escalationTemplate) sendMessage(escalationTemplate);
              }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Escalate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Communication Log */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Log</CardTitle>
          <CardDescription>
            Real-time delivery tracking across all channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communicationLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No messages sent yet. Click the buttons above to test communication flows.
              </div>
            ) : (
              communicationLogs.map((log) => {
                const template = messageTemplates.find(t => t.id === log.message_id);
                if (!template) return null;

                return (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{template.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()} • {log.trigger.replace('t_', '')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={log.status === 'success' ? 'default' : log.status === 'partial' ? 'secondary' : 'destructive'}>
                          {log.channels_successful}/{log.channels_attempted} delivered
                        </Badge>
                        {log.escalated && (
                          <Badge variant="destructive">Escalated</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {template.channels.map((channel, idx) => {
                        if (!channel.enabled) return null;
                        const Icon = getChannelIcon(channel.type);
                        const statusBadge = getStatusBadge(channel.status);
                        
                        return (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                            <Icon className="h-4 w-4" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium capitalize">{channel.type}</div>
                              <Badge variant={statusBadge.variant} className="text-xs">
                                {statusBadge.label}
                              </Badge>
                            </div>
                            {channel.read_at && <Eye className="h-3 w-3 text-success" />}
                            {channel.status === 'failed' && <AlertTriangle className="h-3 w-3 text-error" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiChannelMessaging;