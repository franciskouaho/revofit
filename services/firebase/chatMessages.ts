/**
 * Service Firebase pour les messages de chat
 * RevoFit - Gestion des messages entre utilisateurs et coaches
 */

import {
    addDoc,
    collection,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { firestore } from './config';
import { NotificationService } from './notifications';

// Collections Firebase
const COLLECTIONS = {
  CHAT_MESSAGES: 'chatMessages',
  COACH_MESSAGES: 'coachMessages',
  USERS: 'users'
} as const;

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'ai' | 'coach';
  receiverId: string;
  receiverType: 'user' | 'coach';
  message: string;
  timestamp: Date;
  isRead: boolean;
  metadata?: {
    workoutId?: string;
    exerciseId?: string;
    coachId?: string;
    messageType?: 'text' | 'workout_share' | 'nutrition_share';
  };
}

export interface CoachMessage {
  id: string;
  userId: string;
  coachId: string;
  coachName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'workout_share' | 'nutrition_share';
  metadata?: any;
}

/**
 * Service pour les messages de chat
 */
export class ChatMessageService {
  /**
   * Envoie un message à un coach
   */
  static async sendMessageToCoach(
    userId: string,
    coachId: string,
    coachName: string,
    message: string,
    messageType: 'text' | 'workout_share' | 'nutrition_share' = 'text',
    metadata?: any
  ): Promise<string | null> {
    try {
      const chatId = `${userId}_${coachId}`;
      
      // Sauvegarder le message dans Firebase
      const messageData = {
        chatId,
        senderId: userId,
        senderName: 'Vous',
        senderType: 'user' as const,
        receiverId: coachId,
        receiverType: 'coach' as const,
        message,
        timestamp: serverTimestamp(),
        isRead: false,
        metadata: {
          coachId,
          messageType,
          ...metadata
        }
      };

      const docRef = await addDoc(collection(firestore, COLLECTIONS.CHAT_MESSAGES), messageData);
      
      // Simuler une réponse du coach (dans un vrai système, ceci serait géré par le coach)
      setTimeout(async () => {
        await this.simulateCoachResponse(userId, coachId, coachName, message);
      }, 2000); // Réponse simulée après 2 secondes

      console.log('✅ Message envoyé au coach:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message au coach:', error);
      return null;
    }
  }

  /**
   * Simule une réponse du coach (pour la démo)
   */
  private static async simulateCoachResponse(
    userId: string,
    coachId: string,
    coachName: string,
    userMessage: string
  ): Promise<void> {
    try {
      const chatId = `${userId}_${coachId}`;
      
      // Réponses simulées basées sur le contenu du message
      let coachResponse = '';
      if (userMessage.toLowerCase().includes('workout') || userMessage.toLowerCase().includes('entraînement')) {
        coachResponse = 'Excellente question sur l\'entraînement ! Je recommande de commencer par des exercices de base et d\'augmenter progressivement l\'intensité. Avez-vous des objectifs spécifiques en tête ?';
      } else if (userMessage.toLowerCase().includes('nutrition') || userMessage.toLowerCase().includes('alimentation')) {
        coachResponse = 'La nutrition est cruciale pour vos résultats ! Assurez-vous de manger équilibré avec des protéines, glucides et lipides de qualité. Voulez-vous que je vous aide à planifier vos repas ?';
      } else if (userMessage.toLowerCase().includes('motivation') || userMessage.toLowerCase().includes('difficile')) {
        coachResponse = 'Je comprends que ce soit difficile parfois. Rappelez-vous pourquoi vous avez commencé ! Chaque petit pas compte. Voulez-vous qu\'on établisse des objectifs plus petits et réalisables ?';
      } else {
        coachResponse = 'Merci pour votre message ! Je suis là pour vous accompagner dans votre parcours fitness. N\'hésitez pas à me poser des questions sur l\'entraînement, la nutrition ou la motivation.';
      }

      // Sauvegarder la réponse du coach
      const responseData = {
        chatId,
        senderId: coachId,
        senderName: coachName,
        senderType: 'coach' as const,
        receiverId: userId,
        receiverType: 'user' as const,
        message: coachResponse,
        timestamp: serverTimestamp(),
        isRead: false,
        metadata: {
          coachId,
          messageType: 'text'
        }
      };

      await addDoc(collection(firestore, COLLECTIONS.CHAT_MESSAGES), responseData);

      // Envoyer une notification push à l'utilisateur
      await NotificationService.createCoachMessageNotification(
        userId,
        coachName,
        coachResponse
      );

      console.log('✅ Réponse du coach simulée et notification envoyée');
    } catch (error) {
      console.error('❌ Erreur lors de la simulation de la réponse du coach:', error);
    }
  }

  /**
   * Récupère les messages d'un chat
   */
  static async getChatMessages(
    userId: string,
    coachId: string,
    limitCount: number = 50
  ): Promise<ChatMessage[]> {
    try {
      const chatId = `${userId}_${coachId}`;
      const q = query(
        collection(firestore, COLLECTIONS.CHAT_MESSAGES),
        where('chatId', '==', chatId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      } as ChatMessage));
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des messages:', error);
      return [];
    }
  }

  /**
   * Écoute les messages en temps réel
   */
  static watchChatMessages(
    userId: string,
    coachId: string,
    callback: (messages: ChatMessage[]) => void
  ) {
    const chatId = `${userId}_${coachId}`;
    const q = query(
      collection(firestore, COLLECTIONS.CHAT_MESSAGES),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      } as ChatMessage));
      callback(messages);
    });
  }

  /**
   * Marque un message comme lu
   */
  static async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.CHAT_MESSAGES, messageId);
      await updateDoc(docRef, {
        isRead: true
      });
      return true;
    } catch (error) {
      console.error('❌ Erreur lors du marquage du message:', error);
      return false;
    }
  }

  /**
   * Récupère les messages non lus d'un utilisateur
   */
  static async getUnreadMessagesCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.CHAT_MESSAGES),
        where('receiverId', '==', userId),
        where('isRead', '==', false)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('❌ Erreur lors du comptage des messages non lus:', error);
      return 0;
    }
  }
}
