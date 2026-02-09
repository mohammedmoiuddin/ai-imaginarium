import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { markModuleComplete, getModuleProgress } from '@/db/api';
import { CheckCircle2, ArrowRight, PenTool } from 'lucide-react';

export default function WritingGuidePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      if (!profile) return;
      const progress = await getModuleProgress(profile.id, 'Writing Guide');
      setIsCompleted(progress?.completed || false);
    };
    checkProgress();
  }, [profile]);

  const handleComplete = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      await markModuleComplete(profile.id, 'Writing Guide');
      setIsCompleted(true);
    } catch (error) {
      console.error('Error marking module complete:', error);
    } finally {
      setLoading(false);
    }
  };

  const guideSteps = [
    {
      title: '1. Define Your Subject',
      icon: '🎯',
      description: 'Start with the main focus of your image or video',
      examples: [
        'A portrait of a woman',
        'A futuristic spaceship',
        'A serene forest landscape',
      ],
      tips: [
        'Be specific about what you want',
        'Include key characteristics',
        'Mention the primary element first',
      ],
    },
    {
      title: '2. Specify the Style',
      icon: '🎨',
      description: 'Add artistic style, medium, or visual aesthetic',
      examples: [
        'Oil painting style',
        'Photorealistic',
        'Anime art',
        'Watercolor illustration',
        'Cinematic photography',
      ],
      tips: [
        'Reference art movements or artists',
        'Specify medium (photo, painting, 3D render)',
        'Include aesthetic keywords',
      ],
    },
    {
      title: '3. Enhance with Details',
      icon: '✨',
      description: 'Add specific details about appearance, setting, and mood',
      examples: [
        'Wearing a red dress',
        'In a cyberpunk city',
        'During golden hour',
        'With dramatic lighting',
      ],
      tips: [
        'Describe colors, textures, and materials',
        'Set the scene and environment',
        'Specify lighting and atmosphere',
        'Include emotional tone or mood',
      ],
    },
    {
      title: '4. Add Quality Parameters',
      icon: '⚡',
      description: 'Include technical specifications for output quality',
      examples: [
        '8k resolution',
        'Highly detailed',
        'Professional photography',
        'Award-winning',
        'Trending on ArtStation',
      ],
      tips: [
        'Specify resolution or quality level',
        'Mention rendering techniques',
        'Reference quality benchmarks',
      ],
    },
  ];

  const commonMistakes = [
    {
      mistake: 'Being Too Vague',
      example: '❌ "A nice picture"',
      fix: '✅ "A serene mountain lake at sunrise, photorealistic, 8k"',
    },
    {
      mistake: 'Contradictory Descriptions',
      example: '❌ "Dark bright forest"',
      fix: '✅ "Dimly lit forest with rays of sunlight breaking through"',
    },
    {
      mistake: 'Overloading with Keywords',
      example: '❌ "Cat dog bird fish animal pet cute fluffy"',
      fix: '✅ "A fluffy orange cat with green eyes, cute expression"',
    },
    {
      mistake: 'Missing Context',
      example: '❌ "Person"',
      fix: '✅ "Portrait of a young woman, natural lighting, outdoor setting"',
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Prompt Writing Guide</h1>
            <p className="text-muted-foreground">
              Master the art of crafting effective prompts
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

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="w-6 h-6" />
              The 4-Step Formula
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Follow this proven formula to create effective prompts every time:
              <strong> Subject → Style → Details → Quality</strong>
            </p>
          </CardContent>
        </Card>

        {guideSteps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-3xl">{step.icon}</span>
                <span>{step.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">{step.description}</p>
              
              <div>
                <p className="font-semibold mb-2 text-sm">Examples:</p>
                <div className="space-y-2">
                  {step.examples.map((example, i) => (
                    <div key={i} className="bg-muted p-3 rounded-lg text-sm">
                      {example}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2 text-sm">Tips:</p>
                <ul className="space-y-1 ml-6 list-disc text-sm">
                  {step.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonMistakes.map((item, index) => (
                <div key={index} className="border-l-4 border-destructive pl-4 py-2">
                  <p className="font-semibold mb-2">{item.mistake}</p>
                  <p className="text-sm text-destructive mb-1">{item.example}</p>
                  <p className="text-sm text-primary">{item.fix}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          {!isCompleted && (
            <Button onClick={handleComplete} disabled={loading} className="flex-1">
              {loading ? 'Marking Complete...' : 'Mark as Complete'}
            </Button>
          )}
          <Button onClick={() => navigate('/quizzes?module=guide')} variant="outline" className="flex-1">
            Take Quiz
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
