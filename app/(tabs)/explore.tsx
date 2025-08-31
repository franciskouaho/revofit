import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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

const { width } = Dimensions.get("window");
const BORDER = "rgba(255,255,255,0.12)";

// Utilitaire Unsplash (garantit crop et qualité)
const u = (idOrQuery: string) =>
  idOrQuery.startsWith("http")
    ? idOrQuery
    : `https://images.unsplash.com/${idOrQuery}?q=80&w=1200&auto=format&fit=crop`;

/** ---- MUSCLES : grands groupes + sous-groupes (complet) ---- */
const RAW_CATEGORIES = [
  // Pecs
  { title: "Pectoraux (global)", image: u("photo-1517963628607-235ccdd5476b") },
  { title: "Haut des pectoraux", image: u("photo-1519741497674-611481863552") },
  { title: "Bas des pectoraux", image: u("photo-1574689047510-7a04b6a8b19b") },
  { title: "Pecs intérieurs", image: u("photo-1546484959-f9a53db89b87") },
  // Dos
  { title: "Dos (largeur)", image: u("photo-1546483875-ad9014c88eba") },
  { title: "Dos (épaisseur)", image: u("photo-1517832606299-7ae9b720a186") },
  { title: "Lats (grand dorsal)", image: u("photo-1598970434795-0c54fe7c0642") },
  { title: "Lombaires", image: u("photo-1594737625785-c6683fcf2f8d") },
  // Épaules
  { title: "Épaules (antérieurs)", image: u("photo-1599058917212-d750089bc07f") },
  { title: "Épaules (latéraux)", image: u("photo-1561214078-f3247647fc5e") },
  { title: "Épaules (postérieurs)", image: u("photo-1518611012118-696072aa579a") },
  { title: "Trapèzes", image: u("photo-1571907480495-4f1b1a2d873a") },
  // Bras
  { title: "Biceps (global)", image: u("photo-1571731956672-c372df0731df") },
  { title: "Biceps (longue portion)", image: u("photo-1552674605-db6ffd4facb5") },
  { title: "Biceps (courte portion)", image: u("photo-1621803958999-1ee04f4b0d89") },
  { title: "Triceps (vaste latéral)", image: u("photo-1549049950-48d5887197a7") },
  { title: "Triceps (vaste médial)", image: u("photo-1554284126-aa88f22d8b74") },
  { title: "Avant-bras", image: u("photo-1516483638261-f4dbaf036963") },
  // Jambes
  { title: "Quadriceps", image: u("photo-1518459031867-a89b944bffe0") },
  { title: "Ischio-jambiers", image: u("photo-1546484958-7ef3022881d8") },
  { title: "Fessiers", image: u("photo-1571019614242-c5c5dee9f50b") },
  { title: "Adducteurs", image: u("photo-1605296867304-46d5465a13f1") },
  { title: "Abducteurs (hanches)", image: u("photo-1526401281623-3593f3c8d714") },
  { title: "Mollets (gastrocnémiens)", image: u("photo-1507838153414-b4b713384a76") },
  { title: "Mollets (soléaire)", image: u("photo-1521804906057-1df8fdb0ecce") },
  // Core
  { title: "Abdos (grand droit)", image: u("photo-1540206276207-3af25c08abc4") },
  { title: "Obliques", image: u("photo-1544367567-0f2fcb009e0b") },
  { title: "Transverse (gainage)", image: u("photo-1504805572947-34fad45aed93") },
  // Mouvements/Focus salle
  { title: "Développé couché", image: u("photo-1517963628607-235ccdd5476b") },
  { title: "Développé incliné", image: u("photo-1519741497674-611481863552") },
  { title: "Rowing barre", image: u("photo-1517832606299-7ae9b720a186") },
  { title: "Tirage vertical", image: u("photo-1546483875-ad9014c88eba") },
  { title: "Soulevé de terre", image: u("photo-1517423440428-a5a00ad493e8") },
  { title: "Front squat", image: u("photo-1518459031867-a89b944bffe0") },
  { title: "Back squat", image: u("photo-1518459031867-a89b944bffe0") },
  { title: "Fentes", image: u("photo-1517832606299-7ae9b720a186") },
  { title: "Hip thrust", image: u("photo-1571019614242-c5c5dee9f50b") },
  { title: "Poulie triceps", image: u("photo-1549049950-48d5887197a7") },
  { title: "Curl biceps", image: u("photo-1571731956672-c372df0731df") },
  { title: "Élévations latérales", image: u("photo-1561214078-f3247647fc5e") },
  { title: "Face pull", image: u("photo-1518611012118-696072aa579a") },
];

export default function ExploreScreen() {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RAW_CATEGORIES;
    return RAW_CATEGORIES.filter((c) => c.title.toLowerCase().includes(q));
  }, [query]);

  /** --- RENDER --- */

  const renderItem = ({ item }: { item: { title: string; image: string } }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.88}
      onPress={() => router.push("/workout/details")}
    >
      <ImageBackground source={{ uri: item.image }} style={styles.cardImage} imageStyle={styles.cardImageRadius}>
        {/* Overlay sombre pour la lisibilité */}
        <LinearGradient
          colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.15)"]}
          style={StyleSheet.absoluteFill}
        />
        {/* Bandeau titre en glass */}
        <View style={styles.titleWrap}>
          <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
          <Text numberOfLines={2} style={styles.titleText}>
            {item.title}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
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
                placeholder="Rechercher un muscle / mouvement…"
                placeholderTextColor="#A6A6A6"
                value={query}
                onChangeText={setQuery}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardAppearance="dark"
                selectionColor="#FFD700"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Grille (FlatList -> tailles uniformes & perf) */}
        <FlatList
          data={data}
          keyExtractor={(item, idx) => item.title + "_" + idx}
          renderItem={renderItem}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 12 }}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 4 }}
          ListEmptyComponent={
            <View style={{ padding: 24, alignItems: "center" }}>
              <Text style={{ color: "rgba(255,255,255,0.7)" }}>Aucun résultat pour “{query}”.</Text>
            </View>
          }
        />
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
});
