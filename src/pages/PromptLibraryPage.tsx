import { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllPrompts } from '@/db/api';
import type { Prompt } from '@/types';
import { Copy, Check, Search, Library, Terminal, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PromptLibraryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const data = await getAllPrompts();
        setPrompts(data);
        setFilteredPrompts(data);
      } catch (error) {
        console.error('Error loading prompts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPrompts();
  }, []);

  useEffect(() => {
    let filtered = prompts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.prompt_text.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    setFilteredPrompts(filtered);
  }, [searchQuery, selectedCategory, prompts]);

  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopiedId(prompt.id);
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard',
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy prompt',
        variant: 'destructive',
      });
    }
  };

  const categories = ['Nature', 'Technology', 'Education', 'Cinematic'];
  const difficulties = ['basic', 'intermediate', 'advanced'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'border-primary/30 text-primary bg-primary/10';
      case 'intermediate':
        return 'border-secondary/30 text-secondary bg-secondary/10';
      case 'advanced':
        return 'border-accent/30 text-accent bg-accent/10';
      default:
        return 'border-border text-foreground';
    }
  };

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
      <div className="container mx-auto p-6 space-y-6 fade-in">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
            <Library className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Prompt Library</h1>
            <p className="text-muted-foreground">
              Browse and copy ready-made prompts for your projects
            </p>
          </div>
        </div>

        <Card className="card-glow border-primary/20">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
              <Input
                placeholder="Search prompts by title, category, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5 bg-card border border-border">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">All</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4 mt-6">
            {filteredPrompts.length === 0 ? (
              <Card className="card-glow">
                <CardContent className="py-12 text-center">
                  <Terminal className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No prompts found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredPrompts.map((prompt) => (
                  <Card key={prompt.id} className="card-glow group">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Code2 className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">{prompt.title}</CardTitle>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="border-border">{prompt.category}</Badge>
                            <Badge variant="outline" className={getDifficultyColor(prompt.difficulty)}>
                              {prompt.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(prompt)}
                          className="shrink-0 neon-button border-primary/30 hover:bg-primary/10 hover:border-primary"
                        >
                          {copiedId === prompt.id ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-primary" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prompt-console">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                          <Terminal className="w-3 h-3 text-primary" />
                          <span className="text-xs font-mono text-primary">prompt.txt</span>
                        </div>
                        <p className="text-sm font-mono leading-relaxed text-foreground/90">{prompt.prompt_text}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card className="card-glow border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Library className="w-5 h-5 text-accent" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Browse prompts by category or search for specific topics</p>
            <p>2. Click the Copy button to copy a prompt to your clipboard</p>
            <p>3. Paste the prompt into your favorite AI image/video generator</p>
            <p>4. Modify the prompt to match your specific needs</p>
            <p>5. Experiment with different variations to get the best results</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
