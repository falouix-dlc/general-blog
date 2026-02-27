'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface ArticleFormProps {
  categories: Category[];
  tags: Tag[];
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category_id: string | null;
    status: 'draft' | 'published';
    featured_image: string | null;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    article_tags?: { tag_id: string }[];
  };
}

export function ArticleForm({ categories, tags, action, initialData }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState(initialData?.content || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.article_tags?.map(t => t.tag_id) || []
  );

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!initialData) {
      setSlug(generateSlug(title));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set('content', content);
    formData.set('slug', slug);
    
    // Add selected tags
    selectedTags.forEach(tagId => {
      formData.append('tags', tagId);
    });

    try {
      await action(formData);
    } catch (error) {
      alert('Failed to save article');
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          name="title"
          defaultValue={initialData?.title}
          onChange={handleTitleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Article title"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug *
        </label>
        <input
          type="text"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          name="category_id"
          defaultValue={initialData?.category_id || ''}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTags.includes(tag.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          defaultValue={initialData?.excerpt}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Brief description for previews and SEO"
        />
      </div>

      {/* Content - Simple HTML Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content (HTML) *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          placeholder="<p>Write your article content in HTML...</p>"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Write HTML directly. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;pre&gt;, &lt;code&gt;, etc.
        </p>
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image URL
        </label>
        <input
          type="url"
          name="featured_image"
          defaultValue={initialData?.featured_image || ''}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* SEO Meta */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              name="meta_title"
              defaultValue={initialData?.meta_title}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave empty to use article title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              name="meta_description"
              defaultValue={initialData?.meta_description}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave empty to use excerpt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              name="meta_keywords"
              defaultValue={initialData?.meta_keywords}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="draft"
              defaultChecked={initialData?.status !== 'published'}
              className="mr-2"
            />
            <span>Draft</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="published"
              defaultChecked={initialData?.status === 'published'}
              className="mr-2"
            />
            <span>Published</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Article' : 'Create Article'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}