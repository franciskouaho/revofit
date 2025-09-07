/**
 * Service de cache local pour les données nutritionnelles
 * RevoFit - Cache optimisé pour les performances nutrition
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEYS = {
  NUTRITION_GOAL: 'nutrition_goal_cache',
  DAILY_NUTRITION: 'daily_nutrition_cache',
  RECIPES: 'recipes_cache',
  NUTRITION_PLANS: 'nutrition_plans_cache',
  USER_PROFILE: 'user_profile_cache',
  CACHE_TIMESTAMP: 'nutrition_cache_timestamp',
  CACHE_VERSION: 'nutrition_cache_version'
} as const;

const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 heures en millisecondes
const CACHE_VERSION = '1.0.0';

export class NutritionCacheService {
  /**
   * Sauvegarde l'objectif nutritionnel dans le cache
   */
  static async saveNutritionGoal(goal: any): Promise<void> {
    try {
      const cacheData = {
        data: goal,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem(CACHE_KEYS.NUTRITION_GOAL, JSON.stringify(cacheData));
      console.log('✅ Objectif nutritionnel mis en cache');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de l\'objectif nutritionnel:', error);
    }
  }

  /**
   * Récupère l'objectif nutritionnel depuis le cache
   */
  static async getCachedNutritionGoal(): Promise<any | null> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.NUTRITION_GOAL);
      if (!cachedData) return null;

      const data = JSON.parse(cachedData);
      
      // Vérifier la version et l'âge du cache
      if (data.version !== CACHE_VERSION || Date.now() - data.timestamp > CACHE_DURATION) {
        await this.clearNutritionGoalCache();
        return null;
      }

      console.log('📱 Objectif nutritionnel récupéré du cache');
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'objectif nutritionnel:', error);
      return null;
    }
  }

  /**
   * Sauvegarde la nutrition quotidienne dans le cache
   */
  static async saveDailyNutrition(dailyNutrition: any, date: string): Promise<void> {
    try {
      const cacheData = {
        data: dailyNutrition,
        date,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem(`${CACHE_KEYS.DAILY_NUTRITION}_${date}`, JSON.stringify(cacheData));
      console.log('✅ Nutrition quotidienne mise en cache pour', date);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la nutrition quotidienne:', error);
    }
  }

  /**
   * Récupère la nutrition quotidienne depuis le cache
   */
  static async getCachedDailyNutrition(date: string): Promise<any | null> {
    try {
      const cachedData = await AsyncStorage.getItem(`${CACHE_KEYS.DAILY_NUTRITION}_${date}`);
      if (!cachedData) return null;

      const data = JSON.parse(cachedData);
      
      // Vérifier la version et l'âge du cache
      if (data.version !== CACHE_VERSION || Date.now() - data.timestamp > CACHE_DURATION) {
        await this.clearDailyNutritionCache(date);
        return null;
      }

      console.log('📱 Nutrition quotidienne récupérée du cache pour', date);
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la nutrition quotidienne:', error);
      return null;
    }
  }

  /**
   * Sauvegarde les recettes dans le cache
   */
  static async saveRecipes(recipes: any[]): Promise<void> {
    try {
      const cacheData = {
        data: recipes,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem(CACHE_KEYS.RECIPES, JSON.stringify(cacheData));
      console.log('✅ Recettes mises en cache:', recipes.length);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des recettes:', error);
    }
  }

  /**
   * Récupère les recettes depuis le cache
   */
  static async getCachedRecipes(): Promise<any[] | null> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.RECIPES);
      if (!cachedData) return null;

      const data = JSON.parse(cachedData);
      
      // Vérifier la version et l'âge du cache
      if (data.version !== CACHE_VERSION || Date.now() - data.timestamp > CACHE_DURATION) {
        await this.clearRecipesCache();
        return null;
      }

      console.log('📱 Recettes récupérées du cache:', data.data.length);
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des recettes:', error);
      return null;
    }
  }

  /**
   * Sauvegarde le profil utilisateur dans le cache
   */
  static async saveUserProfile(profile: any): Promise<void> {
    try {
      const cacheData = {
        data: profile,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await AsyncStorage.setItem(CACHE_KEYS.USER_PROFILE, JSON.stringify(cacheData));
      console.log('✅ Profil utilisateur mis en cache');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du profil utilisateur:', error);
    }
  }

  /**
   * Récupère le profil utilisateur depuis le cache
   */
  static async getCachedUserProfile(): Promise<any | null> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.USER_PROFILE);
      if (!cachedData) return null;

      const data = JSON.parse(cachedData);
      
      // Vérifier la version et l'âge du cache
      if (data.version !== CACHE_VERSION || Date.now() - data.timestamp > CACHE_DURATION) {
        await this.clearUserProfileCache();
        return null;
      }

      console.log('📱 Profil utilisateur récupéré du cache');
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du profil utilisateur:', error);
      return null;
    }
  }

  /**
   * Vide le cache de l'objectif nutritionnel
   */
  static async clearNutritionGoalCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.NUTRITION_GOAL);
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache objectif nutritionnel:', error);
    }
  }

  /**
   * Vide le cache de la nutrition quotidienne
   */
  static async clearDailyNutritionCache(date?: string): Promise<void> {
    try {
      if (date) {
        await AsyncStorage.removeItem(`${CACHE_KEYS.DAILY_NUTRITION}_${date}`);
      } else {
        // Vider tous les caches de nutrition quotidienne
        const keys = await AsyncStorage.getAllKeys();
        const dailyKeys = keys.filter(key => key.startsWith(CACHE_KEYS.DAILY_NUTRITION));
        await AsyncStorage.multiRemove(dailyKeys);
      }
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache nutrition quotidienne:', error);
    }
  }

  /**
   * Vide le cache des recettes
   */
  static async clearRecipesCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.RECIPES);
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache recettes:', error);
    }
  }

  /**
   * Vide le cache du profil utilisateur
   */
  static async clearUserProfileCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.USER_PROFILE);
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache profil utilisateur:', error);
    }
  }

  /**
   * Vide tout le cache nutrition
   */
  static async clearAllNutritionCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CACHE_KEYS.NUTRITION_GOAL,
        CACHE_KEYS.RECIPES,
        CACHE_KEYS.USER_PROFILE,
        CACHE_KEYS.CACHE_TIMESTAMP,
        CACHE_KEYS.CACHE_VERSION
      ]);
      
      // Vider aussi tous les caches de nutrition quotidienne
      await this.clearDailyNutritionCache();
      
      console.log('🗑️ Cache nutrition vidé');
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache nutrition:', error);
    }
  }
}
