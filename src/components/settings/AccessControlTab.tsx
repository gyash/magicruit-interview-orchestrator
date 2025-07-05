import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";

interface AccessControlTabProps {
  accessControl: any;
  setAccessControl: (accessControl: any) => void;
}

export function AccessControlTab({ accessControl, setAccessControl }: AccessControlTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role-Based Access Control
        </CardTitle>
        <CardDescription>
          Define permissions for different user roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(accessControl).map(([role, permissions]) => (
            <div key={role} className="p-4 border rounded-lg">
              <div className="font-medium mb-4 capitalize">
                {role.replace('_permissions', '').replace('_', ' ')} Permissions
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(permissions as Record<string, boolean>).map(([permission, enabled]) => (
                  <div key={permission} className="flex items-center justify-between">
                    <Label className="text-sm capitalize">
                      {permission.replace('_', ' ')}
                    </Label>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => {
                        setAccessControl((prev: any) => ({
                          ...prev,
                          [role]: {
                            ...prev[role as keyof typeof prev],
                            [permission]: checked
                          }
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}