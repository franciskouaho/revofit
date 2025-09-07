/**
 * Hook personnalisé pour les plans nutritionnels
 * RevoFit - Gestion des plans nutritionnels personnalisés
 */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  MealSuggestion,
  NutritionPlan,
  nutritionPlanService,
  UserProfile
} from '../services/firebase/nutritionPlan';

export interface UseNutritionPlanReturn {
  // Données
  userProfile: UserProfile | null;
  nutritionPlans: NutritionPlan[];
  activePlan: NutritionPlan | null;
  mealSuggestions: MealSuggestion[];
  
  // États
  loading: boolean;
  error: string | null;
  
  // Actions
  createPersonalizedPlan: (goal: 'maintain' | 'lose' | 'gain', duration?: number) => Promise<void>;
  saveUserProfile: (profile: Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  generateMealSuggestions: () => Promise<void>;
  activatePlan: (planId: string) => Promise<void>;
  refreshPlans: () => Promise<void>;
}

export function useNutritionPlan(): UseNutritionPlanReturn {
  const { user } = useAuth();
  const userId = user?.uid;

  // États des données
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [activePlan, setActivePlan] = useState<NutritionPlan | null>(null);
  const [mealSuggestions, setMealSuggestions] = useState<MealSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Créer un plan nutritionnel personnalisé
   */
  const createPersonalizedPlan = useCallback(async (
    goal: 'maintain' | 'lose' | 'gain', 
    duration: number = 7
  ) => {
    if (!userId || !userProfile) {
      console.log('❌ Utilisateur non connecté ou profil manquant');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🎯 Création d\'un plan nutritionnel personnalisé...');
      const plan = await nutritionPlanService.createPersonalizedPlan(
        userId,
        userProfile,
        goal,
        duration
      );
      
      setNutritionPlans(prev => [plan, ...prev]);
      setActivePlan(plan);
      console.log('✅ Plan nutritionnel créé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la création du plan:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, userProfile]);

  /**
   * Sauvegarder le profil utilisateur
   */
  const saveUserProfile = useCallback(async (
    profile: Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!userId) {
      console.log('❌ Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('👤 Sauvegarde du profil utilisateur...');
      await nutritionPlanService.saveUserProfile(userId, profile);
      
      // Recharger le profil
      const updatedProfile = await nutritionPlanService.getUserProfile(userId);
      setUserProfile(updatedProfile);
      console.log('✅ Profil utilisateur sauvegardé');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la sauvegarde du profil:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Générer des suggestions de repas
   */
  const generateMealSuggestions = useCallback(async () => {
    if (!userId || !userProfile) {
      console.log('❌ Utilisateur non connecté ou profil manquant');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🍽️ Génération des suggestions de repas...');
      
      // Calculer les besoins nutritionnels
      const dailyCalories = nutritionPlanService.calculateCalorieNeeds(userProfile, 'maintain');
      const macros = nutritionPlanService.calculateMacroDistribution(dailyCalories, userProfile.goals);
      
      // Générer les suggestions
      const suggestions = await nutritionPlanService.generateMealSuggestions(
        userProfile,
        dailyCalories,
        macros.protein,
        macros.carbs,
        macros.fats,
        macros.fiber
      );
      
      setMealSuggestions(suggestions);
      console.log('✅ Suggestions de repas générées:', suggestions.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la génération des suggestions:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, userProfile]);

  /**
   * Activer un plan
   */
  const activatePlan = useCallback(async (planId: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🎯 Activation du plan nutritionnel...');
      
      // Désactiver tous les autres plans
      const updatedPlans = nutritionPlans.map(plan => ({
        ...plan,
        isActive: plan.id === planId
      }));
      
      setNutritionPlans(updatedPlans);
      
      // Définir le plan actif
      const plan = nutritionPlans.find(p => p.id === planId);
      setActivePlan(plan || null);
      
      console.log('✅ Plan nutritionnel activé');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de l\'activation du plan:', err);
    } finally {
      setLoading(false);
    }
  }, [nutritionPlans]);

  /**
   * Rafraîchir les plans
   */
  const refreshPlans = useCallback(async () => {
    if (!userId) {
      console.log('❌ Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Rafraîchissement des plans nutritionnels...');
      const plans = await nutritionPlanService.getUserPlans(userId);
      setNutritionPlans(plans);
      
      // Trouver le plan actif
      const active = plans.find(plan => plan.isActive);
      setActivePlan(active || null);
      
      console.log('✅ Plans nutritionnels rafraîchis');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors du rafraîchissement des plans:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Charger les données au montage (optimisé)
  useEffect(() => {
    if (!userId) return;

    const loadInitialData = async () => {
      try {
        setError(null);
        
        // Charger le profil utilisateur
        let profile = await nutritionPlanService.getUserProfile(userId);
        
        // Si aucun profil n'existe, créer un profil par défaut
        if (!profile) {
          console.log('👤 Aucun profil trouvé, création d\'un profil par défaut...');
          const defaultProfile = {
            age: 25,
            gender: 'male' as const,
            height: 175,
            weight: 70,
            activityLevel: 'moderate' as const,
            goals: ['maintain_weight'],
            dietaryRestrictions: [],
            preferences: ['healthy', 'balanced']
          };
          
          const profileId = await nutritionPlanService.saveUserProfile(userId, defaultProfile);
          profile = await nutritionPlanService.getUserProfile(userId);
          console.log('✅ Profil par défaut créé:', profileId);
        }
        
        setUserProfile(profile);

        // Charger les plans nutritionnels en arrière-plan
        refreshPlans().catch(err => {
          console.error('❌ Erreur lors du chargement des plans:', err);
        });
      } catch (err) {
        console.error('❌ Erreur lors du chargement initial:', err);
        setError('Impossible de charger les données nutritionnelles');
      }
    };

    loadInitialData();
  }, [userId, refreshPlans]);

  return {
    userProfile,
    nutritionPlans,
    activePlan,
    mealSuggestions,
    loading,
    error,
    createPersonalizedPlan,
    saveUserProfile,
    generateMealSuggestions,
    activatePlan,
    refreshPlans,
  };
}
