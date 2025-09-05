/**
 * Service Firebase pour les statistiques utilisateur
 * RevoFit - Gestion des statistiques personnelles
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
  USER_STATS: 'userStats',
  DAILY_ACTIVITY: 'dailyActivity',
  WEEKLY_GOALS: 'weeklyGoals'
} as const;

// Types pour les statistiques
export interface UserStats {
  id: string;
  userId: string;
  calories: number;
  steps: number;
  heartRate: number;
  workouts: {
    completed: number;
    total: number;
  };
  streak: number;
  points: number;
  weeklyGoal: {
    done: number;
    target: number;
  };
  lastUpdated: Date;
  createdAt: Date;
}

export interface DailyActivity {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  calories: number;
  steps: number;
  heartRate: number;
  workoutsCompleted: number;
  createdAt: Date;
}

export interface WeeklyGoal {
  id: string;
  userId: string;
  weekStart: string; // YYYY-MM-DD
  targetWorkouts: number;
  completedWorkouts: number;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Service pour les statistiques utilisateur
 */
export class UserStatsService {
  /**
   * Récupère les statistiques d'un utilisateur
   */
  static async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      // Requête simplifiée sans orderBy pour éviter l'index
      const q = query(
        collection(firestore, COLLECTIONS.USER_STATS),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Créer des statistiques par défaut
        return await this.createDefaultStats(userId);
      }
      
      // Trier côté client pour éviter l'index
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserStats));
      
      // Trier par lastUpdated et prendre le plus récent
      const sortedDocs = docs.sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
      
      return sortedDocs[0];
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return null;
    }
  }

  /**
   * Crée des statistiques par défaut pour un nouvel utilisateur
   */
  static async createDefaultStats(userId: string): Promise<UserStats | null> {
    try {
      const defaultStats = {
        userId,
        calories: 0,
        steps: 0,
        heartRate: 0,
        workouts: {
          completed: 0,
          total: 0
        },
        streak: 0,
        points: 0,
        weeklyGoal: {
          done: 0,
          target: 5
        },
        lastUpdated: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(firestore, COLLECTIONS.USER_STATS), defaultStats);
      
      return {
        id: docRef.id,
        ...defaultStats,
        lastUpdated: new Date(),
        createdAt: new Date()
      } as UserStats;
    } catch (error) {
      console.error('Erreur lors de la création des statistiques par défaut:', error);
      return null;
    }
  }

  /**
   * Met à jour les statistiques d'un utilisateur
   */
  static async updateUserStats(
    userId: string, 
    updates: Partial<Omit<UserStats, 'id' | 'userId' | 'createdAt'>>
  ): Promise<boolean> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.USER_STATS),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.error('Aucune statistique trouvée pour cet utilisateur');
        return false;
      }
      
      // Trier côté client pour éviter l'index
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserStats));
      
      // Trier par lastUpdated et prendre le plus récent
      const sortedDocs = docs.sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
      
      const docRef = doc(firestore, COLLECTIONS.USER_STATS, sortedDocs[0].id);
      await updateDoc(docRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
      return false;
    }
  }

  /**
   * Écoute les changements des statistiques en temps réel
   */
  static watchUserStats(userId: string, callback: (stats: UserStats | null) => void) {
    const q = query(
      collection(firestore, COLLECTIONS.USER_STATS),
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
      } as UserStats));
      
      // Trier par lastUpdated et prendre le plus récent
      const sortedDocs = docs.sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
      
      callback(sortedDocs[0]);
    });
  }

  /**
   * Récupère l'activité quotidienne d'un utilisateur
   */
  static async getDailyActivity(userId: string, date: string): Promise<DailyActivity | null> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.DAILY_ACTIVITY),
        where('userId', '==', userId),
        where('date', '==', date)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as DailyActivity;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'activité quotidienne:', error);
      return null;
    }
  }

  /**
   * Met à jour l'activité quotidienne
   */
  static async updateDailyActivity(
    userId: string,
    date: string,
    activity: Partial<Omit<DailyActivity, 'id' | 'userId' | 'date' | 'createdAt'>>
  ): Promise<boolean> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.DAILY_ACTIVITY),
        where('userId', '==', userId),
        where('date', '==', date)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Créer une nouvelle entrée
        await addDoc(collection(firestore, COLLECTIONS.DAILY_ACTIVITY), {
          userId,
          date,
          calories: 0,
          steps: 0,
          heartRate: 0,
          workoutsCompleted: 0,
          ...activity,
          createdAt: serverTimestamp()
        });
      } else {
        // Mettre à jour l'entrée existante
        const docRef = doc(firestore, COLLECTIONS.DAILY_ACTIVITY, snapshot.docs[0].id);
        await updateDoc(docRef, activity);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'activité quotidienne:', error);
      return false;
    }
  }

  /**
   * Récupère l'objectif hebdomadaire actuel
   */
  static async getCurrentWeeklyGoal(userId: string): Promise<WeeklyGoal | null> {
    try {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekStartStr = weekStart.toISOString().split('T')[0];
      
      const q = query(
        collection(firestore, COLLECTIONS.WEEKLY_GOALS),
        where('userId', '==', userId),
        where('weekStart', '==', weekStartStr),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as WeeklyGoal;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'objectif hebdomadaire:', error);
      return null;
    }
  }

  /**
   * Met à jour l'objectif hebdomadaire
   */
  static async updateWeeklyGoal(
    userId: string,
    weekStart: string,
    updates: Partial<Omit<WeeklyGoal, 'id' | 'userId' | 'weekStart' | 'createdAt'>>
  ): Promise<boolean> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.WEEKLY_GOALS),
        where('userId', '==', userId),
        where('weekStart', '==', weekStart)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Créer un nouvel objectif
        await addDoc(collection(firestore, COLLECTIONS.WEEKLY_GOALS), {
          userId,
          weekStart,
          targetWorkouts: 5,
          completedWorkouts: 0,
          isActive: true,
          ...updates,
          createdAt: serverTimestamp()
        });
      } else {
        // Mettre à jour l'objectif existant
        const docRef = doc(firestore, COLLECTIONS.WEEKLY_GOALS, snapshot.docs[0].id);
        await updateDoc(docRef, updates);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'objectif hebdomadaire:', error);
      return false;
    }
  }
}
