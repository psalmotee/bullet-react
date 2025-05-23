import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBaHen6QSnOH9gqmtXuHl0zDdyaljKnyfw",
  authDomain: "bulletproof-55e03.firebaseapp.com",
  projectId: "bulletproof-55e03",
  storageBucket: "bulletproof-55e03.firebasestorage.app",
  messagingSenderId: "1052485953859",
  appId: "1:1052485953859:web:0a113f7c3e63e37e0567f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);

export default app;
