import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQTidaulAQLFxqb4DDELP5Rg8FLwBb69Q",
  authDomain: "qr-meni-213e4.firebaseapp.com",
  databaseURL: "https://qr-meni-213e4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "qr-meni-213e4",
  storageBucket: "qr-meni-213e4.firebasestorage.app",
  messagingSenderId: "646601002818",
  appId: "1:646601002818:web:9777c95bbcfee4e77bc2db",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
