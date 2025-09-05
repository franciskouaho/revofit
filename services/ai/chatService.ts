/**
 * Service de chat IA avec OpenAI API
 * RevoFit - Service pour l'intelligence artificielle et le coaching
 */

import {ChatMessage} from '../firebase/notifications';

// Configuration OpenAI
const OPENAI_API_KEY = "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" || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Types pour l'IA
export interface AIChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface AIChatResponse {
    message: string;
    suggestions?: string[];
    workoutRecommendations?: {
        exercise: string;
        sets: number;
        reps: number;
        rest: number;
    }[];
    nutritionAdvice?: {
        food: string;
        quantity: string;
        timing: string;
    }[];
}

export interface CoachProfile {
    id: string;
    name: string;
    specialty: string;
    experience: number;
    rating: number;
    avatar: string;
    isOnline: boolean;
    lastActive: Date;
}

/**
 * Service de chat IA
 */
export class AIChatService {
    /**
     * Envoie un message à l'IA et récupère la réponse
     */
    static async sendMessageToAI(
        message: string,
        context?: {
            userStats?: any;
            recentWorkouts?: any[];
            goals?: any;
        }
    ): Promise<AIChatResponse> {
        try {
            if (!OPENAI_API_KEY) {
                throw new Error('Clé API OpenAI non configurée');
            }

            const systemPrompt = this.buildSystemPrompt(context);
            const messages: AIChatMessage[] = [
                {role: 'system', content: systemPrompt},
                {role: 'user', content: message}
            ];

            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages,
                    max_tokens: 500,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erreur API OpenAI: ${response.status}`);
            }

            const data = await response.json();
            const aiMessage = data.choices[0].message.content;

            return this.parseAIResponse(aiMessage);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message à l\'IA:', error);
            return {
                message: 'Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.',
                suggestions: ['Réessayer', 'Contacter le support']
            };
        }
    }

    /**
     * Construit le prompt système pour l'IA
     */
    private static buildSystemPrompt(context?: any): string {
        let prompt = `Tu es un coach fitness IA spécialisé dans l'entraînement et la nutrition. 
Tu es expert en musculation, cardio, HIIT, yoga et nutrition sportive.
Tu dois être motivant, professionnel et donner des conseils pratiques et sûrs.

Règles importantes:
- Toujours recommander de consulter un professionnel de santé avant de commencer un nouveau programme
- Adapter tes conseils au niveau de l'utilisateur
- Être positif et motivant
- Donner des conseils pratiques et réalisables
- Inclure des suggestions d'exercices spécifiques quand approprié

Format de réponse:
- Réponds de manière conversationnelle et amicale
- Inclus des suggestions d'actions concrètes
- Propose des exercices avec sets/reps/rest quand pertinent
- Donne des conseils nutritionnels basiques quand approprié`;

        if (context?.userStats) {
            prompt += `\n\nInformations sur l'utilisateur:
- Calories brûlées: ${context.userStats.calories}
- Entraînements complétés: ${context.userStats.workouts?.completed || 0}
- Streak actuel: ${context.userStats.streak || 0} jours`;
        }

        if (context?.goals) {
            prompt += `\n\nObjectifs de l'utilisateur: ${JSON.stringify(context.goals)}`;
        }

        return prompt;
    }

    /**
     * Parse la réponse de l'IA pour extraire les suggestions et recommandations
     */
    private static parseAIResponse(message: string): AIChatResponse {
        // Extraire les suggestions (mots-clés simples)
        const suggestions = this.extractSuggestions(message);

        // Extraire les recommandations d'exercices
        const workoutRecommendations = this.extractWorkoutRecommendations(message);

        // Extraire les conseils nutritionnels
        const nutritionAdvice = this.extractNutritionAdvice(message);

        return {
            message,
            suggestions,
            workoutRecommendations,
            nutritionAdvice
        };
    }

    /**
     * Extrait les suggestions de la réponse
     */
    private static extractSuggestions(message: string): string[] {
        const suggestions: string[] = [];

        // Suggestions communes basées sur le contenu
        if (message.toLowerCase().includes('exercice') || message.toLowerCase().includes('entraînement')) {
            suggestions.push('Voir les exercices', 'Programmer un entraînement');
        }

        if (message.toLowerCase().includes('nutrition') || message.toLowerCase().includes('alimentation')) {
            suggestions.push('Voir la nutrition', 'Planifier les repas');
        }

        if (message.toLowerCase().includes('objectif') || message.toLowerCase().includes('progression')) {
            suggestions.push('Voir les statistiques', 'Définir un objectif');
        }

        if (message.toLowerCase().includes('motivation') || message.toLowerCase().includes('conseil')) {
            suggestions.push('Voir les conseils', 'Parler à un coach');
        }

        return suggestions.length > 0 ? suggestions : ['Poser une question', 'Voir les exercices'];
    }

