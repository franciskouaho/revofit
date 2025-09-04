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

## 🔥 Firebase - Architecture Complète Page par Page

### 🏗️ Configuration Firebase

#### Installation et Configuration
```bash
# Installation des packages Firebase
yarn add firebase @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage

# Configuration Expo
npx expo install expo-firebase-core expo-firebase-analytics
```

#### Configuration Firebase (TypeScript)
```typescript
// services/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Auth avec persistance React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Firestore
export const firestore = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Émulateurs en développement
if (__DEV__) {
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}
```

### 📱 Pages et Intégration Firebase

#### 1. 🏠 Page d'Accueil (`app/(tabs)/index.tsx`)

**Collections Firestore utilisées :**
- `users/{userId}/profile` - Profil utilisateur
- `users/{userId}/dailyStats` - Statistiques quotidiennes
- `users/{userId}/workouts` - Entraînements récents
- `workouts/recommended` - Entraînements recommandés

**Fonctionnalités Firebase :**
```typescript
// Récupération des données utilisateur
const fetchUserData = async (userId: string) => {
  const userDoc = await getDoc(doc(firestore, 'users', userId, 'profile', 'main'));
  const statsDoc = await getDoc(doc(firestore, 'users', userId, 'dailyStats', getCurrentDate()));
  const workoutsQuery = query(
    collection(firestore, 'users', userId, 'workouts'),
    orderBy('completedAt', 'desc'),
    limit(5)
  );
  
  return {
    profile: userDoc.data(),
    dailyStats: statsDoc.data(),
    recentWorkouts: await getDocs(workoutsQuery)
  };
};

// Mise à jour temps réel des statistiques
useEffect(() => {
  const unsubscribe = onSnapshot(
    doc(firestore, 'users', userId, 'dailyStats', getCurrentDate()),
    (doc) => {
      if (doc.exists()) {
        setUserStats(doc.data());
      }
    }
  );
  return unsubscribe;
}, [userId]);
```

**Données synchronisées :**
- Calories consommées/brûlées
- Pas effectués
- Fréquence cardiaque
- Streak d'entraînement
- Objectifs hebdomadaires
- Entraînement du jour

#### 2. 🏋️ Page Entraînements (`app/(tabs)/workouts.tsx`)

**Collections Firestore utilisées :**
- `workouts/templates` - Templates d'entraînements
- `users/{userId}/workouts` - Entraînements personnalisés
- `exercises` - Base d'exercices
- `workouts/categories` - Catégories d'entraînements

**Fonctionnalités Firebase :**
```typescript
// Récupération des templates d'entraînements
const fetchWorkoutTemplates = async () => {
  const templatesQuery = query(
    collection(firestore, 'workouts', 'templates'),
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(templatesQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Sauvegarde d'un entraînement personnalisé
const saveCustomWorkout = async (workoutData: WorkoutTemplate) => {
  const workoutRef = doc(collection(firestore, 'users', userId, 'workouts'));
  await setDoc(workoutRef, {
    ...workoutData,
    createdAt: serverTimestamp(),
    userId: userId
  });
};

// Mise à jour temps réel des templates
useEffect(() => {
  const unsubscribe = onSnapshot(
    query(collection(firestore, 'workouts', 'templates')),
    (snapshot) => {
      const templates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTemplates(templates);
    }
  );
  return unsubscribe;
}, []);
```

**Données synchronisées :**
- Templates d'entraînements publics
- Entraînements personnalisés utilisateur
- Exercices et instructions
- Historique des séances
- Progression des performances

#### 3. 🍎 Page Nutrition (`app/(tabs)/nutrition.tsx`)

**Collections Firestore utilisées :**
- `users/{userId}/nutrition/daily` - Données nutritionnelles quotidiennes
- `users/{userId}/nutrition/goals` - Objectifs nutritionnels
- `foods` - Base de données alimentaire
- `recipes` - Recettes recommandées
- `users/{userId}/meals` - Repas enregistrés

**Fonctionnalités Firebase :**
```typescript
// Récupération des objectifs nutritionnels
const fetchNutritionGoals = async (userId: string) => {
  const goalsDoc = await getDoc(doc(firestore, 'users', userId, 'nutrition', 'goals'));
  return goalsDoc.exists() ? goalsDoc.data() : getDefaultGoals();
};

// Ajout d'un aliment
const addFood = async (foodData: FoodEntry) => {
  const foodRef = doc(collection(firestore, 'users', userId, 'meals'));
  await setDoc(foodRef, {
    ...foodData,
    addedAt: serverTimestamp(),
    userId: userId
  });
  
  // Mise à jour des totaux quotidiens
  await updateDailyNutrition(foodData);
};

// Mise à jour temps réel des objectifs
useEffect(() => {
  const unsubscribe = onSnapshot(
    doc(firestore, 'users', userId, 'nutrition', 'daily', getCurrentDate()),
    (doc) => {
      if (doc.exists()) {
        setDailyNutrition(doc.data());
      }
    }
  );
  return unsubscribe;
}, [userId]);
```

