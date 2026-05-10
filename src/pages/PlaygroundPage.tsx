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
import { Terminal, CheckCircle2, AlertCircle, Lightbulb, Zap, Code2 } from 'lucide-react';

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
      <div className="container mx-auto p-6 max-w-6xl space-y-6 fade-in">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Terminal className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Prompt Playground</h1>
            <p className="text-muted-foreground">
              Test your prompts with real-time AI feedback
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-glow border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-5 h-5 text-primary" />
                    <CardTitle>Prompt Console</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
                    Live Analysis
                  </Badge>
                </div>
                <CardDescription>
                  Write your prompt below and analyze it for quality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prompt-console">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono text-primary">prompt.txt</span>
                    <div className="ml-auto flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <div className="w-2 h-2 rounded-full bg-chart-4" />
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  </div>
                  <Textarea
                    placeholder="Example: A futuristic cyberpunk city at night, neon lights, flying cars, cinematic, 8k"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAnalyze();
                      }
                    }}
                    className="min-h-[200px] resize-none bg-transparent border-0 focus-visible:ring-0 font-mono text-sm leading-relaxed p-0"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!prompt.trim()} 
                    className="flex-1 neon-button bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Prompt
                  </Button>
                  <Button onClick={handleClear} variant="outline" className="border-border hover:border-primary/50">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {showFeedback && feedback && (
              <Card className="card-glow border-primary/20 fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {feedback.score === 100 ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="text-primary">Excellent Prompt!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-secondary" />
                        <span>Analysis Results</span>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Quality Score</span>
                      <span className="text-3xl font-bold gradient-text">{feedback.score}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={feedback.score} className="h-3" />
                      <div 
                        className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500 pulse-glow"
                        style={{ width: `${feedback.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'hasSubject', label: 'Subject', icon: '🎯' },
                      { key: 'hasStyle', label: 'Style', icon: '🎨' },
                      { key: 'hasDetails', label: 'Details', icon: '✨' },
                      { key: 'hasQuality', label: 'Quality', icon: '⚡' },
                    ].map((item) => {
                      const isPresent = feedback[item.key as keyof PromptFeedback] as boolean;
                      return (
                        <div
                          key={item.key}
                          className={`p-4 rounded-lg border transition-all ${
                            isPresent
                              ? 'bg-primary/10 border-primary/30 glow-border'
                              : 'bg-muted/50 border-border'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isPresent ? (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium">{item.icon} {item.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      AI Suggestions
                    </h3>
                    <div className="space-y-2">
                      {feedback.suggestions.map((suggestion, index) => (
                        <Alert key={index} className="border-primary/20 bg-primary/5">
                          <AlertDescription className="text-sm">{suggestion}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="card-glow border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { num: '1', text: 'Start with a clear subject', color: 'primary' },
                  { num: '2', text: 'Add style keywords', color: 'secondary' },
                  { num: '3', text: 'Include lighting & mood', color: 'accent' },
                  { num: '4', text: 'Specify quality parameters', color: 'chart-3' },
                ].map((tip) => (
                  <div key={tip.num} className="flex gap-3 items-start group">
                    <div className={`w-6 h-6 rounded-full bg-${tip.color}/20 border border-${tip.color}/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <span className={`text-xs font-bold text-${tip.color}`}>{tip.num}</span>
                    </div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{tip.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="card-glow border-secondary/20">
              <CardHeader>
                <CardTitle className="text-lg">Example Prompts</CardTitle>
                <CardDescription>Click to try</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {examplePrompts.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto text-left justify-start whitespace-normal p-4 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    onClick={() => {
                      setPrompt(example);
                      setShowFeedback(false);
                    }}
                  >
                    <span className="text-xs font-mono line-clamp-3 text-muted-foreground group-hover:text-foreground transition-colors">{example}</span>
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
