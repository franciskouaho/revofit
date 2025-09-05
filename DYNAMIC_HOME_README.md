# Page d'Accueil Dynamique avec Firebase

## 🎯 Vue d'ensemble

La page d'accueil (`app/(tabs)/index.tsx`) a été transformée pour être entièrement dynamique avec Firebase. Toutes les données sont maintenant récupérées en temps réel depuis la base de données Firebase.

## ✨ Fonctionnalités Implémentées

### 1. **Statistiques Utilisateur Dynamiques**
- **Calories** : Récupérées depuis Firebase
- **Pas** : Suivi en temps réel
- **Fréquence cardiaque** : Données mises à jour
- **Entraînements** : Compteur de séances complétées/total
- **Série** : Streak de jours consécutifs
- **Points** : Système de récompenses
- **Objectif hebdomadaire** : Progression en temps réel

### 2. **Entraînement du Jour**
- Sélection aléatoire parmi les templates disponibles
- Calcul automatique des calories et durée
- Affichage de la difficulté
- Image et informations dynamiques

### 3. **Recommandations Personnalisées**
- 3 entraînements recommandés aléatoirement
- Couleurs et tags dynamiques
- Informations de durée et groupes musculaires

### 4. **Indicateurs de Chargement**
- Overlay de chargement global
- États de chargement individuels par section
- Messages de chargement contextuels

## 🏗️ Architecture

### Services Firebase

#### `UserStatsService` (`services/firebase/userStats.ts`)
```typescript
// Récupération des statistiques
const stats = await UserStatsService.getUserStats(userId);

// Mise à jour des statistiques
await UserStatsService.updateUserStats(userId, updates);

// Écoute en temps réel
UserStatsService.watchUserStats(userId, callback);
```

#### `WorkoutTemplateService` (existant)
```typescript
// Récupération des templates
const templates = await WorkoutTemplateService.getAllTemplates();

// Filtrage par difficulté
const beginnerTemplates = await WorkoutTemplateService.getTemplatesByDifficulty('beginner');
```

### Hooks Personnalisés

#### `useUserStats`
```typescript
const { stats, loading, error, refetch } = useUserStats();
```

#### `useTodayWorkout`
```typescript
const { workout, loading, error, refetch } = useTodayWorkout();
```

#### `useRecommendedWorkouts`
```typescript
const { workouts, loading, error, refetch } = useRecommendedWorkouts();
```

## 📊 Structure des Données

### UserStats
```typescript
interface UserStats {
  id: string;
  userId: string;
  calories: number;
  steps: number;
  heartRate: number;
  workouts: {
    completed: number;
    total: number;
  };
  streak: number;
  points: number;
  weeklyGoal: {
    done: number;
    target: number;
  };
  lastUpdated: Date;
  createdAt: Date;
}
```

### TodayWorkout
```typescript
interface TodayWorkout {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  calories: number;
  duration: number;
  image: any;
  muscleGroups: string[];
  exercises: any[];
}
```

### RecommendedWorkout
```typescript
interface RecommendedWorkout {
  id: string;
  name: string;
  tag: string;
  img: any;
  color: [string, string];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  duration: number;
  calories: number;
}
```

## 🚀 Utilisation

### 1. **Import des Hooks**
```typescript
import { useUserStats, useTodayWorkout, useRecommendedWorkouts } from '@/hooks';
```

### 2. **Utilisation dans un Composant**
```typescript
export default function HomeScreen() {
  const { stats, loading: statsLoading } = useUserStats();
  const { workout, loading: workoutLoading } = useTodayWorkout();
  const { workouts, loading: recommendedLoading } = useRecommendedWorkouts();

  // Logique du composant...
}
```

### 3. **Gestion des États de Chargement**
```typescript
const isLoading = statsLoading || workoutLoading || recommendedLoading;

return (
  <View>
    {isLoading && <LoadingOverlay />}
    {/* Contenu de la page */}
  </View>
);
```

## 🧪 Tests

### Exécuter les Tests
```bash
# Test de la page d'accueil dynamique
npx tsx scripts/run-test-dynamic-home.ts
```

### Tests Inclus
- ✅ Récupération des statistiques utilisateur
- ✅ Récupération des templates d'entraînement
- ✅ Filtrage par difficulté
- ✅ Génération de l'entraînement du jour
- ✅ Génération des recommandations

## 🔧 Configuration

### Collections Firebase Requises
- `userStats` : Statistiques utilisateur
- `dailyActivity` : Activité quotidienne
- `weeklyGoals` : Objectifs hebdomadaires
- `exerciseTemplates` : Templates d'entraînement (existant)

### Index Firebase Recommandés
```javascript
// userStats
collection: 'userStats'
fields: ['userId', 'lastUpdated']

// dailyActivity
collection: 'dailyActivity'
fields: ['userId', 'date']

// weeklyGoals
collection: 'weeklyGoals'
fields: ['userId', 'weekStart', 'isActive']
```

## 🎨 Interface Utilisateur

### États de Chargement
- **Overlay global** : Pendant le chargement initial
- **États individuels** : Par section (statistiques, entraînement, recommandations)
- **Messages contextuels** : "Chargement...", "Chargement de l'entraînement..."

### Gestion d'Erreurs
- **Valeurs par défaut** : Affichage de données de base en cas d'erreur
- **Messages d'erreur** : Logs détaillés pour le debugging
- **Fallbacks** : Interface fonctionnelle même sans données

## 📱 Expérience Utilisateur

### Avant (Statique)
- ❌ Données codées en dur
- ❌ Pas de personnalisation
- ❌ Pas de mise à jour en temps réel

### Après (Dynamique)
- ✅ Données Firebase en temps réel
- ✅ Personnalisation par utilisateur
- ✅ Mise à jour automatique
- ✅ Indicateurs de chargement
- ✅ Gestion d'erreurs robuste

## 🔮 Améliorations Futures

### Court Terme
- [ ] Cache local pour les performances
- [ ] Synchronisation hors ligne
- [ ] Animations de transition

### Moyen Terme
- [ ] Algorithmes de recommandation avancés
- [ ] Intégration avec des capteurs de santé
- [ ] Notifications push personnalisées

### Long Terme
- [ ] IA pour la sélection d'entraînements
- [ ] Analyse prédictive des performances
- [ ] Intégration avec des appareils IoT

## 📝 Notes de Développement

### Performance
- Les hooks utilisent `useEffect` pour éviter les re-renders inutiles
- Les données sont mises en cache localement
- Les listeners Firebase sont nettoyés automatiquement

### Sécurité
- Vérification des permissions utilisateur
- Validation des données côté client et serveur
- Gestion des erreurs de connexion

### Maintenance
- Code modulaire et réutilisable
- Documentation complète
- Tests automatisés
- Logs détaillés pour le debugging

---

**🎉 La page d'accueil est maintenant entièrement dynamique avec Firebase !**
