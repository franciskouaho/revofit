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
import { NotificationService } from './notifications';

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
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as NutritionGoal;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'objectif nutritionnel:', error);
      return null; // Retourner null au lieu de throw pour éviter les erreurs
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

      // Vérifier si l'objectif calorique est atteint
      await this.checkCalorieGoal(userId, meal.date);

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
        where('date', '==', date)
      );
      
      const querySnapshot = await getDocs(q);
      const meals = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Meal;
      });

      // Trier côté client pour éviter les problèmes d'index
      return meals.sort((a, b) => a.time.localeCompare(b.time));
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des repas:', error);
      return []; // Retourner un tableau vide au lieu de throw
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
      // Essayer d'abord une requête simple sans orderBy pour éviter les problèmes d'index
      let q = query(
        this.recipesCollection,
        where('isPublic', '==', true),
        limit(limitCount)
      );

      if (category) {
        q = query(
          this.recipesCollection,
          where('isPublic', '==', true),
          where('category', '==', category),
          limit(limitCount)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const recipes = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Recipe;
      });

      // Si aucune recette n'est trouvée, retourner des recettes par défaut
      if (recipes.length === 0) {
        console.log('📚 Aucune recette trouvée, retour des recettes par défaut');
        return this.getDefaultRecipes(category);
      }

      return recipes;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des recettes:', error);
      // En cas d'erreur, retourner des recettes par défaut
      return this.getDefaultRecipes(category);
    }
  }

  /**
   * Récupérer des recettes par défaut
   */
  private getDefaultRecipes(category?: string): Recipe[] {
    const defaultRecipes: Recipe[] = [
      {
        id: 'default-1',
        name: 'Bowl protéiné quinoa',
        description: 'Un bowl équilibré avec quinoa, légumes et protéines',
        category: 'lunch',
        calories: 420,
        protein: 28,
        carbs: 45,
        fats: 12,
        fiber: 8,
        prepTime: 25,
        difficulty: 'easy',
        servings: 1,
        ingredients: ['Quinoa', 'Poulet grillé', 'Avocat', 'Tomates', 'Concombre'],
        instructions: ['Cuire le quinoa', 'Griller le poulet', 'Couper les légumes', 'Assembler le bowl'],
        tags: ['Végétarien', 'Riche en protéines', 'Sans gluten'],
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'default-2',
        name: 'Smoothie vert énergisant',
        description: 'Smoothie vert riche en vitamines et minéraux',
        category: 'breakfast',
        calories: 180,
        protein: 15,
        carbs: 22,
        fats: 4,
        fiber: 6,
        prepTime: 5,
        difficulty: 'easy',
        servings: 1,
        ingredients: ['Épinards', 'Banane', 'Pomme', 'Lait d\'amande', 'Protéine en poudre'],
        instructions: ['Mettre tous les ingrédients dans un blender', 'Mixer jusqu\'à obtenir une texture lisse'],
        tags: ['Vegan', 'Rapide', 'Énergisant'],
        imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'default-3',
        name: 'Saumon grillé légumes',
        description: 'Saumon grillé accompagné de légumes de saison',
        category: 'dinner',
        calories: 380,
        protein: 35,
        carbs: 18,
        fats: 22,
        fiber: 5,
        prepTime: 35,
        difficulty: 'medium',
        servings: 1,
        ingredients: ['Filet de saumon', 'Brocolis', 'Carottes', 'Courgettes', 'Huile d\'olive'],
        instructions: ['Préchauffer le four', 'Assaisonner le saumon', 'Cuire les légumes', 'Griller le saumon'],
        tags: ['Oméga-3', 'Riche en protéines', 'Anti-inflammatoire'],
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'default-4',
        name: 'Salade de pois chiches',
        description: 'Salade fraîche et protéinée aux pois chiches',
        category: 'snack',
        calories: 220,
        protein: 12,
        carbs: 28,
        fats: 8,
        fiber: 10,
        prepTime: 15,
        difficulty: 'easy',
        servings: 1,
        ingredients: ['Pois chiches', 'Tomates cerises', 'Concombre', 'Oignon rouge', 'Persil'],
        instructions: ['Rincer les pois chiches', 'Couper les légumes', 'Mélanger avec l\'assaisonnement'],
        tags: ['Végétarien', 'Fibres', 'Rapide'],
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'default-5',
        name: 'Omelette aux légumes',
        description: 'Omelette légère et nutritive aux légumes frais',
        category: 'breakfast',
        calories: 250,
        protein: 18,
        carbs: 8,
        fats: 16,
        fiber: 3,
        prepTime: 10,
        difficulty: 'easy',
        servings: 1,
        ingredients: ['Œufs', 'Épinards', 'Tomates', 'Fromage râpé', 'Herbes fraîches'],
        instructions: ['Battre les œufs', 'Faire revenir les légumes', 'Ajouter les œufs et cuire'],
        tags: ['Rapide', 'Riche en protéines', 'Équilibré'],
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'default-6',
        name: 'Poulet aux herbes',
        description: 'Filet de poulet mariné aux herbes et épices',
        category: 'dinner',
        calories: 320,
        protein: 40,
        carbs: 5,
        fats: 15,
        fiber: 2,
        prepTime: 30,
        difficulty: 'easy',
        servings: 1,
        ingredients: ['Filet de poulet', 'Thym', 'Romarin', 'Ail', 'Citron'],
        instructions: ['Mariner le poulet', 'Faire cuire à la poêle', 'Servir avec des légumes'],
        tags: ['Riche en protéines', 'Faible en glucides', 'Sain'],
        imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Filtrer par catégorie si spécifiée
    if (category) {
      return defaultRecipes.filter(recipe => recipe.category === category);
    }

    return defaultRecipes;
  }

  async searchRecipes(searchTerm: string): Promise<Recipe[]> {
    try {
      // Note: Firestore ne supporte pas la recherche textuelle native
      // Dans une vraie app, on utiliserait Algolia ou Elasticsearch
      const q = query(
        this.recipesCollection,
        where('isPublic', '==', true),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      let allRecipes = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Recipe;
      });

      // Si aucune recette n'est trouvée, utiliser les recettes par défaut
      if (allRecipes.length === 0) {
        console.log('📚 Aucune recette trouvée, utilisation des recettes par défaut pour la recherche');
        allRecipes = this.getDefaultRecipes();
      }

      // Filtrage côté client (temporaire)
      return allRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('❌ Erreur lors de la recherche de recettes:', error);
      // En cas d'erreur, utiliser les recettes par défaut
      const defaultRecipes = this.getDefaultRecipes();
      return defaultRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
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

  /**
   * Vérifie si l'objectif calorique est atteint et envoie une notification
   */
  private async checkCalorieGoal(userId: string, date: string): Promise<void> {
    try {
      // Récupérer l'objectif nutritionnel de l'utilisateur
      const goalQuery = query(
        this.goalsCollection,
        where('userId', '==', userId),
        limit(1)
      );
      const goalSnapshot = await getDocs(goalQuery);
      
      if (goalSnapshot.empty) return; // Pas d'objectif défini
      
      const goal = goalSnapshot.docs[0].data() as NutritionGoal;
      const calorieGoal = goal.calories;

      // Récupérer les repas du jour
      const meals = await this.getMealsByDate(userId, date);
      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

      // Vérifier si l'objectif est atteint (à 95% pour éviter les notifications multiples)
      if (totalCalories >= calorieGoal * 0.95 && totalCalories <= calorieGoal * 1.05) {
        await NotificationService.createCalorieGoalNotification(userId, totalCalories, calorieGoal);
        console.log('✅ Notification d\'objectif calorique envoyée');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de l\'objectif calorique:', error);
    }
  }
}

export const nutritionService = new NutritionService();
