import { doc, getDoc } from 'firebase/firestore';
import { db } from './index';

export const checkUserRole = async (uid) => {
  if (!uid) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};

export const isAdmin = async (user) => {
  if (!user?.uid) return false;
  const role = await checkUserRole(user.uid);
  return role === 'admin';
};