import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";

type Unit = "ft" | "cm";

/* --- constantes visuelles --- */
const TICK_H = 16; // distance entre ticks
const RULER_HEIGHT = 520;
const CENTER_OFFSET = RULER_HEIGHT / 2;

export default function HeightInputScreen() {
  const [unit, setUnit] = useState<Unit>("cm"); // 👉 par défaut en cm
  const [cmValue, setCmValue] = useState(170); // 👉 valeur par défaut en cm
  const { nextStep } = useOnboarding();

  // plage de cm
  const minCm = 120;
  const maxCm = 220;

  // conversion
  const inchesTotal = Math.round(cmValue / 2.54);
  const feet = Math.floor(inchesTotal / 12);
  const inch = inchesTotal % 12;

  const scrollRef = useRef<ScrollView>(null);

  // ticks
  const ticksCm = useMemo(() => Array.from({ length: maxCm - minCm + 1 }, (_, i) => minCm + i), []);

  // centrer sur valeur par défaut
  useEffect(() => {
    setTimeout(() => {
      const y = (cmValue - minCm) * TICK_H;
      scrollRef.current?.scrollTo({ y, animated: false });
    }, 0);
  }, []);

  // snap
  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / TICK_H);
    const clamped = Math.max(0, Math.min(idx, ticksCm.length - 1));
    const newCm = ticksCm[clamped];
    if (newCm !== cmValue) setCmValue(newCm);
  };

  const handleNext = () => {
    nextStep({ height: cmValue });
    router.push('/onboarding/weight-selection');
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
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
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
            Quelle est votre taille ?
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14.5, lineHeight: 24, textAlign: 'center' }}>
            Votre taille nous aide à calculer votre IMC{"\n"}et vos objectifs personnalisés.
          </Text>
        </View>

        {/* Sélecteur d'unité */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 20,
            padding: 4,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
          }}>
            <TouchableOpacity
              onPress={() => setUnit('cm')}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 16,
                backgroundColor: unit === 'cm' ? '#FFD700' : 'transparent',
              }}
            >
              <Text style={{
                color: unit === 'cm' ? '#000' : 'rgba(255,255,255,0.7)',
                fontWeight: 'bold',
                fontSize: 14,
              }}>
                CM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUnit('ft')}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 16,
                backgroundColor: unit === 'ft' ? '#FFD700' : 'transparent',
              }}
            >
              <Text style={{
                color: unit === 'ft' ? '#000' : 'rgba(255,255,255,0.7)',
                fontWeight: 'bold',
                fontSize: 14,
              }}>
                FT
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Règle de mesure */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{
            width: 280,
            height: RULER_HEIGHT,
            backgroundColor: 'rgba(0,0,0,0.65)',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
            overflow: 'hidden',
            shadowColor: 'black',
            shadowOpacity: 0.6,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 14 },
            elevation: 16,
          }}>
            {/* Ligne de sélection au centre */}
            <View style={{
              position: 'absolute',
              top: CENTER_OFFSET - 1,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: '#FFD700',
              zIndex: 1,
            }} />

            <ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={TICK_H}
              decelerationRate="fast"
              onMomentumEnd={onMomentumEnd}
              contentContainerStyle={{
                paddingTop: CENTER_OFFSET - TICK_H / 2,
                paddingBottom: CENTER_OFFSET - TICK_H / 2,
              }}
            >
              {ticksCm.map((cm) => {
                const isMajor = cm % 10 === 0;
                const isMinor = cm % 5 === 0;
                
                return (
                  <View key={cm} style={{
                    height: TICK_H,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <View style={{
                      width: isMajor ? 60 : isMinor ? 40 : 20,
                      height: isMajor ? 2 : 1,
                      backgroundColor: cm === cmValue ? '#FFD700' : 'rgba(255,255,255,0.3)',
                      marginLeft: 20,
                    }} />
                    {isMajor && (
                      <Text style={{
                        position: 'absolute',
                        left: 90,
                        color: cm === cmValue ? '#FFD700' : 'rgba(255,255,255,0.6)',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                        {unit === 'cm' ? cm : `${feet}'${inch}"`}
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Affichage de la taille sélectionnée */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 4 }}>
            Taille sélectionnée
          </Text>
          <Text style={{ color: '#FFD700', fontSize: 32, fontWeight: 'bold' }}>
            {unit === 'cm' ? `${cmValue} cm` : `${feet}'${inch}"`}
          </Text>
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