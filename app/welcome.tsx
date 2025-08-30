import React from 'react';
import { Dimensions, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Image de fond avec l'athlète */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay sombre pour améliorer la lisibilité */}
        <View style={styles.overlay}>
          {/* Contenu principal */}
          <View style={styles.content}>
            {/* Texte d'accueil */}
            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Bienvenue sur</Text>
              <Text style={styles.appTitle}>RevoFit</Text>
              <Text style={styles.subtitle}>Fitness personnalisé simple et efficace.</Text>
            </View>
            
            {/* Bouton Commencer */}
            <TouchableOpacity style={styles.getStartedButton}>
              <Text style={styles.buttonText}>Commencer</Text>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  textContainer: {
    marginTop: 100,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 24,
    maxWidth: 280,
  },
  getStartedButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#000000',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
}); 