    /**
     * Extrait les recommandations d'exercices
     */
    private static extractWorkoutRecommendations(message: string): any[] {
        const recommendations: any[] = [];

        // Recherche de patterns d'exercices dans le message
        const exercisePatterns = [
            {pattern: /(\d+)\s*(?:séries?|sets?)\s*de\s*(\d+)\s*(?:reps?|répétitions?)/gi, sets: 1, reps: 2},
            {pattern: /(\d+)\s*(?:reps?|répétitions?)\s*par\s*(\d+)\s*(?:séries?|sets?)/gi, sets: 2, reps: 1}
        ];

        exercisePatterns.forEach(({pattern, sets, reps}) => {
            const matches = [...message.matchAll(pattern)];
            matches.forEach(match => {
                recommendations.push({
                    exercise: 'Exercice recommandé',
                    sets: parseInt(match[sets]),
                    reps: parseInt(match[reps]),
                    rest: 60
                });
            });
        });

        return recommendations;
    }

    /**
     * Extrait les conseils nutritionnels
     */
    private static extractNutritionAdvice(message: string): any[] {
        const advice: any[] = [];

        // Recherche de patterns nutritionnels
        const nutritionPatterns = [
            {pattern: /(\d+)\s*(?:g|grammes?)\s*de\s*(\w+)/gi, quantity: 1, food: 2},
            {pattern: /(\d+)\s*(?:ml|litres?)\s*de\s*(\w+)/gi, quantity: 1, food: 2}
        ];

        nutritionPatterns.forEach(({pattern, quantity, food}) => {
            const matches = [...message.matchAll(pattern)];
            matches.forEach(match => {
                advice.push({
                    food: match[food],
                    quantity: match[quantity],
                    timing: 'Selon les besoins'
                });
            });
        });

        return advice;
    }

    /**
     * Génère des suggestions de questions basées sur le contexte
     */
    static generateQuestionSuggestions(context?: any): string[] {
        const suggestions = [
            'Comment améliorer ma forme physique ?',
            'Quels exercices pour perdre du poids ?',
            'Comment gagner en masse musculaire ?',
            'Quelle alimentation pour mes objectifs ?',
            'Comment rester motivé ?',
            'Comment éviter les blessures ?'
        ];

        if (context?.userStats?.streak > 7) {
            suggestions.unshift('Comment maintenir ma régularité ?');
        }

        if (context?.userStats?.calories > 50000) {
            suggestions.unshift('Comment optimiser mes entraînements ?');
        }

        return suggestions.slice(0, 4);
    }
}

/**
 * Service pour les coaches humains
 */
export class CoachService {
    /**
     * Récupère la liste des coaches disponibles
     */
    static async getAvailableCoaches(): Promise<CoachProfile[]> {
        // Simulation de coaches - à remplacer par une vraie API
        return [
            {
                id: '1',
                name: 'Marie Dubois',
                specialty: 'Musculation & Cardio',
                experience: 5,
                rating: 4.9,
                avatar: 'https://via.placeholder.com/100',
                isOnline: true,
                lastActive: new Date()
            },
            {
                id: '2',
                name: 'Pierre Martin',
                specialty: 'CrossFit & HIIT',
                experience: 8,
                rating: 4.8,
                avatar: 'https://via.placeholder.com/100',
                isOnline: false,
                lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2h ago
            },
            {
                id: '3',
                name: 'Sophie Laurent',
                specialty: 'Yoga & Pilates',
                experience: 6,
                rating: 4.9,
                avatar: 'https://via.placeholder.com/100',
                isOnline: true,
                lastActive: new Date()
            }
        ];
    }

    /**
     * Envoie un message à un coach
     */
    static async sendMessageToCoach(
        coachId: string,
        message: string,
        userId: string
    ): Promise<boolean> {
        try {
            // Simulation d'envoi - à remplacer par une vraie API
            console.log(`Message envoyé au coach ${coachId}: ${message}`);

            // Ici, vous pourriez sauvegarder le message dans Firebase
            // et envoyer une notification push au coach

            return true;
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message au coach:', error);
            return false;
        }
    }

    /**
     * Récupère les messages avec un coach
     */
    static async getCoachMessages(
        coachId: string,
        userId: string
    ): Promise<ChatMessage[]> {
        try {
            // Simulation de messages - à remplacer par une vraie API
            return [
                {
                    id: '1',
                    userId,
                    senderId: coachId,
                    senderName: 'Marie Dubois',
                    senderType: 'coach',
                    message: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
                    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1h ago
                    isRead: true
                },
                {
                    id: '2',
                    userId,
                    senderId: userId,
                    senderName: 'Vous',
                    senderType: 'user',
                    message: 'J\'aimerais améliorer ma technique de squat',
                    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30min ago
                    isRead: true
                }
            ];
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
            return [];
        }
    }
}
