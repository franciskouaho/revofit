import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.85;

export default function Drawer({ isVisible, onClose }: DrawerProps) {
  const menuItems = [
    { icon: 'person', label: 'Mon Profil', isActive: true },
    { icon: 'trophy', label: 'Mes Objectifs' },
    { icon: 'calendar', label: 'Historique' },
    { icon: 'heart', label: 'Activités' },
    { icon: 'restaurant', label: 'Nutrition' },
    { icon: 'heart', label: 'Favoris' },
  ];

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Overlay avec animation */}
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)']}
          style={styles.overlayGradient}
        />
      </TouchableOpacity>

      {/* Drawer */}
      <View style={styles.drawer}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
          locations={[0, 0.3, 1]}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Header du drawer */}
        <View style={styles.drawerHeader}>
          <BlurView intensity={25} tint="dark" style={styles.headerGlass}>
            <View style={styles.profileSection}>
              <View style={styles.profileAvatar}>
                <LinearGradient
                  colors={['#FFD700', '#FFA000']}
                  style={styles.avatarGradient}
                >
                  <Ionicons name="person" size={28} color="#0A0A0A" />
                </LinearGradient>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Adam Smith</Text>
                <View style={styles.premiumBadge}>
                  <Ionicons name="diamond" size={12} color="#FFFFFF" />
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Menu items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.menuItem, item.isActive && styles.activeMenuItem]}
              onPress={() => {
                if (item.label === 'Déconnexion') {
                  onClose();
                  // Logique de déconnexion
                } else {
                  onClose();
                  // Navigation vers la page correspondante
                }
              }}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.menuIcon, item.isActive && styles.activeMenuIcon]}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={22} 
                    color={item.isActive ? '#0A0A0A' : '#0A0A0A'} 
                  />
                </View>
                <Text style={[styles.menuLabel, item.isActive && styles.activeMenuLabel]}>
                  {item.label}
                </Text>
                {item.isActive && (
                  <View style={styles.activeIndicator}>
                    <Ionicons name="chevron-forward" size={16} color="#0A0A0A" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Branding Section */}
        <View style={styles.brandingSection}>
          <BlurView intensity={20} tint="dark" style={styles.brandingGlass}>
            <View style={styles.brandingContent}>
              <View style={styles.brandingIcon}>
                <Ionicons name="fitness" size={24} color="#FFD700" />
              </View>
              <View style={styles.brandingText}>
                <Text style={styles.brandingTitle}>RevoFit</Text>
                <Text style={styles.brandingVersion}>v1.0.0</Text>
              </View>
            </View>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999999,
    elevation: 99999999,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999999,
    elevation: 99999999,
  },
  overlayGradient: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    zIndex: 99999999,
    elevation: 99999999,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
  },
  drawerHeader: {
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  headerGlass: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
    overflow: 'hidden',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 18,
    overflow: 'hidden',
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 6,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  premiumText: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '700',
    marginLeft: 4,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  menuItem: {
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activeMenuItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeMenuIcon: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  menuLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  activeMenuLabel: {
    color: '#0A0A0A',
    fontWeight: '700',
  },
  activeIndicator: {
    marginLeft: 8,
  },
  brandingSection: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  brandingGlass: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    alignItems: 'center',
  },
  brandingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandingText: {
    flex: 1,
  },
  brandingTitle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '800',
    marginBottom: 4,
  },
  brandingVersion: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
}); 