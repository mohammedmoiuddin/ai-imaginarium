import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { markModuleComplete, getModuleProgress } from '@/db/api';
import { CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PromptingLevelsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      if (!user) return;
      const progress = await getModuleProgress(user.id, 'Prompting Levels');
      setIsCompleted(progress?.completed || false);
    };
    checkProgress();
  }, [user?.id]);

  const handleComplete = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to mark modules as completed.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setIsCompleted(true);
    try {
      await markModuleComplete(user.id, 'Prompting Levels');
      toast({
        title: 'Completed',
        description: 'Prompting Levels has been marked as completed.',
      });
    } catch (error) {
      setIsCompleted(false);
      console.error('Error marking module complete:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Update failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Prompting Levels</h1>
            <p className="text-muted-foreground">
              Progress from basic to advanced prompting techniques
            </p>
          </div>
          {isCompleted && (
            <Badge variant="secondary" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </Badge>
          )}
        </div>

        <Separator />

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="better">Better</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-chart-1" />
                  Basic Level Prompting
                </CardTitle>
                <CardDescription>Simple and straightforward prompts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">
                  Basic prompts include the main subject and a few descriptive words. They're
                  simple but can produce inconsistent results.
                </p>
                <div className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Example 1:</p>
                    <p className="text-sm italic">"A cat"</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Example 2:</p>
                    <p className="text-sm italic">"Mountain landscape"</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Example 3:</p>
                    <p className="text-sm italic">"Futuristic city"</p>
                  </div>
                </div>
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-destructive mb-2">Limitations:</p>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li>Vague and open to interpretation</li>
                    <li>Lacks style and quality specifications</li>
                    <li>Results may vary significantly</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="better" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-chart-2" />
                  Better Level Prompting
                </CardTitle>
                <CardDescription>Enhanced with details and style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">
                  Better prompts add specific details, style keywords, and context to guide the
                  AI more effectively.
                </p>
                <div className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Example 1:</p>
                    <p className="text-sm italic">
                      "A fluffy orange cat sitting on a windowsill, soft natural lighting,
                      cozy atmosphere"
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Example 2:</p>
                    <p className="text-sm italic">
                      "Majestic mountain landscape at sunset, dramatic clouds, golden hour
                      lighting, wide angle view"
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Example 3:</p>
                    <p className="text-sm italic">
                      "Futuristic cyberpunk city at night, neon lights, flying cars, rain-slicked
                      streets, cinematic"
                    </p>
                  </div>
                </div>
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-primary mb-2">Improvements:</p>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li>Specific details about appearance and setting</li>
                    <li>Lighting and atmosphere descriptions</li>
                    <li>Style keywords for consistency</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-chart-3" />
                  Advanced Level Prompting
                </CardTitle>
                <CardDescription>Professional-grade with technical specs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">
                  Advanced prompts include comprehensive details, technical specifications,
                  artistic references, and quality parameters for professional results.
                </p>
                <div className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Example 1:</p>
                    <p className="text-sm italic">
                      "Portrait of a fluffy orange tabby cat with green eyes, sitting elegantly
                      on a vintage wooden windowsill, soft diffused natural lighting from the
                      left, shallow depth of field, bokeh background, cozy cottage interior,
                      warm color palette, professional pet photography, 85mm lens, f/1.8, 4k
                      resolution"
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Example 2:</p>
                    <p className="text-sm italic">
                      "Epic mountain landscape at golden hour, snow-capped peaks piercing
                      dramatic volumetric clouds, alpine lake in foreground with perfect
                      reflections, scattered pine trees, god rays breaking through clouds,
                      cinematic composition following rule of thirds, landscape photography by
                      Ansel Adams style, ultra wide angle 16mm, high dynamic range, 8k
                      resolution, National Geographic quality"
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Example 3:</p>
                    <p className="text-sm italic">
                      "Futuristic cyberpunk metropolis at night, towering neon-lit skyscrapers
                      with holographic advertisements, flying vehicles with light trails,
                      rain-slicked reflective streets, dense fog and atmospheric haze, blade
                      runner aesthetic, cinematic wide angle establishing shot, dramatic
                      lighting with strong contrast, vibrant purple and cyan color grading,
                      highly detailed architecture, concept art quality, octane render, 8k
                      resolution"
                    </p>
                  </div>
                </div>
                <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-secondary mb-2">Advanced Elements:</p>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li>Comprehensive subject description with specific details</li>
                    <li>Technical camera/lens specifications</li>
                    <li>Artistic style references and influences</li>
                    <li>Composition and framing instructions</li>
                    <li>Quality and resolution parameters</li>
                    <li>Color grading and mood specifications</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4">
          {!isCompleted && (
            <Button onClick={handleComplete} disabled={loading} className="flex-1">
              {loading ? 'Marking Complete...' : 'Mark as Complete'}
            </Button>
          )}
          <Button onClick={() => navigate('/quizzes?module=better')} variant="outline" className="flex-1">
            Take Quiz
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
