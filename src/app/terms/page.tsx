import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/blog/Navbar';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The rules for using this website.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: March 2025
            </p>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Using the Site</h2>
              <p>
                By using this website, you agree to these terms. Don't use the site 
                to do anything illegal, harmful, or that interferes with others' use 
                of the site. We reserve the right to suspend access for violations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Your Account</h2>
              <p>
                If you create an account, you're responsible for keeping your 
                password secure. Don't share your account credentials. Let us know 
                immediately if you suspect unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Content</h2>
              <p>
                Articles and content on this site are for informational purposes only. 
                Opinions expressed belong to the authors. We don't guarantee accuracy 
                or completeness—use your own judgment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Comments</h2>
              <p>
                We welcome discussion, but keep it respectful. No harassment, spam, 
                hate speech, or illegal content. We may remove comments and suspend 
                accounts that violate this standard at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
              <p>
                Articles and original content are owned by their respective authors. 
                You may share links and quote brief excerpts with attribution. 
                Don't republish full articles without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Disclaimer</h2>
              <p>
                This site is provided "as is" without warranties of any kind. We're 
                not liable for damages arising from your use of the site or reliance 
                on any content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Changes to Terms</h2>
              <p>
                We may update these terms. Continued use after changes constitutes 
                acceptance. Significant changes will be noted on the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Governing Law</h2>
              <p>
                These terms are governed by the laws of [Your Jurisdiction]. 
                Disputes will be resolved in the courts of [Your Jurisdiction].
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact</h2>
              <p>
                Questions about these terms? Reach us at{' '}
                <a href="mailto:legal@example.com" className="text-primary hover:underline">legal@example.com</a>.
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