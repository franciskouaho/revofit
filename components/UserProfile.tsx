// Composant d'affichage du profil utilisateur
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  showDetails?: boolean;
  style?: any;
}

export default function UserProfile({ showDetails = false, style }: UserProfileProps) {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color="#FFD700" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>
            {userProfile.firstName} {userProfile.lastName}
          </Text>
          <Text style={styles.email}>{userProfile.email}</Text>
        </View>
      </View>

      {showDetails && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={16} color="#B0B0B0" />
            <Text style={styles.detailText}>{userProfile.gender}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#B0B0B0" />
            <Text style={styles.detailText}>{userProfile.age} ans</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="resize-outline" size={16} color="#B0B0B0" />
            <Text style={styles.detailText}>{userProfile.height} cm</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="scale-outline" size={16} color="#B0B0B0" />
            <Text style={styles.detailText}>{userProfile.weight} kg</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="fitness-outline" size={16} color="#B0B0B0" />
            <Text style={styles.detailText}>{userProfile.experienceLevel}</Text>
          </View>
        </View>
      )}

      {showDetails && userProfile.goals && userProfile.goals.length > 0 && (
        <View style={styles.goals}>
          <Text style={styles.goalsTitle}>Objectifs :</Text>
          <View style={styles.goalsList}>
            {userProfile.goals.map((goal, index) => (
              <View key={index} style={styles.goalTag}>
                <Text style={styles.goalText}>{goal}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 8,
  },
  goals: {
    marginTop: 8,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
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
