/**
 * Script pour exécuter l'ajout des exercices d'exemple
 */

import { addSampleExercises } from './add-sample-exercises';

async function main() {
  console.log("🔥 Démarrage de l'ajout des exercices d'exemple...");
  await addSampleExercises();
  console.log("✨ Script terminé avec succès !");
}

main().catch(console.error);
