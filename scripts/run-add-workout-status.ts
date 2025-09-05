/**
 * Script d'exécution pour ajouter les données de statut d'entraînement
 * RevoFit - Exécution rapide
 */

import { addWorkoutStatusData } from './add-workout-status';

console.log('🚀 Ajout des données de statut d\'entraînement...\n');

addWorkoutStatusData()
  .then(() => {
    console.log('\n✅ Script terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script échoué:', error);
    process.exit(1);
  });
