import { Redirect } from 'expo-router';

export default function Index() {
  // Redirection automatique vers la page splash au démarrage
  return <Redirect href="/splash" />;
} 