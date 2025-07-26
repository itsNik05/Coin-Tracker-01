'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, FileText, PanelLeft, LogOut, LogIn, User as UserIcon, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/budgets', label: 'Budgets', icon: Wallet },
  { href: '/reports', label: 'Reports', icon: FileText },
];

const AppLogo = () => (
    <Link href="/" className="group flex items-center gap-2 px-2.5 mb-4 text-xl font-semibold text-foreground">
        <Package className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
        <span>Coin Tracker</span>
    </Link>
);


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

  const getInitials = (name: string | null) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  const userDisplay = (
    <div className="flex flex-col items-center gap-2 px-2.5 py-4 text-center">
      <Avatar className="h-20 w-20">
        <AvatarImage src={user?.photoURL || undefined} />
        <AvatarFallback>
          {userName ? getInitials(userName) : <UserIcon className="h-10 w-10" />}
        </AvatarFallback>
      </Avatar>
      {userName && <p className="text-lg font-semibold">{userName}</p>}
    </div>
  );

  const navContent = (
    <nav className="grid gap-6 text-lg font-medium">
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
        <AppLogo />
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
              <AppLogo />
              {user ? userDisplay : <div className="h-[124px]" />}
              {navContent}
              <div className="flex-grow" />
              {authSection}
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
