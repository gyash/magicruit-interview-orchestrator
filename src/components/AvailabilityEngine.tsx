import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

interface AvailabilityCheck {
  interviewer_email: string;
  interviewer_name: string;
  calendar_provider: 'google' | 'outlook';
  availability_score: number; // 0-100
  busy_slots: string[];
  free_slots: string[];
  last_synced: string;
  conflict_count: number;
}

interface AvailabilityEngineProps {
  interviewers: string[];
  duration_mins: number;
  onAvailabilityUpdated: (availability: AvailabilityCheck[]) => void;
}

const AvailabilityEngine = ({ interviewers, duration_mins, onAvailabilityUpdated }: AvailabilityEngineProps) => {
  const [availability, setAvailability] = useState<AvailabilityCheck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Mock calendar availability check - simulates real Google/Outlook API
  const fetchAvailability = async (): Promise<AvailabilityCheck[]> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAvailability: AvailabilityCheck[] = interviewers.map((email, index) => {
      const name = email.split('@')[0].replace('.', ' ').split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      // Generate realistic availability data
      const availabilityScore = Math.floor(Math.random() * 40) + 60; // 60-100%
      const conflictCount = Math.floor(Math.random() * 3);
      
      // Generate mock busy/free slots for next 5 days
      const busySlots = [];
      const freeSlots = [];
      
      for (let day = 0; day < 5; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Mock some busy slots
        if (Math.random() > 0.7) {
          busySlots.push(`${dateStr} 10:00-11:00`);
        } else {
          freeSlots.push(`${dateStr} 10:00-11:00`);
        }
        
        if (Math.random() > 0.6) {
          busySlots.push(`${dateStr} 14:00-15:00`);
        } else {
          freeSlots.push(`${dateStr} 14:00-15:00`);
        }
        
        if (Math.random() > 0.8) {
          busySlots.push(`${dateStr} 16:00-17:00`);
        } else {
          freeSlots.push(`${dateStr} 16:00-17:00`);
        }
      }
      
      return {
        interviewer_email: email,
        interviewer_name: name,
        calendar_provider: Math.random() > 0.5 ? 'google' : 'outlook',
        availability_score: availabilityScore,
        busy_slots: busySlots,
        free_slots: freeSlots,
        last_synced: new Date().toISOString(),
        conflict_count: conflictCount
      };
    });
    
    setIsLoading(false);
    return mockAvailability;
  };

  const handleRefreshAvailability = async () => {
    const newAvailability = await fetchAvailability();
    setAvailability(newAvailability);
    setLastUpdated(new Date().toLocaleString());
    onAvailabilityUpdated(newAvailability);
  };

  useEffect(() => {
    if (interviewers.length > 0) {
      handleRefreshAvailability();
    }
  }, [interviewers]);

  const getAvailabilityColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getAvailabilityBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'High' };
    if (score >= 60) return { variant: 'secondary' as const, label: 'Medium' };
    return { variant: 'destructive' as const, label: 'Low' };
  };

  const overallAvailability = availability.length > 0 
    ? Math.round(availability.reduce((sum, item) => sum + item.availability_score, 0) / availability.length)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Real-time Availability Engine
        </CardTitle>
        <CardDescription>
          Live calendar sync with Google Calendar and Outlook integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium">Panel Availability</div>
              <div className="text-sm text-muted-foreground">
                Based on {duration_mins}-minute interview duration
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAvailability}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Score</span>
                <span className={getAvailabilityColor(overallAvailability)}>
                  {overallAvailability}%
                </span>
              </div>
              <Progress value={overallAvailability} className="h-2" />
            </div>
            <Badge {...getAvailabilityBadge(overallAvailability)}>
              {getAvailabilityBadge(overallAvailability).label}
            </Badge>
          </div>
        </div>

        {/* Individual Availability */}
        <div className="space-y-3">
          <div className="font-medium text-sm">Individual Calendar Status</div>
          
          {availability.map((person) => {
            const badge = getAvailabilityBadge(person.availability_score);
            
            return (
              <div key={person.interviewer_email} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-sm">{person.interviewer_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {person.interviewer_email}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {person.calendar_provider}
                    </Badge>
                    <Badge variant={badge.variant} className="text-xs">
                      {badge.label}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Availability Score</span>
                    <span className={getAvailabilityColor(person.availability_score)}>
                      {person.availability_score}%
                    </span>
                  </div>
                  <Progress value={person.availability_score} className="h-1" />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Free Slots: {person.free_slots.length}</span>
                    <span>Conflicts: {person.conflict_count}</span>
                  </div>
                </div>
                
                {person.conflict_count > 0 && (
                  <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded text-xs">
                    <div className="flex items-center gap-1 text-warning">
                      <AlertTriangle className="h-3 w-3" />
                      {person.conflict_count} scheduling conflicts detected
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sync Status */}
        {lastUpdated && (
          <div className="text-xs text-muted-foreground text-center">
            Last synced: {lastUpdated}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Syncing calendars...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilityEngine;