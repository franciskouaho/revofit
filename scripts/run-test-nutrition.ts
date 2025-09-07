/**
 * Script d'exécution pour tester la fonctionnalité nutrition
 * RevoFit - Exécution des tests nutritionnels
 */

import { testNutritionServices } from './test-nutrition';

console.log('🚀 Démarrage des tests nutritionnels...\n');

testNutritionServices()
  .then(() => {
    console.log('\n✅ Tests terminés avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors des tests:', error);
    process.exit(1);
  });
