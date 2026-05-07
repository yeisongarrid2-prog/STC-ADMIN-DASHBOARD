import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App;

if (getApps().length === 0) {
  // En producción (Vercel, etc.) con Firebase App Hosting o similar, 
  // initializeApp() sin argumentos puede funcionar si las credenciales están en el entorno.
  // Para desarrollo local con Service Account, se usaría cert().
  
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
    : undefined;

  if (serviceAccount) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Intento de inicialización por defecto (Google Application Default Credentials)
    adminApp = initializeApp();
  }
} else {
  adminApp = getApps()[0];
}

export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);
export { adminApp };