**Données synchronisées :**
- Objectifs caloriques et macronutriments
- Consommation quotidienne
- Historique des repas
- Base alimentaire complète
- Recettes personnalisées

#### 4. 📊 Page Statistiques (`app/(tabs)/stats.tsx`)

**Collections Firestore utilisées :**
- `users/{userId}/progress` - Données de progression
- `users/{userId}/metrics` - Métriques détaillées
- `users/{userId}/achievements` - Badges et récompenses
- `users/{userId}/goals` - Objectifs personnels

**Fonctionnalités Firebase :**
```typescript
// Récupération des métriques de progression
const fetchProgressData = async (userId: string, period: 'week' | 'month' | 'year') => {
  const startDate = getStartDate(period);
  const endDate = getEndDate(period);
  
  const progressQuery = query(
    collection(firestore, 'users', userId, 'progress'),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'asc')
  );
  
  const snapshot = await getDocs(progressQuery);
  return snapshot.docs.map(doc => doc.data());
};

// Calcul des statistiques en temps réel
const calculateStats = (progressData: any[]) => {
  return {
    totalWorkouts: progressData.length,
    totalCalories: progressData.reduce((sum, day) => sum + day.caloriesBurned, 0),
    averageWeight: calculateAverage(progressData.map(d => d.weight)),
    strengthGains: calculateStrengthProgress(progressData)
  };
};
```

**Données synchronisées :**
- Progression du poids corporel
- Évolution de la force
- Calories brûlées/consommées
- Temps d'entraînement total
- Badges et achievements
- Graphiques de tendance

#### 5. 🔍 Page Explore (`app/(tabs)/explore.tsx`)

**Collections Firestore utilisées :**
- `exercises` - Base d'exercices complète
- `muscleGroups` - Groupes musculaires
- `workouts/categories` - Catégories d'entraînements
- `users/{userId}/favorites` - Exercices favoris

**Fonctionnalités Firebase :**
```typescript
// Recherche d'exercices par groupe musculaire
const searchExercises = async (muscleGroup: string) => {
  const exercisesQuery = query(
    collection(firestore, 'exercises'),
    where('muscleGroups', 'array-contains', muscleGroup),
    orderBy('name', 'asc')
  );
  
  const snapshot = await getDocs(exercisesQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Ajout aux favoris
const addToFavorites = async (exerciseId: string) => {
  const favoriteRef = doc(firestore, 'users', userId, 'favorites', exerciseId);
  await setDoc(favoriteRef, {
    exerciseId,
    addedAt: serverTimestamp()
  });
};
```

#### 6. 💬 Chat Coach & IA (`app/ai-coach-chat.tsx`)

**Collections Firestore utilisées :**
- `chats/{chatId}/messages` - Messages du chat
- `coaches` - Profils des coachs humains
- `ai-coaches` - Configurations des coachs IA
- `users/{userId}/chatHistory` - Historique des conversations
- `users/{userId}/aiPreferences` - Préférences IA utilisateur

**Fonctionnalités Firebase :**

##### Chat avec Coachs Humains
```typescript
// Chat temps réel avec coachs humains
const setupRealtimeChat = (chatId: string) => {
  const messagesQuery = query(
    collection(firestore, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMessages(messages);
  });
};

// Envoi de message à un coach humain
const sendMessageToCoach = async (coachId: string, content: string, type: 'text' | 'workout_share' | 'nutrition_share') => {
  const chatId = `${userId}_${coachId}`;
  const messageRef = doc(collection(firestore, 'chats', chatId, 'messages'));
  await addDoc(collection(firestore, 'chats', chatId, 'messages'), {
    content,
    type,
    senderId: userId,
    senderType: 'user',
    receiverId: coachId,
    receiverType: 'coach',
    timestamp: serverTimestamp(),
    readBy: [userId]
  });
};
```

