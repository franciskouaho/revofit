import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SetTracker from "../../components/SetTracker";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(255,255,255,0.06)";
const LIME = "#D8FF49";

function Glass({
  children,
  style,
  padding = 16,
  blur = 20,
}: {
  children: React.ReactNode;
  style?: any;
  padding?: number;
  blur?: number;
}) {
  return (
    <View style={[{ borderRadius: 18, overflow: "hidden" }, style]}>
      <BlurView intensity={blur} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: 18,
            backgroundColor: SURFACE,
            borderWidth: 1,
            borderColor: BORDER,
          },
        ]}
      />
      <View style={{ padding }}>{children}</View>
    </View>
  );
}

export default function WorkoutSetsScreen() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const exercises = [
    {
      id: 1,
      name: "Push-ups",
      sets: 4,
      reps: 12,
      weight: 0,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Squats",
      sets: 3,
      reps: 15,
      weight: 0,
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Plank",
      sets: 3,
      reps: 1, // durée en minutes
      weight: 0,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop",
    },
  ];

  const handleExerciseComplete = (exerciseId: number) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId]);
    }
    
    // Passer à l'exercice suivant
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handleWorkoutComplete = () => {
    // Naviguer vers la page de résumé
    router.push("/workout/details");
  };

  const exercise = exercises[currentExercise];
  const progress = (currentExercise + 1) / exercises.length;

  return (
    <View style={styles.container}>
      {/* Gradient de fond */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.15, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Entraînement en cours</Text>
            <Text style={styles.headerSubtitle}>
              Exercice {currentExercise + 1}/{exercises.length}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="pause" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Progression globale */}
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Glass>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Progression globale</Text>
                <Text style={styles.progressPercent}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
            </Glass>
          </View>

          {/* Image de l'exercice */}
          <View style={styles.exerciseImageContainer}>
            <ImageBackground
              source={{ uri: exercise.image }}
              style={styles.exerciseImage}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.65)"]}
                start={{ x: 0, y: 0.2 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseInfo}>
                  {exercise.sets} séries • {exercise.reps} {exercise.reps === 1 ? 'minute' : 'répétitions'}
                </Text>
              </View>
            </ImageBackground>
          </View>

          {/* Suivi des séries */}
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Glass>
              <SetTracker
                exerciseName={exercise.name}
                totalSets={exercise.sets}
                repsPerSet={exercise.reps}
                weight={exercise.weight}
                onComplete={() => handleExerciseComplete(exercise.id)}
              />
            </Glass>
          </View>

          {/* Liste des exercices */}
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Glass>
              <Text style={styles.sectionTitle}>Exercices du programme</Text>
              <View style={styles.exercisesList}>
                {exercises.map((ex, index) => (
                  <View key={ex.id} style={styles.exerciseItem}>
                    <View style={styles.exerciseItemLeft}>
                      <View style={[
                        styles.exerciseNumber,
                        index === currentExercise && styles.exerciseNumberActive,
                        completedExercises.includes(ex.id) && styles.exerciseNumberCompleted
                      ]}>
                        {completedExercises.includes(ex.id) ? (
                          <Ionicons name="checkmark" size={16} color="#000" />
                        ) : (
                          <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                        )}
                      </View>
                      <View style={styles.exerciseItemInfo}>
                        <Text style={[
                          styles.exerciseItemName,
                          index === currentExercise && styles.exerciseItemNameActive
                        ]}>
                          {ex.name}
                        </Text>
                        <Text style={styles.exerciseItemDetails}>
                          {ex.sets} séries • {ex.reps} {ex.reps === 1 ? 'min' : 'reps'}
                        </Text>
                      </View>
                    </View>
                    {index === currentExercise && (
                      <View style={styles.currentIndicator}>
                        <Text style={styles.currentText}>En cours</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </Glass>
          </View>
        </ScrollView>

        {/* Bouton Terminer */}
        {completedExercises.length === exercises.length && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleWorkoutComplete}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[LIME, "#C3F02F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.completeButtonGradient}
              >
                <Ionicons name="checkmark-circle" size={20} color="#000" />
                <Text style={styles.completeButtonText}>Terminer l'entraînement</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 2,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  progressPercent: {
    color: LIME,
    fontSize: 16,
    fontWeight: "800",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: LIME,
    borderRadius: 4,
  },

  exerciseImageContainer: {
    marginHorizontal: 20,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
  },
  exerciseImage: {
    height: 200,
    justifyContent: "flex-end",
  },
  imageOverlay: {
    padding: 20,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 4,
  },
  exerciseInfo: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "600",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  exercisesList: {
    gap: 12,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  exerciseItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  exerciseNumberActive: {
    backgroundColor: LIME,
  },
  exerciseNumberCompleted: {
    backgroundColor: LIME,
  },
  exerciseNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  exerciseItemInfo: {
    flex: 1,
  },
  exerciseItemName: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseItemNameActive: {
    color: "#fff",
  },
  exerciseItemDetails: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 2,
  },
  currentIndicator: {
    backgroundColor: LIME,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "700",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  completeButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  completeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  completeButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
  },
});
