// Service d'authentification Firebase pour RevoFit
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { auth, firestore } from './config';

// Configuration pour WebBrowser
WebBrowser.maybeCompleteAuthSession();

// Types pour l'onboarding
export interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: 'homme' | 'femme';
  age: number;
  height: number; // en cm
  weight: number; // en kg
  goals: string[];
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
  targetWeight?: number;
  weeklyWorkouts: number;
  createdAt: any;
  lastUpdated: any;
  onboardingCompleted: boolean;
}

// Gestionnaire d'erreurs Firebase
const handleAuthError = (error: any): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cet email';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    case 'auth/invalid-email':
      return 'Adresse email invalide';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer plus tard';
    case 'auth/network-request-failed':
      return 'Erreur de connexion. Vérifiez votre internet';
    case 'auth/email-already-in-use':
      return 'Cette adresse email est déjà utilisée. Voulez-vous vous connecter à la place ?';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible';
    default:
      return error.message || 'Une erreur inattendue s\'est produite';
  }
};

// Connexion utilisateur
export const signInUser = async (email: string, password: string): Promise<User> => {
  try {
    // Validation des entrées
    if (!email.trim()) {
      throw new Error('L\'email est requis');
    }
    if (!password) {
      throw new Error('Le mot de passe est requis');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return userCredential.user;
  } catch (error: any) {
    const errorMessage = error.code ? handleAuthError(error) : error.message;
    throw new Error(errorMessage);
  }
};

// Validation des données d'onboarding (interne)
const validateOnboardingDataInternal = (data: OnboardingData): void => {
  if (!data.firstName?.trim()) {
    throw new Error('Le prénom est requis');
  }
  if (!data.lastName?.trim()) {
    throw new Error('Le nom est requis');
  }
  if (!data.email?.trim()) {
    throw new Error('L\'email est requis');
  }
  if (!/\S+@\S+\.\S+/.test(data.email)) {
    throw new Error('L\'email n\'est pas valide');
  }
  if (!data.password || data.password.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }
  if (!data.gender) {
    throw new Error('Le genre est requis');
  }
  if (!data.age || data.age < 13 || data.age > 100) {
    throw new Error('L\'âge doit être entre 13 et 100 ans');
  }
  if (!data.height || data.height < 100 || data.height > 250) {
    throw new Error('La taille doit être entre 100 et 250 cm');
  }
  if (!data.weight || data.weight < 30 || data.weight > 300) {
    throw new Error('Le poids doit être entre 30 et 300 kg');
  }
  if (!data.goals || data.goals.length === 0) {
    throw new Error('Au moins un objectif doit être sélectionné');
  }
  if (!data.weeklyWorkouts || data.weeklyWorkouts < 1 || data.weeklyWorkouts > 7) {
    throw new Error('Le nombre d\'entraînements doit être entre 1 et 7 par semaine');
  }
};

// Inscription utilisateur avec données d'onboarding
export const signUpUser = async (onboardingData: OnboardingData): Promise<User> => {
  try {
    // Validation des données
    validateOnboardingDataInternal(onboardingData);

    // Vérifier si l'utilisateur est déjà connecté
    if (auth.currentUser) {
      console.log('Utilisateur déjà connecté, déconnexion...');
      await signOut(auth);
    }

    let userCredential;
    
    try {
      // Essayer de créer un nouveau compte
      userCredential = await createUserWithEmailAndPassword(
        auth, 
        onboardingData.email.trim(), 
        onboardingData.password
      );
    } catch (error: any) {
      // Si l'email existe déjà, essayer de se connecter
      if (error.code === 'auth/email-already-in-use') {
        console.log('Email déjà utilisé, tentative de connexion...');
        userCredential = await signInWithEmailAndPassword(
          auth,
          onboardingData.email.trim(),
          onboardingData.password
        );
      } else {
        throw error;
      }
    }
    
    const user = userCredential.user;
    
    // Vérifier si le profil existe déjà
    const existingProfile = await getDoc(doc(firestore, 'users', user.uid, 'profile', 'main'));
    
    if (!existingProfile.exists()) {
      // Mise à jour du profil Firebase Auth
      await updateProfile(user, {
        displayName: `${onboardingData.firstName.trim()} ${onboardingData.lastName.trim()}`
      });
      
      // Utilisation d'un batch pour les opérations Firestore (plus efficace)
      const batch = writeBatch(firestore);
      
      // Création du profil utilisateur
      const userProfile: UserProfile = {
        uid: user.uid,
        firstName: onboardingData.firstName.trim(),
        lastName: onboardingData.lastName.trim(),
        email: onboardingData.email.trim(),
        gender: onboardingData.gender,
        age: onboardingData.age,
        height: onboardingData.height,
        weight: onboardingData.weight,
        goals: onboardingData.goals,
        targetWeight: onboardingData.targetWeight || onboardingData.weight,
        weeklyWorkouts: onboardingData.weeklyWorkouts,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        onboardingCompleted: true
      };
      
      // Ajout des documents au batch
      batch.set(doc(firestore, 'users', user.uid, 'profile', 'main'), userProfile);
      
      batch.set(doc(firestore, 'users', user.uid, 'goals', 'main'), {
        fitnessGoals: onboardingData.goals,
        targetWeight: onboardingData.targetWeight || onboardingData.weight,
        weeklyWorkouts: onboardingData.weeklyWorkouts,
        createdAt: serverTimestamp()
      });
      
      batch.set(doc(firestore, 'users', user.uid, 'preferences', 'main'), {
        notifications: true,
        reminders: true,
        dataSharing: true,
        theme: 'dark',
        language: 'fr',
        createdAt: serverTimestamp()
      });

      // Exécution du batch
      await batch.commit();
    } else {
      console.log('Profil utilisateur existe déjà, connexion réussie');
    }
    
    return user;
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    const errorMessage = error.code ? handleAuthError(error) : error.message;
    throw new Error(errorMessage);
  }
};

// Déconnexion
export const signOutUser = async (): Promise<void> => {
  try {
    console.log('🔥 [AUTH] Début de la déconnexion...');
    
    // Vérifier si un utilisateur est connecté
    if (!auth.currentUser) {
      console.log('⚠️ [AUTH] Aucun utilisateur connecté');
      return;
    }
    
    console.log('👤 [AUTH] Utilisateur connecté:', auth.currentUser.uid);
    
    // Effectuer la déconnexion
    await signOut(auth);
    
    console.log('✅ [AUTH] Déconnexion réussie');
  } catch (error: any) {
    console.error('❌ [AUTH] Erreur lors de la déconnexion:', error);
    const errorMessage = error.code ? handleAuthError(error) : error.message;
    throw new Error(errorMessage);
  }
};

// Récupération du profil utilisateur
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    if (!uid) {
      throw new Error('UID utilisateur requis');
    }

    const userDoc = await getDoc(doc(firestore, 'users', uid, 'profile', 'main'));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        uid: data.uid || uid
      } as UserProfile;
    }
    return null;
  } catch (error: any) {
    console.error('Erreur récupération profil:', error);
    throw new Error('Erreur lors de la récupération du profil');
  }
};

