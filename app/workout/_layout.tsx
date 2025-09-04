import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarHidden: false,
        navigationBarHidden: true,
        animation: "slide_from_right",
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          statusBarHidden: false,
          gestureEnabled: false 
        }} 
      />
      <Stack.Screen 
        name="details" 
        options={{ 
          headerShown: false,
          statusBarHidden: false,
          gestureEnabled: true 
        }} 
      />
      <Stack.Screen 
        name="metrics" 
        options={{ 
          headerShown: false,
          statusBarHidden: false,
          gestureEnabled: true 
        }} 
      />
      <Stack.Screen 
        name="active" 
        options={{ 
          headerShown: false,
          statusBarHidden: false,
          gestureEnabled: true 
        }} 
      />
    </Stack>
  );
}
