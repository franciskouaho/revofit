/**
 * Script pour configurer toutes les données Firebase d'exemple
 * Ajoute les exercices et les workouts d'exemple
 */

import { addSampleExercises } from './add-sample-exercises';
import { addSampleWorkouts } from './add-sample-workouts';

async function setupFirebaseData() {
  try {
    console.log("🚀 Configuration des données Firebase d'exemple...");
    
    console.log("\n📝 Ajout des exercices...");
    await addSampleExercises();
    
    console.log("\n🏋️ Ajout des workouts...");
    await addSampleWorkouts();
    
    console.log("\n🎉 Configuration terminée avec succès !");
    console.log("✨ Vous pouvez maintenant tester l'application avec des données d'exemple.");
  } catch (error) {
    console.error("❌ Erreur lors de la configuration:", error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  setupFirebaseData().then(() => {
    console.log("Script terminé");
    process.exit(0);
  });
}

export { setupFirebaseData };
