/**
 * Hook pour récupérer le statut d'entraînement depuis Firebase
 * RevoFit - Hook personnalisé pour le statut d'entraînement
 */

import { useAuth } from '@/contexts/AuthContext';
import { WorkoutStatus, WorkoutStatusService } from '@/services/firebase/workoutStatus';
import { useEffect, useState } from 'react';

export interface UseWorkoutStatusReturn {
  status: WorkoutStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWorkoutStatus(): UseWorkoutStatusReturn {
  const { user } = useAuth();
  const [status, setStatus] = useState<WorkoutStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!user?.uid) {
      setStatus(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const workoutStatus = await WorkoutStatusService.getWorkoutStatus(user.uid);
      setStatus(workoutStatus);
    } catch (err) {
      console.error('Erreur lors de la récupération du statut:', err);
      setError('Impossible de charger le statut d\'entraînement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user?.uid]);

  // Écouter les changements en temps réel (optimisé pour éviter les re-renders)
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = WorkoutStatusService.watchWorkoutStatus(user.uid, (newStatus) => {
      // Vérifier si le statut a vraiment changé avant de mettre à jour
      setStatus(prevStatus => {
        if (prevStatus && JSON.stringify(prevStatus) === JSON.stringify(newStatus)) {
          return prevStatus; // Pas de changement, éviter le re-render
        }
        return newStatus;
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus
  };
}
