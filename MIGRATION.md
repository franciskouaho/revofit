# Guide de Migration - Restructuration Onboarding

## 🔄 Changements Effectués

### 1. Déplacement des Composants

**Avant :**
```
components/
├── OnboardingFlow.tsx
├── OnboardingLayout.tsx
├── OnboardingError.tsx
├── OnboardingLoading.tsx
├── OnboardingSuccess.tsx
├── OnboardingNavigation.tsx
├── OnboardingSummary.tsx
├── OnboardingTest.tsx
└── OnboardingValidation.ts
```

**Après :**
```
components/
├── onboarding/
│   ├── OnboardingFlow.tsx
│   ├── OnboardingLayout.tsx
│   ├── OnboardingError.tsx
│   ├── OnboardingLoading.tsx
│   ├── OnboardingSuccess.tsx
│   ├── OnboardingNavigation.tsx
│   ├── OnboardingSummary.tsx
│   ├── OnboardingTest.tsx
│   └── index.ts
└── index.ts

utils/
├── OnboardingValidation.ts
├── useOnboardingState.ts
└── index.ts
```

### 2. Changements d'Imports

#### Composants d'Onboarding

**Avant :**
```typescript
import { useOnboarding } from '../components/OnboardingFlow';
import { OnboardingLayout } from '../components/OnboardingLayout';
```

**Après :**
```typescript
import { useOnboarding, OnboardingLayout } from '../components/onboarding';
```

#### Utilitaires

**Avant :**
```typescript
import { validateOnboardingData } from '../components/OnboardingValidation';
import { useOnboardingState } from '../hooks/useOnboardingState';
```

**Après :**
```typescript
import { validateOnboardingData, useOnboardingState } from '../utils';
```

### 3. Exports Centralisés

**Avant :**
```typescript
// Chaque composant exporté individuellement
export { default as OnboardingLayout } from './OnboardingLayout';
export { default as OnboardingError } from './OnboardingError';
```

**Après :**
```typescript
// Export centralisé via index.ts
export * from './onboarding';
export * from '../utils';
```

## 🔧 Actions de Migration

### 1. Mise à Jour des Imports

Recherchez et remplacez tous les imports :

```bash
# Rechercher les anciens imports
grep -r "OnboardingFlow" app/
grep -r "OnboardingValidation" app/
grep -r "useOnboardingState" app/

# Remplacer par les nouveaux
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|../components/OnboardingFlow|../components/onboarding|g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|../components/OnboardingValidation|../utils|g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|../hooks/useOnboardingState|../utils|g'
```

### 2. Vérification des Exports

Assurez-vous que tous les composants sont correctement exportés :

```typescript
// components/onboarding/index.ts
export { OnboardingFlowProvider, useOnboarding } from './OnboardingFlow';
export { default as OnboardingLayout } from './OnboardingLayout';
// ... autres exports

// utils/index.ts
export * from './OnboardingValidation';
export { default as useOnboardingState } from './useOnboardingState';
```

### 3. Test des Imports

Vérifiez que tous les imports fonctionnent :

```typescript
// Test d'import
import { useOnboarding } from '@/components/onboarding';
import { validateOnboardingData } from '@/utils';
```

## 🚨 Points d'Attention

### 1. Chemins d'Import

Les chemins d'import ont changé, assurez-vous de les mettre à jour :

- `../components/OnboardingFlow` → `../components/onboarding`
- `../components/OnboardingValidation` → `../utils`
- `../hooks/useOnboardingState` → `../utils`

### 2. Exports Nommés vs Default

Certains exports ont changé de type :

```typescript
// OnboardingFlow.tsx
export const OnboardingFlowProvider = ...; // Export nommé
export const useOnboarding = ...; // Export nommé

// OnboardingLayout.tsx
export default OnboardingLayout; // Export default
```

### 3. Chemins Relatifs

Les chemins relatifs dans les composants déplacés doivent être mis à jour :

```typescript
// Dans components/onboarding/OnboardingFlow.tsx
import { OnboardingData } from '../../services/firebase/auth'; // ✅ Correct
import { OnboardingData } from '../services/firebase/auth';   // ❌ Incorrect
```

## ✅ Checklist de Migration

- [ ] Tous les composants d'onboarding déplacés dans `components/onboarding/`
- [ ] Tous les utilitaires déplacés dans `utils/`
- [ ] Fichiers `index.ts` créés pour les exports
- [ ] Imports mis à jour dans toutes les pages d'onboarding
- [ ] Imports mis à jour dans `_layout.tsx`
- [ ] Imports mis à jour dans les composants
- [ ] Chemins relatifs corrigés
- [ ] Tests de compilation réussis
- [ ] Tests de fonctionnement réussis

## 🧪 Tests de Validation

### 1. Test de Compilation

```bash
npx tsc --noEmit
```

### 2. Test de Linting

```bash
npx eslint app/ components/ utils/ --ext .ts,.tsx
```

### 3. Test de Fonctionnement

1. Démarrer l'application
2. Naviguer vers l'onboarding
3. Tester chaque étape
4. Vérifier la finalisation

## 📚 Documentation

- **Structure** : `STRUCTURE.md`
- **Guide** : `ONBOARDING_GUIDE.md`
- **README** : `ONBOARDING_README.md`

## 🆘 Support

En cas de problème :

1. Vérifiez les chemins d'import
2. Vérifiez les exports dans les fichiers `index.ts`
3. Vérifiez les chemins relatifs
4. Consultez les logs de compilation
5. Testez les imports individuellement
