'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface DeleteArticleButtonProps {
  slug: string;
  title: string;
}

export function DeleteArticleButton({ slug, title }: DeleteArticleButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    const supabase = createClient();
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('slug', slug);

    if (!error) {
      router.refresh();
    } else {
      alert('Failed to delete article');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-sm text-red-600">Delete "{title}"?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
        >
          {isDeleting ? '...' : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-gray-600 hover:text-gray-700"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700"
    >
      Delete
    </button>
  );
}