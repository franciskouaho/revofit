import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Utilisateur connecté, rediriger vers l'app principale
        return <Redirect href="/(tabs)" />;
      } else {
        // Utilisateur non connecté, rediriger vers l'onboarding
        return <Redirect href="/onboarding" />;
      }
    }
  }, [user, loading]);

  // Pendant le chargement, rediriger vers splash
  return <Redirect href="/splash" />;
}