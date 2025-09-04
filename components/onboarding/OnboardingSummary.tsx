// Composant de résumé de l'onboarding
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { OnboardingData } from '../../services/firebase/auth';

interface OnboardingSummaryProps {
  data: Partial<OnboardingData>;
  onEdit?: (field: string) => void;
  showEditButtons?: boolean;
}

export default function OnboardingSummary({ 
  data, 
  onEdit, 
  showEditButtons = false 
}: OnboardingSummaryProps) {
  const getGenderText = (gender?: string) => {
    switch (gender) {
      case 'homme': return 'Homme';
      case 'femme': return 'Femme';
      case 'autre': return 'Autre';
      default: return 'Non spécifié';
    }
  };

  const getExperienceText = (level?: string) => {
    switch (level) {
      case 'débutant': return 'Débutant';
      case 'intermédiaire': return 'Intermédiaire';
      case 'avancé': return 'Avancé';
      default: return 'Non spécifié';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Résumé de votre profil</Text>
      
      {/* Informations personnelles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        
        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="person" size={20} color="#FFD700" />
            <Text style={styles.fieldLabel}>Nom complet</Text>
            {showEditButtons && onEdit && (
              <TouchableOpacity onPress={() => onEdit('name')}>
                <Ionicons name="pencil" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.fieldValue}>
            {data.firstName} {data.lastName}
          </Text>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="mail" size={20} color="#FFD700" />
            <Text style={styles.fieldLabel}>Email</Text>
            {showEditButtons && onEdit && (
              <TouchableOpacity onPress={() => onEdit('email')}>
                <Ionicons name="pencil" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.fieldValue}>{data.email}</Text>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="person-outline" size={20} color="#FFD700" />
            <Text style={styles.fieldLabel}>Genre</Text>
            {showEditButtons && onEdit && (
              <TouchableOpacity onPress={() => onEdit('gender')}>
                <Ionicons name="pencil" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.fieldValue}>{getGenderText(data.gender)}</Text>
        </View>
      </View>

      {/* Informations physiques */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations physiques</Text>
        
        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="calendar" size={20} color="#FFD700" />
            <Text style={styles.fieldLabel}>Âge</Text>
            {showEditButtons && onEdit && (
              <TouchableOpacity onPress={() => onEdit('age')}>
                <Ionicons name="pencil" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.fieldValue}>{data.age} ans</Text>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="resize" size={20} color="#FFD700" />
            <Text style={styles.fieldLabel}>Taille</Text>
            {showEditButtons && onEdit && (
              <TouchableOpacity onPress={() => onEdit('height')}>
                <Ionicons name="pencil" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.fieldValue}>{data.height} cm</Text>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="scale" size={20} color="#FFD700" />
            <Text style={styles.fieldLabel}>Poids</Text>
            {showEditButtons && onEdit && (
              <TouchableOpacity onPress={() => onEdit('weight')}>
                <Ionicons name="pencil" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.fieldValue}>{data.weight} kg</Text>
        </View>
      </View>

      {/* Objectifs et préférences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Objectifs et préférences</Text>
        
        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="fitness" size={20} color="#FFD700" />
            <Text style={styles.fieldLabel}>Niveau d'expérience</Text>
            {showEditButtons && onEdit && (
              <TouchableOpacity onPress={() => onEdit('experience')}>
                <Ionicons name="pencil" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.fieldValue}>{getExperienceText(data.experienceLevel)}</Text>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="calendar-outline" size={20} color="#FFD700" />
            <Text style={styles.fieldLabel}>Entraînements par semaine</Text>
            {showEditButtons && onEdit && (
              <TouchableOpacity onPress={() => onEdit('workouts')}>
                <Ionicons name="pencil" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.fieldValue}>{data.weeklyWorkouts} séances</Text>
        </View>

        {data.goals && data.goals.length > 0 && (
          <View style={styles.field}>
            <View style={styles.fieldHeader}>
              <Ionicons name="flag" size={20} color="#FFD700" />
              <Text style={styles.fieldLabel}>Objectifs</Text>
              {showEditButtons && onEdit && (
                <TouchableOpacity onPress={() => onEdit('goals')}>
                  <Ionicons name="pencil" size={16} color="#B0B0B0" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.goalsList}>
              {data.goals.map((goal, index) => (
                <View key={index} style={styles.goalTag}>
                  <Text style={styles.goalText}>{goal}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#B0B0B0',
    marginLeft: 8,
    flex: 1,
  },
  fieldValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  goalsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalTag: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  goalText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
});
