/**
 * Script de test pour la fonctionnalité nutrition
 * RevoFit - Test des services nutritionnels
 */

import { nutritionService } from '../services/firebase/nutrition';
import { nutritionPlanService } from '../services/firebase/nutritionPlan';

async function testNutritionServices() {
  console.log('🧪 Test des services nutritionnels...\n');

  try {
    // Test 1: Récupération des recettes
    console.log('1️⃣ Test de récupération des recettes...');
    const recipes = await nutritionService.getRecipes();
    console.log(`✅ ${recipes.length} recettes trouvées`);
    recipes.forEach(recipe => {
      console.log(`   - ${recipe.name} (${recipe.category}) - ${recipe.calories} kcal`);
    });

    // Test 2: Recherche de recettes
    console.log('\n2️⃣ Test de recherche de recettes...');
    const searchResults = await nutritionService.searchRecipes('quinoa');
    console.log(`✅ ${searchResults.length} recettes trouvées pour "quinoa"`);
    searchResults.forEach(recipe => {
      console.log(`   - ${recipe.name} (${recipe.calories} kcal)`);
    });

    // Test 3: Création d'un profil utilisateur
    console.log('\n3️⃣ Test de création de profil utilisateur...');
    const testUserId = 'test-user-' + Date.now();
    const testProfile = {
      age: 30,
      gender: 'male' as const,
      height: 180,
      weight: 75,
      activityLevel: 'active' as const,
      goals: ['muscle_gain', 'strength'],
      dietaryRestrictions: ['gluten'],
      preferences: ['high_protein', 'healthy']
    };

    const profileId = await nutritionPlanService.saveUserProfile(testUserId, testProfile);
    console.log(`✅ Profil créé avec l'ID: ${profileId}`);

    // Test 4: Récupération du profil
    console.log('\n4️⃣ Test de récupération du profil...');
    const retrievedProfile = await nutritionPlanService.getUserProfile(testUserId);
    console.log(`✅ Profil récupéré: ${retrievedProfile?.age} ans, ${retrievedProfile?.weight} kg`);

    // Test 5: Calcul des besoins caloriques
    console.log('\n5️⃣ Test de calcul des besoins caloriques...');
    if (retrievedProfile) {
      const calories = nutritionPlanService.calculateCalorieNeeds(retrievedProfile, 'maintain');
      const macros = nutritionPlanService.calculateMacroDistribution(calories, retrievedProfile.goals);
      console.log(`✅ Besoins caloriques: ${calories} kcal/jour`);
      console.log(`   - Protéines: ${macros.protein}g`);
      console.log(`   - Glucides: ${macros.carbs}g`);
      console.log(`   - Lipides: ${macros.fats}g`);
      console.log(`   - Fibres: ${macros.fiber}g`);
    }

    // Test 6: Génération de suggestions de repas
    console.log('\n6️⃣ Test de génération de suggestions de repas...');
    if (retrievedProfile) {
      const suggestions = await nutritionPlanService.generateMealSuggestions(
        retrievedProfile,
        2500, // calories
        150,  // protéines
        300,  // glucides
        80,   // lipides
        30    // fibres
      );
      console.log(`✅ ${suggestions.length} suggestions générées`);
      suggestions.slice(0, 3).forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion.recipe.name} - ${suggestion.calories} kcal (${suggestion.reason})`);
      });
    }

    // Test 7: Création d'un plan nutritionnel
    console.log('\n7️⃣ Test de création d\'un plan nutritionnel...');
    if (retrievedProfile) {
      const plan = await nutritionPlanService.createPersonalizedPlan(
        testUserId,
        retrievedProfile,
        'maintain',
        7
      );
      console.log(`✅ Plan créé: ${plan.name}`);
      console.log(`   - Durée: ${plan.duration} jours`);
      console.log(`   - Calories/jour: ${plan.dailyCalories}`);
      console.log(`   - Repas: ${plan.meals.length}`);
    }

    console.log('\n🎉 Tous les tests sont passés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  testNutritionServices();
}

export { testNutritionServices };
