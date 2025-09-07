/**
 * Service de plan nutritionnel personnalisé
 * RevoFit - Génération de plans nutritionnels basés sur les objectifs utilisateur
 */

import { addDoc, collection, doc, getDocs, limit, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { firestore } from './config';
import { Recipe } from './nutrition';

export interface UserProfile {
  id: string;
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // en cm
  weight: number; // en kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: string[];
  dietaryRestrictions: string[];
  preferences: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  duration: number; // en jours
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFats: number;
  dailyFiber: number;
  meals: PlanMeal[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanMeal {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  recipes: string[]; // IDs des recettes
  time: string; // HH:MM
  day: number; // jour du plan (1-7)
}

export interface MealSuggestion {
  recipe: Recipe;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  reason: string; // Pourquoi cette recette est suggérée
}

class NutritionPlanService {
  private plansCollection = collection(firestore, 'nutritionPlans');
  private profilesCollection = collection(firestore, 'userProfiles');

  /**
   * Calculer les besoins caloriques basés sur le profil utilisateur
   */
  calculateCalorieNeeds(profile: UserProfile, goal: 'maintain' | 'lose' | 'gain'): number {
    // Formule de Mifflin-St Jeor
    let bmr: number;
    
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }

    // Facteur d'activité
    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const tdee = bmr * activityFactors[profile.activityLevel];

    // Ajustement selon l'objectif
    switch (goal) {
      case 'lose':
        return Math.round(tdee - 500); // Déficit de 500 calories
      case 'gain':
        return Math.round(tdee + 300); // Surplus de 300 calories
      default:
        return Math.round(tdee);
    }
  }

  /**
   * Calculer la répartition des macronutriments
   */
  calculateMacroDistribution(calories: number, goals: string[]): {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  } {
    let proteinRatio = 0.25; // 25% par défaut
    let carbsRatio = 0.50;   // 50% par défaut
    let fatsRatio = 0.25;    // 25% par défaut

    // Ajuster selon les objectifs
    if (goals.includes('muscle_gain') || goals.includes('strength')) {
      proteinRatio = 0.30; // 30% pour la prise de muscle
      carbsRatio = 0.45;   // 45%
      fatsRatio = 0.25;    // 25%
    } else if (goals.includes('weight_loss') || goals.includes('fat_loss')) {
      proteinRatio = 0.30; // 30% pour la perte de poids
      carbsRatio = 0.40;   // 40%
      fatsRatio = 0.30;    // 30%
    } else if (goals.includes('endurance') || goals.includes('cardio')) {
      proteinRatio = 0.20; // 20% pour l'endurance
      carbsRatio = 0.60;   // 60%
      fatsRatio = 0.20;    // 20%
    }

    const protein = Math.round((calories * proteinRatio) / 4); // 4 cal/g
    const carbs = Math.round((calories * carbsRatio) / 4);     // 4 cal/g
    const fats = Math.round((calories * fatsRatio) / 9);       // 9 cal/g
    const fiber = Math.round(calories / 1000 * 14); // 14g par 1000 cal

    return { protein, carbs, fats, fiber };
  }

  /**
   * Générer des suggestions de repas basées sur les préférences
   */
  async generateMealSuggestions(
    profile: UserProfile,
    dailyCalories: number,
    dailyProtein: number,
    dailyCarbs: number,
    dailyFats: number,
    dailyFiber: number
  ): Promise<MealSuggestion[]> {
    try {
      // Récupérer toutes les recettes publiques
      const recipesQuery = query(
        collection(firestore, 'recipes'),
        where('isPublic', '==', true),
        limit(100)
      );
      
      const recipesSnapshot = await getDocs(recipesQuery);
      const allRecipes = recipesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Recipe;
      });

      // Filtrer selon les restrictions alimentaires
      let filteredRecipes = allRecipes;
      
      if (profile.dietaryRestrictions.length > 0) {
        filteredRecipes = allRecipes.filter(recipe => {
          return !profile.dietaryRestrictions.some(restriction => 
            recipe.tags.some(tag => tag.toLowerCase().includes(restriction.toLowerCase()))
          );
        });
      }

      // Filtrer selon les préférences
      if (profile.preferences.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => {
          return profile.preferences.some(preference =>
            recipe.tags.some(tag => tag.toLowerCase().includes(preference.toLowerCase())) ||
            recipe.name.toLowerCase().includes(preference.toLowerCase())
          );
        });
      }

      // Générer des suggestions pour chaque catégorie de repas
      const suggestions: MealSuggestion[] = [];
      const mealCategories = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
      
      // Répartition des calories par repas
      const calorieDistribution = {
        breakfast: dailyCalories * 0.25,
        lunch: dailyCalories * 0.35,
        snack: dailyCalories * 0.15,
        dinner: dailyCalories * 0.25
      };

      for (const category of mealCategories) {
        const targetCalories = calorieDistribution[category];
        const categoryRecipes = filteredRecipes.filter(recipe => recipe.category === category);
        
        // Trier par pertinence (calories proches de la cible)
        const sortedRecipes = categoryRecipes.sort((a, b) => 
          Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories)
        );

        // Prendre les 3 meilleures suggestions
        const topRecipes = sortedRecipes.slice(0, 3);
        
        topRecipes.forEach(recipe => {
          const reason = this.generateSuggestionReason(recipe, profile, targetCalories);
          suggestions.push({
            recipe,
            calories: recipe.calories,
            protein: recipe.protein,
            carbs: recipe.carbs,
            fats: recipe.fats,
            fiber: recipe.fiber,
            reason
          });
        });
      }

      return suggestions;
    } catch (error) {
      console.error('❌ Erreur lors de la génération des suggestions:', error);
      throw error;
    }
  }

  /**
   * Générer une raison pour la suggestion
   */
  private generateSuggestionReason(recipe: Recipe, profile: UserProfile, targetCalories: number): string {
    const reasons = [];

    // Vérifier les calories
    if (Math.abs(recipe.calories - targetCalories) < 50) {
      reasons.push('calories parfaites');
    }

    // Vérifier les protéines
    if (recipe.protein > 20) {
      reasons.push('riche en protéines');
    }

    // Vérifier les préférences
    if (profile.preferences.some(pref => 
      recipe.tags.some(tag => tag.toLowerCase().includes(pref.toLowerCase()))
    )) {
      reasons.push('correspond à vos goûts');
    }

    // Vérifier la facilité de préparation
    if (recipe.difficulty === 'easy' && recipe.prepTime < 30) {
      reasons.push('rapide à préparer');
    }

    // Vérifier les tags santé
    const healthTags = ['sain', 'équilibré', 'riche en fibres', 'faible en calories'];
    if (recipe.tags.some(tag => 
      healthTags.some(healthTag => tag.toLowerCase().includes(healthTag))
    )) {
      reasons.push('excellent pour la santé');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'recette équilibrée';
  }

  /**
   * Créer un plan nutritionnel personnalisé
   */
  async createPersonalizedPlan(
    userId: string,
    profile: UserProfile,
    goal: 'maintain' | 'lose' | 'gain',
    duration: number = 7
  ): Promise<NutritionPlan> {
    try {
      // Calculer les besoins nutritionnels
      const dailyCalories = this.calculateCalorieNeeds(profile, goal);
      const macros = this.calculateMacroDistribution(dailyCalories, profile.goals);

      // Générer des suggestions de repas
      const suggestions = await this.generateMealSuggestions(
        profile,
        dailyCalories,
        macros.protein,
        macros.carbs,
        macros.fats,
        macros.fiber
      );

      // Créer les repas du plan
      const meals: PlanMeal[] = [];
      const mealCategories = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
      
      for (let day = 1; day <= duration; day++) {
        for (const category of mealCategories) {
          const categorySuggestions = suggestions.filter(s => s.recipe.category === category);
          if (categorySuggestions.length > 0) {
            const selectedSuggestion = categorySuggestions[Math.floor(Math.random() * categorySuggestions.length)];
            
            meals.push({
              id: `${userId}-${day}-${category}`,
              name: selectedSuggestion.recipe.name,
              category,
              calories: selectedSuggestion.calories,
              protein: selectedSuggestion.protein,
              carbs: selectedSuggestion.carbs,
              fats: selectedSuggestion.fats,
              fiber: selectedSuggestion.fiber,
              recipes: [selectedSuggestion.recipe.id],
              time: this.getMealTime(category),
              day
            });
          }
        }
      }

      // Créer le plan
      const plan: Omit<NutritionPlan, 'id' | 'createdAt' | 'updatedAt'> = {
        userId,
        name: `Plan ${goal === 'lose' ? 'Perte de poids' : goal === 'gain' ? 'Prise de muscle' : 'Maintien'} - ${duration} jours`,
        description: `Plan nutritionnel personnalisé pour ${profile.goals.join(', ')}`,
        duration,
        dailyCalories,
        dailyProtein: macros.protein,
        dailyCarbs: macros.carbs,
        dailyFats: macros.fats,
        dailyFiber: macros.fiber,
        meals,
        isActive: true
      };

      const docRef = await addDoc(this.plansCollection, {
        ...plan,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log('✅ Plan nutritionnel créé:', docRef.id);
      
      return {
        id: docRef.id,
        ...plan,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('❌ Erreur lors de la création du plan nutritionnel:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'heure suggérée pour un repas
   */
  private getMealTime(category: string): string {
    const times = {
      breakfast: '08:00',
      lunch: '13:00',
      snack: '16:00',
      dinner: '20:00'
    };
    return times[category as keyof typeof times] || '12:00';
  }

  /**
   * Récupérer les plans nutritionnels d'un utilisateur
   */
  async getUserPlans(userId: string): Promise<NutritionPlan[]> {
    try {
      const q = query(
        this.plansCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as NutritionPlan;
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des plans:', error);
      throw error;
    }
  }

  /**
   * Récupérer le profil utilisateur
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const q = query(
        this.profilesCollection,
        where('userId', '==', userId),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as UserProfile;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

  /**
   * Créer ou mettre à jour le profil utilisateur
   */
  async saveUserProfile(userId: string, profile: Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const existingProfile = await this.getUserProfile(userId);
      
      if (existingProfile) {
        // Mettre à jour le profil existant
        const profileRef = doc(this.profilesCollection, existingProfile.id);
        await updateDoc(profileRef, {
          ...profile,
          updatedAt: Timestamp.now(),
        });
        return existingProfile.id;
      } else {
        // Créer un nouveau profil
        const docRef = await addDoc(this.profilesCollection, {
          ...profile,
          userId,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du profil:', error);
      throw error;
    }
  }
}

export const nutritionPlanService = new NutritionPlanService();
