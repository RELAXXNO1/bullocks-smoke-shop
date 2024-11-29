import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

export const checkUserRole = async (user) => {
  if (!user) return null;
  
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      return userDocSnap.data().role || 'user';
    }
    
    return 'user';
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};

export { app, db, auth, storage, analytics } from './config';