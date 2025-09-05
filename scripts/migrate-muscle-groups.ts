#!/usr/bin/env ts-node

/**
 * Script de migration spécifique pour les groupes musculaires
 * Migre les données depuis explore.tsx vers Firebase
 */

import { initializeApp } from 'firebase/app';
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    query,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFY2nGt43sJHfdNn768E18uSPFeI_9lJw",
  authDomain: "revofit-db273.firebaseapp.com",
  projectId: "revofit-db273",
  storageBucket: "revofit-db273.firebasestorage.app",
  messagingSenderId: "336045610131",
  appId: "1:336045610131:web:cb469cfb69587e6d206966"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Types
interface MuscleGroupData {
  id: string;
  name: string;
  nameEn: string;
  category: 'primary' | 'secondary';
  imageUrl: string;
  videoUrl?: string;
  description: string;
  exercises: string[];
  parentGroup?: string;
  createdAt: any;
  updatedAt: any;
}

// Données des groupes musculaires depuis explore.tsx
const MUSCLE_GROUPS_RAW = [
  // Pectoraux
  { 
    id: 'chest_global', 
    name: 'Pectoraux (global)', 
    nameEn: 'Chest (global)',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=1200&auto=format&fit=crop',
    description: 'Groupe musculaire principal de la poitrine',
    parentGroup: 'chest'
  },
  { 
    id: 'chest_upper', 
    name: 'Haut des pectoraux', 
    nameEn: 'Upper chest',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    description: 'Partie supérieure des pectoraux',
    parentGroup: 'chest'
  },
  { 
    id: 'chest_lower', 
    name: 'Bas des pectoraux', 
    nameEn: 'Lower chest',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1574689047510-7a04b6a8b19b?q=80&w=1200&auto=format&fit=crop',
    description: 'Partie inférieure des pectoraux',
    parentGroup: 'chest'
  },
  { 
    id: 'chest_inner', 
    name: 'Pecs intérieurs', 
    nameEn: 'Inner chest',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1546484959-f9a53db89b87?q=80&w=1200&auto=format&fit=crop',
    description: 'Partie intérieure des pectoraux',
    parentGroup: 'chest'
  },
  
  // Dos
  { 
    id: 'back_width', 
    name: 'Dos (largeur)', 
    nameEn: 'Back (width)',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop',
    description: 'Développement de la largeur du dos',
    parentGroup: 'back'
  },
  { 
    id: 'back_thickness', 
    name: 'Dos (épaisseur)', 
    nameEn: 'Back (thickness)',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1200&auto=format&fit=crop',
    description: 'Développement de l\'épaisseur du dos',
    parentGroup: 'back'
  },
  { 
    id: 'lats', 
    name: 'Lats (grand dorsal)', 
    nameEn: 'Lats (latissimus dorsi)',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles du grand dorsal',
    parentGroup: 'back'
  },
  { 
    id: 'lower_back', 
    name: 'Lombaires', 
    nameEn: 'Lower back',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1594737625785-c6683fcf2f8d?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles lombaires',
    parentGroup: 'back'
  },
  
  // Épaules
  { 
    id: 'shoulders_front', 
    name: 'Épaules (antérieurs)', 
    nameEn: 'Front deltoids',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07f?q=80&w=1200&auto=format&fit=crop',
    description: 'Deltos antérieurs',
    parentGroup: 'shoulders'
  },
  { 
    id: 'shoulders_lateral', 
    name: 'Épaules (latéraux)', 
    nameEn: 'Lateral deltoids',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1561214078-f3247647fc5e?q=80&w=1200&auto=format&fit=crop',
    description: 'Deltos latéraux',
    parentGroup: 'shoulders'
  },
  { 
    id: 'shoulders_rear', 
    name: 'Épaules (postérieurs)', 
    nameEn: 'Rear deltoids',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    description: 'Deltos postérieurs',
    parentGroup: 'shoulders'
  },
  { 
    id: 'traps', 
    name: 'Trapèzes', 
    nameEn: 'Trapezius',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1571907480495-4f1b1a2d873a?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles trapèzes',
    parentGroup: 'shoulders'
  },
  
  // Bras
  { 
    id: 'biceps_global', 
    name: 'Biceps (global)', 
    nameEn: 'Biceps (global)',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1571731956672-c372df0731df?q=80&w=1200&auto=format&fit=crop',
    description: 'Biceps complet',
    parentGroup: 'arms'
  },
  { 
    id: 'biceps_long', 
    name: 'Biceps (longue portion)', 
    nameEn: 'Biceps (long head)',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop',
    description: 'Longue portion du biceps',
    parentGroup: 'arms'
  },
  { 
    id: 'biceps_short', 
    name: 'Biceps (courte portion)', 
    nameEn: 'Biceps (short head)',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1621803958999-1ee04f4b0d89?q=80&w=1200&auto=format&fit=crop',
    description: 'Courte portion du biceps',
    parentGroup: 'arms'
  },
  { 
    id: 'triceps_lateral', 
    name: 'Triceps (vaste latéral)', 
    nameEn: 'Triceps (lateral head)',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1549049950-48d5887197a7?q=80&w=1200&auto=format&fit=crop',
    description: 'Vaste latéral du triceps',
    parentGroup: 'arms'
  },
  { 
    id: 'triceps_medial', 
    name: 'Triceps (vaste médial)', 
    nameEn: 'Triceps (medial head)',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1200&auto=format&fit=crop',
    description: 'Vaste médial du triceps',
    parentGroup: 'arms'
  },
  { 
    id: 'forearms', 
    name: 'Avant-bras', 
    nameEn: 'Forearms',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles des avant-bras',
    parentGroup: 'arms'
  },
  
  // Jambes
  { 
    id: 'quadriceps', 
    name: 'Quadriceps', 
    nameEn: 'Quadriceps',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe0?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles quadriceps',
    parentGroup: 'legs'
  },
  { 
    id: 'hamstrings', 
    name: 'Ischio-jambiers', 
    nameEn: 'Hamstrings',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1546484958-7ef3022881d8?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles ischio-jambiers',
    parentGroup: 'legs'
  },
  { 
    id: 'glutes', 
    name: 'Fessiers', 
    nameEn: 'Glutes',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles fessiers',
    parentGroup: 'legs'
  },
  { 
    id: 'adductors', 
    name: 'Adducteurs', 
    nameEn: 'Adductors',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles adducteurs',
    parentGroup: 'legs'
  },
  { 
    id: 'abductors', 
    name: 'Abducteurs (hanches)', 
    nameEn: 'Hip abductors',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1526401281623-3593f3c8d714?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles abducteurs des hanches',
    parentGroup: 'legs'
  },
  { 
    id: 'calves_gastro', 
    name: 'Mollets (gastrocnémiens)', 
    nameEn: 'Gastrocnemius',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles gastrocnémiens',
    parentGroup: 'legs'
  },
  { 
    id: 'calves_soleus', 
    name: 'Mollets (soléaire)', 
    nameEn: 'Soleus',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1521804906057-1df8fdb0ecce?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscle soléaire',
    parentGroup: 'legs'
  },
  
  // Core
  { 
    id: 'abs_rectus', 
    name: 'Abdos (grand droit)', 
    nameEn: 'Rectus abdominis',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1540206276207-3af25c08abc4?q=80&w=1200&auto=format&fit=crop',
    description: 'Grand droit de l\'abdomen',
    parentGroup: 'core'
  },
  { 
    id: 'abs_obliques', 
    name: 'Obliques', 
    nameEn: 'Obliques',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles obliques',
    parentGroup: 'core'
  },
  { 
    id: 'abs_transverse', 
    name: 'Transverse (gainage)', 
    nameEn: 'Transverse abdominis',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscle transverse (gainage)',
    parentGroup: 'core'
  }
];

