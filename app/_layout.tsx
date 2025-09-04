import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

import { OnboardingFlowProvider } from '@/components/onboarding';
import { AuthProvider } from '@/contexts/AuthContext';
import { DrawerProvider } from '@/contexts/DrawerContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { configureGoogleSignIn } from '@/services/firebase/auth';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
  });

  // Configuration Google Sign-In
  React.useEffect(() => {
    configureGoogleSignIn();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <OnboardingFlowProvider>
            <DrawerProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  statusBarHidden: false,
                  navigationBarHidden: true,
                }}
              >
                <Stack.Screen name="splash" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="welcome" />
                <Stack.Screen name="height-input" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="profile" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="notifications" />
                <Stack.Screen name="ai-coach-chat" />
                <Stack.Screen name="workout" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </DrawerProvider>
          </OnboardingFlowProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}