// app/(tabs)/nutrition.tsx
import { ThemedText } from '@/components/ThemedText';
import { RevoColors } from '@/constants/Colors';
import { useNutrition } from '@/hooks/useNutrition';
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from 'react';
import {
    ActivityIndicator,
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

  // Données nutritionnelles réelles
  const {
    dailyNutrition,
    nutritionGoal,
    recipes,
    loading,
    error,
    searchRecipes,
    loadRecipes,
  } = useNutrition();

  // Objectifs nutritionnels avec les vraies données
  const nutritionGoals = [
    { 
      name: 'Calories',   
      current: dailyNutrition?.totalCalories || 0, 
      target: nutritionGoal?.calories || 2200, 
      unit: 'kcal', 
      color: '#FFD700', 
      icon: 'flame' 
    },
    { 
      name: 'Protéines',  
      current: dailyNutrition?.totalProtein || 0, 
      target: nutritionGoal?.protein || 150, 
      unit: 'g',    
      color: '#4CAF50', 
      icon: 'fitness' 
    },
    { 
      name: 'Glucides',   
      current: dailyNutrition?.totalCarbs || 0, 
      target: nutritionGoal?.carbs || 250, 
      unit: 'g',    
      color: '#FF6B6B', 
      icon: 'leaf' 
    },
    { 
      name: 'Lipides',    
      current: dailyNutrition?.totalFats || 0, 
      target: nutritionGoal?.fats || 80, 
      unit: 'g',    
      color: '#9C27B0', 
      icon: 'water' 
    },
  ];

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

  // Recettes affichées (recherche ou toutes)
  const displayedRecipes = recipes.length > 0 ? recipes : [
    {
      id: '1',
      name: 'Bowl protéiné quinoa',
      category: 'lunch',
      calories: 420, protein: 28, carbs: 45, fats: 12, prepTime: 25, difficulty: 'easy',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
      tags: ['Végétarien', 'Riche en protéines', 'Sans gluten']
    },
    {
      id: '2',
      name: 'Smoothie vert énergisant',
      category: 'breakfast',
      calories: 180, protein: 15, carbs: 22, fats: 4, prepTime: 5, difficulty: 'easy',
      imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop',
      tags: ['Vegan', 'Rapide', 'Énergisant']
    },
    {
      id: '3',
      name: 'Saumon grillé légumes',
      category: 'dinner',
      calories: 380, protein: 35, carbs: 18, fats: 22, prepTime: 35, difficulty: 'medium',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop',
      tags: ['Oméga-3', 'Riche en protéines', 'Anti-inflammatoire']
    },
    {
      id: '4',
      name: 'Salade de pois chiches',
      category: 'snack',
      calories: 220, protein: 12, carbs: 28, fats: 8, prepTime: 15, difficulty: 'easy',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
      tags: ['Végétarien', 'Fibres', 'Rapide']
    }
  ];

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
          {/* Header glass */}
          <View style={styles.header}>
            <View style={{ borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.headerInner}>
                <ThemedText style={styles.headerTitle}>Nutrition</ThemedText>
                <TouchableOpacity style={styles.headerAdd}>
                  <Ionicons name="add" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
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

          {/* Goals */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Objectifs Nutritionnels</ThemedText>
            <View style={styles.goalsGrid}>
              {nutritionGoals.map((goal, index) => {
                const progress = Math.min((goal.current / goal.target) * 100, 100);
                return (
                  <View key={index} style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                      <View style={[styles.goalIcon, { backgroundColor: goal.color }]}>
                        <Ionicons name={goal.icon as any} size={16} color="#000" />
                      </View>
                      <ThemedText style={styles.goalName}>{goal.name}</ThemedText>
                    </View>
                    <ThemedText style={styles.goalValue}>
                      {goal.current}/{goal.target}
                    </ThemedText>
                    <ThemedText style={styles.goalUnit}>{goal.unit}</ThemedText>
                    <View style={styles.goalProgressBar}>
                      <View style={[styles.goalProgressFill, { width: `${progress}%`, backgroundColor: goal.color }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

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

          {/* Weekly plan (inchangé) */}
          {/* … tu peux garder ta section existante ici … */}

          {/* Quick Actions – nouveau layout */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Actions Rapides</ThemedText>

            {/* Rangée 1 : deux demi-cartes */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[styles.qaGlass, { flex: 1 }]}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.qaInner}>
                  <View style={[styles.qaIconCircle, { backgroundColor: 'rgba(76,175,80,0.2)', borderColor: '#4CAF50' }]}>
                    <Ionicons name="add" size={18} color="#4CAF50" />
                  </View>
                  <Text style={styles.qaTitle}>Ajouter un repas</Text>
                </View>
              </View>

              <View style={[styles.qaGlass, { flex: 1 }]}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.qaInner}>
                  <View style={[styles.qaIconCircle, { backgroundColor: 'rgba(255,215,0,0.2)', borderColor: '#FFD700' }]}>
                    <Ionicons name="calendar" size={18} color="#FFD700" />
                  </View>
                  <Text style={styles.qaTitle}>Planifier</Text>
                </View>
              </View>
            </View>

            {/* Rangée 2 : CTA pleine largeur */}
            <View style={{ height: 12 }} />
            <View style={[styles.qaGlass, { overflow: 'hidden' }]}>
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(0,0,0,0.25)']}
                style={StyleSheet.absoluteFill}
              />
              <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={[styles.qaInner, { justifyContent: 'space-between', flexDirection: 'row' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={[styles.qaIconCircle, { backgroundColor: 'rgba(255,107,107,0.18)', borderColor: '#FF6B6B' }]}>
                    <Ionicons name="analytics" size={18} color="#FF6B6B" />
                  </View>
                  <Text style={styles.qaTitle}>Analyser mes apports</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
              </View>
            </View>
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

  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10 },
  
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  headerTitle: { fontSize: 28, color: '#fff', fontWeight: '900' },
  headerAdd: {
    width: 40, height: 40, borderRadius: 100, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: BORDER,
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

  goalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  goalCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  goalIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  goalName: { fontSize: 14, color: '#fff', fontWeight: '600' },
  goalValue: { fontSize: 20, color: '#fff', fontWeight: '800', marginBottom: 2 },
  goalUnit: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10 },
  goalProgressBar: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' },
  goalProgressFill: { height: '100%', borderRadius: 3 },

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
});