// Fonction pour obtenir l'URL vidéo d'un groupe musculaire
function getVideoUrlForMuscleGroup(id: string): string | undefined {
  const videoUrls: { [key: string]: string } = {
    'chest_global': 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    'chest_upper': 'https://www.youtube.com/watch?v=8iPEnov-lmU',
    'chest_lower': 'https://www.youtube.com/watch?v=0G2_XV7seOk',
    'chest_inner': 'https://www.youtube.com/watch?v=Z57nF3iOuG4',
    'back_width': 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    'back_thickness': 'https://www.youtube.com/watch?v=axoeDmW0oAY',
    'lats': 'https://www.youtube.com/watch?v=CAwf7nqLu4Q',
    'lower_back': 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    'shoulders_front': 'https://www.youtube.com/watch?v=0JfYxMRsUCQ',
    'shoulders_lateral': 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    'shoulders_rear': 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    'traps': 'https://www.youtube.com/watch?v=CAwf7nqLu4Q',
    'biceps_global': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'biceps_long': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'biceps_short': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'triceps_lateral': 'https://www.youtube.com/watch?v=Wz4Yd3g4ZRE',
    'triceps_medial': 'https://www.youtube.com/watch?v=Wz4Yd3g4ZRE',
    'forearms': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'quadriceps': 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
    'hamstrings': 'https://www.youtube.com/watch?v=0tn5K9NlCfo',
    'glutes': 'https://www.youtube.com/watch?v=u5n7Q6D3_0M',
    'adductors': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'abductors': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'calves_gastro': 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    'calves_soleus': 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    'abs_rectus': 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    'abs_obliques': 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    'abs_transverse': 'https://www.youtube.com/watch?v=pSHjTRCQxIw'
  };
  
  return videoUrls[id];
}

