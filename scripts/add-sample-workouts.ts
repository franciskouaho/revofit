/**
 * Script pour ajouter des templates de workout d'exemple dans Firebase
 * Utilisé pour tester l'intégration Firebase
 */

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../services/firebase/config';
import { ExerciseTemplate } from '../types/exercise';

const SAMPLE_WORKOUTS: Omit<ExerciseTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Workout Débutant - Corps Entier",
    description: "Un workout complet pour débuter en douceur, ciblant tous les groupes musculaires principaux.",
    muscleGroups: ["chest_global", "back_width", "shoulders_front", "quadriceps", "glutes"],
    exercises: [
      {
        id: "push-ups",
        name: "Pompes",
        nameEn: "Push-ups",
        muscleGroups: ["chest_global", "triceps_lateral", "shoulders_front"],
        equipment: ["aucun"],
        difficulty: "beginner",
        instructions: [
          "Placez-vous en position de planche",
          "Descendez votre corps jusqu'à ce que votre poitrine touche presque le sol",
          "Poussez vers le haut jusqu'à la position de départ"
        ],
        tips: [
          "Gardez votre corps droit",
          "Respirez en descendant, expirez en montant"
        ],
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: "squats",
        name: "Squats",
        nameEn: "Squats",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"],
        equipment: ["aucun"],
        difficulty: "beginner",
        instructions: [
          "Tenez-vous debout, pieds écartés de la largeur des épaules",
          "Descendez comme si vous vous asseyiez sur une chaise",
          "Remontez en poussant sur vos talons"
        ],
        tips: [
          "Gardez vos genoux alignés avec vos orteils",
          "Descendez jusqu'à ce que vos cuisses soient parallèles au sol"
        ],
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ],
    duration: 30,
    difficulty: "beginner",
    equipment: ["aucun"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
    isPublic: true,
    createdBy: "system"
  },
  {
    name: "Workout Intermédiaire - Force",
    description: "Un workout axé sur le développement de la force avec des exercices plus intenses.",
    muscleGroups: ["chest_global", "back_thickness", "shoulders_lateral", "biceps_global", "triceps_lateral"],
    exercises: [
      {
        id: "bench-press",
        name: "Développé couché",
        nameEn: "Bench Press",
        muscleGroups: ["chest_global", "triceps_lateral", "shoulders_front"],
        equipment: ["barre", "banc"],
        difficulty: "intermediate",
        instructions: [
          "Allongez-vous sur le banc",
          "Saisissez la barre avec une prise légèrement plus large que les épaules",
          "Descendez la barre jusqu'à votre poitrine",
          "Poussez vers le haut jusqu'à l'extension complète"
        ],
        tips: [
          "Gardez vos pieds fermement plantés au sol",
          "Contrôlez la descente sur 2-3 secondes"
        ],
        imageUrl: "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?w=400&q=80&auto=format&fit=crop",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: "pull-ups",
        name: "Tractions",
        nameEn: "Pull-ups",
        muscleGroups: ["back_width", "biceps_global"],
        equipment: ["barre de traction"],
        difficulty: "intermediate",
        instructions: [
          "Suspendez-vous à la barre de traction",
          "Tirez votre corps vers le haut jusqu'à ce que votre menton dépasse la barre",
          "Descendez lentement jusqu'à la position de départ"
        ],
        tips: [
          "Gardez votre corps droit",
          "Engagez vos omoplates"
        ],
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ],
    duration: 45,
    difficulty: "intermediate",
    equipment: ["barre", "banc", "barre de traction"],
    imageUrl: "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?w=400&q=80&auto=format&fit=crop",
    isPublic: true,
    createdBy: "system"
  },
  {
    name: "Workout Avancé - HIIT",
    description: "Un workout HIIT intense pour brûler les calories et améliorer la condition physique.",
    muscleGroups: ["quadriceps", "hamstrings", "glutes", "abs_rectus", "chest_global"],
    exercises: [
      {
        id: "burpees",
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
          "Maintenez un rythme rapide",
          "Gardez votre corps engagé tout au long du mouvement"
        ],
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: "mountain-climbers",
        name: "Grimpeurs",
        nameEn: "Mountain Climbers",
        muscleGroups: ["quadriceps", "hamstrings", "abs_rectus", "shoulders_front"],
        equipment: ["aucun"],
        difficulty: "advanced",
        instructions: [
          "Commencez en position de planche",
          "Alternez rapidement en ramenant vos genoux vers votre poitrine",
          "Maintenez un rythme rapide et constant"
        ],
        tips: [
          "Gardez vos hanches stables",
          "Maintenez une position de planche solide"
        ],
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ],
    duration: 20,
    difficulty: "advanced",
    equipment: ["aucun"],
    imageUrl: "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?w=400&q=80&auto=format&fit=crop",
    isPublic: true,
    createdBy: "system"
  }
];

async function addSampleWorkouts() {
  try {
    console.log("🚀 Ajout des templates de workout d'exemple...");
    
    const collectionRef = collection(firestore, 'exerciseTemplates');
    
    for (const workout of SAMPLE_WORKOUTS) {
      const docRef = await addDoc(collectionRef, {
        ...workout,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Template ajouté avec l'ID: ${docRef.id}`);
    }
    
    console.log("🎉 Tous les templates ont été ajoutés avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des templates:", error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  addSampleWorkouts().then(() => {
    console.log("Script terminé");
    process.exit(0);
  });
}

export { addSampleWorkouts };
