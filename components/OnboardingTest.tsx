// Composant de test pour l'onboarding
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from './onboarding';

export default function OnboardingTest() {
  const { user, userProfile, signOut } = useAuth();
  const { onboardingData, resetOnboarding } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const handleTestSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      Alert.alert('Succès', 'Déconnexion réussie');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
    Alert.alert('Succès', 'Onboarding réinitialisé');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test de l'onboarding</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>État d'authentification</Text>
        <Text style={styles.text}>
          Connecté: {user ? 'Oui' : 'Non'}
        </Text>
        {user && (
          <Text style={styles.text}>
            UID: {user.uid}
          </Text>
        )}
        {userProfile && (
          <Text style={styles.text}>
            Nom: {userProfile.firstName} {userProfile.lastName}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Données d'onboarding</Text>
        <Text style={styles.text}>
          Prénom: {onboardingData.firstName || 'Non défini'}
        </Text>
        <Text style={styles.text}>
          Nom: {onboardingData.lastName || 'Non défini'}
        </Text>
        <Text style={styles.text}>
          Email: {onboardingData.email || 'Non défini'}
        </Text>
        <Text style={styles.text}>
          Genre: {onboardingData.gender || 'Non défini'}
        </Text>
        <Text style={styles.text}>
          Âge: {onboardingData.age || 'Non défini'}
        </Text>
        <Text style={styles.text}>
          Taille: {onboardingData.height || 'Non défini'} cm
        </Text>
        <Text style={styles.text}>
          Poids: {onboardingData.weight || 'Non défini'} kg
        </Text>
        <Text style={styles.text}>
          Objectifs: {onboardingData.goals?.join(', ') || 'Non définis'}
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={handleTestSignOut}
          disabled={isLoading}
          style={[styles.button, styles.signOutButton]}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Déconnexion...' : 'Test Déconnexion'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResetOnboarding}
          style={[styles.button, styles.resetButton]}
        >
          <Text style={styles.buttonText}>Reset Onboarding</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0A0A0A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  buttons: {
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
  },
  resetButton: {
    backgroundColor: '#2A2A2A',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
