/**
 * Hook pour gérer le badge de notification
 * RevoFit - Gestion du badge de notification sur l'icône
 */

import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export function useNotificationBadge() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    updateBadgeCount();
  }, [unreadCount, user?.uid]);

  const updateBadgeCount = async () => {
    try {
      // Mettre à jour le badge avec le nombre de notifications non lues
      await Notifications.setBadgeCountAsync(unreadCount);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du badge:', error);
    }
  };

  const clearBadge = async () => {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Erreur lors de la suppression du badge:', error);
    }
  };

  return {
    updateBadgeCount,
    clearBadge,
  };
}
