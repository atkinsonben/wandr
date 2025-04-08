import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold, SpaceGrotesk_300Light } from '@expo-google-fonts/space-grotesk';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
    SpaceGrotesk_300Light
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or failed to load)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until the font has loaded or an error was returned
   if (!fontsLoaded && !fontError) {
    return null;
  }

  // Ensure the Stack navigator itself doesn't show a header
  return (
    <Stack screenOptions={{ headerShown: false }}>
       {/* Optionally define specific stack screens here if needed outside tabs */}
       {/* The (tabs) layout will be rendered automatically */}
    </Stack>
  );
}
