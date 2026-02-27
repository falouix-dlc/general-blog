'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ViewCounterProps {
  articleId: string;
  initialCount: number;
}

export function ViewCounter({ articleId, initialCount }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // Subscribe to realtime view count updates
    const supabase = createClient();
    
    const channel = supabase
      .channel(`article-${articleId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'articles',
          filter: `id=eq.${articleId}`,
        },
        (payload) => {
          if (payload.new.view_count !== payload.old.view_count) {
            setCount(payload.new.view_count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId]);

  return <span>{count.toLocaleString()} views</span>;
}