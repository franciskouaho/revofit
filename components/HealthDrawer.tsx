import { Ionicons } from '@expo/vector-icons';
import {
  getMostRecentQuantitySample,
  isHealthDataAvailable,
  useHealthkitAuthorization
} from '@kingstinct/react-native-healthkit';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const BORDER = "rgba(255,255,255,0.12)";

interface HealthDrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface HealthData {
  steps: number;
  heartRate: number;
  activeEnergy: number;
  distance: number;
}

export default function HealthDrawer({ visible, onClose }: HealthDrawerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    heartRate: 0,
    activeEnergy: 0,
    distance: 0,
  });

  // Permissions pour HealthKit avec la nouvelle API
  const permissions = [
    'HKQuantityTypeIdentifierStepCount',
    'HKQuantityTypeIdentifierHeartRate',
    'HKQuantityTypeIdentifierActiveEnergyBurned',
    'HKQuantityTypeIdentifierDistanceWalkingRunning',
  ];

  // Hook pour l'autorisation
  const [authorizationStatus, requestAuth] = useHealthkitAuthorization(permissions);

  const fetchHealthData = useCallback(async () => {
    if (!isConnected || Platform.OS !== 'ios') return;

    try {
      // Récupérer les données en parallèle avec la nouvelle API
      const [stepsData, heartRateData, activeEnergyData, distanceData] = await Promise.allSettled([
        getMostRecentQuantitySample('HKQuantityTypeIdentifierStepCount'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierHeartRate'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierActiveEnergyBurned'),
        getMostRecentQuantitySample('HKQuantityTypeIdentifierDistanceWalkingRunning'),
      ]);

      setHealthData(prev => ({
        ...prev,
        steps: stepsData.status === 'fulfilled' ? Math.round(stepsData.value?.quantity || 0) : 0,
        heartRate: heartRateData.status === 'fulfilled' ? Math.round(heartRateData.value?.quantity || 0) : 0,
        activeEnergy: activeEnergyData.status === 'fulfilled' ? Math.round(activeEnergyData.value?.quantity || 0) : 0,
        distance: distanceData.status === 'fulfilled' ? Math.round(distanceData.value?.quantity || 0) : 0,
      }));

      console.log('✅ Données de santé récupérées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données:', error);
    }
  }, [isConnected]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const isAvailable = await isHealthDataAvailable();
      if (!isAvailable) {
        console.log('HealthKit non disponible');
        setIsConnected(false);
        return;
      }

      // Vérifier le statut d'autorisation
      const hasPermissions = authorizationStatus === 'authorized';
      setIsConnected(hasPermissions);
      
      if (hasPermissions) {
        await fetchHealthData();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      setIsConnected(false);
    }
  }, [authorizationStatus, fetchHealthData]);

  const checkHealthKitAvailability = useCallback(async () => {
    try {
      const isAvailable = await isHealthDataAvailable();
      console.log('HealthKit disponible:', isAvailable);
      
      if (isAvailable) {
        await checkAuthStatus();
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification HealthKit:', error);
      setIsConnected(false);
    }
  }, [checkAuthStatus]);

  // Vérifier si HealthKit est disponible
  useEffect(() => {
    if (Platform.OS === 'ios') {
      checkHealthKitAvailability();
    }
  }, [checkHealthKitAvailability]);

  const connectToHealth = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Erreur', 'HealthKit n\'est disponible que sur iOS');
      return;
    }

    console.log('🏥 Tentative de connexion à HealthKit...');
    setIsLoading(true);
    
    try {
      // Vérifier si HealthKit est disponible
      const isAvailable = await isHealthDataAvailable();
      if (!isAvailable) {
        throw new Error('HealthKit n\'est pas disponible sur cet appareil');
      }

      console.log('✅ HealthKit disponible, demande d\'autorisation...');
      
      // Demander les autorisations
      await requestAuth();
      
      setIsLoading(false);
      setIsConnected(true);
      await fetchHealthData();
      
      Alert.alert(
        'Connexion réussie',
        'Votre application est maintenant connectée à Apple Health !',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Erreur lors de la connexion HealthKit:', error);
      setIsLoading(false);
      setIsConnected(false);
      Alert.alert(
        'Erreur de connexion',
        `Impossible de se connecter à Apple Health.\n\nErreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}\n\nVérifiez que l'application Santé est installée et que les permissions sont accordées.`,
        [{ text: 'OK' }]
      );
    }
  };

  const disconnectFromHealth = () => {
    setIsConnected(false);
    setHealthData({
      steps: 0,
      heartRate: 0,
      activeEnergy: 0,
      distance: 0,
    });
    Alert.alert(
      'Déconnexion',
      'Vous avez été déconnecté d\'Apple Health.',
      [{ text: 'OK' }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={styles.drawer}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <View
            style={[
              StyleSheet.absoluteFill,
              { 
                backgroundColor: "rgba(0,0,0,0.4)", 
                borderColor: BORDER, 
                borderWidth: 1, 
                borderRadius: 20 
              },
            ]}
          />
          
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.handle} />
              <Text style={styles.title}>Apple Health</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Status Section */}
              <View style={styles.section}>
                <View style={styles.statusCard}>
                  <View style={styles.statusHeader}>
                    <Ionicons 
                      name={isConnected ? "checkmark-circle" : "close-circle"} 
                      size={24} 
                      color={isConnected ? "#4CAF50" : "#FF6B6B"} 
                    />
                    <Text style={styles.statusText}>
                      {isConnected ? "Connecté" : "Non connecté"}
                    </Text>
                  </View>
                  
                  <Text style={styles.statusDescription}>
                    {isConnected 
                      ? "Votre application est connectée à Apple Health et peut synchroniser vos données de fitness."
                      : "Connectez-vous à Apple Health pour synchroniser vos données de fitness et améliorer votre expérience d'entraînement."
                    }
                  </Text>
                </View>
              </View>

              {/* Health Data Section */}
              {isConnected && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Données d&apos;aujourd&apos;hui</Text>
                  
                  <View style={styles.dataGrid}>
                    <View style={styles.dataCard}>
                      <Ionicons name="walk" size={20} color="#FFD700" />
                      <Text style={styles.dataValue}>{healthData.steps.toLocaleString()}</Text>
                      <Text style={styles.dataLabel}>Pas</Text>
                    </View>
                    
                    <View style={styles.dataCard}>
                      <Ionicons name="heart" size={20} color="#FF6B6B" />
                      <Text style={styles.dataValue}>{healthData.heartRate}</Text>
                      <Text style={styles.dataLabel}>BPM</Text>
                    </View>
                    
                    <View style={styles.dataCard}>
                      <Ionicons name="flash" size={20} color="#4CAF50" />
                      <Text style={styles.dataValue}>{Math.round(healthData.activeEnergy)}</Text>
                      <Text style={styles.dataLabel}>Calories</Text>
                    </View>
                    
                    <View style={styles.dataCard}>
                      <Ionicons name="location" size={20} color="#2196F3" />
                      <Text style={styles.dataValue}>{(healthData.distance / 1000).toFixed(1)}</Text>
                      <Text style={styles.dataLabel}>km</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.section}>
                {!isConnected ? (
                  <TouchableOpacity
                    style={styles.connectButton}
                    onPress={connectToHealth}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#4CAF50", "#45A049"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.buttonGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <>
                          <Ionicons name="link" size={20} color="#fff" />
                          <Text style={styles.buttonText}>Se connecter à Apple Health</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.connectedActions}>
                    <TouchableOpacity
                      style={styles.refreshButton}
                      onPress={fetchHealthData}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={["#2196F3", "#1976D2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.buttonGradient}
                      >
                        <Ionicons name="refresh" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Actualiser les données</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.disconnectButton}
                      onPress={disconnectFromHealth}
                      activeOpacity={0.8}
                    >
                      <View style={styles.disconnectButtonContent}>
                        <Ionicons name="unlink" size={20} color="#FF6B6B" />
                        <Text style={styles.disconnectButtonText}>Se déconnecter</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Info Section */}
              <View style={styles.section}>
                <View style={styles.infoCard}>
                  <Ionicons name="information-circle" size={20} color="#FFD700" />
                  <Text style={styles.infoText}>
                    La connexion à Apple Health vous permet de synchroniser automatiquement vos données de fitness et d&apos;améliorer la précision de vos entraînements.
                  </Text>
                </View>
              </View>

            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'absolute',
    left: '50%',
    marginLeft: -20,
    top: 8,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  statusDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dataCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  dataValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
  },
  dataLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  connectButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  connectedActions: {
    gap: 12,
  },
  refreshButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  disconnectButton: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.3)',
  },
  disconnectButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  disconnectButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  infoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
});
