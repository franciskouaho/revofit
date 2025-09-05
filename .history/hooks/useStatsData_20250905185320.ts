/**
 * Hook personnalisé pour récupérer toutes les données de statistiques
 * RevoFit - Hook complet pour les statistiques de l'application
 */

import { useAuth } from '@/contexts/AuthContext';
import { UserStats, UserStatsService, DailyActivity } from '@/services/firebase/userStats';
import { WorkoutSession, WorkoutSessionService } from '@/services/firebase/workouts';
import { WorkoutStatus, WorkoutStatusService, UserStreak } from '@/services/firebase/workoutStatus';
import { useEffect, useState } from 'react';

export interface StatsData {
  // Statistiques de base
  userStats: UserStats | null;
  dailyActivity: DailyActivity[];
  workoutSessions: WorkoutSession[];
  workoutStatus: WorkoutStatus | null;
  userStreak: UserStreak | null;
  
  // Métriques calculées
  totalCalories: number;
  totalSteps: number;
  totalWorkouts: number;
  averageHeartRate: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  
  // Données pour les graphiques
  weeklyData: {
    date: string;
    calories: number;
    steps: number;
    workouts: number;
  }[];
  
  monthlyData: {
    month: string;
    calories: number;
    workouts: number;
  }[];
  
  // Records et comparaisons
  personalRecords: {
    longestDistance: number;
    bestPace: number;
    maxCalories: number;
    longestStreak: number;
  };
  
  // État de chargement
  loading: boolean;
  error: string | null;
}

export function useStatsData(): StatsData {
  const { user } = useAuth();
  const [data, setData] = useState<StatsData>({
    userStats: null,
    dailyActivity: [],
    workoutSessions: [],
    workoutStatus: null,
    userStreak: null,
    totalCalories: 0,
    totalSteps: 0,
    totalWorkouts: 0,
    averageHeartRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
    weeklyData: [],
    monthlyData: [],
    personalRecords: {
      longestDistance: 0,
      bestPace: 0,
      maxCalories: 0,
      longestStreak: 0,
    },
    loading: true,
    error: null,
  });

  const fetchAllData = async () => {
    if (!user?.uid) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Récupérer toutes les données en parallèle
      const [
        userStats,
        workoutSessions,
        workoutStatus,
        userStreak,
      ] = await Promise.all([
        UserStatsService.getUserStats(user.uid),
        WorkoutSessionService.getUserWorkoutSessions(user.uid, 30),
        WorkoutStatusService.getWorkoutStatus(user.uid),
        WorkoutStatusService.getUserStreak(user.uid),
      ]);

      // Récupérer l'activité quotidienne des 7 derniers jours
      const dailyActivityPromises = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyActivityPromises.push(
          UserStatsService.getDailyActivity(user.uid, dateStr)
        );
      }
      const dailyActivityResults = await Promise.all(dailyActivityPromises);
      const dailyActivity = dailyActivityResults.filter(Boolean) as DailyActivity[];

      // Calculer les métriques
      const totalCalories = userStats?.calories || 0;
      const totalSteps = userStats?.steps || 0;
      const totalWorkouts = workoutSessions.filter(session => session.status === 'completed').length;
      const averageHeartRate = userStats?.heartRate || 0;
      const currentStreak = userStreak?.currentStreak || 0;
      const longestStreak = userStreak?.longestStreak || 0;
      const completionRate = userStats?.workouts.total > 0 
        ? Math.round((userStats.workouts.completed / userStats.workouts.total) * 100)
        : 0;

      // Générer les données hebdomadaires
      const weeklyData = dailyActivity.map(activity => ({
        date: activity.date,
        calories: activity.calories,
        steps: activity.steps,
        workouts: activity.workoutsCompleted,
      }));

      // Générer les données mensuelles (6 derniers mois)
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleDateString('fr-FR', { month: 'short' });
        
        // Calculer les calories et workouts pour ce mois
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthWorkouts = workoutSessions.filter(session => {
          const sessionDate = new Date(session.startTime);
          return sessionDate >= monthStart && sessionDate <= monthEnd && session.status === 'completed';
        });
        
        const monthCalories = monthWorkouts.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0);
        
        monthlyData.push({
          month: monthStr,
          calories: monthCalories,
          workouts: monthWorkouts.length,
        });
      }

      // Calculer les records personnels
      const personalRecords = {
        longestDistance: Math.max(...workoutSessions.map(s => s.totalTime || 0)) / 60, // en km (approximation)
        bestPace: 5.02, // Placeholder - à calculer selon les données réelles
        maxCalories: Math.max(...workoutSessions.map(s => s.caloriesBurned || 0)),
        longestStreak: longestStreak,
      };

      setData({
        userStats,
        dailyActivity,
        workoutSessions,
        workoutStatus,
        userStreak,
        totalCalories,
        totalSteps,
        totalWorkouts,
        averageHeartRate,
        currentStreak,
        longestStreak,
        completionRate,
        weeklyData,
        monthlyData,
        personalRecords,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des données de statistiques:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Impossible de charger les statistiques',
      }));
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user?.uid]);

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribers = [
      UserStatsService.watchUserStats(user.uid, (newStats) => {
        setData(prev => ({ ...prev, userStats: newStats }));
      }),
      // Ajouter d'autres listeners si nécessaire
    ];

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [user?.uid]);

  return data;
}
