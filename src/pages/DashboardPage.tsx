import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getUserProgress, getUserAchievements } from '@/db/api';
import type { UserProgress, UserAchievement } from '@/types';
import { Terminal, BookOpen, TrendingUp, PenTool, Scale, Library, Trophy, MessageSquare, Zap, ArrowRight, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!profile) return;

      try {
        const [progressData, achievementsData] = await Promise.all([
          getUserProgress(profile.id),
          getUserAchievements(profile.id),
        ]);
        setProgress(progressData);
        setAchievements(achievementsData);
        
        // Check if this is the first login (no progress and no achievements yet)
        // Or check if account was created very recently (within last 5 minutes)
        const accountAge = profile.created_at ? new Date().getTime() - new Date(profile.created_at).getTime() : Infinity;
        const isNewAccount = accountAge < 5 * 60 * 1000; // 5 minutes
        const hasNoActivity = progressData.length === 0 && achievementsData.length === 0;
        
        setIsFirstLogin(isNewAccount || hasNoActivity);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [profile]);

  const totalModules = 5;
  const completedModules = progress.filter((p) => p.completed).length;
  const progressPercentage = (completedModules / totalModules) * 100;

  const learningModules = [
    {
      title: 'Prompt Basics',
      description: 'Learn the fundamentals of AI prompting',
      path: '/learn/basics',
      icon: BookOpen,
      gradient: 'from-primary to-secondary',
    },
    {
      title: 'Prompting Levels',
      description: 'Progress from basic to advanced techniques',
      path: '/learn/levels',
      icon: TrendingUp,
      gradient: 'from-secondary to-accent',
    },
    {
      title: 'Writing Guide',
      description: 'Master the 4-step prompt formula',
      path: '/learn/guide',
      icon: PenTool,
      gradient: 'from-accent to-primary',
    },
    {
      title: 'Good vs Bad',
      description: 'Compare effective and ineffective prompts',
      path: '/learn/comparison',
      icon: Scale,
      gradient: 'from-chart-3 to-chart-4',
    },
  ];

  const quickActions = [
    {
      title: 'Playground',
      description: 'Test prompts with AI feedback',
      path: '/playground',
      icon: Terminal,
      color: 'primary',
    },
    {
      title: 'Prompt Library',
      description: 'Browse ready-made prompts',
      path: '/library',
      icon: Library,
      color: 'secondary',
    },
    {
      title: 'Community',
      description: 'Join discussions',
      path: '/forum',
      icon: MessageSquare,
      color: 'accent',
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-8 fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Sparkles className="w-8 h-8 text-background" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                  {isFirstLogin ? `Welcome, ${profile?.username}!` : `Welcome back, ${profile?.username}!`}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isFirstLogin ? 'Begin your journey to master AI prompting' : 'Ready to master AI prompting?'}
                </p>
              </div>
            </div>
            <p className="text-lg text-foreground/90 max-w-3xl leading-relaxed">
              Master the art of AI prompting through structured learning, interactive practice,
              and community engagement. Your journey to becoming a prompt expert continues here.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-glow border-primary/20">
            <CardHeader className="pb-3">
              <CardDescription>Total Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <span className="text-4xl font-bold gradient-text">{profile?.progress_score || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow border-secondary/20">
            <CardHeader className="pb-3">
              <CardDescription>Modules Completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-4xl font-bold text-secondary">{completedModules}/{totalModules}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow border-accent/20">
            <CardHeader className="pb-3">
              <CardDescription>Achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <span className="text-4xl font-bold text-accent">{achievements.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="card-glow border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Your Learning Progress
                </CardTitle>
                <CardDescription className="mt-2">
                  Track your journey through the modules
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                {progressPercentage.toFixed(0)}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Progress value={progressPercentage} className="h-4" />
              <div 
                className="absolute top-0 left-0 h-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {completedModules === totalModules
                ? '🎉 Congratulations! You\'ve completed all modules!'
                : `Keep going! ${totalModules - completedModules} module${totalModules - completedModules !== 1 ? 's' : ''} remaining.`}
            </p>
          </CardContent>
        </Card>

        {/* Learning Modules */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-background" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Learning Modules</h2>
              <p className="text-sm text-muted-foreground">Start your prompt mastery journey</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {learningModules.map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.path} className="card-glow group">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${module.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-background" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {module.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {module.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full neon-button bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary">
                      <Link to={module.path} className="flex items-center justify-center gap-2">
                        Start Learning
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-background" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
              <p className="text-sm text-muted-foreground">Jump into practice and community</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.path} className="card-glow group">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`w-16 h-16 bg-${action.color}/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-8 h-8 text-${action.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {action.description}
                        </p>
                      </div>
                      <Button asChild variant="outline" className="w-full border-border hover:border-primary/50 hover:bg-primary/5">
                        <Link to={action.path}>
                          Go to {action.title}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <Card className="card-glow border-accent/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Recent Achievements
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="hover:text-primary">
                  <Link to="/achievements">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border hover:border-accent/30 transition-colors">
                    <span className="text-4xl">{achievement.achievement?.badge_icon}</span>
                    <div>
                      <p className="font-medium text-sm">{achievement.achievement?.name}</p>
                      <p className="text-xs text-muted-foreground">Recently earned</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
