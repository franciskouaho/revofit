/**
 * Hook personnalisé pour les données de santé
 * RevoFit - Gestion des données de santé avec HealthKit et Firebase
 * 
 * Version complète avec Firebase + Version simple du tutoriel
 */

import {
  getMostRecentQuantitySample,
  isHealthDataAvailable,
  requestAuthorization,
  useHealthkitAuthorization,
} from '@kingstinct/react-native-healthkit';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Version simple du tutoriel (exportée séparément)
export const useHealthDataSimple = (date: Date = new Date()) => {
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);
  const [hasPermissions, setHasPermission] = useState(false);

  // Permissions pour HealthKit
  const permissions = [
    'HKQuantityTypeIdentifierStepCount',
    'HKQuantityTypeIdentifierFlightsClimbed',
    'HKQuantityTypeIdentifierDistanceWalkingRunning',
  ];

  // Hook pour l'autorisation
  const [authorizationStatus, requestAuth] = useHealthkitAuthorization(permissions);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    // Initialiser les autorisations
    const initializePermissions = async () => {
      try {
        const isAvailable = await isHealthDataAvailable();
        if (!isAvailable) {
          console.log('HealthKit non disponible');
          return;
        }

        await requestAuth();
        setHasPermission(true);
      } catch (error) {
        console.log('Error getting permissions:', error);
      }
    };

    initializePermissions();
  }, [requestAuth]);

  useEffect(() => {
    if (!hasPermissions || authorizationStatus !== 'authorized') {
      return;
    }

    // Récupérer les données avec la nouvelle API
    const fetchData = async () => {
      try {
        const [stepsData, flightsData, distanceData] = await Promise.allSettled([
          getMostRecentQuantitySample('HKQuantityTypeIdentifierStepCount'),
          getMostRecentQuantitySample('HKQuantityTypeIdentifierFlightsClimbed'),
          getMostRecentQuantitySample('HKQuantityTypeIdentifierDistanceWalkingRunning'),
        ]);

        if (stepsData.status === 'fulfilled') {
          console.log('Steps retrieved:', stepsData.value?.quantity);
          setSteps(Math.round(stepsData.value?.quantity || 0));
        }

        if (flightsData.status === 'fulfilled') {
          console.log('Flights retrieved:', flightsData.value?.quantity);
          setFlights(Math.round(flightsData.value?.quantity || 0));
        }

        if (distanceData.status === 'fulfilled') {
          console.log('Distance retrieved:', distanceData.value?.quantity);
          setDistance(Math.round(distanceData.value?.quantity || 0));
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    fetchData();
  }, [hasPermissions, authorizationStatus, date]);

  return { steps, flights, distance };
};

export interface HealthData {
  id: string;
  userId: string;
  date: string;
  steps: number;
  caloriesBurned: number;
  activeCalories: number;
  heartRate: {
    resting: number;
    average: number;
    max: number;
  };
  distance: number; // en mètres
  floorsClimbed: number;
  exerciseMinutes: number;
  weight: number; // en kg
  bodyFat: number; // en pourcentage
  createdAt: Date;
  updatedAt: Date;
}

export interface UseHealthDataReturn {
  // Données de santé
  healthData: HealthData | null;

  // États de chargement
  loading: boolean;

  // États d'erreur
  error: string | null;

  // Actions
  refreshHealthData: () => Promise<void>;

  // Initialisation HealthKit
  initializeHealthKit: () => Promise<boolean>;
  isHealthKitInitialized: boolean;

  // État de connexion
  isConnectedToAppleHealth: boolean;
}

/**
 * Service HealthKit pour iOS
 */
class HealthKitService {
  static async initialize(): Promise<boolean> {
    try {
      if (Platform.OS !== 'ios') {
        console.log('HealthKit non disponible sur cette plateforme');
        return false;
      }

      // Vérifier si HealthKit est disponible
      const isAvailable = await isHealthDataAvailable();
      if (!isAvailable) {
        console.log('HealthKit non disponible sur cet appareil');
        return false;
      }

      // Définir les permissions HealthKit
      const permissions = [
        'HKQuantityTypeIdentifierStepCount',
        'HKQuantityTypeIdentifierActiveEnergyBurned',
        'HKQuantityTypeIdentifierHeartRate',
        'HKQuantityTypeIdentifierDistanceWalkingRunning',
        'HKQuantityTypeIdentifierFlightsClimbed',
        'HKQuantityTypeIdentifierBodyMass',
        'HKQuantityTypeIdentifierBodyFatPercentage',
      ];

      // Demander les autorisations
      await requestAuthorization(permissions);
      console.log('✅ HealthKit initialisé avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation HealthKit:', error);
      return false;
    }
  }

  static async getTodayHealthData(): Promise<Partial<HealthData> | null> {
    try {
      if (Platform.OS !== 'ios') {
        return null;
      }

      console.log('🏥 Récupération des données HealthKit...');

      // Récupérer les données en parallèle avec la nouvelle API
      const [stepsData, caloriesData, heartRateData, distanceData, weightData] = await Promise.allSettled([
        getMostRecentQuantitySample('HKQuantityTypeIdentifierStepCount'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierActiveEnergyBurned'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierHeartRate'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierDistanceWalkingRunning'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierBodyMass'),
      ]);

      const today = new Date();
      const healthData: Partial<HealthData> = {
        date: today.toISOString().split('T')[0],
        steps: stepsData.status === 'fulfilled' ? Math.round(stepsData.value?.quantity || 0) : 0,
        caloriesBurned: caloriesData.status === 'fulfilled' ? Math.round(caloriesData.value?.quantity || 0) : 0,
        activeCalories: caloriesData.status === 'fulfilled' ? Math.round(caloriesData.value?.quantity || 0) : 0,
        heartRate: heartRateData.status === 'fulfilled' ? { 
          resting: 0, 
          average: Math.round(heartRateData.value?.quantity || 0), 
          max: Math.round(heartRateData.value?.quantity || 0) 
        } : { resting: 0, average: 0, max: 0 },
        distance: distanceData.status === 'fulfilled' ? Math.round(distanceData.value?.quantity || 0) : 0,
        floorsClimbed: 0,
        exerciseMinutes: 0,
        weight: weightData.status === 'fulfilled' ? Math.round(weightData.value?.quantity || 0) : 0,
        bodyFat: 0
      };

      console.log('✅ Données HealthKit récupérées:', healthData);
      return healthData;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données HealthKit:', error);
      return null;
    }
  }

}

export function useHealthData(): UseHealthDataReturn {
  const { user } = useAuth();
  const userId = user?.uid;

  // États des données
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHealthKitInitialized, setIsHealthKitInitialized] = useState(false);
  const [isConnectedToAppleHealth, setIsConnectedToAppleHealth] = useState(false);


  /**
   * Initialise HealthKit
   */
  const initializeHealthKit = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🏥 Initialisation de HealthKit...');
      const success = await HealthKitService.initialize();
      setIsHealthKitInitialized(success);
      setIsConnectedToAppleHealth(success);

      if (success) {
        console.log('✅ HealthKit connecté avec succès');
      } else {
        console.log('❌ Échec de connexion à HealthKit');
      }

      return success;
    } catch (err) {
      console.error('❌ Erreur lors de l\'initialisation HealthKit:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    }
  }, []);

  /**
   * Récupère les données de santé
   */
  const refreshHealthData = useCallback(async () => {
    if (!userId) {
      console.log('❌ Utilisateur non connecté');
      return;
    }

    if (!isHealthKitInitialized) {
      console.log('❌ HealthKit non initialisé');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Récupération des données de santé...');
      const data = await HealthKitService.getTodayHealthData();

      if (data) {
        const fullHealthData: HealthData = {
          id: `${userId}-${data.date}`,
          userId,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        } as HealthData;

        setHealthData(fullHealthData);
        console.log('✅ Données de santé mises à jour');
      } else {
        console.log('❌ Aucune donnée de santé récupérée');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la récupération des données:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, isHealthKitInitialized]);

  // Initialiser HealthKit au montage
  useEffect(() => {
    if (Platform.OS === 'ios') {
      initializeHealthKit();
    }
  }, [initializeHealthKit]);

  // Rafraîchir les données quand HealthKit est initialisé
  useEffect(() => {
    if (isHealthKitInitialized && userId) {
      refreshHealthData();
    }
  }, [isHealthKitInitialized, userId, refreshHealthData]);

  return {
    healthData,
    loading,
    error,
    refreshHealthData,
    initializeHealthKit,
    isHealthKitInitialized,
    isConnectedToAppleHealth
  };
}

// Le hook simple est déjà exporté plus haut dans le fichier
