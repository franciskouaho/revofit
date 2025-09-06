/**
 * Service Firebase pour la gestion des séries d'exercices validées
 * RevoFit - Suivi des séries complétées
 */

import {
    addDoc,
    collection,
    deleteDoc,
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
  EXERCISE_SETS: 'exerciseSets',
  WORKOUT_SESSIONS: 'workoutSessions'
} as const;

// Types pour les séries d'exercices
export interface ExerciseSet {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  templateId?: string;
  setNumber: number;
  totalSets: number;
  reps: number;
  weight?: number;
  duration?: number; // en secondes pour les exercices de temps
  restTime?: string;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  templateId?: string;
  exerciseId: string;
  exerciseName: string;
  totalSets: number;
  completedSets: number[];
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service pour la gestion des séries d'exercices
 */
export class ExerciseSetService {
  /**
   * Marque une série comme complétée
   */
  static async completeSet(
    userId: string,
    exerciseId: string,
    exerciseName: string,
    setNumber: number,
    totalSets: number,
    reps: number,
    weight?: number,
    duration?: number,
    restTime?: string,
    templateId?: string
  ): Promise<boolean> {
    try {
      // Vérifier si cette série a déjà été complétée aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISE_SETS),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId),
        where('setNumber', '==', setNumber),
        where('completedAt', '>=', new Date(today + 'T00:00:00.000Z')),
        where('completedAt', '<=', new Date(today + 'T23:59:59.999Z'))
      );

      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        console.log('Série déjà complétée aujourd\'hui');
        return true; // Déjà complétée
      }

      // Créer la série complétée
      await addDoc(collection(firestore, COLLECTIONS.EXERCISE_SETS), {
        userId,
        exerciseId,
        exerciseName,
        templateId,
        setNumber,
        totalSets,
        reps,
        weight: weight || 0,
        duration: duration || 0,
        restTime: restTime || '2 min',
        completedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Mettre à jour la session d'entraînement
      await this.updateWorkoutSession(userId, exerciseId, setNumber, templateId);

      return true;
    } catch (error) {
      console.error('Erreur lors de la validation de la série:', error);
      return false;
    }
  }

  /**
   * Récupère les séries complétées pour un exercice
   */
  static async getCompletedSets(
    userId: string,
    exerciseId: string,
    templateId?: string
  ): Promise<number[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISE_SETS),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId),
        where('completedAt', '>=', new Date(today + 'T00:00:00.000Z')),
        where('completedAt', '<=', new Date(today + 'T23:59:59.999Z'))
      );

      if (templateId) {
        // Si on a un templateId, on peut l'ajouter au filtre
        const qWithTemplate = query(
          collection(firestore, COLLECTIONS.EXERCISE_SETS),
          where('userId', '==', userId),
          where('exerciseId', '==', exerciseId),
          where('templateId', '==', templateId),
          where('completedAt', '>=', new Date(today + 'T00:00:00.000Z')),
          where('completedAt', '<=', new Date(today + 'T23:59:59.999Z'))
        );
        
        const snapshot = await getDocs(qWithTemplate);
        return snapshot.docs.map(doc => doc.data().setNumber).sort((a, b) => a - b);
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data().setNumber).sort((a, b) => a - b);
    } catch (error) {
      console.error('Erreur lors de la récupération des séries complétées:', error);
      return [];
    }
  }

  /**
   * Écoute les changements des séries complétées en temps réel
   */
  static watchCompletedSets(
    userId: string,
    exerciseId: string,
    callback: (completedSets: number[]) => void,
    templateId?: string
  ): () => void {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(firestore, COLLECTIONS.EXERCISE_SETS),
      where('userId', '==', userId),
      where('exerciseId', '==', exerciseId),
      where('completedAt', '>=', new Date(today + 'T00:00:00.000Z')),
      where('completedAt', '<=', new Date(today + 'T23:59:59.999Z'))
    );

    return onSnapshot(q, (snapshot) => {
      const completedSets = snapshot.docs
        .map(doc => doc.data().setNumber)
        .sort((a, b) => a - b);
      callback(completedSets);
    });
  }

  /**
   * Supprime une série complétée (pour les tests ou corrections)
   */
  static async removeCompletedSet(
    userId: string,
    exerciseId: string,
    setNumber: number
  ): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISE_SETS),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId),
        where('setNumber', '==', setNumber),
        where('completedAt', '>=', new Date(today + 'T00:00:00.000Z')),
        where('completedAt', '<=', new Date(today + 'T23:59:59.999Z'))
      );

      const snapshot = await getDocs(q);
      
      for (const docSnapshot of snapshot.docs) {
        await deleteDoc(doc(firestore, COLLECTIONS.EXERCISE_SETS, docSnapshot.id));
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la série:', error);
      return false;
    }
  }

  /**
   * Met à jour la session d'entraînement
   */
  private static async updateWorkoutSession(
    userId: string,
    exerciseId: string,
    setNumber: number,
    templateId?: string
  ): Promise<void> {
    try {
      // Chercher une session active pour cet exercice
      const q = query(
        collection(firestore, COLLECTIONS.WORKOUT_SESSIONS),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Créer une nouvelle session
        await addDoc(collection(firestore, COLLECTIONS.WORKOUT_SESSIONS), {
          userId,
          exerciseId,
          templateId,
          totalSets: 4, // Valeur par défaut, sera mise à jour
          completedSets: [setNumber],
          startTime: serverTimestamp(),
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Mettre à jour la session existante
        const sessionDoc = snapshot.docs[0];
        const currentData = sessionDoc.data();
        const completedSets = [...(currentData.completedSets || []), setNumber];
        
        await updateDoc(doc(firestore, COLLECTIONS.WORKOUT_SESSIONS, sessionDoc.id), {
          completedSets,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la session:', error);
    }
  }
}
