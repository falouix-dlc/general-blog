'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from '@/lib/utils';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface CommentsProps {
  articleId: string;
}

export function Comments({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    // Fetch existing comments
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('article_id', articleId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      setComments(data || []);
    };

    fetchComments();

    // Subscribe to new comments
    const channel = supabase
      .channel(`comments-${articleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `article_id=eq.${articleId}`,
        },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('Please sign in to comment');
      setIsSubmitting(false);
      return;
    }

    await supabase.from('comments').insert({
      article_id: articleId,
      content: newComment,
      author_id: user.id,
      status: 'pending', // Requires approval
    });

    setNewComment('');
    setIsSubmitting(false);
    alert('Comment submitted for approval');
  };

  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
              {(comment.profiles?.full_name || comment.profiles?.username || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">
                  {comment.profiles?.full_name || comment.profiles?.username || 'Anonymous'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at))}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}