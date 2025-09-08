/**
 * Hook simplifié pour récupérer les données HealthKit
 * RevoFit - Récupération directe des données de santé depuis Apple Health
 */

import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Import conditionnel de HealthKit (seulement sur iOS natif)
let isHealthDataAvailable: any;
let queryQuantitySamples: any;
let requestAuthorization: any;

try {
  if (Platform.OS === 'ios') {
    const healthKit = require('@kingstinct/react-native-healthkit');
    isHealthDataAvailable = healthKit.isHealthDataAvailable;
    queryQuantitySamples = healthKit.queryQuantitySamples;
    requestAuthorization = healthKit.requestAuthorization;
  }
} catch (error) {
  console.log('HealthKit non disponible dans Expo Go');
}

export interface HealthKitData {
  steps: number;
  calories: number;
  distance: number;
  flights: number;
  hasPermissions: boolean;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export function useHealthKitData(): HealthKitData {
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [flights, setFlights] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les données HealthKit
  const fetchHealthData = async () => {
    if (Platform.OS !== 'ios') {
      console.log('❌ Pas iOS, HealthKit non disponible');
      return;
    }

    // Vérifier si HealthKit est disponible (dans Expo Go)
    if (!isHealthDataAvailable || !queryQuantitySamples || !requestAuthorization) {
      console.log('❌ HealthKit non disponible dans Expo Go');
      setError('HealthKit non disponible dans Expo Go');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Vérifier si HealthKit est disponible
      const isAvailable = await isHealthDataAvailable();
      if (!isAvailable) {
        console.log('❌ HealthKit non disponible sur cet appareil');
        setError('HealthKit non disponible');
        return;
      }

      console.log('🔄 Récupération des données HealthKit...');

      // Récupérer les données d'aujourd'hui
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      console.log('📅 Période:', { startOfDay, endOfDay });

      // Récupérer les données en parallèle
      const [stepsData, caloriesData, distanceData, flightsData] = await Promise.allSettled([
        queryQuantitySamples('HKQuantityTypeIdentifierStepCount', {
          filter: {
            startDate: startOfDay,
            endDate: endOfDay,
          },
        }),
        queryQuantitySamples('HKQuantityTypeIdentifierActiveEnergyBurned', {
          filter: {
            startDate: startOfDay,
            endDate: endOfDay,
          },
        }),
        queryQuantitySamples('HKQuantityTypeIdentifierDistanceWalkingRunning', {
          filter: {
            startDate: startOfDay,
            endDate: endOfDay,
          },
        }),
        queryQuantitySamples('HKQuantityTypeIdentifierFlightsClimbed', {
          filter: {
            startDate: startOfDay,
            endDate: endOfDay,
          },
        }),
      ]);

      // Calculer les totaux
      const stepsValue = stepsData.status === 'fulfilled' 
        ? Math.round(stepsData.value?.reduce((total: number, sample: any) => total + (sample.quantity || 0), 0) || 0)
        : 0;

      const caloriesValue = caloriesData.status === 'fulfilled'
        ? Math.round(caloriesData.value?.reduce((total: number, sample: any) => total + (sample.quantity || 0), 0) || 0)
        : 0;

      const distanceValue = distanceData.status === 'fulfilled'
        ? Math.round((distanceData.value?.reduce((total: number, sample: any) => total + (sample.quantity || 0), 0) || 0) * 1000) // Convertir en mètres
        : 0;

      const flightsValue = flightsData.status === 'fulfilled'
        ? Math.round(flightsData.value?.reduce((total: number, sample: any) => total + (sample.quantity || 0), 0) || 0)
        : 0;

      console.log('✅ Données HealthKit récupérées:', {
        steps: stepsValue,
        calories: caloriesValue,
        distance: distanceValue,
        flights: flightsValue,
      });

      setSteps(stepsValue);
      setCalories(caloriesValue);
      setDistance(distanceValue);
      setFlights(flightsValue);
      setHasPermissions(true);

    } catch (err) {
      console.error('❌ Erreur lors de la récupération des données HealthKit:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setHasPermissions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour demander les permissions
  const requestPermissions = useCallback(async () => {
    if (Platform.OS !== 'ios') return false;

    try {
      console.log('🔄 Demande des permissions HealthKit...');
      
      // Permissions requises
      const permissions = [
        'HKQuantityTypeIdentifierStepCount' as const,
        'HKQuantityTypeIdentifierActiveEnergyBurned' as const,
        'HKQuantityTypeIdentifierDistanceWalkingRunning' as const,
        'HKQuantityTypeIdentifierFlightsClimbed' as const,
      ];
      
      await requestAuthorization(permissions, []);
      console.log('✅ Permissions HealthKit demandées');
      return true;
    } catch (err) {
      console.error('❌ Erreur lors de la demande de permissions:', err);
      return false;
    }
  }, []);

  // Fonction de rafraîchissement
  const refreshData = async () => {
    await fetchHealthData();
  };

  // Initialiser au montage
  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS !== 'ios') return;

      try {
        // Vérifier si HealthKit est disponible
        const isAvailable = await isHealthDataAvailable();
        if (!isAvailable) {
          console.log('❌ HealthKit non disponible');
          setError('HealthKit non disponible sur cet appareil');
          return;
        }

        // Demander les permissions
        const permissionsGranted = await requestPermissions();
        if (permissionsGranted) {
          // Attendre un peu pour que les permissions soient traitées
          setTimeout(() => {
            fetchHealthData();
          }, 1000);
        }
      } catch (err) {
        console.error('❌ Erreur lors de l\'initialisation:', err);
        setError('Erreur lors de l\'initialisation de HealthKit');
      }
    };

    initialize();
  }, [requestPermissions]);

  return {
    steps,
    calories,
    distance,
    flights,
    hasPermissions,
    isLoading,
    error,
    refreshData,
  };
}
