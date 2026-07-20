import admin from 'firebase-admin';

let authInstance = null;
try {
  // Initialize Firebase Admin with the project ID from the frontend config
  admin.initializeApp({
    projectId: "xova-a54b3"
  });
  authInstance = admin.auth();
} catch (error) {
  console.error("Firebase Admin initialization error (safe to ignore if not using auth):", error);
}

export const auth = authInstance;
