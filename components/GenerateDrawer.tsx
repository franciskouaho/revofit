// components/GenerateDrawer.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
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
import DrawerSelector from "./DrawerSelector";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(0,0,0,0.55)";
const LIME = "#D8FF49";
const LIME_DARK = "#C3F02F";

interface GenerateDrawerProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (params: {
    equipment: string;
    duration: string;
    intensity: string;
    muscleGroups: string[];
    additionalInfo: string;
  }) => void;
}

/* -------------------- options -------------------- */
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

/* -------------------- Drawer principal -------------------- */
export default function GenerateDrawer({ visible, onClose, onGenerate }: GenerateDrawerProps) {
  const [equipment, setEquipment] = useState("Large Gym");
  const [duration, setDuration] = useState("1h 0m");
  const [intensity, setIntensity] = useState("Medium");
  const [muscleGroups, setMuscleGroups] = useState<string[]>([
    "Quads",
    "Hamstrings",
    "Glutes",
  ]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  // mini-sheets
  const [showEquip, setShowEquip] = useState(false);
  const [showDur, setShowDur] = useState(false);
  const [showInt, setShowInt] = useState(false);
  const [showGroups, setShowGroups] = useState(false);

  // Ensure all selectors are closed when component mounts
  useEffect(() => {
    setShowEquip(false);
    setShowDur(false);
    setShowInt(false);
    setShowGroups(false);
  }, []);

  // Animations drawer
  const slideY = useRef(new Animated.Value(300)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 140,
          friction: 14,
        }),
        Animated.timing(backdrop, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: 300,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(backdrop, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

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

  const summaryChips = useMemo(
    () => [
      { icon: "barbell-outline", text: equipment },
      { icon: "time-outline", text: duration },
      { icon: "flame-outline", text: intensity },
      { icon: "body-outline", text: `${muscleGroups.length} groups` },
    ],
    [equipment, duration, intensity, muscleGroups]
  );

  const handleGenerate = () => {
    onGenerate({ equipment, duration, intensity, muscleGroups, additionalInfo });
    onClose();
  };

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={onClose}
      >
        {/* Backdrop gradient + clic pour fermer */}
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
          <LinearGradient
            colors={["#000000f0", "#000000e0"]}
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
          <View style={styles.drawer}>
            {/* Glass + border */}
            <BlurView
              intensity={Platform.OS === "ios" ? 28 : 20}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
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
              <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Generate Workout</Text>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="information-circle-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              bounces={false}
              nestedScrollEnabled={true}
            >
              {/* Chips summary */}
              <View style={styles.chipsRow}>
                {summaryChips.map((c, idx) => (
                  <View key={idx} style={styles.chip}>
                    <Ionicons
                      name={c.icon as any}
                      size={12}
                      color="#E8FFB3"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.chipTxt}>{c.text}</Text>
                  </View>
                ))}
              </View>

              {/* Pro Banner */}
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

              {/* Settings */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Workout Settings</Text>

                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => {
                    console.log("🔧 Equipment button pressed");
                    console.log("Current showEquip:", showEquip);
                    setShowEquip(true);
                    console.log("✅ showEquip set to true");
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <Text style={styles.settingLabel}>Available Equipment</Text>
                    <Text style={[styles.settingValue, { color: LIME }]}>{equipment}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={16} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => {
                    console.log("⏱️ Duration button pressed");
                    setShowDur(true);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <Text style={styles.settingLabel}>Duration</Text>
                    <Text style={[styles.settingValue, { color: LIME }]}>{duration}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={16} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => {
                    console.log("🔥 Intensity button pressed");
                    setShowInt(true);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <Text style={styles.settingLabel}>Intensity</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={[styles.settingValue, { color: LIME }]}>{intensity}</Text>
                      <Ionicons name="flame-outline" size={14} color={LIME} />
                    </View>
                  </View>
                  <Ionicons name="chevron-down" size={16} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => {
                    console.log("💪 Muscle Groups button pressed");
                    setShowGroups(true);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <Text style={styles.settingLabel}>Muscle Groups</Text>
                    <Text style={[styles.settingValue, { color: LIME }]}>
                      {muscleGroups.length > 0 ? muscleGroups.join(", ") : "Choose"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Additional Information (KAV local uniquement ici) */}
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Add more information</Text>
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
                  <Text style={styles.settingDescription}>
                    Use this to give additional instructions to your request for this workout only.
                  </Text>
                </View>
              </KeyboardAvoidingView>
            </ScrollView>

            {/* Generate Button */}
            <TouchableOpacity activeOpacity={0.9} style={styles.generateButton} onPress={handleGenerate}>
              <LinearGradient
                colors={[LIME, LIME_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.generateButtonText}>Generate Workout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      {/* Drawer Selectors */}
      <DrawerSelector
        visible={showEquip}
        title="Available Equipment"
        options={EQUIP_OPTIONS}
        selected={equipment}
        onSelect={(v) => setEquipment(v as string)}
        onClose={() => setShowEquip(false)}
      />
      <DrawerSelector
        visible={showDur}
        title="Duration"
        options={DURATION_OPTIONS}
        selected={duration}
        onSelect={(v) => setDuration(v as string)}
        onClose={() => setShowDur(false)}
      />
      <DrawerSelector
        visible={showInt}
        title="Intensity"
        options={INTENSITY_OPTIONS}
        selected={intensity}
        onSelect={(v) => setIntensity(v as string)}
        onClose={() => setShowInt(false)}
      />
      <DrawerSelector
        visible={showGroups}
        title="Muscle Groups"
        options={MUSCLE_GROUPS_ALL}
        selected={muscleGroups}
        multi
        onSelect={(v) => setMuscleGroups(v as string[])}
        onClose={() => setShowGroups(false)}
      />
    </>
  );
}

/* -------------------- styles -------------------- */

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },

  drawerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
    maxHeight: "100%",
  },
  border: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginTop: 10,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "900" },

  content: {
    paddingTop: 12,
    paddingHorizontal: 20,
    flex: 1,
    maxHeight: 500,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 18,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(216,255,73,0.1)",
    borderWidth: 1,
    borderColor: "rgba(216,255,73,0.3)",
  },
  chipTxt: { color: LIME, fontWeight: "800", fontSize: 12 },

  proBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255,215,0,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
    marginBottom: 24,
  },
  proContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
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

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },

  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 8,
  },
  settingLeft: {
    flex: 1,
  },
  settingLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  settingDescription: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 8,
    paddingHorizontal: 4,
  },

  textInputContainer: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 8,
  },
  textInput: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
    minHeight: 88,
  },

  generateButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonText: {
    color: "#071100",
    fontWeight: "900",
    fontSize: 16,
  },
});
