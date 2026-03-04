import { Navbar } from '@/components/blog/Navbar';
import { Footer } from '@/components/blog/Footer';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-300">
      <Navbar/>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}