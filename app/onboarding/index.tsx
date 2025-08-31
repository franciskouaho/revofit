import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, ImageBackground, LayoutChangeEvent, Pressable, StatusBar, Text, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginDrawer from "../../components/LoginDrawer";

// SwipeToStartButton (corrigé)
const SwipeToStartButton: React.FC<{ label?: string; onComplete?: () => void }> = ({
    label = "Get Started",
    onComplete,
}) => {
    const KNOB = 56;
    const HEIGHT = 64;
    const PADDING = 8;
    const THRESHOLD = 0.7;

    const [trackWidth, setTrackWidth] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;

    const maxTranslate = Math.max(0, trackWidth - PADDING * 2 - KNOB);

    const onLayoutTrack = (e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width);

    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

    // ✅ useNativeDriver true (on anime transform)
    const onGestureEvent = Animated.event([{ nativeEvent: { translationX: translateX } }], {
        useNativeDriver: true,
    });

    const onHandlerStateChange = (evt: any) => {
        if (evt.nativeEvent.state === State.END) {
            const dx = clamp(evt.nativeEvent.translationX, 0, maxTranslate);
            const reached = dx >= maxTranslate * THRESHOLD;

            if (reached) {
                Animated.timing(translateX, { toValue: maxTranslate, duration: 160, useNativeDriver: true }).start(
                    () => {
                        onComplete?.();
                        setTimeout(() => {
                            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
                        }, 300);
                    }
                );
            } else {
                Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
            }
        }
    };

    return (
        <View
            onLayout={onLayoutTrack}
            style={{
                width: "100%",
                height: HEIGHT,
                padding: PADDING,
                backgroundColor: "#FFD700",
                borderRadius: HEIGHT / 2, // pill propre, plus besoin de bulle
                justifyContent: "center",
                overflow: "hidden",
                shadowColor: "#FFD700",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 14,
                elevation: 12,
            }}
        >
            {/* libellé centré */}
            <Text
                style={{
                    position: "absolute",
                    alignSelf: "center",
                    color: "#000",
                    fontSize: 18,
                    fontWeight: "800",
                }}
            >
                {label}
            </Text>

            {/* pastille noire draggable */}
            <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                <Animated.View
                    style={{
                        position: "absolute",
                        left: PADDING,
                        width: KNOB,
                        height: KNOB,
                        borderRadius: KNOB / 2,
                        backgroundColor: "#000",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: [{ translateX }], // animé
                    }}
                >
                    <Ionicons name="arrow-forward" size={22} color="#FFD700" />
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
};

export default function OnboardingScreen() {
    const [showLoginDrawer, setShowLoginDrawer] = useState(false);
    
    const handleGetStarted = () => {
        // Navigation vers la page de sélection du prénom
        router.push('/onboarding/firstname-selection');
    };

    const handleAlreadyHaveAccount = () => {
        setShowLoginDrawer(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar barStyle="light-content" />

            {/* Image plein écran */}
            <ImageBackground
                source={require("../../assets/images/onboarding-athlete.png")}
                resizeMode="cover"
                style={{ flex: 1 }}
            >
                {/* Overlay du haut (clair) vers bas (noir) */}
                <LinearGradient
                    colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.95)"]}
                    locations={[0.35, 0.7, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ position: "absolute", inset: 0 }}
                />

                <SafeAreaView style={{ flex: 1 }}>
                    {/* Contenu bas-gauche */}
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 24 }}>
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ color: 'white', fontSize: 20, marginBottom: 4 }}>
                                Bienvenue sur
                            </Text>

                            <Text style={{ color: '#FFD700', fontSize: 48, fontWeight: 'bold', marginBottom: 12 }}>
                                RevoFit
                            </Text>

                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 24, maxWidth: 280 }}>
                                Fitness personnalisé simple et efficace.
                            </Text>
                        </View>

                        {/* Bouton style maquette avec swipe */}
                        <View style={{ width: '100%' }}>
                            <SwipeToStartButton
                                label="Commencer"
                                onComplete={handleGetStarted}
                            />

                            {/* Bouton secondaire */}
                            <Pressable 
                                style={{
                                    height: 56,
                                    backgroundColor: 'transparent',
                                    borderRadius: 28,
                                    borderWidth: 1,
                                    borderColor: '#2A2A2A',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 16,
                                }}
                                onPress={handleAlreadyHaveAccount}
                            >
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                                    J&apos;ai déjà un compte
                                </Text>
                            </Pressable>

                            {/* Indicateur de swipe */}
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', marginTop: 12 }}>
                                Glissez la flèche pour continuer
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>

            {/* Login Drawer */}
            <LoginDrawer
                visible={showLoginDrawer}
                onClose={() => setShowLoginDrawer(false)}
            />
        </View>
    );
}
