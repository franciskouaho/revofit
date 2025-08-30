# RevoFit - Application React Native de Fitness & Coaching

## 🎯 Vue d'ensemble

**RevoFit** est une application mobile React Native moderne combinant entraînements personnalisés, suivi nutritionnel et coaching en temps réel. Design premium avec thème sombre et accent jaune signature pour une expérience utilisateur exceptionnelle.

**🌍 Langue : Français** - L'application est entièrement localisée en français pour le marché francophone.

## 🔧 Stack Technique

- **React Native 0.81** avec **Expo SDK 54**
- **TypeScript** pour la robustesse du code
- **Expo Router** pour la navigation moderne
- **TailwindCSS** avec **NativeWind** pour le styling
- **Librairies Expo natives** prioritaires pour toutes les fonctionnalités
- **Firebase** (Firestore, Auth, Storage, Cloud Functions, Real-time Chat)
- **Yarn** comme gestionnaire de packages

## 📱 Fonctionnalités Principales

### 🏋️ Module Entraînements
- Dashboard avec entraînement du jour
- Programmes par catégorie (Force, Cardio, HIIT, Yoga)
- Suivi de progression avec barres visuelles
- Timer intégré pour exercices et repos
- Historique des séances terminées

### 🍎 Module Nutrition
- Objectifs caloriques avec anneau de progression
- Tracking macronutriments (Protéines, Glucides, Lipides)
- Scanner code-barres pour ajout rapide
- Base alimentaire complète
- Planificateur de repas par jour

### 💬 Module Chat Coach
- Liste de coachs certifiés avec spécialités
- Chat temps réel avec Socket.io
- Statut en ligne/hors ligne
- Partage d'entraînements et données nutrition
- Questions fréquentes prédéfinies

### 📊 Module Statistiques
- Graphiques de progression (poids, force, calories)
- Métriques hebdomadaires et mensuelles
- Comparaison avec objectifs
- Système de badges et récompenses

### 👤 Module Profil
- Informations personnelles et physiques
- Configuration des objectifs fitness
- Paramètres de notifications
- Gestion abonnement premium

## �� Design System

### Typography System
```
Logo + Titres → Poppins Bold
Textes UI → Gilroy Regular / Medium (Alternative : Inter Regular/Medium)

Hiérarchie typographique :
- H1 (Titres principaux) : Poppins Bold, 48px
- H2 (Sous-titres) : Poppins Bold, 36px  
- H3 (Titres sections) : Poppins Bold, 24px
- Body Large (Texte principal) : Inter Medium, 18px
- Body Regular (Texte standard) : Inter Regular, 16px
- Body Small (Texte secondaire) : Inter Regular, 14px
- Caption (Labels, infos) : Inter Regular, 12px

Polices installées :
- Poppins Bold : Logo et titres principaux
- Inter : Textes UI et contenu (alternative à Gilroy)
```

### Installation des Polices
```bash
# Installation des polices Google Fonts
yarn add @expo-google-fonts/poppins @expo-google-fonts/inter expo-font expo-splash-screen

# Configuration dans _layout.tsx
const [loaded] = useFonts({
  'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
});

# Utilisation dans les composants
<Text style={{ fontFamily: 'Poppins-Bold', fontSize: 36 }}>
  Titre RevoFit
</Text>
```

### Palette de Couleurs (Style RevoFit)
```
Couleurs principales :
- Primary: #FFD700 (Jaune signature)
- Background: #0A0A0A (Noir profond)
- Surface: #2A2A2A (Cartes grises)
- Text: #FFFFFF (Blanc principal)

Couleurs fitness :
- Cardio: #FF6B6B (Rouge énergique)
- Strength: #4ECDC4 (Turquoise)
- HIIT: #FFD93D (Jaune vif)
- Yoga: #B388FF (Violet apaisant)

Couleurs nutrition :
- Calories: #FFD700 (Jaune)
- Protéines: #FF6B6B (Rouge)
- Glucides: #4ECDC4 (Turquoise)
- Lipides: #FFA726 (Orange)
```

