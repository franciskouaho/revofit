# Structure du Projet RevoFit

## 📁 Organisation des Dossiers

```
RevoFit/
├── app/                          # Pages Expo Router
│   ├── (tabs)/                  # Navigation principale
│   ├── onboarding/              # Pages d'onboarding
│   │   ├── firstname-selection.tsx
│   │   ├── lastname.tsx
│   │   ├── gender-selection.tsx
│   │   ├── age-selection.tsx
│   │   ├── height-selection.tsx
│   │   ├── weight-selection.tsx
│   │   ├── goals-selection.tsx
│   │   ├── email-selection.tsx
│   │   ├── password-selection.tsx
│   │   ├── rocket-launch.tsx
│   │   ├── index.tsx
│   │   └── _layout.tsx
│   ├── _layout.tsx              # Layout principal
│   └── index.tsx                # Page d'accueil
│
├── components/                   # Composants réutilisables
│   ├── onboarding/              # Composants d'onboarding
│   │   ├── OnboardingFlow.tsx
│   │   ├── OnboardingLayout.tsx
│   │   ├── OnboardingError.tsx
│   │   ├── OnboardingLoading.tsx
│   │   ├── OnboardingSuccess.tsx
│   │   ├── OnboardingNavigation.tsx
│   │   ├── OnboardingSummary.tsx
│   │   ├── OnboardingTest.tsx
│   │   └── index.ts
│   ├── AuthGuard.tsx            # Protection des routes
│   ├── LogoutButton.tsx         # Bouton de déconnexion
│   ├── UserProfile.tsx          # Affichage du profil
│   └── index.ts                 # Export des composants
│
├── contexts/                     # Contextes React
│   ├── AuthContext.tsx          # Contexte d'authentification
│   └── DrawerContext.tsx        # Contexte du drawer
│
├── services/                     # Services backend
│   └── firebase/                # Services Firebase
│       ├── config.ts            # Configuration Firebase
│       └── auth.ts              # Service d'authentification
│
├── utils/                        # Utilitaires TypeScript
│   ├── OnboardingValidation.ts  # Validation des données
│   ├── useOnboardingState.ts    # Hook d'état d'onboarding
│   └── index.ts                 # Export des utilitaires
│
├── hooks/                        # Hooks personnalisés
│   ├── useColorScheme.ts
│   ├── useColorScheme.web.ts
│   └── useThemeColor.ts
│
├── constants/                    # Constantes
│   ├── Colors.ts
│   ├── Texts.ts
│   ├── Typography.ts
│   └── index.ts
│
└── assets/                       # Assets
    ├── fonts/
    └── images/
```

## 🎯 Composants d'Onboarding

### Localisation
Tous les composants d'onboarding sont maintenant dans `components/onboarding/`

### Imports
```typescript
// Import d'un composant spécifique
import { OnboardingLayout } from '@/components/onboarding';

// Import de tous les composants
import * as OnboardingComponents from '@/components/onboarding';

// Import via l'index principal
import { OnboardingLayout } from '@/components';
```

## 🔧 Utilitaires

### Localisation
Tous les utilitaires TypeScript sont dans `utils/`

### Imports
```typescript
// Import d'un utilitaire spécifique
import { validateOnboardingData } from '@/utils';

// Import via l'index principal
import { validateOnboardingData } from '@/components';
```

## 📱 Pages d'Onboarding

### Localisation
Toutes les pages d'onboarding sont dans `app/onboarding/`

### Imports
```typescript
// Import du hook d'onboarding
import { useOnboarding } from '../../components/onboarding';

// Import des utilitaires de validation
import { validateOnboardingStep } from '../../utils';
```

## 🔄 Flux de Données

1. **Pages d'onboarding** → `useOnboarding()` → **OnboardingFlowProvider**
2. **OnboardingFlowProvider** → **AuthContext** → **Firebase Auth**
3. **Firebase Auth** → **Firestore** → **Profil utilisateur**

## 🎨 Personnalisation

### Ajouter un nouveau composant d'onboarding
1. Créer le fichier dans `components/onboarding/`
2. L'exporter dans `components/onboarding/index.ts`
3. L'importer dans `components/index.ts`

### Ajouter un nouvel utilitaire
1. Créer le fichier dans `utils/`
2. L'exporter dans `utils/index.ts`
3. L'importer dans `components/index.ts`

## 📝 Conventions

### Nommage des fichiers
- **Composants** : PascalCase (ex: `OnboardingLayout.tsx`)
- **Utilitaires** : PascalCase (ex: `OnboardingValidation.ts`)
- **Hooks** : camelCase avec préfixe `use` (ex: `useOnboardingState.ts`)

### Nommage des dossiers
- **Composants** : kebab-case (ex: `onboarding/`)
- **Utilitaires** : kebab-case (ex: `utils/`)
- **Pages** : kebab-case (ex: `onboarding/`)

### Imports
- **Composants** : `@/components/onboarding`
- **Utilitaires** : `@/utils`
- **Services** : `@/services/firebase`
- **Contextes** : `@/contexts`

## 🚀 Avantages de cette Structure

1. **Séparation claire** des responsabilités
2. **Imports organisés** et cohérents
3. **Réutilisabilité** des composants
4. **Maintenabilité** améliorée
5. **Scalabilité** du projet
