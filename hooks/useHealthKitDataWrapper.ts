/**
 * Wrapper simple pour useHealthDataSimple
 * RevoFit - Hook conditionnel pour HealthKit
 */

import { useHealthDataSimple } from './useHealthData';

export function useHealthKitDataWrapper() {
  const healthData = useHealthDataSimple();
  
  return {
    steps: healthData.steps,
    distance: healthData.distance,
    flights: healthData.flights,
    calories: healthData.calories,
    hasPermissions: healthData.hasPermissions,
    isLoading: healthData.isLoading,
    error: null,
    refreshData: async () => {
      healthData.setRefreshTrigger(prev => prev + 1);
    }
  };
}
