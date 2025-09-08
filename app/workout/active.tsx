import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { useAuth } from "../../contexts/AuthContext";
import { useExerciseSets } from "../../hooks/useExerciseSets";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(255,255,255,0.07)";
const LIME = "#D8FF49";
const LIME_DARK = "#C3F02F";

export default function WorkoutActiveScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  // Récupérer les données de l'exercice depuis les paramètres
  const exercise = params.exercise ? JSON.parse(params.exercise as string) : null;
  
  // Hook pour gérer les séries
  const { completeSet, error } = useExerciseSets({
    exerciseId: exercise?.id || 'default-exercise',
    exerciseName: exercise?.name || (params.exerciseName as string) || 'Exercice',
    templateId: params.templateId as string
  });

  const [exerciseConfig, setExerciseConfig] = useState({
    name: exercise?.name || (params.exerciseName as string) || "Gainage coude",
    sets: parseInt(params.sets as string) || 4,
    reps: parseInt(params.reps as string) || 1,
    restTime: (params.restTime as string) || "2 min"
  });
  
  // Récupérer le numéro de série actuel
  const currentSetNumber = parseInt(params.currentSetNumber as string) || 1;
  
  const TOTAL = 45;
  const [time, setTime] = useState(TOTAL);
  const [isPlaying, setIsPlaying] = useState(false);
  const [weight, setWeight] = useState(40);
  const [reps, setReps] = useState(exerciseConfig.reps);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const progress = 1 - time / TOTAL;
  const progAnim = useRef(new Animated.Value(progress)).current;

  // Mettre à jour la configuration quand les paramètres changent
  useEffect(() => {
    const newConfig = {
      name: (params.exerciseName as string) || exerciseConfig.name,
      sets: parseInt(params.sets as string) || exerciseConfig.sets,
      reps: parseInt(params.reps as string) || exerciseConfig.reps,
      restTime: (params.restTime as string) || exerciseConfig.restTime
    };
    setExerciseConfig(newConfig);
    setReps(newConfig.reps);
  }, [params.exerciseName, params.sets, params.reps, params.restTime, exerciseConfig.name, exerciseConfig.sets, exerciseConfig.reps, exerciseConfig.restTime]);

  useEffect(() => {
    Animated.timing(progAnim, {
      toValue: progress,
      duration: 240,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [progress, progAnim]);

  useEffect(() => {
    let int: ReturnType<typeof setInterval> | null = null;
    if (isPlaying && time > 0) int = setInterval(() => setTime(t => Math.max(0, t - 1)), 1000);
    return () => {
      if (int) clearInterval(int);
    };
  }, [isPlaying, time]);

  useEffect(() => { if (time === 0) setIsPlaying(false); }, [time]);

  const togglePlayPause = () => setIsPlaying(v => !v);
  const formatTime = (sec: number) => `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;

  const ring = useMemo(() => {
    const size = 60, stroke = 6, r = (size - stroke) / 2, c = 2 * Math.PI * r;
    return { size, stroke, r, c };
  }, []);
  const dash = progAnim.interpolate({ inputRange: [0, 1], outputRange: [0, ring.c] });
  const AnimatedCircle: any = Animated.createAnimatedComponent(Circle);

  return (
    <View style={styles.container}>
      {/* Fond */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.15, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Badge flottant corrigé (au-dessus de tout) */}
      <View pointerEvents="box-none" style={styles.floatingTop}>
        <View style={[styles.nextBadge, { top: insets.top + 8 }]}>
          <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.border]} />
          <Image
            source={{ uri: exercise?.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=240&h=240&fit=crop" }}
            style={styles.nextImg}
          />
          <Text style={styles.nextTxt}>Exercice suivant</Text>
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => {
              router.push({
                pathname: "/workout/details",
                params: {
                  exercise: params.exercise,
                  exerciseName: exerciseConfig.name,
                  templateId: params.templateId
                }
              });
            }} 
            style={styles.roundIcon}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{exerciseConfig.name}</Text>
            <Text style={styles.headerSubtitle}>Série {currentSetNumber} de {exerciseConfig.sets}</Text>
          </View>
        </View>

        {/* Image principale */}
        <View style={[styles.heroWrap, { marginTop: -insets.top }]}>
          <ImageBackground
            source={{ uri: exercise?.imageUrl || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&h=1200&fit=crop" }}
            style={styles.hero}
          />
          {/* Filtre noir pour améliorer la visibilité */}
          <View style={styles.imageOverlay} />
        </View>

        {/* Panneau bas en glass */}
        <View style={styles.sheet}>
          <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.border, { borderTopLeftRadius: 28, borderTopRightRadius: 28 }]} />

          {/* Icônes */}
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.ghostBtn}><Ionicons name="list-outline" size={20} color="#ffffffcc" /></TouchableOpacity>
            <TouchableOpacity
              style={styles.ghostBtn}
              onPress={() => { setIsPlaying(false); setTime(TOTAL); }}
            >
              <Ionicons name="refresh-outline" size={20} color="#ffffffcc" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayPause} style={styles.playWrap} activeOpacity={0.9}>
              <LinearGradient colors={[LIME, LIME_DARK]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.playBg} />
              <Svg width={ring.size} height={ring.size} viewBox={`0 0 ${ring.size} ${ring.size}`} style={styles.playRing}>
                <Circle cx={ring.size/2} cy={ring.size/2} r={ring.r} stroke="rgba(0,0,0,0.25)" strokeWidth={ring.stroke} fill="none" />
                <AnimatedCircle
                  cx={ring.size/2}
                  cy={ring.size/2}
                  r={ring.r}
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth={ring.stroke}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${ring.c} ${ring.c}`}
                  strokeDashoffset={Animated.multiply(dash, -1)}
                  transform={`rotate(-90 ${ring.size/2} ${ring.size/2})`}
                />
              </Svg>
              <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.ghostBtn}><Ionicons name="volume-mute-outline" size={20} color="#ffffffcc" /></TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn}><Ionicons name="heart-outline" size={20} color="#ffffffcc" /></TouchableOpacity>
          </View>

          {/* Round / segments / temps */}
          <View style={styles.roundRow}>
            <Text style={styles.roundTxt}>Série {currentSetNumber}</Text>
            <View style={styles.segmentsWrap}>
              {new Array(10).fill(0).map((_, i) => {
                const pct = (i + 1) / 10;
                const active = progress >= pct;
                return <View key={i} style={[styles.segment, active ? { backgroundColor: LIME } : { backgroundColor: "rgba(255,255,255,0.12)" }]} />;
              })}
            </View>
            <View style={styles.timeSection}>
              <Text style={styles.timeTxt}>{formatTime(time)}</Text>
              <Text style={styles.repsTxt}>{reps} répétition{reps > 1 ? 's' : ''}</Text>
            </View>
          </View>

          {/* Completed */}
          <View style={{ marginTop: 14 }}>
            <Text style={styles.caption}>Terminé</Text>
            <View style={styles.thinBar}>
              <Animated.View
                style={[
                  styles.thinFill,
                  { width: progAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) },
                ]}
              />
            </View>
            <Text style={styles.percent}>{Math.max(1, Math.round(progress * 100))}%</Text>
          </View>

          {/* Poids */}
          <View style={styles.weightRow}>
            <Text style={styles.weightLabel}>Poids supplémentaire</Text>
            <View style={styles.weightCtrls}>
              <TouchableOpacity style={styles.weightGhost} onPress={() => setWeight(w => Math.max(0, w - 2.5))}>
                <Text style={styles.weightGhostTxt}>–</Text>
              </TouchableOpacity>
              <Text style={styles.weightValue}>{weight} kg</Text>
              <TouchableOpacity style={styles.weightGhost} onPress={() => setWeight(w => w + 2.5)}>
                <Text style={styles.weightGhostTxt}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Répétitions */}
          <View style={styles.weightRow}>
            <Text style={styles.weightLabel}>Répétitions</Text>
            <View style={styles.weightCtrls}>
              <TouchableOpacity style={styles.weightGhost} onPress={() => setReps(r => Math.max(1, r - 1))}>
                <Text style={styles.weightGhostTxt}>–</Text>
              </TouchableOpacity>
              <Text style={styles.weightValue}>{reps}</Text>
              <TouchableOpacity style={styles.weightGhost} onPress={() => setReps(r => r + 1)}>
                <Text style={styles.weightGhostTxt}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Debug info */}
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>Debug: User {user ? user.uid : 'non connecté'}</Text>
            <Text style={styles.debugText}>Exercise ID: {exercise?.id || 'default-exercise'}</Text>
            <Text style={styles.debugText}>Set: {currentSetNumber}</Text>
          </View>

          {/* Affichage des erreurs */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Erreur: {error}</Text>
            </View>
          )}

          {/* Terminer */}
          <View style={styles.navRow}>
            <TouchableOpacity 
              style={[styles.pillBtn, styles.pillPrimary]} 
              activeOpacity={0.9}
              onPress={async () => {
                if (isCompleting) return; // Éviter les clics multiples
                
                console.log('🔍 Début de validation de série');
                console.log('🔍 currentSetNumber:', currentSetNumber);
                console.log('🔍 exerciseConfig:', exerciseConfig);
                console.log('🔍 weight:', weight);
                console.log('🔍 exercise:', exercise);
                
                setIsCompleting(true);
                
                try {
                  // Marquer la série comme complétée dans Firebase
                  const success = await completeSet(
                    currentSetNumber,
                    exerciseConfig.sets,
                    exerciseConfig.reps,
                    weight, // Utiliser le poids saisi
                    undefined, // duration
                    exerciseConfig.restTime
                  );

                  console.log('🔍 Résultat completeSet:', success);

                  if (success) {
                    console.log(`✅ Série ${currentSetNumber} marquée comme complétée dans Firebase`);
                    setShowSuccess(true);
                    
                    // Attendre un peu pour montrer la confirmation
                    setTimeout(() => {
                      // Revenir à details
                      router.replace({
                        pathname: "/workout/details",
                        params: { 
                          exercise: params.exercise, // Passer les données de l'exercice
                          exerciseName: exerciseConfig.name,
                          templateId: params.templateId
                        }
                      });
                    }, 1000);
                  } else {
                    console.log('❌ Échec de la validation de la série');
                    setIsCompleting(false);
                  }
                } catch (error) {
                  console.error('💥 Erreur lors de la validation de la série:', error);
                  setIsCompleting(false);
                }
              }}
            >
              <LinearGradient colors={[LIME, LIME_DARK]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={styles.pillPrimaryTxt}>
                {isCompleting ? "Validation..." : showSuccess ? "✅ Validé!" : "Terminer"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Overlay de confirmation */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.successContent}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={60} color={LIME} />
            </View>
            <Text style={styles.successTitle}>Série validée !</Text>
            <Text style={styles.successSubtitle}>
              Série {currentSetNumber} de {exerciseConfig.name} terminée
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },

  /* Badge flottant */
  floatingTop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,            // >>> au-dessus de l’image
    alignItems: "flex-end",
    paddingRight: 16,
  },
  nextBadge: {
    position: "absolute",
    right: 0,
    width: 92,
    height: 92,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  border: { borderWidth: 1, borderColor: BORDER, borderRadius: 999 },
  nextImg: { position: "absolute", width: "100%", height: "100%" },
  nextTxt: {
    position: "absolute",
    bottom: 6,
    color: "#fff",
    fontSize: 11,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 4,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 20,           // au-dessus du héros
  },
  roundIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 2,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
  },

  heroWrap: { flex: 1 },
  hero: { flex: 1 },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  sheet: {
    marginTop: -18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 26,
  },

  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  ghostBtn: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER,
  },
  playWrap: {
    width: 92, height: 92, borderRadius: 46,
    alignItems: "center", justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
  },
  playBg: { ...StyleSheet.absoluteFillObject },
  playRing: { position: "absolute" },

  roundRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  roundTxt: { width: 90, color: "#fff", fontWeight: "700" },
  segmentsWrap: { flex: 1, flexDirection: "row", gap: 6, paddingHorizontal: 6 },
  segment: { flex: 1, height: 6, borderRadius: 3 },
  timeSection: { 
    width: 70, 
    alignItems: "flex-end" 
  },
  timeTxt: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 16
  },
  repsTxt: { 
    color: "rgba(255,255,255,0.7)", 
    fontSize: 12,
    marginTop: 2
  },

  caption: { color: "rgba(255,255,255,0.85)", marginTop: 8, marginBottom: 6 },
  thinBar: { height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden" },
  thinFill: { height: "100%", backgroundColor: LIME },
  percent: { color: "rgba(255,255,255,0.75)", marginTop: 6 },

  weightRow: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  weightLabel: { color: "rgba(255,255,255,0.9)" },
  weightCtrls: { flexDirection: "row", alignItems: "center", gap: 12 },
  weightGhost: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: BORDER, backgroundColor: SURFACE,
  },
  weightGhostTxt: { color: "#fff", fontSize: 20, fontWeight: "900" },
  weightValue: { color: "#fff", fontSize: 18, fontWeight: "800", minWidth: 80, textAlign: "center" },

  navRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  pillBtn: {
    flex: 1,
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
  },
  pillGhost: { backgroundColor: "transparent" },
  pillGhostTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
  pillPrimary: { flex: 1 },
  pillPrimaryTxt: { color: "#071100", fontWeight: "900", fontSize: 16 },

  // Overlay de confirmation
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  successContent: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },

  // Debug info
  debugContainer: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 0, 0.3)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  debugText: {
    color: "#00ff00",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },

  // Affichage d'erreur
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.3)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
  },
});
