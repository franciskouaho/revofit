/**
 * Gestionnaire de notifications global
 * RevoFit - Initialisation et gestion des notifications
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Initialise le système de notifications au démarrage de l'app
 */
export async function initializeNotifications() {
  try {
    // Configurer le gestionnaire de notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Configurer le canal de notification pour Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFD700',
        sound: 'default',
      });
    }

    // Effacer le badge au démarrage de l'app
    await Notifications.setBadgeCountAsync(0);

    console.log('✅ Notifications initialisées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des notifications:', error);
  }
}

/**
 * Efface le badge de notification
 */
export async function clearNotificationBadge() {
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error('Erreur lors de la suppression du badge:', error);
  }
}

/**
 * Met à jour le badge avec un nombre spécifique
 */
export async function updateNotificationBadge(count: number) {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du badge:', error);
  }
}
