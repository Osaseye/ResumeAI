import { type ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { MobileNavBar } from '@/components/dashboard/MobileNavBar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden relative pb-20 md:pb-0">
        <Header />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
        </div>
        <MobileNavBar />
      </main>
    </div>
  );
};
