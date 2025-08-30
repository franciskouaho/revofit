import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  return (
    // Conteneur flottant : on garde l'effet noir grâce au bg semi-opaque + blur
    <View style={styles.outer}>
      <BlurView intensity={28} tint="dark" style={styles.glassBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const getIcon = () => {
            switch (route.name) {
              case 'index':
                return 'home';
              case 'workouts':
                return 'barbell';
              case 'explore':
                return 'compass';
              case 'progress':
                return 'clipboard';
              case 'stats':
                return 'bar-chart';
              default:
                return 'home';
            }
          };

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab} activeOpacity={0.85}>
              {isFocused ? (
                <View style={styles.activeTab}>
                  <Ionicons name={getIcon() as any} size={20} color="#0A0A0A" />
                </View>
              ) : (
                <BlurView intensity={22} tint="dark" style={styles.inactiveTab}>
                  <Ionicons name={getIcon() as any} size={20} color="#FFFFFF" />
                </BlurView>
              )}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

const BORDER = 'rgba(255,255,255,0.12)';

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    width: width - 24,
  },
  glassBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(0,0,0,0.35)', // <- conserve l'effet noir
    // ombre douce
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 14,
    overflow: 'hidden',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',        // accent or/jaune
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.25)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  inactiveTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.06)', // verre sombre
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
