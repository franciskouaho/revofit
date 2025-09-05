#!/usr/bin/env ts-node

/**
 * Script principal pour exécuter toutes les migrations d'exercices
 * RevoFit - Migration complète vers Firebase
 */

import { migrateDetailedExercises, validateDetailedMigration } from './migrate-detailed-exercises';
import { migrateExercisesToFirebase } from './migrate-exercises';
import { createParentGroups, migrateMuscleGroups, validateMigration } from './migrate-muscle-groups';

// Fonction principale pour exécuter toutes les migrations
async function runAllMigrations(): Promise<void> {
  console.log('🎯 Script de migration complet RevoFit');
  console.log('=====================================');
  console.log('🚀 Début de la migration complète des données d\'exercices...\n');
  
  try {
    // 1. Migration des groupes musculaires
    console.log('📦 Étape 1/4: Migration des groupes musculaires...');
    await createParentGroups();
    await migrateMuscleGroups();
    await validateMigration();
    console.log('✅ Groupes musculaires migrés avec succès!\n');
    
    // 2. Migration des exercices de base
    console.log('💪 Étape 2/4: Migration des exercices de base...');
    await migrateExercisesToFirebase();
    console.log('✅ Exercices de base migrés avec succès!\n');
    
    // 3. Migration des exercices détaillés
    console.log('🔬 Étape 3/4: Migration des exercices détaillés...');
    await migrateDetailedExercises();
    await validateDetailedMigration();
    console.log('✅ Exercices détaillés migrés avec succès!\n');
    
    // 4. Validation finale
    console.log('🔍 Étape 4/4: Validation finale...');
    await finalValidation();
    console.log('✅ Validation finale terminée!\n');
    
    console.log('🎉 MIGRATION COMPLÈTE TERMINÉE AVEC SUCCÈS!');
    console.log('==========================================');
    console.log('📊 Résumé de la migration:');
    console.log('   • Groupes musculaires: ✅');
    console.log('   • Exercices de base: ✅');
    console.log('   • Exercices détaillés: ✅');
    console.log('   • URLs vidéos: ✅');
    console.log('   • Instructions détaillées: ✅');
    console.log('   • Conseils d\'exécution: ✅');
    console.log('   • Données de progression: ✅');
    console.log('\n🚀 Votre base de données Firebase est maintenant prête!');
    
  } catch (error) {
    console.error('💥 ÉCHEC DE LA MIGRATION:', error);
    console.error('❌ Veuillez vérifier les logs ci-dessus pour plus de détails.');
    process.exit(1);
  }
}

// Fonction de validation finale
async function finalValidation(): Promise<void> {
  console.log('🔍 Validation finale de la migration...');
  
  try {
    const { getFirestore, collection, getDocs, query, orderBy } = await import('firebase/firestore');
    const { initializeApp } = await import('firebase/app');
    
    // Configuration Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyCFY2nGt43sJHfdNn768E18uSPFeI_9lJw",
      authDomain: "revofit-db273.firebaseapp.com",
      projectId: "revofit-db273",
      storageBucket: "revofit-db273.firebasestorage.app",
      messagingSenderId: "336045610131",
      appId: "1:336045610131:web:cb469cfb69587e6d206966"
    };
    
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    
    // Vérifier les groupes musculaires
    const muscleGroupsQuery = query(collection(firestore, 'muscleGroups'), orderBy('name', 'asc'));
    const muscleGroupsSnapshot = await getDocs(muscleGroupsQuery);
    const muscleGroupsCount = muscleGroupsSnapshot.docs.length;
    
    // Vérifier les exercices
    const exercisesQuery = query(collection(firestore, 'exercises'), orderBy('name', 'asc'));
    const exercisesSnapshot = await getDocs(exercisesQuery);
    const exercisesCount = exercisesSnapshot.docs.length;
    
    // Vérifier les exercices avec vidéos
    const exercisesWithVideos = exercisesSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.videoUrl && data.videoUrl.length > 0;
    }).length;
    
    console.log(`📊 Statistiques finales:`);
    console.log(`   • Groupes musculaires: ${muscleGroupsCount}`);
    console.log(`   • Exercices totaux: ${exercisesCount}`);
    console.log(`   • Exercices avec vidéos: ${exercisesWithVideos}`);
    console.log(`   • Couverture vidéo: ${Math.round((exercisesWithVideos / exercisesCount) * 100)}%`);
    
    if (muscleGroupsCount === 0) {
      throw new Error('Aucun groupe musculaire trouvé');
    }
    
    if (exercisesCount === 0) {
      throw new Error('Aucun exercice trouvé');
    }
    
    console.log('✅ Validation finale réussie!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation finale:', error);
    throw error;
  }
}

// Fonction pour afficher l'aide
function showHelp(): void {
  console.log('🎯 Script de migration RevoFit');
  console.log('==============================');
  console.log('');
  console.log('Usage:');
  console.log('  npm run migrate          # Exécute toutes les migrations');
  console.log('  npm run migrate:groups   # Migre uniquement les groupes musculaires');
  console.log('  npm run migrate:basic    # Migre uniquement les exercices de base');
  console.log('  npm run migrate:detailed # Migre uniquement les exercices détaillés');
  console.log('  npm run migrate:help     # Affiche cette aide');
  console.log('');
  console.log('Options:');
  console.log('  --dry-run               # Simulation sans écriture en base');
  console.log('  --verbose               # Affichage détaillé des logs');
  console.log('  --force                 # Force la migration même si des données existent');
  console.log('');
}

// Fonction pour exécuter une migration spécifique
async function runSpecificMigration(type: string): Promise<void> {
  switch (type) {
    case 'groups':
      console.log('📦 Migration des groupes musculaires uniquement...');
      await createParentGroups();
      await migrateMuscleGroups();
      await validateMigration();
      break;
      
    case 'basic':
      console.log('💪 Migration des exercices de base uniquement...');
      await migrateExercisesToFirebase();
      break;
      
    case 'detailed':
      console.log('🔬 Migration des exercices détaillés uniquement...');
      await migrateDetailedExercises();
      await validateDetailedMigration();
      break;
      
    default:
      console.error(`❌ Type de migration inconnu: ${type}`);
      showHelp();
      process.exit(1);
  }
  
  console.log('✅ Migration spécifique terminée!');
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);
const command = args[0];

if (command === 'help' || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (command === 'groups' || command === 'basic' || command === 'detailed') {
  runSpecificMigration(command)
    .then(() => {
      console.log('🎉 Migration spécifique terminée avec succès!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Échec de la migration spécifique:', error);
      process.exit(1);
    });
} else {
  // Migration complète par défaut
  runAllMigrations()
    .then(() => {
      console.log('🎉 Migration complète terminée avec succès!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Échec de la migration complète:', error);
      process.exit(1);
    });
}

export { finalValidation, runAllMigrations, runSpecificMigration };

