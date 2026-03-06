import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/blog/Navbar';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How we handle your data.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: March 2025
            </p>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">What We Collect</h2>
              <p>
                We collect minimal data to operate this blog. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Account information (email, username) if you create an account</li>
                <li>Comments you choose to leave on articles</li>
                <li>Anonymous analytics (page views, popular content)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">What We Don't Do</h2>
              <p>
                We don't sell your data. We don't use third-party tracking cookies. 
                We don't share your information with advertisers or data brokers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Analytics</h2>
              <p>
                We use privacy-focused analytics to understand which articles resonate 
                with readers. This data is aggregated and anonymous—we can't trace it 
                back to individual users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
              <p>
                We use essential cookies to keep you logged in and remember your 
                theme preference (light/dark mode). No tracking cookies, no ad targeting.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights</h2>
              <p>
                You can request a copy of your data, correct inaccurate information, 
                or delete your account and associated data at any time. 
                Contact us at <a href="mailto:privacy@example.com" className="text-primary hover:underline">privacy@example.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Changes</h2>
              <p>
                If we update this policy, we'll post the changes here. Significant 
                changes will be announced via a site notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
              <p>
                Questions about this policy? Reach out at{' '}
                <a href="mailto:privacy@example.com" className="text-primary hover:underline">privacy@example.com</a>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}