/**
 * Service Firebase pour le statut d'entraînement et les données de calendrier
 * RevoFit - Gestion du statut d'entraînement
 */

import {
    addDoc,
    collection,
    doc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { firestore } from './config';

// Collections Firebase
const COLLECTIONS = {
  WORKOUT_STATUS: 'workoutStatus',
  DAILY_WORKOUTS: 'dailyWorkouts',
  USER_STREAKS: 'userStreaks'
} as const;

// Types pour le statut d'entraînement
export interface WorkoutStatus {
  id: string;
  userId: string;
  strikes: number;
  currentDay: string;
  workoutMessage: string;
  upcomingDays: {
    day: number;
    label: string;
  }[];
  lastWorkoutDate: string; // YYYY-MM-DD
  streakStartDate: string; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyWorkout {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  workoutId: string;
  workoutName: string;
  completed: boolean;
  duration: number; // en minutes
  calories: number;
  createdAt: Date;
}

export interface UserStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string; // YYYY-MM-DD
  streakStartDate: string; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service pour le statut d'entraînement
 */
export class WorkoutStatusService {
  /**
   * Récupère le statut d'entraînement d'un utilisateur
   */
  static async getWorkoutStatus(userId: string): Promise<WorkoutStatus | null> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.WORKOUT_STATUS),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Créer un statut par défaut
        return await this.createDefaultStatus(userId);
      }
      
      // Trier côté client pour éviter l'index
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as WorkoutStatus));
      
      // Trier par updatedAt et prendre le plus récent
      const sortedDocs = docs.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      return sortedDocs[0];
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      return null;
    }
  }

  /**
   * Crée un statut par défaut pour un nouvel utilisateur
   */
  static async createDefaultStatus(userId: string): Promise<WorkoutStatus | null> {
    try {
      const today = new Date();
      const currentDay = today.toLocaleDateString('fr-FR', { weekday: 'short' });
      
      // Générer les prochains jours
      const upcomingDays = [];
      for (let i = 1; i <= 3; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        upcomingDays.push({
          day: futureDate.getDate(),
          label: futureDate.toLocaleDateString('fr-FR', { weekday: 'short' })
        });
      }

      const defaultStatus = {
        userId,
        strikes: 0,
        currentDay,
        workoutMessage: "C'est l'heure de s'entraîner",
        upcomingDays,
        lastWorkoutDate: today.toISOString().split('T')[0],
        streakStartDate: today.toISOString().split('T')[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(firestore, COLLECTIONS.WORKOUT_STATUS), defaultStatus);
      
      return {
        id: docRef.id,
        ...defaultStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      } as WorkoutStatus;
    } catch (error) {
      console.error('Erreur lors de la création du statut par défaut:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut d'entraînement
   */
  static async updateWorkoutStatus(
    userId: string, 
    updates: Partial<Omit<WorkoutStatus, 'id' | 'userId' | 'createdAt'>>
  ): Promise<boolean> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.WORKOUT_STATUS),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.error('Aucun statut trouvé pour cet utilisateur');
        return false;
      }
      
      // Trier côté client pour éviter l'index
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as WorkoutStatus));
      
      // Trier par updatedAt et prendre le plus récent
      const sortedDocs = docs.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      const docRef = doc(firestore, COLLECTIONS.WORKOUT_STATUS, sortedDocs[0].id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return false;
    }
  }

  /**
   * Récupère les entraînements quotidiens d'un utilisateur
   */
  static async getDailyWorkouts(userId: string, limitCount: number = 7): Promise<DailyWorkout[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.DAILY_WORKOUTS),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      const workouts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DailyWorkout));
      
      // Trier par date et limiter
      return workouts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limitCount);
    } catch (error) {
      console.error('Erreur lors de la récupération des entraînements quotidiens:', error);
      return [];
    }
  }

  /**
   * Récupère la série d'entraînements d'un utilisateur
   */
  static async getUserStreak(userId: string): Promise<UserStreak | null> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.USER_STREAKS),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Créer une série par défaut
        return await this.createDefaultStreak(userId);
      }
      
      // Trier côté client pour éviter l'index
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserStreak));
      
      // Trier par updatedAt et prendre le plus récent
      const sortedDocs = docs.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      return sortedDocs[0];
    } catch (error) {
      console.error('Erreur lors de la récupération de la série:', error);
      return null;
    }
  }

  /**
   * Crée une série par défaut pour un nouvel utilisateur
   */
  static async createDefaultStreak(userId: string): Promise<UserStreak | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const defaultStreak = {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: today,
        streakStartDate: today,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(firestore, COLLECTIONS.USER_STREAKS), defaultStreak);
      
      return {
        id: docRef.id,
        ...defaultStreak,
        createdAt: new Date(),
        updatedAt: new Date()
      } as UserStreak;
    } catch (error) {
      console.error('Erreur lors de la création de la série par défaut:', error);
      return null;
    }
  }

  /**
   * Écoute les changements du statut en temps réel
   */
  static watchWorkoutStatus(userId: string, callback: (status: WorkoutStatus | null) => void) {
    const q = query(
      collection(firestore, COLLECTIONS.WORKOUT_STATUS),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }
      
      // Trier côté client pour éviter l'index
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as WorkoutStatus));
      
      // Trier par updatedAt et prendre le plus récent
      const sortedDocs = docs.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      callback(sortedDocs[0]);
    });
  }
}
