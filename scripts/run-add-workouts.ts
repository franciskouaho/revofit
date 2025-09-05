/**
 * Script pour exécuter l'ajout des workouts d'exemple
 */

import { addSampleWorkouts } from './add-sample-workouts';

async function main() {
  console.log("🔥 Démarrage de l'ajout des workouts d'exemple...");
  await addSampleWorkouts();
  console.log("✨ Script terminé avec succès !");
}

main().catch(console.error);
