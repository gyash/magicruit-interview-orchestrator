import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, RotateCcw, Clock, Users, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RescheduleFlowProps {
  interview: any;
  isOpen: boolean;
  onClose: () => void;
}

const RescheduleFlow = ({ interview, isOpen, onClose }: RescheduleFlowProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const rescheduleReasons = [
    "Interviewer unavailable",
    "Candidate requested change",
    "Technical issues",
    "Scheduling conflict",
    "No-show",
    "Other"
  ];

  const mockNewSlots = [
    { id: "1", date: "Tomorrow", time: "2:00 PM", available: true },
    { id: "2", date: "Jan 16", time: "10:00 AM", available: true },
    { id: "3", date: "Jan 16", time: "3:00 PM", available: false },
    { id: "4", date: "Jan 17", time: "11:00 AM", available: true },
    { id: "5", date: "Jan 17", time: "4:00 PM", available: true },
  ];

  const handleReschedule = async () => {
    if (!rescheduleReason || !selectedSlot) return;

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    
    toast({
      title: "Interview Rescheduled Successfully",
      description: "All participants have been notified of the new time.",
    });
    
    onClose();
    setStep(1);
    setRescheduleReason("");
    setSelectedSlot("");
  };

  const availableSlots = mockNewSlots.filter(slot => slot.available);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-warning" />
            Reschedule Interview
          </DialogTitle>
          <DialogDescription>
            Handle interview rescheduling with automated fallback options
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="font-medium">Interview Needs Rescheduling</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This interview was flagged for rescheduling. Please select a reason and we'll find new available slots.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reschedule Reason</Label>
              <Select value={rescheduleReason} onValueChange={setRescheduleReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason for rescheduling" />
                </SelectTrigger>
                <SelectContent>
                  {rescheduleReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {rescheduleReason === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Please specify</Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Describe the reason for rescheduling..."
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={!rescheduleReason}
              >
                Find New Slots
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-brand-primary" />
                <span className="font-medium">Alternative Slots Found</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on panelist availability, here are the next available slots:
              </p>
            </div>

            <div className="space-y-2">
              <Label>Select New Time Slot</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedSlot === slot.id
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{slot.date}</div>
                        <div className="text-sm text-muted-foreground">{slot.time}</div>
                      </div>
                      <Badge variant="outline">Available</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {availableSlots.length === 0 && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <X className="h-4 w-4 text-error" />
                  <span className="font-medium">No Available Slots This Week</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  All panelists are fully booked. Manual intervention required.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Notify Recruiter
                </Button>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!selectedSlot}
              >
                Preview Changes
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-3">Reschedule Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason:</span>
                  <span>{rescheduleReason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New Time:</span>
                  <span>{availableSlots.find(s => s.id === selectedSlot)?.date} at {availableSlots.find(s => s.id === selectedSlot)?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Notifications:</span>
                  <span>All participants</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-medium mb-2">Automated Actions</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Cancel existing calendar invites</li>
                <li>✓ Send new calendar invites to all participants</li>
                <li>✓ Notify candidate of schedule change</li>
                <li>✓ Update ATS with new interview time</li>
                <li>✓ Log reschedule reason and timestamp</li>
              </ul>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                onClick={handleReschedule}
                disabled={isProcessing}
                className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Confirm Reschedule
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleFlow;