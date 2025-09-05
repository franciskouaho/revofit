/**
 * Script pour tester les permissions Firebase
 * Utilisé pour diagnostiquer les problèmes d'accès
 */

import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../services/firebase/config';

async function testPermissions() {
  try {
    console.log("🔍 Test des permissions Firebase...");
    
    // Test 1: Lecture des exercices
    console.log("\n📖 Test de lecture des exercices...");
    try {
      const exercisesSnapshot = await getDocs(collection(firestore, 'exercises'));
      console.log(`✅ Lecture exercices: ${exercisesSnapshot.docs.length} documents trouvés`);
    } catch (error) {
      console.error("❌ Erreur lecture exercices:", error);
    }
    
    // Test 2: Lecture des templates
    console.log("\n📖 Test de lecture des templates...");
    try {
      const templatesSnapshot = await getDocs(collection(firestore, 'exerciseTemplates'));
      console.log(`✅ Lecture templates: ${templatesSnapshot.docs.length} documents trouvés`);
    } catch (error) {
      console.error("❌ Erreur lecture templates:", error);
    }
    
    // Test 3: Création d'un template de test
    console.log("\n✏️ Test de création d'un template...");
    try {
      const testTemplate = {
        name: "Test Template",
        description: "Template de test pour les permissions",
        muscleGroups: ["chest_global"],
        exercises: [],
        duration: 10,
        difficulty: "beginner",
        equipment: ["aucun"],
        imageUrl: "https://example.com/test.jpg",
        isPublic: true,
        createdBy: "test-user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(firestore, 'exerciseTemplates'), testTemplate);
      console.log(`✅ Création template: ${docRef.id}`);
      
      // Test 4: Suppression du template de test
      console.log("\n🗑️ Test de suppression du template...");
      try {
        await deleteDoc(doc(firestore, 'exerciseTemplates', docRef.id));
        console.log(`✅ Suppression template: ${docRef.id} supprimé`);
      } catch (error) {
        console.error("❌ Erreur suppression template:", error);
      }
      
    } catch (error) {
      console.error("❌ Erreur création template:", error);
    }
    
    console.log("\n🎉 Test des permissions terminé !");
    
  } catch (error) {
    console.error("💥 Erreur générale:", error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  testPermissions().then(() => {
    console.log("Script terminé");
    process.exit(0);
  });
}

export { testPermissions };
