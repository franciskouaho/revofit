/**
 * Hook personnalisé pour la gestion des séries d'exercices
 * RevoFit - Suivi des séries complétées avec Firebase
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ExerciseSetService } from '../services/firebase/exerciseSets';

export interface UseExerciseSetsProps {
  exerciseId: string;
  exerciseName: string;
  templateId?: string;
}

export interface UseExerciseSetsReturn {
  completedSets: number[];
  loading: boolean;
  error: string | null;
  completeSet: (
    setNumber: number,
    totalSets: number,
    reps: number,
    weight?: number,
    duration?: number,
    restTime?: string
  ) => Promise<boolean>;
  removeSet: (setNumber: number) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useExerciseSets({
  exerciseId,
  exerciseName,
  templateId
}: UseExerciseSetsProps): UseExerciseSetsReturn {
  const { user } = useAuth();
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les séries complétées au chargement
  const fetchCompletedSets = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const sets = await ExerciseSetService.getCompletedSets(
        user.uid,
        exerciseId,
        templateId
      );
      
      setCompletedSets(sets);
    } catch (err) {
      console.error('Erreur lors de la récupération des séries:', err);
      setError('Erreur lors du chargement des séries');
    } finally {
      setLoading(false);
    }
  };

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = ExerciseSetService.watchCompletedSets(
      user.uid,
      exerciseId,
      (sets) => {
        setCompletedSets(sets);
        setLoading(false);
      },
      templateId
    );

    return unsubscribe;
  }, [user?.uid, exerciseId, templateId]);

  // Charger les données initiales
  useEffect(() => {
    fetchCompletedSets();
  }, [user?.uid, exerciseId, templateId]);

  // Fonction pour marquer une série comme complétée
  const completeSet = async (
    setNumber: number,
    totalSets: number,
    reps: number,
    weight?: number,
    duration?: number,
    restTime?: string
  ): Promise<boolean> => {
    if (!user?.uid) {
      setError('Utilisateur non connecté');
      return false;
    }

    try {
      setError(null);
      
      const success = await ExerciseSetService.completeSet(
        user.uid,
        exerciseId,
        exerciseName,
        setNumber,
        totalSets,
        reps,
        weight,
        duration,
        restTime,
        templateId
      );

      if (success) {
        // La mise à jour se fera automatiquement via l'écoute en temps réel
        console.log(`✅ Série ${setNumber} marquée comme complétée`);
      }

      return success;
    } catch (err) {
      console.error('Erreur lors de la validation de la série:', err);
      setError('Erreur lors de la validation de la série');
      return false;
    }
  };

  // Fonction pour supprimer une série complétée
  const removeSet = async (setNumber: number): Promise<boolean> => {
    if (!user?.uid) {
      setError('Utilisateur non connecté');
      return false;
    }

    try {
      setError(null);
      
      const success = await ExerciseSetService.removeCompletedSet(
        user.uid,
        exerciseId,
        setNumber
      );

      if (success) {
        console.log(`🗑️ Série ${setNumber} supprimée`);
      }

      return success;
    } catch (err) {
      console.error('Erreur lors de la suppression de la série:', err);
      setError('Erreur lors de la suppression de la série');
      return false;
    }
  };

  // Fonction pour recharger les données
  const refetch = async () => {
    await fetchCompletedSets();
  };

  return {
    completedSets,
    loading,
    error,
    completeSet,
    removeSet,
    refetch
  };
}
