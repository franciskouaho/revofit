#!/usr/bin/env ts-node

/**
 * Script de migration des données d'exercices vers Firebase
 * Migre les données depuis les composants React vers Firestore
 */

import { initializeApp } from 'firebase/app';
import {
    collection,
    doc,
    getFirestore,
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

// Types pour les données
interface MuscleGroup {
  id: string;
  name: string;
  nameEn: string;
  category: 'primary' | 'secondary';
  imageUrl: string;
  description: string;
  exercises: string[];
  createdAt: any;
  updatedAt: any;
}

interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  imageUrl?: string;
  videoUrl?: string;
  createdAt: any;
  updatedAt: any;
}

// Données des groupes musculaires depuis explore.tsx
const MUSCLE_GROUPS_DATA = [
  // Pectoraux
  { 
    id: 'chest_global', 
    name: 'Pectoraux (global)', 
    nameEn: 'Chest (global)',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=1200&auto=format&fit=crop',
    description: 'Groupe musculaire principal de la poitrine',
    exercises: []
  },
  { 
    id: 'chest_upper', 
    name: 'Haut des pectoraux', 
    nameEn: 'Upper chest',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    description: 'Partie supérieure des pectoraux',
    exercises: []
  },
  { 
    id: 'chest_lower', 
    name: 'Bas des pectoraux', 
    nameEn: 'Lower chest',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1574689047510-7a04b6a8b19b?q=80&w=1200&auto=format&fit=crop',
    description: 'Partie inférieure des pectoraux',
    exercises: []
  },
  { 
    id: 'chest_inner', 
    name: 'Pecs intérieurs', 
    nameEn: 'Inner chest',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1546484959-f9a53db89b87?q=80&w=1200&auto=format&fit=crop',
    description: 'Partie intérieure des pectoraux',
    exercises: []
  },
  
  // Dos
  { 
    id: 'back_width', 
    name: 'Dos (largeur)', 
    nameEn: 'Back (width)',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop',
    description: 'Développement de la largeur du dos',
    exercises: []
  },
  { 
    id: 'back_thickness', 
    name: 'Dos (épaisseur)', 
    nameEn: 'Back (thickness)',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1200&auto=format&fit=crop',
    description: 'Développement de l\'épaisseur du dos',
    exercises: []
  },
  { 
    id: 'lats', 
    name: 'Lats (grand dorsal)', 
    nameEn: 'Lats (latissimus dorsi)',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles du grand dorsal',
    exercises: []
  },
  { 
    id: 'lower_back', 
    name: 'Lombaires', 
    nameEn: 'Lower back',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1594737625785-c6683fcf2f8d?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles lombaires',
    exercises: []
  },
  
  // Épaules
  { 
    id: 'shoulders_front', 
    name: 'Épaules (antérieurs)', 
    nameEn: 'Front deltoids',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07f?q=80&w=1200&auto=format&fit=crop',
    description: 'Deltos antérieurs',
    exercises: []
  },
  { 
    id: 'shoulders_lateral', 
    name: 'Épaules (latéraux)', 
    nameEn: 'Lateral deltoids',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1561214078-f3247647fc5e?q=80&w=1200&auto=format&fit=crop',
    description: 'Deltos latéraux',
    exercises: []
  },
  { 
    id: 'shoulders_rear', 
    name: 'Épaules (postérieurs)', 
    nameEn: 'Rear deltoids',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    description: 'Deltos postérieurs',
    exercises: []
  },
  { 
    id: 'traps', 
    name: 'Trapèzes', 
    nameEn: 'Trapezius',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1571907480495-4f1b1a2d873a?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles trapèzes',
    exercises: []
  },
  
  // Bras
  { 
    id: 'biceps_global', 
    name: 'Biceps (global)', 
    nameEn: 'Biceps (global)',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1571731956672-c372df0731df?q=80&w=1200&auto=format&fit=crop',
    description: 'Biceps complet',
    exercises: []
  },
  { 
    id: 'biceps_long', 
    name: 'Biceps (longue portion)', 
    nameEn: 'Biceps (long head)',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop',
    description: 'Longue portion du biceps',
    exercises: []
  },
  { 
    id: 'biceps_short', 
    name: 'Biceps (courte portion)', 
    nameEn: 'Biceps (short head)',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1621803958999-1ee04f4b0d89?q=80&w=1200&auto=format&fit=crop',
    description: 'Courte portion du biceps',
    exercises: []
  },
  { 
    id: 'triceps_lateral', 
    name: 'Triceps (vaste latéral)', 
    nameEn: 'Triceps (lateral head)',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1549049950-48d5887197a7?q=80&w=1200&auto=format&fit=crop',
    description: 'Vaste latéral du triceps',
    exercises: []
  },
  { 
    id: 'triceps_medial', 
    name: 'Triceps (vaste médial)', 
    nameEn: 'Triceps (medial head)',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1200&auto=format&fit=crop',
    description: 'Vaste médial du triceps',
    exercises: []
  },
  { 
    id: 'forearms', 
    name: 'Avant-bras', 
    nameEn: 'Forearms',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles des avant-bras',
    exercises: []
  },
  
  // Jambes
  { 
    id: 'quadriceps', 
    name: 'Quadriceps', 
    nameEn: 'Quadriceps',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe0?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles quadriceps',
    exercises: []
  },
  { 
    id: 'hamstrings', 
    name: 'Ischio-jambiers', 
    nameEn: 'Hamstrings',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1546484958-7ef3022881d8?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles ischio-jambiers',
    exercises: []
  },
  { 
    id: 'glutes', 
    name: 'Fessiers', 
    nameEn: 'Glutes',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles fessiers',
    exercises: []
  },
  { 
    id: 'adductors', 
    name: 'Adducteurs', 
    nameEn: 'Adductors',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles adducteurs',
    exercises: []
  },
  { 
    id: 'abductors', 
    name: 'Abducteurs (hanches)', 
    nameEn: 'Hip abductors',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1526401281623-3593f3c8d714?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles abducteurs des hanches',
    exercises: []
  },
  { 
    id: 'calves_gastro', 
    name: 'Mollets (gastrocnémiens)', 
    nameEn: 'Gastrocnemius',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles gastrocnémiens',
    exercises: []
  },
  { 
    id: 'calves_soleus', 
    name: 'Mollets (soléaire)', 
    nameEn: 'Soleus',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1521804906057-1df8fdb0ecce?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscle soléaire',
    exercises: []
  },
  
  // Core
  { 
    id: 'abs_rectus', 
    name: 'Abdos (grand droit)', 
    nameEn: 'Rectus abdominis',
    category: 'primary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1540206276207-3af25c08abc4?q=80&w=1200&auto=format&fit=crop',
    description: 'Grand droit de l\'abdomen',
    exercises: []
  },
  { 
    id: 'abs_obliques', 
    name: 'Obliques', 
    nameEn: 'Obliques',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscles obliques',
    exercises: []
  },
  { 
    id: 'abs_transverse', 
    name: 'Transverse (gainage)', 
    nameEn: 'Transverse abdominis',
    category: 'secondary' as const,
    imageUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1200&auto=format&fit=crop',
    description: 'Muscle transverse (gainage)',
    exercises: []
  }
];

