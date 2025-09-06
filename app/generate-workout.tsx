// app/(whatever)/GenerateWorkoutPage.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { AIWorkoutGenerator } from "../services/ai/workoutGenerator";
import { WorkoutTemplateService } from "../services/firebase/workouts";

/* -------------------- Theme -------------------- */
const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(0,0,0,0.55)";
const LIME = "#D8FF49";
const LIME_DARK = "#C3F02F";

/* -------------------- Options -------------------- */
const EQUIP_OPTIONS = [
  "Large Gym",
  "Small Gym",
  "Home Gym (DB/KB)",
  "No Equipment",
  "Machines Only",
  "Free Weights Only",
];
const DURATION_OPTIONS = ["25m", "35m", "45m", "1h 0m", "1h 15m", "1h 30m"];
const INTENSITY_OPTIONS = ["Low", "Medium", "High"];
const MUSCLE_GROUPS_ALL = [
  "Chest",
  "Back",
  "Lats",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Biceps",
  "Triceps",
  "Shoulders",
  "Rear Delts",
  "Core",
];

/* -------------------- Selector (glass + animation) -------------------- */
function Selector({
  title,
  options,
  selected,
  onSelect,
  multi = false,
}: {
  title: string;
  options: string[];
  selected: string[] | string;
  onSelect: (val: string[] | string) => void;
  multi?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(openAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 180,
      easing: isOpen ? Easing.out(Easing.quad) : Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [isOpen, openAnim]);

  const isSelected = (opt: string) => {
    return multi ? (selected as string[])?.includes(opt) : selected === opt;
  };

  const toggle = (opt: string) => {
    if (multi) {
      const set = new Set(selected as string[]);
      if (set.has(opt)) {
        set.delete(opt);
      } else {
        set.add(opt);
      }
      onSelect(Array.from(set));
    } else {
      onSelect(opt);
      setIsOpen(false);
    }
  };

  const displayValue = () =>
    Array.isArray(selected)
      ? (selected as string[]).length
        ? (selected as string[]).join(", ")
        : "Choose"
      : (selected as string);

  const translateY = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 0],
  });
  const opacity = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.selectorContainer}>
      <View style={styles.selectorWrap}>
        <BlurView
          intensity={Platform.OS === "ios" ? 18 : 14}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        <View style={[StyleSheet.absoluteFill, styles.selectorBorder]} />
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setIsOpen((v) => !v)}
          activeOpacity={0.85}
        >
          <View style={styles.selectorLeft}>
            <Text style={styles.selectorLabel}>{title}</Text>
            <Text style={[styles.selectorValue, { color: LIME }]} numberOfLines={1}>
              {displayValue()}
            </Text>
          </View>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.optionsContainer,
          { opacity, transform: [{ translateY }] },
          !isOpen && { height: 0, paddingVertical: 0, marginTop: 0, opacity: 0 },
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        {isOpen && (
          <>
            <BlurView
              intensity={Platform.OS === "ios" ? 20 : 15}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={[StyleSheet.absoluteFill, styles.optionsBorder]} />
            <LinearGradient
              colors={["#2a2a0033", "transparent"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ position: "absolute", left: 0, right: 0, top: 0, height: 8 }}
            />
            {options.map((opt) => {
              const sel = isSelected(opt);
              return (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.optionItem,
                    sel && {
                      borderColor: LIME,
                      backgroundColor: "rgba(216,255,73,0.08)",
                    },
                  ]}
                  onPress={() => toggle(opt)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.optionText,
                      sel && { color: LIME, fontWeight: "800" },
                    ]}
                  >
                    {opt}
                  </Text>
                  {sel ? (
                    <Ionicons name="checkmark-circle" size={18} color={LIME} />
                  ) : (
                    <Ionicons
                      name="ellipse-outline"
                      size={18}
                      color="rgba(255,255,255,0.5)"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
            {multi && (
              <TouchableOpacity
                style={styles.validateButton}
                onPress={() => setIsOpen(false)}
                activeOpacity={0.95}
              >
                <LinearGradient
                  colors={[LIME, LIME_DARK]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.validateGradient}
                >
                  <Text style={styles.validateText}>Valider</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </>
        )}
      </Animated.View>
    </View>
  );
}

/* -------------------- Main Page -------------------- */
export default function GenerateWorkoutPage() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState("Large Gym");
  const [duration, setDuration] = useState("1h 0m");
  const [intensity, setIntensity] = useState("Medium");
  const [muscleGroups, setMuscleGroups] = useState<string[]>([
    "Quads",
    "Hamstrings",
    "Glutes",
  ]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      Alert.alert("Erreur", "Vous devez être connecté pour générer un workout.");
      return;
    }

    // Vérifier si la clé API OpenAI est configurée
    if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      Alert.alert(
        "Configuration requise",
        "La génération IA nécessite une clé API OpenAI. Veuillez configurer EXPO_PUBLIC_OPENAI_API_KEY dans votre fichier .env",
        [{ text: "OK" }]
      );
      return;
    }

    setIsGenerating(true);

    try {
      const params = { equipment, duration, intensity, muscleGroups, additionalInfo };
      console.log('🚀 Génération du workout avec les paramètres:', params);
      const workout = await AIWorkoutGenerator.generateWorkout(params);
      console.log('✅ Workout généré:', workout);
      
      // Sauvegarder les exercices générés par l'IA dans la base de données
      console.log('💾 Sauvegarde des exercices dans la base de données...');
      const savedExercises = await AIWorkoutGenerator.saveGeneratedExercises(workout);
      console.log('✅ Exercices sauvegardés:', savedExercises.length);
      
      // Convertir directement en template et sauvegarder
      const template = AIWorkoutGenerator.convertToExerciseTemplate(workout, user.uid);
      await WorkoutTemplateService.createTemplate(template);
      
      Alert.alert(
        "Succès !",
        `Votre plan d'entraînement a été généré et ajouté à vos templates.\n\n${savedExercises.length} exercices ont été ajoutés à la page explore.`,
        [
          { text: "Voir mes workouts", onPress: () => router.push("/(tabs)/workouts") },
          { text: "Voir les exercices", onPress: () => router.push("/(tabs)/explore") },
          { text: "OK" }
        ]
      );
    } catch (error) {
      console.error('Erreur génération workout:', error);
      Alert.alert(
        "Erreur",
        "Impossible de générer le plan d'entraînement. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGenerating(false);
    }
  };


  const chips = [
    { icon: "barbell-outline", text: equipment },
    { icon: "time-outline", text: duration },
    { icon: "flame-outline", text: intensity },
    { icon: "body-outline", text: `${muscleGroups.length} groups` },
  ];

  return (
    <View style={styles.container}>
      {/* Gradient de fond thème */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.18, 0.8, 1]}
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
          <Text style={styles.headerTitle}>Generate Workout</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Header card */}
          <View style={styles.headerWrap}>
            <BlurView
              intensity={Platform.OS === "ios" ? 18 : 14}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={[StyleSheet.absoluteFill, styles.headerBorder]} />
            <Text style={styles.title}>Generate Workout</Text>
            <Text style={styles.subtitle}>Configure your workout parameters</Text>
          </View>

          {/* Chips */}
          <View style={styles.chipsRow}>
            {chips.map((c, i) => (
              <View key={i} style={styles.chip}>
                <Ionicons
                  name={c.icon as any}
                  size={12}
                  color="#E8FFB3"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.chipText} numberOfLines={1}>
                  {c.text}
                </Text>
              </View>
            ))}
          </View>

          {/* Pro banner */}
          <View style={styles.proWrap}>
            <BlurView
              intensity={Platform.OS === "ios" ? 18 : 14}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={[StyleSheet.absoluteFill, styles.proBorder]} />
            <LinearGradient
              colors={["#11160a", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10 }}
            />
            <View style={styles.proBanner}>
              <View style={styles.proContent}>
                <View style={styles.proIcon}>
                  <Ionicons name="sparkles" size={16} color="#FFD700" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.proTitle}>Unlock AI-Generated Workouts</Text>
                  <Text style={styles.proSubtitle}>Available only with Train Pro.</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Settings</Text>
            <Selector
              title="Available Equipment"
              options={EQUIP_OPTIONS}
              selected={equipment}
              onSelect={(v) => setEquipment(v as string)}
            />
            <Selector
              title="Duration"
              options={DURATION_OPTIONS}
              selected={duration}
              onSelect={(v) => setDuration(v as string)}
            />
            <Selector
              title="Intensity"
              options={INTENSITY_OPTIONS}
              selected={intensity}
              onSelect={(v) => setIntensity(v as string)}
            />
            <Selector
              title="Muscle Groups"
              options={MUSCLE_GROUPS_ALL}
              selected={muscleGroups}
              multi
              onSelect={(v) => setMuscleGroups(v as string[])}
            />
          </View>

          {/* Additional info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.textInputWrap}>
              <BlurView
                intensity={Platform.OS === "ios" ? 18 : 14}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
              <View style={[StyleSheet.absoluteFill, styles.inputBorder]} />
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={additionalInfo}
                  onChangeText={setAdditionalInfo}
                  placeholder="e.g. Push exercises only, avoid barbell, supersets welcome..."
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
            <Text style={styles.description}>
              Use this to give additional instructions to your request for this workout only.
            </Text>
          </View>


          {/* CTA */}
          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            activeOpacity={0.92}
            disabled={isGenerating}
          >
            <LinearGradient
              colors={isGenerating ? ["#666", "#555"] : [LIME, LIME_DARK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.generateGradient}
            >
              {isGenerating ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#071100" />
                  <Text style={styles.generateText}>Génération...</Text>
                </View>
              ) : (
                <Text style={styles.generateText}>Generate Workout</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

    </View>
  );
}


/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },

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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  headerTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },

  /* Header card (glass) */
  headerWrap: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: SURFACE,
  },
  headerBorder: { borderWidth: 1, borderColor: BORDER, borderRadius: 16 },
  title: { fontSize: 26, fontWeight: "900", color: "#fff", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.75)", textAlign: "center" },

  /* Chips */
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 22,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(216,255,73,0.1)",
    borderWidth: 1,
    borderColor: "rgba(216,255,73,0.35)",
  },
  chipText: { color: LIME, fontWeight: "800", fontSize: 12, maxWidth: 160 },

  /* Pro banner (glass) */
  proWrap: {
    marginHorizontal: 20,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: SURFACE,
  },
  proBorder: { borderWidth: 1, borderColor: BORDER, borderRadius: 14 },
  proBanner: { flexDirection: "row", alignItems: "center", padding: 16 },
  proContent: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  proIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,215,0,0.2)",
  },
  proTitle: { color: "#FFD700", fontWeight: "800", fontSize: 14 },
  proSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },

  /* Sections */
  section: { marginHorizontal: 20, marginTop: 8, marginBottom: 22 },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "900", marginBottom: 12 },

  /* Selector glass */
  selectorContainer: { marginBottom: 12 },
  selectorWrap: { borderRadius: 12, overflow: "hidden", backgroundColor: SURFACE },
  selectorBorder: { borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  selectorLeft: { flex: 1, paddingRight: 10 },
  selectorLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  selectorValue: { color: "#fff", fontSize: 16, fontWeight: "800" },

  optionsContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: SURFACE,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  optionsBorder: { borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: 6,
  },
  optionText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  validateButton: { marginTop: 10, borderRadius: 24, overflow: "hidden" },
  validateGradient: { paddingVertical: 12, alignItems: "center" },
  validateText: { color: "#071100", fontWeight: "900", fontSize: 16 },

  /* Additional info glass input */
  textInputWrap: { borderRadius: 12, overflow: "hidden", backgroundColor: SURFACE },
  inputBorder: { borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  textInputContainer: { padding: 16 },
  textInput: { color: "#fff", fontSize: 16, lineHeight: 22, minHeight: 88 },
  description: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    paddingHorizontal: 4,
    marginTop: 8,
  },


  /* CTA */
  generateButton: {
    marginHorizontal: 20,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  generateButtonDisabled: { opacity: 0.6 },
  generateGradient: { paddingVertical: 18, alignItems: "center" },
  generateText: { color: "#071100", fontWeight: "900", fontSize: 18 },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

});