/**
 * Hook pour la gestion de la récupération musculaire
 * RevoFit - Gestion des données de récupération des groupes musculaires
 */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MuscleGroupService } from '../services/firebase/exercises';
import { WorkoutSessionService } from '../services/firebase/workouts';
import { MuscleGroup } from '../types/exercise';

export interface MuscleRecoveryData {
  muscleGroup: MuscleGroup;
  recoveryPercentage: number;
  lastWorkoutDate: string | null;
  daysSinceLastWorkout: number;
  status: 'fresh' | 'recovering' | 'ready' | 'overdue';
  color: string;
  subtitle: string;
}

export interface UseMuscleRecoveryReturn {
  recoveryData: MuscleRecoveryData[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
  setCurrentIndex: (index: number) => void;
  refreshData: () => Promise<void>;
}

export function useMuscleRecovery(): UseMuscleRecoveryReturn {
  const { user } = useAuth();
  const userId = user?.uid;

  const [recoveryData, setRecoveryData] = useState<MuscleRecoveryData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calcule le pourcentage de récupération basé sur les jours depuis le dernier entraînement
   */
  const calculateRecoveryPercentage = (daysSinceLastWorkout: number): number => {
    // Logique de récupération : 0% après 0 jours, 100% après 7 jours
    if (daysSinceLastWorkout === 0) return 0;
    if (daysSinceLastWorkout >= 7) return 100;
    
    // Récupération progressive sur 7 jours
    return Math.min(100, (daysSinceLastWorkout / 7) * 100);
  };

  /**
   * Détermine le statut de récupération
   */
  const getRecoveryStatus = (daysSinceLastWorkout: number, recoveryPercentage: number): {
    status: 'fresh' | 'recovering' | 'ready' | 'overdue';
    color: string;
    subtitle: string;
  } => {
    if (daysSinceLastWorkout === 0) {
      return {
        status: 'fresh',
        color: '#FF6B6B',
        subtitle: 'Juste entraîné'
      };
    }
    
    if (recoveryPercentage >= 100) {
      return {
        status: 'ready',
        color: '#4CAF50',
        subtitle: 'Prêt à s\'entraîner'
      };
    }
    
    if (recoveryPercentage >= 70) {
      return {
        status: 'recovering',
        color: '#FFD700',
        subtitle: 'En récupération'
      };
    }
    
    return {
      status: 'overdue',
      color: '#FF9800',
      subtitle: 'Récupération nécessaire'
    };
  };

  /**
   * Récupère les données de récupération pour tous les groupes musculaires
   */
  const fetchRecoveryData = useCallback(async () => {
    console.log('🔄 fetchRecoveryData appelé, userId:', userId);
    
    if (!userId) {
      console.log('❌ Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🏋️ Récupération des données de récupération musculaire...');

      // Récupérer tous les groupes musculaires
      const muscleGroupsResponse = await MuscleGroupService.getAllMuscleGroups();
      
      if (!muscleGroupsResponse.success || !muscleGroupsResponse.data) {
        throw new Error('Erreur lors de la récupération des groupes musculaires');
      }

      const muscleGroups = muscleGroupsResponse.data;
      const recoveryDataArray: MuscleRecoveryData[] = [];

      // Pour chaque groupe musculaire, calculer la récupération
      for (const muscleGroup of muscleGroups) {
        try {
          // Récupérer les sessions d'entraînement récentes pour ce groupe musculaire
          const sessionsResponse = await WorkoutSessionService.getUserWorkoutSessions(
            userId,
            { limit: 10, muscleGroups: [muscleGroup.id] }
          );

          let lastWorkoutDate: string | null = null;
          let daysSinceLastWorkout = 999; // Valeur par défaut pour les groupes jamais entraînés

          if (sessionsResponse.success && sessionsResponse.data && sessionsResponse.data.length > 0) {
            // Trier par date décroissante et prendre la plus récente
            const sortedSessions = sessionsResponse.data.sort((a, b) => 
              new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
            );
            
            lastWorkoutDate = sortedSessions[0].completedAt;
            const lastWorkout = new Date(lastWorkoutDate);
            const today = new Date();
            daysSinceLastWorkout = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
          }

          const recoveryPercentage = calculateRecoveryPercentage(daysSinceLastWorkout);
          const { status, color, subtitle } = getRecoveryStatus(daysSinceLastWorkout, recoveryPercentage);

          recoveryDataArray.push({
            muscleGroup,
            recoveryPercentage,
            lastWorkoutDate,
            daysSinceLastWorkout,
            status,
            color,
            subtitle
          });
        } catch (muscleError) {
          console.warn(`Erreur pour le groupe musculaire ${muscleGroup.name}:`, muscleError);
          
          // Ajouter le groupe avec des données par défaut
          recoveryDataArray.push({
            muscleGroup,
            recoveryPercentage: 100,
            lastWorkoutDate: null,
            daysSinceLastWorkout: 999,
            status: 'ready',
            color: '#4CAF50',
            subtitle: 'Prêt à s\'entraîner'
          });
        }
      }

      // Trier par pourcentage de récupération (du plus bas au plus haut)
      recoveryDataArray.sort((a, b) => a.recoveryPercentage - b.recoveryPercentage);

      setRecoveryData(recoveryDataArray);
      console.log('✅ Données de récupération récupérées:', recoveryDataArray.length, 'groupes musculaires');
      console.log('🔍 Détails des données:', recoveryDataArray);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la récupération des données de récupération:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Rafraîchit les données
   */
  const refreshData = useCallback(async () => {
    await fetchRecoveryData();
  }, [fetchRecoveryData]);

  // Charger les données au montage
  useEffect(() => {
    console.log('🔄 useMuscleRecovery useEffect - userId:', userId);
    if (userId) {
      fetchRecoveryData();
    } else {
      console.log('❌ Pas d\'userId, données par défaut');
      // Afficher des données par défaut avec 0% même sans userId
      const defaultData: MuscleRecoveryData[] = [{
        muscleGroup: { id: 'default', name: 'Abs', nameEn: 'Abs', category: 'primary' as const, imageUrl: '', description: '', exercises: [], createdAt: new Date(), updatedAt: new Date() },
        recoveryPercentage: 0,
        lastWorkoutDate: null,
        daysSinceLastWorkout: 0,
        status: 'fresh' as const,
        color: '#FF6B6B',
        subtitle: 'Juste entraîné'
      }];
      setRecoveryData(defaultData);
      console.log('✅ Données par défaut avec 0% définies:', defaultData);
    }
  }, [userId, fetchRecoveryData]);

  return {
    recoveryData,
    currentIndex,
    loading,
    error,
    setCurrentIndex,
    refreshData
  };
}
