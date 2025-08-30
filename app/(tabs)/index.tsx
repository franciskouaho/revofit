import Header from '@/components/Header';
import StatusBar from '@/components/StatusBar';
import { ThemedText } from '@/components/ThemedText';
import { RevoColors } from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import { LinearGradient } from "expo-linear-gradient";
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const GLASS_BORDER = 'rgba(255,255,255,0.12)';
const GLASS_BG = 'rgba(255,255,255,0.06)';

export default function HomeScreen() {
  const userStats = {
    calories: 1200,
    steps: 9560,
    heartRate: 73,
    workouts: { completed: 14, total: 20 }
  };

  const todayWorkout = {
    name: "Full Body Workout",
    difficulty: "Advanced",
    calories: 1800,
    duration: 60,
    image: require('@/assets/images/onboarding-athlete.png')
  };

  const handleMenuPress = () => console.log('Menu pressed');
  const handleNotificationPress = () => console.log('Notification pressed');
  const handleProfilePress = () => console.log('Profile pressed');

  return (
    <View style={styles.container}>
      {/* Fond avec gradient */}
      <LinearGradient
        colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
        locations={[0, 0.15, 0.7, 1]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <Header 
          greeting="Bonjour"
          userName="Adam Smith"
          onMenuPress={handleMenuPress}
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
        />
        
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Status Bar (déjà glass) */}
          <StatusBar 
            strikes={21}
            currentDay="Mer"
            workoutMessage="C'est l'heure de s'entraîner"
            upcomingDays={[
              { day: 18, label: "Jeu" },
              { day: 19, label: "Ven" },
              { day: 20, label: "Sam" }
            ]}
          />

          {/* Statistiques (cards en verre) */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Statistiques</ThemedText>
            <View style={styles.statsGrid}>
              <BlurView intensity={28} tint="dark" style={styles.statCardGlass}>
                <View style={styles.statHeader}>
                  <ThemedText style={styles.statLabel}>Calories</ThemedText>
                  <Ionicons name="flame" size={16} color="#FFD700" />
                </View>
                <ThemedText style={styles.statValue}>{userStats.calories} Kcal</ThemedText>
                <View style={styles.cardHighlight} pointerEvents="none" />
              </BlurView>
              
              <BlurView intensity={28} tint="dark" style={styles.statCardGlass}>
                <View style={styles.statHeader}>
                  <ThemedText style={styles.statLabel}>Pas</ThemedText>
                  <Ionicons name="footsteps" size={16} color="#4ECDC4" />
                </View>
                <ThemedText style={styles.statValue}>{userStats.steps}</ThemedText>
                <View style={styles.cardHighlight} pointerEvents="none" />
              </BlurView>
              
              <BlurView intensity={28} tint="dark" style={styles.statCardGlass}>
                <View style={styles.statHeader}>
                  <ThemedText style={styles.statLabel}>Battements</ThemedText>
                  <Ionicons name="heart" size={16} color="#FF6B6B" />
                </View>
                <ThemedText style={styles.statValue}>{userStats.heartRate} bpm</ThemedText>
                <View style={styles.cardHighlight} pointerEvents="none" />
              </BlurView>
              
              <BlurView intensity={28} tint="dark" style={styles.statCardGlass}>
                <View style={styles.statHeader}>
                  <ThemedText style={styles.statLabel}>Entraînements</ThemedText>
                  <Ionicons name="barbell" size={16} color="#4CAF50" />
                </View>
                <ThemedText style={styles.statValue}>
                  {userStats.workouts.completed}/{userStats.workouts.total}
                </ThemedText>
                <View style={styles.cardHighlight} pointerEvents="none" />
              </BlurView>
            </View>
          </View>

          {/* Entraînement du jour */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Entraînement du jour</ThemedText>

            <View style={styles.workoutCardShell}>
              <Image source={todayWorkout.image} style={styles.workoutImage} />
              {/* assombrir le bas de l'image */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={styles.workoutOverlay}
              />

              {/* Bandeau info en GLASS */}
              <BlurView intensity={30} tint="dark" style={styles.workoutGlassBar}>
                <View style={styles.workoutHeader}>
                  <View style={styles.difficultyBadgeGlass}>
                    <View style={styles.difficultyDot} />
                    <ThemedText style={styles.difficultyText}>{todayWorkout.difficulty}</ThemedText>
                  </View>

                  <TouchableOpacity style={styles.favoriteButtonGlass}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                  </TouchableOpacity>
                </View>

                <ThemedText style={styles.workoutName}>{todayWorkout.name}</ThemedText>

                <View style={styles.workoutFooter}>
                  <TouchableOpacity style={styles.playButtonGlass}>
                    <Ionicons name="play" size={22} color="#0A0A0A" />
                  </TouchableOpacity>

                  <View style={styles.workoutDetails}>
                    <View style={styles.workoutDetail}>
                      <Ionicons name="flame" size={16} color="#FFD700" />
                      <ThemedText style={styles.workoutDetailText}>{todayWorkout.calories} Kcal</ThemedText>
                    </View>
                    <View style={styles.workoutDetail}>
                      <Ionicons name="time" size={16} color="#FFD700" />
                      <ThemedText style={styles.workoutDetailText}>{todayWorkout.duration} min</ThemedText>
                    </View>
                  </View>
                </View>

                {/* reflets pour le verre */}
                <View style={styles.pillHighlightTop} pointerEvents="none" />
                <View style={styles.pillHighlightBottom} pointerEvents="none" />
              </BlurView>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RevoColors.background },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },

  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionTitle: { fontSize: 20, color: '#FFFFFF', fontWeight: '700', marginBottom: 20 },

  /* GRID */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  /* --- Glass card générique pour stats --- */
  statCardGlass: {
    width: '47%',
    minHeight: 100,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS_BG,
    overflow: 'hidden',
  },
  cardHighlight: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  statValue: { fontSize: 24, color: '#FFD700', fontWeight: '800' },

  /* --- Workout card --- */
  workoutCardShell: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 220,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: '#1a1a1a', // fallback sous l'image
  },
  workoutImage: { width: '100%', height: 220, resizeMode: 'cover' },
  workoutOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },

  /* Bandeau d’infos en verre au bas de l’image */
  workoutGlassBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    overflow: 'hidden',
  },
  pillHighlightTop: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 30,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  pillHighlightBottom: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 26,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.16)',
  },

  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  /* badge difficulté en verre */
  difficultyBadgeGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: 'rgba(76,175,80,0.15)',
  },
  difficultyDot: { width: 8, height: 8, backgroundColor: '#4CAF50', borderRadius: 4 },
  difficultyText: { fontSize: 12, color: '#A8E6A0', fontWeight: '700' },

  favoriteButtonGlass: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  workoutName: { fontSize: 20, color: '#FFFFFF', fontWeight: '900', marginBottom: 12 },

  workoutFooter: { flexDirection: 'row', alignItems: 'center', gap: 16 },

  /* Play en verre jaune inversé */
  playButtonGlass: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.25)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },

  workoutDetails: { flex: 1, flexDirection: 'row', gap: 20 },
  workoutDetail: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  workoutDetailText: { fontSize: 14, color: '#FFFFFF', fontWeight: '600' },
});
