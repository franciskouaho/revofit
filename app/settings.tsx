import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function SettingsPage() {
  const router = useRouter();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        { icon: 'notifications', label: 'Notifications push', subtitle: 'Recevoir des rappels et alertes', type: 'switch', value: notificationsEnabled, onValueChange: setNotificationsEnabled },
        { icon: 'volume-high', label: 'Sons', subtitle: 'Activer les effets sonores', type: 'switch', value: soundEnabled, onValueChange: setSoundEnabled },
        { icon: 'phone-portrait', label: 'Vibrations', subtitle: 'Retour haptique', type: 'switch', value: hapticEnabled, onValueChange: setHapticEnabled },
      ],
    },
    {
      title: 'Apparence',
      items: [
        { icon: 'moon', label: 'Mode sombre', subtitle: 'Thème sombre par défaut', type: 'switch', value: darkModeEnabled, onValueChange: setDarkModeEnabled },
        { icon: 'color-palette', label: 'Couleurs personnalisées', subtitle: 'Personnaliser le thème', type: 'navigate', onPress: () => console.log('Navigate to colors') },
      ],
    },
    {
      title: 'Données & Synchronisation',
      items: [
        { icon: 'cloud-upload', label: 'Synchronisation automatique', subtitle: 'Synchroniser avec le cloud', type: 'switch', value: autoSyncEnabled, onValueChange: setAutoSyncEnabled },
        { icon: 'download', label: 'Sauvegarder les données', subtitle: 'Créer une sauvegarde locale', type: 'navigate', onPress: () => console.log('Navigate to backup') },
        { icon: 'trash', label: 'Effacer les données', subtitle: 'Supprimer toutes les données', type: 'navigate', onPress: () => console.log('Navigate to clear data') },
      ],
    },
    {
      title: 'Sécurité & Confidentialité',
      items: [
        { icon: 'lock-closed', label: 'Verrouillage par code', subtitle: 'Protéger l\'accès à l\'app', type: 'navigate', onPress: () => console.log('Navigate to security') },
        { icon: 'shield-checkmark', label: 'Confidentialité', subtitle: 'Gérer vos données personnelles', type: 'navigate', onPress: () => console.log('Navigate to privacy') },
        { icon: 'finger-print', label: 'Authentification biométrique', subtitle: 'Utiliser Face ID ou Touch ID', type: 'navigate', onPress: () => console.log('Navigate to biometrics') },
      ],
    },
    {
      title: 'Support & À propos',
      items: [
        { icon: 'chatbubbles', label: 'Chat avec le Coach IA', subtitle: 'Discuter avec votre coach personnel', type: 'navigate', onPress: () => router.push('/ai-coach-chat') },
        { icon: 'help-circle', label: 'Centre d\'aide', subtitle: 'FAQ et guides d\'utilisation', type: 'navigate', onPress: () => console.log('Navigate to help') },
        { icon: 'mail', label: 'Nous contacter', subtitle: 'Support technique', type: 'navigate', onPress: () => console.log('Navigate to contact') },
        { icon: 'star', label: 'Évaluer l\'app', subtitle: 'Donner votre avis', type: 'navigate', onPress: () => console.log('Navigate to rate') },
        { icon: 'information-circle', label: 'À propos de RevoFit', subtitle: 'Version 1.0.0', type: 'navigate', onPress: () => console.log('Navigate to about') },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.settingItem}
        onPress={item.type === 'navigate' ? item.onPress : undefined}
        disabled={item.type === 'switch'}
      >
        <View style={styles.settingItemContent}>
          <View style={styles.settingIcon}>
            <Ionicons name={item.icon as any} size={22} color="#FFD700" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
          {item.type === 'switch' ? (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(255, 215, 0, 0.3)' }}
              thumbColor={item.value ? '#FFD700' : 'rgba(255, 255, 255, 0.5)'}
              ios_backgroundColor="rgba(255, 255, 255, 0.1)"
            />
          ) : (
            <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
          )}
        </View>
      </TouchableOpacity>
    );
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
        <StatusBar hidden={true} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paramètres</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Hero Section */}
          <View style={styles.profileHero}>
            <View style={styles.heroGlass}>
              <View style={styles.profileAvatar}>
                <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.avatarGradient}>
                  <Ionicons name="person" size={40} color="#0A0A0A" />
                </LinearGradient>
              </View>
              <Text style={styles.profileName}>Adam Smith</Text>
              <Text style={styles.profileEmail}>adam.smith@email.com</Text>
              <View style={styles.premiumBadge}>
                <Ionicons name="diamond" size={14} color="#FFFFFF" />
                <Text style={styles.premiumText}>Membre Premium</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionGlass}>
                <Ionicons name="shield-checkmark" size={24} color="#FFD700" />
                <Text style={styles.quickActionLabel}>Sécurité</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionGlass}>
                <Ionicons name="cloud-upload" size={24} color="#FFD700" />
                <Text style={styles.quickActionLabel}>Sauvegarde</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/ai-coach-chat')}>
              <View style={styles.quickActionGlass}>
                <Ionicons name="chatbubbles" size={24} color="#FFD700" />
                <Text style={styles.quickActionLabel}>Coach IA</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContainer}>
                {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
              </View>
            </View>
          ))}

          {/* App Info */}
          <View style={styles.appInfoSection}>
            <View style={styles.appInfoGlass}>
              <View style={styles.appInfoContent}>
                <View style={styles.appInfoIcon}>
                  <Ionicons name="fitness" size={28} color="#FFD700" />
                </View>
                <View style={styles.appInfoText}>
                  <Text style={styles.appInfoTitle}>RevoFit</Text>
                  <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
                  <Text style={styles.appInfoBuild}>Build 2024.1</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
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
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16, overflow: 'hidden',
  },
  avatarGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 20, color: '#FFFFFF', fontWeight: '700', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 16 },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12,
  },
  premiumText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600', marginLeft: 6 },
  quickActions: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, marginBottom: 30,
  },
  quickActionCard: { flex: 1, marginHorizontal: 4 },
  quickActionGlass: {
    borderRadius: 16, padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  quickActionLabel: {
    fontSize: 12, color: '#FFFFFF', fontWeight: '600', marginTop: 8, textAlign: 'center',
  },
  settingsSection: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 16, color: '#FFD700', fontWeight: '700',
    marginBottom: 16, paddingHorizontal: 20,
  },
  sectionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingItem: { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  settingItemContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20 },
  settingIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  settingText: { flex: 1 },
  settingLabel: { fontSize: 16, color: '#FFFFFF', fontWeight: '600', marginBottom: 2 },
  settingSubtitle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', fontWeight: '400' },
  appInfoSection: { paddingHorizontal: 20, marginBottom: 30 },
  appInfoGlass: {
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 24,
  },
  appInfoContent: { flexDirection: 'row', alignItems: 'center' },
  appInfoIcon: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255, 215, 0, 0.15)',
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  appInfoText: { flex: 1 },
  appInfoTitle: { fontSize: 18, color: '#FFD700', fontWeight: '800', marginBottom: 4 },
  appInfoVersion: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', fontWeight: '500', marginBottom: 2 },
  appInfoBuild: { fontSize: 10, color: 'rgba(255, 255, 255, 0.5)', fontWeight: '400' },
  bottomSpacing: { height: 20 },
});
