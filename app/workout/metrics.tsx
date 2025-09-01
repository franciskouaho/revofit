import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(255,255,255,0.06)";

function Glass({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[{ borderRadius: 18, overflow: "hidden" }, style]}>
      <BlurView
        intensity={20}
        tint="dark"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View
        pointerEvents="none"
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
      <View style={{ padding: 16 }}>{children}</View>
    </View>
  );
}

/* ---------------- BottomSheet Selector ---------------- */
function MetricSelector({
  visible,
  onClose,
  title,
  options,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

export default function WorkoutMetricsScreen() {
  const [metrics, setMetrics] = useState({
    restTime: "2 min",
    numberOfSets: "4 sets",
    numberOfReps: "10 reps",
    plank: "1 min",
  });

  const [selector, setSelector] = useState<
    null | "restTime" | "numberOfSets" | "numberOfReps" | "plank"
  >(null);

  const options = {
    restTime: ["30 sec", "1 min", "90 sec", "2 min", "3 min"],
    numberOfSets: ["3 sets", "4 sets", "5 sets", "6 sets"],
    numberOfReps: ["8 reps", "10 reps", "12 reps", "15 reps"],
    plank: ["30 sec", "45 sec", "1 min", "90 sec"],
  };

  const handleSelect = (field: keyof typeof metrics, value: string) => {
    setMetrics((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAndContinue = () => {
    // Extraire le nombre de séries et de répétitions
    const numberOfSets = parseInt(metrics.numberOfSets.split(' ')[0]);
    const numberOfReps = parseInt(metrics.numberOfReps.split(' ')[0]);
    const restTime = metrics.restTime;
    const plankDuration = metrics.plank;
    
    // Rediriger vers details avec les paramètres
    router.push({
      pathname: "/workout/details",
      params: {
        sets: numberOfSets.toString(),
        reps: numberOfReps.toString(),
        restTime: restTime,
        plankDuration: plankDuration,
        fromMetrics: "true"
      }
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Métriques dentraînement</Text>
          <View style={styles.iconBtn}>
            <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        >
          <View style={{ gap: 14, marginTop: 6 }}>
            {/* Rest Time */}
            <TouchableOpacity onPress={() => setSelector("restTime")}>
              <Glass>
                <View style={styles.row}>
                  <View style={styles.left}>
                    <Ionicons name="time-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.label}>Temps de repos</Text>
                  </View>
                  <Text style={styles.value}>{metrics.restTime}</Text>
                </View>
              </Glass>
            </TouchableOpacity>

            {/* Sets */}
            <TouchableOpacity onPress={() => setSelector("numberOfSets")}>
              <Glass>
                <View style={styles.row}>
                  <View style={styles.left}>
                    <Ionicons name="repeat" size={20} color="#FFFFFF" />
                    <Text style={styles.label}>Nombre de séries</Text>
                  </View>
                  <Text style={styles.value}>{metrics.numberOfSets}</Text>
                </View>
              </Glass>
            </TouchableOpacity>

            {/* Reps */}
            <TouchableOpacity onPress={() => setSelector("numberOfReps")}>
              <Glass>
                <View style={styles.row}>
                  <View style={styles.left}>
                    <Ionicons
                      name="refresh-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.label}>Nombre de répétitions</Text>
                  </View>
                  <Text style={styles.value}>{metrics.numberOfReps}</Text>
                </View>
              </Glass>
            </TouchableOpacity>

            {/* Plank */}
            <TouchableOpacity onPress={() => setSelector("plank")}>
              <Glass>
                <View style={styles.row}>
                  <View style={styles.left}>
                    <Ionicons
                      name="stopwatch-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.label}>Gainage</Text>
                  </View>
                  <Text style={styles.value}>{metrics.plank}</Text>
                </View>
              </Glass>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* CTA en bas */}
        <View style={styles.bottomCTA}>
          <View style={{ borderRadius: 18, overflow: "hidden" }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSaveAndContinue}
            >
              <LinearGradient
                colors={["#8BC34A", "#2ECC71"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cta}
              >
                <Ionicons name="checkmark" size={18} color="#000" />
                <Text style={styles.ctaText}>Sauvegarder & Continuer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Selectors */}
      {selector && (
        <MetricSelector
          visible={!!selector}
          title={selector}
          options={options[selector]}
          onSelect={(val) => handleSelect(selector, val)}
          onClose={() => setSelector(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  headerTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },

  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  label: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  value: { color: "#FFD700", fontSize: 16, fontWeight: "700" },

  cta: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaText: { color: "#000", fontSize: 16, fontWeight: "900" },
  bottomCTA: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "50%",
    padding: 20,
  },
  sheetTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  optionText: { color: "#fff", fontSize: 16 },
});
