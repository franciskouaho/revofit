// components/WorkoutTemplateCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ExerciseTemplate } from "../types/exercise";

interface WorkoutTemplateCardProps {
  template: ExerciseTemplate;
  onPress: (template: ExerciseTemplate) => void;
  onDelete?: (templateId: string) => void;
  onExercisePress?: (exercise: string, template: ExerciseTemplate) => void;
}

const GOLD = "#FFD700";
const BORDER = "rgba(255,255,255,0.12)";
const INNER_STROKE = "rgba(255,255,255,0.06)";
const SURFACE = "rgba(255,255,255,0.06)";

export default function WorkoutTemplateCard({
  template,
  onPress,
  onDelete,
  onExercisePress,
}: WorkoutTemplateCardProps) {
  const [expanded, setExpanded] = useState(false);

  const cover = template.imageUrl || "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=1200&auto=format&fit=crop";
  const name = template.name || "Entraînement";
  const desc = template.description || "Programme personnalisé";
  const exercises = useMemo(() => Array.isArray(template.exercises) ? template.exercises : [], [template.exercises]);
  const duration = (template as any)?.duration || Math.max(25, exercises.length * 5);
  const difficulty = (template as any)?.difficulty || inferDifficultyFromExercises(exercises) || "Intermédiaire";

  const preview = useMemo(() => exercises.slice(0, 3), [exercises]);
  const restCount = Math.max(0, exercises.length - preview.length);

  const toggle = () => setExpanded((v) => !v);

  return (
    <View style={styles.wrap}>
      {/* carte glass */}
      <View style={styles.card}>
        <BlurView intensity={26} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.plate]} />
        <View style={[StyleSheet.absoluteFill, styles.border]} />
        <View style={[StyleSheet.absoluteFill, styles.innerStroke]} />
        <View style={styles.flare} pointerEvents="none" />

        {/* HEADER (image + titre + actions) */}
        <View style={styles.headerRow}>
          {/* cover */}
          <View style={styles.coverShell}>
            <ImageBackground
              source={{ uri: cover }}
              style={styles.cover}
              imageStyle={{ borderRadius: 16 }}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0.1)"]}
                style={StyleSheet.absoluteFill}
              />
              {/* badge nb exos */}
              <View style={styles.badgeExercises}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.badgeExercisesContent}>
                  <Ionicons name="fitness" size={12} color={GOLD} />
                  <Text style={styles.badgeExercisesText}>{exercises.length}</Text>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* header content */}
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>{name}</Text>

              {onDelete && (
                <TouchableOpacity
                  onPress={() => onDelete(template.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.trashBtn}
                >
                  <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                  <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                </TouchableOpacity>
              )}
            </View>

            {!!desc && <Text numberOfLines={2} style={styles.desc}>{desc}</Text>}

            {/* tags info */}
            <View style={styles.tagsRow}>
              <InfoTag icon="barbell" text={difficulty} />
              <InfoTag icon="time" text={`${duration} min`} />
              <InfoTag icon="list" text={`${exercises.length} exos`} />
            </View>
          </View>
        </View>

        {/* aperçu des exercices (replié) */}
        {!expanded && exercises.length > 0 && (
          <View style={styles.previewBox}>
            {preview.map((ex: any, idx: number) => (
              <NumberedChip
                key={ex.id ?? `${ex.name}-${idx}`}
                index={idx}
                primary={ex.name}
                secondary={
                  [
                    Array.isArray(ex.muscleGroups) ? ex.muscleGroups.join(" • ") : "",
                    ex.difficulty || "",
                  ]
                    .filter(Boolean)
                    .join(" • ")
                }
                onPress={() => onExercisePress?.(ex.name, template)}
              />
            ))}

            {restCount > 0 && (
              <Pressable onPress={toggle} style={({ pressed }) => [styles.moreBtn, pressed && { opacity: 0.8 }]}>
                <LinearGradient colors={["#ffffff14", "transparent"]} style={StyleSheet.absoluteFill} />
                <Text style={styles.moreBtnText}>Voir les {restCount} restants</Text>
                <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.85)" />
              </Pressable>
            )}
          </View>
        )}

        {/* liste complète (étendu) */}
        {expanded && (
          <View style={styles.listBox}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Exercices</Text>
              <TouchableOpacity onPress={toggle} style={styles.collapseBtn}>
                <Ionicons name="chevron-up" size={16} color="rgba(255,255,255,0.85)" />
              </TouchableOpacity>
            </View>

            {exercises.map((ex: any, idx: number) => (
              <Pressable
                key={ex.id ?? `${ex.name}-${idx}`}
                onPress={() => onExercisePress?.(ex.name, template)}
                style={({ pressed }) => [styles.listItem, pressed && { opacity: 0.9 }]}
              >
                <BlurView intensity={12} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.itemContent}>
                  <View style={styles.numPill}>
                    <LinearGradient colors={[GOLD, "#E6C200"]} style={StyleSheet.absoluteFill} />
                    <Text style={styles.numPillText}>{idx + 1}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{ex.name}</Text>
                    <Text style={styles.itemSub} numberOfLines={1}>
                      {[
                        Array.isArray(ex.muscleGroups) ? ex.muscleGroups.join(" • ") : "Groupe musculaire",
                        ex.difficulty || "Niveau",
                      ].join(" • ")}
                    </Text>
                    {!!ex.equipment?.length && (
                      <Text style={styles.itemEquip} numberOfLines={1}>{ex.equipment.join(", ")}</Text>
                    )}
                  </View>

                  <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.6)" />
                </View>
              </Pressable>
            ))}
          </View>
        )}

      </View>
    </View>
  );
}