### Principes UI/UX (TailwindCSS + Expo)
- **Thème sombre premium** : `bg-revo-bg text-revo-text`
- **Classes Tailwind** pour spacing : `p-4 m-2 gap-3`
- **Gradients TailwindCSS** : `bg-gradient-to-r from-revo-primary to-yellow-400`
- **Animations Expo** : `expo-blur`, `expo-haptics` pour micro-interactions
- **Typography Tailwind** : `text-lg font-semibold text-revo-text`
- **Flexbox moderne** : `flex-1 items-center justify-between`
- **Responsive design** : `sm:p-6 md:p-8 lg:p-10`

### Exemple de Styling TailwindCSS
```typescript
// Composant avec TailwindCSS + Expo
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

export const WorkoutCard = () => (
  <StyledView className="bg-revo-surface rounded-2xl p-4 mb-4 shadow-lg">
    <StyledText className="text-revo-text text-xl font-bold mb-2">
      Upper Body Strength
    </StyledText>
    <StyledView className="flex-row items-center justify-between">
      <StyledText className="text-revo-secondary text-sm">
        45 min • Intermédiaire
      </StyledText>
      <StyledPressable className="bg-revo-primary rounded-full px-6 py-2">
        <StyledText className="text-black font-semibold">Start</StyledText>
      </StyledPressable>
    </StyledView>
  </StyledView>
);
```

## 📁 Structure des Dossiers

