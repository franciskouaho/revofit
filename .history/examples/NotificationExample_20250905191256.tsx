/**
 * Exemple d'utilisation du composant NotificationIcon
 * RevoFit - Exemple d'intégration de l'icône de notification
 */

import { NotificationIcon } from '@/components/NotificationIcon';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function NotificationExample() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exemple d'icône de notification</Text>
      
      {/* Utilisation basique */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Icône simple</Text>
        <NotificationIcon onPress={() => router.push('/notifications')} />
      </View>

      {/* Utilisation avec taille personnalisée */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Icône grande</Text>
        <NotificationIcon 
          onPress={() => router.push('/notifications')} 
          size={32} 
          color="#FFD700" 
        />
      </View>

      {/* Comparaison avec icône normale */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comparaison</Text>
        <View style={styles.comparison}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
            <Text style={styles.label}>Sans badge</Text>
          </View>
          <View style={styles.iconContainer}>
            <NotificationIcon onPress={() => router.push('/notifications')} />
            <Text style={styles.label}>Avec badge</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0A0A0A',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 16,
  },
  comparison: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
});
