import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface HeaderProps {
  greeting?: string;
  userName?: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export default function Header({ 
  greeting = "Good Morning", 
  userName = "Adam Smith",
  onMenuPress,
  onNotificationPress,
  onProfilePress
}: HeaderProps) {
  return (
    <View style={styles.header}>
      {/* Left side - Menu + Greeting */}
      <View style={styles.headerLeft}>
        <BlurView intensity={28} tint="dark" style={styles.menuButton}>
          <TouchableOpacity style={styles.menuInner} onPress={onMenuPress} activeOpacity={0.8}>
            <View style={styles.menuGrid}>
              <View style={styles.menuSquare} />
              <View style={styles.menuSquare} />
              <View style={styles.menuSquare} />
              <View style={styles.menuSquare} />
            </View>
          </TouchableOpacity>
        </BlurView>

        <View style={styles.greetingContainer}>
          <ThemedText style={styles.greeting}>{greeting}</ThemedText>
          <ThemedText style={styles.userName}>{userName}</ThemedText>
        </View>
      </View>

      {/* Right side - Notifications + Profile */}
      <View style={styles.headerRight}>
        <BlurView intensity={28} tint="dark" style={styles.iconGlass}>
          <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
            <Ionicons name="notifications" size={22} color="#FFFFFF" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </BlurView>

        <BlurView intensity={28} tint="dark" style={styles.iconGlass}>
          <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
            <Ionicons name="person" size={26} color="#FFD700" />
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}

const BORDER = 'rgba(255,255,255,0.12)';

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
  menuButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    marginRight: 14,
  },
  menuInner: {
    padding: 8,
  },
  menuGrid: {
    width: 28,
    height: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuSquare: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    margin: 1,
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
    fontWeight: '700',
    color: '#FFFFFF',
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
    borderColor: BORDER,
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
