// components/TemplateDrawer.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ExerciseSelector from "./ExerciseSelector";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(0,0,0,0.55)";
const LIME = "#D8FF49";
const LIME_DARK = "#C3F02F";

interface TemplateDrawerProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (type: string) => void;
}

export default function TemplateDrawer({
  visible,
  onClose,
  onGenerate,
}: TemplateDrawerProps) {
  const [templateTitle, setTemplateTitle] = useState("Template d'entraînement");
  const [description, setDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  const titleLimit = 60;
  const descLimit = 240;
  const titleLen = templateTitle.trim().length;
  const descLen = description.trim().length;

  // Animations drawer
  const slideY = useRef(new Animated.Value(300)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 140, friction: 14 }),
        Animated.timing(backdrop, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, { toValue: 300, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  // Swipe-to-dismiss
  const dragY = useRef(new Animated.Value(0)).current;
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => g.dy > 0 && dragY.setValue(g.dy),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 0.9) {
          Animated.parallel([
            Animated.timing(slideY, { toValue: 300, duration: 180, useNativeDriver: true }),
            Animated.timing(backdrop, { toValue: 0, duration: 160, useNativeDriver: true }),
          ]).start(onClose);
        } else {
          Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;
  const translateY = Animated.add(slideY, dragY);

  const canCreate = useMemo(() => titleLen > 0, [titleLen]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop gradient + clic pour fermer */}
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
        <LinearGradient
          colors={["#000000e6", "#000000cc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        {...pan.panHandlers}
        style={[styles.drawerWrap, { transform: [{ translateY }] }]}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.drawer}>
            {/* Glass + border */}
            <BlurView intensity={Platform.OS === "ios" ? 28 : 20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, styles.border]} />

            {/* Glow top */}
            <LinearGradient
              colors={["#2a2a0033", "transparent"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ height: 10 }}
            />

            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Nouveau template</Text>
              <Text style={styles.subtitle}>Crée un modèle d’entraînement réutilisable.</Text>
            </View>

            {/* Promo */}
            <View style={styles.promo}>
              <LinearGradient
                colors={["#12160a", "#0b0b0b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={[StyleSheet.absoluteFill, styles.promoBorder]} />
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.promoTitle}>Templates illimités avec RevoFit Pro</Text>
                <Text style={styles.promoSub}>Les comptes gratuits ont accès à 2 templates.</Text>
              </View>
              <View style={styles.pill}>
                <Ionicons name="chevron-forward" size={14} color="#0b1400" />
              </View>
            </View>

            {/* Title */}
            <View style={styles.section}>
              <Text style={styles.label}>Titre du template</Text>
              <View style={styles.input}>
                <Ionicons name="document-text-outline" size={16} color="#9aa08f" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.inputText}
                  value={templateTitle}
                  onChangeText={(t) => t.length <= titleLimit && setTemplateTitle(t)}
                  placeholder="Template d'entraînement"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
                <Text style={styles.counter}>{titleLen}/{titleLimit}</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <View style={[styles.input, { minHeight: 88, alignItems: "flex-start", paddingVertical: 12 }]}>
                <Ionicons name="menu" size={16} color="#9aa08f" style={{ marginRight: 10, marginTop: 2 }} />
                <TextInput
                  style={[styles.inputText, { lineHeight: 20 }]}
                  value={description}
                  onChangeText={(t) => t.length <= descLimit && setDescription(t)}
                  placeholder="Ajouter une description"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  multiline
                />
                <Text style={styles.counter}>{descLen}/{descLimit}</Text>
              </View>
            </View>

            {/* Journal / sélection d’exos */}
            <View style={styles.section}>
              <Text style={styles.label}>Journal d’entraînement</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.input}
                onPress={() => setShowExerciseSelector(true)}
              >
                <Ionicons name="fitness" size={16} color="#9aa08f" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  {selectedExercises.length > 0 ? (
                    <Text style={styles.inputText}>
                      {selectedExercises.length} exercice{selectedExercises.length > 1 ? "s" : ""} sélectionné{selectedExercises.length > 1 ? "s" : ""}
                    </Text>
                  ) : (
                    <Text style={styles.placeholder}>Ajouter des exercices</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9aa08f" />
              </TouchableOpacity>

              {/* Badges rapides */}
              <View style={styles.badgesRow}>
                <Badge label="Hypertrophie" icon="flash" />
                <Badge label="Full-body" icon="body" />
                <Badge label="Intermédiaire" icon="medal-outline" />
              </View>
            </View>

            {/* Cover (placeholder) */}
            <View style={styles.section}>
              <Text style={styles.label}>Image de couverture</Text>
              <View style={styles.cover}>
                <Ionicons name="image" size={26} color="#9aa08f" />
                <View style={styles.add}>
                  <Ionicons name="add" size={14} color="#0b1400" />
                </View>
              </View>
              <Text style={styles.helper}>Optionnel mais recommandé pour repérer plus vite tes templates.</Text>
            </View>

            {/* CTA */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.cta, !canCreate && { opacity: 0.5 }]}
              disabled={!canCreate}
              onPress={() => {
                onGenerate("template");
                onClose();
              }}
            >
              <LinearGradient colors={[LIME, LIME_DARK]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={styles.ctaTxt}>Créer le template</Text>
            </TouchableOpacity>

            {/* Close button */}
            <TouchableOpacity onPress={onClose} style={styles.close} activeOpacity={0.8}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>

      {/* Exercise selector */}
      <ExerciseSelector
        visible={showExerciseSelector}
        onClose={() => setShowExerciseSelector(false)}
        selectedExercises={selectedExercises}
        onExercisesChange={setSelectedExercises}
      />
    </Modal>
  );
}

/* ---------- Small components ---------- */
function Badge({ label, icon }: { label: string; icon: any }) {
  return (
    <View style={styles.badge}>
      <Ionicons name={icon} size={12} color="#E8FFB3" style={{ marginRight: 6 }} />
      <Text style={styles.badgeTxt}>{label}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
  drawerWrap: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    transform: [{ translateY: 300 }],
  },
  drawer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 8,
    backgroundColor: SURFACE,
  },
  border: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  handle: {
    alignSelf: "center",
    width: 44, height: 4, borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginTop: 10, marginBottom: 12,
  },
  header: { alignItems: "center", marginBottom: 8 },
  title: { color: "#fff", fontSize: 20, fontWeight: "900" },
  subtitle: { color: "rgba(255,255,255,0.7)", marginTop: 6, textAlign: "center" },

  promo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  promoBorder: { borderWidth: 1, borderColor: BORDER, borderRadius: 16 },
  promoTitle: { color: "#E8FFB3", fontWeight: "800", marginBottom: 2, fontSize: 13 },
  promoSub: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  pill: {
    paddingHorizontal: 10, height: 26,
    borderRadius: 13, alignItems: "center", justifyContent: "center",
    backgroundColor: LIME,
  },

  section: { marginTop: 12 },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12, fontWeight: "700", marginBottom: 8,
    textTransform: "uppercase", letterSpacing: 0.3,
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  inputText: { color: "#fff", fontSize: 16, fontWeight: "700", flex: 1 },
  placeholder: { color: "rgba(255,255,255,0.6)", fontSize: 16, flex: 1 },
  counter: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginLeft: 8 },

  badgesRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER,
  },
  badgeTxt: { color: "rgba(255,255,255,0.85)", fontWeight: "800", fontSize: 12 },

  cover: {
    width: 116, height: 116, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER, position: "relative",
  },
  add: {
    position: "absolute", right: 8, bottom: 8,
    width: 22, height: 22, borderRadius: 11,
    alignItems: "center", justifyContent: "center",
    backgroundColor: LIME,
  },
  helper: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 8 },

  cta: {
    marginTop: 18,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTxt: { color: "#071100", fontWeight: "900", fontSize: 16 },

  close: {
    alignSelf: "center",
    marginTop: 12,
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1, borderColor: BORDER,
  },
});
