// screens/TemplateExercisesScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StorageService, WorkoutTemplate } from "../services/storage";

/* ---- Theme ---- */
const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(255,255,255,0.06)";
const GOLD = "#FFD700";

/* ---- Glass helper ---- */
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
          { borderRadius: 18, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER },
        ]}
      />
      <View style={{ padding }}>{children}</View>
    </View>
  );
}

// Fonction pour analyser les exercices et déterminer les groupes musculaires
function analyzeMuscleGroups(exercises: string[]) {
  const muscleGroups = {
    quadriceps: false,
    glutes: false,
    biceps: false,
    triceps: false,
    chest: false,
    back: false,
    shoulders: false,
    abs: false,
    hamstrings: false,
    calves: false,
  };

  exercises.forEach(exercise => {
    const exerciseLower = exercise.toLowerCase();
    
    // Quadriceps
    if (exerciseLower.includes('squat') || exerciseLower.includes('leg press') || 
        exerciseLower.includes('lunge') || exerciseLower.includes('quadriceps')) {
      muscleGroups.quadriceps = true;
    }
    
    // Fessiers
    if (exerciseLower.includes('squat') || exerciseLower.includes('hip thrust') || 
        exerciseLower.includes('glute') || exerciseLower.includes('fessier') ||
        exerciseLower.includes('lunge') || exerciseLower.includes('deadlift')) {
      muscleGroups.glutes = true;
    }
    
    // Biceps
    if (exerciseLower.includes('curl') || exerciseLower.includes('bicep') || 
        exerciseLower.includes('biceps') || exerciseLower.includes('chin-up')) {
      muscleGroups.biceps = true;
    }
    
    // Triceps
    if (exerciseLower.includes('push') || exerciseLower.includes('dip') || 
        exerciseLower.includes('tricep') || exerciseLower.includes('triceps') ||
        exerciseLower.includes('extension')) {
      muscleGroups.triceps = true;
    }
    
    // Poitrine
    if (exerciseLower.includes('push') || exerciseLower.includes('press') || 
        exerciseLower.includes('chest') || exerciseLower.includes('poitrine') ||
        exerciseLower.includes('bench') || exerciseLower.includes('pec')) {
      muscleGroups.chest = true;
    }
    
    // Dos
    if (exerciseLower.includes('pull') || exerciseLower.includes('row') || 
        exerciseLower.includes('back') || exerciseLower.includes('dos') ||
        exerciseLower.includes('lat') || exerciseLower.includes('deadlift')) {
      muscleGroups.back = true;
    }
    
    // Épaules
    if (exerciseLower.includes('shoulder') || exerciseLower.includes('épaule') || 
        exerciseLower.includes('press') || exerciseLower.includes('raise') ||
        exerciseLower.includes('lateral') || exerciseLower.includes('military')) {
      muscleGroups.shoulders = true;
    }
    
    // Abdominaux
    if (exerciseLower.includes('crunch') || exerciseLower.includes('sit-up') || 
        exerciseLower.includes('plank') || exerciseLower.includes('gainage') ||
        exerciseLower.includes('ab') || exerciseLower.includes('core')) {
      muscleGroups.abs = true;
    }
    
    // Ischio-jambiers
    if (exerciseLower.includes('hamstring') || exerciseLower.includes('leg curl') || 
        exerciseLower.includes('deadlift') || exerciseLower.includes('stiff')) {
      muscleGroups.hamstrings = true;
    }
    
    // Mollets
    if (exerciseLower.includes('calf') || exerciseLower.includes('mollet') || 
        exerciseLower.includes('raise') || exerciseLower.includes('séries')) {
      muscleGroups.calves = true;
    }
  });

  return muscleGroups;
}

