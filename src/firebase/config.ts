import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDQqUFLDDlLPQc-crdioJ3Gt-tfQmc2G48",
  authDomain: "carnotes-95636.firebaseapp.com",
  projectId: "carnotes-95636",
  storageBucket: "carnotes-95636.firebasestorage.app",
  messagingSenderId: "425264268104",
  appId: "1:425264268104:web:47fb89d0a9721bb2fee97d"
};

// Инициализиране на Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Експортиране на auth за използване в други компоненти
export const auth = getAuth(app);
export { db, collection, addDoc, getDocs, deleteDoc, doc };