// Données des exercices depuis ExerciseSelector.tsx
const EXERCISES_DATA = {
  Pectoraux: [
    "Développé couché", "Développé incliné", "Développé décliné", "Écarté couché", 
    "Écarté incliné", "Écarté décliné", "Pompes", "Dips pectoraux", 
    "Développé haltères pectoraux", "Butterfly", "Pull-over"
  ],
  Dos: [
    "Tractions", "Rowing haltère", "Rowing barre", "Rowing T-bar", "Rowing machine", 
    "Tirage vertical", "Tirage horizontal", "Tirage nuque", "Shrugs", "Pull-down", 
    "Deadlift", "Good morning dos"
  ],
  Épaules: [
    "Développé militaire", "Développé haltères épaules", "Élévations latérales", 
    "Élévations frontales", "Élévations arrière", "Arnold press", "Upright row", 
    "Face pull", "Reverse flyes"
  ],
  Biceps: [
    "Curl haltères", "Curl barre", "Curl pupitre", "Curl marteau", "Curl concentré", 
    "Curl spider", "Curl incliné", "Curl 21", "Preacher curl"
  ],
  Triceps: [
    "Extensions nuque", "Extensions poulie", "Dips triceps", "Kickback", "Skull crushers",
    "Diamond push-ups", "Overhead extensions", "Rope pushdown", "Close grip bench press"
  ],
  Jambes: [
    "Squat", "Squat avant", "Squat bulgare", "Leg press", "Extensions cuisses", 
    "Leg curl", "Hip thrust", "Deadlift roumain", "Good morning jambes", "Lunges", 
    "Step-ups", "Calf raises", "Leg abduction", "Leg adduction", "Hip adduction", "Hip abduction"
  ],
  Abdominaux: [
    "Crunch", "Crunch inversé", "Plank", "Side plank", "Russian twist", "Leg raises",
    "Bicycle crunch", "Mountain climbers abdos", "Ab wheel rollout", "Cable woodchop"
  ],
  Cardio: [
    "Course à pied", "Vélo", "Rameur", "Elliptique", "Escalier", "Burpees", 
    "Jumping jacks", "Mountain climbers cardio", "High knees", "Butt kicks"
  ]
};

// Fonction pour mapper les exercices aux groupes musculaires
function mapExercisesToMuscleGroups() {
  const exerciseToMuscleGroupMap: { [key: string]: string[] } = {};
  
  Object.entries(EXERCISES_DATA).forEach(([groupName, exercises]) => {
    exercises.forEach(exercise => {
      if (!exerciseToMuscleGroupMap[exercise]) {
        exerciseToMuscleGroupMap[exercise] = [];
      }
      
      // Mapping basique - peut être amélioré
      switch (groupName) {
        case 'Pectoraux':
          exerciseToMuscleGroupMap[exercise].push('chest_global', 'chest_upper', 'chest_lower');
          break;
        case 'Dos':
          exerciseToMuscleGroupMap[exercise].push('back_width', 'back_thickness', 'lats');
          break;
        case 'Épaules':
          exerciseToMuscleGroupMap[exercise].push('shoulders_front', 'shoulders_lateral', 'shoulders_rear');
          break;
        case 'Biceps':
          exerciseToMuscleGroupMap[exercise].push('biceps_global', 'biceps_long', 'biceps_short');
          break;
        case 'Triceps':
          exerciseToMuscleGroupMap[exercise].push('triceps_lateral', 'triceps_medial');
          break;
        case 'Jambes':
          exerciseToMuscleGroupMap[exercise].push('quadriceps', 'hamstrings', 'glutes');
          break;
        case 'Abdominaux':
          exerciseToMuscleGroupMap[exercise].push('abs_rectus', 'abs_obliques', 'abs_transverse');
          break;
      }
    });
  });
  
  return exerciseToMuscleGroupMap;
}

// Fonction pour créer un exercice détaillé
function createDetailedExercise(name: string, muscleGroups: string[]): Exercise {
  const equipment = getEquipmentForExercise(name);
  const difficulty = getDifficultyForExercise(name);
  const instructions = getInstructionsForExercise(name);
  const tips = getTipsForExercise(name);
  const videoUrl = getVideoUrlForExercise(name);
  
  return {
    id: name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
    name,
    nameEn: getEnglishName(name),
    muscleGroups,
    equipment,
    difficulty,
    instructions,
    tips,
    videoUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

// Fonctions utilitaires
function getEquipmentForExercise(name: string): string[] {
  const equipmentMap: { [key: string]: string[] } = {
    'Développé couché': ['banc', 'barre', 'disques'],
    'Développé incliné': ['banc incliné', 'barre', 'disques'],
    'Développé haltères': ['banc', 'haltères'],
    'Pompes': ['aucun'],
    'Squat': ['barre', 'disques'],
    'Deadlift': ['barre', 'disques'],
    'Tractions': ['barre de traction'],
    'Curl haltères': ['haltères'],
    'Extensions nuque': ['haltère'],
    'Plank': ['aucun'],
    'Course à pied': ['aucun'],
    'Vélo': ['vélo'],
    'Rameur': ['rameur']
  };
  
  return equipmentMap[name] || ['équipement variable'];
}

function getDifficultyForExercise(name: string): 'beginner' | 'intermediate' | 'advanced' {
  const beginnerExercises = ['Pompes', 'Plank', 'Crunch', 'Course à pied', 'Vélo'];
  const advancedExercises = ['Deadlift', 'Squat avant', 'Arnold press', 'Skull crushers'];
  
  if (beginnerExercises.includes(name)) return 'beginner';
  if (advancedExercises.includes(name)) return 'advanced';
  return 'intermediate';
}

function getInstructionsForExercise(name: string): string[] {
  const instructionsMap: { [key: string]: string[] } = {
    'Développé couché': [
      'Allongez-vous sur le banc, pieds au sol',
      'Saisissez la barre avec une prise légèrement plus large que les épaules',
      'Descendez la barre jusqu\'à la poitrine en contrôlant le mouvement',
      'Poussez la barre vers le haut jusqu\'à l\'extension complète des bras'
    ],
    'Squat': [
      'Placez-vous debout, pieds écartés de la largeur des épaules',
      'Descendez en pliant les genoux et en poussant les hanches vers l\'arrière',
      'Descendez jusqu\'à ce que les cuisses soient parallèles au sol',
      'Remontez en poussant sur les talons'
    ],
    'Pompes': [
      'Placez-vous en position de planche',
      'Mains légèrement plus larges que les épaules',
      'Descendez le corps en gardant le dos droit',
      'Poussez vers le haut jusqu\'à l\'extension complète des bras'
    ]
  };
  
  return instructionsMap[name] || [
    'Position de départ correcte',
    'Exécution du mouvement en contrôlant la phase négative',
    'Contraction maximale en fin de mouvement',
    'Retour à la position de départ'
  ];
}

function getTipsForExercise(name: string): string[] {
  return [
    'Maintenez une respiration contrôlée',
    'Gardez le dos droit et les abdominaux contractés',
    'Contrôlez le mouvement dans les deux phases',
    'Augmentez progressivement la charge'
  ];
}

function getEnglishName(name: string): string {
  const translations: { [key: string]: string } = {
    'Développé couché': 'Bench Press',
    'Développé incliné': 'Incline Bench Press',
    'Squat': 'Squat',
    'Deadlift': 'Deadlift',
    'Pompes': 'Push-ups',
    'Tractions': 'Pull-ups',
    'Curl haltères': 'Dumbbell Curl',
    'Extensions nuque': 'Overhead Extension',
    'Plank': 'Plank',
    'Course à pied': 'Running'
  };
  
  return translations[name] || name;
}

function getVideoUrlForExercise(name: string): string | undefined {
  const videoUrls: { [key: string]: string } = {
    'Développé couché': 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    'Développé incliné': 'https://www.youtube.com/watch?v=8iPEnov-lmU',
    'Développé décliné': 'https://www.youtube.com/watch?v=0G2_XV7seOk',
    'Écarté couché': 'https://www.youtube.com/watch?v=Z57nF3iOuG4',
    'Pompes': 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    'Dips pectoraux': 'https://www.youtube.com/watch?v=2s8F0IuM_3o',
    'Tractions': 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    'Rowing haltère': 'https://www.youtube.com/watch?v=roCP6wCXPqo',
    'Rowing barre': 'https://www.youtube.com/watch?v=axoeDmW0oAY',
    'Tirage vertical': 'https://www.youtube.com/watch?v=CAwf7nqLu4Q',
    'Deadlift': 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    'Développé militaire': 'https://www.youtube.com/watch?v=0JfYxMRsUCQ',
    'Élévations latérales': 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    'Curl haltères': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'Curl barre': 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    'Curl marteau': 'https://www.youtube.com/watch?v=TwD-YGVP4Bk',
    'Extensions nuque': 'https://www.youtube.com/watch?v=Wz4Yd3g4ZRE',
    'Dips triceps': 'https://www.youtube.com/watch?v=6kALZikXxLc',
    'Kickback': 'https://www.youtube.com/watch?v=6SS6K3lAwY8',
    'Squat': 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
    'Squat avant': 'https://www.youtube.com/watch?v=uYumuL64VxU',
    'Leg press': 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    'Extensions cuisses': 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    'Leg curl': 'https://www.youtube.com/watch?v=0tn5K9NlCfo',
    'Hip thrust': 'https://www.youtube.com/watch?v=u5n7Q6D3_0M',
    'Lunges': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'Calf raises': 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    'Crunch': 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    'Plank': 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    'Side plank': 'https://www.youtube.com/watch?v=K2Vpjzuzaw0',
    'Russian twist': 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    'Leg raises': 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    'Course à pied': 'https://www.youtube.com/watch?v=5F8n8g8yEuM',
    'Vélo': 'https://www.youtube.com/watch?v=YQBYfqDqZ4Y',
    'Rameur': 'https://www.youtube.com/watch?v=WU4D6BUrkQI',
    'Burpees': 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    'Jumping jacks': 'https://www.youtube.com/watch?v=UpH7rm0cYbM',
    'Mountain climbers cardio': 'https://www.youtube.com/watch?v=nmwgirgXLYM'
  };
  
  return videoUrls[name];
}

// Fonction principale de migration
async function migrateExercisesToFirebase() {
  console.log('🚀 Début de la migration des exercices vers Firebase...');
  
  try {
    const batch = writeBatch(firestore);
    
    // 1. Migration des groupes musculaires
    console.log('📦 Migration des groupes musculaires...');
    for (const muscleGroup of MUSCLE_GROUPS_DATA) {
      const muscleGroupRef = doc(collection(firestore, 'muscleGroups'), muscleGroup.id);
      batch.set(muscleGroupRef, {
        ...muscleGroup,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    // 2. Migration des exercices
    console.log('💪 Migration des exercices...');
    const exerciseToMuscleGroupMap = mapExercisesToMuscleGroups();
    
    for (const [exerciseName, muscleGroupIds] of Object.entries(exerciseToMuscleGroupMap)) {
      const exercise = createDetailedExercise(exerciseName, muscleGroupIds);
      const exerciseRef = doc(collection(firestore, 'exercises'), exercise.id);
      batch.set(exerciseRef, exercise);
    }
    
    // 3. Mise à jour des groupes musculaires avec les exercices
    console.log('🔗 Liaison des exercices aux groupes musculaires...');
    for (const [exerciseName, muscleGroupIds] of Object.entries(exerciseToMuscleGroupMap)) {
      const exerciseId = exerciseName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      
      for (const muscleGroupId of muscleGroupIds) {
        const muscleGroupRef = doc(firestore, 'muscleGroups', muscleGroupId);
        const muscleGroup = MUSCLE_GROUPS_DATA.find(mg => mg.id === muscleGroupId);
        if (muscleGroup) {
          muscleGroup.exercises.push(exerciseId);
        }
      }
    }
    
    // 4. Sauvegarde des groupes musculaires mis à jour
    for (const muscleGroup of MUSCLE_GROUPS_DATA) {
      const muscleGroupRef = doc(firestore, 'muscleGroups', muscleGroup.id);
      batch.update(muscleGroupRef, {
        exercises: muscleGroup.exercises,
        updatedAt: serverTimestamp()
      });
    }
    
    // Exécution du batch
    await batch.commit();
    
    console.log('✅ Migration terminée avec succès!');
    console.log(`📊 ${MUSCLE_GROUPS_DATA.length} groupes musculaires migrés`);
    console.log(`💪 ${Object.keys(exerciseToMuscleGroupMap).length} exercices migrés`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

// Exécution du script
if (require.main === module) {
  migrateExercisesToFirebase()
    .then(() => {
      console.log('🎉 Migration complète!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Échec de la migration:', error);
      process.exit(1);
    });
}

export { EXERCISES_DATA, migrateExercisesToFirebase, MUSCLE_GROUPS_DATA };

