// Contexte d'authentification pour RevoFit
import { User } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getUserProfile, onAuthStateChange, UserProfile } from '../services/firebase/auth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (onboardingData: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger le profil utilisateur
  const loadUserProfile = async (uid: string) => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      setUserProfile(null);
    }
  };

  // Rafraîchir le profil utilisateur
  const refreshUserProfile = async () => {
    if (user) {
      await loadUserProfile(user.uid);
    }
  };

  // Écouter les changements d'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fonction de connexion
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { signInUser } = await import('../services/firebase/auth');
      await signInUser(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Fonction d'inscription
  const signUp = async (onboardingData: any) => {
    try {
      setLoading(true);
      const { signUpUser } = await import('../services/firebase/auth');
      await signUpUser(onboardingData);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      setLoading(true);
      const { signOutUser } = await import('../services/firebase/auth');
      await signOutUser();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
