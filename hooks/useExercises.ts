/**
 * Hook personnalisé pour gérer les exercices depuis Firebase
 * Utilisé dans la page explore.tsx
 */

import { useCallback, useEffect, useState } from 'react';
import { ExerciseService } from '../services/firebase/exercises';
import { Exercise, ExerciseError, ExerciseFilters } from '../types/exercise';


interface UseExercisesReturn {
  exercises: Exercise[];
  loading: boolean;
  error: ExerciseError | null;
  refetch: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredExercises: Exercise[];
  filters: ExerciseFilters;
  setFilters: (filters: ExerciseFilters) => void;
}

export const useExercises = (): UseExercisesReturn => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ExerciseError | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ExerciseFilters>({});

  // Fonction pour récupérer les exercices
  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ExerciseService.getAllExercises(filters);
      
      if (response.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setExercises(data);
      } else {
        setExercises([]);
        setError({ 
          code: 'API_ERROR',
          message: "Erreur lors de la récupération des exercices." 
        });
      }
    } catch (err) {
      console.error("💥 Erreur lors de la récupération des exercices:", err);
      setError({ 
        code: 'NETWORK_ERROR',
        message: "Erreur de connexion." 
      });
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fonction pour refetch les données
  const refetch = useCallback(async () => {
    await fetchExercises();
  }, [fetchExercises]);

  // Filtrage des exercices basé sur la recherche
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscleGroups.some(group => group.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Chargement initial
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return {
    exercises,
    loading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    filteredExercises,
    filters,
    setFilters
  };
};
