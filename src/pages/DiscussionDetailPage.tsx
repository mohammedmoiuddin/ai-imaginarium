import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getDiscussionById, getRepliesByDiscussion, createReply, deleteDiscussion, deleteReply } from '@/db/api';
import type { Discussion, DiscussionReply } from '@/types';
import { ArrowLeft, User, Clock, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function DiscussionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDiscussion();
  }, [id]);

  const loadDiscussion = async () => {
    if (!id) return;
    try {
      const [discussionData, repliesData] = await Promise.all([
        getDiscussionById(id),
        getRepliesByDiscussion(id),
      ]);
      setDiscussion(discussionData);
      setReplies(repliesData);
    } catch (error) {
      console.error('Error loading discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to load discussion',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!profile || !id || !replyContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a reply',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await createReply(id, profile.id, replyContent);
      toast({
        title: 'Success',
        description: 'Reply posted successfully',
      });
      setReplyContent('');
      loadDiscussion();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post reply',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDiscussion = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this discussion?')) return;

    try {
      await deleteDiscussion(id);
      toast({
        title: 'Success',
        description: 'Discussion deleted successfully',
      });
      navigate('/forum');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete discussion',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    try {
      await deleteReply(replyId);
      toast({
        title: 'Success',
        description: 'Reply deleted successfully',
      });
      loadDiscussion();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete reply',
        variant: 'destructive',
      });
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

  if (!discussion) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6 max-w-4xl">
          <Alert variant="destructive">
            <AlertDescription>Discussion not found</AlertDescription>
          </Alert>
          <Button asChild className="mt-4">
            <Link to="/forum">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const canDelete = profile?.id === discussion.user_id || profile?.role === 'admin';

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <Button asChild variant="ghost">
          <Link to="/forum">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-3">{discussion.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{discussion.username}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}</span>
                  </div>
                  {discussion.category && (
                    <Badge variant="secondary">{discussion.category}</Badge>
                  )}
                </div>
              </div>
              {canDelete && (
                <Button variant="destructive" size="sm" onClick={handleDeleteDiscussion}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {discussion.content}
            </p>
          </CardContent>
        </Card>

        <Separator />

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Replies ({replies.length})
          </h2>

          <div className="space-y-4">
            {replies.map((reply) => {
              const canDeleteReply = profile?.id === reply.user_id || profile?.role === 'admin';
              return (
                <Card key={reply.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{reply.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                      {canDeleteReply && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReply(reply.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post a Reply</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[120px]"
            />
            <Button onClick={handleSubmitReply} disabled={submitting || !replyContent.trim()}>
              {submitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
