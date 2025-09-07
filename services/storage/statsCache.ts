/**
 * Service de cache local pour les données de statistiques
 * RevoFit - Cache optimisé pour les performances statistiques
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEYS = {
  USER_STATS: 'user_stats_cache',
  DAILY_ACTIVITY: 'daily_activity_cache',
  WORKOUT_SESSIONS: 'workout_sessions_cache',
  WORKOUT_STATUS: 'workout_status_cache',
  USER_STREAK: 'user_streak_cache',
  WEEKLY_DATA: 'weekly_data_cache',
  MONTHLY_DATA: 'monthly_data_cache',
  PERSONAL_RECORDS: 'personal_records_cache',
  CACHE_TIMESTAMP: 'stats_cache_timestamp',
  CACHE_VERSION: 'stats_cache_version'
} as const;

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes en millisecondes
const CACHE_VERSION = '1.0.0';

export class StatsCacheService {
  /**
   * Sauvegarde les statistiques utilisateur dans le cache
   */
  static async saveUserStats(stats: any): Promise<void> {
    try {
      const cacheData = {
        data: stats,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem(CACHE_KEYS.USER_STATS, JSON.stringify(cacheData));
      console.log('✅ Statistiques utilisateur mises en cache');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des statistiques utilisateur:', error);
    }
  }

  /**
   * Récupère les statistiques utilisateur depuis le cache
   */
  static async getCachedUserStats(): Promise<any | null> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.USER_STATS);
      if (!cachedData) return null;

      const data = JSON.parse(cachedData);
      
      // Vérifier la version et l'âge du cache
      if (data.version !== CACHE_VERSION || Date.now() - data.timestamp > CACHE_DURATION) {
        await this.clearUserStatsCache();
        return null;
      }

      console.log('📱 Statistiques utilisateur récupérées du cache');
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques utilisateur:', error);
      return null;
    }
  }

  /**
   * Sauvegarde l'activité quotidienne dans le cache
   */
  static async saveDailyActivity(activity: any[], date: string): Promise<void> {
    try {
      const cacheData = {
        data: activity,
        date,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem(`${CACHE_KEYS.DAILY_ACTIVITY}_${date}`, JSON.stringify(cacheData));
      console.log('✅ Activité quotidienne mise en cache pour', date);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de l\'activité quotidienne:', error);
    }
  }

  /**
   * Récupère l'activité quotidienne depuis le cache
   */
  static async getCachedDailyActivity(date: string): Promise<any[] | null> {
    try {
      const cachedData = await AsyncStorage.getItem(`${CACHE_KEYS.DAILY_ACTIVITY}_${date}`);
      if (!cachedData) return null;

      const data = JSON.parse(cachedData);
      
      // Vérifier la version et l'âge du cache
      if (data.version !== CACHE_VERSION || Date.now() - data.timestamp > CACHE_DURATION) {
        await this.clearDailyActivityCache(date);
        return null;
      }

      console.log('📱 Activité quotidienne récupérée du cache pour', date);
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'activité quotidienne:', error);
      return null;
    }
  }

  /**
   * Sauvegarde les sessions d'entraînement dans le cache
   */
  static async saveWorkoutSessions(sessions: any[]): Promise<void> {
    try {
      const cacheData = {
        data: sessions,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem(CACHE_KEYS.WORKOUT_SESSIONS, JSON.stringify(cacheData));
      console.log('✅ Sessions d\'entraînement mises en cache:', sessions.length);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des sessions d\'entraînement:', error);
    }
  }

  /**
   * Récupère les sessions d'entraînement depuis le cache
   */
  static async getCachedWorkoutSessions(): Promise<any[] | null> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_SESSIONS);
      if (!cachedData) return null;

      const data = JSON.parse(cachedData);
      
      // Vérifier la version et l'âge du cache
      if (data.version !== CACHE_VERSION || Date.now() - data.timestamp > CACHE_DURATION) {
        await this.clearWorkoutSessionsCache();
        return null;
      }

      console.log('📱 Sessions d\'entraînement récupérées du cache:', data.data.length);
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des sessions d\'entraînement:', error);
      return null;
    }
  }

  /**
   * Sauvegarde le statut d'entraînement dans le cache
   */
  static async saveWorkoutStatus(status: any): Promise<void> {
    try {
      const cacheData = {
        data: status,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem(CACHE_KEYS.WORKOUT_STATUS, JSON.stringify(cacheData));
      console.log('✅ Statut d\'entraînement mis en cache');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du statut d\'entraînement:', error);
    }
  }

  /**
   * Récupère le statut d'entraînement depuis le cache
   */
  static async getCachedWorkoutStatus(): Promise<any | null> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_STATUS);
      if (!cachedData) return null;

      const data = JSON.parse(cachedData);
      
      // Vérifier la version et l'âge du cache
      if (data.version !== CACHE_VERSION || Date.now() - data.timestamp > CACHE_DURATION) {
        await this.clearWorkoutStatusCache();
        return null;
      }

      console.log('📱 Statut d\'entraînement récupéré du cache');
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du statut d\'entraînement:', error);
      return null;
    }
  }

  /**
   * Sauvegarde la série de l'utilisateur dans le cache
   */
  static async saveUserStreak(streak: any): Promise<void> {
    try {
      const cacheData = {
        data: streak,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem(CACHE_KEYS.USER_STREAK, JSON.stringify(cacheData));
      console.log('✅ Série utilisateur mise en cache');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la série utilisateur:', error);
    }
  }

  /**
   * Récupère la série de l'utilisateur depuis le cache
   */
  static async getCachedUserStreak(): Promise<any | null> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.USER_STREAK);
      if (!cachedData) return null;

      const data = JSON.parse(cachedData);
      
      // Vérifier la version et l'âge du cache
      if (data.version !== CACHE_VERSION || Date.now() - data.timestamp > CACHE_DURATION) {
        await this.clearUserStreakCache();
        return null;
      }

      console.log('📱 Série utilisateur récupérée du cache');
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la série utilisateur:', error);
      return null;
    }
  }

  /**
   * Sauvegarde toutes les données de statistiques dans le cache
   */
  static async saveAllStatsData(statsData: any): Promise<void> {
    try {
      const cacheData = {
        data: statsData,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem('all_stats_data', JSON.stringify(cacheData));
      console.log('✅ Toutes les données de statistiques mises en cache');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de toutes les données de statistiques:', error);
    }
  }

  /**
   * Récupère toutes les données de statistiques depuis le cache
   */
  static async getAllCachedStatsData(): Promise<any | null> {
    try {
      const cachedData = await AsyncStorage.getItem('all_stats_data');
      if (!cachedData) return null;

      const data = JSON.parse(cachedData);
      
      // Vérifier la version et l'âge du cache
      if (data.version !== CACHE_VERSION || Date.now() - data.timestamp > CACHE_DURATION) {
        await this.clearAllStatsCache();
        return null;
      }

      console.log('📱 Toutes les données de statistiques récupérées du cache');
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de toutes les données de statistiques:', error);
      return null;
    }
  }

  /**
   * Vide le cache des statistiques utilisateur
   */
  static async clearUserStatsCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.USER_STATS);
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache statistiques utilisateur:', error);
    }
  }

  /**
   * Vide le cache de l'activité quotidienne
   */
  static async clearDailyActivityCache(date?: string): Promise<void> {
    try {
      if (date) {
        await AsyncStorage.removeItem(`${CACHE_KEYS.DAILY_ACTIVITY}_${date}`);
      } else {
        // Vider tous les caches d'activité quotidienne
        const keys = await AsyncStorage.getAllKeys();
        const dailyKeys = keys.filter(key => key.startsWith(CACHE_KEYS.DAILY_ACTIVITY));
        await AsyncStorage.multiRemove(dailyKeys);
      }
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache activité quotidienne:', error);
    }
  }

  /**
   * Vide le cache des sessions d'entraînement
   */
  static async clearWorkoutSessionsCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.WORKOUT_SESSIONS);
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache sessions d\'entraînement:', error);
    }
  }

  /**
   * Vide le cache du statut d'entraînement
   */
  static async clearWorkoutStatusCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.WORKOUT_STATUS);
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache statut d\'entraînement:', error);
    }
  }

  /**
   * Vide le cache de la série utilisateur
   */
  static async clearUserStreakCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.USER_STREAK);
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache série utilisateur:', error);
    }
  }

  /**
   * Vide tout le cache des statistiques
   */
  static async clearAllStatsCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CACHE_KEYS.USER_STATS,
        CACHE_KEYS.WORKOUT_SESSIONS,
        CACHE_KEYS.WORKOUT_STATUS,
        CACHE_KEYS.USER_STREAK,
        CACHE_KEYS.WEEKLY_DATA,
        CACHE_KEYS.MONTHLY_DATA,
        CACHE_KEYS.PERSONAL_RECORDS,
        CACHE_KEYS.CACHE_TIMESTAMP,
        CACHE_KEYS.CACHE_VERSION,
        'all_stats_data'
      ]);
      
      // Vider aussi tous les caches d'activité quotidienne
      await this.clearDailyActivityCache();
      
      console.log('🗑️ Cache statistiques vidé');
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache statistiques:', error);
    }
  }
}
