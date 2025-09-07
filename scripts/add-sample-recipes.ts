/**
 * Script pour ajouter des recettes d'exemple dans Firebase
 * RevoFit - Ajout de recettes pour les tests
 */

import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { firestore } from '../services/firebase/config';

const sampleRecipes = [
  // Petit-déjeuner
  {
    name: 'Bowl protéiné quinoa',
    description: 'Bowl énergisant avec quinoa, fruits et noix',
    category: 'breakfast',
    calories: 420,
    protein: 28,
    carbs: 45,
    fats: 12,
    fiber: 8,
    prepTime: 25,
    difficulty: 'easy',
    servings: 1,
    ingredients: [
      '100g de quinoa cuit',
      '1 banane',
      '50g de myrtilles',
      '20g d\'amandes',
      '1 c.à.s de miel',
      '1 c.à.s de graines de chia'
    ],
    instructions: [
      'Cuire le quinoa selon les instructions',
      'Couper la banane en rondelles',
      'Mélanger le quinoa avec les fruits',
      'Ajouter les amandes et les graines de chia',
      'Arroser de miel'
    ],
    tags: ['Végétarien', 'Riche en protéines', 'Sans gluten', 'Énergisant'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system'
  },
  {
    name: 'Smoothie vert énergisant',
    description: 'Smoothie vert riche en vitamines et minéraux',
    category: 'breakfast',
    calories: 180,
    protein: 15,
    carbs: 22,
    fats: 4,
    fiber: 6,
    prepTime: 5,
    difficulty: 'easy',
    servings: 1,
    ingredients: [
      '1 banane',
      '1 poignée d\'épinards',
      '1 kiwi',
      '200ml de lait d\'amande',
      '1 c.à.s de spiruline',
      '1 c.à.s de miel'
    ],
    instructions: [
      'Laver les épinards',
      'Éplucher la banane et le kiwi',
      'Mettre tous les ingrédients dans un blender',
      'Mixer jusqu\'à obtenir une texture lisse',
      'Servir immédiatement'
    ],
    tags: ['Vegan', 'Rapide', 'Énergisant', 'Riche en vitamines'],
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system'
  },
  {
    name: 'Omelette aux légumes',
    description: 'Omelette légère et colorée aux légumes de saison',
    category: 'breakfast',
    calories: 280,
    protein: 22,
    carbs: 8,
    fats: 18,
    fiber: 3,
    prepTime: 15,
    difficulty: 'easy',
    servings: 1,
    ingredients: [
      '3 œufs',
      '50g de tomates cerises',
      '30g d\'épinards',
      '20g de fromage râpé',
      '1 c.à.s d\'huile d\'olive',
      'Herbes de Provence'
    ],
    instructions: [
      'Battre les œufs en omelette',
      'Couper les tomates en deux',
      'Faire revenir les épinards dans l\'huile',
      'Ajouter les tomates et les œufs',
      'Cuire à feu doux',
      'Parsemer de fromage et d\'herbes'
    ],
    tags: ['Riche en protéines', 'Léger', 'Rapide', 'Équilibré'],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system'
  },

  // Déjeuner
  {
    name: 'Salade de pois chiches',
    description: 'Salade complète et rassasiante aux pois chiches',
    category: 'lunch',
    calories: 320,
    protein: 18,
    carbs: 35,
    fats: 12,
    fiber: 12,
    prepTime: 20,
    difficulty: 'easy',
    servings: 1,
    ingredients: [
      '150g de pois chiches cuits',
      '1 tomate',
      '1/2 concombre',
      '50g de feta',
      '1/4 d\'oignon rouge',
      '2 c.à.s d\'huile d\'olive',
      'Jus de citron',
      'Persil frais'
    ],
    instructions: [
      'Rincer et égoutter les pois chiches',
      'Couper les légumes en dés',
      'Émietter la feta',
      'Mélanger tous les ingrédients',
      'Arroser d\'huile d\'olive et de jus de citron',
      'Parsemer de persil'
    ],
    tags: ['Végétarien', 'Fibres', 'Rapide', 'Méditerranéen'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system'
  },
  {
    name: 'Saumon grillé légumes',
    description: 'Filet de saumon grillé avec légumes rôtis',
    category: 'lunch',
    calories: 380,
    protein: 35,
    carbs: 18,
    fats: 22,
    fiber: 6,
    prepTime: 35,
    difficulty: 'medium',
    servings: 1,
    ingredients: [
      '150g de filet de saumon',
      '200g de légumes mélangés',
      '1 c.à.s d\'huile d\'olive',
      'Herbes de Provence',
      'Sel et poivre',
      'Jus de citron'
    ],
    instructions: [
      'Préchauffer le four à 200°C',
      'Assaisonner le saumon',
      'Disposer les légumes sur une plaque',
      'Arroser d\'huile d\'olive',
      'Enfourner 25 minutes',
      'Servir avec du jus de citron'
    ],
    tags: ['Oméga-3', 'Riche en protéines', 'Anti-inflammatoire', 'Sain'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system'
  },
  {
    name: 'Bowl Buddha aux légumes',
    description: 'Bowl coloré et nutritif aux légumes de saison',
    category: 'lunch',
    calories: 350,
    protein: 16,
    carbs: 42,
    fats: 14,
    fiber: 10,
    prepTime: 30,
    difficulty: 'medium',
    servings: 1,
    ingredients: [
      '80g de quinoa cuit',
      '100g de patate douce',
      '50g de brocolis',
      '1/2 avocat',
      '50g de chou kale',
      '1 c.à.s de tahini',
      'Jus de citron',
      'Graines de sésame'
    ],
    instructions: [
      'Cuire le quinoa',
      'Rôtir la patate douce au four',
      'Cuire les brocolis à la vapeur',
      'Préparer la sauce tahini',
      'Disposer tous les ingrédients dans un bol',
      'Arroser de sauce et parsemer de graines'
    ],
    tags: ['Vegan', 'Équilibré', 'Riche en fibres', 'Coloré'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system'
  },

  // Collation
  {
    name: 'Energy balls aux dattes',
    description: 'Boules énergétiques aux dattes et noix',
    category: 'snack',
    calories: 120,
    protein: 4,
    carbs: 18,
    fats: 5,
    fiber: 3,
    prepTime: 15,
    difficulty: 'easy',
    servings: 1,
    ingredients: [
      '3 dattes dénoyautées',
      '20g d\'amandes',
      '1 c.à.s de cacao en poudre',
      '1 c.à.s de noix de coco râpée',
      '1 c.à.s de graines de chia'
    ],
    instructions: [
      'Mixer les dattes et les amandes',
      'Ajouter le cacao et la noix de coco',
      'Former des petites boules',
      'Rouler dans les graines de chia',
      'Réserver au frais 30 minutes'
    ],
    tags: ['Vegan', 'Sans cuisson', 'Énergisant', 'Rapide'],
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system'
  },
  {
    name: 'Yaourt grec aux fruits',
    description: 'Yaourt grec crémeux avec fruits frais',
    category: 'snack',
    calories: 150,
    protein: 12,
    carbs: 20,
    fats: 3,
    fiber: 4,
    prepTime: 5,
    difficulty: 'easy',
    servings: 1,
    ingredients: [
      '150g de yaourt grec',
      '50g de fruits rouges',
      '1 c.à.s de miel',
      '1 c.à.s de noix de coco râpée',
      'Quelques feuilles de menthe'
    ],
    instructions: [
      'Verser le yaourt dans un bol',
      'Ajouter les fruits rouges',
      'Arroser de miel',
      'Parsemer de noix de coco',
      'Décorer avec la menthe'
    ],
    tags: ['Riche en protéines', 'Rapide', 'Frais', 'Léger'],
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system'
  },

  // Dîner
  {
    name: 'Poulet aux herbes et légumes',
    description: 'Filet de poulet aux herbes avec légumes rôtis',
    category: 'dinner',
    calories: 320,
    protein: 38,
    carbs: 15,
    fats: 12,
    fiber: 5,
    prepTime: 40,
    difficulty: 'medium',
    servings: 1,
    ingredients: [
      '150g de filet de poulet',
      '200g de légumes mélangés',
      '2 c.à.s d\'huile d\'olive',
      'Herbes de Provence',
      'Ail en poudre',
      'Sel et poivre'
    ],
    instructions: [
      'Préchauffer le four à 180°C',
      'Assaisonner le poulet',
      'Disposer les légumes dans un plat',
      'Arroser d\'huile d\'olive',
      'Enfourner 35 minutes',
      'Servir chaud'
    ],
    tags: ['Riche en protéines', 'Faible en calories', 'Équilibré', 'Sain'],
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system'
  },
  {
    name: 'Curry de légumes au lait de coco',
    description: 'Curry végétarien épicé au lait de coco',
    category: 'dinner',
    calories: 280,
    protein: 12,
    carbs: 35,
    fats: 14,
    fiber: 8,
    prepTime: 45,
    difficulty: 'medium',
    servings: 1,
    ingredients: [
      '200g de légumes mélangés',
      '100ml de lait de coco',
      '1 c.à.s de curry en poudre',
      '1/2 oignon',
      '1 gousse d\'ail',
      '1 c.à.s d\'huile de coco',
      'Riz basmati'
    ],
    instructions: [
      'Faire revenir l\'oignon et l\'ail',
      'Ajouter les épices',
      'Incorporer les légumes',
      'Verser le lait de coco',
      'Laisser mijoter 30 minutes',
      'Servir avec du riz'
    ],
    tags: ['Vegan', 'Épicé', 'Riche en saveurs', 'Réchauffable'],
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
    isPublic: true,
    createdBy: 'system'
  }
];

async function addSampleRecipes() {
  try {
    console.log('🍽️ Ajout des recettes d\'exemple...');
    
    const recipesCollection = collection(firestore, 'recipes');
    
    for (const recipe of sampleRecipes) {
      await addDoc(recipesCollection, {
        ...recipe,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`✅ Recette ajoutée: ${recipe.name}`);
    }
    
    console.log('🎉 Toutes les recettes ont été ajoutées avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des recettes:', error);
  }
}

export { addSampleRecipes };
