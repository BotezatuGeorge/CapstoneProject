import { Navbar } from '../organisms';

interface PageLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

/** Base layout: sticky Navbar + scrollable content area */
export function PageLayout({ children, fullWidth = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className={`flex-1 ${fullWidth ? '' : 'max-w-screen-xl mx-auto w-full px-4 py-4'}`}>
        {children}
      </main>
    </div>
  );
}
