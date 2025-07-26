'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, FileText, PanelLeft, Bot, LogOut, LogIn, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/budgets', label: 'Budgets', icon: Wallet },
  { href: '/reports', label: 'Reports', icon: FileText },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, userName, signOut, loading } = useAuth();

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  const userDisplay = (
    <div className="flex flex-col items-center gap-2 px-2.5 py-4 text-center">
      <Avatar>
        <AvatarImage src={user?.photoURL || undefined} />
        <AvatarFallback>
          {userName ? userName.charAt(0).toUpperCase() : <UserIcon />}
        </AvatarFallback>
      </Avatar>
      <span className="font-bold text-lg">{userName || 'Welcome'}</span>
    </div>
  );

  const navContent = (
    <nav className="grid gap-6 text-lg font-medium">
      <Link
        href="/"
        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base mb-4"
      >
        <Bot className="h-5 w-5 transition-all group-hover:scale-110" />
        <span className="sr-only">BudgetFlow</span>
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-4 px-2.5 ${pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const authSection = (
    <div className="mt-auto">
      {user ? (
        <button onClick={signOut} className="flex w-full items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      ) : (
        <Link href="/login" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
          <LogIn className="h-5 w-5" />
          Login
        </Link>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background p-4 sm:flex">
        {user ? userDisplay : <div className="h-[124px]" />}
        {navContent}
        <div className="flex-grow" />
        {authSection}
      </aside>
      <div className="flex flex-col sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs flex flex-col p-4">
              {user ? userDisplay : <div className="h-[124px]" />}
              {navContent}
              <div className="flex-grow" />
              {authSection}
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
