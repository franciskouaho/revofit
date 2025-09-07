# 🍎 Fonctionnalités Nutrition - RevoFit

## Vue d'ensemble

La page nutrition de RevoFit offre un système complet de gestion nutritionnelle avec des plans personnalisés basés sur les objectifs utilisateur.

## 🚀 Fonctionnalités Principales

### 1. **Vue d'ensemble** 
- Objectifs nutritionnels en temps réel
- Suivi des macronutriments (calories, protéines, glucides, lipides)
- Barres de progression visuelles
- Données synchronisées avec Firebase

### 2. **Plans Nutritionnels Personnalisés**
- Création de plans basés sur les objectifs (perte de poids, prise de muscle, maintien)
- Calcul automatique des besoins caloriques (formule Mifflin-St Jeor)
- Répartition intelligente des macronutriments
- Plans de 7 jours avec repas variés

### 3. **Suggestions de Repas IA**
- Suggestions personnalisées basées sur le profil utilisateur
- Filtrage selon les restrictions alimentaires
- Recommandations adaptées aux préférences culinaires
- Explication des raisons de chaque suggestion

### 4. **Configuration du Profil**
- Informations personnelles (âge, genre, taille, poids)
- Niveau d'activité physique
- Objectifs fitness
- Restrictions alimentaires
- Préférences culinaires

## 🛠️ Architecture Technique

### Services Firebase

#### `nutritionPlan.ts`
- **UserProfile** : Profil utilisateur complet
- **NutritionPlan** : Plans nutritionnels personnalisés
- **MealSuggestion** : Suggestions de repas avec justifications
- Calcul automatique des besoins caloriques
- Génération de suggestions basées sur les préférences

#### `nutrition.ts` (existant)
- Gestion des repas et nutrition quotidienne
- Objectifs nutritionnels
- Base de données de recettes
- Synchronisation temps réel

### Hooks Personnalisés

#### `useNutritionPlan.ts`
```typescript
const {
  userProfile,           // Profil utilisateur
  nutritionPlans,        // Plans nutritionnels
  activePlan,           // Plan actuellement actif
  mealSuggestions,      // Suggestions personnalisées
  createPersonalizedPlan, // Créer un nouveau plan
  saveUserProfile,      // Sauvegarder le profil
  generateMealSuggestions, // Générer des suggestions
  activatePlan,         // Activer un plan
} = useNutritionPlan();
```

#### `useNutrition.ts` (existant)
- Gestion des données nutritionnelles quotidiennes
- Synchronisation avec Firebase
- Gestion des repas et objectifs

### Composants UI

#### `NutritionPlanCard.tsx`
- Affichage des plans nutritionnels
- Statistiques et macronutriments
- Actions d'activation
- Design glassmorphism

#### `MealSuggestionCard.tsx`
- Suggestions de repas personnalisées
- Informations nutritionnelles détaillées
- Raisons de la suggestion
- Actions d'ajout au plan

#### `ProfileSetupModal.tsx`
- Configuration complète du profil
- Interface intuitive avec onglets
- Validation des données
- Sauvegarde Firebase

## 📊 Calculs Nutritionnels

### Besoins Caloriques (Mifflin-St Jeor)
```typescript
// Homme
BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge + 5

// Femme  
BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge - 161

// TDEE = BMR × facteur_activité
const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};
```

### Répartition Macronutriments
- **Perte de poids** : 30% protéines, 40% glucides, 30% lipides
- **Prise de muscle** : 30% protéines, 45% glucides, 25% lipides
- **Maintien** : 25% protéines, 50% glucides, 25% lipides
- **Endurance** : 20% protéines, 60% glucides, 20% lipides

## 🎯 Utilisation

### 1. Configuration Initiale
```typescript
// L'utilisateur configure son profil
const profile = {
  age: 25,
  gender: 'male',
  height: 175,
  weight: 70,
  activityLevel: 'moderate',
  goals: ['muscle_gain', 'strength'],
  dietaryRestrictions: ['vegetarian'],
  preferences: ['high_protein', 'quick_meals']
};

await saveUserProfile(profile);
```

### 2. Création d'un Plan
```typescript
// Créer un plan de prise de muscle
await createPersonalizedPlan('gain', 7);
```

### 3. Génération de Suggestions
```typescript
// Générer des suggestions personnalisées
await generateMealSuggestions();
```

## 📱 Interface Utilisateur

### Navigation par Onglets
- **Vue d'ensemble** : Objectifs et statistiques
- **Mes plans** : Plans nutritionnels personnalisés
- **Suggestions** : Recommandations de repas

### Design System
- **Thème sombre** avec accents jaunes
- **Glassmorphism** pour les cartes
- **Gradients** pour les éléments interactifs
- **Animations** fluides et micro-interactions

## 🔥 Intégration Firebase

### Collections Firestore
```
nutritionPlans/
├── {planId}/
    ├── userId: string
    ├── name: string
    ├── dailyCalories: number
    ├── meals: PlanMeal[]
    └── isActive: boolean

userProfiles/
├── {profileId}/
    ├── userId: string
    ├── age: number
    ├── goals: string[]
    └── preferences: string[]

recipes/
├── {recipeId}/
    ├── name: string
    ├── category: string
    ├── calories: number
    ├── tags: string[]
    └── isPublic: boolean
```

### Synchronisation Temps Réel
- Écoute des changements de profil
- Mise à jour automatique des plans
- Synchronisation des suggestions

## 🚀 Déploiement

### 1. Ajouter les Recettes d'Exemple
```bash
# Exécuter le script d'ajout de recettes
npx ts-node scripts/run-add-recipes.ts
```

### 2. Configuration Firebase
- Règles de sécurité Firestore
- Index pour les requêtes
- Configuration des collections

### 3. Tests
- Tests unitaires des calculs nutritionnels
- Tests d'intégration Firebase
- Tests UI des composants

## 📈 Améliorations Futures

### Version 2.0
- **IA avancée** : Suggestions basées sur l'historique
- **Scanner code-barres** : Ajout rapide d'aliments
- **Planification hebdomadaire** : Vues calendrier
- **Partage social** : Partage de plans entre utilisateurs

### Version 3.0
- **Reconnaissance d'images** : Photo de repas automatique
- **Intégration wearables** : Données de santé en temps réel
- **Coaching nutritionnel** : Chat avec nutritionnistes
- **Marketplace** : Plans premium de professionnels

## 🎉 Résultat

La page nutrition RevoFit offre maintenant :
- ✅ **Plans personnalisés** basés sur les objectifs
- ✅ **Suggestions intelligentes** adaptées au profil
- ✅ **Interface moderne** avec navigation intuitive
- ✅ **Intégration Firebase** complète
- ✅ **Calculs nutritionnels** précis
- ✅ **Expérience utilisateur** fluide

L'utilisateur peut maintenant créer des plans nutritionnels personnalisés, recevoir des suggestions adaptées à ses objectifs et préférences, et suivre sa progression nutritionnelle en temps réel.
