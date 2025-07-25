import { app } from './firebase';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';

export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

export const signInWithMicrosoft = async () => {
  try {
    await signInWithPopup(auth, microsoftProvider);
  } catch (error) {
    console.error('Error signing in with Microsoft:', error);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
