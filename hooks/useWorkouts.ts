/**
 * Hook personnalisé pour gérer les workouts et sessions d'entraînement
 * Utilisé dans les pages workout
 */

import { useCallback, useEffect, useState } from 'react';
import {
    ExerciseProgressService,
    WorkoutSessionService,
    WorkoutTemplateService
} from '../services/firebase/workouts';
import {
    ExerciseProgress,
    ExerciseTemplate,
    WorkoutSession
} from '../types/exercise';

interface UseWorkoutsReturn {
  templates: ExerciseTemplate[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  startWorkout: (templateId: string, userId: string) => Promise<string | null>;
  getTemplateById: (id: string) => Promise<ExerciseTemplate | null>;
  getTemplatesByMuscleGroup: (muscleGroup: string) => Promise<ExerciseTemplate[]>;
  getTemplatesByDifficulty: (difficulty: 'beginner' | 'intermediate' | 'advanced') => Promise<ExerciseTemplate[]>;
  deleteTemplate: (templateId: string) => Promise<boolean>;
}

interface UseWorkoutSessionReturn {
  session: WorkoutSession | null;
  loading: boolean;
  error: string | null;
  updateSession: (updates: Partial<WorkoutSession>) => Promise<boolean>;
  addCompletedSet: (exerciseId: string, setData: Omit<SetData, 'timestamp' | 'completed'>) => Promise<boolean>;
  endSession: (totalTime: number, caloriesBurned?: number) => Promise<boolean>;
  saveProgress: (exerciseId: string, exerciseName: string, setData: SetData) => Promise<boolean>;
}

interface UseExerciseProgressReturn {
  progress: ExerciseProgress[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  saveProgress: (exerciseId: string, exerciseName: string, setData: SetData) => Promise<boolean>;
}

export const useWorkouts = (): UseWorkoutsReturn => {
  const [templates, setTemplates] = useState<ExerciseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les templates
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await WorkoutTemplateService.getAllTemplates();
      setTemplates(data);
    } catch (err) {
      console.error("💥 Erreur lors de la récupération des templates:", err);
      setError("Erreur lors de la récupération des workouts");
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour refetch les données
  const refetch = useCallback(async () => {
    await fetchTemplates();
  }, [fetchTemplates]);

  // Fonction pour démarrer un workout
  const startWorkout = useCallback(async (templateId: string, userId: string): Promise<string | null> => {
    try {
      const template = await WorkoutTemplateService.getTemplateById(templateId);
      if (!template) {
        setError("Template non trouvé");
        return null;
      }
      
      return await WorkoutSessionService.startWorkoutSession(templateId, userId, template);
    } catch (err) {
      console.error("💥 Erreur lors du démarrage du workout:", err);
      setError("Erreur lors du démarrage du workout");
      return null;
    }
  }, []);

  // Fonction pour récupérer un template par ID
  const getTemplateById = useCallback(async (id: string): Promise<ExerciseTemplate | null> => {
    try {
      return await WorkoutTemplateService.getTemplateById(id);
    } catch (err) {
      console.error("💥 Erreur lors de la récupération du template:", err);
      return null;
    }
  }, []);

  // Fonction pour récupérer les templates par groupe musculaire
  const getTemplatesByMuscleGroup = useCallback(async (muscleGroup: string): Promise<ExerciseTemplate[]> => {
    try {
      return await WorkoutTemplateService.getTemplatesByMuscleGroup(muscleGroup);
    } catch (err) {
      console.error("💥 Erreur lors de la récupération des templates par groupe musculaire:", err);
      return [];
    }
  }, []);

  // Fonction pour récupérer les templates par difficulté
  const getTemplatesByDifficulty = useCallback(async (difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<ExerciseTemplate[]> => {
    try {
      return await WorkoutTemplateService.getTemplatesByDifficulty(difficulty);
    } catch (err) {
      console.error("💥 Erreur lors de la récupération des templates par difficulté:", err);
      return [];
    }
  }, []);

  // Fonction pour supprimer un template
  const deleteTemplate = useCallback(async (templateId: string): Promise<boolean> => {
    try {
      console.log("🔍 Tentative de suppression du template:", templateId);
      
      // Vérifier l'authentification (optionnel pour le développement)
      // const user = auth.currentUser;
      // if (!user) {
      //   console.error("❌ Utilisateur non authentifié");
      //   setError("Vous devez être connecté pour supprimer un template");
      //   return false;
      // }
      
      const success = await WorkoutTemplateService.deleteTemplate(templateId);
      if (success) {
        console.log("✅ Template supprimé avec succès, rafraîchissement de la liste...");
        // Rafraîchir la liste des templates
        await fetchTemplates();
      }
      return success;
    } catch (err) {
      console.error("💥 Erreur lors de la suppression du template:", err);
      setError("Erreur lors de la suppression du template");
      return false;
    }
  }, [fetchTemplates]);

  // Chargement initial
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    refetch,
    startWorkout,
    getTemplateById,
    getTemplatesByMuscleGroup,
    getTemplatesByDifficulty,
    deleteTemplate
  };
};

export const useWorkoutSession = (sessionId: string | null): UseWorkoutSessionReturn => {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer la session
  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setSession(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await WorkoutSessionService.getSessionById(sessionId);
      setSession(data);
    } catch (err) {
      console.error("💥 Erreur lors de la récupération de la session:", err);
      setError("Erreur lors de la récupération de la session");
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Fonction pour mettre à jour la session
  const updateSession = useCallback(async (updates: Partial<WorkoutSession>): Promise<boolean> => {
    if (!sessionId) return false;

    try {
      const success = await WorkoutSessionService.updateWorkoutSession(sessionId, updates);
      if (success) {
        setSession(prev => prev ? { ...prev, ...updates } : null);
      }
      return success;
    } catch (err) {
      console.error("💥 Erreur lors de la mise à jour de la session:", err);
      setError("Erreur lors de la mise à jour de la session");
      return false;
    }
  }, [sessionId]);

  // Fonction pour ajouter une série complétée
  const addCompletedSet = useCallback(async (
    exerciseId: string, 
    setData: Omit<SetData, 'timestamp' | 'completed'>
  ): Promise<boolean> => {
    if (!sessionId) return false;

    try {
      const success = await WorkoutSessionService.addCompletedSet(sessionId, exerciseId, setData);
      if (success) {
        // Rafraîchir la session
        await fetchSession();
      }
      return success;
    } catch (err) {
      console.error("💥 Erreur lors de l'ajout de la série:", err);
      setError("Erreur lors de l'ajout de la série");
      return false;
    }
  }, [sessionId, fetchSession]);

  // Fonction pour terminer la session
  const endSession = useCallback(async (totalTime: number, caloriesBurned?: number): Promise<boolean> => {
    if (!sessionId) return false;

    try {
      const success = await WorkoutSessionService.endWorkoutSession(sessionId, totalTime, caloriesBurned);
      if (success) {
        setSession(prev => prev ? { ...prev, status: 'completed', endTime: new Date(), totalTime, caloriesBurned } : null);
      }
      return success;
    } catch (err) {
      console.error("💥 Erreur lors de la fin de la session:", err);
      setError("Erreur lors de la fin de la session");
      return false;
    }
  }, [sessionId]);

  // Fonction pour sauvegarder la progression
  const saveProgress = useCallback(async (
    exerciseId: string, 
    exerciseName: string, 
    setData: SetData
  ): Promise<boolean> => {
    if (!session?.userId) return false;

    try {
      return await ExerciseProgressService.saveExerciseProgress(
        session.userId,
        exerciseId,
        exerciseName,
        setData
      );
    } catch (err) {
      console.error("💥 Erreur lors de la sauvegarde de la progression:", err);
      setError("Erreur lors de la sauvegarde de la progression");
      return false;
    }
  }, [session?.userId]);

  // Chargement initial
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    loading,
    error,
    updateSession,
    addCompletedSet,
    endSession,
    saveProgress
  };
};

export const useExerciseProgress = (userId: string, exerciseId: string): UseExerciseProgressReturn => {
  const [progress, setProgress] = useState<ExerciseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer la progression
  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await ExerciseProgressService.getExerciseProgress(userId, exerciseId);
      setProgress(data);
    } catch (err) {
      console.error("💥 Erreur lors de la récupération de la progression:", err);
      setError("Erreur lors de la récupération de la progression");
      setProgress([]);
    } finally {
      setLoading(false);
    }
  }, [userId, exerciseId]);

  // Fonction pour refetch les données
  const refetch = useCallback(async () => {
    await fetchProgress();
  }, [fetchProgress]);

  // Fonction pour sauvegarder la progression
  const saveProgress = useCallback(async (
    exerciseId: string, 
    exerciseName: string, 
    setData: SetData
  ): Promise<boolean> => {
    try {
      const success = await ExerciseProgressService.saveExerciseProgress(
        userId,
        exerciseId,
        exerciseName,
        setData
      );
      if (success) {
        await fetchProgress(); // Rafraîchir les données
      }
      return success;
    } catch (err) {
      console.error("💥 Erreur lors de la sauvegarde de la progression:", err);
      setError("Erreur lors de la sauvegarde de la progression");
      return false;
    }
  }, [userId, fetchProgress]);

  // Chargement initial
  useEffect(() => {
    if (userId && exerciseId) {
      fetchProgress();
    }
  }, [fetchProgress, userId, exerciseId]);

  return {
    progress,
    loading,
    error,
    refetch,
    saveProgress
  };
};
