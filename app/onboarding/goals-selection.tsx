// app/(onboarding)/goals-selection.tsx
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ColorValue, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* -------- gradient text ---------- */
function GradientText({
  text,
  colors,
  style,
}: {
  text: string;
  colors: [ColorValue, ColorValue];
  style?: any;
}) {
  return (
    <MaskedView maskElement={<Text style={[style, { color: "#fff" }]}>{text}</Text>}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

type Goal = {
  id: string;
  title: string;
  selected: boolean;
  gradient: [ColorValue, ColorValue];
  ring: string;
};

export default function GoalsSelectionScreen() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: "cardio", title: "Cardio", selected: true,  gradient: ["#FF7E5F", "#F8A15B"], ring: "#F08A5B" },
    { id: "reduce-stress", title: "Réduire le stress", selected: true, gradient: ["#9BE15D", "#00E3AE"], ring: "#8EDB6A" },
    { id: "stay-fit", title: "Rester en forme", selected: true, gradient: ["#FFE27A", "#CFAF45"], ring: "#FFD700" },

    // non sélectionnés (grands et estompés)
    { id: "loose-weight", title: "Perdre du poids", selected: false, gradient: ["#CCC", "#CCC"], ring: "#B0B0B0" },
    { id: "strength", title: "Force", selected: false, gradient: ["#CCC", "#CCC"], ring: "#B0B0B0" },
    { id: "flexibility", title: "Flexibilité", selected: false, gradient: ["#CCC", "#CCC"], ring: "#B0B0B0" },
    { id: "sports", title: "Activités sportives", selected: false, gradient: ["#CCC", "#CCC"], ring: "#B0B0B0" },
    { id: "nutrition", title: "Gain nutritionnel", selected: false, gradient: ["#CCC", "#CCC"], ring: "#B0B0B0" },
  ]);

  const toggle = (id: string) => {
    setGoals((prev) => {
      const goal = prev.find(g => g.id === id);
      if (!goal) return prev;
      
      if (goal.selected) {
        // Désélectionner
        return prev.map(g => g.id === id ? { ...g, selected: false } : g);
      } else {
        // Vérifier qu'on n'a pas déjà 2 objectifs sélectionnés
        const selectedCount = prev.filter(g => g.selected).length;
        if (selectedCount >= 2) {
          return prev; // Ne pas permettre plus de 2 sélections
        }
        // Sélectionner
        return prev.map(g => g.id === id ? { ...g, selected: true } : g);
      }
    });
  };

  const handleContinue = () => {
    const selectedGoals = goals.filter(g => g.selected);
    if (selectedGoals.length === 2) {
      console.log('Objectifs sélectionnés:', selectedGoals);
      // Navigation vers la page de sélection du poids
      router.push('/onboarding/email-selection');
    }
  };

  const handleBack = () => router.back();

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* fond thème */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
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
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
          </View>

          {/* Espace vide à droite pour équilibrer */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* content */}
      <View style={{ flex: 1, justifyContent: "flex-start", paddingHorizontal: 24, paddingTop: 20 }}>
        {/* Titre */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#FF8C00", marginBottom: 10 }}>Quel est votre objectif ?</Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14.5, lineHeight: 22, textAlign: "center" }}>
            Choisissez exactement 2 objectifs pour{"\n"}personnaliser votre entraînement.
          </Text>
          <Text style={{ color: "#FFD700", fontSize: 14, marginTop: 8, fontWeight: "600" }}>
            {goals.filter(g => g.selected).length}/2 objectifs sélectionnés
          </Text>
        </View>

        {/* LISTE – alignée à droite */}
        <View style={{ gap: 8 }}>
          {goals.map((g) => {
            const selected = g.selected;
            return (
              <TouchableOpacity key={g.id} onPress={() => toggle(g.id)} activeOpacity={0.9} style={{ width: "100%" }}>
                <View
                  style={[
                    { width: "100%", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 12 },
                    selected ? { backgroundColor: "rgba(255,255,255,0.00)", borderWidth: 0 } : { backgroundColor: "transparent" },
                    selected && {
                      shadowColor: g.ring,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.25,
                      shadowRadius: 18,
                      elevation: 6,
                    },
                  ]}
                >
                  {/* check à gauche */}
                  <View
                    style={[
                      { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center", backgroundColor: "transparent", alignSelf: "center" },
                      { borderColor: selected ? g.ring : "#6B7280" },
                    ]}
                  >
                    {selected && <Ionicons name="checkmark" size={14} color={g.ring} />}
                  </View>

                  {/* texte à droite */}
                  {selected ? (
                    <GradientText text={g.title} colors={g.gradient} style={{ fontSize: 28, fontWeight: "700", letterSpacing: 0.2, textAlign: "right" }} />
                  ) : (
                    <Text style={{ fontSize: 28, fontWeight: "600", color: "#B0B0B0", opacity: 0.6, letterSpacing: 0.2, textAlign: "right" }}>{g.title}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bouton Continue (visible seulement avec 2 objectifs) */}
        {goals.filter(g => g.selected).length === 2 && (
          <View style={{ alignItems: "center", marginTop: 20, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={handleContinue}
              style={{
                backgroundColor: "#FFD700",
                paddingVertical: 16,
                paddingHorizontal: 32,
                borderRadius: 28,
                minWidth: 200,
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
                Continuer
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

/* ------ vagues ------ */
function SideWaves({ side }: { side: "left" | "right" }) {
  const rows = useMemo(() => Array.from({ length: 10 }), []);
  return (
    <View
      pointerEvents="none"
      style={[
        { position: "absolute", top: 0, bottom: 0, width: 90, justifyContent: "center" },
        side === "left" ? { left: 0 } : { right: 0 },
      ]}
    >
      {rows.map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            top: 140 + i * 36,
            width: 70,
            height: 26,
            borderRadius: 13,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
            opacity: 0.06 + i * 0.015,
          }}
        />
      ))}
    </View>
  );
}
