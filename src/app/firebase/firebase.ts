// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getDatabase } from 'firebase/database'


const firebaseConfig = {
  apiKey: "AIzaSyBiNprU9d5jnnf0w3aLSeGlPFjraJWfe3U",
  authDomain: "trainingappcris.firebaseapp.com",
  databaseURL: "https://trainingappcris-default-rtdb.firebaseio.com",
  projectId: "trainingappcris",
  storageBucket: "trainingappcris.firebasestorage.app",
  messagingSenderId: "630341374056",
  appId: "1:630341374056:web:dcc3b4ec186f9cd51aebdd",
  measurementId: "G-5T2XJJYB39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export default app;
export { db, auth, provider }