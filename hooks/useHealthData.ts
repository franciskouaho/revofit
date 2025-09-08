import {
  isHealthDataAvailable,
  queryQuantitySamplesWithAnchor,
  useHealthkitAuthorization,
} from '@kingstinct/react-native-healthkit';
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

// Utilitaire pour additionner les samples
const calculateTotalFromSamples = (samples: readonly any[]): number => {
  return samples.reduce((total, sample) => total + (sample.quantity || 0), 0);
};

export const useHealthDataSimple = () => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [flights, setFlights] = useState(0);
  const [calories, setCalories] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Types à lire depuis HealthKit
  const permissions = [
    'HKQuantityTypeIdentifierStepCount' as const,
    'HKQuantityTypeIdentifierFlightsClimbed' as const,
    'HKQuantityTypeIdentifierDistanceWalkingRunning' as const,
    'HKQuantityTypeIdentifierActiveEnergyBurned' as const,
  ];

  // Hook pour demander l'autorisation HealthKit
  const [authorizationStatus, requestAuth] = useHealthkitAuthorization(permissions);

  // Vérifier la disponibilité et demander l'autorisation
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const initializePermissions = async () => {
      try {
        const isAvailable = await isHealthDataAvailable();
        if (!isAvailable) {
          Alert.alert('Erreur', 'HealthKit non disponible sur cet appareil');
          return;
        }
        await requestAuth();
      } catch (error) {
        console.error('Erreur lors de la demande d\'autorisation:', error);
        Alert.alert('Erreur', 'Problème lors de la demande d\'autorisation');
      }
    };
    initializePermissions();
  }, [requestAuth]);

  // Accepter tous les statuts valides pour l'autorisation
  useEffect(() => {
    if (authorizationStatus === null) {
      setHasPermissions(false);
      return;
    }
    
    const grantedStatuses = ['granted', 'authorized'];
    const stringStatus = String(authorizationStatus);
    if (grantedStatuses.includes(stringStatus)) {
      setHasPermissions(true);
    } else {
      setHasPermissions(false);
    }
  }, [authorizationStatus]);

  // Récupérer les données HealthKit si autorisé
  useEffect(() => {
    if (!hasPermissions) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Calculer minuit à minuit pour aujourd'hui
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);

        // Récupérer tous les samples en parallèle
        const [
          stepsData,
          flightsData,
          distanceData,
          caloriesData,
        ] = await Promise.allSettled([
          queryQuantitySamplesWithAnchor('HKQuantityTypeIdentifierStepCount', {
            filter: { startDate: startOfDay, endDate: endOfDay },
          }),
          queryQuantitySamplesWithAnchor('HKQuantityTypeIdentifierFlightsClimbed', {
            filter: { startDate: startOfDay, endDate: endOfDay },
          }),
          queryQuantitySamplesWithAnchor('HKQuantityTypeIdentifierDistanceWalkingRunning', {
            filter: { startDate: startOfDay, endDate: endOfDay },
          }),
          queryQuantitySamplesWithAnchor('HKQuantityTypeIdentifierActiveEnergyBurned', {
            filter: { startDate: startOfDay, endDate: endOfDay },
          }),
        ]);

        // Log samples pour debug
        if (stepsData.status === 'fulfilled') {
          console.log('Steps samples', stepsData.value?.samples);
          setSteps(Math.round(calculateTotalFromSamples(stepsData.value?.samples || [])));
        } else {
          console.log('Erreur steps', stepsData.reason);
        }
        if (flightsData.status === 'fulfilled') {
          setFlights(Math.round(calculateTotalFromSamples(flightsData.value?.samples || [])));
        } else {
          console.log('Erreur flights', flightsData.reason);
        }
        if (distanceData.status === 'fulfilled') {
          // HealthKit retourne la distance en mètres
          setDistance(Math.round(calculateTotalFromSamples(distanceData.value?.samples || [])));
        } else {
          console.log('Erreur distance', distanceData.reason);
        }
        if (caloriesData.status === 'fulfilled') {
          setCalories(Math.round(calculateTotalFromSamples(caloriesData.value?.samples || [])));
        } else {
          console.log('Erreur calories', caloriesData.reason);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données HealthKit:', error);
        Alert.alert('Erreur', 'Problème lors de la récupération des données HealthKit');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [hasPermissions, refreshTrigger]);

  // Fonction pour rafraîchir manuellement
  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  return {
    steps,
    flights,
    distance,
    calories,
    isLoading,
    hasPermissions,
    refresh,
    authorizationStatus,
  };
};