/**
 * Script pour ajouter des données de statut d'entraînement de test
 * RevoFit - Données de test pour le statut
 */

import { WorkoutStatusService } from '../services/firebase/workoutStatus';

async function addWorkoutStatusData() {
  console.log('🏋️ Ajout des données de statut d\'entraînement...\n');

  try {
    // ID utilisateur de test
    const testUserId = 'test-user-123';

    // Créer un statut d'entraînement de test
    console.log('1️⃣ Création du statut d\'entraînement...');
    const status = await WorkoutStatusService.createDefaultStatus(testUserId);
    
    if (status) {
      console.log('✅ Statut créé avec succès:');
      console.log(`   • Strikes: ${status.strikes}`);
      console.log(`   • Jour actuel: ${status.currentDay}`);
      console.log(`   • Message: ${status.workoutMessage}`);
      console.log(`   • Prochains jours: ${status.upcomingDays.length}`);
    }

    // Mettre à jour le statut avec des données plus réalistes
    console.log('\n2️⃣ Mise à jour du statut...');
    const updateSuccess = await WorkoutStatusService.updateWorkoutStatus(testUserId, {
      strikes: 21,
      currentDay: 'Mer',
      workoutMessage: "C'est l'heure de s'entraîner ! 💪",
      upcomingDays: [
        { day: 18, label: 'Jeu' },
        { day: 19, label: 'Ven' },
        { day: 20, label: 'Sam' },
      ]
    });

    if (updateSuccess) {
      console.log('✅ Statut mis à jour avec succès');
    }

    // Récupérer le statut final
    console.log('\n3️⃣ Vérification du statut...');
    const finalStatus = await WorkoutStatusService.getWorkoutStatus(testUserId);
    
    if (finalStatus) {
      console.log('✅ Statut final récupéré:');
      console.log(`   • Strikes: ${finalStatus.strikes}`);
      console.log(`   • Jour actuel: ${finalStatus.currentDay}`);
      console.log(`   • Message: ${finalStatus.workoutMessage}`);
      console.log(`   • Prochains jours: ${finalStatus.upcomingDays.map(d => `${d.day}(${d.label})`).join(', ')}`);
    }

    console.log('\n🎉 Données de statut d\'entraînement ajoutées avec succès !');
    console.log('\n📱 La WorkoutStatusBar affichera maintenant les vraies données Firebase !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données:', error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  addWorkoutStatusData();
}

export { addWorkoutStatusData };
