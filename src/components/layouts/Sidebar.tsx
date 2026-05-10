import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Home, BookOpen, TrendingUp, PenTool, Scale, Library, HelpCircle, MessageSquare, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

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
    <aside className={`hidden lg:block border-r border-sidebar-border bg-sidebar-background shrink-0 custom-scrollbar transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)] ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex flex-col h-full">
        <div className={`${isOpen ? 'p-6' : 'p-3'} border-b border-sidebar-border`}>
          <div className={`w-full flex items-center ${isOpen ? 'gap-3' : 'justify-center'} rounded-lg`}>
            <Link to="/dashboard" className={`flex items-center rounded-lg hover:bg-sidebar-accent/50 transition-colors ${isOpen ? 'gap-3 flex-1' : 'justify-center py-2'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Terminal className="w-6 h-6 text-background" />
              </div>
              {isOpen && (
                <h1 className="font-bold text-lg gradient-text text-left">AI Imaginarium</h1>
              )}
            </Link>
            {isOpen && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-sidebar-accent/50 transition-colors"
                aria-label="Close sidebar"
                title="Close sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            {!isOpen && (
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="p-1 rounded-md hover:bg-sidebar-accent/50 transition-colors ml-1"
                aria-label="Open sidebar"
                title="Open sidebar"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <nav className={`flex-1 overflow-y-auto custom-scrollbar ${isOpen ? 'p-4 space-y-1' : 'p-2 space-y-2'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-lg transition-all duration-300 group ${
                  isOpen ? 'gap-3 px-4 py-3' : 'justify-center px-2 py-3'
                } ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-primary/30 shadow-lg shadow-primary/10'
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground hover:border hover:border-primary/20'
                }`}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                }`} />
                {isOpen && (
                  <span className={`font-medium text-sm ${
                    isActive ? 'text-primary' : 'group-hover:text-foreground'
                  }`}>
                    {item.name}
                  </span>
                )}
                {isOpen && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {isOpen && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
              <p className="text-xs font-semibold text-primary mb-1">💡 Pro Tip</p>
              <p className="text-xs text-muted-foreground">
                Use the Playground to test your prompts with real-time feedback
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
