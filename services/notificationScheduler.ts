/**
 * Planificateur de notifications automatiques
 * RevoFit - Notifications programmées et rappels
 */

import * as Notifications from 'expo-notifications';

export class NotificationScheduler {
  /**
   * Planifie les notifications de rappel quotidien
   */
  static async scheduleDailyReminders(userId: string): Promise<void> {
    try {
      // Annuler les anciennes notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Rappel matinal (8h00)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌅 Bonjour !',
          body: 'Prêt pour une nouvelle journée d\'entraînement ?',
          data: { type: 'morning_reminder', userId },
        },
        trigger: {
          hour: 8,
          minute: 0,
          repeats: true,
        },
      });

      // Rappel d'entraînement (18h00)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💪 C\'est l\'heure !',
          body: 'N\'oubliez pas votre séance d\'entraînement d\'aujourd\'hui',
          data: { type: 'workout_reminder', userId },
        },
        trigger: {
          hour: 18,
          minute: 0,
          repeats: true,
        },
      });

      // Rappel nutrition (12h00)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🍎 Déjeuner',
          body: 'Pensez à enregistrer votre repas pour suivre vos objectifs',
          data: { type: 'nutrition_reminder', userId },
        },
        trigger: {
          hour: 12,
          minute: 0,
          repeats: true,
        },
      });

      console.log('✅ Notifications quotidiennes programmées');
    } catch (error) {
      console.error('❌ Erreur lors de la programmation des notifications:', error);
    }
  }

  /**
   * Planifie une notification de rappel d'entraînement spécifique
   */
  static async scheduleWorkoutReminder(
    userId: string,
    workoutName: string,
    scheduledTime: Date
  ): Promise<void> {
    try {
      const now = new Date();
      const timeDiff = scheduledTime.getTime() - now.getTime();
      
      // Ne programmer que si c'est dans le futur
      if (timeDiff > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Rappel d\'entraînement',
            body: `Votre séance "${workoutName}" commence bientôt !`,
            data: { 
              type: 'workout_reminder', 
              userId, 
              workoutName,
              scheduledTime: scheduledTime.toISOString()
            },
          },
          trigger: {
            date: scheduledTime,
          },
        });

        console.log(`✅ Rappel programmé pour ${workoutName} à ${scheduledTime.toLocaleString()}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la programmation du rappel:', error);
    }
  }

  /**
   * Annule toutes les notifications programmées
   */
  static async cancelAllScheduledNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ Toutes les notifications programmées ont été annulées');
    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation des notifications:', error);
    }
  }

  /**
   * Vérifie les permissions et programme les notifications
   */
  static async initializeScheduledNotifications(userId: string): Promise<void> {
    try {
      // Vérifier les permissions
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Permissions de notification non accordées');
        return;
      }

      // Programmer les notifications quotidiennes
      await this.scheduleDailyReminders(userId);
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation des notifications programmées:', error);
    }
  }
}
