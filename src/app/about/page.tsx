import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/blog/Navbar';
import { ArrowLeft, Rss } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'What this publication is about.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <h1 className="text-4xl font-bold tracking-tight mb-6">About</h1>
          
          <div className="prose prose-lg text-muted-foreground">
            <p className="lead">
              This is a publication focused on in-depth writing about technology, 
              design, and the craft of building digital products.
            </p>

            <h3>What we cover</h3>
            <ul>
              <li>Frontend engineering and architecture decisions</li>
              <li>Product design and user experience</li>
              <li>Developer tools and workflows</li>
              <li>Essays on building software teams</li>
            </ul>

            <h3>Editorial approach</h3>
            <p>
              We prioritize depth over speed. No news coverage, no clickbait, 
              no sponsored content. Just clear, practical writing for people 
              who build things.
            </p>

            <h3>Contact</h3>
            <p>
              For questions, corrections, or proposals:{' '}
              <a href="mailto:hello@example.com" className="text-foreground underline underline-offset-4">
                hello@example.com
              </a>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t flex items-center gap-4 text-sm text-muted-foreground">
            <a href="/rss.xml" className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
              <Rss className="w-4 h-4" />
              RSS Feed
            </a>
          </div>
        </div>
      </main>
    </>
  );
}