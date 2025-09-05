import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
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

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(255,255,255,0.06)";

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

export default function WorkoutDetailsScreen() {
  const params = useLocalSearchParams();
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  
  // Récupérer les données de l'exercice depuis les paramètres
  const exercise = params.exercise ? JSON.parse(params.exercise as string) : null;
  
  const [exerciseConfig, setExerciseConfig] = useState({
    name: exercise?.name || (params.exerciseName as string) || "Gainage coude",
    sets: 4,
    reps: 1,
    restTime: "2 min"
  });
  
  // Vérifier si une série a été complétée
  React.useEffect(() => {
    if (params.completedSet === "true") {
      setCompletedSets(prev => {
        const newSetId = prev.length + 1;
        if (newSetId <= exerciseConfig.sets) {
          return [...prev, newSetId];
        }
        return prev;
      });
    }
  }, [params.completedSet, exerciseConfig.sets]);

  // Mettre à jour la configuration depuis les métriques
  React.useEffect(() => {
    if (params.fromMetrics === "true") {
      const newConfig = {
        name: (params.exerciseName as string) || exerciseConfig.name,
        sets: parseInt(params.sets as string) || 4,
        reps: parseInt(params.reps as string) || 1,
        restTime: (params.restTime as string) || "2 min"
      };
      setExerciseConfig(newConfig);
      // Réinitialiser les séries complétées quand on change la configuration
      setCompletedSets([]);
    }
  }, [params.fromMetrics, params.sets, params.reps, params.restTime, params.exerciseName, exerciseConfig.name]);
  
  const handleSetMetrics = () => router.push("/workout/metrics");
  
  const handleExercisePress = () => {
    router.push({
      pathname: "/workout/active",
      params: {
        exercise: params.exercise, // Passer les données de l'exercice
        exerciseName: exerciseConfig.name,
        sets: exerciseConfig.sets.toString(),
        reps: exerciseConfig.reps.toString(),
        restTime: exerciseConfig.restTime
      }
    });
  };
  
  const totalSets = exerciseConfig.sets;

  return (
    <View style={styles.container}>
      {/* Gradient de fond thème */}
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
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="share-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="bookmark-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Hero image + overlay + badge */}
          <View style={styles.hero}>
            <ImageBackground
              source={{
                uri: exercise?.imageUrl || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80&auto=format&fit=crop",
              }}
              style={styles.heroImg}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.65)"]}
                start={{ x: 0, y: 0.2 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Bandeau infos (glass) */}
              <View style={styles.heroFooter}>
                <Glass style={{ padding: 0 }}>
                  <View style={styles.heroFooterRow}>
                    <View style={styles.meta}>
                      <Ionicons name="pulse" size={16} color="#FFD700" />
                      <Text style={styles.metaText}>{exercise?.difficulty || "Niveau"}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.meta}>
                      <Ionicons name="flame" size={16} color="#FFD700" />
                      <Text style={styles.metaText}>{exercise?.equipment?.join(', ') || "Équipement"}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.meta}>
                      <Ionicons name="time" size={16} color="#FFD700" />
                      <Text style={styles.metaText}>{exercise?.muscleGroups?.length || 0} groupes</Text>
                    </View>
                  </View>
                </Glass>
              </View>

              {/* Badge titre */}
              <View style={styles.heroBadgeWrap}>
                <Glass padding={12} style={styles.heroBadge}>
                  <Text style={styles.heroTitle}>{exercise?.name || "Exercice"}</Text>
                  <Text style={styles.heroSubtitle}>
                    {exercise?.muscleGroups?.join(' • ') || "Groupe musculaire"} • {exercise?.difficulty || "Niveau"}
                  </Text>
                </Glass>
              </View>
            </ImageBackground>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {/* Chips d'infos */}
            <View style={styles.chipsRow}>
              <Glass padding={10} style={styles.chip}>
                <View style={styles.chipRow}>
                  <Ionicons name="barbell" size={14} color="#FFD700" />
                  <Text style={styles.chipText}>{exercise?.equipment?.join(', ') || "Équipement"}</Text>
                </View>
              </Glass>
              <Glass padding={10} style={styles.chip}>
                <View style={styles.chipRow}>
                  <Ionicons name="speedometer" size={14} color="#4ECDC4" />
                  <Text style={styles.chipText}>{exercise?.difficulty || "Niveau"}</Text>
                </View>
              </Glass>
              <Glass padding={10} style={styles.chip}>
                <View style={styles.chipRow}>
                  <Ionicons name="body" size={14} color="#9FA8DA" />
                  <Text style={styles.chipText}>{exercise?.muscleGroups?.length || 0} groupes</Text>
                </View>
              </Glass>
            </View>

            {/* Boutons d’action */}
            {/* Bouton Set Metrics */}
            <View style={styles.actionsRow}>
              <Glass style={{ flex: 1 }}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleSetMetrics}>
                  <Ionicons name="options" size={18} color="#fff" />
                  <Text style={styles.actionText}>Définir métriques</Text>
                </TouchableOpacity>
              </Glass>
            </View>

            {/* Description (glass) */}
            <Glass>
              <Text style={styles.blockTitle}>Instructions</Text>
              {exercise?.instructions?.map((instruction: string, index: number) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </Glass>

            {/* Conseils */}
            {exercise?.tips && exercise.tips.length > 0 && (
              <>
                <View style={{ height: 16 }} />
                <Glass>
                  <Text style={styles.blockTitle}>Conseils</Text>
                  {exercise.tips.map((tip: string, index: number) => (
                    <View key={index} style={styles.tipItem}>
                      <Ionicons name="bulb" size={16} color="#FFD700" />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </Glass>
              </>
            )}

            {/* Exercise details */}
            <View style={{ height: 16 }} />

                          <Glass>
                <View style={styles.blockHeader}>
                  <Text style={styles.blockTitle}>{totalSets} séries dexercice</Text>
                </View>

                                            {/* Cartes des séries */}
               {Array.from({ length: totalSets }, (_, index) => {
                 const setNumber = index + 1;
                 const isCompleted = completedSets.includes(setNumber);
                 
                 return (
                   <View key={setNumber} style={styles.exerciseCard}>
                     <View style={styles.thumb}>
                       <ImageBackground
                         source={{
                           uri: exercise?.imageUrl || "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop",
                         }}
                         style={{ flex: 1 }}
                         imageStyle={{ borderRadius: 10 }}
                       >
                         <LinearGradient
                           colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.0)"]}
                           start={{ x: 0, y: 1 }}
                           end={{ x: 0, y: 0 }}
                           style={StyleSheet.absoluteFill}
                         />
                       </ImageBackground>
                     </View>

                     <View style={{ flex: 1, paddingHorizontal: 12 }}>
                                         <Text style={styles.exerciseName}>{exerciseConfig.name}</Text>
                  <Text style={styles.exerciseSub}>
                    {exercise?.muscleGroups?.join(' • ') || "Groupe musculaire"} • Série {setNumber}
                  </Text>
                     </View>

                     <View style={styles.exerciseStatus}>
                     </View>

                     {isCompleted ? (
                       <View style={styles.completedButton}>
                         <Ionicons name="checkmark-circle" size={24} color="#D8FF49" />
                       </View>
                     ) : (
                       <TouchableOpacity 
                         style={styles.playButton}
                         onPress={handleExercisePress}
                         activeOpacity={0.9}
                       >
                         <LinearGradient
                           colors={["#8BC34A", "#2ECC71"]}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 1 }}
                           style={styles.playButtonGradient}
                         >
                           <Ionicons name="play" size={16} color="#000" />
                         </LinearGradient>
                       </TouchableOpacity>
                     )}
                   </View>
                 );
               })}


            </Glass>

            {/* Conseils / Notes */}
            <View style={{ height: 16 }} />
            <Glass>
              <Text style={styles.blockTitle}>Notes du coach</Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {[
                  { icon: "speedometer", text: "Tempo 3-1-1 sur les gainages" },
                  { icon: "body", text: "Gainage actif tout le long" },
                  { icon: "water", text: "Hydratation entre les séries" },
                ].map((it, i) => (
                  <View key={i} style={styles.note}>
                    <Ionicons name={it.icon as any} size={14} color="#FFD700" />
                    <Text style={styles.noteText}>{it.text}</Text>
                  </View>
                ))}
              </View>
            </Glass>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },

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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  hero: {
    height: 320,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },
  heroImg: { flex: 1, justifyContent: "flex-end" },
  heroFooter: { padding: 12 },
  heroFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  meta: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { color: "#fff", fontWeight: "700" },
  separator: { width: 1, height: 16, backgroundColor: BORDER },

  heroBadgeWrap: { position: "absolute", left: 12, top: 12, right: 12 },
  heroBadge: {},
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "900" },
  heroSubtitle: { color: "rgba(255,255,255,0.8)", marginTop: 2 },

  chipsRow: { flexDirection: "row", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  chip: { },
  chipRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  chipText: { color: "#fff", fontWeight: "700" },

  actionsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  actionText: { color: "#fff", fontWeight: "800" },

  startBtn: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  startText: { color: "#000", fontWeight: "900" },

  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  blockTitle: { color: "#fff", fontWeight: "900", fontSize: 16 },

  desc: { color: "rgba(255,255,255,0.9)", lineHeight: 22, marginTop: 6 },

  roundHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  roundBadge: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  roundBadgeText: { color: "#fff", fontWeight: "800" },
  roundMeta: { color: "rgba(255,255,255,0.7)" },

  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 10,
    marginBottom: 10,
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  exerciseName: { color: "#fff", fontWeight: "800" },
  exerciseSub: { color: "rgba(255,255,255,0.7)", marginTop: 2, fontSize: 12 },

  exerciseStatus: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8 
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8FF49",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: { 
    color: "#000", 
    fontSize: 12, 
    fontWeight: "700" 
  },

  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  playButtonGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  completedButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  pill: { borderRadius: 20, overflow: "hidden" },
  pillText: { color: "#fff", fontWeight: "800" },

  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  noteText: { color: "#fff", fontWeight: "700" },

  // Styles pour les instructions et conseils
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "700",
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
