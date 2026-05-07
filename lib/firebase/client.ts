'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export interface FirebaseSdks {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
}

export { firebaseApp, auth, db };

export function getFirebaseSdks(): FirebaseSdks {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  };
}
