#!/usr/bin/env ts-node

/**
 * Script de migration simplifié - Une seule commande pour tout migrer
 * RevoFit - Migration complète (SDK Web) avec batching robuste
 */

import { initializeApp } from 'firebase/app';
import {
  doc,
  getFirestore,
  serverTimestamp,
  writeBatch,
  WriteBatch
} from 'firebase/firestore';

/* -------------------- Config Firebase (Web SDK) -------------------- */
// IMPORTANT: storageBucket doit être {projectId}.appspot.com
const firebaseConfig = {
  apiKey: "AIzaSyCFY2nGt43sJHfdNn768E18uSPFeI_9lJw",
  authDomain: "revofit-db273.firebaseapp.com",
  databaseURL: "https://revofit-db273-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "revofit-db273",
  storageBucket: "revofit-db273.firebasestorage.app",
  messagingSenderId: "336045610131",
  appId: "1:336045610131:web:cb469cfb69587e6d206966",
  measurementId: "G-VKFX4WKRX9"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

/* -------------------- Types -------------------- */

type TimestampLike = ReturnType<typeof serverTimestamp> | null | undefined;

interface MuscleGroupData {
  id: string;
  name: string;
  nameEn: string;
  category: 'primary' | 'secondary';
  imageUrl: string;
  videoUrl?: string;
  description: string;
  exercises: string[];     // liste d'IDs d'exercices
  parentGroup?: string;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

interface ExerciseData {
  id: string;
  name: string;
  nameEn: string;
  muscleGroups: string[];  // IDs de groupes musculaires
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'endurance';
  targetMuscles: string[];
  secondaryMuscles: string[];
  movementType: 'compound' | 'isolation';
  forceType: 'push' | 'pull' | 'squat' | 'hinge' | 'carry' | 'rotation';
  plane: 'sagittal' | 'frontal' | 'transverse';
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

/* -------------------- Helpers -------------------- */

const BATCH_LIMIT = 450; // marge de sécurité < 500

function slugifyId(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function createMuscleGroup(
  data: Omit<MuscleGroupData, 'exercises' | 'createdAt' | 'updatedAt'>
): MuscleGroupData {
  const muscleGroup: MuscleGroupData = {
    ...data,
    exercises: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  // Ajouter videoUrl seulement s'il existe
  if (data.videoUrl) {
    muscleGroup.videoUrl = data.videoUrl;
  }
  
  return muscleGroup;
}

/* -------------------- Données groupes musculaires -------------------- */

const MUSCLE_GROUPS: MuscleGroupData[] = [
  // Pectoraux
  createMuscleGroup({
    id: 'chest_global',
    name: 'Pectoraux (global)',
    nameEn: 'Chest (global)',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    description: 'Groupe musculaire principal de la poitrine',
    parentGroup: 'chest',
  }),
  createMuscleGroup({
    id: 'chest_upper',
    name: 'Haut des pectoraux',
    nameEn: 'Upper chest',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=8iPEnov-lmU',
    description: 'Partie supérieure des pectoraux',
    parentGroup: 'chest',
  }),
  createMuscleGroup({
    id: 'chest_lower',
    name: 'Bas des pectoraux',
    nameEn: 'Lower chest',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1574689047510-7a04b6a8b19b?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=0G2_XV7seOk',
    description: 'Partie inférieure des pectoraux',
    parentGroup: 'chest',
  }),
  createMuscleGroup({
    id: 'chest_inner',
    name: 'Pecs intérieurs',
    nameEn: 'Inner chest',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1546484959-f9a53db89b87?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=Z57nF3iOuG4',
    description: 'Partie intérieure des pectoraux',
    parentGroup: 'chest',
  }),

  // Dos
  createMuscleGroup({
    id: 'back_width',
    name: 'Dos (largeur)',
    nameEn: 'Back (width)',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    description: 'Développement de la largeur du dos',
    parentGroup: 'back',
  }),
  createMuscleGroup({
    id: 'back_thickness',
    name: 'Dos (épaisseur)',
    nameEn: 'Back (thickness)',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=axoeDmW0oAY',
    description: "Développement de l'épaisseur du dos",
    parentGroup: 'back',
  }),
  createMuscleGroup({
    id: 'lats',
    name: 'Lats (grand dorsal)',
    nameEn: 'Lats (latissimus dorsi)',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7nqLu4Q',
    description: 'Muscles du grand dorsal',
    parentGroup: 'back',
  }),
  createMuscleGroup({
    id: 'lower_back',
    name: 'Lombaires',
    nameEn: 'Lower back',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1594737625785-c6683fcf2f8d?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    description: 'Muscles lombaires',
    parentGroup: 'back',
  }),

  // Épaules
  createMuscleGroup({
    id: 'shoulders_front',
    name: 'Épaules (antérieurs)',
    nameEn: 'Front deltoids',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07f?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=0JfYxMRsUCQ',
    description: 'Deltoïdes antérieurs',
    parentGroup: 'shoulders',
  }),
  createMuscleGroup({
    id: 'shoulders_lateral',
    name: 'Épaules (latéraux)',
    nameEn: 'Lateral deltoids',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1561214078-f3247647fc5e?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    description: 'Deltoïdes latéraux',
    parentGroup: 'shoulders',
  }),
  createMuscleGroup({
    id: 'shoulders_rear',
    name: 'Épaules (postérieurs)',
    nameEn: 'Rear deltoids',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    description: 'Deltoïdes postérieurs',
    parentGroup: 'shoulders',
  }),
  createMuscleGroup({
    id: 'traps',
    name: 'Trapèzes',
    nameEn: 'Trapezius',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1571907480495-4f1b1a2d873a?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7nqLu4Q',
    description: 'Muscles trapèzes',
    parentGroup: 'shoulders',
  }),

  // Bras
  createMuscleGroup({
    id: 'biceps_global',
    name: 'Biceps (global)',
    nameEn: 'Biceps (global)',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1571731956672-c372df0731df?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    description: 'Biceps complet',
    parentGroup: 'arms',
  }),
  createMuscleGroup({
    id: 'biceps_long',
    name: 'Biceps (longue portion)',
    nameEn: 'Biceps (long head)',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    description: 'Longue portion du biceps',
    parentGroup: 'arms',
  }),
  createMuscleGroup({
    id: 'biceps_short',
    name: 'Biceps (courte portion)',
    nameEn: 'Biceps (short head)',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1621803958999-1ee04f4b0d89?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    description: 'Courte portion du biceps',
    parentGroup: 'arms',
  }),
  createMuscleGroup({
    id: 'triceps_lateral',
    name: 'Triceps (vaste latéral)',
    nameEn: 'Triceps (lateral head)',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1549049950-48d5887197a7?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=Wz4Yd3g4ZRE',
    description: 'Vaste latéral du triceps',
    parentGroup: 'arms',
  }),
  createMuscleGroup({
    id: 'triceps_medial',
    name: 'Triceps (vaste médial)',
    nameEn: 'Triceps (medial head)',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=Wz4Yd3g4ZRE',
    description: 'Vaste médial du triceps',
    parentGroup: 'arms',
  }),
  createMuscleGroup({
    id: 'forearms',
    name: 'Avant-bras',
    nameEn: 'Forearms',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    description: 'Muscles des avant-bras',
    parentGroup: 'arms',
  }),

  // Jambes
  createMuscleGroup({
    id: 'quadriceps',
    name: 'Quadriceps',
    nameEn: 'Quadriceps',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe0?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
    description: 'Muscles quadriceps',
    parentGroup: 'legs',
  }),
  createMuscleGroup({
    id: 'hamstrings',
    name: 'Ischio-jambiers',
    nameEn: 'Hamstrings',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1546484958-7ef3022881d8?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=0tn5K9NlCfo',
    description: 'Muscles ischio-jambiers',
    parentGroup: 'legs',
  }),
  createMuscleGroup({
    id: 'glutes',
    name: 'Fessiers',
    nameEn: 'Glutes',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=u5n7Q6D3_0M',
    description: 'Muscles fessiers',
    parentGroup: 'legs',
  }),
  createMuscleGroup({
    id: 'adductors',
    name: 'Adducteurs',
    nameEn: 'Adductors',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    description: 'Muscles adducteurs',
    parentGroup: 'legs',
  }),
  createMuscleGroup({
    id: 'abductors',
    name: 'Abducteurs (hanches)',
    nameEn: 'Hip abductors',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1526401281623-3593f3c8d714?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    description: 'Muscles abducteurs des hanches',
    parentGroup: 'legs',
  }),
  createMuscleGroup({
    id: 'calves_gastro',
    name: 'Mollets (gastrocnémiens)',
    nameEn: 'Gastrocnemius',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    description: 'Muscles gastrocnémiens',
    parentGroup: 'legs',
  }),
  createMuscleGroup({
    id: 'calves_soleus',
    name: 'Mollets (soléaire)',
    nameEn: 'Soleus',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1521804906057-1df8fdb0ecce?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    description: 'Muscle soléaire',
    parentGroup: 'legs',
  }),

  // Core
  createMuscleGroup({
    id: 'abs_rectus',
    name: 'Abdos (grand droit)',
    nameEn: 'Rectus abdominis',
    category: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1540206276207-3af25c08abc4?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    description: "Grand droit de l'abdomen",
    parentGroup: 'core',
  }),
  createMuscleGroup({
    id: 'abs_obliques',
    name: 'Obliques',
    nameEn: 'Obliques',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    description: 'Muscles obliques',
    parentGroup: 'core',
  }),
  createMuscleGroup({
    id: 'abs_transverse',
    name: 'Transverse (gainage)',
    nameEn: 'Transverse abdominis',
    category: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    description: 'Muscle transverse (gainage)',
    parentGroup: 'core',
  }),
];

/* -------------------- Données exercices (libellés) -------------------- */

const EXERCISES: Record<string, string[]> = {
  Pectoraux: [
    'Développé couché', 'Développé incliné', 'Développé décliné', 'Écarté couché',
    'Écarté incliné', 'Écarté décliné', 'Pompes', 'Dips pectoraux',
    'Développé haltères pectoraux', 'Butterfly', 'Pull-over',
  ],
  Dos: [
    'Tractions', 'Rowing haltère', 'Rowing barre', 'Rowing T-bar', 'Rowing machine',
    'Tirage vertical', 'Tirage horizontal', 'Tirage nuque', 'Haussements d\'épaules', 'Tirage poulie',
    'Soulevé de terre', 'Good morning dos',
  ],
  Épaules: [
    'Développé militaire', 'Développé haltères épaules', 'Élévations latérales',
    'Élévations frontales', 'Élévations arrière',   'Arnold press', 'Rowing debout',
    'Face pull', 'Élévations arrière haltères',
  ],
  Biceps: [
    'Curl haltères', 'Curl barre', 'Curl pupitre', 'Curl marteau', 'Curl concentré',
    'Curl spider', 'Curl incliné', 'Curl 21', 'Curl pupitre',
  ],
  Triceps: [
    'Extensions nuque', 'Extensions poulie', 'Dips triceps', 'Kickback', 'Skull crushers',
    'Pompes diamant', 'Extensions verticales', 'Extensions corde', 'Développé couché prise serrée',
  ],
  Jambes: [
    'Squat', 'Squat avant', 'Squat bulgare', 'Presse à cuisses', 'Extensions cuisses',
    'Leg curl', 'Hip thrust', 'Soulevé de terre roumain', 'Good morning jambes', 'Fentes',
    'Montées sur banc', 'Mollets debout', 'Abduction jambes', 'Adduction jambes', 'Abduction hanches', 'Adduction hanches',
  ],
  Abdominaux: [
    'Crunch', 'Crunch inversé', 'Planche', 'Planche latérale', 'Russian twist', 'Relevés de jambes',
    'Crunch vélo', 'Mountain climbers abdos', 'Roulette abdos', 'Woodchop câble',
  ],
  Cardio: [
    'Course à pied', 'Vélo', 'Rameur', 'Elliptique', 'Escalier', 'Burpees',
    'Jumping jacks', 'Mountain climbers cardio', 'Montées de genoux', 'Talons-fesses',
  ],
};

/* -------------------- Vidéos, mapping, utilitaires -------------------- */

function getVideoUrlForExercise(name: string): string | undefined {
  const videoUrls: Record<string, string> = {
    'Développé couché': 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    'Développé incliné': 'https://www.youtube.com/watch?v=8iPEnov-lmU',
    'Développé décliné': 'https://www.youtube.com/watch?v=0G2_XV7seOk',
    'Écarté couché': 'https://www.youtube.com/watch?v=Z57nF3iOuG4',
    'Écarté incliné': 'https://www.youtube.com/watch?v=8iPEnov-lmU',
    'Écarté décliné': 'https://www.youtube.com/watch?v=0G2_XV7seOk',
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
    'Presse à cuisses': 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    'Extensions cuisses': 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    'Leg curl': 'https://www.youtube.com/watch?v=0tn5K9NlCfo',
    'Hip thrust': 'https://www.youtube.com/watch?v=u5n7Q6D3_0M',
    'Fentes': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'Mollets debout': 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    'Crunch': 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    'Planche': 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    'Planche latérale': 'https://www.youtube.com/watch?v=K2Vpjzuzaw0',
    'Russian twist': 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    'Relevés de jambes': 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    'Course à pied': 'https://www.youtube.com/watch?v=5F8n8g8yEuM',
    'Vélo': 'https://www.youtube.com/watch?v=YQBYfqDqZ4Y',
    'Rameur': 'https://www.youtube.com/watch?v=WU4D6BUrkQI',
    'Burpees': 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    'Jumping jacks': 'https://www.youtube.com/watch?v=UpH7rm0cYbM',
    'Mountain climbers cardio': 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    'Montées de genoux': 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    'Talons-fesses': 'https://www.youtube.com/watch?v=UpH7rm0cYbM',
  };
  return videoUrls[name];
}

function mapExercisesToMuscleGroups() {
  const map: Record<string, string[]> = {};

  Object.entries(EXERCISES).forEach(([groupName, exercises]) => {
    exercises.forEach((exercise) => {
      if (!map[exercise]) map[exercise] = [];

      switch (groupName) {
        case 'Pectoraux':
          map[exercise].push('chest_global', 'chest_upper', 'chest_lower');
          break;
        case 'Dos':
          map[exercise].push('back_width', 'back_thickness', 'lats');
          break;
        case 'Épaules':
          map[exercise].push('shoulders_front', 'shoulders_lateral', 'shoulders_rear');
          break;
        case 'Biceps':
          map[exercise].push('biceps_global', 'biceps_long', 'biceps_short');
          break;
        case 'Triceps':
          map[exercise].push('triceps_lateral', 'triceps_medial');
          break;
        case 'Jambes':
          map[exercise].push('quadriceps', 'hamstrings', 'glutes');
          break;
        case 'Abdominaux':
          map[exercise].push('abs_rectus', 'abs_obliques', 'abs_transverse');
          break;
        case 'Cardio':
          // On peut mapper vers aucun groupe musculaire ou un groupe "cardio" dédié si tu en crées un
          break;
      }
    });
  });

  // Nettoyage: retirer doublons éventuels
  Object.keys(map).forEach((k) => {
    map[k] = Array.from(new Set(map[k]));
  });

  return map;
}

function getEquipmentForExercise(name: string): string[] {
  const equipmentMap: Record<string, string[]> = {
    'Développé couché': ['banc', 'barre', 'disques'],
    'Développé incliné': ['banc incliné', 'barre', 'disques'],
    'Développé haltères pectoraux': ['banc', 'haltères'],
    'Pompes': ['aucun'],
    'Squat': ['barre', 'disques'],
    'Soulevé de terre': ['barre', 'disques'],
    'Tractions': ['barre de traction'],
    'Curl haltères': ['haltères'],
    'Extensions nuque': ['haltère'],
    'Planche': ['aucun'],
    'Course à pied': ['aucun'],
    'Vélo': ['vélo'],
    'Rameur': ['rameur'],
  };
  return equipmentMap[name] || ['équipement variable'];
}

function getDifficultyForExercise(name: string): 'beginner' | 'intermediate' | 'advanced' {
  const beginner = ['Pompes', 'Planche', 'Crunch', 'Course à pied', 'Vélo'];
  const advanced = ['Soulevé de terre', 'Squat avant', 'Arnold press', 'Skull crushers'];

  if (beginner.includes(name)) return 'beginner';
  if (advanced.includes(name)) return 'advanced';
  return 'intermediate';
}

function getInstructionsForExercise(name: string): string[] {
  const map: Record<string, string[]> = {
    'Développé couché': [
      'Allongez-vous sur le banc, pieds au sol',
      'Prise un peu plus large que les épaules',
      'Descendez la barre en contrôlant',
      'Poussez jusqu’à l’extension complète',
    ],
    'Squat': [
      'Pieds largeur épaules',
      'Hanches en arrière, dos neutre',
      'Cuisses parallèles au sol',
      'Remontez en poussant dans les talons',
    ],
    'Pompes': [
      'Position de planche',
      'Mains un peu plus larges que les épaules',
      'Descendez en gardant le dos droit',
      'Remontez en extension complète',
    ],
  };
  return map[name] || [
    'Position de départ correcte',
    'Phase négative contrôlée',
    'Contraction maximale en fin de mouvement',
    'Retour en position de départ',
  ];
}

function getTipsForExercise(_name: string): string[] {
  return [
    'Respiration contrôlée',
    'Gainage et dos neutre',
    'Contrôle concentrique et excentrique',
    'Progression graduelle des charges',
  ];
}

function getEnglishName(name: string): string {
  const translations: Record<string, string> = {
    'Développé couché': 'Bench Press',
    'Développé incliné': 'Incline Bench Press',
    'Développé décliné': 'Decline Bench Press',
    'Écarté couché': 'Dumbbell Fly',
    'Pompes': 'Push-ups',
    'Dips pectoraux': 'Chest Dips',
    'Tractions': 'Pull-ups',
    'Rowing haltère': 'One-Arm Dumbbell Row',
    'Rowing barre': 'Barbell Row',
    'Squat': 'Squat',
    'Soulevé de terre': 'Deadlift',
    'Planche': 'Plank',
    'Course à pied': 'Running',
  };
  return translations[name] || name;
}

function createExercise(name: string, muscleGroups: string[]): ExerciseData {
  const videoUrl = getVideoUrlForExercise(name);
  const exercise: ExerciseData = {
    id: slugifyId(name),
    name,
    nameEn: getEnglishName(name),
    muscleGroups,
    equipment: getEquipmentForExercise(name),
    difficulty: getDifficultyForExercise(name),
    instructions: getInstructionsForExercise(name),
    tips: getTipsForExercise(name),
    category: 'strength',             // par défaut
    targetMuscles: muscleGroups,
    secondaryMuscles: [],
    movementType: 'compound',
    forceType: 'push',
    plane: 'sagittal',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  // Ajouter videoUrl seulement s'il existe
  if (videoUrl) {
    exercise.videoUrl = videoUrl;
  }
  
  return exercise;
}

/* -------------------- Batching util -------------------- */

function newBatch() {
  return {
    batch: writeBatch(firestore),
    ops: 0,
  };
}

async function commitIfNeeded(state: { batch: WriteBatch; ops: number }) {
  if (state.ops >= BATCH_LIMIT) {
    await state.batch.commit();
    state.batch = writeBatch(firestore);
    state.ops = 0;
  }
}

async function finalCommit(state: { batch: WriteBatch; ops: number }) {
  if (state.ops > 0) {
    await state.batch.commit();
    state.ops = 0;
  }
}

/* -------------------- Migration principale -------------------- */

async function migrateAll(): Promise<void> {
  console.log('🎯 Script de migration simplifié RevoFit');
  console.log('========================================');
  console.log('🚀 Début de la migration complète...\n');

  // Note: Les règles Firestore doivent permettre l'accès sans authentification

  const state = newBatch();

  try {
    // 1. Migration des groupes musculaires
    console.log('💪 Migration des groupes musculaires...');
    for (const muscleGroup of MUSCLE_GROUPS) {
      console.log(`  • ${muscleGroup.name} (${muscleGroup.id})`);
      const ref = doc(firestore, 'muscleGroups', muscleGroup.id);
      state.batch.set(ref, muscleGroup);
      state.ops++;
      await commitIfNeeded(state);
    }
    console.log(`✅ ${MUSCLE_GROUPS.length} groupes musculaires migrés avec succès !`);

    // 2. Migration des exercices
    console.log('\n💪 Migration des exercices...');
    const exerciseToMuscleGroupMap = mapExercisesToMuscleGroups();
    const exerciseEntries = Object.entries(exerciseToMuscleGroupMap);

    for (const [exerciseName, muscleGroupIds] of exerciseEntries) {
      const exo = createExercise(exerciseName, muscleGroupIds);
      console.log(`  • ${exo.name} → ${muscleGroupIds.length} groupe(s) musculaire(s)`);
      const ref = doc(firestore, 'exercises', exo.id);
      state.batch.set(ref, exo);
      state.ops++;
      await commitIfNeeded(state);
    }
    console.log(`✅ ${exerciseEntries.length} exercices migrés avec succès !`);

    // 3. Migration des workouts d'exemple complets
    console.log('\n💪 Migration des workouts d\'exemple...');
    
    const sampleWorkouts = [
      {
        id: 'workout_debutant_corps_entier',
        name: 'Workout Débutant - Corps Entier',
        description: 'Un workout complet pour débuter en douceur, ciblant tous les groupes musculaires principaux.',
        muscleGroups: ['chest_global', 'back_width', 'shoulders_front', 'quadriceps', 'glutes'],
        exercises: [
          {
            id: 'push-ups',
            name: 'Pompes',
            nameEn: 'Push-ups',
            muscleGroups: ['chest_global', 'triceps_lateral', 'shoulders_front'],
            equipment: ['aucun'],
            difficulty: 'beginner',
            instructions: [
              'Placez-vous en position de planche',
              'Descendez votre corps jusqu\'à ce que votre poitrine touche presque le sol',
              'Poussez vers le haut jusqu\'à la position de départ'
            ],
            tips: [
              'Gardez votre corps droit',
              'Respirez en descendant, expirez en montant'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'squats',
            name: 'Squats',
            nameEn: 'Squats',
            muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
            equipment: ['aucun'],
            difficulty: 'beginner',
            instructions: [
              'Tenez-vous debout, pieds écartés de la largeur des épaules',
              'Descendez comme si vous vous asseyiez sur une chaise',
              'Remontez en poussant sur vos talons'
            ],
            tips: [
              'Gardez vos genoux alignés avec vos orteils',
              'Descendez jusqu\'à ce que vos cuisses soient parallèles au sol'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        duration: 30,
        difficulty: 'beginner',
        equipment: ['aucun'],
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'workout_intermediaire_force',
        name: 'Workout Intermédiaire - Force',
        description: 'Un workout axé sur le développement de la force avec des exercices plus intenses.',
        muscleGroups: ['chest_global', 'back_thickness', 'shoulders_lateral', 'biceps_global', 'triceps_lateral'],
        exercises: [
          {
            id: 'bench-press',
            name: 'Développé couché',
            nameEn: 'Bench Press',
            muscleGroups: ['chest_global', 'triceps_lateral', 'shoulders_front'],
            equipment: ['barre', 'banc'],
            difficulty: 'intermediate',
            instructions: [
              'Allongez-vous sur le banc',
              'Saisissez la barre avec une prise légèrement plus large que les épaules',
              'Descendez la barre jusqu\'à votre poitrine',
              'Poussez vers le haut jusqu\'à l\'extension complète'
            ],
            tips: [
              'Gardez vos pieds fermement plantés au sol',
              'Contrôlez la descente sur 2-3 secondes'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476b?w=400&q=80&auto=format&fit=crop',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'pull-ups',
            name: 'Tractions',
            nameEn: 'Pull-ups',
            muscleGroups: ['back_width', 'biceps_global'],
            equipment: ['barre de traction'],
            difficulty: 'intermediate',
            instructions: [
              'Suspendez-vous à la barre de traction',
              'Tirez votre corps vers le haut jusqu\'à ce que votre menton dépasse la barre',
              'Descendez lentement jusqu\'à la position de départ'
            ],
            tips: [
              'Gardez votre corps droit',
              'Engagez vos omoplates'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        duration: 45,
        difficulty: 'intermediate',
        equipment: ['barre', 'banc', 'barre de traction'],
        imageUrl: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476b?w=400&q=80&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'workout_avance_hiit',
        name: 'Workout Avancé - HIIT',
        description: 'Un workout HIIT intense pour brûler les calories et améliorer la condition physique.',
        muscleGroups: ['quadriceps', 'hamstrings', 'glutes', 'abs_rectus', 'chest_global'],
        exercises: [
          {
            id: 'burpees',
            name: 'Burpees',
            nameEn: 'Burpees',
            muscleGroups: ['quadriceps', 'chest_global', 'triceps_lateral', 'abs_rectus'],
            equipment: ['aucun'],
            difficulty: 'advanced',
            instructions: [
              'Commencez debout',
              'Accroupissez-vous et placez vos mains au sol',
              'Sautez vos pieds en arrière en position de planche',
              'Faites une pompe',
              'Sautez vos pieds vers vos mains',
              'Sautez vers le haut avec les bras levés'
            ],
            tips: [
              'Maintenez un rythme rapide',
              'Gardez votre corps engagé tout au long du mouvement'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'mountain-climbers',
            name: 'Grimpeurs',
            nameEn: 'Mountain Climbers',
            muscleGroups: ['quadriceps', 'hamstrings', 'abs_rectus', 'shoulders_front'],
            equipment: ['aucun'],
            difficulty: 'advanced',
            instructions: [
              'Commencez en position de planche',
              'Alternez rapidement en ramenant vos genoux vers votre poitrine',
              'Maintenez un rythme rapide et constant'
            ],
            tips: [
              'Gardez vos hanches stables',
              'Maintenez une position de planche solide'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        duration: 20,
        difficulty: 'advanced',
        equipment: ['aucun'],
        imageUrl: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476b?w=400&q=80&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    ];

    for (const workout of sampleWorkouts) {
      console.log(`  • ${workout.name}`);
      const ref = doc(firestore, 'exerciseTemplates', workout.id);
      state.batch.set(ref, workout);
      state.ops++;
      await commitIfNeeded(state);
    }

    // 4. Migration des templates de test
    console.log('\n🧪 Migration des templates de test...');
    
    const testTemplates = [
      {
        id: 'push_day',
        name: 'Push Day',
        description: 'Entraînement pour les muscles pousseurs',
        muscleGroups: ['chest_global', 'triceps_lateral', 'shoulders_front'],
        exercises: [
          {
            id: 'pushup',
            name: 'Pompes',
            nameEn: 'Push-ups',
            muscleGroups: ['chest_global', 'triceps_lateral'],
            equipment: ['aucun'],
            difficulty: 'beginner',
            instructions: ['Placez-vous en position de planche', 'Descendez et remontez'],
            tips: ['Gardez le corps droit'],
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop',
            videoUrl: 'https://example.com/pushups',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        duration: 30,
        difficulty: 'beginner',
        equipment: ['aucun'],
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'test-user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'pull_day',
        name: 'Pull Day',
        description: 'Entraînement pour les muscles tireurs',
        muscleGroups: ['back_width', 'biceps_global'],
        exercises: [
          {
            id: 'pullup',
            name: 'Tractions',
            nameEn: 'Pull-ups',
            muscleGroups: ['back_width', 'biceps_global'],
            equipment: ['barre de traction'],
            difficulty: 'intermediate',
            instructions: ['Suspendez-vous à la barre', 'Tirez votre corps vers le haut'],
            tips: ['Engagez les omoplates'],
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop',
            videoUrl: 'https://example.com/pullups',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        duration: 25,
        difficulty: 'intermediate',
        equipment: ['barre de traction'],
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'test-user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'leg_day',
        name: 'Leg Day',
        description: 'Entraînement complet des jambes',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        exercises: [
          {
            id: 'squat',
            name: 'Squats',
            nameEn: 'Squats',
            muscleGroups: ['quadriceps', 'glutes'],
            equipment: ['aucun'],
            difficulty: 'beginner',
            instructions: ['Pieds écartés largeur des épaules', 'Descendez comme pour vous asseoir'],
            tips: ['Gardez les genoux alignés'],
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop',
            videoUrl: 'https://example.com/squats',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        duration: 35,
        difficulty: 'beginner',
        equipment: ['aucun'],
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'test-user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    for (const template of testTemplates) {
      console.log(`  • ${template.name}`);
      const ref = doc(firestore, 'exerciseTemplates', template.id);
      state.batch.set(ref, template);
      state.ops++;
      await commitIfNeeded(state);
    }

    // 5. Migration des données nutritionnelles complètes
    console.log('\n🍽️ Migration des données nutritionnelles...');
    
    const nutritionGoals = [
      {
        id: 'nutrition_goal_test_user_1',
        userId: 'test-user-1',
        calories: 2200,
        protein: 150,
        carbs: 250,
        fats: 80,
        fiber: 30,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    ];

    for (const goal of nutritionGoals) {
      console.log(`  • Objectif nutritionnel (${goal.calories} cal)`);
      const ref = doc(firestore, 'nutritionGoals', goal.id);
      state.batch.set(ref, goal);
      state.ops++;
      await commitIfNeeded(state);
    }

    const sampleMeals = [
      {
        id: 'meal_omelette_epinards',
        userId: 'test-user-1',
        name: 'Omelette aux épinards',
        category: 'breakfast',
        calories: 320,
        protein: 22,
        carbs: 8,
        fats: 24,
        fiber: 3,
        date: new Date().toISOString().split('T')[0],
        time: '08:30',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'meal_salade_quinoa_poulet',
        userId: 'test-user-1',
        name: 'Salade de quinoa et poulet',
        category: 'lunch',
        calories: 450,
        protein: 35,
        carbs: 42,
        fats: 18,
        fiber: 6,
        date: new Date().toISOString().split('T')[0],
        time: '13:00',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'meal_smoothie_proteine',
        userId: 'test-user-1',
        name: 'Smoothie protéiné',
        category: 'snack',
        calories: 180,
        protein: 25,
        carbs: 15,
        fats: 4,
        fiber: 2,
        date: new Date().toISOString().split('T')[0],
        time: '16:30',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'meal_saumon_grille_legumes',
        userId: 'test-user-1',
        name: 'Saumon grillé avec légumes',
        category: 'dinner',
        calories: 380,
        protein: 32,
        carbs: 18,
        fats: 22,
        fiber: 8,
        date: new Date().toISOString().split('T')[0],
        time: '20:00',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    ];

    for (const meal of sampleMeals) {
      console.log(`  • Repas: ${meal.name}`);
      const ref = doc(firestore, 'meals', meal.id);
      state.batch.set(ref, meal);
      state.ops++;
      await commitIfNeeded(state);
    }

    // 6. Migration des recettes complètes
    console.log('\n🍳 Migration des recettes complètes...');
    
    const sampleRecipes = [
      {
        id: 'bowl_proteine_quinoa',
        name: 'Bowl protéiné quinoa',
        description: 'Bowl énergisant avec quinoa, fruits et noix',
        category: 'breakfast',
        calories: 420,
        protein: 28,
        carbs: 45,
        fats: 12,
        fiber: 8,
        prepTime: 25,
        difficulty: 'easy',
        servings: 1,
        ingredients: [
          '100g de quinoa cuit',
          '1 banane',
          '50g de myrtilles',
          '20g d\'amandes',
          '1 c.à.s de miel',
          '1 c.à.s de graines de chia'
        ],
        instructions: [
          'Cuire le quinoa selon les instructions',
          'Couper la banane en rondelles',
          'Mélanger le quinoa avec les fruits',
          'Ajouter les amandes et les graines de chia',
          'Arroser de miel'
        ],
        tags: ['Végétarien', 'Riche en protéines', 'Sans gluten', 'Énergisant'],
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'smoothie_vert_energisant',
        name: 'Smoothie vert énergisant',
        description: 'Smoothie vert riche en vitamines et minéraux',
        category: 'breakfast',
        calories: 180,
        protein: 15,
        carbs: 22,
        fats: 4,
        fiber: 6,
        prepTime: 5,
        difficulty: 'easy',
        servings: 1,
        ingredients: [
          '1 banane',
          '1 poignée d\'épinards',
          '1 kiwi',
          '200ml de lait d\'amande',
          '1 c.à.s de spiruline',
          '1 c.à.s de miel'
        ],
        instructions: [
          'Laver les épinards',
          'Éplucher la banane et le kiwi',
          'Mettre tous les ingrédients dans un blender',
          'Mixer jusqu\'à obtenir une texture lisse',
          'Servir immédiatement'
        ],
        tags: ['Vegan', 'Rapide', 'Énergisant', 'Riche en vitamines'],
        imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'omelette_legumes',
        name: 'Omelette aux légumes',
        description: 'Omelette légère et colorée aux légumes de saison',
        category: 'breakfast',
        calories: 280,
        protein: 22,
        carbs: 8,
        fats: 18,
        fiber: 3,
        prepTime: 15,
        difficulty: 'easy',
        servings: 1,
        ingredients: [
          '3 œufs',
          '50g de tomates cerises',
          '30g d\'épinards',
          '20g de fromage râpé',
          '1 c.à.s d\'huile d\'olive',
          'Herbes de Provence'
        ],
        instructions: [
          'Battre les œufs en omelette',
          'Couper les tomates en deux',
          'Faire revenir les épinards dans l\'huile',
          'Ajouter les tomates et les œufs',
          'Cuire à feu doux',
          'Parsemer de fromage et d\'herbes'
        ],
        tags: ['Riche en protéines', 'Léger', 'Rapide', 'Équilibré'],
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'salade_pois_chiches',
        name: 'Salade de pois chiches',
        description: 'Salade complète et rassasiante aux pois chiches',
        category: 'lunch',
        calories: 320,
        protein: 18,
        carbs: 35,
        fats: 12,
        fiber: 12,
        prepTime: 20,
        difficulty: 'easy',
        servings: 1,
        ingredients: [
          '150g de pois chiches cuits',
          '1 tomate',
          '1/2 concombre',
          '50g de feta',
          '1/4 d\'oignon rouge',
          '2 c.à.s d\'huile d\'olive',
          'Jus de citron',
          'Persil frais'
        ],
        instructions: [
          'Rincer et égoutter les pois chiches',
          'Couper les légumes en dés',
          'Émietter la feta',
          'Mélanger tous les ingrédients',
          'Arroser d\'huile d\'olive et de jus de citron',
          'Parsemer de persil'
        ],
        tags: ['Végétarien', 'Fibres', 'Rapide', 'Méditerranéen'],
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'saumon_grille_legumes',
        name: 'Saumon grillé légumes',
        description: 'Filet de saumon grillé avec légumes rôtis',
        category: 'lunch',
        calories: 380,
        protein: 35,
        carbs: 18,
        fats: 22,
        fiber: 6,
        prepTime: 35,
        difficulty: 'medium',
        servings: 1,
        ingredients: [
          '150g de filet de saumon',
          '200g de légumes mélangés',
          '1 c.à.s d\'huile d\'olive',
          'Herbes de Provence',
          'Sel et poivre',
          'Jus de citron'
        ],
        instructions: [
          'Préchauffer le four à 200°C',
          'Assaisonner le saumon',
          'Disposer les légumes sur une plaque',
          'Arroser d\'huile d\'olive',
          'Enfourner 25 minutes',
          'Servir avec du jus de citron'
        ],
        tags: ['Oméga-3', 'Riche en protéines', 'Anti-inflammatoire', 'Sain'],
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'buddha_bowl_legumes',
        name: 'Bowl Buddha aux légumes',
        description: 'Bowl coloré et nutritif aux légumes de saison',
        category: 'lunch',
        calories: 350,
        protein: 16,
        carbs: 42,
        fats: 14,
        fiber: 10,
        prepTime: 30,
        difficulty: 'medium',
        servings: 1,
        ingredients: [
          '80g de quinoa cuit',
          '100g de patate douce',
          '50g de brocolis',
          '1/2 avocat',
          '50g de chou kale',
          '1 c.à.s de tahini',
          'Jus de citron',
          'Graines de sésame'
        ],
        instructions: [
          'Cuire le quinoa',
          'Rôtir la patate douce au four',
          'Cuire les brocolis à la vapeur',
          'Préparer la sauce tahini',
          'Disposer tous les ingrédients dans un bol',
          'Arroser de sauce et parsemer de graines'
        ],
        tags: ['Vegan', 'Équilibré', 'Riche en fibres', 'Coloré'],
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'energy_balls_dattes',
        name: 'Energy balls aux dattes',
        description: 'Boules énergétiques aux dattes et noix',
        category: 'snack',
        calories: 120,
        protein: 4,
        carbs: 18,
        fats: 5,
        fiber: 3,
        prepTime: 15,
        difficulty: 'easy',
        servings: 1,
        ingredients: [
          '3 dattes dénoyautées',
          '20g d\'amandes',
          '1 c.à.s de cacao en poudre',
          '1 c.à.s de noix de coco râpée',
          '1 c.à.s de graines de chia'
        ],
        instructions: [
          'Mixer les dattes et les amandes',
          'Ajouter le cacao et la noix de coco',
          'Former des petites boules',
          'Rouler dans les graines de chia',
          'Réserver au frais 30 minutes'
        ],
        tags: ['Vegan', 'Sans cuisson', 'Énergisant', 'Rapide'],
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'yaourt_grec_fruits',
        name: 'Yaourt grec aux fruits',
        description: 'Yaourt grec crémeux avec fruits frais',
        category: 'snack',
        calories: 150,
        protein: 12,
        carbs: 20,
        fats: 3,
        fiber: 4,
        prepTime: 5,
        difficulty: 'easy',
        servings: 1,
        ingredients: [
          '150g de yaourt grec',
          '50g de fruits rouges',
          '1 c.à.s de miel',
          '1 c.à.s de noix de coco râpée',
          'Quelques feuilles de menthe'
        ],
        instructions: [
          'Verser le yaourt dans un bol',
          'Ajouter les fruits rouges',
          'Arroser de miel',
          'Parsemer de noix de coco',
          'Décorer avec la menthe'
        ],
        tags: ['Riche en protéines', 'Rapide', 'Frais', 'Léger'],
        imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'poulet_herbes_legumes',
        name: 'Poulet aux herbes et légumes',
        description: 'Filet de poulet aux herbes avec légumes rôtis',
        category: 'dinner',
        calories: 320,
        protein: 38,
        carbs: 15,
        fats: 12,
        fiber: 5,
        prepTime: 40,
        difficulty: 'medium',
        servings: 1,
        ingredients: [
          '150g de filet de poulet',
          '200g de légumes mélangés',
          '2 c.à.s d\'huile d\'olive',
          'Herbes de Provence',
          'Ail en poudre',
          'Sel et poivre'
        ],
        instructions: [
          'Préchauffer le four à 180°C',
          'Assaisonner le poulet',
          'Disposer les légumes dans un plat',
          'Arroser d\'huile d\'olive',
          'Enfourner 35 minutes',
          'Servir chaud'
        ],
        tags: ['Riche en protéines', 'Faible en calories', 'Équilibré', 'Sain'],
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'curry_legumes_lait_coco',
        name: 'Curry de légumes au lait de coco',
        description: 'Curry végétarien épicé au lait de coco',
        category: 'dinner',
        calories: 280,
        protein: 12,
        carbs: 35,
        fats: 14,
        fiber: 8,
        prepTime: 45,
        difficulty: 'medium',
        servings: 1,
        ingredients: [
          '200g de légumes mélangés',
          '100ml de lait de coco',
          '1 c.à.s de curry en poudre',
          '1/2 oignon',
          '1 gousse d\'ail',
          '1 c.à.s d\'huile de coco',
          'Riz basmati'
        ],
        instructions: [
          'Faire revenir l\'oignon et l\'ail',
          'Ajouter les épices',
          'Incorporer les légumes',
          'Verser le lait de coco',
          'Laisser mijoter 30 minutes',
          'Servir avec du riz'
        ],
        tags: ['Vegan', 'Épicé', 'Riche en saveurs', 'Réchauffable'],
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
        isPublic: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    ];

    for (const recipe of sampleRecipes) {
      console.log(`  • ${recipe.name}`);
      const ref = doc(firestore, 'recipes', recipe.id);
      state.batch.set(ref, recipe);
      state.ops++;
      await commitIfNeeded(state);
    }

    // 7. Migration des données de statut d'entraînement
    console.log('\n🏋️ Migration des données de statut d\'entraînement...');
    
    const workoutStatusData = {
      id: 'workout_status_test_user_123',
      userId: 'test-user-123',
      strikes: 21,
      currentDay: 'Mer',
      workoutMessage: "C'est l'heure de s'entraîner ! 💪",
      upcomingDays: [
        { day: 18, label: 'Jeu' },
        { day: 19, label: 'Ven' },
        { day: 20, label: 'Sam' },
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log(`  • Statut d'entraînement (${workoutStatusData.strikes} strikes)`);
    const statusRef = doc(firestore, 'workoutStatus', workoutStatusData.id);
    state.batch.set(statusRef, workoutStatusData);
    state.ops++;
    await commitIfNeeded(state);

    console.log(`✅ Toutes les données migrées avec succès !`);

    await finalCommit(state);

    console.log('\n🎉 MIGRATION COMPLÈTE TERMINÉE AVEC SUCCÈS!');
    console.log('==========================================');
    console.log('📊 Résumé de la migration COMPLÈTE:');
    console.log(`   • Groupes musculaires: ${MUSCLE_GROUPS.length} ✅`);
    console.log(`   • Exercices: ${exerciseEntries.length} ✅`);
    console.log(`   • Workouts d'exemple: ${sampleWorkouts.length} ✅`);
    console.log(`   • Templates de test: ${testTemplates.length} ✅`);
    console.log(`   • Objectifs nutrition: ${nutritionGoals.length} ✅`);
    console.log(`   • Repas d'exemple: ${sampleMeals.length} ✅`);
    console.log(`   • Recettes complètes: ${sampleRecipes.length} ✅`);
    console.log(`   • Données de statut: 1 ✅`);
    console.log('   • URLs vidéos / instructions / tips: ajoutés quand dispo ✅');
    console.log('\n🚀 Votre base Firestore est COMPLÈTEMENT prête !');
    console.log('🎯 Tous les scripts du dossier ont été intégrés !');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

/* -------------------- Lancement -------------------- */

// Exécution directe du script
migrateAll()
  .then(() => {
    console.log('🎉 Migration terminée!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Échec de la migration:', error);
    process.exit(1);
  });

export { migrateAll };
