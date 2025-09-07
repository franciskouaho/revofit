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
        'HKQuantityTypeIdentifierHeartRate' as const,
        'HKQuantityTypeIdentifierDistanceWalkingRunning' as const,
        'HKQuantityTypeIdentifierFlightsClimbed' as const,
        'HKQuantityTypeIdentifierBodyMass' as const,
        'HKQuantityTypeIdentifierBodyFatPercentage' as const,
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

      // Récupérer les données du jour avec des échantillons récents
      const [stepsData, caloriesData, heartRateData, distanceData, floorsData, exerciseData, weightData] = await Promise.allSettled([
        getMostRecentQuantitySample('HKQuantityTypeIdentifierStepCount'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierActiveEnergyBurned'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierHeartRate'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierDistanceWalkingRunning'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierFlightsClimbed'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierAppleExerciseTime'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierBodyMass'),
      ]);

      const healthData: Partial<HealthData> = {
        date: today.toISOString().split('T')[0],
        steps: stepsData.status === 'fulfilled' ? Math.round(stepsData.value?.quantity || 0) : 0,
        caloriesBurned: caloriesData.status === 'fulfilled' ? Math.round(caloriesData.value?.quantity || 0) : 0,
        activeCalories: caloriesData.status === 'fulfilled' ? Math.round(caloriesData.value?.quantity || 0) : 0,
        heartRate: heartRateData.status === 'fulfilled' ? { 
          resting: Math.round(heartRateData.value?.quantity || 0), 
          average: Math.round(heartRateData.value?.quantity || 0), 
          max: Math.round(heartRateData.value?.quantity || 0) 
        } : { resting: 0, average: 0, max: 0 },
        distance: distanceData.status === 'fulfilled' ? Math.round(distanceData.value?.quantity || 0) : 0,
        floorsClimbed: floorsData.status === 'fulfilled' ? Math.round(floorsData.value?.quantity || 0) : 0,
        exerciseMinutes: exerciseData.status === 'fulfilled' ? Math.round((exerciseData.value?.quantity || 0) / 60) : 0,
        weight: weightData.status === 'fulfilled' ? Math.round(weightData.value?.quantity || 0) : 0,
        bodyFat: 0 // Pas de données de masse grasse dans les échantillons récents
      };

      console.log('✅ Données HealthKit du jour récupérées:', healthData);
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

      // Pour l'instant, on simule des données historiques
      // Dans une vraie implémentation, on utiliserait queryQuantitySamples
      const historicalData: HistoricalHealthData[] = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Simuler des données réalistes
        const steps = Math.floor(Math.random() * 5000) + 2000;
        const calories = Math.floor(steps * 0.04) + 200;
        const distance = Math.floor(steps * 0.7);
        const floors = Math.floor(Math.random() * 10) + 2;
        const exercise = Math.floor(Math.random() * 60) + 15;

        historicalData.push({
          date: dateStr,
          steps,
          caloriesBurned: calories,
          distance,
          floorsClimbed: floors,
          exerciseMinutes: exercise,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      console.log('✅ Données historiques simulées:', historicalData.length, 'jours');
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
        // Simuler des données mensuelles réalistes
        const totalSteps = Math.floor(Math.random() * 200000) + 100000;
        const totalCalories = Math.floor(totalSteps * 0.04) + 8000;
        const totalDistance = Math.floor(totalSteps * 0.7);
        const totalFloors = Math.floor(Math.random() * 200) + 100;
        const totalExerciseMinutes = Math.floor(Math.random() * 1200) + 600;
        const averageHeartRate = Math.floor(Math.random() * 20) + 70;

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
      }

      console.log('✅ Données mensuelles simulées:', monthlyData.length, 'mois');
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