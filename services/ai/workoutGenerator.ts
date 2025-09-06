/**
 * Service IA pour la génération de plans d'entraînement
 * RevoFit - Génération intelligente de workouts
 */

import { Exercise, ExerciseTemplate } from '../../types/exercise';
import { ExerciseService } from '../firebase/exercises';
import { AIChatService } from './chatService';

// Types pour la génération de workout
export interface WorkoutGenerationParams {
  equipment: string;
  duration: string;
  intensity: string;
  muscleGroups: string[];
  additionalInfo?: string;
}

export interface GeneratedExercise {
  name: string;
  nameEn: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  sets: number;
  reps: number;
  rest: number; // en secondes
  order: number;
}

export interface GeneratedWorkout {
  title: string;
  description: string;
  exercises: GeneratedExercise[];
  totalDuration: number; // en minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  muscleGroups: string[];
  estimatedCalories: number;
  instructions: string[];
  tips: string[];
}

/**
 * Service de génération de workouts avec IA
 */
export class AIWorkoutGenerator {
  /**
   * Génère un plan d'entraînement personnalisé avec l'IA
   */
  static async generateWorkout(params: WorkoutGenerationParams): Promise<GeneratedWorkout> {
    try {
      const prompt = this.buildWorkoutPrompt(params);
      
      const response = await AIChatService.sendMessageToAI(prompt, {
        userStats: {
          equipment: params.equipment,
          duration: params.duration,
          intensity: params.intensity,
          muscleGroups: params.muscleGroups
        }
      });

      return this.parseWorkoutResponse(response.message, params);
    } catch (error) {
      console.error('Erreur lors de la génération du workout:', error);
      throw new Error('Impossible de générer le plan d\'entraînement. Veuillez réessayer.');
    }
  }

  /**
   * Construit le prompt pour la génération de workout
   */
  private static buildWorkoutPrompt(params: WorkoutGenerationParams): string {
    const durationMinutes = this.parseDuration(params.duration);
    
    return `Tu es un expert en fitness et musculation. Génère un plan d'entraînement complet et structuré.

PARAMÈTRES:
- Équipement disponible: ${params.equipment}
- Durée: ${params.duration} (${durationMinutes} minutes)
- Intensité: ${params.intensity}
- Groupes musculaires ciblés: ${params.muscleGroups.join(', ')}
- Informations supplémentaires: ${params.additionalInfo || 'Aucune'}

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.

FORMAT DE RÉPONSE OBLIGATOIRE (JSON valide):
{
  "title": "Titre du workout",
  "description": "Description détaillée du workout",
  "exercises": [
    {
      "name": "Nom de l'exercice en français",
      "nameEn": "Nom de l'exercice en anglais",
      "muscleGroups": ["groupe1", "groupe2"],
      "equipment": ["équipement1", "équipement2"],
      "difficulty": "beginner|intermediate|advanced",
      "instructions": ["instruction1", "instruction2"],
      "tips": ["conseil1", "conseil2"],
      "sets": 3,
      "reps": 12,
      "rest": 60,
      "order": 1
    }
  ],
  "totalDuration": ${durationMinutes},
  "difficulty": "beginner|intermediate|advanced",
  "equipment": ["${params.equipment}"],
  "muscleGroups": ${JSON.stringify(params.muscleGroups)},
  "estimatedCalories": 300,
  "instructions": ["instruction générale 1", "instruction générale 2"],
  "tips": ["conseil général 1", "conseil général 2"]
}

RÈGLES IMPORTANTES:
1. Adapte le nombre d'exercices à la durée (environ 1 exercice par 5-7 minutes)
2. Respecte l'équipement disponible
3. Cible les groupes musculaires demandés
4. Adapte l'intensité (reps, sets, poids) selon le niveau
5. Inclus un échauffement et une récupération
6. Varie les exercices pour éviter la monotonie
7. Assure-toi que le JSON est valide et complet
8. Utilise des noms d'exercices réalistes et reconnus
9. Inclus des instructions claires et des conseils pratiques
10. Calcule une estimation réaliste des calories brûlées

Génère un workout motivant et efficace !`;
  }


  /**
   * Parse la durée en minutes
   */
  private static parseDuration(duration: string): number {
    const match = duration.match(/(\d+)h?\s*(\d+)?m?/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return hours * 60 + minutes;
    }
    return 60; // Par défaut 1h
  }

