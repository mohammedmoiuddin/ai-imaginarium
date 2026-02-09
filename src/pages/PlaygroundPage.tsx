import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import type { PromptFeedback } from '@/types';
import { Sparkles, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';

export default function PlaygroundPage() {
  const { profile } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [feedback, setFeedback] = useState<PromptFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const analyzePrompt = (text: string): PromptFeedback => {
    const lowerText = text.toLowerCase();
    
    // Check for subject
    const hasSubject = text.trim().length > 10;
    
    // Check for style keywords
    const styleKeywords = [
      'photorealistic', 'painting', 'illustration', 'anime', 'cartoon', 'sketch',
      'oil painting', 'watercolor', 'digital art', 'concept art', 'cinematic',
      'photography', '3d render', 'realistic', 'artistic', 'style'
    ];
    const hasStyle = styleKeywords.some(keyword => lowerText.includes(keyword));
    
    // Check for details
    const detailKeywords = [
      'lighting', 'color', 'atmosphere', 'mood', 'texture', 'background',
      'foreground', 'detailed', 'dramatic', 'soft', 'bright', 'dark',
      'golden hour', 'sunset', 'sunrise', 'night', 'day'
    ];
    const hasDetails = detailKeywords.some(keyword => lowerText.includes(keyword));
    
    // Check for quality parameters
    const qualityKeywords = [
      '4k', '8k', 'high resolution', 'highly detailed', 'professional',
      'award-winning', 'masterpiece', 'high quality', 'hd', 'uhd'
    ];
    const hasQuality = qualityKeywords.some(keyword => lowerText.includes(keyword));
    
    // Calculate score
    let score = 0;
    if (hasSubject) score += 25;
    if (hasStyle) score += 25;
    if (hasDetails) score += 25;
    if (hasQuality) score += 25;
    
    // Generate suggestions
    const suggestions: string[] = [];
    if (!hasSubject || text.trim().length < 20) {
      suggestions.push('Add more specific details about your main subject');
    }
    if (!hasStyle) {
      suggestions.push('Specify an artistic style (e.g., photorealistic, oil painting, anime)');
    }
    if (!hasDetails) {
      suggestions.push('Include details about lighting, atmosphere, or mood');
    }
    if (!hasQuality) {
      suggestions.push('Add quality parameters (e.g., 8k resolution, highly detailed)');
    }
    
    if (score === 100) {
      suggestions.push('Excellent prompt! All key elements are present.');
    }
    
    return {
      hasSubject,
      hasStyle,
      hasDetails,
      hasQuality,
      score,
      suggestions,
    };
  };

  const handleAnalyze = () => {
    if (!prompt.trim()) {
      return;
    }
    const result = analyzePrompt(prompt);
    setFeedback(result);
    setShowFeedback(true);
  };

  const handleClear = () => {
    setPrompt('');
    setFeedback(null);
    setShowFeedback(false);
  };

  const examplePrompts = [
    'A serene mountain lake at sunrise, crystal clear water reflecting snow-capped peaks, surrounded by pine forests, photorealistic, 8k resolution',
    'Portrait of a young woman with curly hair, natural smile, soft window lighting, shallow depth of field, professional photography',
    'Futuristic cyberpunk city at night, neon lights, flying cars, rain-slicked streets, cinematic composition, highly detailed',
  ];

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Prompt Playground</h1>
          <p className="text-muted-foreground">
            Practice writing prompts and get instant feedback
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Your Prompt
                </CardTitle>
                <CardDescription>
                  Write your prompt below and click Analyze to get feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your prompt here... (e.g., A majestic lion in the savanna at sunset, golden hour lighting, photorealistic, 8k resolution)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px] resize-none"
                />
                <div className="flex gap-3">
                  <Button onClick={handleAnalyze} disabled={!prompt.trim()} className="flex-1">
                    Analyze Prompt
                  </Button>
                  <Button onClick={handleClear} variant="outline">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {showFeedback && feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {feedback.score === 100 ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-secondary" />
                    )}
                    Feedback & Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Overall Score</span>
                      <span className="text-2xl font-bold text-primary">{feedback.score}%</span>
                    </div>
                    <Progress value={feedback.score} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg border ${feedback.hasSubject ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
                      <div className="flex items-center gap-2">
                        {feedback.hasSubject ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">Subject</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg border ${feedback.hasStyle ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
                      <div className="flex items-center gap-2">
                        {feedback.hasStyle ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">Style</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg border ${feedback.hasDetails ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
                      <div className="flex items-center gap-2">
                        {feedback.hasDetails ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">Details</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg border ${feedback.hasQuality ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
                      <div className="flex items-center gap-2">
                        {feedback.hasQuality ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">Quality</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Suggestions
                    </h3>
                    <div className="space-y-2">
                      {feedback.suggestions.map((suggestion, index) => (
                        <Alert key={index}>
                          <AlertDescription>{suggestion}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Badge variant="secondary">1</Badge>
                  <p>Start with a clear subject</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">2</Badge>
                  <p>Add style keywords</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">3</Badge>
                  <p>Include lighting & mood</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">4</Badge>
                  <p>Specify quality parameters</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Prompts</CardTitle>
                <CardDescription>Click to try</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {examplePrompts.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto text-left justify-start whitespace-normal p-3"
                    onClick={() => {
                      setPrompt(example);
                      setShowFeedback(false);
                    }}
                  >
                    <span className="text-xs line-clamp-3">{example}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
