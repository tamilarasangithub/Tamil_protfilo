import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
const db = getFirestore(app);

async function check() {
  console.log("Fetching database...");
  const docRef = doc(db, 'portfolio', 'main');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    console.log("Database exists!");
    console.log("Number of projects:", data.projects?.length);
    console.log("Number of certs:", data.certifications?.length);
    console.log("Last Update:", data.lastUpdate);
  } else {
    console.log("Database does NOT exist!");
  }
  process.exit(0);
}

check().catch(console.error);
