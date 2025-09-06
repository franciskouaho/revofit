/**
 * Hook personnalisé pour les données nutritionnelles
 * RevoFit - Gestion des données nutritionnelles avec Firebase
 */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DailyNutrition, Meal, NutritionGoal, nutritionService, Recipe } from '../services/firebase/nutrition';

export interface UseNutritionReturn {
  // Données nutritionnelles
  dailyNutrition: DailyNutrition | null;
  meals: Meal[];
  nutritionGoal: NutritionGoal | null;
  recipes: Recipe[];

  // États de chargement
  loading: boolean;

  // États d'erreur
  error: string | null;

  // Actions
  addMeal: (meal: Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMeal: (mealId: string, updates: Partial<Meal>) => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
  refreshDailyNutrition: () => Promise<void>;
  setNutritionGoal: (goal: Omit<NutritionGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  searchRecipes: (searchTerm: string) => Promise<void>;
  loadRecipes: (category?: string) => Promise<void>;
}

export function useNutrition(selectedDate?: string): UseNutritionReturn {
  const { user } = useAuth();
  const userId = user?.uid;

  // États des données
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [nutritionGoal, setNutritionGoalState] = useState<NutritionGoal | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Date sélectionnée (par défaut aujourd'hui)
  const currentDate = selectedDate || new Date().toISOString().split('T')[0];

  /**
   * Ajouter un repas
   */
  const addMeal = useCallback(async (meal: Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) {
      console.log('❌ Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🍽️ Ajout d\'un repas...');
      await nutritionService.addMeal(userId, meal);
      
      // Recalculer la nutrition quotidienne
      await refreshDailyNutrition();
      console.log('✅ Repas ajouté avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de l\'ajout du repas:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Mettre à jour un repas
   */
  const updateMeal = useCallback(async (mealId: string, updates: Partial<Meal>) => {
    if (!userId) {
      console.log('❌ Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🍽️ Mise à jour d\'un repas...');
      await nutritionService.updateMeal(mealId, updates);
      
      // Recalculer la nutrition quotidienne
      await refreshDailyNutrition();
      console.log('✅ Repas mis à jour avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la mise à jour du repas:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Supprimer un repas
   */
  const deleteMeal = useCallback(async (mealId: string) => {
    if (!userId) {
      console.log('❌ Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🍽️ Suppression d\'un repas...');
      await nutritionService.deleteMeal(mealId);
      
      // Recalculer la nutrition quotidienne
      await refreshDailyNutrition();
      console.log('✅ Repas supprimé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la suppression du repas:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Rafraîchir la nutrition quotidienne
   */
  const refreshDailyNutrition = useCallback(async () => {
    if (!userId) {
      console.log('❌ Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Calcul de la nutrition quotidienne...');
      const daily = await nutritionService.calculateDailyNutrition(userId, currentDate);
      setDailyNutrition(daily);
      
      // Charger les repas du jour
      const dayMeals = await nutritionService.getMealsByDate(userId, currentDate);
      setMeals(dayMeals);
      
      console.log('✅ Nutrition quotidienne mise à jour');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors du calcul de la nutrition quotidienne:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, currentDate]);

  /**
   * Définir l'objectif nutritionnel
   */
  const setNutritionGoal = useCallback(async (goal: Omit<NutritionGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) {
      console.log('❌ Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🎯 Définition de l\'objectif nutritionnel...');
      const existingGoal = await nutritionService.getNutritionGoal(userId);
      
      if (existingGoal) {
        await nutritionService.updateNutritionGoal(existingGoal.id, goal);
      } else {
        await nutritionService.createNutritionGoal(userId, goal);
      }
      
      // Recharger l'objectif
      const updatedGoal = await nutritionService.getNutritionGoal(userId);
      setNutritionGoalState(updatedGoal);
      
      console.log('✅ Objectif nutritionnel défini');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la définition de l\'objectif nutritionnel:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Rechercher des recettes
   */
  const searchRecipes = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Recherche de recettes...');
      const results = await nutritionService.searchRecipes(searchTerm);
      setRecipes(results);
      console.log('✅ Recherche terminée:', results.length, 'recettes trouvées');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la recherche de recettes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charger des recettes
   */
  const loadRecipes = useCallback(async (category?: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📚 Chargement des recettes...');
      const results = await nutritionService.getRecipes(category);
      setRecipes(results);
      console.log('✅ Recettes chargées:', results.length, 'recettes');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors du chargement des recettes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les données au montage
  useEffect(() => {
    if (!userId) return;

    const loadInitialData = async () => {
      try {
        // Charger l'objectif nutritionnel
        const goal = await nutritionService.getNutritionGoal(userId);
        setNutritionGoalState(goal);

        // Charger la nutrition quotidienne
        await refreshDailyNutrition();

        // Charger quelques recettes populaires
        await loadRecipes();
      } catch (err) {
        console.error('❌ Erreur lors du chargement initial:', err);
      }
    };

    loadInitialData();
  }, [userId, currentDate, refreshDailyNutrition, loadRecipes]);

  // Écoute en temps réel des repas
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = nutritionService.subscribeToMeals(userId, currentDate, (meals) => {
      setMeals(meals);
    });

    return () => unsubscribe();
  }, [userId, currentDate]);

  // Écoute en temps réel de la nutrition quotidienne
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = nutritionService.subscribeToDailyNutrition(userId, currentDate, (daily) => {
      setDailyNutrition(daily);
    });

    return () => unsubscribe();
  }, [userId, currentDate]);

  return {
    dailyNutrition,
    meals,
    nutritionGoal,
    recipes,
    loading,
    error,
    addMeal,
    updateMeal,
    deleteMeal,
    refreshDailyNutrition,
    setNutritionGoal,
    searchRecipes,
    loadRecipes,
  };
}
