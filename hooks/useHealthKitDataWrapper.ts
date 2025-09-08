/**
 * Wrapper pour useHealthKitData qui gère la disponibilité dans Expo Go
 * RevoFit - Hook conditionnel pour HealthKit
 */

export function useHealthKitDataWrapper() {
  // Toujours retourner des valeurs par défaut pour Expo Go
  // Le hook HealthKit sera utilisé seulement dans un build natif
  return {
    steps: 0,
    distance: 0,
    flights: 0,
    calories: 0,
    hasPermissions: false,
    isLoading: false,
    error: 'HealthKit non disponible dans Expo Go',
    refreshData: async () => {}
  };
}
