/**
 * Service Firebase pour les données nutritionnelles
 * RevoFit - Gestion des données nutritionnelles avec Firebase
 */

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    Unsubscribe,
    updateDoc,
    where
} from 'firebase/firestore';
import { firestore } from './config';

export interface NutritionGoal {
  id: string;
  userId: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyNutrition {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalFiber: number;
  meals: Meal[];
  goalId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  prepTime: number; // en minutes
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  imageUrl?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

class NutritionService {
  // Collection references
  private goalsCollection = collection(firestore, 'nutritionGoals');
  private mealsCollection = collection(firestore, 'meals');
  private dailyNutritionCollection = collection(firestore, 'dailyNutrition');
  private recipesCollection = collection(firestore, 'recipes');

  /**
   * Gestion des objectifs nutritionnels
   */
  async createNutritionGoal(userId: string, goal: Omit<NutritionGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(this.goalsCollection, {
        ...goal,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Objectif nutritionnel créé:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'objectif nutritionnel:', error);
      throw error;
    }
  }

  async getNutritionGoal(userId: string): Promise<NutritionGoal | null> {
    try {
      const q = query(
        this.goalsCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
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
      } as NutritionGoal;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'objectif nutritionnel:', error);
      throw error;
    }
  }

  async updateNutritionGoal(goalId: string, updates: Partial<NutritionGoal>): Promise<void> {
    try {
      const goalRef = doc(this.goalsCollection, goalId);
      await updateDoc(goalRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Objectif nutritionnel mis à jour:', goalId);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'objectif nutritionnel:', error);
      throw error;
    }
  }

  /**
   * Gestion des repas
   */
  async addMeal(userId: string, meal: Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(this.mealsCollection, {
        ...meal,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Repas ajouté:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du repas:', error);
      throw error;
    }
  }

  async getMealsByDate(userId: string, date: string): Promise<Meal[]> {
    try {
      const q = query(
        this.mealsCollection,
        where('userId', '==', userId),
        where('date', '==', date),
        orderBy('time', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Meal;
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des repas:', error);
      throw error;
    }
  }

  async getMealsByDateRange(userId: string, startDate: string, endDate: string): Promise<Meal[]> {
    try {
      const q = query(
        this.mealsCollection,
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'asc'),
        orderBy('time', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Meal;
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des repas par période:', error);
      throw error;
    }
  }

  async updateMeal(mealId: string, updates: Partial<Meal>): Promise<void> {
    try {
      const mealRef = doc(this.mealsCollection, mealId);
      await updateDoc(mealRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Repas mis à jour:', mealId);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du repas:', error);
      throw error;
    }
  }

  async deleteMeal(mealId: string): Promise<void> {
    try {
      const mealRef = doc(this.mealsCollection, mealId);
      await deleteDoc(mealRef);
      console.log('✅ Repas supprimé:', mealId);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du repas:', error);
      throw error;
    }
  }

  /**
   * Gestion de la nutrition quotidienne
   */
  async getDailyNutrition(userId: string, date: string): Promise<DailyNutrition | null> {
    try {
      const q = query(
        this.dailyNutritionCollection,
        where('userId', '==', userId),
        where('date', '==', date),
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
      } as DailyNutrition;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la nutrition quotidienne:', error);
      throw error;
    }
  }

  async calculateDailyNutrition(userId: string, date: string): Promise<DailyNutrition> {
    try {
      const meals = await this.getMealsByDate(userId, date);
      const goal = await this.getNutritionGoal(userId);

      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
      const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
      const totalFats = meals.reduce((sum, meal) => sum + meal.fats, 0);
      const totalFiber = meals.reduce((sum, meal) => sum + meal.fiber, 0);

      const dailyNutrition: DailyNutrition = {
        id: `${userId}-${date}`,
        userId,
        date,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFats,
        totalFiber,
        meals,
        goalId: goal?.id || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Sauvegarder ou mettre à jour
      const existing = await this.getDailyNutrition(userId, date);
      if (existing) {
        await updateDoc(doc(this.dailyNutritionCollection, existing.id), {
          ...dailyNutrition,
          updatedAt: Timestamp.now(),
        });
      } else {
        await addDoc(this.dailyNutritionCollection, {
          ...dailyNutrition,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }

      console.log('✅ Nutrition quotidienne calculée:', date);
      return dailyNutrition;
    } catch (error) {
      console.error('❌ Erreur lors du calcul de la nutrition quotidienne:', error);
      throw error;
    }
  }

  /**
   * Gestion des recettes
   */
  async createRecipe(createdBy: string, recipe: Omit<Recipe, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(this.recipesCollection, {
        ...recipe,
        createdBy,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Recette créée:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la recette:', error);
      throw error;
    }
  }

  async getRecipes(category?: string, limitCount: number = 20): Promise<Recipe[]> {
    try {
      let q = query(
        this.recipesCollection,
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (category) {
        q = query(
          this.recipesCollection,
          where('isPublic', '==', true),
          where('category', '==', category),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Recipe;
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des recettes:', error);
      throw error;
    }
  }

  async searchRecipes(searchTerm: string): Promise<Recipe[]> {
    try {
      // Note: Firestore ne supporte pas la recherche textuelle native
      // Dans une vraie app, on utiliserait Algolia ou Elasticsearch
      const q = query(
        this.recipesCollection,
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const allRecipes = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Recipe;
      });

      // Filtrage côté client (temporaire)
      return allRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } catch (error) {
      console.error('❌ Erreur lors de la recherche de recettes:', error);
      throw error;
    }
  }

  /**
   * Écoute en temps réel
   */
  subscribeToDailyNutrition(userId: string, date: string, callback: (data: DailyNutrition | null) => void): Unsubscribe {
    const q = query(
      this.dailyNutritionCollection,
      where('userId', '==', userId),
      where('date', '==', date),
      limit(1)
    );

    return onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        callback(null);
        return;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      const dailyNutrition: DailyNutrition = {
        id: doc.id,
        userId: data.userId,
        date: data.date,
        totalCalories: data.totalCalories,
        totalProtein: data.totalProtein,
        totalCarbs: data.totalCarbs,
        totalFats: data.totalFats,
        totalFiber: data.totalFiber,
        meals: data.meals,
        goalId: data.goalId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
      callback(dailyNutrition);
    });
  }

  subscribeToMeals(userId: string, date: string, callback: (meals: Meal[]) => void): Unsubscribe {
    const q = query(
      this.mealsCollection,
      where('userId', '==', userId),
      where('date', '==', date),
      orderBy('time', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const meals = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Meal;
      });
      callback(meals);
    });
  }
}

export const nutritionService = new NutritionService();