##### Chat avec Coach IA
```typescript
// Configuration du coach IA
const setupAICoach = async (userId: string) => {
  const aiCoachDoc = await getDoc(doc(firestore, 'ai-coaches', 'main'));
  const userPrefsDoc = await getDoc(doc(firestore, 'users', userId, 'aiPreferences', 'main'));
  
  return {
    aiConfig: aiCoachDoc.data(),
    userPreferences: userPrefsDoc.data() || getDefaultAIPreferences()
  };
};

// Envoi de message à l'IA
const sendMessageToAI = async (content: string, context: 'workout' | 'nutrition' | 'general') => {
  const chatId = `${userId}_ai`;
  
  // Sauvegarde du message utilisateur
  await addDoc(collection(firestore, 'chats', chatId, 'messages'), {
    content,
    type: 'text',
    senderId: userId,
    senderType: 'user',
    receiverType: 'ai',
    context,
    timestamp: serverTimestamp()
  });
  
  // Traitement IA (Cloud Function)
  const aiResponse = await fetch('https://us-central1-revofit.cloudfunctions.net/processAIMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      message: content,
      context,
      chatId
    })
  });
  
  const response = await aiResponse.json();
  
  // Sauvegarde de la réponse IA
  await addDoc(collection(firestore, 'chats', chatId, 'messages'), {
    content: response.message,
    type: 'ai_response',
    senderId: 'ai',
    senderType: 'ai',
    receiverId: userId,
    receiverType: 'user',
    context,
    confidence: response.confidence,
    suggestions: response.suggestions,
    timestamp: serverTimestamp()
  });
};
```

##### Fonctionnalités IA Avancées
```typescript
// Analyse des données utilisateur pour recommandations IA
const analyzeUserDataForAI = async (userId: string) => {
  const userData = await Promise.all([
    getDocs(query(collection(firestore, 'users', userId, 'workouts'), orderBy('completedAt', 'desc'), limit(10))),
    getDocs(query(collection(firestore, 'users', userId, 'progress'), orderBy('date', 'desc'), limit(30))),
    getDoc(doc(firestore, 'users', userId, 'nutrition', 'goals'))
  ]);
  
  return {
    recentWorkouts: userData[0].docs.map(doc => doc.data()),
    progressData: userData[1].docs.map(doc => doc.data()),
    nutritionGoals: userData[2].data()
  };
};

// Génération de recommandations personnalisées
const generateAIRecommendations = async (userId: string, type: 'workout' | 'nutrition' | 'motivation') => {
  const userData = await analyzeUserDataForAI(userId);
  
  const response = await fetch('https://us-central1-revofit.cloudfunctions.net/generateRecommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      type,
      userData,
      timestamp: new Date().toISOString()
    })
  });
  
  return await response.json();
};
```

**Types de Coachs Disponibles :**

##### 🤖 Coach IA ChatGPT
- **Modèle** : GPT-4 (OpenAI)
- **Spécialités** : Recommandations générales, motivation, objectifs
- **Disponibilité** : 24/7
- **Capacités** : Analyse des données, suggestions personnalisées, suivi des progrès
- **Langue** : Français (prompts spécialisés)
- **Personnalité** : Coach fitness expert et motivant

##### 👨‍💼 Coachs Humains Spécialisés
- **Coach Force** : Spécialiste musculation et powerlifting
- **Coach Cardio** : Expert course et endurance
- **Coach Nutrition** : Diététicien et nutritionniste
- **Coach Yoga** : Instructeur yoga et mobilité
- **Coach HIIT** : Expert entraînements haute intensité

**Données synchronisées :**
- Messages en temps réel (humains + IA)
- Profils des coachs et leurs spécialités
- Historique complet des conversations
- Préférences IA personnalisées
- Recommandations générées par l'IA
- Contexte des conversations (workout/nutrition/general)
- Suggestions et conseils adaptatifs

#### 7. 🚀 Onboarding (`app/onboarding/`)

**Pages d'onboarding :**
- `index.tsx` - Écran d'accueil avec swipe to start
- `firstname-selection.tsx` - Sélection du prénom
- `lastname.tsx` - Sélection du nom de famille
- `gender-selection.tsx` - Sélection du genre
- `age-selection.tsx` - Sélection de l'âge
- `height-selection.tsx` - Sélection de la taille
- `weight-selection.tsx` - Sélection du poids
- `goals-selection.tsx` - Sélection des objectifs fitness
- `email-selection.tsx` - Sélection de l'email
- `password-selection.tsx` - Création du mot de passe
- `rocket-launch.tsx` - Écran de finalisation

