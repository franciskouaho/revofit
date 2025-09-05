/**
 * Script pour ajouter des templates de test dans Firebase
 * Utilisé pour tester l'affichage des templates
 */

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../services/firebase/config';
import { ExerciseTemplate } from '../types/exercise';

const TEST_TEMPLATES: Omit<ExerciseTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Push Day",
    description: "Entraînement pour les muscles pousseurs",
    muscleGroups: ["chest_global", "triceps_lateral", "shoulders_front"],
    exercises: [
      {
        id: "pushup",
        name: "Pompes",
        nameEn: "Push-ups",
        muscleGroups: ["chest_global", "triceps_lateral"],
        equipment: ["aucun"],
        difficulty: "beginner",
        instructions: ["Placez-vous en position de planche", "Descendez et remontez"],
        tips: ["Gardez le corps droit"],
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
        videoUrl: "https://example.com/pushups",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    duration: 30,
    difficulty: "beginner",
    equipment: ["aucun"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
    isPublic: true,
    createdBy: "test-user"
  },
  {
    name: "Pull Day",
    description: "Entraînement pour les muscles tireurs",
    muscleGroups: ["back_width", "biceps_global"],
    exercises: [
      {
        id: "pullup",
        name: "Tractions",
        nameEn: "Pull-ups",
        muscleGroups: ["back_width", "biceps_global"],
        equipment: ["barre de traction"],
        difficulty: "intermediate",
        instructions: ["Suspendez-vous à la barre", "Tirez votre corps vers le haut"],
        tips: ["Engagez les omoplates"],
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
        videoUrl: "https://example.com/pullups",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    duration: 25,
    difficulty: "intermediate",
    equipment: ["barre de traction"],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
    isPublic: true,
    createdBy: "test-user"
  },
  {
    name: "Leg Day",
    description: "Entraînement complet des jambes",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    exercises: [
      {
        id: "squat",
        name: "Squats",
        nameEn: "Squats",
        muscleGroups: ["quadriceps", "glutes"],
        equipment: ["aucun"],
        difficulty: "beginner",
        instructions: ["Pieds écartés largeur des épaules", "Descendez comme pour vous asseoir"],
        tips: ["Gardez les genoux alignés"],
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
        videoUrl: "https://example.com/squats",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    duration: 35,
    difficulty: "beginner",
    equipment: ["aucun"],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
    isPublic: true,
    createdBy: "test-user"
  }
];

async function addTestTemplates() {
  try {
    console.log("🚀 Ajout des templates de test...");
    
    const collectionRef = collection(firestore, 'exerciseTemplates');
    
    for (const template of TEST_TEMPLATES) {
      const docRef = await addDoc(collectionRef, {
        ...template,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Template ajouté avec l'ID: ${docRef.id}`);
    }
    
    console.log("🎉 Tous les templates de test ont été ajoutés avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des templates:", error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  addTestTemplates().then(() => {
    console.log("Script terminé");
    process.exit(0);
  });
}

export { addTestTemplates };
