// components/LoginDrawer.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Modal,
    PanResponder,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_H } = Dimensions.get("window");
const SURFACE = "rgba(0,0,0,0.95)"; // fond glass très noir
const BORDER = "rgba(255,255,255,0.12)";

/* --- Bouton “glass” réutilisable qui ne bloque pas les touches --- */
const GlassButton = ({
  onPress,
  children,
  bg = SURFACE,
  radius = 28,
  height = 56,
}: {
  onPress: () => void;
  children: React.ReactNode;
  bg?: string;
  radius?: number;
  height?: number | string;
}) => {
  return (
    <View style={{ borderRadius: radius, overflow: "hidden" }}>
      <BlurView intensity={18} tint="dark" style={{}}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={{
            height,
            borderRadius: radius,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bg,
            flexDirection: "row",
          }}
        >
          {children}
        </TouchableOpacity>
      </BlurView>
      {/* ⚠️ Très important: ne pas capter les events */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius, borderWidth: 1, borderColor: BORDER },
        ]}
      />
    </View>
  );
};

export interface LoginDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const LoginDrawer: React.FC<LoginDrawerProps> = ({ visible, onClose }) => {
  const slideY = useRef(new Animated.Value(SCREEN_H)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const handlePulse = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, tension: 110, friction: 12, useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(handlePulse, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(handlePulse, { toValue: 0, duration: 900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          ])
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, { toValue: SCREEN_H, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  // Swipe-to-dismiss
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) dragY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 0.9) {
          Animated.timing(slideY, { toValue: SCREEN_H, duration: 220, useNativeDriver: true }).start(onClose);
        } else {
          Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const translateY = Animated.add(slideY, dragY);

  const onApple = () => {
    onClose();
    router.replace("/");
  };
  const onGoogle = () => {
    onClose();
    router.replace("/(tabs)");
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop flouté + clic pour fermer */}
      <Animated.View style={{ flex: 1, opacity: backdrop }}>
        <BlurView intensity={Platform.OS === "ios" ? 30 : 20} tint="dark" style={{ flex: 1 }} />
        <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, transform: [{ translateY }] }}
      >
        <View style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" }}>
          {/* Fond glass noir */}
          <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
          <View
            pointerEvents="none"
            style={{
              ...StyleSheet.absoluteFillObject,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              backgroundColor: SURFACE,
              borderWidth: 1,
              borderColor: BORDER,
            }}
          />
          {/* Gradient subtil sur toute la surface (ne pas capter les events) */}
          <LinearGradient
            pointerEvents="none"
            colors={["#2a2a0033", "#00000000", "#2a2a0033"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Glow supérieur */}
          <LinearGradient
            pointerEvents="none"
            colors={["#FFD70022", "transparent"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ height: 10 }}
          />

          <View style={{ paddingBottom: insets.bottom + 18 }}>
            {/* Titre (plaque glass) */}
            <View style={{ marginHorizontal: 16, marginTop: 14, borderRadius: 18, overflow: "hidden" }}>
              <BlurView intensity={20} tint="dark" style={{ padding: 16 }}>
                <Animated.View
                  style={{
                    alignSelf: "center",
                    width: 44,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "rgba(255,255,255,0.35)",
                    transform: [
                      {
                        scaleX: handlePulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] }),
                      },
                    ],
                  }}
                />
                <View style={{ alignItems: "center", marginTop: 14, marginBottom: 8 }}>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 4 }}>Se connecter</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
                    Accède à ta progression et sauvegarde tes entraînements
                  </Text>
                </View>
              </BlurView>
              <View
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, { borderRadius: 18, borderWidth: 1, borderColor: BORDER }]}
              />
            </View>

            {/* Boutons */}
            <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 12 }}>
              {/* Apple (plein blanc) */}
              <TouchableOpacity
                onPress={onApple}
                activeOpacity={0.9}
                style={{
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="logo-apple" size={22} color="#000" style={{ marginRight: 10 }} />
                <Text style={{ color: "#000", fontSize: 16, fontWeight: "700" }}>Continuer avec Apple</Text>
              </TouchableOpacity>

              {/* Google (glass noir) */}
              <GlassButton onPress={onGoogle}>
                <Ionicons name="logo-google" size={20} color="#4285F4" style={{ marginRight: 10 }} />
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Continuer avec Google</Text>
              </GlassButton>
            </View>

            {/* Mentions */}
            <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", fontSize: 12 }}>
                En continuant, tu acceptes nos{" "}
                <Text style={{ color: "#FFD700", fontWeight: "700" }}>Conditions d&apos;utilisation</Text> et notre{" "}
                <Text style={{ color: "#FFD700", fontWeight: "700" }}>Politique de confidentialité</Text>.
              </Text>
            </View>

            {/* Close */}
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              style={{
                alignSelf: "center",
                marginTop: 16,
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: SURFACE,
                borderWidth: 1,
                borderColor: BORDER,
                marginBottom: 18,
              }}
            >
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default LoginDrawer;