```
revofit-app/
├── app/                          # Pages Expo Router
│   ├── (auth)/                  # Authentification
│   │   ├── login.js
│   │   ├── register.js
│   │   └── onboarding.js
│   ├── (tabs)/                  # Navigation principale
│   │   ├── workouts.js          # 🏋️ Entraînements (défaut)
│   │   ├── nutrition.js         # 🍎 Nutrition & calories
│   │   ├── coach.js             # 💬 Chat avec coachs
│   │   ├── stats.js             # 📊 Statistiques
│   │   ├── profile.js           # 👤 Profil utilisateur
│   │   └── _layout.js           # Layout tabs
│   ├── workout/                 # Entraînements détaillés
│   │   ├── [id].js             # Détail programme
│   │   ├── active.js           # Session en cours
│   │   └── summary.js          # Résumé post-workout
│   ├── nutrition/               # Nutrition détaillée
│   │   ├── food-search.js      # Recherche aliments
│   │   ├── barcode-scanner.js  # Scanner code-barres
│   │   └── meal-planner.js     # Planificateur repas
│   ├── chat/                    # Chat détaillé
│   │   ├── [coachId].js        # Chat avec coach
│   │   └── coaches-list.js     # Liste complète coachs
│   ├── intro.js                 # Onboarding carousel
│   ├── _layout.js               # Layout principal
│   └── +not-found.js           # 404

├── components/                   # Composants réutilisables
│   ├── common/                  # Composants de base
│   │   ├── Button.js           # Bouton style RevoFit
│   │   ├── Card.js             # Carte avec gradient
│   │   ├── Avatar.js           # Avatar utilisateur/coach
│   │   ├── ProgressBar.js      # Barre progression
│   │   └── Timer.js            # Timer exercices
│   ├── workout/                 # Composants entraînement
│   │   ├── WorkoutCard.js      # Carte entraînement
│   │   ├── ExerciseList.js     # Liste exercices
│   │   ├── SetTracker.js       # Suivi séries/reps
│   │   └── RestTimer.js        # Timer repos
│   ├── nutrition/               # Composants nutrition
│   │   ├── CalorieRing.js      # Anneau calories (SVG)
│   │   ├── MacroChart.js       # Graphique macros
│   │   ├── FoodCard.js         # Carte aliment
│   │   └── MealSection.js      # Section repas
│   ├── chat/                    # Composants chat
│   │   ├── MessageBubble.js    # Bulle message
│   │   ├── CoachCard.js        # Carte coach
│   │   ├── ChatInput.js        # Input chat
│   │   └── TypingIndicator.js  # Indicateur frappe
│   └── stats/                   # Composants stats
│       ├── ProgressChart.js    # Graphique progression
│       ├── StatCard.js         # Carte statistique
│       └── WeeklyChart.js      # Graphique hebdo

├── constants/                    # Configuration design
│   ├── Colors.js               # Palette complète
│   ├── Typography.js           # Styles texte
│   ├── Layout.js               # Dimensions
│   └── WorkoutConstants.js     # Constantes fitness

├── contexts/                     # State management
│   ├── AuthContext.js          # Authentification
│   ├── WorkoutContext.js       # Gestion entraînements
│   ├── NutritionContext.js     # Gestion nutrition
│   └── ChatContext.js          # Gestion chat

├── data/                         # Données mockées
│   ├── workouts/
│   │   ├── mockWorkouts.js     # Entraînements sample
│   │   ├── exercises.js        # Base exercices
│   │   └── programs.js         # Programmes fitness
│   ├── nutrition/
│   │   ├── foods.js            # Base alimentaire
│   │   ├── recipes.js          # Recettes fitness
│   │   └── mealPlans.js        # Plans repas
│   ├── coaches/
│   │   ├── mockCoaches.js      # Coachs fictifs
│   │   └── specialties.js      # Spécialités
│   └── user/
│       ├── mockUser.js         # Profil utilisateur
│       └── preferences.js      # Préférences

├── hooks/                        # Hooks personnalisés
│   ├── useWorkoutTimer.js      # Timer entraînements
│   ├── useNutritionTracker.js  # Tracking nutrition
│   ├── useChatSocket.js        # Chat temps réel
│   ├── useProgressTracking.js  # Suivi progression
│   └── useAsyncStorage.js      # Stockage local

├── services/                     # Services backend
│   ├── firebase/               # Configuration Firebase
│   │   ├── firestore.ts        # Opérations Firestore
│   │   ├── auth.ts             # Service authentification
│   │   ├── storage.ts          # Firebase Storage
│   │   └── functions.ts        # Cloud Functions
│   ├── chat/                   # Services chat
│   │   ├── socket.ts           # Configuration Socket.io
│   │   ├── chatService.ts      # Service de chat
│   │   └── coachMatching.ts    # Correspondance coach
│   ├── nutrition/              # Services nutrition
│   │   ├── foodDatabase.ts     # API base alimentaire
│   │   ├── barcodeScanner.ts   # Service scan code-barres
│   │   └── calorieCalculator.ts # Calcul calories/macros
│   ├── workout/                # Services entraînement
│   │   ├── exerciseAPI.ts      # API exercices
│   │   ├── progressTracker.ts  # Suivi progression
│   │   └── workoutGenerator.ts # Génération entraînements
│   ├── storage.ts              # AsyncStorage operations
│   ├── notifications.ts        # Service notifications
│   └── api.ts                  # API calls génériques

└── utils/                        # Utilitaires
    ├── workoutUtils.js         # Calculs fitness
    ├── nutritionUtils.js       # Calculs nutrition
    ├── dateUtils.js            # Gestion dates
    └── validation.js           # Validation formulaires
```

## 🎨 Design Guidelines

