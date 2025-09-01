// components/ExerciseSelector.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(0,0,0,0.55)"; // <- alpha corrigé (glass sombre)
const LIME = "#D8FF49";
const LIME_DARK = "#C3F02F";

interface ExerciseSelectorProps {
  visible: boolean;
  onClose: () => void;
  selectedExercises: string[];
  onExercisesChange: (exercises: string[]) => void;
}

/* --------- Données regroupées --------- */
const GROUPS: Record<string, string[]> = {
  Pectoraux: [
    "Développé couché","Développé incliné","Développé décliné","Écarté couché","Écarté incliné",
    "Écarté décliné","Pompes","Dips pectoraux","Développé haltères pectoraux","Butterfly","Pull-over",
  ],
  Dos: [
    "Tractions","Rowing haltère","Rowing barre","Rowing T-bar","Rowing machine","Tirage vertical",
    "Tirage horizontal","Tirage nuque","Shrugs","Pull-down","Deadlift","Good morning dos",
  ],
  Épaules: [
    "Développé militaire","Développé haltères épaules","Élévations latérales","Élévations frontales",
    "Élévations arrière","Arnold press","Upright row","Face pull","Reverse flyes",
  ],
  Biceps: [
    "Curl haltères","Curl barre","Curl pupitre","Curl marteau","Curl concentré","Curl spider",
    "Curl incliné","Curl 21","Preacher curl",
  ],
  Triceps: [
    "Extensions nuque","Extensions poulie","Dips triceps","Kickback","Skull crushers",
    "Diamond push-ups","Overhead extensions","Rope pushdown","Close grip bench press",
  ],
  Jambes: [
    "Squat","Squat avant","Squat bulgare","Leg press","Extensions cuisses","Leg curl","Hip thrust",
    "Deadlift roumain","Good morning jambes","Lunges","Step-ups","Calf raises",
    "Leg abduction","Leg adduction","Hip adduction","Hip abduction",
  ],
  Abdominaux: [
    "Crunch","Crunch inversé","Plank","Side plank","Russian twist","Leg raises",
    "Bicycle crunch","Mountain climbers abdos","Ab wheel rollout","Cable woodchop",
  ],
  Cardio: [
    "Course à pied","Vélo","Rameur","Elliptique","Escalier","Burpees","Jumping jacks",
    "Mountain climbers cardio","High knees","Butt kicks",
  ],
};
const QUICK = Object.keys(GROUPS);

