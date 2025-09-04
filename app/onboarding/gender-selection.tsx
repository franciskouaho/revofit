import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";

type G = "homme" | "femme" | "autre";

export default function GenderSelectionScreen() {
  const [selected, setSelected] = useState<G | null>(null);
  const { nextStep } = useOnboarding();

  const handleSelect = (g: G) => {
    setSelected(g);
  };
  const handleBack = () => router.back();

  const handleNext = () => {
    if (selected) {
      nextStep({ gender: selected });
      router.push('/onboarding/age-selection');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      {/* Fond thème Revo : noir + halos olive */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Vagues latérales décoratives */}
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
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
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
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        {/* Titre */}
        <View style={{ alignItems: 'center', marginBottom: 36 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#FF8C00', marginBottom: 8, letterSpacing: -0.5 }}>
            Parlez-nous de vous !
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14.5, lineHeight: 24, textAlign: 'center' }}>
            Pour vous donner une meilleure expérience,{"\n"}nous devons connaître votre genre.
          </Text>
        </View>

        {/* Pilule centrale */}
        <View style={{ alignSelf: 'center', width: '78%', maxWidth: 225, borderRadius: 100, shadowColor: 'black', shadowOpacity: 0.6, shadowRadius: 24, shadowOffset: { width: 0, height: 14 }, elevation: 16 }}>
          <LinearGradient
            colors={["rgba(255,255,255,0.04)", "rgba(0,0,0,0.2)", "rgba(255,255,255,0.03)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ borderRadius: 200, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 16, paddingVertical: 20, alignItems: 'center' }}
          >
            {/* Homme */}
            <TouchableOpacity
              onPress={() => handleSelect("homme")}
              activeOpacity={0.9}
              style={[
                { width: 192, height: 192, borderRadius: 96, alignItems: 'center', justifyContent: 'center', borderWidth: 2, backgroundColor: '#2A2A2A' },
                selected === "homme" ? { borderColor: '#FFD700', transform: [{ scale: 1.05 }] } : { borderColor: 'transparent' }
              ]}
            >
              {selected === "homme" && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 96, backgroundColor: 'rgba(255,215,0,0.2)' }} />
              )}
              <Ionicons name="male" size={56} color="#fff" />
              <Text style={[{ marginTop: 8, fontSize: 18, fontWeight: 'bold' }, selected === "homme" ? { color: '#FFD700' } : { color: 'white' }]}>
                Homme
              </Text>
            </TouchableOpacity>

            {/* Spacer */}
            <View style={{ height: 20 }} />

            {/* Femme */}
            <TouchableOpacity
              onPress={() => handleSelect("femme")}
              activeOpacity={0.9}
              style={[
                { width: 192, height: 192, borderRadius: 96, alignItems: 'center', justifyContent: 'center', borderWidth: 2, backgroundColor: '#121418' },
                selected === "femme" ? { borderColor: '#FFD700', transform: [{ scale: 1.05 }] } : { borderColor: 'transparent' }
              ]}
            >
              {selected === "femme" && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 96, backgroundColor: 'rgba(255,215,0,0.2)' }} />
              )}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 96, backgroundColor: 'rgba(0,0,0,0.35)' }} />
              <Ionicons name="female" size={56} color="#fff" />
              <Text style={[{ marginTop: 8, fontSize: 18, fontWeight: 'bold' }, selected === "femme" ? { color: '#FFD700' } : { color: 'white' }]}>
                Femme
              </Text>
            </TouchableOpacity>

            {/* Spacer */}
            <View style={{ height: 20 }} />

            {/* Autre */}
            <TouchableOpacity
              onPress={() => handleSelect("autre")}
              activeOpacity={0.9}
              style={[
                { width: 192, height: 192, borderRadius: 96, alignItems: 'center', justifyContent: 'center', borderWidth: 2, backgroundColor: '#121418' },
                selected === "autre" ? { borderColor: '#FFD700', transform: [{ scale: 1.05 }] } : { borderColor: 'transparent' }
              ]}
            >
              {selected === "autre" && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 96, backgroundColor: 'rgba(255,215,0,0.2)' }} />
              )}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 96, backgroundColor: 'rgba(0,0,0,0.35)' }} />
              <Ionicons name="person" size={56} color="#fff" />
              <Text style={[{ marginTop: 8, fontSize: 18, fontWeight: 'bold' }, selected === "autre" ? { color: '#FFD700' } : { color: 'white' }]}>
                Autre
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

      {/* bouton */}
      <SafeAreaView>
        <View style={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={handleNext}
            disabled={!selected}
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: selected ? "#FFD700" : "#2A2A2A",
              alignItems: "center",
              justifyContent: "center",
              opacity: selected ? 1 : 0.5,
            }}
          >
            <Text style={{ 
              color: selected ? "#000" : "#666", 
              fontSize: 18, 
              fontWeight: "800" 
            }}>
              Suivant
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      </View>
    </View>
  );
}

/* ------- décor : vagues latérales -------- */
function SideWaves({ side }: { side: "left" | "right" }) {
  const rows = useMemo(() => Array.from({ length: 8 }), []);
  return (
    <View style={[
      { position: 'absolute', top: 0, bottom: 0, width: 80, justifyContent: 'center' },
      side === "left" ? { left: 0 } : { right: 0 }
    ]}>
      {rows.map((_, i) => (
        <View
          key={i}
          style={{ 
            position: 'absolute', 
            width: 64, 
            height: 24, 
            borderRadius: 12, 
            borderWidth: 1, 
            borderColor: 'rgba(255,255,255,0.15)',
            top: 120 + i * 36, 
            opacity: 0.08 + i * 0.01 
          }}
        />
      ))}
    </View>
  );
}