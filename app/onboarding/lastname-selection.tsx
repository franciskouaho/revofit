import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LastnameSelectionScreen() {
  const [lastName, setLastName] = useState("");

  const goBack = () => router.back();
  const goNext = () => {
    if (lastName.trim()) {
      router.push("/onboarding/gender-selection");
    }
  };

  const isValid = lastName.trim();

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

          {/* Espace vide à droite pour équilibrer */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* contenu */}
      <View style={{ flex: 1, paddingHorizontal: 22 }}>
        {/* titre */}
        <View style={{ alignItems: "center", marginTop: 60, marginBottom: 40 }}>
          <Text style={{ fontSize: 26, fontWeight: "900", color: "#FFFFFF", textAlign: "center" }}>
            Quel est votre nom de famille ?
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
            Votre nom de famille nous aide à{"\n"}personnaliser votre expérience RevoFit.
          </Text>
        </View>

        {/* input nom de famille */}
        <View style={{ marginBottom: 40 }}>
          <View style={{
            backgroundColor: "#1A1A1A",
            borderRadius: 16,
            borderWidth: 2,
            borderColor: lastName.trim() ? "#FFD700" : "#2A2A2A",
            paddingHorizontal: 20,
            paddingVertical: 18,
          }}>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Votre nom de famille"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "600",
              }}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* icône utilisateur décorative */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "rgba(255,215,0,0.1)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: "rgba(255,215,0,0.3)",
          }}>
            <Ionicons name="person" size={36} color="#FFD700" />
          </View>
        </View>
      </View>

      {/* bouton */}
      <SafeAreaView>
        <View style={{ paddingHorizontal: 22, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={goNext}
            disabled={!isValid}
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: isValid ? "#FFD700" : "#2A2A2A",
              alignItems: "center",
              justifyContent: "center",
              opacity: isValid ? 1 : 0.5,
            }}
          >
            <Text style={{ 
              color: isValid ? "#000" : "#666", 
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