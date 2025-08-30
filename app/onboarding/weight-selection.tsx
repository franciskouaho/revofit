import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

export default function WeightSelectionScreen() {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [weight, setWeight] = useState(70);

  const toggleUnit = () => {
    setUnit(unit === 'kg' ? 'lbs' : 'kg');
  };

  const handleBack = () => router.back();
  const handleNext = () => router.push('/onboarding/height-selection');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Fond thème Revo : noir + halos olive */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <SafeAreaView>
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Dots au centre */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
          </View>

          {/* Espace vide à droite pour équilibrer */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* Contenu principal */}
      <View style={styles.content}>
        {/* Titre et description */}
        <View style={styles.header}>
          <Text style={styles.title}>Quel est votre poids ?</Text>
          <Text style={styles.description}>
            Votre poids nous aide à personnaliser vos entraînements et calculs nutritionnels.
          </Text>
        </View>

        {/* Sélecteur d'unités */}
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'kg' && styles.unitButtonActive]}
            onPress={() => setUnit('kg')}
          >
            <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>kg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'lbs' && styles.unitButtonActive]}
            onPress={() => setUnit('lbs')}
          >
            <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>lbs</Text>
          </TouchableOpacity>
        </View>

        {/* Affichage du poids et règle */}
        <View style={styles.weightSection}>
          {/* Affichage central du poids */}
          <View style={styles.weightDisplay}>
            <Text style={styles.weightText}>
              {unit === 'kg' ? `${weight} kg` : `${Math.round(weight * 2.20462)} lbs`}
            </Text>
          </View>

          {/* Règle verticale */}
          <View style={styles.ruler}>
            <View style={styles.rulerLine} />
            <View style={styles.rulerMarkers}>
              {[50, 60, 70, 80, 90, 100].map((mark) => (
                <View key={mark} style={styles.rulerMarker}>
                  <Text style={styles.rulerText}>{mark}</Text>
                  <View style={styles.rulerTick} />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Bouton Next */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    lineHeight: 22,
    maxWidth: 300,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 60,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#FFD700',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B0B0B0',
  },
  unitTextActive: {
    color: '#000000',
  },
  weightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  weightDisplay: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 20,
  },
  weightText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  ruler: {
    width: 60,
    height: 300,
    alignItems: 'center',
    position: 'relative',
  },
  rulerLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#FFD700',
  },
  rulerMarkers: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rulerMarker: {
    alignItems: 'center',
  },
  rulerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  rulerTick: {
    width: 20,
    height: 2,
    backgroundColor: '#FFD700',
  },
  nextButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});
