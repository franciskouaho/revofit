/**
 * Types TypeScript pour les données d'exercices et groupes musculaires
 * Utilisés dans Firebase et dans l'application RevoFit
 */

export interface MuscleGroup {
  id: string;
  name: string;
  nameEn: string;
  category: 'primary' | 'secondary';
  imageUrl: string;
  videoUrl?: string;
  description: string;
  exercises: string[];
  createdAt: any;
  updatedAt: any;
}

export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  imageUrl?: string;
  videoUrl?: string;
  createdAt: any;
  updatedAt: any;
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  exercises: Exercise[];
  duration: number; // en minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  imageUrl?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  userId: string;
  startTime: any;
  endTime?: any;
  status: 'active' | 'completed' | 'paused';
  exercises: ExerciseSet[];
  totalTime: number; // en minutes
  caloriesBurned?: number;
  notes?: string;
  createdAt: any;
  updatedAt: any;
}

export interface ExerciseSet {
  exerciseId: string;
  exerciseName: string;
  sets: SetData[];
  restTime: number; // en secondes
  notes?: string;
}

export interface SetData {
  setNumber: number;
  reps: number;
  weight?: number; // en kg
  duration?: number; // en secondes pour les exercices cardio
  restTime?: number; // en secondes
  completed: boolean;
  timestamp: any;
}

export interface ExerciseProgress {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  date: string; // YYYY-MM-DD
  bestSet: SetData;
  totalVolume: number; // poids total soulevé
  personalRecord?: SetData;
  createdAt: any;
  updatedAt: any;
}

// Types pour les filtres et recherches
export interface ExerciseFilters {
  muscleGroups?: string[];
  equipment?: string[];
  difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
  searchQuery?: string;
}

export interface MuscleGroupFilters {
  category?: ('primary' | 'secondary')[];
  searchQuery?: string;
}

// Types pour les statistiques
export interface ExerciseStats {
  exerciseId: string;
  exerciseName: string;
  totalSessions: number;
  totalVolume: number;
  personalRecord: SetData;
  averageWeight: number;
  lastPerformed: any;
  improvementRate: number; // pourcentage d'amélioration
}

export interface MuscleGroupStats {
  muscleGroupId: string;
  muscleGroupName: string;
  totalExercises: number;
  totalSessions: number;
  totalVolume: number;
  lastWorked: any;
  strengthGain: number; // pourcentage d'amélioration
}

// Types pour les recommandations
export interface ExerciseRecommendation {
  exerciseId: string;
  exerciseName: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkoutRecommendation {
  templateId: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  exercises: Exercise[];
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

// Types pour les collections Firebase
export interface FirebaseCollections {
  muscleGroups: MuscleGroup;
  exercises: Exercise;
  exerciseTemplates: ExerciseTemplate;
  workoutSessions: WorkoutSession;
  exerciseProgress: ExerciseProgress;
  userFavorites: {
    userId: string;
    exerciseIds: string[];
    muscleGroupIds: string[];
    createdAt: any;
    updatedAt: any;
  };
  userExerciseHistory: {
    userId: string;
    exerciseId: string;
    sessions: WorkoutSession[];
    totalSessions: number;
    lastPerformed: any;
    createdAt: any;
    updatedAt: any;
  };
}

// Types pour les erreurs
export interface ExerciseError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

// Types pour les réponses API
export interface ExerciseResponse {
  success: boolean;
  data?: Exercise | Exercise[];
  error?: ExerciseError;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MuscleGroupResponse {
  success: boolean;
  data?: MuscleGroup | MuscleGroup[];
  error?: ExerciseError;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Types pour les hooks personnalisés
export interface UseExercisesReturn {
  exercises: Exercise[];
  loading: boolean;
  error: ExerciseError | null;
  refetch: () => Promise<void>;
  filters: ExerciseFilters;
  setFilters: (filters: ExerciseFilters) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface UseMuscleGroupsReturn {
  muscleGroups: MuscleGroup[];
  loading: boolean;
  error: ExerciseError | null;
  refetch: () => Promise<void>;
  filters: MuscleGroupFilters;
  setFilters: (filters: MuscleGroupFilters) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface UseExerciseProgressReturn {
  progress: ExerciseProgress[];
  loading: boolean;
  error: ExerciseError | null;
  refetch: () => Promise<void>;
  addProgress: (progress: Omit<ExerciseProgress, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProgress: (id: string, updates: Partial<ExerciseProgress>) => Promise<void>;
  deleteProgress: (id: string) => Promise<void>;
}

// Types pour les constantes
export const EXERCISE_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;
export const MUSCLE_GROUP_CATEGORIES = ['primary', 'secondary'] as const;
export const WORKOUT_STATUSES = ['active', 'completed', 'paused'] as const;

// Types pour les équipements courants
export const COMMON_EQUIPMENT = [
  'aucun',
  'barre',
  'haltères',
  'banc',
  'banc incliné',
  'banc décliné',
  'barre de traction',
  'poulie',
  'machine',
  'corde',
  'kettlebell',
  'vélo',
  'rameur',
  'elliptique',
  'tapis de course',
  'step',
  'ballon de gym',
  'élastique',
  'disques',
  'équipement variable'
] as const;

export type CommonEquipment = typeof COMMON_EQUIPMENT[number];

// Types pour les groupes musculaires principaux
export const PRIMARY_MUSCLE_GROUPS = [
  'chest_global',
  'back_width',
  'back_thickness',
  'shoulders_front',
  'shoulders_lateral',
  'shoulders_rear',
  'biceps_global',
  'triceps_lateral',
  'quadriceps',
  'hamstrings',
  'glutes',
  'abs_rectus'
] as const;

export type PrimaryMuscleGroup = typeof PRIMARY_MUSCLE_GROUPS[number];
