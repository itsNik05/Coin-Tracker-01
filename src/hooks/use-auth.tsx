'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle, signOut as firebaseSignOut, signInWithEmail, signUpWithEmail } from '@/lib/auth';
import { doc, getFirestore, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const db = getFirestore(app);

interface AuthContextType {
  user: User | null;
  userName: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, firstName: string, lastName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        
        // Use displayName from Auth profile first, as it's updated on sign-up/Google sign-in
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          // As a fallback, try to get from Firestore. This might be for older accounts.
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setUserName(`${userData.firstName} ${userData.lastName || ''}`.trim());
            } else {
              setUserName(user.email); // Final fallback
            }
          } catch (error) {
            console.error("Firestore fetch failed, using email as fallback:", error);
            setUserName(user.email); // Fallback on error
          }
        }
      } else {
        setUser(null);
        setUserName(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const handleSignOut = async () => {
    await firebaseSignOut();
    router.push('/login');
  };
  
  const value = { 
    user, 
    userName, 
    loading, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    signOut: handleSignOut 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
