/**
 * Service Firebase pour la gestion des exercices et groupes musculaires
 * RevoFit - Gestion complète des données d'exercices
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  onSnapshot,
  DocumentSnapshot,
  QuerySnapshot,
  QueryConstraint,
  DocumentData
} from 'firebase/firestore';
import { firestore } from './config';
import {
  Exercise,
  MuscleGroup,
  ExerciseTemplate,
  WorkoutSession,
  ExerciseProgress,
  ExerciseFilters,
  MuscleGroupFilters,
  ExerciseResponse,
  MuscleGroupResponse,
  ExerciseError,
  UseExercisesReturn,
  UseMuscleGroupsReturn,
  UseExerciseProgressReturn
} from '../../types/exercise';

// Collections Firebase
const COLLECTIONS = {
  MUSCLE_GROUPS: 'muscleGroups',
  EXERCISES: 'exercises',
  EXERCISE_TEMPLATES: 'exerciseTemplates',
  WORKOUT_SESSIONS: 'workoutSessions',
  EXERCISE_PROGRESS: 'exerciseProgress',
  USER_FAVORITES: 'userFavorites',
  USER_EXERCISE_HISTORY: 'userExerciseHistory'
} as const;

/**
 * Service pour les groupes musculaires
 */
export class MuscleGroupService {
  /**
   * Récupère tous les groupes musculaires
   */
  static async getAllMuscleGroups(filters?: MuscleGroupFilters): Promise<MuscleGroupResponse> {
    try {
      const constraints: QueryConstraint[] = [];
      
      if (filters?.category) {
        constraints.push(where('category', 'in', filters.category));
      }
      
      if (filters?.searchQuery) {
        constraints.push(where('name', '>=', filters.searchQuery));
        constraints.push(where('name', '<=', filters.searchQuery + '\uf8ff'));
      }
      
      constraints.push(orderBy('name', 'asc'));
      
      const q = query(collection(firestore, COLLECTIONS.MUSCLE_GROUPS), ...constraints);
      const snapshot = await getDocs(q);
      
      const muscleGroups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MuscleGroup));
      
      return {
        success: true,
        data: muscleGroups
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MUSCLE_GROUPS_FETCH_ERROR',
          message: 'Erreur lors de la récupération des groupes musculaires',
          details: error
        }
      };
    }
  }

  /**
   * Récupère un groupe musculaire par ID
   */
  static async getMuscleGroupById(id: string): Promise<MuscleGroupResponse> {
    try {
      const docRef = doc(firestore, COLLECTIONS.MUSCLE_GROUPS, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'MUSCLE_GROUP_NOT_FOUND',
            message: 'Groupe musculaire non trouvé'
          }
        };
      }
      
      return {
        success: true,
        data: {
          id: docSnap.id,
          ...docSnap.data()
        } as MuscleGroup
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MUSCLE_GROUP_FETCH_ERROR',
          message: 'Erreur lors de la récupération du groupe musculaire',
          details: error
        }
      };
    }
  }

  /**
   * Récupère les exercices d'un groupe musculaire
   */
  static async getExercisesByMuscleGroup(muscleGroupId: string): Promise<ExerciseResponse> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISES),
        where('muscleGroups', 'array-contains', muscleGroupId),
        orderBy('name', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const exercises = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Exercise));
      
      return {
        success: true,
        data: exercises
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'EXERCISES_FETCH_ERROR',
          message: 'Erreur lors de la récupération des exercices du groupe musculaire',
          details: error
        }
      };
    }
  }

  /**
   * Écoute les changements d'un groupe musculaire en temps réel
   */
  static watchMuscleGroup(id: string, callback: (muscleGroup: MuscleGroup | null) => void) {
    const docRef = doc(firestore, COLLECTIONS.MUSCLE_GROUPS, id);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as MuscleGroup);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Écoute tous les groupes musculaires en temps réel
   */
  static watchAllMuscleGroups(callback: (muscleGroups: MuscleGroup[]) => void) {
    const q = query(
      collection(firestore, COLLECTIONS.MUSCLE_GROUPS),
      orderBy('name', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const muscleGroups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MuscleGroup));
      callback(muscleGroups);
    });
  }
}

/**
 * Service pour les exercices
 */
