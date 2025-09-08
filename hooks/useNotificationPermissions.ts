/**
 * Hook pour gérer les permissions de notifications
 * RevoFit - Vérification et gestion des permissions de notifications
 */

import { useAuth } from '@/contexts/AuthContext';
import { NotificationService } from '@/services/firebase/notifications';
import { NotificationScheduler } from '@/services/notificationScheduler';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

export interface NotificationPermissionsState {
  hasPermission: boolean;
  canAskAgain: boolean;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<void>;
}

export function useNotificationPermissions(): NotificationPermissionsState {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkPermission = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { status, canAskAgain: canAsk } = await Notifications.getPermissionsAsync();
      
      setHasPermission(status === 'granted');
      setCanAskAgain(canAsk);
      
      console.log('🔔 État des permissions de notifications:', { status, canAsk });
    } catch (err) {
      console.error('Erreur lors de la vérification des permissions:', err);
      setError('Impossible de vérifier les permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      
      setHasPermission(granted);
      
      if (granted && user?.uid) {
        // Enregistrer le token de notification et programmer les notifications
        await NotificationService.registerForPushNotificationsAsync(user.uid);
        await NotificationScheduler.initializeScheduledNotifications(user.uid);
        console.log('✅ Notifications activées et programmées');
      }
      
      return granted;
    } catch (err) {
      console.error('Erreur lors de la demande de permission:', err);
      setError('Impossible de demander la permission');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier les permissions au montage du composant
  useEffect(() => {
    checkPermission();
  }, []);

  // Re-vérifier les permissions quand l'utilisateur change
  useEffect(() => {
    if (user?.uid) {
      checkPermission();
    }
  }, [user?.uid]);

  return {
    hasPermission,
    canAskAgain,
    isLoading,
    error,
    requestPermission,
    checkPermission,
  };
}
