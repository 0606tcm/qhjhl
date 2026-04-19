'use client';

import { Header } from './Header';
import { AgentPanel } from '@/components/agent';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-warm-50">
      <Header />
      <main className="pt-14">
        <div className="max-w-[1440px] mx-auto px-6 py-6">{children}</div>
      </main>
      <AgentPanel />
    </div>
  );
}

export { Header } from './Header';
export { Logo } from './Logo';
export { ViewSwitcher } from './ViewSwitcher';