### Interface Style RevoFit
- **Thème sombre** avec noir profond (#0A0A0A)
- **Accent jaune** signature (#FFD700) pour actions principales
- **Cartes flottantes** avec ombres et gradients subtils
- **Typography** moderne avec Inter font family
- **Micro-animations** pour feedback utilisateur
- **🌍 Interface française** - Tous les textes, labels et messages sont en français

### Composants Clés
- **Bottom Tabs** : 5 onglets principaux avec icônes et labels
- **Boutons** : Style pill avec gradients jaunes
- **Cartes** : Surfaces grises avec bordures arrondies
- **Progress Bars** : Colorées selon contexte (fitness/nutrition)
- **Chat Bubbles** : Style iOS moderne

### Contraintes Design
- **Responsive** : Optimisé iPhone 16 Pro et adaptable
- **Accessibilité** : Contraste WCAG AA minimum
- **Performance** : 60fps pour animations
- **Consistance** : Design system uniforme
- **🌍 Localisation française** : Interface utilisateur 100% en français

## 📊 Données et State Management

### Structure de Données

```typescript
// Types principaux
interface Workout {
  id: string;
  title: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga';
  exercises: Exercise[];
  estimatedCalories: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  restTime: number;
  muscleGroups: string[];
  instructions: string[];
}

interface Food {
  id: string;
  name: string;
  calories: number; // per 100g
  macros: {
    proteins: number;
    carbs: number;
    fats: number;
  };
  barcode?: string;
}

interface Coach {
  id: string;
  name: string;
  avatar: string;
  specialty: string[];
  rating: number;
  isOnline: boolean;
  responseTime: string;
  hourlyRate: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'workout_share';
  timestamp: Date;
}
```

### State Management
- **Context API** pour état global
- **AsyncStorage** pour persistance locale
- **Zustand** comme alternative légère à Redux
- **React Hook Form** pour formulaires

## 🔥 Fonctionnalités Avancées

### Intelligence Artificielle
- **Recommandations** d'entraînements basées sur historique
- **Suggestions nutritionnelles** selon objectifs
- **Matching coach** optimal selon profil utilisateur
- **Adaptation automatique** de la difficulté

### Temps Réel
- **Chat instantané** avec Socket.io
- **Notifications push** pour rappels
- **Sync multi-appareils** via Firebase
- **Updates en temps réel** des statistiques

### Gamification
- **Système de badges** pour motivation
- **Streaks d'entraînement** et défis
- **Classements** entre utilisateurs
- **Récompenses** pour objectifs atteints

## 🚀 Installation et Développement

### Prérequis
```bash
- Node.js 18+
- Expo CLI
- Yarn ou npm
- Xcode (iOS) / Android Studio
- Firebase account
```

### Setup Initial (TypeScript + TailwindCSS + Yarn)
```bash
# Cloner et installer avec Yarn
git clone [repo-url]
cd revofit-app
yarn install

# Configuration TypeScript
yarn add -D typescript @types/react @types/react-native

# Configuration TailwindCSS avec NativeWind
yarn add nativewind
yarn add -D tailwindcss@3.3.0

# Initialiser TailwindCSS
npx tailwindcss init

# Configuration Expo
npx expo install

# Lancement développement
yarn start
# ou
npx expo start
```

### Configuration TailwindCSS
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs RevoFit personnalisées
        'revo-primary': '#FFD700',
        'revo-bg': '#0A0A0A',
        'revo-surface': '#2A2A2A',
        'revo-text': '#FFFFFF',
        'revo-secondary': '#B0B0B0',
        
        // Couleurs fitness
        'fitness-cardio': '#FF6B6B',
        'fitness-strength': '#4ECDC4',
        'fitness-hiit': '#FFD93D',
        'fitness-yoga': '#B388FF',
        
        // Couleurs nutrition
        'nutrition-calories': '#FFD700',
        'nutrition-proteins': '#FF6B6B',
        'nutrition-carbs': '#4ECDC4',
        'nutrition-fats': '#FFA726',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem',  // 352px pour bottom tabs
      }
    },
  },
  plugins: [],
}

// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel"],
  };
};
```

### Variables d'Environnement
```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Chat Configuration
EXPO_PUBLIC_SOCKET_URL=your_socket_server
EXPO_PUBLIC_CHAT_API_KEY=your_chat_key

