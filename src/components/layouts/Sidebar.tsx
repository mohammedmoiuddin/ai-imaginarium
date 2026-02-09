import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Prompt Basics', path: '/learn/basics', icon: '📚' },
    { name: 'Prompting Levels', path: '/learn/levels', icon: '📈' },
    { name: 'Writing Guide', path: '/learn/guide', icon: '✍️' },
    { name: 'Good vs Bad', path: '/learn/comparison', icon: '⚖️' },
    { name: 'Playground', path: '/playground', icon: '🎮' },
    { name: 'Prompt Library', path: '/library', icon: '📖' },
    { name: 'Quizzes', path: '/quizzes', icon: '❓' },
    { name: 'Community', path: '/forum', icon: '💬' },
    { name: 'Achievements', path: '/achievements', icon: '🏆' },
  ];

  return (
    <aside className="hidden lg:block w-64 border-r bg-sidebar-background shrink-0">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold gradient-text">AI Imaginarium</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
