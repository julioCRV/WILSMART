// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB3z2EjI6uxj9sP-lyUg77rvxAJuO-1pyI",
    authDomain: "bd-wilsmart.firebaseapp.com",
    projectId: "bd-wilsmart",
    storageBucket: "bd-wilsmart.appspot.com",
    messagingSenderId: "722305794719",
    appId: "1:722305794719:web:024468d96eadc9534e98aa"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Obtén la instancia del servicio de almacenamiento

export { auth, db, storage };
