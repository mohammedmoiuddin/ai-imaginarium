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
import { Sparkles, BookOpen, Target, Trophy, MessageSquare } from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

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
      icon: '📚',
      color: 'bg-chart-1',
    },
    {
      title: 'Prompting Levels',
      description: 'Progress from basic to advanced techniques',
      path: '/learn/levels',
      icon: '📈',
      color: 'bg-chart-2',
    },
    {
      title: 'Writing Guide',
      description: 'Master the art of prompt writing',
      path: '/learn/guide',
      icon: '✍️',
      color: 'bg-chart-3',
    },
    {
      title: 'Good vs Bad',
      description: 'Compare effective and ineffective prompts',
      path: '/learn/comparison',
      icon: '⚖️',
      color: 'bg-chart-4',
    },
  ];

  const quickActions = [
    {
      title: 'Prompt Playground',
      description: 'Practice and get feedback',
      path: '/playground',
      icon: Target,
      color: 'text-primary',
    },
    {
      title: 'Prompt Library',
      description: 'Browse ready-made prompts',
      path: '/library',
      icon: BookOpen,
      color: 'text-secondary',
    },
    {
      title: 'Take a Quiz',
      description: 'Test your knowledge',
      path: '/quizzes',
      icon: Trophy,
      color: 'text-chart-3',
    },
    {
      title: 'Join Community',
      description: 'Share and discuss',
      path: '/forum',
      icon: MessageSquare,
      color: 'text-chart-4',
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
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, {profile?.username}!
              </h1>
            </div>
            <p className="text-lg opacity-90 max-w-2xl">
              Master the art of AI prompting through structured learning, interactive practice,
              and community engagement. Your journey to becoming a prompt expert starts here.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>
              Track your learning journey and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Modules Completed</span>
                <span className="text-muted-foreground">
                  {completedModules} / {totalModules}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {profile?.progress_score || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-secondary">
                  {achievements.length}
                </div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-chart-3">
                  {completedModules}
                </div>
                <div className="text-sm text-muted-foreground">Modules Done</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Modules */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningModules.map((module) => {
              const isCompleted = progress.some(
                (p) => p.module_name === module.title && p.completed
              );
              return (
                <Card key={module.path} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center text-2xl`}>
                          {module.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                      {isCompleted && (
                        <Badge variant="secondary" className="shrink-0">
                          ✓ Done
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to={module.path}>
                        {isCompleted ? 'Review' : 'Start Learning'}
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
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.path}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Link to={action.path}>
                  <CardHeader className="text-center space-y-3">
                    <div className="flex justify-center">
                      <action.icon className={`w-10 h-10 ${action.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {action.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Your latest accomplishments</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/achievements">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {achievements.slice(0, 5).map((ua) => (
                  <div
                    key={ua.id}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  >
                    <span className="text-3xl">{ua.achievement?.badge_icon}</span>
                    <div>
                      <div className="font-medium text-sm">
                        {ua.achievement?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {ua.achievement?.description}
                      </div>
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
