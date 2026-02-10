import { Link, useLocation } from 'react-router-dom';
import { Terminal, Home, BookOpen, TrendingUp, PenTool, Scale, Gamepad2, Library, HelpCircle, MessageSquare, Trophy } from 'lucide-react';

export default function Sidebar() {
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
    <aside className="hidden lg:block w-64 border-r border-sidebar-border bg-sidebar-background shrink-0 custom-scrollbar">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <Terminal className="w-6 h-6 text-background" />
            </div>
            <div>
              <h1 className="font-bold text-lg gradient-text">AI Imaginarium</h1>
              <p className="text-xs text-muted-foreground">Prompt Lab</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-primary/30 shadow-lg shadow-primary/10'
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground hover:border hover:border-primary/20'
                }`}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                }`} />
                <span className={`font-medium text-sm ${
                  isActive ? 'text-primary' : 'group-hover:text-foreground'
                }`}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
            <p className="text-xs font-semibold text-primary mb-1">💡 Pro Tip</p>
            <p className="text-xs text-muted-foreground">
              Use the Playground to test your prompts with real-time feedback
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
