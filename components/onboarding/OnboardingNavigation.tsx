// Composant de navigation pour l'onboarding
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  showBack?: boolean;
  showNext?: boolean;
  showSkip?: boolean;
  nextDisabled?: boolean;
  nextText?: string;
  backText?: string;
  skipText?: string;
}

export default function OnboardingNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSkip,
  showBack = true,
  showNext = true,
  showSkip = false,
  nextDisabled = false,
  nextText = 'Suivant',
  backText = 'Retour',
  skipText = 'Passer'
}: OnboardingNavigationProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep} / {totalSteps}
        </Text>
      </View>

      {/* Boutons de navigation */}
      <View style={styles.buttonsContainer}>
        {/* Bouton retour */}
        {showBack && onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>{backText}</Text>
          </TouchableOpacity>
        )}

        {/* Bouton passer */}
        {showSkip && onSkip && (
          <TouchableOpacity
            onPress={onSkip}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>{skipText}</Text>
          </TouchableOpacity>
        )}

        {/* Bouton suivant */}
        {showNext && onNext && (
          <TouchableOpacity
            onPress={onNext}
            disabled={nextDisabled}
            style={[
              styles.nextButton,
              nextDisabled && styles.nextButtonDisabled
            ]}
          >
            <LinearGradient
              colors={nextDisabled ? ['#666666', '#555555'] : ['#FFD700', '#F5C500']}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>{nextText}</Text>
              <Ionicons name="arrow-forward" size={20} color="#000000" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2A2A2A',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#B0B0B0',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 8,
  },
});
