import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/blog/Navbar';
import { Mail, Twitter, Github, Send, ArrowLeft, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with us.',
};

export default function ContactPage() {
  async function submitForm(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // TODO: Connect to your email service (Resend, SendGrid, etc.)
    // For now, just log or store in database
    console.log({ name, email, subject, message });

    // Redirect with success param
    // redirect('/contact?success=true');
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Left side - Info */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Get in touch</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Have a question, suggestion, or collaboration idea? 
                Fill out the form or reach out directly.
              </p>

              <div className="space-y-4">
                <a 
                  href="mailto:falouix@falouix.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  falouix@falouix.com
                </a>
                <a 
                  href="https://twitter.com/falouix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  @falouix
                </a>
                <a 
                  href="https://github.com/falouix-dlc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-5 h-5" />
                  github.com/falouix-dlc
                </a>
              </div>

              <div className="mt-12 p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground">
                  We typically respond within 2-3 business days. 
                  For quick questions, Twitter DM is fastest.
                </p>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="bg-card rounded-2xl border p-6 md:p-8">
              <form action={submitForm} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General inquiry</option>
                    <option value="feedback">Article feedback</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="bug">Report a bug</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground resize-none"
                    placeholder="How can we help?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}