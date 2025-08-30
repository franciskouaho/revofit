import { ThemedText } from '@/components/ThemedText';
import { RevoColors } from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutsScreen() {
  const workoutCategories = [
    { name: "Cardio", icon: "heart", color: "#FF6B6B", count: 12 },
    { name: "Force", icon: "barbell", color: "#4ECDC4", count: 18 },
    { name: "HIIT", icon: "flash", color: "#FFD93D", count: 8 },
    { name: "Yoga", icon: "leaf", color: "#B388FF", count: 15 },
  ];

  const featuredWorkouts = [
    {
      name: "Full Body Burn",
      difficulty: "Intermediate",
      duration: 45,
      calories: 320,
      image: require('@/assets/images/onboarding-athlete.png')
    },
    {
      name: "Core Crusher",
      difficulty: "Beginner",
      duration: 30,
      calories: 220,
      image: require('@/assets/images/onboarding-athlete.png')
    },
    {
      name: "Leg Day Power",
      difficulty: "Advanced",
      duration: 60,
      calories: 450,
      image: require('@/assets/images/onboarding-athlete.png')
    }
  ];

  return (
    <View style={styles.container}>
      {/* Fond avec gradient */}
      <LinearGradient
        colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
        locations={[0, 0.15, 0.4, 0.7, 1]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Entraînements</ThemedText>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Catégories</ThemedText>
            <View style={styles.categoriesGrid}>
              {workoutCategories.map((category, index) => (
                <TouchableOpacity key={index} style={styles.categoryCard}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <Ionicons name={category.icon as any} size={24} color="#FFFFFF" />
                  </View>
                  <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
                  <ThemedText style={styles.categoryCount}>{category.count} entraînements</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Featured Workouts */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Entraînements populaires</ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.seeAllText}>Voir tout</ThemedText>
              </TouchableOpacity>
            </View>
            
            <View style={styles.workoutsList}>
              {featuredWorkouts.map((workout, index) => (
                <TouchableOpacity key={index} style={styles.workoutItem}>
                  <Image source={workout.image} style={styles.workoutItemImage} />
                  <View style={styles.workoutItemContent}>
                    <View style={styles.workoutItemHeader}>
                      <ThemedText style={styles.workoutItemName}>{workout.name}</ThemedText>
                      <View style={[styles.difficultyBadge, 
                        { backgroundColor: workout.difficulty === 'Advanced' ? 'rgba(255, 107, 107, 0.2)' : 
                          workout.difficulty === 'Intermediate' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(76, 175, 80, 0.2)' }]}>
                        <ThemedText style={[styles.difficultyText, 
                          { color: workout.difficulty === 'Advanced' ? '#FF6B6B' : 
                            workout.difficulty === 'Intermediate' ? '#FFC107' : '#4CAF50' }]}>
                          {workout.difficulty}
                        </ThemedText>
                      </View>
                    </View>
                    
                    <View style={styles.workoutItemDetails}>
                      <View style={styles.workoutDetail}>
                        <Ionicons name="time" size={16} color="#FFD700" />
                        <ThemedText style={styles.workoutDetailText}>{workout.duration} min</ThemedText>
                      </View>
                      <View style={styles.workoutDetail}>
                        <Ionicons name="flame" size={16} color="#FFD700" />
                        <ThemedText style={styles.workoutDetailText}>{workout.calories} Kcal</ThemedText>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.playButton}>
                    <Ionicons name="play" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Start */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Démarrage rapide</ThemedText>
            <TouchableOpacity style={styles.quickStartCard}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.quickStartGradient}
              >
                <View style={styles.quickStartContent}>
                  <View>
                    <ThemedText style={styles.quickStartTitle}>Entraînement express</ThemedText>
                    <ThemedText style={styles.quickStartSubtitle}>15 min • Tous niveaux</ThemedText>
                  </View>
                  <TouchableOpacity style={styles.quickStartButton}>
                    <Ionicons name="play" size={24} color="#000000" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RevoColors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 16,
    width: '47%',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  workoutsList: {
    gap: 16,
  },
  workoutItem: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  workoutItemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  workoutItemContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  workoutItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  workoutItemName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  workoutItemDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  workoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workoutDetailText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 16,
  },
  quickStartCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  quickStartGradient: {
    padding: 20,
  },
  quickStartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickStartTitle: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '800',
    marginBottom: 4,
  },
  quickStartSubtitle: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.7)',
    fontWeight: '600',
  },
  quickStartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 