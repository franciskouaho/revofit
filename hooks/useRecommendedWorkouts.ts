/**
 * Hook pour récupérer les entraînements recommandés depuis Firebase
 * RevoFit - Hook personnalisé pour les recommandations
 */

import { useAuth } from '@/contexts/AuthContext';
import { WorkoutTemplateService } from '@/services/firebase/workouts';
import { useEffect, useState } from 'react';

export interface RecommendedWorkout {
  id: string;
  name: string;
  tag: string;
  img: any; // Image source
  color: [string, string];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  duration: number;
  calories: number;
}

export interface UseRecommendedWorkoutsReturn {
  workouts: RecommendedWorkout[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRecommendedWorkouts(): UseRecommendedWorkoutsReturn {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<RecommendedWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendedWorkouts = async () => {
    if (!user?.uid) {
      setWorkouts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Récupérer tous les templates disponibles
      const templates = await WorkoutTemplateService.getAllTemplates();
      
      if (templates.length === 0) {
        setWorkouts([]);
        setLoading(false);
        return;
      }

      // Mélanger les templates pour avoir des recommandations variées
      const shuffledTemplates = [...templates].sort(() => Math.random() - 0.5);
      
      // Prendre les 3 premiers templates
      const recommendedTemplates = shuffledTemplates.slice(0, 3);
      
      // Couleurs prédéfinies pour les cartes
      const colors: [string, string][] = [
        ['#11160a', 'transparent'],
        ['#0a1016', 'transparent'],
        ['#16100a', 'transparent']
      ];

      const recommendedWorkouts: RecommendedWorkout[] = recommendedTemplates.map((template, index) => {
        // Calculer la durée estimée
        const estimatedDuration = template.exercises.length * 7; // 5 min par exercice + 2 min de repos
        
        // Calculer les calories estimées
        const baseCalories = {
          beginner: 200,
          intermediate: 300,
          advanced: 400
        };
        const estimatedCalories = baseCalories[template.difficulty] + (template.exercises.length * 50);
        
        // Créer le tag basé sur les groupes musculaires et la durée
        const muscleGroupText = template.muscleGroups.length > 0 
          ? template.muscleGroups[0] 
          : 'Full Body';
        const tag = `${muscleGroupText} • ${estimatedDuration}m`;

        return {
          id: template.id,
          name: template.name,
          tag,
          img: require('@/assets/images/onboarding-athlete.png'), // Image par défaut
          color: colors[index % colors.length],
          difficulty: template.difficulty,
          muscleGroups: template.muscleGroups,
          duration: estimatedDuration,
          calories: estimatedCalories
        };
      });

      setWorkouts(recommendedWorkouts);
    } catch (err) {
      console.error('Erreur lors de la récupération des entraînements recommandés:', err);
      setError('Impossible de charger les recommandations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedWorkouts();
  }, [user?.uid]);

  return {
    workouts,
    loading,
    error,
    refetch: fetchRecommendedWorkouts
  };
}