# APIs tierces
EXPO_PUBLIC_NUTRITION_API_KEY=your_nutrition_api
EXPO_PUBLIC_BARCODE_API_KEY=your_barcode_api
```

## 📱 Écrans et Navigation

### Navigation Principale (Bottom Tabs)
```
🏋️ Entraînements (défaut)  → app/(tabs)/workouts.tsx
🍎 Nutrition              → app/(tabs)/nutrition.tsx  
💬 Coach                  → app/(tabs)/coach.tsx
📊 Stats                  → app/(tabs)/stats.tsx
👤 Profil                 → app/(tabs)/profile.tsx
```

### Flux Utilisateur
1. **Onboarding** : `intro.tsx` → Configuration profil
2. **Dashboard** : Vue d'ensemble quotidienne
3. **Entraînement** : Sélection → Session → Résumé
4. **Nutrition** : Objectifs → Ajout aliments → Suivi
5. **Coaching** : Sélection coach → Chat → Conseils

**🌍 Interface française** : Tous les écrans, boutons, messages et instructions sont en français.

## 🎨 Spécifications Design

### Palette de Couleurs (TypeScript)
```typescript
// constants/Colors.ts
export const Colors = {
  Primary: '#FFD700',     // Jaune signature (boutons, accents)
  Background: '#0A0A0A',  // Noir profond (fond principal)
  Surface: '#2A2A2A',     // Gris foncé (cartes)
  Text: '#FFFFFF',        // Blanc (texte principal)
  Success: '#4CAF50',     // Vert (validations)
  Error: '#F44336',       // Rouge (erreurs)
} as const;
```

### Gradients Signature (TypeScript)
```typescript
// constants/Gradients.ts
export const Gradients = {
  Primary: ['#FFD700', '#F5C500'] as const,        // Gradient jaune
  Background: ['#0A0A0A', '#1A1A1A'] as const,     // Gradient fond
  Workout: ['#FF6B6B', '#FFD700'] as const,        // Gradient énergique
  Card: ['#2A2A2A', '#1A1A1A'] as const,          // Gradient cartes
} as const;
```

### Typography (TypeScript)
```typescript
// constants/Typography.ts
export const Typography = {
  FontFamily: 'Inter' as const,
  Sizes: {
    xs: 10, sm: 12, md: 14, lg: 16, 
    xl: 18, xxl: 20, xxxl: 24, huge: 32, giant: 48
  } as const,
  Weights: {
    regular: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800'
  } as const,
} as const;
```

### Spacing System (TypeScript)
```typescript
// constants/Layout.ts
export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48
} as const;
```

### Border Radius
```javascript
SM: 8px    MD: 12px    LG: 16px
XL: 24px   Pill: 999px Circle: 50%
```

## 📊 Données et APIs

### Structure Firebase pour Chat Temps Réel
```typescript
// Collections Firestore pour chat
Collections :
├── users/              # Profils utilisateurs
├── coaches/            # Profils coachs  
├── chats/              # Conversations principales
│   └── [chatId]/
│       ├── messages/   # Messages temps réel (subcollection)
│       └── metadata    # Info conversation
├── workouts/           # Entraînements et programmes
├── nutrition/          # Données nutritionnelles
├── progress/           # Données de progression
└── notifications/      # Notifications push

// Exemple structure message Firestore
interface FirebaseMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'user' | 'coach';
  content: string;
  type: 'text' | 'image' | 'workout_share' | 'nutrition_share';
  timestamp: FirebaseTimestamp;
  readBy: string[];
  metadata?: {
    workoutId?: string;
    nutritionData?: any;
    imageUrl?: string;
  };
}
```

### APIs Externes
- **Nutrition API** : Base alimentaire avec codes-barres
- **Exercise API** : Base d'exercices avec vidéos
- **Socket.io** : Chat temps réel
- **Push Notifications** : Expo Notifications

### AsyncStorage Keys TypeScript
```typescript
// Types pour le stockage local
type StorageKeys = {
  '@user_profile': UserProfile;
  '@workout_history': WorkoutSession[];
  '@nutrition_data': DailyNutrition;
  '@app_settings': AppSettings;
  '@offline_queue': OfflineAction[];
};
```

## 🔧 Composants Réutilisables

### Composants de Base
- **Button** : Style RevoFit avec gradients
- **Card** : Surface avec ombres et bordures
- **Input** : Champs de saisie modernes
- **Avatar** : Photos utilisateurs/coachs
- **ProgressBar** : Barres de progression colorées

### Composants Métier
- **WorkoutCard** : Carte d'entraînement avec infos
- **CalorieRing** : Anneau SVG de progression calories
- **MacroChart** : Graphique macronutriments
- **MessageBubble** : Bulle de chat moderne
- **StatChart** : Graphiques statistiques

### Composants Avancés
- **WorkoutTimer** : Timer avec contrôles
- **BarcodeScanner** : Scanner code-barres aliments
- **CoachMatcher** : Recommandation coach optimal
- **ProgressTracker** : Suivi progression visuel

## 🎯 Fonctionnalités Spécifiques

### Module Entraînements (TypeScript)
```typescript
// Types et fonctionnalités
interface WorkoutFeatures {
  programs: WorkoutProgram[];     // Programmes pré-définis par niveau
  customWorkouts: boolean;        // Création entraînements personnalisés
  timer: TimerConfig;            // Timer séries/repos avec vibrations
  tracking: ProgressTracking;     // Tracking charges et répétitions
  history: WorkoutHistory[];      // Historique complet des séances
  adaptation: boolean;           // Adaptation automatique difficulté
}
```

### Module Nutrition (TypeScript)
```typescript
// Types et fonctionnalités
interface NutritionFeatures {
  calculator: CalorieCalculator;  // Calcul automatique calories/macros
  scanner: BarcodeScanner;       // Scanner code-barres produits
  database: FoodDatabase;        // Base alimentaire 500k+ produits
  suggestions: MealSuggestions;  // Suggestions repas intelligentes
  hydration: HydrationTracker;   // Tracking hydratation
  planner: WeeklyMealPlanner;    // Planificateur repas hebdo
}
```

### 💬 Module Chat (Firebase Realtime)
```typescript
// Types et fonctionnalités avec Firebase
interface ChatFeatures {
  realtime: FirestoreRealtime;    // Chat temps réel avec Firestore
  mediaSharing: FirebaseStorage;  // Partage photos via Firebase Storage
  dataSharing: DataExport;        // Envoi données entraînement/nutrition
  quickQuestions: string[];       // Questions pré-définies
  rating: CoachRating;            // Système de notation coachs
  history: ChatHistory[];         // Historique conversations Firestore
}

