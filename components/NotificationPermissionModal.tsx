/**
 * Modal de demande de permission de notifications
 * RevoFit - Modal pour demander l'autorisation des notifications sur la page d'accueil
 */

import { useNotificationPermissions } from '@/hooks/useNotificationPermissions';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from './ThemedText';

interface NotificationPermissionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationPermissionModal({ 
  visible, 
  onClose 
}: NotificationPermissionModalProps) {
  const { requestPermission, isLoading } = useNotificationPermissions();

  const handleAllow = async () => {
    const granted = await requestPermission();
    if (granted) {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <View style={styles.modalContainer}>
          <BlurView intensity={30} tint="dark" style={styles.modalContent}>
            <View style={styles.border} />
            
            {/* Icône */}
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={48} color="#FFD700" />
            </View>

            {/* Titre */}
            <ThemedText style={styles.title}>
              Activez les notifications
            </ThemedText>

            {/* Description */}
            <ThemedText style={styles.description}>
              Recevez des rappels d'entraînement et des encouragements pour rester motivé !
            </ThemedText>

            {/* Avantages */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <Ionicons name="time" size={16} color="#FFD700" />
                <ThemedText style={styles.benefitText}>Rappels quotidiens</ThemedText>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="trophy" size={16} color="#FFD700" />
                <ThemedText style={styles.benefitText}>Félicitations</ThemedText>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="bulb" size={16} color="#FFD700" />
                <ThemedText style={styles.benefitText}>Conseils personnalisés</ThemedText>
              </View>
            </View>

            {/* Boutons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={handleAllow}
                disabled={isLoading}
                style={[styles.primaryButton, isLoading && styles.disabledButton]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFD700', '#E6C200']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <ThemedText style={styles.primaryButtonText}>
                    {isLoading ? 'Activation...' : 'Autoriser'}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSkip}
                disabled={isLoading}
                style={styles.secondaryButton}
                activeOpacity={0.8}
              >
                <ThemedText style={styles.secondaryButtonText}>
                  Plus tard
                </ThemedText>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  disabledButton: {
    opacity: 0.7,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
});
