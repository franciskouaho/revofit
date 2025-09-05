/**
 * Page de chat IA et coaching
 * RevoFit - Interface de chat avec IA et coaches humains
 */

import { useAuth } from '@/contexts/AuthContext';
import { useStatsData } from '@/hooks/useStatsData';
import { AIChatResponse, AIChatService, CoachProfile, CoachService } from '@/services/ai/chatService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'coach';
  message: string;
  timestamp: Date;
  suggestions?: string[];
  workoutRecommendations?: any[];
  nutritionAdvice?: any[];
  senderName?: string;
}

export default function AICoachChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { userStats } = useStatsData();
  const [activeTab, setActiveTab] = useState<'ai' | 'coach'>('ai');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<CoachProfile | null>(null);
  const [questionSuggestions, setQuestionSuggestions] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Charger les coaches
      const availableCoaches = await CoachService.getAvailableCoaches();
      setCoaches(availableCoaches);
      
      // Générer des suggestions de questions
      const suggestions = AIChatService.generateQuestionSuggestions({ userStats });
      setQuestionSuggestions(suggestions);
      
      // Message de bienvenue
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'ai',
        message: 'Bonjour ! Je suis votre coach IA RevoFit. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date(),
        suggestions: suggestions.slice(0, 3)
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      if (activeTab === 'ai') {
        await sendToAI(userMessage.message);
      } else if (selectedCoach) {
        await sendToCoach(userMessage.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        message: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendToAI = async (message: string) => {
    try {
      const response: AIChatResponse = await AIChatService.sendMessageToAI(message, { userStats });
      
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        message: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
        workoutRecommendations: response.workoutRecommendations,
        nutritionAdvice: response.nutritionAdvice
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      throw error;
    }
  };

  const sendToCoach = async (message: string) => {
    if (!selectedCoach) return;

    try {
      const success = await CoachService.sendMessageToCoach(selectedCoach.id, message, user?.uid || '');
      
      if (success) {
        const coachMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'coach',
          message: `Message envoyé à ${selectedCoach.name}. Elle vous répondra bientôt !`,
          timestamp: new Date(),
          senderName: selectedCoach.name
        };
        setMessages(prev => [...prev, coachMessage]);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.type === 'user';
    const isAI = item.type === 'ai';
    const isCoach = item.type === 'coach';

    return (
      <View style={[styles.messageContainer, isUser && styles.userMessageContainer]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          {!isUser && (
            <View style={styles.messageHeader}>
              <Ionicons 
                name={isAI ? 'sparkles' : 'person'} 
                size={16} 
                color={isAI ? '#FFD700' : '#4ECDC4'} 
              />
              <Text style={styles.senderName}>
                {isAI ? 'Coach IA' : item.senderName || 'Coach'}
              </Text>
            </View>
          )}
          
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.message}
          </Text>

          {/* Suggestions */}
          {item.suggestions && item.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {item.suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Recommandations d'exercices */}
          {item.workoutRecommendations && item.workoutRecommendations.length > 0 && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>💪 Exercices recommandés</Text>
              {item.workoutRecommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>
                    {rec.exercise}: {rec.sets} séries de {rec.reps} reps
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Conseils nutritionnels */}
          {item.nutritionAdvice && item.nutritionAdvice.length > 0 && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>🥗 Conseils nutritionnels</Text>
              {item.nutritionAdvice.map((advice, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>
                    {advice.quantity} de {advice.food}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>
            {item.timestamp.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderCoachCard = (coach: CoachProfile) => (
    <TouchableOpacity
      key={coach.id}
      style={[
        styles.coachCard,
        selectedCoach?.id === coach.id && styles.selectedCoachCard
      ]}
      onPress={() => setSelectedCoach(coach)}
    >
      <View style={styles.coachAvatar}>
        <Ionicons name="person" size={24} color="#fff" />
        <View style={[styles.onlineIndicator, coach.isOnline && styles.onlineIndicatorActive]} />
      </View>
      <View style={styles.coachInfo}>
        <Text style={styles.coachName}>{coach.name}</Text>
        <Text style={styles.coachSpecialty}>{coach.specialty}</Text>
        <View style={styles.coachRating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{coach.rating}</Text>
          <Text style={styles.experienceText}>{coach.experience} ans d'expérience</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2a2a00', '#0A0A0A', '#000000', '#0A0A0A', '#2a2a00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Coach IA & Humain</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ai' && styles.activeTab]}
            onPress={() => setActiveTab('ai')}
          >
            <Ionicons 
              name="sparkles" 
              size={20} 
              color={activeTab === 'ai' ? '#FFD700' : 'rgba(255,255,255,0.6)'} 
            />
            <Text style={[styles.tabText, activeTab === 'ai' && styles.activeTabText]}>
              Coach IA
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'coach' && styles.activeTab]}
            onPress={() => setActiveTab('coach')}
          >
            <Ionicons 
              name="people" 
              size={20} 
              color={activeTab === 'coach' ? '#FFD700' : 'rgba(255,255,255,0.6)'} 
            />
            <Text style={[styles.tabText, activeTab === 'coach' && styles.activeTabText]}>
              Coach Humain
            </Text>
          </TouchableOpacity>
        </View>

        {/* Coach Selection */}
        {activeTab === 'coach' && (
          <View style={styles.coachSelection}>
            <Text style={styles.sectionTitle}>Choisissez votre coach</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {coaches.map(renderCoachCard)}
            </ScrollView>
          </View>
        )}

        {/* Messages */}
        <KeyboardAvoidingView 
          style={styles.messagesContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          {/* Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder={activeTab === 'ai' ? 'Posez votre question...' : 'Écrivez à votre coach...'}
                placeholderTextColor="rgba(255,255,255,0.5)"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Ionicons name="send" size={20} color="#000" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, color: '#FFFFFF', fontWeight: '700' },
  headerRight: { width: 40 },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFD700',
  },
  coachSelection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  coachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginLeft: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 200,
  },
  selectedCoachCard: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  coachAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#0A0A0A',
  },
  onlineIndicatorActive: {
    backgroundColor: '#4CAF50',
  },
  coachInfo: { flex: 1 },
  coachName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  coachSpecialty: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  coachRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 4,
    marginRight: 8,
  },
  experienceText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  messagesContainer: { flex: 1 },
  messagesList: { flex: 1 },
  messagesContent: { padding: 20 },
  messageContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userBubble: {
    backgroundColor: '#FFD700',
    borderColor: '#E6C200',
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderName: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 6,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#000000',
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
  },
  userMessageTime: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  suggestionsContainer: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  suggestionText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
  },
  recommendationsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recommendationsTitle: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendationItem: {
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
});