// Page de connexion par email et mot de passe
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SURFACE = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.12)";
const GOLD = "#FFD700";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Erreur de connexion", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Background avec le gradient global de l’app */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.2, 0.8, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connexion</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="barbell" size={32} color="#000" />
          </View>
          <Text style={styles.logoText}>RevoFit</Text>
          <Text style={styles.subtitle}>Bon retour parmi nous 👋</Text>
          <Text style={styles.subdesc}>
            Connecte-toi pour accéder à tes entraînements et suivre ta progression.
          </Text>
        </View>

        {/* Email */}
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.glassInput}>
            <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.inputBorder} />
            <TextInput
              style={styles.textInput}
              placeholder="ton@email.com"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Mot de passe</Text>
          <View style={styles.glassInput}>
            <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.inputBorder} />
            <TextInput
              style={styles.textInput}
              placeholder="Ton mot de passe"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="rgba(255,255,255,0.6)"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <LinearGradient
            colors={loading ? ["#777", "#555"] : [GOLD, "#E6C200"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.loginButtonText}>
            {loading ? "Connexion..." : "Se connecter"}
          </Text>
        </TouchableOpacity>

        {/* Forgot password */}
        <TouchableOpacity style={styles.forgotWrapper} onPress={() => Alert.alert("À venir")}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 50 },

  logoSection: { alignItems: "center", marginTop: 40, marginBottom: 50 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: GOLD,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  logoText: { color: "#fff", fontSize: 28, fontWeight: "900", marginBottom: 8 },
  subtitle: { color: "#FFD700", fontSize: 20, fontWeight: "700" },
  subdesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
  },

  inputBlock: { marginBottom: 22 },
  inputLabel: { color: "#fff", fontSize: 15, fontWeight: "600", marginBottom: 6 },
  glassInput: {
    height: 56,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  inputBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 16,
    zIndex: 1,
  },
  eyeButton: { position: "absolute", right: 16, top: 16, zIndex: 2 },

  loginButton: {
    height: 56,
    borderRadius: 18,
    marginTop: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: GOLD,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  loginButtonText: { color: "#000", fontSize: 18, fontWeight: "800", zIndex: 1 },

  forgotWrapper: { alignItems: "center", marginTop: 20 },
  forgotText: { color: GOLD, fontSize: 15, fontWeight: "600" },
});