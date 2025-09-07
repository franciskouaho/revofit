// app/(onboarding)/dietary-restrictions-selection.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";

type DietaryRestriction = {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  color: string;
  icon: string;
};

export default function DietaryRestrictionsSelectionScreen() {
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([
    { 
      id: "none", 
      title: "Aucune restriction", 
      description: "Je mange de tout", 
      selected: false, 
      color: "#4CAF50",
      icon: "checkmark-circle"
    },
    { 
      id: "vegetarian", 
      title: "Végétarien", 
      description: "Pas de viande ni poisson", 
      selected: false, 
      color: "#8BC34A",
      icon: "leaf"
    },
    { 
      id: "vegan", 
      title: "Végan", 
      description: "Aucun produit animal", 
      selected: false, 
      color: "#4CAF50",
      icon: "flower"
    },
    { 
      id: "gluten-free", 
      title: "Sans gluten", 
      description: "Évite le gluten", 
      selected: false, 
      color: "#FF9800",
      icon: "ban"
    },
    { 
      id: "lactose-free", 
      title: "Sans lactose", 
      description: "Évite les produits laitiers", 
      selected: false, 
      color: "#FFC107",
      icon: "water"
    },
    { 
      id: "keto", 
      title: "Cétogène", 
      description: "Très faible en glucides", 
      selected: false, 
      color: "#9C27B0",
      icon: "flame"
    },
    { 
      id: "paleo", 
      title: "Paléo", 
      description: "Aliments non transformés", 
      selected: false, 
      color: "#795548",
      icon: "leaf"
    },
    { 
      id: "halal", 
      title: "Halal", 
      description: "Conforme aux règles islamiques", 
      selected: false, 
      color: "#607D8B",
      icon: "star"
    },
    { 
      id: "kosher", 
      title: "Casher", 
      description: "Conforme aux règles juives", 
      selected: false, 
      color: "#3F51B5",
      icon: "star"
    },
  ]);

  const { nextStep } = useOnboarding();

  const toggle = (id: string) => {
    setRestrictions((prev) => 
      prev.map(restriction => ({
        ...restriction,
        selected: restriction.id === id ? !restriction.selected : restriction.id === "none" ? false : restriction.selected
      }))
    );
  };

  const handleNext = () => {
    const selectedRestrictions = restrictions.filter(r => r.selected);
    nextStep({ dietaryRestrictions: selectedRestrictions.map(r => r.id) });
    router.push('/onboarding/culinary-preferences-selection');
  };

  const handleBack = () => router.back();

  const selectedCount = restrictions.filter(r => r.selected).length;

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* Fond thème */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <SideWaves side="left" />
      <SideWaves side="right" />

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
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
          </View>

          {/* Espace vide à droite pour équilibrer */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* Contenu */}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
        {/* Titre */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#FF8C00", marginBottom: 10 }}>
            Avez-vous des restrictions alimentaires ?
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14.5, lineHeight: 22, textAlign: "center" }}>
            Cela nous aide à personnaliser vos{"\n"}recommandations nutritionnelles.
          </Text>
        </View>

        {/* Liste des restrictions */}
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {restrictions.map((restriction) => {
            const selected = restriction.selected;
            return (
              <TouchableOpacity 
                key={restriction.id} 
                onPress={() => toggle(restriction.id)} 
                activeOpacity={0.8}
                style={{ width: "100%" }}
              >
                <View
                  style={[
                    {
                      width: "100%",
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderRadius: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: selected ? "rgba(255,255,255,0.05)" : "transparent",
                      borderWidth: 1,
                      borderColor: selected ? restriction.color : "rgba(255,255,255,0.1)",
                    },
                    selected && {
                      shadowColor: restriction.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    },
                  ]}
                >
                  {/* Icône et texte */}
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: selected ? restriction.color : "rgba(255,255,255,0.1)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                      }}
                    >
                      <Ionicons 
                        name={restriction.icon as any} 
                        size={20} 
                        color={selected ? "#000" : "rgba(255,255,255,0.7)"} 
                      />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: selected ? "700" : "600", 
                        color: selected ? "#fff" : "rgba(255,255,255,0.9)",
                        marginBottom: 4
                      }}>
                        {restriction.title}
                      </Text>
                      <Text style={{ 
                        fontSize: 13, 
                        color: selected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)" 
                      }}>
                        {restriction.description}
                      </Text>
                    </View>
                  </View>

                  {/* Checkmark */}
                  {selected && (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: restriction.color,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="checkmark" size={16} color="#000" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Bouton */}
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
