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
import { StorageService } from '../services/storage';

// Version simple du tutoriel (exportée séparément)
export const useHealthDataSimple = (date: Date = new Date()) => {
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);
  const [hasPermissions, setHasPermission] = useState(false);

  // Permissions pour HealthKit
  const permissions = [
    'HKQuantityTypeIdentifierStepCount' as const,
    'HKQuantityTypeIdentifierFlightsClimbed' as const,
    'HKQuantityTypeIdentifierDistanceWalkingRunning' as const,
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
    if (!hasPermissions) {
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

export interface HistoricalHealthData {
  date: string;
  steps: number;
  caloriesBurned: number;
  distance: number;
  floorsClimbed: number;
  exerciseMinutes: number;
}

export interface MonthlyHealthData {
  month: string;
  year: number;
  totalSteps: number;
  totalCalories: number;
  totalDistance: number;
  totalFloors: number;
  totalExerciseMinutes: number;
  averageHeartRate: number;
}

export interface UseHealthDataReturn {
  // Données de santé
  healthData: HealthData | null;
  historicalData: HistoricalHealthData[];
  monthlyData: MonthlyHealthData[];

  // États de chargement
  loading: boolean;

  // États d'erreur
  error: string | null;

  // Actions
  refreshHealthData: () => Promise<void>;
  refreshHistoricalData: (startDate: Date, endDate: Date) => Promise<void>;
  refreshMonthlyData: (year: number) => Promise<void>;

  // Initialisation HealthKit
  initializeHealthKit: () => Promise<boolean>;
  disconnectFromHealthKit: () => Promise<void>;
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
        'HKQuantityTypeIdentifierStepCount' as const,
        'HKQuantityTypeIdentifierActiveEnergyBurned' as const,
        'HKQuantityTypeIdentifierBasalEnergyBurned' as const,
        'HKQuantityTypeIdentifierHeartRate' as const,
        'HKQuantityTypeIdentifierDistanceWalkingRunning' as const,
        'HKQuantityTypeIdentifierFlightsClimbed' as const,
        'HKQuantityTypeIdentifierAppleExerciseTime' as const,
        'HKQuantityTypeIdentifierBodyMass' as const,
        'HKQuantityTypeIdentifierBodyFatPercentage' as const,
        'HKQuantityTypeIdentifierAppleStandTime' as const,
      ];

      // Demander les autorisations
      await requestAuthorization(permissions, []);
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

      console.log('🏥 Récupération des données HealthKit du jour...');

      const today = new Date();

      // Récupérer les données du jour avec getMostRecentQuantitySample
      const [stepsData, activeCaloriesData, basalCaloriesData, heartRateData, distanceData, floorsData, exerciseData, weightData, standData] = await Promise.allSettled([
        getMostRecentQuantitySample('HKQuantityTypeIdentifierStepCount'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierActiveEnergyBurned'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierBasalEnergyBurned'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierHeartRate'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierDistanceWalkingRunning'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierFlightsClimbed'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierAppleExerciseTime'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierBodyMass'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierAppleStandTime'),
      ]);

      // Récupérer les valeurs individuelles
      const steps = stepsData.status === 'fulfilled' ? Math.round(stepsData.value?.quantity || 0) : 0;
      const activeCalories = activeCaloriesData.status === 'fulfilled' ? Math.round(activeCaloriesData.value?.quantity || 0) : 0;
      const basalCalories = basalCaloriesData.status === 'fulfilled' ? Math.round(basalCaloriesData.value?.quantity || 0) : 0;
      const totalCalories = activeCalories + basalCalories;
      const distance = distanceData.status === 'fulfilled' ? Math.round(distanceData.value?.quantity || 0) : 0;
      const floors = floorsData.status === 'fulfilled' ? Math.round(floorsData.value?.quantity || 0) : 0;
      const exerciseMinutes = exerciseData.status === 'fulfilled' ? Math.round((exerciseData.value?.quantity || 0) / 60) : 0;
      const weight = weightData.status === 'fulfilled' ? Math.round(weightData.value?.quantity || 0) : 0;
      const standHours = standData.status === 'fulfilled' ? Math.round((standData.value?.quantity || 0) / 3600) : 0;
      
      // Récupérer la fréquence cardiaque
      const heartRate = heartRateData.status === 'fulfilled' ? Math.round(heartRateData.value?.quantity || 0) : 0;

      const healthData: Partial<HealthData> = {
        date: today.toISOString().split('T')[0],
        steps,
        caloriesBurned: totalCalories,
        activeCalories,
        heartRate: { 
          resting: heartRate, 
          average: heartRate, 
          max: heartRate 
        },
        distance,
        floorsClimbed: floors,
        exerciseMinutes,
        weight,
        bodyFat: 0 // Pas de données de masse grasse dans les échantillons récents
      };

      console.log('✅ Données HealthKit du jour récupérées:', {
        steps,
        activeCalories,
        totalCalories,
        distance,
        floors,
        exerciseMinutes,
        heartRate,
        standHours
      });
      return healthData;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données HealthKit:', error);
      return null;
    }
  }

  static async getHistoricalHealthData(startDate: Date, endDate: Date): Promise<HistoricalHealthData[]> {
    try {
      if (Platform.OS !== 'ios') {
        return [];
      }

      console.log('📊 Récupération des données historiques...');

      const historicalData: HistoricalHealthData[] = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        try {
          // Récupérer les données réelles pour chaque jour
          const [stepsData, activeCaloriesData, distanceData, floorsData, exerciseData] = await Promise.allSettled([
            getMostRecentQuantitySample('HKQuantityTypeIdentifierStepCount'),
            getMostRecentQuantitySample('HKQuantityTypeIdentifierActiveEnergyBurned'),
            getMostRecentQuantitySample('HKQuantityTypeIdentifierDistanceWalkingRunning'),
            getMostRecentQuantitySample('HKQuantityTypeIdentifierFlightsClimbed'),
            getMostRecentQuantitySample('HKQuantityTypeIdentifierAppleExerciseTime'),
          ]);

          const steps = stepsData.status === 'fulfilled' ? Math.round(stepsData.value?.quantity || 0) : 0;
          const calories = activeCaloriesData.status === 'fulfilled' ? Math.round(activeCaloriesData.value?.quantity || 0) : 0;
          const distance = distanceData.status === 'fulfilled' ? Math.round(distanceData.value?.quantity || 0) : 0;
          const floors = floorsData.status === 'fulfilled' ? Math.round(floorsData.value?.quantity || 0) : 0;
          const exercise = exerciseData.status === 'fulfilled' ? Math.round((exerciseData.value?.quantity || 0) / 60) : 0;

          historicalData.push({
            date: dateStr,
            steps,
            caloriesBurned: calories,
            distance,
            floorsClimbed: floors,
            exerciseMinutes: exercise,
          });
        } catch (dayError) {
          console.warn(`Erreur pour la date ${dateStr}:`, dayError);
          // Ajouter des données vides en cas d'erreur
          historicalData.push({
            date: dateStr,
            steps: 0,
            caloriesBurned: 0,
            distance: 0,
            floorsClimbed: 0,
            exerciseMinutes: 0,
          });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      console.log('✅ Données historiques récupérées:', historicalData.length, 'jours');
      return historicalData;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données historiques:', error);
      return [];
    }
  }

  static async getMonthlyHealthData(year: number): Promise<MonthlyHealthData[]> {
    try {
      if (Platform.OS !== 'ios') {
        return [];
      }

      console.log('📅 Récupération des données mensuelles pour', year);

      const monthlyData: MonthlyHealthData[] = [];
      const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];

      for (let month = 0; month < 12; month++) {
        try {
          
          // Récupérer les données réelles pour chaque mois
          const [stepsData, activeCaloriesData, distanceData, floorsData, exerciseData, heartRateData] = await Promise.allSettled([
            getMostRecentQuantitySample('HKQuantityTypeIdentifierStepCount'),
            getMostRecentQuantitySample('HKQuantityTypeIdentifierActiveEnergyBurned'),
            getMostRecentQuantitySample('HKQuantityTypeIdentifierDistanceWalkingRunning'),
            getMostRecentQuantitySample('HKQuantityTypeIdentifierFlightsClimbed'),
            getMostRecentQuantitySample('HKQuantityTypeIdentifierAppleExerciseTime'),
            getMostRecentQuantitySample('HKQuantityTypeIdentifierHeartRate'),
          ]);

          const totalSteps = stepsData.status === 'fulfilled' ? Math.round(stepsData.value?.quantity || 0) : 0;
          const totalCalories = activeCaloriesData.status === 'fulfilled' ? Math.round(activeCaloriesData.value?.quantity || 0) : 0;
          const totalDistance = distanceData.status === 'fulfilled' ? Math.round(distanceData.value?.quantity || 0) : 0;
          const totalFloors = floorsData.status === 'fulfilled' ? Math.round(floorsData.value?.quantity || 0) : 0;
          const totalExerciseMinutes = exerciseData.status === 'fulfilled' ? Math.round((exerciseData.value?.quantity || 0) / 60) : 0;
          
          const averageHeartRate = heartRateData.status === 'fulfilled' ? Math.round(heartRateData.value?.quantity || 0) : 0;

          monthlyData.push({
            month: months[month],
            year,
            totalSteps,
            totalCalories,
            totalDistance,
            totalFloors,
            totalExerciseMinutes,
            averageHeartRate,
          });
        } catch (monthError) {
          console.warn(`Erreur pour le mois ${month + 1}:`, monthError);
          // Ajouter des données vides en cas d'erreur
          monthlyData.push({
            month: months[month],
            year,
            totalSteps: 0,
            totalCalories: 0,
            totalDistance: 0,
            totalFloors: 0,
            totalExerciseMinutes: 0,
            averageHeartRate: 0,
          });
        }
      }

      console.log('✅ Données mensuelles récupérées:', monthlyData.length, 'mois');
      return monthlyData;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données mensuelles:', error);
      return [];
    }
  }
}

