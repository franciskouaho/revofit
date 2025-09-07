// Contexte HealthKit pour RevoFit
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

interface HealthKitContextType {
  isAvailable: boolean;
  isConnected: boolean;
  permissions: any;
  requestPermissions: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  loading: boolean;
}

const HealthKitContext = createContext<HealthKitContextType | undefined>(undefined);

interface HealthKitProviderProps {
  children: ReactNode;
}

export const HealthKitProvider: React.FC<HealthKitProviderProps> = ({ children }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [permissions, setPermissions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier la disponibilité d'HealthKit
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        if (Platform.OS === 'ios') {
          // HealthKit est disponible sur iOS
          setIsAvailable(true);
          // Pour l'instant, on simule une connexion
          setIsConnected(false);
        } else {
          // HealthKit n'est disponible que sur iOS
          setIsAvailable(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification HealthKit:', error);
        setIsAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    checkAvailability();
  }, []);

  // Demander les permissions HealthKit
  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (!isAvailable) {
        Alert.alert(
          'HealthKit non disponible',
          'HealthKit n\'est disponible que sur iOS.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Simulation des permissions pour l'instant
      Alert.alert(
        'HealthKit',
        'La fonctionnalité HealthKit sera bientôt disponible. Pour l\'instant, vous pouvez saisir vos données manuellement.',
        [{ text: 'OK' }]
      );
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la demande de permissions HealthKit.',
        [{ text: 'OK' }]
      );
      return false;
    }
  };

  // Déconnecter HealthKit
  const disconnect = async (): Promise<void> => {
    try {
      if (Platform.OS === 'ios' && isConnected) {
        setIsConnected(false);
        setPermissions(null);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion HealthKit:', error);
    }
  };

  const value: HealthKitContextType = {
    isAvailable,
    isConnected,
    permissions,
    requestPermissions,
    disconnect,
    loading,
  };

  return (
    <HealthKitContext.Provider value={value}>
      {children}
    </HealthKitContext.Provider>
  );
};

export const useHealthKit = (): HealthKitContextType => {
  const context = useContext(HealthKitContext);
  if (context === undefined) {
    throw new Error('useHealthKit doit être utilisé dans un HealthKitProvider');
  }
  return context;
};
