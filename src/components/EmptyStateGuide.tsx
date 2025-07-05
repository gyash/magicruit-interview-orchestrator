import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateGuideProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionText: string;
  actionPath: string;
  tips?: string[];
}

export function EmptyStateGuide({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionPath, 
  tips 
}: EmptyStateGuideProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 bg-muted/50 rounded-full mb-4">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription className="text-center max-w-md mb-6">
          {description}
        </CardDescription>
        
        <Button 
          className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 mb-6"
          onClick={() => navigate(actionPath)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {actionText}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        
        {tips && tips.length > 0 && (
          <div className="w-full max-w-md">
            <div className="text-sm font-medium mb-3 text-left">💡 Getting Started Tips:</div>
            <div className="space-y-2 text-sm text-muted-foreground text-left">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}