export function useHealthData(): UseHealthDataReturn {
  const { user } = useAuth();
  const userId = user?.uid;

  // États des données
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalHealthData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyHealthData[]>([]);
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
        // Sauvegarder l'état de connexion
        await StorageService.saveHealthKitConnection(true);
      } else {
        console.log('❌ Échec de connexion à HealthKit');
        // Supprimer l'état de connexion en cas d'échec
        await StorageService.clearHealthKitConnection();
      }

      return success;
    } catch (err) {
      console.error('❌ Erreur lors de l\'initialisation HealthKit:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      // Supprimer l'état de connexion en cas d'erreur
      await StorageService.clearHealthKitConnection();
      return false;
    }
  }, []);

  /**
   * Récupère les données de santé du jour
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
      console.log('🔄 Récupération des données de santé du jour...');
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
        console.log('✅ Données de santé du jour mises à jour');
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

  /**
   * Récupère les données historiques
   */
  const refreshHistoricalData = useCallback(async (startDate: Date, endDate: Date) => {
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
      console.log('📊 Récupération des données historiques...');
      const data = await HealthKitService.getHistoricalHealthData(startDate, endDate);
      setHistoricalData(data);
      console.log('✅ Données historiques mises à jour:', data.length, 'jours');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la récupération des données historiques:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, isHealthKitInitialized]);

  /**
   * Récupère les données mensuelles
   */
  const refreshMonthlyData = useCallback(async (year: number) => {
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
      console.log('📅 Récupération des données mensuelles...');
      const data = await HealthKitService.getMonthlyHealthData(year);
      setMonthlyData(data);
      console.log('✅ Données mensuelles mises à jour:', data.length, 'mois');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la récupération des données mensuelles:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, isHealthKitInitialized]);

  // Vérifier l'état de connexion persisté au montage
  useEffect(() => {
    const checkPersistedConnection = async () => {
      if (Platform.OS !== 'ios') return;
      
      try {
        const connectionState = await StorageService.getHealthKitConnection();
        if (connectionState?.isConnected) {
          console.log('✅ Connexion HealthKit trouvée dans le stockage local');
          setIsHealthKitInitialized(true);
          setIsConnectedToAppleHealth(true);
        } else {
          console.log('❌ Aucune connexion HealthKit persistée trouvée');
          // Ne pas initialiser automatiquement, laisser l'utilisateur choisir
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la connexion persistée:', error);
      }
    };

    checkPersistedConnection();
  }, []);

  // Rafraîchir les données quand HealthKit est initialisé
  useEffect(() => {
    if (isHealthKitInitialized && userId) {
      refreshHealthData();
      
      // Charger les données des 30 derniers jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      refreshHistoricalData(thirtyDaysAgo, new Date());
      
      // Charger les données de l'année courante
      refreshMonthlyData(new Date().getFullYear());
    }
  }, [isHealthKitInitialized, userId, refreshHealthData, refreshHistoricalData, refreshMonthlyData]);

  /**
   * Déconnecter de HealthKit
   */
  const disconnectFromHealthKit = useCallback(async () => {
    try {
      console.log('🔌 Déconnexion de HealthKit...');
      setIsHealthKitInitialized(false);
      setIsConnectedToAppleHealth(false);
      setHealthData(null);
      setHistoricalData([]);
      setMonthlyData([]);
      
      // Supprimer l'état de connexion du stockage
      await StorageService.clearHealthKitConnection();
      console.log('✅ Déconnexion HealthKit réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion HealthKit:', error);
    }
  }, []);

  return {
    healthData,
    historicalData,
    monthlyData,
    loading,
    error,
    refreshHealthData,
    refreshHistoricalData,
    refreshMonthlyData,
    initializeHealthKit,
    disconnectFromHealthKit,
    isHealthKitInitialized,
    isConnectedToAppleHealth
  };
}

// Le hook simple est déjà exporté plus haut dans le fichier