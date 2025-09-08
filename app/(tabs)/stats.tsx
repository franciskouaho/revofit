// app/(tabs)/stats.tsx
import { ThemedText } from '@/components/ThemedText';
import { RevoColors } from '@/constants/Colors';
import { useStatsData } from '@/hooks/useStatsData';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { useHealthDataSimple } from '@/hooks/useHealthData';

const BORDER = 'rgba(255,255,255,0.12)';

// Hauteurs unifiées pour les tuiles 2 colonnes
const TILE_H = 150; // KPIs, Body metrics, mini-cards

/* ---------- conteneur glass générique ---------- */
const Glass = ({ children, style, padding = 16, blur = 20 }: any) => (
  <View style={[{ borderRadius: 18, overflow: 'hidden' }, style]}>
    <BlurView intensity={blur} tint="dark" style={StyleSheet.absoluteFill} />
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: BORDER, borderWidth: 1, borderRadius: 18 },
      ]}
    />
    <View style={{ padding }}>{children}</View>
  </View>
);

/* ---------- tuile 2 colonnes (hauteur fixe) ---------- */
const Tile: React.FC<any> = ({ style, children }) => (
  <Glass style={[{ width: '47%', minHeight: TILE_H, justifyContent: 'space-between' }, style]}>
    {children}
  </Glass>
);

/* ---------- sparkline (barrettes) ---------- */
const Sparkline = ({ values, color = '#FFD700' }: { values: number[]; color?: string }) => {
  const max = Math.max(...values, 1);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 28 }}>
      {values.map((v, i) => (
        <View
          key={i}
          style={{
            width: 6,
            height: Math.max(2, (v / max) * 28),
            borderRadius: 3,
            backgroundColor: color,
            opacity: 0.45 + (v / max) * 0.55,
          }}
        />
      ))}
    </View>
  );
};

/* ---------- donut (completion) ---------- */
const Donut = ({ size = 120, stroke = 14, percent = 76, color = '#4CAF50' }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, percent));
  const dash = (p / 100) * c;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22 }}>{p}%</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Completion</Text>
      </View>
    </View>
  );
};

