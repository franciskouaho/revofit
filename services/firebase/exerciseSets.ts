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

/**
 * Nettoie un objet en supprimant les valeurs undefined et null
 * Firebase ne supporte pas les valeurs undefined
 */
function cleanFirebaseData(data: any): any {
  const cleaned: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      cleaned[key] = value;
    } else {
      console.log(`🔍 Suppression de ${key}: ${value} (${typeof value})`);
    }
  }
  console.log('🔍 Données nettoyées:', cleaned);
  return cleaned;
}

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
    console.log('🔍 ExerciseSetService.completeSet appelé avec:');
    console.log('🔍 userId:', userId);
    console.log('🔍 exerciseId:', exerciseId);
    console.log('🔍 exerciseName:', exerciseName);
    console.log('🔍 setNumber:', setNumber);
    console.log('🔍 totalSets:', totalSets);
    console.log('🔍 reps:', reps);
    console.log('🔍 weight:', weight);
    console.log('🔍 templateId:', templateId);

    try {
      // Vérifier si cette série a déjà été complétée aujourd'hui (requête simplifiée)
      const today = new Date().toISOString().split('T')[0];
      console.log('🔍 Vérification série déjà complétée pour la date:', today);
      
      // Requête simplifiée sans index composite (temporaire)
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISE_SETS),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId),
        where('setNumber', '==', setNumber)
      );

      const snapshot = await getDocs(q);
      console.log('🔍 Nombre de séries déjà complétées trouvées:', snapshot.size);
      
      // Vérifier côté client si la série a été complétée aujourd'hui
      const isCompletedToday = snapshot.docs.some(doc => {
        const data = doc.data();
        const completedDate = data.completedAt?.toDate?.() || new Date(data.completedAt);
        return completedDate.toISOString().split('T')[0] === today;
      });
      
      if (isCompletedToday) {
        console.log('✅ Série déjà complétée aujourd\'hui');
        return true; // Déjà complétée
      }

      console.log('🔍 Création de la nouvelle série complétée...');
      
      // Créer la série complétée - nettoyer les données pour Firebase
      const exerciseSetData = cleanFirebaseData({
        userId,
        exerciseId,
        exerciseName,
        templateId, // Sera automatiquement supprimé si undefined
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

      console.log('🔍 Données à sauvegarder:', exerciseSetData);
      console.log('🔍 templateId value:', templateId, 'type:', typeof templateId);

      const docRef = await addDoc(collection(firestore, COLLECTIONS.EXERCISE_SETS), exerciseSetData);

      console.log('✅ Série créée avec ID:', docRef.id);

      // Mettre à jour la session d'entraînement
      console.log('🔍 Mise à jour de la session d\'entraînement...');
      await this.updateWorkoutSession(userId, exerciseId, setNumber, templateId);

      console.log('✅ Série complétée avec succès');
      return true;
    } catch (error) {
      console.error('💥 Erreur lors de la validation de la série:', error);
      console.error('💥 Détails de l\'erreur:', {
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        code: (error as any)?.code,
        templateId,
        exerciseId,
        userId
      });
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
      
      // Requête simplifiée pour éviter l'erreur d'index
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISE_SETS),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId)
      );

      const snapshot = await getDocs(q);
      
      // Filtrer côté client pour les séries d'aujourd'hui
      const todaySets = snapshot.docs
        .filter(doc => {
          const data = doc.data();
          const completedDate = data.completedAt?.toDate?.() || new Date(data.completedAt);
          const isToday = completedDate.toISOString().split('T')[0] === today;
          
          // Si templateId est fourni, vérifier qu'il correspond
          if (templateId) {
            return isToday && data.templateId === templateId;
          }
          
          return isToday;
        })
        .map(doc => doc.data().setNumber)
        .sort((a, b) => a - b);
        
      return todaySets;
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
    
    // Requête simplifiée pour éviter l'erreur d'index
    const q = query(
      collection(firestore, COLLECTIONS.EXERCISE_SETS),
      where('userId', '==', userId),
      where('exerciseId', '==', exerciseId)
    );

    return onSnapshot(q, (snapshot) => {
      // Filtrer côté client pour les séries d'aujourd'hui
      const todaySets = snapshot.docs
        .filter(doc => {
          const data = doc.data();
          const completedDate = data.completedAt?.toDate?.() || new Date(data.completedAt);
          const isToday = completedDate.toISOString().split('T')[0] === today;
          
          // Si templateId est fourni, vérifier qu'il correspond
          if (templateId) {
            return isToday && data.templateId === templateId;
          }
          
          return isToday;
        })
        .map(doc => doc.data().setNumber)
        .sort((a, b) => a - b);
        
      callback(todaySets);
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
        // Créer une nouvelle session - nettoyer les données pour Firebase
        const sessionData = cleanFirebaseData({
          userId,
          exerciseId,
          templateId, // Sera automatiquement supprimé si undefined
          totalSets: 4, // Valeur par défaut, sera mise à jour
          completedSets: [setNumber],
          startTime: serverTimestamp(),
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        await addDoc(collection(firestore, COLLECTIONS.WORKOUT_SESSIONS), sessionData);
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
