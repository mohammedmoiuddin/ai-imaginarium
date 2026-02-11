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
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              What is a Prompt?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              A <strong>prompt</strong> is a text instruction you provide to an AI model to generate
              images, videos, or other content. Think of it as a creative brief that tells the AI what you want to create.
              The quality and specificity of your prompt directly impacts the quality of the generated output.
            </p>
            <p className="text-foreground leading-relaxed">
              Prompts act as a communication bridge between human creativity and artificial intelligence.
              They translate your ideas, visions, and requirements into a format that AI models can understand
              and execute. A well-crafted prompt can mean the difference between a generic result and a
              masterpiece that perfectly captures your vision.
            </p>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm font-medium mb-2 text-primary">Example Prompt:</p>
              <p className="text-sm font-mono italic text-foreground">
                "A serene mountain lake at sunrise, crystal clear water reflecting snow-capped peaks,
                surrounded by pine forests, misty atmosphere, golden hour lighting, photorealistic, 8k resolution"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Prompting Matters */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-secondary" />
              Why Prompting Matters in AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              Effective prompting is the key to unlocking the full potential of AI image and video
              generation. As AI becomes more integrated into creative workflows, the ability to communicate
              effectively with these systems becomes a crucial skill for artists, designers, marketers,
              and content creators.
            </p>
            <p className="text-foreground leading-relaxed font-semibold text-primary">
              Mastering prompts helps you:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Get exactly what you envision</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Instead of random results, you'll generate outputs that match your creative vision precisely
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Save time and resources</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reduce trial and error by getting better results on the first attempt
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Achieve professional-quality outputs</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Consistently produce high-quality results that meet professional standards
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Express creative vision with precision</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Translate abstract ideas into concrete visual outputs that others can see and understand
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Stay competitive in the AI era</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Prompt engineering is becoming a valuable skill in the modern creative industry
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Text-to-Image Prompting */}
        <Card className="card-glow border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Text-to-Image Prompting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              <strong>Text-to-Image AI</strong> models like DALL-E, Midjourney, Stable Diffusion, and Adobe Firefly
              can generate static images from text descriptions. These powerful tools are perfect for creating
              artwork, illustrations, concept designs, marketing materials, and visual content.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-primary">Common Use Cases:</h4>
              <ul className="space-y-2 ml-4 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Digital Art & Illustrations:</strong> Create unique artwork for personal or commercial projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Marketing & Advertising:</strong> Generate eye-catching visuals for campaigns and social media</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Concept Design:</strong> Rapidly prototype ideas for products, characters, or environments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Book Covers & Publishing:</strong> Design compelling covers and interior illustrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Web Design:</strong> Create custom graphics, backgrounds, and visual elements</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm font-medium mb-2 text-primary">Example Text-to-Image Prompt:</p>
              <p className="text-sm font-mono italic text-foreground">
                "Professional product photography of a sleek smartwatch on marble surface, studio lighting,
                shallow depth of field, luxury aesthetic, commercial photography, 4k resolution"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Text-to-Video Prompting */}
        <Card className="card-glow border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎬</span>
              Text-to-Video Prompting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              <strong>Text-to-Video AI</strong> models like Runway, Pika, and Sora can generate short video clips
              from text prompts. This revolutionary technology is transforming content creation, allowing you to
              bring dynamic scenes to life with just words. Video generation adds motion, timing, and narrative
              elements to your creative toolkit.
            </p>
            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-secondary">Common Use Cases:</h4>
              <ul className="space-y-2 ml-4 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  <span><strong>Social Media Content:</strong> Create engaging short-form videos for TikTok, Instagram Reels, and YouTube Shorts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  <span><strong>Video Marketing:</strong> Generate promotional clips, product demos, and explainer videos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  <span><strong>Animation & Motion Graphics:</strong> Produce animated sequences and visual effects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  <span><strong>Storyboarding:</strong> Visualize scenes and sequences for film and video projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  <span><strong>Educational Content:</strong> Create visual demonstrations and instructional videos</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm font-medium mb-2 text-secondary">Example Text-to-Video Prompt:</p>
              <p className="text-sm font-mono italic text-foreground">
                "Cinematic drone shot flying over misty mountain valley at dawn, camera slowly ascending,
                revealing layers of fog between peaks, golden sunlight breaking through clouds, smooth motion,
                4k quality, 5 seconds"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prompting for Content Creation */}
        <Card className="card-glow border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✍️</span>
              Prompting for Content Creation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              Beyond images and videos, AI prompting is essential for <strong>text-based content creation</strong>.
              Models like ChatGPT, Claude, and Gemini can help you generate blogs, social media posts, scripts,
              and more. The same principles of clear, specific prompting apply to text generation.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <h4 className="font-semibold text-accent mb-2">📝 Blog Writing</h4>
                <p className="text-sm text-muted-foreground">
                  Generate article outlines, introductions, full blog posts, and SEO-optimized content
                </p>
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <h4 className="font-semibold text-accent mb-2">📱 Social Media</h4>
                <p className="text-sm text-muted-foreground">
                  Create engaging captions, hashtags, post ideas, and content calendars for all platforms
                </p>
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <h4 className="font-semibold text-accent mb-2">🎭 Script Writing</h4>
                <p className="text-sm text-muted-foreground">
                  Develop video scripts, dialogue, storyboards, and narrative content for various media
                </p>
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm font-medium mb-2 text-accent">Example Content Creation Prompt:</p>
              <p className="text-sm font-mono italic text-foreground">
                "Write an engaging Instagram caption for a coffee shop's new seasonal latte, include emojis,
                mention the cozy autumn vibes, add 5 relevant hashtags, keep it under 150 characters, friendly tone"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How AI Interprets Prompts */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              How AI Interprets Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              Understanding how AI models process and interpret your prompts is crucial for writing effective ones.
              AI models break down your prompt into key components and use them to guide the generation process.
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 py-2">
                <h4 className="font-semibold text-primary mb-2">1. Tokenization</h4>
                <p className="text-sm text-muted-foreground">
                  The AI breaks your prompt into smaller units called "tokens" (words or word parts) and analyzes
                  their relationships and meanings.
                </p>
              </div>
              <div className="border-l-4 border-secondary pl-4 py-2">
                <h4 className="font-semibold text-secondary mb-2">2. Semantic Understanding</h4>
                <p className="text-sm text-muted-foreground">
                  The model identifies key concepts, subjects, actions, styles, and attributes from your prompt
                  using its training data.
                </p>
              </div>
              <div className="border-l-4 border-accent pl-4 py-2">
                <h4 className="font-semibold text-accent mb-2">3. Contextual Weighting</h4>
                <p className="text-sm text-muted-foreground">
                  Different parts of your prompt are given different levels of importance. Words at the beginning
                  often carry more weight.
                </p>
              </div>
              <div className="border-l-4 border-chart-3 pl-4 py-2">
                <h4 className="font-semibold text-chart-3 mb-2">4. Pattern Matching</h4>
                <p className="text-sm text-muted-foreground">
                  The AI matches your prompt to patterns it learned during training, combining elements to create
                  something new.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Importance of Clarity, Detail, and Structure */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              The Three Pillars of Effective Prompting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex gap-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2 text-primary">1. Clarity</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Be clear and unambiguous in your descriptions. Avoid vague terms that could be interpreted
                    in multiple ways.
                  </p>
                  <div className="bg-background/50 p-3 rounded border border-border">
                    <p className="text-xs text-muted-foreground mb-1">❌ Unclear:</p>
                    <p className="text-xs font-mono mb-2">"A nice picture of a dog"</p>
                    <p className="text-xs text-primary mb-1">✅ Clear:</p>
                    <p className="text-xs font-mono">"A golden retriever puppy sitting in green grass, looking at camera, sunny day"</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2 text-secondary">2. Detail</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Include specific details about appearance, setting, lighting, mood, and style. More relevant
                    details lead to better results.
                  </p>
                  <div className="bg-background/50 p-3 rounded border border-border">
                    <p className="text-xs text-muted-foreground mb-1">❌ Lacking Detail:</p>
                    <p className="text-xs font-mono mb-2">"A city at night"</p>
                    <p className="text-xs text-secondary mb-1">✅ Detailed:</p>
                    <p className="text-xs font-mono">"Futuristic cyberpunk city at night, neon signs, rain-slicked streets, flying cars, towering skyscrapers, purple and blue color scheme"</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">🏗️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2 text-accent">3. Structure</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Organize your prompt logically: Subject → Description → Style → Lighting → Quality.
                    This helps the AI prioritize elements correctly.
                  </p>
                  <div className="bg-background/50 p-3 rounded border border-border">
                    <p className="text-xs text-muted-foreground mb-1">❌ Poorly Structured:</p>
                    <p className="text-xs font-mono mb-2">"8k, photorealistic, dramatic, a warrior, sunset, mountains"</p>
                    <p className="text-xs text-accent mb-1">✅ Well Structured:</p>
                    <p className="text-xs font-mono">"A warrior standing on mountain peak at sunset, dramatic pose, photorealistic style, 8k resolution"</p>
                  </div>
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