export default function ExerciseSelector({
  visible,
  onClose,
  selectedExercises,
  onExercisesChange,
}: ExerciseSelectorProps) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Filtrage memo
  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const entries = Object.entries(GROUPS).filter(([g]) => (activeGroup ? g === activeGroup : true));
    if (!q) return entries;
    return entries
      .map(([g, list]) => [g, list.filter((n) => n.toLowerCase().includes(q))] as [string, string[]])
      .filter(([, list]) => list.length > 0);
  }, [query, activeGroup]);

  const handleToggle = (name: string) => {
    const currentSelection = selectedExercises || [];
    const next = currentSelection.includes(name)
      ? currentSelection.filter((e) => e !== name)
      : [...currentSelection, name];
    onExercisesChange(next);
  };

  // Actions masse
  const selectAllShown = () => {
    const currentSelection = selectedExercises || [];
    const shown = sections.flatMap(([, l]) => l);
    const merged = new Set([...currentSelection, ...shown]);
    onExercisesChange(Array.from(merged));
  };
  const clearAllShown = () => {
    const currentSelection = selectedExercises || [];
    const shown = new Set(sections.flatMap(([, l]) => l));
    onExercisesChange(currentSelection.filter((e) => !shown.has(e)));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop gradient (clic pour fermer) */}
      <View style={styles.backdrop}>
        <LinearGradient
          colors={["#000000e0", "#000000cc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </View>

      {/* Drawer glass */}
      <View style={styles.drawerWrap}>
        <View style={styles.drawer}>
          <BlurView intensity={Platform.OS === "ios" ? 28 : 20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.border]} />

          {/* Lueur top */}
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
            <Text style={styles.title}>Sélectionner les exercices</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Barre outils : recherche + actions */}
          <View style={styles.toolbar}>
            <View style={styles.search}>
              <Ionicons name="search" size={16} color="#c9cfb0" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un exercice…"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardAppearance="dark"
                selectionColor={LIME}
              />
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={selectAllShown} style={styles.ghostBtn}>
                <Ionicons name="checkmark-done" size={16} color="#E8FFB3" />
                <Text style={styles.ghostTxt}>Tout</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearAllShown} style={styles.ghostBtn}>
                <Ionicons name="close-circle" size={16} color="#ffb3b3" />
                <Text style={styles.ghostTxt}>Effacer</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filtres rapides (groupes) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
            style={{ marginBottom: 8 }}
          >
            <Chip label="Tous" active={!activeGroup} onPress={() => setActiveGroup(null)} />
            {QUICK.map((g) => (
              <Chip key={g} label={g} active={activeGroup === g} onPress={() => setActiveGroup(g === activeGroup ? null : g)} />
            ))}
          </ScrollView>

          {/* Liste groupée */}
          <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
            {sections.map(([group, list]) => (
              <View key={group} style={{ marginBottom: 8 }}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{group}</Text>
                  <Text style={styles.sectionCount}>{list.length}</Text>
                </View>

                {list.map((name) => {
                  const currentSelection = selectedExercises || [];
                  const selected = currentSelection.includes(name);
                  return (
                    <TouchableOpacity
                      key={name}
                      style={[styles.item, selected && styles.itemSelected]}
                      activeOpacity={0.9}
                      onPress={() => handleToggle(name)}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={[styles.dot, selected ? { backgroundColor: LIME } : null]} />
                        <Text style={[styles.itemTxt, selected && styles.itemTxtSelected]} numberOfLines={1}>
                          {name}
                        </Text>
                      </View>
                      {selected ? (
                        <Ionicons name="checkmark-circle" size={18} color={LIME} />
                      ) : (
                        <Ionicons name="add-circle-outline" size={18} color="rgba(255,255,255,0.55)" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {/* CTA */}
          <TouchableOpacity style={styles.cta} activeOpacity={0.9} onPress={onClose}>
            <LinearGradient colors={[LIME, LIME_DARK]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Text style={styles.ctaTxt}>Valider ({(selectedExercises || []).length})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ---- Chip ---- */
function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
    >
      <Text style={[styles.chipTxt, active ? styles.chipTxtActive : styles.chipTxtIdle]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---- Styles ---- */
const styles = StyleSheet.create({
  backdrop: { flex: 1 },
  drawerWrap: { position: "absolute", left: 0, right: 0, bottom: 0 },
  drawer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingTop: 8,
    paddingBottom: 18,
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
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginTop: 10,
    marginBottom: 8,
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "900" },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1, borderColor: BORDER,
  },

  toolbar: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  search: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 14, paddingVertical: 0 },

  actionsRow: { flexDirection: "row", gap: 8 },
  ghostBtn: {
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ghostTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

  chip: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: "rgba(216,255,73,0.12)", borderColor: LIME },
  chipIdle: { backgroundColor: "rgba(255,255,255,0.06)", borderColor: BORDER },
  chipTxt: { fontSize: 12, fontWeight: "800", letterSpacing: 0.2 },
  chipTxtActive: { color: LIME },
  chipTxtIdle: { color: "rgba(255,255,255,0.85)" },

  list: { maxHeight: 460, paddingHorizontal: 12 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderColor: BORDER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  sectionTitle: { color: "#fff", fontWeight: "900", fontSize: 13 },
  sectionCount: { color: "rgba(255,255,255,0.7)", fontSize: 12 },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 3,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  itemSelected: { backgroundColor: "rgba(216,255,73,0.10)", borderColor: LIME },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginRight: 10,
  },
  itemTxt: { color: "#fff", fontSize: 15, fontWeight: "600", maxWidth: "86%" },
  itemTxtSelected: { color: LIME },

  cta: {
    marginTop: 8,
    marginHorizontal: 12,
    height: 54,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.4)",
  },
  ctaTxt: { color: "#071100", fontWeight: "900", fontSize: 16 },
});
