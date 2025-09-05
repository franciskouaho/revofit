/**
 * Service Firebase pour les notifications push
 * RevoFit - Gestion des notifications push et locales
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { firestore } from './config';

// Collections Firebase
const COLLECTIONS = {
  NOTIFICATIONS: 'notifications',
  NOTIFICATION_TOKENS: 'notificationTokens',
  CHAT_MESSAGES: 'chatMessages',
  COACH_MESSAGES: 'coachMessages'
} as const;

// Types pour les notifications
export interface AppNotification {
  id: string;
  userId: string;
  type: 'workout' | 'nutrition' | 'coach' | 'reminder' | 'achievement' | 'message' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  scheduledFor?: Date;
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationToken {
  id: string;
  userId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'ai' | 'coach';
  message: string;
  timestamp: Date;
  isRead: boolean;
  metadata?: {
    workoutId?: string;
    exerciseId?: string;
    coachId?: string;
  };
}

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Service pour les notifications
 */
export class NotificationService {
  /**
   * Enregistre le token de notification de l'appareil
   */
  static async registerForPushNotificationsAsync(userId: string): Promise<string | null> {
    let token: string | null = null;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permission de notification refusée');
        return null;
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Token de notification:', token);
      
      // Sauvegarder le token dans Firebase
      await this.saveNotificationToken(userId, token);
    } else {
      console.log('Les notifications push ne fonctionnent que sur un appareil physique');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFD700',
      });
    }

    return token;
  }

  /**
   * Sauvegarde le token de notification dans Firebase
   */
  static async saveNotificationToken(userId: string, token: string): Promise<boolean> {
    try {
      const platform = Platform.OS as 'ios' | 'android' | 'web';
      
      // Vérifier si le token existe déjà
      const q = query(
        collection(firestore, COLLECTIONS.NOTIFICATION_TOKENS),
        where('userId', '==', userId),
        where('token', '==', token)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Créer un nouveau token
        await addDoc(collection(firestore, COLLECTIONS.NOTIFICATION_TOKENS), {
          userId,
          token,
          platform,
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Mettre à jour le token existant
        const docRef = doc(firestore, COLLECTIONS.NOTIFICATION_TOKENS, snapshot.docs[0].id);
        await updateDoc(docRef, {
          isActive: true,
          updatedAt: serverTimestamp()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
      return false;
    }
  }

  /**
   * Récupère les tokens de notification d'un utilisateur
   */
  static async getUserNotificationTokens(userId: string): Promise<NotificationToken[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.NOTIFICATION_TOKENS),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as NotificationToken));
    } catch (error) {
      console.error('Erreur lors de la récupération des tokens:', error);
      return [];
    }
  }

  /**
   * Envoie une notification push
   */
  static async sendPushNotification(
    userId: string,
    title: string,
    message: string,
    data?: any
  ): Promise<boolean> {
    try {
      const tokens = await this.getUserNotificationTokens(userId);
      
      if (tokens.length === 0) {
        console.log('Aucun token de notification trouvé pour cet utilisateur');
        return false;
      }

      const messages = tokens.map(token => ({
        to: token.token,
        sound: 'default',
        title,
        body: message,
        data: data || {},
        priority: 'high',
        channelId: 'default'
      }));

      // Envoyer les notifications via Expo Push API
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      const result = await response.json();
      console.log('Notification envoyée:', result);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      return false;
    }
  }

  /**
   * Crée une notification locale
   */
  static async scheduleLocalNotification(
    title: string,
    message: string,
    seconds: number = 0,
    data?: any
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        data: data || {},
        sound: 'default',
      },
      trigger: seconds > 0 ? { seconds } : null,
    });

    return notificationId;
  }

  /**
   * Crée une notification dans Firebase
   */
  static async createNotification(
    userId: string,
    type: AppNotification['type'],
    title: string,
    message: string,
    data?: any,
    priority: 'low' | 'normal' | 'high' = 'normal',
    scheduledFor?: Date
  ): Promise<string | null> {
    try {
      const notificationData = {
        userId,
        type,
        title,
        message,
        data: data || {},
        isRead: false,
        priority,
        scheduledFor: scheduledFor || null,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(firestore, COLLECTIONS.NOTIFICATIONS), notificationData);
      
      // Envoyer une notification push immédiate si pas programmée
      if (!scheduledFor) {
        await this.sendPushNotification(userId, title, message, data);
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      return null;
    }
  }

  /**
   * Récupère les notifications d'un utilisateur
   */
  static async getUserNotifications(
    userId: string,
    limitCount: number = 50
  ): Promise<AppNotification[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.NOTIFICATIONS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AppNotification));
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return [];
    }
  }

  /**
   * Marque une notification comme lue
   */
  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.NOTIFICATIONS, notificationId);
      await updateDoc(docRef, {
        isRead: true,
        readAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      return false;
    }
  }

  /**
   * Supprime une notification
   */
  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.NOTIFICATIONS, notificationId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      return false;
    }
  }

  /**
   * Supprime toutes les notifications d'un utilisateur
   */
  static async clearAllNotifications(userId: string): Promise<boolean> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.NOTIFICATIONS),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression des notifications:', error);
      return false;
    }
  }

  /**
   * Écoute les notifications en temps réel
   */
  static watchUserNotifications(
    userId: string,
    callback: (notifications: AppNotification[]) => void
  ) {
    const q = query(
      collection(firestore, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AppNotification));
      callback(notifications);
    });
  }

  /**
   * Crée des notifications automatiques basées sur l'activité
   */
  static async createWorkoutNotification(
    userId: string,
    workoutName: string,
    calories: number
  ): Promise<void> {
    await this.createNotification(
      userId,
      'workout',
      'Entraînement terminé !',
      `Félicitations ! Vous avez terminé votre séance "${workoutName}" et brûlé ${calories} calories`,
      { workoutName, calories },
      'high'
    );
  }

  static async createCalorieGoalNotification(
    userId: string,
    calories: number,
    goal: number
  ): Promise<void> {
    await this.createNotification(
      userId,
      'nutrition',
      'Objectif calories atteint',
      `Vous avez atteint votre objectif calorique quotidien de ${goal} kcal`,
      { calories, goal },
      'normal'
    );
  }

  static async createCoachMessageNotification(
    userId: string,
    coachName: string,
    message: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'coach',
      'Nouveau message de votre coach',
      `${coachName} vous a envoyé un nouveau message`,
      { coachName, message },
      'high'
    );
  }

  static async createWorkoutReminderNotification(
    userId: string,
    workoutName: string,
    scheduledTime: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'reminder',
      'Rappel d\'entraînement',
      `N'oubliez pas votre séance de ${workoutName} prévue à ${scheduledTime}`,
      { workoutName, scheduledTime },
      'normal'
    );
  }
}
