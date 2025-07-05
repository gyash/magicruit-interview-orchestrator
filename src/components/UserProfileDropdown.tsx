import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  Settings,
  LogOut,
  UserCircle,
  Shield,
  Building,
  Clock,
  Mail,
  Phone
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function UserProfileDropdown() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role?: string) => {
    if (!role) return "User";
    return role.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  // Mock additional profile data
  const mockProfileData = {
    company: "TechCorp Inc.",
    timezone: "PST (UTC-8)",
    phone: "+1 (555) 123-4567",
    joinDate: "January 2024",
    lastLogin: "2 hours ago"
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">
                {profile?.full_name || "Demo User"}
              </div>
              <div className="text-xs text-muted-foreground">
                {getRoleDisplay(profile?.role)}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-64 bg-background border shadow-lg z-50"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {profile?.full_name || "Demo User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {profile?.email || "demo@magicruit.com"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {getRoleDisplay(profile?.role)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setShowProfile(true)}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Details Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Profile Details
            </DialogTitle>
            <DialogDescription>
              Your account information and settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {profile?.full_name || "Demo User"}
                </h3>
                <Badge variant="secondary" className="mt-1">
                  {getRoleDisplay(profile?.role)}
                </Badge>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">
                      {profile?.email || "demo@magicruit.com"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Company</div>
                    <div className="text-sm text-muted-foreground">
                      {mockProfileData.company}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">
                      {profile?.phone || mockProfileData.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Timezone</div>
                    <div className="text-sm text-muted-foreground">
                      {mockProfileData.timezone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Department</div>
                    <div className="text-sm text-muted-foreground">
                      {profile?.department || "Human Resources"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Account Information</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>Member since: {mockProfileData.joinDate}</div>
                  <div>Last login: {mockProfileData.lastLogin}</div>
                  <div>Status: <Badge variant="outline" className="ml-1">Active</Badge></div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}