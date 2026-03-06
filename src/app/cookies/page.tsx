import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/blog/Navbar';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How we use cookies.',
};

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: March 2025
            </p>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">What Are Cookies</h2>
              <p>
                Cookies are small text files stored on your device when you visit 
                a website. They help the site remember your preferences and 
                improve your experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Cookies We Use</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <h3 className="font-semibold text-foreground mb-1">Essential Cookies</h3>
                  <p className="text-sm">
                    Required for the site to function. These enable core features 
                    like user authentication and theme preferences. You cannot 
                    disable these.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <h3 className="font-semibold text-foreground mb-1">Analytics Cookies</h3>
                  <p className="text-sm">
                    Help us understand how visitors interact with the site. 
                    These are anonymous and don't track you across other sites. 
                    You can opt out of these.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">What We Don't Use</h2>
              <p>
                We do not use:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Advertising or marketing cookies</li>
                <li>Third-party tracking cookies</li>
                <li>Social media tracking pixels</li>
                <li>Behavioral profiling cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Managing Cookies</h2>
              <p>
                You can control cookies through your browser settings. Most browsers 
                allow you to block or delete cookies. Note that disabling essential 
                cookies may affect site functionality.
              </p>
              <p>
                To opt out of analytics cookies, you can enable "Do Not Track" in 
                your browser or use our cookie preference settings (coming soon).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Changes to This Policy</h2>
              <p>
                We may update this policy as our cookie practices evolve. Changes 
                will be posted here with an updated date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
              <p>
                Questions about our cookie usage? Contact us at{' '}
                <a href="mailto:falouix@falouix.com" className="text-primary hover:underline">falouix@falouix.com</a>.
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