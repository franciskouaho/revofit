// app/(onboarding)/goals-selection.tsx
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { ColorValue, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";

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
    { id: "cardio", title: "Cardio", selected: false,  gradient: ["#FF7E5F", "#F8A15B"], ring: "#F08A5B" },
    { id: "reduce-stress", title: "Réduire le stress", selected: false, gradient: ["#9BE15D", "#00E3AE"], ring: "#8EDB6A" },
    { id: "stay-fit", title: "Rester en forme", selected: false, gradient: ["#FFE27A", "#CFAF45"], ring: "#FFD700" },
    { id: "loose-weight", title: "Perdre du poids", selected: false, gradient: ["#CCC", "#CCC"], ring: "#B0B0B0" },
    { id: "strength", title: "Force", selected: false, gradient: ["#CCC", "#CCC"], ring: "#B0B0B0" },
    { id: "flexibility", title: "Flexibilité", selected: false, gradient: ["#CCC", "#CCC"], ring: "#B0B0B0" },
    { id: "sports", title: "Activités sportives", selected: false, gradient: ["#CCC", "#CCC"], ring: "#B0B0B0" },
    { id: "nutrition", title: "Gain nutritionnel", selected: false, gradient: ["#CCC", "#CCC"], ring: "#B0B0B0" },
  ]);

  const { nextStep } = useOnboarding();

  const toggle = (id: string) => {
    setGoals((prev) => {
      const updated = prev.map((goal) => {
        if (goal.id === id) {
          return { ...goal, selected: !goal.selected };
        }
        return goal;
      });
      return updated;
    });
  };

  const selectedGoals = goals.filter((goal) => goal.selected);
  const hasSelection = selectedGoals.length > 0;

  const handleNext = () => {
    if (hasSelection) {
      const goalTitles = selectedGoals.map(goal => goal.title);
      nextStep({ goals: goalTitles });
      router.push('/onboarding/email-selection');
    }
  };

  const handleBack = () => router.back();

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      {/* Fond thème Revo */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
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
          </View>

          {/* Espace vide à droite pour équilibrer */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* Contenu */}
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        {/* Titre */}
        <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 32 }}>
          <GradientText
            text="Quels sont vos objectifs ?"
            colors={["#FFD700", "#FFA500"]}
            style={{ fontSize: 24, fontWeight: '800', textAlign: 'center' }}
          />
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
            Sélectionnez vos objectifs principaux pour{"\n"}personnaliser votre expérience RevoFit.
          </Text>
        </View>

        {/* Grille d'objectifs */}
        <View style={{ flex: 1, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                onPress={() => toggle(goal.id)}
                style={{
                  width: '48%',
                  marginBottom: 16,
                  borderRadius: 16,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: goal.selected ? goal.ring : 'transparent',
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={goal.selected ? goal.gradient : ['#2A2A2A', '#1A1A1A']}
                  style={{
                    padding: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 100,
                  }}
                >
                  <Text style={{
                    color: goal.selected ? '#000' : '#FFFFFF',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                    {goal.title}
                  </Text>
                  {goal.selected && (
                    <View style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Ionicons name="checkmark" size={16} color="#000" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Compteur de sélection */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            {selectedGoals.length} objectif{selectedGoals.length > 1 ? 's' : ''} sélectionné{selectedGoals.length > 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Bouton */}
      <SafeAreaView>
        <View style={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={handleNext}
            disabled={!hasSelection}
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: hasSelection ? "#FFD700" : "#2A2A2A",
              alignItems: "center",
              justifyContent: "center",
              opacity: hasSelection ? 1 : 0.5,
            }}
          >
            <Text style={{ 
              color: hasSelection ? "#000" : "#666", 
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