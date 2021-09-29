import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBN9wNlrWJPUawNIXp_6LnXkDwbOj_1pYI",
  authDomain: "oos-community.firebaseapp.com",
  projectId: "oos-community",
  storageBucket: "oos-community.appspot.com",
  messagingSenderId: "846619387078",
  appId: "1:846619387078:web:47c66449e537d58a5fe3c7",
};

const app = initializeApp(firebaseConfig);

export const authService = getAuth(app);
export const dbService = getFirestore(app);
