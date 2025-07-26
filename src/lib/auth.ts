import { app } from './firebase';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword, // Import for email/password sign-up
  signInWithEmailAndPassword,   // Import for email/password sign-in
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions

export const auth = getAuth(app);
const db = getFirestore(app); // Get Firestore instance

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    throw error; // Re-throw to be handled by the UI component
  }
};

export const signUpWithEmail = async (email: string, password: string, firstName: string, lastName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user information to Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName || '', // Save lastName if provided, otherwise an empty string
      email: user.email, // Optionally save email as well
      createdAt: new Date(), // Optional: add a creation timestamp
    });

  } catch (error) {
    console.error('Error signing up with email and password:', error);
    throw error; // Re-throw to be handled by the UI component
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
