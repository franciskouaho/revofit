/**
 * Hook pour récupérer les statistiques utilisateur depuis Firebase
 * RevoFit - Hook personnalisé pour les statistiques
 */

import { useAuth } from '@/contexts/AuthContext';
import { UserStats, UserStatsService } from '@/services/firebase/userStats';
import { useEffect, useState } from 'react';

export interface UseUserStatsReturn {
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserStats(): UseUserStatsReturn {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user?.uid) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userStats = await UserStatsService.getUserStats(user.uid);
      setStats(userStats);
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
      setError('Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user?.uid]);

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = UserStatsService.watchUserStats(user.uid, (newStats) => {
      setStats(newStats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}
