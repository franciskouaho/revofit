import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BORDER = "rgba(255,255,255,0.12)";

const CATEGORIES = [
  { title: "SÉANCES EXPRESS", image: "https://images.unsplash.com/photo-1546484959-f9a53db89b87?q=80&w=1200&auto=format&fit=crop" },
  { title: "ABDOS VENTRE PLAT", image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?q=80&w=1200&auto=format&fit=crop" },
  { title: "PERTE DE POIDS", image: "https://images.unsplash.com/photo-1546484958-7ef3022881d8?q=80&w=1200&auto=format&fit=crop" },
  { title: "PRISE DE MASSE", image: "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=1200&auto=format&fit=crop" },
  { title: "CARDIO BOXING", image: "https://images.unsplash.com/photo-1549049950-48d5887197a7?q=80&w=1200&auto=format&fit=crop" },
  { title: "RENFO MUSCULAIRE", image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1200&auto=format&fit=crop" },
  { title: "CARDIO & HIIT", image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop" },
  { title: "SALLE DE SPORT", image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe0?q=80&w=1200&auto=format&fit=crop" },
  { title: "YOGA & STRETCHING", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" },
  { title: "PILATES", image: "https://images.unsplash.com/photo-1540206276207-3af25c08abc4?q=80&w=1200&auto=format&fit=crop" },
  { title: "CROSSFIT", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop" },
  { title: "DANCE FITNESS", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1200&auto=format&fit=crop" },
  { title: "CYCLING", image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop" },
  { title: "RUNNING", image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop" },
  { title: "SWIMMING", image: "https://images.unsplash.com/photo-1508830524289-0adcbe822b40?q=80&w=1200&auto=format&fit=crop" },
  { title: "FUNCTIONAL TRAINING", image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=1200&auto=format&fit=crop" },
  { title: "MOBILITY", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop" },
  { title: "RECOVERY", image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop" },
  { title: "SENIORS", image: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1200&auto=format&fit=crop" },
  { title: "BEGINNERS", image: "https://images.unsplash.com/photo-1571731956672-c372df0731df?q=80&w=1200&auto=format&fit=crop" },
  { title: "ADVANCED", image: "https://images.unsplash.com/photo-1561214078-f3247647fc5e?q=80&w=1200&auto=format&fit=crop" },
  { title: "MORNING WORKOUTS", image: "https://images.unsplash.com/photo-1526401281623-3593f3c8d714?q=80&w=1200&auto=format&fit=crop" },
  { title: "EVENING SESSIONS", image: "https://images.unsplash.com/photo-1548695607-9c73430ba012?q=80&w=1200&auto=format&fit=crop" },
  { title: "WEEKEND SPECIALS", image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1200&auto=format&fit=crop" },
];

export default function ExploreScreen() {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Gradient de fond */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.15, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Barre de recherche – glass propre - FIXE */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrap}>
            <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.searchContent}>
              <Ionicons
                name="search"
                size={18}
                color={focused ? "#FFD700" : "#B0B0B0"}
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un entraînement..."
                placeholderTextColor="#A6A6A6"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardAppearance="dark"
                selectionColor="#FFD700"
              />
            </View>
          </View>
        </View>

        {/* Grille des catégories - SCROLLABLE */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((cat, i) => (
                <TouchableOpacity key={i} style={styles.categoryCard} activeOpacity={0.85}>
                  <ImageBackground
                    source={{ uri: cat.image }}
                    style={styles.cardImage}
                    imageStyle={{ borderRadius: 16 }}
                    >
                    {/* Gradient sombre pour la lisibilité */}
                    <LinearGradient
                      colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.15)"]}
                      style={StyleSheet.absoluteFill}
                    />
                    {/* Bandeau titre en verre */}
                    <View style={styles.titleWrap}>
                      <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
                      <Text style={styles.categoryTitle}>{cat.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },

  /* Search */
  searchContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },
  searchWrap: {
    borderRadius: 28,
    overflow: "hidden",                 // <<< évite les artefacts de blur
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(0,0,0,0.35)",// stabilise le rendu
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingTop: 0,
    paddingBottom: 0,
    includeFontPadding: false,
  },

  /* Grid */
  content: { flex: 1, paddingHorizontal: 16, paddingBottom: 24 },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryCard: {
    width: "31%",
    aspectRatio: 0.6, // Encore plus haut (était 0.75)
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1B1B1B",
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardImage: { flex: 1, justifyContent: "flex-end" },

  titleWrap: {
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  categoryTitle: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
});
