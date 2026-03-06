import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { ThemeToggle } from '@/components/theme/ThemeToggle';
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirectTo || '/admin';

  async function login(formData: FormData) {
    'use server';

    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
    }

    redirect(redirectTo);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
     
      <div className="max-w-md w-full bg-card rounded-xl border shadow-sm p-8">
        <div className="flex items-center justify-between p-4">
    <Link 
      href="/"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Homepage
    </Link>
    <ThemeToggle />
  </div>
      

        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        
        {params.error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-sm">
            {params.error}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}