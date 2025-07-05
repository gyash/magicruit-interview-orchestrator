import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Calendar, 
  Settings, 
  BarChart3, 
  Users, 
  Clock,
  Bell,
  Workflow,
  Home,
  Sparkles
} from "lucide-react";
import magicRuitLogo from "@/assets/magicruit-logo.png";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, description: "Overview & insights" },
  { name: "Schedule", href: "/schedule", icon: Calendar, description: "AI-powered scheduling" },
  { name: "Interviews", href: "/interviews", icon: Users, description: "Manage all interviews" },
  { name: "Workflow Builder", href: "/workflow", icon: Workflow, description: "Create processes" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, description: "Performance metrics" },
  { name: "Settings", href: "/settings", icon: Settings, description: "System configuration" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img 
                src={magicRuitLogo} 
                alt="MagicRuit Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                MagicRuit
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                AI-Powered
              </Badge>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              
              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="flex flex-col gap-4 py-4">
                    <div className="px-3 py-2 border-b">
                      <h3 className="font-semibold">Navigation</h3>
                      <p className="text-sm text-muted-foreground">Access all your tools</p>
                    </div>
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-start gap-3 px-3 py-3 rounded-md text-sm transition-colors ${
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4 mt-0.5" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-70">{item.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img 
                src={magicRuitLogo} 
                alt="MagicRuit Logo" 
                className="h-5 w-5 object-contain"
              />
              <span>MagicRuit - AI-Powered Interview Coordination</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Made with ❤️ for HR teams</span>
              <Badge variant="outline" className="text-xs">
                v2.1.0
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}