// Fonction pour vérifier si les groupes musculaires existent déjà
async function checkExistingMuscleGroups(): Promise<string[]> {
  try {
    const q = query(collection(firestore, 'muscleGroups'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error('Erreur lors de la vérification des groupes existants:', error);
    return [];
  }
}

// Fonction pour migrer les groupes musculaires
async function migrateMuscleGroups(): Promise<void> {
  console.log('🚀 Début de la migration des groupes musculaires...');
  
  try {
    // Vérifier les groupes existants
    const existingGroups = await checkExistingMuscleGroups();
    console.log(`📊 Groupes existants trouvés: ${existingGroups.length}`);
    
    const batch = writeBatch(firestore);
    let newGroupsCount = 0;
    let updatedGroupsCount = 0;
    
    for (const muscleGroup of MUSCLE_GROUPS_RAW) {
      const muscleGroupRef = doc(firestore, 'muscleGroups', muscleGroup.id);
      
      // Préparer les données pour Firebase
      const muscleGroupData: MuscleGroupData = {
        ...muscleGroup,
        videoUrl: getVideoUrlForMuscleGroup(muscleGroup.id),
        exercises: [], // Sera rempli plus tard
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      if (existingGroups.includes(muscleGroup.id)) {
        // Mettre à jour le groupe existant
        batch.update(muscleGroupRef, {
          name: muscleGroupData.name,
          nameEn: muscleGroupData.nameEn,
          category: muscleGroupData.category,
          imageUrl: muscleGroupData.imageUrl,
          videoUrl: muscleGroupData.videoUrl,
          description: muscleGroupData.description,
          parentGroup: muscleGroupData.parentGroup,
          updatedAt: serverTimestamp()
        });
        updatedGroupsCount++;
      } else {
        // Créer un nouveau groupe
        batch.set(muscleGroupRef, muscleGroupData);
        newGroupsCount++;
      }
    }
    
    // Exécuter le batch
    await batch.commit();
    
    console.log('✅ Migration des groupes musculaires terminée!');
    console.log(`📊 Nouveaux groupes créés: ${newGroupsCount}`);
    console.log(`🔄 Groupes mis à jour: ${updatedGroupsCount}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration des groupes musculaires:', error);
    throw error;
  }
}

// Fonction pour créer des groupes parent
async function createParentGroups(): Promise<void> {
  console.log('🏗️ Création des groupes parent...');
  
  const parentGroups = [
    {
      id: 'chest',
      name: 'Pectoraux',
      nameEn: 'Chest',
      category: 'primary' as const,
      imageUrl: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=1200&auto=format&fit=crop',
      description: 'Groupe musculaire principal de la poitrine',
      exercises: []
    },
    {
      id: 'back',
      name: 'Dos',
      nameEn: 'Back',
      category: 'primary' as const,
      imageUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop',
      description: 'Groupe musculaire principal du dos',
      exercises: []
    },
    {
      id: 'shoulders',
      name: 'Épaules',
      nameEn: 'Shoulders',
      category: 'primary' as const,
      imageUrl: 'https://images.unsplash.com/photo-1561214078-f3247647fc5e?q=80&w=1200&auto=format&fit=crop',
      description: 'Groupe musculaire principal des épaules',
      exercises: []
    },
    {
      id: 'arms',
      name: 'Bras',
      nameEn: 'Arms',
      category: 'primary' as const,
      imageUrl: 'https://images.unsplash.com/photo-1571731956672-c372df0731df?q=80&w=1200&auto=format&fit=crop',
      description: 'Groupe musculaire principal des bras',
      exercises: []
    },
    {
      id: 'legs',
      name: 'Jambes',
      nameEn: 'Legs',
      category: 'primary' as const,
      imageUrl: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe0?q=80&w=1200&auto=format&fit=crop',
      description: 'Groupe musculaire principal des jambes',
      exercises: []
    },
    {
      id: 'core',
      name: 'Core',
      nameEn: 'Core',
      category: 'primary' as const,
      imageUrl: 'https://images.unsplash.com/photo-1540206276207-3af25c08abc4?q=80&w=1200&auto=format&fit=crop',
      description: 'Groupe musculaire principal du core',
      exercises: []
    }
  ];
  
  try {
    const batch = writeBatch(firestore);
    
    for (const parentGroup of parentGroups) {
      const parentGroupRef = doc(firestore, 'muscleGroups', parentGroup.id);
      batch.set(parentGroupRef, {
        ...parentGroup,
        videoUrl: getVideoUrlForMuscleGroup(parentGroup.id),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    await batch.commit();
    console.log('✅ Groupes parent créés avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des groupes parent:', error);
    throw error;
  }
}

// Fonction pour valider les données migrées
async function validateMigration(): Promise<void> {
  console.log('🔍 Validation de la migration...');
  
  try {
    const q = query(collection(firestore, 'muscleGroups'));
    const snapshot = await getDocs(q);
    
    const groups = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`📊 Total des groupes musculaires: ${groups.length}`);
    console.log(`🏷️ Groupes primaires: ${groups.filter(g => g.category === 'primary').length}`);
    console.log(`🏷️ Groupes secondaires: ${groups.filter(g => g.category === 'secondary').length}`);
    
    // Vérifier les groupes parent
    const parentGroups = groups.filter(g => !g.parentGroup);
    console.log(`🏗️ Groupes parent: ${parentGroups.length}`);
    
    // Vérifier les groupes enfants
    const childGroups = groups.filter(g => g.parentGroup);
    console.log(`👶 Groupes enfants: ${childGroups.length}`);
    
    console.log('✅ Validation terminée!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error);
    throw error;
  }
}

// Fonction principale
async function main(): Promise<void> {
  try {
    console.log('🎯 Script de migration des groupes musculaires RevoFit');
    console.log('================================================');
    
    // 1. Créer les groupes parent
    await createParentGroups();
    
    // 2. Migrer les groupes musculaires
    await migrateMuscleGroups();
    
    // 3. Valider la migration
    await validateMigration();
    
    console.log('🎉 Migration complète terminée avec succès!');
    
  } catch (error) {
    console.error('💥 Échec de la migration:', error);
    process.exit(1);
  }
}

// Exécution du script
if (require.main === module) {
  main();
}

export { createParentGroups, migrateMuscleGroups, MUSCLE_GROUPS_RAW, validateMigration };

