import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";

export default function PasswordSelectionScreen() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { nextStep } = useOnboarding();

  const goBack = () => router.back();
  const goNext = () => {
    if (password.length >= 6) {
      nextStep({ password: password });
      router.push("/onboarding/notifications-permission");
    }
  };

  const isValidPassword = password.length >= 6;

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 50}
    >
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
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
          </View>

          {/* Espace vide à droite pour équilibrer */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* contenu */}
      <View style={{ flex: 1, paddingHorizontal: 22 }}>
        {/* titre */}
        <View style={{ alignItems: "center", marginTop: 60, marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "900",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Créez votre mot de passe
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
            Choisissez un mot de passe sécurisé pour{"\n"}protéger votre compte RevoFit.
          </Text>
        </View>

        {/* input mot de passe */}
        <View style={{ marginBottom: 40 }}>
          <View
            style={{
              backgroundColor: "#1A1A1A",
              borderRadius: 16,
              borderWidth: 2,
              borderColor: isValidPassword ? "#FFD700" : "#2A2A2A",
              paddingHorizontal: 20,
              paddingVertical: 18,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Votre mot de passe"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "600",
                flex: 1,
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={goNext}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ padding: 8 }}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="rgba(255,255,255,0.6)"
              />
            </TouchableOpacity>
          </View>

          {/* Indicateur de force du mot de passe */}
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 4 }}>
              Force du mot de passe
            </Text>
            <View style={{ flexDirection: "row", gap: 4 }}>
              {[1, 2, 3, 4].map((level) => (
                <View
                  key={level}
                  style={{
                    flex: 1,
                    height: 4,
                    backgroundColor: password.length >= level * 2 ? "#FFD700" : "#2A2A2A",
                    borderRadius: 2,
                  }}
                />
              ))}
            </View>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>
              {password.length < 6 ? "Au moins 6 caractères requis" : "Mot de passe valide"}
            </Text>
          </View>
        </View>

        {/* icône cadenas décorative */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 100,
            marginTop: 80,
            zIndex: 1,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "rgba(255,215,0,0.1)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "rgba(255,215,0,0.3)",
            }}
          >
            <Ionicons name="lock-closed" size={36} color="#FFD700" />
          </View>
        </View>
      </View>

      {/* bouton */}
      <SafeAreaView style={{ zIndex: 10 }}>
        <View style={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={goNext}
            disabled={!isValidPassword}
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: isValidPassword ? "#FFD700" : "#2A2A2A",
              alignItems: "center",
              justifyContent: "center",
              opacity: isValidPassword ? 1 : 0.5,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ 
              color: isValidPassword ? "#000" : "#666", 
              fontSize: 18, 
              fontWeight: "800" 
            }}>
              Suivant
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}