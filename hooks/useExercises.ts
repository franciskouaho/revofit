/**
 * Hook personnalisé pour gérer les exercices depuis Firebase
 * Utilisé dans la page explore.tsx
 */

import { useCallback, useEffect, useState } from 'react';
import { ExerciseService } from '../services/firebase/exercises';
import { ExerciseCacheService } from '../services/storage/exerciseCache';
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
  isFromCache: boolean;
}

export const useExercises = (): UseExercisesReturn => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ExerciseError | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ExerciseFilters>({});
  const [isFromCache, setIsFromCache] = useState(false);

  // Fonction pour récupérer les exercices avec cache
  const fetchExercises = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      setIsFromCache(false);

      // Essayer d'abord le cache si pas de refresh forcé
      if (!forceRefresh) {
        const cachedExercises = await ExerciseCacheService.getCachedExercises();
        if (cachedExercises && cachedExercises.length > 0) {
          console.log('📱 Chargement depuis le cache:', cachedExercises.length);
          setExercises(cachedExercises);
          setIsFromCache(true);
          setLoading(false);
          
          // Mettre à jour en arrière-plan
          fetchFromAPI();
          return;
        }
      }

      // Charger depuis l'API
      await fetchFromAPI();
    } catch (err) {
      console.error("💥 Erreur lors de la récupération des exercices:", err);
      setError({ 
        code: 'NETWORK_ERROR',
        message: "Erreur de connexion." 
      });
      setExercises([]);
      setLoading(false);
    }
  }, [filters]);

  // Fonction pour charger depuis l'API
  const fetchFromAPI = useCallback(async () => {
    try {
      const response = await ExerciseService.getAllExercises(filters);
      
      if (response.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setExercises(data);
        setIsFromCache(false);
        
        // Sauvegarder dans le cache
        await ExerciseCacheService.saveExercises(data);
        console.log('💾 Exercices sauvegardés dans le cache');
      } else {
        setExercises([]);
        setError({ 
          code: 'API_ERROR',
          message: "Erreur lors de la récupération des exercices." 
        });
      }
    } catch (err) {
      console.error("💥 Erreur API:", err);
      setError({ 
        code: 'API_ERROR',
        message: "Erreur lors de la récupération des exercices." 
      });
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fonction pour refetch les données
  const refetch = useCallback(async () => {
    await fetchExercises(true); // Force refresh
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
    setFilters,
    isFromCache
  };
};