export class ExerciseService {
  /**
   * Récupère tous les exercices avec filtres
   */
  static async getAllExercises(filters?: ExerciseFilters): Promise<ExerciseResponse> {
    try {
      const constraints: QueryConstraint[] = [];
      
      if (filters?.muscleGroups && filters.muscleGroups.length > 0) {
        constraints.push(where('muscleGroups', 'array-contains-any', filters.muscleGroups));
      }
      
      if (filters?.equipment && filters.equipment.length > 0) {
        constraints.push(where('equipment', 'array-contains-any', filters.equipment));
      }
      
      if (filters?.difficulty && filters.difficulty.length > 0) {
        constraints.push(where('difficulty', 'in', filters.difficulty));
      }
      
      if (filters?.searchQuery) {
        constraints.push(where('name', '>=', filters.searchQuery));
        constraints.push(where('name', '<=', filters.searchQuery + '\uf8ff'));
      }
      
      constraints.push(orderBy('name', 'asc'));
      
      const q = query(collection(firestore, COLLECTIONS.EXERCISES), ...constraints);
      const snapshot = await getDocs(q);
      
      const exercises = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Exercise));
      
      return {
        success: true,
        data: exercises
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'EXERCISES_FETCH_ERROR',
          message: 'Erreur lors de la récupération des exercices',
          details: error
        }
      };
    }
  }

  /**
   * Récupère un exercice par ID
   */
  static async getExerciseById(id: string): Promise<ExerciseResponse> {
    try {
      const docRef = doc(firestore, COLLECTIONS.EXERCISES, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'EXERCISE_NOT_FOUND',
            message: 'Exercice non trouvé'
          }
        };
      }
      
      return {
        success: true,
        data: {
          id: docSnap.id,
          ...docSnap.data()
        } as Exercise
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'EXERCISE_FETCH_ERROR',
          message: 'Erreur lors de la récupération de l\'exercice',
          details: error
        }
      };
    }
  }

  /**
   * Recherche d'exercices par nom
   */
  static async searchExercises(query: string, limitCount: number = 20): Promise<ExerciseResponse> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISES),
        where('name', '>=', query),
        where('name', '<=', query + '\uf8ff'),
        orderBy('name', 'asc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const exercises = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Exercise));
      
      return {
        success: true,
        data: exercises
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'EXERCISE_SEARCH_ERROR',
          message: 'Erreur lors de la recherche d\'exercices',
          details: error
        }
      };
    }
  }

  /**
   * Récupère les exercices favoris d'un utilisateur
   */
  static async getUserFavorites(userId: string): Promise<ExerciseResponse> {
    try {
      const favoritesDoc = await getDoc(doc(firestore, COLLECTIONS.USER_FAVORITES, userId));
      
      if (!favoritesDoc.exists()) {
        return {
          success: true,
          data: []
        };
      }
      
      const favoriteIds = favoritesDoc.data().exerciseIds || [];
      
      if (favoriteIds.length === 0) {
        return {
          success: true,
          data: []
        };
      }
      
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISES),
        where('__name__', 'in', favoriteIds)
      );
      
      const snapshot = await getDocs(q);
      const exercises = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Exercise));
      
      return {
        success: true,
        data: exercises
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FAVORITES_FETCH_ERROR',
          message: 'Erreur lors de la récupération des favoris',
          details: error
        }
      };
    }
  }

  /**
   * Ajoute un exercice aux favoris
   */
  static async addToFavorites(userId: string, exerciseId: string): Promise<ExerciseResponse> {
    try {
      const favoritesRef = doc(firestore, COLLECTIONS.USER_FAVORITES, userId);
      const favoritesDoc = await getDoc(favoritesRef);
      
      if (favoritesDoc.exists()) {
        const currentFavorites = favoritesDoc.data().exerciseIds || [];
        if (!currentFavorites.includes(exerciseId)) {
          await updateDoc(favoritesRef, {
            exerciseIds: [...currentFavorites, exerciseId],
            updatedAt: serverTimestamp()
          });
        }
      } else {
        await setDoc(favoritesRef, {
          userId,
          exerciseIds: [exerciseId],
          muscleGroupIds: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ADD_FAVORITE_ERROR',
          message: 'Erreur lors de l\'ajout aux favoris',
          details: error
        }
      };
    }
  }

  /**
   * Retire un exercice des favoris
   */
  static async removeFromFavorites(userId: string, exerciseId: string): Promise<ExerciseResponse> {
    try {
      const favoritesRef = doc(firestore, COLLECTIONS.USER_FAVORITES, userId);
      const favoritesDoc = await getDoc(favoritesRef);
      
      if (favoritesDoc.exists()) {
        const currentFavorites = favoritesDoc.data().exerciseIds || [];
        const updatedFavorites = currentFavorites.filter((id: string) => id !== exerciseId);
        
        await updateDoc(favoritesRef, {
          exerciseIds: updatedFavorites,
          updatedAt: serverTimestamp()
        });
      }
      
      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REMOVE_FAVORITE_ERROR',
          message: 'Erreur lors de la suppression des favoris',
          details: error
        }
      };
    }
  }

  /**
   * Écoute les changements d'un exercice en temps réel
   */
  static watchExercise(id: string, callback: (exercise: Exercise | null) => void) {
    const docRef = doc(firestore, COLLECTIONS.EXERCISES, id);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as Exercise);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Écoute tous les exercices en temps réel
   */
  static watchAllExercises(callback: (exercises: Exercise[]) => void) {
    const q = query(
      collection(firestore, COLLECTIONS.EXERCISES),
      orderBy('name', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const exercises = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Exercise));
      callback(exercises);
    });
  }
}

