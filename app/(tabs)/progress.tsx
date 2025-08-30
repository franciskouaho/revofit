import { ThemedText } from '@/components/ThemedText';
import { RevoColors } from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressScreen() {
  const weeklyProgress = [
    { day: 'Lun', calories: 1200, workouts: 1 },
    { day: 'Mar', calories: 1400, workouts: 2 },
    { day: 'Mer', calories: 1800, workouts: 1 },
    { day: 'Jeu', calories: 1100, workouts: 0 },
    { day: 'Ven', calories: 1600, workouts: 2 },
    { day: 'Sam', calories: 2000, workouts: 1 },
    { day: 'Dim', calories: 800, workouts: 0 },
  ];

  const goals = [
    { name: 'Calories quotidiennes', current: 1200, target: 2000, unit: 'Kcal', color: '#FFD700' },
    { name: 'Pas quotidiens', current: 9560, target: 10000, unit: 'pas', color: '#4ECDC4' },
    { name: 'Entraînements hebdo', current: 7, target: 5, unit: 'sessions', color: '#4CAF50' },
    { name: 'Temps actif', current: 45, target: 60, unit: 'min', color: '#FF6B6B' },
  ];

  const achievements = [
    { name: 'Premier pas', description: 'Premier entraînement complété', icon: 'trophy', color: '#FFD700' },
    { name: 'Consistance', description: '7 jours consécutifs', icon: 'flame', color: '#FF6B6B' },
    { name: 'Force', description: 'Nouveau record personnel', icon: 'barbell', color: '#4ECDC4' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
        locations={[0, 0.15, 0.4, 0.7, 1]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Suivi</ThemedText>
            <TouchableOpacity style={styles.calendarButton}>
              <Ionicons name="calendar" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Vue d&apos;ensemble hebdomadaire</ThemedText>
            <View style={styles.weeklyChart}>
              {weeklyProgress.map((day, index) => (
                <View key={index} style={styles.dayColumn}>
                  <ThemedText style={styles.dayLabel}>{day.day}</ThemedText>
                  <View style={styles.calorieBar}>
                    <View 
                      style={[
                        styles.calorieBarFill, 
                        { 
                          height: `${(day.calories / 2000) * 100}%`,
                          backgroundColor: day.workouts > 0 ? '#FFD700' : '#2A2A2A'
                        }
                      ]} 
                    />
                  </View>
                  <ThemedText style={styles.calorieValue}>{day.calories}</ThemedText>
                  <View style={styles.workoutIndicator}>
                    {day.workouts > 0 && (
                      <View style={[styles.workoutDot, { backgroundColor: '#4CAF50' }]} />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Objectifs</ThemedText>
            <View style={styles.goalsList}>
              {goals.map((goal, index) => {
                const progress = Math.min((goal.current / goal.target) * 100, 100);
                const isOverTarget = goal.current > goal.target;
                
                return (
                  <View key={index} style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                      <ThemedText style={styles.goalName}>{goal.name}</ThemedText>
                      <ThemedText style={styles.goalProgress}>
                        {goal.current}/{goal.target} {goal.unit}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${progress}%`,
                            backgroundColor: isOverTarget ? '#4CAF50' : goal.color
                          }
                        ]} 
                      />
                    </View>
                    
                    <View style={styles.goalStatus}>
                      <ThemedText style={styles.goalPercentage}>{Math.round(progress)}%</ThemedText>
                      {isOverTarget && (
                        <View style={styles.overTargetBadge}>
                          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                          <ThemedText style={styles.overTargetText}>Objectif atteint !</ThemedText>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Réalisations</ThemedText>
            <View style={styles.achievementsList}>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
                    <Ionicons name={achievement.icon as any} size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.achievementContent}>
                    <ThemedText style={styles.achievementName}>{achievement.name}</ThemedText>
                    <ThemedText style={styles.achievementDescription}>{achievement.description}</ThemedText>
                  </View>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Aperçus</ThemedText>
            <View style={styles.insightsGrid}>
              <View style={styles.insightCard}>
                <Ionicons name="trending-up" size={24} color="#4CAF50" />
                <ThemedText style={styles.insightTitle}>Progression</ThemedText>
                <ThemedText style={styles.insightValue}>+15%</ThemedText>
                <ThemedText style={styles.insightSubtitle}>Cette semaine</ThemedText>
              </View>
              
              <View style={styles.insightCard}>
                <Ionicons name="time" size={24} color="#FFD700" />
                <ThemedText style={styles.insightTitle}>Temps actif</ThemedText>
                <ThemedText style={styles.insightValue}>6h 30m</ThemedText>
                <ThemedText style={styles.insightSubtitle}>Cette semaine</ThemedText>
              </View>
            </View>
          </View>

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
  calendarButton: {
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
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 20,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  calorieBar: {
    width: 20,
    height: 60,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  calorieBarFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFD700',
    borderRadius: 10,
  },
  calorieValue: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  workoutIndicator: {
    height: 8,
    justifyContent: 'center',
  },
  workoutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  goalsList: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  goalProgress: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalPercentage: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '700',
  },
  overTargetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  overTargetText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  achievementsList: {
    gap: 16,
  },
  achievementCard: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  insightCard: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  insightTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  insightValue: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: '800',
    textAlign: 'center',
  },
  insightSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
}); 