// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY_,
  authDomain: process.env.AUTH_DOMAIN_,
  projectId: process.env.PROJECT_ID_,
  storageBucket: process.env.STORAGE_BUCKET_,
  messagingSenderId: process.env.MESSAGING_SENDER_ID_,
  appId: process.env.APP_ID_,
  measurementId: process.env.MEASUREMENT_ID_,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