**Collections Firestore utilisées :**
- `users/{userId}/profile` - Création du profil utilisateur
- `users/{userId}/preferences` - Préférences d'onboarding
- `users/{userId}/goals` - Objectifs fitness initiaux
- `onboarding/templates` - Templates d'onboarding

**Fonctionnalités Firebase :**
```typescript
// Création du profil utilisateur complet
const createUserProfile = async (userData: OnboardingData) => {
  const userRef = doc(firestore, 'users', userId, 'profile', 'main');
  await setDoc(userRef, {
    firstName: userData.firstName,
    lastName: userData.lastName,
    gender: userData.gender,
    age: userData.age,
    height: userData.height,
    weight: userData.weight,
    goals: userData.goals,
    email: userData.email,
    createdAt: serverTimestamp(),
    onboardingCompleted: true,
    lastUpdated: serverTimestamp()
  });
  
  // Création des objectifs initiaux
  await setDoc(doc(firestore, 'users', userId, 'goals', 'main'), {
    fitnessGoals: userData.goals,
    targetWeight: userData.targetWeight,
    weeklyWorkouts: userData.weeklyWorkouts,
    experienceLevel: userData.experienceLevel,
    createdAt: serverTimestamp()
  });
  
  // Création des préférences utilisateur
  await setDoc(doc(firestore, 'users', userId, 'preferences', 'main'), {
    notifications: true,
    reminders: true,
    dataSharing: true,
    theme: 'dark',
    language: 'fr',
    createdAt: serverTimestamp()
  });
};

// Sauvegarde progressive des données d'onboarding
const saveOnboardingStep = async (step: string, data: any) => {
  const stepRef = doc(firestore, 'users', userId, 'onboarding', step);
  await setDoc(stepRef, {
    ...data,
    step,
    completedAt: serverTimestamp()
  });
};

// Validation des données d'onboarding
const validateOnboardingData = (data: OnboardingData) => {
  return {
    isValid: data.firstName && data.lastName && data.email && data.password,
    errors: {
      firstName: !data.firstName ? 'Prénom requis' : null,
      lastName: !data.lastName ? 'Nom requis' : null,
      email: !data.email ? 'Email requis' : null,
      password: data.password?.length < 6 ? 'Mot de passe trop court' : null
    }
  };
};
```

**Données synchronisées :**
- Profil utilisateur complet
- Objectifs fitness personnalisés
- Préférences d'application
- Progression de l'onboarding
- Données de validation

#### 8. 🏃 Page Entraînement Actif (`app/workout/active.tsx`)

**Collections Firestore utilisées :**
- `users/{userId}/workoutSessions` - Sessions d'entraînement en cours
- `workouts/{workoutId}` - Détails de l'entraînement
- `users/{userId}/sets` - Séries et répétitions

**Fonctionnalités Firebase :**
```typescript
// Démarrage d'une session d'entraînement
const startWorkoutSession = async (workoutId: string) => {
  const sessionRef = doc(collection(firestore, 'users', userId, 'workoutSessions'));
  const sessionData = {
    workoutId,
    startTime: serverTimestamp(),
    status: 'active',
    sets: [],
    totalTime: 0
  };
  
  await setDoc(sessionRef, sessionData);
  return sessionRef.id;
};

// Enregistrement d'une série
const recordSet = async (sessionId: string, exerciseId: string, setData: SetData) => {
  const setRef = doc(collection(firestore, 'users', userId, 'workoutSessions', sessionId, 'sets'));
  await setDoc(setRef, {
    ...setData,
    exerciseId,
    timestamp: serverTimestamp(),
    sessionId
  });
};
```

### 🔐 Authentification Firebase

#### Configuration Auth
```typescript
// services/firebase/auth.ts
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Connexion utilisateur
export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error('Erreur de connexion: ' + error.message);
  }
};

// Inscription utilisateur
export const signUpUser = async (email: string, password: string, userData: UserProfile) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Création du profil utilisateur
    await setDoc(doc(firestore, 'users', userCredential.user.uid, 'profile', 'main'), {
      ...userData,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    
    return userCredential.user;
  } catch (error) {
    throw new Error('Erreur d\'inscription: ' + error.message);
  }
};
```

### 📁 Structure Firestore Complète

