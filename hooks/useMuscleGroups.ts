/**
 * Hook personnalisé pour gérer les groupes musculaires depuis Firebase
 * Utilisé dans la page explore.tsx
 */

import { useCallback, useEffect, useState } from 'react';
import { MuscleGroupService } from '../services/firebase/exercises';
import { ExerciseError, MuscleGroup } from '../types/exercise';


interface UseMuscleGroupsReturn {
  muscleGroups: MuscleGroup[];
  loading: boolean;
  error: ExerciseError | null;
  refetch: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMuscleGroups: MuscleGroup[];
}

export const useMuscleGroups = (): UseMuscleGroupsReturn => {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ExerciseError | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fonction pour récupérer les groupes musculaires
  const fetchMuscleGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await MuscleGroupService.getAllMuscleGroups();
      
      if (response.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        if (data.length === 0) {
          setMuscleGroups([]);
          setError({ 
            code: 'NO_DATA',
            message: "Aucun groupe musculaire trouvé dans Firebase." 
          });
        } else {
          setMuscleGroups(data);
        }
      } else {
        setMuscleGroups([]);
        setError({ 
          code: 'API_ERROR',
          message: "Erreur lors de la récupération des groupes musculaires." 
        });
      }
    } catch (err) {
      console.error("Failed to fetch muscle groups:", err);
      setError({ 
        code: 'NETWORK_ERROR',
        message: "Erreur de connexion." 
      });
      setMuscleGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour refetch les données
  const refetch = useCallback(async () => {
    await fetchMuscleGroups();
  }, [fetchMuscleGroups]);

  // Filtrage des groupes musculaires basé sur la recherche
  const filteredMuscleGroups = muscleGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chargement initial
  useEffect(() => {
    fetchMuscleGroups();
  }, [fetchMuscleGroups]);

  return {
    muscleGroups,
    loading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    filteredMuscleGroups
  };
};