// Mise à jour du profil utilisateur
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    if (!uid) {
      throw new Error('UID utilisateur requis');
    }

    // Validation des données de mise à jour
    if (updates.email && !/\S+@\S+\.\S+/.test(updates.email)) {
      throw new Error('L\'email n\'est pas valide');
    }
    if (updates.age && (updates.age < 13 || updates.age > 100)) {
      throw new Error('L\'âge doit être entre 13 et 100 ans');
    }
    if (updates.height && (updates.height < 100 || updates.height > 250)) {
      throw new Error('La taille doit être entre 100 et 250 cm');
    }
    if (updates.weight && (updates.weight < 30 || updates.weight > 300)) {
      throw new Error('Le poids doit être entre 30 et 300 kg');
    }

    await setDoc(doc(firestore, 'users', uid, 'profile', 'main'), {
      ...updates,
      lastUpdated: serverTimestamp()
    }, { merge: true });
  } catch (error: any) {
    console.error('Erreur mise à jour profil:', error);
    throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
  }
};

// Écoute des changements d'état d'authentification
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Configuration Google Sign-In
export const configureGoogleSignIn = () => {
  // Configuration automatique via expo-auth-session
  // Pas besoin de configuration supplémentaire
};

// Connexion avec Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    // Configuration OAuth Google
    const redirectUri = AuthSession.makeRedirectUri();
    
    const request = new AuthSession.AuthRequest({
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '336045610131-your-web-client-id.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {},
    });

    // Lancer l'authentification
    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    if (result.type !== 'success') {
      throw new Error('Authentification Google annulée ou échouée');
    }

    // Échanger le code d'autorisation contre un token d'accès
    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '336045610131-your-web-client-id.apps.googleusercontent.com',
        code: result.params.code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier || '',
        },
      },
      {
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
      }
    );

    // Obtenir les informations du profil utilisateur
    const userInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
    );
    const userInfo = await userInfoResponse.json();

    // Créer une credential Google avec le token d'accès
    const googleCredential = GoogleAuthProvider.credential(tokenResponse.idToken);
    
    // Se connecter avec Firebase
    const userCredential = await signInWithCredential(auth, googleCredential);
    const user = userCredential.user;
    
    // Vérifier si c'est un nouvel utilisateur
    const userDoc = await getDoc(doc(firestore, 'users', user.uid, 'profile', 'main'));
    
    if (!userDoc.exists()) {
      // Créer le profil utilisateur pour un nouvel utilisateur Google
      const displayName = user.displayName || userInfo.name || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || userInfo.given_name || '';
      const lastName = nameParts.slice(1).join(' ') || userInfo.family_name || '';
      
      const userProfile: UserProfile = {
        uid: user.uid,
        firstName,
        lastName,
        email: user.email || userInfo.email || '',
        gender: 'homme', // Valeur par défaut, l'utilisateur pourra la modifier
        age: 25, // Valeur par défaut, l'utilisateur pourra la modifier
        height: 170, // Valeur par défaut, l'utilisateur pourra la modifier
        weight: 70, // Valeur par défaut, l'utilisateur pourra la modifier
        goals: ['perte_de_poids'], // Valeur par défaut, l'utilisateur pourra la modifier
        weeklyWorkouts: 3, // Valeur par défaut, l'utilisateur pourra la modifier
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        onboardingCompleted: false // L'utilisateur devra compléter l'onboarding
      };
      
      // Sauvegarde du profil principal
      await setDoc(doc(firestore, 'users', user.uid, 'profile', 'main'), userProfile);
      
      // Création des objectifs initiaux
      await setDoc(doc(firestore, 'users', user.uid, 'goals', 'main'), {
        fitnessGoals: userProfile.goals,
        targetWeight: userProfile.weight,
        weeklyWorkouts: userProfile.weeklyWorkouts,
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
    }
    
    return user;
  } catch (error: any) {
    throw new Error('Erreur de connexion Google: ' + error.message);
  }
};

