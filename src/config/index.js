import { env } from './env';
import { firebaseConfig } from './firebase/config';
import { app, db, auth, storage, analytics, checkUserRole, isAdmin } from './firebase';
import { firestoreService } from './firebase/firestore';
import { storageService } from './firebase/storage';

export {
  env,
  firebaseConfig,
  app,
  db,
  auth,
  storage,
  analytics,
  checkUserRole,
  isAdmin,
  firestoreService,
  storageService
};