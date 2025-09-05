import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { NotificationIcon } from './NotificationIcon';

const GLASS_BORDER = 'rgba(255,255,255,0.12)';

interface HeaderProps {
  greeting?: string;
  userName?: string;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export default function Header({ 
  greeting = "Good Morning", 
  userName,
  onNotificationPress,
  onProfilePress
}: HeaderProps) {
  const { userProfile } = useAuth();
  
  // Utiliser le nom passé en prop ou celui du profil utilisateur
  const displayName = userName || (userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Utilisateur");
  return (
    <View style={styles.header}>
      {/* Left side - Greeting only */}
      <View style={styles.headerLeft}>
        <View style={styles.greetingContainer}>
          <ThemedText style={styles.greeting}>{greeting}</ThemedText>
          <ThemedText style={styles.userName}>{displayName}</ThemedText>
        </View>
      </View>

      {/* Right side - Notifications + Profile (opens settings) */}
      <View style={styles.headerRight}>
        <BlurView intensity={28} tint="dark" style={styles.iconGlass}>
          <NotificationIcon 
            onPress={onNotificationPress}
            size={22}
            color="#FFFFFF"
          />
        </BlurView>
        
        <BlurView intensity={28} tint="dark" style={styles.iconGlass}>
          <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
            <Ionicons name="person" size={22} color="#FFD700" />
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  userName: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconGlass: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  notificationButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#FF9800',
    borderRadius: 4,
  },
});
