/**
 * Composant de test pour les notifications
 * RevoFit - Test du badge de notification
 */

import { NotificationIcon } from '@/components/NotificationIcon';
import { useNotifications } from '@/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function NotificationTest() {
  const { unreadCount, clearBadge, updateBadgeCount } = useNotifications();

  const addTestNotification = async () => {
    // Simuler l'ajout d'une notification
    await updateBadgeCount();
  };

  const clearAllNotifications = async () => {
    await clearBadge();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test des Notifications</Text>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>Notifications non lues: {unreadCount}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={addTestNotification}>
          <Text style={styles.buttonText}>Ajouter notification</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearAllNotifications}>
          <Text style={styles.buttonText}>Effacer badge</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.iconTest}>
        <Text style={styles.sectionTitle}>Icône avec badge</Text>
        <NotificationIcon onPress={() => console.log('Notification pressed')} />
      </View>

      <View style={styles.iconTest}>
        <Text style={styles.sectionTitle}>Icône normale (comparaison)</Text>
        <Ionicons name="notifications" size={24} color="#FFFFFF" />
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
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#000000',
    fontWeight: '600',
  },
  iconTest: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
});
