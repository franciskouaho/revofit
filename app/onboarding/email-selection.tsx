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

export default function EmailSelectionScreen() {
  const [email, setEmail] = useState("");

  const goBack = () => router.back();
  const goNext = () => {
    if (email.trim() && email.includes("@")) {
      router.push("/onboarding/password-selection");
    }
  };

  const isValidEmail = email.trim() && email.includes("@");

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
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
          </View>

          {/* Espace vide à droite pour équilibrer */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* contenu */}
      <View style={{ flex: 1, paddingHorizontal: 22 }}>
        {/* titre */}
        <View style={{ alignItems: "center", marginTop: 60, marginBottom: 40 }}>
          <Text style={{ fontSize: 26, fontWeight: "900", color: "#FFFFFF", textAlign: "center" }}>
            Quel est votre email ?
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
            Nous l&apos;utiliserons pour créer votre compte et{"\n"}vous tenir informé de vos progrès.
          </Text>
        </View>

        {/* input email */}
        <View style={{ marginBottom: 40 }}>
          <View style={{
            backgroundColor: "#1A1A1A",
            borderRadius: 16,
            borderWidth: 2,
            borderColor: isValidEmail ? "#FFD700" : "#2A2A2A",
            paddingHorizontal: 20,
            paddingVertical: 18,
          }}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "600",
              }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>
          
          {email.trim() && !email.includes("@") && (
            <Text style={{
              color: "#FF6B6B",
              fontSize: 14,
              marginTop: 8,
              marginLeft: 4,
            }}>
              Veuillez entrer un email valide
            </Text>
          )}
        </View>

        {/* icône email décorative */}
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
            <Ionicons name="mail" size={36} color="#FFD700" />
          </View>
        </View>
      </View>

      {/* bouton */}
      <SafeAreaView>
        <View style={{ paddingHorizontal: 22, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={goNext}
            disabled={!isValidEmail}
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: isValidEmail ? "#FFD700" : "#2A2A2A",
              alignItems: "center",
              justifyContent: "center",
              opacity: isValidEmail ? 1 : 0.5,
            }}
          >
            <Text style={{ 
              color: isValidEmail ? "#000" : "#666", 
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