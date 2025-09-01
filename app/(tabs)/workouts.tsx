// app/(tabs)/workout.tsx
import GenerateDrawer from "@/components/GenerateDrawer";
import TemplateDrawer from "@/components/TemplateDrawer";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

const BORDER = "rgba(255,255,255,0.12)";

/** --------- Menu Modal Component ---------- */
function WorkoutMenuModal({ visible, onClose, onGenerateWorkout }: { visible: boolean; onClose: () => void; onGenerateWorkout: () => void }) {
  const menuOptions = [
    { title: "Start Empty Workout", icon: "person", onPress: () => console.log("Start Empty Workout") },
    { title: "Generate Workout", icon: "star", onPress: onGenerateWorkout },
    { title: "Log Past Workout", icon: "time", onPress: () => console.log("Log Past Workout") },
    { title: "Add Template", icon: "clipboard", onPress: () => console.log("Add Template") },
    { title: "Add Custom Exercise", icon: "fitness", onPress: () => console.log("Add Custom Exercise") },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)" }} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-end", paddingTop: 120, paddingRight: 20 }}>
          <View style={{ 
            borderRadius: 18, 
            minWidth: 280,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.6,
            shadowRadius: 20,
            elevation: 16,
          }}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderRadius: 18 },
              ]}
            />
            <View style={{ padding: 8 }}>
              {menuOptions.map((option, index) => (
                <View key={option.title}>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderRadius: 12,
                    }}
                    onPress={() => {
                      option.onPress();
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                      {option.title}
                    </Text>
                    <Ionicons name={option.icon as any} size={20} color="#fff" />
                  </TouchableOpacity>
                  {index < menuOptions.length - 1 && (
                    <View style={{ 
                      height: 1, 
                      backgroundColor: "rgba(255,255,255,0.08)", 
                      marginHorizontal: 20 
                    }} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

/** --------- Big ring gauge (progress) ---------- */
function BigGauge({
  title,
  percent,
  color = "#4CAF50",
  subtitle = "Recovered",
  muscle = "Abs",
}: {
  title?: string;
  percent: number; // 0..100
  color?: string;
  subtitle?: string;
  muscle?: string;
}) {
  // geometry
  const size = 280;
  const stroke = 24;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = Math.PI * 0.85;
  const endAngle = Math.PI * 2.15; // arc ≈ 260°
  const arcLen = endAngle - startAngle;
  const p = Math.max(0, Math.min(1, percent / 100));
  const currentAngle = startAngle + arcLen * p;

  const polarToCartesian = (ang: number) => ({
    x: cx + r * Math.cos(ang),
    y: cy + r * Math.sin(ang),
  });

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const cur = polarToCartesian(currentAngle);

  const largeArc = arcLen > Math.PI ? 1 : 0;
  const currentLargeArc = arcLen * p > Math.PI ? 1 : 0;

  const basePath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  const progPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${currentLargeArc} 1 ${cur.x} ${cur.y}`;

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* background arc */}
          <Path
            d={basePath}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />
          {/* progress arc (gradient-ish with opacity) */}
          <Path
            d={progPath}
            stroke={color}
            strokeOpacity={0.9}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />
          {/* soft inner ring for depth */}
          <Circle cx={cx} cy={cy} r={r - stroke / 2 - 6} stroke="rgba(255,255,255,0.04)" strokeWidth={2} />
        </Svg>

        {/* center content */}
        <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 4 }}>{muscle}</Text>
          <Text style={{ color: "#fff", fontSize: 48, fontWeight: "900" }}>{Math.round(percent)}%</Text>
          <Text style={{ color: "#4CAF50", fontSize: 16, fontWeight: "700", marginTop: 4 }}>{subtitle}</Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 14 }}>Fresh Muscle Group</Text>
        </View>
      </View>
    </View>
  );
}

/** --------- Tiny helper: glass container --------- */
const Glass = ({ children, style, blur = 18 }: any) => (
  <View style={[{ borderRadius: 18, overflow: "hidden" }, style]}>
    <BlurView intensity={blur} tint="dark" style={StyleSheet.absoluteFill} />
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: "rgba(255,255,255,0.06)", borderColor: BORDER, borderWidth: 1, borderRadius: 18 },
      ]}
    />
    <View style={{ padding: 16 }}>{children}</View>
  </View>
);

/** ------------------- Screen -------------------- */
export default function WorkoutScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [generateDrawerVisible, setGenerateDrawerVisible] = useState(false);
  const [templateDrawerVisible, setTemplateDrawerVisible] = useState(false);

  const handleGenerate = (params: any) => {
    console.log("Generating workout with params:", params);
    // Ici vous pouvez ajouter la logique pour générer l'entraînement
  };

  const handleTemplate = (type: string) => {
    console.log("Creating template:", type);
    // Ici vous pouvez ajouter la logique pour créer le template
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Fond thème Revo */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.18, 0.82, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header glass + titre + bouton + */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          <View style={{ height: 52, borderRadius: 18, overflow: "hidden" }}>
            <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
            <View
              style={[
                StyleSheet.absoluteFill,
              ]}
            />
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, justifyContent: "space-between" }}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900" }}>Workout</Text>
              <TouchableOpacity
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderWidth: 1,
                  borderColor: BORDER,
                }}
                onPress={() => setMenuVisible(true)}
              >
                <Ionicons name="add" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>
          {/* grand gauge section */}
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <LinearGradient
              colors={["rgba(255,255,255,0.03)", "rgba(0,0,0,0.25)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}
            >
              <Text style={{ color: "#fff", fontSize: 32, fontWeight: "900", marginBottom: 8 }}>Workout</Text>
              <BigGauge percent={100} color="#2ECC71" />
              {/* dots (carousel feel) */}
              <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 10, gap: 6 }}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((d, i) => (
                  <View
                    key={i}
                    style={{
                      width: i === 0 ? 10 : 6,
                      height: i === 0 ? 10 : 6,
                      borderRadius: 6,
                      backgroundColor: i === 0 ? "#D1D5DB" : "rgba(255,255,255,0.3)",
                    }}
                  />
                ))}
              </View>
              {/* boutons */}
              <View style={{ flexDirection: "row", gap: 12, marginTop: 18 }}>
                <Glass style={{ flex: 1 }}>
                  <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff", fontWeight: "800" }}>Empty Workout</Text>
                  </TouchableOpacity>
                </Glass>

                <TouchableOpacity 
                  style={{ flex: 1, borderRadius: 18, overflow: "hidden" }}
                  onPress={() => setGenerateDrawerVisible(true)}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#7C4DFF", "#6A3DF5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ padding: 16, alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "800" }}>✦ Generate</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* semaine + cartes infos */}
          <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
            <Glass>
              {/* semaine */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 }}>My Week</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
                  {[
                    { d: "31", l: "SUN", active: true },
                    { d: "1", l: "MON" },
                    { d: "2", l: "TUE" },
                    { d: "3", l: "WED" },
                    { d: "4", l: "THU" },
                    { d: "5", l: "FRI" },
                    { d: "6", l: "SAT" },
                  ].map((it, i) => (
                    <View
                      key={i}
                      style={{
                        width: 64,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 8,
                        paddingVertical: 10,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: it.active ? "rgba(46,204,113,0.8)" : "rgba(255,255,255,0.06)",
                        backgroundColor: it.active ? "rgba(46,204,113,0.12)" : "transparent",
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "900" }}>{it.d}</Text>
                      <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{it.l}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* streak + minutes */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Glass style={{ flex: 1, padding: 0 }}>
                  <View style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="flash" size={18} color="#FFD700" />
                    <View>
                      <Text style={{ color: "#fff", fontWeight: "900" }}>0 Weeks</Text>
                      <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 2 }}>current streak</Text>
                    </View>
                  </View>
                </Glass>
                <Glass style={{ flex: 1, padding: 0 }}>
                  <View style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="time" size={18} color="#FFD700" />
                    <View>
                      <Text style={{ color: "#fff", fontWeight: "900" }}>0 / 100</Text>
                      <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 2 }}>minutes</Text>
                    </View>
                  </View>
                </Glass>
              </View>
            </Glass>
          </View>

          {/* learning phase banner */}
          <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
            <View style={{ borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: BORDER }}>
              <ImageBackground
                source={{ uri: "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=1600&auto=format&fit=crop" }}
                style={{ height: 140, justifyContent: "center" }}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={{ padding: 16 }}>
                  <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900", marginBottom: 4 }}>
                    Learning Phase
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                    It takes up to 5 workouts for Train to learn how you move.
                  </Text>
                </View>              
              </ImageBackground>
            </View>
          </View>

          {/* templates */}
          <View style={{ paddingHorizontal: 20, marginTop: 22 }}>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900", marginBottom: 12 }}>My Templates</Text>
            <Glass>
              <View style={{ alignItems: "center", paddingVertical: 8 }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 8 }}>
                  No Templates Yet
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
                  Your templates will appear here.
                </Text>

                <View style={{ height: 12 }} />

                <TouchableOpacity
                  onPress={() => setTemplateDrawerVisible(true)}
                  activeOpacity={0.9}
                >
                  <View style={{ borderRadius: 24, overflow: "hidden" }}>
                    <LinearGradient
                      colors={["#FFD700", "#E6C200"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ paddingHorizontal: 22, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 8 }}
                    >
                      <Ionicons name="add" size={18} color="#000" />
                      <Text style={{ color: "#000", fontWeight: "900" }}>Create New</Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>
            </Glass>
          </View>
        </ScrollView>
      </SafeAreaView>

      <WorkoutMenuModal 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
        onGenerateWorkout={() => {
          setMenuVisible(false);
          setGenerateDrawerVisible(true);
        }}
      />
      
      {/* Generate Drawer */}
      <GenerateDrawer
        visible={generateDrawerVisible}
        onClose={() => setGenerateDrawerVisible(false)}
        onGenerate={handleGenerate}
      />

      {/* Template Drawer */}
      <TemplateDrawer
        visible={templateDrawerVisible}
        onClose={() => setTemplateDrawerVisible(false)}
        onGenerate={handleTemplate}
      />
    </View>
  );
}
