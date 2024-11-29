import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail as updateAuthEmail,
  updatePassword as updateAuthPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export const authService = {
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  register: async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return userCredential.user;
  },

  logout: () => signOut(auth),

  resetPassword: (email) => sendPasswordResetEmail(auth, email),

  updateEmail: (email) => {
    const user = auth.currentUser;
    if (user) {
      return updateAuthEmail(user, email);
    }
    throw new Error('No authenticated user');
  },

  updatePassword: (password) => {
    const user = auth.currentUser;
    if (user) {
      return updateAuthPassword(user, password);
    }
    throw new Error('No authenticated user');
  }
};