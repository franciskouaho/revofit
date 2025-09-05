/**
 * Hook personnalisé pour les données de santé
 * RevoFit - Gestion des données de santé avec HealthKit et Firebase
 * 
 * Version complète avec Firebase + Version simple du tutoriel
 */

import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type {
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';
import AppleHealthKit from 'react-native-health';
import { useAuth } from '../contexts/AuthContext';

// Version simple du tutoriel (exportée séparément)
export const useHealthDataSimple = (date: Date = new Date()) => {
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);
  const [hasPermissions, setHasPermission] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const permissions: HealthKitPermissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.Steps,
          AppleHealthKit.Constants.Permissions.FlightsClimbed,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          AppleHealthKit.Constants.Permissions.HeartRate,
          AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
          AppleHealthKit.Constants.Permissions.AppleExerciseTime,
          AppleHealthKit.Constants.Permissions.Weight,
          AppleHealthKit.Constants.Permissions.BodyFatPercentage
        ],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log('Error getting permissions');
        return;
      }
      setHasPermission(true);
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) {
      return;
    }

    // Créer les options pour la journée d'aujourd'hui
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    // Get steps count
    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps:', err);
        return;
      }
      console.log('Steps retrieved:', results.value);
      setSteps(results.value || 0);
    });

    // Get flights climbed
    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log('Error getting the Flights Climbed:', err);
        return;
      }
      console.log('Flights retrieved:', results.value);
      setFlights(results.value || 0);
    });

    // Get distance walked/running
    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log('Error getting the Distance:', err);
        return;
      }
      console.log('Distance retrieved:', results.value);
      setDistance(results.value || 0);
    });
  }, [hasPermissions, date]);

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

      // Définir les permissions HealthKit
      const permissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
            AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
            AppleHealthKit.Constants.Permissions.HeartRate,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
            AppleHealthKit.Constants.Permissions.FlightsClimbed,
            AppleHealthKit.Constants.Permissions.AppleExerciseTime,
            AppleHealthKit.Constants.Permissions.Weight,
            AppleHealthKit.Constants.Permissions.BodyFatPercentage
          ],
          write: []
        }
      } as HealthKitPermissions;

      const success = await new Promise<boolean>((resolve) => {
        AppleHealthKit.initHealthKit(permissions, (error: string) => {
          if (error) {
            console.error('Erreur permissions HealthKit:', error);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });

      console.log('🏥 Permissions HealthKit accordées:', success);

      if (success) {
        console.log('✅ HealthKit initialisé avec succès');
        return true;
      } else {
        console.log('❌ Permissions HealthKit refusées');
        return false;
      }
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

      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      console.log('🏥 Récupération des données HealthKit...');

      // Récupérer les données en parallèle
      const [steps, calories, heartRate, distance, weight] = await Promise.allSettled([
        this.getSteps(startOfDay, endOfDay),
        this.getCalories(startOfDay, endOfDay),
        this.getHeartRate(startOfDay, endOfDay),
        this.getDistance(startOfDay, endOfDay),
        this.getWeight()
      ]);

      const healthData: Partial<HealthData> = {
        date: today.toISOString().split('T')[0],
        steps: steps.status === 'fulfilled' ? steps.value : 0,
        caloriesBurned: calories.status === 'fulfilled' ? calories.value : 0,
        activeCalories: calories.status === 'fulfilled' ? calories.value : 0,
        heartRate: heartRate.status === 'fulfilled' ? heartRate.value : { resting: 0, average: 0, max: 0 },
        distance: distance.status === 'fulfilled' ? distance.value : 0,
        floorsClimbed: 0,
        exerciseMinutes: 0,
        weight: weight.status === 'fulfilled' ? weight.value : 0,
        bodyFat: 0
      };

      console.log('✅ Données HealthKit récupérées:', healthData);
      return healthData;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données HealthKit:', error);
      return null;
    }
  }

  private static async getSteps(startDate: Date, endDate: Date): Promise<number> {
    try {
      const result = await new Promise<HealthValue>((resolve, reject) => {
        const options = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        AppleHealthKit.getStepCount(options, (error: string, results: HealthValue) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(results);
          }
        });
      });

      const totalSteps = result.value || 0;
      console.log('🚶 Pas récupérés:', totalSteps);
      return totalSteps;
    } catch (error) {
      console.error('Erreur récupération pas:', error);
      return 0;
    }
  }

  private static async getCalories(startDate: Date, endDate: Date): Promise<number> {
    try {
      const result = await new Promise<HealthValue[]>((resolve, reject) => {
        const options = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        AppleHealthKit.getActiveEnergyBurned(options, (error: string, results: HealthValue[]) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(results);
          }
        });
      });

      const totalCalories = result.reduce((sum: number, sample: HealthValue) => sum + (sample.value || 0), 0);
      console.log('🔥 Calories récupérées:', totalCalories);
      return Math.round(totalCalories);
    } catch (error) {
      console.error('Erreur récupération calories:', error);
      return 0;
    }
  }

  private static async getHeartRate(startDate: Date, endDate: Date): Promise<{ resting: number; average: number; max: number }> {
    try {
      const result = await new Promise<HealthValue[]>((resolve, reject) => {
        const options = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        AppleHealthKit.getHeartRateSamples(options, (error: string, results: HealthValue[]) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(results);
          }
        });
      });

      if (!result || result.length === 0) {
        return { resting: 0, average: 0, max: 0 };
      }

      const heartRates = result.map((sample: HealthValue) => sample.value).filter((hr: number) => hr > 0);

      if (heartRates.length === 0) {
        return { resting: 0, average: 0, max: 0 };
      }

      const average = Math.round(heartRates.reduce((sum: number, hr: number) => sum + hr, 0) / heartRates.length);
      const max = Math.max(...heartRates);

      console.log('❤️ Fréquence cardiaque récupérée - Moyenne:', average, 'Max:', max);
      return { resting: 0, average, max };
    } catch (error) {
      console.error('Erreur récupération fréquence cardiaque:', error);
      return { resting: 0, average: 0, max: 0 };
    }
  }

  private static async getDistance(startDate: Date, endDate: Date): Promise<number> {
    try {
      const result = await new Promise<HealthValue>((resolve, reject) => {
        const options = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        AppleHealthKit.getDistanceWalkingRunning(options, (error: string, results: HealthValue) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(results);
          }
        });
      });

      const totalDistance = result.value || 0;
      console.log('📏 Distance récupérée:', totalDistance, 'mètres');
      return Math.round(totalDistance);
    } catch (error) {
      console.error('Erreur récupération distance:', error);
      return 0;
    }
  }

  private static async getWeight(): Promise<number> {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 jours

      const result = await new Promise<HealthValue[]>((resolve, reject) => {
        const options = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          ascending: false,
          limit: 1
        };

        AppleHealthKit.getWeightSamples(options, (error: string, results: HealthValue[]) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(results);
          }
        });
      });

      const weight = result && result.length > 0 ? result[0].value : 0;
      console.log('⚖️ Poids récupéré:', weight, 'kg');
      return Math.round(weight);
    } catch (error) {
      console.error('Erreur récupération poids:', error);
      return 0;
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
