import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getAllAchievements, getUserAchievements } from '@/db/api';
import type { Achievement, UserAchievement } from '@/types';
import { Trophy, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AchievementsPage() {
  const { profile } = useAuth();
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!profile) return;
      try {
        const [all, user] = await Promise.all([
          getAllAchievements(),
          getUserAchievements(profile.id),
        ]);
        setAllAchievements(all);
        setUserAchievements(user);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAchievements();
  }, [profile]);

  const earnedIds = new Set(userAchievements.map((ua) => ua.achievement_id));
  const earnedCount = userAchievements.length;
  const totalCount = allAchievements.length;
  const progressPercentage = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

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
      <div className="container mx-auto p-6 max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Achievements</h1>
          <p className="text-muted-foreground">
            Track your progress and unlock badges
          </p>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Achievements Unlocked</span>
              <span className="text-3xl font-bold text-primary">
                {earnedCount} / {totalCount}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {progressPercentage.toFixed(0)}% Complete
            </p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-bold mb-4">All Achievements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {allAchievements.map((achievement) => {
              const isEarned = earnedIds.has(achievement.id);
              const userAchievement = userAchievements.find(
                (ua) => ua.achievement_id === achievement.id
              );

              return (
                <Card
                  key={achievement.id}
                  className={`${
                    isEarned
                      ? 'border-primary bg-primary/5'
                      : 'opacity-60'
                  } transition-all`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                          isEarned ? 'bg-primary/20' : 'bg-muted'
                        }`}
                      >
                        {isEarned ? achievement.badge_icon : <Lock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg">
                            {achievement.name}
                          </CardTitle>
                          {isEarned && (
                            <Badge variant="secondary" className="shrink-0">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="mt-2">
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Requirement: {achievement.requirement_value}{' '}
                        {achievement.requirement_type.replace('_', ' ')}
                      </span>
                      {isEarned && userAchievement && (
                        <span className="text-primary font-medium">
                          Earned{' '}
                          {formatDistanceToNow(new Date(userAchievement.earned_at), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
