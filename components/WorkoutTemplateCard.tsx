// components/WorkoutTemplateCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WorkoutTemplate } from "../services/storage";

const BORDER = "rgba(255,255,255,0.12)";

interface WorkoutTemplateCardProps {
  template: WorkoutTemplate;
  onPress: (template: WorkoutTemplate) => void;
  onDelete?: (templateId: string) => void;
  onExercisePress?: (exercise: string, template: WorkoutTemplate) => void;
}

export default function WorkoutTemplateCard({
  template,
  onPress,
  onDelete,
  onExercisePress,
}: WorkoutTemplateCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => onPress(template)}
    >
      {/* Image de gauche */}
      <ImageBackground
        source={{ uri: template.coverImage || "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=400&auto=format&fit=crop" }}
        style={styles.cardImage}
        imageStyle={styles.cardImageRadius}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.1)"]}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Badge exercices sur l'image */}
        <View style={styles.exerciseBadge}>
          <Ionicons name="fitness" size={12} color="#FFD700" />
          <Text style={styles.exerciseBadgeText}>{template.exercises.length}</Text>
        </View>
      </ImageBackground>

      {/* Contenu de droite */}
      <View style={styles.cardContent}>
        {/* Header avec titre et bouton delete */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {template.title}
            </Text>
          </View>
          
          {onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(template.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color="#ff6b6b" />
            </TouchableOpacity>
          )}
        </View>

        {/* Description */}
        {template.description && (
          <Text style={styles.description} numberOfLines={2}>
            {template.description}
          </Text>
        )}

        {/* Exercices - Section simple */}
        <View style={styles.exercisesSection}>
          <View style={styles.exercisesHeader}>
            <Ionicons name="fitness" size={14} color="#FFD700" />
            <Text style={styles.exercisesLabel}>{template.exercises.length} exercices</Text>
            <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.4)" />
          </View>
        </View>

        {/* Footer avec date et bouton start */}
        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.7)" />
            <Text style={styles.dateText}>
              {formatDate(template.createdAt)}
            </Text>
          </View>
          
          <View style={styles.startButton}>
            <LinearGradient
              colors={["#FFD700", "#E6C200"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.startButtonContent}>
              <Ionicons name="play" size={14} color="#000" />
              <Text style={styles.startButtonText}>Start</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#1B1B1B",
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
    height: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardImage: {
    width: 140,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 12,
  },
  cardImageRadius: { 
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  exerciseBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  exerciseBadgeText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "800",
  },

  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,107,107,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },

  description: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },

  exercisesSection: {
    marginBottom: 12,
  },
  exercisesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exercisesLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    marginLeft: 8,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontWeight: "600",
  },
  startButton: {
    borderRadius: 18,
    overflow: "hidden",
    minWidth: 80,
    height: 32,
  },
  startButtonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
  },
  startButtonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "900",
  },
});
