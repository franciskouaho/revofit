/**
 * Composant d'initialisation des notifications
 * RevoFit - Initialise les notifications au démarrage de l'app
 */

import { initializeNotifications } from '@/services/notificationManager';
import React, { useEffect } from 'react';

interface NotificationInitializerProps {
  children: React.ReactNode;
}

export function NotificationInitializer({ children }: NotificationInitializerProps) {
  useEffect(() => {
    // Initialiser les notifications au montage du composant
    initializeNotifications();
  }, []);

  return <>{children}</>;
}
