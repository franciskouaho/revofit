/**
 * Script pour ajouter des données nutritionnelles d'exemple
 * RevoFit - Ajout de données de test pour la nutrition
 */

import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore';

// Configuration Firebase (utilise la même que dans l'app)
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Données d'exemple pour les objectifs nutritionnels
const sampleNutritionGoals = [
  {
    userId: 'test-user-1',
    calories: 2200,
    protein: 150,
    carbs: 250,
    fats: 80,
    fiber: 30,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
];

// Données d'exemple pour les repas
const sampleMeals = [
  {
    userId: 'test-user-1',
    name: 'Omelette aux épinards',
    category: 'breakfast',
    calories: 320,
    protein: 22,
    carbs: 8,
    fats: 24,
    fiber: 3,
    date: new Date().toISOString().split('T')[0],
    time: '08:30',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'test-user-1',
    name: 'Salade de quinoa et poulet',
    category: 'lunch',
    calories: 450,
    protein: 35,
    carbs: 42,
    fats: 18,
    fiber: 6,
    date: new Date().toISOString().split('T')[0],
    time: '13:00',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'test-user-1',
    name: 'Smoothie protéiné',
    category: 'snack',
    calories: 180,
    protein: 25,
    carbs: 15,
    fats: 4,
    fiber: 2,
    date: new Date().toISOString().split('T')[0],
    time: '16:30',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'test-user-1',
    name: 'Saumon grillé avec légumes',
    category: 'dinner',
    calories: 380,
    protein: 32,
    carbs: 18,
    fats: 22,
    fiber: 8,
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
];

// Données d'exemple pour les recettes
const sampleRecipes = [
  {
    name: 'Bowl protéiné quinoa',
    description: 'Un bowl nutritif avec quinoa, légumes et protéines',
    category: 'lunch',
    calories: 420,
    protein: 28,
    carbs: 45,
    fats: 12,
    fiber: 8,
    prepTime: 25,
    difficulty: 'easy',
    servings: 2,
    ingredients: [
      '1 tasse de quinoa',
      '200g de poulet grillé',
      '1 avocat',
      '1 tomate',
      '1/2 concombre',
      '2 c. à soupe d\'huile d\'olive',
      'Sel et poivre'
    ],
    instructions: [
      'Cuire le quinoa selon les instructions',
      'Couper le poulet en dés',
      'Préparer les légumes en cubes',
      'Mélanger tous les ingrédients',
      'Assaisonner avec l\'huile d\'olive'
    ],
    tags: ['Végétarien', 'Riche en protéines', 'Sans gluten'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: 'Smoothie vert énergisant',
    description: 'Un smoothie vert plein d\'énergie pour commencer la journée',
    category: 'breakfast',
    calories: 180,
    protein: 15,
    carbs: 22,
    fats: 4,
    fiber: 5,
    prepTime: 5,
    difficulty: 'easy',
    servings: 1,
    ingredients: [
      '1 banane',
      '1 poignée d\'épinards',
      '1 c. à soupe de poudre de protéine',
      '200ml de lait d\'amande',
      '1 c. à café de miel'
    ],
    instructions: [
      'Mettre tous les ingrédients dans un blender',
      'Mixer pendant 30 secondes',
      'Verser dans un verre',
      'Servir immédiatement'
    ],
    tags: ['Vegan', 'Rapide', 'Énergisant'],
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: 'Saumon grillé légumes',
    description: 'Saumon grillé accompagné de légumes de saison',
    category: 'dinner',
    calories: 380,
    protein: 35,
    carbs: 18,
    fats: 22,
    fiber: 6,
    prepTime: 35,
    difficulty: 'medium',
    servings: 2,
    ingredients: [
      '2 filets de saumon',
      '200g de brocolis',
      '1 courgette',
      '1 carotte',
      '2 c. à soupe d\'huile d\'olive',
      'Herbes de Provence',
      'Sel et poivre'
    ],
    instructions: [
      'Préchauffer le four à 200°C',
      'Préparer les légumes en morceaux',
      'Assaisonner le saumon et les légumes',
      'Enfourner pendant 20 minutes',
      'Servir chaud'
    ],
    tags: ['Oméga-3', 'Riche en protéines', 'Anti-inflammatoire'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
];

async function addSampleNutritionData() {
  try {
    console.log('🍽️ Ajout des données nutritionnelles d\'exemple...');

    // Ajouter les objectifs nutritionnels
    for (const goal of sampleNutritionGoals) {
      await addDoc(collection(db, 'nutritionGoals'), goal);
      console.log('✅ Objectif nutritionnel ajouté');
    }

    // Ajouter les repas
    for (const meal of sampleMeals) {
      await addDoc(collection(db, 'meals'), meal);
      console.log('✅ Repas ajouté:', meal.name);
    }

    // Ajouter les recettes
    for (const recipe of sampleRecipes) {
      await addDoc(collection(db, 'recipes'), recipe);
      console.log('✅ Recette ajoutée:', recipe.name);
    }

    console.log('🎉 Toutes les données nutritionnelles ont été ajoutées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données nutritionnelles:', error);
  }
}

// Exécuter le script
addSampleNutritionData();
