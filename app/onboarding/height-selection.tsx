import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  }, [cmValue, minCm]);

  // snap
  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const raw = Math.round(y / TICK_H);
    const clamped = Math.max(0, Math.min(raw, maxCm - minCm));
    const cmSel = minCm + clamped;
    if (cmSel !== cmValue) setCmValue(cmSel);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: clamped * TICK_H, animated: true });
    });
  };

  const goBack = () => router.back();
  const goNext = () => {
    nextStep({ height: cmValue });
    router.push("/onboarding/weight-selection");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* fond */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* header */}
      <SafeAreaView>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8 }}>
          <TouchableOpacity
            onPress={goBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#1F1F1F",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
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

      {/* contenu */}
      <View style={{ flex: 1, paddingHorizontal: 22 }}>
        {/* titre */}
        <View style={{ alignItems: "center", marginTop: 0, marginBottom: 18 }}>
          <Text style={{ fontSize: 26, fontWeight: "900", color: "#FFFFFF", textAlign: "center" }}>
            Quelle est votre taille ?
          </Text>
          <Text
            style={{
              marginTop: 10,
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              fontSize: 14.5,
              lineHeight: 22,
              maxWidth: 340,
            }}
          >
            La taille aide à personnaliser vos entraînements et{"\n"}suivre précisément vos progrès fitness.
          </Text>
        </View>

        {/* segmented */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 14 }}>
          <View style={{ flexDirection: "row", backgroundColor: "#232323", borderRadius: 24, padding: 4, width: 180 }}>
            <TouchableOpacity
              onPress={() => setUnit("cm")}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: unit === "cm" ? "#FFD700" : "transparent",
              }}
            >
              <Text style={{ color: unit === "cm" ? "#000" : "#fff", fontWeight: "700" }}>cm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUnit("ft")}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: unit === "ft" ? "#FFD700" : "transparent",
              }}
            >
              <Text style={{ color: unit === "ft" ? "#000" : "#fff", fontWeight: "700" }}>ft</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* valeur + règle */}
        <View style={{ flex: 1, flexDirection: "row", marginBottom: 60}}>
          {/* valeur */}
          <View style={{ flex: 1, justifyContent: "center" }}>
            {unit === "cm" ? (
              <Text style={{ fontSize: 46, fontWeight: "900", color: "#FFFFFF" }}>
                {cmValue} <Text style={{ fontSize: 22, fontWeight: "700" }}>cm</Text>
              </Text>
            ) : (
              <Text style={{ fontSize: 46, fontWeight: "900", color: "#FFFFFF" }}>
                {feet} <Text style={{ fontSize: 22, fontWeight: "700" }}>ft</Text>{" "}
                {inch} <Text style={{ fontSize: 22, fontWeight: "700" }}>in</Text>
              </Text>
            )}
            <View style={{ height: 2, width: 100, backgroundColor: "#FFD700", marginTop: 10 }} />
          </View>

          {/* règle cm */}
          <View style={{ width: 80, alignItems: "flex-end", justifyContent: "center", marginRight: -22 }}>
            <View style={{ width: 60, height: RULER_HEIGHT, backgroundColor: "#1b1b1b", borderRadius: 8, overflow: "hidden" }}>
              <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={TICK_H}
                decelerationRate="fast"
                onMomentumScrollEnd={onMomentumEnd}
                contentContainerStyle={{ paddingVertical: CENTER_OFFSET }}
              >
                {ticksCm.map((cm) => {
                  const isMajor = cm % 10 === 0;
                  const isMid = cm % 5 === 0;
                  const length = isMajor ? 40 : isMid ? 28 : 18;
                  return (
                    <View key={cm} style={{ height: TICK_H, justifyContent: "center" }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {isMajor && (
                          <Text style={{ marginRight: 8, color: "#fff", fontSize: 12, fontWeight: "600" }}>{cm}</Text>
                        )}
                        <View style={{ width: length, height: 1.5, backgroundColor: "#fff" }} />
                      </View>
                    </View>
                  );
                })}
              </ScrollView>

              {/* ligne blanche centrale */}
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: CENTER_OFFSET - 1,
                  height: 2,
                  backgroundColor: "#FFFFFF",
                  opacity: 0.8,
                }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* bouton */}
      <SafeAreaView>
        <View style={{ paddingHorizontal: 22, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={goNext}
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: "#FFD700",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#000", fontSize: 18, fontWeight: "800" }}>Suivant</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
