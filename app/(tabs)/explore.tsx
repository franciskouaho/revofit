import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExercises } from "../../hooks/useExercises";

const { width } = Dimensions.get("window");
const BORDER = "rgba(255,255,255,0.12)";

// Utilitaire Unsplash (garantit crop et qualité)
const u = (idOrQuery: string) =>
  idOrQuery.startsWith("http")
    ? idOrQuery
    : `https://images.unsplash.com/${idOrQuery}?q=80&w=1200&auto=format&fit=crop`;

// Images par défaut pour les groupes musculaires
const DEFAULT_IMAGES = {
  'chest_global': u("photo-1517963628607-235ccdd5476b"),
  'back_width': u("photo-1546483875-ad9014c88eba"),
  'back_thickness': u("photo-1517832606299-7ae9b720a186"),
  'shoulders_front': u("photo-1599058917212-d750089bc07f"),
  'shoulders_lateral': u("photo-1561214078-f3247647fc5e"),
  'shoulders_rear': u("photo-1518611012118-696072aa579a"),
  'biceps_global': u("photo-1571731956672-c372df0731df"),
  'triceps_lateral': u("photo-1549049950-48d5887197a7"),
  'quadriceps': u("photo-1518459031867-a89b944bffe0"),
  'hamstrings': u("photo-1546484958-7ef3022881d8"),
  'glutes': u("photo-1571019614242-c5c5dee9f50b"),
  'abs_rectus': u("photo-1540206276207-3af25c08abc4"),
  'default': u("photo-1517963628607-235ccdd5476b")
};

export default function ExploreScreen() {
  const [focused, setFocused] = useState(false);
  const { 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    filteredExercises 
  } = useExercises();


  // Fonction pour obtenir l'image d'un exercice
  const getExerciseImage = (exercise: any) => {
    if (exercise.imageUrl) {
      return exercise.imageUrl;
    }
    // Utiliser l'image par défaut basée sur le premier groupe musculaire
    const firstMuscleGroup = exercise.muscleGroups?.[0];
    return DEFAULT_IMAGES[firstMuscleGroup as keyof typeof DEFAULT_IMAGES] || DEFAULT_IMAGES.default;
  };

  // Fonction pour obtenir la difficulté en français
  const getDifficultyText = (difficulty: string) => {
    const difficultyMap = {
      'beginner': 'Débutant',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancé'
    };
    return difficultyMap[difficulty as keyof typeof difficultyMap] || difficulty;
  };

  /** --- RENDER --- */

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.88}
      onPress={() => router.push({
        pathname: "/workout/details",
        params: { exercise: JSON.stringify(item) }
      })}
    >
      <ImageBackground 
        source={{ uri: getExerciseImage(item) }} 
        style={styles.cardImage} 
        imageStyle={styles.cardImageRadius}
      >
        {/* Overlay sombre pour la lisibilité */}
        <LinearGradient
          colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.15)"]}
          style={StyleSheet.absoluteFill}
        />
        {/* Bandeau titre en glass */}
        <View style={styles.titleWrap}>
          <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
          <Text numberOfLines={2} style={styles.titleText}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.difficultyText}>
            {getDifficultyText(item.difficulty)}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  // Composant de chargement
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFD700" />
      <Text style={styles.loadingText}>Chargement des exercices...</Text>
    </View>
  );


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
        {/* Search glass */}
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
                placeholder="Rechercher un exercice…"
                placeholderTextColor="#A6A6A6"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardAppearance="dark"
                selectionColor="#FFD700"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Contenu principal */}
        {loading ? (
          renderLoading()
        ) : (
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 12 }}
            columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 4 }}
            ListEmptyComponent={
              <View style={{ padding: 24, alignItems: "center" }}>
                <Text style={{ color: "rgba(255,255,255,0.7)" }}>
                  Aucun exercice trouvé pour &quot;{searchQuery}&quot;.
                </Text>
              </View>
            }
          />
        )}
        
        {/* Message d'erreur discret en bas */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="information-circle" size={16} color="#FFD700" />
            <Text style={styles.errorBannerText}>
              {error.message}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

/** ---- Styles ---- */

const CARD_GAP = 12;
const CARD_COLUMNS = 3;
const CARD_WIDTH = Math.floor((width - 24 - 8 - (CARD_COLUMNS - 1) * CARD_GAP) / CARD_COLUMNS);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },

  /** Search */
  searchContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 },
  searchWrap: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingTop: 0,
    paddingBottom: 0,
    includeFontPadding: false,
  },

  /** Cards */
  card: {
    width: CARD_WIDTH,
    aspectRatio: 0.68, // cartes plus hautes comme demandé
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1B1B1B",
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: CARD_GAP,
  },
  cardImage: { flex: 1, justifyContent: "flex-end" },
  cardImageRadius: { borderRadius: 16 },

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
  titleText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.3,
    paddingHorizontal: 4,
  },
  difficultyText: {
    color: "#FFD700",
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 2,
  },

  /** Loading */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },


  /** Error Banner */
  errorBanner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 215, 0, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorBannerText: {
    color: "#FFD700",
    fontSize: 12,
    flex: 1,
  },
});
