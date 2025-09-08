import { Ionicons } from '@expo/vector-icons';
import {
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
import { useHealthDataSimple } from '../hooks/useHealthData';
import { StorageService } from '../services/storage';

const BORDER = "rgba(255,255,255,0.12)";

interface HealthDrawerProps {
  visible: boolean;
  onClose: () => void;
}


export default function HealthDrawer({ visible, onClose }: HealthDrawerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hook pour récupérer les données de santé
  const { 
    steps, 
    calories, 
    distance, 
    flights, 
    isLoading: healthDataLoading,
    refresh: refreshFromHook
  } = useHealthDataSimple();

  // Permissions pour HealthKit avec la nouvelle API
  const permissions = [
    'HKQuantityTypeIdentifierStepCount',
    'HKQuantityTypeIdentifierHeartRate',
    'HKQuantityTypeIdentifierActiveEnergyBurned',
    'HKQuantityTypeIdentifierBasalEnergyBurned',
    'HKQuantityTypeIdentifierDistanceWalkingRunning',
    'HKQuantityTypeIdentifierFlightsClimbed',
    'HKQuantityTypeIdentifierAppleExerciseTime',
    'HKQuantityTypeIdentifierAppleStandTime',
  ] as const;

  // Hook pour l'autorisation
  const [authorizationStatus, requestAuth] = useHealthkitAuthorization(permissions);


  const checkAuthStatus = useCallback(async () => {
    try {
      const isAvailable = await isHealthDataAvailable();
      if (!isAvailable) {
        console.log('HealthKit non disponible');
        setIsConnected(false);
        return;
      }

      // Vérifier le statut d'autorisation
      const hasPermissions = authorizationStatus !== null;
      setIsConnected(hasPermissions);
      
      if (hasPermissions) {
        console.log('✅ Permissions HealthKit accordées');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      setIsConnected(false);
    }
  }, [authorizationStatus]);

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

  // Vérifier l'état de connexion persisté au montage
  useEffect(() => {
    const checkPersistedConnection = async () => {
      if (Platform.OS !== 'ios') return;
      
      try {
        const connectionState = await StorageService.getHealthKitConnection();
        if (connectionState?.isConnected) {
          console.log('✅ Connexion HealthKit trouvée dans le stockage local (HealthDrawer)');
          setIsConnected(true);
          console.log('✅ Connexion HealthKit restaurée');
        } else {
          console.log('❌ Aucune connexion HealthKit persistée trouvée (HealthDrawer)');
          // Vérifier la disponibilité de HealthKit
          await checkHealthKitAvailability();
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la connexion persistée:', error);
        // En cas d'erreur, vérifier la disponibilité de HealthKit
        await checkHealthKitAvailability();
      }
    };

    checkPersistedConnection();
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
      const authResult = await requestAuth();
      console.log('🔍 Résultat de la demande d\'autorisation:', authResult);
      
      // Attendre un peu pour que les permissions se propagent
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoading(false);
      setIsConnected(true);
      
      // Sauvegarder l'état de connexion
      await StorageService.saveHealthKitConnection(true);
      
      console.log('✅ Connexion HealthKit établie avec succès');
      
      Alert.alert(
        'Connexion réussie',
        'Votre application est maintenant connectée à Apple Health !\n\nSi les données ne s\'affichent pas, vérifiez les permissions dans l\'application Santé.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Erreur lors de la connexion HealthKit:', error);
      setIsLoading(false);
      setIsConnected(false);
      Alert.alert(
        'Erreur de connexion',
        `Impossible de se connecter à Apple Health.\n\nVérifiez que l'application Santé est installée et que les permissions sont accordées.\n\nPour activer les permissions :\n1. Ouvrez l'app Santé\n2. Allez dans "Parcourir"\n3. Recherchez "RevoFit"\n4. Activez toutes les permissions`,
        [{ text: 'OK' }]
      );
    }
  };


  const refreshHealthData = async () => {
    if (!isConnected) {
      Alert.alert('Erreur', 'Vous devez d\'abord vous connecter à Apple Health');
      return;
    }

    console.log('🔄 Actualisation des données de santé...');
    setIsRefreshing(true);
    
    try {
      // Déclencher le refresh des données de santé
      refreshFromHook();
      
      // Attendre un peu pour que les données se chargent
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Données de santé actualisées:', { steps, calories, distance, flights });
      
      Alert.alert(
        'Données actualisées',
        `Nouvelles données récupérées:\n• Pas: ${steps.toLocaleString()}\n• Calories: ${calories} kcal\n• Distance: ${(distance / 1000).toFixed(1)} km\n• Étages: ${flights}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Erreur lors de l\'actualisation des données:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'actualisation des données.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const disconnectFromHealth = async () => {
    try {
      console.log('🔌 Déconnexion de HealthKit (HealthDrawer)...');
      setIsConnected(false);
      console.log('✅ Données de santé réinitialisées');
      
      // Supprimer l'état de connexion du stockage
      await StorageService.clearHealthKitConnection();
      console.log('✅ Déconnexion HealthKit réussie (HealthDrawer)');
      
      Alert.alert(
        'Déconnexion',
        'Vous avez été déconnecté d\'Apple Health.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion HealthKit:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la déconnexion.',
        [{ text: 'OK' }]
      );
    }
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
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
          <View
            style={[
              StyleSheet.absoluteFill,
              { 
                backgroundColor: "rgba(0,0,0,0.98)", 
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
                      onPress={refreshHealthData}
                      disabled={isRefreshing || healthDataLoading}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={["#2196F3", "#1976D2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.buttonGradient}
                      >
                        {isRefreshing || healthDataLoading ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <Ionicons name="refresh" size={20} color="#fff" />
                        )}
                        <Text style={styles.buttonText}>
                          {isRefreshing || healthDataLoading ? 'Actualisation...' : 'Actualiser les données'}
                        </Text>
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

              {/* Current Data Section */}
              {isConnected && (steps > 0 || calories > 0 || distance > 0 || flights > 0) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Données actuelles</Text>
                  <View style={styles.dataGrid}>
                    <View style={styles.dataItem}>
                      <Ionicons name="footsteps" size={20} color="#4CAF50" />
                      <Text style={styles.dataValue}>{steps.toLocaleString()}</Text>
                      <Text style={styles.dataLabel}>Pas</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Ionicons name="flame" size={20} color="#FF9800" />
                      <Text style={styles.dataValue}>{calories}</Text>
                      <Text style={styles.dataLabel}>Calories</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Ionicons name="location" size={20} color="#2196F3" />
                      <Text style={styles.dataValue}>{(distance / 1000).toFixed(1)}</Text>
                      <Text style={styles.dataLabel}>km</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Ionicons name="trending-up" size={20} color="#9C27B0" />
                      <Text style={styles.dataValue}>{flights}</Text>
                      <Text style={styles.dataLabel}>Étages</Text>
                    </View>
                  </View>
                </View>
              )}

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
    backgroundColor: 'rgba(0,0,0,0.8)',
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
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dataItem: {
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
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  dataLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
});
