/**
 * RevoFit Color Palette
 * Couleurs principales de l'application RevoFit
 */

// Couleurs principales RevoFit
export const RevoColors = {
  // Couleurs de base
  primary: '#FFD700',      // Jaune signature RevoFit
  background: '#000000',   // Noir profond
  surface: '#2A2A2A',      // Gris foncé pour cartes
  text: '#FFFFFF',         // Blanc principal
  textSecondary: '#B0B0B0', // Gris clair pour sous-textes
  
  // Couleurs fitness
  cardio: '#FF6B6B',       // Rouge énergique
  strength: '#4ECDC4',     // Turquoise
  hiit: '#FFD93D',         // Jaune vif
  yoga: '#B388FF',         // Violet apaisant
  
  // Couleurs nutrition
  calories: '#FFD700',     // Jaune (même que primary)
  proteins: '#FF6B6B',     // Rouge
  carbs: '#4ECDC4',        // Turquoise
  fats: '#FFA726',         // Orange
  
  // Couleurs d'état
  success: '#4CAF50',      // Vert
  error: '#F44336',        // Rouge
  warning: '#FF9800',      // Orange
  info: '#2196F3',         // Bleu
} as const;

// Couleurs pour thème clair/sombre (compatibilité)
const tintColorLight = RevoColors.primary;
const tintColorDark = RevoColors.primary;

export const Colors = {
  light: {
    text: RevoColors.background,
    background: RevoColors.text,
    tint: tintColorLight,
    icon: RevoColors.textSecondary,
    tabIconDefault: RevoColors.textSecondary,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: RevoColors.text,
    background: RevoColors.background,
    tint: tintColorDark,
    icon: RevoColors.textSecondary,
    tabIconDefault: RevoColors.textSecondary,
    tabIconSelected: tintColorDark,
  },
};
