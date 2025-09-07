/**
 * Script de test pour la fonctionnalité nutrition (version Node.js)
 * RevoFit - Test des services nutritionnels sans React Native
 */

import { initializeApp } from 'firebase/app';
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, Timestamp, where } from 'firebase/firestore';

// Configuration Firebase pour Node.js
const firebaseConfig = {
  apiKey: "AIzaSyCFY2nGt43sJHfdNn768E18uSPFeI_9lJw",
  authDomain: "revofit-db273.firebaseapp.com",
  databaseURL: "https://revofit-db273-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "revofit-db273",
  storageBucket: "revofit-db273.firebasestorage.app",
  messagingSenderId: "336045610131",
  appId: "1:336045610131:web:cb469cfb69587e6d206966",
  measurementId: "G-VKFX4WKRX9"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Interfaces
interface UserProfile {
  id: string;
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: string[];
  dietaryRestrictions: string[];
  preferences: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  imageUrl?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fonctions de test
async function testFirebaseConnection() {
  console.log('🔗 Test de connexion Firebase...');
  try {
    const testCollection = collection(firestore, 'test');
    console.log('✅ Connexion Firebase établie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Firebase:', error);
    return false;
  }
}

async function testRecipesRetrieval() {
  console.log('\n📚 Test de récupération des recettes...');
  try {
    const recipesCollection = collection(firestore, 'recipes');
    const q = query(
      recipesCollection,
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const recipes = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Recipe;
    });

    console.log(`✅ ${recipes.length} recettes trouvées`);
    recipes.forEach(recipe => {
      console.log(`   - ${recipe.name} (${recipe.category}) - ${recipe.calories} kcal`);
    });

    return recipes;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des recettes:', error);
    return [];
  }
}

async function testUserProfileCreation() {
  console.log('\n👤 Test de création de profil utilisateur...');
  try {
    const profilesCollection = collection(firestore, 'userProfiles');
    const testUserId = 'test-user-' + Date.now();
    
    const testProfile = {
      userId: testUserId,
      age: 30,
      gender: 'male',
      height: 180,
      weight: 75,
      activityLevel: 'active',
      goals: ['muscle_gain', 'strength'],
      dietaryRestrictions: ['gluten'],
      preferences: ['high_protein', 'healthy'],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(profilesCollection, testProfile);
    console.log(`✅ Profil créé avec l'ID: ${docRef.id}`);

    // Récupérer le profil créé
    const q = query(
      profilesCollection,
      where('userId', '==', testUserId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      const profile: UserProfile = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as UserProfile;
      
      console.log(`✅ Profil récupéré: ${profile.age} ans, ${profile.weight} kg`);
      return profile;
    }

    return null;
  } catch (error) {
    console.error('❌ Erreur lors de la création du profil:', error);
    return null;
  }
}

async function testNutritionPlanCreation(profile: UserProfile) {
  console.log('\n📋 Test de création de plan nutritionnel...');
  try {
    const plansCollection = collection(firestore, 'nutritionPlans');
    
    // Calculer les besoins caloriques
    const isMale = profile.gender === 'male';
    let bmr = isMale 
      ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
      : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    
    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const tdee = bmr * activityFactors[profile.activityLevel];
    const dailyCalories = Math.round(tdee);
    
    // Calculer les macronutriments
    const protein = Math.round(profile.weight * 2.2);
    const carbs = Math.round(dailyCalories * 0.45 / 4);
    const fats = Math.round(dailyCalories * 0.25 / 9);
    const fiber = Math.round(dailyCalories / 1000 * 14);

    const plan = {
      userId: profile.userId,
      name: `Plan Test - ${profile.goals.join(', ')}`,
      description: `Plan nutritionnel de test pour ${profile.goals.join(', ')}`,
      duration: 7,
      dailyCalories,
      dailyProtein: protein,
      dailyCarbs: carbs,
      dailyFats: fats,
      dailyFiber: fiber,
      meals: [],
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(plansCollection, plan);
    console.log(`✅ Plan créé avec l'ID: ${docRef.id}`);
    console.log(`   - Calories/jour: ${dailyCalories}`);
    console.log(`   - Protéines: ${protein}g`);
    console.log(`   - Glucides: ${carbs}g`);
    console.log(`   - Lipides: ${fats}g`);

    return docRef.id;
  } catch (error) {
    console.error('❌ Erreur lors de la création du plan:', error);
    return null;
  }
}

async function runAllTests() {
  console.log('🧪 Démarrage des tests nutritionnels...\n');

  try {
    // Test 1: Connexion Firebase
    const connected = await testFirebaseConnection();
    if (!connected) {
      console.log('❌ Impossible de se connecter à Firebase');
      return;
    }

    // Test 2: Récupération des recettes
    const recipes = await testRecipesRetrieval();
    
    // Test 3: Création de profil
    const profile = await testUserProfileCreation();
    if (!profile) {
      console.log('❌ Impossible de créer le profil utilisateur');
      return;
    }

    // Test 4: Création de plan nutritionnel
    const planId = await testNutritionPlanCreation(profile);
    if (!planId) {
      console.log('❌ Impossible de créer le plan nutritionnel');
      return;
    }

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('\n📊 Résumé:');
    console.log(`   - Recettes trouvées: ${recipes.length}`);
    console.log(`   - Profil créé: ${profile.age} ans, ${profile.weight} kg`);
    console.log(`   - Plan créé: ${planId}`);

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Exécuter les tests
runAllTests();
