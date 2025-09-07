/**
 * Composant carte de plan nutritionnel
 * RevoFit - Affichage des plans nutritionnels personnalisés
 */

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NutritionPlan } from '../../services/firebase/nutritionPlan';
import { ThemedText } from '../ThemedText';

interface NutritionPlanCardProps {
  plan: NutritionPlan;
  isActive?: boolean;
  onPress: () => void;
  onActivate: () => void;
}

export function NutritionPlanCard({ plan, isActive, onPress, onActivate }: NutritionPlanCardProps) {
  const getGoalColor = (name: string) => {
    if (name.includes('Perte')) return '#FF6B6B';
    if (name.includes('Prise')) return '#4CAF50';
    return '#FFD700';
  };

  const getGoalIcon = (name: string) => {
    if (name.includes('Perte')) return 'trending-down';
    if (name.includes('Prise')) return 'trending-up';
    return 'trending-flat';
  };

  const goalColor = getGoalColor(plan.name);
  const goalIcon = getGoalIcon(plan.name);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.card, isActive && styles.activeCard]}>
        <BlurView intensity={isActive ? 25 : 20} tint="dark" style={StyleSheet.absoluteFill} />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: goalColor }]}>
              <Ionicons name={goalIcon as any} size={20} color="#000" />
            </View>
            <View style={styles.titleTextContainer}>
              <ThemedText style={styles.title} numberOfLines={2}>
                {plan.name}
              </ThemedText>
              <ThemedText style={styles.description} numberOfLines={1}>
                {plan.description}
              </ThemedText>
            </View>
          </View>
          
          {isActive && (
            <View style={styles.activeBadge}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.activeText}>Actif</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{plan.duration}</ThemedText>
            <ThemedText style={styles.statLabel}>jours</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{plan.dailyCalories}</ThemedText>
            <ThemedText style={styles.statLabel}>kcal/jour</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{plan.meals.length}</ThemedText>
            <ThemedText style={styles.statLabel}>repas</ThemedText>
          </View>
        </View>

        {/* Macronutriments */}
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: '#FF6B6B' }]} />
            <ThemedText style={styles.macroText}>P: {plan.dailyProtein}g</ThemedText>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: '#4CAF50' }]} />
            <ThemedText style={styles.macroText}>G: {plan.dailyCarbs}g</ThemedText>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: '#FFD700' }]} />
            <ThemedText style={styles.macroText}>L: {plan.dailyFats}g</ThemedText>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: goalColor }]}
            onPress={onActivate}
            disabled={isActive}
          >
            <Ionicons 
              name={isActive ? "checkmark" : "play"} 
              size={16} 
              color="#000" 
            />
            <Text style={styles.actionText}>
              {isActive ? 'Actif' : 'Activer'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
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
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  activeCard: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.1)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  activeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  macroText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  actionText: {
    color: '#000',
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