```
Firestore Database Structure:
├── users/
│   ├── {userId}/
│   │   ├── profile/
│   │   │   └── main                    # Profil principal
│   │   ├── onboarding/
│   │   │   └── {step}                  # Étapes d'onboarding
│   │   ├── preferences/
│   │   │   └── main                    # Préférences utilisateur
│   │   ├── goals/
│   │   │   └── main                    # Objectifs fitness
│   │   ├── dailyStats/
│   │   │   └── {date}                  # Statistiques quotidiennes
│   │   ├── workouts/
│   │   │   └── {workoutId}             # Entraînements personnalisés
│   │   ├── workoutSessions/
│   │   │   ├── {sessionId}             # Sessions d'entraînement
│   │   │   └── {sessionId}/sets/       # Séries et répétitions
│   │   ├── nutrition/
│   │   │   ├── goals                   # Objectifs nutritionnels
│   │   │   └── daily/{date}            # Données nutrition quotidiennes
│   │   ├── meals/
│   │   │   └── {mealId}                # Repas enregistrés
│   │   ├── progress/
│   │   │   └── {date}                  # Données de progression
│   │   ├── metrics/
│   │   │   └── {metricId}              # Métriques détaillées
│   │   ├── achievements/
│   │   │   └── {achievementId}         # Badges et récompenses
│   │   ├── favorites/
│   │   │   └── {exerciseId}            # Exercices favoris
│   │   └── chatHistory/
│   │       └── {chatId}                # Historique des conversations
├── onboarding/
│   ├── templates/
│   │   └── {templateId}                # Templates d'onboarding
│   └── steps/
│       └── {stepId}                    # Étapes d'onboarding
├── workouts/
│   ├── templates/
│   │   └── {templateId}                # Templates d'entraînements
│   └── categories/
│       └── {categoryId}                # Catégories d'entraînements
├── exercises/
│   └── {exerciseId}                    # Base d'exercices
├── foods/
│   └── {foodId}                        # Base alimentaire
├── recipes/
│   └── {recipeId}                      # Recettes
├── coaches/
│   └── {coachId}                       # Profils des coachs humains
├── ai-coaches/
│   ├── main                            # Configuration coach IA principal
│   └── {specialtyId}                   # Coachs IA spécialisés
├── chats/
│   └── {chatId}/
│       └── messages/
│           └── {messageId}             # Messages de chat (humains + IA)
├── ai-conversations/
│   └── {userId}/
│       └── {conversationId}/
│           └── messages/
│               └── {messageId}         # Messages IA dédiés
└── notifications/
    └── {notificationId}                # Notifications push
```

### 📸 Firebase Storage - Gestion des Images

#### Configuration Storage
```typescript
// services/firebase/storage.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Upload d'image de profil
export const uploadProfileImage = async (userId: string, imageUri: string) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    const imageRef = ref(storage, `users/${userId}/profile/profile.jpg`);
    await uploadBytes(imageRef, blob);
    
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    throw new Error('Erreur upload image: ' + error.message);
  }
};

// Upload d'images d'exercices
export const uploadExerciseImage = async (exerciseId: string, imageUri: string) => {
  const imageRef = ref(storage, `exercises/${exerciseId}/image.jpg`);
  const response = await fetch(imageUri);
  const blob = await response.blob();
  
  await uploadBytes(imageRef, blob);
  return await getDownloadURL(imageRef);
};

// Upload d'images de recettes
export const uploadRecipeImage = async (recipeId: string, imageUri: string) => {
  const imageRef = ref(storage, `recipes/${recipeId}/image.jpg`);
  const response = await fetch(imageUri);
  const blob = await response.blob();
  
  await uploadBytes(imageRef, blob);
  return await getDownloadURL(imageRef);
};
```

#### Structure Storage
```
Firebase Storage Structure:
├── users/
│   └── {userId}/
│       ├── profile/
│       │   └── profile.jpg              # Photo de profil
│       ├── workout-photos/
│       │   └── {workoutId}.jpg          # Photos d'entraînement
│       └── progress-photos/
│           └── {date}.jpg               # Photos de progression
├── exercises/
│   └── {exerciseId}/
│       ├── image.jpg                    # Image principale
│       ├── video.mp4                    # Vidéo démonstration
│       └── thumbnails/
│           └── thumbnail.jpg            # Miniature
├── recipes/
│   └── {recipeId}/
│       └── image.jpg                    # Image de la recette
├── workouts/
│   └── {workoutId}/
│       └── cover.jpg                    # Image de couverture
└── coaches/
    └── {coachId}/
        └── avatar.jpg                   # Photo du coach
```

### 🤖 Firebase Cloud Functions - Intelligence Artificielle (ChatGPT)

