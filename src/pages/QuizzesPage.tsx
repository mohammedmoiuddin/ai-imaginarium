import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getQuizzesByModule, submitQuizAttempt } from '@/db/api';
import type { Quiz } from '@/types';
import { CheckCircle2, XCircle, Trophy } from 'lucide-react';

export default function QuizzesPage() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const moduleParam = searchParams.get('module');

  const [selectedModule, setSelectedModule] = useState(moduleParam || 'basics');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const modules = [
    { value: 'basics', label: 'Prompt Basics' },
    { value: 'better', label: 'Better Prompting' },
    { value: 'advanced', label: 'Advanced Prompting' },
    { value: 'guide', label: 'Writing Guide' },
  ];

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      setCurrentIndex(0);
      setScore(0);
      setCompleted(false);
      setShowResult(false);
      try {
        const data = await getQuizzesByModule(selectedModule);
        setQuizzes(data);
      } catch (error) {
        console.error('Error loading quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, [selectedModule]);

  const currentQuiz = quizzes[currentIndex];

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuiz || !profile) return;

    const correct = selectedAnswer === currentQuiz.correct_option;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
    }

    try {
      await submitQuizAttempt(profile.id, currentQuiz.id, selectedAnswer, correct);
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setCompleted(false);
    setShowResult(false);
    setSelectedAnswer('');
  };

  const progressPercentage = quizzes.length > 0 ? ((currentIndex + 1) / quizzes.length) * 100 : 0;
  const finalPercentage = quizzes.length > 0 ? (score / quizzes.length) * 100 : 0;

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
      <div className="container mx-auto p-6 max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Interactive Quizzes</h1>
          <p className="text-muted-foreground">Test your knowledge and track your progress</p>
        </div>

        {!completed ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Select Module</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {modules.map((module) => (
                    <Button
                      key={module.value}
                      variant={selectedModule === module.value ? 'default' : 'outline'}
                      onClick={() => setSelectedModule(module.value)}
                      className="w-full"
                    >
                      {module.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {quizzes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No quizzes available for this module</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardDescription>
                        Question {currentIndex + 1} of {quizzes.length}
                      </CardDescription>
                      <Badge variant="secondary">
                        Score: {score}/{quizzes.length}
                      </Badge>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl leading-relaxed">
                      {currentQuiz.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showResult}>
                      <div className="space-y-3">
                        {['A', 'B', 'C', 'D'].map((option) => {
                          const optionText = currentQuiz[`option_${option.toLowerCase()}` as keyof Quiz] as string;
                          const isSelected = selectedAnswer === option;
                          const isCorrectOption = option === currentQuiz.correct_option;
                          
                          let className = 'flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors';
                          
                          if (showResult) {
                            if (isCorrectOption) {
                              className += ' border-primary bg-primary/10';
                            } else if (isSelected && !isCorrect) {
                              className += ' border-destructive bg-destructive/10';
                            } else {
                              className += ' border-border bg-muted';
                            }
                          } else {
                            className += isSelected ? ' border-primary bg-primary/5' : ' border-border hover:border-primary/50';
                          }

                          return (
                            <div key={option} className={className}>
                              <RadioGroupItem value={option} id={option} />
                              <Label htmlFor={option} className="flex-1 cursor-pointer">
                                <span className="font-semibold mr-2">{option}.</span>
                                {optionText}
                              </Label>
                              {showResult && isCorrectOption && (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              )}
                              {showResult && isSelected && !isCorrect && (
                                <XCircle className="w-5 h-5 text-destructive" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>

                    {showResult && currentQuiz.explanation && (
                      <Alert>
                        <AlertDescription>
                          <strong>Explanation:</strong> {currentQuiz.explanation}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-3">
                      {!showResult ? (
                        <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="flex-1">
                          Submit Answer
                        </Button>
                      ) : (
                        <Button onClick={handleNext} className="flex-1">
                          {currentIndex < quizzes.length - 1 ? 'Next Question' : 'View Results'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
              <CardDescription>Here are your results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {finalPercentage.toFixed(0)}%
                </div>
                <p className="text-muted-foreground">
                  You got {score} out of {quizzes.length} questions correct
                </p>
              </div>

              <Progress value={finalPercentage} className="h-3" />

              <div className="bg-muted p-6 rounded-lg text-center">
                {finalPercentage >= 80 ? (
                  <p className="text-lg">
                    🎉 Excellent work! You have a strong understanding of this topic.
                  </p>
                ) : finalPercentage >= 60 ? (
                  <p className="text-lg">
                    👍 Good job! Review the material to improve further.
                  </p>
                ) : (
                  <p className="text-lg">
                    📚 Keep learning! Review the module and try again.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleRestart} variant="outline" className="flex-1">
                  Retake Quiz
                </Button>
                <Button onClick={() => setSelectedModule(modules[(modules.findIndex(m => m.value === selectedModule) + 1) % modules.length].value)} className="flex-1">
                  Next Module
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
