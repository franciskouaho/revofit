// app/(tabs)/nutrition.tsx
import { MealSuggestionCard } from '@/components/nutrition/MealSuggestionCard';
import { NutritionPlanCard } from '@/components/nutrition/NutritionPlanCard';
import { ThemedText } from '@/components/ThemedText';
import { RevoColors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useNutrition } from '@/hooks/useNutrition';
import { useNutritionPlan } from '@/hooks/useNutritionPlan';
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function NutritionScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'suggestions'>('overview');

  // Récupération des données utilisateur depuis l'auth
  const { user } = useAuth();

  // Données nutritionnelles réelles
  const {
    dailyNutrition,
    recipes,
    loading,
    error,
    searchRecipes,
    loadRecipes,
  } = useNutrition();

  // Plans nutritionnels personnalisés
  const {
    userProfile,
    nutritionPlans,
    activePlan,
    mealSuggestions,
    createPersonalizedPlan,
    generateMealSuggestions,
    activatePlan,
  } = useNutritionPlan();

  // Calcul des objectifs nutritionnels basés sur les données utilisateur
  const calculateNutritionGoals = () => {
    // Utiliser les données du profil ou des valeurs par défaut
    const profile = userProfile || {
      age: 25,
      gender: 'male' as const,
      weight: 70,
      height: 175,
      activityLevel: 'moderate' as const
    };

    // Calcul basé sur les données du profil
    const age = profile.age;
    const weight = profile.weight;
    const height = profile.height;
    const activityLevel = profile.activityLevel;
    
    // Calcul des calories de base (Harris-Benedict)
    const isMale = profile.gender === 'male';
    let bmr = isMale 
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    
    // Facteur d'activité
    const activityFactors = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };
    
    const tdee = bmr * (activityFactors[activityLevel as keyof typeof activityFactors] || 1.55);
    const calories = Math.round(tdee);
    
    // Calcul des macronutriments
    const protein = Math.round(weight * 2.2); // 2.2g par kg
    const carbs = Math.round(calories * 0.45 / 4); // 45% des calories
    const fats = Math.round(calories * 0.25 / 9); // 25% des calories

    return [
      { 
        name: 'Calories',   
        current: dailyNutrition?.totalCalories || 0, 
        target: calories, 
        unit: 'kcal', 
        color: '#FFD700', 
        icon: 'flame' 
      },
      { 
        name: 'Protéines',  
        current: dailyNutrition?.totalProtein || 0, 
        target: protein, 
        unit: 'g',    
        color: '#4CAF50', 
        icon: 'fitness' 
      },
      { 
        name: 'Glucides',   
        current: dailyNutrition?.totalCarbs || 0, 
        target: carbs, 
        unit: 'g',    
        color: '#FF6B6B', 
        icon: 'leaf' 
      },
      { 
        name: 'Lipides',    
        current: dailyNutrition?.totalFats || 0, 
        target: fats, 
        unit: 'g',    
        color: '#9C27B0', 
        icon: 'water' 
      },
    ];
  };

  const nutritionGoals = calculateNutritionGoals();

  const mealCategories = [
    { name: 'Petit-déjeuner', icon: 'sunny',       color: '#FFD700' },
    { name: 'Déjeuner',        icon: 'restaurant',  color: '#4CAF50' },
    { name: 'Goûter',          icon: 'cafe',        color: '#FF9800' },
    { name: 'Dîner',           icon: 'moon',        color: '#9C27B0' },
  ];

  // Gérer la recherche de recettes
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchRecipes(query);
    } else {
      await loadRecipes();
    }
  };

  // Gérer la création d'un plan personnalisé
  const handleCreatePlan = async (goal: 'maintain' | 'lose' | 'gain') => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer un plan nutritionnel');
      return;
    }

    if (!userProfile) {
      Alert.alert('Erreur', 'Profil utilisateur non trouvé. Veuillez réessayer.');
      return;
    }

    try {
      await createPersonalizedPlan(goal, 7);
      setActiveTab('plans');
      Alert.alert('Succès', 'Plan nutritionnel créé avec succès !');
    } catch (err) {
      console.error('Erreur création plan:', err);
      Alert.alert('Erreur', 'Impossible de créer le plan nutritionnel. Veuillez réessayer.');
    }
  };

  // Gérer l'ajout d'un repas suggéré
  const handleAddMeal = async (suggestion: any) => {
    try {
      // Ici on pourrait ajouter la recette au plan ou aux repas du jour
      console.log('🍽️ Ajout du repas suggéré:', suggestion);
      Alert.alert('Succès', 'Repas ajouté à votre plan nutritionnel');
    } catch (err) {
      console.error('Erreur ajout repas:', err);
      Alert.alert('Erreur', 'Impossible d\'ajouter le repas');
    }
  };

  // Recettes affichées (recherche ou toutes)
  const displayedRecipes = recipes;

  // Supprimé car non utilisé

  // États de chargement et d'erreur
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
          locations={[0, 0.15, 0.7, 1]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={{ color: '#fff', marginTop: 16 }}>Chargement des données nutritionnelles...</Text>
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
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
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
      {/* fond gradient thème */}
      <LinearGradient
        colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
        locations={[0, 0.15, 0.7, 1]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Header simple comme les autres pages */}
          <View style={styles.header}>
            <View style={styles.headerInner}>
              <ThemedText style={styles.headerTitle}>Nutrition</ThemedText>
              <View style={styles.headerSpacer} />
            </View>
          </View>

          {/* Tabs de navigation modernisés */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabsWrapper}>
              {[
                { id: 'overview', label: 'Vue d\'ensemble' },
                { id: 'plans', label: 'Mes plans' },
                { id: 'suggestions', label: 'Suggestions' },
              ].map((tab) => (
                <TouchableOpacity key={tab.id} style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]} onPress={() => setActiveTab(tab.id as any)} activeOpacity={0.7}>
                  <View style={styles.tabContent}>
                    <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]} numberOfLines={1}>{tab.label}</Text>
                  </View>
                  {activeTab === tab.id && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Search bar (glass) */}
          <View style={styles.searchContainer}>
            <View style={styles.searchGlass}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.searchInner}>
                <Ionicons name="search" size={18} color="rgba(255,255,255,0.7)" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher des recettes..."
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
                <Ionicons name="filter" size={18} color="rgba(255,255,255,0.7)" />
              </View>
            </View>
          </View>

          {/* Contenu selon l'onglet actif */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Summary Card */}
              <View style={styles.section}>
                <View style={styles.summaryCard}>
                  <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
                  <View style={styles.summaryContent}>
                    <View style={styles.summaryHeader}>
                      <View style={styles.summaryIconContainer}>
                        <Ionicons name="trending-up" size={24} color="#FFD700" />
                      </View>
                      <View style={styles.summaryTextContainer}>
                        <ThemedText style={styles.summaryTitle}>Aujourd&apos;hui</ThemedText>
                        <ThemedText style={styles.summarySubtitle}>
                          {new Date().toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </ThemedText>
                      </View>
                      <View style={styles.summaryBadge}>
                        <ThemedText style={styles.summaryBadgeText}>Actif</ThemedText>
                      </View>
                    </View>
                    
                    <View style={styles.summaryStats}>
                      <View style={styles.summaryStatItem}>
                        <ThemedText style={styles.summaryStatValue}>
                          {dailyNutrition?.totalCalories || 0}
                        </ThemedText>
                        <ThemedText style={styles.summaryStatLabel}>Calories</ThemedText>
                      </View>
                      <View style={styles.summaryStatDivider} />
                      <View style={styles.summaryStatItem}>
                        <ThemedText style={styles.summaryStatValue}>
                          {nutritionPlans.length}
                        </ThemedText>
                        <ThemedText style={styles.summaryStatLabel}>Plans</ThemedText>
                      </View>
                      <View style={styles.summaryStatDivider} />
                      <View style={styles.summaryStatItem}>
                        <ThemedText style={styles.summaryStatValue}>
                          {mealSuggestions.length}
                        </ThemedText>
                        <ThemedText style={styles.summaryStatLabel}>Suggestions</ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Goals avec design amélioré */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText style={styles.sectionTitle}>Objectifs Nutritionnels</ThemedText>
                  <TouchableOpacity style={styles.refreshButton}>
                    <Ionicons name="refresh" size={18} color="#FFD700" />
                  </TouchableOpacity>
                </View>
                <View style={styles.goalsGrid}>
                  {nutritionGoals.map((goal, index) => {
                    const progress = Math.min((goal.current / goal.target) * 100, 100);
                    const isOverGoal = progress > 100;
                    return (
                      <View key={index} style={[styles.goalCard, isOverGoal && styles.goalCardOver]}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                        <View style={styles.goalContent}>
                          <View style={styles.goalHeader}>
                            <View style={[styles.goalIcon, { backgroundColor: goal.color }]}>
                              <Ionicons name={goal.icon as any} size={16} color="#000" />
                            </View>
                            <View style={styles.goalTextContainer}>
                              <ThemedText style={styles.goalName}>{goal.name}</ThemedText>
                              <ThemedText style={styles.goalUnit}>{goal.unit}</ThemedText>
                            </View>
                            {isOverGoal && (
                              <View style={styles.overGoalBadge}>
                                <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                              </View>
                            )}
                          </View>
                          
                          <View style={styles.goalValues}>
                            <ThemedText style={styles.goalCurrent}>{goal.current}</ThemedText>
                            <ThemedText style={styles.goalSeparator}>/</ThemedText>
                            <ThemedText style={styles.goalTarget}>{goal.target}</ThemedText>
                          </View>
                          
                          <View style={styles.goalProgressContainer}>
                            <View style={styles.goalProgressBar}>
                              <View style={[
                                styles.goalProgressFill, 
                                { 
                                  width: `${Math.min(progress, 100)}%`, 
                                  backgroundColor: isOverGoal ? '#4CAF50' : goal.color 
                                }
                              ]} />
                            </View>
                            <ThemedText style={styles.goalProgressText}>
                              {Math.round(progress)}%
                            </ThemedText>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Quick Actions améliorées */}
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Actions Rapides</ThemedText>
                <View style={styles.quickActionsGrid}>
                  <TouchableOpacity style={styles.quickActionCard}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.quickActionContent}>
                      <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(76,175,80,0.2)' }]}>
                        <Ionicons name="add-circle" size={24} color="#4CAF50" />
                      </View>
                      <ThemedText style={styles.quickActionTitle}>Ajouter un repas</ThemedText>
                      <ThemedText style={styles.quickActionSubtitle}>Enregistrer votre repas</ThemedText>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.quickActionCard}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.quickActionContent}>
                      <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(255,215,0,0.2)' }]}>
                        <Ionicons name="calendar" size={24} color="#FFD700" />
                      </View>
                      <ThemedText style={styles.quickActionTitle}>Planifier</ThemedText>
                      <ThemedText style={styles.quickActionSubtitle}>Créer un plan</ThemedText>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.quickActionCard}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.quickActionContent}>
                      <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(255,107,107,0.2)' }]}>
                        <Ionicons name="analytics" size={24} color="#FF6B6B" />
                      </View>
                      <ThemedText style={styles.quickActionTitle}>Analyser</ThemedText>
                      <ThemedText style={styles.quickActionSubtitle}>Voir les stats</ThemedText>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.quickActionCard}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.quickActionContent}>
                      <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(156,39,176,0.2)' }]}>
                        <Ionicons name="bulb" size={24} color="#9C27B0" />
                      </View>
                      <ThemedText style={styles.quickActionTitle}>Suggestions</ThemedText>
                      <ThemedText style={styles.quickActionSubtitle}>Recevoir des idées</ThemedText>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {activeTab === 'plans' && (
            <>
              {/* Plans nutritionnels */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText style={styles.sectionTitle}>Mes Plans Nutritionnels</ThemedText>
                </View>

                {nutritionPlans.length === 0 ? (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyStateIcon}>
                      <Ionicons name="calendar-outline" size={64} color="rgba(255,215,0,0.3)" />
                    </View>
                    <ThemedText style={styles.emptyTitle}>Aucun plan nutritionnel</ThemedText>
                    <ThemedText style={styles.emptyDescription}>
                      Créez votre premier plan personnalisé basé sur vos objectifs et préférences
                    </ThemedText>
                    <View style={styles.createPlanButtons}>
                      <TouchableOpacity 
                        style={[styles.createPlanButton, styles.createPlanButtonLose]}
                        onPress={() => handleCreatePlan('lose')}
                      >
                        <LinearGradient
                          colors={['#FF6B6B', '#FF5252']}
                          style={styles.createPlanGradient}
                        >
                          <Ionicons name="trending-down" size={20} color="#fff" />
                          <ThemedText style={styles.createPlanText}>Perte de poids</ThemedText>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.createPlanButton, styles.createPlanButtonGain]}
                        onPress={() => handleCreatePlan('gain')}
                      >
                        <LinearGradient
                          colors={['#4CAF50', '#45A049']}
                          style={styles.createPlanGradient}
                        >
                          <Ionicons name="trending-up" size={20} color="#fff" />
                          <ThemedText style={styles.createPlanText}>Prise de muscle</ThemedText>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.createPlanButton, styles.createPlanButtonMaintain]}
                        onPress={() => handleCreatePlan('maintain')}
                      >
                        <LinearGradient
                          colors={['#FFD700', '#F5C500']}
                          style={styles.createPlanGradient}
                        >
                          <Ionicons name="trending-up" size={20} color="#000" />
                          <ThemedText style={[styles.createPlanText, { color: '#000' }]}>Maintien</ThemedText>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    {/* Active Plan Highlight */}
                    {activePlan && (
                      <View style={styles.activePlanHighlight}>
                        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
                        <View style={styles.activePlanContent}>
                          <View style={styles.activePlanHeader}>
                            <View style={styles.activePlanIcon}>
                              <Ionicons name="star" size={20} color="#FFD700" />
                            </View>
                            <View style={styles.activePlanText}>
                              <ThemedText style={styles.activePlanTitle}>Plan Actif</ThemedText>
                              <ThemedText style={styles.activePlanName}>{activePlan.name}</ThemedText>
                            </View>
                            <View style={styles.activePlanBadge}>
                              <ThemedText style={styles.activePlanBadgeText}>En cours</ThemedText>
                            </View>
                          </View>
                          <View style={styles.activePlanStats}>
                            <View style={styles.activePlanStat}>
                              <ThemedText style={styles.activePlanStatValue}>{activePlan.duration}</ThemedText>
                              <ThemedText style={styles.activePlanStatLabel}>jours</ThemedText>
                            </View>
                            <View style={styles.activePlanStat}>
                              <ThemedText style={styles.activePlanStatValue}>{activePlan.dailyCalories}</ThemedText>
                              <ThemedText style={styles.activePlanStatLabel}>kcal/jour</ThemedText>
                            </View>
                            <View style={styles.activePlanStat}>
                              <ThemedText style={styles.activePlanStatValue}>{activePlan.meals.length}</ThemedText>
                              <ThemedText style={styles.activePlanStatLabel}>repas</ThemedText>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                    
                    {/* Plans List */}
                    {nutritionPlans.map((plan) => (
                      <NutritionPlanCard
                        key={plan.id}
                        plan={plan}
                        isActive={plan.isActive}
                        onPress={() => {/* Navigation vers détails du plan */}}
                        onActivate={() => activatePlan(plan.id)}
                      />
                    ))}
                  </>
                )}
              </View>
            </>
          )}

          {activeTab === 'suggestions' && (
            <>
              {/* Suggestions de repas */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText style={styles.sectionTitle}>Suggestions Personnalisées</ThemedText>
                  <TouchableOpacity 
                    style={styles.refreshButton}
                    onPress={generateMealSuggestions}
                  >
                    <Ionicons name="refresh" size={18} color="#FFD700" />
                    <ThemedText style={styles.refreshButtonText}>Actualiser</ThemedText>
                  </TouchableOpacity>
                </View>

                {mealSuggestions.length === 0 ? (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyStateIcon}>
                      <Ionicons name="bulb-outline" size={64} color="rgba(255,215,0,0.3)" />
                    </View>
                    <ThemedText style={styles.emptyTitle}>Aucune suggestion</ThemedText>
                    <ThemedText style={styles.emptyDescription}>
                      Vos préférences ont été configurées lors de l&apos;onboarding.{"\n"}Générez des suggestions personnalisées basées sur vos objectifs.
                    </ThemedText>
                    <TouchableOpacity 
                      style={styles.setupProfileButton}
                      onPress={generateMealSuggestions}
                    >
                      <LinearGradient
                        colors={['#FFD700', '#F5C500']}
                        style={styles.setupProfileGradient}
                      >
                        <Ionicons name="bulb" size={20} color="#000" />
                        <ThemedText style={[styles.setupProfileText, { color: '#000' }]}>
                          Générer des suggestions
                        </ThemedText>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    {/* Suggestions Header */}
                    <View style={styles.suggestionsHeader}>
                      <View style={styles.suggestionsInfo}>
                        <Ionicons name="sparkles" size={20} color="#FFD700" />
                        <ThemedText style={styles.suggestionsInfoText}>
                          {mealSuggestions.length} suggestions trouvées
                        </ThemedText>
                      </View>
                      <View style={styles.suggestionsFilter}>
                        <TouchableOpacity style={styles.filterButton}>
                          <Ionicons name="filter" size={16} color="rgba(255,255,255,0.7)" />
                          <ThemedText style={styles.filterButtonText}>Filtrer</ThemedText>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Suggestions List */}
                    <View style={styles.suggestionsList}>
                      {mealSuggestions.map((suggestion, index) => (
                        <MealSuggestionCard
                          key={index}
                          suggestion={suggestion}
                          onPress={() => {/* Navigation vers détails de la recette */}}
                          onAddToPlan={() => handleAddMeal(suggestion)}
                        />
                      ))}
                    </View>
                  </>
                )}
              </View>
            </>
          )}

          {/* Meal categories – 2 colonnes pour ne plus couper le texte */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Catégories de Repas</ThemedText>
            <View style={styles.categoriesGrid}>
              {mealCategories.map((category, index) => (
                <TouchableOpacity key={index} style={styles.categoryCard}>
                  <View style={[styles.categoryIcon, { borderColor: category.color }]}>
                    <Ionicons name={category.icon as any} size={22} color={category.color} />
                  </View>
                  <Text
                    style={styles.categoryName}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recipes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Recettes Populaires</ThemedText>
              <TouchableOpacity><ThemedText style={styles.seeAllText}>Voir tout</ThemedText></TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipesScroll}>
              {displayedRecipes.map((recipe) => (
                <TouchableOpacity key={recipe.id} style={styles.recipeCard} activeOpacity={0.9}>
                  <Image source={{ uri: recipe.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop' }} style={styles.recipeImage} />
                  <View style={styles.recipeContent}>
                    <View style={styles.recipeHeader}>
                      <ThemedText style={styles.recipeName} numberOfLines={2}>{recipe.name}</ThemedText>
                      <View style={styles.recipeStats}>
                        <ThemedText style={styles.recipeCalories}>{recipe.calories} kcal</ThemedText>
                        <ThemedText style={styles.recipeTime}>{recipe.prepTime} min</ThemedText>
                      </View>
                    </View>
                    <View style={styles.recipeMacros}>
                      <View style={styles.macroItem}><ThemedText style={styles.macroLabel}>P</ThemedText><ThemedText style={styles.macroValue}>{recipe.protein}g</ThemedText></View>
                      <View style={styles.macroItem}><ThemedText style={styles.macroLabel}>G</ThemedText><ThemedText style={styles.macroValue}>{recipe.carbs}g</ThemedText></View>
                      <View style={styles.macroItem}><ThemedText style={styles.macroLabel}>L</ThemedText><ThemedText style={styles.macroValue}>{recipe.fats}g</ThemedText></View>
                    </View>
                    <View style={styles.recipeTags}>
                      {recipe.tags.slice(0, 2).map((tag, i) => (
                        <View key={i} style={styles.tag}><ThemedText style={styles.tagText}>{tag}</ThemedText></View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>

    </View>
  );
}

const BORDER = 'rgba(255,255,255,0.12)';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RevoColors.background },
  safeArea: { flex: 1 },

  header: { paddingHorizontal: 20, paddingBottom: 8 },
  
  headerInner: { 
    height: 52, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 14 
  },
  headerTitle: { fontSize: 20, color: '#fff', fontWeight: '900' },
  headerSpacer: { width: 36, height: 36 },

  // Tabs de navigation modernisés
  tabsContainer: { paddingHorizontal: 20, marginBottom: 20 },
  tabsWrapper: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 16, 
    padding: 4,
    borderWidth: 1, 
    borderColor: BORDER,
  },
  tabButton: {
    flex: 1, 
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabButtonActive: {
    backgroundColor: '#FFD700',
  },
  tabContent: {
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 16, 
    paddingHorizontal: 8, 
  },
  tabText: {
    fontSize: 12, 
    color: 'rgba(255,255,255,0.8)', 
    fontWeight: '600',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 2,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 2,
    backgroundColor: '#000',
    borderRadius: 1,
  },

  searchContainer: { paddingHorizontal: 20, marginBottom: 16 },
  searchGlass: {
    borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  searchInner: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, height: 46 },
  searchInput: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 0 },

  section: { paddingHorizontal: 20, marginBottom: 26 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 20, color: '#fff', fontWeight: '700', marginBottom: 14 },
  seeAllText: { color: '#4CAF50', fontSize: 14, fontWeight: '600' },

  goalsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    gap: 12 
  },

  // Categories – 2 colonnes pour éviter le texte coupé
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  categoryCard: {
    width: '48%',
    minHeight: 96,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  categoryName: {
    color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center', lineHeight: 20,
  },

  recipesScroll: { marginLeft: -20, paddingLeft: 20 },
  recipeCard: {
    width: 280, marginRight: 16, borderRadius: 16, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: BORDER,
  },
  recipeImage: { width: '100%', height: 160 },
  recipeContent: { padding: 16 },
  recipeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  recipeName: { flex: 1, marginRight: 8, color: '#fff', fontSize: 16, fontWeight: '700' },
  recipeStats: { alignItems: 'flex-end' },
  recipeCalories: { fontSize: 14, color: '#FFD700', fontWeight: '600' },
  recipeTime: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  recipeMacros: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  macroItem: { alignItems: 'center' },
  macroLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  macroValue: { fontSize: 14, color: '#fff', fontWeight: '600' },
  recipeTags: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: 'rgba(76,175,80,0.18)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 10, color: '#4CAF50', fontWeight: '700' },

  // Quick actions (nouveau)
  qaGlass: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  qaInner: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  qaIconCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  qaTitle: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // Summary Card
  summaryCard: {
    borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)',
    backgroundColor: 'rgba(255,215,0,0.05)', marginBottom: 20,
  },
  summaryContent: { padding: 20 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  summaryIconContainer: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,215,0,0.2)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  summaryTextContainer: { flex: 1 },
  summaryTitle: { fontSize: 20, color: '#fff', fontWeight: '800', marginBottom: 4 },
  summarySubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  summaryBadge: {
    backgroundColor: 'rgba(76,175,80,0.2)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1, borderColor: '#4CAF50',
  },
  summaryBadgeText: { color: '#4CAF50', fontSize: 12, fontWeight: '700' },
  summaryStats: { flexDirection: 'row', alignItems: 'center' },
  summaryStatItem: { flex: 1, alignItems: 'center' },
  summaryStatValue: { fontSize: 24, color: '#fff', fontWeight: '800', marginBottom: 4 },
  summaryStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  summaryStatDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16 },

  // Goals améliorés
  goalCard: {
    width: '48%',
    borderRadius: 16, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)', 
    marginBottom: 12,
  },
  goalCardOver: {
    borderColor: '#4CAF50', 
    backgroundColor: 'rgba(76,175,80,0.1)',
  },
  goalContent: { 
    padding: 14,
    height: 120,
    justifyContent: 'space-between',
  },
  goalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  goalIcon: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 8 
  },
  goalTextContainer: { 
    flex: 1 
  },
  goalName: { 
    fontSize: 14, 
    color: '#fff', 
    fontWeight: '700', 
    marginBottom: 2 
  },
  goalUnit: { 
    fontSize: 10, 
    color: 'rgba(255,255,255,0.7)' 
  },
  overGoalBadge: { 
    marginLeft: 4 
  },
  goalValues: { 
    flexDirection: 'row', 
    alignItems: 'baseline', 
    marginBottom: 8 
  },
  goalCurrent: { 
    fontSize: 20, 
    color: '#fff', 
    fontWeight: '800' 
  },
  goalSeparator: { 
    fontSize: 16, 
    color: 'rgba(255,255,255,0.5)', 
    marginHorizontal: 2 
  },
  goalTarget: { 
    fontSize: 16, 
    color: 'rgba(255,255,255,0.7)' 
  },
  goalProgressContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  goalProgressBar: { 
    flex: 1, 
    height: 6, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 3, 
    marginRight: 8 
  },
  goalProgressFill: { 
    height: '100%', 
    borderRadius: 3 
  },
  goalProgressText: { 
    fontSize: 10, 
    color: '#fff', 
    fontWeight: '600', 
    minWidth: 30, 
    textAlign: 'right' 
  },

  // Quick Actions
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickActionCard: {
    width: '48%', borderRadius: 16, overflow: 'hidden', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)',
  },
  quickActionContent: { padding: 16, alignItems: 'center' },
  quickActionIcon: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  quickActionTitle: { fontSize: 14, color: '#fff', fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  quickActionSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },

  // Buttons améliorés
  refreshButton: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)',
  },
  refreshButtonText: { color: '#FFD700', fontSize: 12, fontWeight: '600', marginLeft: 6 },

  // États vides améliorés
  emptyState: {
    alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20,
  },
  emptyStateIcon: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20, color: '#fff', fontWeight: '700', marginBottom: 12, textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20, marginBottom: 32,
  },
  createPlanButtons: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center',
  },
  createPlanButton: {
    borderRadius: 16, overflow: 'hidden', minWidth: 140,
  },
  createPlanButtonLose: { /* styles spécifiques si nécessaire */ },
  createPlanButtonGain: { /* styles spécifiques si nécessaire */ },
  createPlanButtonMaintain: { /* styles spécifiques si nécessaire */ },
  createPlanGradient: {
    paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
  },
  createPlanText: {
    color: '#fff', fontSize: 14, fontWeight: '700', marginLeft: 8,
  },
  setupProfileButton: {
    borderRadius: 16, overflow: 'hidden', marginTop: 16,
  },
  setupProfileGradient: {
    paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
  },
  setupProfileText: {
    color: '#000', fontSize: 14, fontWeight: '700', marginLeft: 8,
  },

  // Active Plan Highlight
  activePlanHighlight: {
    borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.1)', marginBottom: 20,
  },
  activePlanContent: { padding: 20 },
  activePlanHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  activePlanIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,215,0,0.2)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  activePlanText: { flex: 1 },
  activePlanTitle: { fontSize: 14, color: '#FFD700', fontWeight: '600', marginBottom: 4 },
  activePlanName: { fontSize: 18, color: '#fff', fontWeight: '700' },
  activePlanBadge: {
    backgroundColor: 'rgba(76,175,80,0.2)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1, borderColor: '#4CAF50',
  },
  activePlanBadgeText: { color: '#4CAF50', fontSize: 12, fontWeight: '700' },
  activePlanStats: { flexDirection: 'row', justifyContent: 'space-around' },
  activePlanStat: { alignItems: 'center' },
  activePlanStatValue: { fontSize: 20, color: '#fff', fontWeight: '800', marginBottom: 4 },
  activePlanStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },

  // Suggestions améliorées
  suggestionsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  suggestionsInfo: { flexDirection: 'row', alignItems: 'center' },
  suggestionsInfoText: { color: '#FFD700', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  suggestionsFilter: { /* styles pour le filtre */ },
  filterButton: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  filterButtonText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', marginLeft: 6 },
  suggestionsList: { /* styles pour la liste des suggestions */ },
});