#### Configuration Cloud Functions avec ChatGPT
```typescript
// functions/src/ai-coach.ts
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import OpenAI from 'openai';

// Configuration ChatGPT
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
});

// Traitement des messages avec ChatGPT
export const processAIMessage = onDocumentCreated(
  'ai-conversations/{userId}/{conversationId}/messages/{messageId}',
  async (event) => {
    const messageData = event.data?.data();
    
    if (messageData?.senderType === 'user') {
      // Analyse du contexte utilisateur
      const userContext = await getUserContext(messageData.userId);
      
      // Génération de la réponse avec ChatGPT
      const chatGPTResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Tu es un coach fitness expert français pour l'application RevoFit. 
            Contexte utilisateur: ${JSON.stringify(userContext)}
            Spécialité: ${messageData.context}
            Réponds de manière motivante et professionnelle en français.`
          },
          {
            role: "user",
            content: messageData.content
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });
      
      const aiMessage = chatGPTResponse.choices[0].message.content;
      
      // Sauvegarde de la réponse ChatGPT
      await admin.firestore()
        .collection('ai-conversations')
        .doc(messageData.userId)
        .collection(messageData.conversationId)
        .add({
          content: aiMessage,
          senderType: 'ai',
          senderName: 'Coach IA RevoFit',
          context: messageData.context,
          model: 'gpt-4',
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    }
  }
);

// Génération de recommandations personnalisées avec ChatGPT
export const generateRecommendations = onCall(async (request) => {
  const { userId, type, userData } = request.data;
  
  const prompt = `En tant que coach fitness expert, analyse ces données utilisateur et génère des recommandations personnalisées:
  
  Type de recommandation: ${type}
  Données utilisateur: ${JSON.stringify(userData)}
  
  Génère des conseils concrets et motivants en français pour l'application RevoFit.`;
  
  const chatGPTResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Tu es un coach fitness expert français pour RevoFit. Génère des recommandations personnalisées, motivantes et pratiques."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 800,
    temperature: 0.8
  });
  
  return {
    recommendations: chatGPTResponse.choices[0].message.content,
    model: 'gpt-4',
    timestamp: new Date().toISOString()
  };
});
```

#### Configuration ChatGPT
```typescript
// Configuration des variables d'environnement pour ChatGPT
// .env
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_ORG_ID=org-your-organization-id

// Installation du package OpenAI
// functions/package.json
{
  "dependencies": {
    "openai": "^4.0.0"
  }
}
```

#### Types de Réponses ChatGPT
```typescript
// Types de réponses du coach IA ChatGPT
interface ChatGPTResponse {
  message: string;
  model: 'gpt-4' | 'gpt-3.5-turbo';
  senderName: 'Coach IA RevoFit';
  context: ConversationContext;
  timestamp: FirebaseTimestamp;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Contextes de conversation
type ConversationContext = 
  | 'workout_planning'    // Planification d'entraînements
  | 'nutrition_advice'    // Conseils nutritionnels
  | 'motivation'          // Motivation et encouragement
  | 'form_correction'     // Correction de technique
  | 'goal_setting'        // Définition d'objectifs
  | 'injury_prevention'   // Prévention des blessures
  | 'recovery'            // Récupération et repos
  | 'general'             // Questions générales

// Prompts spécialisés ChatGPT pour RevoFit
const CHATGPT_PROMPTS = {
  system: `Tu es Coach IA RevoFit, un coach fitness expert français pour l'application mobile RevoFit.
  
  PERSONNALITÉ :
  - Motivant et encourageant
  - Professionnel mais accessible
  - Expert en fitness, nutrition et bien-être
  - Réponds toujours en français
  - Utilise des emojis appropriés (🏋️, 💪, 🍎, etc.)
  
  SPÉCIALITÉS :
  - Entraînements personnalisés (musculation, cardio, HIIT, yoga)
  - Conseils nutritionnels et objectifs caloriques
  - Motivation et suivi des progrès
  - Prévention des blessures
  - Récupération et récupération
  
  STYLE DE RÉPONSE :
  - Maximum 3-4 phrases par réponse
  - Concis mais complet
  - Toujours motivant
  - Inclut des conseils pratiques
  - Adapte le ton selon le contexte`,
  
  workout_planning: `Contexte : Planification d'entraînements
  Focus : Créer des programmes adaptés, varier les exercices, progresser graduellement`,
  
  nutrition_advice: `Contexte : Conseils nutritionnels
  Focus : Objectifs caloriques, macronutriments, timing des repas, hydratation`,
  
  motivation: `Contexte : Motivation et encouragement
  Focus : Maintenir la motivation, célébrer les succès, surmonter les obstacles`,
  
  form_correction: `Contexte : Correction de technique
  Focus : Sécurité, efficacité, prévention des blessures, progression`
};
```

### 🔔 Firebase Cloud Messaging - Notifications

#### Configuration FCM
```typescript
// services/firebase/messaging.ts
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from './config';

// Enregistrement du token FCM
export const registerForPushNotifications = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.EXPO_PUBLIC_FCM_VAPID_KEY
    });
    
    // Sauvegarde du token dans Firestore
    await setDoc(doc(firestore, 'users', userId, 'tokens', 'fcm'), {
      token,
      platform: Platform.OS,
      createdAt: serverTimestamp()
    });
    
    return token;
  } catch (error) {
    console.error('Erreur FCM:', error);
  }
};

