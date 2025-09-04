import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";
import { useAuth } from "../../contexts/AuthContext";

export default function RocketLaunchScreen() {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const rocketPosition = useRef(new Animated.Value(0)).current;
  const rocketScale = useRef(new Animated.Value(1)).current;
  const progressBarWidth = useRef(new Animated.Value(0)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;

  const { onboardingData } = useOnboarding();
  const { signUp, loading } = useAuth();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Effet pour démarrer l'intervalle quand on appuie
  useEffect(() => {
    if (isPressed && progress < 100) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPressed(false);
            setIsLaunching(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPressed, progress]);

  // Animation de la barre de progression
  useEffect(() => {
    Animated.timing(progressBarWidth, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Animation du lancement
  useEffect(() => {
    if (isLaunching) {
      // Animation des étoiles
      Animated.timing(starsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Animation de la fusée
      Animated.sequence([
        Animated.timing(rocketScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rocketPosition, {
          toValue: -200,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Finaliser l'inscription
        handleCompleteOnboarding();
      });
    }
  }, [isLaunching]);

  const handleCompleteOnboarding = async () => {
    try {
      // Ajouter des valeurs par défaut manquantes
      const completeData = {
        ...onboardingData,
        experienceLevel: onboardingData.experienceLevel || 'débutant',
        weeklyWorkouts: onboardingData.weeklyWorkouts || 3,
        targetWeight: onboardingData.targetWeight || onboardingData.weight
      };

      // Inscription avec Firebase
      await signUp(completeData);
      
      setIsComplete(true);
      
      // Redirection vers l'app principale après un délai
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);
    } catch (error: any) {
      Alert.alert('Erreur d\'inscription', error.message);
      setIsLaunching(false);
      setProgress(0);
      progressBarWidth.setValue(0);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      if (!isLaunching && !isComplete) {
        setIsPressed(true);
      }
    },
    onPanResponderRelease: () => {
      if (!isLaunching && !isComplete) {
        setIsPressed(false);
      }
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      {/* Fond thème Revo */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
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
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* Contenu principal */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          {/* Titre */}
          <View style={{ alignItems: 'center', marginBottom: 60 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFD700', textAlign: 'center', marginBottom: 16 }}>
              {isComplete ? 'Bienvenue sur RevoFit !' : 'Prêt à décoller ?'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
              {isComplete 
                ? 'Votre compte a été créé avec succès !' 
                : 'Maintenez appuyé pour lancer votre aventure fitness'
              }
            </Text>
          </View>

          {/* Zone de la fusée */}
          <View style={{ alignItems: 'center', marginBottom: 60 }}>
            {/* Étoiles animées */}
            <Animated.View style={{
              position: 'absolute',
              opacity: starsOpacity,
              transform: [{ scale: starsOpacity }],
            }}>
              {[...Array(20)].map((_, i) => (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    width: 4,
                    height: 4,
                    backgroundColor: '#FFD700',
                    borderRadius: 2,
                    left: Math.random() * 200 - 100,
                    top: Math.random() * 200 - 100,
                  }}
                />
              ))}
            </Animated.View>

            {/* Fusée */}
            <Animated.View
              style={{
                transform: [
                  { translateY: rocketPosition },
                  { scale: rocketScale }
                ],
              }}
            >
              <View style={{
                width: 80,
                height: 120,
                backgroundColor: '#FFD700',
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 20,
                elevation: 20,
              }}>
                <Ionicons name="rocket" size={40} color="#000" />
              </View>
            </Animated.View>
          </View>

          {/* Barre de progression */}
          {!isComplete && (
            <View style={{ width: '100%', marginBottom: 40 }}>
              <View style={{
                height: 8,
                backgroundColor: '#2A2A2A',
                borderRadius: 4,
                overflow: 'hidden',
              }}>
                <Animated.View style={{
                  height: '100%',
                  width: progressBarWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: '#FFD700',
                  borderRadius: 4,
                }} />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', marginTop: 8 }}>
                {progress}% - {isLaunching ? 'Lancement en cours...' : 'Maintenez appuyé'}
              </Text>
            </View>
          )}

          {/* Zone de pression */}
          {!isComplete && !isLaunching && (
            <View
              {...panResponder.panHandlers}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: 'rgba(255,215,0,0.1)',
                borderWidth: 2,
                borderColor: 'rgba(255,215,0,0.3)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 40,
              }}
            >
              <Text style={{ color: '#FFD700', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                Maintenez appuyé{'\n'}pour lancer
              </Text>
            </View>
          )}

          {/* Message de succès */}
          {isComplete && (
            <View style={{ alignItems: 'center', marginBottom: 40 }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
              </View>
              <Text style={{ color: '#4CAF50', fontSize: 18, fontWeight: 'bold' }}>
                Inscription réussie !
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}