/**
 * Hook personnalisé pour gérer les notifications
 * RevoFit - Hook pour les notifications push et locales
 */

import { useAuth } from '@/contexts/AuthContext';
import { AppNotification, NotificationService } from '@/services/firebase/notifications';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

export interface UseNotificationsReturn {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  registerForPushNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  updateBadgeCount: () => Promise<void>;
  clearBadge: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    if (!user?.uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userNotifications = await NotificationService.getUserNotifications(user.uid);
      setNotifications(userNotifications);
    } catch (err) {
      console.error('Erreur lors de la récupération des notifications:', err);
      setError('Impossible de charger les notifications');
    } finally {
      setLoading(false);
    }
  };

  const registerForPushNotifications = async () => {
    if (!user?.uid) return;
    
    try {
      await NotificationService.registerForPushNotificationsAsync(user.uid);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement des notifications:', err);
      setError('Impossible d\'enregistrer les notifications');
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      // Mettre à jour le badge après avoir marqué comme lu
      await updateBadgeCount();
    } catch (err) {
      console.error('Erreur lors du marquage de la notification:', err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Erreur lors de la suppression de la notification:', err);
    }
  };

  const clearAllNotifications = async () => {
    if (!user?.uid) return;
    
    try {
      await NotificationService.clearAllNotifications(user.uid);
      setNotifications([]);
      // Effacer le badge après avoir supprimé toutes les notifications
      await clearBadge();
    } catch (err) {
      console.error('Erreur lors de la suppression des notifications:', err);
    }
  };

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

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

  useEffect(() => {
    fetchNotifications();
  }, [user?.uid]);

  // Mettre à jour le badge quand le nombre de notifications non lues change
  useEffect(() => {
    updateBadgeCount();
  }, [unreadCount]);

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = NotificationService.watchUserNotifications(user.uid, (newNotifications) => {
      setNotifications(newNotifications);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Écouter les notifications reçues en arrière-plan
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification);
      // Rafraîchir les notifications quand une nouvelle arrive
      fetchNotifications();
    });

    return () => subscription.remove();
  }, []);

  // Écouter les interactions avec les notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification touchée:', response);
      const data = response.notification.request.content.data;
      
      // Traiter les données de la notification si nécessaire
      if (data.notificationId) {
        markAsRead(data.notificationId);
      }
    });

    return () => subscription.remove();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    registerForPushNotifications,
    markAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications,
    updateBadgeCount,
    clearBadge,
  };
}
