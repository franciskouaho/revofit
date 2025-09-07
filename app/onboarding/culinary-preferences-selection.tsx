// app/(onboarding)/culinary-preferences-selection.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";

type CulinaryPreference = {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  color: string;
  icon: string;
};

export default function CulinaryPreferencesSelectionScreen() {
  const [preferences, setPreferences] = useState<CulinaryPreference[]>([
    { 
      id: "french", 
      title: "Française", 
      description: "Cuisine traditionnelle française", 
      selected: false, 
      color: "#E91E63",
      icon: "flag"
    },
    { 
      id: "italian", 
      title: "Italienne", 
      description: "Pâtes, pizza, risotto...", 
      selected: false, 
      color: "#4CAF50",
      icon: "pizza"
    },
    { 
      id: "asian", 
      title: "Asiatique", 
      description: "Chinoise, japonaise, thaï...", 
      selected: false, 
      color: "#FF9800",
      icon: "restaurant"
    },
    { 
      id: "mediterranean", 
      title: "Méditerranéenne", 
      description: "Huile d'olive, légumes frais...", 
      selected: false, 
      color: "#2196F3",
      icon: "sunny"
    },
    { 
      id: "mexican", 
      title: "Mexicaine", 
      description: "Tacos, burritos, épices...", 
      selected: false, 
      color: "#FF5722",
      icon: "flame"
    },
    { 
      id: "indian", 
      title: "Indienne", 
      description: "Curry, épices, légumineuses...", 
      selected: false, 
      color: "#9C27B0",
      icon: "leaf"
    },
    { 
      id: "middle-eastern", 
      title: "Moyen-Orient", 
      description: "Couscous, falafel, houmous...", 
      selected: false, 
      color: "#FFC107",
      icon: "star"
    },
    { 
      id: "american", 
      title: "Américaine", 
      description: "Burgers, grillades, comfort food...", 
      selected: false, 
      color: "#795548",
      icon: "fast-food"
    },
    { 
      id: "healthy", 
      title: "Healthy", 
      description: "Bowl, smoothies, superfoods...", 
      selected: false, 
      color: "#4CAF50",
      icon: "leaf"
    },
    { 
      id: "fusion", 
      title: "Fusion", 
      description: "Mélange de cuisines du monde", 
      selected: false, 
      color: "#607D8B",
      icon: "globe"
    },
  ]);

  const { nextStep } = useOnboarding();

  const toggle = (id: string) => {
    setPreferences((prev) => 
      prev.map(preference => ({
        ...preference,
        selected: preference.id === id ? !preference.selected : preference.selected
      }))
    );
  };

  const handleNext = () => {
    const selectedPreferences = preferences.filter(p => p.selected);
    nextStep({ culinaryPreferences: selectedPreferences.map(p => p.id) });
    router.push('/onboarding/email-selection');
  };

  const handleBack = () => router.back();

  const selectedCount = preferences.filter(p => p.selected).length;

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
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
        {/* Titre */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#FF8C00", marginBottom: 10 }}>
            Quelles sont vos préférences culinaires ?
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14.5, lineHeight: 22, textAlign: "center" }}>
            Choisissez les cuisines que vous préférez{"\n"}pour des recommandations personnalisées.
          </Text>
        </View>

        {/* Liste des préférences */}
        <View style={{ gap: 12 }}>
          {preferences.map((preference) => {
            const selected = preference.selected;
            return (
              <TouchableOpacity 
                key={preference.id} 
                onPress={() => toggle(preference.id)} 
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
                      borderColor: selected ? preference.color : "rgba(255,255,255,0.1)",
                    },
                    selected && {
                      shadowColor: preference.color,
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
                        backgroundColor: selected ? preference.color : "rgba(255,255,255,0.1)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                      }}
                    >
                      <Ionicons 
                        name={preference.icon as any} 
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
                        {preference.title}
                      </Text>
                      <Text style={{ 
                        fontSize: 13, 
                        color: selected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)" 
                      }}>
                        {preference.description}
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
                        backgroundColor: preference.color,
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
        </View>
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
