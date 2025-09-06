/**
 * Script d'exécution pour ajouter les données nutritionnelles
 * RevoFit - Exécution du script d'ajout de données nutritionnelles
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runAddNutrition() {
  try {
    console.log('🚀 Démarrage de l\'ajout des données nutritionnelles...');
    
    // Exécuter le script TypeScript
    const { stdout, stderr } = await execAsync('npx ts-node scripts/add-sample-nutrition.ts');
    
    if (stdout) {
      console.log('📝 Sortie:', stdout);
    }
    
    if (stderr) {
      console.error('⚠️ Erreurs:', stderr);
    }
    
    console.log('✅ Script d\'ajout des données nutritionnelles terminé !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution du script:', error);
  }
}

runAddNutrition();