// Configuration Firebase Chat
interface FirebaseChatConfig {
  collection: 'chats';           // Collection Firestore principale
  subcollections: {
    messages: 'messages';        // Messages en temps réel
    participants: 'participants'; // Participants du chat
  };
  realTimeListeners: boolean;    // Listeners Firestore en temps réel
  offlineSupport: boolean;       // Support hors ligne Firestore
}
```

### Module Statistiques (TypeScript)
```typescript
// Métriques trackées avec types
interface TrackedMetrics {
  bodyWeight: WeightProgress[];   // Poids corporel (graphique temporel)
  strength: StrengthProgress[];   // Force par exercice (1RM estimé)
  calories: CalorieData[];       // Calories brûlées/consommées
  workoutTime: number;           // Temps d'entraînement total
  muscleProgress: MuscleGroup[]; // Progression par muscle group
  goalAdherence: number;         // Adherence aux objectifs (%)
}
```

## 🔐 Sécurité et Performance

### Authentification
- **Firebase Auth** avec email/password
- **Validation** stricte côté client/serveur
- **Tokens JWT** pour sessions sécurisées
- **Protection** données sensibles

### Optimisations
- **Lazy loading** des images et composants
- **Memoization** avec React.memo et useMemo
- **Cache intelligent** pour données fréquentes
- **Offline support** avec queue sync

### Monitoring
- **Crashlytics** pour crash reporting
- **Analytics** pour usage tracking
- **Performance monitoring** temps de réponse
- **Error boundaries** pour stabilité

## 🚀 Déploiement

### Build Production (Yarn + Expo)
```bash
# Build optimisé avec Yarn
yarn build:ios
yarn build:android

# OTA Updates
npx expo publish

