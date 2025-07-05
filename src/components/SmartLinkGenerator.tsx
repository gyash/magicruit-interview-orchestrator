import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, Users, Link, CheckCircle, Zap } from "lucide-react";
import { InterviewSlot, SmartLink } from "@/types/interview";
import { useToast } from "@/hooks/use-toast";

interface SmartLinkGeneratorProps {
  interview: any;
  onLinkGenerated: (link: SmartLink) => void;
}

const SmartLinkGenerator = ({ interview, onLinkGenerated }: SmartLinkGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedSlots, setGeneratedSlots] = useState<InterviewSlot[]>([]);

  // Mock availability engine - simulates real calendar API integration
  const generateOptimalSlots = async (): Promise<InterviewSlot[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    const slots: InterviewSlot[] = [];
    const baseDate = new Date();
    
    // Generate 5 optimal slots over next 3 days
    for (let day = 1; day <= 3; day++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + day);
      
      // Morning slot
      const morningSlot: InterviewSlot = {
        id: `slot-${day}-morning`,
        date: date.toISOString().split('T')[0],
        time: "10:00 AM",
        duration_mins: interview.duration_mins || 60,
        timezone: "EST",
        available_panelists: interview.interviewers,
        conflict_score: Math.random() * 0.3 // Low conflict
      };
      
      // Afternoon slot
      const afternoonSlot: InterviewSlot = {
        id: `slot-${day}-afternoon`,
        date: date.toISOString().split('T')[0],
        time: day === 1 ? "2:00 PM" : "3:00 PM",
        duration_mins: interview.duration_mins || 60,
        timezone: "EST", 
        available_panelists: interview.interviewers,
        conflict_score: Math.random() * 0.4
      };
      
      slots.push(morningSlot, afternoonSlot);
    }
    
    // Sort by conflict score (best slots first)
    return slots.sort((a, b) => a.conflict_score - b.conflict_score).slice(0, 5);
  };

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    
    try {
      // Step 1: Generate optimal slots
      const slots = await generateOptimalSlots();
      setGeneratedSlots(slots);
      
      // Step 2: Create smart link
      const smartLink: SmartLink = {
        id: `link-${Date.now()}`,
        interview_id: interview.id,
        candidate_id: interview.candidate_id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        slots: slots,
        confirmation_token: `token-${Date.now()}`
      };
      
      setIsGenerating(false);
      setShowPreview(true);
      onLinkGenerated(smartLink);
      
      toast({
        title: "Smart Link Generated Successfully!",
        description: `${slots.length} optimal time slots found. Link expires in 7 days.`,
      });
      
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "Unable to fetch availability. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Smart Link Generator
          </CardTitle>
          <CardDescription>
            Generate optimized scheduling links with AI-powered slot selection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Interview Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stage:</span>
                <span>{interview.stage_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>{interview.duration_mins || 60} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Panelists:</span>
                <span>{interview.interviewers?.length || 0} assigned</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerateLink}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
          >
            {isGenerating ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Availability...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Generate Smart Link
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Smart Link Generated Successfully
            </DialogTitle>
            <DialogDescription>
              Here are the optimal time slots found for the candidate
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="font-medium text-success mb-2">Link Preview</div>
              <div className="text-sm font-mono bg-muted p-2 rounded">
                https://magicruit.com/schedule/{generatedSlots[0]?.id || 'abc123'}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Available Time Slots</h4>
              <div className="grid gap-2">
                {generatedSlots.map((slot, index) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <div className="font-medium">
                          {new Date(slot.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">{slot.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        {slot.available_panelists.length} panelist(s)
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        slot.conflict_score < 0.2 ? 'bg-success' : 
                        slot.conflict_score < 0.4 ? 'bg-warning' : 'bg-error'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
              <h4 className="font-medium mb-2">Next Steps</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Smart link generated with 5 optimal slots</li>
                <li>✓ Calendar conflicts checked and minimized</li>
                <li>✓ Candidate will receive link via email & WhatsApp</li>
                <li>✓ Auto-booking triggers once slot is selected</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SmartLinkGenerator;