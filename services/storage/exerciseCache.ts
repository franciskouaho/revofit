/**
 * Service de cache local pour les exercices
 * RevoFit - Cache optimisé pour les performances
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '../../types/exercise';

const CACHE_KEYS = {
  EXERCISES: 'exercises_cache',
  CACHE_TIMESTAMP: 'exercises_cache_timestamp',
  CACHE_VERSION: 'exercises_cache_version'
} as const;

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
const CACHE_VERSION = '1.0.0';

export class ExerciseCacheService {
  /**
   * Sauvegarde les exercices dans le cache local
   */
  static async saveExercises(exercises: Exercise[]): Promise<void> {
    try {
      const cacheData = {
        exercises,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem(CACHE_KEYS.EXERCISES, JSON.stringify(cacheData));
      await AsyncStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
      await AsyncStorage.setItem(CACHE_KEYS.CACHE_VERSION, CACHE_VERSION);
      
      console.log('✅ Exercices mis en cache:', exercises.length);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du cache:', error);
    }
  }

  /**
   * Récupère les exercices depuis le cache local
   */
  static async getCachedExercises(): Promise<Exercise[] | null> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.EXERCISES);
      const timestamp = await AsyncStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
      const version = await AsyncStorage.getItem(CACHE_KEYS.CACHE_VERSION);

      if (!cachedData || !timestamp || !version) {
        return null;
      }

      // Vérifier la version du cache
      if (version !== CACHE_VERSION) {
        console.log('🔄 Version du cache obsolète, suppression...');
        await this.clearCache();
        return null;
      }

      // Vérifier si le cache est encore valide
      const cacheAge = Date.now() - parseInt(timestamp, 10);
      if (cacheAge > CACHE_DURATION) {
        console.log('⏰ Cache expiré, suppression...');
        await this.clearCache();
        return null;
      }

      const data = JSON.parse(cachedData);
      console.log('📱 Exercices récupérés du cache:', data.exercises.length);
      return data.exercises;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du cache:', error);
      return null;
    }
  }

  /**
   * Vérifie si le cache est valide et à jour
   */
  static async isCacheValid(): Promise<boolean> {
    try {
      const timestamp = await AsyncStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
      const version = await AsyncStorage.getItem(CACHE_KEYS.CACHE_VERSION);

      if (!timestamp || !version) {
        return false;
      }

      if (version !== CACHE_VERSION) {
        return false;
      }

      const cacheAge = Date.now() - parseInt(timestamp, 10);
      return cacheAge <= CACHE_DURATION;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du cache:', error);
      return false;
    }
  }

  /**
   * Vide le cache local
   */
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CACHE_KEYS.EXERCISES,
        CACHE_KEYS.CACHE_TIMESTAMP,
        CACHE_KEYS.CACHE_VERSION
      ]);
      console.log('🗑️ Cache vidé');
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache:', error);
    }
  }

  /**
   * Force la mise à jour du cache
   */
  static async forceRefresh(): Promise<void> {
    await this.clearCache();
  }

  /**
   * Récupère la taille du cache
   */
  static async getCacheSize(): Promise<number> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.EXERCISES);
      return cachedData ? cachedData.length : 0;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la taille du cache:', error);
      return 0;
    }
  }
}
