// Configuration Firebase pour RevoFit
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFY2nGt43sJHfdNn768E18uSPFeI_9lJw",
  authDomain: "revofit-db273.firebaseapp.com",
  databaseURL: "https://revofit-db273-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "revofit-db273",
  storageBucket: "revofit-db273.firebasestorage.app",
  messagingSenderId: "336045610131",
  appId: "1:336045610131:web:cb469cfb69587e6d206966",
  measurementId: "G-VKFX4WKRX9"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Auth avec persistance React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Firestore
export const firestore = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Analytics
export const analytics = getAnalytics(app);

// Émulateurs en développement
if (__DEV__) {
  // connectFirestoreEmulator(firestore, 'localhost', 8080);
}

export default app;
