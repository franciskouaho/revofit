import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    PanResponder,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RocketLaunchScreen() {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  
  const rocketPosition = useRef(new Animated.Value(0)).current;
  const rocketScale = useRef(new Animated.Value(1)).current;
  const progressBarWidth = useRef(new Animated.Value(0)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPressed && progress < 100) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPressed(false);
            setIsLaunching(true);
            launchRocket();
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isPressed, progress]);

  useEffect(() => {
    Animated.timing(progressBarWidth, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const launchRocket = () => {
    // Animation de la fusée qui décolle
    Animated.parallel([
      Animated.timing(rocketPosition, {
        toValue: -1000,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(rocketScale, {
        toValue: 0.5,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(starsOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Redirection vers la page d'accueil après l'animation
      setTimeout(() => {
        router.push("/(tabs)");
      }, 1000);
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsPressed(true);
      setProgress(0);
    },
    onPanResponderRelease: () => {
      if (progress < 100) {
        setIsPressed(false);
        setProgress(0);
      }
    },
  });

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

      {/* Étoiles animées */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: starsOpacity,
        }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              top: Math.random() * 1000,
              left: Math.random() * 400,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </Animated.View>

      {/* header */}
      <SafeAreaView>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8 }}>
          <View style={{ width: 40 }} />

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
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
          </View>

          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* contenu */}
      <View style={{ flex: 1, paddingHorizontal: 22, justifyContent: "center" }}>
        {/* titre */}
        <View style={{ alignItems: "center", marginBottom: 60 }}>
          <Text style={{ fontSize: 28, fontWeight: "900", color: "#FFFFFF", textAlign: "center", marginBottom: 20 }}>
            {isLaunching ? "🚀 Décollage !" : "Prêt à décoller ?"}
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              fontSize: 16,
              lineHeight: 24,
              maxWidth: 340,
            }}
          >
            {isLaunching 
              ? "Analyse de vos réponses en cours...\nCréation de votre profil personnalisé..."
              : "Gardez le doigt sur la fusée pour lancer la création de votre plan personnalisé !"
            }
          </Text>
        </View>

        {/* Zone de la fusée */}
        <View style={{ alignItems: "center", marginBottom: 60 }}>
          <View
            {...panResponder.panHandlers}
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            {/* Fusée */}
            <Animated.View
              style={{
                transform: [
                  { translateY: rocketPosition },
                  { scale: rocketScale },
                ],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{
                width: 120,
                height: 200,
                alignItems: "center",
                justifyContent: "center",
              }}>
                {/* Corps de la fusée */}
                <View style={{
                  width: 80,
                  height: 160,
                  backgroundColor: "#FFD700",
                  borderRadius: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: "#FFA500",
                }}>
                  <Ionicons name="rocket" size={60} color="#FF6B35" />
                </View>
                
                {/* Flamme */}
                {isPressed && (
                  <View style={{
                    width: 60,
                    height: 80,
                    backgroundColor: "#FF4500",
                    borderRadius: 30,
                    marginTop: -10,
                    opacity: 0.8,
                  }}>
                    <View style={{
                      width: 40,
                      height: 60,
                      backgroundColor: "#FFD700",
                      borderRadius: 20,
                      alignSelf: "center",
                      marginTop: 10,
                    }} />
                  </View>
                )}
              </View>
            </Animated.View>

            {/* Instructions */}
            {!isLaunching && (
              <Text style={{
                color: "#FFD700",
                fontSize: 18,
                fontWeight: "700",
                textAlign: "center",
                marginTop: 20,
              }}>
                {isPressed ? "Continuez d'appuyer !" : "Appuyez et maintenez"}
              </Text>
            )}
          </View>
        </View>



        {/* Pourcentage affiché */}
        {!isLaunching && (
          <View style={{ marginBottom: 40, alignItems: "center" }}>
            <Text style={{
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "600",
            }}>
              {Math.round(progress)}% - {isPressed ? "Préparation du décollage..." : "En attente..."}
            </Text>
          </View>
        )}

        {/* Message de chargement */}
        {isLaunching && (
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 3,
              borderColor: "#FFD700",
              borderTopColor: "transparent",
              marginBottom: 16,
            }}>
              <Animated.View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 20,
                  borderWidth: 3,
                  borderColor: "transparent",
                  borderTopColor: "#FFD700",
                  transform: [{ rotate: "0deg" }],
                }}
              />
            </View>
            <Text style={{
              color: "#FFD700",
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
            }}>
              Création de votre profil en cours...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
} 