/**
 * Modal de configuration du profil nutritionnel
 * RevoFit - Configuration du profil pour les plans personnalisés
 */

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { UserProfile } from '../../services/firebase/nutritionPlan';
import { ThemedText } from '../ThemedText';

interface ProfileSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (profile: Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  existingProfile?: UserProfile | null;
}

export function ProfileSetupModal({ visible, onClose, onSave, existingProfile }: ProfileSetupModalProps) {
  const [formData, setFormData] = useState({
    age: existingProfile?.age?.toString() || '',
    gender: existingProfile?.gender || 'male' as 'male' | 'female' | 'other',
    height: existingProfile?.height?.toString() || '',
    weight: existingProfile?.weight?.toString() || '',
    activityLevel: existingProfile?.activityLevel || 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goals: existingProfile?.goals || [],
    dietaryRestrictions: existingProfile?.dietaryRestrictions || [],
    preferences: existingProfile?.preferences || [],
  });

  const [selectedGoals, setSelectedGoals] = useState<string[]>(formData.goals);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(formData.dietaryRestrictions);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(formData.preferences);

  const goalsOptions = [
    { id: 'weight_loss', label: 'Perte de poids', icon: 'trending-down' },
    { id: 'muscle_gain', label: 'Prise de muscle', icon: 'trending-up' },
    { id: 'strength', label: 'Force', icon: 'fitness' },
    { id: 'endurance', label: 'Endurance', icon: 'heart' },
    { id: 'maintenance', label: 'Maintien', icon: 'trending-flat' },
    { id: 'health', label: 'Santé générale', icon: 'medical' },
  ];

  const restrictionsOptions = [
    { id: 'vegetarian', label: 'Végétarien' },
    { id: 'vegan', label: 'Végan' },
    { id: 'gluten_free', label: 'Sans gluten' },
    { id: 'dairy_free', label: 'Sans lactose' },
    { id: 'keto', label: 'Cétogène' },
    { id: 'paleo', label: 'Paléo' },
  ];

  const preferencesOptions = [
    { id: 'quick_meals', label: 'Repas rapides' },
    { id: 'high_protein', label: 'Riche en protéines' },
    { id: 'low_carb', label: 'Faible en glucides' },
    { id: 'mediterranean', label: 'Méditerranéen' },
    { id: 'asian', label: 'Asiatique' },
    { id: 'italian', label: 'Italien' },
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sédentaire', description: 'Peu ou pas d\'exercice' },
    { id: 'light', label: 'Léger', description: '1-3 jours/semaine' },
    { id: 'moderate', label: 'Modéré', description: '3-5 jours/semaine' },
    { id: 'active', label: 'Actif', description: '6-7 jours/semaine' },
    { id: 'very_active', label: 'Très actif', description: '2x par jour' },
  ];

  const handleSave = () => {
    // Validation
    if (!formData.age || !formData.height || !formData.weight) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const profile = {
      age: parseInt(formData.age),
      gender: formData.gender,
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      activityLevel: formData.activityLevel,
      goals: selectedGoals,
      dietaryRestrictions: selectedRestrictions,
      preferences: selectedPreferences,
    };

    onSave(profile);
    onClose();
  };

  const toggleSelection = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <LinearGradient
          colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
          locations={[0, 0.15, 0.7, 1]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <ThemedText style={styles.title}>Profil Nutritionnel</ThemedText>
              <View style={styles.placeholder} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Informations de base */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Informations de base</ThemedText>
              
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Âge *</ThemedText>
                <TextInput
                  style={styles.input}
                  value={formData.age}
                  onChangeText={(text) => setFormData({...formData, age: text})}
                  placeholder="25"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Genre</ThemedText>
                <View style={styles.radioGroup}>
                  {[
                    { id: 'male', label: 'Homme' },
                    { id: 'female', label: 'Femme' },
                    { id: 'other', label: 'Autre' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.radioOption,
                        formData.gender === option.id && styles.radioOptionSelected
                      ]}
                      onPress={() => setFormData({...formData, gender: option.id as any})}
                    >
                      <ThemedText style={[
                        styles.radioText,
                        formData.gender === option.id && styles.radioTextSelected
                      ]}>
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <ThemedText style={styles.label}>Taille (cm) *</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={formData.height}
                    onChangeText={(text) => setFormData({...formData, height: text})}
                    placeholder="175"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <ThemedText style={styles.label}>Poids (kg) *</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={formData.weight}
                    onChangeText={(text) => setFormData({...formData, weight: text})}
                    placeholder="70"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Niveau d'activité</ThemedText>
                {activityLevels.map((level) => (
                  <TouchableOpacity
                    key={level.id}
                    style={[
                      styles.activityOption,
                      formData.activityLevel === level.id && styles.activityOptionSelected
                    ]}
                    onPress={() => setFormData({...formData, activityLevel: level.id as any})}
                  >
                    <View style={styles.activityContent}>
                      <ThemedText style={[
                        styles.activityLabel,
                        formData.activityLevel === level.id && styles.activityLabelSelected
                      ]}>
                        {level.label}
                      </ThemedText>
                      <ThemedText style={[
                        styles.activityDescription,
                        formData.activityLevel === level.id && styles.activityDescriptionSelected
                      ]}>
                        {level.description}
                      </ThemedText>
                    </View>
                    {formData.activityLevel === level.id && (
                      <Ionicons name="checkmark" size={20} color="#FFD700" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Objectifs */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Objectifs</ThemedText>
              <View style={styles.optionsGrid}>
                {goalsOptions.map((goal) => (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.optionCard,
                      selectedGoals.includes(goal.id) && styles.optionCardSelected
                    ]}
                    onPress={() => toggleSelection(selectedGoals, setSelectedGoals, goal.id)}
                  >
                    <Ionicons 
                      name={goal.icon as any} 
                      size={20} 
                      color={selectedGoals.includes(goal.id) ? '#000' : '#FFD700'} 
                    />
                    <ThemedText style={[
                      styles.optionText,
                      selectedGoals.includes(goal.id) && styles.optionTextSelected
                    ]}>
                      {goal.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Restrictions alimentaires */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Restrictions alimentaires</ThemedText>
              <View style={styles.optionsGrid}>
                {restrictionsOptions.map((restriction) => (
                  <TouchableOpacity
                    key={restriction.id}
                    style={[
                      styles.optionCard,
                      selectedRestrictions.includes(restriction.id) && styles.optionCardSelected
                    ]}
                    onPress={() => toggleSelection(selectedRestrictions, setSelectedRestrictions, restriction.id)}
                  >
                    <ThemedText style={[
                      styles.optionText,
                      selectedRestrictions.includes(restriction.id) && styles.optionTextSelected
                    ]}>
                      {restriction.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Préférences */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Préférences culinaires</ThemedText>
              <View style={styles.optionsGrid}>
                {preferencesOptions.map((preference) => (
                  <TouchableOpacity
                    key={preference.id}
                    style={[
                      styles.optionCard,
                      selectedPreferences.includes(preference.id) && styles.optionCardSelected
                    ]}
                    onPress={() => toggleSelection(selectedPreferences, setSelectedPreferences, preference.id)}
                  >
                    <ThemedText style={[
                      styles.optionText,
                      selectedPreferences.includes(preference.id) && styles.optionTextSelected
                    ]}>
                      {preference.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerGlass}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <LinearGradient
                colors={['#FFD700', '#F5C500']}
                style={styles.saveButtonGradient}
              >
                <ThemedText style={styles.saveButtonText}>Sauvegarder le profil</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  radioOptionSelected: {
    backgroundColor: '#FFD700',
  },
  radioText: {
    color: '#fff',
    fontWeight: '600',
  },
  radioTextSelected: {
    color: '#000',
  },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activityOptionSelected: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderColor: '#FFD700',
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  activityLabelSelected: {
    color: '#FFD700',
  },
  activityDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  activityDescriptionSelected: {
    color: 'rgba(255,215,0,0.8)',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: '45%',
  },
  optionCardSelected: {
    backgroundColor: '#FFD700',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#000',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerGlass: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
