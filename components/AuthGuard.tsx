// Composant de protection des routes basé sur l'authentification
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/onboarding' 
}: AuthGuardProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Utilisateur non connecté, rediriger vers l'onboarding
        router.replace(redirectTo as any);
      } else if (!requireAuth && user) {
        // Utilisateur connecté mais sur une page qui ne nécessite pas d'auth
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, requireAuth, redirectTo]);

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#0A0A0A' 
      }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (requireAuth && !user) {
    return null; // Redirection en cours
  }

  if (!requireAuth && user) {
    return null; // Redirection en cours
  }

  return <>{children}</>;
}
