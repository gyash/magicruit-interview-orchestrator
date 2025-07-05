import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Users, BarChart3, Settings, ArrowRight, CheckCircle } from "lucide-react";

interface WelcomeProps {
  onGetStarted?: () => void;
}

const EmptyStateWelcome = ({ onGetStarted }: WelcomeProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full border border-brand-primary/20">
          <Sparkles className="h-4 w-4 text-brand-primary" />
          <span className="text-sm font-medium text-brand-primary">Welcome to MagicRuit AI</span>
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight">
          Your Interview Coordination Just Got{" "}
          <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Magical ✨
          </span>
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stop spending hours on scheduling conflicts and manual coordination. 
          Let our AI handle the heavy lifting while you focus on finding great talent.
        </p>
      </div>

      {/* Quick Start Guide */}
      <Card className="border-2 border-dashed border-brand-primary/20 bg-gradient-to-br from-brand-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            Get up and running in under 5 minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <div className="font-medium">Connect Your Calendar</div>
                  <div className="text-sm text-muted-foreground">Sync Google Calendar or Outlook</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <div className="font-medium">Create Your First Workflow</div>
                  <div className="text-sm text-muted-foreground">Define interview stages</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                <div className="w-6 h-6 rounded-full bg-warning text-white flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <div className="font-medium">Schedule Your First Interview</div>
                  <div className="text-sm text-muted-foreground">Let AI find the perfect time</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <div className="font-medium">Track & Optimize</div>
                  <div className="text-sm text-muted-foreground">Monitor your ROI in analytics</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
              onClick={onGetStarted}
            >
              Get Started Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mb-4">
              <Calendar className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Save 12+ Hours/Week</h3>
            <p className="text-sm text-muted-foreground">
              Eliminate back-and-forth emails and manual calendar checking
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/10 rounded-lg mb-4">
              <Users className="h-6 w-6 text-brand-primary" />
            </div>
            <h3 className="font-semibold mb-2">Better Candidate Experience</h3>
            <p className="text-sm text-muted-foreground">
              Professional scheduling creates positive first impressions
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg mb-4">
              <BarChart3 className="h-6 w-6 text-warning" />
            </div>
            <h3 className="font-semibold mb-2">Track Your ROI</h3>
            <p className="text-sm text-muted-foreground">
              See exactly how much time and money you're saving
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Success Metrics */}
      <Card className="bg-gradient-to-r from-success/5 to-brand-primary/5">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Join 500+ Companies Already Saving Time</h3>
            <p className="text-muted-foreground">
              Our customers report these results within their first month:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">85%</div>
              <div className="text-sm text-muted-foreground">Time Savings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-primary">96%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">40%</div>
              <div className="text-sm text-muted-foreground">Cost Reduction</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">4.8/5</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyStateWelcome;