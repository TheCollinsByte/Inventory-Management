import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.API_KEY_,
  authDomain: process.env.AUTH_DOMAIN_,
  projectId: process.env.PROJECT_ID_,
  storageBucket: process.env.STORAGE_BUCKET_,
  messagingSenderId: process.env.MESSAGING_SENDER_ID_,
  appId: process.env.APP_ID_,
  measurementId: process.env.MEASUREMENT_ID_,
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
