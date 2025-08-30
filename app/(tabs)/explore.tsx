import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore RevoFit</Text>
        <Text style={styles.subtitle}>Discover all the features</Text>
      </View>

      {/* Features Grid */}
      <View style={styles.content}>
        <View style={styles.featuresGrid}>
          {/* Workout Feature */}
          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🏋️</Text>
            </View>
            <Text style={styles.featureTitle}>Personalized Workouts</Text>
            <Text style={styles.featureDescription}>
              AI-powered workout plans tailored to your goals and fitness level
            </Text>
          </TouchableOpacity>

          {/* Nutrition Feature */}
          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🍎</Text>
            </View>
            <Text style={styles.featureTitle}>Nutrition Tracking</Text>
            <Text style={styles.featureDescription}>
              Track calories, macros, and plan your meals for optimal results
            </Text>
          </TouchableOpacity>

          {/* Coach Feature */}
          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>💬</Text>
            </View>
            <Text style={styles.featureTitle}>Real-time Coaching</Text>
            <Text style={styles.featureDescription}>
              Chat with certified coaches and get instant feedback
            </Text>
          </TouchableOpacity>

          {/* Progress Feature */}
          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>📊</Text>
            </View>
            <Text style={styles.featureTitle}>Progress Analytics</Text>
            <Text style={styles.featureDescription}>
              Visual charts and insights to track your fitness journey
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 16,
    width: '48%',
    alignItems: 'center',
    minHeight: 160,
  },
  featureIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#FFD700',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureIconText: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 16,
  },
});
