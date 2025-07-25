'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, PieChart, FileText, PanelLeft, Bot, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/budgets', label: 'Budgets', icon: Wallet },
  { href: '/reports', label: 'Reports', icon: FileText },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-2xl font-semibold">Loading...</div>
        </div>
    )
  }

  if (!user) {
    // This should be handled by the useAuth hook redirecting, but as a fallback
    return null;
  }

  const navContent = (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Bot className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">BudgetFlow</span>
        </Link>
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={signOut} className="h-9 w-9 text-muted-foreground hover:text-foreground">
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Logout</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        {navContent}
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Bot className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">BudgetFlow</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-2.5 ${
                      pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <button onClick={signOut} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="font-headline text-xl font-semibold">
            {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
}
