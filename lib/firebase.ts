import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage"; // FirebaseStorage টাইপ ইমপোর্ট করা হলো

const firebaseConfig = {
  apiKey: "AIzaSyCIUFUwB8Wj9T26iwMfFF6oBb5qO9wG2y4",
  authDomain: "dia-medical.firebaseapp.com",
  projectId: "dia-medical",
  storageBucket: "dia-medical.firebasestorage.app",
  messagingSenderId: "186980617952",
  appId: "1:186980617952:web:7bf30ad404b538b9404a85"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app); // স্টোরেজ ইনিশিয়ালাইজ করা হলো

export { auth, db, storage }; // এখানে storage এক্সপোর্ট করে দিন