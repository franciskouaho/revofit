// app/(onboarding)/activity-level-selection.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";

type ActivityLevel = {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  color: string;
  icon: string;
};

export default function ActivityLevelSelectionScreen() {
  const [activityLevels, setActivityLevels] = useState<ActivityLevel[]>([
    { 
      id: "sedentary", 
      title: "Sédentaire", 
      description: "Peu ou pas d'exercice", 
      selected: false, 
      color: "#6B7280",
      icon: "bed"
    },
    { 
      id: "light", 
      title: "Léger", 
      description: "1-3 jours/semaine", 
      selected: false, 
      color: "#4ECDC4",
      icon: "walk"
    },
    { 
      id: "moderate", 
      title: "Modéré", 
      description: "3-5 jours/semaine", 
      selected: false, 
      color: "#FFD700",
      icon: "fitness"
    },
    { 
      id: "active", 
      title: "Actif", 
      description: "6-7 jours/semaine", 
      selected: false, 
      color: "#4CAF50",
      icon: "barbell"
    },
    { 
      id: "very-active", 
      title: "Très actif", 
      description: "Exercice intense quotidien", 
      selected: false, 
      color: "#FF6B6B",
      icon: "flash"
    },
  ]);

  const { nextStep } = useOnboarding();

  const toggle = (id: string) => {
    setActivityLevels((prev) => 
      prev.map(level => ({
        ...level,
        selected: level.id === id ? !level.selected : false // Un seul sélectionné à la fois
      }))
    );
  };

  const handleNext = () => {
    const selectedLevel = activityLevels.find(level => level.selected);
    if (selectedLevel) {
      nextStep({ activityLevel: selectedLevel.id });
      router.push('/onboarding/dietary-restrictions-selection');
    }
  };

  const handleBack = () => router.back();

  const selectedCount = activityLevels.filter(level => level.selected).length;

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
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
        {/* Titre */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#FF8C00", marginBottom: 10 }}>
            Quel est votre niveau d'activité ?
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14.5, lineHeight: 22, textAlign: "center" }}>
            Cela nous aide à calculer vos besoins{"\n"}nutritionnels personnalisés.
          </Text>
        </View>

        {/* Liste des niveaux d'activité */}
        <View style={{ gap: 12 }}>
          {activityLevels.map((level) => {
            const selected = level.selected;
            return (
              <TouchableOpacity 
                key={level.id} 
                onPress={() => toggle(level.id)} 
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
                      borderColor: selected ? level.color : "rgba(255,255,255,0.1)",
                    },
                    selected && {
                      shadowColor: level.color,
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
                        backgroundColor: selected ? level.color : "rgba(255,255,255,0.1)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                      }}
                    >
                      <Ionicons 
                        name={level.icon as any} 
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
                        {level.title}
                      </Text>
                      <Text style={{ 
                        fontSize: 13, 
                        color: selected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)" 
                      }}>
                        {level.description}
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
                        backgroundColor: level.color,
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
            disabled={selectedCount === 0}
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: selectedCount > 0 ? "#FFD700" : "#2A2A2A",
              alignItems: "center",
              justifyContent: "center",
              opacity: selectedCount > 0 ? 1 : 0.5,
            }}
          >
            <Text style={{ 
              color: selectedCount > 0 ? "#000" : "#666", 
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
