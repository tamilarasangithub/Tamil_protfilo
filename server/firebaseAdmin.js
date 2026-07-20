import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let authInstance = null;
try {
  // Initialize Firebase Admin with the project ID from the frontend config
  const app = initializeApp({
    projectId: "xova-a54b3"
  });
  authInstance = getAuth(app);
} catch (error) {
  console.error("Firebase Admin initialization error (safe to ignore if not using auth):", error);
}

export const auth = authInstance;