// Déconnexion Google
export const signOutGoogle = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Erreur de déconnexion Google: ' + error.message);
  }
};

// Validation des données d'onboarding (version publique)
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
  
  if (!data.weeklyWorkouts || data.weeklyWorkouts < 1 || data.weeklyWorkouts > 7) {
    errors.weeklyWorkouts = 'Le nombre d\'entraînements doit être entre 1 et 7 par semaine';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Suppression du compte utilisateur
export const deleteUserAccount = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Aucun utilisateur connecté');
    }

    const uid = user.uid;

    // Supprimer toutes les données utilisateur de Firestore
    const collections = [
      'profile',
      'goals', 
      'preferences',
      'workouts',
      'dailyStats',
      'measurements',
      'achievements',
      'notifications'
    ];

    const batch = writeBatch(firestore);

    // Supprimer les documents principaux
    for (const collectionName of collections) {
      const docRef = doc(firestore, 'users', uid, collectionName, 'main');
      batch.delete(docRef);
    }

    // Supprimer les sous-collections (workouts, dailyStats, etc.)
    for (const collectionName of ['workouts', 'dailyStats', 'measurements', 'achievements', 'notifications']) {
      const subCollectionRef = collection(firestore, 'users', uid, collectionName);
      const subCollectionSnapshot = await getDocs(subCollectionRef);
      
      subCollectionSnapshot.docs.forEach((docSnapshot) => {
        batch.delete(docSnapshot.ref);
      });
    }

    // Exécuter le batch de suppression
    await batch.commit();

    // Supprimer le compte Firebase Auth
    await deleteUser(user);

    console.log('Compte utilisateur supprimé avec succès');
  } catch (error: any) {
    console.error('Erreur lors de la suppression du compte:', error);
    const errorMessage = error.code ? handleAuthError(error) : error.message;
    throw new Error(errorMessage);
  }
};
