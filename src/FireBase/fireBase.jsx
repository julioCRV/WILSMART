// Configuración e inicialización de Firebase en la aplicación

// Se importa la funcionalidad necesaria de Firebase para la app
import { initializeApp } from "firebase/app"; // Para inicializar la aplicación de Firebase
import { getAuth } from "firebase/auth"; // Para la autenticación de usuarios
import { getFirestore } from "firebase/firestore"; // Para la base de datos Firestore
import { getStorage } from "firebase/storage"; // Para el almacenamiento de archivos

// Configuración de Firebase con las claves y parámetros específicos del proyecto
const firebaseConfig = {
    apiKey: "AIzaSyB3z2EjI6uxj9sP-lyUg77rvxAJuO-1pyI", // Clave API para acceso a los servicios de Firebase
    authDomain: "bd-wilsmart.firebaseapp.com", // Dominio de autenticación
    projectId: "bd-wilsmart", // ID del proyecto Firebase
    storageBucket: "bd-wilsmart.appspot.com", // Bucket de almacenamiento en Firebase
    messagingSenderId: "722305794719", // ID del remitente de mensajes (para notificaciones)
    appId: "1:722305794719:web:024468d96eadc9534e98aa" // ID único de la aplicación
  };

// Inicialización de la aplicación Firebase con la configuración
const app = initializeApp(firebaseConfig);

// Obtención de instancias de los servicios de Firebase
const auth = getAuth(app); // Instancia del servicio de autenticación
const db = getFirestore(app); // Instancia de la base de datos Firestore
const storage = getStorage(app); // Instancia del servicio de almacenamiento

// Exportación de las instancias para ser usadas en otras partes de la app
export { auth, db, storage };
