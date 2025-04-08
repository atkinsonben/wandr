import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  useEffect(() => {
    // Hide splash screen after resources are loaded
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Optionally hide header only for specific screens */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
