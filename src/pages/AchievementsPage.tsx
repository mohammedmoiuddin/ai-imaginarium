import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getUserProgress, getUserQuizAttempts } from '@/db/api';
import type { UserProgress, QuizAttempt } from '@/types';
import { BookOpen, CheckCircle, TrendingUp, Target } from 'lucide-react';

export default function AchievementsPage() {
  const { profile } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!profile) return;
      try {
        const [progressData, attemptsData] = await Promise.all([
          getUserProgress(profile.id),
          getUserQuizAttempts(profile.id),
        ]);
        setProgress(progressData);
        setQuizAttempts(attemptsData);
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [profile]);

  // Calculate module progress
  const totalModules = 5; // Basics, Levels, Guide, Comparison, and one more
  const completedModules = progress.filter((p) => p.completed).length;
  const moduleProgressPercentage = (completedModules / totalModules) * 100;

  // Calculate quiz progress
  const totalQuizModules = 4; // basics, better, advanced, guide
  const quizzesPerModule = 5; // Now 5 questions per module
  const totalQuizQuestions = totalQuizModules * quizzesPerModule;
  const completedQuizzes = quizAttempts.length;
  const correctQuizzes = quizAttempts.filter((a) => a.is_correct).length;
  const quizProgressPercentage = totalQuizQuestions > 0 ? (completedQuizzes / totalQuizQuestions) * 100 : 0;
  const quizAccuracy = completedQuizzes > 0 ? (correctQuizzes / completedQuizzes) * 100 : 0;

  // Calculate overall progress
  const overallProgress = (moduleProgressPercentage + quizProgressPercentage) / 2;

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
      <div className="container mx-auto p-6 max-w-5xl space-y-6 fade-in">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Learning Progress</h1>
            <p className="text-muted-foreground">
              Track your journey through modules and quizzes
            </p>
          </div>
        </div>

        {/* Overall Progress Card */}
        <Card className="card-glow border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Overall Completion
            </CardTitle>
            <CardDescription>Your total learning progress across all modules and quizzes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-foreground">Total Progress</span>
              <span className="text-4xl font-bold gradient-text">
                {overallProgress.toFixed(0)}%
              </span>
            </div>
            <div className="relative">
              <Progress value={overallProgress} className="h-4" />
              <div 
                className="absolute top-0 left-0 h-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {overallProgress >= 100 
                ? '🎉 Congratulations! You have completed all learning materials!' 
                : `Keep going! You're ${(100 - overallProgress).toFixed(0)}% away from completion.`}
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-glow border-primary/20">
            <CardHeader className="pb-3">
              <CardDescription>Modules Completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="text-4xl font-bold text-primary">{completedModules}</span>
                  <span className="text-2xl text-muted-foreground">/{totalModules}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow border-secondary/20">
            <CardHeader className="pb-3">
              <CardDescription>Quiz Questions Answered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <span className="text-4xl font-bold text-secondary">{completedQuizzes}</span>
                  <span className="text-2xl text-muted-foreground">/{totalQuizQuestions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow border-accent/20">
            <CardHeader className="pb-3">
              <CardDescription>Quiz Accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <span className="text-4xl font-bold text-accent">{quizAccuracy.toFixed(0)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Progress Details */}
        <Card className="card-glow border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Module Progress
            </CardTitle>
            <CardDescription>Track your completion of learning modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
              <span className="text-2xl font-bold text-primary">{moduleProgressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={moduleProgressPercentage} className="h-3 mb-6" />
            
            {progress.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No modules started yet. Begin your learning journey!
              </p>
            ) : (
              <div className="space-y-3">
                {progress.map((p) => (
                  <div 
                    key={p.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      p.completed 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        p.completed ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        {p.completed ? (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">{p.module_name}</span>
                    </div>
                    {p.completed && (
                      <span className="text-sm text-primary font-medium">Completed ✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quiz Progress Details */}
        <Card className="card-glow border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              Quiz Progress
            </CardTitle>
            <CardDescription>Your performance across all quiz modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">Questions Completed</span>
              <span className="text-2xl font-bold text-secondary">{quizProgressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={quizProgressPercentage} className="h-3 mb-6" />
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total Attempts</p>
                <p className="text-3xl font-bold text-foreground">{completedQuizzes}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Correct Answers</p>
                <p className="text-3xl font-bold text-primary">{correctQuizzes}</p>
              </div>
            </div>

            {completedQuizzes === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No quizzes attempted yet. Test your knowledge!
              </p>
            ) : (
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground">
                  {quizAccuracy >= 80 
                    ? '🎯 Excellent performance! You have a strong understanding of the material.' 
                    : quizAccuracy >= 60 
                    ? '👍 Good progress! Keep practicing to improve your accuracy.' 
                    : '📚 Keep learning! Review the modules and try the quizzes again.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
