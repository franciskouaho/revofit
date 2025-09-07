// Constantes de textes en français pour RevoFit
export const Texts = {
  // Navigation
  navigation: {
    home: 'Accueil',
    features: 'Fonctionnalités',
    workouts: 'Entraînements',
    nutrition: 'Nutrition',
    coach: 'Coach',
    stats: 'Statistiques',
    profile: 'Profil',
  },

  // Onboarding
  onboarding: {
    welcome: 'Bienvenue sur',
    subtitle: 'Fitness personnalisé simple et efficace.',
    getStarted: 'Commencer',
    swipeInstruction: 'Glissez la flèche pour continuer',
    // Nouvelle page d'onboarding style scanner
    scannerTitle: 'SCANNER FITNESS',
    mainTitle: 'Découvrez ce que votre coach ne vous dit pas',
    description: 'Nos scanners détectent vos faiblesses cachées et vos progrès superflus.',
    alreadyHaveAccount: 'J&apos;ai déjà un compte',
    progressPercentage: '85%',
    // Page de sélection du genre
    genderSelection: {
      title: 'Parlez-nous de vous !',
      description: 'Pour vous offrir une meilleure expérience, nous devons connaître votre genre.',
      male: 'Homme',
      female: 'Femme',
      skip: 'Passer',
      back: 'Retour',
    },
  },

  // Welcome
  welcome: {
    welcome: 'Bienvenue sur',
    subtitle: 'Fitness personnalisé simple et efficace.',
    getStarted: 'Commencer',
  },

  // Height Input
  heightInput: {
    title: 'Quelle est votre taille ?',
    description: 'La taille aide à personnaliser les entraînements et suivre précisément vos progrès fitness.',
    units: {
      cm: 'cm',
      feet: 'pieds',
      inches: 'po',
    },
    next: 'Suivant',
  },

  // Home Screen
  home: {
    subtitle: 'Votre parcours fitness commence ici',
    welcomeTitle: 'Bienvenue sur RevoFit !',
    welcomeText: 'Votre parcours fitness personnalisé commence ici. Suivez vos entraînements, surveillez votre nutrition et obtenez un coaching en temps réel.',
    actions: {
      startWorkout: 'Commencer l\'entraînement',
      trackNutrition: 'Suivre la nutrition',
      chatWithCoach: 'Discuter avec un coach',
    },
  },

  // Explore Screen
  explore: {
    title: 'Explorer RevoFit',
    subtitle: 'Découvrez toutes les fonctionnalités',
    features: {
      workouts: {
        title: 'Entraînements personnalisés',
        description: 'Plans d\'entraînement alimentés par l\'IA adaptés à vos objectifs et niveau',
      },
      nutrition: {
        title: 'Suivi nutritionnel',
        description: 'Suivez calories, macros et planifiez vos repas pour des résultats optimaux',
      },
      coaching: {
        title: 'Coaching en temps réel',
        description: 'Discutez avec des coachs certifiés et obtenez des retours instantanés',
      },
      progress: {
        title: 'Analyses de progression',
        description: 'Graphiques visuels et insights pour suivre votre parcours fitness',
      },
    },
  },

  // Workout Status
  workoutStatus: {
    strikes: 'Série',
    currentStreak: 'Série actuelle',
    timeToWorkout: 'C\'est l\'heure de s\'entraîner',
  },

  // Common
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    retry: 'Réessayer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    done: 'Terminé',
    skip: 'Passer',
    continue: 'Continuer',
  },
} as const; 