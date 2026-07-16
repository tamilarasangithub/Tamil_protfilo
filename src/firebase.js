import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIp9I4KS3J1MdkspK3s-PdVdjP-KQ-hn4",
  authDomain: "xova-a54b3.firebaseapp.com",
  projectId: "xova-a54b3",
  storageBucket: "xova-a54b3.firebasestorage.app",
  messagingSenderId: "187514051193",
  appId: "1:187514051193:web:c614808806b5b3ddc4d2a8",
  measurementId: "G-23KKL74Q20"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
