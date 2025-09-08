import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";
import { useNotifications } from "../../hooks/useNotifications";

export default function NotificationsPermissionScreen() {
  const [isRequesting, setIsRequesting] = useState(false);
  const { nextStep } = useOnboarding();
  const { registerForPushNotifications } = useNotifications();

  const goBack = () => router.back();
  
  const handleAllowNotifications = async () => {
    try {
      setIsRequesting(true);
      await registerForPushNotifications();
      
      // Marquer que les notifications ont été demandées
      nextStep({ notificationsEnabled: true });
      router.push("/onboarding/rocket-launch");
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'activer les notifications. Vous pourrez les activer plus tard dans les paramètres.'
      );
      // Continuer même en cas d'erreur
      nextStep({ notificationsEnabled: false });
      router.push("/onboarding/rocket-launch");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    nextStep({ notificationsEnabled: false });
    router.push("/onboarding/rocket-launch");
  };

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
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
          </View>

          {/* Espace vide à droite pour équilibrer */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* contenu */}
      <View style={{ flex: 1, paddingHorizontal: 22, justifyContent: "center" }}>
        {/* icône notification */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "rgba(255,215,0,0.1)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "rgba(255,215,0,0.3)",
              marginBottom: 24,
            }}
          >
            <Ionicons name="notifications" size={48} color="#FFD700" />
          </View>
        </View>

        {/* titre */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "900",
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Activez les notifications
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              fontSize: 16,
              lineHeight: 24,
              maxWidth: 320,
            }}
          >
            Recevez des rappels d'entraînement, des conseils personnalisés et des encouragements pour rester motivé !
          </Text>
        </View>

        {/* avantages */}
        <View style={{ marginBottom: 60 }}>
          <View style={styles.benefitItem}>
            <Ionicons name="time" size={20} color="#FFD700" />
            <Text style={styles.benefitText}>Rappels d'entraînement quotidiens</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
            <Text style={styles.benefitText}>Félicitations pour vos réussites</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="bulb" size={20} color="#FFD700" />
            <Text style={styles.benefitText}>Conseils personnalisés</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="heart" size={20} color="#FFD700" />
            <Text style={styles.benefitText}>Motivation continue</Text>
          </View>
        </View>
      </View>

      {/* boutons */}
      <SafeAreaView style={{ zIndex: 10 }}>
        <View style={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          {/* Bouton principal - Autoriser */}
          <TouchableOpacity
            onPress={handleAllowNotifications}
            disabled={isRequesting}
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: "#FFD700",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              opacity: isRequesting ? 0.7 : 1,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ 
              color: "#000", 
              fontSize: 18, 
              fontWeight: "800" 
            }}>
              {isRequesting ? "Activation..." : "Autoriser les notifications"}
            </Text>
          </TouchableOpacity>

          {/* Bouton secondaire - Passer */}
          <TouchableOpacity
            onPress={handleSkip}
            disabled={isRequesting}
            style={{
              height: 48,
              borderRadius: 24,
              backgroundColor: "transparent",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",
            }}
            activeOpacity={0.8}
          >
            <Text style={{ 
              color: "rgba(255,255,255,0.7)", 
              fontSize: 16, 
              fontWeight: "600" 
            }}>
              Passer pour l'instant
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  benefitText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
});
