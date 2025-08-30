import { Tabs } from 'expo-router';
import React from 'react';

import CustomTabBar from '@/components/CustomTabBar';
import Drawer from '@/components/Drawer';
import { useDrawer } from '@/contexts/DrawerContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDrawerVisible, closeDrawer } = useDrawer();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: 'none', // Hide default tab bar
          },
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            title: 'Workouts',
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
          }}
        />
      </Tabs>
      
      {/* Drawer au niveau principal pour être au-dessus de tout */}
      <Drawer isVisible={isDrawerVisible} onClose={closeDrawer} />
    </>
  );
}
