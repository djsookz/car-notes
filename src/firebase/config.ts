import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDQqUFLDDlLPQc-crdioJ3Gt-tfQmc2G48",
  authDomain: "carnotes-95636.firebaseapp.com",
  projectId: "carnotes-95636",
  storageBucket: "carnotes-95636.firebasestorage.app",
  messagingSenderId: "425264268104",
  appId: "1:425264268104:web:47fb89d0a9721bb2fee97d"
};


// Инициализация на Firebase
const app = initializeApp(firebaseConfig);

// Получаваме Firestore и Auth инстанции
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, addDoc, getDocs, deleteDoc, doc, query, where };

