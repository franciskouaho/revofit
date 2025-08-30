import React, { useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HeightInputScreen() {
  const [unit, setUnit] = useState<'ft' | 'cm'>('ft');
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(7);

  const toggleUnit = () => {
    setUnit(unit === 'ft' ? 'cm' : 'ft');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Barre de navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        {/* Titre et description */}
        <View style={styles.header}>
          <Text style={styles.title}>What is your height?</Text>
          <Text style={styles.description}>
            Height helps personalize workouts and track fitness progress accurately.
          </Text>
        </View>

        {/* Sélecteur d'unités */}
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'cm' && styles.unitButtonActive]}
            onPress={() => setUnit('cm')}
          >
            <Text style={[styles.unitText, unit === 'cm' && styles.unitTextActive]}>cm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'ft' && styles.unitButtonActive]}
            onPress={() => setUnit('ft')}
          >
            <Text style={[styles.unitText, unit === 'ft' && styles.unitTextActive]}>ft</Text>
          </TouchableOpacity>
        </View>

        {/* Affichage de la taille et règle */}
        <View style={styles.heightSection}>
          {/* Affichage central de la taille */}
          <View style={styles.heightDisplay}>
            <Text style={styles.heightText}>
              {unit === 'ft' ? `${heightFeet} ft ${heightInches} in` : `${Math.round((heightFeet * 30.48) + (heightInches * 2.54))} cm`}
            </Text>
          </View>

          {/* Règle verticale */}
          <View style={styles.ruler}>
            <View style={styles.rulerLine} />
            <View style={styles.rulerMarkers}>
              {[7, 6, 5, 4].map((foot) => (
                <View key={foot} style={styles.rulerMarker}>
                  <Text style={styles.rulerText}>{foot}</Text>
                  <View style={styles.rulerTick} />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Bouton Next */}
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
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
    paddingTop: 60,
    paddingHorizontal: 24,
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
  backArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  heightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  heightDisplay: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 20,
  },
  heightText: {
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