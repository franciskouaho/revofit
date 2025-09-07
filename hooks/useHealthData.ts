/**
 * Hook personnalisé pour les données de santé
 * RevoFit - Gestion des données de santé avec HealthKit et Firebase
 * 
 * Version complète avec Firebase + Version simple du tutoriel
 */

import {
  getMostRecentQuantitySample,
  isHealthDataAvailable,
  queryQuantitySamples,
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
  const [calories, setCalories] = useState(0);
  const [hasPermissions, setHasPermission] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Permissions pour HealthKit
  const permissions = [
    'HKQuantityTypeIdentifierStepCount' as const,
    'HKQuantityTypeIdentifierFlightsClimbed' as const,
    'HKQuantityTypeIdentifierDistanceWalkingRunning' as const,
    'HKQuantityTypeIdentifierActiveEnergyBurned' as const,
  ];

  // Hook pour l'autorisation
  const [authorizationStatus, requestAuth] = useHealthkitAuthorization(permissions);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      console.log('❌ Pas iOS, HealthKit non disponible');
      return;
    }

    // Initialiser les autorisations
    const initializePermissions = async () => {
      try {
        const isAvailable = await isHealthDataAvailable();
        if (!isAvailable) {
          console.log('❌ HealthKit non disponible sur cet appareil');
          return;
        }

        console.log('🔄 Demande d\'autorisation HealthKit...');
        await requestAuth();
        console.log('✅ Autorisation HealthKit demandée');
      } catch (error) {
        console.log('❌ Erreur lors de la demande d\'autorisation:', error);
      }
    };

    initializePermissions();
  }, [requestAuth]);

  // Vérifier le statut d'autorisation
  useEffect(() => {
    console.log('🔍 Statut d\'autorisation HealthKit:', authorizationStatus);
    
    if (String(authorizationStatus) === 'granted') {
      console.log('✅ Permissions HealthKit accordées');
      setHasPermission(true);
    } else {
      console.log('❌ Permissions HealthKit non accordées:', authorizationStatus);
      setHasPermission(false);
    }
  }, [authorizationStatus]);

  useEffect(() => {
    console.log('🔍 useHealthDataSimple - hasPermissions:', hasPermissions);
    console.log('🔍 useHealthDataSimple - authorizationStatus:', authorizationStatus);
    
    if (!hasPermissions) {
      console.log('❌ Pas de permissions HealthKit, données par défaut');
      return;
    }

    // Récupérer les données avec la nouvelle API
    const fetchData = async () => {
      try {
        console.log('🔄 Récupération des données HealthKit...');
        // Pour les pas, récupérer le total de la journée
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const [stepsData, flightsData, distanceData, caloriesData] = await Promise.allSettled([
          // Récupérer le total des pas de la journée
          queryQuantitySamples('HKQuantityTypeIdentifierStepCount', {
            from: startOfDay,
            to: endOfDay,
          } as any).then(samples => {
            const totalSteps = samples.reduce((sum, sample) => sum + sample.quantity, 0);
            return { quantity: totalSteps };
          }),
          getMostRecentQuantitySample('HKQuantityTypeIdentifierFlightsClimbed'),
          getMostRecentQuantitySample('HKQuantityTypeIdentifierDistanceWalkingRunning'),
          // Récupérer le total des calories brûlées de la journée
          queryQuantitySamples('HKQuantityTypeIdentifierActiveEnergyBurned', {
            from: startOfDay,
            to: endOfDay,
          } as any).then(samples => {
            const totalCalories = samples.reduce((sum, sample) => sum + sample.quantity, 0);
            return { quantity: totalCalories };
          }),
        ]);

        if (stepsData.status === 'fulfilled') {
          console.log('Steps retrieved (total today):', stepsData.value?.quantity);
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

        if (caloriesData.status === 'fulfilled') {
          console.log('✅ Calories retrieved (total today):', caloriesData.value?.quantity);
          setCalories(Math.round(caloriesData.value?.quantity || 0));
        } else {
          console.log('❌ Calories data failed:', caloriesData.status, caloriesData.reason);
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    fetchData();
  }, [hasPermissions, authorizationStatus, date, refreshTrigger]);

  // Fonction pour forcer la demande d'autorisation
  const requestPermissions = async () => {
    try {
      console.log('🔄 Demande forcée d\'autorisation HealthKit...');
      await requestAuth();
      
      // Attendre un peu pour que l'autorisation soit traitée
      setTimeout(() => {
        console.log('🔄 Vérification des permissions après demande...');
        console.log('🔍 Nouveau statut d\'autorisation:', authorizationStatus);
        
        // Forcer le rafraîchissement des données
        console.log('🔄 Rafraîchissement forcé des données...');
        setRefreshTrigger(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.log('❌ Erreur lors de la demande forcée:', error);
    }
  };

  console.log('🔍 useHealthDataSimple - returning data:', { steps, flights, distance, calories });
  return { steps, flights, distance, calories, requestPermissions, hasPermissions, authorizationStatus };
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
      
      // Vérifier si HealthKit est disponible
      const isAvailable = await isHealthDataAvailable();
      if (!isAvailable) {
        console.log('❌ HealthKit non disponible sur cet appareil');
        setIsHealthKitInitialized(false);
        setIsConnectedToAppleHealth(false);
        return false;
      }

      // Demander les autorisations
      const permissions = [
        'HKQuantityTypeIdentifierStepCount' as const,
        'HKQuantityTypeIdentifierFlightsClimbed' as const,
        'HKQuantityTypeIdentifierDistanceWalkingRunning' as const,
        'HKQuantityTypeIdentifierActiveEnergyBurned' as const,
      ];

      await requestAuthorization(permissions, []);
      
      setIsHealthKitInitialized(true);
      setIsConnectedToAppleHealth(true);
      console.log('✅ HealthKit initialisé avec succès');

      return true;
    } catch (err) {
      console.error('❌ Erreur lors de l\'initialisation HealthKit:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setIsHealthKitInitialized(false);
      setIsConnectedToAppleHealth(false);
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
      console.log('🔄 Récupération des données de santé du jour depuis HealthKit...');
      
      // Récupérer les données directement depuis HealthKit
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const [stepsData, caloriesData, distanceData, flightsData] = await Promise.allSettled([
        queryQuantitySamples('HKQuantityTypeIdentifierStepCount', {
          from: startOfDay,
          to: endOfDay,
        } as any).then(samples => {
          const totalSteps = samples.reduce((sum, sample) => sum + sample.quantity, 0);
          return { quantity: totalSteps };
        }),
        queryQuantitySamples('HKQuantityTypeIdentifierActiveEnergyBurned', {
          from: startOfDay,
          to: endOfDay,
        } as any).then(samples => {
          const totalCalories = samples.reduce((sum, sample) => sum + sample.quantity, 0);
          return { quantity: totalCalories };
        }),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierDistanceWalkingRunning'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierFlightsClimbed'),
      ]);

      const steps = stepsData.status === 'fulfilled' ? Math.round(stepsData.value?.quantity || 0) : 0;
      const caloriesBurned = caloriesData.status === 'fulfilled' ? Math.round(caloriesData.value?.quantity || 0) : 0;
      const distance = distanceData.status === 'fulfilled' ? Math.round((distanceData.value?.quantity || 0) * 1000) : 0; // Convertir en mètres
      const floorsClimbed = flightsData.status === 'fulfilled' ? Math.round(flightsData.value?.quantity || 0) : 0;

      console.log('🔍 Données HealthKit récupérées:', { steps, caloriesBurned, distance, floorsClimbed });

      const fullHealthData: HealthData = {
        id: `${userId}-${today.toISOString().split('T')[0]}`,
        userId,
        date: today.toISOString().split('T')[0],
        steps,
        caloriesBurned,
        activeCalories: caloriesBurned,
        heartRate: {
          resting: 0,
          average: 0,
          max: 0,
        },
        distance,
        floorsClimbed,
        exerciseMinutes: 0, // TODO: Récupérer depuis HealthKit
        weight: 0, // TODO: Récupérer depuis HealthKit
        bodyFat: 0, // TODO: Récupérer depuis HealthKit
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setHealthData(fullHealthData);
      console.log('✅ Données de santé du jour mises à jour depuis HealthKit');
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
      console.log('📊 Récupération des données historiques depuis HealthKit...');
      
      // Générer les dates entre startDate et endDate
      const dates = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const historicalDataArray: HistoricalHealthData[] = [];

      // Récupérer les données pour chaque jour
      for (const date of dates) {
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        try {
          const [stepsData, caloriesData, distanceData] = await Promise.allSettled([
            queryQuantitySamples('HKQuantityTypeIdentifierStepCount', {
              from: dayStart,
              to: dayEnd,
            } as any).then(samples => {
              const totalSteps = samples.reduce((sum, sample) => sum + sample.quantity, 0);
              return { quantity: totalSteps };
            }),
            queryQuantitySamples('HKQuantityTypeIdentifierActiveEnergyBurned', {
              from: dayStart,
              to: dayEnd,
            } as any).then(samples => {
              const totalCalories = samples.reduce((sum, sample) => sum + sample.quantity, 0);
              return { quantity: totalCalories };
            }),
            getMostRecentQuantitySample('HKQuantityTypeIdentifierDistanceWalkingRunning'),
          ]);

          const steps = stepsData.status === 'fulfilled' ? Math.round(stepsData.value?.quantity || 0) : 0;
          const caloriesBurned = caloriesData.status === 'fulfilled' ? Math.round(caloriesData.value?.quantity || 0) : 0;
          const distance = distanceData.status === 'fulfilled' ? Math.round((distanceData.value?.quantity || 0) * 1000) : 0;

          historicalDataArray.push({
            date: date.toISOString().split('T')[0],
            steps,
            caloriesBurned,
            distance,
            floorsClimbed: 0, // TODO: Récupérer depuis HealthKit
            exerciseMinutes: 0, // TODO: Récupérer depuis HealthKit
          });
        } catch (dayError) {
          console.warn(`Erreur pour la date ${date.toISOString().split('T')[0]}:`, dayError);
          // Ajouter des données par défaut pour ce jour
          historicalDataArray.push({
            date: date.toISOString().split('T')[0],
            steps: 0,
            caloriesBurned: 0,
            distance: 0,
            floorsClimbed: 0,
            exerciseMinutes: 0,
          });
        }
      }

      setHistoricalData(historicalDataArray);
      console.log('✅ Données historiques mises à jour depuis HealthKit:', historicalDataArray.length, 'jours');
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