// components/TemplateDrawer.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GeneratedExercise, GeneratedWorkout } from "../services/ai/workoutGenerator";
import { WorkoutTemplateService } from "../services/firebase/workouts";
import { ExerciseTemplate } from "../types/exercise";
import FirebaseExerciseSelector from "./FirebaseExerciseSelector";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(0,0,0,0.55)";
const LIME = "#D8FF49";
const LIME_DARK = "#C3F02F";

interface TemplateDrawerProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (type: string) => void;
  onTemplateCreated?: (template: ExerciseTemplate) => void;
  aiGeneratedExercises?: GeneratedExercise[];
  generatedWorkout?: GeneratedWorkout | null;
}

export default function TemplateDrawer({
  visible,
  onClose,
  onGenerate,
  onTemplateCreated,
  aiGeneratedExercises,
  generatedWorkout,
}: TemplateDrawerProps) {
  const [templateTitle, setTemplateTitle] = useState("Template d'entraînement");
  const [description, setDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  // Initialiser avec les exercices IA si disponibles
  React.useEffect(() => {
    if (aiGeneratedExercises && aiGeneratedExercises.length > 0) {
      setTemplateTitle(generatedWorkout?.title || "Workout IA");
      setDescription(generatedWorkout?.description || "");
      // Pré-sélectionner tous les exercices générés par l'IA
      setSelectedExercises(aiGeneratedExercises.map((_, index) => index.toString()));
    }
  }, [aiGeneratedExercises, generatedWorkout]);

  const titleLimit = 60;
  const descLimit = 240;
  const titleLen = templateTitle.trim().length;
  const descLen = description.trim().length;

  // Animations drawer
  const slideY = useRef(new Animated.Value(300)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 140, friction: 14 }),
        Animated.timing(backdrop, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, { toValue: 300, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, slideY, backdrop]);

  // Swipe-to-dismiss
  const dragY = useRef(new Animated.Value(0)).current;
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => g.dy > 0 && dragY.setValue(g.dy),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 0.9) {
          Animated.parallel([
            Animated.timing(slideY, { toValue: 300, duration: 180, useNativeDriver: true }),
            Animated.timing(backdrop, { toValue: 0, duration: 160, useNativeDriver: true }),
          ]).start(onClose);
        } else {
          Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;
  const translateY = Animated.add(slideY, dragY);

  const canCreate = useMemo(() => titleLen > 0 && selectedExercises.length > 0, [titleLen, selectedExercises.length]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return 'Inconnu';
    }
  };

  const handleCreateTemplate = async () => {
    try {
      let exercises = [];
      
      // Si on a des exercices générés par l'IA, les utiliser
      if (aiGeneratedExercises && aiGeneratedExercises.length > 0) {
        // Filtrer les exercices sélectionnés parmi ceux générés par l'IA
        const selectedAiExercises = selectedExercises.map(index => 
          aiGeneratedExercises[parseInt(index)]
        ).filter(Boolean);

        // Convertir les exercices IA en format Firebase
        exercises = selectedAiExercises.map(ex => ({
          id: ex.nameEn.toLowerCase().replace(/\s+/g, '-'),
          name: ex.name,
          nameEn: ex.nameEn,
          muscleGroups: ex.muscleGroups,
          equipment: ex.equipment,
          difficulty: ex.difficulty,
          instructions: ex.instructions,
          tips: ex.tips,
          imageUrl: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      } else {
        // Logique normale pour les exercices Firebase
        const { ExerciseService } = await import("../services/firebase/exercises");
        
        for (const exerciseId of selectedExercises) {
          const response = await ExerciseService.getExerciseById(exerciseId);
          if (response.success && response.data && !Array.isArray(response.data)) {
            exercises.push(response.data);
          }
        }
      }

      if (exercises.length === 0) {
        Alert.alert("Erreur", "Aucun exercice valide sélectionné.");
        return;
      }

      // Déterminer les groupes musculaires et équipements à partir des exercices
      const muscleGroups = [...new Set(exercises.flatMap(ex => ex.muscleGroups))];
      const equipment = [...new Set(exercises.flatMap(ex => ex.equipment))];
      
      // Déterminer la difficulté moyenne
      const difficulties = exercises.map(ex => ex.difficulty);
      const difficultyCounts = difficulties.reduce((acc, diff) => {
        acc[diff] = (acc[diff] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const mostCommonDifficulty = Object.entries(difficultyCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0][0] as 'beginner' | 'intermediate' | 'advanced';

      const templateData = {
        name: templateTitle.trim(),
        description: description.trim(),
        muscleGroups: muscleGroups,
        exercises: exercises,
        duration: Math.max(15, exercises.length * 5), // Estimation basée sur le nombre d'exercices
        difficulty: mostCommonDifficulty,
        equipment: equipment,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
        isPublic: true,
        createdBy: "user123" // TODO: Récupérer depuis AuthContext
      };

      // Créer le template dans Firebase
      const template = await WorkoutTemplateService.createTemplate(templateData);

      // Reset form
      setTemplateTitle("Template d'entraînement");
      setDescription("");
      setSelectedExercises([]);

      // Notify parent component
      onTemplateCreated?.(template);
      
      // Close drawer
      onClose();

      Alert.alert(
        "Template créé !",
        `Le template "${template.name}" a été créé avec ${template.exercises.length} exercices.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Erreur lors de la création du template:", error);
      Alert.alert(
        "Erreur",
        "Impossible de créer le template. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop gradient + clic pour fermer */}
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
        <LinearGradient
          colors={["#000000e6", "#000000cc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        {...pan.panHandlers}
        style={[styles.drawerWrap, { transform: [{ translateY }] }]}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.drawer}>
            {/* Glass + border */}
            <BlurView intensity={Platform.OS === "ios" ? 28 : 20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, styles.border]} />

            {/* Glow top */}
            <LinearGradient
              colors={["#2a2a0033", "transparent"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ height: 10 }}
            />

            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Nouveau template</Text>
              <Text style={styles.subtitle}>Crée un modèle d’entraînement réutilisable.</Text>
            </View>

            {/* Promo */}
            <View style={styles.promo}>
              <LinearGradient
                colors={["#12160a", "#0b0b0b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={[StyleSheet.absoluteFill, styles.promoBorder]} />
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.promoTitle}>Templates illimités avec RevoFit Pro</Text>
                <Text style={styles.promoSub}>Les comptes gratuits ont accès à 2 templates.</Text>
              </View>
              <View style={styles.pill}>
                <Ionicons name="chevron-forward" size={14} color="#0b1400" />
              </View>
            </View>

            {/* Title */}
            <View style={styles.section}>
              <Text style={styles.label}>Titre du template</Text>
              <View style={styles.input}>
                <Ionicons name="document-text-outline" size={16} color="#9aa08f" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.inputText}
                  value={templateTitle}
                  onChangeText={(t) => t.length <= titleLimit && setTemplateTitle(t)}
                  placeholder="Template d'entraînement"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
                <Text style={styles.counter}>{titleLen}/{titleLimit}</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <View style={[styles.input, { minHeight: 88, alignItems: "flex-start", paddingVertical: 12 }]}>
                <Ionicons name="menu" size={16} color="#9aa08f" style={{ marginRight: 10, marginTop: 2 }} />
                <TextInput
                  style={[styles.inputText, { lineHeight: 20 }]}
                  value={description}
                  onChangeText={(t) => t.length <= descLimit && setDescription(t)}
                  placeholder="Ajouter une description"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  multiline
                />
                <Text style={styles.counter}>{descLen}/{descLimit}</Text>
              </View>
            </View>

            {/* Journal / sélection d’exos */}
            <View style={styles.section}>
              <Text style={styles.label}>Journal d’entraînement</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.input}
                onPress={() => setShowExerciseSelector(true)}
              >
                <Ionicons name="fitness" size={16} color="#9aa08f" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  {selectedExercises.length > 0 ? (
                    <Text style={styles.inputText}>
                      {selectedExercises.length} exercice{selectedExercises.length > 1 ? "s" : ""} sélectionné{selectedExercises.length > 1 ? "s" : ""}
                    </Text>
                  ) : (
                    <Text style={styles.placeholder}>Ajouter des exercices</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9aa08f" />
              </TouchableOpacity>

              {/* Badges rapides */}
              <View style={styles.badgesRow}>
                <Badge label="Hypertrophie" icon="flash" />
                <Badge label="Full-body" icon="body" />
                <Badge label="Intermédiaire" icon="medal-outline" />
              </View>
            </View>

            {/* Cover (placeholder) */}
            <View style={styles.section}>
              <Text style={styles.label}>Image de couverture</Text>
              <View style={styles.cover}>
                <Ionicons name="image" size={26} color="#9aa08f" />
                <View style={styles.add}>
                  <Ionicons name="add" size={14} color="#0b1400" />
                </View>
              </View>
              <Text style={styles.helper}>Optionnel mais recommandé pour repérer plus vite tes templates.</Text>
            </View>

            {/* Affichage des exercices IA si disponibles */}
            {aiGeneratedExercises && aiGeneratedExercises.length > 0 && (
              <View style={styles.aiExercisesSection}>
                <Text style={styles.aiExercisesTitle}>Exercices générés par l&apos;IA</Text>
                <ScrollView style={styles.aiExercisesList} showsVerticalScrollIndicator={false}>
                  {aiGeneratedExercises.map((exercise, index) => {
                    const isSelected = selectedExercises.includes(index.toString());
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.aiExerciseItem, isSelected && styles.aiExerciseItemSelected]}
                        onPress={() => {
                          const currentSelection = selectedExercises || [];
                          const next = currentSelection.includes(index.toString())
                            ? currentSelection.filter((id) => id !== index.toString())
                            : [...currentSelection, index.toString()];
                          setSelectedExercises(next);
                        }}
                        activeOpacity={0.9}
                      >
                        <View style={styles.aiExerciseContent}>
                          <View style={[styles.aiExerciseDot, isSelected ? { backgroundColor: LIME } : null]} />
                          <View style={styles.aiExerciseInfo}>
                            <Text style={[styles.aiExerciseName, isSelected && styles.aiExerciseNameSelected]}>
                              {exercise.name}
                            </Text>
                            <Text style={styles.aiExerciseDetails}>
                              {exercise.sets} séries × {exercise.reps} reps • {exercise.rest}s repos
                            </Text>
                            <View style={styles.aiExerciseMeta}>
                              <View style={[styles.aiDifficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                                <Text style={styles.aiDifficultyText}>{getDifficultyText(exercise.difficulty)}</Text>
                              </View>
                              <Text style={styles.aiEquipmentText}>{exercise.equipment.join(', ')}</Text>
                            </View>
                            <View style={styles.aiExerciseMuscles}>
                              {exercise.muscleGroups.map((muscle, i) => (
                                <View key={i} style={styles.aiMuscleTag}>
                                  <Text style={styles.aiMuscleText}>{muscle}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        </View>
                        {isSelected ? (
                          <Ionicons name="checkmark-circle" size={18} color={LIME} />
                        ) : (
                          <Ionicons name="add-circle-outline" size={18} color="rgba(255,255,255,0.55)" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* CTA */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.cta, !canCreate && { opacity: 0.5 }]}
              disabled={!canCreate}
              onPress={handleCreateTemplate}
            >
              <LinearGradient colors={[LIME, LIME_DARK]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={styles.ctaTxt}>
                Créer le template ({selectedExercises.length})
              </Text>
            </TouchableOpacity>

            {/* Close button */}
            <TouchableOpacity onPress={onClose} style={styles.close} activeOpacity={0.8}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>

      {/* Exercise selector Firebase */}
      <FirebaseExerciseSelector
        visible={showExerciseSelector}
        onClose={() => setShowExerciseSelector(false)}
        selectedExercises={selectedExercises}
        onExercisesChange={setSelectedExercises}
      />
    </Modal>
  );
}

/* ---------- Small components ---------- */
function Badge({ label, icon }: { label: string; icon: any }) {
  return (
    <View style={styles.badge}>
      <Ionicons name={icon} size={12} color="#E8FFB3" style={{ marginRight: 6 }} />
      <Text style={styles.badgeTxt}>{label}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
  drawerWrap: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    transform: [{ translateY: 300 }],
  },
  drawer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 8,
    backgroundColor: SURFACE,
  },
  border: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  handle: {
    alignSelf: "center",
    width: 44, height: 4, borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginTop: 10, marginBottom: 12,
  },
  header: { alignItems: "center", marginBottom: 8 },
  title: { color: "#fff", fontSize: 20, fontWeight: "900" },
  subtitle: { color: "rgba(255,255,255,0.7)", marginTop: 6, textAlign: "center" },

  promo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  promoBorder: { borderWidth: 1, borderColor: BORDER, borderRadius: 16 },
  promoTitle: { color: "#E8FFB3", fontWeight: "800", marginBottom: 2, fontSize: 13 },
  promoSub: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  pill: {
    paddingHorizontal: 10, height: 26,
    borderRadius: 13, alignItems: "center", justifyContent: "center",
    backgroundColor: LIME,
  },

  section: { marginTop: 12 },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12, fontWeight: "700", marginBottom: 8,
    textTransform: "uppercase", letterSpacing: 0.3,
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  inputText: { color: "#fff", fontSize: 16, fontWeight: "700", flex: 1 },
  placeholder: { color: "rgba(255,255,255,0.6)", fontSize: 16, flex: 1 },
  counter: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginLeft: 8 },

  badgesRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER,
  },
  badgeTxt: { color: "rgba(255,255,255,0.85)", fontWeight: "800", fontSize: 12 },

  cover: {
    width: 116, height: 116, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER, position: "relative",
  },
  add: {
    position: "absolute", right: 8, bottom: 8,
    width: 22, height: 22, borderRadius: 11,
    alignItems: "center", justifyContent: "center",
    backgroundColor: LIME,
  },
  helper: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 8 },

  cta: {
    marginTop: 18,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTxt: { color: "#071100", fontWeight: "900", fontSize: 16 },

  close: {
    alignSelf: "center",
    marginTop: 12,
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1, borderColor: BORDER,
  },

  /* AI Exercises Styles */
  aiExercisesSection: {
    marginBottom: 20,
  },
  aiExercisesTitle: {
    color: LIME,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  aiExercisesList: {
    maxHeight: 300,
  },
  aiExerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  aiExerciseItemSelected: {
    backgroundColor: "rgba(216,255,73,0.10)",
    borderColor: LIME,
  },
  aiExerciseContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  aiExerciseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginRight: 12,
    marginTop: 6,
  },
  aiExerciseInfo: {
    flex: 1,
  },
  aiExerciseName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  aiExerciseNameSelected: {
    color: LIME,
  },
  aiExerciseDetails: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 6,
  },
  aiExerciseMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  aiDifficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  aiDifficultyText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  aiEquipmentText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
  },
  aiExerciseMuscles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  aiMuscleTag: {
    backgroundColor: "rgba(216,255,73,0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(216,255,73,0.3)",
  },
  aiMuscleText: {
    color: LIME,
    fontSize: 10,
    fontWeight: "600",
  },
});
