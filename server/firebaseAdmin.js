import admin from 'firebase-admin';

// Initialize Firebase Admin with the project ID from the frontend config
admin.initializeApp({
  projectId: "xova-a54b3" // This matches the frontend firebase.js
});

export const auth = admin.auth();