// Écoute des messages en foreground
export const setupForegroundMessageListener = () => {
  onMessage(messaging, (payload) => {
    // Gestion des notifications en foreground
    console.log('Message reçu:', payload);
  });
};
```

#### Types de Notifications
```typescript
// Types de notifications RevoFit
interface NotificationPayload {
  type: 'workout_reminder' | 'nutrition_goal' | 'coach_message' | 'ai_insight' | 'achievement' | 'streak';
  title: string;
  body: string;
  data?: {
    workoutId?: string;
    coachId?: string;
    achievementId?: string;
    aiInsightType?: 'workout' | 'nutrition' | 'motivation';
  };
}

// Exemples de notifications
const notificationTemplates = {
  workout_reminder: {
    title: "🏋️ Temps d'entraînement !",
    body: "Votre séance {workoutName} vous attend"
  },
  nutrition_goal: {
    title: "🍎 Objectif nutritionnel",
    body: "Il vous reste {calories} calories aujourd'hui"
  },
  coach_message: {
    title: "💬 Nouveau message",
    body: "{coachName} vous a envoyé un message"
  },
  achievement: {
    title: "🏆 Nouveau badge !",
    body: "Félicitations ! Vous avez débloqué {badgeName}"
  },
  streak: {
    title: "🔥 Streak en cours !",
    body: "Vous êtes à {days} jours consécutifs d'entraînement"
  },
  ai_insight: {
    title: "🤖 Insight IA",
    body: "Votre coach IA a une suggestion pour vous : {insight}"
  }
};
```

### 🔄 Synchronisation Temps Réel

#### Listeners Firestore
```typescript
// services/firebase/realtime.ts
import { onSnapshot, query, where, orderBy } from 'firebase/firestore';

// Écoute des changements de profil utilisateur
export const watchUserProfile = (userId: string, callback: (profile: any) => void) => {
  return onSnapshot(
    doc(firestore, 'users', userId, 'profile', 'main'),
    (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    }
  );
};

// Écoute des statistiques quotidiennes
export const watchDailyStats = (userId: string, date: string, callback: (stats: any) => void) => {
  return onSnapshot(
    doc(firestore, 'users', userId, 'dailyStats', date),
    (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    }
  );
};