export default function TemplateExercisesScreen() {
  const params = useLocalSearchParams();
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [muscleGroups, setMuscleGroups] = useState({
    quadriceps: false,
    glutes: false,
    biceps: false,
    triceps: false,
    chest: false,
    back: false,
    shoulders: false,
    abs: false,
    hamstrings: false,
    calves: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const templateId = params.templateId as string;
        if (templateId) {
          const templates = await StorageService.getWorkoutTemplates();
          const found = templates.find((t) => t.id === templateId);
          setTemplate(found || null);
          
          // Analyser les groupes musculaires si un template est trouvé
          if (found) {
            const analyzedGroups = analyzeMuscleGroups(found.exercises);
            setMuscleGroups(analyzedGroups);
          }
        }
      } catch (e) {
        console.error("Erreur chargement template:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.templateId]);

  const handleExercisePress = (exercise: string) => {
    if (!template) return;
    router.push({ 
      pathname: "/workout/details", 
      params: { 
        templateId: template.id,
        exerciseName: exercise
      } 
    });
  };


  /* ---- Loading ---- */
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
          locations={[0, 0.15, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.center}>
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  /* ---- Not found ---- */
  if (!template) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
          locations={[0, 0.15, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.center}>
            <Text style={styles.errorText}>Template non trouvé</Text>
            <TouchableOpacity style={styles.backCta} onPress={() => router.back()}>
              <Text style={styles.backCtaTxt}>Retour</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background */}
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
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} activeOpacity={0.9}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exercices</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Template info */}
          <View style={styles.templateInfo}>
            <Glass>
              <View style={styles.templateHeader}>
                <View style={styles.templateImageContainer}>
                  <ImageBackground
                    source={{
                      uri:
                        template.coverImage ||
                        "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=400&auto=format&fit=crop",
                    }}
                    style={styles.templateImage}
                    imageStyle={styles.templateImageRadius}
                  >
                    <LinearGradient
                      colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.05)"]}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.smallPillDark}>
                      <Ionicons name="fitness" size={12} color={GOLD} style={{ marginRight: 4 }} />
                      <Text style={styles.smallPillDarkTxt}>{template.exercises.length}</Text>
                    </View>
                  </ImageBackground>
                </View>

                <View style={styles.templateDetails}>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateDescription}>
                    {template.description || "Entraînement personnalisé"}
                  </Text>
                  <View style={styles.templateMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="barbell" size={14} color={GOLD} />
                      <Text style={styles.metaText}>{template.exercises.length} exercices</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={14} color="#4ECDC4" />
                      <Text style={styles.metaText}>~{template.exercises.length * 5} min</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Glass>
          </View>

          {/* Muscle Groups Section */}
          <View style={styles.muscleGroupsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Groupes musculaires</Text>
            </View>
            
            <Glass>
              <View style={styles.muscleGroupsContainer}>
                {/* Muscle Groups List */}
                <View style={styles.muscleGroupsList}>
                  <View style={styles.muscleGroupCategory}>
                    <Text style={styles.categoryTitle}>Groupes travaillés</Text>
                    <View style={styles.muscleGroupButtons}>
                      {muscleGroups.quadriceps && (
                        <View style={[styles.muscleGroupButton, styles.muscleGroupButtonActive]}>
                          <Text style={styles.muscleGroupButtonText}>Quadriceps</Text>
                        </View>
                      )}
                      {muscleGroups.glutes && (
                        <View style={[styles.muscleGroupButton, styles.muscleGroupButtonActive]}>
                          <Text style={styles.muscleGroupButtonText}>Fessiers</Text>
                        </View>
                      )}
                      {muscleGroups.biceps && (
                        <View style={[styles.muscleGroupButton, styles.muscleGroupButtonActive]}>
                          <Text style={styles.muscleGroupButtonText}>Biceps</Text>
                        </View>
                      )}
                      {muscleGroups.triceps && (
                        <View style={[styles.muscleGroupButton, styles.muscleGroupButtonActive]}>
                          <Text style={styles.muscleGroupButtonText}>Triceps</Text>
                        </View>
                      )}
                      {muscleGroups.chest && (
                        <View style={[styles.muscleGroupButton, styles.muscleGroupButtonActive]}>
                          <Text style={styles.muscleGroupButtonText}>Poitrine</Text>
                        </View>
                      )}
                      {muscleGroups.back && (
                        <View style={[styles.muscleGroupButton, styles.muscleGroupButtonActive]}>
                          <Text style={styles.muscleGroupButtonText}>Dos</Text>
                        </View>
                      )}
                      {muscleGroups.shoulders && (
                        <View style={[styles.muscleGroupButton, styles.muscleGroupButtonActive]}>
                          <Text style={styles.muscleGroupButtonText}>Épaules</Text>
                        </View>
                      )}
                      {muscleGroups.abs && (
                        <View style={[styles.muscleGroupButton, styles.muscleGroupButtonActive]}>
                          <Text style={styles.muscleGroupButtonText}>Abdominaux</Text>
                        </View>
                      )}
                      {muscleGroups.hamstrings && (
                        <View style={[styles.muscleGroupButton, styles.muscleGroupButtonActive]}>
                          <Text style={styles.muscleGroupButtonText}>Ischio-jambiers</Text>
                        </View>
                      )}
                      {muscleGroups.calves && (
                        <View style={[styles.muscleGroupButton, styles.muscleGroupButtonActive]}>
                          <Text style={styles.muscleGroupButtonText}>Mollets</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                
                {/* Anatomical Figures */}
                <View style={styles.anatomicalFigures}>
                  <View style={styles.figureContainer}>
                    <Text style={styles.figureLabel}>Vue de face</Text>
                    <View style={styles.humanFigure}>
                      {/* Simplified front view figure */}
                      <View style={styles.figureHead} />
                      <View style={[styles.figureTorso, muscleGroups.chest && styles.figureTorsoHighlighted]}>
                        <View style={[styles.figureArm, styles.figureArmLeft, muscleGroups.biceps && styles.figureArmHighlighted]} />
                        <View style={[styles.figureArm, styles.figureArmRight, muscleGroups.biceps && styles.figureArmHighlighted]} />
                      </View>
                      <View style={styles.figureLegs}>
                        <View style={[styles.figureLeg, styles.figureLegLeft, muscleGroups.quadriceps && styles.figureLegHighlighted]} />
                        <View style={[styles.figureLeg, styles.figureLegRight, muscleGroups.quadriceps && styles.figureLegHighlighted]} />
                      </View>
                      {muscleGroups.abs && <View style={[styles.figureAbs, styles.figureAbsHighlighted]} />}
                    </View>
                  </View>
                  
                  <View style={styles.figureContainer}>
                    <Text style={styles.figureLabel}>Vue de dos</Text>
                    <View style={styles.humanFigure}>
                      {/* Simplified back view figure */}
                      <View style={styles.figureHead} />
                      <View style={[styles.figureTorso, muscleGroups.back && styles.figureTorsoHighlighted]}>
                        <View style={[styles.figureArm, styles.figureArmLeft, muscleGroups.triceps && styles.figureArmHighlighted]} />
                        <View style={[styles.figureArm, styles.figureArmRight, muscleGroups.triceps && styles.figureArmHighlighted]} />
                      </View>
                      <View style={styles.figureLegs}>
                        <View style={[styles.figureLeg, styles.figureLegLeft, muscleGroups.hamstrings && styles.figureLegHighlighted]} />
                        <View style={[styles.figureLeg, styles.figureLegRight, muscleGroups.hamstrings && styles.figureLegHighlighted]} />
                      </View>
                      {muscleGroups.glutes && <View style={[styles.figureGlutes, styles.figureGlutesHighlighted]} />}
                      {muscleGroups.calves && <View style={[styles.figureCalves, styles.figureCalvesHighlighted]} />}
                    </View>
                  </View>
                </View>
              </View>
            </Glass>
          </View>

          {/* Liste des exercices */}
          <View style={styles.exercisesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Liste des exercices</Text>
              <View style={styles.countPill}>
                <Text style={styles.countPillTxt}>{template.exercises.length}</Text>
              </View>
            </View>

            <View style={styles.exercisesList}>
              {template.exercises.map((exercise, index) => (
                <View key={index} style={styles.row}>
                  {/* Connecteur (optionnel) */}
                  {index !== template.exercises.length - 1 && <View style={styles.connector} />}

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handleExercisePress(exercise)}
                    style={styles.exerciseCard}
                  >
                    <ImageBackground
                      source={{
                        uri: `https://images.unsplash.com/photo-${1571019613454 + index}?w=800&q=80&auto=format&fit=crop`,
                      }}
                      style={styles.exerciseImage}
                      imageStyle={styles.exerciseImageRadius}
                    >
                      <LinearGradient
                        colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.65)"]}
                        style={StyleSheet.absoluteFill}
                      />

                      {/* Badge numéro DANS la card */}
                      <View style={styles.numBadge}>
                        <Text style={styles.numBadgeTxt}>{index + 1}</Text>
                      </View>

                      {/* Contenu bas */}
                      <View style={styles.exerciseCardContent}>
                        <View style={styles.exerciseInfo}>
                          <Text style={styles.exerciseName} numberOfLines={1}>
                            {exercise}
                          </Text>
                          <View style={styles.exerciseMeta}>
                            <View style={styles.pillGold}>
                              <Ionicons name="fitness" size={12} color="#000" style={{ marginRight: 6 }} />
                              <Text style={styles.pillGoldTxt}>Exercice</Text>
                            </View>
                            <View style={styles.pillGrey}>
                              <Ionicons name="star" size={12} color="#fff" style={{ marginRight: 6 }} />
                              <Text style={styles.pillGreyTxt}>Intermédiaire</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.playBtn}>
                          <Ionicons name="play" size={20} color="#000" />
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

      </SafeAreaView>
    </View>
  );
}

/* ---- Styles ---- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  loadingText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  errorText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  backCta: { backgroundColor: GOLD, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  backCtaTxt: { color: "#000", fontWeight: "800" },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "900" },

  /* Template block */
  templateInfo: { paddingHorizontal: 20, marginBottom: 18 },
  templateHeader: { flexDirection: "row", gap: 16 },
  templateImageContainer: { width: 80, height: 80, borderRadius: 16, overflow: "hidden" },
  templateImage: { flex: 1, justifyContent: "flex-end", alignItems: "flex-end", padding: 8 },
  templateImageRadius: { borderRadius: 16 },

  smallPillDark: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  smallPillDarkTxt: { color: GOLD, fontSize: 10, fontWeight: "800" },

  templateDetails: { flex: 1, justifyContent: "center" },
  templateTitle: { color: "#fff", fontSize: 18, fontWeight: "900", marginBottom: 4 },
  templateDescription: { color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 8 },
  templateMeta: { flexDirection: "row", gap: 16 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "600" },

  /* Section list */
  exercisesSection: { paddingHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "900" },
  countPill: { backgroundColor: GOLD, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4 },
  countPillTxt: { color: "#000", fontSize: 12, fontWeight: "900" },

  exercisesList: { gap: 16 },

  /* Timeline row + connector (optionnel) */
  row: { position: "relative" },
  connector: {
    position: "absolute",
    left: 30, // aligné sous le badge
    top: 70,
    bottom: -16,
    width: 2,
    borderRadius: 1,
    backgroundColor: "rgba(255,215,0,0.18)",
  },

  /* Exercise card */
  exerciseCard: {
    height: 132,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#111",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  exerciseImage: { flex: 1 },
  exerciseImageRadius: { borderRadius: 18 },

  /* Badge numéro */
  numBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  numBadgeTxt: { color: "#000", fontSize: 14, fontWeight: "900" },

  /* Bottom content */
  exerciseCardContent: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  exerciseInfo: { flex: 1, paddingRight: 12 },
  exerciseName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  exerciseMeta: { flexDirection: "row", gap: 8 },

  pillGold: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillGoldTxt: { color: "#000", fontWeight: "900", fontSize: 12 },

  pillGrey: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillGreyTxt: { color: "#fff", fontWeight: "700", fontSize: 12 },

  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },


  /* Muscle Groups Section */
  muscleGroupsSection: { paddingHorizontal: 20, marginBottom: 20 },
  muscleGroupsContainer: { flexDirection: "row", gap: 20 },
  muscleGroupsList: { flex: 1, gap: 16 },
  muscleGroupCategory: { gap: 8 },
  categoryTitle: { 
    color: "#fff", 
    fontSize: 14, 
    fontWeight: "700", 
    marginBottom: 4 
  },
  muscleGroupButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  muscleGroupButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  muscleGroupButtonActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  muscleGroupButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  /* Anatomical Figures */
  anatomicalFigures: { flex: 1, flexDirection: "row", gap: 12 },
  figureContainer: { flex: 1, alignItems: "center", gap: 8 },
  figureLabel: { 
    color: "rgba(255,255,255,0.7)", 
    fontSize: 10, 
    fontWeight: "600" 
  },
  humanFigure: {
    width: 60,
    height: 120,
    position: "relative",
  },
  
  /* Figure Parts */
  figureHead: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  figureTorso: {
    position: "absolute",
    top: 16,
    left: "50%",
    marginLeft: -12,
    width: 24,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  figureArm: {
    position: "absolute",
    width: 8,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  figureArmLeft: {
    top: 20,
    left: -8,
  },
  figureArmRight: {
    top: 20,
    right: -8,
  },
  figureLegs: {
    position: "absolute",
    top: 56,
    left: "50%",
    marginLeft: -12,
    width: 24,
    height: 50,
  },
  figureLeg: {
    position: "absolute",
    width: 10,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  figureLegLeft: {
    left: 0,
  },
  figureLegRight: {
    right: 0,
  },
  figureLegHighlighted: {
    backgroundColor: "rgba(255,215,0,0.4)",
    borderColor: GOLD,
  },
  figureTorsoHighlighted: {
    backgroundColor: "rgba(255,215,0,0.4)",
    borderColor: GOLD,
  },
  figureArmHighlighted: {
    backgroundColor: "rgba(255,215,0,0.4)",
    borderColor: GOLD,
  },
  figureAbs: {
    position: "absolute",
    top: 50,
    left: "50%",
    marginLeft: -8,
    width: 16,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
  },
  figureAbsHighlighted: {
    backgroundColor: "rgba(255,215,0,0.4)",
    borderColor: GOLD,
  },
  figureGlutes: {
    position: "absolute",
    top: 50,
    left: "50%",
    marginLeft: -10,
    width: 20,
    height: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
  },
  figureGlutesHighlighted: {
    backgroundColor: "rgba(255,215,0,0.4)",
    borderColor: GOLD,
  },
  figureCalves: {
    position: "absolute",
    top: 100,
    left: "50%",
    marginLeft: -8,
    width: 16,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
  },
  figureCalvesHighlighted: {
    backgroundColor: "rgba(255,215,0,0.4)",
    borderColor: GOLD,
  },
});