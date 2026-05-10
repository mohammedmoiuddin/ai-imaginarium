import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { markModuleComplete, getModuleProgress } from '@/db/api';
import { CheckCircle2, ArrowRight, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ComparisonPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      if (!user) return;
      const progress = await getModuleProgress(user.id, 'Good vs Bad');
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
      await markModuleComplete(user.id, 'Good vs Bad');
      toast({
        title: 'Completed',
        description: 'Good vs Bad has been marked as completed.',
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

  const comparisons = [
    {
      category: 'Portrait Photography',
      bad: {
        prompt: 'A person',
        issues: ['Too vague', 'No context', 'No style specified', 'Missing details'],
      },
      good: {
        prompt: 'Portrait of a young woman with curly brown hair, natural smile, soft window lighting from the left, shallow depth of field, warm color tones, professional photography, 85mm lens, f/1.8',
        strengths: ['Specific subject', 'Detailed description', 'Lighting specified', 'Technical parameters', 'Style defined'],
      },
      takeaway: 'Always include subject details, lighting, and technical specifications for portraits',
    },
    {
      category: 'Landscape Scene',
      bad: {
        prompt: 'Nice mountain view',
        issues: ['Subjective term "nice"', 'No time of day', 'No atmosphere', 'No composition'],
      },
      good: {
        prompt: 'Majestic mountain range at golden hour, dramatic clouds with sun rays breaking through, alpine meadow with wildflowers in foreground, crystal clear lake reflecting peaks, wide angle composition, landscape photography, high dynamic range, 8k resolution',
        strengths: ['Specific time and lighting', 'Atmospheric details', 'Foreground and background', 'Composition noted', 'Quality parameters'],
      },
      takeaway: 'Landscape prompts need time of day, weather, composition, and foreground/background elements',
    },
    {
      category: 'Fantasy Art',
      bad: {
        prompt: 'Dragon flying',
        issues: ['Minimal description', 'No environment', 'No art style', 'No mood'],
      },
      good: {
        prompt: 'Majestic red dragon with golden scales soaring through stormy clouds, lightning illuminating wings, medieval castle on mountain peak below, dramatic cinematic lighting, fantasy art by Boris Vallejo style, highly detailed scales and textures, epic composition, digital painting, 4k',
        strengths: ['Detailed creature description', 'Environment included', 'Mood and atmosphere', 'Style reference', 'Quality specified'],
      },
      takeaway: 'Fantasy prompts benefit from detailed descriptions, environmental context, and style references',
    },
    {
      category: 'Product Photography',
      bad: {
        prompt: 'Watch on table',
        issues: ['Generic setup', 'No product details', 'No lighting', 'No quality specs'],
      },
      good: {
        prompt: 'Luxury Swiss mechanical watch with leather strap on polished marble surface, dramatic side lighting creating reflections, shallow depth of field, bokeh background, product photography, studio lighting, macro lens, commercial quality, 8k resolution',
        strengths: ['Product specifics', 'Surface and materials', 'Professional lighting', 'Photography style', 'Technical quality'],
      },
      takeaway: 'Product shots require material details, professional lighting, and commercial photography keywords',
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-5xl space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Bad vs Good Prompts</h1>
            <p className="text-muted-foreground">
              Learn from side-by-side comparisons
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

        <Card className="bg-gradient-to-br from-destructive/10 via-background to-primary/10">
          <CardContent className="pt-6">
            <p className="text-center text-lg font-medium">
              The difference between a bad and good prompt can transform your results from
              mediocre to professional quality. Let's see how!
            </p>
          </CardContent>
        </Card>

        {comparisons.map((comparison, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-xl">{comparison.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Bad Prompt */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-destructive font-semibold">
                    <X className="w-5 h-5" />
                    <span>Bad Prompt</span>
                  </div>
                  <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg">
                    <p className="text-sm italic mb-3">"{comparison.bad.prompt}"</p>
                    <Separator className="my-3" />
                    <p className="text-xs font-semibold mb-2">Issues:</p>
                    <ul className="space-y-1">
                      {comparison.bad.issues.map((issue, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <X className="w-3 h-3 shrink-0 mt-0.5 text-destructive" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Good Prompt */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Check className="w-5 h-5" />
                    <span>Good Prompt</span>
                  </div>
                  <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg">
                    <p className="text-sm italic mb-3">"{comparison.good.prompt}"</p>
                    <Separator className="my-3" />
                    <p className="text-xs font-semibold mb-2">Strengths:</p>
                    <ul className="space-y-1">
                      {comparison.good.strengths.map((strength, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <Check className="w-3 h-3 shrink-0 mt-0.5 text-primary" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-lg">
                <p className="text-sm font-semibold text-secondary mb-1">Key Takeaway:</p>
                <p className="text-sm">{comparison.takeaway}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>General Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-destructive flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Avoid These
                </h3>
                <ul className="space-y-1 text-sm ml-6 list-disc">
                  <li>Vague or generic descriptions</li>
                  <li>Contradictory terms</li>
                  <li>Missing context or setting</li>
                  <li>No style or quality specs</li>
                  <li>Overly complex or confusing</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Always Include
                </h3>
                <ul className="space-y-1 text-sm ml-6 list-disc">
                  <li>Clear, specific subject</li>
                  <li>Detailed descriptions</li>
                  <li>Style and aesthetic keywords</li>
                  <li>Lighting and atmosphere</li>
                  <li>Quality and technical parameters</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          {!isCompleted && (
            <Button onClick={handleComplete} disabled={loading} className="flex-1">
              {loading ? 'Marking Complete...' : 'Mark as Complete'}
            </Button>
          )}
          <Button onClick={() => navigate('/playground')} variant="outline" className="flex-1">
            Try in Playground
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
