import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfilePage() {
  const router = useRouter();
  const { userProfile, user, refreshUserProfile } = useAuth();
  
  // États pour les modales d'édition
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fonction pour ouvrir la modale d'édition
  const openEditModal = (field: string, currentValue: any) => {
    setEditingField(field);
    setEditValue(currentValue?.toString() || '');
    setEditModalVisible(true);
  };

  // Fonction pour sauvegarder les modifications
  const saveChanges = async () => {
    if (!user || !userProfile) return;

    try {
      setIsUpdating(true);
      
      // Préparer les données à mettre à jour
      const updates: any = {};
      
      switch (editingField) {
        case 'firstName':
        case 'lastName':
        case 'email':
          updates[editingField] = editValue;
          break;
        case 'age':
          updates.age = parseInt(editValue);
          break;
        case 'height':
        case 'weight':
        case 'weeklyWorkouts':
          updates[editingField] = parseFloat(editValue);
          break;
        case 'gender':
          updates.gender = editValue;
          break;
        case 'activityLevel':
          updates.activityLevel = editValue;
          break;
      }

      await updateUserProfile(user.uid, updates);
      await refreshUserProfile();
      
      setEditModalVisible(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  // Fonction pour fermer la modale
  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingField('');
    setEditValue('');
  };

  return (
    <View style={styles.container}>
      {/* Fond avec gradient */}
      <LinearGradient
        colors={['#2a2a00', '#0A0A0A', '#000000', '#0A0A0A', '#2a2a00']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Hero Section */}
          <View style={styles.profileHero}>
            <View style={styles.heroGlass}>
              <View style={styles.profileAvatar}>
                <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.avatarGradient}>
                  <Ionicons name="person" size={50} color="#0A0A0A" />
                </LinearGradient>
                <View style={styles.onlineIndicator} />
              </View>
              <Text style={styles.profileName}>
                {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Utilisateur"}
              </Text>
              <Text style={styles.profileEmail}>
                {userProfile?.email || "email@example.com"}
              </Text>
              <View style={styles.premiumBadge}>
                <Ionicons name="diamond" size={16} color="#FFFFFF" />
                <Text style={styles.premiumText}>Membre Premium</Text>
              </View>
            </View>
          </View>

          {/* Statistiques rapides */}
          {userProfile && (
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile.age}</Text>
                <Text style={styles.statLabel}>ans</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile.height}</Text>
                <Text style={styles.statLabel}>cm</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile.weight}</Text>
                <Text style={styles.statLabel}>kg</Text>
              </View>
            </View>
          )}

          {/* Informations détaillées utilisateur */}
          {userProfile && (
            <View style={styles.userInfo}>
              <View style={styles.userInfoCard}>
                <View style={styles.userInfoHeader}>
                  <Ionicons name="person-circle" size={20} color="#FFD700" />
                  <Text style={styles.userInfoTitle}>Profil personnel</Text>
                </View>
                <View style={styles.userInfoContent}>
                  <TouchableOpacity 
                    style={styles.userInfoRow}
                    onPress={() => openEditModal('gender', userProfile.gender)}
                  >
                    <Ionicons name="person" size={16} color="#FFD700" />
                    <Text style={styles.userInfoLabel}>Genre :</Text>
                    <Text style={styles.userInfoValue}>
                      {userProfile.gender === 'homme' ? 'Homme' : 'Femme'}
                    </Text>
                    <Ionicons name="create-outline" size={16} color="rgba(255, 215, 0, 0.6)" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.userInfoRow}
                    onPress={() => openEditModal('age', userProfile.age)}
                  >
                    <Ionicons name="calendar" size={16} color="#FFD700" />
                    <Text style={styles.userInfoLabel}>Âge :</Text>
                    <Text style={styles.userInfoValue}>{userProfile.age} ans</Text>
                    <Ionicons name="create-outline" size={16} color="rgba(255, 215, 0, 0.6)" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.userInfoRow}
                    onPress={() => openEditModal('height', userProfile.height)}
                  >
                    <Ionicons name="resize" size={16} color="#FFD700" />
                    <Text style={styles.userInfoLabel}>Taille :</Text>
                    <Text style={styles.userInfoValue}>{userProfile.height} cm</Text>
                    <Ionicons name="create-outline" size={16} color="rgba(255, 215, 0, 0.6)" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.userInfoRow}
                    onPress={() => openEditModal('weight', userProfile.weight)}
                  >
                    <Ionicons name="scale" size={16} color="#FFD700" />
                    <Text style={styles.userInfoLabel}>Poids :</Text>
                    <Text style={styles.userInfoValue}>{userProfile.weight} kg</Text>
                    <Ionicons name="create-outline" size={16} color="rgba(255, 215, 0, 0.6)" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.userInfoCard}>
                <View style={styles.userInfoHeader}>
                  <Ionicons name="fitness" size={20} color="#FFD700" />
                  <Text style={styles.userInfoTitle}>Activité physique</Text>
                </View>
                <View style={styles.userInfoContent}>
                  <TouchableOpacity 
                    style={styles.userInfoRow}
                    onPress={() => openEditModal('weeklyWorkouts', userProfile.weeklyWorkouts)}
                  >
                    <Ionicons name="calendar-outline" size={16} color="#FFD700" />
                    <Text style={styles.userInfoLabel}>Fréquence :</Text>
                    <Text style={styles.userInfoValue}>
                      {userProfile.weeklyWorkouts} entraînements/semaine
                    </Text>
                    <Ionicons name="create-outline" size={16} color="rgba(255, 215, 0, 0.6)" />
                  </TouchableOpacity>
                  {userProfile.activityLevel && (
                    <TouchableOpacity 
                      style={styles.userInfoRow}
                      onPress={() => openEditModal('activityLevel', userProfile.activityLevel)}
                    >
                      <Ionicons name="trending-up" size={16} color="#FFD700" />
                      <Text style={styles.userInfoLabel}>Niveau :</Text>
                      <Text style={styles.userInfoValue}>
                        {userProfile.activityLevel === 'sedentary' ? 'Sédentaire' :
                         userProfile.activityLevel === 'light' ? 'Léger' :
                         userProfile.activityLevel === 'moderate' ? 'Modéré' :
                         userProfile.activityLevel === 'active' ? 'Actif' : 'Très actif'}
                      </Text>
                      <Ionicons name="create-outline" size={16} color="rgba(255, 215, 0, 0.6)" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Calculs automatiques */}
              {userProfile && (
                <View style={styles.userInfoCard}>
                  <View style={styles.userInfoHeader}>
                    <Ionicons name="calculator" size={20} color="#FFD700" />
                    <Text style={styles.userInfoTitle}>Calculs automatiques</Text>
                  </View>
                  <View style={styles.userInfoContent}>
                    <View style={styles.userInfoRow}>
                      <Ionicons name="speedometer" size={16} color="#FFD700" />
                      <Text style={styles.userInfoLabel}>IMC :</Text>
                      <Text style={styles.userInfoValue}>
                        {userProfile.height && userProfile.weight 
                          ? (userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1)
                          : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.userInfoRow}>
                      <Ionicons name="flame" size={16} color="#FFD700" />
                      <Text style={styles.userInfoLabel}>Métabolisme :</Text>
                      <Text style={styles.userInfoValue}>
                        {userProfile.height && userProfile.weight && userProfile.age
                          ? Math.round(88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age))
                          : 'N/A'} kcal/jour
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Objectifs utilisateur */}
              {userProfile && userProfile.goals && userProfile.goals.length > 0 && (
                <View style={styles.userInfoCard}>
                  <View style={styles.userInfoHeader}>
                    <Ionicons name="flag" size={20} color="#FFD700" />
                    <Text style={styles.userInfoTitle}>Mes Objectifs</Text>
                  </View>
                  <View style={styles.userInfoContent}>
                    <View style={styles.goalsContainer}>
                      {userProfile.goals.map((goal, index) => (
                        <View key={index} style={styles.goalChip}>
                          <Ionicons name="checkmark-circle" size={16} color="#FFD700" />
                          <Text style={styles.goalText}>{goal}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>

      {/* Modale d'édition */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Modifier {editingField === 'firstName' ? 'Prénom' :
                         editingField === 'lastName' ? 'Nom' :
                         editingField === 'email' ? 'Email' :
                         editingField === 'age' ? 'Âge' :
                         editingField === 'height' ? 'Taille' :
                         editingField === 'weight' ? 'Poids' :
                         editingField === 'weeklyWorkouts' ? 'Fréquence d\'entraînement' :
                         editingField === 'gender' ? 'Genre' :
                         editingField === 'activityLevel' ? 'Niveau d\'activité' : 'Information'}
              </Text>
            </View>

            <View style={styles.modalContent}>
              {editingField === 'gender' ? (
                <View style={styles.genderSelector}>
                  <TouchableOpacity
                    style={[styles.genderOption, editValue === 'homme' && styles.genderOptionSelected]}
                    onPress={() => setEditValue('homme')}
                  >
                    <Text style={[styles.genderText, editValue === 'homme' && styles.genderTextSelected]}>Homme</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.genderOption, editValue === 'femme' && styles.genderOptionSelected]}
                    onPress={() => setEditValue('femme')}
                  >
                    <Text style={[styles.genderText, editValue === 'femme' && styles.genderTextSelected]}>Femme</Text>
                  </TouchableOpacity>
                </View>
              ) : editingField === 'activityLevel' ? (
                <View style={styles.activitySelector}>
                  {[
                    { value: 'sedentary', label: 'Sédentaire' },
                    { value: 'light', label: 'Léger' },
                    { value: 'moderate', label: 'Modéré' },
                    { value: 'active', label: 'Actif' },
                    { value: 'very_active', label: 'Très actif' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.activityOption, editValue === option.value && styles.activityOptionSelected]}
                      onPress={() => setEditValue(option.value)}
                    >
                      <Text style={[styles.activityText, editValue === option.value && styles.activityTextSelected]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextInput
                  style={styles.editInput}
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder={`Entrez ${editingField === 'firstName' ? 'votre prénom' :
                                        editingField === 'lastName' ? 'votre nom' :
                                        editingField === 'email' ? 'votre email' :
                                        editingField === 'age' ? 'votre âge' :
                                        editingField === 'height' ? 'votre taille (cm)' :
                                        editingField === 'weight' ? 'votre poids (kg)' :
                                        editingField === 'weeklyWorkouts' ? 'le nombre d\'entraînements par semaine' : 'la valeur'}`}
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType={editingField === 'age' || editingField === 'height' || editingField === 'weight' || editingField === 'weeklyWorkouts' ? 'numeric' : 'default'}
                />
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={closeEditModal}
                disabled={isUpdating}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalSaveButton, isUpdating && styles.modalSaveButtonDisabled]}
                onPress={saveChanges}
                disabled={isUpdating}
              >
                <Text style={styles.modalSaveText}>
                  {isUpdating ? 'Sauvegarde...' : 'Sauvegarder'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, color: '#FFFFFF', fontWeight: '700' },
  headerSpacer: { width: 40 },
  scrollView: { flex: 1 },
  profileHero: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 30 },
  heroGlass: {
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 24, alignItems: 'center',
  },
  profileAvatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16, overflow: 'hidden',
  },
  avatarGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 24, color: '#FFFFFF', fontWeight: '700', marginBottom: 4 },
  profileEmail: { fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 16 },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12, paddingVertical: 8, paddingHorizontal: 16,
  },
  premiumText: { fontSize: 14, color: '#FFFFFF', fontWeight: '600', marginLeft: 8 },
  // Indicateur en ligne
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00FF00',
    borderWidth: 3,
    borderColor: '#0A0A0A',
  },
  // Statistiques rapides
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    marginHorizontal: 20,
  },
  // Informations utilisateur
  userInfo: { 
    paddingHorizontal: 20,
    gap: 16,
  },
  userInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
    gap: 10,
  },
  userInfoTitle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  userInfoContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  userInfoLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    minWidth: 100,
  },
  userInfoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6
  },
  goalText: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: '600'
  },
  bottomSpacing: { height: 20 },
  // Styles pour la modale d'édition
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  modalContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  editInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  genderText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  genderTextSelected: {
    color: '#FFD700',
  },
  activitySelector: {
    gap: 8,
  },
  activityOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activityOptionSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  activityText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  activityTextSelected: {
    color: '#FFD700',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveButtonDisabled: {
    backgroundColor: 'rgba(255, 215, 0, 0.5)',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#0A0A0A',
    fontWeight: '700',
  },
});
