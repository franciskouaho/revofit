// Utilitaires de validation pour l'onboarding
import { OnboardingData } from '../services/firebase/auth';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateOnboardingStep = (step: string, data: Partial<OnboardingData>): ValidationResult => {
  const errors: Record<string, string> = {};

  switch (step) {
    case 'firstname-selection':
      if (!data.firstName?.trim()) {
        errors.firstName = 'Le prénom est requis';
      } else if (data.firstName.trim().length < 2) {
        errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
      }
      break;

    case 'lastname':
      if (!data.lastName?.trim()) {
        errors.lastName = 'Le nom est requis';
      } else if (data.lastName.trim().length < 2) {
        errors.lastName = 'Le nom doit contenir au moins 2 caractères';
      }
      break;

    case 'gender-selection':
      if (!data.gender) {
        errors.gender = 'Le genre est requis';
      } else if (!['homme', 'femme', 'autre'].includes(data.gender)) {
        errors.gender = 'Genre invalide';
      }
      break;

    case 'age-selection':
      if (!data.age) {
        errors.age = 'L\'âge est requis';
      } else if (data.age < 13 || data.age > 100) {
        errors.age = 'L\'âge doit être entre 13 et 100 ans';
      }
      break;

    case 'height-selection':
      if (!data.height) {
        errors.height = 'La taille est requise';
      } else if (data.height < 100 || data.height > 250) {
        errors.height = 'La taille doit être entre 100 et 250 cm';
      }
      break;

    case 'weight-selection':
      if (!data.weight) {
        errors.weight = 'Le poids est requis';
      } else if (data.weight < 30 || data.weight > 300) {
        errors.weight = 'Le poids doit être entre 30 et 300 kg';
      }
      break;

    case 'goals-selection':
      if (!data.goals || data.goals.length === 0) {
        errors.goals = 'Au moins un objectif doit être sélectionné';
      }
      break;

    case 'email-selection':
      if (!data.email?.trim()) {
        errors.email = 'L\'email est requis';
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'L\'email n\'est pas valide';
      }
      break;

    case 'password-selection':
      if (!data.password) {
        errors.password = 'Le mot de passe est requis';
      } else if (data.password.length < 6) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      break;

    default:
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCompleteOnboarding = (data: Partial<OnboardingData>): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validation de tous les champs requis
  if (!data.firstName?.trim()) {
    errors.firstName = 'Le prénom est requis';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Le nom est requis';
  }

  if (!data.email?.trim()) {
    errors.email = 'L\'email est requis';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'L\'email n\'est pas valide';
  }

  if (!data.password) {
    errors.password = 'Le mot de passe est requis';
  } else if (data.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
  }

  if (!data.gender) {
    errors.gender = 'Le genre est requis';
  }

  if (!data.age) {
    errors.age = 'L\'âge est requis';
  }

  if (!data.height) {
    errors.height = 'La taille est requise';
  }

  if (!data.weight) {
    errors.weight = 'Le poids est requis';
  }

  if (!data.goals || data.goals.length === 0) {
    errors.goals = 'Au moins un objectif doit être sélectionné';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getStepTitle = (step: string): string => {
  const titles: Record<string, string> = {
    'firstname-selection': 'Prénom',
    'lastname': 'Nom de famille',
    'gender-selection': 'Genre',
    'age-selection': 'Âge',
    'height-selection': 'Taille',
    'weight-selection': 'Poids',
    'goals-selection': 'Objectifs',
    'email-selection': 'Email',
    'password-selection': 'Mot de passe',
    'rocket-launch': 'Finalisation',
  };

  return titles[step] || 'Étape';
};

export const getStepProgress = (step: string): number => {
  const steps = [
    'firstname-selection',
    'lastname',
    'gender-selection',
    'age-selection',
    'height-selection',
    'weight-selection',
    'goals-selection',
    'email-selection',
    'password-selection',
    'rocket-launch',
  ];

  const currentIndex = steps.indexOf(step);
  return currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;
};
