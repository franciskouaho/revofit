/**
 * Script pour ajouter des exercices d'exemple dans Firebase
 * Utilisé pour tester l'intégration Firebase
 */

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../services/firebase/config';
import { Exercise } from '../types/exercise';

const SAMPLE_EXERCISES: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Pompes",
    nameEn: "Push-ups",
    muscleGroups: ["chest_global", "triceps_lateral", "shoulders_front"],
    equipment: ["aucun"],
    difficulty: "beginner",
    instructions: [
      "Placez-vous en position de planche avec les mains légèrement plus larges que les épaules",
      "Gardez votre corps droit de la tête aux pieds",
      "Descendez votre corps jusqu'à ce que votre poitrine touche presque le sol",
      "Poussez vers le haut jusqu'à la position de départ"
    ],
    tips: [
      "Gardez votre corps droit tout au long du mouvement",
      "Respirez en descendant, expirez en montant",
      "Engagez vos abdominaux pour maintenir la stabilité"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
    videoUrl: "https://example.com/pushups-video"
  },
  {
    name: "Squats",
    nameEn: "Squats",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["aucun"],
    difficulty: "beginner",
    instructions: [
      "Tenez-vous debout, pieds écartés de la largeur des épaules",
      "Gardez votre dos droit et vos abdominaux engagés",
      "Descendez comme si vous vous asseyiez sur une chaise",
      "Descendez jusqu'à ce que vos cuisses soient parallèles au sol",
      "Remontez en poussant sur vos talons"
    ],
    tips: [
      "Gardez vos genoux alignés avec vos orteils",
      "Ne laissez pas vos genoux s'effondrer vers l'intérieur",
      "Gardez votre poids sur vos talons"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
    videoUrl: "https://example.com/squats-video"
  },
  {
    name: "Développé couché",
    nameEn: "Bench Press",
    muscleGroups: ["chest_global", "triceps_lateral", "shoulders_front"],
    equipment: ["barre", "banc"],
    difficulty: "intermediate",
    instructions: [
      "Allongez-vous sur le banc avec vos pieds fermement plantés au sol",
      "Saisissez la barre avec une prise légèrement plus large que les épaules",
      "Descendez la barre de manière contrôlée jusqu'à votre poitrine",
      "Poussez la barre vers le haut jusqu'à l'extension complète des bras"
    ],
    tips: [
      "Gardez vos omoplates rétractées",
      "Contrôlez la descente sur 2-3 secondes",
      "Ne rebondissez pas la barre sur votre poitrine"
    ],
    imageUrl: "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?w=400&q=80&auto=format&fit=crop",
    videoUrl: "https://example.com/bench-press-video"
  },
  {
    name: "Tractions",
    nameEn: "Pull-ups",
    muscleGroups: ["back_width", "biceps_global"],
    equipment: ["barre de traction"],
    difficulty: "intermediate",
    instructions: [
      "Suspendez-vous à la barre de traction avec une prise en pronation",
      "Engagez vos omoplates et tirez votre corps vers le haut",
      "Continuez jusqu'à ce que votre menton dépasse la barre",
      "Descendez lentement et de manière contrôlée"
    ],
    tips: [
      "Gardez votre corps droit et évitez de vous balancer",
      "Engagez vos abdominaux pour la stabilité",
      "Concentrez-vous sur l'engagement des muscles du dos"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
    videoUrl: "https://example.com/pullups-video"
  },
  {
    name: "Burpees",
    nameEn: "Burpees",
    muscleGroups: ["quadriceps", "chest_global", "triceps_lateral", "abs_rectus"],
    equipment: ["aucun"],
    difficulty: "advanced",
    instructions: [
      "Commencez debout",
      "Accroupissez-vous et placez vos mains au sol",
      "Sautez vos pieds en arrière en position de planche",
      "Faites une pompe",
      "Sautez vos pieds vers vos mains",
      "Sautez vers le haut avec les bras levés"
    ],
    tips: [
      "Maintenez un rythme rapide et constant",
      "Gardez votre corps engagé tout au long du mouvement",
      "Atterrissez doucement pour protéger vos articulations"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
    videoUrl: "https://example.com/burpees-video"
  },
  {
    name: "Planche",
    nameEn: "Plank",
    muscleGroups: ["abs_rectus", "shoulders_front", "triceps_lateral"],
    equipment: ["aucun"],
    difficulty: "beginner",
    instructions: [
      "Commencez en position de pompe",
      "Descendez sur vos avant-bras",
      "Gardez votre corps droit de la tête aux pieds",
      "Maintenez cette position en engageant vos abdominaux"
    ],
    tips: [
      "Gardez vos hanches alignées avec vos épaules",
      "Respirez normalement",
      "Engagez vos abdominaux et vos fessiers"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
    videoUrl: "https://example.com/plank-video"
  },
  {
    name: "Développé militaire",
    nameEn: "Military Press",
    muscleGroups: ["shoulders_front", "triceps_lateral"],
    equipment: ["barre"],
    difficulty: "intermediate",
    instructions: [
      "Tenez-vous debout avec les pieds écartés de la largeur des épaules",
      "Saisissez la barre avec une prise légèrement plus large que les épaules",
      "Amenez la barre au niveau de vos épaules",
      "Poussez la barre vers le haut jusqu'à l'extension complète",
      "Descendez de manière contrôlée"
    ],
    tips: [
      "Gardez votre dos droit et vos abdominaux engagés",
      "Ne fléchissez pas les genoux",
      "Contrôlez le mouvement dans les deux directions"
    ],
    imageUrl: "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?w=400&q=80&auto=format&fit=crop",
    videoUrl: "https://example.com/military-press-video"
  },
  {
    name: "Curl haltères",
    nameEn: "Dumbbell Curls",
    muscleGroups: ["biceps_global"],
    equipment: ["haltères"],
    difficulty: "beginner",
    instructions: [
      "Tenez-vous debout avec un haltère dans chaque main",
      "Gardez vos coudes près du corps",
      "Curl les haltères vers vos épaules",
      "Contractez vos biceps en haut du mouvement",
      "Descendez de manière contrôlée"
    ],
    tips: [
      "Ne balancez pas les haltères",
      "Gardez vos coudes fixes",
      "Contrôlez la descente sur 2-3 secondes"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
    videoUrl: "https://example.com/dumbbell-curls-video"
  }
];

async function addSampleExercises() {
  try {
    console.log("🚀 Ajout des exercices d'exemple...");
    
    const collectionRef = collection(firestore, 'exercises');
    
    for (const exercise of SAMPLE_EXERCISES) {
      const docRef = await addDoc(collectionRef, {
        ...exercise,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Exercice ajouté avec l'ID: ${docRef.id}`);
    }
    
    console.log("🎉 Tous les exercices ont été ajoutés avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des exercices:", error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  addSampleExercises().then(() => {
    console.log("Script terminé");
    process.exit(0);
  });
}

export { addSampleExercises };
