/**
 * RevoFit Typography Constants
 * Système de typographie cohérent pour l'application
 */

export const Typography = {
  // Familles de polices
  FontFamily: {
    // Logo et titres principaux
    PoppinsBold: 'Poppins-Bold',
    // Textes UI et contenu
    InterRegular: 'Inter-Regular',
    InterMedium: 'Inter-Medium',
  } as const,

  // Tailles de police
  FontSize: {
    xs: 12,      // Caption
    sm: 14,      // Body Small
    md: 16,      // Body Regular
    lg: 18,      // Body Large
    xl: 24,      // H3
    xxl: 36,     // H2
    xxxl: 48,    // H1
  } as const,

  // Poids des polices
  FontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  } as const,

  // Espacement des lettres
  LetterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 1,
  } as const,
} as const;

// Styles de texte prédéfinis
export const TextStyles = {
  // Titres
  H1: {
    fontFamily: Typography.FontFamily.PoppinsBold,
    fontSize: Typography.FontSize.xxxl,
    letterSpacing: Typography.LetterSpacing.normal,
  },
  H2: {
    fontFamily: Typography.FontFamily.PoppinsBold,
    fontSize: Typography.FontSize.xxl,
    letterSpacing: Typography.LetterSpacing.normal,
  },
  H3: {
    fontFamily: Typography.FontFamily.PoppinsBold,
    fontSize: Typography.FontSize.xl,
    letterSpacing: Typography.LetterSpacing.normal,
  },

  // Textes
  BodyLarge: {
    fontFamily: Typography.FontFamily.InterMedium,
    fontSize: Typography.FontSize.lg,
  },
  BodyRegular: {
    fontFamily: Typography.FontFamily.InterRegular,
    fontSize: Typography.FontSize.md,
  },
  BodySmall: {
    fontFamily: Typography.FontFamily.InterRegular,
    fontSize: Typography.FontSize.sm,
  },
  Caption: {
    fontFamily: Typography.FontFamily.InterRegular,
    fontSize: Typography.FontSize.xs,
  },
} as const; 