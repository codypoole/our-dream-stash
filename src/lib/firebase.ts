import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtPYbikVELg5p9aSSdnxXvy1ap5tcAUZM",
  authDomain: "wish-list-4ad9b.firebaseapp.com",
  projectId: "wish-list-4ad9b",
  storageBucket: "wish-list-4ad9b.firebasestorage.app",
  messagingSenderId: "254289748631",
  appId: "1:254289748631:web:1d53ba64d13291b06bffd2",
  measurementId: "G-8NXPH4NC8E",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
