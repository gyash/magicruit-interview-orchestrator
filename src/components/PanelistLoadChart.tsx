import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertTriangle, Users } from "lucide-react";
import { mockInterviewers } from "@/lib/mockData";

const PanelistLoadChart = () => {
  // Generate mock load data
  const loadData = mockInterviewers.map(interviewer => ({
    name: interviewer.name.split(' ')[0], // First name only
    thisWeek: Math.floor(Math.random() * 15) + 2,
    lastWeek: Math.floor(Math.random() * 12) + 1,
    maxCapacity: 12
  }));

  const getLoadStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return { color: "error", status: "Overloaded" };
    if (percentage >= 70) return { color: "warning", status: "High" };
    if (percentage >= 40) return { color: "success", status: "Optimal" };
    return { color: "muted", status: "Light" };
  };

  return (
    <div className="space-y-6">
      {/* Load Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Panelist Interview Load
          </CardTitle>
          <CardDescription>
            Weekly interview distribution across your panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loadData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-brand-primary">
                            This week: {payload[0].value} interviews
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Last week: {payload[1].value} interviews
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="thisWeek" 
                  fill="hsl(var(--brand-primary))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="lastWeek" 
                  fill="hsl(var(--muted))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Load Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Individual Load Status
          </CardTitle>
          <CardDescription>
            Current workload and capacity for each panelist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadData.map((data, index) => {
              const interviewer = mockInterviewers[index];
              const loadStatus = getLoadStatus(data.thisWeek, data.maxCapacity);
              const percentage = (data.thisWeek / data.maxCapacity) * 100;
              
              return (
                <div key={interviewer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{interviewer.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {interviewer.role} • {interviewer.department}
                        </p>
                      </div>
                      <Badge 
                        variant={loadStatus.color === "error" ? "destructive" : 
                                loadStatus.color === "warning" ? "secondary" : "outline"}
                      >
                        {loadStatus.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>This week: {data.thisWeek}/{data.maxCapacity} interviews</span>
                        <span>{Math.round(percentage)}% capacity</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Last week: {data.lastWeek}</span>
                      <span className="flex items-center gap-1">
                        {data.thisWeek > data.lastWeek ? (
                          <>
                            <TrendingUp className="h-3 w-3 text-warning" />
                            +{data.thisWeek - data.lastWeek}
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-3 w-3 text-success rotate-180" />
                            -{data.lastWeek - data.thisWeek}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  {percentage >= 90 && (
                    <AlertTriangle className="h-5 w-5 text-error ml-4" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PanelistLoadChart;