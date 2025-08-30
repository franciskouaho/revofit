import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="firstname-selection" />
      <Stack.Screen name="lastname-selection" />
      <Stack.Screen name="gender-selection" />
      <Stack.Screen name="age-selection" />
      <Stack.Screen name="height-selection" />
      <Stack.Screen name="weight-selection" />
      <Stack.Screen name="goals-selection" />
      <Stack.Screen name="email-selection" />
      <Stack.Screen name="password-selection" />
      <Stack.Screen name="rocket-launch" />
    </Stack>
  );
} 