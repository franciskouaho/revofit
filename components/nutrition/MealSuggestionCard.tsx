/**
 * Composant carte de suggestion de repas
 * RevoFit - Affichage des suggestions de repas personnalisées
 */

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MealSuggestion } from '../../services/firebase/nutritionPlan';
import { ThemedText } from '../ThemedText';

interface MealSuggestionCardProps {
  suggestion: MealSuggestion;
  onPress: () => void;
  onAddToPlan: () => void;
}

export function MealSuggestionCard({ suggestion, onPress, onAddToPlan }: MealSuggestionCardProps) {
  const { recipe } = suggestion;

  const getCategoryColor = (category: string) => {
    const colors = {
      breakfast: '#FFD700',
      lunch: '#4CAF50',
      snack: '#FF9800',
      dinner: '#9C27B0',
    };
    return colors[category as keyof typeof colors] || '#FFD700';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      breakfast: 'sunny',
      lunch: 'restaurant',
      snack: 'cafe',
      dinner: 'moon',
    };
    return icons[category as keyof typeof icons] || 'restaurant';
  };

  const categoryColor = getCategoryColor(recipe.category);
  const categoryIcon = getCategoryIcon(recipe.category);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.card}>
        <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
        
        {/* Image avec overlay */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: recipe.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop'
            }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Ionicons name={categoryIcon as any} size={12} color="#000" />
          </View>
          <View style={styles.difficultyBadge}>
            <ThemedText style={styles.difficultyText}>
              {recipe.difficulty === 'easy' ? 'Facile' : recipe.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
            </ThemedText>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title} numberOfLines={2}>
              {recipe.name}
            </ThemedText>
            <View style={styles.stats}>
              <ThemedText style={styles.calories}>{recipe.calories} kcal</ThemedText>
              <ThemedText style={styles.time}>{recipe.prepTime} min</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.description} numberOfLines={2}>
            {recipe.description}
          </ThemedText>

          {/* Macronutriments */}
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <ThemedText style={styles.macroLabel}>P</ThemedText>
              <ThemedText style={styles.macroValue}>{recipe.protein}g</ThemedText>
            </View>
            <View style={styles.macroItem}>
              <ThemedText style={styles.macroLabel}>G</ThemedText>
              <ThemedText style={styles.macroValue}>{recipe.carbs}g</ThemedText>
            </View>
            <View style={styles.macroItem}>
              <ThemedText style={styles.macroLabel}>L</ThemedText>
              <ThemedText style={styles.macroValue}>{recipe.fats}g</ThemedText>
            </View>
            <View style={styles.macroItem}>
              <ThemedText style={styles.macroLabel}>F</ThemedText>
              <ThemedText style={styles.macroValue}>{recipe.fiber}g</ThemedText>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </View>
            ))}
          </View>

          {/* Reason */}
          <View style={styles.reasonContainer}>
            <Ionicons name="bulb" size={14} color="#FFD700" />
            <ThemedText style={styles.reasonText} numberOfLines={2}>
              {suggestion.reason}
            </ThemedText>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={onAddToPlan}
            >
              <LinearGradient
                colors={[categoryColor, categoryColor + 'CC']}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add-circle" size={18} color="#fff" />
                <Text style={styles.addButtonText}>Ajouter au plan</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
              <Ionicons name="eye" size={16} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  stats: {
    alignItems: 'flex-end',
  },
  calories: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    lineHeight: 16,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(76,175,80,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,215,0,0.1)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 11,
    color: '#FFD700',
    marginLeft: 6,
    flex: 1,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    flex: 1,
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  detailsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
