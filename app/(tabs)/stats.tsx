import { ThemedText } from '@/components/ThemedText';
import { RevoColors } from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function StatsScreen() {
  const monthlyStats = [
    { month: 'Jan', calories: 45000, workouts: 22, weight: 75.2 },
    { month: 'Fév', calories: 52000, workouts: 25, weight: 74.8 },
    { month: 'Mar', calories: 48000, workouts: 23, weight: 74.5 },
    { month: 'Avr', calories: 55000, workouts: 28, weight: 74.0 },
    { month: 'Mai', calories: 58000, workouts: 30, weight: 73.5 },
    { month: 'Juin', calories: 62000, workouts: 32, weight: 73.0 },
  ];

  const bodyMetrics = [
    { name: 'Poids', value: '73.0 kg', change: '-0.5 kg', trend: 'down', color: '#4CAF50' },
    { name: 'Masse musculaire', value: '28.5 kg', change: '+0.3 kg', trend: 'up', color: '#FFD700' },
    { name: 'Masse grasse', value: '15.2%', change: '-0.8%', trend: 'down', color: '#FF6B6B' },
    { name: 'IMC', value: '22.1', change: '-0.2', trend: 'down', color: '#4ECDC4' },
  ];

  const workoutStats = [
    { type: 'Cardio', sessions: 45, totalTime: 1800, avgCalories: 320 },
    { type: 'Force', sessions: 38, totalTime: 2280, avgCalories: 280 },
    { type: 'HIIT', sessions: 22, totalTime: 660, avgCalories: 450 },
    { type: 'Yoga', sessions: 15, totalTime: 450, avgCalories: 150 },
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
            <ThemedText style={styles.headerTitle}>Statistiques</ThemedText>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Métriques corporelles</ThemedText>
            <View style={styles.metricsGrid}>
              {bodyMetrics.map((metric, index) => (
                <View key={index} style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <ThemedText style={styles.metricName}>{metric.name}</ThemedText>
                    <View style={[styles.trendIcon, { backgroundColor: metric.color }]}>
                      <Ionicons 
                        name={metric.trend === 'up' ? 'trending-up' : 'trending-down'} 
                        size={16} 
                        color="#FFFFFF" 
                      />
                    </View>
                  </View>
                  <ThemedText style={styles.metricValue}>{metric.value}</ThemedText>
                  <ThemedText style={[styles.metricChange, { color: metric.color }]}>
                    {metric.change}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Progression mensuelle</ThemedText>
            <View style={styles.monthlyChart}>
              {monthlyStats.map((month, index) => (
                <View key={index} style={styles.monthColumn}>
                  <ThemedText style={styles.monthLabel}>{month.month}</ThemedText>
                  <View style={styles.calorieBar}>
                    <View 
                      style={[
                        styles.calorieBarFill, 
                        { height: `${(month.calories / 65000) * 100}%` }
                      ]} 
                    />
                  </View>
                  <ThemedText style={styles.monthValue}>{Math.round(month.calories / 1000)}k</ThemedText>
                  <View style={styles.workoutIndicator}>
                    <View style={[styles.workoutDot, { backgroundColor: '#4CAF50' }]} />
                    <ThemedText style={styles.workoutCount}>{month.workouts}</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Statistiques d&apos;entraînement</ThemedText>
            <View style={styles.workoutStatsList}>
              {workoutStats.map((stat, index) => (
                <View key={index} style={styles.workoutStatCard}>
                  <View style={styles.workoutStatHeader}>
                    <ThemedText style={styles.workoutStatType}>{stat.type}</ThemedText>
                    <View style={styles.workoutStatIcon}>
                      <Ionicons 
                        name={stat.type === 'Cardio' ? 'heart' : 
                              stat.type === 'Force' ? 'barbell' : 
                              stat.type === 'HIIT' ? 'flash' : 'leaf'} 
                        size={20} 
                        color="#FFD700" 
                      />
                    </View>
                  </View>
                  
                  <View style={styles.workoutStatDetails}>
                    <View style={styles.workoutStatDetail}>
                      <ThemedText style={styles.workoutStatLabel}>Sessions</ThemedText>
                      <ThemedText style={styles.workoutStatValue}>{stat.sessions}</ThemedText>
                    </View>
                    <View style={styles.workoutStatDetail}>
                      <ThemedText style={styles.workoutStatLabel}>Temps total</ThemedText>
                      <ThemedText style={styles.workoutStatValue}>{Math.round(stat.totalTime / 60)}h</ThemedText>
                    </View>
                    <View style={styles.workoutStatDetail}>
                      <ThemedText style={styles.workoutStatLabel}>Calories moy.</ThemedText>
                      <ThemedText style={styles.workoutStatValue}>{stat.avgCalories}</ThemedText>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Records personnels</ThemedText>
            <View style={styles.recordsGrid}>
              <View style={styles.recordCard}>
                <Ionicons name="trophy" size={32} color="#FFD700" />
                <ThemedText style={styles.recordTitle}>Distance course</ThemedText>
                <ThemedText style={styles.recordValue}>15.2 km</ThemedText>
                <ThemedText style={styles.recordDate}>12 juin 2024</ThemedText>
              </View>
              
              <View style={styles.recordCard}>
                <Ionicons name="barbell" size={32} color="#4ECDC4" />
                <ThemedText style={styles.recordTitle}>Squat max</ThemedText>
                <ThemedText style={styles.recordValue}>120 kg</ThemedText>
                <ThemedText style={styles.recordDate}>8 juin 2024</ThemedText>
              </View>
              
              <View style={styles.recordCard}>
                <Ionicons name="time" size={32} color="#FF6B6B" />
                <ThemedText style={styles.recordTitle}>Plank</ThemedText>
                <ThemedText style={styles.recordValue}>4 min 30s</ThemedText>
                <ThemedText style={styles.recordDate}>15 juin 2024</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Comparaison annuelle</ThemedText>
            <View style={styles.comparisonCard}>
              <View style={styles.comparisonRow}>
                <View style={styles.comparisonItem}>
                  <ThemedText style={styles.comparisonLabel}>2023</ThemedText>
                  <ThemedText style={styles.comparisonValue}>480,000 Kcal</ThemedText>
                </View>
                <View style={styles.comparisonDivider} />
                <View style={styles.comparisonItem}>
                  <ThemedText style={styles.comparisonLabel}>2024</ThemedText>
                  <ThemedText style={styles.comparisonValue}>320,000 Kcal</ThemedText>
                </View>
              </View>
              <View style={styles.comparisonProgress}>
                <ThemedText style={styles.comparisonProgressText}>
                  +33% par rapport à l&apos;année dernière
                </ThemedText>
                <View style={styles.comparisonProgressBar}>
                  <View style={[styles.comparisonProgressFill, { width: '66%' }]} />
                </View>
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
  filterButton: {
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 16,
    width: '47%',
    minHeight: 100,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  trendIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  monthlyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  monthColumn: {
    alignItems: 'center',
    flex: 1,
  },
  monthLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  calorieBar: {
    width: 24,
    height: 80,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  calorieBarFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFD700',
    borderRadius: 12,
  },
  monthValue: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  workoutIndicator: {
    alignItems: 'center',
    gap: 2,
  },
  workoutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  workoutCount: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  workoutStatsList: {
    gap: 16,
  },
  workoutStatCard: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 16,
  },
  workoutStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutStatType: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  workoutStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutStatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutStatDetail: {
    alignItems: 'center',
    flex: 1,
  },
  workoutStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
    textAlign: 'center',
  },
  workoutStatValue: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '700',
    textAlign: 'center',
  },
  recordsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  recordCard: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  recordTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  recordValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  recordDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  comparisonCard: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  comparisonItem: {
    alignItems: 'center',
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  comparisonValue: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: '700',
  },
  comparisonDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  comparisonProgress: {
    alignItems: 'center',
  },
  comparisonProgressText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 12,
  },
  comparisonProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  comparisonProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
}); 