  /**
   * Parse la réponse de l'IA pour extraire le workout
   */
  private static parseWorkoutResponse(response: string, params: WorkoutGenerationParams): GeneratedWorkout {
    try {
      console.log('🔍 Réponse IA brute:', response);
      
      // Vérifier si c'est un message d'erreur
      if (response.includes('Désolé, je rencontre un problème technique') || 
          response.includes('problème technique') ||
          response.includes('Erreur')) {
        console.log('⚠️ Message d\'erreur détecté, utilisation du fallback');
        return this.generateFallbackWorkout(params);
      }
      
      // Nettoyer la réponse et essayer plusieurs méthodes d'extraction JSON
      let workoutData;
      
      // Méthode 1: Chercher un JSON complet entre accolades
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          workoutData = JSON.parse(jsonMatch[0]);
          console.log('✅ JSON extrait avec regex:', workoutData);
        } catch {
          console.log('❌ Échec parsing regex, essai méthode 2');
        }
      }
      
      // Méthode 2: Chercher un JSON entre ```json et ```
      if (!workoutData) {
        const codeBlockMatch = response.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
          try {
            workoutData = JSON.parse(codeBlockMatch[1]);
            console.log('✅ JSON extrait du code block:', workoutData);
          } catch {
            console.log('❌ Échec parsing code block, essai méthode 3');
          }
        }
      }
      
      // Méthode 3: Essayer de parser directement la réponse
      if (!workoutData) {
        try {
          workoutData = JSON.parse(response);
          console.log('✅ JSON parsé directement:', workoutData);
        } catch {
          console.log('❌ Échec parsing direct, essai méthode 4');
        }
      }
      
      // Méthode 4: Chercher un JSON valide en testant différentes parties
      if (!workoutData) {
        const lines = response.split('\n');
        for (let i = 0; i < lines.length; i++) {
          for (let j = i + 1; j < lines.length; j++) {
            const testJson = lines.slice(i, j).join('\n');
            try {
              const parsed = JSON.parse(testJson);
              if (parsed && typeof parsed === 'object' && parsed.exercises) {
                workoutData = parsed;
                console.log('✅ JSON trouvé dans les lignes:', workoutData);
                break;
              }
            } catch {
              // Continuer à chercher
            }
          }
          if (workoutData) break;
        }
      }
      
      if (!workoutData) {
        console.error('❌ Impossible d\'extraire un JSON valide de la réponse:', response);
        console.log('🔄 Génération d\'un workout de fallback...');
        
        // Générer un workout de fallback avec des exercices de base
        workoutData = this.generateFallbackWorkout(params);
      }
      
      // Validation des données requises
      if (!workoutData.title || !workoutData.exercises || !Array.isArray(workoutData.exercises)) {
        throw new Error('Données de workout incomplètes');
      }

      // Validation et nettoyage des exercices
      const exercises: GeneratedExercise[] = workoutData.exercises.map((ex: any, index: number) => ({
        name: ex.name || `Exercice ${index + 1}`,
        nameEn: ex.nameEn || ex.name || `Exercise ${index + 1}`,
        muscleGroups: Array.isArray(ex.muscleGroups) ? ex.muscleGroups : [],
        equipment: Array.isArray(ex.equipment) ? ex.equipment : [params.equipment],
        difficulty: ['beginner', 'intermediate', 'advanced'].includes(ex.difficulty) 
          ? ex.difficulty 
          : this.mapIntensityToDifficulty(params.intensity),
        instructions: Array.isArray(ex.instructions) ? ex.instructions : [],
        tips: Array.isArray(ex.tips) ? ex.tips : [],
        sets: typeof ex.sets === 'number' ? ex.sets : this.getDefaultSets(params.intensity),
        reps: typeof ex.reps === 'number' ? ex.reps : this.getDefaultReps(params.intensity),
        rest: typeof ex.rest === 'number' ? ex.rest : 60,
        order: typeof ex.order === 'number' ? ex.order : index + 1
      }));

      return {
        title: workoutData.title || `Workout ${params.muscleGroups.join(', ')}`,
        description: workoutData.description || `Entraînement ciblant ${params.muscleGroups.join(', ')} avec ${params.equipment}`,
        exercises,
        totalDuration: workoutData.totalDuration || this.parseDuration(params.duration),
        difficulty: workoutData.difficulty || this.mapIntensityToDifficulty(params.intensity),
        equipment: workoutData.equipment || [params.equipment],
        muscleGroups: workoutData.muscleGroups || params.muscleGroups,
        estimatedCalories: workoutData.estimatedCalories || this.estimateCalories(params.intensity, this.parseDuration(params.duration)),
        instructions: Array.isArray(workoutData.instructions) ? workoutData.instructions : [],
        tips: Array.isArray(workoutData.tips) ? workoutData.tips : []
      };
    } catch (error) {
      console.error('Erreur lors du parsing de la réponse IA:', error);
      // Fallback: générer un workout basique
      return this.generateFallbackWorkout(params);
    }
  }

  /**
   * Génère un workout de fallback en cas d'erreur
   */
  private static generateFallbackWorkout(params: WorkoutGenerationParams): GeneratedWorkout {
    const duration = this.parseDuration(params.duration);
    const exerciseCount = Math.max(3, Math.floor(duration / 8));
    
    const exercises: GeneratedExercise[] = [];
    
    // Exercices de base selon l'équipement
    const baseExercises = this.getBaseExercises(params.equipment, params.muscleGroups);
    
    for (let i = 0; i < Math.min(exerciseCount, baseExercises.length); i++) {
      const baseEx = baseExercises[i];
      exercises.push({
        name: baseEx.name || `Exercice ${i + 1}`,
        nameEn: baseEx.nameEn || baseEx.name || `Exercise ${i + 1}`,
        muscleGroups: baseEx.muscleGroups || [],
        equipment: baseEx.equipment || [params.equipment],
        difficulty: baseEx.difficulty || this.mapIntensityToDifficulty(params.intensity),
        instructions: baseEx.instructions || [],
        tips: baseEx.tips || [],
        sets: this.getDefaultSets(params.intensity),
        reps: this.getDefaultReps(params.intensity),
        rest: 60,
        order: i + 1
      });
    }

    return {
      title: `Workout ${params.muscleGroups.join(', ')}`,
      description: `Entraînement ciblant ${params.muscleGroups.join(', ')} avec ${params.equipment}`,
      exercises,
      totalDuration: duration,
      difficulty: this.mapIntensityToDifficulty(params.intensity),
      equipment: [params.equipment],
      muscleGroups: params.muscleGroups,
      estimatedCalories: this.estimateCalories(params.intensity, duration),
      instructions: [
        'Échauffez-vous 5-10 minutes avant de commencer',
        'Respectez les temps de repos entre les séries',
        'Hydratez-vous régulièrement',
        'Écoutez votre corps et ajustez l\'intensité si nécessaire'
      ],
      tips: [
        'Maintenez une forme correcte plutôt que de soulever lourd',
        'Respirez correctement pendant les exercices',
        'Progressez graduellement dans l\'intensité'
      ]
    };
  }

  /**
   * Retourne des exercices de base selon l'équipement
   */
  private static getBaseExercises(equipment: string, muscleGroups: string[]): Partial<GeneratedExercise>[] {
    const exercises: Partial<GeneratedExercise>[] = [];

    if (equipment === 'No Equipment') {
      exercises.push(
        { name: 'Pompes', nameEn: 'Push-ups', muscleGroups: ['Chest', 'Triceps'], equipment: ['aucun'] },
        { name: 'Squats', nameEn: 'Squats', muscleGroups: ['Quads', 'Glutes'], equipment: ['aucun'] },
        { name: 'Planche', nameEn: 'Plank', muscleGroups: ['Core'], equipment: ['aucun'] },
        { name: 'Fentes', nameEn: 'Lunges', muscleGroups: ['Quads', 'Glutes'], equipment: ['aucun'] },
        { name: 'Burpees', nameEn: 'Burpees', muscleGroups: ['Quads', 'Chest', 'Core'], equipment: ['aucun'] }
      );
    } else if (equipment === 'Home Gym (DB/KB)') {
      exercises.push(
        { name: 'Développé couché haltères', nameEn: 'Dumbbell Bench Press', muscleGroups: ['Chest', 'Triceps'], equipment: ['haltères'] },
        { name: 'Squats avec haltères', nameEn: 'Dumbbell Squats', muscleGroups: ['Quads', 'Glutes'], equipment: ['haltères'] },
        { name: 'Rowing haltère', nameEn: 'Dumbbell Row', muscleGroups: ['Back', 'Biceps'], equipment: ['haltères'] },
        { name: 'Développé militaire', nameEn: 'Overhead Press', muscleGroups: ['Shoulders', 'Triceps'], equipment: ['haltères'] }
      );
    } else {
      exercises.push(
        { name: 'Développé couché', nameEn: 'Bench Press', muscleGroups: ['Chest', 'Triceps'], equipment: ['barbell'] },
        { name: 'Squats', nameEn: 'Squats', muscleGroups: ['Quads', 'Glutes'], equipment: ['barbell'] },
        { name: 'Rowing barre', nameEn: 'Barbell Row', muscleGroups: ['Back', 'Biceps'], equipment: ['barbell'] },
        { name: 'Soulevé de terre', nameEn: 'Deadlift', muscleGroups: ['Back', 'Hamstrings', 'Glutes'], equipment: ['barbell'] }
      );
    }

    return exercises.slice(0, 5);
  }

  /**
   * Mappe l'intensité vers la difficulté
   */
  private static mapIntensityToDifficulty(intensity: string): 'beginner' | 'intermediate' | 'advanced' {
    switch (intensity.toLowerCase()) {
      case 'low': return 'beginner';
      case 'medium': return 'intermediate';
      case 'high': return 'advanced';
      default: return 'intermediate';
    }
  }

  /**
   * Retourne le nombre de séries par défaut selon l'intensité
   */
  private static getDefaultSets(intensity: string): number {
    switch (intensity.toLowerCase()) {
      case 'low': return 3;
      case 'medium': return 4;
      case 'high': return 5;
      default: return 4;
    }
  }

  /**
   * Retourne le nombre de reps par défaut selon l'intensité
   */
  private static getDefaultReps(intensity: string): number {
    switch (intensity.toLowerCase()) {
      case 'low': return 12;
      case 'medium': return 10;
      case 'high': return 8;
      default: return 10;
    }
  }

  /**
   * Estime les calories brûlées
   */
  private static estimateCalories(intensity: string, duration: number): number {
    const baseCalories = duration * 5; // 5 cal/min de base
    const multiplier = intensity.toLowerCase() === 'high' ? 1.5 : intensity.toLowerCase() === 'medium' ? 1.2 : 1.0;
    return Math.round(baseCalories * multiplier);
  }

  /**
   * Convertit un workout généré en template Firebase
   */
  static convertToExerciseTemplate(workout: GeneratedWorkout, userId: string): Omit<ExerciseTemplate, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: workout.title,
      description: workout.description,
      muscleGroups: workout.muscleGroups,
      exercises: workout.exercises.map(ex => ({
        id: ex.nameEn.toLowerCase().replace(/\s+/g, '-'),
        name: ex.name,
        nameEn: ex.nameEn,
        muscleGroups: ex.muscleGroups,
        equipment: ex.equipment,
        difficulty: ex.difficulty,
        instructions: ex.instructions,
        tips: ex.tips,
        imageUrl: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      duration: workout.totalDuration,
      difficulty: workout.difficulty,
      equipment: workout.equipment,
      imageUrl: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      isPublic: false,
      createdBy: userId
    };
  }

  /**
   * Sauvegarde les exercices générés par l'IA dans la base de données
   */
  static async saveGeneratedExercises(workout: GeneratedWorkout): Promise<Exercise[]> {
    const savedExercises: Exercise[] = [];
    
    for (const generatedEx of workout.exercises) {
      try {
        // Convertir l'exercice généré en format Exercise
        const exerciseData: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'> = {
          name: generatedEx.name,
          nameEn: generatedEx.nameEn,
          muscleGroups: generatedEx.muscleGroups,
          equipment: generatedEx.equipment,
          difficulty: generatedEx.difficulty,
          instructions: generatedEx.instructions,
          tips: generatedEx.tips,
          imageUrl: '' // L'IA ne génère pas d'images
        };

        // Sauvegarder dans Firebase
        const response = await ExerciseService.createExercise(exerciseData);
        
        if (response.success && response.data) {
          // response.data peut être Exercise ou Exercise[], on s'assure que c'est un Exercise
          const exercise = Array.isArray(response.data) ? response.data[0] : response.data;
          if (exercise) {
            savedExercises.push(exercise);
          }
        } else {
          console.warn('Erreur lors de la sauvegarde de l\'exercice:', generatedEx.name);
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'exercice:', generatedEx.name, error);
      }
    }
    
    return savedExercises;
  }
}
