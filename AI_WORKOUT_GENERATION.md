# 🤖 Génération de Plans d'Entraînement avec IA

## Vue d'ensemble

Cette fonctionnalité permet de générer des plans d'entraînement personnalisés en utilisant l'intelligence artificielle (OpenAI GPT). Les utilisateurs peuvent configurer leurs paramètres d'entraînement et obtenir un plan complet avec exercices, séries, répétitions et conseils.

## 🚀 Fonctionnalités

### Configuration des Paramètres
- **Équipement disponible** : Large Gym, Small Gym, Home Gym, No Equipment, etc.
- **Durée** : De 25 minutes à 1h30
- **Intensité** : Low, Medium, High
- **Groupes musculaires** : Sélection multiple (Chest, Back, Quads, etc.)
- **Informations supplémentaires** : Instructions personnalisées

### Génération IA
- Plans d'entraînement structurés et personnalisés
- Exercices adaptés à l'équipement disponible
- Séries, répétitions et temps de repos optimisés
- Conseils et instructions détaillées
- Estimation des calories brûlées

### Sauvegarde
- Conversion automatique en template d'entraînement
- Sauvegarde dans Firebase
- Intégration avec l'écran des workouts existant

## 🛠️ Configuration

### 1. Clé API OpenAI
Ajoutez votre clé API OpenAI dans le fichier `.env` :

```env
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Dépendances
Les dépendances suivantes sont déjà incluses :
- `@expo/vector-icons` - Icônes
- `expo-blur` - Effets de flou
- `expo-linear-gradient` - Dégradés
- `react-native-safe-area-context` - Gestion des zones sûres

## 📁 Structure des Fichiers

```
services/ai/
├── workoutGenerator.ts    # Service principal de génération IA
└── chatService.ts         # Service de chat IA existant

app/
└── generate-workout.tsx   # Interface utilisateur mise à jour
```

## 🔧 Utilisation

### 1. Accès à la Page
Naviguez vers `/generate-workout` depuis l'application.

### 2. Configuration
1. Sélectionnez votre équipement disponible
2. Choisissez la durée souhaitée
3. Définissez l'intensité
4. Sélectionnez les groupes musculaires à cibler
5. Ajoutez des informations supplémentaires (optionnel)

### 3. Génération
1. Cliquez sur "Generate Workout"
2. Attendez la génération (indicateur de chargement)
3. Consultez le plan généré

### 4. Sauvegarde
1. Cliquez sur "Sauvegarder" pour enregistrer le template
2. Le workout sera ajouté à vos templates personnels
3. Option "Voir mes workouts" pour naviguer vers la liste

## 🎯 Types de Données

### WorkoutGenerationParams
```typescript
interface WorkoutGenerationParams {
  equipment: string;
  duration: string;
  intensity: string;
  muscleGroups: string[];
  additionalInfo?: string;
}
```

### GeneratedWorkout
```typescript
interface GeneratedWorkout {
  title: string;
  description: string;
  exercises: GeneratedExercise[];
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  muscleGroups: string[];
  estimatedCalories: number;
  instructions: string[];
  tips: string[];
}
```

### GeneratedExercise
```typescript
interface GeneratedExercise {
  name: string;
  nameEn: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  sets: number;
  reps: number;
  rest: number;
  order: number;
}
```

## 🔄 Flux de Données

1. **Configuration** → L'utilisateur configure ses paramètres
2. **Génération** → Appel à l'API OpenAI avec prompt spécialisé
3. **Parsing** → Conversion de la réponse JSON en structure typée
4. **Affichage** → Interface utilisateur avec exercices détaillés
5. **Sauvegarde** → Conversion en template Firebase et sauvegarde

## 🎨 Interface Utilisateur

### États Visuels
- **Chargement** : Indicateur de progression avec texte "Génération..."
- **Résultat** : Carte détaillée avec exercices, statistiques et actions
- **Erreur** : Messages d'erreur contextuels

### Design
- Thème sombre cohérent avec l'application
- Effets de flou (BlurView) pour les cartes
- Dégradés verts (LIME) pour les éléments d'action
- Animations fluides pour les interactions

## 🚨 Gestion des Erreurs

### Erreurs Communes
1. **Clé API manquante** : Message explicatif avec instructions
2. **Erreur de génération** : Fallback avec workout basique
3. **Erreur de sauvegarde** : Message d'erreur avec option de réessayer
4. **Utilisateur non connecté** : Redirection vers l'authentification

### Fallback
En cas d'erreur de l'IA, un workout de base est généré avec :
- Exercices adaptés à l'équipement
- Paramètres par défaut selon l'intensité
- Structure minimale mais fonctionnelle

## 🔮 Améliorations Futures

### Fonctionnalités Avancées
- [ ] Génération de plans multi-séances
- [ ] Adaptation basée sur l'historique d'entraînement
- [ ] Intégration avec les données de santé
- [ ] Recommandations nutritionnelles
- [ ] Progression automatique des charges

### Optimisations
- [ ] Cache des workouts générés
- [ ] Templates prédéfinis populaires
- [ ] Export/Import de plans
- [ ] Partage de workouts entre utilisateurs

## 🧪 Tests

### Test Manuel
1. Configurez différents paramètres
2. Testez la génération avec/sans clé API
3. Vérifiez la sauvegarde des templates
4. Testez les cas d'erreur

### Test Automatisé
```typescript
// Exemple de test unitaire
describe('AIWorkoutGenerator', () => {
  it('should generate workout with valid parameters', async () => {
    const params = {
      equipment: 'Large Gym',
      duration: '1h 0m',
      intensity: 'Medium',
      muscleGroups: ['Chest', 'Back']
    };
    
    const workout = await AIWorkoutGenerator.generateWorkout(params);
    expect(workout.exercises.length).toBeGreaterThan(0);
    expect(workout.title).toBeDefined();
  });
});
```

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la configuration de la clé API
2. Consultez les logs de la console
3. Testez avec des paramètres simples
4. Vérifiez la connectivité réseau

---

**Note** : Cette fonctionnalité nécessite une clé API OpenAI valide pour fonctionner. En mode développement, des workouts de fallback sont générés si la clé n'est pas configurée.
