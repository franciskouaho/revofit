/**
 * Service Firebase pour la gestion des workouts et sessions d'entraînement
 * RevoFit - Gestion complète des workouts
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import {
  ExerciseProgress,
  ExerciseSet,
  ExerciseTemplate,
  SetData,
  WorkoutSession
} from '../../types/exercise';
import { firestore } from './config';

// Collections Firebase
const COLLECTIONS = {
  EXERCISE_TEMPLATES: 'exerciseTemplates',
  WORKOUT_SESSIONS: 'workoutSessions',
  EXERCISE_PROGRESS: 'exerciseProgress',
  EXERCISES: 'exercises'
} as const;

/**
 * Service pour les templates d'exercices (workouts)
 */
export class WorkoutTemplateService {
  /**
   * Récupère tous les templates d'exercices
   */
  static async getAllTemplates(userId?: string): Promise<ExerciseTemplate[]> {
    try {
      let q;
      
      if (userId) {
        // Récupérer les templates publics ET les templates de l'utilisateur
        const publicQuery = query(
          collection(firestore, COLLECTIONS.EXERCISE_TEMPLATES),
          where('isPublic', '==', true)
        );
        
        const userQuery = query(
          collection(firestore, COLLECTIONS.EXERCISE_TEMPLATES),
          where('createdBy', '==', userId)
        );
        
        // Exécuter les deux requêtes en parallèle
        const [publicSnapshot, userSnapshot] = await Promise.all([
          getDocs(publicQuery),
          getDocs(userQuery)
        ]);
        
        // Combiner les résultats
        const publicTemplates = publicSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ExerciseTemplate));
        
        const userTemplates = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ExerciseTemplate));
        
        // Fusionner et dédupliquer (au cas où un template public serait aussi créé par l'utilisateur)
        const allTemplates = [...publicTemplates, ...userTemplates];
        const uniqueTemplates = allTemplates.filter((template, index, self) => 
          index === self.findIndex(t => t.id === template.id)
        );
        
        return uniqueTemplates.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        // Fallback: seulement les templates publics
        q = query(
          collection(firestore, COLLECTIONS.EXERCISE_TEMPLATES),
          where('isPublic', '==', true)
        );
        
        const snapshot = await getDocs(q);
        const templates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ExerciseTemplate));
        
        return templates.sort((a, b) => a.name.localeCompare(b.name));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
      return [];
    }
  }

  /**
   * Récupère un template par ID
   */
  static async getTemplateById(id: string): Promise<ExerciseTemplate | null> {
    try {
      const docRef = doc(firestore, COLLECTIONS.EXERCISE_TEMPLATES, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ExerciseTemplate;
    } catch (error) {
      console.error('Erreur lors de la récupération du template:', error);
      return null;
    }
  }

  /**
   * Récupère les templates par groupe musculaire
   */
  static async getTemplatesByMuscleGroup(muscleGroup: string): Promise<ExerciseTemplate[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISE_TEMPLATES),
        where('muscleGroups', 'array-contains', muscleGroup),
        where('isPublic', '==', true),
        orderBy('name', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ExerciseTemplate));
    } catch (error) {
      console.error('Erreur lors de la récupération des templates par groupe musculaire:', error);
      return [];
    }
  }

  /**
   * Récupère les templates par difficulté
   */
  static async getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<ExerciseTemplate[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISE_TEMPLATES),
        where('difficulty', '==', difficulty),
        where('isPublic', '==', true),
        orderBy('name', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ExerciseTemplate));
    } catch (error) {
      console.error('Erreur lors de la récupération des templates par difficulté:', error);
      return [];
    }
  }

  /**
   * Crée un nouveau template d'exercice
   */
  static async createTemplate(templateData: Omit<ExerciseTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExerciseTemplate> {
    try {
      const docRef = await addDoc(collection(firestore, COLLECTIONS.EXERCISE_TEMPLATES), {
        ...templateData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...templateData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as ExerciseTemplate;
    } catch (error) {
      console.error('Erreur lors de la création du template:', error);
      throw error;
    }
  }

  /**
   * Supprime un template d'exercice
   */
  static async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      console.log(`🗑️ Tentative de suppression du template: ${templateId}`);
      
      // Vérifier que le template existe avant de le supprimer
      const templateRef = doc(firestore, COLLECTIONS.EXERCISE_TEMPLATES, templateId);
      const templateDoc = await getDoc(templateRef);
      
      if (!templateDoc.exists()) {
        console.error('❌ Template non trouvé:', templateId);
        throw new Error('Template non trouvé');
      }
      
      console.log('✅ Template trouvé, suppression en cours...');
      await deleteDoc(templateRef);
      console.log(`✅ Template ${templateId} supprimé avec succès`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du template:', error);
      throw error;
    }
  }

  /**
   * Écoute les changements des templates en temps réel
   */
  static watchTemplates(callback: (templates: ExerciseTemplate[]) => void, userId?: string) {
    if (userId) {
      // Écouter les templates publics ET les templates de l'utilisateur
      const publicQuery = query(
        collection(firestore, COLLECTIONS.EXERCISE_TEMPLATES),
        where('isPublic', '==', true)
      );
      
      const userQuery = query(
        collection(firestore, COLLECTIONS.EXERCISE_TEMPLATES),
        where('createdBy', '==', userId)
      );
      
      let publicTemplates: ExerciseTemplate[] = [];
      let userTemplates: ExerciseTemplate[] = [];
      
      const updateCallback = () => {
        const allTemplates = [...publicTemplates, ...userTemplates];
        const uniqueTemplates = allTemplates.filter((template, index, self) => 
          index === self.findIndex(t => t.id === template.id)
        );
        const sortedTemplates = uniqueTemplates.sort((a, b) => a.name.localeCompare(b.name));
        callback(sortedTemplates);
      };
      
      const unsubscribePublic = onSnapshot(publicQuery, (snapshot) => {
        publicTemplates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ExerciseTemplate));
        updateCallback();
      });
      
      const unsubscribeUser = onSnapshot(userQuery, (snapshot) => {
        userTemplates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ExerciseTemplate));
        updateCallback();
      });
      
      // Retourner une fonction pour se désabonner des deux listeners
      return () => {
        unsubscribePublic();
        unsubscribeUser();
      };
    } else {
      // Fallback: seulement les templates publics
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISE_TEMPLATES),
        where('isPublic', '==', true)
      );
      
      return onSnapshot(q, (snapshot) => {
        const templates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ExerciseTemplate));
        
        const sortedTemplates = templates.sort((a, b) => a.name.localeCompare(b.name));
        callback(sortedTemplates);
      });
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
  static async startWorkoutSession(
    templateId: string, 
    userId: string, 
    template: ExerciseTemplate
  ): Promise<string | null> {
    try {
      // Créer les exercices de la session
      const exercises: ExerciseSet[] = template.exercises.map(exercise => ({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: [],
        restTime: 60, // 1 minute par défaut
        notes: ''
      }));

      const docRef = await addDoc(collection(firestore, COLLECTIONS.WORKOUT_SESSIONS), {
        workoutId: templateId,
        userId,
        startTime: serverTimestamp(),
        status: 'active',
        exercises,
        totalTime: 0,
        caloriesBurned: 0,
        notes: '',
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
   * Récupère une session par ID
   */
  static async getSessionById(sessionId: string): Promise<WorkoutSession | null> {
    try {
      const docRef = doc(firestore, COLLECTIONS.WORKOUT_SESSIONS, sessionId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as WorkoutSession;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return null;
    }
  }

  /**
   * Met à jour une session d'entraînement
   */
  static async updateWorkoutSession(
    sessionId: string, 
    updates: Partial<WorkoutSession>
  ): Promise<boolean> {
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
   * Ajoute une série complétée à un exercice
   */
  static async addCompletedSet(
    sessionId: string,
    exerciseId: string,
    setData: Omit<SetData, 'timestamp' | 'completed'>
  ): Promise<boolean> {
    try {
      const session = await this.getSessionById(sessionId);
      if (!session) return false;

      const updatedExercises = session.exercises.map(exercise => {
        if (exercise.exerciseId === exerciseId) {
          const newSet: SetData = {
            ...setData,
            setNumber: exercise.sets.length + 1,
            completed: true,
            timestamp: new Date()
          };
          return {
            ...exercise,
            sets: [...exercise.sets, newSet]
          };
        }
        return exercise;
      });

      return await this.updateWorkoutSession(sessionId, {
        exercises: updatedExercises
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la série:', error);
      return false;
    }
  }

  /**
   * Termine une session d'entraînement
   */
  static async endWorkoutSession(
    sessionId: string, 
    totalTime: number, 
    caloriesBurned?: number
  ): Promise<boolean> {
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
  static async getUserWorkoutSessions(
    userId: string, 
    limitCount: number = 20
  ): Promise<WorkoutSession[]> {
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

  /**
   * Écoute les changements d'une session en temps réel
   */
  static watchSession(sessionId: string, callback: (session: WorkoutSession | null) => void) {
    const docRef = doc(firestore, COLLECTIONS.WORKOUT_SESSIONS, sessionId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as WorkoutSession);
      } else {
        callback(null);
      }
    });
  }
}

/**
 * Service pour la progression des exercices
 */
export class ExerciseProgressService {
  /**
   * Sauvegarde la progression d'un exercice
   */
  static async saveExerciseProgress(
    userId: string,
    exerciseId: string,
    exerciseName: string,
    setData: SetData
  ): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Vérifier s'il existe déjà une progression pour aujourd'hui
      const q = query(
        collection(firestore, COLLECTIONS.EXERCISE_PROGRESS),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId),
        where('date', '==', today)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Créer une nouvelle progression
        await addDoc(collection(firestore, COLLECTIONS.EXERCISE_PROGRESS), {
          userId,
          exerciseId,
          exerciseName,
          date: today,
          bestSet: setData,
          totalVolume: setData.weight ? setData.weight * setData.reps : 0,
          personalRecord: setData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Mettre à jour la progression existante
        const progressDoc = snapshot.docs[0];
        const currentData = progressDoc.data();
        
        // Vérifier si c'est un nouveau record personnel
        const isNewRecord = !currentData.personalRecord || 
          (setData.weight && setData.weight > (currentData.personalRecord.weight || 0));
        
        await updateDoc(doc(firestore, COLLECTIONS.EXERCISE_PROGRESS, progressDoc.id), {
          bestSet: setData,
          totalVolume: (currentData.totalVolume || 0) + (setData.weight ? setData.weight * setData.reps : 0),
          personalRecord: isNewRecord ? setData : currentData.personalRecord,
          updatedAt: serverTimestamp()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la progression:', error);
      return false;
    }
  }

  /**
   * Récupère la progression d'un exercice pour un utilisateur
   */
  static async getExerciseProgress(
    userId: string, 
    exerciseId: string
  ): Promise<ExerciseProgress[]> {
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
}