export default function StatsScreen() {
  const {
    userStats,
    totalWorkouts,
    averageHeartRate,
    longestStreak,
    completionRate,
    monthlyData,
    loading,
    error,
  } = useStatsData();

  // Données de santé réelles depuis HealthKit uniquement (conditionnel)
  const {
    steps: healthSteps,
    calories: healthCalories,
    distance: healthDistance,
    hasPermissions,
    isLoading: healthLoading,
  } = useHealthDataSimple();


  // Données calculées pour les KPIs avec les données HealthKit uniquement
  const kpis = [
    { 
      label: 'Calories brûlées', 
      value: hasPermissions && healthCalories > 0 ? `${Math.round(healthCalories)}` : '0', 
      diff: hasPermissions ? '+6%' : 'Non disponible', 
      icon: 'flame', 
      color: hasPermissions ? '#FFD700' : '#666', 
      series: [0, 0, 0, 0, 0, 0, 0] // TODO: Ajouter les données historiques
    },
    { 
      label: 'Pas aujourd\'hui', 
      value: hasPermissions && healthSteps > 0 ? healthSteps.toLocaleString() : '0', 
      diff: hasPermissions ? '+2k' : 'Non disponible', 
      icon: 'walk', 
      color: hasPermissions ? '#4CAF50' : '#666', 
      series: [0, 0, 0, 0, 0, 0, 0] // TODO: Ajouter les données historiques
    },
    { 
      label: 'Temps actif', 
      value: '0h', // Pas disponible dans HealthKit pour l'instant
      diff: hasPermissions ? '+5h' : 'Non disponible', 
      icon: 'time', 
      color: hasPermissions ? '#4ECDC4' : '#666', 
      series: [0, 0, 0, 0, 0, 0, 0]
    },
    { 
      label: 'Distance', 
      value: hasPermissions && healthDistance > 0 ? `${(healthDistance / 1000).toFixed(1)} km` : '0.0 km', 
      diff: hasPermissions ? '+12' : 'Non disponible', 
      icon: 'trail-sign', 
      color: hasPermissions ? '#9FA8DA' : '#666', 
      series: [0, 0, 0, 0, 0, 0, 0] // TODO: Ajouter les données historiques
    },
  ];

  // Métriques corporelles avec les vraies données de santé
  const body = [
    { 
      name: 'Poids', 
      value: 'N/A', // Pas disponible dans useHealthDataSimple 
      change: '-0.5 kg', 
      up: false, 
      color: '#4CAF50' 
    },
    { 
      name: 'Masse grasse', 
      value: 'N/A', // Pas disponible dans useHealthDataSimple 
      change: '-0.8%', 
      up: false, 
      color: '#FF6B6B' 
    },
    { 
      name: 'Étages montés', 
      value: '0', // Pas disponible dans useHealthDataSimple
      change: '+3', 
      up: true, 
      color: '#FFD700' 
    },
    { 
      name: 'FC moyenne', 
      value: 'N/A', // Pas disponible dans useHealthDataSimple
      change: '-3 bpm', 
      up: false, 
      color: '#4ECDC4' 
    },
  ];

  // Répartition d'activité simplifiée
  const split = [
    { type: 'Cardio', pct: 0, color: '#4CAF50', icon: 'heart' },
    { type: 'Force', pct: 0, color: '#FFD700', icon: 'barbell' },
    { type: 'HIIT', pct: 0, color: '#FF6B6B', icon: 'flash' },
    { type: 'Yoga', pct: 0, color: '#9C27B0', icon: 'leaf' },
  ];

  // Heatmap hebdomadaire simplifié
  const weekHeat = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  // Macros nutritionnels (placeholder)
  const macros = [
    { name: 'Protéines', g: 120, color: '#4CAF50' },
    { name: 'Glucides', g: 180, color: '#FF6B6B' },
    { name: 'Lipides', g: 65, color: '#9C27B0' },
    { name: 'Fibres', g: 28, color: '#4ECDC4' },
  ];

  // Données pour les mini-cards de santé simplifiées
  const healthMetrics = [
    {
      label: 'Pas (7j)',
      value: '0', // Pas de données historiques disponibles
      icon: 'walk',
      color: '#FFD700',
      series: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      label: 'Distance (7j)',
      value: '0.0 km', // Pas de données historiques disponibles
      icon: 'trail-sign',
      color: '#9FA8DA',
      series: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      label: 'Calories (7j)',
      value: '0k', // Pas de données historiques disponibles
      icon: 'flame',
      color: '#4ECDC4',
      series: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      label: 'Exercice (7j)',
      value: '0h', // Pas de données historiques disponibles
      icon: 'fitness',
      color: '#FF6B6B',
      series: [0, 0, 0, 0, 0, 0, 0]
    },
  ];

  if (loading || healthLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
          locations={[0, 0.15, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={{ color: '#fff', marginTop: 16 }}>Chargement des statistiques...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
          locations={[0, 0.15, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
            <Text style={{ color: '#fff', marginTop: 16, textAlign: 'center' }}>{error}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fond gradient */}
      <LinearGradient
        colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
        locations={[0, 0.15, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Header glass */}
          <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <ThemedText style={{ fontSize: 24, color: '#fff', fontWeight: '900' }}>Statistiques</ThemedText>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={{
                      width: 40, height: 40, borderRadius: 100,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: BORDER,
                    }}
                  >
                    <Ionicons name="filter" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
          </View>

          {/* KPIs (alignés) */}
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {kpis.map((k, i) => (
                <Tile key={i}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <View
                        style={{
                          width: 36, height: 36, borderRadius: 18,
                          borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
                          backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Ionicons name={k.icon as any} size={18} color={k.color as any} />
                      </View>
                      <Text numberOfLines={1} style={{ color: 'rgba(255,255,255,0.8)' }}>{k.label}</Text>
                    </View>
                    <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22 }}>{k.value}</Text>
                    <Text style={{ color: '#4CAF50', marginTop: 4 }}>{k.diff}</Text>
                  </View>
                  <Sparkline values={k.series} color={k.color as any} />
                </Tile>
              ))}
            </View>
          </View>

          {/* VO2 / Rest HR */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Tile style={{ width: '47%' }}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="fitness" size={18} color="#4CAF50" />
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>VO₂max</Text>
                  </View>
                  <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 8 }}>48 ml/kg/min</Text>
                  <Text style={{ color: '#4CAF50', marginTop: 4 }}>+1.2 ce mois</Text>
                </View>
              </Tile>

              <Tile style={{ width: '47%' }}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="heart" size={18} color="#FF6B6B" />
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>FC au repos</Text>
                  </View>
                  <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 8 }}>{averageHeartRate || 58} bpm</Text>
                  <Text style={{ color: '#4CAF50', marginTop: 4 }}>-3 bpm</Text>
                </View>
              </Tile>
            </View>
          </View>

          {/* Métriques corporelles (alignées) */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Métriques corporelles</ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {body.map((m, i) => (
                <Tile key={i}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text numberOfLines={1} style={{ color: 'rgba(255,255,255,0.8)' }}>{m.name}</Text>
                      <View
                        style={{
                          width: 26, height: 26, borderRadius: 13,
                          backgroundColor: m.color + '33', alignItems: 'center', justifyContent: 'center',
                          borderWidth: 1, borderColor: m.color + '66'
                        }}
                      >
                        <Ionicons name={m.up ? 'trending-up' : 'trending-down'} size={14} color="#fff" />
                      </View>
                    </View>
                    <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20, marginTop: 10 }}>{m.value}</Text>
                    <Text style={{ color: m.color, marginTop: 2 }}>{m.change}</Text>
                  </View>
                </Tile>
              ))}
            </View>
          </View>

          {/* Completion + objectifs */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Glass style={{ width: 150, alignItems: 'center', justifyContent: 'center' }}>
                <Donut percent={completionRate} color="#FFD700" />
              </Glass>
              <Glass style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontWeight: '800', marginBottom: 8 }}>Objectifs ce mois</Text>
                {[
                  { 
                    label: 'Calories brûlées', 
                    val: healthCalories > 0 ? Math.round(healthCalories) : 0, 
                    goal: 80000, 
                    color: '#FFD700' 
                  },
                  { 
                    label: 'Heures actives', 
                    val: 0, // Pas disponible dans useHealthDataSimple
                    goal: 60, 
                    color: '#4ECDC4' 
                  },
                  { 
                    label: 'Séances', 
                    val: totalWorkouts, 
                    goal: userStats?.weeklyGoal?.target ? userStats.weeklyGoal.target * 4 : 36, 
                    color: '#4CAF50' 
                  },
                ].map((g, i) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{g.label}</Text>
                      <Text style={{ color: '#fff', fontWeight: '800' }}>
                        {g.val}/{g.goal}
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 8, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden', borderWidth: 1, borderColor: BORDER, marginTop: 6,
                      }}
                    >
                      <View
                        style={{
                          width: `${Math.min(100, (g.val / g.goal) * 100)}%`,
                          height: '100%', backgroundColor: g.color,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </Glass>
            </View>
          </View>

          {/* Progression mensuelle */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Progression mensuelle</ThemedText>
            <Glass padding={14}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160 }}>
                {monthlyData.map((m, i) => {
                  const maxCalories = Math.max(...monthlyData.map(d => d.calories), 1);
                  const h = Math.max(10, (m.calories / maxCalories) * 130);
                  return (
                    <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                      <View
                        style={{
                          width: 22, height: 130, borderRadius: 12,
                          backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden',
                          justifyContent: 'flex-end', borderWidth: 1, borderColor: BORDER,
                        }}
                      >
                        <LinearGradient colors={['#FFD700', '#E6C200']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{ height: h }} />
                      </View>
                      <Text style={{ color: '#fff', fontSize: 12, marginTop: 6 }}>{m.month}</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{Math.round(m.calories / 1000)}k</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50' }} />
                        <Text style={{ color: '#4CAF50', fontSize: 10, fontWeight: '700' }}>{m.workouts}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </Glass>
          </View>

          {/* Répartition activité */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Répartition de l’activité</ThemedText>
            <Glass>
              {split.map((s, i) => (
                <View key={i} style={{ marginBottom: i === split.length - 1 ? 0 : 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name={s.icon as any} size={16} color={s.color as any} />
                      <Text style={{ color: '#fff', fontWeight: '700' }}>{s.type}</Text>
                    </View>
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{s.pct}%</Text>
                  </View>
                  <View
                    style={{
                      height: 8, backgroundColor: 'rgba(255,255,255,0.08)',
                      borderRadius: 6, marginTop: 8, overflow: 'hidden',
                      borderWidth: 1, borderColor: BORDER,
                    }}
                  >
                    <View style={{ width: `${s.pct}%`, height: '100%', backgroundColor: s.color, borderRadius: 6 }} />
                  </View>
                </View>
              ))}
            </Glass>
          </View>

          {/* Heatmap hebdo */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Heatmap hebdo</ThemedText>
            <Glass padding={14}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                {weekHeat.map((day, i) => (
                  <View key={i} style={{ gap: 6, alignItems: 'center' }}>
                    {day.map((v, j) => (
                      <View
                        key={j}
                        style={{
                          width: 18, height: 18, borderRadius: 4,
                          backgroundColor: v === 0 ? 'rgba(255,255,255,0.08)' : '#4CAF50',
                          opacity: v === 0 ? 1 : 0.25 + v * 0.18,
                          borderWidth: 1, borderColor: BORDER,
                        }}
                      />
                    ))}
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 4 }}>
                      {'DLMJVSD'.split('')[i]}
                    </Text>
                  </View>
                ))}
              </View>
            </Glass>
          </View>

          {/* Nutrition (moyennes) */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Nutrition (moyennes)</ThemedText>
            <Glass>
              {macros.map((m, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: i === macros.length - 1 ? 0 : 12 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: m.color, marginRight: 8 }} />
                  <Text style={{ color: '#fff', flex: 1 }}>{m.name}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', width: 64, textAlign: 'right' }}>{m.g} g</Text>
                </View>
              ))}
            </Glass>
          </View>

          {/* Mini-cards Steps / Elevation / Hydratation / Pace (alignées) */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {healthMetrics.map((metric, index) => (
                <Tile key={index}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name={metric.icon as any} size={18} color={metric.color} />
                      <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{metric.label}</Text>
                    </View>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', marginVertical: 8 }}>{metric.value}</Text>
                  </View>
                  <Sparkline values={metric.series} color={metric.color} />
                </Tile>
              ))}
            </View>
          </View>

          {/* Records & Comparaison */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Records & Comparaison</ThemedText>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Glass style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <Ionicons name="trophy" size={28} color="#FFD700" />
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Distance max</Text>
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>
                    {healthDistance > 0 ? (healthDistance / 1000).toFixed(1) : '0.0'} km
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                    Aujourd&apos;hui
                  </Text>
                </View>
              </Glass>

              <Glass style={{ flex: 1 }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 10 }}>Comparaison 7 jours</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#fff', fontWeight: '800' }}>Semaine précédente</Text>
                    <Text style={{ color: '#FFD700' }}>
                      0k Kcal
                    </Text>
                  </View>
                  <View style={{ width: 1, height: 30, backgroundColor: BORDER }} />
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#fff', fontWeight: '800' }}>Cette semaine</Text>
                    <Text style={{ color: '#4CAF50' }}>
                      {healthCalories > 0 ? Math.round(healthCalories / 1000) : 0}k Kcal
                    </Text>
                  </View>
                </View>
                <View style={{ height: 10 }} />
                <Text style={{ 
                  color: '#4CAF50', 
                  fontWeight: '800', 
                  textAlign: 'center' 
                }}>
                  Données d&apos;aujourd&apos;hui
                </Text>
              </Glass>
            </View>
          </View>

          {/* Streaks & complétion */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Tile style={{ width: '47%' }}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="flame" size={18} color="#FFD700" />
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Meilleur streak</Text>
                  </View>
                  <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 8 }}>{longestStreak} semaines</Text>
                </View>
              </Tile>

              <Tile style={{ width: '47%' }}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="aperture" size={18} color="#4CAF50" />
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Taux complétion</Text>
                  </View>
                  <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 8 }}>{completionRate}%</Text>
                </View>
              </Tile>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RevoColors.background },
  safeArea: { flex: 1 },
  section: { paddingHorizontal: 20, marginBottom: 22 },
  sectionTitle: { fontSize: 20, color: '#fff', fontWeight: '700', marginBottom: 12 },
});