// Écoute des messages de chat
export const watchChatMessages = (chatId: string, callback: (messages: any[]) => void) => {
  const messagesQuery = query(
    collection(firestore, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};
```

### 🛡️ Règles de Sécurité Firestore

#### Règles de Base
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les utilisateurs
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Sous-collections utilisateur
      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Règles pour les entraînements publics
    match /workouts/templates/{templateId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data().authorId == request.auth.uid);
    }
    
    // Règles pour les exercices
    match /exercises/{exerciseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les chats
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
      }
    }
  }
}
```

### 📊 Analytics et Monitoring

#### Firebase Analytics
```typescript
// services/firebase/analytics.ts
import { getAnalytics, logEvent } from 'firebase/analytics';
import { analytics } from './config';

// Événements personnalisés RevoFit
export const trackWorkoutCompleted = (workoutId: string, duration: number, calories: number) => {
  logEvent(analytics, 'workout_completed', {
    workout_id: workoutId,
    duration_minutes: duration,
    calories_burned: calories,
    timestamp: new Date().toISOString()
  });
};

export const trackNutritionLogged = (mealType: string, calories: number) => {
  logEvent(analytics, 'nutrition_logged', {
    meal_type: mealType,
    calories: calories,
    timestamp: new Date().toISOString()
  });
};

export const trackCoachMessage = (coachId: string, messageType: string) => {
  logEvent(analytics, 'coach_message_sent', {
    coach_id: coachId,
    message_type: messageType,
    timestamp: new Date().toISOString()
  });
};
```

## 🔥 Fonctionnalités Avancées

### Intelligence Artificielle
- **Recommandations** d'entraînements basées sur historique Firestore
- **Suggestions nutritionnelles** selon objectifs stockés
- **Matching coach** optimal selon profil utilisateur
- **Adaptation automatique** de la difficulté

### Temps Réel
- **Chat instantané** avec Firestore Realtime Listeners
- **Notifications push** via Firebase Cloud Messaging
- **Sync multi-appareils** via Firebase Auth + Firestore
- **Updates en temps réel** des statistiques

### Gamification
- **Système de badges** stockés dans Firestore
- **Streaks d'entraînement** calculés en temps réel
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
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Cloud Messaging
EXPO_PUBLIC_FCM_VAPID_KEY=your_vapid_key

# APIs tierces
EXPO_PUBLIC_NUTRITION_API_KEY=your_nutrition_api
EXPO_PUBLIC_BARCODE_API_KEY=your_barcode_api

# Configuration développement
EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true
EXPO_PUBLIC_FIRESTORE_EMULATOR_HOST=localhost
EXPO_PUBLIC_FIRESTORE_EMULATOR_PORT=8080

# Configuration ChatGPT/OpenAI
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
EXPO_PUBLIC_OPENAI_ORG_ID=your_organization_id
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

### 🔥 Déploiement Firebase

#### Configuration Firebase Console
```bash
# Installation Firebase CLI
npm install -g firebase-tools

# Connexion Firebase
firebase login

# Initialisation projet
firebase init

# Déploiement des règles Firestore
firebase deploy --only firestore:rules

# Déploiement des fonctions Cloud
firebase deploy --only functions

# Déploiement des règles Storage
firebase deploy --only storage
```

#### Configuration Firestore
```bash
# Création des collections de base
firebase firestore:import ./data/initial-data.json

# Configuration des index Firestore
# Les index sont automatiquement créés lors des requêtes
# Vérifier dans Firebase Console > Firestore > Index
```

#### Configuration Storage
```bash
# Configuration des règles Storage
# firebase deploy --only storage

# Structure des dossiers Storage
# - users/{userId}/profile/
# - users/{userId}/workout-photos/
# - exercises/{exerciseId}/
# - recipes/{recipeId}/
# - workouts/{workoutId}/
# - coaches/{coachId}/
```

#### Configuration Cloud Messaging
```bash
# Configuration FCM pour iOS
# 1. Télécharger GoogleService-Info.plist
# 2. Ajouter dans ios/RevoFit/
# 3. Configurer dans Xcode

# Configuration FCM pour Android
# 1. Télécharger google-services.json
# 2. Ajouter dans android/app/
# 3. Configurer dans build.gradle
```

### 📱 Build Production (Yarn + Expo + Firebase)

#### Build iOS
```bash
# Configuration Firebase iOS
npx expo install expo-firebase-core

# Build iOS avec Firebase
yarn build:ios

# Test sur TestFlight
npx expo upload:ios
```

#### Build Android
```bash
# Configuration Firebase Android
npx expo install expo-firebase-core

# Build Android avec Firebase
yarn build:android

# Test sur Play Console
npx expo upload:android
```

#### OTA Updates
```bash
# Updates OTA avec Firebase
npx expo publish

# Vérification des updates
npx expo publish:check
```

### 🧪 Tests et Qualité
```bash
# Tests unitaires
yarn test

# Linting
yarn lint

# Vérification TypeScript
yarn type-check

# Tests Firebase (émulateurs)
firebase emulators:exec --only firestore,storage "yarn test"
```

### 📊 Monitoring Production

#### Firebase Analytics
```typescript
// Configuration Analytics en production
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

// Tracking des erreurs
export const trackError = (error: Error, context: string) => {
  logEvent(analytics, 'error_occurred', {
    error_message: error.message,
    error_context: context,
    timestamp: new Date().toISOString()
  });
};
```

#### Firebase Performance
```typescript
// Monitoring des performances
import { getPerformance, trace } from 'firebase/performance';

const perf = getPerformance();

// Trace des opérations critiques
export const traceWorkoutLoad = () => {
  const trace = trace(perf, 'workout_load_time');
  trace.start();
  
  // Chargement de l'entraînement
  return trace.stop();
};
```

### App Stores
- **iOS** : TestFlight → App Store
- **Android** : Play Console
- **Updates OTA** via Expo pour corrections rapides
- **Firebase** : Backend complet avec monitoring

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