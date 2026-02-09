import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getUserProgress, getUserAchievements, getUserQuizAttempts } from '@/db/api';
import type { UserProgress, UserAchievement, QuizAttempt } from '@/types';
import { User, Trophy, Target, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { profile } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!profile) return;
      try {
        const [progressData, achievementsData, attemptsData] = await Promise.all([
          getUserProgress(profile.id),
          getUserAchievements(profile.id),
          getUserQuizAttempts(profile.id),
        ]);
        setProgress(progressData);
        setAchievements(achievementsData);
        setQuizAttempts(attemptsData);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [profile]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) return null;

  const completedModules = progress.filter((p) => p.completed).length;
  const correctAttempts = quizAttempts.filter((a) => a.is_correct).length;
  const quizAccuracy = quizAttempts.length > 0 ? (correctAttempts / quizAttempts.length) * 100 : 0;

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">My Profile</h1>
          <p className="text-muted-foreground">View your learning progress and statistics</p>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{profile.username}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                    {profile.role}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Member since {format(new Date(profile.created_at), 'MMM yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                <span className="text-3xl font-bold">{profile.progress_score}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Modules Completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-secondary" />
                <span className="text-3xl font-bold">{completedModules}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-chart-3" />
                <span className="text-3xl font-bold">{achievements.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Attempts</p>
                <p className="text-2xl font-bold">{quizAttempts.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Correct Answers</p>
                <p className="text-2xl font-bold text-primary">{correctAttempts}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-secondary">
                  {quizAccuracy.toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {progress.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                No modules completed yet. Start learning to track your progress!
              </p>
            ) : (
              <div className="space-y-3">
                {progress.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${p.completed ? 'bg-primary' : 'bg-muted-foreground'}`} />
                      <span className="font-medium">{p.module_name}</span>
                    </div>
                    {p.completed && p.completed_at && (
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(p.completed_at), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                No achievements earned yet. Keep learning to unlock badges!
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.slice(0, 6).map((ua) => (
                  <div key={ua.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="text-3xl">{ua.achievement?.badge_icon}</span>
                    <div>
                      <p className="font-medium text-sm">{ua.achievement?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(ua.earned_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
