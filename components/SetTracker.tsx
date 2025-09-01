import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(255,255,255,0.06)";
const LIME = "#D8FF49";

interface Set {
  id: number;
  reps: number;
  weight?: number;
  completed: boolean;
}

interface SetTrackerProps {
  exerciseName: string;
  totalSets: number;
  repsPerSet: number;
  weight?: number;
  onComplete?: (completedSets: Set[]) => void;
}

export default function SetTracker({
  exerciseName,
  totalSets,
  repsPerSet,
  weight = 0,
  onComplete,
}: SetTrackerProps) {
  const [sets, setSets] = useState<Set[]>(
    Array.from({ length: totalSets }, (_, i) => ({
      id: i + 1,
      reps: repsPerSet,
      weight,
      completed: false,
    }))
  );

  const completedSets = sets.filter(set => set.completed).length;
  const progress = completedSets / totalSets;

  const toggleSet = (setId: number) => {
    const newSets = sets.map(set =>
      set.id === setId ? { ...set, completed: !set.completed } : set
    );
    setSets(newSets);
    
    if (onComplete) {
      onComplete(newSets.filter(set => set.completed));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header avec progression */}
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{exerciseName}</Text>
        <Text style={styles.progress}>
          {completedSets}/{totalSets} séries terminées
        </Text>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Liste des séries */}
      <View style={styles.setsContainer}>
        {sets.map((set) => (
          <TouchableOpacity
            key={set.id}
            style={[styles.setCard, set.completed && styles.setCompleted]}
            onPress={() => toggleSet(set.id)}
            activeOpacity={0.8}
          >
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, styles.border]} />
            
            <View style={styles.setContent}>
              <View style={styles.setInfo}>
                <Text style={styles.setNumber}>Série {set.id}</Text>
                <Text style={styles.setDetails}>
                  {set.reps} répétitions
                  {weight > 0 && ` • ${weight} kg`}
                </Text>
              </View>
              
              <View style={styles.setStatus}>
                {set.completed ? (
                  <View style={styles.completedIcon}>
                    <Ionicons name="checkmark" size={20} color="#000" />
                  </View>
                ) : (
                  <View style={styles.pendingIcon}>
                    <Ionicons name="ellipse-outline" size={24} color="rgba(255,255,255,0.6)" />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => {
            const allCompleted = sets.map(set => ({ ...set, completed: true }));
            setSets(allCompleted);
            if (onComplete) onComplete(allCompleted);
          }}
        >
          <Text style={styles.actionText}>Marquer tout comme terminé</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  progress: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 3,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: LIME,
    borderRadius: 3,
  },
  setsContainer: {
    gap: 8,
  },
  setCard: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  setCompleted: {
    borderColor: LIME,
    backgroundColor: "rgba(216, 255, 73, 0.1)",
  },
  border: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  setContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  setInfo: {
    flex: 1,
  },
  setNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  setDetails: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  setStatus: {
    alignItems: "center",
    justifyContent: "center",
  },
  completedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LIME,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    marginTop: 16,
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
