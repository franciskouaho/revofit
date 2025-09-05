#!/usr/bin/env ts-node

/**
 * Script de migration des exercices détaillés
 * Migre les données depuis ExerciseSelector.tsx vers Firebase avec des détails complets
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
interface DetailedExercise {
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
  category: 'strength' | 'cardio' | 'flexibility' | 'endurance';
  targetMuscles: string[];
  secondaryMuscles: string[];
  movementType: 'compound' | 'isolation';
  forceType: 'push' | 'pull' | 'squat' | 'hinge' | 'carry' | 'rotation';
  plane: 'sagittal' | 'frontal' | 'transverse';
  createdAt: any;
  updatedAt: any;
}

// Données des exercices depuis ExerciseSelector.tsx avec détails complets
const EXERCISES_DETAILED = {
  Pectoraux: [
    {
      name: "Développé couché",
      nameEn: "Bench Press",
      equipment: ["banc", "barre", "disques"],
      difficulty: "intermediate" as const,
      category: "strength" as const,
      targetMuscles: ["chest_global", "chest_upper"],
      secondaryMuscles: ["triceps_lateral", "shoulders_front"],
      movementType: "compound" as const,
      forceType: "push" as const,
      plane: "sagittal" as const,
      videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
      instructions: [
        "Allongez-vous sur le banc, pieds fermement au sol",
        "Saisissez la barre avec une prise légèrement plus large que les épaules",
        "Descendez la barre de manière contrôlée jusqu'à la poitrine",
        "Poussez la barre vers le haut jusqu'à l'extension complète des bras",
        "Maintenez la tension pendant 1 seconde en haut"
      ],
      tips: [
        "Gardez les omoplates rétractées",
        "Maintenez une légère cambrure naturelle du dos",
        "Contrôlez la descente sur 2-3 secondes",
        "Expirez lors de la montée"
      ]
    },
    {
      name: "Développé incliné",
      nameEn: "Incline Bench Press",
      equipment: ["banc incliné", "barre", "disques"],
      difficulty: "intermediate" as const,
      category: "strength" as const,
      targetMuscles: ["chest_upper"],
      secondaryMuscles: ["shoulders_front", "triceps_lateral"],
      movementType: "compound" as const,
      forceType: "push" as const,
      plane: "sagittal" as const,
      instructions: [
        "Réglez le banc à 30-45 degrés d'inclinaison",
        "Allongez-vous et saisissez la barre",
        "Descendez la barre vers le haut de la poitrine",
        "Poussez vers le haut en contractant les pectoraux"
      ],
      tips: [
        "L'inclinaison cible le haut des pectoraux",
        "Gardez les pieds stables au sol",
        "Contrôlez le mouvement dans les deux phases"
      ]
    },
    {
      name: "Pompes",
      nameEn: "Push-ups",
      equipment: ["aucun"],
      difficulty: "beginner" as const,
      category: "strength" as const,
      targetMuscles: ["chest_global"],
      secondaryMuscles: ["triceps_lateral", "shoulders_front", "abs_rectus"],
      movementType: "compound" as const,
      forceType: "push" as const,
      plane: "sagittal" as const,
      instructions: [
        "Placez-vous en position de planche",
        "Mains légèrement plus larges que les épaules",
        "Descendez le corps en gardant le dos droit",
        "Poussez vers le haut jusqu'à l'extension complète"
      ],
      tips: [
        "Gardez le corps aligné de la tête aux pieds",
        "Contrôlez la descente sur 2 secondes",
        "Contractez les abdominaux pendant tout le mouvement"
      ]
    }
  ],
  Dos: [
    {
      name: "Tractions",
      nameEn: "Pull-ups",
      equipment: ["barre de traction"],
      difficulty: "intermediate" as const,
      category: "strength" as const,
      targetMuscles: ["lats", "back_width"],
      secondaryMuscles: ["biceps_global", "shoulders_rear", "traps"],
      movementType: "compound" as const,
      forceType: "pull" as const,
      plane: "sagittal" as const,
      instructions: [
        "Suspendez-vous à la barre, mains en pronation",
        "Tirez votre corps vers le haut jusqu'à ce que le menton dépasse la barre",
        "Descendez de manière contrôlée jusqu'à l'extension complète",
        "Répétez le mouvement"
      ],
      tips: [
        "Gardez les omoplates rétractées",
        "Évitez de balancer le corps",
        "Contrôlez la descente sur 2-3 secondes",
        "Engagez les abdominaux"
      ]
    },
    {
      name: "Rowing haltère",
      nameEn: "Dumbbell Row",
      equipment: ["haltères", "banc"],
      difficulty: "beginner" as const,
      category: "strength" as const,
      targetMuscles: ["back_thickness", "lats"],
      secondaryMuscles: ["biceps_global", "shoulders_rear"],
      movementType: "compound" as const,
      forceType: "pull" as const,
      plane: "sagittal" as const,
      instructions: [
        "Placez un genou et la main sur le banc",
        "Saisissez l'haltère de l'autre main",
        "Tirez l'haltère vers le torse en contractant les omoplates",
        "Descendez de manière contrôlée"
      ],
      tips: [
        "Gardez le dos droit",
        "Tirez avec le coude, pas avec le biceps",
        "Contractez les omoplates en fin de mouvement"
      ]
    },
    {
      name: "Deadlift",
      nameEn: "Deadlift",
      equipment: ["barre", "disques"],
      difficulty: "advanced" as const,
      category: "strength" as const,
      targetMuscles: ["back_thickness", "glutes", "hamstrings"],
      secondaryMuscles: ["traps", "abs_rectus", "quadriceps"],
      movementType: "compound" as const,
      forceType: "hinge" as const,
      plane: "sagittal" as const,
      instructions: [
        "Placez-vous debout, pieds écartés de la largeur des hanches",
        "Saisissez la barre avec une prise en pronation",
        "Descendez en poussant les hanches vers l'arrière",
        "Soulevez la barre en contractant les fessiers et les ischio-jambiers",
        "Redressez-vous complètement en contractant les omoplates"
      ],
      tips: [
        "Gardez la barre proche du corps",
        "Maintenez le dos droit",
        "Poussez les hanches vers l'avant en fin de mouvement",
        "Ne jamais arrondir le dos"
      ]
    }
  ],
  Épaules: [
    {
      name: "Développé militaire",
      nameEn: "Military Press",
      equipment: ["barre", "disques"],
      difficulty: "intermediate" as const,
      category: "strength" as const,
      targetMuscles: ["shoulders_front", "shoulders_lateral"],
      secondaryMuscles: ["triceps_lateral", "abs_rectus"],
      movementType: "compound" as const,
      forceType: "push" as const,
      plane: "sagittal" as const,
      instructions: [
        "Tenez la barre au niveau des épaules",
        "Poussez la barre vers le haut au-dessus de la tête",
        "Descendez de manière contrôlée jusqu'aux épaules",
        "Répétez le mouvement"
      ],
      tips: [
        "Gardez le tronc contracté",
        "Évitez de cambrer le dos",
        "Contrôlez le mouvement dans les deux phases"
      ]
    },
    {
      name: "Élévations latérales",
      nameEn: "Lateral Raises",
      equipment: ["haltères"],
      difficulty: "beginner" as const,
      category: "strength" as const,
      targetMuscles: ["shoulders_lateral"],
      secondaryMuscles: ["shoulders_front"],
      movementType: "isolation" as const,
      forceType: "push" as const,
      plane: "frontal" as const,
      instructions: [
        "Tenez un haltère dans chaque main",
        "Levez les bras sur les côtés jusqu'à la hauteur des épaules",
        "Descendez de manière contrôlée",
        "Répétez le mouvement"
      ],
      tips: [
        "Utilisez un poids modéré",
        "Contrôlez le mouvement lentement",
        "Évitez de balancer les haltères"
      ]
    }
  ],
  Biceps: [
    {
      name: "Curl haltères",
      nameEn: "Dumbbell Curl",
      equipment: ["haltères"],
      difficulty: "beginner" as const,
      category: "strength" as const,
      targetMuscles: ["biceps_global"],
      secondaryMuscles: ["biceps_long", "biceps_short"],
      movementType: "isolation" as const,
      forceType: "pull" as const,
      plane: "sagittal" as const,
      instructions: [
        "Tenez un haltère dans chaque main",
        "Curl les haltères vers les épaules",
        "Contractez les biceps en haut du mouvement",
        "Descendez de manière contrôlée"
      ],
      tips: [
        "Gardez les coudes près du corps",
        "Contrôlez la descente sur 2-3 secondes",
        "Évitez de balancer les haltères"
      ]
    },
    {
      name: "Curl marteau",
      nameEn: "Hammer Curl",
      equipment: ["haltères"],
      difficulty: "beginner" as const,
      category: "strength" as const,
      targetMuscles: ["biceps_global", "forearms"],
      secondaryMuscles: ["biceps_long"],
      movementType: "isolation" as const,
      forceType: "pull" as const,
      plane: "sagittal" as const,
      instructions: [
        "Tenez les haltères avec une prise neutre",
        "Curl les haltères vers les épaules",
        "Maintenez la prise neutre tout au long du mouvement",
        "Descendez de manière contrôlée"
      ],
      tips: [
        "Cible les biceps et les avant-bras",
        "Gardez les coudes stables",
        "Contrôlez le mouvement lentement"
      ]
    }
  ],
  Triceps: [
    {
      name: "Extensions nuque",
      nameEn: "Overhead Extension",
      equipment: ["haltère"],
      difficulty: "intermediate" as const,
      category: "strength" as const,
      targetMuscles: ["triceps_lateral", "triceps_medial"],
      secondaryMuscles: ["shoulders_front"],
      movementType: "isolation" as const,
      forceType: "push" as const,
      plane: "sagittal" as const,
      instructions: [
        "Tenez un haltère au-dessus de la tête",
        "Descendez l'haltère derrière la tête",
        "Poussez l'haltère vers le haut",
        "Contractez les triceps en fin de mouvement"
      ],
      tips: [
        "Gardez les coudes près de la tête",
        "Contrôlez le mouvement lentement",
        "Évitez de cambrer le dos"
      ]
    },
    {
      name: "Dips triceps",
      nameEn: "Triceps Dips",
      equipment: ["banc", "aucun"],
      difficulty: "intermediate" as const,
      category: "strength" as const,
      targetMuscles: ["triceps_lateral"],
      secondaryMuscles: ["shoulders_front", "chest_global"],
      movementType: "compound" as const,
      forceType: "push" as const,
      plane: "sagittal" as const,
      instructions: [
        "Placez les mains sur le banc derrière vous",
        "Descendez le corps en pliant les coudes",
        "Poussez vers le haut jusqu'à l'extension complète",
        "Répétez le mouvement"
      ],
      tips: [
        "Gardez le corps droit",
        "Contrôlez la descente",
        "Évitez de descendre trop bas"
      ]
    }
  ],
  Jambes: [
    {
      name: "Squat",
      nameEn: "Squat",
      equipment: ["barre", "disques"],
      difficulty: "intermediate" as const,
      category: "strength" as const,
      targetMuscles: ["quadriceps", "glutes"],
      secondaryMuscles: ["hamstrings", "abs_rectus"],
      movementType: "compound" as const,
      forceType: "squat" as const,
      plane: "sagittal" as const,
      instructions: [
        "Placez-vous debout, pieds écartés de la largeur des épaules",
        "Descendez en pliant les genoux et poussant les hanches vers l'arrière",
        "Descendez jusqu'à ce que les cuisses soient parallèles au sol",
        "Remontez en poussant sur les talons"
      ],
      tips: [
        "Gardez le dos droit",
        "Poussez les genoux vers l'extérieur",
        "Contrôlez le mouvement dans les deux phases"
      ]
    },
    {
      name: "Hip thrust",
      nameEn: "Hip Thrust",
      equipment: ["banc", "barre", "disques"],
      difficulty: "intermediate" as const,
      category: "strength" as const,
      targetMuscles: ["glutes"],
      secondaryMuscles: ["hamstrings", "abs_rectus"],
      movementType: "compound" as const,
      forceType: "hinge" as const,
      plane: "sagittal" as const,
      instructions: [
        "Asseyez-vous contre le banc, barre sur les hanches",
        "Poussez les hanches vers le haut",
        "Contractez les fessiers en haut du mouvement",
        "Descendez de manière contrôlée"
      ],
      tips: [
        "Cible principalement les fessiers",
        "Gardez le tronc contracté",
        "Contrôlez le mouvement lentement"
      ]
    },
    {
      name: "Lunges",
      nameEn: "Lunges",
      equipment: ["aucun", "haltères"],
      difficulty: "beginner" as const,
      category: "strength" as const,
      targetMuscles: ["quadriceps", "glutes"],
      secondaryMuscles: ["hamstrings", "abs_rectus"],
      movementType: "compound" as const,
      forceType: "squat" as const,
      plane: "sagittal" as const,
      instructions: [
        "Faites un grand pas en avant",
        "Descendez jusqu'à ce que le genou arrière touche presque le sol",
        "Poussez sur la jambe avant pour revenir à la position de départ",
        "Répétez avec l'autre jambe"
      ],
      tips: [
        "Gardez le tronc droit",
        "Contrôlez la descente",
        "Évitez que le genou dépasse les orteils"
      ]
    }
  ],
  Abdominaux: [
    {
      name: "Crunch",
      nameEn: "Crunch",
      equipment: ["aucun"],
      difficulty: "beginner" as const,
      category: "strength" as const,
      targetMuscles: ["abs_rectus"],
      secondaryMuscles: ["abs_obliques"],
      movementType: "isolation" as const,
      forceType: "pull" as const,
      plane: "sagittal" as const,
      instructions: [
        "Allongez-vous sur le dos, genoux pliés",
        "Placez les mains derrière la tête",
        "Soulevez les épaules du sol",
        "Contractez les abdominaux",
        "Descendez de manière contrôlée"
      ],
      tips: [
        "Ne tirez pas sur la nuque",
        "Contractez les abdominaux",
        "Contrôlez le mouvement lentement"
      ]
    },
    {
      name: "Plank",
      nameEn: "Plank",
      equipment: ["aucun"],
      difficulty: "beginner" as const,
      category: "strength" as const,
      targetMuscles: ["abs_rectus", "abs_transverse"],
      secondaryMuscles: ["shoulders_front", "glutes"],
      movementType: "isolation" as const,
      forceType: "carry" as const,
      plane: "sagittal" as const,
      instructions: [
        "Placez-vous en position de planche",
        "Appuyez-vous sur les avant-bras",
        "Gardez le corps aligné de la tête aux pieds",
        "Maintenez la position"
      ],
      tips: [
        "Gardez le corps droit",
        "Contractez les abdominaux",
        "Respirez normalement"
      ]
    }
  ],
  Cardio: [
    {
      name: "Course à pied",
      nameEn: "Running",
      equipment: ["aucun"],
      difficulty: "beginner" as const,
      category: "cardio" as const,
      targetMuscles: ["quadriceps", "hamstrings", "glutes"],
      secondaryMuscles: ["calves_gastro", "calves_soleus"],
      movementType: "compound" as const,
      forceType: "carry" as const,
      plane: "sagittal" as const,
      instructions: [
        "Commencez par un échauffement de 5 minutes",
        "Maintenez un rythme régulier",
        "Gardez une posture droite",
        "Respirez de manière contrôlée"
      ],
      tips: [
        "Portez de bonnes chaussures",
        "Hydratez-vous régulièrement",
        "Écoutez votre corps"
      ]
    },
    {
      name: "Burpees",
      nameEn: "Burpees",
      equipment: ["aucun"],
      difficulty: "intermediate" as const,
      category: "cardio" as const,
      targetMuscles: ["quadriceps", "glutes", "chest_global"],
      secondaryMuscles: ["shoulders_front", "triceps_lateral", "abs_rectus"],
      movementType: "compound" as const,
      forceType: "push" as const,
      plane: "sagittal" as const,
      instructions: [
        "Commencez debout",
        "Descendez en position de squat",
        "Placez les mains au sol et sautez les pieds en arrière",
        "Faites une pompe",
        "Sauter les pieds vers les mains",
        "Sauter vers le haut avec les bras levés"
      ],
      tips: [
        "Maintenez un rythme régulier",
        "Gardez le tronc contracté",
        "Contrôlez chaque phase du mouvement"
      ]
    }
  ]
};

// Fonction pour obtenir l'URL vidéo d'un exercice
function getVideoUrlForExercise(name: string): string | undefined {
  const videoUrls: { [key: string]: string } = {
    'Développé couché': 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    'Développé incliné': 'https://www.youtube.com/watch?v=8iPEnov-lmU',
    'Développé décliné': 'https://www.youtube.com/watch?v=0G2_XV7seOk',
    'Écarté couché': 'https://www.youtube.com/watch?v=Z57nF3iOuG4',
    'Écarté incliné': 'https://www.youtube.com/watch?v=8iPEnov-lmU',
    'Écarté décliné': 'https://www.youtube.com/watch?v=0G2_XV7seOk',
    'Pompes': 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    'Dips pectoraux': 'https://www.youtube.com/watch?v=2s8F0IuM_3o',
    'Développé haltères pectoraux': 'https://www.youtube.com/watch?v=Z57nF3iOuG4',
    'Butterfly': 'https://www.youtube.com/watch?v=Z57nF3iOuG4',
    'Pull-over': 'https://www.youtube.com/watch?v=Z57nF3iOuG4',
    'Tractions': 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    'Rowing haltère': 'https://www.youtube.com/watch?v=roCP6wCXPqo',
    'Rowing barre': 'https://www.youtube.com/watch?v=axoeDmW0oAY',
    'Rowing T-bar': 'https://www.youtube.com/watch?v=axoeDmW0oAY',
    'Rowing machine': 'https://www.youtube.com/watch?v=axoeDmW0oAY',
    'Tirage vertical': 'https://www.youtube.com/watch?v=CAwf7nqLu4Q',
    'Tirage horizontal': 'https://www.youtube.com/watch?v=CAwf7nqLu4Q',
    'Tirage nuque': 'https://www.youtube.com/watch?v=CAwf7nqLu4Q',
    'Shrugs': 'https://www.youtube.com/watch?v=CAwf7nqLu4Q',
    'Pull-down': 'https://www.youtube.com/watch?v=CAwf7nqLu4Q',
    'Deadlift': 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    'Good morning dos': 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    'Développé militaire': 'https://www.youtube.com/watch?v=0JfYxMRsUCQ',
    'Développé haltères épaules': 'https://www.youtube.com/watch?v=0JfYxMRsUCQ',
    'Élévations latérales': 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    'Élévations frontales': 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    'Élévations arrière': 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    'Arnold press': 'https://www.youtube.com/watch?v=0JfYxMRsUCQ',
    'Upright row': 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    'Face pull': 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    'Reverse flyes': 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    'Curl haltères': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'Curl barre': 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    'Curl pupitre': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'Curl marteau': 'https://www.youtube.com/watch?v=TwD-YGVP4Bk',
    'Curl concentré': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'Curl spider': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'Curl incliné': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'Curl 21': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'Preacher curl': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    'Extensions nuque': 'https://www.youtube.com/watch?v=Wz4Yd3g4ZRE',
    'Extensions poulie': 'https://www.youtube.com/watch?v=Wz4Yd3g4ZRE',
    'Dips triceps': 'https://www.youtube.com/watch?v=6kALZikXxLc',
    'Kickback': 'https://www.youtube.com/watch?v=6SS6K3lAwY8',
    'Skull crushers': 'https://www.youtube.com/watch?v=Wz4Yd3g4ZRE',
    'Diamond push-ups': 'https://www.youtube.com/watch?v=6kALZikXxLc',
    'Overhead extensions': 'https://www.youtube.com/watch?v=Wz4Yd3g4ZRE',
    'Rope pushdown': 'https://www.youtube.com/watch?v=Wz4Yd3g4ZRE',
    'Close grip bench press': 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    'Squat': 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
    'Squat avant': 'https://www.youtube.com/watch?v=uYumuL64VxU',
    'Squat bulgare': 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
    'Leg press': 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    'Extensions cuisses': 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    'Leg curl': 'https://www.youtube.com/watch?v=0tn5K9NlCfo',
    'Hip thrust': 'https://www.youtube.com/watch?v=u5n7Q6D3_0M',
    'Deadlift roumain': 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    'Good morning jambes': 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    'Lunges': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'Step-ups': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'Calf raises': 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    'Leg abduction': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'Leg adduction': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'Hip adduction': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'Hip abduction': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'Crunch': 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    'Crunch inversé': 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    'Plank': 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    'Side plank': 'https://www.youtube.com/watch?v=K2Vpjzuzaw0',
    'Russian twist': 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    'Leg raises': 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    'Bicycle crunch': 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    'Mountain climbers abdos': 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    'Ab wheel rollout': 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    'Cable woodchop': 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    'Course à pied': 'https://www.youtube.com/watch?v=5F8n8g8yEuM',
    'Vélo': 'https://www.youtube.com/watch?v=YQBYfqDqZ4Y',
    'Rameur': 'https://www.youtube.com/watch?v=WU4D6BUrkQI',
    'Elliptique': 'https://www.youtube.com/watch?v=YQBYfqDqZ4Y',
    'Escalier': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    'Burpees': 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    'Jumping jacks': 'https://www.youtube.com/watch?v=UpH7rm0cYbM',
    'Mountain climbers cardio': 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    'High knees': 'https://www.youtube.com/watch?v=UpH7rm0cYbM',
    'Butt kicks': 'https://www.youtube.com/watch?v=UpH7rm0cYbM'
  };
  
  return videoUrls[name];
}

// Fonction pour créer un exercice détaillé
function createDetailedExercise(exerciseData: any, muscleGroupIds: string[]): DetailedExercise {
  return {
    id: exerciseData.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
    name: exerciseData.name,
    nameEn: exerciseData.nameEn,
    muscleGroups: muscleGroupIds,
    equipment: exerciseData.equipment,
    difficulty: exerciseData.difficulty,
    instructions: exerciseData.instructions,
    tips: exerciseData.tips,
    category: exerciseData.category,
    targetMuscles: exerciseData.targetMuscles,
    secondaryMuscles: exerciseData.secondaryMuscles,
    movementType: exerciseData.movementType,
    forceType: exerciseData.forceType,
    plane: exerciseData.plane,
    videoUrl: exerciseData.videoUrl || getVideoUrlForExercise(exerciseData.name),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

// Fonction pour mapper les exercices aux groupes musculaires
function mapExercisesToMuscleGroups() {
  const exerciseToMuscleGroupMap: { [key: string]: string[] } = {};
  
  Object.entries(EXERCISES_DETAILED).forEach(([groupName, exercises]) => {
    exercises.forEach(exercise => {
      if (!exerciseToMuscleGroupMap[exercise.name]) {
        exerciseToMuscleGroupMap[exercise.name] = [];
      }
      
      // Mapping basé sur les targetMuscles de l'exercice
      exercise.targetMuscles.forEach(muscleId => {
        if (!exerciseToMuscleGroupMap[exercise.name].includes(muscleId)) {
          exerciseToMuscleGroupMap[exercise.name].push(muscleId);
        }
      });
    });
  });
  
  return exerciseToMuscleGroupMap;
}

// Fonction pour migrer les exercices détaillés
async function migrateDetailedExercises(): Promise<void> {
  console.log('🚀 Début de la migration des exercices détaillés...');
  
  try {
    const batch = writeBatch(firestore);
    const exerciseToMuscleGroupMap = mapExercisesToMuscleGroups();
    let exerciseCount = 0;
    
    for (const [exerciseName, muscleGroupIds] of Object.entries(exerciseToMuscleGroupMap)) {
      // Trouver les données de l'exercice
      let exerciseData = null;
      for (const exercises of Object.values(EXERCISES_DETAILED)) {
        const found = exercises.find(ex => ex.name === exerciseName);
        if (found) {
          exerciseData = found;
          break;
        }
      }
      
      if (exerciseData) {
        const detailedExercise = createDetailedExercise(exerciseData, muscleGroupIds);
        const exerciseRef = doc(firestore, 'exercises', detailedExercise.id);
        batch.set(exerciseRef, detailedExercise);
        exerciseCount++;
      }
    }
    
    // Exécuter le batch
    await batch.commit();
    
    console.log('✅ Migration des exercices détaillés terminée!');
    console.log(`💪 ${exerciseCount} exercices détaillés migrés`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration des exercices détaillés:', error);
    throw error;
  }
}

// Fonction pour valider la migration
async function validateDetailedMigration(): Promise<void> {
  console.log('🔍 Validation de la migration des exercices détaillés...');
  
  try {
    const q = query(collection(firestore, 'exercises'));
    const snapshot = await getDocs(q);
    
    const exercises = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`📊 Total des exercices: ${exercises.length}`);
    console.log(`💪 Exercices de force: ${exercises.filter(e => e.category === 'strength').length}`);
    console.log(`🏃 Exercices cardio: ${exercises.filter(e => e.category === 'cardio').length}`);
    console.log(`🤸 Exercices de flexibilité: ${exercises.filter(e => e.category === 'flexibility').length}`);
    
    // Vérifier les niveaux de difficulté
    console.log(`🟢 Débutants: ${exercises.filter(e => e.difficulty === 'beginner').length}`);
    console.log(`🟡 Intermédiaires: ${exercises.filter(e => e.difficulty === 'intermediate').length}`);
    console.log(`🔴 Avancés: ${exercises.filter(e => e.difficulty === 'advanced').length}`);
    
    // Vérifier les types de mouvement
    console.log(`🔗 Mouvements composés: ${exercises.filter(e => e.movementType === 'compound').length}`);
    console.log(`🎯 Mouvements d'isolation: ${exercises.filter(e => e.movementType === 'isolation').length}`);
    
    console.log('✅ Validation terminée!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error);
    throw error;
  }
}

// Fonction principale
async function main(): Promise<void> {
  try {
    console.log('🎯 Script de migration des exercices détaillés RevoFit');
    console.log('==================================================');
    
    // 1. Migrer les exercices détaillés
    await migrateDetailedExercises();
    
    // 2. Valider la migration
    await validateDetailedMigration();
    
    console.log('🎉 Migration des exercices détaillés terminée avec succès!');
    
  } catch (error) {
    console.error('💥 Échec de la migration:', error);
    process.exit(1);
  }
}

// Exécution du script
if (require.main === module) {
  main();
}

export { EXERCISES_DETAILED, migrateDetailedExercises, validateDetailedMigration };