/**
 * Service pour la progression des exercices
 */
export class ExerciseProgressService {
  /**
   * Récupère la progression d'un exercice pour un utilisateur
   */
  static async getExerciseProgress(userId: string, exerciseId: string): Promise<ExerciseProgress[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISE_PROGRESS),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId),
        orderBy('date', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ExerciseProgress));
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression:', error);
      return [];
    }
  }

  /**
   * Ajoute une progression d'exercice
   */
  static async addExerciseProgress(progress: Omit<ExerciseProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExerciseProgress | null> {
    try {
      const docRef = await addDoc(collection(firestore, COLLECTIONS.EXERCISE_PROGRESS), {
        ...progress,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...progress,
        createdAt: new Date(),
        updatedAt: new Date()
      } as ExerciseProgress;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la progression:', error);
      return null;
    }
  }

  /**
   * Met à jour une progression d'exercice
   */
  static async updateExerciseProgress(id: string, updates: Partial<ExerciseProgress>): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.EXERCISE_PROGRESS, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
      return false;
    }
  }

  /**
   * Supprime une progression d'exercice
   */
  static async deleteExerciseProgress(id: string): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.EXERCISE_PROGRESS, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la progression:', error);
      return false;
    }
  }
}

/**
 * Service pour les sessions d'entraînement
 */
export class WorkoutSessionService {
  /**
   * Démarre une nouvelle session d'entraînement
   */
  static async startWorkoutSession(workoutId: string, userId: string): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(firestore, COLLECTIONS.WORKOUT_SESSIONS), {
        workoutId,
        userId,
        startTime: serverTimestamp(),
        status: 'active',
        exercises: [],
        totalTime: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors du démarrage de la session:', error);
      return null;
    }
  }

  /**
   * Met à jour une session d'entraînement
   */
  static async updateWorkoutSession(sessionId: string, updates: Partial<WorkoutSession>): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.WORKOUT_SESSIONS, sessionId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la session:', error);
      return false;
    }
  }

  /**
   * Termine une session d'entraînement
   */
  static async endWorkoutSession(sessionId: string, totalTime: number, caloriesBurned?: number): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.WORKOUT_SESSIONS, sessionId);
      await updateDoc(docRef, {
        endTime: serverTimestamp(),
        status: 'completed',
        totalTime,
        caloriesBurned,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la fin de la session:', error);
      return false;
    }
  }

  /**
   * Récupère les sessions d'entraînement d'un utilisateur
   */
  static async getUserWorkoutSessions(userId: string, limitCount: number = 20): Promise<WorkoutSession[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.WORKOUT_SESSIONS),
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as WorkoutSession));
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      return [];
    }
  }
}

// Export des services
export {
  MuscleGroupService,
  ExerciseService,
  ExerciseProgressService,
  WorkoutSessionService
};
