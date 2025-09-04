// Composant de gestion du flux d'onboarding complet
import React, { createContext, useContext, useState } from 'react';
import { OnboardingData } from '../../services/firebase/auth';

interface OnboardingContextType {
  onboardingData: Partial<OnboardingData>;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: (stepData?: Partial<OnboardingData>) => void;
  prevStep: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingFlowProviderProps {
  children: React.ReactNode;
}

export const OnboardingFlowProvider: React.FC<OnboardingFlowProviderProps> = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = (stepData?: Partial<OnboardingData>) => {
    if (stepData) {
      updateOnboardingData(stepData);
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const resetOnboarding = () => {
    setOnboardingData({});
    setCurrentStep(0);
  };

  const value: OnboardingContextType = {
    onboardingData,
    updateOnboardingData,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    resetOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding doit être utilisé dans un OnboardingFlowProvider');
  }
  return context;
};
