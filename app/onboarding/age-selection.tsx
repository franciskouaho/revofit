import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
  ViewabilityConfig,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";

/* ---------- Constantes UI ---------- */
const ROW_H = 60;              // hauteur de chaque ligne
const VISIBLE_ROWS = 5;        // nombre d’items visibles (centres + 2 au-dessus/2 au-dessous)
const PILL_W = 240;
const PILL_H = ROW_H * (VISIBLE_ROWS + 2); // marge extra pour arrondis

export default function AgeSelectionScreen() {
  const ages = useMemo(() => Array.from({ length: 83 }, (_, i) => i + 18), []);
  const [selectedAge, setSelectedAge] = useState(36);
  const { nextStep } = useOnboarding();

  const listRef = useRef<FlatList<number>>(null);

  // Centre la liste sur l'âge sélectionné au montage
  React.useEffect(() => {
    const idx = ages.indexOf(selectedAge);
    if (idx >= 0) {
      setTimeout(() => {
        listRef.current?.scrollToOffset({
          offset: idx * ROW_H,
          animated: false,
        });
      }, 0);
    }
  }, [ages, selectedAge]);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ROW_H);
    const clamped = Math.max(0, Math.min(idx, ages.length - 1));
    if (ages[clamped] !== selectedAge) setSelectedAge(ages[clamped]);
  };

  const viewabilityConfig: ViewabilityConfig = { itemVisiblePercentThreshold: 10 };
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // pas indispensable, mais ça rend la mise à jour plus “vivante”
    }
  ).current;

  const handleBack = () => router.back();

  const handlePick = (age: number) => {
    // scroll vers l'item tapé et mettre à jour
    const idx = ages.indexOf(age);
    listRef.current?.scrollToOffset({
      offset: idx * ROW_H,
      animated: true,
    });
    setSelectedAge(age);
  };

  const handleNext = () => {
    nextStep({ age: selectedAge });
    router.push('/onboarding/height-selection');
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* Fond thème Revo : noir + halos olive */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Vagues latérales */}
      <SideWaves side="left" />
      <SideWaves side="right" />

      {/* header */}
      <SafeAreaView>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8 }}>
          <TouchableOpacity onPress={handleBack} style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: "#2A2A2A", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Dots au centre */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
          </View>

          {/* Espace vide à droite pour équilibrer */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* Contenu */}
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        {/* Titre */}
        <View style={{ alignItems: "center", marginTop: 8, marginBottom: 26 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#9BE15D", marginBottom: 8 }}>
            Quel âge avez-vous ?
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14.5, lineHeight: 22, textAlign: "center" }}>
            Cela nous aide à créer votre{"\n"}entraînement personnalisé.
          </Text>
        </View>

        {/* Pilule centrale */}
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <View
            style={{
              width: PILL_W,
              height: PILL_H,
              borderRadius: PILL_W, // gros arrondi haut/bas
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.15)",
              backgroundColor: "rgba(17,17,17,0.7)",
            }}
          >
            {/* Overlay sombre haut→bas dans la pilule */}
            <LinearGradient
              colors={["#FFFFFF10", "#00000055", "#00000080"]}
              locations={[0, 0.5, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Lignes pointillées centré (au-dessus/au-dessous) */}
            <View
              pointerEvents="none"
              style={{ position: "absolute", left: 20, right: 20, top: (PILL_H - ROW_H) / 2, height: ROW_H }}
            >
              <DottedLine position="top" />
              <DottedLine position="bottom" />
            </View>

            {/* Liste des âges */}
            <FlatList
              ref={listRef}
              data={ages}
              keyExtractor={(item) => String(item)}
              showsVerticalScrollIndicator={false}
              snapToInterval={ROW_H}
              decelerationRate="fast"
              onMomentumScrollEnd={onMomentumEnd}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              contentContainerStyle={{
                paddingVertical: (PILL_H - ROW_H) / 2, // centre l’élément sélectionné
              }}
              renderItem={({ item }) => {
                const dist = Math.abs(item - selectedAge);
                // style progressif comme le mock
                const style = getRowStyle(dist, item === selectedAge);
                return (
                  <TouchableOpacity
                    onPress={() => handlePick(item)}
                    activeOpacity={0.8}
                    style={{ height: ROW_H, alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={style}>{item}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>

      </View>

      {/* bouton */}
      <SafeAreaView>
        <View style={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={handleNext}
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: "#FFD700",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ 
              color: "#000", 
              fontSize: 18, 
              fontWeight: "800" 
            }}>
              Suivant
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* --- style dynamique par distance au centre --- */
function getRowStyle(distance: number, isSelected: boolean) {
  if (isSelected) {
    return {
      fontSize: 34,
      fontWeight: "900" as const,
      color: "#FFFFFF",
      letterSpacing: 0.6,
    };
  }
  if (distance === 1) {
    return {
      fontSize: 26,
      fontWeight: "700" as const,
      color: "#B0B0B0",
      opacity: 0.75,
    };
  }
  if (distance === 2) {
    return {
      fontSize: 20,
      fontWeight: "600" as const,
      color: "#8A8E95",
      opacity: 0.5,
    };
  }
  return {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#6B6F77",
    opacity: 0.28,
  };
}

/* ----- petite ligne pointillée horizontale ----- */
function DottedLine({ position }: { position: "top" | "bottom" }) {
  const dots = Array.from({ length: 18 });
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: 1,
        top: position === "top" ? 0 : undefined,
        bottom: position === "bottom" ? 0 : undefined,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {dots.map((_, i) => (
        <View key={i} style={{ width: 6, height: 1, backgroundColor: "rgba(255,255,255,0.25)" }} />
      ))}
    </View>
  );
}

/* ------- décor : vagues latérales -------- */
function SideWaves({ side }: { side: "left" | "right" }) {
  const rows = useMemo(() => Array.from({ length: 8 }), []);
  return (
    <View
      pointerEvents="none"
      style={[
        { position: "absolute", top: 0, bottom: 0, width: 80, justifyContent: "center" },
        side === "left" ? { left: 0 } : { right: 0 },
      ]}
    >
      {rows.map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: 64,
            height: 24,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
            top: 120 + i * 36,
            opacity: 0.06 + i * 0.015,
          }}
        />
      ))}
    </View>
  );
}