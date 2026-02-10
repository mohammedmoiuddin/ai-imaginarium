import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { markModuleComplete, getModuleProgress } from '@/db/api';
import { CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';

export default function PromptBasicsPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      if (!profile) return;
      const progress = await getModuleProgress(profile.id, 'Prompt Basics');
      setIsCompleted(progress?.completed || false);
    };
    checkProgress();
  }, [profile]);

  const handleComplete = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      await markModuleComplete(profile.id, 'Prompt Basics');
      setIsCompleted(true);
    } catch (error) {
      console.error('Error marking module complete:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeQuiz = () => {
    navigate('/quizzes?module=basics');
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Prompt Basics</h1>
            <p className="text-muted-foreground">
              Learn the fundamentals of AI prompting
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

        {/* What are Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              What are Prompts?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              A <strong>prompt</strong> is a text instruction you provide to an AI model to generate
              images or videos. Think of it as a creative brief that tells the AI what you want to see.
              The quality and specificity of your prompt directly impacts the quality of the generated output.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Example Prompt:</p>
              <p className="text-sm italic">
                "A serene mountain lake at sunrise, crystal clear water reflecting snow-capped peaks,
                surrounded by pine forests, photorealistic, 8k resolution"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Importance of Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              Why Prompts Matter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              Effective prompts are the key to unlocking the full potential of AI image and video
              generation. They help you:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Get exactly what you envision instead of random results</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Save time by reducing trial and error</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Achieve professional-quality outputs consistently</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Express your creative vision with precision</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Text-to-Image and Text-to-Video */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Text-to-Image & Text-to-Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">Text-to-Image</h3>
                <p className="text-foreground leading-relaxed">
                  AI models like DALL-E, Midjourney, and Stable Diffusion can generate static images
                  from text descriptions. These are perfect for creating artwork, illustrations,
                  concept designs, and visual content.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-secondary">Text-to-Video</h3>
                <p className="text-foreground leading-relaxed">
                  Advanced AI models can now generate short video clips from text prompts. This
                  technology is revolutionizing content creation, allowing you to bring dynamic
                  scenes to life with just words.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Concepts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔑</span>
              Key Concepts to Remember
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex gap-3 p-4 bg-accent rounded-lg">
                <Lightbulb className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Be Specific</h4>
                  <p className="text-sm text-muted-foreground">
                    The more details you provide, the better the AI understands your vision
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-accent rounded-lg">
                <Lightbulb className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Use Descriptive Language</h4>
                  <p className="text-sm text-muted-foreground">
                    Include adjectives, styles, moods, and technical specifications
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-accent rounded-lg">
                <Lightbulb className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Structure Matters</h4>
                  <p className="text-sm text-muted-foreground">
                    Start with the main subject, then add details, style, and quality parameters
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!isCompleted && (
            <Button onClick={handleComplete} disabled={loading} className="flex-1">
              {loading ? 'Marking Complete...' : 'Mark as Complete'}
            </Button>
          )}
          <Button onClick={handleTakeQuiz} variant="outline" className="flex-1">
            Take Quiz
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
