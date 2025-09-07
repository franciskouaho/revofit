/**
 * Hook pour gérer les messages de coach
 * RevoFit - Hook pour les messages et notifications de coach
 */

import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage, ChatMessageService } from '@/services/firebase/chatMessages';
import { useEffect, useState } from 'react';

export interface UseCoachMessagesReturn {
  messages: ChatMessage[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  sendMessage: (coachId: string, coachName: string, message: string) => Promise<boolean>;
  markAsRead: (messageId: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

export function useCoachMessages(coachId?: string): UseCoachMessagesReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = messages.filter(m => !m.isRead && m.senderType === 'coach').length;

  const fetchMessages = async () => {
    if (!user?.uid || !coachId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const coachMessages = await ChatMessageService.getChatMessages(user.uid, coachId);
      setMessages(coachMessages);
    } catch (err) {
      console.error('Erreur lors de la récupération des messages de coach:', err);
      setError('Impossible de charger les messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (coachId: string, coachName: string, message: string): Promise<boolean> => {
    if (!user?.uid) return false;
    
    try {
      const messageId = await ChatMessageService.sendMessageToCoach(
        user.uid,
        coachId,
        coachName,
        message
      );
      return messageId !== null;
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError('Impossible d\'envoyer le message');
      return false;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await ChatMessageService.markMessageAsRead(messageId);
      setMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, isRead: true } : m)
      );
    } catch (err) {
      console.error('Erreur lors du marquage du message:', err);
    }
  };

  const refreshMessages = async () => {
    await fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.uid, coachId]);

  // Écouter les messages en temps réel
  useEffect(() => {
    if (!user?.uid || !coachId) return;

    const unsubscribe = ChatMessageService.watchChatMessages(
      user.uid,
      coachId,
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, coachId]);

  return {
    messages,
    unreadCount,
    loading,
    error,
    sendMessage,
    markAsRead,
    refreshMessages,
  };
}
