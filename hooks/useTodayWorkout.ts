/**
 * Hook pour récupérer l'entraînement du jour depuis Firebase
 * RevoFit - Hook personnalisé pour l'entraînement du jour
 */

import { useAuth } from '@/contexts/AuthContext';
import { WorkoutTemplateService } from '@/services/firebase/workouts';
import { useEffect, useState } from 'react';

export interface TodayWorkout {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  calories: number;
  duration: number;
  image: any; // Image source
  muscleGroups: string[];
  exercises: any[];
}

export interface UseTodayWorkoutReturn {
  workout: TodayWorkout | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTodayWorkout(): UseTodayWorkoutReturn {
  const { user } = useAuth();
  const [workout, setWorkout] = useState<TodayWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayWorkout = async () => {
    if (!user?.uid) {
      setWorkout(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Récupérer tous les templates disponibles
      const templates = await WorkoutTemplateService.getAllTemplates();
      
      if (templates.length === 0) {
        setWorkout(null);
        setLoading(false);
        return;
      }

      // Sélectionner un template aléatoire pour l'entraînement du jour
      // En production, on pourrait utiliser un algorithme plus sophistiqué
      // basé sur l'historique de l'utilisateur, ses préférences, etc.
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      // Calculer les calories estimées (basé sur la durée et la difficulté)
      const baseCalories = {
        beginner: 200,
        intermediate: 300,
        advanced: 400
      };
      
      const estimatedCalories = baseCalories[randomTemplate.difficulty] + 
        (randomTemplate.exercises.length * 50);

      // Calculer la durée estimée (5 min par exercice + 2 min de repos)
      const estimatedDuration = randomTemplate.exercises.length * 7;

      const todayWorkout: TodayWorkout = {
        id: randomTemplate.id,
        name: randomTemplate.name,
        difficulty: randomTemplate.difficulty,
        calories: estimatedCalories,
        duration: estimatedDuration,
        image: require('@/assets/images/onboarding-athlete.png'), // Image par défaut
        muscleGroups: randomTemplate.muscleGroups,
        exercises: randomTemplate.exercises
      };

      setWorkout(todayWorkout);
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'entraînement du jour:', err);
      setError('Impossible de charger l\'entraînement du jour');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayWorkout();
  }, [user?.uid]);

  return {
    workout,
    loading,
    error,
    refetch: fetchTodayWorkout
  };
}
