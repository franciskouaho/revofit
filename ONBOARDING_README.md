# Système d'Onboarding RevoFit

## Vue d'ensemble

Le système d'onboarding de RevoFit permet de créer un compte utilisateur complet avec toutes les informations nécessaires pour personnaliser l'expérience fitness. Il utilise Firebase Auth pour l'authentification et Firestore pour stocker les données utilisateur.

## Architecture

### Composants principaux

1. **AuthContext** - Gestion de l'état d'authentification global
2. **OnboardingFlowProvider** - Gestion du flux d'onboarding
3. **Pages d'onboarding** - Chaque étape de l'onboarding
4. **Services Firebase** - Authentification et stockage des données

### Flux d'onboarding

1. **Prénom** (`firstname-selection.tsx`)
2. **Nom de famille** (`lastname.tsx`)
3. **Genre** (`gender-selection.tsx`)
4. **Âge** (`age-selection.tsx`)
5. **Taille** (`height-selection.tsx`)
6. **Poids** (`weight-selection.tsx`)
7. **Objectifs** (`goals-selection.tsx`)
8. **Email** (`email-selection.tsx`)
9. **Mot de passe** (`password-selection.tsx`)
10. **Finalisation** (`rocket-launch.tsx`)

## Utilisation

### 1. Configuration Firebase

Assurez-vous que Firebase est configuré avec vos credentials dans `services/firebase/config.ts`.

### 2. Wrapper de l'application

Enveloppez votre application avec les providers nécessaires :

```tsx
import { AuthProvider } from './contexts/AuthContext';
import { OnboardingFlowProvider } from './components/OnboardingFlow';

export default function App() {
  return (
    <AuthProvider>
      <OnboardingFlowProvider>
        {/* Votre application */}
      </OnboardingFlowProvider>
    </AuthProvider>
  );
}
```

### 3. Protection des routes

Utilisez `AuthGuard` pour protéger les routes qui nécessitent une authentification :

```tsx
import { AuthGuard } from './components/AuthGuard';

export default function ProtectedScreen() {
  return (
    <AuthGuard requireAuth={true}>
      {/* Contenu protégé */}
    </AuthGuard>
  );
}
```

### 4. Utilisation dans les pages d'onboarding

```tsx
import { useOnboarding } from '../components/OnboardingFlow';

export default function OnboardingStep() {
  const { nextStep, prevStep, onboardingData } = useOnboarding();

  const handleNext = () => {
    nextStep({ field: 'value' });
    router.push('/onboarding/next-step');
  };

  return (
    // Votre interface
  );
}
```

## Services

### AuthService

- `signUpUser(onboardingData)` - Inscription avec données d'onboarding
- `signInUser(email, password)` - Connexion
- `signOutUser()` - Déconnexion
- `getUserProfile(uid)` - Récupération du profil
- `updateUserProfile(uid, updates)` - Mise à jour du profil

### Validation

- `validateOnboardingData(data)` - Validation complète
- `validateOnboardingStep(step, data)` - Validation par étape
- `getStepTitle(step)` - Titre de l'étape
- `getStepProgress(step)` - Progression de l'étape

## Composants

### OnboardingLayout

Layout de base pour les pages d'onboarding avec navigation et progression.

### OnboardingNavigation

Composant de navigation avec boutons précédent/suivant et barre de progression.

### OnboardingError

Composant d'affichage des erreurs avec possibilité de retry.

### OnboardingLoading

Composant de loading avec barre de progression optionnelle.

### OnboardingSuccess

Composant de succès avec animation et bouton de continuation.

### OnboardingSummary

Résumé des données saisies avec possibilité d'édition.

## Hooks

### useAuth

```tsx
const { user, userProfile, loading, signIn, signUp, signOut } = useAuth();
```

### useOnboarding

```tsx
const { 
  onboardingData, 
  currentStep, 
  nextStep, 
  prevStep, 
  updateOnboardingData 
} = useOnboarding();
```

## Types

### OnboardingData

```tsx
interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: 'homme' | 'femme' | 'autre';
  age: number;
  height: number;
  weight: number;
  goals: string[];
  experienceLevel: 'débutant' | 'intermédiaire' | 'avancé';
  targetWeight?: number;
  weeklyWorkouts: number;
}
```

### UserProfile

```tsx
interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  goals: string[];
  experienceLevel: string;
  targetWeight?: number;
  weeklyWorkouts: number;
  createdAt: any;
  lastUpdated: any;
  onboardingCompleted: boolean;
}
```

## Personnalisation

### Styles

Tous les composants utilisent le thème RevoFit avec les couleurs définies dans `constants/Colors.ts`.

### Validation

Personnalisez les règles de validation dans `components/OnboardingValidation.ts`.

### Navigation

Modifiez le flux d'onboarding en ajustant les routes dans les pages.

## Tests

Utilisez `OnboardingTest` pour tester le système d'onboarding :

```tsx
import { OnboardingTest } from './components/OnboardingTest';

// Dans votre page de test
<OnboardingTest />
```

## Dépannage

### Erreurs courantes

1. **Firebase non configuré** - Vérifiez les credentials dans `config.ts`
2. **Navigation bloquée** - Vérifiez que `AuthGuard` est correctement configuré
3. **Données non sauvegardées** - Vérifiez que `nextStep` est appelé avec les bonnes données

### Logs

Activez les logs de debug en ajoutant `console.log` dans les services Firebase.

## Support

Pour toute question ou problème, consultez la documentation Firebase ou les logs de l'application.
