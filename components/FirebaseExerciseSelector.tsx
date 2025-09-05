// components/FirebaseExerciseSelector.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useExercises } from "../hooks/useExercises";
import { Exercise } from "../types/exercise";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(0,0,0,0.55)";
const LIME = "#D8FF49";
const LIME_DARK = "#C3F02F";

interface FirebaseExerciseSelectorProps {
  visible: boolean;
  onClose: () => void;
  selectedExercises: string[];
  onExercisesChange: (exercises: string[]) => void;
}

export default function FirebaseExerciseSelector({
  visible,
  onClose,
  selectedExercises,
  onExercisesChange,
}: FirebaseExerciseSelectorProps) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  
  // Hook Firebase pour récupérer les exercices
  const { exercises, loading, error, searchQuery, setSearchQuery } = useExercises();

  // Mettre à jour la recherche Firebase quand la query change
  React.useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  // Grouper les exercices par groupe musculaire
  const groupedExercises = useMemo(() => {
    const groups: Record<string, Exercise[]> = {};
    
    exercises.forEach(exercise => {
      exercise.muscleGroups.forEach(group => {
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(exercise);
      });
    });

    // Trier les groupes
    const sortedGroups = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    
    return sortedGroups;
  }, [exercises]);

  // Filtrage des groupes
  const filteredGroups = useMemo(() => {
    if (!activeGroup) return groupedExercises;
    return groupedExercises.filter(([groupName]) => groupName === activeGroup);
  }, [groupedExercises, activeGroup]);

  const handleToggle = (exerciseId: string) => {
    const currentSelection = selectedExercises || [];
    const next = currentSelection.includes(exerciseId)
      ? currentSelection.filter((id) => id !== exerciseId)
      : [...currentSelection, exerciseId];
    onExercisesChange(next);
  };

  // Actions masse
  const selectAllShown = () => {
    const currentSelection = selectedExercises || [];
    const shown = filteredGroups.flatMap(([, exercises]) => exercises.map(e => e.id));
    const merged = new Set([...currentSelection, ...shown]);
    onExercisesChange(Array.from(merged));
  };

  const clearAllShown = () => {
    const currentSelection = selectedExercises || [];
    const shown = new Set(filteredGroups.flatMap(([, exercises]) => exercises.map(e => e.id)));
    onExercisesChange(currentSelection.filter((id) => !shown.has(id)));
  };

  const getGroupDisplayName = (groupName: string) => {
    const groupNames: Record<string, string> = {
      'chest_global': 'Pectoraux',
      'back_width': 'Dos Largeur',
      'back_thickness': 'Dos Épaisseur',
      'shoulders_front': 'Épaules Avant',
      'shoulders_lateral': 'Épaules Latérales',
      'shoulders_rear': 'Épaules Arrière',
      'biceps_global': 'Biceps',
      'triceps_lateral': 'Triceps',
      'quadriceps': 'Quadriceps',
      'hamstrings': 'Ischio-jambiers',
      'glutes': 'Fessiers',
      'abs_rectus': 'Abdominaux'
    };
    return groupNames[groupName] || groupName;
  };

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
            {groupedExercises.map(([groupName]) => (
              <Chip 
                key={groupName} 
                label={getGroupDisplayName(groupName)} 
                active={activeGroup === groupName} 
                onPress={() => setActiveGroup(groupName === activeGroup ? null : groupName)} 
              />
            ))}
          </ScrollView>

          {/* Contenu principal */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={LIME} />
              <Text style={styles.loadingText}>Chargement des exercices...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
              <Text style={styles.errorTitle}>Erreur de chargement</Text>
              <Text style={styles.errorText}>{error.message}</Text>
            </View>
          ) : (
            <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
              {filteredGroups.map(([groupName, groupExercises]) => (
                <View key={groupName} style={{ marginBottom: 8 }}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{getGroupDisplayName(groupName)}</Text>
                    <Text style={styles.sectionCount}>{groupExercises.length}</Text>
                  </View>

                  {groupExercises.map((exercise) => {
                    const selected = selectedExercises.includes(exercise.id);
                    return (
                      <TouchableOpacity
                        key={exercise.id}
                        style={[styles.item, selected && styles.itemSelected]}
                        activeOpacity={0.9}
                        onPress={() => handleToggle(exercise.id)}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                          <View style={[styles.dot, selected ? { backgroundColor: LIME } : null]} />
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.itemTxt, selected && styles.itemTxtSelected]} numberOfLines={1}>
                              {exercise.name}
                            </Text>
                            <View style={styles.exerciseMeta}>
                              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                                <Text style={styles.difficultyText}>{getDifficultyText(exercise.difficulty)}</Text>
                              </View>
                              <Text style={styles.equipmentText}>{exercise.equipment.join(', ')}</Text>
                            </View>
                          </View>
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
          )}

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

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 12,
    fontSize: 16,
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorTitle: {
    color: "#FF6B6B",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 20,
  },

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

  exerciseMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  equipmentText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
  },

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