/* ---------- PETITS COMPOSANTS ---------- */

function InfoTag({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.tag}>
      <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.tagStroke]} />
      <Ionicons name={icon} size={12} color={GOLD} />
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

function NumberedChip({
  index,
  primary,
  secondary,
  onPress,
}: {
  index: number;
  primary: string;
  secondary?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.previewItem, pressed && { opacity: 0.9 }]}>
      <BlurView intensity={12} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.previewStroke]} />

      <View style={styles.previewNum}>
        <LinearGradient colors={[GOLD, "#E6C200"]} style={StyleSheet.absoluteFill} />
        <Text style={styles.previewNumText}>{index + 1}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.previewTitle} numberOfLines={1}>{primary}</Text>
        {!!secondary && <Text style={styles.previewSub} numberOfLines={1}>{secondary}</Text>}
      </View>

      <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.7)" />
    </Pressable>
  );
}

/* ---------- HELPERS ---------- */
function inferDifficultyFromExercises(exs: any[]): string | null {
  const d = (exs || []).map((e) => e?.difficulty?.toLowerCase());
  if (d.includes("advanced")) return "Avancé";
  if (d.includes("beginner")) return "Débutant";
  if (d.length) return "Intermédiaire";
  return null;
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  card: {
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: SURFACE,
  },
  plate: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 22 },
  border: { borderWidth: 1, borderColor: BORDER, borderRadius: 22 },
  innerStroke: { borderWidth: 1, borderColor: INNER_STROKE, borderRadius: 22 },
  flare: {
    position: "absolute",
    top: 0, left: 12, right: 12, height: 26,
    backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14,
  },

  /* header */
  headerRow: { flexDirection: "row", padding: 16, gap: 14 },
  coverShell: { width: 112, height: 112, borderRadius: 16, overflow: "hidden" },
  cover: { flex: 1 },
  badgeExercises: {
    position: "absolute", bottom: 8, right: 8, borderRadius: 12, overflow: "hidden", width: 44, height: 24,
    borderWidth: 1, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  badgeExercisesContent: {
    position: "absolute", inset: 0, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center",
  },
  badgeExercisesText: { color: GOLD, fontWeight: "800", fontSize: 11 },

  headerContent: { flex: 1, gap: 8 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  title: { color: "#fff", fontSize: 18, fontWeight: "900", flex: 1 },
  trashBtn: {
    width: 30, height: 30, borderRadius: 15, overflow: "hidden",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,107,107,0.3)", backgroundColor: "rgba(255,107,107,0.12)",
  },
  desc: { color: "rgba(255,255,255,0.78)", fontSize: 13, lineHeight: 18 },
  tagsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },

  tag: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, overflow: "hidden",
    flexDirection: "row", alignItems: "center", gap: 6,
  },
  tagStroke: { borderWidth: 1, borderColor: BORDER, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)" },
  tagText: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: "700" },

  /* preview */
  previewBox: { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  previewItem: {
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12,
    overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  previewStroke: { borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  previewNum: {
    width: 28, height: 28, borderRadius: 14, overflow: "hidden",
    alignItems: "center", justifyContent: "center",
  },
  previewNumText: { color: "#000", fontWeight: "900", fontSize: 12 },
  previewTitle: { color: "#fff", fontWeight: "800", fontSize: 14 },
  previewSub: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 },
  moreBtn: {
    height: 40, borderRadius: 12, borderWidth: 1, borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  moreBtnText: { color: "rgba(255,255,255,0.9)", fontWeight: "700", fontSize: 12 },

  /* expanded list */
  listBox: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 6, paddingBottom: 2 },
  listTitle: { color: GOLD, fontWeight: "900", fontSize: 16 },
  collapseBtn: {
    padding: 8, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER,
  },
  listItem: {
    borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  itemContent: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  numPill: {
    width: 30, height: 30, borderRadius: 15, overflow: "hidden", alignItems: "center", justifyContent: "center",
  },
  numPillText: { color: "#000", fontWeight: "900", fontSize: 12 },
  itemTitle: { color: "#fff", fontWeight: "800", fontSize: 15 },
  itemSub: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 },
  itemEquip: { color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 2 },

});