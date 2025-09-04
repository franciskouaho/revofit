// Service d'authentification Firebase pour RevoFit
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, firestore } from './config';

// Types pour l'onboarding
export interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: 'homme' | 'femme' | 'autre';
  age: number;
  height: number; // en cm
  weight: number; // en kg
  goals: string[];
  experienceLevel: 'débutant' | 'intermédiaire' | 'avancé';
  targetWeight?: number;
  weeklyWorkouts: number;
}

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  goals: string[];
  experienceLevel: string;
  targetWeight?: number;
  weeklyWorkouts: number;
  createdAt: any;
  lastUpdated: any;
  onboardingCompleted: boolean;
}

// Connexion utilisateur
export const signInUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error('Erreur de connexion: ' + error.message);
  }
};

// Inscription utilisateur avec données d'onboarding
export const signUpUser = async (onboardingData: OnboardingData): Promise<User> => {
  try {
    // Création du compte Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      onboardingData.email, 
      onboardingData.password
    );
    
    const user = userCredential.user;
    
    // Mise à jour du profil Firebase Auth
    await updateProfile(user, {
      displayName: `${onboardingData.firstName} ${onboardingData.lastName}`
    });
    
    // Création du profil utilisateur dans Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      firstName: onboardingData.firstName,
      lastName: onboardingData.lastName,
      email: onboardingData.email,
      gender: onboardingData.gender,
      age: onboardingData.age,
      height: onboardingData.height,
      weight: onboardingData.weight,
      goals: onboardingData.goals,
      experienceLevel: onboardingData.experienceLevel,
      targetWeight: onboardingData.targetWeight,
      weeklyWorkouts: onboardingData.weeklyWorkouts,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      onboardingCompleted: true
    };
    
    // Sauvegarde du profil principal
    await setDoc(doc(firestore, 'users', user.uid, 'profile', 'main'), userProfile);
    
    // Création des objectifs initiaux
    await setDoc(doc(firestore, 'users', user.uid, 'goals', 'main'), {
      fitnessGoals: onboardingData.goals,
      targetWeight: onboardingData.targetWeight,
      weeklyWorkouts: onboardingData.weeklyWorkouts,
      experienceLevel: onboardingData.experienceLevel,
      createdAt: serverTimestamp()
    });
    
    // Création des préférences utilisateur
    await setDoc(doc(firestore, 'users', user.uid, 'preferences', 'main'), {
      notifications: true,
      reminders: true,
      dataSharing: true,
      theme: 'dark',
      language: 'fr',
      createdAt: serverTimestamp()
    });
    
    return user;
  } catch (error: any) {
    throw new Error('Erreur d\'inscription: ' + error.message);
  }
};

// Déconnexion
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Erreur de déconnexion: ' + error.message);
  }
};

// Récupération du profil utilisateur
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', uid, 'profile', 'main'));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    throw new Error('Erreur récupération profil: ' + error.message);
  }
};

// Mise à jour du profil utilisateur
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    await setDoc(doc(firestore, 'users', uid, 'profile', 'main'), {
      ...updates,
      lastUpdated: serverTimestamp()
    }, { merge: true });
  } catch (error: any) {
    throw new Error('Erreur mise à jour profil: ' + error.message);
  }
};

// Écoute des changements d'état d'authentification
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Validation des données d'onboarding
export const validateOnboardingData = (data: Partial<OnboardingData>) => {
  const errors: Record<string, string> = {};
  
  if (!data.firstName?.trim()) {
    errors.firstName = 'Le prénom est requis';
  }
  
  if (!data.lastName?.trim()) {
    errors.lastName = 'Le nom est requis';
  }
  
  if (!data.email?.trim()) {
    errors.email = 'L\'email est requis';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'L\'email n\'est pas valide';
  }
  
  if (!data.password) {
    errors.password = 'Le mot de passe est requis';
  } else if (data.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
  }
  
  if (!data.gender) {
    errors.gender = 'Le genre est requis';
  }
  
  if (!data.age || data.age < 13 || data.age > 100) {
    errors.age = 'L\'âge doit être entre 13 et 100 ans';
  }
  
  if (!data.height || data.height < 100 || data.height > 250) {
    errors.height = 'La taille doit être entre 100 et 250 cm';
  }
  
  if (!data.weight || data.weight < 30 || data.weight > 300) {
    errors.weight = 'Le poids doit être entre 30 et 300 kg';
  }
  
  if (!data.goals || data.goals.length === 0) {
    errors.goals = 'Au moins un objectif doit être sélectionné';
  }
  
  if (!data.experienceLevel) {
    errors.experienceLevel = 'Le niveau d\'expérience est requis';
  }
  
  if (!data.weeklyWorkouts || data.weeklyWorkouts < 1 || data.weeklyWorkouts > 7) {
    errors.weeklyWorkouts = 'Le nombre d\'entraînements doit être entre 1 et 7 par semaine';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
