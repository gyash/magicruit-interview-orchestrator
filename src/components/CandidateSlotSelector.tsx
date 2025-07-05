import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, Users, CheckCircle, AlertCircle, Video } from "lucide-react";
import { InterviewSlot, SmartLink } from "@/types/interview";
import { useToast } from "@/hooks/use-toast";

interface CandidateSlotSelectorProps {
  smartLink: SmartLink;
  candidateName: string;
  jobTitle: string;
  onSlotConfirmed: (slotId: string) => void;
}

const CandidateSlotSelector = ({ smartLink, candidateName, jobTitle, onSlotConfirmed }: CandidateSlotSelectorProps) => {
  const { toast } = useToast();
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const selectedSlot = smartLink.slots.find(slot => slot.id === selectedSlotId);
  const isExpired = new Date() > new Date(smartLink.expires_at);

  const handleSlotSelection = (slotId: string) => {
    if (isExpired) {
      toast({
        title: "Link Expired",
        description: "This scheduling link has expired. Please contact the recruiter.",
        variant: "destructive"
      });
      return;
    }
    setSelectedSlotId(slotId);
  };

  const handleConfirmSlot = async () => {
    if (!selectedSlotId) return;
    
    setIsConfirming(true);
    
    try {
      // Simulate slot confirmation API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSlotConfirmed(selectedSlotId);
      setShowConfirmation(true);
      
      toast({
        title: "Interview Scheduled Successfully!",
        description: "Calendar invite and video link will be sent shortly.",
      });
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to confirm slot. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const formatDate = (dateString: string, time: string) => {
    const date = new Date(dateString);
    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      shortDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: time
    };
  };

  if (isExpired) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-error mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Scheduling Link Expired</h3>
              <p className="text-muted-foreground">
                This scheduling link expired on {new Date(smartLink.expires_at).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline">
              Contact Recruiter
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Hi {candidateName}! 👋
            </CardTitle>
            <CardDescription className="text-center">
              Please select your preferred time for the <strong>{jobTitle}</strong> interview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Interview Stage:</span>
                <Badge variant="outline">Stage 1</Badge>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Duration:</span>
                <span>{smartLink.slots[0]?.duration_mins || 60} minutes</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Interview Mode:</span>
                <div className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  <span>Video Call</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slot Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Available Time Slots
            </CardTitle>
            <CardDescription>
              All times shown in your local timezone. Select your preferred slot below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {smartLink.slots.map((slot) => {
                const dateInfo = formatDate(slot.date, slot.time);
                const isSelected = selectedSlotId === slot.id;
                
                return (
                  <div
                    key={slot.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'hover:bg-muted/50 border-border'
                    }`}
                    onClick={() => handleSlotSelection(slot.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground">
                            {dateInfo.dayName}
                          </div>
                          <div className="text-lg font-semibold">
                            {dateInfo.shortDate}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-lg">
                            {dateInfo.time}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {slot.duration_mins} minutes
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm">
                          <div className="text-muted-foreground">Panel Available</div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{slot.available_panelists.length} members</span>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-brand-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {selectedSlotId && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Selected Time:</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedSlot && formatDate(selectedSlot.date, selectedSlot.time).fullDate} at {selectedSlot?.time}
                    </div>
                  </div>
                  <Button 
                    onClick={handleConfirmSlot}
                    disabled={isConfirming}
                    className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
                  >
                    {isConfirming ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Interview
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                Need to reschedule or have questions?
              </div>
              <Button variant="outline" size="sm">
                Contact Recruiter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Interview Confirmed!
            </DialogTitle>
            <DialogDescription>
              Your interview has been successfully scheduled
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedSlot && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="font-medium mb-2">Interview Details:</div>
                <div className="space-y-1 text-sm">
                  <div>📅 {formatDate(selectedSlot.date, selectedSlot.time).fullDate}</div>
                  <div>🕐 {selectedSlot.time} ({selectedSlot.duration_mins} minutes)</div>
                  <div>👥 {selectedSlot.available_panelists.length} interviewer(s)</div>
                  <div>💻 Video call link will be shared via email</div>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-medium mb-2">What happens next?</div>
              <ul className="text-sm space-y-1">
                <li>✓ Calendar invite sent to your email</li>
                <li>✓ Video call link included in the invite</li>
                <li>✓ Reminder notifications 24h and 1h before</li>
                <li>✓ Interview panel has been notified</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CandidateSlotSelector;