'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Chrome, LogIn } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Corrected import for the Microsoft icon SVG
const MicrosoftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z"/>
      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
      <path fill="#FFB900" d="M13 13h10v10H13z"/>
    </svg>
);

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithMicrosoft } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome to BudgetFlow</CardTitle>
          <CardDescription>Sign in to manage your finances.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={signInWithGoogle} variant="outline">
            <Chrome className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
          <Button onClick={signInWithMicrosoft} variant="outline">
            <MicrosoftIcon />
            Sign in with Microsoft
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
