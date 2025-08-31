// app/workout/active.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(255,255,255,0.07)";
const LIME = "#D8FF49";
const LIME_DARK = "#C3F02F";

export default function WorkoutActiveScreen() {
  const insets = useSafeAreaInsets();

  const TOTAL = 45;
  const [time, setTime] = useState(TOTAL);
  const [isPlaying, setIsPlaying] = useState(false);
  const [weight, setWeight] = useState(40);

  const progress = 1 - time / TOTAL;
  const progAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(progAnim, {
      toValue: progress,
      duration: 240,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    let int: ReturnType<typeof setInterval> | null = null;
    if (isPlaying && time > 0) int = setInterval(() => setTime(t => Math.max(0, t - 1)), 1000);
    return () => int && clearInterval(int);
  }, [isPlaying, time]);

  useEffect(() => { if (time === 0) setIsPlaying(false); }, [time]);

  const togglePlayPause = () => setIsPlaying(v => !v);
  const formatTime = (sec: number) => `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;

  const ring = useMemo(() => {
    const size = 60, stroke = 6, r = (size - stroke) / 2, c = 2 * Math.PI * r;
    return { size, stroke, r, c };
  }, []);
  const dash = progAnim.interpolate({ inputRange: [0, 1], outputRange: [0, ring.c] });
  const AnimatedCircle: any = Animated.createAnimatedComponent(Circle);

  return (
    <View style={styles.container}>
      {/* Fond */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.15, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Badge flottant corrigé (au-dessus de tout) */}
      <View pointerEvents="box-none" style={styles.floatingTop}>
        <View style={[styles.nextBadge, { top: insets.top + 8 }]}>
          <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.border]} />
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=240&h=240&fit=crop" }}
            style={styles.nextImg}
          />
          <Text style={styles.nextTxt}>Next exercise</Text>
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.roundIcon}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Image principale */}
        <View style={[styles.heroWrap, { marginTop: -insets.top }]}>
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&h=1200&fit=crop" }}
            style={styles.hero}
          />
          {/* Filtre noir pour améliorer la visibilité */}
          <View style={styles.imageOverlay} />
        </View>

        {/* Panneau bas en glass */}
        <View style={styles.sheet}>
          <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.border, { borderTopLeftRadius: 28, borderTopRightRadius: 28 }]} />

          {/* Icônes */}
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.ghostBtn}><Ionicons name="list-outline" size={20} color="#ffffffcc" /></TouchableOpacity>
            <TouchableOpacity
              style={styles.ghostBtn}
              onPress={() => { setIsPlaying(false); setTime(TOTAL); }}
            >
              <Ionicons name="refresh-outline" size={20} color="#ffffffcc" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayPause} style={styles.playWrap} activeOpacity={0.9}>
              <LinearGradient colors={[LIME, LIME_DARK]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.playBg} />
              <Svg width={ring.size} height={ring.size} viewBox={`0 0 ${ring.size} ${ring.size}`} style={styles.playRing}>
                <Circle cx={ring.size/2} cy={ring.size/2} r={ring.r} stroke="rgba(0,0,0,0.25)" strokeWidth={ring.stroke} fill="none" />
                <AnimatedCircle
                  cx={ring.size/2}
                  cy={ring.size/2}
                  r={ring.r}
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth={ring.stroke}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${ring.c} ${ring.c}`}
                  strokeDashoffset={Animated.multiply(dash, -1)}
                  transform={`rotate(-90 ${ring.size/2} ${ring.size/2})`}
                />
              </Svg>
              <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.ghostBtn}><Ionicons name="volume-mute-outline" size={20} color="#ffffffcc" /></TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn}><Ionicons name="heart-outline" size={20} color="#ffffffcc" /></TouchableOpacity>
          </View>

          {/* Round / segments / temps */}
          <View style={styles.roundRow}>
            <Text style={styles.roundTxt}>Round 1</Text>
            <View style={styles.segmentsWrap}>
              {new Array(10).fill(0).map((_, i) => {
                const pct = (i + 1) / 10;
                const active = progress >= pct;
                return <View key={i} style={[styles.segment, active ? { backgroundColor: LIME } : { backgroundColor: "rgba(255,255,255,0.12)" }]} />;
              })}
            </View>
            <Text style={styles.timeTxt}>{formatTime(time)}</Text>
          </View>

          {/* Completed */}
          <View style={{ marginTop: 14 }}>
            <Text style={styles.caption}>Completed</Text>
            <View style={styles.thinBar}>
              <Animated.View
                style={[
                  styles.thinFill,
                  { width: progAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) },
                ]}
              />
            </View>
            <Text style={styles.percent}>{Math.max(1, Math.round(progress * 100))}%</Text>
          </View>

          {/* Poids */}
          <View style={styles.weightRow}>
            <Text style={styles.weightLabel}>Additional weight</Text>
            <View style={styles.weightCtrls}>
              <TouchableOpacity style={styles.weightGhost} onPress={() => setWeight(w => Math.max(0, w - 2.5))}>
                <Text style={styles.weightGhostTxt}>–</Text>
              </TouchableOpacity>
              <Text style={styles.weightValue}>{weight} kg</Text>
              <TouchableOpacity style={styles.weightGhost} onPress={() => setWeight(w => w + 2.5)}>
                <Text style={styles.weightGhostTxt}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Prev / Next */}
          <View style={styles.navRow}>
            <TouchableOpacity style={[styles.pillBtn, styles.pillGhost]}>
              <Text style={styles.pillGhostTxt}>Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pillBtn, styles.pillPrimary]} activeOpacity={0.9}>
              <LinearGradient colors={[LIME, LIME_DARK]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={styles.pillPrimaryTxt}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },

  /* Badge flottant */
  floatingTop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,            // >>> au-dessus de l’image
    alignItems: "flex-end",
    paddingRight: 16,
  },
  nextBadge: {
    position: "absolute",
    right: 0,
    width: 92,
    height: 92,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  border: { borderWidth: 1, borderColor: BORDER, borderRadius: 999 },
  nextImg: { position: "absolute", width: "100%", height: "100%" },
  nextTxt: {
    position: "absolute",
    bottom: 6,
    color: "#fff",
    fontSize: 11,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 4,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 20,           // au-dessus du héros
  },
  roundIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER,
  },

  heroWrap: { flex: 1 },
  hero: { flex: 1 },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  sheet: {
    marginTop: -18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 26,
  },

  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  ghostBtn: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER,
  },
  playWrap: {
    width: 92, height: 92, borderRadius: 46,
    alignItems: "center", justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
  },
  playBg: { ...StyleSheet.absoluteFillObject },
  playRing: { position: "absolute" },

  roundRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  roundTxt: { width: 90, color: "#fff", fontWeight: "700" },
  segmentsWrap: { flex: 1, flexDirection: "row", gap: 6, paddingHorizontal: 6 },
  segment: { flex: 1, height: 6, borderRadius: 3 },
  timeTxt: { width: 70, textAlign: "right", color: "#fff", fontWeight: "700" },

  caption: { color: "rgba(255,255,255,0.85)", marginTop: 8, marginBottom: 6 },
  thinBar: { height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden" },
  thinFill: { height: "100%", backgroundColor: LIME },
  percent: { color: "rgba(255,255,255,0.75)", marginTop: 6 },

  weightRow: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  weightLabel: { color: "rgba(255,255,255,0.9)" },
  weightCtrls: { flexDirection: "row", alignItems: "center", gap: 12 },
  weightGhost: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: BORDER, backgroundColor: SURFACE,
  },
  weightGhostTxt: { color: "#fff", fontSize: 20, fontWeight: "900" },
  weightValue: { color: "#fff", fontSize: 18, fontWeight: "800", minWidth: 80, textAlign: "center" },

  navRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  pillBtn: {
    flex: 1,
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
  },
  pillGhost: { backgroundColor: "transparent" },
  pillGhostTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
  pillPrimary: { flex: 1.4 },
  pillPrimaryTxt: { color: "#071100", fontWeight: "900", fontSize: 16 },
});
