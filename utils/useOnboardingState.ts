// Hook personnalisé pour gérer l'état de l'onboarding
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { OnboardingData } from '../services/firebase/auth';

const ONBOARDING_STATE_KEY = '@onboarding_state';

export function useOnboardingState() {
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'état de l'onboarding au démarrage
  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      const savedData = await AsyncStorage.getItem(ONBOARDING_STATE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setOnboardingData(parsedData.data || {});
        setCurrentStep(parsedData.step || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état d\'onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOnboardingState = async (data: Partial<OnboardingData>, step: number) => {
    try {
      const stateData = {
        data: { ...onboardingData, ...data },
        step,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(stateData));
      setOnboardingData(stateData.data);
      setCurrentStep(step);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état d\'onboarding:', error);
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    const newData = { ...onboardingData, ...data };
    setOnboardingData(newData);
    saveOnboardingState(newData, currentStep);
  };

  const nextStep = (stepData?: Partial<OnboardingData>) => {
    const newStep = currentStep + 1;
    const newData = stepData ? { ...onboardingData, ...stepData } : onboardingData;
    setCurrentStep(newStep);
    saveOnboardingState(newData, newStep);
  };

  const prevStep = () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    saveOnboardingState(onboardingData, newStep);
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_STATE_KEY);
      setOnboardingData({});
      setCurrentStep(0);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation de l\'onboarding:', error);
    }
  };

  const clearOnboardingState = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_STATE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'état d\'onboarding:', error);
    }
  };

  return {
    onboardingData,
    currentStep,
    isLoading,
    updateOnboardingData,
    nextStep,
    prevStep,
    resetOnboarding,
    clearOnboardingState,
  };
}
