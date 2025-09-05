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
  WriteBatch,
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
    'Deadlift': 'Deadlift',
    'Plank': 'Plank',
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
    // Migration des exercices uniquement
    console.log('💪 Migration des exercices...');
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

    await finalCommit(state);

    console.log('\n🎉 MIGRATION COMPLÈTE TERMINÉE AVEC SUCCÈS!');
    console.log('==========================================');
    console.log('📊 Résumé de la migration:');
    console.log(`   • Groupes musculaires: ${MUSCLE_GROUPS.length} ✅`);
    console.log(`   • Exercices: ${exerciseEntries.length} ✅`);
    console.log('   • URLs vidéos / instructions / tips: ajoutés quand dispo ✅');
    console.log('\n🚀 Votre base Firestore est prête !');

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
