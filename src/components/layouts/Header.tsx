import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Terminal, Menu, User, LogOut, Shield, Home, BookOpen, TrendingUp, PenTool, Scale, Gamepad2, Library, HelpCircle, MessageSquare, Trophy } from 'lucide-react';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10 hover:text-primary transition-colors">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-sidebar-background border-sidebar-border">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <Terminal className="w-5 h-5 text-background" />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:inline">
              AI Imaginarium
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Score:</span>
            <span className="text-sm font-bold text-primary">{profile?.progress_score || 0}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="h-4 w-4 text-background" />
                </div>
                <span className="hidden sm:inline font-medium">{profile?.username || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-foreground">{profile?.username}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Score: {profile?.progress_score || 0}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex items-center hover:bg-primary/10 hover:text-primary transition-colors">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              {profile?.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer flex items-center hover:bg-accent/10 hover:text-accent transition-colors">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Prompt Basics', path: '/learn/basics', icon: BookOpen },
    { name: 'Prompting Levels', path: '/learn/levels', icon: TrendingUp },
    { name: 'Writing Guide', path: '/learn/guide', icon: PenTool },
    { name: 'Good vs Bad', path: '/learn/comparison', icon: Scale },
    { name: 'Playground', path: '/playground', icon: Terminal },
    { name: 'Prompt Library', path: '/library', icon: Library },
    { name: 'Quizzes', path: '/quizzes', icon: HelpCircle },
    { name: 'Community', path: '/forum', icon: MessageSquare },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
  ];

  return (
    <div className="flex flex-col h-full bg-sidebar-background">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Terminal className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="font-bold gradient-text">AI Imaginarium</h1>
            <p className="text-xs text-muted-foreground">Prompt Lab</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-primary/30'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