# Tests et qualité
yarn test
yarn lint
yarn type-check
```

### App Stores
- **iOS** : TestFlight → App Store
- **Android** : Play Console
- **Updates OTA** via Expo pour corrections rapides

## 📈 Roadmap Future

### Version 2.0
- **IA Coach** : Assistant virtuel intelligent
- **Social** : Communauté et défis entre amis
- **Wearables** : Intégration Apple Watch/Android Wear
- **Advanced Analytics** : Insights poussés

### Version 3.0
- **AR Workouts** : Exercices en réalité augmentée
- **Nutrition Camera** : Reconnaissance automatique plats
- **Live Coaching** : Sessions vidéo temps réel
- **Marketplace** : Programmes payants coachs

## 💡 Notes Importantes

### Contraintes Techniques
- **Pas de scroll** sur écrans principaux (contrainte design)
- **Performance 60fps** obligatoire pour animations
- **Offline-first** : App utilisable sans connexion
- **Cross-platform** : Parité iOS/Android

### Best Practices (Expo + TailwindCSS + Yarn)
- **TypeScript strict** avec interfaces complètes
- **Expo natives TOUJOURS** avant librairies tierces
- **Firebase** pour backend complet (auth, db, storage, chat)
- **TailwindCSS** pour 90% du styling
- **Classes utilitaires** plutôt que StyleSheet
- **Composants styled** avec NativeWind
- **Yarn** pour toute gestion de packages
- **Performance 60fps** avec Expo optimizations
- **🌍 Localisation française** : Tous les textes et interfaces en français

### Priorités Techniques
1. **Expo SDK** : Utiliser librairies Expo en priorité absolue
2. **Firebase** : Backend complet avec chat temps réel
3. **TailwindCSS** : Classes utilitaires pour styling rapide
4. **TypeScript** : Types stricts pour robustesse
5. **Yarn** : Gestionnaire de packages cohérent
6. **Performance** : Optimisations Expo natives
7. **Cross-platform** : Parité iOS/Android garantie
8. **🌍 Localisation française** : Interface utilisateur entièrement en français

### Exemple d'Architecture Expo-First + Firebase
```typescript
// ✅ CORRECT : Expo natives + Firebase + TailwindCSS
import { Camera } from 'expo-camera';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { onSnapshot, collection } from 'firebase/firestore';
import { styled } from 'nativewind';

const StyledView = styled(View);

const ChatScreen = () => {
  // Chat temps réel avec Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'chats', chatId, 'messages'),
      (snapshot) => {
        const messages = snapshot.docs.map(doc => doc.data());
        setMessages(messages);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <StyledView className="flex-1 bg-revo-bg p-4">
      {/* Interface chat avec TailwindCSS */}
    </StyledView>
  );
};

// ❌ ÉVITER : Librairies tierces quand Expo/Firebase existent
import { launchImageLibrary } from 'react-native-image-picker';
import io from 'socket.io-client';
```

### Considérations UX
- **Onboarding** fluide en 3 étapes max
- **Feedback immédiat** pour toutes actions
- **États de chargement** avec skeletons
- **Gestion erreurs** gracieuse avec retry
- **🌍 Expérience française** : Interface intuitive et familière pour les utilisateurs francophones

## 🚫 **RÈGLES STRICTES - À RESPECTER**

### ❌ **NE JAMAIS CRÉER**
- **Fichiers de test** : `*.test.tsx`, `*Test.tsx`, `test-*.tsx`
- **Fichiers de debug** : `debug.tsx`, `*Debug.tsx`, `*_debug.tsx`
- **Fichiers temporaires** : `temp.tsx`, `tmp.tsx`, `*_temp.tsx`
- **Fichiers de navigation test** : `navigation-test.tsx`, `nav-test.tsx`
- **Fichiers README multiples** : `REVOFIT_*.md`, `*_README.md`, `README_*.md`
- **Fichiers de démonstration** : `demo.tsx`, `example.tsx`, `sample.tsx`

### ✅ **STRUCTURE DE FICHIERS AUTORISÉE**
```
app/
├── (tabs)/                 # Navigation principale
├── (auth)/                 # Authentification
├── workout/                # Entraînements
├── nutrition/              # Nutrition
├── chat/                   # Chat coach
├── profile/                # Profil utilisateur
└── _layout.tsx            # Layout principal

components/
├── common/                 # Composants de base
├── workout/                # Composants entraînement
├── nutrition/              # Composants nutrition
├── chat/                   # Composants chat
└── ui/                     # Composants UI

services/
├── firebase/               # Services Firebase
├── workout/                # Services entraînement
├── nutrition/              # Services nutrition
└── chat/                   # Services chat
```

### 🔒 **CONVENTIONS OBLIGATOIRES**
- **Un seul README** : `revofit_readme.md` (pas de duplication)
- **Noms de fichiers** : En minuscules avec tirets (`workout-card.tsx`)
- **Pas de suffixes** : Pas de `