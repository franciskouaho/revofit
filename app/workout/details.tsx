import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
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
  const handleStartWorkout = () => router.push("/workout/active");
  const handleSetMetrics = () => router.push("/workout/metrics");

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
                uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80&auto=format&fit=crop",
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
                      <Text style={styles.metaText}>High Intensity</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.meta}>
                      <Ionicons name="flame" size={16} color="#FFD700" />
                      <Text style={styles.metaText}>~345 kcal</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.meta}>
                      <Ionicons name="time" size={16} color="#FFD700" />
                      <Text style={styles.metaText}>59 min</Text>
                    </View>
                  </View>
                </Glass>
              </View>

              {/* Badge titre */}
              <View style={styles.heroBadgeWrap}>
                <Glass padding={12} style={styles.heroBadge}>
                  <Text style={styles.heroTitle}>Strong Press Workout</Text>
                  <Text style={styles.heroSubtitle}>Upper Body • Press Focus</Text>
                </Glass>
              </View>
            </ImageBackground>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {/* Chips d’infos */}
            <View style={styles.chipsRow}>
              <Glass padding={10} style={styles.chip}>
                <View style={styles.chipRow}>
                  <Ionicons name="barbell" size={14} color="#FFD700" />
                  <Text style={styles.chipText}>Barbell • Dumbbells</Text>
                </View>
              </Glass>
              <Glass padding={10} style={styles.chip}>
                <View style={styles.chipRow}>
                  <Ionicons name="speedometer" size={14} color="#4ECDC4" />
                  <Text style={styles.chipText}>Intermediate</Text>
                </View>
              </Glass>
              <Glass padding={10} style={styles.chip}>
                <View style={styles.chipRow}>
                  <Ionicons name="repeat" size={14} color="#9FA8DA" />
                  <Text style={styles.chipText}>4 Rounds</Text>
                </View>
              </Glass>
            </View>

            {/* Boutons d’action */}
            <View style={styles.actionsRow}>
              <Glass style={{ flex: 1 }}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleSetMetrics}>
                  <Ionicons name="options" size={18} color="#fff" />
                  <Text style={styles.actionText}>Set Metrics</Text>
                </TouchableOpacity>
              </Glass>

              <View style={{ flex: 1, borderRadius: 18, overflow: "hidden" }}>
                <TouchableOpacity activeOpacity={0.9} onPress={handleStartWorkout}>
                  <LinearGradient
                    colors={["#8BC34A", "#2ECC71"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.startBtn}
                  >
                    <Ionicons name="play" size={18} color="#000" />
                    <Text style={styles.startText}>Start</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description (glass) */}
            <Glass>
              <Text style={styles.blockTitle}>Overview</Text>
              <Text style={styles.desc}>
                The Strong Press workout is designed to build upper-body strength and power with a
                press-dominant structure. Expect compound lifts, controlled tempo work, and targeted
                accessories for shoulders and triceps.{" "}
                <Text style={{ color: "#FFD700", fontWeight: "700" }}>See more…</Text>
              </Text>
            </Glass>

            {/* Flow (rounds + exos) */}
            <View style={{ height: 16 }} />

            <Glass>
              <View style={styles.blockHeader}>
                <Text style={styles.blockTitle}>Workout flow</Text>
                <TouchableOpacity>
                  <Text style={styles.edit}>Edit</Text>
                </TouchableOpacity>
              </View>

              {/* Round 1 */}
              <View style={styles.roundHeader}>
                <View style={styles.roundBadge}>
                  <Text style={styles.roundBadgeText}>Round 1</Text>
                </View>
                <Text style={styles.roundMeta}>Target RPE: 7 • Rest: 60–90s</Text>
              </View>

              {/* Exercice 1 */}
              <View style={styles.exerciseCard}>
                <View style={styles.thumb}>
                  <ImageBackground
                    source={{
                      uri: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop",
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
                  <Text style={styles.exerciseName}>Elbow Plank</Text>
                  <Text style={styles.exerciseSub}>Core • Anti-extension</Text>
                </View>

                <Glass padding={8} style={styles.pill}>
                  <Text style={styles.pillText}>1 min</Text>
                </Glass>

                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
              </View>

              {/* Rest */}
              <View style={styles.exerciseCard}>
                <View style={[styles.thumb, { backgroundColor: "rgba(255,255,255,0.06)" }]}>
                  <Ionicons name="time-outline" size={20} color="#fff" />
                </View>

                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text style={styles.exerciseName}>Rest</Text>
                  <Text style={styles.exerciseSub}>Breathe • Shake arms</Text>
                </View>

                <Glass padding={8} style={styles.pill}>
                  <Text style={styles.pillText}>1 min</Text>
                </Glass>

                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
              </View>
            </Glass>

            {/* Conseils / Notes */}
            <View style={{ height: 16 }} />
            <Glass>
              <Text style={styles.blockTitle}>Coach notes</Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {[
                  { icon: "speedometer", text: "Tempo 3-1-1 sur les presses" },
                  { icon: "body", text: "Gainage actif tout le long" },
                  { icon: "water", text: "Hydratation entre les rounds" },
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
});
