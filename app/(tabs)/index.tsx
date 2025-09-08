import Header from '@/components/Header';
import NotificationPermissionModal from '@/components/NotificationPermissionModal';
import WorkoutStatusBar from '@/components/StatusBar';
import { ThemedText } from '@/components/ThemedText';
import { RevoColors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationPermissions } from '@/hooks/useNotificationPermissions';
import { useRecommendedWorkouts } from '@/hooks/useRecommendedWorkouts';
import { useTodayWorkout } from '@/hooks/useTodayWorkout';
import { useWorkoutStatus } from '@/hooks/useWorkoutStatus';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHealthKitDataWrapper } from '@/hooks/useHealthKitDataWrapper';

const { width } = Dimensions.get('window');
const GLASS_BORDER = 'rgba(255,255,255,0.12)';
const GLASS_BG = 'rgba(255,255,255,0.06)';

export default function HomeScreen() {
  const router = useRouter();
  const { userProfile } = useAuth();
  
  // Hooks Firebase (sans les données de santé)
  const { workout: todayWorkout, loading: workoutLoading } = useTodayWorkout();
  const { workouts: recommended, loading: recommendedLoading } = useRecommendedWorkouts();
  const { status: workoutStatus, loading: statusLoading } = useWorkoutStatus();
  
  // Hook pour les permissions de notifications
  const { hasPermission, canAskAgain, isLoading: permissionsLoading } = useNotificationPermissions();
  
  // État pour le modal de permission de notifications
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  // Animation pour l'indicateur de chargement
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Hook pour les données de santé HealthKit (conditionnel)
  const { 
    steps: healthSteps, 
    distance: healthDistance, 
    flights: healthFlights, 
    calories: healthCalories,
    hasPermissions,
    isLoading: healthDataLoading,
    error: healthError,
    refreshData: refreshHealthData
  } = useHealthKitDataWrapper();
  

  // Debug logs pour les données de santé
  console.log('🔍 HomeScreen - healthSteps:', healthSteps);
  console.log('🔍 HomeScreen - healthDistance:', healthDistance);
  console.log('🔍 HomeScreen - healthFlights:', healthFlights);
  console.log('🔍 HomeScreen - healthCalories:', healthCalories);
  console.log('🔍 HomeScreen - hasPermissions:', hasPermissions);
  console.log('🔍 HomeScreen - healthError:', healthError);

  // Données par défaut mémorisées (sans les données de santé qui viennent de HealthKit)
  const defaultStats = useMemo(() => ({
    heartRate: 0,
    workouts: { completed: 0, total: 0 },
    streak: 0,
    points: 0,
    weeklyGoal: { done: 0, target: 5 },
  }), []);

  const defaultWorkout = useMemo(() => ({
    name: 'Chargement...',
    difficulty: 'beginner' as const,
    calories: 0,
    duration: 0,
    image: require('@/assets/images/onboarding-athlete.png'),
  }), []);

  const defaultRecommended = useMemo(() => [
    { id: 'rec1', name: 'Chargement...', tag: '...', img: require('@/assets/images/onboarding-athlete.png'), color: ['#11160a', 'transparent'] as [string, string], firstExercise: null, templateId: 'rec1' },
  ], []);

  const defaultStatus = useMemo(() => ({
    strikes: 0,
    currentDay: 'Mer',
    workoutMessage: "C'est l'heure de s'entraîner",
    upcomingDays: [
      { day: 18, label: 'Jeu' },
      { day: 19, label: 'Ven' },
      { day: 20, label: 'Sam' },
    ],
  }), []);

  // Utiliser les données Firebase ou les valeurs par défaut (sans les données de santé)
  const currentStats = defaultStats; // Plus de userStats Firebase pour les données de santé
  const currentWorkout = useMemo(() => todayWorkout || defaultWorkout, [todayWorkout, defaultWorkout]);
  const currentRecommended = useMemo(() => recommended.length > 0 ? recommended : defaultRecommended, [recommended, defaultRecommended]);
  const currentStatus = useMemo(() => workoutStatus || defaultStatus, [workoutStatus, defaultStatus]);
  
  // Utiliser uniquement les données HealthKit pour les données de santé
  const combinedStats = useMemo(() => ({
    ...currentStats,
    // Utiliser uniquement HealthKit pour les données de santé
    steps: hasPermissions ? healthSteps : 0,
    calories: hasPermissions ? healthCalories : 0,
  }), [currentStats, hasPermissions, healthSteps, healthCalories]);
  
  // Debug logs pour les stats combinées
  console.log('🔍 HomeScreen - healthSteps (HealthKit):', healthSteps);
  console.log('🔍 HomeScreen - combinedStats.steps (final):', combinedStats.steps);
  console.log('🔍 HomeScreen - healthCalories (HealthKit):', healthCalories);
  console.log('🔍 HomeScreen - combinedStats.calories (final):', combinedStats.calories);
  console.log('🔍 HomeScreen - hasPermissions:', hasPermissions);
  console.log('🔍 HomeScreen - healthError:', healthError);

  // Vérifier les permissions de notifications au chargement
  useEffect(() => {
    if (!permissionsLoading && !hasPermission && canAskAgain) {
      // Attendre un peu avant d'afficher le modal pour laisser le temps à l'écran de se charger
      const timer = setTimeout(() => {
        setShowNotificationModal(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [permissionsLoading, hasPermission, canAskAgain]);

  // Indicateur de chargement global (sans statsLoading)
  const isLoading = useMemo(() => 
    workoutLoading || recommendedLoading || statusLoading || healthDataLoading, 
    [workoutLoading, recommendedLoading, statusLoading, healthDataLoading]
  );

  // Animation de l'indicateur de chargement
  useEffect(() => {
    if (isLoading) {
      // Animation de pulsation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Animation de la barre de progression
      const progressAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ])
      );

      pulseAnimation.start();
      progressAnimation.start();

      return () => {
        pulseAnimation.stop();
        progressAnimation.stop();
      };
    } else {
      // Reset des animations quand le chargement se termine
      pulseAnim.setValue(1);
      progressAnim.setValue(0);
    }
  }, [isLoading, pulseAnim, progressAnim]);

  const handleNotificationPress = useCallback(() => router.push('/notifications'), [router]);
  const handleProfilePress = useCallback(() => router.push('/settings'), [router]);

  const progress = useMemo(() => 
    Math.min(1, combinedStats.weeklyGoal.done / Math.max(1, combinedStats.weeklyGoal.target)), 
    [combinedStats.weeklyGoal.done, combinedStats.weeklyGoal.target]
  );

  return (
    <View style={styles.container}>
      {/* Fond */}
      <LinearGradient
        colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
        locations={[0, 0.15, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <Header
          greeting="Bonjour"
          userName={userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Utilisateur"}
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
        />

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollView} 
          contentContainerStyle={{ paddingBottom: 120 }}
          removeClippedSubviews={true}
        >
          {/* Status bar */}
          <WorkoutStatusBar
            strikes={statusLoading ? 0 : currentStatus.strikes}
            currentDay={statusLoading ? '...' : currentStatus.currentDay}
            workoutMessage={statusLoading ? 'Chargement...' : currentStatus.workoutMessage}
            upcomingDays={statusLoading ? [] : currentStatus.upcomingDays}
          />

          {/* Statistiques */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Statistiques</ThemedText>
              <TouchableOpacity 
                onPress={refreshHealthData}
                disabled={healthDataLoading}
                style={styles.refreshButton}
              >
                <Ionicons 
                  name="refresh" 
                  size={20} 
                  color={healthDataLoading ? "#666" : "#FFD700"} 
                />
              </TouchableOpacity>
            </View>

            {/* Streak & Points */}
            <View style={styles.streakCard}>
              <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={[StyleSheet.absoluteFill, styles.border, { borderRadius: 18 }]} />
              <View style={styles.streakLeft}>
                <View style={styles.streakTitleRow}>
                  <Ionicons name="flame" size={18} color="#FFD700" />
                  <ThemedText style={styles.streakTitle}>Série actuelle</ThemedText>
                </View>
                <ThemedText style={styles.streakValue}>{combinedStats.streak} jours</ThemedText>

                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                </View>
                <ThemedText style={styles.progressText}>
                  Semaine : {combinedStats.weeklyGoal.done}/{combinedStats.weeklyGoal.target}
                </ThemedText>
              </View>

              <View style={styles.streakRight}>
                <View style={styles.pointsBadge}>
                  <Ionicons name="trophy" size={16} color="#000" />
                </View>
                <ThemedText style={styles.pointsValue}>{combinedStats.points}</ThemedText>
                <ThemedText style={styles.pointsLabel}>points</ThemedText>

                <TouchableOpacity style={styles.streakCTA} onPress={() => router.push('/workouts')}>
                  <LinearGradient colors={['#FFD700', '#E6C200']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.streakCTAGrad}>
                    <Ionicons name="flash" size={16} color="#000" />
                    <ThemedText style={styles.streakCTAText}>Booster</ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <GlassStat 
                icon="flame" 
                label="Calories" 
                value={`${combinedStats.calories} Kcal`} 
                subtitle={hasPermissions ? "Apple Health" : "Non disponible"}
              />
              <GlassStat 
                icon="footsteps" 
                label="Pas" 
                value={`${combinedStats.steps.toLocaleString()}`} 
                subtitle={hasPermissions ? "Apple Health" : "Non disponible"}
              />
              <GlassStat icon="heart" label="Battements" value={`${combinedStats.heartRate} bpm`} />
              <GlassStat icon="barbell" label="Entraînements" value={`${combinedStats.workouts.completed}/${combinedStats.workouts.total}`} />
            </View>


            {/* Données de santé supplémentaires */}
            {healthDistance > 0 && (
              <View style={styles.healthDataGrid}>
                <GlassStat 
                  icon="location" 
                  label="Distance" 
                  value={`${(healthDistance / 1000).toFixed(1)} km`} 
                />
              </View>
            )}

          </View>

          {/* Défi de la semaine */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Défi de la semaine</ThemedText>
            <View style={styles.challengeCard}>
              <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={[StyleSheet.absoluteFill, styles.border, { borderRadius: 20 }]} />
              <LinearGradient
                colors={['#11160a', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', inset: 0, opacity: 0.6, borderRadius: 20 }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={styles.challengeIcon}>
                  <Ionicons name="medal" size={22} color="#FFD700" />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.challengeTitle}>5 entraînements avant dimanche</ThemedText>
                  <ThemedText style={styles.challengeSub}>Rejoins le défi & gagne des points bonus</ThemedText>
                </View>
                <TouchableOpacity onPress={() => router.push('/workouts')}>
                  <LinearGradient colors={['#FFD700', '#E6C200']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.challengeBtn}>
                    <ThemedText style={styles.challengeBtnTxt}>Participer</ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Entraînement du jour */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Entraînement du jour</ThemedText>

            <View style={styles.workoutCardShell}>
              <Image source={currentWorkout.image} style={styles.workoutImage} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.workoutOverlay} />

              <BlurView intensity={30} tint="dark" style={styles.workoutGlassBar}>
                <View style={styles.workoutHeader}>
                  <View style={styles.difficultyBadgeGlass}>
                    <View style={styles.difficultyDot} />
                    <ThemedText style={styles.difficultyText}>
                      {workoutLoading ? 'Chargement...' : currentWorkout.difficulty}
                    </ThemedText>
                  </View>

                  <TouchableOpacity style={styles.favoriteButtonGlass}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                  </TouchableOpacity>
                </View>

                <ThemedText style={styles.workoutName}>
                  {workoutLoading ? 'Chargement de l\'entraînement...' : currentWorkout.name}
                </ThemedText>

                <View style={styles.workoutFooter}>
                  <TouchableOpacity 
                    style={styles.playButtonGlass} 
                    onPress={() => router.push('/workout')}
                    disabled={workoutLoading}
                  >
                    <Ionicons name="play" size={22} color="#0A0A0A" />
                  </TouchableOpacity>

                  <View style={styles.workoutDetails}>
                    <View style={styles.workoutDetail}>
                      <Ionicons name="flame" size={16} color="#FFD700" />
                      <ThemedText style={styles.workoutDetailText}>
                        {workoutLoading ? '...' : `${currentWorkout.calories} Kcal`}
                      </ThemedText>
                    </View>
                    <View style={styles.workoutDetail}>
                      <Ionicons name="time" size={16} color="#FFD700" />
                      <ThemedText style={styles.workoutDetailText}>
                        {workoutLoading ? '...' : `${currentWorkout.duration} min`}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.pillHighlightTop} pointerEvents="none" />
                <View style={styles.pillHighlightBottom} pointerEvents="none" />
              </BlurView>
            </View>
          </View>

          {/* Recommandés – carrousel */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Recommandés pour toi</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
              {currentRecommended.map((w) => (
                <TouchableOpacity 
                  key={w.id} 
                  activeOpacity={0.9} 
                  onPress={() => {
                    console.log('🔍 Clic sur carte recommandée:', w.name);
                    console.log('🔍 Données firstExercise:', w.firstExercise);
                    
                    if (w.firstExercise) {
                      // S'assurer que l'exercice a toutes les données nécessaires
                      const exerciseData = {
                        ...w.firstExercise,
                        id: w.firstExercise.id || `exercise-${Date.now()}`,
                        name: w.firstExercise.name || 'Exercice',
                        muscleGroups: w.firstExercise.muscleGroups || ['Groupe musculaire'],
                        equipment: w.firstExercise.equipment || ['Aucun'],
                        difficulty: w.firstExercise.difficulty || 'intermediate',
                        imageUrl: w.firstExercise.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&h=1200&fit=crop',
                        description: w.firstExercise.description || 'Description de l\'exercice'
                      };
                      
                      console.log('🔍 Données exercice complètes:', exerciseData);
                      
                      router.push({
                        pathname: '/workout/details',
                        params: {
                          exercise: JSON.stringify(exerciseData),
                          exerciseName: exerciseData.name,
                          templateId: w.templateId,
                          templateName: w.name
                        }
                      });
                    } else {
                      // Fallback vers la liste des exercices si pas d'exercice
                      router.push({
                        pathname: '/template-exercises',
                        params: { templateId: w.templateId }
                      });
                    }
                  }}
                  disabled={recommendedLoading}
                >
                  <View style={styles.recCard}>
                    <Image source={w.img} style={styles.recImg} />
                    <LinearGradient colors={w.color} style={styles.recShade} />
                    <BlurView intensity={22} tint="dark" style={styles.recGlass}>
                      <ThemedText style={styles.recTitle} numberOfLines={1}>
                        {recommendedLoading ? 'Chargement...' : w.name}
                      </ThemedText>
                      <View style={styles.recTag}>
                        <Ionicons name="time" size={12} color="#FFD700" />
                        <ThemedText style={styles.recTagTxt}>
                          {recommendedLoading ? '...' : w.tag}
                        </ThemedText>
                      </View>
                    </BlurView>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Indicateur de chargement global */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.loadingContainer}>
            <View style={styles.loadingIconContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Animated.View 
                style={[
                  styles.loadingPulse,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.2],
                      outputRange: [0.3, 0.6],
                    }),
                  }
                ]} 
              />
            </View>
            <ThemedText style={styles.loadingText}>Chargement des données...</ThemedText>
            <ThemedText style={styles.loadingSubtext}>
              {workoutLoading && "Récupération de l'entraînement du jour..."}
              {recommendedLoading && "Chargement des recommandations..."}
              {statusLoading && "Mise à jour du statut..."}
              {healthDataLoading && "Synchronisation des données de santé..."}
            </ThemedText>
            <View style={styles.loadingProgressContainer}>
              <View style={styles.loadingProgressBar}>
                <Animated.View 
                  style={[
                    styles.loadingProgressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Modal de permission de notifications */}
      <NotificationPermissionModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </View>
  );
}

/* ===== Sous-vues ===== */
const GlassStat = React.memo(({ icon, label, value, subtitle }: { icon: any; label: string; value: string; subtitle?: string }) => {
  return (
    <BlurView intensity={28} tint="dark" style={styles.statCardGlass}>
      <View style={styles.statHeader}>
        <ThemedText style={styles.statLabel}>{label}</ThemedText>
        <Ionicons name={icon} size={16} color="#FFD700" />
      </View>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      {subtitle && (
        <ThemedText style={styles.statSubtitle}>{subtitle}</ThemedText>
      )}
      <View style={styles.cardHighlight} pointerEvents="none" />
    </BlurView>
  );
});

GlassStat.displayName = 'GlassStat';

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RevoColors.background },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },

  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  sectionTitle: { fontSize: 20, color: '#FFFFFF', fontWeight: '700' },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },

  border: { borderWidth: 1, borderColor: GLASS_BORDER },

  /* Streak card */
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    marginBottom: 12,
  },
  streakLeft: { flex: 1 },
  streakTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  streakTitle: { color: 'rgba(255,255,255,0.9)', fontWeight: '800', fontSize: 12 },
  streakValue: { color: '#fff', fontWeight: '900', fontSize: 22, marginTop: 2, marginBottom: 6 },
  progressTrack: { height: 8, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  progressBar: { height: 8, borderRadius: 6, backgroundColor: '#FFD700' },
  progressText: { color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 12, marginTop: 6 },

  streakRight: { alignItems: 'center', width: 110 },
  pointsBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FFD700', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  pointsValue: { color: '#fff', fontWeight: '900', fontSize: 18, lineHeight: 20 },
  pointsLabel: { color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontSize: 11, marginBottom: 8 },
  streakCTA: { width: '100%' },
  streakCTAGrad: { height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  streakCTAText: { color: '#000', fontWeight: '900', fontSize: 12 },

  /* Stats grid */
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  healthDataGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  statCardGlass: {
    width: '47%', minHeight: 100, padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: GLASS_BORDER, backgroundColor: GLASS_BG, overflow: 'hidden',
  },
  cardHighlight: { position: 'absolute', top: 0, left: 8, right: 8, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)' },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  statValue: { fontSize: 24, color: '#FFD700', fontWeight: '800' },
  statSubtitle: { fontSize: 10, color: '#888', fontWeight: '500', marginTop: 2 },

  /* Challenge */
  challengeCard: { borderRadius: 20, padding: 14, backgroundColor: GLASS_BG, borderWidth: 1, borderColor: GLASS_BORDER },
  challengeIcon: {
    width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,215,0,0.22)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.35)',
  },
  challengeTitle: { color: '#fff', fontWeight: '900', fontSize: 16 },
  challengeSub: { color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: 12 },
  challengeBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  challengeBtnTxt: { color: '#000', fontWeight: '900', fontSize: 12 },

  /* Workout of the day */
  workoutCardShell: {
    borderRadius: 20, overflow: 'hidden', position: 'relative', minHeight: 220,
    borderWidth: 1, borderColor: GLASS_BORDER, backgroundColor: '#1a1a1a',
  },
  workoutImage: { width: '100%', height: 220, resizeMode: 'cover' },
  workoutOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  workoutGlassBar: {
    position: 'absolute', left: 12, right: 12, bottom: 12, borderRadius: 20, borderWidth: 1,
    borderColor: GLASS_BORDER, backgroundColor: 'rgba(255,255,255,0.08)', padding: 16, overflow: 'hidden',
  },
  pillHighlightTop: { position: 'absolute', top: 0, left: 10, right: 10, height: 30, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)' },
  pillHighlightBottom: { position: 'absolute', bottom: 0, left: 10, right: 10, height: 26, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.16)' },
  workoutHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  difficultyBadgeGlass: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
    borderWidth: 1, borderColor: GLASS_BORDER, backgroundColor: 'rgba(76,175,80,0.15)',
  },
  difficultyDot: { width: 8, height: 8, backgroundColor: '#4CAF50', borderRadius: 4 },
  difficultyText: { fontSize: 12, color: '#A8E6A0', fontWeight: '700' },
  favoriteButtonGlass: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: GLASS_BORDER, backgroundColor: 'rgba(0,0,0,0.25)',
  },
  workoutName: { fontSize: 20, color: '#FFFFFF', fontWeight: '900', marginBottom: 12 },
  workoutFooter: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  playButtonGlass: {
    width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFD700',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.25)', shadowColor: '#FFD700', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 8,
  },
  workoutDetails: { flex: 1, flexDirection: 'row', gap: 20 },
  workoutDetail: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  workoutDetailText: { fontSize: 14, color: '#FFFFFF', fontWeight: '600' },

  /* Recommandés */
  recCard: {
    width: width * 0.62, height: 150, marginRight: 12, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: GLASS_BORDER, backgroundColor: '#141414',
  },
  recImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  recShade: { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 },
  recGlass: {
    position: 'absolute', left: 10, right: 10, bottom: 10, padding: 12, borderRadius: 14, borderWidth: 1,
    borderColor: GLASS_BORDER, backgroundColor: 'rgba(0,0,0,0.35)',
  },
  recTitle: { color: '#fff', fontWeight: '900', fontSize: 16 },
  recTag: {
    marginTop: 6, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: GLASS_BORDER, paddingHorizontal: 10,
    paddingVertical: 6, borderRadius: 10,
  },
  recTagTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },

  /* Loading overlay */
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 20,
    padding: 32,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  loadingIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  loadingText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    minHeight: 20,
  },
  loadingProgressContainer: {
    width: '100%',
    marginTop: 8,
  },
  loadingProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },


});