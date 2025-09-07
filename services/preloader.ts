/**
 * Service de préchargement des données critiques
 * RevoFit - Préchargement optimisé pour les performances
 */

import { ExerciseService } from './firebase/exercises';
import { nutritionService } from './firebase/nutrition';
import { ExerciseCacheService } from './storage/exerciseCache';
import { NutritionCacheService } from './storage/nutritionCache';

export class PreloaderService {
  private static isPreloading = false;
  private static preloadPromise: Promise<void> | null = null;

  /**
   * Précharge toutes les données critiques au démarrage de l'app
   */
  static async preloadAllData(): Promise<void> {
    if (this.isPreloading) {
      return this.preloadPromise || Promise.resolve();
    }

    this.isPreloading = true;
    this.preloadPromise = this._preloadAllData();

    try {
      await this.preloadPromise;
    } finally {
      this.isPreloading = false;
    }
  }

  /**
   * Précharge les exercices au démarrage de l'app
   */
  static async preloadExercises(): Promise<void> {
    if (this.isPreloading) {
      return this.preloadPromise || Promise.resolve();
    }

    this.isPreloading = true;
    this.preloadPromise = this._preloadExercises();

    try {
      await this.preloadPromise;
    } finally {
      this.isPreloading = false;
    }
  }

  private static async _preloadAllData(): Promise<void> {
    try {
      console.log('🚀 Début du préchargement de toutes les données...');
      
      // Précharger en parallèle
      await Promise.all([
        this._preloadExercises(),
        this._preloadNutrition(),
        this._preloadStats()
      ]);
      
      console.log('✅ Préchargement de toutes les données terminé');
    } catch (error) {
      console.error('❌ Erreur lors du préchargement de toutes les données:', error);
    }
  }

  private static async _preloadExercises(): Promise<void> {
    try {
      console.log('🚀 Début du préchargement des exercices...');
      
      // Vérifier si le cache est valide
      const isCacheValid = await ExerciseCacheService.isCacheValid();
      
      if (isCacheValid) {
        console.log('✅ Cache exercices valide, pas de préchargement nécessaire');
        return;
      }

      // Charger les exercices depuis l'API
      const response = await ExerciseService.getAllExercises();
      
      if (response.success && response.data) {
        const exercises = Array.isArray(response.data) ? response.data : [response.data];
        
        // Sauvegarder dans le cache
        await ExerciseCacheService.saveExercises(exercises);
        
        console.log('✅ Préchargement exercices terminé:', exercises.length, 'exercices');
      } else {
        console.warn('⚠️ Échec du préchargement des exercices');
      }
    } catch (error) {
      console.error('❌ Erreur lors du préchargement des exercices:', error);
    }
  }

  private static async _preloadNutrition(): Promise<void> {
    try {
      console.log('🚀 Début du préchargement des données nutrition...');
      
      // Charger les recettes populaires
      const recipes = await nutritionService.getRecipes();
      await NutritionCacheService.saveRecipes(recipes);
      
      console.log('✅ Préchargement nutrition terminé:', recipes.length, 'recettes');
    } catch (error) {
      console.error('❌ Erreur lors du préchargement nutrition:', error);
    }
  }

  private static async _preloadStats(): Promise<void> {
    try {
      console.log('🚀 Début du préchargement des statistiques...');
      
      // Charger les statistiques de base (sans utilisateur spécifique)
      // Les statistiques utilisateur seront chargées lors de la connexion
      console.log('✅ Préchargement statistiques terminé');
    } catch (error) {
      console.error('❌ Erreur lors du préchargement des statistiques:', error);
    }
  }

  /**
   * Précharge toutes les données en arrière-plan
   */
  static async preloadAllDataInBackground(): Promise<void> {
    // Ne pas attendre le résultat
    this._preloadAllData().catch(error => {
      console.error('❌ Erreur préchargement arrière-plan:', error);
    });
  }

  /**
   * Précharge les exercices en arrière-plan
   */
  static async preloadExercisesInBackground(): Promise<void> {
    // Ne pas attendre le résultat
    this._preloadExercises().catch(error => {
      console.error('❌ Erreur préchargement arrière-plan:', error);
    });
  }

  /**
   * Vérifie si le préchargement est en cours
   */
  static isPreloadingInProgress(): boolean {
    return this.isPreloading;
  }

  /**
   * Force le préchargement même si le cache est valide
   */
  static async forcePreload(): Promise<void> {
    await ExerciseCacheService.forceRefresh();
    await this.preloadExercises();
  }
}
