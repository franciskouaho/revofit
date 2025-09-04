# Guide d'Onboarding RevoFit

## 🎯 Vue d'ensemble

Le système d'onboarding de RevoFit a été restructuré pour une meilleure organisation et maintenabilité. Tous les composants sont maintenant organisés dans des dossiers dédiés.

## 📁 Structure Restructurée

### Composants d'Onboarding
```
components/onboarding/
├── OnboardingFlow.tsx          # Provider et hook principal
├── OnboardingLayout.tsx        # Layout de base
├── OnboardingError.tsx         # Gestion des erreurs
├── OnboardingLoading.tsx       # États de chargement
├── OnboardingSuccess.tsx       # Messages de succès
├── OnboardingNavigation.tsx    # Navigation entre étapes
├── OnboardingSummary.tsx       # Résumé des données
├── OnboardingTest.tsx          # Composant de test
└── index.ts                    # Exports
```

### Utilitaires
```
utils/
├── OnboardingValidation.ts     # Validation des données
├── useOnboardingState.ts       # Hook d'état
└── index.ts                    # Exports
```

## 🔧 Utilisation

### Import des Composants

```typescript
// Import d'un composant spécifique
import { OnboardingLayout } from '@/components/onboarding';

// Import du hook
import { useOnboarding } from '@/components/onboarding';

// Import de tous les composants
import * as OnboardingComponents from '@/components/onboarding';
```

### Import des Utilitaires

```typescript
// Import d'un utilitaire spécifique
import { validateOnboardingData } from '@/utils';

// Import via l'index principal
import { validateOnboardingData } from '@/components';
```

## 📱 Pages d'Onboarding

Toutes les pages d'onboarding sont dans `app/onboarding/` et utilisent le hook `useOnboarding` :

```typescript
import { useOnboarding } from '../../components/onboarding';

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

## 🎨 Personnalisation

### Ajouter un Nouveau Composant

1. Créer le fichier dans `components/onboarding/`
2. L'exporter dans `components/onboarding/index.ts`
3. L'importer dans `components/index.ts`

### Ajouter un Nouvel Utilitaire

1. Créer le fichier dans `utils/`
2. L'exporter dans `utils/index.ts`
3. L'importer dans `components/index.ts`

## 🚀 Avantages de la Restructuration

1. **Organisation claire** - Séparation des composants et utilitaires
2. **Imports cohérents** - Chemins d'import standardisés
3. **Maintenabilité** - Code mieux organisé et plus facile à maintenir
4. **Scalabilité** - Structure qui s'adapte à la croissance du projet
5. **Réutilisabilité** - Composants facilement réutilisables

## 📝 Conventions

### Nommage des Fichiers
- **Composants** : PascalCase (ex: `OnboardingLayout.tsx`)
- **Utilitaires** : PascalCase (ex: `OnboardingValidation.ts`)
- **Hooks** : camelCase avec préfixe `use` (ex: `useOnboardingState.ts`)

### Nommage des Dossiers
- **Composants** : kebab-case (ex: `onboarding/`)
- **Utilitaires** : kebab-case (ex: `utils/`)

### Imports
- **Composants** : `@/components/onboarding`
- **Utilitaires** : `@/utils`
- **Services** : `@/services/firebase`
- **Contextes** : `@/contexts`

## 🧪 Test

Utilisez la page de test pour vérifier le fonctionnement :

```typescript
// Dans votre navigation
<Stack.Screen name="test-onboarding" />
```

Ou accédez directement à `/test-onboarding` pour tester le système.

## 🔄 Migration

Si vous aviez des imports anciens, remplacez-les par :

```typescript
// Ancien
import { useOnboarding } from '../components/OnboardingFlow';

// Nouveau
import { useOnboarding } from '../components/onboarding';
```

## 📚 Documentation

- **Structure complète** : `STRUCTURE.md`
- **Guide d'utilisation** : `ONBOARDING_GUIDE.md`
- **Documentation technique** : `ONBOARDING_README.md`
